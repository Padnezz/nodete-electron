const fs = require('fs');
const { ipcMain } = require('electron');

ipcMain.on('startVisual', (event, arg) => {
    var parseArg = JSON.parse(arg);
    if (parseArg.status == "REQ") {
        fs.readFile('./db/cyjson.txt', function (err, data) {
            if (err) {
                event.sender.send('startVisual', '{"status":"ERR"}');
                console.error(err);
            } else {
                event.sender.send('startVisual', '{"status":"ACK", "cyjson":' + data + '}');
            }
        });
    }
});

ipcMain.on('saveVisual', (event, arg) => {
    var parseArg = JSON.parse(arg);
    if (parseArg.status == "REQ") {
        fs.writeFile('./db/cyjson.txt', JSON.stringify(parseArg.cyjson), function (err) {
            if (err) {
                event.sender.send('saveVisual', '{"status":"ERR"}');
                console.error(err);
            } else {
                event.sender.send('saveVisual', '{"status":"ACK"}');
            }
        });
    }
});