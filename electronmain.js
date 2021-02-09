const { app, BrowserWindow } = require('electron');
const ipcMain = require('electron').ipcMain;
const socketClient = require('./utils/socket');
// import socketClient from './utils/socket';

// const url = require("url");
// const path = require("path");

let mainWindow

// 热加载
// try {
// 	require('electron-reloader')(module, {});
// } catch (_) {
// 	console.log('热加载错误');
// }

function createWindow() {
	mainWindow = new BrowserWindow({
		icon: './rocket.png',
		width: 1400,
		height: 1000,
		minWidth: 1400,
		minHeight: 1000,
		useContentSize: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			// preload: __dirname + '/preload.js'
			//contextIsolation: false
		}
	});

	// mainWindow.webContents.openDevTools({ mode: 'right' }) // 开发者工具
	mainWindow.loadURL(`http://localhost:8080`);
	// mainWindow.loadFile(path.join(__dirname, `./dist/index.html`));

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
	mainWindow.on('maximize', function () {
		mainWindow.webContents.send('window-maxed');
	});
	mainWindow.on('unmaximize', function () {
		mainWindow.webContents.send('window-restore');
	});
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
	if (mainWindow === null) createWindow()
});

//接收关闭命令
ipcMain.on('window-close', function () {
	mainWindow.close();
});

ipcMain.on('window-min', function () {
	mainWindow.minimize();
});

ipcMain.on('window-max', function () {
	if (mainWindow.isMaximized()) {
		mainWindow.restore();
	} else {
		mainWindow.maximize();
	}
});

// 硬件交互事件注册
/**
 * 连接服务器
 */
ipcMain.on('connect', (_, ip, port) => {
	socketClient.connect(ip, port, (data) => {
		mainWindow.webContents.send('receiveCallback', data);
	}, (message) => {
		mainWindow.webContents.send('socketMessage', message);
	});
});
/**
 * 断开连接
 */
ipcMain.on('disConnect', function (_, ip, port) {
	socketClient.disConnect(ip, port);
});

/**
 * 批量亮灯
 */
ipcMain.on('batchLightOn', function (_, lampObj) {
	socketClient.batchLightOn(lampObj);
});
/**
 * 批量灭灯
 */
ipcMain.on('batchLightOff', function (_, lampObj) {
	socketClient.batchLightOff(lampObj);
});