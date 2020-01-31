const app = getApp()

// pages/menu/menu.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		day_cal_val:0,
		cal_list:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(!app.globalData.connectedToServer){
			wx.showModal({
				title: '网络未连接',
				content: '对不起，您还没有连接到服务器，无法获取信息！',
				showCancel:false,
				success(res){
					wx.navigateBack()
				}
			})
		}
		wx.showLoading({
			title: '加载中',
		})
		let toSend = JSON.stringify({"type":"cal","class":"normal"})
		app.onCalValCallback=(res)=>{
			wx.hideLoading()
			if(res.result==0){
				wx.showModal({
					title: '请求异常',
					content: '对不起，请求出现异常，请稍后重试！',
					showCancel: false,
					success(res) {
						wx.navigateBack()
					}
				})
				return
			}
			let new_data = []
			for(let i=0,len=res.data.length;i<len;i++){
				let hour_str = res.data[i].hour.toString()
				let min_str = res.data[i].min.toString()
				if(hour_str.length<2){
					hour_str='0'+hour_str
				}
				if(min_str.length<2){
					min_str='0'+min_str
				}
				let time_str = res.data[i].year.toString()+'-'+res.data[i].mon.toString()+'-'+res.data[i].day.toString()+' '+hour_str+':'+min_str
				let std_val = 600
				let max_val = 1500
				let cur_val = Math.min(max_val,res.data[i].val)
				let color = "rgb("
				if(cur_val<std_val){
					let r = 110 - 95 * cur_val / std_val
					let g = 187 - 46 * cur_val / std_val
					let b = 100 - 68 * cur_val / std_val
					color += r.toString()+','+g.toString()+','+b.toString()+')'
				}
				else{
					let r = 15 - 12 * (cur_val - std_val) / (max_val - std_val)
					let g = 141 - 76 * (cur_val - std_val) / (max_val - std_val)
					let b = 32 - 20 * (cur_val - std_val) / (max_val - std_val)
					color += r.toString() + ',' + g.toString() + ',' + b.toString() + ')'
				}
				new_data.push({'val':res.data[i].val,'time_str':time_str,'color':color})
			}
			new_data.reverse()
			this.setData({
				day_cal_val:res.day_cal,
				cal_list:new_data
			})
		}
		wx.sendSocketMessage({
			data: toSend,
		})
	},


	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		
	},
})