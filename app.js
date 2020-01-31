//app.js
App({
  onLaunch: function () {
    wx.connectSocket({
			url: 'wss://ligongzzz.top:6777',
		})
		wx.onSocketClose((res)=>{
			console.log('Connection closed.')	

			this.globalData.connectedToServer=false
			this.globalData.userInfoSent=false
			wx.connectSocket({
				url: 'wss://ligongzzz.top:6777',	
			})
		})
		wx.onSocketError((res)=>{
			console.log('Connection error.')
			this.globalData.connectedToServer=false
			this.globalData.userInfoSent=false
			wx.connectSocket({
				url: 'wss://ligongzzz.top:6777',
			})
		})
		wx.onSocketOpen((res)=>{
			console.log('Connected to server.')
			this.globalData.connectedToServer=true

			if(this.globalData.loginStatus){
				this.globalData.loginStatus=false
				this.loginServer()
				return
			}

			if(this.socketReadyCallback){
				this.socketReadyCallback()
			}
		})

		//--------------------Login Module--------------------------------
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if(this.globalData.connectedToServer){
					this.sendUserInfo(res)
				}
				else{
					this.socketReadyCallback=()=>{
						this.sendUserInfo(res)
					}
				}
			}
		})
		wx.onSocketMessage((res)=>{
			let recv_json = JSON.parse(res.data)
			if(recv_json.type=='login'){
				if(recv_json.result==1){
					this.globalData.loginStatus=true
					console.log('login success!')
					if(this.onLoginStatusCallback){
						this.onLoginStatusCallback()
					}
				}
			}
			else if(recv_json.type=='img'){
				if(this.onImgResultCallback){
					this.onImgResultCallback(res)
				}
			}
			else if(recv_json.type=='day_cal'){
				let to_show = "😊 今天摄入了"+recv_json.val.toString()+"千卡路里哦"
				if(this.onLoginTipCallback){
					this.onLoginTipCallback(to_show)
				}
			}
			else if(recv_json.type=='cal'){
				if(this.onCalValCallback){
					this.onCalValCallback(recv_json)
				}
			}
		})
  },
	sendUserInfo:function(res){
		if(!this.globalData.connectedToServer){
			return
		}
		res.type = "login"
		let toSend = JSON.stringify(res)
		console.log(toSend)
		wx.sendSocketMessage({
			data: toSend,
		})
		this.globalData.userInfoSent = true
	},
	loginServer:function(){
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				if (this.globalData.connectedToServer) {
					this.sendUserInfo(res)
				}
				else {
					this.socketReadyCallback = () => {
						this.sendUserInfo(res)
					}
				}
			}
		})
	},
  globalData: {
    userInfo: null,
		connectedToServer:false,
		imgSrc:"",
		userInfoSent:false,
		loginStatus:false,
		splitList:null,
  }
})