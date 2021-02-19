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
	color: var(--textColor);
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
		border: 1px solid var(--textColor);
		color: var(--textColor);
		background: var(--textBackground);
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
		border: 1px solid var(--textColor);
		border-radius: 5px;
		color: var(--textColor);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	#websocket input[type=checkbox]:checked + label i {
		background: var(--textColor);
		color: var(--textBackground);
	}
	
	#websocket button {
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
	
	#websocket button[type=submit],
	#websocket button[type=reset]{
		background: none;
		color: var(--textColor);
		padding: 0;
	}
	
	#websocket button:hover, 
	.websocket-copy-button:hover,
	.websocket-send-button:hover {
		filter: brightness(150%);
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
		color: var(--textColor);
		background: var(--background);
		border: 1px solid var(--textColor);
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
		color: var(--accentBackground);
		background: none;
	}
	
	.websocket-send-button {
		position: absolute;
		bottom: 7px;
		right: 8px;
		outline:none;
		-webkit-appearance: none;
		border: none;
		color: var(--accentBackground);
		background: none;
	}
	
	.websocket-copy-button:hover,
	.websocket-send-button:hover {
		color: white;
	}
	
	#websocket ul.log {
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
	
	#websocket ul.log li {
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
	
	#websocket ul.log li.request {
		margin-right: 20%;
		margin-left: 0;
		background: var(--accentBackground);
		border-color: var(--accent);
	}
	
	#websocket ul.log li.response {
		background: var(--secondaryBackground);
		border-color: var(--secondary);
	}
	
	#websocket ul.log li.error {
		background: var(--warnBackground);
		border-color: var(--warn);
	}
	
	#websocket ::-webkit-scrollbar {
		width: 8px;
		height: 8px;
		border-radius: 4px;
	}

	#websocket ::-webkit-scrollbar-track {
		border-radius: 4px;
		border: 1px solid hsla(0, 0%, 50%, 1);
		background: var(--textColor);
		opacity: 0.75;
	}

	#websocket ::-webkit-scrollbar-corner {
		background: var(--textColor);
		opacity: 0.75;
	}

	#websocket ::-webkit-scrollbar-thumb {
		width: 8px;
		border-radius: 4px;
		background: var(--background);
		opacity: 0.75;
	}

	#websocket {
		scrollbar-color: hsla(0, 0%, 50%, .75) hsla(0, 0%, 50%, 0.25);
		scrollbar-width: thin;
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

const websocketProblemHtml = `
<!--suppress CssUnresolvedCustomProperty -->
<style>
	div#websocket {
		display: flex;
		flex-direction: column;
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
	
	div#websocket div {
		padding: 8px;
	}
	
	div#websocket button {
		outline:none;
		-webkit-appearance: none;
		font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
		border: none;
		color: var(--warn);
		background: var(--warnBackground);
		border-radius: 12px;
		padding: 4px 12px;
	}
</style>
<div id="websocket">
    <div>
   		<i class="material-icons">error</i>
		<span>
        	<b>WebSocket connection testing not available on using HTTPS!</b>
    	</span>
    	<button onclick="window.location = 'http:'; window.location.reload();">Fix...</button>
    </div>
</div>
`

class SIWebSocketTestConnection {
	constructor(hook: any, docsifyWM: any) {
		this.docsifyWM_ = docsifyWM;

		hook.doneEach(() => {
			if (docsifyWM.route.path.indexOf('/websocket') == 0) {
				if (window.location.protocol == 'https:') {
					document.body.insertAdjacentHTML('beforeend', websocketProblemHtml);
					return;
				}

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
				this.editTextarea_.onkeydown = this.onTxKeyDown;
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

				const requests = document.querySelectorAll('pre[data-ws-try]');
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
		if (messageEvent.data.indexOf('ERROR\n') == 0) {
			entry.className = 'error';
		} else if (messageEvent.data.indexOf('PROPERTY UPDATE\n') == 0 || messageEvent.data.indexOf('DEVICE MESSAGE\n') == 0) {
			entry.className = '';
		} else {
			entry.className = 'response';
		}
		if (messageEvent.data.indexOf('DESCRIPTION\n') == 0 || messageEvent.data.indexOf('MESSAGES READ\n') == 0) {
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

		const command = messageEvent.data.split('\n')[0];
		const exampleMessage = document.querySelector<HTMLPreElement>('[data-ws-example="' + command + '"]');
		if (exampleMessage) {
			exampleMessage.firstElementChild .innerHTML = '<code>' + messageEvent.data + '</code>';
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
	private editVerifyRegex_ = new RegExp('^[A-Z ]+\\n([a-z_]+:.*\\n)*\\n$');
	private sendButton_: HTMLButtonElement = null;

	private log_: HTMLUListElement = null;
	private clearLogButton_: HTMLButtonElement = null;
	private followLogCheckbox_: HTMLInputElement = null;

	private testButtons_: HTMLButtonElement[] = [];
}

function docsifyPlugin(hook: any, vm: any) {
	hook.doneEach(() => {
		document.querySelectorAll<HTMLDivElement>('.ws-api-doc').forEach((docElement: HTMLDivElement) => {
			const preview = docElement.querySelector<HTMLElement>('code[data-ws-preview]');
			if (preview) {
				const headers = docElement.querySelectorAll<HTMLElement>('[data-ws-header]');

				const renderPreview = () => {
					let msg = String(preview.dataset.wsPreview) + '\n';
					headers.forEach((headerElement: HTMLElement) => {
						if (headerElement.tagName.toLowerCase() == 'input') {
							const element = headerElement as HTMLInputElement;
							const value = element.value;
							if (element.validity.valid && value || 'wsRequired' in element.dataset) {
								msg += headerElement.dataset.wsHeader + ':' + value + '\n';
							}
						} else if (headerElement.tagName.toLowerCase() == 'select') {
							const element = headerElement as HTMLSelectElement;
							if (element.multiple) {
								const options = element.options;
								let forceFlags = false;
								let flags = '';
								for (let i = 0; i < options.length; ++i) {
									if (options[i].selected) {
										if (options[i].value != '__EMPTY__') {
											flags += options[i].value + ',';
										} else {
											forceFlags = true;
										}
									}
								}
								if (flags[flags.length - 1] == ',') {
									flags = flags.slice(0, flags.length - 1);
								}
								if (flags || forceFlags || 'wsRequired' in element.dataset) {
									msg += headerElement.dataset.wsHeader + ':' + flags + '\n';
								}
							} else {
								const value = element.value;
								if (value || 'wsRequired' in element.dataset) {
									msg += headerElement.dataset.wsHeader + ':' + value + '\n';
								}
							}
						}

					});
					msg += '\n';
					preview.innerText = msg;
				};

				headers.forEach((element: HTMLElement) => {
					element.onchange = renderPreview;
					element.onkeyup = renderPreview;
				});

				renderPreview();
			}
		});
	});

	(window as any).testWS = new SIWebSocketTestConnection(hook, vm);
}

let docsify = (window as any).$docsify || {};
docsify.plugins = [docsifyPlugin].concat(docsify.plugins || []);
