/* eslint-disable no-loop-func */
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
    height: 600,
    width: 800,
    resizable: true,
    show: false
  });

  mainWindow.maximize();
  mainWindow.show();

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

function readMangasData(mangaPaths) {
  mangaPaths.forEach(mangaDir => {
    fs.readFile(path.join(LIBRARY_PATH, mangaDir, "data.json"), (err, res) => {
      if (err) {
        throw console.log(err);
      }
      const mangaData = JSON.parse(res);
      mangaData.id = mangaDir;
      mangas = [ ...mangas, mangaData ];
      mainWindow.webContents.send("library:mangaList", mangas);
    });
  });
}

ipcMain.on("library:getMangas", () => {
  mangas = [];
  fs.readdir(LIBRARY_PATH, (err, items) => {
    let mangaPaths = items.filter(dir => fs.lstatSync(path.join(LIBRARY_PATH, dir)).isDirectory());
    readMangasData(mangaPaths);
    mainWindow.webContents.send("library:mangaList", mangas);
  });
});