var net = require('net')
// import net from 'net'

let socketClients = [];

/**
 * 发送数据到服务器
 * @param {*} socketClient 
 * @param {*} data 
 */
function sendData(socketClient, data) {
	if (socketClient == null || socketClient == undefined) {
		console.error('Connection Client is Empty');
		return;
	}
	if (data == null || data == undefined) {
		console.error('Data is null');
		return;
	}
	console.log('Send ' + data.toUpperCase() + ' to ' + socketClient.remoteAddress + ':' + socketClient.remotePort);
	socketClient.write(Buffer.from(data.toUpperCase(), "hex"))
}

/**
 * 获取批量亮灯数据
 * @param {*} lampProperty 
 */
function getLightOnData(lampProperty) {
	let resultData = []

	// 发送次数, 一次发送数据只能亮50个灯
	let lampGroupCount = Math.round(lampProperty.lamps.length % 50) === 0 ? Math.round(lampProperty.lamps.length / 50) : Math.round(lampProperty.lamps.length / 50) + 1
	if (lampGroupCount === 0) {
		lampGroupCount = 1;
	}
	for (let c = 0; c < lampGroupCount; c++) {
		let data = '';
		data += '6D';
		data += '00';
		data += '06';
		data += '00';
		data += '00';
		data += '00';
		data += (Number.parseInt(51, 16) + c).toString(16);
		for (let i = 0; i < 50; i++) {
			let lamp = lampProperty.lamps[i];
			if (lamp && (i + 1) === Number.parseInt(lamp.id)) {
				const qty = Number.parseInt(lamp.qty);
				if (lamp.qty > 255) {
					data += (qty % 256).toString(16).padStart(2, '0'); // Number.parseInt(lamp.qty.toString(16)) % 256;
					data += (qty / 256).toString(16).padStart(2, '0'); //Number.parseInt(lamp.qty.toString(16)) / 256;
				} else {
					data += qty.toString(16).padStart(2, '0');
					data += '00';
				}
			} else {
				data += 'FF';
				data += 'FF';
			}
		}
		data += getColorCode(lampProperty.color);
		data += '00';

		resultData.push(data);
	}

	return resultData;
}

/**
 * 获取批量灭灯数据
 * @param {*} lampProperty 
 */
function getLightOffData(lampProperty) {
	let resultData = []

	// 发送次数, 一次发送数据只能亮50个灯
	let lampGroupCount = Math.round(lampProperty.lamps.length % 50) === 0 ? Math.round(lampProperty.lamps.length / 50) : Math.round(lampProperty.lamps.length / 50) + 1
	if (lampGroupCount === 0) {
		lampGroupCount = 1;
	}
	for (let c = 0; c < lampGroupCount; c++) {
		let data = '';
		data += '6D';
		data += '00';
		data += '06';
		data += '00';
		data += '00';
		data += '00';
		data += (Number.parseInt(51, 16) + c).toString(16);
		for (let i = 0; i < 50; i++) {
			let lamp = lampProperty.lamps[i];
			if (lamp && (i + 1) === Number.parseInt(lamp.id)) {
				const qty = Number.parseInt(lamp.qty);
				if (qty > 255) {
					data += (qty % 256).toString(16).padStart(2, '0');
					data += (qty / 256).toString(16).padStart(2, '0');
				} else {
					data += '00';
					data += '00';
				}
			} else {
				data += '00';
				data += '00';
			}
		}
		data += getColorCode(lampProperty.color);
		data += '00';

		resultData.push(data);
	}

	return resultData;
}

/**
 * 根据颜色名称获取颜色代码
 * @param {*} colorStr 
 */
function getColorCode(colorStr) {
	switch (colorStr) {
		case 'red':
			return '01';
		case 'blue':
			return '03';
		case 'green':
			return '02';
		case 'yellow':
			return '05';
		case 'white':
			return '04';
		case '':
			return '00'
	}
}

/**
 * 连接到服务器
 * @param {*} ip ip地址
 * @param {*} port 端口
 * @param {*} receiveDataCallBack  接收数据回调函数
 */
function connectToServer(ip, port, receiveDataCallBack) {
	console.log(ip + ':' + port + 'Try to Connect')
	const prt = Number.parseInt(port);
	let sc = new net.Socket();
	sc.connect(prt, ip, function () {
		const scTemp = getSocketClientByIp(ip, prt);
		if (scTemp != null && scTemp != undefined) {
			// 如果对象还是连接状态，直接返回
			if (scTemp.connecting) {
				return;
			}
			scTemp.destroy();
			removeClient(scTemp);
		}
		socketClients.push(sc);
		console.log(ip + ':' + port + ' Success for Connect')
	});
	sc.on('error', function (err) {
		console.log(' Connection Error, ' + err);
		console.log(' Try Reconnect');
		connectToServer(ip, port, receiveDataCallBack);
	});
	sc.on('close', function () {
		console.log(ip + ':' + port + ' Connection Closed');
	});
	sc.on('data', function (data) {
		console.log(`data==>>${data}`);
		// 执行回调
		//receiveDataCallBack({ 'ip': ip, 'port': port, 'data': data });
	});
}

/**
 * 断开连接
 * @param {*} ip 
 * @param {*} port 
 */
function disConnect(ip, port) {
	let prt = Number.parseInt(port);
	let sc = getSocketClientByIp(ip, prt);
	if (sc != null && sc != undefined) {
		removeClient(sc);
		sc.destroy();
		console.log(sc + ' Connection Destroied');
	}
	console.log('Remain Connection：，' + socketClients);
}

/**
 * 从客户端列表移除一个客户端
 * @param {*} sc 
 */
function removeClient(sc) {
	for (let i = 0; i < socketClients.length; i++) {
		if (socketClients[i].remoteAddress === sc.remoteAddress && socketClients[i].remotePort === sc.remotePort) {
			socketClients.splice(i, 1);
		}
	}
}

/**
 * 获取连接对象
 * @param {*} ip 
 */
function getSocketClientByIp(ip, port) {
	// let sc = socketClients.map(x => {
	//   if (x.remoteAddress === ip && x.remotePort === port) {
	//     console.log('x==>' + x.remoteAddress + ':' + x.remotePort);
	//     return x;
	//   }
	// })[0];
	// if (sc == null || sc == undefined) return null;
	// return sc;
	let sc;
	socketClients.forEach(x => {
		if (x.remoteAddress === ip && x.remotePort === Number.parseInt(port)) {
			console.log('Remote Host==>' + x.remoteAddress + ':' + x.remotePort);
			sc = x;
		}
	});
	return sc;
}
/**
 * 连接到服务器
 * @param {*} ip 
 * @param {*} port 
 */
// Received Data from Server{"sender":{"_events":{},"_eventsCount":3},"senderId":0,"ports":[]}
module.exports.connect = function (ip, port, receiveDataCallBack) {
	connectToServer(ip, port, receiveDataCallBack);
}

module.exports.disConnect = function (ip, port) {
	disConnect(ip, port);
}
/**
 * 批量亮灯
 * @param {*} lampProperty 
 */
module.exports.batchLightOn = function (lampProperty) {
	console.log(lampProperty);
	const data = getLightOnData(lampProperty);
	console.log(lampProperty);
	data.map(d => {
		const sc = getSocketClientByIp(lampProperty.ip, lampProperty.port);
		if (sc != null && sc != undefined) {
			sendData(sc, d);
		}
	});
}
/**
 * 批量灭灯
 * @param {*} lampProperty 
 */
module.exports.batchLightOff = function (lampProperty) {
	const data = getLightOffData(lampProperty);
	data.map(d => {
		const sc = getSocketClientByIp(lampProperty.ip, lampProperty.port);
		if (sc != null && sc != undefined) {
			sendData(sc, d);
		}
	});
}

// export default {
// 	/**
// 	 * 连接到服务器
// 	 * @param {*} ip 
// 	 * @param {*} port 
// 	 */
// 	connect(ip, port, receiveDataCallBack) {
// 		connectToServer(ip, port, receiveDataCallBack);
// 	},
// 	disConnect(ip, port) {
// 		disConnect(ip, port);
// 	},
// 	/**
// 	 * 批量亮灯
// 	 * @param {*} lampProperty 
// 	 */
// 	batchLightOn(lampProperty) {
// 		const data = getLightOnData(lampProperty);
// 		data.map(d => {
// 			const sc = getSocketClientByIp(lampProperty.ip, lampProperty.port);
// 			if (sc != null && sc != undefined) {
// 				sendData(sc, d);
// 			}
// 		});
// 	},
// 	/**
// 	 * 批量灭灯
// 	 * @param {*} lampProperty 
// 	 */
// 	batchLightOff(lampProperty) {
// 		const data = getLightOffData(lampProperty);
// 		data.map(d => {
// 			const sc = getSocketClientByIp(lampProperty.ip, lampProperty.port);
// 			if (sc != null && sc != undefined) {
// 				sendData(sc, d);
// 			}
// 		});
// 	}
// }