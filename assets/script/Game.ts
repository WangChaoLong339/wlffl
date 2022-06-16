const State = {
    DeadCycle: 0,
    Continue: 1,
    GameOver: 2,
}

const CardType = ['w', 't', 's']

const LineCount = 9

const CountdownSecond = 3

const MaJiangCount = 108

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    cardsContent: cc.Node = null

    @property(cc.Node)
    cardItem: cc.Node = null

    @property(cc.Node)
    winParticle: cc.Node = null

    @property(cc.Node)
    prop: cc.Node = null

    @property(cc.Node)
    countdown: cc.Node = null

    @property(cc.Node)
    timer: cc.Node = null

    cardsInfo: any
    cardScale: number
    selectCard: any
    onLoad() {
        //@ts-ignore
        window.aaa = this

        // 计算cardItem的size
        // this._caculateCardSize()

        // 创建牌的数据
        this._generateCardsInfo()

        // 创建牌的节点
        this.createCardsItem()
    }

    onEnable() {
        this.initGame()
    }

    onDisable() {
        this.prop.active = false

        this.selectCard = []

        this.timer = null
    }

    _caculateCardSize() {
        let gameViewWidth = this.cardsContent.width
        let cardWidth = gameViewWidth / LineCount
        this.cardScale = cardWidth / this.cardItem.width
    }

    _generateCardsInfo() {
        this.cardsInfo = []

        for (let i = 0; i < CardType.length; i++) {
            for (let m = 0; m < 9; m++) {
                for (let n = 0; n < 4; n++) {
                    this.cardsInfo.push(`${CardType[i]}${m + 1}`)
                }
            }
        }
    }

    _shuffle() {
        for (var i = 0; i < this.cardsInfo.length; i++) {
            let r = ut.RandomInt(0, this.cardsInfo.length)
            if (i != r) {
                let v = ut.Clone(this.cardsInfo[i])
                this.cardsInfo[i] = this.cardsInfo[r]
                this.cardsInfo[r] = v
            }
        }
        return
        // [
        //     'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
        //     'w1', 'w9', 'w4', 'w3', 'w6', 'w5', 'w8', 'w7', 'w2',
        //     'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
        //     'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9',
        //     't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
        //     't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
        //     't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
        //     't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9',
        //     's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
        //     's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
        //     's2', 's1', 's4', 's3', 's6', 's5', 's8', 's7', 's9',
        //     's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
        // ]
    }

    initGame() {
        // 清空数据
        this.selectCard = []

        // 洗牌
        this._shuffle()

        // 设置数据到节点
        this.setupCards()

        // 显示牌背
        this.hideCards()

        // 显示牌面
        this.showCards()
    }

    createCardsItem() {
        this.cardsContent.removeAllChildren()

        this.cardScale = this.cardScale || 1

        for (let i = 0; i < MaJiangCount; i++) {
            let cardItemClone = cc.instantiate(this.cardItem)
            cardItemClone.width = cardItemClone.width * this.cardScale
            cardItemClone.height = cardItemClone.height * this.cardScale
            cardItemClone.parent = this.cardsContent
        }
    }

    setupCards() {
        // 数据出现问题
        if (this.cardsContent.children.length != this.cardsInfo.length) { return cc.error('数据错误') }

        for (let i = 0; i < this.cardsContent.children.length; i++) {
            let cardItem: any = this.cardsContent.children[i]
            cardItem.idx = i
            cardItem.val = this.cardsInfo[i]
            ut.SetSpriteFrame(`val/${cardItem.val}`, cardItem.PathChild('cardShow/val', cc.Sprite))
        }
    }

    hideCards() {
        for (let i = 0; i < this.cardsContent.children.length; i++) {
            let cardItem = this.cardsContent.children[i]
            cardItem.PathChild('cardHide').active = true
            cardItem.PathChild('cardShow').active = false
        }
    }

    showCards() {
        let delayTime = 0
        for (let i = 0; i < this.cardsContent.children.length; i++) {
            let cardItem = this.cardsContent.children[i]
            let hide = cardItem.PathChild('cardHide')
            hide.opacity = 255
            hide.active = true
            let show = cardItem.PathChild('cardShow')
            show.opacity = 0
            show.active = true
            cardItem.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => {
                    hide.runAction(cc.fadeOut(0.5))
                    show.runAction(cc.fadeIn(0.5))
                })
            ))
            if (i != 0 && i % LineCount == LineCount - 1) {
                delayTime += 0.1
            }
        }
    }

    startCardAction(cardItem) {
        cardItem.stopAllActions()
        cardItem.opacity = 255
        cardItem.runAction(cc.repeatForever(cc.sequence(
            cc.fadeOut(0.5),
            cc.fadeIn(0.5)
        )))
    }

    endCardAction(cardItem) {
        cardItem.stopAllActions()
        cardItem.opacity = 255
    }

    btnCardItem(e) {
        let idx = e.target.idx
        if (this.selectCard.length == 0) {
            this.selectCard.push(idx)
            let cardItem = this.cardsContent.children[idx]
            this.startCardAction(cardItem)
            return
        }
        if (this.selectCard.indexOf(idx) != -1) {
            this.selectCard = []
            let cardItem = this.cardsContent.children[idx]
            this.endCardAction(cardItem)
            return
        }
    }

    btnTip() {
    }

    btnRestart() {
    }

    btnClose() {
        this.prop.active = false
    }

    btnReturn() {
        this.node.active = false
    }
}
