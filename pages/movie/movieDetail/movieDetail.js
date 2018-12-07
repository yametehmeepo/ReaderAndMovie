var app = getApp()
Page({
    data: {
        MovieItem: {}
    },
    onLoad: function () {
        var MovieItem = app.globalData.movieItemData
        var directornames = []
        MovieItem.directors.map(item => {
            directornames.push(item.name)
        })
        MovieItem.directornames = directornames.join(' / ')
        var castnames = []
        MovieItem.casts.map(item => {
            castnames.push(item.name)
        })
        MovieItem.castnames = castnames.join(' / ')
        MovieItem.genrenames = MovieItem.genres.join('、')
        this.setData({MovieItem})
    },
    onPreviewImgTap: function (e) {
        var imgUrl = e.currentTarget.dataset.imgurl
        wx.previewImage({
            urls: [imgUrl]
        })
    }
})