ScriptAlias /${instanceid}/mapserv /usr/lib/cgi-bin/mapserv
<Location /${instanceid}/mapserv>
   # If you use tilecache and want to prevent direct WMS access, uncomment
   # the following lines:
   Order Deny,Allow
   Deny from all
   ${mapserv_allow}

   # SetHandler must be set to "cgi-script" when running the project on windows
   SetHandler fcgid-script
   # MapServer run in FastCGI mode by default.
   # If mod_fcgid is not available, replace 'fcgid-script' by 'cgi-script' to
   # use the CGI mode.
   SetEnv MS_MAPFILE ${directory}/mapserver/c2cgeoportal.map
   #SetEnv MS_MAPFILE_PATTERN "^${directory}/mapserver/c2cgeoportal.map$"
</Location>
