cc.Class({
    extends: cc.Component,

    properties: {
        pfbRoot: cc.Node,
        record: cc.Prefab,
        bgm: cc.Prefab,
        game: cc.Prefab,
    },

    onLoad: function () {
        this.pfbCache = {}
    },

    btnStart: function () {
        if (this.pfbCache['game']) {
            this.pfbCache['game'].active = true
        } else {
            let gamePfb = cc.instantiate(this.game)
            gamePfb.parent = this.pfbRoot
            this.pfbCache['game'] = gamePfb
        }
    },

    btnRecord: function () {
        if (this.pfbCache['record']) {
            this.pfbCache['record'].active = true
        } else {
            let recordPfb = cc.instantiate(this.record)
            recordPfb.parent = this.pfbRoot
            this.pfbCache['record'] = recordPfb
        }
    },

    btnBGM: function () {
        if (this.pfbCache['bgm']) {
            this.pfbCache['bgm'].active = true
        } else {
            let recordPfb = cc.instantiate(this.bgm)
            recordPfb.parent = this.pfbRoot
            this.pfbCache['bgm'] = recordPfb
        }
    },

    btnExit: function () {
        cc.game.end()
    },
});