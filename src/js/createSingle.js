"use strict";

const fs = require("fs")

let bundlejs = fs.readFileSync("/home/app/pub/app.bundle.js")
let html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Zootr-Tracker</title>
    </head>
    <body>
        <div id="main"></div>
        <script type="text/javascript">
            ${bundlejs}
        </script>
    </body>
</html>
`
let file = fs.createWriteStream("/home/app/src/js/index.html")
file.write(html)
