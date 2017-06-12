/**
 * Created by lzh on 2017/6/12.
 */

define(['PowerBar',
'HpBar',
'Text',
'Player',
'jquery',
'background'], function ( PowerBar, HpBar, Text, Player , $, background) {
    'use strict';
    var ctx = document.getElementById('canvas').getContext('2d');

    function FightMenu(  ) {
        this.powerBar = new PowerBar();
        this.hpBar1 = new HpBar();
        this.hpBar2 = new HpBar();
        this.player1 = new Player('p1');
        this.player2 = new Player('p2');
        this.text1 = new Text();
        this.text2 = new Text();
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.playerWidth = this.width / 10;
        this.playerHeight = this.width / 10;
        this.playerY = this.height / 4 * 3 - 5;
        this.ifCanStart = false;
        this.playing = false;
        this.name = "";
        this.nameFontSize = 20;
        this.powerBarHeight = this.height / 5;

        this.hpBar1.init(10, 30, this.width / 5 * 2, 30);
        this.hpBar2.init(this.width / 5 * 3 - 10, 30, this.width / 5 * 2, 30);
        this.powerBar.init(-20, this.powerBarHeight);
        background.init(this.width, this.height);
        this.text1.y = this.nameFontSize;
        this.text1.textAlign = 'left';
        this.text1.fontSize = this.nameFontSize;
        this.text2.y = this.nameFontSize;
        this.text2.textAlign = 'left';
        this.text2.fontSize = this.nameFontSize;
        this.powerBar.power = 0;
    }
    FightMenu.prototype.constructor = FightMenu;
    FightMenu.prototype.init = function ( p1Src, p2Src ) {
        var fm = this,
            defer = $.Deferred();
        if(p1Src && p2Src){
            fm.player1.init({
                src:p1Src,
                width: fm.playerWidth,
                height: fm.playerHeight,
                x: fm.width / 4 - fm.playerWidth,
                y: fm.playerY - fm.playerHeight
            })
                .then(function (  ) {
                    return fm.player2.init({
                        src: p2Src,
                        width: fm.playerWidth,
                        height: fm.playerHeight,
                        x: fm.width / 4 * 3 - fm.playerWidth,
                        y: fm.playerY - fm.playerHeight
                    });
                })
                .then(function (  ) {
                    defer.resolve();
                })
        } else{
            console.log('fightMenu src wrong');
            defer.resolve();
        }
        return defer;
    };
    FightMenu.prototype.draw = function (  ) {
        ctx.clearRect(0, 0, 1000, 1000);

        this.player1.draw(ctx);
        this.player2.draw(ctx);
        background.draw(ctx);
        this.hpBar1.draw(ctx);
        this.hpBar2.draw(ctx);
        this.text1.draw(ctx);
        this.text2.draw(ctx);

        this.powerBar.draw(ctx);

        this.hpBar1.update(this.player1.hp);
        this.hpBar2.update(this.player2.hp);

        if(this.player2.attacking && this.player1.attacking && Math.abs(player1.waveX - player2.waveX) < 10){
            if(this.player1.power > this.player2.power){
                this.player1.power -= this.player2.power;
                this.player2.power = 0;
            } else{
                this.player2.power -= this.player1.power;
                this.player1.power = 0;
            }
        }
    };

    function MainMenu(  ) {
        this.name = 'Voice Spirit';

    }

   return {
        mainMenu: new FightMenu(),
       l: 2
   };
});