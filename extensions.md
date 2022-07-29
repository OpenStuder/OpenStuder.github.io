**Protocol extensions** allow to add functionality to the openstuder core protocol without the need to change or recompile the main gateway executable and its core services.

## WifiConfig

The WifiConfig extensions allows to setup and configure the WiFi client and access point options of the Raspberry Pi 4B 
onboard WiFi chipset using the openstuder WebSocket or Bluetooth protocol. Although it might work on other platforms too, it was never tested.

### Configuration

The WifiConfig extension can be enabled by adding the `[WifiConfig]` section to the extension configuration file at `/etc/openstuder/extensions.conf`.

#### allowedUsers

This is a comma-separated list of usernames that are allowed to use the WifiConfig extension.

This configuration parameter is **required**.

#### countryCode

Country code where the openstuder gateway will be installed in. This is required to configure the correct behavior of the WiFi chip for the country the 
gateway is running in.

This configuration parameter is **required**.

#### accessPointInstall

If `true`, the required software and configuration files to enable simultaneous client and AP mode will be installed if no AP interface is present yet. 

> [!INFO]
> During this installation, the Raspberry Pi has to be connected to the internet via the LAN cable and it will restart at the end of the installation.

Defaults to `true`.

#### accessPointInitialSSID

Initial SSID of the WiFi access point if the AP mode will be installed.

**Optional**, defaults to "openstuder".

#### accessPointInitialPassKey

Initial passkey of the WiFi access point if the AP mode will be installed. Note that the passkey has to be at least 8 characters long.

**Optional**, defaults to "openstuder".

### Example

```ini
[WifiConfig]
allowedUsers = admin,georges
accessPointInstall = true
accessPointInitialSSID = myhouse
accessPointInitialPassKey = mys3cr3t
```

This example section of an extension configuration file enables the WifiConfig extensions and the users `admin` and `georges` are allowed to use the extension.
The required packages and configuration files will be installed with the SSID "myhouse" and the passkey "mys3cr3t".

### Commands

#### status

The `status` command returns the actual status of the WiFi client and access point.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WifiConfig
command:status
```

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:WifiConfig
command:status
status:Success
client_enabled:false
client_connected:false
client_ssid:
client_ip:
ap_enabled:true
ap_ssid:openstuder
wired_connected:true
wired_ip:192.168.1.129
```

`status` is the status of the operation.

`client_enabled` is true if the WiFi client mode is activated, `client_connected` is true if the client could connect to an access point, the `client_ssid` will be the
SSID of the WiFi access point the client is connected to and `client_ip` is the IP address that was attributed to the client.

`ap_enabled` is true if the WiFi access point mode is activated, `ap_ssid` is the SSID that is used by the openstuder gateway.

Additionally, the status of the wired ethernet connection is included where `wired_connected` is true if an ethernet cable is connected to the device and `wired_ip` is 
the IP address used by that interface.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "WiFiConfig", "status"
```
```Bluetooth request (CBOR encoded)
0b6a57694669436f6e66696766737461747573
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "WifiConfig", "status", <status:integer>, 
<client_enabled:bool>, <client_connected:bool>, <client_ssid:string>, <client_ip:string>, 
<ap_enabled:bool>, <ap_ssid:string>, <wired_connected:bool>, <wired_ip:string>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

`<client_enabled:bool>` is true if the WiFi client mode is activated, `<client_connected:bool>` is true if the client could connect to an access point, the 
`<client_ssid:string>` will be the SSID of the WiFi access point the client is connected to and `<client_ip:string>` is the IP address that was attributed to the client.

`<ap_enabled:bool>` is true if the WiFi access point mode is activated, `<ap_ssid:string>` is the SSID that is used by the openstuder gateway.

Additionally, the status of the wired ethernet connection is included where `<wired_connected:bool>` is true if an ethernet cable is connected to the device and 
`<wired_ip:string>` is the IP address used by that interface.

#### scan

The `scan` command will scan for WiFi networks and returns a list of all detected WiFi access points.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WifiConfig
command:scan
```

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
command:scan
extension:WifiConfig
status:Success

[
  {
    "encrypted":true,
    "signal":-26,
    "ssid":"plzdt-247845"
  },
  {
    "encrypted":true,
    "signal":-60,
    "ssid":"ezdhf-174956"
  }
]
```

`status` is the status of the operation.

The response will contain the detected WiFi networks as a JSON array in the message body. Every network has three properties:

- `ssid`: SSID of the network/access point.
- `signal`: Signal level.
- `encrypted`: `true` if the network is encrypted (private), `false` if the network is open.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "WiFiConfig", "scan"
```
```Bluetooth request (CBOR encoded)
0b6a57694669436f6e666967647363616e
```

_The gateway will respond as follows._
```Bluetooth response (human readable)
139, "WifiConfig", "scan", <status:integer>, <ssids:stringlist>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

`<ssids:stringlist` is the list of all detected SSIDs.

#### cliconf

This command can be used to modify the client configuration.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WifiConfig
command:cliconf
enabled:true
ssid:my-ap
passkey:12345678
```

The parameter `enabled` is required. If `true` the WiFi client will be enabled, if `false` the WiFi client  will be disabled. 

The parameter `ssid` is the SSID of the access point/wireless network to connect to and is only required if `enabled` is `true`.

The parameter `passkey` is the password/key to be used to connect to the access point/wireless network and is only required if `enabled` is `true`.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
command:scan
extension:WifiConfig
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "WiFiConfig", "cliconf", <enabled:bool>, <ssid:string>, <passkey:string>
```

`<enabled:bool>` is required and enables or disabled the WiFi client functionality.

`<ssid:string>` is the SSID of the WiFi network to connect to and is only required of enabled is true.

`<passkey:string>` is the password/key to use to connect to the secured wireless network and is only required of enabled is true.

```Bluetooth example request (CBOR encoded)
0b6a57694669436f6e66696767636c69636f6e66f564746f746f683132333435363738
```

_The gateway will respond as follows._
```Bluetooth response (human readable)
139, "WifiConfig", "scan", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

#### apconf

This command can be used to modify the access point configuration.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WifiConfig
command:apconf
enabled:true
channel:5
ssid:openstuder
passkey:12345678
```

The header `enabled` is required. If `true` the WiFi access point will be enabled, if `false` the WiFi access point will be disabled.

The header `channel` is optional and defaults to `1`.

The header `ssid` is the SSID of the access point and is only required if `enabled` is `true`.

The header `passkey` is the password/key to be used to connect secure the wireless network and is only required if `enabled` is `true`.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
command:scan
extension:WifiConfig
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "WiFiConfig", "apconf", <enabled:bool>, <ssid:string>, <passkey:string>
```

`<enabled:bool>` is required and enables or disabled the WiFi access point functionality.

`<ssid:string>` is the SSID of the WiFi access point and is only required of enabled is true.

`<passkey:string>` is the password/key for the secured wireless network of the AP and is only required of enabled is true.

```Bluetooth example request (CBOR encoded)
0b6a57694669436f6e666967666170636f6e66f564746f746f683132333435363738
```

_The gateway will respond as follows._
```Bluetooth response (human readable)
139, "WifiConfig", "scan", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

## UserManagement

The UserManagement extension allows to manage users over the openstuder WebSocket or Bluetooth protocol.

### Configuration

The UserManagement extension can be enabled by adding the `[UserManagement]` section to the extension configuration file at `/etc/openstuder/extensions.conf`.

#### allowedUsers

The extension takes one mandatory configuration parameter in its section: `allowedUsers`. This is a comma-separated list of usernames that are allowed to use the 
UserManagement extension.

> [!ATTENTION]
> All users in this list have full access for user management!

### Example

```ini
[UserManagement]
allowedUsers = admin,james
```

This example section of a extension configuration file enables the UserManagement extensions and the users `admin` and `james` are allowed to use the extension.

### Commands

#### list

The `list` command returns a list of all users along their access levels.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:UserManagement
command:list
```

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:UserManagement
command:list
status:Success

{
  "admin":"Expert",
  "user1":"Basic",
  "user2":"Installer",
  "user3":"Expert"
}
```

`status` is the status of the operation.

The body of the response is a map of username to access level of all existing users.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "UserManagement", "list"
```
```Bluetooth request (CBOR encoded)
0b6e557365724d616e6167656d656e74646c697374
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "UserManagement", "list", <status:integer>, <users:map>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

The users are stored in the map `<users:map>'  where the username is the key and the access level is the value.

#### add

The `add` command can be used to add a new user.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:UserManagement
command:add
username:johndoe
password:12345678
access_level:Basic
```

`username` is the username for the new user, if a user with that username already exists, the command will fail. `password` is the 
password the user has to use for login and `access_level` is the actual access level for that new user.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:UserManagement
command:add
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "UserManagement", "add", <username:string>, <password:string>, <access_level:AccessLevel>
```
```Bluetooth example request (CBOR encoded)
0b6e557365724d616e6167656d656e7463616464f564746f746f683132333435363738
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "UserManagement", "add", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

#### change_password

The `change_password` command can be used to change the password of an  existing user.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:UserManagement
command:change_password
username:johndoe
password:87654321
```

`username` is the username of the user for whom to change the password, if a user with that username does not exist, the command will fail. `password` is the
new password the user has to use for login.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:UserManagement
command:change_password
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "UserManagement", "change_password", <username:string>, <password:string>
```
```Bluetooth example request (CBOR encoded)
0b6e557365724d616e6167656d656e746f6368616e67655f70617373776f7264676a6f686e646f65683837363534333231
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "UserManagement", "change_password", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

#### change_access_level

The `change_access_level` command can be used to change the access level of an existing user.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:UserManagement
command:change_access_level
username:johndoe
access_level:Expert
```

`username` is the username of the user for whom to change the access level, if a user with that username does not exist, the command will fail. `access_level` is the
new access level to grant to the user.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:UserManagement
command:change_access_level
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "UserManagement", "change_access_level", <username:string>, <password:string>
```
```Bluetooth example request (CBOR encoded)
0b6e557365724d616e6167656d656e74736368616e67655f6163636573735f6c6576656c676a6f686e646f6566457870657274
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "UserManagement", "change_access_level", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

#### remove

The `remove` command can be used to remove an existing user.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:UserManagement
command:remove
username:johndoe
```

`username` is the username of the user to remove, if a user with that username does not exist, the command will fail.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:UserManagement
command:remove
status:Success
```

`status` is the status of the operation.

##### Bluetooth API

_The request has to be as follows:_
```Bluetooth request (human readable)
11, "UserManagement", "remove", <username:string>
```
```Bluetooth example request (CBOR encoded)
0b6e557365724d616e6167656d656e746672656d6f7665676a6f686e646f65
```

_The gateway will respond as follows._
```Bluetooth response (human readable) 
139, "UserManagement", "remove", <status:integer>
```

`<status:integer>` is the status of the operation where `0` means success and all other values represent an error.

## WebStorage

The WebStorage extension allows to save key/value data. This is typically used by web clients to store state and configuration.

### Configuration

The WebStorage extension can be enabled by adding the `[WebStorage]` section to the extension configuration file at `/etc/openstuder/extensions.conf`.

>[!INFO]
> The WebStorage extension is enabled by default.

#### file

_Optional_ storage location for the web storage data file. If not provided, the default location will be used.

### Example

```ini
[WebStorage]
file = /usr/var/webstorage.data
```

This example section of an extension configuration file enables the WebStorage extension.
The key/value storage file will be located at `/usr/var/webstorage.data`.

### Commands

#### read

The `read` command can be used to read the value attributed to a given key.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WebStorage
command:read
key:accent_color
```

`key` is the key of the value to read.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:WebStorage
command:read
status:Success
key:accent_color

#ACACAC 
```

`status` is the status of the operation, `key` is the requested key. The value for the given key is returned as the body.

##### Bluetooth API

_This protocol extension does not support Bluetooth._

#### write

The `write` command can be used to write the value for a given key.

##### WebSocket API

_The request has to be as follows:_
```WebSocket request
CALL EXTENSION
extension:WebStorage
command:write
key:user_profile_johndoe

{
  "image": null,
  "friendlyName": "John J. Doe"
}
```

`key` is the key of the value to write, the value itself is given in the body of the message.

_The gateway will respond as follows._
```WebSocket response
EXTENSION CALLED
extension:WebStorage
command:write
key:user_profile_johndoe
status:Success
```

`status` is the status of the operation, `key` is the requested key to write to.

##### Bluetooth API

_This protocol extension does not support Bluetooth._

## Develop your own protocol extension

In order to be able to develop and build your own protocol extension driver, you need to install the required development
packages first:

```bash
> sudo apt update
> sudo apt install \
gcc g++ gdb cmake ninja-build \
qt5-default \
libqt5serialport5-dev libqt5serialbus5-dev libqt5serialbus5-plugins \
libqt5websockets5-dev \
qtconnectivity5-dev
```

Then you have to setup a CMake-based project for the driver. The CMake file has to look as follows:

```cmake
cmake_minimum_required(VERSION 3.0)
project(<EXTENSION NAME>)
find_package(SIExtension REQUIRED)
si_add_extension_driver(<EXTENSION NAME> <SOURCE FILES...>)
```

Now you can build your extension as follows:

```bash
> cmake -B build .
> cmake --build build
```

You can install your extension as follows after a successful build:

```bash
> sudo cmake --build build --target install
```

### Example

You can find a basic example of a minimal protocol extension [here](https://github.com/OpenStuder/driver-examples).
