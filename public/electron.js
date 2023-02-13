const path = require('path');
const { app, BrowserWindow, ipcMain, globalShortcut, shell } = require('electron');
const fs = require('fs');

const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.maximize();
  win.show();

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev ? 'http://localhost:4004' : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    win.reload();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('save-txt', async (event, { exportPath, fileConfig }) => {
  const savePath = path.join(exportPath, fileConfig.name);
  await fs.promises.writeFile(savePath, fileConfig.text, { encoding: 'utf8' });

  return true;
});

ipcMain.handle('show-file-in-fs', async (event, { exportPath, imageName }) => {
  const imagePath = path.join(exportPath, imageName);
  shell.showItemInFolder(imagePath);

  return true;
});

ipcMain.handle('sync-image-fs', async (event, { exportPath, imageName }) => {
  const imagePath = path.join(exportPath, imageName);
  return await fs.promises.readFile(imagePath);
});

ipcMain.handle('save-image', async (event, { exportPath, fileConfig }) => {
  const savePath = path.join(exportPath, fileConfig.name);
  await fs.promises.writeFile(savePath, fileConfig.buffer);

  return true;
});

ipcMain.handle('delete-files', async (event, { exportPath, imageName, promptsName }) => {
  try {
    await fs.promises.unlink(path.join(exportPath, imageName));
    await fs.promises.unlink(path.join(exportPath, promptsName));
  } catch (err) {
    return { imageRemoved: true };
  }

  return true;
});
