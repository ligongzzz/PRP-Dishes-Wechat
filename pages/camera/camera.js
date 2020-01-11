// pages/camera/camera.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		windowInfo:null,
		context:null,
		showButton:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.getSystemInfo({
			success: (res)=>{
				this.setData({
					windowInfo:res
				})
				console.log(this.data.windowInfo.windowHeight)
			},
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
		var context = wx.createCanvasContext('image-canvas')
		var w = this.data.windowInfo.windowWidth
		var h = this.data.windowInfo.windowHeight
		var bw = null, bh = null
		var bx = null, by = null

		if(w/12<(h-100)/19){
			bw = w*0.95
			bh = bw/12*19
			bx = w*0.025
			by = (h-100-bh)/2
		}
		else{
			bh = (h-100)*0.95
			bw = bh/19*12
			by = (h-100)*0.025
			bx = (w-bw)/2
		}
		context.setFillStyle("rgba(0,0,0,0.7)")
		context.fillRect(0,0,w,by)
		context.fillRect(0,by,bx,h-by)
		context.fillRect(bx+bw,by,w-bx-bw,h-by)
		context.fillRect(bx,by+bh,bw,h-by-bh)
		context.setStrokeStyle("#ffffff")
		context.setLineWidth(4)
		context.rect(bx,by,bw,bh)
		context.stroke()
		context.setLineWidth(2)
		context.beginPath()
		context.arc(bx+bw*0.8,by+bh*0.158,0.079*bh,0,2*Math.PI)
		context.stroke()
		context.beginPath()
		context.rect(bx+bw*0.6,by+0.284*bh,bw*0.367,bw*0.367)
		context.stroke()
		context.beginPath()
		context.rect(bx + bw * 0.6, by + 0.538 * bh, bw * 0.367, bw * 0.367)
		context.stroke()

		context.beginPath()
		context.rect(bx + bw * 0.1, by + 0.063 * bh, bw * 0.433, bh * 0.232)
		context.stroke()
		context.beginPath()
		context.rect(bx + bw * 0.1, by + 0.38 * bh, bw * 0.433, bh * 0.4)
		context.stroke()
		
		context.draw()

		this.setData({
			w:w,
			h:h,
			bx:bx,
			by:by,
			bw:bw,
			bh:bh,
			context:context
		})
	},

	// Function To Cut the Image
	cutImage:function(){
		let ax=0,ay=0
		let context = this.data.context
		let w = this.data.w,h=this.data.h
		let bx = this.data.bx,by=this.data.by
		let bw = this.data.bw,bh = this.data.bh
		context.setFillStyle("#000000")
		context.fillRect(0,0,w,h)
		context.drawImage(this.data.src,0,0,w,h)
		context.draw()
		wx.showLoading({
			title: '处理中',
		})
		setTimeout(()=>{
			wx.canvasToTempFilePath({
				canvasId: 'image-canvas',
				x: bx,
				y: by,
				width:bw,
				height:bh,
				destWidth: bw,
				destHeight: bh,
				success: (res) => {
					let ansPath = res.tempFilePath
					// Calculate the rects
					getApp().globalData.splitList=[
						{
							x:bw * 0.6, 
							y:0.284 * bh, 
							w:bw* 0.367,
							h:bw* 0.367
						},
						{
							x:bw * 0.6,
							y:0.538 * bh,
							w:bw * 0.367,
							h:bw * 0.367
						},
						{
							x:bw * 0.1,
							y:0.063 * bh,
							w:bw * 0.433,
							h:bh * 0.232
						}
					]
					wx.getFileSystemManager().readFile({
						filePath: ansPath,
						encoding: 'base64',
						success: res => {
							wx.hideLoading()
							getApp().globalData.imgSrc = res.data
							wx.redirectTo({
								url: '/pages/result/result?dir=' + ansPath
							})
						}
					})
				},
				fail: (e) => {
					wx.hideLoading()
					wx.showModal({
						title: '出现错误',
						content: '处理图片时出现错误。',
					})
				}
			}, this)
		},500)
		
	},

	takePhotoAction:function(){
		let ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				this.setData({
					src: res.tempImagePath,
					showButton:false
				})
				this.cutImage()
			}
		})
		
	}
})