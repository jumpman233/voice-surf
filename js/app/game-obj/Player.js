
define(['jquery'], function ( $ ) {
    'use strict';

    function Player( name ) {
        this.hp = 0;
        this.name = name;

        this.curImg = null;
        this.normalImg = null;
        this.waveImg = null;
        this.skateImg = null;
        this.defeatImg = null;
        this.hurtImg = null;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.waveX = 0;
        this.waveY = 0;
        this.power = 0;

        this.targetX = null;
        this.dx = 0;

        this.enemy = null;

        this.attackInit = false;
        this.attacking = false;

        this.dyingInit = false;
        this.dying = false;
        this.isDead = false;
    }
    Player.prototype.constructor = Player;
    Player.prototype.draw = function ( ctx ) {
        ctx.save();
        ctx.drawImage(this.curImg, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.skateImg, this.x, this.y + this.height - 5, this.width, 15);
        ctx.restore();

        if(this.attackInit){
            ctx.drawImage(this.waveImg, this.waveX, this.waveY, 100, 100);
            this.waveY -= 3;

            if(this.waveY <= this.y){
                this.attacking = true;
                this.attackInit = false
            }
        } else if(this.attacking){
            ctx.drawImage(this.waveImg, this.waveX, this.waveY, 100, 100);
            this.waveX += this.dx;
            if((this.waveX >= this.targetX && this.dx >= 0) ||
                (this.waveX <= this.targetX && this.dx <= 0)){
                this.attacking = false;
                this.enemy.getShot(this.power);
            }
        }

        if(this.dyingInit){
            this.preY = this.y + this.height;
            this.dying = true;
            this.dyingInit = false;
        } else if(this.dying){
            this.y += 2;
            if(this.y >= this.preY){
                this.dying = false;
                this.isDead = true;
            }
        }
    };
    Player.prototype.getShot = function ( power ) {
        this.hp -= power;
        if(this.hp <= 70 && this.hp > 0){
            this.curImg = this.hurtImg;
        } else if(this.hp <= 0){
            this.hp = 0;
            this.dead();
        }
    };

    Player.prototype.dead = function (  ) {
        if(this.hp <= 0){
            this.dyingInit = true;
            this.curImg = this.defeatImg;
        }
    };

    Player.prototype.attack = function ( targetX, enemy ) {
        this.attackInit = true;
        this.targetX = targetX;
        if(this.x <= this.targetX){
            this.dx = 5;
            this.waveX = this.x + this.width;
        } else {
            this.dx = -5;
            this.waveX = this.x - this.width;
        }
        this.waveY = this.y + this.height;
        this.enemy = enemy;
    };

    Player.prototype.init = function ( params ) {
        var defer = new $.Deferred(),
            count = 0;

        if(!params.src){
            return;
        } else{
            for(var i in params.src){
                count++;
            }
        }

        function checkInit(  ) {
            count--;
            if(count === 0){
                defer.resolve();
            }
        }

        this.width = params.width;
        this.height = params.height;
        this.hp = 100;
        if(params.src.normal){
            this.normalImg = new Image();
            this.normalImg.src = params.src.normal;
            this.normalImg.onload = checkInit;
        }
        if(params.src.wave){
            this.waveImg = new Image();
            this.waveImg.src = params.src.wave;
            this.waveImg.onload = checkInit;
        }
        if(params.src.skate){
            this.skateImg = new Image();
            this.skateImg.src = params.src.skate;
            this.skateImg.onload = checkInit;
        }
        if(params.src.defeat){
            this.defeatImg = new Image();
            this.defeatImg.src = params.src.defeat;
            this.defeatImg.onload = checkInit;
        }
        if(params.src.hurt){
            this.hurtImg = new Image();
            this.hurtImg.src = params.src.hurt;
            this.hurtImg.onload = checkInit;
        }
        if(params.x && params.y){
            this.x = params.x;
            this.y = params.y;
        }
        this.curImg = this.normalImg;
        this.isDead = false;

        return defer;
    };

    return Player;
});