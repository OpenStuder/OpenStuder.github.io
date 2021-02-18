## Typescript / Javascript

>[!info]
> The typescript library is currently in development, documentation will be added here as soon as the client library will be released. 

## Python

<a target="_blank" href="https://pypi.org/project/openstuder-client/"><img style="display: inline-block; margin: 0" alt="GitHub" src="https://img.shields.io/pypi/v/openstuder-client.svg"></a>
<img style="display: inline-block; margin: 0" alt="GitHub" src="https://img.shields.io/github/license/openstuder/openstuder-client-python">
<a target="_blank" href="https://github.com/OpenStuder/openstuder-client-python/issues"><img style="display: inline-block; margin: 0" alt="GitHub issues" src="https://img.shields.io/github/issues-raw/openstuder/openstuder-client-python"></a>

The python client allows connecting to and interacting with an OpenStuder gateway. It offers a synchronous and asynchronous API to connect to a gateway and use the gateway's WebSocket API.

The library has only one dependency: **websocket-client 0.57 or newer** which itself has one single dependency (**six**), so the python environment needed to communicate with a Studer Innotec 
installation via the OpenStuder gateway is very lightweight.

### Installation

You can install the **openstuder-client** package using **pip**:

```
# pip install openstuder-client
```

&nbsp;

>[!Tip]
> Some methods of the **websocket-client** are very slow on pure Python. If you have issues with the performance of the client, you can install **numpy** and **wsaccel**.

```
# pip install openstuder-client numpy wsaccel
```

&nbsp;

As the client code is all in one single file, another possibility to use the client is to add the source file 
[openstuder.py](https://github.com/OpenStuder/openstuder-client-python/raw/main/openstuder.py) to your project, but you would still have to add the **websocket-client** library by yourself.

### Usage

#### SIGatewayClient - *synchronous client*

This client uses a synchronous model which has the advantage to be much simpler to use than the asynchronous version. The drawback is that device message indications are ignored by this client and 
subscriptions to property changes are not possible. Another issue is that the thread calling the methods will be blocked until the gateway has responded to the requests. This makes it impossible to 
have multiple request in-flight at the same time. 

##### Establish connection - *connect()*

Establishes the WebSocket connection to the OpenStuder gateway and executes the user authorization process once the connection has been established. This method blocks the
current thread until the operation (authorize) has been completed or an error occurred. The method returns the access level granted to the client during authorization on
success or throws an **SIProtocolError** otherwise.

**Parameters**:
- host: Hostname or IP address of the OpenStuder gateway to connect to. *Required*.
- port: TCP port used for the connection to the OpenStuder gateway, *Optional*, defaults to 1987. 
- user: Username send to the gateway used for authorization. *Optional*.
- password: Password send to the gateway used for authorization. *Optional*.
  
**Returns**:
- Access Level granted to the client.

**Exceptions raised**:
- SIProtocolError: If the connection could not be established, or the authorization was refused.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

host = 'localhost'

client = SIGatewayClient()
try:
    access_level = client.connect(host)

except SIProtocolError as error:
    print(f'Unable to connect: {error.reason()}')
    quit(1)

print(f'Connected, access level = {access_level}, gateway runs version {client.gateway_version()}')
```

This establishes a connection to **localhost** using the guest account. If the client has to authorize using a username and password, you have to provide them in the **connect()** method.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

host = 'localhost'
user = 'garfield'
password = 'lasagne'

client = SIGatewayClient()
try:
    access_level = client.connect(host, user=user, password=password)
    
except SIProtocolError as error:
    print(f'Unable to connect: {error.reason()}')
    quit(1)

print(f'Connected, access level = {access_level}, gateway runs version {client.gateway_version()}')
```

##### Enumerate devices - *enumerate()*

Instructs the gateway to scan every configured and functional device access driver for new devices and remove devices that do not respond anymore. Returns the status of the operation, and the number 
of devices present.

**Parameters**: *The method takes no parameters*.

**Returns**:
1. Operation status.
2. The number of devices present.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
````python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, device_count = client.enumerate()
    print(f'Enumeration complete, status = {status}, device count = {device_count}')

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
````

##### Describe - *describe()*

This method can be used to retrieve information about the available devices and their properties from the connected gateway. Using the optional device_access_id and device_id parameters, the method 
can either request information about the whole topology, a particular device access instance, a device or a property.

The flags control the level of detail in the gateway's response.
- **SIDescriptionFlags.NONE**: No description flags.
- **SIDescriptionFlags.INCLUDE_ACCESS_INFORMATION**: Includes device access instances information.
- **SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION**: Include device information.
- **SIDescriptionFlags.INCLUDE_DRIVER_INFORMATION**: Include device property information.
- **SIDescriptionFlags.INCLUDE_DRIVER_INFORMATION**: Include device access driver information.
  
**Parameters**:
- device_access_id: Device access ID for which the description should be retrieved. *Optional*.
- device_id: Device ID for which the description should be retrieved. *Optional*, note that device_access_id must be present too.
- property_id: Property ID for which the description should be retrieved. *Optional*, note that device_access_id and device_id must be present too. 
- flags: Flags to control level of detail of the response. *Optional*, if no flags are given, the default of the gateway is used.
  
**Returns**:
1. Status of the operation.
2. The subject's id.
3. The description object.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError, SIDescriptionFlags

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, id_, description = client.describe('demo', flags=SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION | SIDescriptionFlags.INCLUDE_PROPERTY_INFORMATION)
    print(f'Description for {id_} demo, status = {status}')
    print(description)

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Reading properties - *read_property()*

This method is used to retrieve the actual value of a given property from the connected gateway. The property is identified by the property_id parameter.

**Parameters**:
- property_id: The ID of the property to read in the form '{device access ID}.{device ID}.{property ID}'. *Required*.
  
**Returns**:
1. Status of the read operation. 
2. The ID of the property read
3. The value read.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, id_, value = client.read_property('demo.sol.11004')
    print(f'Read property {id_}, status = {status}, value = {value}')

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Writing properties - *write_property()*

The write_property() method is used to change the actual value of a given property. The property is identified by the property_id parameter, and the new value is passed by the optional value 
parameter.

The value parameter is optional as it is possible to write to properties with the data type "Signal" where there is no actual value written, the write operation rather triggers an action on the 
device.

**Parameters**:
- property_id: The ID of the property to write in the form '{device access ID}.{<device ID}.{<property ID}'. *Required*.
- value: Optional value to write. *Optional*.
- flags: Write flags, See SIWriteFlags for details, if not provided the flags are not send by the client, and the gateway uses the default flags (SIWriteFlags.PERMANENT). *Optional*.

**Returns**:
1. Status of the write operation.
2. The ID of the property written.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, id_ = client.write_property('demo.inv.1399')
    print(f'Wrote property {id_}, status = {status}')

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Reading datalog - *read_datalog_csv()*

This method is used to retrieve all, or a subset of logged data of a given property from the gateway.

**Parameters**:
- property_id: Global ID of the property for which the logged data should be retrieved. It has to be in the form '{device access ID}.{device ID}.{property ID}'. *Required*.
- from_: *Optional* date and time from which the data has to be retrieved, defaults to the oldest value logged.
- to: *Optional* date and time to which the data has to be retrieved, Defaults to the current time on the gateway.
- limit: Using this *optional* parameter you can limit the number of results retrieved in total.

**Returns**:
1. Status of the operation.
2. ID of the property.
3. Number of entries.
4. Properties data in CSV format whereas the first column is the date and time in ISO 8601 extended format, and the second column contains the actual values.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, id_, entries, csv = client.read_datalog_csv('demo.inv.3136', limit=50)
    print(f'Read datalog for {id_}, status = {status}, entries = {entries}')
    with open('demo.inv.3136.csv', 'w') as file:
        file.write(csv)

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Reading device messages - *read_messages()*

The read_messages() method can be used to retrieve all or a subset of stored messages send by devices on all buses in the past from the gateway.

**Parameters**:
- from_: *Optional* date and time from which the messages have to be retrieved, Defaults to the begin of time.
- to: *Optional* date and time to which the messages have to be retrieved, Defaults to the current time on the gateway.
- limit: Using this *optional* parameter you can limit the number of messages retrieved in total.
  
**Returns**:
1. The status of the operation.
2. The number of messages.
3. The list of retrieved messages.

**Exceptions raised**:
- SIProtocolError: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, count, messages = client.read_messages()
    print(f'Read messages, status = {status}, count = {count}')
    for message in messages:
        print(f'{message.timestamp}: [{message.access_id}.{message.device_id}] {message.message} ({message.message_id})')

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

#### Asynchronous client

>[!info]
> Documentation will be added here soon. 
