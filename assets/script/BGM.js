cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        item: cc.Node,
    },

    onLoad: function () {
        this.scrollView.content.removeAllChildren()
        cc.loader.loadResDir(`mp3/`, () => { }, (err, res) => {
            if (err != null) {
                return
            }
            this.data = res || []
            this.currIdx = null
            this.createItem()
            this.setupItem()
        })
    },

    onEnable: function () {
    },

    onDisable: function () {
    },

    createItem: function () {
        for (let i = 0; i < this.data.length; i++) {
            let cloneItem = cc.instantiate(this.item)
            cloneItem.PathChild('val', cc.Label).string = `${this.data[i].name}`
            cloneItem.idx = i
            cloneItem.parent = this.scrollView.content
        }
    },

    setupItem: function () {
        for (let i = 0; i < this.scrollView.content.children.length; i++) {
            this.scrollView.content.children[i].PathChild('frame').active = this.currIdx == i
        }
    },

    btnItem: function (e) {
        if (this.currIdx == e.target.idx) { return }
        this.currIdx = e.target.idx
        this.setupItem()
        cc.audioEngine.stopMusic()
        cc.audioEngine.playMusic(this.data[this.currIdx], true)
    },

    btnReturn: function () {
        this.node.active = false
    },
});
