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
