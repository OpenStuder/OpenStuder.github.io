**Storage drivers** store and retrieve property log data and device messages.

## SQLite

The **SQLite** storage driver saves the property value time-series and the device messages into a local [SQLite](https://www.sqlite.org/index.html) database.

### Parameters

The driver can be configured in the `[Storage]` section inside the `sigateway.conf` configuration file using the following parameters:

#### file

Path and filename of the SQLite database. **Optional**, defaults to */var/lib/openstuder/storage.sqlite*.

#### cleanupInterval

**Optional** interval in seconds at which the storage is cleaned up. This is the interval at which values and messages outside the storage time limit will be removed. The interval defaults to 86400
seconds which is a day (24 hours).

#### maxStorageDays

Maximal storage duration in days for values and messages. This is the maximal duration data is kept in the storage before deleted to save storage space. This **optional** parameter defaults to 730
days (about 2 years).


## Develop your own storage driver

In order to be able to develop and build your own storage driver, you need to install the required development
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

Now you can build your storage driver as follows:

```bash
> cmake -B build .
> cmake --build build
```

You can install your storage driver as follows after a successful build:

```bash
> sudo cmake --build build --target install
```

### Example

You can find a basic example of a minimal storage driver [here](https://github.com/OpenStuder/driver-examples).
