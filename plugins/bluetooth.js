var bluetoothTestHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#bluetooth {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: flex-end;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\twidth: 75%;\n\t\tmin-width: 800px;\n\t\tmax-width: 1200px;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--textColor);\n\t\tborder-top: 1px solid var(--textColor);\n\t}\n\t\n\tdiv#bluetooth div {\n\t\tpadding: 8px;\n\t}\n\t\n\tdiv#bluetooth div.control {\n\t\tdisplay:flex;\n\t\tjustify-content: space-between;\n\t\talign-items: center;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io {\n\t\tdisplay: flex;\n\t\tjustify-content: flex-end;\n\t\talign-items: start;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io i {\n\t\tmargin: 12px;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io[hidden] {\n\t\tdisplay: none;\n\t}\n\t\n\t#bluetooth b {\n\tcolor: var(--textColor);\n\t\tfont-size: 18px;\n\t}\n\t\n\t#bluetooth div.bluetooth-io div {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n\t\n\t#bluetooth input {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: 1px solid var(--textColor);\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#bluetooth input[type=number] {\n\t\twidth: 80px;\n\t}\n\t\n\t#bluetooth input[type=checkbox] {\n\t\tdisplay: none;\n\t}\n\t\n\t#bluetooth input[type=checkbox] + label i {\n\t\tbackground: none;\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 5px;\n\t\tcolor: var(--textColor);\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#bluetooth input[type=checkbox]:checked + label i {\n\t\tbackground: var(--textColor);\n\t\tcolor: var(--textBackground);\n\t}\n\t\n\t#bluetooth button {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: none;\n\t\tcolor: var(--textBackground);\n\t\tbackground: var(--textColor);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#bluetooth button[type=submit],\n\t#bluetooth button[type=reset]{\n\t\tbackground: none;\n\t\tcolor: var(--textColor);\n\t\tpadding: 0;\n\t}\n\t\n\t#bluetooth button:hover, \n\t.bluetooth-copy-button:hover,\n\t.bluetooth-send-button:hover {\n\t\tfilter: brightness(150%);\n\t}\n\t\n\t#bluetooth button:disabled,\n\t#bluetooth input:disabled,\n\t.bluetooth-copy-button:disabled,\n\t.bluetooth-send-button:disabled {\n\t\tfilter: opacity(25%);\n\t}\n\t\n\t#bluetooth textarea {\n\t\tresize: none;\n\t\tflex-grow: 2;\n\t\theight: 150px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .8rem;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t.bluetooth-copy-button {\n\t\tposition: absolute;\n\t\tbottom: 4px;\n\t\tright: 36px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.bluetooth-send-button {\n\t\tposition: absolute;\n\t\tbottom: 7px;\n\t\tright: 8px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.bluetooth-copy-button:hover,\n\t.bluetooth-send-button:hover {\n\t\tcolor: white;\n\t}\n\t\n\t#bluetooth ul.log {\n\t\toverflow-y: scroll;\n\t\tflex-grow: 2;\n\t\theight: 40vh;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .7rem;\n\t\tcolor: var(--accent);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 8px 24px;\n\t\tmargin: 0 2px;\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#bluetooth ul.log li {\n\t\tlist-style: none;\n\t\tpadding: 4px 4px 4px 8px;\n\t\tcolor: var(--textHighContrast);\n\t\tborder: 1px solid var(--textColor);\n\t\tbackground: hsla(0, 0%, 100%, 0.03);\n\t\tmargin-top: 8px;\n\t\toverflow-y: hidden;\n\t\toverflow-x: auto;\n\t\tborder-radius: 8px;\n\t\tmargin-left: 50%;\n\t\tbackground: var(--textBackground);\n\t\t-webkit-user-select: auto;\n\t\t-moz-user-select: auto;\n\t\t-ms-user-select: auto;\n\t\tuser-select: auto;\n\t}\n\t\n\t#bluetooth ul.log li.request {\n\t\tmargin-right: 50%;\n\t\tmargin-left: 0;\n\t\tbackground: var(--accentBackground);\n\t\tborder-color: var(--accent);\n\t}\n\t\n\t#bluetooth ul.log li.response {\n\t\tbackground: var(--secondaryBackground);\n\t\tborder-color: var(--secondary);\n\t}\n\t\n\t#bluetooth ul.log li.error {\n\t\tbackground: var(--warnBackground);\n\t\tborder-color: var(--warn);\n\t}\n\t\n\t#bluetooth ul.log li b {\n\t\tfont-size: 14px;\n\t\tfont-weight: bold;\n\t\toverflow-wrap: break-word;\n\t}\n\t\n\t#bluetooth ul.log li pre {\n\t\tborder-top: 1px solid rgba(255, 255, 255, 0.1);\n    \tmargin: 0;\n    \tmargin-top: 2px;\n    \tpadding-top: 2px;\n\t}\n\t\n\t#bluetooth ::-webkit-scrollbar {\n\t\twidth: 8px;\n\t\theight: 8px;\n\t\tborder-radius: 4px;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-track {\n\t\tborder-radius: 4px;\n\t\tborder: 1px solid hsla(0, 0%, 50%, 1);\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-corner {\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-thumb {\n\t\twidth: 8px;\n\t\tborder-radius: 4px;\n\t\tbackground: var(--background);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth {\n\t\tscrollbar-color: hsla(0, 0%, 50%, .75) hsla(0, 0%, 50%, 0.25);\n\t\tscrollbar-width: thin;\n\t}\n</style>\n<div id=\"bluetooth\">\n    <div class=\"control\">\n\t<span>\n        <b>Bluetooth connection</b>\n    </span>\n    <span>\n    \n\t</span>\n    <span>\n        <button id=\"bluetooth.ctrl.button\">Connect...</button>\n    </span>\n    </div>\n    <div class=\"bluetooth-io\" hidden>\n        <label for=\"bluetooth.io.tx\"><i class=\"material-icons\" style=\"font-size: 24px;\">edit</i></label>\n        <textarea id=\"bluetooth.io.tx\"></textarea>\n        <button id=\"bluetooth.io.send\" type=\"submit\" title=\"Send to gateway\" disabled><i class=\"material-icons\" style=\"font-size: 24px;\">send</i></button>\n    </div>\n    <div class=\"bluetooth-io\" hidden>\n        <label for=\"bluetooth.io.rx\"><i class=\"material-icons\" style=\"font-size: 24px;\"\t>forum</i></label>\n        <ul id=\"bluetooth.io.rx\" class=\"log\"></ul>\n        <div style=\"display: flex;align-items: center;justify-content: center;\">\n\t\t\t<button id=\"bluetooth.io.rx.clear\" type=\"reset\" title=\"Clear reception log\"><i class=\"material-icons\" style=\"font-size: 24px;\">delete_forever</i></button>\n\t\t\t<input type=\"checkbox\" id=\"bluetooth.io.rx.follow\" checked/>\n\t\t\t<label for=\"bluetooth.io.rx.follow\" title=\"Follow output\"><i class=\"material-icons\" style=\"font-size: 16px;\">vertical_align_bottom</i></label>\n\t\t</div>\n    </div>\n</div>\n";
var bluetoothProblemHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#bluetooth {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t\talign-items: center;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--warnBackground);\n\t\tbackground: var(--warn);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--warnBackground);\n\t\tborder-top: 1px solid var(--warnBackground);\n\t}\n\t\n\tdiv#bluetooth i, div#bluetooth span  {\n\t\tmargin: 4px;\n\t}\n\t\n\tdiv#bluetooth button {\n\t\toutline:none;\n\t\tmargin: 4px;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tborder: none;\n\t\tcolor: var(--warn);\n\t\tbackground: var(--warnBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t.bluetooth-copy-button {\n\t\tposition: absolute;\n\t\ttop: 18px;\n\t\tright: 8px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n</style>\n<div id=\"bluetooth\">\n\t<i class=\"material-icons\">error</i>\n\t<span>\n\t\t<b>Bluetooth testing not available when using HTTP!</b>\n\t</span>\n\t<button onclick=\"window.location = 'https:'; window.location.reload();\">Fix...</button>\n</div>\n";
var bluetoothNoSupport = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#bluetooth {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t\talign-items: center;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--warnBackground);\n\t\tbackground: var(--warn);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--warnBackground);\n\t\tborder-top: 1px solid var(--warnBackground);\n\t}\n\t\n\tdiv#bluetooth a {\n\t\tcolor: var(--warnBackground);;\n\t}\n\t\n\tdiv#bluetooth i, div#bluetooth span  {\n\t\tmargin: 4px;\n\t}\n\t\n\tdiv#bluetooth button {\n\t\toutline:none;\n\t\tmargin: 4px;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tborder: none;\n\t\tcolor: var(--warn);\n\t\tbackground: var(--warnBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t.bluetooth-copy-button {\n\t\tposition: absolute;\n\t\ttop: 18px;\n\t\tright: 8px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n</style>\n<div id=\"bluetooth\">\n\t<i class=\"material-icons\">error</i>\n\t<span>\n\t\t<b>Your browser does not support Bluetooth!<br/><a target=\"_blank\" href=\"https://www.google.de/chrome/\">Get Google Chrome...</a></b>\n\t</span>\n</div>\n";
var SIBluetoothTestConnection = /** @class */ (function () {
    function SIBluetoothTestConnection(hook, docsifyWM) {
        var _this = this;
        this.onDiscoverButtonClicked = function (_mouseEvent) {
            if (_this.device_ == null) {
                _this.discoverButton.disabled = true;
                navigator.bluetooth.requestDevice({ filters: [{ services: ["f3c2d800-8421-44b1-9655-0951992f313b"] }] }).then(function (device) {
                    _this.discoverButton.innerHTML = '<img width="70" height="20" style="margin: 0; padding: 0" src="images/loading.svg">';
                    _this.device_ = device;
                    device.addEventListener('gattserverdisconnected', _this.onDeviceDisconnected);
                    return device.gatt.connect();
                }).then(function (gatt) {
                    return gatt.getPrimaryService("f3c2d800-8421-44b1-9655-0951992f313b");
                }).then(function (service) {
                    _this.service_ = service;
                    return _this.service_.getCharacteristic("f3c2d802-8421-44b1-9655-0951992f313b");
                }).then(function (characteristic) {
                    _this.tx_ = characteristic;
                }).then(function (_) {
                    return _this.service_.getCharacteristic("f3c2d801-8421-44b1-9655-0951992f313b");
                }).then(function (char) {
                    char.addEventListener('characteristicvaluechanged', _this.onCharacteristicChanged);
                    return char.startNotifications();
                }).then(_this.onDeviceConnected).catch(function (error) {
                    _this.discoverButton.disabled = false;
                    _this.onDeviceDisconnected();
                });
            }
            else {
                _this.device_.gatt.disconnect();
            }
        };
        this.onDeviceConnected = function (device) {
            _this.discoverButton.disabled = false;
            _this.discoverButton.innerText = "Disconnect";
            for (var i = 0; i < _this.io_.length; ++i) {
                _this.io_[i].hidden = false;
            }
            _this.testButtons_.forEach(function (button) { return button.disabled = false; });
        };
        this.onDeviceDisconnected = function () {
            _this.device_ = null;
            _this.discoverButton.innerText = "Connect...";
            _this.editTextarea_.value = '';
            _this.log_.innerHTML = '';
            for (var i = 0; i < _this.io_.length; ++i) {
                _this.io_[i].hidden = true;
            }
            _this.testButtons_.forEach(function (button) { return button.disabled = true; });
        };
        this.onCharacteristicChanged = function (event) {
            var fragment = new Uint8Array(event.target.value.buffer);
            var remainingFragments = fragment[0];
            _this.receivingFrame_ = appendUInt8Arrays(_this.receivingFrame_, fragment.subarray(1));
            console.log("RX: " + bytesToHex(fragment));
            if (remainingFragments != 0)
                return;
            var payload = _this.receivingFrame_;
            _this.receivingFrame_ = new Uint8Array(0);
            var decoded = _this.decodeFrame(payload);
            var entry = document.createElement('li');
            if (payload.length >= 2 && payload[0] == 0x18 && payload[1] == 0xFF) {
                entry.className = 'error';
            }
            else if (payload.length >= 2 && payload[0] == 0x18 && (payload[1] == 0xFE || payload[1] == 0xFD)) {
                entry.className = '';
            }
            else {
                entry.className = 'response';
            }
            entry.innerHTML = '<b>' + bytesToHex(payload) + '</b><pre>' + decoded.description + '</pre>';
            _this.log_.insertAdjacentElement('beforeend', entry);
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            var exampleMessage = document.querySelector('[data-bt-example="' + decoded.command + '"]');
            if (exampleMessage) {
                exampleMessage.firstElementChild.innerHTML = '<code>' + bytesToHex(payload) + '</code>';
            }
        };
        this.onSendButtonClicked = function (_mouseEvent) {
            var MAX_FRAGMENT_SIZE = 508; // TODO: Detect or make configurable.
            var payload = hexToBytes(_this.editTextarea_.value);
            var entry = document.createElement('li');
            entry.className = 'request';
            entry.innerHTML = '<b>' + _this.editTextarea_.value + '</b><pre>' + _this.decodeFrame(payload).description + '</pre>';
            _this.log_.insertAdjacentElement('beforeend', entry);
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            var fragmentCount = Math.ceil(payload.length / MAX_FRAGMENT_SIZE);
            while (fragmentCount > 0) {
                fragmentCount -= 1;
                var fragmentLength = Math.min(payload.length, MAX_FRAGMENT_SIZE);
                var fragment = new Uint8Array(fragmentLength + 1);
                fragment[0] = Math.min(fragmentCount, 255);
                fragment.set(payload.subarray(0, fragmentLength), 1);
                payload = payload.subarray(fragmentLength);
                _this.tx_.writeValue(fragment);
            }
        };
        this.onClearLogButtonClicked = function (_mouseEvent) {
            _this.log_.innerHTML = '';
        };
        this.onFollowLogCheckboxChanged = function (_event) {
            if (_this.followLogCheckbox_.checked) {
                _this.log_.scrollTop = _this.log_.scrollHeight;
            }
            SIBluetoothTestConnection.setCookie('logFollows', _this.followLogCheckbox_.checked);
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
        this.device_ = null;
        this.service_ = null;
        this.tx_ = null;
        this.receivingFrame_ = new Uint8Array(0);
        this.discoverButton = null;
        this.io_ = null;
        this.editTextarea_ = null;
        this.editVerifyRegex_ = new RegExp('^([0-9a-fA-F]{2})*$');
        this.sendButton_ = null;
        this.log_ = null;
        this.clearLogButton_ = null;
        this.followLogCheckbox_ = null;
        this.testButtons_ = [];
        this.docsifyWM_ = docsifyWM;
        hook.doneEach(function () {
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
                _this.discoverButton = document.getElementById('bluetooth.ctrl.button');
                _this.discoverButton.onclick = _this.onDiscoverButtonClicked;
                _this.io_ = document.getElementsByClassName('bluetooth-io');
                _this.editTextarea_ = document.getElementById('bluetooth.io.tx');
                _this.editTextarea_.onkeydown = _this.onTxKeyDown;
                _this.editTextarea_.onkeyup = _this.onTxChanged;
                _this.editTextarea_.onpaste = _this.onTxChanged;
                _this.sendButton_ = document.getElementById('bluetooth.io.send');
                _this.sendButton_.onclick = _this.onSendButtonClicked;
                _this.log_ = document.getElementById('bluetooth.io.rx');
                _this.clearLogButton_ = document.getElementById('bluetooth.io.rx.clear');
                _this.clearLogButton_.onclick = _this.onClearLogButtonClicked;
                _this.followLogCheckbox_ = document.getElementById('bluetooth.io.rx.follow');
                var logFollows = SIBluetoothTestConnection.getCookie('logFollows');
                if (logFollows != null) {
                    _this.followLogCheckbox_.checked = logFollows == 'true';
                }
                _this.followLogCheckbox_.onchange = _this.onFollowLogCheckboxChanged;
                var requests = document.querySelectorAll('pre[data-bt-try]');
                for (var i = 0; i < requests.length; ++i) {
                    var editButton = document.createElement('button');
                    editButton.title = "Copy to edit field.";
                    editButton.disabled = true;
                    editButton.className = 'bluetooth-copy-button';
                    editButton.classList.add('copy');
                    editButton.innerHTML = '<i class="material-icons" style="font-size: 24px;">read_more</i>';
                    editButton.onclick = _this.onTestCopyButtonClicked;
                    requests[i].appendChild(editButton);
                    _this.testButtons_.push(editButton);
                    var sendButton = document.createElement('button');
                    sendButton.title = "Send to connected gateway.";
                    sendButton.disabled = true;
                    sendButton.className = 'bluetooth-send-button';
                    sendButton.innerHTML = '<i class="material-icons" style="font-size: 18px;">send</i>';
                    sendButton.onclick = _this.onTestSendButtonClicked;
                    requests[i].appendChild(sendButton);
                    _this.testButtons_.push(sendButton);
                }
            }
            else {
                var wsElement = document.getElementById('bluetooth');
                if (wsElement != null)
                    wsElement.remove();
            }
        });
    }
    SIBluetoothTestConnection.prototype.decodeFrame = function (bytes) {
        var sequence = CBOR.decodeMultiple(bytes);
        var decoded = "";
        var command = 0;
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
                    "\nfrom: " + sequence[1] +
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
                    "\nstatus: " + this.statusToString(sequence[1]) +
                    "\nid: " + sequence[2] +
                    "\ndescription:\n" + JSON.stringify(sequence[3], null, '  ');
            }
            else if (command == 0x84 && sequence.length == 4) {
                decoded = "PROPERTY READ" +
                    "\nstatus: " + this.statusToString(sequence[1]) +
                    "\nid: " + sequence[2] +
                    "\nvalue: " + sequence[3];
            }
            else if (command == 0x85 && sequence.length == 3) {
                decoded = "PROPERTY WRITTEN" +
                    "\nstatus: " + this.statusToString(sequence[1]) +
                    "\nid: " + sequence[2];
            }
            else if (command == 0x86 && sequence.length == 3) {
                decoded = "PROPERTY SUBSCRIBED" +
                    "\nstatus: " + this.statusToString(sequence[1]) +
                    "\nid: " + sequence[2];
            }
            else if (command == 0xFE && sequence.length == 3) {
                decoded = "PROPERTY UPDATE" +
                    "\nid: " + sequence[1] +
                    "\nvalue: " + sequence[2];
            }
            else if (command == 0x87 && sequence.length == 3) {
                decoded = "PROPERTY UNSUBSCRIBED" +
                    "\nstatus: " + this.statusToString(sequence[1]) +
                    "\nid: " + sequence[2];
            }
            else if (command == 0x88 && sequence.length == 5) {
                decoded = "DATALOG READ" +
                    "\nstatus: " + this.statusToString(sequence[1]) +
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
                    "\nstatus: " + this.statusToString(sequence[1]) +
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
    };
    SIBluetoothTestConnection.setCookie = function (name, value) {
        document.cookie = name + '=' + String(value);
    };
    SIBluetoothTestConnection.getCookie = function (name) {
        var parts = ('; ' + document.cookie).split('; ' + name + '=');
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
        return null;
    };
    SIBluetoothTestConnection.prototype.accessLevelToString = function (accessLevel) {
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
    };
    SIBluetoothTestConnection.prototype.statusToString = function (status) {
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
    };
    SIBluetoothTestConnection.prototype.writeFlagsToString = function (writeFlags) {
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
    };
    return SIBluetoothTestConnection;
}());
function hexToBytes(hex) {
    var bytes = new Uint8Array(hex.length / 2);
    for (var i = 0; i < bytes.length; ++i) {
        bytes[i] = parseInt(hex.substring(2 * i, 2 * i + 2), 16);
    }
    return bytes;
}
function bytesToHex(bytes) {
    var hex = '';
    bytes.forEach(function (byte) {
        hex += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return hex;
}
function appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}
function appendUInt8Arrays(array1, array2) {
    var tmp = new Uint8Array(array1.length + array2.length);
    tmp.set(array1, 0);
    tmp.set(array2, array1.length);
    return tmp;
}
function docsifyBluetoothPlugin(hook, vm) {
    var intRegex = /^\d+$/;
    var floatRegex = /^\d*.\d*$/;
    hook.doneEach(function () {
        document.querySelectorAll('.bt-api-doc').forEach(function (docElement) {
            var preview = docElement.querySelector('code[data-bt-preview]');
            if (preview) {
                var params_1 = docElement.querySelectorAll('[data-bt-index]');
                //params.sort();
                var renderPreview_1 = function () {
                    var msg = CBOR.encode(parseInt(preview.dataset.btPreview));
                    params_1.forEach(function (paramElement) {
                        if (paramElement.tagName.toLowerCase() == 'input') {
                            var element = paramElement;
                            var value = element.value;
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
                                        }
                                        else if (intRegex.test(value)) {
                                            msg = appendBuffer(msg, CBOR.encode(parseInt(value)));
                                        }
                                        else if (floatRegex.test(value)) {
                                            msg = appendBuffer(msg, CBOR.encode(parseFloat(value)));
                                        }
                                        else {
                                            msg = appendBuffer(msg, CBOR.encode(value));
                                        }
                                        break;
                                    case "string":
                                    default:
                                        msg = appendBuffer(msg, CBOR.encode(value || ""));
                                }
                            }
                            else {
                                msg = appendBuffer(msg, CBOR.encode(null));
                            }
                        }
                        else if (paramElement.tagName.toLowerCase() == 'select') {
                            var element = paramElement;
                            if (element.multiple) {
                                var options = element.options;
                                var flags = null;
                                for (var i = 0; i < options.length; ++i) {
                                    if (options[i].selected) {
                                        flags = (flags || 0) | parseInt(options[i].value);
                                    }
                                }
                                msg = appendBuffer(msg, CBOR.encode(flags));
                            }
                            else {
                                var value = element.value;
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
                                }
                                else {
                                    msg = appendBuffer(msg, CBOR.encode(null));
                                }
                            }
                        }
                    });
                    preview.innerText = bytesToHex(new Uint8Array(msg));
                };
                params_1.forEach(function (element) {
                    element.onchange = renderPreview_1;
                    element.onkeyup = renderPreview_1;
                });
                renderPreview_1();
            }
        });
    });
    window.testBT = new SIBluetoothTestConnection(hook, vm);
}
var docsify = window.$docsify || {};
docsify.plugins = [docsifyBluetoothPlugin].concat(docsify.plugins || []);
