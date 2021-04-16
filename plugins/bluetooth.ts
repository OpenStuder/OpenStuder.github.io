declare class CBOR {
	static encode(value: any): ArrayBuffer
	static decode(data: ArrayBuffer, tagger: (value: any) => any, simpleValue: () => any): any
}

const bluetoothTestHtml = `
<!--suppress CssUnresolvedCustomProperty -->
<style>
	div#bluetooth {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: fixed;
		bottom: 0;
		right: 0;
		width: 75%;
		min-width: 800px;
		max-width: 1200px;
		padding: 12px 32px;
		color: var(--textColor);
		background: var(--textBackground);
		font-size: 16px;
		border-top-left-radius: 12px;
		border-left: 1px solid var(--textColor);
		border-top: 1px solid var(--textColor);
	}
	
	div#bluetooth div {
		padding: 8px;
	}
	
	div#bluetooth div.control {
		display:flex;
		justify-content: space-between;
		align-items: center;
	}
	
	div#bluetooth div.bluetooth-io {
		display: flex;
		justify-content: flex-end;
		align-items: start;
	}
	
	div#bluetooth div.bluetooth-io i {
		margin: 12px;
	}
	
	div#bluetooth div.bluetooth-io[hidden] {
		display: none;
	}
	
	#bluetooth b {
	color: var(--textColor);
		font-size: 18px;
	}
	
	#bluetooth div.bluetooth-io div {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}
	
	#bluetooth input {
		outline:none;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		font-size: 15px;
		border: 1px solid var(--textColor);
		color: var(--textColor);
		background: var(--textBackground);
		border-radius: 12px;
		padding: 4px 12px;
	}
	
	#bluetooth input[type=number] {
		width: 80px;
	}
	
	#bluetooth input[type=checkbox] {
		display: none;
	}
	
	#bluetooth input[type=checkbox] + label i {
		background: none;
		border: 1px solid var(--textColor);
		border-radius: 5px;
		color: var(--textColor);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#bluetooth input[type=checkbox]:checked + label i {
		background: var(--textColor);
		color: var(--textBackground);
	}
	
	#bluetooth button {
		outline:none;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		font-size: 15px;
		border: none;
		color: var(--textBackground);
		background: var(--textColor);
		border-radius: 12px;
		padding: 4px 12px;
	}
	
	#bluetooth button[type=submit],
	#bluetooth button[type=reset]{
		background: none;
		color: var(--textColor);
		padding: 0;
	}
	
	#bluetooth button:hover, 
	.bluetooth-copy-button:hover,
	.bluetooth-send-button:hover {
		filter: brightness(150%);
	}
	
	#bluetooth button:disabled,
	#bluetooth input:disabled,
	.bluetooth-copy-button:disabled,
	.bluetooth-send-button:disabled {
		filter: opacity(25%);
	}
	
	#bluetooth textarea {
		resize: none;
		flex-grow: 2;
		height: 150px;
		outline:none;
		-webkit-appearance: none;
		font-family: Roboto Mono, Monaco, courier, monospace;
		font-size: .8rem;
		color: var(--textColor);
		background: var(--background);
		border: 1px solid var(--textColor);
		border-radius: 6px;
		padding: 4px 12px;
	}
	
	.bluetooth-copy-button {
		position: absolute;
		bottom: 4px;
		right: 36px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accentBackground);
		background: none;
	}
	
	.bluetooth-send-button {
		position: absolute;
		bottom: 7px;
		right: 8px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accentBackground);
		background: none;
	}
	
	.bluetooth-copy-button:hover,
	.bluetooth-send-button:hover {
		color: white;
	}
	
	#bluetooth ul.log {
		overflow-y: scroll;
		flex-grow: 2;
		height: 40vh;
		font-family: Roboto Mono, Monaco, courier, monospace;
		font-size: .7rem;
		color: var(--accent);
		background: var(--background);
		border: 1px solid var(--textColor);
		border-radius: 6px;
		padding: 8px 24px;
		margin: 0 2px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#bluetooth ul.log li {
		white-space: pre;
		list-style: none;
		padding: 4px 4px 4px 8px;
		color: var(--textHighContrast);
		border: 1px solid var(--textColor);
		background: hsla(0, 0%, 100%, 0.03);
		margin-top: 8px;
		overflow-y: hidden;
		overflow-x: auto;
		border-radius: 8px;
		margin-left: 20%;
		background: var(--textBackground);
		-webkit-user-select: auto;
		-moz-user-select: auto;
		-ms-user-select: auto;
		user-select: auto;
	}
	
	#bluetooth ul.log li.request {
		margin-right: 20%;
		margin-left: 0;
		background: var(--accentBackground);
		border-color: var(--accent);
	}
	
	#bluetooth ul.log li.response {
		background: var(--secondaryBackground);
		border-color: var(--secondary);
	}
	
	#bluetooth ul.log li.error {
		background: var(--warnBackground);
		border-color: var(--warn);
	}
	
	#bluetooth ::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 4px;
	}

	#bluetooth ::-webkit-scrollbar-track {
		border-radius: 4px;
		border: 1px solid hsla(0, 0%, 50%, 1);
		background: var(--textColor);
		opacity: 0.75;
	}

	#bluetooth ::-webkit-scrollbar-corner {
		background: var(--textColor);
		opacity: 0.75;
	}

	#bluetooth ::-webkit-scrollbar-thumb {
		width: 8px;
		border-radius: 4px;
		background: var(--background);
		opacity: 0.75;
	}

	#bluetooth {
		scrollbar-color: hsla(0, 0%, 50%, .75) hsla(0, 0%, 50%, 0.25);
		scrollbar-width: thin;
	}
</style>
<div id="bluetooth">
    <div class="control">
	<span>
        <b>Bluetooth connection</b>
    </span>
        <span>
        <button id="websocket.ctrl.button">Connect</button>
    </span>
    </div>
    <div class="bluetooth-io" hidden>
        <label for="bluetooth.io.tx"><i class="material-icons" style="font-size: 24px;">edit</i></label>
        <textarea id="bluetooth.io.tx"></textarea>
        <button id="bluetooth.io.send" type="submit" title="Send to gateway" disabled><i class="material-icons" style="font-size: 24px;">send</i></button>
    </div>
    <div class="bluetooth-io" hidden>
        <label for="bluetooth.io.rx"><i class="material-icons" style="font-size: 24px;"	>forum</i></label>
        <ul id="bluetooth.io.rx" class="log"></ul>
        <div style="display: flex;align-items: center;justify-content: center;">
			<button id="bluetooth.io.rx.clear" type="reset" title="Clear reception log"><i class="material-icons" style="font-size: 24px;">delete_forever</i></button>
			<input type="checkbox" id="bluetooth.io.rx.follow" checked/>
			<label for="bluetooth.io.rx.follow" title="Follow output"><i class="material-icons" style="font-size: 16px;">vertical_align_bottom</i></label>
		</div>
    </div>
</div>
`;

const bluetoothProblemHtml = `
<!--suppress CssUnresolvedCustomProperty -->
<style>
	div#bluetooth {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		position: fixed;
		bottom: 0;
		right: 0;
		padding: 12px 32px;
		color: var(--warnBackground);
		background: var(--warn);
		font-size: 16px;
		border-top-left-radius: 12px;
		border-left: 1px solid var(--warnBackground);
		border-top: 1px solid var(--warnBackground);
	}
	
	div#bluetooth i, div#bluetooth span  {
		margin: 4px;
	}
	
	div#bluetooth button {
		outline:none;
		margin: 4px;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		border: none;
		color: var(--warn);
		background: var(--warnBackground);
		border-radius: 12px;
		padding: 4px 12px;
	}
</style>
<div id="bluetooth">
	<i class="material-icons">error</i>
	<span>
		<!--<b>Bluetooth testing not available when using HTTP!</b>-->
		<b>Bluetooth testing not available yet</b>
	</span>
	<!--<button onclick="window.location = 'https:'; window.location.reload();">Fix...</button>-->
</div>
`

class SIBluetoothTestConnection {
	constructor(hook: any, docsifyWM: any) {
		this.docsifyWM_ = docsifyWM;

		hook.doneEach(() => {
			if (docsifyWM.route.path.indexOf('/bluetooth') == 0) {
				//if (window.location.protocol == 'http:') {
					document.body.insertAdjacentHTML('beforeend', bluetoothProblemHtml);
					return;
				//}

				//document.body.insertAdjacentHTML('beforeend', bluetoothTestHtml);

				// TOOD...

			} else {
				const wsElement = document.getElementById('bluetooth');
				if (wsElement != null) wsElement.remove();
			}
		});
	}

	private docsifyWM_: any;
}

function toHexString(byteArray) {
	let s = '';
	byteArray.forEach(function(byte) {
		s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
	});
	return s;
}

function appendBuffer(buffer1, buffer2) {
	let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(new Uint8Array(buffer1), 0);
	tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return tmp.buffer;
}

function docsifyBluetoothPlugin(hook: any, vm: any) {
	const intRegex = /^\d+$/;
	const floatRegex = /^\d*.\d*$/;
	hook.doneEach(() => {
		document.querySelectorAll<HTMLDivElement>('.bt-api-doc').forEach((docElement: HTMLDivElement) => {
			const preview = docElement.querySelector<HTMLElement>('code[data-bt-preview]');
			if (preview) {
				const params = docElement.querySelectorAll<HTMLElement>('[data-bt-index]');
				//params.sort();

				const renderPreview = () => {
					let msg = CBOR.encode(parseInt(preview.dataset.btPreview))
					params.forEach((paramElement: HTMLElement) => {
						if (paramElement.tagName.toLowerCase() == 'input') {
							const element = paramElement as HTMLInputElement;
							const value = element.value;
							if (element.validity.valid && value) {
								switch (paramElement.dataset.btType) {
									case "bool":
										msg = appendBuffer(msg, CBOR.encode((value.toLowerCase() == 'true')));
										break;

									case "int":
										msg = appendBuffer(msg, CBOR.encode(parseInt(value)));
										break;

									case "float":
										msg = appendBuffer(msg, CBOR.encode(parseFloat(value)));
										break;

									case "auto":
										if (value.toLowerCase() == "true") {
											msg = appendBuffer(msg, CBOR.encode(true));
										}
										else if (value.toLowerCase() == "false") {
											msg = appendBuffer(msg, CBOR.encode(false));
										} else if (intRegex.test(value)) {
											msg = appendBuffer(msg, CBOR.encode(parseInt(value)));
										} else if (floatRegex.test(value)) {
											msg = appendBuffer(msg, CBOR.encode(parseFloat(value)));
										} else {
											msg = appendBuffer(msg, CBOR.encode(value));
										}
										break;

									case "string":
									default:
										msg = appendBuffer(msg, CBOR.encode(value || ""));
								}
							} else {
								msg = appendBuffer(msg, CBOR.encode(null));
							}
						} else if (paramElement.tagName.toLowerCase() == 'select') {
							const element = paramElement as HTMLSelectElement;
							if (element.multiple) {
								const options = element.options;
								let flags = null;
								for (let i = 0; i < options.length; ++i) {
									if (options[i].selected) {
										flags = (flags || 0) | parseInt(options[i].value);
									}
								}
								msg = appendBuffer(msg, CBOR.encode(flags));
							} else {
								const value = element.value;
								if (value) {
									switch (paramElement.dataset.btType) {
										case "bool":
											msg = appendBuffer(msg, CBOR.encode((value.toLowerCase() == 'true')));
											break;

										case "int":
											msg = appendBuffer(msg, CBOR.encode(parseInt(value)));
											break;

										case "float":
											msg = appendBuffer(msg, CBOR.encode(parseFloat(value)));
											break;

										default:
											msg = appendBuffer(msg, CBOR.encode(value));
									}
								} else {
									msg = appendBuffer(msg, CBOR.encode(null));
								}
							}
						}

					});

					preview.innerText = toHexString(new Uint8Array(msg));
				};

				params.forEach((element: HTMLElement) => {
					element.onchange = renderPreview;
					element.onkeyup = renderPreview;
				});

				renderPreview();
			}
		});
	});

	(window as any).testBT = new SIBluetoothTestConnection(hook, vm);
}

let docsify = (window as any).$docsify || {};
docsify.plugins = [docsifyBluetoothPlugin].concat(docsify.plugins || []);
