//游戏所有元素的sprite



var CharacterImagePainter = function(imageUrl) {
    ImagePainter.call(this, imageUrl);
}
CharacterImagePainter.prototype.constructor = CharacterImagePainter;
//角色画笔必须有isReverse属性。
CharacterImagePainter.prototype.paint = function(characterSprite, context, mycanvas) {
    //isReverse代表正。
    if (characterSprite.isReverse) {
        context.drawImage(this.image, characterSprite.left, characterSprite.top, characterSprite.width, characterSprite.height);
    } else {
        var canvas = characterSprite.mycanvas;
        context.translate(canvas.width, 0);
        context.scale(-1, 1)
        context.drawImage(this.image, canvas.width - characterSprite.width - characterSprite.left, characterSprite.top, characterSprite.width, characterSprite.height);
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
};
CharacterRunSpriteSheetPainter = function(cells, spritesheeturl, mycanvas, imgcount) {
    SpriteSheetPainter.call(this, cells, spritesheeturl, mycanvas);
    this.imgcount = imgcount;
}
CharacterRunSpriteSheetPainter.prototype = Object.create(SpriteSheetPainter.prototype);
CharacterRunSpriteSheetPainter.prototype.constructor = CharacterRunSpriteSheetPainter;
CharacterRunSpriteSheetPainter.prototype.paint = function(sprite, context) {
    var cell = this.cells['sprite_' + this.cellIndex];
    if (sprite.isReverse) {
        context.drawImage(this.spritesheet, cell.left, cell.top, cell.width, cell.height, sprite.left, sprite.top, sprite.width, sprite.height);
    } else {
        var canvas = this.mycanvas;
        context.translate(canvas.width, 0);
        context.scale(-1, 1)
        context.drawImage(this.spritesheet, cell.left, cell.top, cell.width, cell.height, canvas.width - sprite.width - sprite.left, sprite.top, sprite.width, sprite.height);
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    }
    //context.drawImage(this.spritesheet, cell.left, cell.top, cell.width, cell.height, sprite.left, sprite.top, sprite.width, sprite.height);
}
CharacterRunSpriteSheetPainter.prototype.advance = function(sprite, context) {
    if (this.cellIndex == this.imgcount) {
        this.cellIndex = 0;
    } else {
        this.cellIndex++;
    }
}

var CharacterSpriteAnimator = function(elapsedCallback,sprite) {
    if (elapsedCallback) {
        this.elapsedCallback = elapsedCallback;
    }
    this.sprite = sprite;
    this.isRunning = false;

}
CharacterSpriteAnimator.prototype = Object.create(SpriteAnimator.prototype);
CharacterSpriteAnimator.prototype.end = function(sprite) {
    sprite.animating = false;
    if (this.elapsedCallback) {
        this.elapsedCallback(sprite);
    }
};
CharacterSpriteAnimator.prototype.start = function() {
   
    this.isRunning = true;
};

CharacterSpriteAnimator.prototype.execute = function() {
    var animator = this;
    if (animator.isRunning) {
        this.sprite.velocityY = this.sprite.velocityY + this.sprite.GRAVITY_FORCE / this.sprite.fpsNum;
        this.sprite.top += this.sprite.velocityY / this.sprite.fpsNum;
        if (this.sprite.top < this.sprite.initialTop) {

            this.sprite.isJump = true;
            this.sprite.painter = this.sprite.jumpPainter;

        } else {

            this.sprite.top = this.sprite.initialTop;
            this.sprite.isJump = false;
            animator.isRunning = false;
            animator.end(this.sprite); //一定要放到isRunning = false;下面
        }
    }
}





//场景Sprite
var SceneSprite = function(name, painter, behaviors) {
    Sprite.call(this, name, painter, behaviors);
}
SceneSprite.prototype = Object.create(Sprite.prototype);
SceneSprite.prototype.constructor = SceneSprite;
SceneSprite.prototype.update = function(context, time, fpsNum) {
    for (var i = this.behaviors.length; i > 0; --i) {
        this.behaviors[i - 1].execute(this, context, time, fpsNum);
    }
}
var SceneImagePainter = function(imageUrl) {
    ImagePainter.call(this, imageUrl);
}
SceneImagePainter.prototype = {
    paint: function(sprite, context) {
        if (!!this.image) {
            if (sprite.imgwidth) {
                context.drawImage(this.image, sprite.imgleft, sprite.imgtop, sprite.imgwidth, sprite.imgheight, sprite.left, sprite.top,
                    sprite.width, sprite.height);
            } else {
                context.drawImage(this.image, sprite.left, sprite.top,
                    sprite.width, sprite.height);
            }

        }
    }
}


//马里奥对象
var Mario = function(setting) {
    Sprite.call(this, setting.name);
    this.isReverse = setting.isReverse;
    this.mycanvas = setting.canvas;
    this.velocityX = setting.velocityX;
    this.width = setting.width;
    this.height = setting.height;
    this.top = this.mycanvas.height - this.height - gameConfig.roadHeight;
    this.left = this.mycanvas.width / 3 - this.width / 2;
    this.GRAVITY_FORCE = publicConfig.GRAVITY_FORCE;
    this.isJump = false;
    this.startVelocityY = 0;
    this.jumpPainter = this.painters.jump;
    this.upColliding = null;
    this.initialTop = this.top;
    this.behaviorStatus = {
        runInPlace: new behaviorList.runInPlace(),
    };
    this.painter = this.painters.stand;
    this.marioSpriteAnimatorJump= new CharacterSpriteAnimator(setting.jumpEndCallback,this);
};
Mario.prototype = Object.create(Sprite.prototype);
Mario.prototype.constructor = Mario;
Mario.prototype.painters = {
    run: new CharacterRunSpriteSheetPainter(marioConfig.config, gameSourceUrl.imageList.mario.run, element.mycanvas, marioConfig.config.totalCount),
    jump: new CharacterImagePainter(gameSourceUrl.imageList.mario.jump),
    stand: new CharacterImagePainter(gameSourceUrl.imageList.mario.stand),
}
Mario.prototype.jump = function(VY) {
    this.startVelocityY = VY;
    this.velocityY = -this.startVelocityY;
    this.behaviors = [];
   this.marioSpriteAnimatorJump.start();
}
Mario.prototype.run = function() {

}
Mario.prototype.draw = function(ctx, time, fpsNum) {
    this.fpsNum = fpsNum; //给marioSpriteAnimator传递fpsnum
   this.marioSpriteAnimatorJump.execute();
    this.update(ctx, time, fpsNum);
    this.paint(ctx);
    CD.judgeMM(this, spriteList.money, function() {
        spriteList.money.visible = false;
        audioControl.audioPlay(gameSourceObj.audioList.collision, gameAudio.eatMoney);
    });
    CD.judgeMNormalWall(this, spriteList.normalwall, function() {
        // spriteList.normalwall.visible=false;     
         audioControl.audioPlay(gameSourceObj.audioList.collision, gameAudio.hitwall);
    });
    CD.judgeMNormalWall(this, spriteList.abnormalwall, function() {
        // spriteList.normalwall.visible=false;     
        audioControl.audioPlay(gameSourceObj.audioList.collision, gameAudio.eatMoney);
    });
     CD.judgeMPipe(this, spriteList.pipe, function() {
        // spriteList.normalwall.visible=false;     
        // audioControl.audioPlay(gameSourceObj.audioList.collision, gameAudio.eatMoney);
    });
}
//普通墙对象
var Normalwall = function(setting) {
    SceneSprite.call(this, setting.name, new SceneImagePainter(gameSourceUrl.imageList.wall), [new behaviorList.moveLeftToRight()]);
    this.width = setting.width;
    this.height = setting.height;
    this.top = setting.top;
    this.left = setting.left;
    this.GRAVITY_FORCE = publicConfig.GRAVITY_FORCE;
    this.initialTop = this.top;
    this.isJump=false;//判断是否为处于上下波动中
    this.jumpPainter = new SceneImagePainter(gameSourceUrl.imageList.wall);
    this.imgwidth = wall.normalSprite.width;
    this.imgheight = wall.normalSprite.height;
    this.imgleft = wall.normalSprite.left;
    this.imgtop = wall.normalSprite.top;
    this.mycanvas = element.mycanvas;
    this.NormalSpriteAnimatorUp= new CharacterSpriteAnimator(setting.jumpEndCallback,this);
};
Normalwall.prototype = Object.create(SceneSprite.prototype);
Normalwall.prototype.draw = function(ctx, time, fpsNum) {
    this.NormalSpriteAnimatorUp.execute();
    this.fpsNum = fpsNum;
    this.update(ctx, time, fpsNum);
    this.paint(ctx);
};
Normalwall.prototype.up = function(VY) { //status为2时，为大蹦，1时为小蹦
            this.startVelocityY = VY;
            this.velocityY = -this.startVelocityY;
            // this.behaviors = [];              
            this.NormalSpriteAnimatorUp.start();
};


var Abnormalwall = function(setting) {
    SceneSprite.call(this, setting.name, new SceneImagePainter(gameSourceUrl.imageList.wall), [new behaviorList.moveLeftToRight()]);
    this.width = setting.width;
    this.height = setting.height;
    this.top = setting.top;
    this.left = setting.left;
    this.GRAVITY_FORCE = publicConfig.GRAVITY_FORCE;
    this.initialTop = this.top;
    this.isJump=false;//判断是否为处于上下波动中
    this.jumpPainter = new SceneImagePainter(gameSourceUrl.imageList.wall);
    this.imgwidth = wall.abnormalwall.width;
    this.imgheight = wall.abnormalwall.height;
    this.imgleft = wall.abnormalwall.left;
    this.imgtop = wall.abnormalwall.top;
    this.mycanvas = element.mycanvas;
    this.NormalSpriteAnimatorUp= new CharacterSpriteAnimator(setting.jumpEndCallback,this);
};
Abnormalwall.prototype = Object.create(SceneSprite.prototype);
Abnormalwall.prototype.draw = function(ctx, time, fpsNum) {
    this.NormalSpriteAnimatorUp.execute();
    this.fpsNum = fpsNum;
    this.update(ctx, time, fpsNum);
    this.paint(ctx);
};
Abnormalwall.prototype.up = function(VY) { //status为2时，为大蹦，1时为小蹦
            this.startVelocityY = VY;
            this.velocityY = -this.startVelocityY;
            // this.behaviors = [];              
            this.NormalSpriteAnimatorUp.start();
};

//金币对象
var Money = function(setting) {
    SceneSprite.call(this, setting.name, new SceneImagePainter(gameSourceUrl.imageList.money), [new behaviorList.moveLeftToRight()]);
    this.width = setting.width;
    this.height = setting.height;
    this.top = setting.top;
    this.left = setting.left;
     this.GRAVITY_FORCE = publicConfig.GRAVITY_FORCE;
    this.initialTop = this.top;
this.isJump=false;//判断是否为处于上下波动中
    this.jumpPainter = new SceneImagePainter(gameSourceUrl.imageList.money);
  this.mycanvas = element.mycanvas;

    this.NormalSpriteAnimatorUp= new CharacterSpriteAnimator(setting.jumpEndCallback,this);
};
Money.prototype = Object.create(SceneSprite.prototype);
Money.prototype.draw=function(ctx, time, fpsNum){
    // this.fpsNum = fpsNum;
    // this.NormalSpriteAnimatorUp.execute();
    
    this.update(ctx, time, fpsNum);
    this.paint(ctx);
}
Money.prototype.up = function(VY) { 
            this.startVelocityY = VY;
            this.velocityY = -this.startVelocityY;
            // this.behaviors = [];              
            this.NormalSpriteAnimatorUp.start();
};
//管道对象
var Pipe = function(setting) {
    SceneSprite.call(this, setting.name, new SceneImagePainter(gameSourceUrl.imageList.pipe), [new behaviorList.moveLeftToRight()]);
    this.width = setting.width;
    this.height = setting.height;
    this.top = setting.top;
    this.left = setting.left;
};
Pipe.prototype = Object.create(SceneSprite.prototype);
Pipe.prototype.draw=function(ctx, time, fpsNum){
    this.update(ctx, time, fpsNum);
    this.paint(ctx);
}

//背景
var BG = function(setting) {
    SceneSprite.call(this, setting.name, new SceneImagePainter(gameSourceUrl.imageList.BG), [new behaviorList.moveLeftToRight()]);
    this.width = setting.width;
    this.height = setting.height;
    this.top =  setting.top;
    this.left = setting.left;
};
BG.prototype = Object.create(SceneSprite.prototype);
BG.prototype.draw=function(ctx, time, fpsNum){
     this.update(ctx, time, fpsNum);
        var left = this.left;
        if (this.velocityX > 0) {
            left = left < element.mycanvas.width ? left : 0;
        } else {
            left = left > -element.mycanvas.width ? left : 0;
        }
        this.left = left;
        this.paint(ctx);
        this.left = left - this.width;
        this.paint(ctx);
        this.left = left + this.width;
        this.paint(ctx);
        this.left = left;
} 