// pages/result/result.js

var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		image_dir: "",
		showTip:true,
		tipContent:"识别图片中......",
		menu_list:[],
		cal_val:0,
		showAns:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var dir = options.dir
		this.setData({
			image_dir:dir
		})
		console.log(this.data.image_dir)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if(app.globalData.connectedToServer){
			//Upload to server.
			console.log(app.globalData.imgSrc.length)
			wx.sendSocketMessage({
				data: app.globalData.imgSrc,
			})

			wx.onSocketMessage((res)=>{
				console.log(res.data)
				if(res.data.indexOf('success:')!=0){
					this.setData({
						tipContent:"图片识别失败"
					})
					return
				}
				let ans_str = res.data.substring(8)
				let split_ans = ans_str.split('&&&')
				let menu_list = split_ans[0].split('|||')
				let cal_val = split_ans[1]
				this.setData({
					tipContent:"识别成功 😊",
					menu_list:menu_list,
					cal_val:cal_val,
					showAns:true
				})
			})
		}
		else{
			this.setData({
				tipContent:"未连接到服务器，请稍后再试！"
			})
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})