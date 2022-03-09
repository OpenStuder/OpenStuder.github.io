declare class CBOR {
	static encode(value: any): ArrayBuffer
	static decodeMultiple(bytes: ArrayBuffer, forEach?: Function): Array<any>
}

interface BluetoothRemoteGATTCharacteristic {
	startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
	addEventListener(type: "characteristicvaluechanged", listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
	writeValue(value: Uint8Array)
}

interface BluetoothRemoteGATTService {
	getCharacteristic(characteristic: any): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTServer {
	connect(): Promise<BluetoothRemoteGATTServer>;
	disconnect(): void;
	getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothDevice {
	readonly gatt?: BluetoothRemoteGATTServer | undefined;
	addEventListener(type: "gattserverdisconnected", listener: (this: this, ev: Event) => any, useCapture?: boolean): void;
}

interface Bluetooth {
	getAvailability(): Promise<boolean>;
	requestDevice(options?: any): Promise<BluetoothDevice>;
}

interface Navigator {
	bluetooth: Bluetooth;
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
		list-style: none;
		padding: 4px 4px 4px 8px;
		color: var(--textHighContrast);
		border: 1px solid var(--textColor);
		background: hsla(0, 0%, 100%, 0.03);
		margin-top: 8px;
		overflow-y: hidden;
		overflow-x: auto;
		border-radius: 8px;
		margin-left: 50%;
		background: var(--textBackground);
		-webkit-user-select: auto;
		-moz-user-select: auto;
		-ms-user-select: auto;
		user-select: auto;
	}
	
	#bluetooth ul.log li.request {
		margin-right: 50%;
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
	
	#bluetooth ul.log li b {
		font-size: 14px;
		font-weight: bold;
		overflow-wrap: break-word;
	}
	
	#bluetooth ul.log li pre {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
    	margin: 0;
    	margin-top: 2px;
    	padding-top: 2px;
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
    
	</span>
    <span>
        <button id="bluetooth.ctrl.button">Connect...</button>
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
	
	.bluetooth-copy-button {
		position: absolute;
		top: 18px;
		right: 8px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accentBackground);
		background: none;
	}
</style>
<div id="bluetooth">
	<i class="material-icons">error</i>
	<span>
		<b>Bluetooth testing not available when using HTTP!</b>
	</span>
	<button onclick="window.location.protocol = 'https'">Fix...</button>
</div>
`

const bluetoothNoSupport = `
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
	
	div#bluetooth a {
		color: var(--warnBackground);;
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
	
	.bluetooth-copy-button {
		position: absolute;
		top: 18px;
		right: 8px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accentBackground);
		background: none;
	}
</style>
<div id="bluetooth">
	<i class="material-icons">error</i>
	<span>
		<b>Your browser does not support Bluetooth!<br/><a target="_blank" href="https://www.google.de/chrome/">Get Google Chrome...</a></b>
	</span>
</div>
`

type DecodedPayload = {
	command: number,
	description: string
}

class SIBluetoothTestConnection {
	constructor(hook: any, docsifyWM: any) {
		this.docsifyWM_ = docsifyWM;

		hook.doneEach(() => {
			if (docsifyWM.route.path.indexOf('/bluetooth') == 0) {
				if (window.location.protocol == 'http:') {
					document.body.insertAdjacentHTML('beforeend', bluetoothProblemHtml);
					return;
				}

				if (navigator.bluetooth === undefined || !navigator.bluetooth.getAvailability()) {
					document.body.insertAdjacentHTML('beforeend', bluetoothNoSupport);
					return;
				}

				document.body.insertAdjacentHTML('beforeend', bluetoothTestHtml);

				this.discoverButton = document.getElementById('bluetooth.ctrl.button') as HTMLButtonElement;
				this.discoverButton.onclick = this.onDiscoverButtonClicked;

				this.io_ = document.getElementsByClassName('bluetooth-io') as HTMLCollectionOf<HTMLDivElement>;

				this.editTextarea_ = document.getElementById('bluetooth.io.tx') as HTMLTextAreaElement;
				this.editTextarea_.onkeydown = this.onTxKeyDown;
				this.editTextarea_.onkeyup = this.onTxChanged;
				this.editTextarea_.onpaste = this.onTxChanged;
				this.sendButton_ = document.getElementById('bluetooth.io.send') as HTMLButtonElement;
				this.sendButton_.onclick = this.onSendButtonClicked;

				this.log_ = document.getElementById('bluetooth.io.rx') as HTMLUListElement;
				this.clearLogButton_ = document.getElementById('bluetooth.io.rx.clear') as HTMLButtonElement;
				this.clearLogButton_.onclick = this.onClearLogButtonClicked;
				this.followLogCheckbox_ = document.getElementById('bluetooth.io.rx.follow') as HTMLInputElement;
				const logFollows = SIBluetoothTestConnection.getCookie('logFollows');
				if (logFollows != null) {
					this.followLogCheckbox_.checked = logFollows == 'true';
				}
				this.followLogCheckbox_.onchange = this.onFollowLogCheckboxChanged;

				const requests = document.querySelectorAll('pre[data-bt-try]');
				for (let i = 0; i < requests.length; ++i) {
					const editButton = document.createElement('button') as HTMLButtonElement;
					editButton.title = "Copy to edit field.";
					editButton.disabled = true;
					editButton.className = 'bluetooth-copy-button';
					editButton.classList.add('copy');
					editButton.innerHTML = '<i class="material-icons" style="font-size: 24px;">read_more</i>';
					editButton.onclick = this.onTestCopyButtonClicked;
					requests[i].appendChild(editButton);
					this.testButtons_.push(editButton);

					const sendButton = document.createElement('button') as HTMLButtonElement;
					sendButton.title = "Send to connected gateway.";
					sendButton.disabled = true;
					sendButton.className = 'bluetooth-send-button';
					sendButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">send</i>';
					sendButton.onclick = this.onTestSendButtonClicked;
					requests[i].appendChild(sendButton);
					this.testButtons_.push(sendButton);
				}
			} else {
				const wsElement = document.getElementById('bluetooth');
				if (wsElement != null) wsElement.remove();
			}
		});
	}

	private onDiscoverButtonClicked = (_mouseEvent: MouseEvent) => {
		if (this.device_ == null) {
			this.discoverButton.disabled = true;
			navigator.bluetooth.requestDevice({filters: [{services: ["f3c2d800-8421-44b1-9655-0951992f313b"]}]}).then(device => {
				this.discoverButton.innerHTML = '<img width="70" height="20" style="margin: 0; padding: 0" src="images/loading.svg">';
				this.device_ = device;
				device.addEventListener('gattserverdisconnected', this.onDeviceDisconnected);
				return device.gatt.connect();
			}).then(gatt => {
				return gatt.getPrimaryService("f3c2d800-8421-44b1-9655-0951992f313b");
			}).then(service => {
				this.service_ = service;
				return this.service_.getCharacteristic("f3c2d802-8421-44b1-9655-0951992f313b");
			}).then(characteristic => {
				this.tx_ = characteristic;
			}).then(_ => {
				return this.service_.getCharacteristic("f3c2d801-8421-44b1-9655-0951992f313b");
			}).then(char => {
				char.addEventListener('characteristicvaluechanged', this.onCharacteristicChanged);
				return char.startNotifications();
			}).then(this.onDeviceConnected).catch(error => {
				this.discoverButton.disabled = false;
				this.onDeviceDisconnected();
			});
		} else {
			this.device_.gatt.disconnect();
		}
	};

	private onDeviceConnected = (device) => {
		this.discoverButton.disabled = false;
		this.discoverButton.innerText = "Disconnect";

		for (let i = 0; i < this.io_.length; ++i) {
			this.io_[i].hidden = false;
		}

		this.testButtons_.forEach((button: HTMLButtonElement) => button.disabled = false);
	}

	private onDeviceDisconnected = () => {
		this.device_ = null;

		this.discoverButton.innerText = "Connect...";

		this.editTextarea_.value = '';
		this.log_.innerHTML = '';

		for (let i = 0; i < this.io_.length; ++i) {
			this.io_[i].hidden = true;
		}

		this.testButtons_.forEach((button: HTMLButtonElement) => button.disabled = true);
	}

	private onCharacteristicChanged = (event) => {
		let fragment = new Uint8Array(event.target.value.buffer);
		let remainingFragments = fragment[0];
		this.receivingFrame_ = appendUInt8Arrays(this.receivingFrame_, fragment.subarray(1));
		if (remainingFragments != 0) return;

		let payload = this.receivingFrame_;
		this.receivingFrame_ = new Uint8Array(0);

		const decoded = this.decodeFrame(payload);

		const entry = document.createElement('li');
		if (payload.length >= 2 && payload[0] == 0x18 && payload[1] == 0xFF) {
			entry.className = 'error';
		} else if (payload.length >= 2 && payload[0] == 0x18 && (payload[1] == 0xFE || payload[1] == 0xFD)) {
			entry.className = '';
		} else {
			entry.className = 'response';
		}
		entry.innerHTML = '<b>' + bytesToHex(payload) + '</b><pre>' + decoded.description + '</pre>';
		this.log_.insertAdjacentElement('beforeend', entry);
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}

		const exampleMessage = document.querySelector<HTMLPreElement>('[data-bt-example="' + decoded.command  + '"]');
		if (exampleMessage) {
			exampleMessage.firstElementChild.innerHTML = '<code>' + bytesToHex(payload) + '</code>';
		}
	}

	private onSendButtonClicked = (_mouseEvent: MouseEvent) => {
		const MAX_FRAGMENT_SIZE = 508; // TODO: Detect or make configurable.
		let payload = hexToBytes(this.editTextarea_.value);

		const entry = document.createElement('li');
		entry.className = 'request';
		entry.innerHTML = '<b>' + this.editTextarea_.value + '</b><pre>' + this.decodeFrame(payload).description + '</pre>';
		this.log_.insertAdjacentElement('beforeend', entry);
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}

		let fragmentCount = Math.ceil(payload.length / MAX_FRAGMENT_SIZE);
		while (fragmentCount > 0) {
			fragmentCount -= 1
			let fragmentLength = Math.min(payload.length, MAX_FRAGMENT_SIZE)
			let fragment = new Uint8Array(fragmentLength + 1);
			fragment[0] = Math.min(fragmentCount, 255);
			fragment.set(payload.subarray(0, fragmentLength), 1);
			payload = payload.subarray(fragmentLength);
			this.tx_.writeValue(fragment);
		}
	};

	private onClearLogButtonClicked = (_mouseEvent: MouseEvent) => {
		this.log_.innerHTML = '';
	}

	private onFollowLogCheckboxChanged = (_event: Event) => {
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}
		SIBluetoothTestConnection.setCookie('logFollows', this.followLogCheckbox_.checked);
	}

	private onTxKeyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key == "Enter") {
			if (!this.sendButton_.disabled) {
				this.onSendButtonClicked(null);
			}
			return false;
		}
	}

	private onTxChanged = (_event: Event) => {
		this.sendButton_.disabled = !this.editVerifyRegex_.test(this.editTextarea_.value);
	};

	private onTestCopyButtonClicked = (event: MouseEvent) => {
		this.editTextarea_.value = (event.target as HTMLElement).parentElement.parentElement.querySelector<HTMLElement>('code').innerHTML.split('<br>').join('\n');
		this.onTxChanged(null);
	}

	private onTestSendButtonClicked = (event: MouseEvent) => {
		this.editTextarea_.value = (event.target as HTMLElement).parentElement.parentElement.querySelector<HTMLElement>('code').innerHTML.split('<br>').join('\n');
		this.onTxChanged(null);
		this.onSendButtonClicked(null);
	}

	private decodeFrame(bytes: Uint8Array): DecodedPayload {
		let sequence = CBOR.decodeMultiple(bytes);

		let decoded = "";
		let command = 0;
		if (sequence.length > 0) {
			command = sequence[0];
			if (command == 0x01 && sequence.length == 4) {
				decoded = "AUTHORIZE" +
					"\nuser: " + sequence[1] +
					"\npassword: " + sequence[2] +
					"\nprotocol_version: " + sequence[3];
			}
			else if (command == 0x02 && sequence.length == 1) {
				decoded = "ENUMERATE";
			}
			else if (command == 0x03 && sequence.length == 2) {
				decoded = "DESCRIBE" +
					"\nid: " + sequence[1];
			}
			else if (command == 0x04 && sequence.length == 2) {
				decoded = "READ PROPERTY" +
					"\nid: " + sequence[1];
			}
			else if (command == 0x05 && sequence.length == 4) {
				decoded = "WRITE PROPERTY" +
					"\nid: " + sequence[1] +
					"\nflags: " + this.writeFlagsToString(sequence[2]) +
					"\nvalue: " + sequence[3];
			}
			else if (command == 0x06 && sequence.length == 2) {
				decoded = "SUBSCRIBE PROPERTY" +
					"\nid: " + sequence[1];
			}
			else if (command == 0x07 && sequence.length == 2) {
				decoded = "UNSUBSCRIBE PROPERTY" +
					"\nid: " + sequence[1];
			}
			else if (command == 0x08 && sequence.length == 5) {
				decoded = "READ DATALOG" +
					"\nid: " + sequence[1] +
					"\nfrom: " + sequence[2] +
					"\nto: " + sequence[3] +
					"\nlimit: " + sequence[4];
			}
			else if (command == 0x09 && sequence.length == 4) {
				decoded = "READ MESSAGES" +
					"\nfrom: " + sequence[1]+
					"\nto: " + sequence[2] +
					"\nlimit: " + sequence[3];
			}
			else if (command == 0x81 && sequence.length == 4) {
				decoded = "AUTHORIZED" +
					"\naccess_level: " + this.accessLevelToString(sequence[1]) +
					"\nprotocol_version: " + sequence[2] +
					"\ngateway_version: " + sequence[3];
			}
			else if (command == 0x82 && sequence.length == 3) {
				decoded = "ENUMERATED" +
					"\nstatus: " + this.statusToString(sequence[1]) +
					"\ndevice_count: " + sequence[2];
			}
			else if (command == 0x83 && sequence.length == 4) {
				decoded = "DESCRIPTION" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2] +
					"\ndescription:\n" + JSON.stringify(sequence[3], null, '  ');
			}
			else if (command == 0x84 && sequence.length == 4) {
				decoded = "PROPERTY READ" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2] +
					"\nvalue: " + sequence[3];
			}
			else if (command == 0x85 && sequence.length == 3) {
				decoded = "PROPERTY WRITTEN" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2];
			}
			else if (command == 0x86 && sequence.length == 3) {
				decoded = "PROPERTY SUBSCRIBED" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2];
			}
			else if (command == 0xFE && sequence.length == 3) {
				decoded = "PROPERTY UPDATE" +
					"\nid: " + sequence[1] +
					"\nvalue: " + sequence[2];
			}
			else if (command == 0x87 && sequence.length == 3) {
				decoded = "PROPERTY UNSUBSCRIBED" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2];
			}
			else if (command == 0x88 && sequence.length == 5) {
				decoded = "DATALOG READ" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\nid: " + sequence[2] +
					"\ncount: " + sequence[3] +
					"\nresults:\n" + JSON.stringify(sequence[4], null, '  ');
			}
			else if (command == 0xFD && sequence.length == 6) {
				decoded = "DEVICE MESSAGE" +
					"\ntimestamp: " + sequence[1] +
					"\naccess_id: " + sequence[2] +
					"\ndevice_id: " + sequence[3] +
					"\nmessage_id: " + sequence[4] +
					"\nmessage: " + sequence[5];
			}
			else if (command == 0x89 && sequence.length == 4) {
				decoded = "MESSAGES READ" +
					"\nstatus: " +  this.statusToString(sequence[1]) +
					"\ncount: " + sequence[2] +
					"\nmessages:\n" + JSON.stringify(sequence[3], null, '  ');
			}
			else if (command === 0xFF && sequence.length == 2) {
				decoded = "ERROR" +
					"\nreason: " + sequence[1];
			}
			else {
				decoded = "Invalid frame!";
			}
		}

		return {
			command: command,
			description: decoded
		};
	}

	private static setCookie(name: string, value: any) {
		document.cookie = name + '=' + String(value);
	}

	private static getCookie(name: string): any {
		const parts = ('; ' + document.cookie).split('; ' + name + '=');
		if (parts.length == 2) {
			return parts.pop().split(";").shift();
		}
		return null;
	}

	private accessLevelToString(accessLevel?: number): string {
		switch (accessLevel) {
			case 0:
				return "None";
			case 1:
				return "Basic";
			case 2:
				return "Installer";
			case 3:
				return "Expert";
			case 4:
				return "QSP";
			case null:
				return "null";
			default:
				return "Invalid";
		}
	}

	private statusToString(status: number): string {
		switch (status) {
			case 0: return "Success";
			case 1: return "In progress";
			case -1: return "Error";
			case -2: return "No property";
			case -3: return "No device";
			case -4: return "No device access";
			case -5: return "Timeout";
			case -6: return "Invalid value";
			default: return "Unknown error";
		}
	}

	private writeFlagsToString(writeFlags?: number) {
		switch (writeFlags) {
			case 0:
				return "No flags";
			case 1:
				return "Permanent";
			case null:
				return "null";
			default:
				return "Invalid";
		}
	}


	private docsifyWM_: any;

	private device_: BluetoothDevice = null;
	private service_: BluetoothRemoteGATTService = null;
	private tx_: BluetoothRemoteGATTCharacteristic = null;
	private receivingFrame_ = new Uint8Array(0);

	private discoverButton: HTMLButtonElement = null;

	private io_: HTMLCollectionOf<HTMLDivElement> = null;

	private editTextarea_: HTMLTextAreaElement = null;
	private editVerifyRegex_ = new RegExp('^([0-9a-fA-F]{2})*$');
	private sendButton_: HTMLButtonElement = null;

	private log_: HTMLUListElement = null;
	private clearLogButton_: HTMLButtonElement = null;
	private followLogCheckbox_: HTMLInputElement = null;

	private testButtons_: HTMLButtonElement[] = [];
}

function hexToBytes(hex: string): Uint8Array {
	let bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; ++i) {
		bytes[i] = parseInt(hex.substring(2 * i, 2 * i + 2), 16);
	}
	return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
	let hex = '';
	bytes.forEach(function(byte) {
		hex += ('0' + (byte & 0xFF).toString(16)).slice(-2);
	});
	return hex;
}

function appendBuffer(buffer1, buffer2) {
	let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(new Uint8Array(buffer1), 0);
	tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return tmp.buffer;
}

function appendUInt8Arrays(array1, array2) {
	let tmp = new Uint8Array(array1.length + array2.length);
	tmp.set(array1, 0);
	tmp.set(array2, array1.length);
	return tmp;
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

					preview.innerText = bytesToHex(new Uint8Array(msg));
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
