import postList from '../../data/posts-data.js'

Page({
    data: {
        imgUrls: [
            {
                url: "/images/iqiyi.png",
                postid: 5
            },
            {
                url: "/images/vr.png",
                postid: 4
            },
            {
                url: "/images/wx.png",
                postid: 3
            }
        ],
        interval: "3000",
        autoplay: true,
        indicatorColor: "#808080",
        indicatorActiveColor: "#000000",
        circular: true,
        indicatorDots: true,
        postList: []
    },
    onLoad: function () {
        var storage_postList = wx.getStorageSync('postList');
        if (storage_postList) {
            this.setData({postList: storage_postList})
        } else {
            this.setData({postList})
            wx.setStorageSync('postList', postList);
        }
    },
    onPostItemTap: function (e) {
        var postid = e.currentTarget.dataset.postid;
        wx.navigateTo({
            url: '/pages/post/postDetail/postDetail?postid=' + postid
        })
    },
    onShareAppMessage: function (res) {
        if (res.from == 'menu') {
            console.log("来自右上角转发菜单")
        }
    }
})