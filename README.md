# Quick start

The OpenStuder gateway is the link from the IT world to a Studer Innotec installation. With this gateway, the devices of your Studer Innotec installation can be accessed.

This chapter contains the very basic commands to run in order to install and configure a gateway for a Studer Innotec installation.

For more information about the OpenStuder project, please refer to the [introduction](gateway.md#main)

For more details on the installation or how to contribute and modify the code, please refer to the [Build or develop](gateway.md#build-or-develop) chapter.

## Hardware

You will need the following components to get started:

![](images/QuickStart01.png)

- **A Studer installation** with [Xtender](https://www.studer-innotec.com/en/products/xtender-series/), [VarioTrack](https://www.studer-innotec.com/en/products/variotrack-series/) or
  [VarioString](https://www.studer-innotec.com/en/products/variostring-series/) devices and the 
  [XCom-485i](https://www.studer-innotec.com/en/accessoires/variotrack-series/communication-module-xcom-485i-7397) Modbus interface to access them.
- A **Linux compatible RS485 to USB interface**.  
  Any USB to RS485 cable should work with some tweaking, we recommend using [this cable](https://www.euclide-innovation.com/product-category/cable-modbus-rj45-usb/), as it has already the correct pin 
  configuration in order to connect to the Xcom-485i interface.
- A [Raspberry Pi](https://www.raspberrypi.com), preferable model B+ with a recent installation of [Raspberry Pi OS](https://www.raspberrypi.com/software/).

Connect the **Raspberry Pi** with the **Xcom-485i** interface using the **USB to RS485** cable. The **Xcom-485i** has to be connected to a compatible **Studer Innotec installation**.

If you are new to Linux and/or the Raspberry Pi, have a look at the official [Raspberry Pi documentation](https://www.raspberrypi.com/documentation/computers/getting-started.html) to learn how to 
connect (preferably by SSH) to your Raspberry Pi and execute basic tasks.

## Install gateway software

In order to be able to install the gateway software on your Raspberry Pi, you need to add the openstuder **PPA** (personal package archive):

```
> sudo apt update
> sudo apt install ca-certificates
> curl -s --compressed "https://www.openstuder.io/ppa/KEY.gpg" | sudo apt-key add -
> sudo curl -s --compressed -o /etc/apt/sources.list.d/openstuder.list "https://www.openstuder.io/ppa/openstuder.list"
```

Now you can install the openstuder gateway software using:

```
> sudo apt update
> sudo apt install openstuder-gateway
```

## Start/stop gateway software

The gateway software is started automatically after installation, but you might want to stop or restart the software after having modified the configuration.

You can start the gateway software using:

```
> sudo systemctl start sigatewayd
```

You can stop the gateway software using:

```
> sudo systemctl stop sigatewayd
```

If you need to see the log output for troubleshooting, use:

```
> sudo journalctl -u sigatewayd
```

## Configure gateway software

The files `/etc/openstuder/gateway.conf`, `/ect/openstuder/drivers.conf` and `/ect/openstuder/datalog.conf` contain the gateway configuration.

### gateway.conf

The file `/etc/openstuder/gateway.conf` holds the basic configuration for the gateway itself. The default configuration of the gateway allows access to all basic properties to everyone and 
authorization is disabled. You can modify the file if you like to change the default access level to **Installer** (=owner) in order be able to control the devices or change other general 
settings.

### drivers.conf

The file `/ect/openstuder/drivers.conf` contains the configuration for all drivers. A gateway can be connected to multiple Studer installations, so this file lists all connected installations and
the configuration how to access them. The default configuration is empty, you need to add a driver configuration here in order to be able to access real devices. 

Here an example configuration to access devices over the Xcom-485i interface (default baud rate): 

```
[xcom]
driver = Xcom485i
port = /dev/ttyUSB0
baudRate = 9600
```

### datalog.conf

The last configuration file `/ect/openstuder/datalog.conf` defines which values will be logged to the integrated database. The format is very simple, using the keyword **interval <seconds>** you can
define groups of properties which will be logged to the database at the given *seconds* interval. Such a group contains the list of properties including wildcard support.

The following default configuration will be installed automatically:

```
interval 300
*.*.3136
*.*.3137
*.*.11004
*.*.15010
*.*.7002
*.*.7003
```

`interval 300` defines a group of properties that were logged every 5 minutes (300 seconds). Every property ending with *3136*, *3137*, *11004*, *15010*, *7002* and *7003* will be logged to the
database at the given interval.

For more details, refer to the [Configuration](gateway.md#configuration) chapter.

## Install web interface

Using the **WebSocket API** you can easily develop your own web client for the openstuder gateway, however we provide a standard gateway that you can install pretty easily.

First you need a web server. You can install the webserver of your choice, we will install [lighttpd](https://www.lighttpd.net) as we are serving just static content and lighttpd is very resource
saving:

```
> sudo apt update
> sudo apt install lighttpd
```

Now you can download the actual release of the web UI and extract it into the `/var/www/html` folder (or another folder, depending on your HTTP server configuration):

```
> cd /var/www/html
> wget -qO- https://github.com/OpenStuder/openstuder-gateway-webui/releases/latest/download/openstuder-gateway-webui.tar.bz2 | tar xjv
```

Now you can connect to your Raspberry Pi via a web browser and use the web interface.

## Add security

By default, the authorization process is disabled, and you can connect as guest user. If you need to have different users with different access levels you can enable authentication and user management
by modifying the configuration file `/etc/openstuder/gateway.conf`:

```
...
[Authorize]
enabled = true
...
```

Even if authorization is enabled, the guest user will still have `Basic` access, so if you want to disable this, change the following lines in the file `/etc/openstuder/gateway.conf`:

```
...
[Authorize]
enabled = true
guestAccessLevel = None
...
```

Now that authorization is enabled, you need to create users along with their access levels.

The default authorization driver saves the usernames and password hashes in `/etc/openstuder/users.txt`. You can use the `sigwctl` command to list actual users, add, remove or modify them.

### List users

In order to get the list of all users along with their access privileges do:

```
> sigwctl user list
```

This will show the list of users along with their access rights `Basic`, `Installer`, `Expert` or `QSP` (for qualified service personnel).

### Add a new user

In order to add a new user, do:

```
> sudo sigwctl user add <user>
```

This will ask you the password on the desired access level on the console.

### Change the password of a user

If you want to override the actual password of an existing user, you can do:

```
> sudo sigwctl user pw <user>
```

This will ask for the new password and replace the existing one of the given user.

### Change the access level of a user

If you need to change the actual access level of an existing user, do:

```
> sudo sigwctl user al <user>
```

This will ask for the new access level update the given existing user.

### Remove a user

You can remove a user using:

```
> sudo sigwctl user rm <user>
```

Please, refer to [User Management](gateway.md#user-management) for more details.
