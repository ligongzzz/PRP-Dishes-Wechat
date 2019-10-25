// pages/main/main.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		buildArray:['第一餐饮大楼','第二餐饮大楼','第三餐饮大楼','第四餐饮大楼','第五餐饮大楼','第六餐饮大楼','第七餐饮大楼','玉兰苑','哈乐餐厅'],
		buildPos: [[31.0238892825, 121.4271074244], [31.0248359587, 121.4316456090], [31.0288644021, 121.4285147918], [31.0271773225, 121.4226032033], [31.0257369862, 121.4367471708], [31.0310547207, 121.4399490978], [31.0313535123, 121.4366821672], [31.0254752848, 121.4267158217], [31.0226894197, 121.4277511547]],
		buildIndex: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let cur_this = this
		//Get Location Data
		wx.getLocation({
			success: function (res) {
				var latitude = res.latitude
				var longtitude = res.longitude
				console.log(latitude)
				console.log(longtitude)
				let default_i = 0
				let min_val = 9999.0
				for (var i = 0; i < 9; ++i) {
					let cur_val = Math.sqrt((latitude - cur_this.data.buildPos[i][0]) * (latitude - cur_this.data.buildPos[i][0]) + (longtitude - cur_this.data.buildPos[i][1]) * (longtitude - cur_this.data.buildPos[i][1]))
					if (cur_val < min_val) {
						default_i = i
						min_val = cur_val
					}
					console.log(cur_val)
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
	
	// Camera Button
	onClickCameraButton:function(e){
		let cur_this = this;
		console.log('Trying to start the camera...')

		wx.chooseImage({
			count:1,
			sizeType:['original'],
			sourceType:['camera'],
			success: function(res) {
				var dir = res.tempFilePaths[0]
				console.log(dir)
				console.log('Load the image successfully!')

				wx.getFileSystemManager().readFile({
					filePath: res.tempFilePaths[0],
					encoding: 'base64',
					success: res => {
						getApp().globalData.imgSrc=res.data
						// console.log(app.globalData.imgSrc)
						wx.navigateTo({
							url: '/pages/result/result?dir=' + dir
						})
					}
				})
			},
			fail:function(res){
				console.log('Fail to load the image.')
			}
		})
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