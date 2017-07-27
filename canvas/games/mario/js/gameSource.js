//所有游戏需要加载的外部资源
var gameSourceUrl = {
    imageList: {
        //背景
        BG: './images/background2.png',
       // ground: './images/ground.png',
        wall: './images/wall/wall.png',
        flower: './images/flower/4.png',
        mushroom: './images/mushroom/4.png',
        pipe: './images/pipe.png',
        money: './images/money.png',
        star: './images/star.png',
        bullet: './images/fire/fireL/0.png',
        hole: './images/hole.png',
        tower: './images/tower.png',
        monster: './images/monster/1/img.png',
        tortoise:'./images/tortoise/img.png',
         shell:'./images/tortoise/roll/img.png',
        //马里奥
        mario: {
            commonMairo: {
                run: "./images/mario/smallmario/marioR/spritesrun.png",
                jump: "./images/mario/smallmario/marioR/jump.png",
                stand: "./images/mario/smallmario/marioR/stand.png",
            },
            fireMairo: {
                run: "./images/mario/smallmario/marioR/spritesrun2.png",
                jump: "./images/mario/smallmario/marioR/jump2.png",
                stand: "./images/mario/smallmario/marioR/stand2.png",
            },
            invinciblefireMairo: {
                run: "./images/mario/smallmario/marioR/spritesrun3.png",
                jump: "./images/mario/smallmario/marioR/jump3.png",
                stand: "./images/mario/smallmario/marioR/stand3.png",
            },
        }
    },
    audioList: {
        //bigJump:'./sounds/mario/jump_big.mp3',
        BGM: './sounds/mario/bag.mp3',
        WD: './sounds/mario/wudi.mp3',
        jumpAll: './sounds/mario/jumpAll.mp3', //
        collision: './sounds/mario/mariocollision.mp3', //子弹打在其他物体上
       die : './sounds/mario/die.mp3',
        music: './sounds/mario/music2.mp3', //顶到藤蔓 顶碎砖块 1up 拉旗杆 过关时时间清零
    }
}
