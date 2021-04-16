var bluetoothTestHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#bluetooth {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: flex-end;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\twidth: 75%;\n\t\tmin-width: 800px;\n\t\tmax-width: 1200px;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--textColor);\n\t\tborder-top: 1px solid var(--textColor);\n\t}\n\t\n\tdiv#bluetooth div {\n\t\tpadding: 8px;\n\t}\n\t\n\tdiv#bluetooth div.control {\n\t\tdisplay:flex;\n\t\tjustify-content: space-between;\n\t\talign-items: center;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io {\n\t\tdisplay: flex;\n\t\tjustify-content: flex-end;\n\t\talign-items: start;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io i {\n\t\tmargin: 12px;\n\t}\n\t\n\tdiv#bluetooth div.bluetooth-io[hidden] {\n\t\tdisplay: none;\n\t}\n\t\n\t#bluetooth b {\n\tcolor: var(--textColor);\n\t\tfont-size: 18px;\n\t}\n\t\n\t#bluetooth div.bluetooth-io div {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n\t\n\t#bluetooth input {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: 1px solid var(--textColor);\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--textBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#bluetooth input[type=number] {\n\t\twidth: 80px;\n\t}\n\t\n\t#bluetooth input[type=checkbox] {\n\t\tdisplay: none;\n\t}\n\t\n\t#bluetooth input[type=checkbox] + label i {\n\t\tbackground: none;\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 5px;\n\t\tcolor: var(--textColor);\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#bluetooth input[type=checkbox]:checked + label i {\n\t\tbackground: var(--textColor);\n\t\tcolor: var(--textBackground);\n\t}\n\t\n\t#bluetooth button {\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tfont-size: 15px;\n\t\tborder: none;\n\t\tcolor: var(--textBackground);\n\t\tbackground: var(--textColor);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t#bluetooth button[type=submit],\n\t#bluetooth button[type=reset]{\n\t\tbackground: none;\n\t\tcolor: var(--textColor);\n\t\tpadding: 0;\n\t}\n\t\n\t#bluetooth button:hover, \n\t.bluetooth-copy-button:hover,\n\t.bluetooth-send-button:hover {\n\t\tfilter: brightness(150%);\n\t}\n\t\n\t#bluetooth button:disabled,\n\t#bluetooth input:disabled,\n\t.bluetooth-copy-button:disabled,\n\t.bluetooth-send-button:disabled {\n\t\tfilter: opacity(25%);\n\t}\n\t\n\t#bluetooth textarea {\n\t\tresize: none;\n\t\tflex-grow: 2;\n\t\theight: 150px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .8rem;\n\t\tcolor: var(--textColor);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 4px 12px;\n\t}\n\t\n\t.bluetooth-copy-button {\n\t\tposition: absolute;\n\t\tbottom: 4px;\n\t\tright: 36px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.bluetooth-send-button {\n\t\tposition: absolute;\n\t\tbottom: 7px;\n\t\tright: 8px;\n\t\toutline:none;\n\t\t-webkit-appearance: none;\n\t\tborder: none;\n\t\tcolor: var(--accentBackground);\n\t\tbackground: none;\n\t}\n\t\n\t.bluetooth-copy-button:hover,\n\t.bluetooth-send-button:hover {\n\t\tcolor: white;\n\t}\n\t\n\t#bluetooth ul.log {\n\t\toverflow-y: scroll;\n\t\tflex-grow: 2;\n\t\theight: 40vh;\n\t\tfont-family: Roboto Mono, Monaco, courier, monospace;\n\t\tfont-size: .7rem;\n\t\tcolor: var(--accent);\n\t\tbackground: var(--background);\n\t\tborder: 1px solid var(--textColor);\n\t\tborder-radius: 6px;\n\t\tpadding: 8px 24px;\n\t\tmargin: 0 2px;\n\t\t-webkit-user-select: none;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\t\n\t#bluetooth ul.log li {\n\t\twhite-space: pre;\n\t\tlist-style: none;\n\t\tpadding: 4px 4px 4px 8px;\n\t\tcolor: var(--textHighContrast);\n\t\tborder: 1px solid var(--textColor);\n\t\tbackground: hsla(0, 0%, 100%, 0.03);\n\t\tmargin-top: 8px;\n\t\toverflow-y: hidden;\n\t\toverflow-x: auto;\n\t\tborder-radius: 8px;\n\t\tmargin-left: 20%;\n\t\tbackground: var(--textBackground);\n\t\t-webkit-user-select: auto;\n\t\t-moz-user-select: auto;\n\t\t-ms-user-select: auto;\n\t\tuser-select: auto;\n\t}\n\t\n\t#bluetooth ul.log li.request {\n\t\tmargin-right: 20%;\n\t\tmargin-left: 0;\n\t\tbackground: var(--accentBackground);\n\t\tborder-color: var(--accent);\n\t}\n\t\n\t#bluetooth ul.log li.response {\n\t\tbackground: var(--secondaryBackground);\n\t\tborder-color: var(--secondary);\n\t}\n\t\n\t#bluetooth ul.log li.error {\n\t\tbackground: var(--warnBackground);\n\t\tborder-color: var(--warn);\n\t}\n\t\n\t#bluetooth ::-webkit-scrollbar {\n\t\twidth: 8px;\n\t\theight: 8px;\n\t\tborder-radius: 4px;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-track {\n\t\tborder-radius: 4px;\n\t\tborder: 1px solid hsla(0, 0%, 50%, 1);\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-corner {\n\t\tbackground: var(--textColor);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth ::-webkit-scrollbar-thumb {\n\t\twidth: 8px;\n\t\tborder-radius: 4px;\n\t\tbackground: var(--background);\n\t\topacity: 0.75;\n\t}\n\n\t#bluetooth {\n\t\tscrollbar-color: hsla(0, 0%, 50%, .75) hsla(0, 0%, 50%, 0.25);\n\t\tscrollbar-width: thin;\n\t}\n</style>\n<div id=\"bluetooth\">\n    <div class=\"control\">\n\t<span>\n        <b>Bluetooth connection</b>\n    </span>\n        <span>\n        <button id=\"websocket.ctrl.button\">Connect</button>\n    </span>\n    </div>\n    <div class=\"bluetooth-io\" hidden>\n        <label for=\"bluetooth.io.tx\"><i class=\"material-icons\" style=\"font-size: 24px;\">edit</i></label>\n        <textarea id=\"bluetooth.io.tx\"></textarea>\n        <button id=\"bluetooth.io.send\" type=\"submit\" title=\"Send to gateway\" disabled><i class=\"material-icons\" style=\"font-size: 24px;\">send</i></button>\n    </div>\n    <div class=\"bluetooth-io\" hidden>\n        <label for=\"bluetooth.io.rx\"><i class=\"material-icons\" style=\"font-size: 24px;\"\t>forum</i></label>\n        <ul id=\"bluetooth.io.rx\" class=\"log\"></ul>\n        <div style=\"display: flex;align-items: center;justify-content: center;\">\n\t\t\t<button id=\"bluetooth.io.rx.clear\" type=\"reset\" title=\"Clear reception log\"><i class=\"material-icons\" style=\"font-size: 24px;\">delete_forever</i></button>\n\t\t\t<input type=\"checkbox\" id=\"bluetooth.io.rx.follow\" checked/>\n\t\t\t<label for=\"bluetooth.io.rx.follow\" title=\"Follow output\"><i class=\"material-icons\" style=\"font-size: 16px;\">vertical_align_bottom</i></label>\n\t\t</div>\n    </div>\n</div>\n";
var bluetoothProblemHtml = "\n<!--suppress CssUnresolvedCustomProperty -->\n<style>\n\tdiv#bluetooth {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t\talign-items: center;\n\t\tposition: fixed;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tpadding: 12px 32px;\n\t\tcolor: var(--warnBackground);\n\t\tbackground: var(--warn);\n\t\tfont-size: 16px;\n\t\tborder-top-left-radius: 12px;\n\t\tborder-left: 1px solid var(--warnBackground);\n\t\tborder-top: 1px solid var(--warnBackground);\n\t}\n\t\n\tdiv#bluetooth i, div#bluetooth span  {\n\t\tmargin: 4px;\n\t}\n\t\n\tdiv#bluetooth button {\n\t\toutline:none;\n\t\tmargin: 4px;\n\t\t-webkit-appearance: none;\n\t\tfont-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;\n\t\tborder: none;\n\t\tcolor: var(--warn);\n\t\tbackground: var(--warnBackground);\n\t\tborder-radius: 12px;\n\t\tpadding: 4px 12px;\n\t}\n</style>\n<div id=\"bluetooth\">\n\t<i class=\"material-icons\">error</i>\n\t<span>\n\t\t<!--<b>Bluetooth testing not available when using HTTP!</b>-->\n\t\t<b>Bluetooth testing not available yet</b>\n\t</span>\n\t<!--<button onclick=\"window.location = 'https:'; window.location.reload();\">Fix...</button>-->\n</div>\n";
var SIBluetoothTestConnection = /** @class */ (function () {
    function SIBluetoothTestConnection(hook, docsifyWM) {
        this.docsifyWM_ = docsifyWM;
        hook.doneEach(function () {
            if (docsifyWM.route.path.indexOf('/bluetooth') == 0) {
                //if (window.location.protocol == 'http:') {
                document.body.insertAdjacentHTML('beforeend', bluetoothProblemHtml);
                return;
                //}
                //document.body.insertAdjacentHTML('beforeend', bluetoothTestHtml);
                // TOOD...
            }
            else {
                var wsElement = document.getElementById('bluetooth');
                if (wsElement != null)
                    wsElement.remove();
            }
        });
    }
    return SIBluetoothTestConnection;
}());
function toHexString(byteArray) {
    var s = '';
    byteArray.forEach(function (byte) {
        s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
}
function appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
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
                    preview.innerText = toHexString(new Uint8Array(msg));
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
