cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    btnStartGame: function () {
        cc.director.loadScene('Game')
    },
});