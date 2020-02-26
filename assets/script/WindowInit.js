cc.Class({
    extends: cc.Component,

    onLoad: function () {
        // 记录一个进入游戏的时间
        window.EnterGameTime = new Date().getTime() / 1000

        window.SetLocalStorage = function (key, data) {
            cc.sys.localStorage.setItem(key, JSON.stringify(data))
        }

        window.GetLocalStorage = function (key) {
            let data = cc.sys.localStorage.getItem(key)
            if (data) {
                return JSON.parse(data)
            }
            return null
        }

        window.RegisterGlobal = function (k, v) {
            if (window[k]) {
                return
            }
            window[k] = v
        }

        window.UnRegisterGlobal = function (k) {
            if (!window[k]) {
                return
            }
            window[k] = null
        }

        window.Clone = function (obj) {
            return JSON.parse(JSON.stringify(obj))
        }

        // 随机一个左闭右开的数字
        window.RandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        window.IsEmpty = function (obj) {
            for (var i in obj) {
                return false
            }
            return true
        }

        window.SetSpriteFrame = function (path, sprite) {
            if (!path) {
                sprite.spriteFrame = null
                return
            }
            cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.log(err)
                    return
                }
                sprite.spriteFrame = spriteFrame
            })
        }


        /*--------------------------------------------------分割线-------------------------------------------------*/
        /*
                                                       分割线以上是常用方法
                                                       分割线以下是扩展方法
        */
        /*--------------------------------------------------分割线-------------------------------------------------*/


        cc.Node.prototype.PathChild = function (path, componentName) {
            let names = path.split('/')
            let nd = null

            for (let i = 0; i < names.length; i++) {
                if (nd) {
                    nd = nd.getChildByName(names[i])
                } else {
                    nd = this.getChildByName(names[i])
                }
            }

            if (componentName) {
                return nd.getComponent(componentName)
            } else {
                return nd
            }
        }
    },
})
