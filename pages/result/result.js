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
			let toSend = {
				type:"img",
				data:app.globalData.imgSrc
			}
			toSend = JSON.stringify(toSend)
			wx.sendSocketMessage({
				data: toSend,
			})

			app.onImgResultCallback=(res)=>{
				let res_src = JSON.parse(res.data)
				if(res_src.type=='img'&&res_src.result==1){
					this.setData({
						tipContent:"识别成功 😊",
						menu_list:res_src.data,
						cal_val:res_src.cal_val,
						showAns:true
					})
				}
				else{
					this.setData({
						tipContent:"识别失败 😔",
						showAns:false
					})
				}
			}
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