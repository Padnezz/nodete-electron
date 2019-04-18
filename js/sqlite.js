const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { ipcMain } = require('electron');
let db;

db = new sqlite3.Database('./db/nodete.db', (err) => {
    if (err) {
        console.error(err.message);
        
    } else {
        
    }
});