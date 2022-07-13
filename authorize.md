**Authorize drivers** return an access level based on the user credentials that were provided in the **AUTHORIZE** during client connection setup. Optionally an authorize 
driver can provide user management functionality.

## Internal

The **Internal** authorization driver uses the file `/etc/openstuder/users.txt` to authorize users and `sigwctl` or the protocol extension `UserManagement` can be used to add, 
remove or modify users.

The **Internal** driver has no parameters.
