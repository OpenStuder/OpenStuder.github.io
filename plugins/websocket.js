var websocketTestHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#websocket {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: flex-end;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\twidth: 75%;\n\t\tmin-width: 800px;\n\t\tmax-width: 1200px;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--textColor);\n\t\tborder-top: 1px solid var(--textColor);\n\t}\n\t\n\tdiv#websocket div {\n\t\tpadding: 8px;\n\t}\n\t\n\tdiv#websocket div.control {\n\t\tdisplay:flex;\n\t\tjustify-content: space-between;\n\t\talign-items: center;\n\t}\n\t\n\tdiv#websocket div.websocket-io {\n\t\tdisplay: flex;\n\t\tjustify-content: flex-end;\n\t\talign-items: start;\n\t}\n\t\n\tdiv#websocket div.websocket-io i {\n\t\tmargin: 12px;\n\t}\n\t\n\tdiv#websocket div.websocket-io[hidden] {\n\t\tdisplay: none;\n\t}\n\t\n\t#websocket b {\n\tcolor: var(--textColor);\n\t\tfont-size: 18px;\n\t}\n\t\n\t#websocket div.websocket-io div {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n\t\n\t#websocket input {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: 1px solid var(--textColor);\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#websocket input[type=number] {\n\t\twidth: 80px;\n\t}\n\t\n\t#websocket input[type=checkbox] {\n\t\tdisplay: none;\n\t}\n\t\n\t#websocket input[type=checkbox] + label i {\n\t\tbackground: none;\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 5px;\n\t\tcolor: var(--textColor);\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#websocket input[type=checkbox]:checked + label i {\n\t\tbackground: var(--textColor);\n\t\tcolor: var(--textBackground);\n\t}\n\t\n\t#websocket button {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: none;\n\t\tcolor: var(--textBackground);\n\t\tbackground: var(--textColor);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#websocket button[type=submit],\n\t#websocket button[type=reset]{\n\t\tbackground: none;\n\t\tcolor: var(--textColor);\n\t\tpadding: 0;\n\t}\n\t\n\t#websocket button:hover, \n\t.websocket-copy-button:hover,\n\t.websocket-send-button:hover {\n\t\tfilter: brightness(150%);\n\t}\n\t\n\t#websocket button:disabled,\n\t#websocket input:disabled,\n\t.websocket-copy-button:disabled,\n\t.websocket-send-button:disabled {\n\t\tfilter: opacity(25%);\n\t}\n\t\n\t#websocket textarea {\n\t\tresize: none;\n\t\tflex-grow: 2;\n\t\theight: 150px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .8rem;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t.websocket-copy-button {\n\t\tposition: absolute;\n\t\tbottom: 4px;\n\t\tright: 36px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.websocket-send-button {\n\t\tposition: absolute;\n\t\tbottom: 7px;\n\t\tright: 8px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.websocket-copy-button:hover,\n\t.websocket-send-button:hover {\n\t\tcolor: white;\n\t}\n\t\n\t#websocket ul.log {\n\t\toverflow-y: scroll;\n\t\tflex-grow: 2;\n\t\theight: 40vh;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .7rem;\n\t\tcolor: var(--accent);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 8px 24px;\n\t\tmargin: 0 2px;\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#websocket ul.log li {\n\t\twhite-space: pre;\n\t\tlist-style: none;\n\t\tpadding: 4px 4px 4px 8px;\n\t\tcolor: var(--textHighContrast);\n\t\tborder: 1px solid var(--textColor);\n\t\tbackground: hsla(0, 0%, 100%, 0.03);\n\t\tmargin-top: 8px;\n\t\toverflow-y: hidden;\n\t\toverflow-x: auto;\n\t\tborder-radius: 8px;\n\t\tmargin-left: 20%;\n\t\tbackground: var(--textBackground);\n\t\t-webkit-user-select: auto;\n\t\t-moz-user-select: auto;\n\t\t-ms-user-select: auto;\n\t\tuser-select: auto;\n\t}\n\t\n\t#websocket ul.log li.request {\n\t\tmargin-right: 20%;\n\t\tmargin-left: 0;\n\t\tbackground: var(--accentBackground);\n\t\tborder-color: var(--accent);\n\t}\n\t\n\t#websocket ul.log li.response {\n\t\tbackground: var(--secondaryBackground);\n\t\tborder-color: var(--secondary);\n\t}\n\t\n\t#websocket ul.log li.error {\n\t\tbackground: var(--warnBackground);\n\t\tborder-color: var(--warn);\n\t}\n\t\n\t#websocket ::-webkit-scrollbar {\n\t\twidth: 8px;\n\t\theight: 8px;\n\t\tborder-radius: 4px;\n\t}\n\n\t#websocket ::-webkit-scrollbar-track {\n\t\tborder-radius: 4px;\n\t\tborder: 1px solid hsla(0, 0%, 50%, 1);\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#websocket ::-webkit-scrollbar-corner {\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#websocket ::-webkit-scrollbar-thumb {\n\t\twidth: 8px;\n\t\tborder-radius: 4px;\n\t\tbackground: var(--background);\n\t\topacity: 0.75;\n\t}\n\n\t#websocket {\n\t\tscrollbar-color: hsla(0, 0%, 50%, .75) hsla(0, 0%, 50%, 0.25);\n\t\tscrollbar-width: thin;\n\t}\n</style>\n<div id=\"websocket\">\n    <div class=\"control\">\n\t<span>\n        <b>WebSocket connection</b>\n    </span>\n        <span>\n        <label for=\"websocket.ctrl.host\">Host:</label>\n        <input id=\"websocket.ctrl.host\" type=\"text\" value=\"localhost\"/>\n        <label for=\"websocket.ctrl.port\">Port:</label>\n        <input id=\"websocket.ctrl.port\" type=\"number\" value=\"1987\"/>\n        <button id=\"websocket.ctrl.button\">Connect</button>\n    </span>\n    </div>\n    <div class=\"websocket-io\" hidden>\n        <label for=\"websocket.io.tx\"><i class=\"material-icons\" style=\"font-size: 24px;\">edit</i></label>\n        <textarea id=\"websocket.io.tx\"></textarea>\n        <button id=\"websocket.io.send\" type=\"submit\" title=\"Send to gateway\" disabled><i class=\"material-icons\" style=\"font-size: 24px;\">send</i></button>\n    </div>\n    <div class=\"websocket-io\" hidden>\n        <label for=\"websocket.io.rx\"><i class=\"material-icons\" style=\"font-size: 24px;\"\t>forum</i></label>\n        <ul id=\"websocket.io.rx\" class=\"log\"></ul>\n        <div style=\"display: flex;align-items: center;justify-content: center;\">\n\t\t\t<button id=\"websocket.io.rx.clear\" type=\"reset\" title=\"Clear reception log\"><i class=\"material-icons\" style=\"font-size: 24px;\">delete_forever</i></button>\n\t\t\t<input type=\"checkbox\" id=\"websocket.io.rx.follow\" checked/>\n\t\t\t<label for=\"websocket.io.rx.follow\" title=\"Follow output\"><i class=\"material-icons\" style=\"font-size: 16px;\">vertical_align_bottom</i></label>\n\t\t</div>\n    </div>\n</div>\n";
var websocketProblemHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#websocket {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t\talign-items: center;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--warnBackground);\n\t\tbackground: var(--warn);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--warnBackground);\n\t\tborder-top: 1px solid var(--warnBackground);\n\t}\n\t\n\tdiv#websocket i, div#websocket span  {\n\t\tmargin: 4px;\n\t}\n\t\n\tdiv#websocket button {\n\t\toutline:none;\n\t\tmargin: 4px;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tborder: none;\n\t\tcolor: var(--warn);\n\t\tbackground: var(--warnBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n</style>\n<div id=\"websocket\">\n\t<i class=\"material-icons\">error</i>\n\t<span>\n\t\t<b>WebSocket connection testing not available when using HTTPS!</b>\n\t</span>\n\t<button onclick=\"window.location.protocol = 'http'\">Fix...</button>\n</div>\n";
var SIWebSocketTestConnection = /** @class */ (function () {
    function SIWebSocketTestConnection(hook, docsifyWM) {
        var _this = this;
        this.onConnectButtonClicked = function (_mouseEvent) {
            if (_this.websocket_ == null) {
                _this.websocket_ = new WebSocket('ws://' + _this.hostInput_.value + ':' + _this.portInput_.value);
                _this.websocket_.addEventListener('open', _this.onWebSocketOpen);
                _this.websocket_.addEventListener('message', _this.onWebSocketMessage);
                _this.websocket_.addEventListener('error', _this.onWebSocketError);
                _this.websocket_.addEventListener('close', _this.onWebSocketClosed);
                _this.hostInput_.disabled = true;
                _this.portInput_.disabled = true;
                _this.connectButton_.innerText = 'Cancel';
            }
            else {
                _this.websocket_.close();
            }
        };
        this.onSendButtonClicked = function (_mouseEvent) {
            var entry = document.createElement('li');
            entry.className = 'request';
            entry.innerText = _this.editTextarea_.value;
            _this.log_.insertAdjacentElement('beforeend', entry);
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            _this.websocket_.send(_this.editTextarea_.value);
        };
        this.onClearLogButtonClicked = function (_mouseEvent) {
            _this.log_.innerHTML = '';
        };
        this.onFollowLogCheckboxChanged = function (_event) {
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            SIWebSocketTestConnection.setCookie('logFollows', _this.followLogCheckbox_.checked);
        };
        this.onTxKeyDown = function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key == "Enter") {
                if (!_this.sendButton_.disabled) {
                    _this.onSendButtonClicked(null);
                }
                return false;
            }
        };
        this.onTxChanged = function (_event) {
            _this.sendButton_.disabled = !_this.editVerifyRegex_.test(_this.editTextarea_.value);
        };
        this.onTestCopyButtonClicked = function (event) {
            _this.editTextarea_.value = event.target.parentElement.parentElement.querySelector('code').innerHTML.split('<br>').join('\n');
            _this.onTxChanged(null);
        };
        this.onTestSendButtonClicked = function (event) {
            _this.editTextarea_.value = event.target.parentElement.parentElement.querySelector('code').innerHTML.split('<br>').join('\n');
            _this.onTxChanged(null);
            _this.onSendButtonClicked(null);
        };
        this.onWebSocketOpen = function (_openEvent) {
            SIWebSocketTestConnection.setCookie('host', _this.hostInput_.value);
            SIWebSocketTestConnection.setCookie('port', _this.portInput_.value);
            for (var i = 0; i < _this.io_.length; ++i) {
                _this.io_[i].hidden = false;
            }
            _this.connectButton_.innerText = 'Disconnect';
            _this.testButtons_.forEach(function (button) { return button.disabled = false; });
        };
        this.onWebSocketMessage = function (messageEvent) {
            var entry = document.createElement('li');
            if (messageEvent.data.indexOf('ERROR\n') == 0) {
                entry.className = 'error';
            }
            else if (messageEvent.data.indexOf('PROPERTY UPDATE\n') == 0 || messageEvent.data.indexOf('DEVICE MESSAGE\n') == 0) {
                entry.className = '';
            }
            else {
                entry.className = 'response';
            }
            if (messageEvent.data.indexOf('DESCRIPTION\n') == 0 || messageEvent.data.indexOf('MESSAGES READ\n') == 0 || messageEvent.data.indexOf('PROPERTIES READ\n') == 0 ||
                messageEvent.data.indexOf('PROPERTIES SUBSCRIBED\n') == 0 || messageEvent.data.indexOf('PROPERTIES UNSUBSCRIBED\n') == 0) {
                var parts = messageEvent.data.split('\n\n');
                if (parts.length == 2 && parts[1]) {
                    entry.innerText = parts[0] + '\n\n';
                    var json = JSON.parse(parts[1]);
                    entry.innerText += JSON.stringify(json, null, '  ');
                }
                else {
                    entry.innerText = messageEvent.data;
                }
            }
            else {
                entry.innerText = messageEvent.data;
            }
            _this.log_.insertAdjacentElement('beforeend', entry);
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            var command = messageEvent.data.split('\n')[0];
            var exampleMessage = document.querySelector('[data-ws-example="' + command + '"]');
            if (exampleMessage) {
                exampleMessage.firstElementChild.innerHTML = '<code>' + messageEvent.data + '</code>';
            }
        };
        this.onWebSocketError = function (_errorEvent) { };
        this.onWebSocketClosed = function (closeEvent) {
            if (closeEvent.code != 1000) {
                alert('Websocket connection error!');
            }
            _this.websocket_ = null;
            _this.connectButton_.innerText = 'Connect';
            for (var i = 0; i < _this.io_.length; ++i) {
                _this.io_[i].hidden = true;
            }
            _this.hostInput_.disabled = false;
            _this.portInput_.disabled = false;
            _this.testButtons_.forEach(function (button) { return button.disabled = true; });
            _this.log_.innerHTML = '';
            _this.editTextarea_.value = '';
        };
        this.websocket_ = null;
        this.hostInput_ = null;
        this.portInput_ = null;
        this.connectButton_ = null;
        this.io_ = null;
        this.editTextarea_ = null;
        this.editVerifyRegex_ = new RegExp('^[A-Z ]+\\n([a-z_]+:.*\\n)*\\n(.|\n)*$');
        this.sendButton_ = null;
        this.log_ = null;
        this.clearLogButton_ = null;
        this.followLogCheckbox_ = null;
        this.testButtons_ = [];
        this.docsifyWM_ = docsifyWM;
        hook.doneEach(function () {
            if (docsifyWM.route.path.indexOf('/websocket') == 0) {
                if (window.location.protocol == 'https:') {
                    document.body.insertAdjacentHTML('beforeend', websocketProblemHtml);
                    return;
                }
                document.body.insertAdjacentHTML('beforeend', websocketTestHtml);
                _this.hostInput_ = document.getElementById('websocket.ctrl.host');
                var host = SIWebSocketTestConnection.getCookie('host');
                if (host != null) {
                    _this.hostInput_.value = host;
                }
                _this.portInput_ = document.getElementById('websocket.ctrl.port');
                var port = SIWebSocketTestConnection.getCookie('port');
                if (port != null) {
                    _this.portInput_.value = port;
                }
                _this.connectButton_ = document.getElementById('websocket.ctrl.button');
                _this.connectButton_.onclick = _this.onConnectButtonClicked;
                _this.io_ = document.getElementsByClassName('websocket-io');
                _this.editTextarea_ = document.getElementById('websocket.io.tx');
                _this.editTextarea_.onkeydown = _this.onTxKeyDown;
                _this.editTextarea_.onkeyup = _this.onTxChanged;
                _this.editTextarea_.onpaste = _this.onTxChanged;
                _this.sendButton_ = document.getElementById('websocket.io.send');
                _this.sendButton_.onclick = _this.onSendButtonClicked;
                _this.log_ = document.getElementById('websocket.io.rx');
                _this.clearLogButton_ = document.getElementById('websocket.io.rx.clear');
                _this.clearLogButton_.onclick = _this.onClearLogButtonClicked;
                _this.followLogCheckbox_ = document.getElementById('websocket.io.rx.follow');
                var logFollows = SIWebSocketTestConnection.getCookie('logFollows');
                if (logFollows != null) {
                    _this.followLogCheckbox_.checked = logFollows == 'true';
                }
                _this.followLogCheckbox_.onchange = _this.onFollowLogCheckboxChanged;
                var requests = document.querySelectorAll('pre[data-ws-try]');
                for (var i = 0; i < requests.length; ++i) {
                    var editButton = document.createElement('button');
                    editButton.title = "Copy to edit field.";
                    editButton.disabled = true;
                    editButton.className = 'websocket-copy-button';
                    editButton.classList.add('copy');
                    editButton.innerHTML = '<i class="material-icons" style="font-size: 24px;">read_more</i>';
                    editButton.onclick = _this.onTestCopyButtonClicked;
                    requests[i].appendChild(editButton);
                    _this.testButtons_.push(editButton);
                    var sendButton = document.createElement('button');
                    sendButton.title = "Send to connected gateway.";
                    sendButton.disabled = true;
                    sendButton.className = 'websocket-send-button';
                    sendButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">send</i>';
                    sendButton.onclick = _this.onTestSendButtonClicked;
                    requests[i].appendChild(sendButton);
                    _this.testButtons_.push(sendButton);
                }
            }
            else {
                if (_this.websocket_ != null) {
                    _this.websocket_.close();
                    _this.websocket_ = null;
                }
                _this.testButtons_ = [];
                if (_this.clearLogButton_ != null)
                    _this.clearLogButton_.onclick = null;
                _this.clearLogButton_ = null;
                if (_this.followLogCheckbox_ != null)
                    _this.followLogCheckbox_.onchange = null;
                _this.followLogCheckbox_ = null;
                _this.log_ = null;
                if (_this.sendButton_ != null)
                    _this.sendButton_.onclick = null;
                _this.sendButton_ = null;
                if (_this.editTextarea_ != null) {
                    _this.editTextarea_.onkeyup = _this.onTxChanged;
                    _this.editTextarea_.onpaste = _this.onTxChanged;
                }
                _this.editTextarea_ = null;
                _this.io_ = null;
                if (_this.connectButton_ != null)
                    _this.connectButton_.onclick = null;
                _this.connectButton_ = null;
                _this.hostInput_ = null;
                _this.portInput_ = null;
                var wsElement = document.getElementById('websocket');
                if (wsElement != null)
                    wsElement.remove();
            }
        });
    }
    SIWebSocketTestConnection.setCookie = function (name, value) {
        document.cookie = name + '=' + String(value);
    };
    SIWebSocketTestConnection.getCookie = function (name) {
        var parts = ('; ' + document.cookie).split('; ' + name + '=');
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
        return null;
    };
    return SIWebSocketTestConnection;
}());
function docsifyWebSocketPlugin(hook, vm) {
    hook.doneEach(function () {
        document.querySelectorAll('.ws-api-doc').forEach(function (docElement) {
            var preview = docElement.querySelector('code[data-ws-preview]');
            if (preview) {
                var headers_1 = docElement.querySelectorAll('[data-ws-header]');
                var additionalHeaders_1 = docElement.querySelector('[data-ws-headers]');
                var body_1 = docElement.querySelector('[data-ws-body]');
                var renderPreview_1 = function () {
                    var msg = String(preview.dataset.wsPreview) + '\n';
                    headers_1.forEach(function (headerElement) {
                        if (headerElement.tagName.toLowerCase() == 'input') {
                            var element = headerElement;
                            var value = element.value;
                            if (element.validity.valid && value || 'wsRequired' in element.dataset) {
                                msg += headerElement.dataset.wsHeader + ':' + value + '\n';
                            }
                        }
                        else if (headerElement.tagName.toLowerCase() == 'select') {
                            var element = headerElement;
                            if (element.multiple) {
                                var options = element.options;
                                var forceFlags = false;
                                var flags = '';
                                for (var i = 0; i < options.length; ++i) {
                                    if (options[i].selected) {
                                        if (options[i].value != '__EMPTY__') {
                                            flags += options[i].value + ',';
                                        }
                                        else {
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
                            }
                            else {
                                var value = element.value;
                                if (value || 'wsRequired' in element.dataset) {
                                    msg += headerElement.dataset.wsHeader + ':' + value + '\n';
                                }
                            }
                        }
                    });
                    if (additionalHeaders_1) {
                        msg += additionalHeaders_1.value;
                        if (msg[msg.length - 1] != '\n') {
                            msg += '\n';
                        }
                    }
                    msg += '\n';
                    if (body_1) {
                        msg += body_1.value;
                    }
                    preview.innerText = msg;
                };
                headers_1.forEach(function (element) {
                    element.onchange = renderPreview_1;
                    element.onkeyup = renderPreview_1;
                });
                if (additionalHeaders_1) {
                    additionalHeaders_1.onchange = renderPreview_1;
                    additionalHeaders_1.onkeyup = renderPreview_1;
                }
                if (body_1) {
                    body_1.onchange = renderPreview_1;
                    body_1.onkeyup = renderPreview_1;
                }
                renderPreview_1();
            }
        });
    });
    window.testWS = new SIWebSocketTestConnection(hook, vm);
}
var docsify = window.$docsify || {};
docsify.plugins = [docsifyWebSocketPlugin].concat(docsify.plugins || []);
