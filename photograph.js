// template/photograph/photograph.js

const util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopImgNumber:{
      type:Number,
      value:9,
    },
    token:{
      type:String,
      value:""
    },
    pics:{  //重置
      type:Array,
      vlaue:[]
    },
    hrefs: {  //重置
      type: Array,
      vlaue: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  ready:function(){
    console.log('组件布局')
    this.uptoken()
  },
  methods: {
    pj_imgshow: function () {
      var that = this;
      var hrefattr = []
      wx.chooseImage({
        count: that.data.shopImgNumber - that.data.pics.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res)
          var pics = that.data.pics
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            pics.push({ url: res.tempFilePaths[i] })

            var uploadTask = wx.uploadFile({
              url: 'https://upload.qiniup.com',
              filePath: res.tempFilePaths[i],
              name: 'file',
              formData: {
                'key': that.data.uptokenJson.pre_key + '_' + Date.parse(new Date()) + '_' + i,
                'token': that.data.uptokenJson.uptoken
              },
              success: function (res) {

                var datahref = res.data

                datahref = JSON.parse(datahref)

                hrefattr.push({ url: datahref.key })

                if (that.data.hrefs == '') {

                  that.setData({
                    hrefs: hrefattr
                  })

                } else {
                  that.setData({
                    hrefs: that.data.hrefs.concat(hrefattr)
                  })
                } 

                

                that.triggerEvent('myevent', { hrefs: that.data.hrefs })

                // 当发布的时候
                
                hrefattr = [];

              },
              fail(error) {
                console.log(error)
              }
            });
            // 进度获取
            // uploadTask.onProgressUpdate((res_data) => {

            //   that.setData({
            //     upNumber: res_data.progress
            //   })
            // })
          }

          that.setData({
            pics: pics
          })


        }
      })
    },
    uptoken: function () {
      var that = this;
      util.getAPI({
        url: util.config.apiurl + 'image/upToken',
        method: 'GET',
        data: {
          token: that.data.token,
          type: 'item',
        },
        success: function (data) {
          that.setData({
            uptokenJson: data.data
          })
        }
      })
    },
    remove: function (event) {

      console.log(event)

      var that = this;

      var id = event.currentTarget.dataset.id;

      var pics = this.data.pics;

      var hrefs = this.data.hrefs

      pics.remove(id)
      hrefs.remove(id)
      this.setData({
        pics: pics,
        hrefs:hrefs
      })

      this.triggerEvent('myevent', { hrefs: that.data.hrefs})
      

    }
  }
})
