cc.Class({
    extends: cc.Component,

    properties: {
        pfbRoot: cc.Node,
        record: cc.Prefab,
    },

    onLoad: function () {
        this.pfbCache = {}
    },

    btnStart: function () {
        cc.director.loadScene('Game')
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

    btnExit: function () {
        cc.director.end()
    },
});