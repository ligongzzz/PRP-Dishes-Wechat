//app.js
App({
  onLaunch: function () {
    wx.connectSocket({
			url: 'wss://ligongzzz.top:80',
		})
		wx.onSocketClose((res)=>{
			console.log('Connection closed.')
			this.globalData.connectedToServer=false
		})
		wx.onSocketOpen((res)=>{
			console.log('Connected to server.')
			this.globalData.connectedToServer=true
		})
  },
  globalData: {
    userInfo: null,
		connectedToServer:true,
		imgSrc:""
  }
})