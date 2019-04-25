const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { ipcMain } = require('electron');
let db;

db = new sqlite3.Database('./db/nodete.db', (err) => {
    if (err) {
        console.error(err.message); 
    }
});

function getLink(hostname, interface){
    db.get(`SELECT * FROM links WHERE source = ? AND source_int = ?`, [hostname, interface], function(err, rows) {
        if (err) {
          console.error(err.message);
        } else {
          return JSON.stringify(rows);
        }
    });
    db.get(`SELECT * FROM links WHERE target = ? AND target_int = ?`, [hostname, interface], function(err, rows) {
        if (err) {
          console.error(err.message);
        } else {
          return JSON.stringify(rows);
        }
    });
}

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

ipcMain.on('deleteNode', (event, arg) => {
    var parseArg = JSON.parse(arg);
    if (parseArg.status == "REQ") {
        db.run(`DELETE FROM nodes WHERE hostname = ?`, [parseArg.hostname], function(err) {
            if (err) {
              console.error(err.message);
            }
        });
    }
});

ipcMain.on('addLink', (event, arg) => {
    var parseArg = JSON.parse(arg);
    if (parseArg.status == "REQ") {
        db.run(`INSERT INTO links(source, target, source_int, target_int) VALUES(?, ?, ?, ?)`, [parseArg.source, parseArg.target, parseArg.source_int, parseArg.target_int], function(err) {
            if (err) {
              console.error(err.message);
            }
        });
    }
});

ipcMain.on('deleteLink', (event, arg) => {
    var parseArg = JSON.parse(arg);
    var delete_row;
    if (parseArg.status == "REQ") {
        db.get(`SELECT * FROM links WHERE source = ? AND source_int = ?`, [parseArg.hostname, parseArg.interface], function(err, rows) {
            if (err) {
              console.error(err.message);
            } else {
                if(rows != undefined){
                    delete_row = rows.id;
                }
            }
        });
        db.get(`SELECT * FROM links WHERE target = ? AND target_int = ?`, [parseArg.hostname, parseArg.interface], function(err, rows) {
            if (err) {
              console.error(err.message);
            } else {
                if(rows != undefined){
                    console.log(rows.id)
                    delete_row = rows.id;
                }
            }
        });

        db.run(`DELETE FROM links WHERE id = ` + delete_row, [], function(err) {
            if (err) {
              console.error(err.message);
            }
            console.log(delete_row);
            console.log(this.lastID);
            console.log(this.changes);
        });
    }
});