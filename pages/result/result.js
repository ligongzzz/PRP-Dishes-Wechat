// pages/result/result.js

var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		image_dir: "",
		imgSrc: "/img/loading_img.png",
		showTip:true,
		tipContent:"上传图片中",
		menu_list:[],
		cal_val:0,
		showImg:0,
		imgData:""
	},

	//Draw the canvas image.
	drawCanvas: function () {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var dir = options.dir
		this.setData({
			image_dir:dir,
		})
		console.log(this.data.image_dir)

		if (app.globalData.connectedToServer) {
			//Upload to server.
			let toSend = {
				type: "img",
				info: "universal",
				data: app.globalData.imgSrc,
			}
			toSend = JSON.stringify(toSend)
			wx.sendSocketMessage({
				data: toSend,
				success: ()=>{
					this.setData({
						tipContent:"正在识别..."
					})
				}
			})

			app.onImgResultCallback = (res) => {
				let res_src = JSON.parse(res.data)
				if (res_src.type == 'img' && res_src.result == 1) {
					this.setData({
						tipContent: "识别成功 😊",
						menu_list: res_src.data,
						cal_val: res_src.cal_val,
						showAns: true,
						showImg: true,
						imgSrc: this.data.image_dir
					})
					console.log(this.data.imgData)
				}
				else {
					this.setData({
						tipContent: "识别失败 😔",
						imgSrc: "/img/error_img.png",
						showAns: false,
					})
				}
			}
		}
		else {
			this.setData({
				tipContent: "未连接到服务器，请稍后再试！"
			})
		}
	},


	// Delete the data.
	delItem: function (e) {
		wx.showModal({
			title: '确认删除',
			content: '您确认要删除第' + e.currentTarget.dataset.index + '个项目吗？',
		})
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
})