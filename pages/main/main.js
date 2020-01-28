// pages/main/main.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		buildArray:['第一餐饮大楼','第二餐饮大楼','第三餐饮大楼','第四餐饮大楼','第五餐饮大楼','第六餐饮大楼','第七餐饮大楼','玉兰苑','哈乐餐厅'],
		buildPos: [[31.0238892825, 121.4271074244], [31.0248359587, 121.4316456090], [31.0288644021, 121.4285147918], [31.0271773225, 121.4226032033], [31.0257369862, 121.4367471708], [31.0310547207, 121.4399490978], [31.0313535123, 121.4366821672], [31.0254752848, 121.4267158217], [31.0226894197, 121.4277511547]],
		buildIndex: 0,
		userInfo:{},
		hasUserInfo:false,
		loginTip:"正在连接到服务器...",
		oldButton:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let cur_this = this

		// Send Login Tip Request
		let login_to_send = JSON.stringify({
			'type':'cal',
			'class':'day'
		})
		if(app.globalData.loginStatus){
			wx.sendSocketMessage({
				data: login_to_send,
			})
		}
		else{
			app.onLoginStatusCallback=()=>{
				wx.sendSocketMessage({
					data: login_to_send,
				})
			}
		}
		app.onLoginTipCallback=(res)=>{
			this.setData({
				loginTip:res
			})	
		}
		//Get Location Data
		wx.getLocation({
			success: function (res) {
				var latitude = res.latitude
				var longtitude = res.longitude
				let default_i = 0
				let min_val = 9999.0
				for (var i = 0; i < 9; ++i) {
					let cur_val = Math.sqrt((latitude - cur_this.data.buildPos[i][0]) * (latitude - cur_this.data.buildPos[i][0]) + (longtitude - cur_this.data.buildPos[i][1]) * (longtitude - cur_this.data.buildPos[i][1]))
					if (cur_val < min_val) {
						default_i = i
						min_val = cur_val
					}
				}
				cur_this.setData({
					buildIndex: default_i
				})
			},
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	//-------------------Main Functions----------------------
	// Picker
	bindPickerBuildChange:function(e){
		this.setData({
			buildIndex: e.detail.value,
		})
	},

	// New Camera Button
	onClickNewCameraButton:function(e){
		if(!app.globalData.loginStatus){
			wx.showModal({
				title: '未连接到服务器',
				content: '请检查您的网络连接，或重新打开小程序后再试。',
			})
		}
		else{
			wx.navigateTo({
				url: '/pages/new_camera/new_camera',
			})
		}
	},
	
	// Camera Button
	onClickCameraButton:function(e){
		wx.navigateTo({
			url: '/pages/camera/camera',
		})
	},

	// Gallery Button
	onClickGalleryButton: function (e) {
		let cur_this = this;

		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: function (res) {
				var dir = res.tempFilePaths[0]

				wx.getFileSystemManager().readFile({
					filePath: res.tempFilePaths[0],
					encoding: 'base64',
					success: res => {
						getApp().globalData.imgSrc = res.data
						wx.navigateTo({
							url: '/pages/result/result?dir=' + dir
						})
					}
				})
			},
			fail: function (res) {
				console.log('Fail to load the image.')
			}
		})
	},

	// Info Button
	onClickInfoButton:function(e){
		wx.navigateTo({
			url: '/pages/menu/menu'
		})
	},

	// Send User Info
	sendUserInfo:function(e){
		let cur_this = this
		if(!this.data.hasUserInfo){
			return
		}
		console.log(this.data.userInfo)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	}
})