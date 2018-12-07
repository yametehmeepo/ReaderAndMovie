var app = getApp()
Page({
    data: {
        url: '',
        movieList: [],
        total: 0,
        totalCount: 0
    },
    onLoad: function (option) {
        var category = option.category
        var requestUrlList = [['theaters', 'in_theaters'], ['comingSoon', 'coming_soon'], ['top250', 'top250']]
        var mapRequestUrlList = new Map(requestUrlList)
        var url = "http://t.yushu.im/v2/movie/" + mapRequestUrlList.get(category)
        this.setData({category, url})
        var movieStorage = wx.getStorageSync('movieStorage');
        if (movieStorage && movieStorage[category]) {
            var movieList = movieStorage[category]
            this.setData({movieList, total: movieList.length, totalCount: movieList.length})
        } else {
            this.getMoreMovies(url)
        }
    },
    onShow: function () {
        var categoryNameList = [['theaters', '正在热映'], ['comingSoon', '即将上映'], ['top250', 'top250']]
        var mapCategoryNameList = new Map(categoryNameList)
        wx.setNavigationBarTitle({
            title: mapCategoryNameList.get(this.data.category)
        })
    },
    onPullDownRefresh: function () {
        console.log('Refresh')
        this.setData({
            total: 0,
            totalCount: 0
        })
        this.getMoreMovies(this.data.url, true)
    },
    onReachBottom: function () {
        var {total, totalCount, url} = this.data;
        if (total < 20) {
            return
        } else {
            if (totalCount > total) {
                return
            } else {
                var ReachBottomUrl = url + '?start=' + totalCount + '&count=20'
                this.getMoreMovies(ReachBottomUrl)
            }
        }
    },
    getMoreMovies: function (url, refresh) {
        wx.showNavigationBarLoading()
        var movieStorage = wx.getStorageSync('movieStorage');
        wx.request({
            url: url,
            success: res => {
                var total = res && res.data && res.data.total ? res.data.total : 0
                var newMovieList = res && res.data && res.data.subjects.length ? res.data.subjects : []
                var movieList = refresh ? newMovieList : this.data.movieList.concat(newMovieList)
                var category = this.data.category
                this.setData({
                    movieList,
                    total,
                    totalCount: this.data.totalCount + 20
                })
                var storageMovieObj = movieStorage || {}
                storageMovieObj[category] = movieList
                wx.setStorageSync('movieStorage', storageMovieObj);
                wx.hideNavigationBarLoading()
                if (refresh) {
                    wx.stopPullDownRefresh()
                }
            },
            complete: () => {
                wx.hideNavigationBarLoading()
            }
        })
    },
    onMovieItemTap: function (e) {
        var MovieItem = e.currentTarget.dataset.moviedetail
        app.globalData.movieItemData = MovieItem
        wx.navigateTo({
            url: '/pages/movie/movieDetail/movieDetail'
        })
    }
})