const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { ipcMain } = require('electron');
let db;

db = new sqlite3.Database('./db/nodete.db', (err) => {
    if (err) {
        console.error(err.message); 
    }
});

ipcMain.on('addNode', (event, arg) => {
    var parseArg = JSON.parse(arg);
    if (parseArg.status == "REQ") {
        db.run(`INSERT INTO nodes(ip, hostname) VALUES(?, ?)`, [parseArg.ip, parseArg.hostname], function(err) {
            if (err) {
              console.error(err.message);
            }
        });
    }
});