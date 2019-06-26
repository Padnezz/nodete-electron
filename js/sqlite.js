const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { ipcMain } = require('electron');
let db;
sqlite3.verbose()
db = new sqlite3.Database('./db/nodete.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

ipcMain.on('addNode', (event, arg) => {
  var parseArg = JSON.parse(arg);
  if (parseArg.status == "REQ") {
    db.run(`INSERT INTO nodes(ip, hostname) VALUES(?, ?)`, [parseArg.ip, parseArg.hostname], function (err) {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

ipcMain.on('deleteNode', (event, arg) => {
  var parseArg = JSON.parse(arg);
  if (parseArg.status == "REQ") {
    db.run(`DELETE FROM nodes WHERE hostname = ?`, [parseArg.hostname], function (err) {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

ipcMain.on('addLink', (event, arg) => {
  var parseArg = JSON.parse(arg);
  if (parseArg.status == "REQ") {
    db.run(`INSERT INTO links(source, target, source_int, target_int) VALUES(?, ?, ?, ?)`, [parseArg.source, parseArg.target, parseArg.source_int, parseArg.target_int], function (err) {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

ipcMain.on('deleteLink', (event, arg) => {
  var parseArg = JSON.parse(arg);
  if (parseArg.status == "REQ") {
    db.get(`SELECT * FROM links WHERE source = ? AND source_int = ?`, [parseArg.hostname, parseArg.interface], function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        if (rows != undefined) {
          delete_row = rows.id;
          db.run(`DELETE FROM links WHERE source = ? AND source_int = ?`, [rows.source, rows.source_int], function (err) {
            if (err) {
              console.error(err.message);
            } else {
              event.sender.send('deleteLink', '{"status":"ACK", "id":"' + rows.source + "-" + rows.source_int + "_" + rows.target + "-" + rows.target_int + '"}');
            }
          });
        }
      }
    });
    db.get(`SELECT * FROM links WHERE target = ? AND target_int = ?`, [parseArg.hostname, parseArg.interface], function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        if (rows != undefined) {
          delete_row = rows.id;
          db.run(`DELETE FROM links WHERE target = ? AND target_int = ?`, [rows.target, rows.target_int], function (err) {
            if (err) {
              console.error(err.message);
            } else {
              event.sender.send('deleteLink', '{"status":"ACK", "id":"' + rows.source + "-" + rows.source_int + "_" + rows.target + "-" + rows.target_int + '"}');
            }
          });
        }
      }
    });
  }
});

ipcMain.on('getLink', (event, arg) => {
  var parseArg = JSON.parse(arg);
  if (parseArg.status == "REQ") {
    db.get(`SELECT * FROM links WHERE source = ? AND source_int = ?`, [parseArg.hostname, parseArg.interface], function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        if (rows != undefined) {
        event.sender.send('getLink', '{"status":"ACK", "st":"source", "traffic":"'+parseArg.traffic+'", "hostname":"'+parseArg.hostname+'", "interface":"'+parseArg.interface+'", "id":"' + rows.source + "-" + rows.source_int + "_" + rows.target + "-" + rows.target_int + '"}');
        }
      }
    });
    db.get(`SELECT * FROM links WHERE target = ? AND target_int = ?`, [parseArg.hostname, parseArg.interface], function (err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        if (rows != undefined) {
        event.sender.send('getLink', '{"status":"ACK", "st":"target", "traffic":"'+parseArg.traffic+'", "hostname":"'+parseArg.hostname+'", "interface":"'+parseArg.interface+'", "id":"' + rows.source + "-" + rows.source_int + "_" + rows.target + "-" + rows.target_int + '"}');
        }  
      }
    });
  }
});