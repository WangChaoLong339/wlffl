cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        item: cc.Node,
    },

    onLoad: function () {
    },

    onEnable: function () {
        this.scrollView.content.removeAllChildren()
        let recordData = ut.GetLocalStorage('wlffl-record') || []
        recordData.sort((a, b) => { return a.consume - b.consume })
        for (let i = 0; i < recordData.length; i++) {
            let d = recordData[i]
            let cloneItem = cc.instantiate(this.item)
            cloneItem.PathChild('frame').active = i % 2 == 0
            cloneItem.PathChild('rank', cc.Label).string = `${i + 1}`
            cloneItem.PathChild('consume', cc.Label).string = `${d.consume}秒`
            cloneItem.PathChild('date', cc.Label).string = `${d.date}`
            cloneItem.parent = this.scrollView.content
        }
    },

    onDisable: function () {
    },

    btnReturn: function () {
        this.node.active = false
    },
});
