<!--suppress CssUnresolvedCustomProperty -->
<style>
    div.bt-api-doc {
        margin: 24px 0;
        width: 100%;
        border: 2px solid var(--textColor);
        border-radius: 4px;
        background: var(--textBackground);
    }

    div.bt-api-doc.request {
        border-color: var(--accent);
        background: var(--accentBackground);
    }

    div.bt-api-doc.response {
        border-color: var(--secondary);
        background: var(--secondaryBackground);
    }

    div.bt-api-doc.error {
        border-color: var(--warn);
        background: var(--warnBackground);
    }

    div.bt-api-doc.json-schema {
        border: none;
        background: var(--textColor);
        width: auto;        
        margin: 12px 24px;
        color: var(--textBackground);
    }

    div.bt-api-doc.json-example {
        border-color: var(--textColor) !important;
        background: none;
        width: auto;        
        margin: 12px 24px;
        color: var(--textColor);
    }

    div.bt-api-doc button.accordion-toggle {
        padding: 6px;
        margin: 6px;
        border: none;
        border-radius: 3px;
        font-size: 100%;
        font-weight: bold;
        color: var(--backgroundHighContrast);
        background: var(--textColor);
    }

    div.bt-api-doc.request button.accordion-toggle {
        background: var(--accent);
    }

    div.bt-api-doc.response button.accordion-toggle {
        background: var(--secondary);
    }

    div.bt-api-doc.error button.accordion-toggle {
        background: var(--warn);
    }

    div.bt-api-doc.json-schema button.accordion-toggle {
        background: var(--textBackground);
        color: var(--textColor);
        min-width: 250px;
    }

    div.bt-api-doc.json-example button.accordion-toggle {
        background: var(--textColor);
        color: var(--textBackground);
        min-width: 250px;
    }

    div.bt-api-doc div {
        font-size: 100%;
        padding: 0;
        border-top: 2px solid var(--textColor);
    }

    div.bt-api-doc.request div {
        border-color: var(--accent);
    }

    div.bt-api-doc.response div {
        border-color: var(--secondary);
    }

    div.bt-api-doc.error div {
        border-color: var(--warn);
    }

    div.bt-api-doc.json-schema div {
        border: none;
    }

    div.bt-api-doc.json-example div {
        border-color: var(--textColor);
    }

    div.bt-api-doc p {
        margin: 0;
        padding: 16px 32px;
    }

    div.bt-api-doc ul {
        margin: -8px 48px;
    }

    div.bt-api-doc h6 {
        margin: 0;
        border-top: 1px solid var(--textColor);
        color: var(--textColor);
        padding: 8px 16px 0;
    }

    div.bt-api-doc.request h6 {
        border-color: var(--accent);
        color: var(--accent);
    }

    div.bt-api-doc.response h6 {
        border-color: var(--secondary);
        color: var(--secondary);
    }

    div.bt-api-doc.error h6 {
        border-color: var(--warn);
        color: var(--warn);
    }

    div.bt-api-doc table,
    div.bt-api-doc tr,
    div.bt-api-doc th,
    div.bt-api-doc td {
        text-align: left;
        border: none;
        background-color: transparent !important;
    }

    div.bt-api-doc table {
        display: table;
        width: calc(100% - 64px);
        margin: 16px auto;
    }

    div.bt-api-doc th {
        border-bottom: 1px solid var(--textColor);
        font-weight: normal;
        font-style: italic;
    }

    div.bt-api-doc input,
    div.bt-api-doc select,
    div.bt-api-doc textarea {
        outline: none;
        -webkit-appearance: none;
        font-family: var(--siteFont), Helvetica Neue, Arial, sans-serif;
        font-size: 15px;
        border: 1px solid var(--textColor);
        color: var(--textColor);
        background: transparent;
        border-radius: 12px;
        padding: 4px 12px;
    }

    div.bt-api-doc textarea {
        width: 100%;
        max-width: 100%;
    }

    div.bt-api-doc input:invalid {
        border-color: var(--warn);
        background-color: var(--warnBackground);
    }

    div.bt-api-doc input[type=number] {
        width: 80px;
    }

    div.bt-api-doc input[type=checkbox] {
        display: none;
    }

    div.bt-api-doc pre {
        box-shadow: none;
        border: none;
        border-radius: 0;
        margin: 0 0;
        padding: 20px;
        background: var(--textColor);
    }

    div.bt-api-doc.request pre {
        background: var(--accent);
    }

    div.bt-api-doc.response pre {
        background: var(--secondary);
    }

    div.bt-api-doc.error pre {
        background: var(--warn);
    }

    div.bt-api-doc.json-schema pre {
        background: var(--textColor);
    }

    div.bt-api-doc.json-example pre {
        background: none;
    }

    div.bt-api-doc code {
        font-size: 18px;
        color: var(--backgroundHighContrast);
        background: none;
        margin: 0;
        padding: 0;
        max-height: 50vh;
        overflow-y: scroll;
    }

    .request strong {
        color: var(--accent);
    }

    strong.request {
        color: var(--accent) !important;
    }

    .response strong,
    .response a {
        color: var(--secondary);
    }

    strong.response,
    a.response {
        color: var(--secondary) !important;
    }

    strong.indication,
    a.indication, 
    .indication strong,
    .indication a {
        color: var(--textColor);
    }

    .error strong,
    .error a {
        color: var(--warn);
    }

    strong.error,
    a.error {
        color: var(--warn) !important;
    }

    .json-schema strong,
    .json-schema a {
        color: var(--textBackground);
    }

    strong.json-schema,
    a.json-schema {
        color: var(--textBackground) !important;
    }

    span.circle {
        color: var(--textColor);
        border: 3px solid var(--textColor);
        border-radius: 50%;
        font-weight: bold;
    }

    span.circle.request,
    .request span.circle {
        color: var(--accent);
        border-color: var(--accent);
    }

    span.circle.response,
    .response span.circle {
        color: var(--secondary);
        border-color: var(--secondary);
    }

    span.circle.error,
    .error span.circle {
        color: var(--warn);
        border-color: var(--warn);
    }

    p.center {
        width: 100%;
        text-align: center;
    }
</style>

## Introduction
<br/>
<br/>

> [!ATTENTION]
> The **Bluetooth API** is still in **early development**, so it is only available in this form in the actual develop branch of the gateway software, it can change at any time, and the documentation
> here is far from complete. Additionally, no official clients exist yet.

<br/>
<br/>
<p>
    The OpenStuder Bluetooth protocol is a frame based protocol, where all frames are encoded as <a href="https://tools.ietf.org/html/draft-ietf-cbor-sequence-01">CBOR sequences</a>. 
    A frame consists of a command and a variable set of parameters depending the actual command. All data, including the command is encoded using <a href="http://cbor.io">CBOR</a>.
</p>
<p>
    The frames are exchanged using two <a href="https://de.wikipedia.org/wiki/Bluetooth_Low_Energy">Bluetooth Low Energy</a> characteristics, one characteristic is dedicated to send frames to the 
    gateway by <bold>writing</bold> to it, the other is used to receive frames from the gateway using the Bluetooth Low Energy <strong>notifications</strong>. This means that the client has to 
    subscribe to the characteristic used to send frames from the gateway to the client.   
</p>

<img src="images/Bluetooth-Characteristic.svg"/>

## Frame format

<p>
    The client and server will communicate using frames sent over the bluetooth connection. A frame's basic structure looks like:
</p>

<img src="images/Bluetooth-Frame.svg"/>

<p>
    The frame starts with a command encoded as CBOR integer. Following the command are zero or more parameters, whereas every parameter itself is encoded as a CBOR value according to the CBOR sequence 
    specification. All parameters have to be present, even if they are optional for the given command. It is still possible to not provide a value for an optional parameter by encoding the value 
    <strong>null</strong>.
</p>
<p>
    The gateway only supports a subset of CBOR types:
</p>

- **null**
- **bool**
- **integer**
- **number**
- **double**
- **string**
- **list** *(currently only direction gateway -> client)*
- **map** *(currently only direction gateway -> client)*

<p>
    The set of parameters and their datatypes are defined for each command in this document.
</p>

## Behavior

<p>The communication between the client and the gateway has <strong>two principal phases</strong>:</p>

<img src="images/Connection-State01.svg"/>

#### Unauthorized phase

<p>As soon as client has established the Bluetooth connection to the gateway, the connection is in the <strong>Unauthorized</strong> phase. In this phase, the gateway rejects all messages except
    <strong>AUTHORIZE</strong> requests from the client. This phase is only left after the client has send an <strong>AUTHORIZE</strong> request to the gateway and the gateway granted access or the
    Bluetooth connection has been closed by either the client or the gateway. The gateway can close the Bluetooth connection after one or more refused authorize attempts.</p>

<img src="images/Connection-Sequence01.svg"/>

#### Authorized phase

<p>If the gateway has granted access to the client, the connection enters the <strong>Authorized</strong> phase and remains there until either of the two communication peers close the Bluetooth
    connection. In this phase the client can send any request (except the AUTHORIZE request of course) at any time and the gateway responds accordingly. Additionally the gateway can send indication
    messages at any time.</p>
<p>The following sequence diagram shows a typical conversation between a client and the gateway in during the authorized phase:</p>

<img src="images/Connection-Sequence02.svg"/>

<p class="center request">The client sends a <strong>ENUMERATE</strong> <span class="circle">&nbsp;1&nbsp;</span> request message to the gateway. The gateway will initiate the enumeration operation.</p>
<p class="center response">Once the enumeration operation has completed, the gateway responds with an <strong>ENUMERATED</strong> <span class="circle">&nbsp;2&nbsp;</span> message.</p>
<p class="center request">The client sends a <strong>DESCRIBE</strong> <span class="circle">&nbsp;3&nbsp;</span> request message to the gateway. The gateway will generate a JSON representation of the
    requested entity.</p>
<p class="center response">The gateway responds with an <strong>DESCRIPTION</strong> <span class="circle">&nbsp;4&nbsp;</span> message which contains the description.</p>
<p class="center request">The client subscribes now to the properties he is interested in using <strong>SUBSCRIBE PROPERTY</strong> <span class="circle">&nbsp;5&nbsp;</span> messages.
    For simplicity the client in the sequence diagram only subscribes to one singe property.</p>
<p class="center response">For each property subscribe request, the gateway responds with a <strong>PROPERTY SUBSCRIBED</strong> <span class="circle">&nbsp;6&nbsp;</span> message.</p>
<p class="center indication">Every time the subscribed property changes, the gateway sends a <strong>PROPERTY UPDATE</strong> <span class="circle">&nbsp;7&nbsp;</span>,
    <span class="circle">&nbsp;9&nbsp;</span>, <span class="circle">&nbsp;C&nbsp;</span>, <span class="circle">&nbsp;D&nbsp;</span> message to the client.</p>
<p class="center indication">In the case a device connected to the gateway publishes a message, the message will be forwarded to all connected clients (authorized) using the <strong>DEVICE MESSAGE</strong>
    <span class="circle">&nbsp;8&nbsp;</span> message.</p>
<p class="center request">If a client wants to change the value of a property, he has to send a <strong>WRITE PROPERTY</strong> <span class="circle">&nbsp;A&nbsp;</span> message to tge gateway.</p>
<p class="center response">The gateway responds to the property write request using the <strong>PROPERTY WRITTEN</strong> <span class="circle">&nbsp;B&nbsp;</span> message.</p>
<p class="center request">The client sends an <strong>UNSUBSCRIBE PROPERTY</strong> <span class="circle">&nbsp;E&nbsp;</span> message to the gateway to stop periodic updates for the given property.</p>
<p class="center response">The gateway acknowledges the unsubscribe request by sending a <strong>PROPERTY UNSUBSCRIBED</strong> <span class="circle">&nbsp;F&nbsp;</span> message back to the client.</p>
<p class="center ">The client can disconnect from the gateway at any time.</p>

## Messages

<p>
    All messages that can be exchanged with the OpenStuder gateway Bluetooth API are defined in the following sections.
</p>
<p>Four types of frames exists and are differentiated using colors:</p>

<ul>
    <li><strong class="request">Request messages</strong> send from the client to the gateway.</li>
    <li><strong class="response">Response messages</strong> send from the gateway to the client as response to request messages.</li>
    <li><strong class="indication">Indication messages</strong> send from the gateway to the client spontaneous, subscribed properties and device message for example.</li>
    <li><strong class="error">Error message</strong> send from the gateway to the client on severe errors.</li>
</ul>

### User authorization

<p>A client initiates the connection to the gateway by sending the <strong>AUTHORIZE</strong> message:</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">AUTHORIZE</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>AUTHORIZE</strong> message has to be send as the <strong>very first</strong> by a client to the gateway after the Bluetooth connection has been established. Any other message
            will be rejected as long as the authorization has not been completed.<br/>
            It serves basically two purposes:
        </p>
        <ul>
            <li><strong>Negotiate the protocol version</strong> and</li>
            <li><strong>optionally authorize</strong> a user or guest.</li>
        </ul>
        <p>
            If no user credentials (<em>username</em> and <em>password</em>) are passed and user authorization is enabled on the gateway, the user is is authorized as guest. If guest access is
            disabled in the gateway configuration the authorize request will be rejected.
            <br/>
            If user authorization is disabled on the gateway, the credentials (<em>username</em> and <em>password</em>) are not required at all and even if they are provided, they will be ignored.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
                <th>use value</th>
            </tr>
            <tr>
                <td>user</td>
                <td>string | null</td>
                <td><strong>Username used to authorize</strong>. <br/>
                    If not provided, the connection will be granted guest access level if guest access is enabled on the gateway.<br/></td>
                <td>
                    <input type="text" placeholder="null" data-bt-index="0"></input>
                </td>
            </tr>
            <tr>
                <td>password</td>
                <td>string | null</td>
                <td><strong>Password used to authorize</strong>. <br/>
                    If not provided, the connection will be granted guest access level if guest access is enabled on the gateway.
                </td>
                <td><input type="password" placeholder="null" data-bt-index="1"></input></td>
            </tr>
            <tr>
                <td>protocol_version</td>
                <td>int | null</td>
                <td><strong>Version of the protocol requested by the client</strong>. <br/>
                    If not provided, the protocol version is determined by the gateway.
                </td>
                <td>
                    <select data-bt-index="2" data-bt-type="int">
                        <option value="">null</option>
                        <option value="1">Version 1</option>
                    </select></td>
            </tr>
        </table>
        <pre data-bt-try><code data-bt-preview="1"></code></pre>
    </div>
</div>

<p>If the gateway accepts the connection attempt it will respond with a <strong class="response">AUTHORIZED</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">AUTHORIZED</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>AUTHORIZED</strong> message is send by the gateway as a response to the <strong class="request">AUTHORIZE</strong> message if the authentication was successful. in the case
            of an error, the gateway responds with an <strong class="error">ERROR</strong> message instead.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>access_level</td>
                <td>1 <em>(Basic)</em>,<br/>2 <em>(Installer)</em>,<br/>3 <em>(Expert)</em>,<br/> 4 <em>(QSP)</em></td>
                <td><strong>Access level granted to authorized user</strong>. <br/>
                    This access level has been granted by the gateway to the user (or guest) that was authorized using the optional credentials in the AUTHORIZE message.
                </td>
            </tr>
            <tr>
                <td>protocol_version</td>
                <td>int</td>
                <td><strong>Protocol version</strong>. <br/>
                    Protocol version used on the gateway's side. Currently only version 1 is supported.
                </td>
            </tr>
            <tr>
                <td>gateway_version</td>
                <td>string</td>
                <td><strong>Gateway software version</strong>. <br/>
                    Version of the gateway OpenStuder software actually runing on the gateway.
                </td>
            </tr>
        </table>
        <pre data-bt-example="129"><code>18810165302E312E30</code></pre>
    </div>
</div>

<p>The gateway can reject any connection attempt due to protocol version mismatch or failed authorization. The server responds back with an <strong class="error">ERROR</strong> message explaining why
    the authorization was rejected. The connection remains open.</p>

### Device enumeration

<p>A client can request a gateway to enumerates all connected devices by sending an <strong>ENUMERATE</strong> message.</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">ENUMERATE</button>
    <div class="accordion-content" hidden>
        <p>
            An <strong>ENUMERATE</strong> message triggers a device enumeration on the gateway.<br/>
            The gateway basically scans every configured and functional device access driver for new devices and removes devices that do not respond anymore.
        </p>
        <h6>parameters</h6>
        <p><em>No parameters</em></p>
        <pre data-bt-try><code data-bt-preview="2"></code></pre>
    </div>
</div>

<p>If the gateway accepts the request it will respond with a <strong class="response">ENUMERATED</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">ENUMERATED</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>ENUMERATED</strong> message is send by the gateway as a response to an <strong class="request">ENUMERATE</strong> that was accepted by the gateway. The only reason an
            <strong class="error">ERROR</strong> message is send back by the gateway instead of this message is if the request message was malformed or the client is not yet authorized.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>status</td>
                <td>int</td>
                <td><strong>Status of the enumeration operation</strong>. <br/>
                    <strong>0</strong> <em>(Success)</em> if the enumeration operation was successful, <strong>-1</strong> <em>(Error)</em> otherwise.
                </td>
            </tr>
            <tr>
                <td>device_count</td>
                <td>int</td>
                <td><strong>Total count of devices present</strong>. <br/>
                    The total number of devices present on all device access drivers after the enumeration operation.
                </td>
            </tr>
        </table>
        <pre data-bt-example="130"><code>188203</code></pre>
    </div>
</div>

<p>Should the <strong class="request">ENUMERATE</strong> message be malformed or the client is not yet authorized, the gateway responds with an <strong class="error">ERROR</strong> message instead.</p>

### Read property

<p>A client can query the actual value of any property by sending the <strong class="request">READ PROPERTY</strong> message.</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">READ PROPERTY</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>READ PROPERTY</strong> message is send to a gateway to retrieve the actual value of a given property. The property is identified by the <strong>id</strong> parameter.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
                <th>use value</th>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    The ID of the property to read in the form <strong>&lt;device access ID&gt;.&lt;device ID&gt;.&lt;property ID&gt;</strong>.
                </td>
                <td>
                    <input type="text" placeholder="required" data-bt-index="0" data-bt-required/>
                </td>
            </tr>
        </table>
        <pre data-bt-try><code data-bt-preview="3"></code></pre>
    </div>
</div>

<p>If the gateway accepts the request it will respond with a <strong class="response">PROPERTY READ</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">PROPERTY READ</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>PROPERTY READ</strong> message is send by the gateway as a response to an <strong class="request">READ PROPERTY</strong> that was accepted by the gateway. The only reason an
            <strong class="error">ERROR</strong> message is send back by the gateway instead of this message is if the request message was malformed or the client is not yet authorized.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>status</td>
                <td>int</td>
                <td><strong>Status</strong>. <br/>
                    <strong>0</strong> <em>(Success)</em> if the property could be successfully read, <strong>-4</strong> <em>(NoDeviceAccess)</em> if the device access instance does not exist, 
                    <strong>-3</strong> <em>(NoDevice)</em> if the device does not exist and <strong>-2</strong> <em>(NoProperty)</em> if the property does not exists. For all other errors, 
                    the general status <strong>-1</strong> <em>(Error)</em> is set.
                </td>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    Copy of the parameter <strong>id</strong> of the corresponding <strong class="request">READ PROPERTY</strong> message.
                </td>
            </tr>
            <tr>
                <td>value</td>
                <td>bool | int | double | string | null</td>
                <td><strong>Value of the property</strong>. <br/>
                    Actual value of the property. Only present if status is <strong>0</strong>.
                </td>
            </tr>
        </table>
        <pre data-bt-example="131"><code>006D64656D6F2E6261742E37303030F94A20</code></pre>
    </div>
</div>

<p>Should the <strong class="request">READ PROPERTY</strong> message be malformed or the client is not yet authorized, the gateway responds with an <strong class="error">ERROR</strong> message instead.</p>

### Write property

<p>A client can ask the gateway to write to a property by sending the <strong class="request">WRITE PROPERTY</strong> message.</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">WRITE PROPERTY</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>WRITE PROPERTY</strong> message is send to a gateway to change the actual value of a given property. The property is identified by the <strong>id</strong> parameter and the new
            value is passed by the <strong>value</strong> parameter.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
                <th>use value</th>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    The ID of the property to write in the form <strong>&lt;device access ID&gt;.&lt;device ID&gt;.&lt;property ID&gt;</strong>.
                </td>
                <td>
                    <input type="text" placeholder="required" data-bt-index="0" data-bt-required/>
                </td>
            </tr>
            <tr>
                <td>flags</td>
                <td>0 <em>(No flags)</em> | 1 <em>(Permanent)</em> | null</td>
                <td><strong>Write flags</strong>.<br/>
                    If the <strong>1</strong> <em>(Permanent)</em> flag is set, the value is written to the non-volatile memory of the device. If the flags are not present (null), the default of the
                    gateway is used, which is <strong>1</strong> <em>(Permanent)</em>.
                </td>
                <td>
                    <select data-bt-index="1" multiple>
                        <option value="0">Empty flags</option>
                        <option value="1">Permanent</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>value</td>
                <td>bool | int | double | string | null</td>
                <td><strong>New value for the property</strong>. <br/>
                    The value to set for the property. This parameter is optional (can be null) as it is possible to write to properties with the data type "Signal" where there is no actual value 
                    written, the write operation rather triggers an action on the device (or bus).
                </td>
                <td>
                    <input type="text" placeholder="null" data-bt-index="2" data-bt-type="auto"/>
                </td>
            </tr>
        </table>
        <pre data-bt-try><code data-bt-preview="4"></code></pre>
    </div>
</div>

<p>If the gateway accepts the request it will respond with a <strong class="response">PROPERTY WRITTEN</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">PROPERTY WRITTEN</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>PROPERTY WRITTEN</strong> message is send by the gateway as a response to an <strong class="request">WRITE PROPERTY</strong> that was accepted by the gateway. The only reason
            an <strong class="error">ERROR</strong> message is send back by the gateway instead of this message is if the request message was malformed or the client is not yet authorized.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>status</td>
                <td>int</td>
                <td><strong>Status</strong>. <br/>
                    <strong>0</strong> <em>(Success)</em> if the property could be written to, <strong>-4</strong> <em>(NoDeviceAccess)</em> if the device access instance does not exist, 
                    <strong>-3</strong> <em>(NoDevice)</em> if the device does not exist and <strong>-2</strong> <em>(NoProperty)</em> if the property does not exists. For all other errors, 
                    the general status <strong>-1</strong> <em>(Error)</em> is set.
                </td>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    Copy of the parameter <strong>id</strong> of the corresponding <strong class="request">WRITE PROPERTY</strong> message.
                </td>
            </tr>
        </table>
        <pre data-bt-example="132"><code>1884006C413330332E31312E31343135</code></pre>
    </div>
</div>

<p>Should the <strong class="request">WRITE PROPERTY</strong> message be malformed or the client is not yet authorized, the gateway responds with an <strong class="error">ERROR</strong> message instead.</p>

### Subscribe to properties

<p>A client can subscribe to a property for changes by sending the <strong class="request">SUBSCRIBE PROPERTY</strong> message.</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">SUBSCRIBE PROPERTY</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>SUBSCRIBE PROPERTY</strong> message is send to a gateway to subscribe to a property and receive indications whenever the property has changed. The property is identified by
            the <strong>id</strong> header.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
                <th>use value</th>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    The ID of the property to subscribe to in the form <strong>&lt;device access ID&gt;.&lt;device ID&gt;.&lt;property ID&gt;</strong>.
                </td>
                <td>
                    <input type="text" placeholder="required" data-bt-index="0" data-bt-required/>
                </td>
            </tr>
        </table>
        <pre data-bt-try><code data-bt-preview="5"></code></pre>
    </div>
</div>

<p>If the gateway accepts the request it will respond with a <strong class="response">PROPERTY SUBSCRIBED</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">PROPERTY SUBSCRIBED</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>PROPERTY SUBSCRIBED</strong> message is send by the gateway as a response to an <strong class="request">SUBSCRIBE PROPERTY</strong> that was accepted by the gateway. The only
            reason an <strong class="error">ERROR</strong> message is send back by the gateway instead of this message is if the request message was malformed or the client is not yet authorized.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>status</td>
                <td>int</td>
                <td><strong>Status</strong>. <br/>
                    <strong>0</strong> <em>(Success)</em> if the subscription could be added, <strong>-2</strong> <em>(NoProperty)</em> if the property does not exists.
                    For any other error, the general status <strong>-1</strong> <em>(Error)</em> is set.
                </td>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    Copy of the parameter <strong>id</strong> of the corresponding <strong class="request">SUBSCRIBE PROPERTY</strong> message.
                </td>
            </tr>
        </table>
        <pre data-bt-example="133"><code>1885006C413330332E31312E33303233</code></pre>
    </div>
</div>

<p>Should the <strong class="request">SUBSCRIBE PROPERTY</strong> message be malformed or the client is not yet authorized, the gateway responds with an <strong class="error">ERROR</strong> message instead.</p>

<p>For all property subscriptions of a given client, the gateway sends a <strong class="request">PROPERTY UPDATE</strong> message when the property has changed.</p>

<div class="bt-api-doc">
    <button class="accordion-toggle">PROPERTY UPDATE</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>PROPERTY UPDATE</strong> message is send by the gateway to a client whenever a property the client has subscribed to has changed (or read). The property is identified by
            the <strong>id</strong> header and the value is in the <strong>value</strong> parameter.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    The ID of the property that has changed (or was read) in the form <strong>&lt;device access ID&gt;.&lt;device ID&gt;.&lt;property ID&gt;</strong>.
                </td>
            </tr>
            <tr>
                <td>value</td>
                <td>bool | int | double | string | null</td>
                <td><strong>Property value</strong>. <br/>
                    The new value of the property.
                </td>
            </tr>
        </table>
        <pre data-bt-example="254"><code>18FE6C413330332E31312E33303233F90000</code></pre>
    </div>
</div>

<p>A client can unsubscribe from a property by sending the <strong class="request">UNSUBSCRIBE PROPERTY</strong> message.</p>

<div class="bt-api-doc request">
    <button class="accordion-toggle">UNSUBSCRIBE PROPERTY</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>UNSUBSCRIBE PROPERTY</strong> message is send to a gateway to remove a subscription to a property. The property is identified by the <strong>id</strong> header.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
                <th>use value</th>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    The ID of the property to unsubscribe from in the form <strong>&lt;device access ID&gt;.&lt;device ID&gt;.&lt;property ID&gt;</strong>.
                </td>
                <td>
                    <input type="text" placeholder="required" data-bt-index="0" data-bt-required/>
                </td>
            </tr>
        </table>
        <pre data-bt-try><code data-bt-preview="6"></code></pre>
    </div>
</div>

<p>If the gateway accepts the request it will respond with a <strong class="response">PROPERTY UNSUBSCRIBED</strong> message:</p>

<div class="bt-api-doc response">
    <button class="accordion-toggle">PROPERTY UNSUBSCRIBED</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>PROPERTY UNSUBSCRIBED</strong> message is send by the gateway as a response to an <strong class="request">UNSUBSCRIBE PROPERTY</strong> that was accepted by the gateway. The
            only reason an <strong class="error">ERROR</strong> message is send back by the gateway instead of this message is if the request message was malformed or the client is not yet authorized.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>status</td>
                <td>int</td>
                <td><strong>Status</strong>. <br/>
                    <strong>0</strong> <em>(Success)</em> if the subscription could be removed, <strong>-2</strong> <em>(NoProperty)</em> if the property does not exist.
                    For any other error as for example there is no subscription present, the general status <strong>-1</strong> <em>(Error)</em> is set.
                </td>
            </tr>
            <tr>
                <td>id</td>
                <td>string</td>
                <td><strong>ID of the property</strong>. <br/>
                    Copy of the parameter <strong>id</strong> of the corresponding <strong class="request">UNSUBSCRIBE PROPERTY</strong> message.
                </td>
            </tr>
        </table>
        <pre data-bt-example="134"><code>1886006C413330332E31312E33303233</code></pre>
    </div>
</div>

<p>Should the <strong class="request">UNSUBSCRIBE PROPERTY</strong> message be malformed or the client is not yet authorized, the gateway responds with an <strong class="error">ERROR</strong> message instead.</p>

### Device messages

<p>Devices can publish broadcast messages and the gateway will forward those messages to all connected clients using the <strong class="indication">DEVICE MESSAGE</strong> message.</p>

<div class="bt-api-doc">
    <button class="accordion-toggle">DEVICE MESSAGE</button>
    <div class="accordion-content" hidden>
        <p>
            The <strong>DEVICE MESSAGE</strong> message is send by the gateway to all connected clients whenever a device has broadcast a message.
        </p>
        <h6>parameters</h6>
        <table>
            <tr>
                <th>key</th>
                <th>data type</th>
                <th>description</th>
            </tr>
            <tr>
                <td>timestamp</td>
                <td>unsigned int<br/><em>UNIX Epoch time UTC</em></td>
                <td><strong>Timestamp when the message was received by the gateway</strong>.
                </td>
            </tr>
            <tr>
                <td>access_id</td>
                <td>string</td>
                <td><strong>ID of the device access instance that received the message</strong>.
                </td>
            </tr>
            <tr>
                <td>device_id</td>
                <td>string</td>
                <td><strong>ID of the device that send the message</strong>.
                </td>
            </tr>
            <tr>
                <td>message_id</td>
                <td>int</td>
                <td><strong>ID of the message</strong>.
                </td>
            </tr>
            <tr>
                <td>message</td>
                <td>string</td>
                <td><strong>Textual representation of the message</strong>.
                </td>
            </tr>
        </table>
        <pre data-bt-example="253"><code>18FD1A0372A562644133303362313118D277415558322072656C617920646561637469766174696F6E</code></pre>
    </div>
</div>

<div style="height:60vh"></div>