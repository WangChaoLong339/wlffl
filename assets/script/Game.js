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
                this.setupBorderCardIdx()
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
        return
        this.cards = [
            'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
            'w1', 'w9', 'w4', 'w3', 'w6', 'w5', 'w8', 'w7', 'w2',
            'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
            'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
            't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
            't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
            't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
            't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
            's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
            's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
            's2', 's1', 's4', 's3', 's6', 's5', 's8', 's7', 's9',
            's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
        ]
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
                card.PathChild('arrow').active = false
                card.PathChild('cardShow').active = true
            }
        }
    },

    setupBorderCardIdx: function () {
        this.borderCardIdx = []
        for (let i = 0; i < LineCount; i++) {
            // 上边界
            for (let m = i; m < this.layout.children.length; m += LineCount) {
                let card = this.layout.children[m]
                if (card.val != null && this.borderCardIdx.indexOf(card.idx) == -1) {
                    this.borderCardIdx.push(card.idx)
                    break
                }
            }
            // 下边界
            for (let n = this.layout.children.length - LineCount + i; n >= 0; n -= LineCount) {
                let card = this.layout.children[n]
                if (card.val != null && this.borderCardIdx.indexOf(card.idx) == -1) {
                    this.borderCardIdx.push(card.idx)
                    break
                }
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
                let card0 = this.layout.children[this.select[0]]
                let card1 = this.layout.children[this.select[1]]
                card0.val = null
                card1.val = null
                card0.PathChild('arrow').active = false
                card1.PathChild('arrow').active = false
                this.showCards()
                this.setupBorderCardIdx()

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
                // 无解
                if (this.deadCycle().length == 0) { return State.DeadCycle }
                return State.Continue
            }
        }
        return State.GameOver
    },

    deadCycle: function () {
        // 检查上下
        for (let i = 0; i < this.borderCardIdx.length - 1; i++) {
            for (let j = i + 1; j < this.borderCardIdx.length; j++) {
                if (this.cards[this.borderCardIdx[i]] == this.cards[this.borderCardIdx[j]]) {
                    return [this.borderCardIdx[i], this.borderCardIdx[j]]
                }
            }
        }
        // 检查相邻
        for (let i = 0; i < this.borderCardIdx.length; i++) {
            let card = this.cards[this.borderCardIdx[i]]
            let upCard = null
            let downCard = null
            if (this.borderCardIdx[i] - LineCount >= 0) { upCard = this.cards[this.borderCardIdx[i] - LineCount] }
            if (this.borderCardIdx[i] + LineCount < this.cards.length) { downCard = this.cards[this.borderCardIdx[i] + LineCount] }
            if (upCard && upCard == card) {
                return [this.borderCardIdx[i] - LineCount, this.borderCardIdx[i]]
            }
            if (downCard && downCard == card) {
                return [this.borderCardIdx[i], this.borderCardIdx[i] + LineCount]
            }
        }
        return []
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
        // 至少一边通畅
        if ((this.checkUp(select0.idx) || this.checkDown(select0.idx)) && (this.checkUp(select1.idx) || this.checkDown(select1.idx))) {
            return true
        }
        // 相邻牌
        if (Math.abs(select0.idx - select1.idx) == LineCount && (this.checkUp(select0.idx) || this.checkDown(select0.idx) || this.checkUp(select1.idx) || this.checkDown(select1.idx))) {
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

    btnTip: function () {
        let res = this.deadCycle()
        if (res.length.length == 0) { return }
        this.layout.children[res[0]].PathChild('arrow').active = true
        this.layout.children[res[1]].PathChild('arrow').active = true
    },

    btnRestart: function () {
        this.startGame()
    },

    btnClose: function () {
        this.hideProp()
    },

    btnReturn: function () {
        cc.director.loadScene('Main')
    },
});