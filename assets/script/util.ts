const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    onLoad() {
        window.ut = this
    }

    SetLocalStorage(key, data) {
        cc.sys.localStorage.setItem(key, JSON.stringify(data))
    }

    GetLocalStorage(key) {
        let data = cc.sys.localStorage.getItem(key)
        if (data) {
            return JSON.parse(data)
        }
        return null
    }

    RegisterGlobal(k, v) {
        if (window[k]) {
            return
        }
        window[k] = v
    }

    UnRegisterGlobal(k) {
        if (!window[k]) {
            return
        }
        window[k] = null
    }

    Clone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    // 随机一个左闭右开的数字
    RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    }

    IsEmpty(obj) {
        for (var i in obj) {
            return false
        }
        return true
    }

    SetSpriteFrame(path, sprite) {
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
}
