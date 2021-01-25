const websocketTestHtml = `
<!--suppress CssUnresolvedCustomProperty -->
<style>
	div#websocket {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: fixed;
		bottom: 0;
		right: 0;
		width: 75%;
		max-width: 1200px;
		padding: 12px 32px;
		color: var(--background);
		background: var(--accent);
		font-size: 16px;
		border-top-left-radius: 12px;
		border-left: 1px solid hsla(0, 0%, 100%, 0.25);
		border-top: 1px solid hsla(0, 0%, 100%, 0.25);
	}
	
	div#websocket div {
		padding: 8px;
	}
	
	div#websocket div.control {
		display:flex;
		justify-content: space-between;
		align-items: center;
	}
	
	div#websocket div.websocket-io {
		display: flex;
		justify-content: flex-end;
		align-items: start;
	}
	
	div#websocket div.websocket-io i {
		margin: 12px;
	}
	
	div#websocket div.websocket-io[hidden] {
		display: none;
	}
	
	#websocket b {
		font-size: 18px;
	}
	
	#websocket div.websocket-io div {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
	}
	
	#websocket input {
		outline:none;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		font-size: 15px;
		border: 1px solid var(--background);
		color: var(--background);
		background: var(--accent);
		border-radius: 12px;
		padding: 4px 12px;
	}
	
	#websocket input[type=number] {
		width: 80px;
	}
	
	#websocket input[type=checkbox] {
		display: none;
	}
	
	#websocket input[type=checkbox] + label i {
		background: none;
		border: 1px solid var(--background);
		border-radius: 5px;
		color: var(--background);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#websocket input[type=checkbox]:checked + label i {
		background: var(--background);
		color: var(--accent);
	}
	
	#websocket button {
		outline:none;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		font-size: 15px;
		border: none;
		color: var(--accent);
		background: var(--background);
		border-radius: 12px;
		padding: 4px 12px;
	}
	
	#websocket button[type=submit],
	#websocket button[type=reset]{
		background: none;
		color: var(--background);
		padding: 0;
	}
	
	#websocket button:hover, 
	.websocket-copy-button:hover,
	.websocket-send-button:hover {
		filter: brightness(200%);
	}
	
	#websocket button:disabled,
	#websocket input:disabled,
	.websocket-copy-button:disabled,
	.websocket-send-button:disabled {
		filter: opacity(25%);
	}
	
	#websocket textarea {
		resize: none;
		flex-grow: 2;
		height: 150px;
		outline:none;
		-webkit-appearance: none;
		font-family: Roboto Mono, Monaco, courier, monospace;
		font-size: .8rem;
		border: none;
		color: var(--accent);
		background: var(--background);
		border-radius: 6px;
		padding: 4px 12px;
	}
	
	.websocket-copy-button {
		position: absolute;
		bottom: 4px;
		right: 36px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accent);
		background: none;
	}
	
	.websocket-send-button {
		position: absolute;
		bottom: 7px;
		right: 8px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accent);
		background: none;
	}
	
	#websocket ul.log {
		overflow-y: scroll;
		flex-grow: 2;
		height: 40vh;
		font-family: Roboto Mono, Monaco, courier, monospace;
		font-size: .7rem;
		border: none;
		color: var(--accent);
		background: var(--background);
		border-radius: 6px;
		padding: 8px 24px;
		margin: 0 2px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#websocket ul.log li {
		white-space: pre;
		list-style: none;
		padding: 4px 4px 4px 8px;
		color: black;
		border: 1px solid hsla(0, 0%, 50%, 0.5);
		background: hsla(0, 0%, 100%, 0.03);
		margin-top: 8px;
		overflow-y: hidden;
		overflow-x: auto;
		border-radius: 8px;
	}
	
	#websocket ul.log li.request {
		margin-right: 20%;
		background: hsla(0, 0%, 60%, 0.75);
	}
	
	#websocket ul.log li.response {
		margin-left: 20%;
		background: hsla(131, 45%, 45%, 0.75);
	}
	
	#websocket ul.log li.error {
		margin-left: 20%	;
		background: hsla(11, 45%, 45%, 0.75);
	}
</style>
<div id="websocket">
    <div class="control">
	<span>
        <b>WebSocket connection</b>
    </span>
        <span>
        <label for="websocket.ctrl.host">Host:</label>
        <input id="websocket.ctrl.host" type="text" value="localhost"/>
        <label for="websocket.ctrl.port">Port:</label>
        <input id="websocket.ctrl.port" type="number" value="1987"/>
        <button id="websocket.ctrl.button">Connect</button>
    </span>
    </div>
    <div class="websocket-io" hidden>
        <label for="websocket.io.tx"><i class="material-icons" style="font-size: 24px;">edit</i></label>
        <textarea id="websocket.io.tx"></textarea>
        <button id="websocket.io.send" type="submit" title="Send to gateway" disabled><i class="material-icons" style="font-size: 24px;">send</i></button>
    </div>
    <div class="websocket-io" hidden>
        <label for="websocket.io.rx"><i class="material-icons" style="font-size: 24px;"	>forum</i></label>
        <ul id="websocket.io.rx" class="log"></ul>
        <div style="display: flex;align-items: center;justify-content: center;">
			<button id="websocket.io.rx.clear" type="reset" title="Clear reception log"><i class="material-icons" style="font-size: 24px;">delete_forever</i></button>
			<input type="checkbox" id="websocket.io.rx.follow" checked/>
			<label for="websocket.io.rx.follow" title="Follow output"><i class="material-icons" style="font-size: 16px;">vertical_align_bottom</i></label>
		</div>
    </div>
</div>
`;

class SIWebSocketTestConnection {
	constructor(hook: any, docsifyWM: any) {
		this.docsifyWM_ = docsifyWM;

		hook.doneEach(() => {
			if (docsifyWM.route.path == '/websocket') {
				document.body.insertAdjacentHTML('beforeend', websocketTestHtml);

				this.hostInput_ = document.getElementById('websocket.ctrl.host') as HTMLInputElement;
				const host = SIWebSocketTestConnection.getCookie('host');
				if (host != null) {
					this.hostInput_.value = host;
				}
				this.portInput_ = document.getElementById('websocket.ctrl.port') as HTMLInputElement;
				const port = SIWebSocketTestConnection.getCookie('port');
				if (port != null) {
					this.portInput_.value = port;
				}
				this.connectButton_ = document.getElementById('websocket.ctrl.button') as HTMLButtonElement;
				this.connectButton_.onclick  = this.onConnectButtonClicked;

				this.io_ = document.getElementsByClassName('websocket-io') as HTMLCollectionOf<HTMLDivElement>;

				this.editTextarea_ = document.getElementById('websocket.io.tx') as HTMLTextAreaElement;
				this.editTextarea_.onkeyup = this.onTxChanged;
				this.editTextarea_.onpaste = this.onTxChanged;
				this.sendButton_ = document.getElementById('websocket.io.send') as HTMLButtonElement;
				this.sendButton_.onclick = this.onSendButtonClicked;

				this.log_ = document.getElementById('websocket.io.rx') as HTMLUListElement;
				this.clearLogButton_ = document.getElementById('websocket.io.rx.clear') as HTMLButtonElement;
				this.clearLogButton_.onclick = this.onClearLogButtonClicked;
				this.followLogCheckbox_ = document.getElementById('websocket.io.rx.follow') as HTMLInputElement;
				const logFollows = SIWebSocketTestConnection.getCookie('logFollows');
				if (logFollows != null) {
					this.followLogCheckbox_.checked = logFollows == 'true';
				}
				this.followLogCheckbox_.onchange = this.onFollowLogCheckboxChanged;

				const requests = document.querySelectorAll('pre[data-lang=wsreq]');
				for (let i = 0; i < requests.length; ++i) {
					const editButton = document.createElement('button') as HTMLButtonElement;
					editButton.title = "Copy to edit field.";
					editButton.disabled = true;
					editButton.className = 'websocket-copy-button';
					editButton.classList.add('copy');
					editButton.innerHTML = '<i class="material-icons" style="font-size: 24px;">read_more</i>';
					editButton.onclick = this.onTestCopyButtonClicked;
					requests[i].appendChild(editButton);
					this.testButtons_.push(editButton);

					const sendButton = document.createElement('button') as HTMLButtonElement;
					sendButton.title = "Send to connected gateway.";
					sendButton.disabled = true;
					sendButton.className = 'websocket-send-button';
					sendButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">send</i>';
					sendButton.onclick = this.onTestSendButtonClicked;
					requests[i].appendChild(sendButton);
					this.testButtons_.push(sendButton);
				}
			} else {
				if (this.websocket_ != null) {
					this.websocket_.close();
					this.websocket_ = null;
				}

				this.testButtons_ = [];

				if (this.clearLogButton_ != null) this.clearLogButton_.onclick = null;
				this.clearLogButton_ = null;
				if (this.followLogCheckbox_ != null) this.followLogCheckbox_.onchange = null;
				this.followLogCheckbox_ = null;
				this.log_ = null;

				if (this.sendButton_ != null) this.sendButton_.onclick = null;
				this.sendButton_ = null;

				if (this.editTextarea_ != null) {
					this.editTextarea_.onkeyup = this.onTxChanged;
					this.editTextarea_.onpaste = this.onTxChanged;
				}
				this.editTextarea_ = null;

				this.io_ = null;

				if (this.connectButton_ != null) this.connectButton_.onclick = null;
				this.connectButton_ = null;
				this.hostInput_ = null;
				this.portInput_ = null;

				const wsElement = document.getElementById('websocket');
				if (wsElement != null) wsElement.remove();
			}
		});
	}

	private onConnectButtonClicked = (_mouseEvent: MouseEvent) => {
		if (this.websocket_ == null) {
			this.websocket_ = new WebSocket('ws://' + this.hostInput_.value + ':' + this.portInput_.value);
			this.websocket_.addEventListener('open', this.onWebSocketOpen);
			this.websocket_.addEventListener('message', this.onWebSocketMessage);
			this.websocket_.addEventListener('error', this.onWebSocketError);
			this.websocket_.addEventListener('close', this.onWebSocketClosed);

			this.hostInput_.disabled = true;
			this.portInput_.disabled = true;
			this.connectButton_.innerText = 'Cancel';
		} else {
			this.websocket_.close();
		}
	};

	private onSendButtonClicked = (_mouseEvent: MouseEvent) => {
		const entry = document.createElement('li');
		entry.className = 'request';
		entry.innerText = this.editTextarea_.value;
		this.log_.insertAdjacentElement('beforeend', entry);
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}
		this.websocket_.send(this.editTextarea_.value);
	};

	private onClearLogButtonClicked = (_mouseEvent: MouseEvent) => {
		this.log_.innerHTML = '';
	}

	private onFollowLogCheckboxChanged = (_event: Event) => {
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}
		SIWebSocketTestConnection.setCookie('logFollows', this.followLogCheckbox_.checked);
	}

	private onTxChanged = (_event: Event) => {
		this.sendButton_.disabled = !this.editVerifyRegex_.test(this.editTextarea_.value);
	};

	private onTestCopyButtonClicked = (event: MouseEvent) => {
		this.editTextarea_.value = (event.target as HTMLElement).parentElement.parentElement.firstElementChild.innerHTML;
		this.onTxChanged(null);
	}

	private onTestSendButtonClicked = (event: MouseEvent) => {
		this.editTextarea_.value = (event.target as HTMLElement).parentElement.parentElement.firstElementChild.innerHTML;
		this.onTxChanged(null);
		this.onSendButtonClicked(null);
	}

	private onWebSocketOpen = (_openEvent: Event) => {
		SIWebSocketTestConnection.setCookie('host', this.hostInput_.value);
		SIWebSocketTestConnection.setCookie('port', this.portInput_.value);
		for (let i = 0; i < this.io_.length; ++i) {
			this.io_[i].hidden = false;
		}
		this.connectButton_.innerText = 'Disconnect';
		this.testButtons_.forEach((button: HTMLButtonElement) => button.disabled = false);
	};

	private onWebSocketMessage = (messageEvent: MessageEvent) => {
		const entry = document.createElement('li');
		if (messageEvent.data.startsWith('ERROR\n')) {
			entry.className = 'error';
		} else if (messageEvent.data.includes('status:')) {
			if (messageEvent.data.includes('status:Success\n')) {
				entry.className = 'response';
			} else {
				entry.className = 'error';
			}
		} else {
			entry.className = 'response';
		}
		if (messageEvent.data.startsWith('DESCRIPTION\n')) {
			const parts = messageEvent.data.split('\n\n');
			if (parts.length == 2 && parts[1]) {
				entry.innerText = parts[0] + '\n\n';
				const json = JSON.parse(parts[1]);
				entry.innerText += JSON.stringify(json, null, '  ');
			} else {
				entry.innerText = messageEvent.data;
			}
		} else {
			entry.innerText = messageEvent.data;
		}
		this.log_.insertAdjacentElement('beforeend', entry);
		if (this.followLogCheckbox_.checked) {
			this.log_.scrollTop = this.log_.scrollHeight;
		}
	};

	private onWebSocketError = (_errorEvent: Event) => {};

	private onWebSocketClosed = (closeEvent: CloseEvent) => {
		if (closeEvent.code != 1000) {
			alert('Websocket connection error!');
		}

		this.websocket_ = null;
		this.connectButton_.innerText = 'Connect';
		for (let i = 0; i < this.io_.length; ++i) {
			this.io_[i].hidden = true;
		}
		this.hostInput_.disabled = false;
		this.portInput_.disabled = false;

		this.testButtons_.forEach((button: HTMLButtonElement) => button.disabled = true);

		this.log_.innerHTML = '';
		this.editTextarea_.value = '';
	};

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

	private docsifyWM_: any;

	private websocket_: WebSocket = null;

	private hostInput_: HTMLInputElement = null;
	private portInput_: HTMLInputElement = null;
	private connectButton_: HTMLButtonElement = null;

	private io_: HTMLCollectionOf<HTMLDivElement> = null;

	private editTextarea_: HTMLTextAreaElement = null;
	private editVerifyRegex_ = new RegExp('^[A-Z ]+\\n([a-z_]+:[a-z0-9A-Z_.]+\\n)*\\n$');
	private sendButton_: HTMLButtonElement = null;

	private log_: HTMLUListElement = null;
	private clearLogButton_: HTMLButtonElement = null;
	private followLogCheckbox_: HTMLInputElement = null;

	private testButtons_: HTMLButtonElement[] = [];
}

function docsifyPlugin(hook: any, vm: any) {
	(window as any).testWS = new SIWebSocketTestConnection(hook, vm);
}

let docsify = (window as any).$docsify || {};
docsify.plugins = [docsifyPlugin].concat(docsify.plugins || []);
