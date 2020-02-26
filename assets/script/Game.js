cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Node,
        card: cc.Prefab,
    },

    onLoad: function () {
        this.cardType = ['w', 't', 's']
        this.select = []
        this.createCard()
    },

    createCard: function () {
        this.cards = []
        for (var i = 0; i < this.cardType.length; i++) {
            for (var j = 1; j < 10; j++) {
                for (var m = 0; m < 4; m++) {
                    this.cards.push(this.cardType[i] + j)
                }
            }
        }
        this.randomCards()
        this.createPrefab()
        // test code
        this.showCards()
        return
        this.hideCards()
        this.node.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(() => {
                this.showCards()
            })
        ))
    },

    randomCards: function () {
        for (var i = 0; i < this.cards.length; i++) {
            let r = RandomInt(0, this.cards.length)
            if (i != r) {
                let v = Clone(this.cards[i])
                this.cards[i] = this.cards[r]
                this.cards[r] = v
            }
        }
    },

    createPrefab: function () {
        this.layout.removeAllChildren()
        for (var i = 0; i < this.cards.length; i++) {
            let card = cc.instantiate(this.card)
            card.PathChild('cardShow').active = false
            card.PathChild('cardHide').active = false
            card.val = this.cards[i]
            card.idx = i
            card.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this), this)
            this.layout.addChild(card)
        }
    },

    hideCards: function () {
        for (var i = 0; i < this.layout.children.length; i++) {
            let card = this.layout.children[i]
            card.PathChild('cardHide').active = true
            card.PathChild('cardShow').active = false
        }
    },

    showCards: function () {
        for (var i = 0; i < this.layout.children.length; i++) {
            let card = this.layout.children[i]
            card.PathChild('cardHide').active = false
            if (card.val == null) {
                card.PathChild('cardShow').active = false
            } else {
                SetSpriteFrame(`val/${card.val}`, card.PathChild('cardShow/val', cc.Sprite))
                card.PathChild('cardShow').active = true
            }
        }
    },

    touchEnd: function (event) {
        if (this.layout.children[event.target.idx].val == null || this.select.indexOf(event.target.idx) != -1) {
            return
        }
        this.select.push(event.target.idx)
        if (this.select.length == 2) {
            if (this.layout.children[this.select[0]].val == this.layout.children[this.select[1]].val && this.check()) {
                this.layout.children[this.select[0]].val = null
                this.layout.children[this.select[1]].val = null
                this.showCards()
            } else {
                this.errAction()
            }
            this.select = []
        }
        this.selectAction()
    },

    selectAction: function () {
        for (var i = 0; i < this.select.length; i++) {
            let node = this.layout.children[this.select[i]].PathChild('cardShow')
            node.runAction(cc.sequence(
                cc.fadeOut(0.4),
                cc.fadeIn(0.4),
            ).repeat(5))
        }
    },

    errAction: function () {
        for (var i = 0; i < this.select.length; i++) {
            let node = this.layout.children[this.select[i]].PathChild('cardShow')
            node.stopAllActions()
            node.opacity = 255
            node.runAction(cc.sequence(
                cc.moveBy(0.1, -3, 0),
                cc.moveBy(0.1, 3, 0),
            ).repeat(5))
        }
    },

    check: function () {
        let result = true
        let idx0 = this.layout.children[this.select[0]]
        let idx1 = this.layout.children[this.select[1]]
        return result
    },

    btnReturn: function () {
        cc.director.loadScene('Main')
    },
});