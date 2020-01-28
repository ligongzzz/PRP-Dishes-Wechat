// pages/camera/camera.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		windowInfo: null,
		context: null,
		showButton: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.getSystemInfo({
			success: (res) => {
				this.setData({
					windowInfo: res
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
		// A function to draw the round rect.
		function drawRoundedRect(ctx, x, y, width, height, r) {
			ctx.save()
			//Fill the corners.
			ctx.setLineWidth(0);
			ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + r, y); 
			ctx.arcTo(x, y, x, y + r, r);ctx.lineTo(x, y); ctx.fill();
			ctx.beginPath(); ctx.moveTo(x+width, y); ctx.lineTo(x + width-r, y);
			ctx.arcTo(x+width, y, x+width, y + r, r); ctx.lineTo(x+width, y); ctx.fill();
			ctx.beginPath(); ctx.moveTo(x, y+height); ctx.lineTo(x + r, y+height);
			ctx.arcTo(x, y+height, x, y +height- r, r); ctx.lineTo(x, y+height); ctx.fill();
			ctx.beginPath(); ctx.moveTo(x+width, y+height); ctx.lineTo(x +width- r, y+height);
			ctx.arcTo(x+width, y+height, x+width, y+height-r, r); ctx.lineTo(x+width, y+height);
			ctx.fill();

			//Draw the border.
			ctx.setLineWidth(3);context.setStrokeStyle("#ffffff");
			ctx.beginPath()
			ctx.moveTo(x + r, y)
			ctx.arcTo(x + width, y, x + width, y + r, r)
			ctx.arcTo(x + width, y + height, x + width - r, y + height, r)
			ctx.arcTo(x, y + height, x, y + height - r, r)
			ctx.arcTo(x, y, x + r, y, r)
			ctx.stroke()
			ctx.restore()
		}

		var context = wx.createCanvasContext('image-canvas')
		wx.create
		var w = this.data.windowInfo.windowWidth
		var h = this.data.windowInfo.windowHeight
		var bw = null, bh = null
		var bx = null, by = null

		if (w / 12 < (h - 100) / 19) {
			bw = w * 0.95
			bh = bw / 12 * 19
			bx = w * 0.025
			by = (h - 100 - bh) / 2
		}
		else {
			bh = (h - 100) * 0.95
			bw = bh / 19 * 12
			by = (h - 100) * 0.025
			bx = (w - bw) / 2
		}
		context.setFillStyle("rgba(0,0,0,0.7)")
		context.fillRect(0, 0, w, by)
		context.fillRect(0, by, bx, h - by)
		context.fillRect(bx + bw, by, w - bx - bw, h - by)
		context.fillRect(bx, by + bh, bw, h - by - bh)
		
		// Draw a round rectangle.
		drawRoundedRect(context,bx,by,bw,bh,16)

		context.draw()

		this.setData({
			w: w,
			h: h,
			bx: bx,
			by: by,
			bw: bw,
			bh: bh,
			context: context
		})
	},

	// Function To Cut the Image
	cutImage: function () {
		let ax = 0, ay = 0
		let context = wx.createCanvasContext('hidden-canvas')
		//let context = this.data.context
		let w = this.data.w, h = this.data.h
		let bx = this.data.bx, by = this.data.by
		let bw = this.data.bw, bh = this.data.bh
		let pixelRatio = wx.getSystemInfoSync().pixelRatio
		context.setFillStyle("#000000")
		context.fillRect(0, 0, w, h)
		context.rotate(-Math.PI/2)
		context.drawImage(this.data.src,bx/pixelRatio,by/pixelRatio,bw/pixelRatio,bh/pixelRatio,-w*w/h, 0, w*w/h, w)
		context.draw()
		wx.showLoading({
			title: '保存图片中',
		})
		setTimeout(() => {
			wx.canvasToTempFilePath({
				canvasId: 'hidden-canvas',
				x: 0,
				y: 0,
				width: w,
				height: w*w/h,
				destWidth: w*pixelRatio,
				destHeight: w*w/h*pixelRatio,
				success: (res) => {
					let ansPath = res.tempFilePath
					// Calculate the rects
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
		}, 500)

	},

	takePhotoAction: function () {
		let ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				this.setData({
					src: res.tempImagePath,
					showButton: false
				})
				this.cutImage()
			}
		})

	}
})