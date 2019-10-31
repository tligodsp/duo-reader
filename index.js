const electron = require("electron");
const fs = require("fs");
const path = require("path");

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

// let count = 0;
const LIBRARY_PATH = path.join(__dirname, "library");
let mangas = [];

// fs.readFile("db.json", (err, jsonCount) => {
//   if (!err) {
//     const oldCount = JSON.parse(jsonCount);
//     count = oldCount;
//   }
// });

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    // height: 600,
    // width: 800
    fullscreen: true
  });

  console.log(LIBRARY_PATH);

  const startUrl =
    process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
  mainWindow.loadURL(startUrl);

  //enable garbage collector
  mainWindow.on("closed", () => {
    // const jsonCount = JSON.stringify(count);
    // fs.writeFileSync("db.json", jsonCount);

    app.quit();
    mainWindow = null;
  });
};

app.on("ready", createWindow);

ipcMain.on("library:getMangas", () => {
  fs.readdir(LIBRARY_PATH, (err, items) => {
    mangas = items.filter(mangaDir => fs.lstatSync(path.join(LIBRARY_PATH, mangaDir)).isDirectory());
    mainWindow.webContents.send("library:mangaList", mangas);
  });
  // mainWindow.webContents.send("library:mangaList", mangas);
});