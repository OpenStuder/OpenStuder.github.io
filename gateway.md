<!-- ## Introduction

## Installation

## Configuration -->

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