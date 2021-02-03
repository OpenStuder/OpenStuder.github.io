# Quick start

<img src="images/UnderConstruction.svg" width="400px"></img>

> [!Note]
> The OpenStuder project is in a very early stage and documentation will be added on a daily base.

The OpenStuder gateway is the link from the IT world to a Studer Innotec installation. With this gateway, the devices of your Studer Innotec installation can be accessed.

This chapter contains the basic line command to execute in order to create a gateway for a Studer Innotec installation.

For more information about OpenStuder, please refer to the [introduction](http://openstuder.codemonkey.ch/#/gateway?id=main)

For more details for the installation, please refer to the [Build or develop](http://openstuder.codemonkey.ch/#/gateway?id=build-or-develop) chapter.

## Installation

### Install dependencies

```
> sudo apt update
> sudo apt install \
git gcc g++ gdb cmake ninja-build \
    qt5-default \
    libqt5serialport5-dev libqt5serialbus5-dev libqt5serialbus5-plugins \
    libqt5websockets5-dev \
    qtconnectivity5-dev
```

### Clone the repository

```
> git clone https://github.com/OpenStuder/gateway.git
```

### Build the gateway software

```
> cd gateway
> cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release
> cmake --build build --target all
```

### Install gateway software

```
> sudo cmake --build build --target install
```

In order to start the gateway, run the following commands:

```
> sudo systemctl daemon-reload
> sudo systemctl start sigatewayd
```
## Command for the gateway

#### start

```
> sudo systemctl start sigatewayd
```

#### stop

```
> sudo systemctl stop sigatewayd
```

#### status

```
> sudo systemctl status sigatewayd
```

#### log output

```
> sudo journalctl -u sigatewayd
```

## Configuration

The files `/etc/openstuder/gateway.conf` and `/var/lib/openstuder/drivers` contain the different configurations.

All the information about the different configurations are commented in the different files.

You can read/write a file in a console with the text editor nano:

```
> sudo nano <file_path>
```

For more details, refer to the [Configuration](http://openstuder.codemonkey.ch/#/gateway?id=configuration) chapter.

## User Management

The following command can be used to manage the users :

### Add a new user
```
>sudo sigwctl user add <user>
```

### List all user with their access level
```
>sigwctl user list
```

### Change the password of a user
```
>sigwctl user pw <user>
```

### Change the access level of a user
```
>sigwctl user al <user>
```

### Remove a user
```
>sudo sigwctl user rm <user>
```

Please, refer to [User Management](http://openstuder.codemonkey.ch/#/gateway?id=user-management) for more features.
