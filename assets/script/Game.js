const State = {
    DeadCycle: 0,
    Continue: 1,
    GameOver: 2,
}

const LineCount = 9

cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Node,
        card: cc.Prefab,
        particle: cc.Node,
        prop: cc.Node,
        startCd: cc.Node,
        timer: cc.Node,
    },

    onLoad: function () {
        this.cardType = ['w', 't', 's']
        this.setGameView()
        this.createCard()
        this.startGame()
        window.aaa = this
    },

    setGameView: function () {
        let gameViewWidth = this.layout.width
        let cardWidth = gameViewWidth / LineCount
        this.scaling = cardWidth / this.card.data.width
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
    },

    startGame: function () {
        this.select = []
        this.timerVal = 0
        this.hideProp()
        this.randomCards()
        this.createPrefab()
        this.hideCards()

        this.startCd.getComponent(cc.Label).string = ''
        this.startCd.stopAllActions()
        this.startCd.runAction(cc.sequence(
            cc.callFunc(() => { this.startCd.getComponent(cc.Label).string = '3' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.startCd.getComponent(cc.Label).string = '2' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.startCd.getComponent(cc.Label).string = '1' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.startCd.getComponent(cc.Label).string = '0' }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.startCd.getComponent(cc.Label).string = ''
                this.runTimer()
                this.showCards()
            }),
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
            card.width = parseInt(card.width * this.scaling)
            card.height = parseInt(card.height * this.scaling)
            this.layout.addChild(card)
        }
    },

    showProp: function () {
        this.prop.active = true
    },

    hideProp: function () {
        this.prop.active = false
    },

    hideCards: function () {
        for (var i = 0; i < this.layout.children.length; i++) {
            let card = this.layout.children[i]
            card.PathChild('cardHide').active = true
            card.PathChild('cardShow').active = false
        }
    },

    runTimer: function () {
        this.timer.getComponent(cc.Label).string = `${this.timerVal}s`
        this.timer.stopAllActions()
        this.timer.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => { this.timerVal++; this.runTimer() }),
        ))
    },

    stopTimer: function () {
        this.timer.stopAllActions()
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
        // 是空白牌 || 已经选中
        if (this.layout.children[event.target.idx].val == null || this.select.indexOf(event.target.idx) != -1) {
            return
        }
        this.select.push(event.target.idx)
        if (this.select.length == 2) {
            if (this.check()) {
                this.layout.children[this.select[0]].val = null
                this.layout.children[this.select[1]].val = null
                this.showCards()

                switch (this.gameOver()) {
                    case State.GameOver:
                        this.stopTimer()
                        this.cacheResult()
                        this.particle.active = true
                        this.node.runAction(cc.sequence(
                            cc.delayTime(5),
                            cc.callFunc(() => { this.particle.active = false; this.startGame() }),
                        ))
                        return
                    case State.DeadCycle:
                        this.stopTimer()
                        this.showProp()
                        return
                }
            } else {
                this.errAction()
            }
            this.select = []
        }
        this.selectAction()
    },

    cacheResult: function () {
        let recordData = GetLocalStorage('wlffl-record') || []
        recordData.push({ consume: this.timerVal, date: new Date().Format('yyyy-mm-dd') })
        recordData.sort((a, b) => { return a.consume - b.consume })
        while (recordData.length > 30) {
            recordData.pop()
        }
        SetLocalStorage('wlffl-record', recordData)
    },

    /**
     * @returns State
     * 0: 不能继续消除
     * 1: 还有牌
     * 2: 结束
     */
    gameOver: function () {
        for (var i = 0; i < this.layout.children.length; i++) {
            if (this.layout.children[i].val != null) {
                return State.Continue
            }
        }
        return State.GameOver
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
        let select0 = this.layout.children[this.select[0]]
        let select1 = this.layout.children[this.select[1]]
        // 点击了不同的牌
        if (select0.val != select1.val) {
            return false
        }
        // 相邻牌
        if (Math.abs(select0.idx - select1.idx) == LineCount) {
            return true
        }
        // 至少一边通畅
        if ((this.checkUp(select0.idx) || this.checkDown(select0.idx)) && (this.checkUp(select1.idx) || this.checkDown(select1.idx))) {
            return true
        }
        return false
    },

    // 检查上面是否通畅
    checkUp: function (idx) {
        let result = true
        for (let i = idx - LineCount; i >= 0; i -= LineCount) {
            if (this.layout.children[i] && this.layout.children[i].val != null) {
                result = false
                break
            }
        }
        return result
    },

    // 检查下面是否通畅
    checkDown: function (idx) {
        let result = true
        for (let i = idx + LineCount; i < this.layout.children.length; i += LineCount) {
            if (this.layout.children[i] && this.layout.children[i].val != null) {
                result = false
                break
            }
        }
        return result
    },

    btnRestart: function () {
        this.startGame()
    },

    btnReturn: function () {
        cc.director.loadScene('Main')
    },
});