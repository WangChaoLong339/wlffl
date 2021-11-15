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
        let recordData = GetLocalStorage('wlffl-record') || []
        recordData = [
            { consume: 155, date: '2021-03-01' },
            { consume: 234, date: '2021-03-03' },
            { consume: 166, date: '2021-03-02' },
            { consume: 185, date: '2021-03-03' },
            { consume: 130, date: '2021-03-03' },
            { consume: 666, date: '2021-03-04' },
            { consume: 82, date: '2021-03-04' },
            { consume: 133, date: '2021-01-03' },
            { consume: 99, date: '2021-02-03' },
        ]
        recordData.sort((a, b) => { return a.consume - b.consume })
        for (let i = 0; i < recordData.length; i++) {
            let d = recordData[i]
            let cloneItem = cc.instantiate(this.item)
            cloneItem.PathChild('frame').active = i % 2 == 0
            cloneItem.PathChild('rank', cc.Label).string = `${i + 1}`
            cloneItem.PathChild('consume', cc.Label).string = `${d.consume}`
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
