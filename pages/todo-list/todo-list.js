// pages/todo-list/todo-list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos: [{
        txt: '点击星星可以置顶此项',
        txtStyle: "",
        starOrNot: true,
        setTime: "",
        finish: false
      },
      {
        txt: '向左滑动可以删除',
        txtStyle: "",
        starOrNot: false,
        setTime: "",
        finish: false
      },
      {
        txt: "好好学习",
        txtStyle: "a",
        starOrNot: false,
        setTime: "",
        finish: false
      },
      {
        txt: '手冲咖啡',
        txtStyle: "",
        starOrNot: false,
        setTime: "",
        finish: false
      },
      {
        txt: '想雯雯',
        txtStyle: "",
        starOrNot: false,
        setTime: "",
        finish: false
      }
    ],
    inputValue: null,
    star: '../../assets/star.png',
    starGold: '../../assets/starIt.png',
    tick: '../../assets/tick.png',
    tickGreen: '../../assets/tickIt.png',
    starOrNot: false,
    delBtnWidth: 150,
    currentTab: 0,
    height: 600,
  },
  // input输入的值
  inputValue: function(e) {
    this.data.inputValue = e.detail.value;
  },
  // 把新的事情添加到数组中的函数
  addToList: function() {
    var tempItem = {
      txt: "",
      txtStyle: "",
      starOrNot: false,
      setTime: "",
      finish: false
    }
    tempItem.txt = this.data.inputValue;
    if (tempItem.txt) {
      this.data.todos.push(tempItem);
      console.log(this)
      console.log(this.data.todos);
      this.data.height += 100;
      var height = this.data.height;
      this.setData({
        todos: this.data.todos,
        height: this.data.height,
        inputValue: ''
      })
      var todos = this.data.todos;
      wx.setStorage({
        key: app.globalData.userInfo.nickName,
        data: todos,
      })
      wx.setStorage({
        key: "height",
        data: height,
      })
    }else{
      wx.showToast({
        title: '不可以添加空内容噢',
        icon: 'none'
      })
    }
  },
  // 把选定的事情从数组中删除的函数
  delete: function(e) {
    var index = e.target.dataset.index;
    var todos = this.data.todos;
    var height = this.data.height;
    var that = this;
    // console.log(index);
    // console.log(this.data.todos)
    wx.showModal({
      title: '提示',
      content: '确定要删除这一项吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          todos.splice(index, 1);
          that.setData({
            todos: todos,
          })
          wx.setStorage({
            key: app.globalData.userInfo.nickName,
            data: todos
          })
          wx.setStorage({
            key: "height",
            data: height,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 星标
  starIt: function(e) {
    var index = e.target.dataset.index;
    var todos = this.data.todos;
    console.log(e);
    console.log(e.target.dataset.index);
    todos[index].starOrNot = !this.data.todos[index].starOrNot;
    if (todos[index].starOrNot == true) {
      let tempTodos = todos.splice(index, 1);
      todos.unshift(tempTodos[0]);
      this.setData({
        todos: this.data.todos
      })
      wx.setStorage({
        key: app.globalData.userInfo.nickName,
        data: todos
      })
    } else {
      this.setData({
        todos: this.data.todos
      })
      wx.setStorage({
        key: app.globalData.userInfo.nickName,
        data: todos
      })
    }

  },
  // 完成打勾
  tickIt: function(e) {
    var index = e.target.dataset.index;
    var todos = this.data.todos;
    var that = this;
    var height = this.data.height;
    console.log(e.target.dataset.index);
    if (todos[index].finish == false) {

      wx.showModal({
        title: '提示',
        content: '真的完成了吗？',
        success: function(res) {
          if (res.confirm) {
            console.log('真的完成了吗？');
            todos[index].finish = !todos[index].finish;
            that.setData({
              todos: todos
            })
            wx.setStorage({
              key: app.globalData.userInfo.nickName,
              data: todos
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    } else {
      todos[index].finish = !todos[index].finish;
      that.setData({
        todos: todos
      })
      wx.setStorage({
        key: app.globalData.userInfo.nickName,
        data: todos
      })
    }

  },
  // swiper-item的实例
  bindChange: function(e) {

    this.setData({
      currentTab: e.detail.current
    });

  },
  // 这是模态弹窗的例子
  askIf: function(e) {
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // swiper-bar的实例
  swichNav: function(e) {
    var that = this;
    console.log(this.data.currentTab)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 滑动删除touchstart
  touchS: function(e) {
    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },
  // 滑动删除touchmove
  touchM: function(e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      console.log(disX);

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变

        txtStyle = "margin-left:0rpx";

      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离

        txtStyle = "margin-left:-" + disX + "rpx";

        if (disX >= delBtnWidth) {

          //控制手指移动距离最大值为删除按钮的宽度

          txtStyle = "margin-left:-" + delBtnWidth + "rpx";

        }

      }

      //获取手指触摸的是哪一项

      var index = e.target.dataset.index;

      this.data.todos[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        todos: this.data.todos,
        delBtnWidth: delBtnWidth

      });

    }

  },
  // 滑动删除touchend
  touchE: function(e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";

      //获取手指触摸的是哪一项

      var index = e.target.dataset.index;

      var todos = this.data.todos;

      todos[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        todos: todos

      });

    }

  },
  getNowTime: function() {
    var length = this.data.todos.length;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    //  如果需要时分秒，就放开
    // var h = now.getHours();
    // var m = now.getMinutes();
    // var s = now.getSeconds();
    var formatDate = year + '-' + month + '-' + day;
    console.log(length);
    // this.data.todos[length].setTime = formatDate;
    this.setData({
      todos: this.data.todos
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var height = this.data.height;
    wx.getStorage({
      key: app.globalData.userInfo.nickName,
      success: function(res) {
        console.log(res.data)
        that.data.todos = res.data;
        that.setData({
          todos: that.data.todos,
        })
      }
    })
    wx.getStorage({
      key: 'height',
      success: function(res) {
        height = res.data;
        that.setData({
          height: height
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    var height = this.data.height;
    wx.getStorage({
      key: app.globalData.userInfo.nickName,
      success: function(res) {
        console.log(res.data)
        that.data.todos = res.data;
        that.setData({
          todos: that.data.todos
        })
      }
    })
    wx.getStorage({
      key: 'height',
      success: function(res) {
        height = res.data;
        that.setData({
          height: height
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
    var height = this.data.height;
    wx.getStorage({
      key: app.globalData.userInfo.nickName,
      success: function(res) {
        console.log(res.data)
        that.data.todos = res.data;
        that.setData({
          todos: that.data.todos
        })
      }
    })
    wx.getStorage({
      key: 'height',
      success: function(res) {
        height = res.height;
        that.setData({
          height: height
        })
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})