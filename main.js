const { app, BrowserWindow } = require('electron');
let ipcMain = require('electron').ipcMain;

// const url = require("url");
const path = require("path");

let mainWindow

// 热加载
try {
	require('electron-reloader')(module, {});
} catch (_) {
	console.log('热加载错误');
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 1000,
		minWidth: 1400,
		minHeight: 1000,
		useContentSize: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + '/preload.js'
			//contextIsolation: false
		}
	})

	// mainWindow.webContents.openDevTools({ mode: 'right' }) // 开发者工具
	// mainWindow.loadURL(`http://localhost:8080`)
	mainWindow.loadFile(path.join(__dirname, `./dist/index.html`));

	// mainWindow.loadURL(
	//   url.format({
	//     pathname: path.join(__dirname, `./dist/index.html`),
	//     protocol: "file:",
	//     slashes: true
	//   })
	// );
	mainWindow.on('closed', function () {
		mainWindow = null
	});
}
console.log(app);
app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (mainWindow === null) createWindow()
})

//接收关闭命令
ipcMain.on('window-close', function () {
	mainWindow.close();
});

ipcMain.on('window-min', function () {
	mainWindow.minimize();
});

ipcMain.on('window-max', function (e) {
	if (mainWindow.isMaximized()) {
		mainWindow.restore();
		e.sender.send("window-restore");
	} else {
		mainWindow.maximize();
		e.sender.send("window-max");
	}
});