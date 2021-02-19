module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	devServer: {
		// open: process.platform === 'darwin',
		// host: 'localhost',
		port: 8080,
		// open: true, //配置自动启动浏览器
		proxy: {
			'/api': {
				target: 'http://127.0.0.1/', //对应自己的接口
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	},
}