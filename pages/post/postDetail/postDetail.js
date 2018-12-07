//import postList from '../../../data/posts-data.js';

Page({
    data: {
        isMusicPlaying: false
    },
    onLoad: function (option) {
        var postList = wx.getStorageSync('postList');

        var postItem = postList.find(function (item) {
            return item.postId == option.postid
        })
        this.setData({postList, ...postItem})
        var BackgroundAudioManager = wx.getBackgroundAudioManager()
        BackgroundAudioManager.onPause(() => {
            this.setData({
                isMusicPlaying: false
            })
        })
        BackgroundAudioManager.onPlay(() => {
            this.setData({
                isMusicPlaying: true
            })
        })
        BackgroundAudioManager.onStop(() => {
            this.setData({
                isMusicPlaying: false
            })
        })
        BackgroundAudioManager.onEnded(() => {
            this.setData({
                isMusicPlaying: false
            })
        })
        BackgroundAudioManager.onError(() => {
            this.setData({
                isMusicPlaying: false
            })
        })
        //console.log(postItem)
    },
    onUnload: function () {
        var BackgroundAudioManager = wx.getBackgroundAudioManager()
        BackgroundAudioManager.stop()
    },
    onCollectionTap: function (e) {
        var data = this.data;
        data.postList.map(item => {
            if (item.postId == data.postId) {
                item.collected = !item.collected
            }
        })
        wx.setStorageSync('postList', data.postList);
        data.collected = !data.collected;
        this.setData(data, function () {
            wx.showToast({
                title: data.collected ? '收藏成功' : '取消收藏',
                icon: 'success',
                duration: 1500
            })
        });

    },
    onShareTap: function (e) {
        var itemList = ['分享给朋友', '分享到朋友圈', '分享到QQ']
        wx.showActionSheet({
            itemList: itemList,
            success: res => {
                console.log(res.tapIndex + ': ' + itemList[res.tapIndex])
            }
        })
    },
    onMusicTap: function (e) {
        //console.log(wx.getSystemInfoSync())
        var BackgroundAudioManager = wx.getBackgroundAudioManager()
        const {isMusicPlaying, music} = this.data
        if (isMusicPlaying) {
            BackgroundAudioManager.pause()
        } else {
            if (BackgroundAudioManager.src) {
                BackgroundAudioManager.play()
            } else {
                BackgroundAudioManager.epname = music.title
                BackgroundAudioManager.coverImgUrl = music.coverImg
                BackgroundAudioManager.title = music.title || ''
                BackgroundAudioManager.src = music.url
            }
        }
        this.setData({
            isMusicPlaying: !isMusicPlaying
        })
    }
})