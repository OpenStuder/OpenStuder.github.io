(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.CBOR = {}));
}(this, (function (exports) { 'use strict';

	let decoder;
	try {
		decoder = new TextDecoder();
	} catch(error) {}
	let src;
	let srcEnd;
	let position = 0;
	const LEGACY_RECORD_INLINE_ID = 105;
	const RECORD_DEFINITIONS_ID = 0xdffe;
	const RECORD_INLINE_ID = 0xdfff; // temporary first-come first-serve tag // proposed tag: 0x7265 // 're'
	const BUNDLED_STRINGS_ID = 0xdff9;
	const PACKED_REFERENCE_TAG_ID = 6;
	const STOP_CODE = {};
	let currentDecoder = {};
	let currentStructures;
	let srcString;
	let srcStringStart = 0;
	let srcStringEnd = 0;
	let bundledStrings;
	let referenceMap;
	let currentExtensions = [];
	let currentExtensionRanges = [];
	let packedValues;
	let dataView;
	let restoreMapsAsObject;
	let defaultOptions = {
		useRecords: false,
		mapsAsObjects: true
	};
	let sequentialMode = false;

	class Decoder {
		constructor(options) {
			if (options) {
				if ((options.keyMap || options._keyMap) && !options.useRecords) {
					options.useRecords = false;
					options.mapsAsObjects = true;
				}
				if (options.useRecords === false && options.mapsAsObjects === undefined)
					options.mapsAsObjects = true;
				if (options.getStructures)
					options.getShared = options.getStructures;
				if (options.getShared && !options.structures)
					(options.structures = []).uninitialized = true; // this is what we use to denote an uninitialized structures
				if (options.keyMap) {
					this.mapKey = new Map();
					for (let [k,v] of Object.entries(options.keyMap)) this.mapKey.set(v,k);
				}
			}
			Object.assign(this, options);
		}
		/*
		decodeKey(key) {
			return this.keyMap
				? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
				: key
		}
		*/
		decodeKey(key) {
			return this.keyMap ? this.mapKey.get(key) || key : key
		}
		
		encodeKey(key) {
			return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key
		}

		encodeKeys(rec) {
			if (!this._keyMap) return rec
			let map = new Map();
			for (let [k,v] of Object.entries(rec)) map.set((this._keyMap.hasOwnProperty(k) ? this._keyMap[k] : k), v);
			return map
		}

		decodeKeys(map) {
			if (!this._keyMap || map.constructor.name != 'Map') return map
			if (!this._mapKey) {
				this._mapKey = new Map();
				for (let [k,v] of Object.entries(this._keyMap)) this._mapKey.set(v,k);
			}
			let res = {};
			//map.forEach((v,k) => res[Object.keys(this._keyMap)[Object.values(this._keyMap).indexOf(k)] || k] = v)
			map.forEach((v,k) => res[this._mapKey.has(k) ? this._mapKey.get(k) : k] =  v);
			return res
		}
		
		mapDecode(source, end) {
		
			let res = this.decode(source);
			if (this._keyMap) { 
				//Experiemntal support for Optimised KeyMap  decoding 
				switch (res.constructor.name) {
					case 'Array': return res.map(r => this.decodeKeys(r))
					//case 'Map': return this.decodeKeys(res)
				}
			}
			return res
		}

		decode(source, end) {
			if (src) {
				// re-entrant execution, save the state and restore it after we do this decode
				return saveState(() => {
					clearSource();
					return this ? this.decode(source, end) : Decoder.prototype.decode.call(defaultOptions, source, end)
				})
			}
			srcEnd = end > -1 ? end : source.length;
			position = 0;
			srcStringEnd = 0;
			srcString = null;
			bundledStrings = null;
			src = source;
			// this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
			// technique for getting data from a database where it can be copied into an existing buffer instead of creating
			// new ones
			try {
				dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
			} catch(error) {
				// if it doesn't have a buffer, maybe it is the wrong type of object
				src = null;
				if (source instanceof Uint8Array)
					throw error
				throw new Error('Source must be a Uint8Array or Buffer but was a ' + ((source && typeof source == 'object') ? source.constructor.name : typeof source))
			}
			if (this instanceof Decoder) {
				currentDecoder = this;
				packedValues = this.sharedValues &&
					(this.pack ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues) :
					this.sharedValues);
				if (this.structures) {
					currentStructures = this.structures;
					return checkedRead()
				} else if (!currentStructures || currentStructures.length > 0) {
					currentStructures = [];
				}
			} else {
				currentDecoder = defaultOptions;
				if (!currentStructures || currentStructures.length > 0)
					currentStructures = [];
				packedValues = null;
			}
			return checkedRead()
		}
		decodeMultiple(source, forEach) {
			let values, lastPosition = 0;
			try {
				let size = source.length;
				sequentialMode = true;
				let value = this ? this.decode(source, size) : defaultDecoder.decode(source, size);
				if (forEach) {
					if (forEach(value) === false) {
						return
					}
					while(position < size) {
						lastPosition = position;
						if (forEach(checkedRead()) === false) {
							return
						}
					}
				}
				else {
					values = [ value ];
					while(position < size) {
						lastPosition = position;
						values.push(checkedRead());
					}
					return values
				}
			} catch(error) {
				error.lastPosition = lastPosition;
				error.values = values;
				throw error
			} finally {
				sequentialMode = false;
				clearSource();
			}
		}
	}
	function checkedRead() {
		try {
			let result = read();
			if (bundledStrings) // bundled strings to skip past
				position = bundledStrings.postBundlePosition;

			if (position == srcEnd) {
				// finished reading this source, cleanup references
				currentStructures = null;
				src = null;
				if (referenceMap)
					referenceMap = null;
			} else if (position > srcEnd) {
				// over read
				let error = new Error('Unexpected end of CBOR data');
				error.incomplete = true;
				throw error
			} else if (!sequentialMode) {
				throw new Error('Data read, but end of buffer not reached')
			}
			// else more to read, but we are reading sequentially, so don't clear source yet
			return result
		} catch(error) {
			clearSource();
			if (error instanceof RangeError || error.message.startsWith('Unexpected end of buffer')) {
				error.incomplete = true;
			}
			throw error
		}
	}

	function read() {
		let token = src[position++];
		let majorType = token >> 5;
		token = token & 0x1f;
		if (token > 0x17) {
			switch (token) {
				case 0x18:
					token = src[position++];
					break
				case 0x19:
					if (majorType == 7) {
						return getFloat16()
					}
					token = dataView.getUint16(position);
					position += 2;
					break
				case 0x1a:
					if (majorType == 7) {
						let value = dataView.getFloat32(position);
						if (currentDecoder.useFloat32 > 2) {
							// this does rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
							let multiplier = mult10[((src[position] & 0x7f) << 1) | (src[position + 1] >> 7)];
							position += 4;
							return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier
						}
						position += 4;
						return value
					}
					token = dataView.getUint32(position);
					position += 4;
					break
				case 0x1b:
					if (majorType == 7) {
						let value = dataView.getFloat64(position);
						position += 8;
						return value
					}
					if (majorType > 1) {
						if (dataView.getUint32(position) > 0)
							throw new Error('JavaScript does not support arrays, maps, or strings with length over 4294967295')
						token = dataView.getUint32(position + 4);
					} else if (currentDecoder.int64AsNumber) {
						token = dataView.getUint32(position) * 0x100000000;
						token += dataView.getUint32(position + 4);
					} else
						token = dataView.getBigUint64(position);
					position += 8;
					break
				case 0x1f: 
					// indefinite length
					switch(majorType) {
						case 2: // byte string
						case 3: // text string
							throw new Error('Indefinite length not supported for byte or text strings')
						case 4: // array
							let array = [];
							let value, i = 0;
							while ((value = read()) != STOP_CODE) {
								array[i++] = value;
							}
							return majorType == 4 ? array : majorType == 3 ? array.join('') : Buffer.concat(array)
						case 5: // map
							let key;
							if (currentDecoder.mapsAsObjects) {
								let object = {};
								if (currentDecoder.keyMap) while((key = read()) != STOP_CODE) object[currentDecoder.decodeKey(key)] = read();
								else while ((key = read()) != STOP_CODE) object[key] = read();
								return object
							} else {
								if (restoreMapsAsObject) {
									currentDecoder.mapsAsObjects = true;
									restoreMapsAsObject = false;
								}
								let map = new Map();
								if (currentDecoder.keyMap) while((key = read()) != STOP_CODE) map.set(currentDecoder.decodeKey(key), read());
								else while ((key = read()) != STOP_CODE) map.set(key, read());
								return map
							}
						case 7:
							return STOP_CODE
						default:
							throw new Error('Invalid major type for indefinite length ' + majorType)
					}
				default:
					throw new Error('Unknown token ' + token)
			}
		}
		switch (majorType) {
			case 0: // positive int
				return token
			case 1: // negative int
				return ~token
			case 2: // buffer
				return readBin(token)
			case 3: // string
				if (srcStringEnd >= position) {
					return srcString.slice(position - srcStringStart, (position += token) - srcStringStart)
				}
				if (srcStringEnd == 0 && srcEnd < 140 && token < 32) {
					// for small blocks, avoiding the overhead of the extract call is helpful
					let string = token < 16 ? shortStringInJS(token) : longStringInJS(token);
					if (string != null)
						return string
				}
				return readFixedString(token)
			case 4: // array
				let array = new Array(token);
			  //if (currentDecoder.keyMap) for (let i = 0; i < token; i++) array[i] = currentDecoder.decodeKey(read())	
				//else 
				for (let i = 0; i < token; i++) array[i] = read();
				return array
			case 5: // map
				if (currentDecoder.mapsAsObjects) {
					let object = {};
					if (currentDecoder.keyMap) for (let i = 0; i < token; i++) object[currentDecoder.decodeKey(read())] = read();
					else for (let i = 0; i < token; i++) object[read()] = read();
					return object
				} else {
					if (restoreMapsAsObject) {
						currentDecoder.mapsAsObjects = true;
						restoreMapsAsObject = false;
					}
					let map = new Map();
					if (currentDecoder.keyMap) for (let i = 0; i < token; i++) map.set(currentDecoder.decodeKey(read()),read());
					else for (let i = 0; i < token; i++) map.set(read(), read());
					return map
				}
			case 6: // extension
				if (token >= BUNDLED_STRINGS_ID) {
					let structure = currentStructures[token & 0x1fff]; // check record structures first
					// At some point we may provide an option for dynamic tag assignment with a range like token >= 8 && (token < 16 || (token > 0x80 && token < 0xc0) || (token > 0x130 && token < 0x4000))
					if (structure) {
						if (!structure.read) structure.read = createStructureReader(structure);
						return structure.read()
					}
					if (token < 0x10000) {
						if (token == RECORD_INLINE_ID) // we do a special check for this so that we can keep the currentExtensions as densely stored array (v8 stores arrays densely under about 3000 elements)
							return recordDefinition(read())
						else if (token == RECORD_DEFINITIONS_ID) {
							let length = readJustLength();
							let id = read();
							for (let i = 2; i < length; i++) {
								recordDefinition([id++, read()]);
							}
							return read()
						} else if (token == BUNDLED_STRINGS_ID) {
							return readBundleExt()
						}
						if (currentDecoder.getShared) {
							loadShared();
							structure = currentStructures[token & 0x1fff];
							if (structure) {
								if (!structure.read)
									structure.read = createStructureReader(structure);
								return structure.read()
							}
						}
					}
				}
				let extension = currentExtensions[token];
				if (extension) {
					if (extension.handlesRead)
						return extension(read)
					else
						return extension(read())
				} else {
					let input = read();
					for (let i = 0; i < currentExtensionRanges.length; i++) {
						let value = currentExtensionRanges[i](token, input);
						if (value !== undefined)
							return value
					}
					return new Tag(input, token)
				}
			case 7: // fixed value
				switch (token) {
					case 0x14: return false
					case 0x15: return true
					case 0x16: return null
					case 0x17: return; // undefined
					case 0x1f:
					default:
						let packedValue = (packedValues || getPackedValues())[token];
						if (packedValue !== undefined)
							return packedValue
						throw new Error('Unknown token ' + token)
				}
			default: // negative int
				if (isNaN(token)) {
					let error = new Error('Unexpected end of CBOR data');
					error.incomplete = true;
					throw error
				}
				throw new Error('Unknown CBOR token ' + token)
		}
	}
	const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
	function createStructureReader(structure) {
		function readObject() {
			// get the array size from the header
			let length = src[position++];
			//let majorType = token >> 5
			length = length & 0x1f;
			if (length > 0x17) {
				switch (length) {
					case 0x18:
						length = src[position++];
						break
					case 0x19:
						length = dataView.getUint16(position);
						position += 2;
						break
					case 0x1a:
						length = dataView.getUint32(position);
						position += 4;
						break
					default:
						throw new Error('Expected array header, but got ' + src[position - 1])
				}
			}
			// This initial function is quick to instantiate, but runs slower. After several iterations pay the cost to build the faster function
			let compiledReader = this.compiledReader; // first look to see if we have the fast compiled function
			while(compiledReader) {
				// we have a fast compiled object literal reader
				if (compiledReader.propertyCount === length)
					return compiledReader(read) // with the right length, so we use it
				compiledReader = compiledReader.next; // see if there is another reader with the right length
			}
			if (this.slowReads++ >= 3) { // create a fast compiled reader
				let array = this.length == length ? this : this.slice(0, length);
				compiledReader = currentDecoder.keyMap 
				? new Function('r', 'return {' + array.map(k => currentDecoder.decodeKey(k)).map(k => validName.test(k) ? k + ':r()' : ('[' + JSON.stringify(k) + ']:r()')).join(',') + '}')
				: new Function('r', 'return {' + array.map(key => validName.test(key) ? key + ':r()' : ('[' + JSON.stringify(key) + ']:r()')).join(',') + '}');
				if (this.compiledReader)
					compiledReader.next = this.compiledReader; // if there is an existing one, we store multiple readers as a linked list because it is usually pretty rare to have multiple readers (of different length) for the same structure
				compiledReader.propertyCount = length;
				this.compiledReader = compiledReader;
				return compiledReader(read)
			}
			let object = {};
			if (currentDecoder.keyMap) for (let i = 0; i < length; i++) object[currentDecoder.decodeKey(this[i])] = read();
			else for (let i = 0; i < length; i++) object[this[i]] = read();
			return object
		}
		structure.slowReads = 0;
		return readObject
	}

	let readFixedString = readStringJS;

	let isNativeAccelerationEnabled = false;
	function readStringJS(length) {
		let result;
		if (length < 16) {
			if (result = shortStringInJS(length))
				return result
		}
		if (length > 64 && decoder)
			return decoder.decode(src.subarray(position, position += length))
		const end = position + length;
		const units = [];
		result = '';
		while (position < end) {
			const byte1 = src[position++];
			if ((byte1 & 0x80) === 0) {
				// 1 byte
				units.push(byte1);
			} else if ((byte1 & 0xe0) === 0xc0) {
				// 2 bytes
				const byte2 = src[position++] & 0x3f;
				units.push(((byte1 & 0x1f) << 6) | byte2);
			} else if ((byte1 & 0xf0) === 0xe0) {
				// 3 bytes
				const byte2 = src[position++] & 0x3f;
				const byte3 = src[position++] & 0x3f;
				units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
			} else if ((byte1 & 0xf8) === 0xf0) {
				// 4 bytes
				const byte2 = src[position++] & 0x3f;
				const byte3 = src[position++] & 0x3f;
				const byte4 = src[position++] & 0x3f;
				let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
				if (unit > 0xffff) {
					unit -= 0x10000;
					units.push(((unit >>> 10) & 0x3ff) | 0xd800);
					unit = 0xdc00 | (unit & 0x3ff);
				}
				units.push(unit);
			} else {
				units.push(byte1);
			}

			if (units.length >= 0x1000) {
				result += fromCharCode.apply(String, units);
				units.length = 0;
			}
		}

		if (units.length > 0) {
			result += fromCharCode.apply(String, units);
		}

		return result
	}
	let fromCharCode = String.fromCharCode;
	function longStringInJS(length) {
		let start = position;
		let bytes = new Array(length);
		for (let i = 0; i < length; i++) {
			const byte = src[position++];
			if ((byte & 0x80) > 0) {
				position = start;
	    			return
	    		}
	    		bytes[i] = byte;
	    	}
	    	return fromCharCode.apply(String, bytes)
	}
	function shortStringInJS(length) {
		if (length < 4) {
			if (length < 2) {
				if (length === 0)
					return ''
				else {
					let a = src[position++];
					if ((a & 0x80) > 1) {
						position -= 1;
						return
					}
					return fromCharCode(a)
				}
			} else {
				let a = src[position++];
				let b = src[position++];
				if ((a & 0x80) > 0 || (b & 0x80) > 0) {
					position -= 2;
					return
				}
				if (length < 3)
					return fromCharCode(a, b)
				let c = src[position++];
				if ((c & 0x80) > 0) {
					position -= 3;
					return
				}
				return fromCharCode(a, b, c)
			}
		} else {
			let a = src[position++];
			let b = src[position++];
			let c = src[position++];
			let d = src[position++];
			if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
				position -= 4;
				return
			}
			if (length < 6) {
				if (length === 4)
					return fromCharCode(a, b, c, d)
				else {
					let e = src[position++];
					if ((e & 0x80) > 0) {
						position -= 5;
						return
					}
					return fromCharCode(a, b, c, d, e)
				}
			} else if (length < 8) {
				let e = src[position++];
				let f = src[position++];
				if ((e & 0x80) > 0 || (f & 0x80) > 0) {
					position -= 6;
					return
				}
				if (length < 7)
					return fromCharCode(a, b, c, d, e, f)
				let g = src[position++];
				if ((g & 0x80) > 0) {
					position -= 7;
					return
				}
				return fromCharCode(a, b, c, d, e, f, g)
			} else {
				let e = src[position++];
				let f = src[position++];
				let g = src[position++];
				let h = src[position++];
				if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
					position -= 8;
					return
				}
				if (length < 10) {
					if (length === 8)
						return fromCharCode(a, b, c, d, e, f, g, h)
					else {
						let i = src[position++];
						if ((i & 0x80) > 0) {
							position -= 9;
							return
						}
						return fromCharCode(a, b, c, d, e, f, g, h, i)
					}
				} else if (length < 12) {
					let i = src[position++];
					let j = src[position++];
					if ((i & 0x80) > 0 || (j & 0x80) > 0) {
						position -= 10;
						return
					}
					if (length < 11)
						return fromCharCode(a, b, c, d, e, f, g, h, i, j)
					let k = src[position++];
					if ((k & 0x80) > 0) {
						position -= 11;
						return
					}
					return fromCharCode(a, b, c, d, e, f, g, h, i, j, k)
				} else {
					let i = src[position++];
					let j = src[position++];
					let k = src[position++];
					let l = src[position++];
					if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
						position -= 12;
						return
					}
					if (length < 14) {
						if (length === 12)
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l)
						else {
							let m = src[position++];
							if ((m & 0x80) > 0) {
								position -= 13;
								return
							}
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m)
						}
					} else {
						let m = src[position++];
						let n = src[position++];
						if ((m & 0x80) > 0 || (n & 0x80) > 0) {
							position -= 14;
							return
						}
						if (length < 15)
							return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n)
						let o = src[position++];
						if ((o & 0x80) > 0) {
							position -= 15;
							return
						}
						return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
					}
				}
			}
		}
	}

	function readBin(length) {
		return currentDecoder.copyBuffers ?
			// specifically use the copying slice (not the node one)
			Uint8Array.prototype.slice.call(src, position, position += length) :
			src.subarray(position, position += length)
	}

	function getFloat16() {
		let byte0 = src[position++];
		let byte1 = src[position++];
		let half = (byte0 << 8) + byte1;
		let exp = (half >> 10) & 0x1f;
		let mant = half & 0x3ff;
		let val;
		if (exp == 0) val = Math.exp(mant, -24);
		else if (exp != 31) val = Math.exp(mant + 1024, exp - 25);
		else val = mant == 0 ? Infinity : NaN;
		return half & 0x8000 ? -val : val
	}

	let keyCache = new Array(4096);

	class Tag {
		constructor(value, tag) {
			this.value = value;
			this.tag = tag;
		}
	}

	let glbl = typeof self == 'object' ? self : global;

	currentExtensions[0] = (dateString) => {
		// string date extension
		return new Date(dateString)
	};

	currentExtensions[1] = (epochSec) => {
		// numeric date extension
		return new Date(epochSec * 1000)
	};

	currentExtensions[2] = (buffer) => {
		// bigint extension
		let value = BigInt(0);
		for (let i = 0, l = buffer.byteLength; i < l; i++) {
			value = BigInt(buffer[i]) + value << BigInt(8);
		}
		return value
	};

	currentExtensions[3] = (buffer) => {
		// negative bigint extension
		return BigInt(-1) - currentExtensions[2](buffer)
	};
	currentExtensions[4] = (fraction) => {
		// best to reparse to maintain accuracy
		return +(fraction[1] + 'e' + fraction[0])
	};

	currentExtensions[5] = (fraction) => {
		// probably not sufficiently accurate
		return fraction[1] * Math.exp(fraction[0] * Math.log(2))
	};

	// the registration of the record definition extension
	const recordDefinition = (definition) => {
		let id = definition[0] - 0xe000;
		let structure = definition[1];
		let existingStructure = currentStructures[id];
		if (existingStructure && existingStructure.isShared) {
			(currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
		}
		currentStructures[id] = structure;

		structure.read = createStructureReader(structure);
		let object = {};
		if (currentDecoder.keyMap) for (let i = 2,l = definition.length; i < l; i++) {
				let key = currentDecoder.decodeKey(structure[i - 2]);
				object[key] = definition[i];
			}
		else for (let i = 2,l = definition.length; i < l; i++) {
				let key = structure[i - 2];
				object[key] = definition[i];
			}
		return object
	};
	currentExtensions[LEGACY_RECORD_INLINE_ID] = recordDefinition;
	currentExtensions[14] = (value) => {
		if (bundledStrings)
			return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 += value)
		return new Tag(value, 14)
	};
	currentExtensions[15] = (value) => {
		if (bundledStrings)
			return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value)
		return new Tag(value, 15)
	};

	currentExtensions[27] = (data) => { // http://cbor.schmorp.de/generic-object
		return (glbl[data[0]] || Error)(data[1], data[2])
	};
	const packedTable = (read) => {
		if (src[position++] != 0x84)
			throw new Error('Packed values structure must be followed by a 4 element array')
		let newPackedValues = read(); // packed values
		packedValues = packedValues ? newPackedValues.concat(packedValues.slice(newPackedValues.length)) : newPackedValues;
		packedValues.prefixes = read();
		packedValues.suffixes = read();
		return read() // read the rump
	};
	packedTable.handlesRead = true;
	currentExtensions[51] = packedTable;

	currentExtensions[PACKED_REFERENCE_TAG_ID] = (data) => { // packed reference
		if (!packedValues) {
			if (currentDecoder.getShared)
				loadShared();
			else
				return new Tag(data, PACKED_REFERENCE_TAG_ID)
		}
		if (typeof data == 'number')
			return packedValues[16 + (data >= 0 ? 2 * data : (-2 * data - 1))]
		throw new Error('No support for non-integer packed references yet')
	};
	currentExtensions[25] = (id) => {
		return stringRefs[id]
	};
	currentExtensions[256] = (read) => {
		stringRefs = [];
		try {
			return read()
		} finally {
			stringRefs = null;
		}
	};
	currentExtensions[256].handlesRead = true;

	currentExtensions[28] = (read) => { 
		// shareable http://cbor.schmorp.de/value-sharing (for structured clones)
		if (!referenceMap) {
			referenceMap = new Map();
			referenceMap.id = 0;
		}
		let id = referenceMap.id++;
		let token = src[position];
		let target;
		// TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
		// ahead past references to record structure definitions
		if ((token >> 5) == 4)
			target = [];
		else
			target = {};

		let refEntry = { target }; // a placeholder object
		referenceMap.set(id, refEntry);
		let targetProperties = read(); // read the next value as the target object to id
		if (refEntry.used) // there is a cycle, so we have to assign properties to original target
			return Object.assign(target, targetProperties)
		refEntry.target = targetProperties; // the placeholder wasn't used, replace with the deserialized one
		return targetProperties // no cycle, can just use the returned read object
	};
	currentExtensions[28].handlesRead = true;

	currentExtensions[29] = (id) => {
		// sharedref http://cbor.schmorp.de/value-sharing (for structured clones)
		let refEntry = referenceMap.get(id);
		refEntry.used = true;
		return refEntry.target
	};

	currentExtensions[258] = (array) => new Set(array); // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
	(currentExtensions[259] = (read) => {
		// https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec
		// for decoding as a standard Map
		if (currentDecoder.mapsAsObjects) {
			currentDecoder.mapsAsObjects = false;
			restoreMapsAsObject = true;
		}
		return read()
	}).handlesRead = true;
	function combine(a, b) {
		if (typeof a === 'string')
			return a + b
		if (a instanceof Array)
			return a.concat(b)
		return Object.assign({}, a, b)
	}
	function getPackedValues() {
		if (!packedValues) {
			if (currentDecoder.getShared)
				loadShared();
			else
				throw new Error('No packed values available')
		}
		return packedValues
	}
	const SHARED_DATA_TAG_ID = 0x53687264; // ascii 'Shrd'
	currentExtensionRanges.push((tag, input) => {
		if (tag >= 225 && tag <= 255)
			return combine(getPackedValues().prefixes[tag - 224], input)
		if (tag >= 28704 && tag <= 32767)
			return combine(getPackedValues().prefixes[tag - 28672], input)
		if (tag >= 1879052288 && tag <= 2147483647)
			return combine(getPackedValues().prefixes[tag - 1879048192], input)
		if (tag >= 216 && tag <= 223)
			return combine(input, getPackedValues().suffixes[tag - 216])
		if (tag >= 27647 && tag <= 28671)
			return combine(input, getPackedValues().suffixes[tag - 27639])
		if (tag >= 1811940352 && tag <= 1879048191)
			return combine(input, getPackedValues().suffixes[tag - 1811939328])
		if (tag == SHARED_DATA_TAG_ID) {// we do a special check for this so that we can keep the currentExtensions as densely stored array (v8 stores arrays densely under about 3000 elements)
			return {
				packedValues: packedValues,
				structures: currentStructures.slice(0),
				version: input,
			}
		}
		if (tag == 55799) // self-descriptive CBOR tag, just return input value
			return input
	});

	const typedArrays = ['Uint8', 'Uint8Clamped', 'Uint16', 'Uint32', 'BigUint64','Int8', 'Int16', 'Int32', 'BigInt64', 'Float32', 'Float64'].map(type => type + 'Array');
	const typedArrayTags = [64, 68, 69, 70, 71, 72, 77, 78, 79, 81, 82];
	for (let i = 0; i < typedArrays.length; i++) {
		registerTypedArray(typedArrays[i], typedArrayTags[i]);
	}
	function registerTypedArray(typedArrayName, tag) {
		currentExtensions[tag] = (buffer) => {
			if (!typedArrayName)
				throw new Error('Could not find typed array for code ' + typeCode)
			// we have to always slice/copy here to get a new ArrayBuffer that is word/byte aligned
			return new glbl[typedArrayName](Uint8Array.prototype.slice.call(buffer, 0).buffer)
		};
	}

	function readBundleExt() {
		let length = readJustLength();
		let bundlePosition = position + read();
		for (let i = 2; i < length; i++) {
			// skip past bundles that were already read
			let bundleLength = readJustLength(); // this will increment position, so must add to position afterwards
			position += bundleLength;
		}
		let dataPosition = position;
		position = bundlePosition;
		bundledStrings = [readStringJS(readJustLength()), readStringJS(readJustLength())];
		bundledStrings.position0 = 0;
		bundledStrings.position1 = 0;
		bundledStrings.postBundlePosition = position;
		position = dataPosition;
		return read()
	}

	function readJustLength() {
		let token = src[position++] & 0x1f;
		if (token > 0x17) {
			switch (token) {
				case 0x18:
					token = src[position++];
					break
				case 0x19:
					token = dataView.getUint16(position);
					position += 2;
					break
				case 0x1a:
					token = dataView.getUint32(position);
					position += 4;
					break
			}
		}
		return token
	}

	function loadShared() {
		if (currentDecoder.getShared) {
			let sharedData = saveState(() => {
				// save the state in case getShared modifies our buffer
				src = null;
				return currentDecoder.getShared()
			}) || {};
			let updatedStructures = sharedData.structures || [];
			currentDecoder.sharedVersion = sharedData.version;
			packedValues = currentDecoder.sharedValues = sharedData.packedValues;
			if (currentStructures === true)
				currentDecoder.structures = currentStructures = updatedStructures;
			else
				currentStructures.splice.apply(currentStructures, [0, updatedStructures.length].concat(updatedStructures));
		}
	}

	function saveState(callback) {
		let savedSrcEnd = srcEnd;
		let savedPosition = position;
		let savedSrcStringStart = srcStringStart;
		let savedSrcStringEnd = srcStringEnd;
		let savedSrcString = srcString;
		let savedReferenceMap = referenceMap;
		let savedBundledStrings = bundledStrings;

		// TODO: We may need to revisit this if we do more external calls to user code (since it could be slow)
		let savedSrc = new Uint8Array(src.slice(0, srcEnd)); // we copy the data in case it changes while external data is processed
		let savedStructures = currentStructures;
		let savedDecoder = currentDecoder;
		let savedSequentialMode = sequentialMode;
		let value = callback();
		srcEnd = savedSrcEnd;
		position = savedPosition;
		srcStringStart = savedSrcStringStart;
		srcStringEnd = savedSrcStringEnd;
		srcString = savedSrcString;
		referenceMap = savedReferenceMap;
		bundledStrings = savedBundledStrings;
		src = savedSrc;
		sequentialMode = savedSequentialMode;
		currentStructures = savedStructures;
		currentDecoder = savedDecoder;
		dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
		return value
	}
	function clearSource() {
		src = null;
		referenceMap = null;
		currentStructures = null;
	}

	function addExtension(extension) {
		currentExtensions[extension.tag] = extension.decode;
	}

	const mult10 = new Array(147); // this is a table matching binary exponents to the multiplier to determine significant digit rounding
	for (let i = 0; i < 256; i++) {
		mult10[i] = +('1e' + Math.floor(45.15 - i * 0.30103));
	}
	let defaultDecoder = new Decoder({ useRecords: false });
	const decode = defaultDecoder.decode;
	const decodeMultiple = defaultDecoder.decodeMultiple;
	const FLOAT32_OPTIONS = {
		NEVER: 0,
		ALWAYS: 1,
		DECIMAL_ROUND: 3,
		DECIMAL_FIT: 4
	};
	let f32Array = new Float32Array(1);
	let u8Array = new Uint8Array(f32Array.buffer, 0, 4);
	function roundFloat32(float32Number) {
		f32Array[0] = float32Number;
		let multiplier = mult10[((u8Array[3] & 0x7f) << 1) | (u8Array[2] >> 7)];
		return ((multiplier * float32Number + (float32Number > 0 ? 0.5 : -0.5)) >> 0) / multiplier
	}

	let textEncoder;
	try {
		textEncoder = new TextEncoder();
	} catch (error) {}
	let extensions, extensionClasses;
	const hasNodeBuffer = typeof Buffer !== 'undefined';
	const ByteArrayAllocate = hasNodeBuffer ? Buffer.allocUnsafeSlow : Uint8Array;
	const ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
	const MAX_STRUCTURES = 0x100;
	const MAX_BUFFER_SIZE = hasNodeBuffer ? 0x100000000 : 0x7fd00000;
	let target;
	let targetView;
	let position$1 = 0;
	let safeEnd;
	let bundledStrings$1 = null;
	const MAX_BUNDLE_SIZE = 0xf000;
	const hasNonLatin = /[\u0080-\uFFFF]/;
	const RECORD_SYMBOL = Symbol('record-id');
	class Encoder extends Decoder {
		constructor(options) {
			super(options);
			this.offset = 0;
			let start;
			let sharedStructures;
			let hasSharedUpdate;
			let structures;
			let referenceMap;
			options = options || {};
			let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position, maxBytes) {
				return target.utf8Write(string, position, maxBytes)
			} : (textEncoder && textEncoder.encodeInto) ?
				function(string, position) {
					return textEncoder.encodeInto(string, target.subarray(position)).written
				} : false;

			let encoder = this;
			let hasSharedStructures = options.structures || options.saveStructures;
			let maxSharedStructures = options.maxSharedStructures;
			if (maxSharedStructures == null)
				maxSharedStructures = hasSharedStructures ? 128 : 0;
			if (maxSharedStructures > 8190)
				throw new Error('Maximum maxSharedStructure is 8190')
			let isSequential = options.sequential;
			if (isSequential) {
				maxSharedStructures = 0;
			}
			if (!this.structures)
				this.structures = [];
			if (this.saveStructures)
				this.saveShared = this.saveStructures;
			let samplingPackedValues, packedObjectMap, sharedValues = options.sharedValues;
			let sharedPackedObjectMap;
			if (sharedValues) {
				sharedPackedObjectMap = Object.create(null);
				for (let i = 0, l = sharedValues.length; i < l; i++) {
					sharedPackedObjectMap[sharedValues[i]] = i;
				}
			}
			let recordIdsToRemove = [];
			let transitionsCount = 0;
			let serializationsSinceTransitionRebuild = 0;
			
			this.mapEncode = function(value, encodeOptions) {
				// Experimental support for premapping keys using _keyMap instad of keyMap - not optiimised yet)
				if (this._keyMap && !this._mapped) {
					//console.log('encoding ', value)
					switch (value.constructor.name) {
						case 'Array': 
							value = value.map(r => this.encodeKeys(r));
							break
						//case 'Map': 
						//	value = this.encodeKeys(value)
						//	break
					}
					//this._mapped = true
				}
				return this.encode(value, encodeOptions)
			};
			
			this.encode = function(value, encodeOptions)	{
				if (!target) {
					target = new ByteArrayAllocate(8192);
					targetView = new DataView(target.buffer, 0, 8192);
					position$1 = 0;
				}
				safeEnd = target.length - 10;
				if (safeEnd - position$1 < 0x800) {
					// don't start too close to the end, 
					target = new ByteArrayAllocate(target.length);
					targetView = new DataView(target.buffer, 0, target.length);
					safeEnd = target.length - 10;
					position$1 = 0;
				} else if (encodeOptions === REUSE_BUFFER_MODE)
					position$1 = (position$1 + 7) & 0x7ffffff8; // Word align to make any future copying of this buffer faster
				start = position$1;
				if (encoder.useSelfDescribedHeader) {
					targetView.setUint32(position$1, 0xd9d9f700); // tag two byte, then self-descriptive tag
					position$1 += 3;
				}
				referenceMap = encoder.structuredClone ? new Map() : null;
				if (encoder.bundleStrings && typeof value !== 'string') {
					bundledStrings$1 = [];
					bundledStrings$1.size = Infinity; // force a new bundle start on first string
				} else
					bundledStrings$1 = null;

				sharedStructures = encoder.structures;
				if (sharedStructures) {
					if (sharedStructures.uninitialized) {
						let sharedData = encoder.getShared() || {};
						encoder.structures = sharedStructures = sharedData.structures || [];
						encoder.sharedVersion = sharedData.version;
						let sharedValues = encoder.sharedValues = sharedData.packedValues;
						if (sharedValues) {
							sharedPackedObjectMap = {};
							for (let i = 0, l = sharedValues.length; i < l; i++)
								sharedPackedObjectMap[sharedValues[i]] = i;
						}
					}
					let sharedStructuresLength = sharedStructures.length;
					if (sharedStructuresLength > maxSharedStructures && !isSequential)
						sharedStructuresLength = maxSharedStructures;
					if (!sharedStructures.transitions) {
						// rebuild our structure transitions
						sharedStructures.transitions = Object.create(null);
						for (let i = 0; i < sharedStructuresLength; i++) {
							let keys = sharedStructures[i];
							//console.log('shared struct keys:', keys)
							if (!keys)
								continue
							let nextTransition, transition = sharedStructures.transitions;
							for (let j = 0, l = keys.length; j < l; j++) {
								if (transition[RECORD_SYMBOL] === undefined)
									transition[RECORD_SYMBOL] = i;
								let key = keys[j];
								nextTransition = transition[key];
								if (!nextTransition) {
									nextTransition = transition[key] = Object.create(null);
								}
								transition = nextTransition;
							}
							transition[RECORD_SYMBOL] = i | 0x100000;
						}
					}
					if (!isSequential)
						sharedStructures.nextId = sharedStructuresLength;
				}
				if (hasSharedUpdate)
					hasSharedUpdate = false;
				structures = sharedStructures || [];
				packedObjectMap = sharedPackedObjectMap;
				if (options.pack) {
					let packedValues = new Map();
					packedValues.values = [];
					packedValues.encoder = encoder;
					packedValues.maxValues = options.maxPrivatePackedValues || (sharedPackedObjectMap ? 16 : Infinity);
					packedValues.objectMap = sharedPackedObjectMap || false;
					packedValues.samplingPackedValues = samplingPackedValues;
					findRepetitiveStrings(value, packedValues);
					if (packedValues.values.length > 0) {
						target[position$1++] = 0xd8; // one-byte tag
						target[position$1++] = 51; // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
						writeArrayHeader(4);
						let valuesArray = packedValues.values;
						encode(valuesArray);
						writeArrayHeader(0); // prefixes
						writeArrayHeader(0); // suffixes
						packedObjectMap = Object.create(sharedPackedObjectMap || null);
						for (let i = 0, l = valuesArray.length; i < l; i++) {
							packedObjectMap[valuesArray[i]] = i;
						}
					}
				}
				try {
					encode(value);
					if (bundledStrings$1) {
						writeBundles(start, encode);
					}
					encoder.offset = position$1; // update the offset so next serialization doesn't write over our buffer, but can continue writing to same buffer sequentially
					if (referenceMap && referenceMap.idsToInsert) {
						position$1 += referenceMap.idsToInsert.length * 2;
						if (position$1 > safeEnd)
							makeRoom(position$1);
						encoder.offset = position$1;
						let serialized = insertIds(target.subarray(start, position$1), referenceMap.idsToInsert);
						referenceMap = null;
						return serialized
					}
					if (encodeOptions & REUSE_BUFFER_MODE) {
						target.start = start;
						target.end = position$1;
						return target
					}
					return target.subarray(start, position$1) // position can change if we call encode again in saveShared, so we get the buffer now
				} finally {
					if (sharedStructures) {
						if (serializationsSinceTransitionRebuild < 10)
							serializationsSinceTransitionRebuild++;
						if (sharedStructures.length > maxSharedStructures)
							sharedStructures.length = maxSharedStructures;
						if (transitionsCount > 10000) {
							// force a rebuild occasionally after a lot of transitions so it can get cleaned up
							sharedStructures.transitions = null;
							serializationsSinceTransitionRebuild = 0;
							transitionsCount = 0;
							if (recordIdsToRemove.length > 0)
								recordIdsToRemove = [];
						} else if (recordIdsToRemove.length > 0 && !isSequential) {
							for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
								recordIdsToRemove[i][RECORD_SYMBOL] = undefined;
							}
							recordIdsToRemove = [];
							//sharedStructures.nextId = maxSharedStructures
						}
					}
					if (hasSharedUpdate && encoder.saveShared) {
						if (encoder.structures.length > maxSharedStructures) {
							encoder.structures = encoder.structures.slice(0, maxSharedStructures);
						}
						// we can't rely on start/end with REUSE_BUFFER_MODE since they will (probably) change when we save
						let returnBuffer = target.subarray(start, position$1);
						if (encoder.updateSharedData() === false)
							return encoder.encode(value) // re-encode if it fails
						return returnBuffer
					}
					if (encodeOptions & RESET_BUFFER_MODE)
						position$1 = start;
				}
			};
			this.findCommonStringsToPack = () => {
				samplingPackedValues = new Map();
				if (!sharedPackedObjectMap)
					sharedPackedObjectMap = Object.create(null);
				return (options) => {
					let threshold = options && options.threshold || 4;
					let position = this.pack ? options.maxPrivatePackedValues || 16 : 0;
					if (!sharedValues)
						sharedValues = this.sharedValues = [];
					for (let [ key, status ] of samplingPackedValues) {
						if (status.count > threshold) {
							sharedPackedObjectMap[key] = position++;
							sharedValues.push(key);
							hasSharedUpdate = true;
						}
					}
					while (this.saveShared && this.updateSharedData() === false) {}
					samplingPackedValues = null;
				}
			};
			const encode = (value) => {
				if (position$1 > safeEnd)
					target = makeRoom(position$1);

				var type = typeof value;
				var length;
				if (type === 'string') {
					if (packedObjectMap) {
						let packedPosition = packedObjectMap[value];
						if (packedPosition >= 0) {
							if (packedPosition < 16)
								target[position$1++] = packedPosition + 0xe0; // simple values, defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
							else {
								target[position$1++] = 0xc6; // tag 6 defined in https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
								if (packedPosition & 1)
									encode((15 - packedPosition) >> 1);
								else
									encode((packedPosition - 16) >> 1);
							}
							return
	/*						} else if (packedStatus.serializationId != serializationId) {
								packedStatus.serializationId = serializationId
								packedStatus.count = 1
								if (options.sharedPack) {
									let sharedCount = packedStatus.sharedCount = (packedStatus.sharedCount || 0) + 1
									if (shareCount > (options.sharedPack.threshold || 5)) {
										let sharedPosition = packedStatus.position = packedStatus.nextSharedPosition
										hasSharedUpdate = true
										if (sharedPosition < 16)
											target[position++] = sharedPosition + 0xc0

									}
								}
							} // else any in-doc incrementation?*/
						} else if (samplingPackedValues && !options.pack) {
							let status = samplingPackedValues.get(value);
							if (status)
								status.count++;
							else
								samplingPackedValues.set(value, {
									count: 1,
								});
						}
					}
					let strLength = value.length;
					if (bundledStrings$1 && strLength >= 4 && strLength < 0x400) {
						if ((bundledStrings$1.size += strLength) > MAX_BUNDLE_SIZE) {
							let extStart;
							let maxBytes = (bundledStrings$1[0] ? bundledStrings$1[0].length * 3 + bundledStrings$1[1].length : 0) + 10;
							if (position$1 + maxBytes > safeEnd)
								target = makeRoom(position$1 + maxBytes);
							target[position$1++] = 0xd9; // tag 16-bit
							target[position$1++] = 0xdf; // tag 0xdff9
							target[position$1++] = 0xf9;
							// TODO: If we only have one bundle with any string data, only write one string bundle
							target[position$1++] = bundledStrings$1.position ? 0x84 : 0x82; // array of 4 or 2 elements depending on if we write bundles
							target[position$1++] = 0x1a; // 32-bit unsigned int
							extStart = position$1 - start;
							position$1 += 4; // reserve for writing bundle reference
							if (bundledStrings$1.position) {
								writeBundles(start, encode); // write the last bundles
							}
							bundledStrings$1 = ['', '']; // create new ones
							bundledStrings$1.size = 0;
							bundledStrings$1.position = extStart;
						}
						let twoByte = hasNonLatin.test(value);
						bundledStrings$1[twoByte ? 0 : 1] += value;
						target[position$1++] = twoByte ? 0xce : 0xcf;
						encode(strLength);
						return
					}
					let headerSize;
					// first we estimate the header size, so we can write to the correct location
					if (strLength < 0x20) {
						headerSize = 1;
					} else if (strLength < 0x100) {
						headerSize = 2;
					} else if (strLength < 0x10000) {
						headerSize = 3;
					} else {
						headerSize = 5;
					}
					let maxBytes = strLength * 3;
					if (position$1 + maxBytes > safeEnd)
						target = makeRoom(position$1 + maxBytes);

					if (strLength < 0x40 || !encodeUtf8) {
						let i, c1, c2, strPosition = position$1 + headerSize;
						for (i = 0; i < strLength; i++) {
							c1 = value.charCodeAt(i);
							if (c1 < 0x80) {
								target[strPosition++] = c1;
							} else if (c1 < 0x800) {
								target[strPosition++] = c1 >> 6 | 0xc0;
								target[strPosition++] = c1 & 0x3f | 0x80;
							} else if (
								(c1 & 0xfc00) === 0xd800 &&
								((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00
							) {
								c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
								i++;
								target[strPosition++] = c1 >> 18 | 0xf0;
								target[strPosition++] = c1 >> 12 & 0x3f | 0x80;
								target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
								target[strPosition++] = c1 & 0x3f | 0x80;
							} else {
								target[strPosition++] = c1 >> 12 | 0xe0;
								target[strPosition++] = c1 >> 6 & 0x3f | 0x80;
								target[strPosition++] = c1 & 0x3f | 0x80;
							}
						}
						length = strPosition - position$1 - headerSize;
					} else {
						length = encodeUtf8(value, position$1 + headerSize, maxBytes);
					}

					if (length < 0x18) {
						target[position$1++] = 0x60 | length;
					} else if (length < 0x100) {
						if (headerSize < 2) {
							target.copyWithin(position$1 + 2, position$1 + 1, position$1 + 1 + length);
						}
						target[position$1++] = 0x78;
						target[position$1++] = length;
					} else if (length < 0x10000) {
						if (headerSize < 3) {
							target.copyWithin(position$1 + 3, position$1 + 2, position$1 + 2 + length);
						}
						target[position$1++] = 0x79;
						target[position$1++] = length >> 8;
						target[position$1++] = length & 0xff;
					} else {
						if (headerSize < 5) {
							target.copyWithin(position$1 + 5, position$1 + 3, position$1 + 3 + length);
						}
						target[position$1++] = 0x7a;
						targetView.setUint32(position$1, length);
						position$1 += 4;
					}
					position$1 += length;
				} else if (type === 'number') {
					if (value >>> 0 === value) {// positive integer, 32-bit or less
						// positive uint
						if (value < 0x18) {
							target[position$1++] = value;
						} else if (value < 0x100) {
							target[position$1++] = 0x18;
							target[position$1++] = value;
						} else if (value < 0x10000) {
							target[position$1++] = 0x19;
							target[position$1++] = value >> 8;
							target[position$1++] = value & 0xff;
						} else {
							target[position$1++] = 0x1a;
							targetView.setUint32(position$1, value);
							position$1 += 4;
						}
					} else if (value >> 0 === value) { // negative integer
						if (value >= -0x18) {
							target[position$1++] = 0x1f - value;
						} else if (value >= -0x100) {
							target[position$1++] = 0x38;
							target[position$1++] = ~value;
						} else if (value >= -0x10000) {
							target[position$1++] = 0x39;
							targetView.setUint16(position$1, ~value);
							position$1 += 2;
						} else {
							target[position$1++] = 0x3a;
							targetView.setUint32(position$1, ~value);
							position$1 += 4;
						}
					} else {
						let useFloat32;
						if ((useFloat32 = this.useFloat32) > 0 && value < 0x100000000 && value >= -0x80000000) {
							target[position$1++] = 0xfa;
							targetView.setFloat32(position$1, value);
							let xShifted;
							if (useFloat32 < 4 ||
									// this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
									((xShifted = value * mult10[((target[position$1] & 0x7f) << 1) | (target[position$1 + 1] >> 7)]) >> 0) === xShifted) {
								position$1 += 4;
								return
							} else
								position$1--; // move back into position for writing a double
						}
						target[position$1++] = 0xfb;
						targetView.setFloat64(position$1, value);
						position$1 += 8;
					}
				} else if (type === 'object') {
					if (!value)
						target[position$1++] = 0xf6;
					else {
						if (referenceMap) {
							let referee = referenceMap.get(value);
							if (referee) {
								target[position$1++] = 0xd8;
								target[position$1++] = 29; // http://cbor.schmorp.de/value-sharing
								target[position$1++] = 0x19; // 16-bit uint
								if (!referee.references) {
									let idsToInsert = referenceMap.idsToInsert || (referenceMap.idsToInsert = []);
									referee.references = [];
									idsToInsert.push(referee);
								}
								referee.references.push(position$1 - start);
								position$1 += 2; // TODO: also support 32-bit
								return
							} else 
								referenceMap.set(value, { offset: position$1 - start });
						}
						let constructor = value.constructor;
						if (constructor === Object) {
							writeObject(value, true);
						} else if (constructor === Array) {
							length = value.length;
							if (length < 0x18) {
								target[position$1++] = 0x80 | length;
							} else {
								writeArrayHeader(length);
							}
							for (let i = 0; i < length; i++) {
								encode(value[i]);
							}
						} else if (constructor === Map) {
							if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
								// use Tag 259 (https://github.com/shanewholloway/js-cbor-codec/blob/master/docs/CBOR-259-spec--explicit-maps.md) for maps if the user wants it that way
								target[position$1++] = 0xd9;
								target[position$1++] = 1;
								target[position$1++] = 3;
							}
							length = value.size;
							if (length < 0x18) {
								target[position$1++] = 0xa0 | length;
							} else if (length < 0x100) {
								target[position$1++] = 0xb8;
								target[position$1++] = length;
							} else if (length < 0x10000) {
								target[position$1++] = 0xb9;
								target[position$1++] = length >> 8;
								target[position$1++] = length & 0xff;
							} else {
								target[position$1++] = 0xba;
								targetView.setUint32(position$1, length);
								position$1 += 4;
							}
							if (encoder.keyMap) { 
								for (let [ key, entryValue ] of value) {
									encode(encoder.encodeKey(key));
									encode(entryValue);
								} 
							} else { 
								for (let [ key, entryValue ] of value) {
									encode(key); 
									encode(entryValue);
								} 	
							}
						} else {
							for (let i = 0, l = extensions.length; i < l; i++) {
								let extensionClass = extensionClasses[i];
								if (value instanceof extensionClass) {
									let extension = extensions[i];
									let tag = extension.tag || extension.getTag && extension.getTag(value);
									if (tag < 0x18) {
										target[position$1++] = 0xc0 | tag;
									} else if (tag < 0x100) {
										target[position$1++] = 0xd8;
										target[position$1++] = tag;
									} else if (tag < 0x10000) {
										target[position$1++] = 0xd9;
										target[position$1++] = tag >> 8;
										target[position$1++] = tag & 0xff;
									} else if (tag > -1) {
										target[position$1++] = 0xda;
										targetView.setUint32(position$1, tag);
										position$1 += 4;
									} // else undefined, don't write tag
									extension.encode.call(this, value, encode, makeRoom);
									return
								}
							}
							if (value[Symbol.iterator]) {
								target[position$1++] = 0x9f; // indefinite length array
								for (let entry of value) {
									encode(entry);
								}
								target[position$1++] = 0xff; // stop-code
								return
							}
							// no extension found, write as object
							writeObject(value, !value.hasOwnProperty); // if it doesn't have hasOwnProperty, don't do hasOwnProperty checks
						}
					}
				} else if (type === 'boolean') {
					target[position$1++] = value ? 0xf5 : 0xf4;
				} else if (type === 'bigint') {
					if (value < (BigInt(1)<<BigInt(64)) && value >= 0) {
						// use an unsigned int as long as it fits
						target[position$1++] = 0x1b;
						targetView.setBigUint64(position$1, value);
					} else if (value > -(BigInt(1)<<BigInt(64)) && value < 0) {
						// if we can fit an unsigned int, use that
						target[position$1++] = 0x3b;
						targetView.setBigUint64(position$1, -value - BigInt(1));
					} else {
						// overflow
						if (this.largeBigIntToFloat) {
							target[position$1++] = 0xfb;
							targetView.setFloat64(position$1, Number(value));
						} else {
							throw new RangeError(value + ' was too large to fit in CBOR 64-bit integer format, set largeBigIntToFloat to convert to float-64')
						}
					}
					position$1 += 8;
				} else if (type === 'undefined') {
					target[position$1++] = 0xf7;
				} else {
					throw new Error('Unknown type: ' + type)
				}
			};

			const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
				// this method is slightly slower, but generates "preferred serialization" (optimally small for smaller objects)
				let keys = Object.keys(object);
				let vals = Object.values(object);
				let length = keys.length;
				if (length < 0x18) {
					target[position$1++] = 0xa0 | length;
				} else if (length < 0x100) {
					target[position$1++] = 0xb8;
					target[position$1++] = length;
				} else if (length < 0x10000) {
					target[position$1++] = 0xb9;
					target[position$1++] = length >> 8;
					target[position$1++] = length & 0xff;
				} else {
					target[position$1++] = 0xba;
					targetView.setUint32(position$1, length);
					position$1 += 4;
				}
				if (encoder.keyMap) { 
					for (let i = 0; i < length; i++) {
						encode(encodeKey(keys[i]));
						encode(vals[i]);
					}
				} else {
					for (let i = 0; i < length; i++) {
						encode(keys[i]);
						encode(vals[i]);
					}
				}
			} :
			(object, safePrototype) => {
				target[position$1++] = 0xb9; // always use map 16, so we can preallocate and set the length afterwards
				let objectOffset = position$1 - start;
				position$1 += 2;
				let size = 0;
				if (encoder.keyMap) { 
					for (let key in object) if (safePrototype || object.hasOwnProperty(key)) {
						encode(encoder.encodeKey(key));
						encode(object[key]);
						size++;
					}
				} else { 
					for (let key in object) if (safePrototype || object.hasOwnProperty(key)) {
							encode(key);
							encode(object[key]);
						size++;
					}
				}
				target[objectOffset++ + start] = size >> 8;
				target[objectOffset + start] = size & 0xff;
			} :
			(object, safePrototype) => {
				let nextTransition, transition = structures.transitions || (structures.transitions = Object.create(null));
				let newTransitions = 0;
				let length = 0;
				let parentRecordId;
				let keys;
				if (this.keyMap) {
					keys = Object.keys(object).map(k => this.encodeKey(k));
					length = keys.length;
					for (let i = 0; i < length; i++) {
						let key = keys[i];
						nextTransition = transition[key];
						if (!nextTransition) {
							nextTransition = transition[key] = Object.create(null);
							newTransitions++;
						}
						transition = nextTransition;
					}				
				} else {
					for (let key in object) if (safePrototype || object.hasOwnProperty(key)) {
						nextTransition = transition[key];
						if (!nextTransition) {
							if (transition[RECORD_SYMBOL] & 0x100000) {// this indicates it is a brancheable/extendable terminal node, so we will use this record id and extend it
								parentRecordId = transition[RECORD_SYMBOL] & 0xffff;
							}
							nextTransition = transition[key] = Object.create(null);
							newTransitions++;
						}
						transition = nextTransition;
						length++;
					}
				}
				let recordId = transition[RECORD_SYMBOL];
				if (recordId !== undefined) {
					recordId &= 0xffff;
					target[position$1++] = 0xd9;
					target[position$1++] = (recordId >> 8) | 0xe0;
					target[position$1++] = recordId & 0xff;
				} else {
					if (!keys)
						keys = transition.__keys__ || (transition.__keys__ = Object.keys(object));
					if (parentRecordId === undefined) {
						recordId = structures.nextId++;
						if (!recordId) {
							recordId = 0;
							structures.nextId = 1;
						}
						if (recordId >= MAX_STRUCTURES) {// cycle back around
							structures.nextId = (recordId = maxSharedStructures) + 1;
						}
					} else {
						recordId = parentRecordId;
					}
					structures[recordId] = keys;
					if (recordId < maxSharedStructures) {
						target[position$1++] = 0xd9;
						target[position$1++] = (recordId >> 8) | 0xe0;
						target[position$1++] = recordId & 0xff;
						transition = structures.transitions;
						for (let i = 0; i < length; i++) {
							if (transition[RECORD_SYMBOL] === undefined || (transition[RECORD_SYMBOL] & 0x100000))
								transition[RECORD_SYMBOL] = recordId;
							transition = transition[keys[i]];
						}
						transition[RECORD_SYMBOL] = recordId | 0x100000; // indicates it is a extendable terminal
						hasSharedUpdate = true;
					} else {
						transition[RECORD_SYMBOL] = recordId;
						targetView.setUint32(position$1, 0xd9dfff00); // tag two byte, then record definition id
						position$1 += 3;
						if (newTransitions)
							transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
						// record the removal of the id, we can maintain our shared structure
						if (recordIdsToRemove.length >= MAX_STRUCTURES - maxSharedStructures)
							recordIdsToRemove.shift()[RECORD_SYMBOL] = undefined; // we are cycling back through, and have to remove old ones
						recordIdsToRemove.push(transition);
						writeArrayHeader(length + 2);
						encode(0xe000 + recordId);
						encode(keys);
						for (let v of Object.values(object)) encode(v);
						return
					}
				}
				if (length < 0x18) { // write the array header
					target[position$1++] = 0x80 | length;
				} else {
					writeArrayHeader(length);
				}
				for (let key in object)
					if (safePrototype || object.hasOwnProperty(key))
						encode(object[key]);
			};
			const makeRoom = (end) => {
				let newSize;
				if (end > 0x1000000) {
					// special handling for really large buffers
					if ((end - start) > MAX_BUFFER_SIZE)
						throw new Error('Encoded buffer would be larger than maximum buffer size')
					newSize = Math.min(MAX_BUFFER_SIZE,
						Math.round(Math.max((end - start) * (end > 0x4000000 ? 1.25 : 2), 0x400000) / 0x1000) * 0x1000);
				} else // faster handling for smaller buffers
					newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12;
				let newBuffer = new ByteArrayAllocate(newSize);
				targetView = new DataView(newBuffer.buffer, 0, newSize);
				if (target.copy)
					target.copy(newBuffer, 0, start, end);
				else
					newBuffer.set(target.slice(start, end));
				position$1 -= start;
				start = 0;
				safeEnd = newBuffer.length - 10;
				return target = newBuffer
			};
		}
		useBuffer(buffer) {
			// this means we are finished using our own buffer and we can write over it safely
			target = buffer;
			targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
			position$1 = 0;
		}
		clearSharedData() {
			if (this.structures)
				this.structures = [];
			if (this.sharedValues)
				this.sharedValues = undefined;
		}
		updateSharedData() {
			let lastVersion = this.sharedVersion || 0;
			this.sharedVersion = lastVersion + 1;
			let structuresCopy = this.structures.slice(0);
			let sharedData = new SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
			let saveResults = this.saveShared(sharedData,
					existingShared => (existingShared && existingShared.version || 0) == lastVersion);
			if (saveResults === false) {
				// get updated structures and try again if the update failed
				sharedData = this.getShared() || {};
				this.structures = sharedData.structures || [];
				this.sharedValues = sharedData.packedValues;
				this.sharedVersion = sharedData.version;
				this.structures.nextId = this.structures.length;
			} else {
				// restore structures
				structuresCopy.forEach((structure, i) => this.structures[i] = structure);
			}
			// saveShared may fail to write and reload, or may have reloaded to check compatibility and overwrite saved data, either way load the correct shared data
			return saveResults
		}
	}
	class SharedData {
		constructor(structures, values, version) {
			this.structures = structures;
			this.packedValues = values;
			this.version = version;
		}
	}

	function writeArrayHeader(length) {
		if (length < 0x18)
			target[position$1++] = 0x80 | length;
		else if (length < 0x100) {
			target[position$1++] = 0x98;
			target[position$1++] = length;
		} else if (length < 0x10000) {
			target[position$1++] = 0x99;
			target[position$1++] = length >> 8;
			target[position$1++] = length & 0xff;
		} else {
			target[position$1++] = 0x9a;
			targetView.setUint32(position$1, length);
			position$1 += 4;
		}
	}

	function findRepetitiveStrings(value, packedValues) {
		switch(typeof value) {
			case 'string':
				if (value.length > 3) {
					if (packedValues.objectMap[value] > -1 || packedValues.values.length >= packedValues.maxValues)
						return
					let packedStatus = packedValues.get(value);
					if (packedStatus) {
						if (++packedStatus.count == 2) {
							packedValues.values.push(value);
						}
					} else {
						packedValues.set(value, {
							count: 1,
						});
						if (packedValues.samplingPackedValues) {
							let status = packedValues.samplingPackedValues.get(value);
							if (status)
								status.count++;
							else
								packedValues.samplingPackedValues.set(value, {
									count: 1,
								});
						}
					}
				}
				break
			case 'object':
				if (value) {
					if (value instanceof Array) {
						for (let i = 0, l = value.length; i < l; i++) {
							findRepetitiveStrings(value[i], packedValues);
						}

					} else {
						let includeKeys = !packedValues.encoder.useRecords;
						for (var key in value) {
							if (value.hasOwnProperty(key)) {
								if (includeKeys)
									findRepetitiveStrings(key, packedValues);
								findRepetitiveStrings(value[key], packedValues);
							}
						}
					}
				}
				break
			case 'function': console.log(value);
		}
	}

	extensionClasses = [ Date, Set, Error, RegExp, Tag, ArrayBuffer, ByteArray,
		Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array,
		typeof BigUint64Array == 'undefined' ? function() {} : BigUint64Array, Int8Array, Int16Array, Int32Array,
		typeof BigInt64Array == 'undefined' ? function() {} : BigInt64Array,
		Float32Array, Float64Array, SharedData];

	//Object.getPrototypeOf(Uint8Array.prototype).constructor /*TypedArray*/
	extensions = [{
		tag: 1,
		encode(date, encode) {
			let seconds = date.getTime() / 1000;
			if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 0x100000000) {
				// Timestamp 32
				target[position$1++] = 0x1a;
				targetView.setUint32(position$1, seconds);
				position$1 += 4;
			} else {
				// Timestamp float64
				target[position$1++] = 0xfb;
				targetView.setFloat64(position$1, seconds);
				position$1 += 8;
			}
		}
	}, {
		tag: 258, // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
		encode(set, encode) {
			let array = Array.from(set);
			encode(array);
		}
	}, {
		tag: 27, // http://cbor.schmorp.de/generic-object
		encode(error, encode) {
			encode([ error.name, error.message ]);
		}
	}, {
		tag: 27, // http://cbor.schmorp.de/generic-object
		encode(regex, encode) {
			encode([ 'RegExp', regex.source, regex.flags ]);
		}
	}, {
		getTag(tag) {
			return tag.tag
		},
		encode(tag, encode) {
			encode(tag.value);
		}
	}, {
		encode(arrayBuffer, encode, makeRoom) {
			writeBuffer(arrayBuffer, makeRoom);
		}
	}, {
		encode(arrayBuffer, encode, makeRoom) {
			writeBuffer(arrayBuffer, makeRoom);
		}
	}, typedArrayEncoder(64),
		typedArrayEncoder(68),
		typedArrayEncoder(69),
		typedArrayEncoder(70),
		typedArrayEncoder(71),
		typedArrayEncoder(72),
		typedArrayEncoder(77),
		typedArrayEncoder(78),
		typedArrayEncoder(79),
		typedArrayEncoder(81),
		typedArrayEncoder(82),
	{
		encode(sharedData, encode) { // write SharedData
			let packedValues = sharedData.packedValues || [];
			let sharedStructures = sharedData.structures || [];
			if (packedValues.values.length > 0) {
				target[position$1++] = 0xd8; // one-byte tag
				target[position$1++] = 51; // tag 51 for packed shared structures https://www.potaroo.net/ietf/ids/draft-ietf-cbor-packed-03.txt
				writeArrayHeader(4);
				let valuesArray = packedValues.values;
				encode(valuesArray);
				writeArrayHeader(0); // prefixes
				writeArrayHeader(0); // suffixes
				packedObjectMap = Object.create(sharedPackedObjectMap || null);
				for (let i = 0, l = valuesArray.length; i < l; i++) {
					packedObjectMap[valuesArray[i]] = i;
				}
			}
			if (sharedStructures) {
				targetView.setUint32(position$1, 0xd9dffe00);
				position$1 += 3;
				let definitions = sharedStructures.slice(0);
				definitions.unshift(0xe000);
				definitions.push(new Tag(sharedData.version, 0x53687264));
				encode(definitions);
			} else
				encode(new Tag(sharedData.version, 0x53687264));
			}
		}];

	function typedArrayEncoder(tag) {
		return {
			tag: tag,
			encode: function writeExtBuffer(typedArray, encode) {
				let length = typedArray.byteLength;
				let offset = typedArray.byteOffset || 0;
				let buffer = typedArray.buffer || typedArray;
				encode(hasNodeBuffer ? Buffer.from(buffer, offset, length) :
					new Uint8Array(buffer, offset, length));
			}
		}
	}
	function writeBuffer(buffer, makeRoom) {
		let length = buffer.byteLength;
		if (length < 0x18) {
			target[position$1++] = 0x40 + length;
		} else if (length < 0x100) {
			target[position$1++] = 0x58;
			target[position$1++] = length;
		} else if (length < 0x10000) {
			target[position$1++] = 0x59;
			target[position$1++] = length >> 8;
			target[position$1++] = length & 0xff;
		} else {
			target[position$1++] = 0x5a;
			targetView.setUint32(position$1, length);
			position$1 += 4;
		}
		if (position$1 + length >= target.length) {
			makeRoom(position$1 + length);
		}
		target.set(buffer, position$1);
		position$1 += length;
	}

	function insertIds(serialized, idsToInsert) {
		// insert the ids that need to be referenced for structured clones
		let nextId;
		let distanceToMove = idsToInsert.length * 2;
		let lastEnd = serialized.length - distanceToMove;
		idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
		for (let id = 0; id < idsToInsert.length; id++) {
			let referee = idsToInsert[id];
			referee.id = id;
			for (let position of referee.references) {
				serialized[position++] = id >> 8;
				serialized[position] = id & 0xff;
			}
		}
		while (nextId = idsToInsert.pop()) {
			let offset = nextId.offset;
			serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
			distanceToMove -= 2;
			let position = offset + distanceToMove;
			serialized[position++] = 0xd8;
			serialized[position++] = 28; // http://cbor.schmorp.de/value-sharing
			lastEnd = offset;
		}
		return serialized
	}
	function writeBundles(start, encode) {
		targetView.setUint32(bundledStrings$1.position + start, position$1 - bundledStrings$1.position - start + 1); // the offset to bundle
		let writeStrings = bundledStrings$1;
		bundledStrings$1 = null;
		encode(writeStrings[0]);
		encode(writeStrings[1]);
	}

	function addExtension$1(extension) {
		if (extension.Class) {
			if (!extension.encode)
				throw new Error('Extension has no encode function')
			extensionClasses.unshift(extension.Class);
			extensions.unshift(extension);
		}
		addExtension(extension);
	}
	let defaultEncoder = new Encoder({ useRecords: false });
	const encode = defaultEncoder.encode;
	const { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
	const REUSE_BUFFER_MODE = 512;
	const RESET_BUFFER_MODE = 1024;

	/**
	 * Given an Iterable first argument, returns an Iterable where each value is encoded as a Buffer
	 * If the argument is only Async Iterable, the return value will be an Async Iterable.
	 * @param {Iterable|Iterator|AsyncIterable|AsyncIterator} objectIterator - iterable source, like a Readable object stream, an array, Set, or custom object
	 * @param {options} [options] - cbor-x Encoder options
	 * @returns {IterableIterator|Promise.<AsyncIterableIterator>}
	 */
	function encodeIter (objectIterator, options = {}) {
	  if (!objectIterator || typeof objectIterator !== 'object') {
	    throw new Error('first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable')
	  } else if (typeof objectIterator[Symbol.iterator] === 'function') {
	    return encodeIterSync(objectIterator, options)
	  } else if (typeof objectIterator.then === 'function' || typeof objectIterator[Symbol.asyncIterator] === 'function') {
	    return encodeIterAsync(objectIterator, options)
	  } else {
	    throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise')
	  }
	}

	function * encodeIterSync (objectIterator, options) {
	  const encoder = new Encoder(options);
	  for (const value of objectIterator) {
	    yield encoder.encode(value);
	  }
	}

	async function * encodeIterAsync (objectIterator, options) {
	  const encoder = new Encoder(options);
	  for await (const value of objectIterator) {
	    yield encoder.encode(value);
	  }
	}

	/**
	 * Given an Iterable/Iterator input which yields buffers, returns an IterableIterator which yields sync decoded objects
	 * Or, given an Async Iterable/Iterator which yields promises resolving in buffers, returns an AsyncIterableIterator.
	 * @param {Iterable|Iterator|AsyncIterable|AsyncIterableIterator} bufferIterator
	 * @param {object} [options] - Decoder options
	 * @returns {IterableIterator|Promise.<AsyncIterableIterator}
	 */
	function decodeIter (bufferIterator, options = {}) {
	  if (!bufferIterator || typeof bufferIterator !== 'object') {
	    throw new Error('first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise')
	  }

	  const decoder = new Decoder(options);
	  let incomplete;
	  const parser = (chunk) => {
	    let yields;
	    // if there's incomplete data from previous chunk, concatinate and try again
	    if (incomplete) {
	      chunk = Buffer.concat([incomplete, chunk]);
	      incomplete = undefined;
	    }

	    try {
	      yields = decoder.decodeMultiple(chunk);
	    } catch (err) {
	      if (err.incomplete) {
	        incomplete = chunk.slice(err.lastPosition);
	        yields = err.values;
	      } else {
	        throw err
	      }
	    }
	    return yields
	  };

	  if (typeof bufferIterator[Symbol.iterator] === 'function') {
	    return (function * iter () {
	      for (const value of bufferIterator) {
	        yield * parser(value);
	      }
	    })()
	  } else if (typeof bufferIterator[Symbol.asyncIterator] === 'function') {
	    return (async function * iter () {
	      for await (const value of bufferIterator) {
	        yield * parser(value);
	      }
	    })()
	  }
	}

	exports.ALWAYS = ALWAYS;
	exports.DECIMAL_FIT = DECIMAL_FIT;
	exports.DECIMAL_ROUND = DECIMAL_ROUND;
	exports.Decoder = Decoder;
	exports.Encoder = Encoder;
	exports.FLOAT32_OPTIONS = FLOAT32_OPTIONS;
	exports.NEVER = NEVER;
	exports.REUSE_BUFFER_MODE = REUSE_BUFFER_MODE;
	exports.Tag = Tag;
	exports.addExtension = addExtension$1;
	exports.clearSource = clearSource;
	exports.decode = decode;
	exports.decodeIter = decodeIter;
	exports.decodeMultiple = decodeMultiple;
	exports.encode = encode;
	exports.encodeIter = encodeIter;
	exports.isNativeAccelerationEnabled = isNativeAccelerationEnabled;
	exports.roundFloat32 = roundFloat32;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
