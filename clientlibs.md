<!-- ## Typescript / Javascript -->

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

The client is completely documented using Python docstrings and type annotations. In addition to that the documentation here gives an overview over the different functions.

#### SIGatewayClient - *Synchronous client*

This client uses a synchronous model which has the advantage to be much simpler to use than the asynchronous version. The drawback is that device message indications are ignored by this client and 
subscriptions to property changes are not possible. Another issue is that the thread calling the methods will be blocked until the gateway has responded to the requests. This makes it impossible to 
have multiple request in-flight at the same time. 

##### Establish connection - *connect()*

Establishes the WebSocket connection to the OpenStuder gateway and executes the user authorization process once the connection has been established. This method blocks the
current thread until the operation (authorize) has been completed, or an error occurred. The method returns the access level granted to the client during authorization on
success or throws an **SIProtocolError** otherwise.

**Parameters**:
- `host`: Hostname or IP address of the OpenStuder gateway to connect to. *Required*.
- `port`: TCP port used for the connection to the OpenStuder gateway, *Optional*, defaults to 1987. 
- `user`: Username send to the gateway used for authorization. *Optional*.
- `password`: Password send to the gateway used for authorization. *Optional*.
  
**Returns**:
- Access Level granted to the client.

**Exceptions raised**:
- `SIProtocolError: If the connection could not be established, or the authorization was refused.

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

This establishes a connection to **localhost** using the guest account. If the client has to authorize using a username and password, you have to provide them in the `connect()` method.

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

**Parameters**: *None*.

**Returns**:
1. Operation status.
2. The number of devices present.

**Exceptions raised**:
- `SIProtocolError`: On a connection, protocol or framing error.

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

This method can be used to retrieve information about the available devices and their properties from the connected gateway. Using the optional device_access_id, device_id and property_id parameters, 
the method can either request information about the whole topology, a particular device access instance, a device or a property.

The flags control the level of detail in the gateway's response.
- `SIDescriptionFlags.NONE`: No description flags.
- `SIDescriptionFlags.INCLUDE_ACCESS_INFORMATION`: Includes device access instances information.
- `SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION`: Include device information.
- `SIDescriptionFlags.INCLUDE_DRIVER_INFORMATION`: Include device property information.
- `SIDescriptionFlags.INCLUDE_DRIVER_INFORMATION`: Include device access driver information.
  
**Parameters**:
- `device_access_id`: Device access ID for which the description should be retrieved. *Optional*.
- `device_id`: Device ID for which the description should be retrieved. *Optional*, note that device_access_id must be present too.
- `property_id`: Property ID for which the description should be retrieved. *Optional*, note that device_access_id and device_id must be present too. 
- `flags`: Flags to control level of detail of the response. *Optional*, if no flags are given, the default of the gateway is used.
  
**Returns**:
1. Status of the operation.
2. The subject's id.
3. The description object.

**Exceptions raised**:
- `SIProtocolError`: On a connection, protocol or framing error.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError, SIDescriptionFlags

try:
    client = SIGatewayClient()
    client.connect('localhost')
    status, id_, description = client.describe('demo', flags=SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION | SIDescriptionFlags.INCLUDE_PROPERTY_INFORMATION)
    print(f'Description for {id_}, status = {status}')
    print(description)

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Reading properties - *read_property()*

This method is used to retrieve the actual value of a given property from the connected gateway. The property is identified by the property_id parameter.

**Parameters**:
- `property_id`: The ID of the property to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*.
  
**Returns**:
1. Status of the read operation. 
2. The ID of the property read
3. The value read.

**Exceptions raised**:
- `SIProtocolError`: On a connection, protocol or framing error.

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

##### Reading multiple properties - *read_properties()*

This method is used to retrieve the actual value of multiple properties at once from the connected gateway. The properties are identified by the property_ids parameter.

**Parameters**:
- `property_ids`: List of IDs of the properties to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*.

**Returns**:
1. List of statuses and values of all read properties.

*Example:*
```python
from openstuder import SIGatewayClient, SIProtocolError

try:
    client = SIGatewayClient()
    client.connect('localhost')
    results = client.read_properties(['demo.sol.11004', 'demo.inv.3136'])
    for result in results:
        print(f'Read property {result.id}, status = {result.status}, value = {result.value}')

except SIProtocolError as error:
    print(f'Error: {error.reason()}')
```

##### Writing properties - *write_property()*

The `write_property()` method is used to change the actual value of a given property. The property is identified by the property_id parameter, and the new value is passed by the optional value 
parameter.

The value parameter is optional as it is possible to write to properties with the data type "Signal" where there is no actual value written, the write operation rather triggers an action on the 
device.

**Parameters**:
- `property_id`: The ID of the property to write in the form '{device access ID}.{<device ID}.{<property ID}'. *Required*.
- `value`: Optional value to write. *Optional*.
- `flags`: Write flags, See SIWriteFlags for details, if not provided the flags are not send by the client, and the gateway uses the default flags (SIWriteFlags.PERMANENT). *Optional*.

**Returns**:
1. Status of the write operation.
2. The ID of the property written.

**Exceptions raised**:
- `SIProtocolError`: On a connection, protocol or framing error.

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
- `property_id`: Global ID of the property for which the logged data should be retrieved. It has to be in the form '{device access ID}.{device ID}.{property ID}'. *Required*.
- `from_`: *Optional* date and time from which the data has to be retrieved, defaults to the oldest value logged.
- `to`: *Optional* date and time to which the data has to be retrieved, defaults to the current time on the gateway.
- `limit`: Using this *optional* parameter you can limit the number of results retrieved in total.

**Returns**:
1. Status of the operation.
2. ID of the property.
3. Number of entries.
4. Properties data in CSV format whereas the first column is the date and time in ISO 8601 extended format, and the second column contains the actual values.

**Exceptions raised**:
- `SIProtocolError`: On a connection, protocol or framing error.

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

The `read_messages()` method can be used to retrieve all or a subset of stored messages send by devices on all buses in the past from the gateway.

**Parameters**:
- `from_`: *Optional* date and time from which the messages have to be retrieved, defaults to the oldest message saved.
- `to`: *Optional* date and time to which the messages have to be retrieved, defaults to the current time on the gateway.
- `limit`: Using this *optional* parameter you can limit the number of messages retrieved in total.
  
**Returns**:
1. The status of the operation.
2. The number of messages.
3. The list of retrieved messages.
``
**Exceptions raised**:
- `SIProtocolError: On a connection, protocol or framing error.

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

#### SIAsyncGatewayClient - *Asynchronous client*

Complete, asynchronous (non-blocking) OpenStuder gateway client. This client uses an asynchronous model which has the disadvantage to be a bit harder to use than the synchronous version. The 
advantages are that long operations do not block the main thread as all results are reported using callbacks, device message indications are supported and subscriptions to property changes are 
possible.

>[!Note]
> Some examples set the `background` parameter to `False` in order to keep the scripts running, if you use the asynchronous client along with a GUI framework or there is a main thread that continues
> to run, you should not provide this parameter and use the default behavior which runs in the background.

##### Establish connection - *connect()*

Establishes the WebSocket connection to the OpenStuder gateway and executes the user authorization process once the connection has been established in the background. This method returns immediately 
and does not block the current thread.

The status of the connection attempt is reported either by the `on_connected()` callback on success, or the `on_error()` callback if the connection could not be established, or the authorisation for 
the given user was rejected by the gateway.

**Parameters**:
- `host`: Hostname or IP address of the OpenStuder gateway to connect to. *Required*
- `port`: TCP port used for the connection to the OpenStuder gateway. *Optional*, defaults to 1987.
- `user`: Username send to the gateway used for authorization. *Optional*.
- `password`: Password send to the gateway used for authorization. *Optional*.
- `background`: If true, the handling of the WebSocket connection is done in the background, if false the current thread is used and the method will never return. *Optional*, defaults to true.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If there was an error initiating the WebSocket connection.

**Callback parameters**: `on_connected()`
1. The access level that was granted to the user during authorization.
2. The version of the OpenStuder software running on the gateway. 

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    print(f'Connected, access level = {access_level}, gateway runs version {client.gateway_version()}')


host = 'localhost'

client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.connect(host, background=False)
```

The example above establishes a connection to **localhost** using the guest account. If the client has to authorize using a username and password, you have to provide them in the `connect()` method.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    print(f'Connected, access level = {access_level}, gateway runs version {client.gateway_version()}')


host = 'localhost'
user = 'garfield'
password = 'lasagne'

client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.connect(host, user=user, password=password, background=False)
```

##### Enumerate devices - *enumerate()*

Instructs the gateway to scan every configured and functional device access driver for new devices and remove devices that do not respond anymore.

The status of the operation and the number of devices present are reported using the `on_enumerated()` callback.

**Parameters**: *None*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_enumerated()`
1. Operation status.
2. Number of devices present.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.enumerate()


def on_enumerated(status: SIStatus, device_count: int):
    print(f'Enumerated, status = {status}, device count = {device_count}')
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_enumerated = on_enumerated
client.connect('localhost', background=False)
```

##### Describe - *describe()*

This method can be used to retrieve information about the available devices and their properties from the connected gateway. Using the optional device_access_id and
device_id parameters, the method can either request information about the whole topology, a particular device access instance, a device or a property.

The flags control the level of detail in the gateway's response.

The description is reported using the `on_description()` callback.

**Parameters**:
- `device_access_id`: Device access ID for which the description should be retrieved. *Optional*.
- `device_id`: Device ID for which the description should be retrieved. *Optional*, note that device_access_id must be present too.
- `property_id`: Property ID for which the description should be retrieved. *Optional*, note that device_access_id and device_id must be present too.
- `flags`: Flags to control level of detail of the response. *Optional*.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_description()`
1. Status of the operation.
2. The subject's ID.
3. The description object.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus, SIDescriptionFlags


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.describe('demo', flags=SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION | SIDescriptionFlags.INCLUDE_PROPERTY_INFORMATION)


def on_description(status: SIStatus, id_: str, description: object):
    print(f'Description for {id_}, status = {status}')
    print(description)
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_description = on_description
client.connect('localhost', background=False)
```

##### Reading properties - *read_property()*

This method is used to retrieve the actual value of a given property from the connected gateway. The property is identified by the property_id parameter.

The status of the read operation and the actual value of the property are reported using the `on_property_read()` callback.

**Parameters**:
- `property_id`: The ID of the property to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_property_read()`
1. Status of the read operation.
2. The ID of the property read.
3. The value read.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.read_property('demo.sol.11004')


def on_property_read(status: SIStatus, id_: str, value: any):
    print(f'Property read, status = {status}, id = {id_}, value = {value}')
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_property_read = on_property_read
client.connect('localhost', background=False)
```

##### Reading multiple properties - *read_properties()*

This method is used to retrieve the actual value of multiple properties at once from the connected gateway. The properties are identified by the property_ids parameter.

The status of the read operation and the actual value of the property are reported using the `on_properties_read()` callback.

**Parameters**:
- `property_ids`: List of IDs of the properties to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_properties_read()`
1. List if status, id and value of the read operations.

*Example:*
```python
from typing import List
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus, SIPropertyReadResult


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.read_properties(['demo.sol.11004', "demo.inv.3136"])


def on_properties_read(results: List[SIPropertyReadResult]):
    for result in results:
        print(f'Property read, status = {result.status}, id = {result.id}, value = {result.value}')
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_properties_read = on_properties_read
client.connect('localhost', background=False)
```

##### Writing properties - *write_property()*

The write_property method is used to change the actual value of a given property. The property is identified by the property_id parameter and the new value is passed by the optional value parameter.

This value parameter is optional as it is possible to write to properties with the data type "Signal" where there is no actual value written, the write operation rather triggers an action on the
device.

The status of the write operation is reported using the `on_property_written()` callback.

**Parameters**:
- `property_id`: The ID of the property to write in the form '{device access ID}.{<device ID}.{<property ID}'. *Required*
- `value`: *Optional* value to write.
- `flags`: *Optional* write flags, See SIWriteFlags for details, if not provided the flags are not send by the client and the gateway uses the default flags (SIWriteFlags.PERMANENT).

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_property_written()`
1. Status of the write operation.
2. The ID of the property written.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.write_property('demo.inv.1415')


def on_property_written(status: SIStatus, id_: str):
    print(f'Property written, status = {status}, id = {id_}')
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_property_written = on_property_written
client.connect('localhost', background=False)

```

##### Subscribing to properties - *subscribe_property(), unsubscribe_property()*

The method `subscribe_to_property()` can be used to subscribe to a property on the connected gateway. The property is identified by the property_id parameter.

The status of the subscribe request is reported using the `on_property_subscribed()` callback.

**Parameters**:
- `property_id`: The ID of the property to subscribe to in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.
  
**Callback parameters**: `on_property_subscribed()`
1. The status of the subscription.
2. The ID of the property.

The callback `on_property_updated()` is called whenever the gateway did send a property update.

**Callback parameters**: `on_property_updated()`
1. The ID of the property that has updated.
2. The actual value.

The method `unsubscribe_from_property()` can be used to unsubscribe from a property on the connected gateway. The property is identified by the property_id parameter.

The status of the unsubscribe request is reported using the `on_property_unsubscribed()` callback.

**Parameters**:
- `property_id`: The ID of the property to unsubscribe from in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_property_unsubscribed()`
1. The status of the unsubscription.
2. The ID of the property.

*Example:*
```python
import time
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.subscribe_to_property('demo.sol.11004')


def on_property_subscribed(status: SIStatus, id_: str):
    print(f'Subscribed to {id_}, status = {status}')


def on_property_updated(id_: str, value: any):
    print(f'Property {id_} updated, value = {value}')


def on_property_unsubscribed(status: SIStatus, id_: str):
    print(f'Unsubscribed from {id_}, status = {status}')


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_property_subscribed = on_property_subscribed
client.on_property_updated = on_property_updated
client.on_property_unsubscribed = on_property_unsubscribed
client.connect('localhost')
time.sleep(10)
client.unsubscribe_from_property('demo.sol.11004')
time.sleep(2)
```

##### Subscribing to multiple properties - *subscribe_properties(), unsubscribe_properties()*

The method `subscribe_to_properties()` can be used to subscribe to multiple properties on the connected gateway. The properties are identified by the property_ids parameter.

The status of the multiple subscribe request is reported using the `on_properties_subscribed()` callback.

**Parameters**:
- `property_ids`: List of IDs of the properties to subscribe to in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_properties_subscribed()`
1. List of SIPropertySubscriptionResult objects containing the id and status for each property subscription.

The method `unsubscribe_from_properties()` can be used to unsubscribe from multiple properties on the connected gateway. The properties are identified by the property_ids parameter.

The status of the multiple unsubscribe request is reported using the `on_properties_unsubscribed()` callback.

**Parameters**:
- `property_ids`: List of IDs of the properties to unsubscribe from in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_properties_unsubscribed()`
1. List of SIPropertySubscriptionResult objects containing the id and status for each property subscription.

*Example:*
```python
import time
from typing import List
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus, SIPropertySubscriptionResult


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.subscribe_to_properties(['demo.sol.11004', 'demo.inv.3136'])


def on_properties_subscribed(statuses: List[SIPropertySubscriptionResult]):
    for status in statuses:
        print(f'Subscribed to {status.id}, status = {status.status}')


def on_property_updated(id_: str, value: any):
    print(f'Property {id_} updated, value = {value}')


def on_properties_unsubscribed(statuses: List[SIPropertySubscriptionResult]):
    for status in statuses:
        print(f'Unsubscribed from {status.id}, status = {status.status}')


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_properties_subscribed = on_properties_subscribed
client.on_property_updated = on_property_updated
client.on_properties_unsubscribed = on_properties_unsubscribed
client.connect('localhost')
time.sleep(10)
client.unsubscribe_from_properties(['demo.sol.11004', 'demo.inv.3136'])
time.sleep(2)
```

##### Reading datalog - *read_datalog_csv()*

This method is used to retrieve all, or a subset of logged data of a given property from the gateway.

The status of this operation and the respective values are reported using the `on_datalog_read_csv()` callback.

**Parameters**:
- `property_id`: Global ID of the property for which the logged data should be retrieved. It has to be in the form `{device access ID}.{device ID}.{property ID}`. *Required*
- `from_`: *Optional* date and time from which the data has to be retrieved, defaults to the oldest value logged.
- `to`: *Optional* date and time to which the data has to be retrieved, defaults to the current time on the gateway.
- `limit`: Using this optional parameter you can limit the number of results retrieved in total. *Optional*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_datalog_read_csv()`
1. Status of the operation.
2. ID of the property.
3. Number of entries.
4. Property log data in CSV format whereas the first column is the date and time in ISO 8601 extended format and the second column contains the actual values.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.read_datalog('demo.inv.3136', limit=50)


def on_datalog_read_csv(status: SIStatus, id_: str, entries: int, csv: str):
    print(f'Read datalog for {id_}, status = {status}, entries = {entries}')
    with open('demo.inv.3136.csv', 'w') as file:
        file.write(csv)
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_datalog_read_csv = on_datalog_read_csv
client.connect('localhost', background=False)
```

##### Reading device messages - *read_messages()*

The `read_messages()` method can be used to retrieve all or a subset of stored messages send by devices on all buses in the past from the gateway.

The status of this operation and the retrieved messages are reported using the `on_messages_read()` callback.

**Parameters**:
- `from_`: *Optional* date and time from which the messages have to be retrieved, defaults to the oldest message saved.
- `to`: *Optional* date and time to which the messages have to be retrieved, Defaults to the current time on the gateway.
- `limit`: Using this optional parameter you can limit the number of messages retrieved in total.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `on_messages_read()`
1. The status of the operation.
2. The number of messages retrieved.
3. The list of retrieved messages.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIStatus


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    client.read_messages()


def on_messages_read(status: SIStatus, count: int, messages: list):
    print(f'Read messages, status = {status}, messages = {count}')
    if status == SIStatus.SUCCESS and count > 0:
        with open('messages.csv', 'w') as file:
            for message in messages:
                file.write(f'{message.timestamp.isoformat()},{message.access_id},{message.device_id},{message.message_id},{message.message}\n')
    client.disconnect()


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_messages_read = on_messages_read
client.connect('localhost', background=False)
```

##### Device message indications

Once connected to the gateway, the gateway will send device messages to the client automatically. This callback is called whenever a device message was received from the gateway.

**Callback parameters**: `on_device_message()`
1. The device message object received.

*Example:*
```python
from openstuder import SIAsyncGatewayClient, SIProtocolError, SIDeviceMessage


def on_error(error: SIProtocolError):
    print(f'Unable to connect: {error.reason()}')


def on_connected(access_level: str, gateway_version: str):
    print(f'Connected, access level = {access_level}, gateway runs version {client.gateway_version()}')


def on_device_message(message: SIDeviceMessage):
    print(f'{message.timestamp}: [{message.access_id}.{message.device_id}] {message.message} ({message.message_id})')


client = SIAsyncGatewayClient()
client.on_error = on_error
client.on_connected = on_connected
client.on_device_message = on_device_message
client.connect('localhost', background=False)
```

## Web Client

The web client allows connecting and interacting with an OpenStuder gateway. It offers an asynchronous API to connect to a gateway and use the gateway's WebSocket API.
This library is written in javascript but allows typescript implementation.

### Installation
You can install the **OpenstuderClient** package using **npm**:

```
# npm i @marcocrettena/openstuder
```

As the client code is all in one single file, another possibility to use the client is to add a source file 
[openstuder](https://github.com/OpenStuder/openstuder-client-web/tree/main/src/OpenStuder) to your project.

### Usage

To use the API, the user needs to implement the `OpenStuderInterface` interface to one class to accede to the different provided callbacks.
The second implementation needed is to create an instance of `SIGatewayClient` which permits the user to connect and communicate with the gateway.

The client is documented using JSDoc. In addition to that, the documentation here gives an overview on the different functions.

#### SIGatewayClient - *Asynchronous client*

This client is asynchronous which permits the use of subscription process and so the different update of some properties can be caught.

The strategy with this class is to create a SIGatewayClient instance and use the different function described below.

##### Set callback - *setCallback()*

This function set the different callback for the SIGatewayClient instance. This allows the main class (if he implements the SIGatewayCallback interface) to treat by himself the information provided by the gateway.

**Parameters**:
- `siGatewayCallback`: Instance of the class who implements the SIGatewayCallback *Required*

**Returns**: *None*

##### Establish connection - *connect()*

Establishes the WebSocket connection to the OpenStuder gateway and executes the user authorization process once the connection has been established in the background. This method returns immediately 
and does not block the current thread.

The status of the connection attempt is reported either by the `onConnect()` callback on success, either by the `onError()` callback if the connection could not be established, or the authorisation for 
the given user was rejected by the gateway.

**Parameters**:
- `host`: Hostname or IP address of the OpenStuder gateway to connect to. *Required*
- `port`: TCP port used for the connection to the OpenStuder gateway. *Optional*, defaults to 1987.
- `user`: Username send to the gateway used for authorization. *Optional*.
- `password`: Password send to the gateway used for authorization. *Optional*.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If there was an error initiating the WebSocket connection.

**Callback parameters**: `onConnected()`
1. The access level that was granted to the user during authorization.
2. The version of the OpenStuder software running on the gateway. 

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    isConnected:boolean;
    accessLevel:SIAccessLevel
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={isConnected:false, accessLevel:SIAccessLevel.NONE};
    }

    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }

    public render() {
        let str:string = this.state.isConnected ? "true":"false";
        return (
            <div>
                <p>Connected : {str}</p>
                <p>Access Level : {this.state.accessLevel}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.setState({isConnected:true, accessLevel:accessLevel});
    }
    public onDisconnected(): void {
        this.setState({isConnected:false, accessLevel:SIAccessLevel.NONE});
    }
}
```

The example above establishes a connection to **localhost** using the guest account. If the client has to authorize using a username and password, you have to provide them in the `connect()` method.

*Example:*
```python
    public componentDidMount() {
            let user = "Garfield";
            let password = "lasagne";
            this.sigc.connect("localhost", 1987, user, password);
    }
```

##### Enumerate devices - *enumerate()*

Instructs the gateway to scan every configured and functional device access driver for new devices and remove devices that do not respond anymore.

The status of the operation and the number of devices present are reported using the `onEnumerated()` callback.

**Parameters**: *None*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onEnumerated()`
1. Operation status.
2. Number of devices present.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"
type AppState={
    numberOfDevice:number;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={numberOfDevice:-1};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>Number of device : {this.state.numberOfDevice}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.enumerate();
    }
    onEnumerated(status: SIStatus, deviceCount: number): void {
                this.setState({numberOfDevice:deviceCount});
    }
}
```

##### Describe - *describe()*

This method can be used to retrieve information about the available devices and their properties from the connected gateway. Using the optional deviceAccessId and
deviceId parameters, the method can either request information about the whole topology, a particular device access instance, a device or a property.

The flags control the level of detail in the gateway's response.

The description is reported using the `onDescription()` callback.

**Parameters**:
- `deviceAccessId`: Device access ID for which the description should be retrieved. *Optional*.
- `deviceId`: Device ID for which the description should be retrieved. *Optional*, note that deviceAccessId must be present too.
- `propertyId`: Property ID for which the description should be retrieved. *Optional*, note that deviceAccessId and deviceId must be present too.
- `flags`: Flags to control level of detail of the response. *Optional*.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onDescription()`
1. Status of the operation.
2. The subject's ID.
3. The description object.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    jsonDescription:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={jsonDescription:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }

    public render() {
        return (
            <div>
                <p>{this.state.jsonDescription}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        let flags:SIDescriptionFlags[] = [SIDescriptionFlags.INCLUDE_DEVICE_INFORMATION,SIDescriptionFlags.INCLUDE_PROPERTY_INFORMATION];
        this.sigc.describe(undefined,undefined,undefined,flags);
    }
    onDescription(status: SIStatus, description: string, id?: string): void {
                this.setState({jsonDescription: description});
    }
}
```

##### Reading properties - *readProperty()*

This method is used to retrieve the actual value of a given property from the connected gateway. The property is identified by the propertyId parameter.

The status of the read operation and the actual value of the property are reported using the `onPropertyRead()` callback.

**Parameters**:
- `propertyId`: The ID of the property to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onPropertyRead()`
1. Status of the read operation.
2. The ID of the property read.
3. The value read.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    value:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={value:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>Read value : {this.state.value}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.readProperty('demo.sol.11004');
    }
    onPropertyRead(status: SIStatus, propertyId: string, value?: string): void {
        this.setState({value: ""+value});
    }
}
```

##### Reading multiple properties - *readProperties()*

This method is used to retrieve the actual value of multiple properties at once from the connected gateway. The properties are identified by the propertyIds parameter.

**Parameters**:
- `propertyIds`: List of IDs of the properties to read in the form `{device access ID}.{device ID}.{property ID}`. *Required*.

**Returns**:
1. List of statuses and values of all read properties.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    valueProperty11004:string;
    valueProperty3136:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={valueProperty11004:"-", valueProperty3136:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>Value of Property 11004 : {this.state.valueProperty11004}</p>
                <p>Value of Property 3136 : {this.state.valueProperty3136}</p>
             </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.readProperties(['demo.sol.11004', 'demo.inv.3136']);
    }
    onPropertiesRead(results: SIPropertyReadResult[]): void {
        this.setState({valueProperty11004:results[0].value, valueProperty3136:results[1].value});
    }
}
```

##### Writing properties - *writeProperty()*

The writeProperty method is used to change the actual value of a given property. The property is identified by the propertyId parameter and the new value is passed by the optional value parameter.

This value parameter is optional as it is possible to write to properties with the data type "Signal" where there is no actual value written, the write operation rather triggers an action on the
device.

The status of the write operation is reported using the `onPropertyWritten()` callback.

**Parameters**:
- `propertyId`: The ID of the property to write in the form '{device access ID}.{<device ID}.{<property ID}'. *Required*
- `value`: *Optional* value to write.
- `flags`: *Optional* write flags, See SIWriteFlags for details, if not provided the flags are not send by the client and the gateway uses the default flags (SIWriteFlags.PERMANENT).

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onPropertyWritten()`
1. Status of the write operation.
2. The ID of the property written.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    status:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:OSI.SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={status:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>Status of written property : {this.state.status}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.writeProperty('demo.inv.1415');
    }
    onPropertyWritten(status: SIStatus, propertyId: string): void {
        this.setState({status: ""+SIStatus});
    }
}
```

##### Subscribing to properties - *subscribeProperty(), unsubscribeProperty()*

The method `subscribeToProperty()` can be used to subscribe to a property on the connected gateway. The property is identified by the propertyId parameter.

The status of the subscribe request is reported using the `onPropertySubscribed()` callback.

**Parameters**:
- `propertyId`: The ID of the property to subscribe to in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.
  
**Callback parameters**: `onPropertySubscribed()`
1. The status of the subscription.
2. The ID of the property.

The callback `onPropertyUpdated()` is called whenever the gateway did send a property update.

**Callback parameters**: `onPropertyUpdated()`
1. The ID of the property that has updated.
2. The actual value.

The method `unsubscribeFromProperty()` can be used to unsubscribe from a property on the connected gateway. The property is identified by the propertyId parameter.

The status of the unsubscribe request is reported using the `onPropertyUnsubscribed()` callback.

**Parameters**:
- `propertyId`: The ID of the property to unsubscribe from in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onPropertyUnsubscribed()`
1. The status of the unsubscription.
2. The ID of the property.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    status:string;
    value:string;
}
const maxUpdate:number = 3;
let countUpdate:number = 0;

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={status:"-", value:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }

    public render() {
        return (
            <div>
                <p>Status of the property : {this.state.status}</p>
                <p>Last value of property : {this.state.value}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.subscribeToProperty('demo.sol.11004');
    }
    onPropertySubscribed(status: SIStatus, propertyId: string): void {
        this.setState({status: "subscription -> " + status});
    }
    onPropertyUnsubscribed(status: SIStatus, propertyId: string): void {
        this.setState({status: "unsubscription -> " + status});
    }
    onPropertyUpdated(propertyId: string, value: any): void {
        this.setState({value: value});
        countUpdate++;
        if(countUpdate===maxUpdate){
            this.sigc.unsubscribeFromProperty('demo.sol.11004');
        }
    }
}
```

##### Subscribing to multiple properties - *subscribeProperties(), unsubscribeProperties()*

The method `subscribeToProperties()` can be used to subscribe to multiple properties on the connected gateway. The properties are identified by the propertyIds parameter.

The status of the multiple subscribe request is reported using the `onPropertiesSubscribed()` callback.

**Parameters**:
- `propertyIds`: List of IDs of the properties to subscribe to in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onPropertiesSubscribed()`
1. List of SIPropertySubscriptionResult objects containing the id and status for each property subscription.

The method `unsubscribeFromProperties()` can be used to unsubscribe from multiple properties on the connected gateway. The properties are identified by the propertyIds parameter.

The status of the multiple unsubscribe request is reported using the `onPropertiesUnsubscribed()` callback.

**Parameters**:
- `propertyIds`: List of IDs of the properties to unsubscribe from in the form `{device access ID}.{device ID}.{property ID}`. *Required*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onPropertiesUnsubscribed()`
1. List of SIPropertySubscriptionResult objects containing the id and status for each property subscription.

*Example:*
```python
import React from 'react';

import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    subscribed:boolean;
    valueProperty11004:string;
    valueProperty3136:string;
}
let countUpdate=0;
const MAXUPDATE=4;

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={subscribed:false, valueProperty11004:"-", valueProperty3136:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("ws://172.22.22.50");
    }
    public render() {
        let subscribed:string = this.state.subscribed?"true":"false";
        return (
            <div>
                <p> Subscription : {subscribed}</p>
                <p>Value of Property 11004 : {this.state.valueProperty11004}</p>
                <p>Value of Property 3136 : {this.state.valueProperty3136}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.subscribeToProperties(['demo.sol.11004', 'demo.inv.3136']);
    }
    onPropertiesSubscribed(statuses: SISubscriptionsResult[]): void {
        if(statuses[0].status===0 && statuses[1].status===0){
            this.setState({subscribed:true});
        }
    }

    onPropertiesUnsubscribed(statuses: SISubscriptionsResult[]): void {
        this.setState({subscribed:false});
    }
    onPropertyUpdated(propertyId: string, value: any): void {
        if(propertyId='demo.sol.11004'){
            this.setState({valueProperty11004:value});
        }
        if(propertyId='demo.inv.3136'){
            this.setState({valueProperty3136:value});
        }
        countUpdate++;
        if(countUpdate===MAXUPDATE){
            this.sigc.unsubscribeFromProperties(['demo.sol.11004', 'demo.inv.3136']);
        }
    }
}
```

##### Reading datalog - *readDatalog()*

This method is used to retrieve all, or a subset of logged data of a given property from the gateway.

The status of this operation and the respective values are reported using the `onDatalogRead()` callback.

**Parameters**:
- `propertyId`: Global ID of the property for which the logged data should be retrieved. It has to be in the form `{device access ID}.{device ID}.{property ID}`. *Required*
- `dateFrom`: *Optional* date and time from which the data has to be retrieved, defaults to the oldest value logged.
- `dateTo`: *Optional* date and time to which the data has to be retrieved, defaults to the current time on the gateway.
- `limit`: Using this optional parameter you can limit the number of results retrieved in total. *Optional*

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onDatalogRead()`
1. Status of the operation.
2. ID of the property.
3. Number of entries.
4. Property log data in CSV format whereas the first column is the date and time in ISO 8601 extended format and the second column contains the actual values.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    countDatalogMessages:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={countDatalogMessages:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>Count of messages: {this.state.countDatalogMessages}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.readDatalog('demo.inv.3136', undefined, undefined, 50);
    }
    onDatalogRead(status: SIStatus, propertyId: string, count: number, values: string): void {
        this.setState({countDatalogMessages:count});
    }
}
```

##### Reading device messages - *readMessages()*

The `readMessages()` method can be used to retrieve all or a subset of stored messages send by devices on all buses in the past from the gateway.

The status of this operation and the retrieved messages are reported using the `onMessagesRead()` callback.

**Parameters**:
- `dateFrom`: *Optional* date and time from which the messages have to be retrieved, defaults to the oldest message saved.
- `dateTo`: *Optional* date and time to which the messages have to be retrieved, Defaults to the current time on the gateway.
- `limit`: Using this optional parameter you can limit the number of messages retrieved in total.

**Returns**: *None*

**Exceptions raised**:
- `SIProtocolError`: If the client is not connected or not yet authorized.

**Callback parameters**: `onMessagesRead()`
1. The status of the operation.
2. The number of messages retrieved.
3. The list of retrieved messages.

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    readMessage:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={readMessage:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div>
                <p>{this.state.readMessage}</p>
            </div>
        );
    }
    onConnected(accessLevel: SIAccessLevel, gatewayVersion: string): void {
        this.sigc.readMessages();
    }
    onMessageRead(status: SIStatus, count: number, messages: SIDeviceMessage[]): void {
        let count:number=0;
        let str:string="";
        messages.map(deviceMessage =>{
            count++;
            str.concat("Message number " + count + ":\n");
            if(deviceMessage.message){
                str.concat(deviceMessage.body+"\n");
            }
            str.concat("\n");
        });
        this.setState({readMessage:str});
    }
}
```

##### Device message indications

Once connected to the gateway, the gateway will send device messages to the client automatically. This callback is called whenever a device message was received from the gateway.

**Callback parameters**: `onDeviceMessage()`
1. The access ID of the device access instance that received the message.
2. The message ID
3. The message
4. The device ID that send the message
5. The timestamp when the message was received by the gateway. 

*Example:*
```python
import React from 'react';
import {
    SIGatewayClient, SIGatewayCallback, SIWriteFlags,
    SIDescriptionFlags, SISubscriptionsResult, SIPropertyReadResult,
    SIStatus, SIAccessLevel, SIDeviceMessage, SIConnectionState
} from "@marcocrettena/openstuder"

type AppState={
    readMessage:string;
}

class App extends React.Component<{ }, AppState> implements SIGatewayCallback{

    sigc:SIGatewayClient;

    constructor(props:any){
        super(props);
        this.sigc=new SIGatewayClient();
        this.state={readMessage:"-"};
    }
    public componentDidMount() {
        this.sigc.setCallback(this);
        this.sigc.connect("localhost");
    }
    public render() {
        return (
            <div className="App">
                <p>{this.state.readMessage}</p>
            </div>
        );
    }
    onDeviceMessage(message: SIDeviceMessage): void {
        if(deviceMessage.message){
            this.setState({readMessage:message.message});
        }
    }
}
```








