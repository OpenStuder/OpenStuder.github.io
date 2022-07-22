**Authorize drivers** return an access level based on the user credentials that were provided in the **AUTHORIZE** during client connection setup. Optionally an authorize 
driver can provide user management functionality.

## Internal

The **Internal** authorization driver uses the file `/etc/openstuder/users.txt` to authorize users and `sigwctl` or the protocol extension `UserManagement` can be used to add, 
remove or modify users.

The **Internal** driver has no parameters.


## Develop your own authorize driver

In order to be able to develop and build your own authorize driver, you need to install the required development
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

Now you can build your authorize driver as follows:

```bash
> cmake -B build .
> cmake --build build
```

You can install your authorize driver as follows after a successful build:

```bash
> sudo cmake --build build --target install
```

### Example

You can find a basic example of a simple authorize driver [here](https://github.com/OpenStuder/driver-examples).

