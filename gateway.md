## Introduction

The OpenStuder gateway is the link from the IT world to a Studer Innotec installation. Using a bus converter unit like the [XCom-485i](https://www.studer-innotec.com/en/accessoires/variotrack-series/communication-module-xcom-485i-7397), the devices on the Studer [CAN](https://en.wikipedia.org/wiki/CAN_bus) bus can be accessed using a simple message-based protocol over [WebSockets](https://en.wikipedia.org/wiki/WebSocket) or optionally via a custom [Bluetooth LE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) profile.

![](images/Gateway-Structure.svg)

Studer Innotec devices are traditionally connected via a proprietary protocol which uses CAN as MAC layer. A direct access to the CAN bus is not possible due to security restrictions enforced by Studer Innotec. Even if access would be possible, it is much easier to find an USB to RS485 converter that can be connected to a Linux box like for example the [Raspberry Pi](https://www.raspberrypi.org) then it is to connect directly to a CAN bus.

> [!Note]
> The gateway uses plugins (called device access drivers) to access the different devices and busses. This allows a gateway to connect to multiple bus converters at the same time and makes it possible to add support for new devices and bus converters without any modification of the gateway software itself.

The device access protocol provided by the Gateway is based on WebSockets - this enables a simple access from either web sites using the Browsers's Javascript API or any application as there are WebSocket client libraries available for almost all programming languages and platforms.


### Pluggable design

> TODO

#### Device access driver

> TODO

#### Storage driver

> TODO

#### Authorize driver

> [!ATTENTION]
> This functionality is not implemented yet.

## Installation

> [!ATTENTION]
> Currently are no pre-build packages available, so the software has to be compiled and installed manually as described in the [Build or develop](#build-or-develop) chapter.

## Configuration

The configuration of the gateway is divided in two separate configuration files:

- `/etc/openstuder/sigatewayd.conf`: This file contains the general configuration of the gateway daemon itself.
- `/etc/openstuder/drivers.conf`: This file lists the device access drivers to instantiate and their configuration.

If security is enabled, a third file `/etc/openstuder/users.txt` contains the list of users along with their password hashes and configured access level. You will have to use the `sigwctl user` CLI command to add, list, modify and delete user accounts in that file. 

### Gateway configuration `/etc/openstuder/sigatewayd.conf`

#### Gateway section

The `Gateway` section contains general settings for the OpenStuder gateway daemon.

##### driverSearchPaths

Space-separated list of paths where the gateway daemon is searching for **device access**, **storage** and **authorize** plugins. Note that the plugins folders are searched in the order they are in the list.

**Optional**, default value is `/var/lib/openstuder/drivers`.

##### propertyPollInterval

Interval in milliseconds, at which properties with real-time subscriptions (from WebSocket or Bluetooth clients) will be periodically read.

**Optional**, defaults to `10000` (10 seconds).

##### Example

```ini
[Gateway]
driverSearchPaths = /var/lib/openstuder/drivers /home/john/.drivers
propertyPollInterval = 5000
```

In this example, the gateway searches inside the folder `/home/john/.drivers` for drivers if they are not located in the default location `/var/lib/openstuder/drivers`. Properties with subscriptions are read every 5 seconds (5000 ms).

#### Storage section

> TODO

##### driver

> TODO

##### Driver specific settings

> TODO

***SQLite driver***

> TODO

##### Example

```ini
[Storage]
driver = SQLite
file = /var/lib/studergateway/storage.sqlite
```

> TODO

#### WebSocket section

> TODO

##### `enabled`

> TODO

##### `port`

> TODO

##### Example

```ini
[WebSocket]
enabled = true
port = 1987
```

> TODO

#### Bluetooth section

> TODO

##### `enabled`

> TODO

##### `name`

> TODO

##### Example

```ini
[Bluetooth]
enabled = true
name = A303
```

> TODO

#### Security section

> TODO

##### `enabled`

> TODO

##### `allowGuest`

> TODO

##### `defaultAccessLevel`

> TODO

##### Example

```ini
[Security]
enabled = true
allowGuest = true
defaultAccessLevel = Basic
```

> TODO

### Device access driver configuration `/etc/openstuder/drivers.conf`

> TODO

#### General

> TODO

#### Supported drivers

> TODO

##### XCom485i

> TODO

#### Example

> TODO


## Start and stop daemon

> TODO
 
## sigwctl

> TODO

### User management

These commands can be used to manage user accounts and their respective access level.

> [!Note]
> User accounts are only relevant if security is enabled in the gateway daemon configuration file.

#### `sigwctl user list`

> TODO

#### `sigwctl user add <user>`

> TODO

#### `sigwctl user pw <user>`

> TODO

#### `sigwctl user al <user>`

> TODO

#### `sigwctl user rm <user>`

> TODO

## Build or develop

If you like to compile the OpenStuder gateway yourself or if you want to modify the gateway software itself, you can clone or download the source code from the GitHub repository [here](https://github.com/OpenStuder/gateway). However before you are able to do that, you need to prepare your system for OpenStuder gateway development.

Despite the fact that the gateway software has been developed to be platform independent and should work theoretically on all major platforms like [Linux](https://de.wikipedia.org/wiki/Linux), [macOS](https://www.apple.com/chde/macos/) and [Windows](https://www.microsoft.com/windows), this guide has been written for [Raspberry Pi OS](https://www.raspberrypi.org/software/) running on a [Raspberry Pi](https://www.raspberrypi.org) and was only tested on that distribution, but it should work very similar on [Debian Linux](https://www.debian.org/index.de.html) and all Debian based Linux distributions like [Ubuntu](https://ubuntu.com) or [Mint](https://linuxmint.com) for example. 

#### Install dependencies

As a first step, we need to install the dependencies of the software. Basically [git](https://git-scm.com), [GCC](https://gcc.gnu.org), [CMake](https://cmake.org) and the open-source version of the [Qt SDK](https://www.qt.io).

```
> sudo apt update
> sudo apt install \
	git gcc g++ gdb cmake ninja-build \
    qt5-default \
    libqt5serialport5-dev libqt5serialbus5-dev libqt5serialbus5-plugins \
	libqt5websockets5-dev \
	qtconnectivity5-dev
```

#### Clone the repository

```
> git clone https://github.com/OpenStuder/gateway.git
```

##### Branches

The current stable version of the software can be found in the [main](https://github.com/OpenStuder/gateway/tree/main) branch which will be cloned by default, the [develop](https://github.com/OpenStuder/gateway/tree/develop) branch features the latest changes and fixes. If you like to compile a specific version of the software have a look at the [tags](https://github.com/OpenStuder/gateway/tags) present in the repository.

To switch to another branch, you can use your favorite git gui client or use the git CLI:

```
> git branch {branch} origin/{branch}
> git checkout {branch}
```

`{branch}` is the name of the desired branch to switch to.

#### Build the gateway software

```
> cd gateway
> cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release
> cmake --build build --target all
```

If you want to build the *debug* version of the software instead of the *release* version, replace  `-DCMAKE_BUILD_TYPE=Release` by `-DCMAKE_BUILD_TYPE=Debug`.

#### Install gateway software

If you desire to install the gateway software on the very same host it was build on, you can build the target **install**.

> [!NOTE]
> You should first build the software in order to ensure that the build process is run by your user and not the root user.

```
> sudo cmake --build build --target install
```

<!-- #### Create package

You can create a *Debian* package that can be installed on other systems without the need to install all the development dependencies.

```
> cmake --build build --target package
```
-->