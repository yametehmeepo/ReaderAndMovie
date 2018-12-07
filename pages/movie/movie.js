var app = getApp()
Page({
    data: {
        theatersIsOk: false,
        top250IsOk: false,
        comingSoonIsOk: false,
        searchFocus: false,
        searchText: "",
        searchResult: []
    },
    onLoad: function () {
        var movieStorage = wx.getStorageSync('movieStorage');
        if (movieStorage) {
            var theaters = movieStorage.theaters || []
            var theatersForThree = theaters.slice(0, 3)
            var top250 = movieStorage.top250 || []
            var top250ForThree = top250.slice(0, 3)
            var comingSoon = movieStorage.comingSoon || []
            var comingSoonForThree = comingSoon.slice(0, 3)
            this.setData({theaters, top250, comingSoon, theatersForThree, top250ForThree, comingSoonForThree})
        } else {
            wx.showLoading({
                title: '加载中'
            })
            this.getTheaters();
            this.getTop250();
            this.getComingSoon();
        }
    },
    getTheaters: function () {
        wx.request({
            url: "http://t.yushu.im/v2/movie/in_theaters",
            success: res => {
                var theaters = res && res.data && res.data.subjects.length ? res.data.subjects : []
                var theatersForThree = theaters.slice(0, 3)
                this.setData({theaters, theatersForThree, theatersIsOk: true})
                this.checkFinished()
            },
            complete: () => {
                this.checkFinished()
            }
        })
    },
    getTop250: function () {
        wx.request({
            url: "http://t.yushu.im/v2/movie/top250",
            success: res => {
                var top250 = res && res.data && res.data.subjects.length ? res.data.subjects : []
                var top250ForThree = top250.slice(0, 3)
                this.setData({top250, top250ForThree, top250IsOk: true})
                this.checkFinished()
            },
            complete: () => {
                this.checkFinished()
            }
        })
    },
    getComingSoon: function () {
        wx.request({
            url: "http://t.yushu.im/v2/movie/coming_soon",
            success: res => {
                var comingSoon = res && res.data && res.data.subjects.length ? res.data.subjects : []
                var comingSoonForThree = comingSoon.slice(0, 3)
                this.setData({comingSoon, comingSoonForThree, comingSoonIsOk: true})
                this.checkFinished()
            },
            complete: () => {
                this.checkFinished()
            }
        })
    },
    searchMovie: function (url) {
        wx.showLoading()
        wx.request({
            url: url,
            success: res => {
                var searchResult = res && res.data && res.data.subjects.length ? res.data.subjects : []
                this.setData({searchResult})
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    onMovieMoreTap: function (e) {
        var category = e.currentTarget.dataset.category;
        wx.navigateTo({
            url: '/pages/movie/moreMovies/moreMovies?category=' + category
        })
    },
    checkFinished: function () {
        var theatersIsOk = this.data.theatersIsOk;
        var top250IsOk = this.data.top250IsOk;
        var comingSoonIsOk = this.data.comingSoonIsOk;
        if (theatersIsOk && top250IsOk && comingSoonIsOk) {
            var movieStorage = {
                theaters: this.data.theaters,
                top250: this.data.top250,
                comingSoon: this.data.comingSoon
            }
            wx.setStorageSync('movieStorage', movieStorage);
        }
        wx.hideLoading()
    },
    onSearchFocus: function (e) {
        this.setData({
            searchFocus: true
        })
    },
    onSearchBlur: function (e) {
        /*this.setData({
            searchFocus: false
        })*/
    },
    onSearchConfirm: function (e) {
        var text = e.detail.value
        if (text) {
            var searchUrl = "http://t.yushu.im/v2/movie/search?q=" + text
            this.searchMovie(searchUrl)
        }
    },
    onSearchInput: function (e) {
        this.setData({
            searchText: e.detail.value
        })
    },
    onSearchClose: function (e) {
        this.setData({
            searchFocus: false,
            searchText: "",
            searchResult: []
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