const State = {
    DeadCycle: 0,
    Continue: 1,
    GameOver: 2,
}

const CardType = ['w', 't', 's']

const LineCount = 9

const CountdownSecond = 3

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    cardItem: cc.Prefab = null

    @property(cc.Node)
    winParticle: cc.Node = null

    @property(cc.Node)
    prop: cc.Node = null

    @property(cc.Node)
    countdown: cc.Node = null

    @property(cc.Node)
    timer: cc.Node = null

    cards: any
    scaling: any
    select: any
    timerVal: any
    borderCardIdx: any
    onLoad() {
        this.setGameView()
        this.createCard()
        this.startGame()

        //@ts-ignore
        window.aaa = this
    }

    setGameView() {
        let gameViewWidth = this.content.width
        let cardWidth = gameViewWidth / LineCount
        this.scaling = cardWidth / this.cardItem.data.width
    }

    createCard() {
        this.cards = []
        for (var i = 0; i < CardType.length; i++) {
            for (var j = 1; j < 10; j++) {
                for (var m = 0; m < 4; m++) {
                    this.cards.push(`${CardType[i]}${j}`)
                }
            }
        }
    }

    startGame() {
        this.select = []
        this.timerVal = 0
        this.hideProp()
        this.randomCards()
        this.createPrefab()
        this.hideCards()

        this.countdown.getComponent(cc.Label).string = ''
        this.countdown.stopAllActions()

        this.countdown.runAction(cc.sequence(
            cc.callFunc(() => { this.countdown.getComponent(cc.Label).string = '3' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.countdown.getComponent(cc.Label).string = '2' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.countdown.getComponent(cc.Label).string = '1' }),
            cc.delayTime(1),
            cc.callFunc(() => { this.countdown.getComponent(cc.Label).string = '0' }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.countdown.getComponent(cc.Label).string = ''
                this.runTimer()
                this.showCards()
                this.setupBorderCardIdx()
            }),
        ))
    }

    randomCards() {
        for (var i = 0; i < this.cards.length; i++) {
            let r = ut.RandomInt(0, this.cards.length)
            if (i != r) {
                let v = ut.Clone(this.cards[i])
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
    }

    createPrefab() {
        this.content.removeAllChildren()
        for (var i = 0; i < this.cards.length; i++) {
            let card = cc.instantiate(this.cardItem)
            card.PathChild('cardShow').active = false
            card.PathChild('cardHide').active = false
            card.val = this.cards[i]
            card.idx = i
            card.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this), this)
            card.width = Math.floor(card.width * this.scaling)
            card.height = Math.floor(card.height * this.scaling)
            this.content.addChild(card)
        }
    }

    showProp() {
        this.prop.active = true
    }

    hideProp() {
        this.prop.active = false
    }

    hideCards() {
        for (var i = 0; i < this.content.children.length; i++) {
            let card = this.content.children[i]
            card.PathChild('cardHide').active = true
            card.PathChild('cardShow').active = false
        }
    }

    runTimer() {
        this.timer.getComponent(cc.Label).string = `${this.timerVal}s`
        this.timer.stopAllActions()
        this.timer.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(() => { this.timerVal++; this.runTimer() }),
        ))
    }

    stopTimer() {
        this.timer.stopAllActions()
    }

    showCards() {
        for (var i = 0; i < this.content.children.length; i++) {
            let card = this.content.children[i]
            card.PathChild('cardHide').active = false
            if (card.val == null) {
                card.PathChild('cardShow').active = false
            } else {
                ut.SetSpriteFrame(`val/${card.val}`, card.PathChild('cardShow/val', cc.Sprite))
                card.PathChild('arrow').active = false
                card.PathChild('cardShow').active = true
            }
        }
    }

    setupBorderCardIdx() {
        this.borderCardIdx = []
        for (let i = 0; i < LineCount; i++) {
            // 上边界
            for (let m = i; m < this.content.children.length; m += LineCount) {
                let card = this.content.children[m]
                if (card.val != null && this.borderCardIdx.indexOf(card.idx) == -1) {
                    this.borderCardIdx.push(card.idx)
                    break
                }
            }
            // 下边界
            for (let n = this.content.children.length - LineCount + i; n >= 0; n -= LineCount) {
                let card = this.content.children[n]
                if (card.val != null && this.borderCardIdx.indexOf(card.idx) == -1) {
                    this.borderCardIdx.push(card.idx)
                    break
                }
            }
        }
    }

    touchEnd(event) {
        // 是空白牌 || 已经选中
        if (this.content.children[event.target.idx].val == null || this.select.indexOf(event.target.idx) != -1) {
            return
        }
        this.select.push(event.target.idx)
        if (this.select.length == 2) {
            if (this.check()) {
                let card0 = this.content.children[this.select[0]]
                let card1 = this.content.children[this.select[1]]
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
                        this.winParticle.active = true
                        this.node.runAction(cc.sequence(
                            cc.delayTime(5),
                            cc.callFunc(() => { this.winParticle.active = false; this.startGame() }),
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
    }

    cacheResult() {
        let recordData = ut.GetLocalStorage('wlffl-record') || []
        recordData.push({ consume: this.timerVal, date: new Date().Format('yyyy-mm-dd') })
        recordData.sort((a, b) => { return a.consume - b.consume })
        while (recordData.length > 30) {
            recordData.pop()
        }
        ut.SetLocalStorage('wlffl-record', recordData)
    }

    /**
     * @returns State
     * 0: 不能继续消除
     * 1: 还有牌
     * 2: 结束
     */
    gameOver() {
        for (var i = 0; i < this.content.children.length; i++) {
            if (this.content.children[i].val != null) {
                // 无解
                if (this.deadCycle().length == 0) { return State.DeadCycle }
                return State.Continue
            }
        }
        return State.GameOver
    }

    deadCycle() {
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
    }

    selectAction() {
        for (var i = 0; i < this.select.length; i++) {
            let node = this.content.children[this.select[i]].PathChild('cardShow')
            node.runAction(cc.sequence(
                cc.fadeOut(0.4),
                cc.fadeIn(0.4),
            ).repeat(5))
        }
    }

    errAction() {
        for (var i = 0; i < this.select.length; i++) {
            let node = this.content.children[this.select[i]].PathChild('cardShow')
            node.stopAllActions()
            node.opacity = 255
            node.runAction(cc.sequence(
                cc.moveBy(0.1, -3, 0),
                cc.moveBy(0.1, 3, 0),
            ).repeat(5))
        }
    }

    check() {
        let select0 = this.content.children[this.select[0]]
        let select1 = this.content.children[this.select[1]]
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
    }

    // 检查上面是否通畅
    checkUp(idx) {
        let result = true
        for (let i = idx - LineCount; i >= 0; i -= LineCount) {
            if (this.content.children[i] && this.content.children[i].val != null) {
                result = false
                break
            }
        }
        return result
    }

    // 检查下面是否通畅
    checkDown(idx) {
        let result = true
        for (let i = idx + LineCount; i < this.content.children.length; i += LineCount) {
            if (this.content.children[i] && this.content.children[i].val != null) {
                result = false
                break
            }
        }
        return result
    }

    btnTip() {
        let res = this.deadCycle()
        if (res.length == 0) { return }
        this.content.children[res[0]].PathChild('arrow').active = true
        this.content.children[res[1]].PathChild('arrow').active = true
    }

    btnRestart() {
        this.startGame()
    }

    btnClose() {
        this.hideProp()
    }

    btnReturn() {
        cc.director.loadScene('Main')
    }
}
