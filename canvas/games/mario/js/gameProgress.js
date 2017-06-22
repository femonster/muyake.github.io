var progressObj = {
    mileageNum: 0, //马里奥走的里程
    totaltime: 300, //游戏倒计时
    velocityX: 0,
    currentTime: 300,
    fpsNum: 60,
    countDownWatch: new Stopwatch(),
    createSpriteMileNum: 0,
    mileageNumUpdate: function(fpsNum) {
        this.fpsNum = (fpsNum == 0) ? 0 : (fpsNum || this.fpsNum);
        this.mileageNum += this.velocityX / this.fpsNum;
        var temp = gameConfig.objectSpeed * lib.getSign(this.velocityX) / this.fpsNum;
        if (isNaN(temp)) {
            var i = 33;
        } else {
            this.createSpriteMileNum += temp;
        }

    },
    countDownNumUpdate: function() {
        //this.fpsNum = (fpsNum == 0) ? 0 : (fpsNum || this.fpsNum);
        this.currentTime = this.totaltime - this.countDownWatch.getElapsedTime() / 1000;
    },
    countDownStart: function() {
        this.countDownWatch.start();
    },
    countDownPause: function() {
        this.countDownWatch.stop();
        this.totaltime = this.currentTime;
    },
};

var totalProgressSprite = {
    wall: [{
        isVisible: true,
        id: lib.newGuid(),
        status: 0,
        positionmile: 770, //left=progressObj.mileageNum-positionmile   
        physicaltop: 100,
    }, {
        isVisible: true,
        id: lib.newGuid(),
        status: 1,
        positionmile: 805,
        physicaltop: 100,
    }],
    money: [{
        isVisible: true,
        id: lib.newGuid(),
        physicaltop: 100,
        positionmile: 200
    }, {
        isVisible: true,
        id: lib.newGuid(),
        physicaltop: 100,
        positionmile: 1000
    }],
    pipe: [{
        isVisible: true,
        id: lib.newGuid(),
        physicaltop: 0,
        positionmile: 500
    }],
    fire: [],
    badflower: [],
    flower: [],
    monster: [],
    mushroom: [],
    tortoise: [],
    star: [],
    tower: [],
    hole: [],
};

var createFactory = {
    arrayTotalProgress: [],

    createUpMoney: function(positionmile, physicaltop) {
        var createUpMoneyObj = new Money({
            physicaltop: physicaltop,
            positionmile: positionmile,
            // left: positionmile-,
            jumpEndCallback: SpriteAnimatorEndCallbackList.moneyupend
        });
        createUpMoneyObj.up(200);
        drawSpriteList.createSpriteList.push(createUpMoneyObj);
    },
    createWall: function(setting) {
        setting.status = setting.status || 0;
        var wall;
        wall = new Wall({
            id: setting.id,
            physicaltop: setting.physicaltop,
            positionmile: setting.positionmile,
            status: setting.status,
            left: setting.positionmile - progressObj.createSpriteMileNum,
        });
        return wall;
    },
    createPipe: function(setting) {
        return new Pipe({
            id: setting.id,
            physicaltop: setting.physicaltop,
            positionmile: setting.positionmile,
            //left: setting.positionmile - progressObj.mileageNum*Math.abs(gameConfig.objectSpeed/ gameConfig.progressObjSpeed),
            left: setting.positionmile - progressObj.createSpriteMileNum,
        });
    },
    createMoney: function(setting) {
        return new Money({
            id: setting.id,
            physicaltop: setting.physicaltop,
            positionmile: setting.positionmile,
            left: setting.positionmile - progressObj.createSpriteMileNum,
            // left:setting.positionmile - progressObj.createSpriteMileNum,
        });
    },
    createFire: function(setting) {

    },
    createBadflower: function(setting) {

    },
    createFlower: function(setting) {

    },
    createMonster: function(setting) {

    },
    createMushroom: function(setting) {

    },
    createTortoise: function(setting) {

    },
    createStar: function(setting) {

    },
    createTower: function(setting) {

    },
    createHole: function(setting) {

    },
    nameToCreateFun: {
        'wall': 'createWall',
        'money': 'createMoney',
        'pipe': 'createPipe',
        'fire': 'createFire',
        'badflower': 'createBadflower',
        'flower': 'createFlower',
        'monster': 'createMonster',
        'tortoise': 'createTortoise',
        'star': 'createStar',
        'tower': 'createTower',
        'hole': 'createHole'
    },
    hasId: function(id, spriteList) {
        return spriteList.some(function(item) {
            return item.id == id;
        });
    },
    insertDrawSpriteList: function(mileageNum, drawSpriteList) {
        drawSpriteList.forEach(function(removeItem) {
            if (!removeItem.visible || (removeItem.positionmile - progressObj.createSpriteMileNum) < -removeItem.width || (removeItem.positionmile - progressObj.createSpriteMileNum) > element.mycanvas.width) {
                var id = removeItem.id;
                lib.removeByValue(drawSpriteList, 'id', id);
            }
        });
        var self = this;
        var totalProgressArray = this.arrayTotalProgress;
        totalProgressArray.forEach(function(item) {
            if (item.isVisible && (item.positionmile - progressObj.createSpriteMileNum) >= -WH[item.name].width && (item.positionmile - progressObj.createSpriteMileNum) <= element.mycanvas.width) {
                var id = item.id;
                if (!self.hasId(id, drawSpriteList)) {
                    drawSpriteList.push(self[self.nameToCreateFun[item.name]](item));
                }
            }
        });
    },
    setVisible: function(mileageNum, drawSpriteList) {

    },
    init: function() {
        for (var key in totalProgressSprite) {
            totalProgressSprite[key].forEach(function(item) {
                item.name = key;
            })
            this.arrayTotalProgress = this.arrayTotalProgress.concat(totalProgressSprite[key]);
        }
        lib.sort(this.arrayTotalProgress, 'positionmile', 0);
    }
}