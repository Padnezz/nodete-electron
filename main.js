const { app, BrowserWindow } = require('electron');
require("./js/sqlite.js");
require("./js/cy.js");
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({ width: 1820, height: 880 });

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('ready', createWindow);