# AdminCustomFiles

Admin Custom Files is a simple module that can add custom javascript plug-ins, scripts and styles to the Processwire admin area.

AdminCustomFiles is for ProcessWire 3 and up, if you are looking for the non name spaced AdminCustomFiles, you can still [download it at GitHub](https://github.com/Da-Fecto/AdminCustomFilesLegacy).

## Loading custom scripts & styles.

On install we try to create the AdminCustomFiles folder (/site/templates/AdminCustomFiles/). When This folder doesn't exist, please create it manually, then Module config will confirm the existence of AdminCustomFiles directory.

**Default scripts and styles**<br>
We will inject .css and/or .js in the admin when the filename starts with the running process name and the file is in the AdminCustomFiles directory. Next you need to activate it for the process.

**Theme based scripts and styles**<br>
Put files in the AdminCustomFiles directory that start with the currently active AdminTheme name and those files should get loaded.

**Dependencies**<br>
Dependencies will load before the other injected files. See the module configuration for more details.

## Cache busting

Adds a file hash get variable to all custom files to force a fresh copy from the server.

## Config JS

Additional ProcessWire information in the console. See: console.log(config.AdminCustomFiles).
