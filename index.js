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
        throw err;
      }
      const mangaData = JSON.parse(res);
      mangaData.id = mangaDir;
      mangas = [ ...mangas, mangaData ].sort((a, b) => {
        if (a.id === b.id) {
          return 0;
        }
        return a.id > b.id ? 1 : -1;
      });
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

ipcMain.on("manga:getCurrent", (event, id) => {
  const currentManga = mangas.find(manga => manga.id === id);
  // console.log(currentManga);
  mainWindow.webContents.send("manga:current", currentManga);
});

ipcMain.on("chapter:getContent", (event, { mangaId, chapterId }) => {
  fs.readFile(path.join(LIBRARY_PATH, mangaId, "data.json"), (err, res) => {
    if (err) {
      throw err;
    }
    const curManga = JSON.parse(res);
    const languages = curManga.chapters.find(chapter => chapter.id === chapterId).languages;
    console.log(languages);
    let chapterPaths = [];
    for (let language of languages) {
      console.log(language);
      chapterPaths.push(path.join(LIBRARY_PATH, mangaId, "chapters", chapterId, language));
    }
    let chapterContent = {
        imgPaths: [],
        languages: languages,
    };

    for (let chapterPath of chapterPaths) {    
      // fs.readdir(chapterPath, (err, items) => {
      //   let images = items.filter(() => true); //to be added: check image
      //   chapterContent = { ...chapterContent, imgPaths: [ ...chapterContent.imgPaths, images ]};
      //   mainWindow.webContents.send("chapter:content", chapterContent);
      //   console.log(images);
      // });
      const items = fs.readdirSync(chapterPath);
      let images = items.filter(() => true); //to be added: check image
      chapterContent = { ...chapterContent, imgPaths: [ ...chapterContent.imgPaths, images ]};
      mainWindow.webContents.send("chapter:content", chapterContent);
      console.log(images);
    }
  });
});

ipcMain.on("manga:saveFile", (event, mangaData) => {
  const mangaFolder = path.join(LIBRARY_PATH, mangaData.id);
  const coverFolder = path.join(mangaFolder, 'covers');
  if (!fs.existsSync(mangaFolder)) {
    fs.mkdirSync(mangaFolder);
  }
  if (!fs.existsSync(coverFolder)) {
    fs.mkdirSync(coverFolder);
  }
  // if (!fs.existsSync(path.join(LIBRARY_PATH, mangaData.id, 'covers'))) {
  //   fs.mkdirSync(path.join(LIBRARY_PATH, mangaData.id, 'covers'), { recursive: true });
  // }
  if (!isImageFile(path.join(LIBRARY_PATH, mangaData.id, mangaData.cover))) {
    fs.copyFile('assets/default_cover.jpg', path.join(LIBRARY_PATH, mangaData.id, 'covers/default_cover.jpg'), (err) => {
      if (err) throw err;
      fs.writeFileSync(path.join(LIBRARY_PATH, mangaData.id, "data.json"), JSON.stringify(mangaData, null, 2));
    });
  }
  else {
    fs.writeFileSync(path.join(LIBRARY_PATH, mangaData.id, "data.json"), JSON.stringify(mangaData, null, 2));
  }
});

const isImageFile = (filePath) => {
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  if (!fs.lstatSync(filePath).isFile()) {
    return false;
  }
  const fileType = filePath.slice(-3, 3);
  console.log(fileType);
  return (fileType === 'jpg' || fileType === 'png') ? true : false;
};