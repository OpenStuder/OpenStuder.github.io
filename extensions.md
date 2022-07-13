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