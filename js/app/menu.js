/**
 * Created by lzh on 2017/6/12.
 */

define(['PowerBar',
'HpBar',
'Text',
'Player',
'jquery',
'background',
'pitchdetect'], function ( PowerBar, HpBar, Text, Player , $, background, voice) {
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
        this.curPlayer = null;
        this.anoPlayer = null;

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
    FightMenu.prototype.init = function ( ifP1, p1Name, p2Name ) {
        var fm = this,
            defer = $.Deferred();
            fm.player1.init({
                src:{
                    normal: './img/dog-normal.png' ,
                    wave: './img/wave.png' ,
                    skate: './img/skate-board1.png' ,
                    defeat: './img/dog-defeat.png' ,
                    hurt: './img/dog-hurt.png'
                },
                width: fm.playerWidth,
                height: fm.playerHeight,
                x: fm.width / 4 - fm.playerWidth,
                y: fm.playerY - fm.playerHeight
            })
            .then(function (  ) {
                return fm.player2.init({
                    src: {
                        normal: './img/cat-normal.png' ,
                        wave: './img/wave2.png' ,
                        skate: './img/skate-board1.png' ,
                        defeat: './img/cat-defeat.png' ,
                        hurt: './img/cat-hurt.png'
                    } ,
                    width: fm.playerWidth,
                    height: fm.playerHeight,
                    x: fm.width / 4 * 3 - fm.playerWidth,
                    y: fm.playerY - fm.playerHeight
                });
            })
            .then(function (  ) {
                if(ifP1){
                    fm.text1.text = p1Name;
                    fm.text2.text = p2Name;
                    fm.powerBar.init( 10 , fm.powerBarHeight );
                    fm.curPlayer = fm.player1;
                    fm.anoPlayer = fm.player2;
                } else{
                    fm.text1.text = p2Name;
                    fm.text2.text = p1Name;
                    fm.powerBar.init( width - 10 - fm.powerBar.bkRect.width , fm.powerBarHeight );
                    fm.curPlayer = fm.player2;
                    fm.anoPlayer = fm.player1;
                }
                fm.text1.x = 10;
                fm.text2.x = width - fm.nameFontSize * fm.text2.text.length - 10;
                defer.resolve();
            });
        var frame = 50 ,
            frameCount = 0 ,
            minVolumn ,
            totVolumn = 0 ,
            inter;
        var a = window.setInterval( function () {
            frame--;
            if (frame <= 0) {
                window.clearInterval( a );
                fm.minVolumn = totVolumn / frameCount + 0.1;
                console.log( fm.minVolumn );
                fm.roundBegin();
            } else {
                var v = voice.getVolume();
                if (v !== undefined) {
                    totVolumn += voice.getVolume();
                    frameCount++;
                }
            }
        } , 20 );

        document.addEventListener( 'mousedown' , function () {
            inter = window.setInterval( function () {
                fm.powerBar.update();
            } , 20 );
        } );
        document.addEventListener( 'mouseup' , function () {
            window.clearInterval( inter );
            fm.curPlayer.power = fm.powerBar.power;
            $.ajax( baseUrl + '/update' , {
                data: {
                    power: fm.powerBar.power ,
                    p1: ifP1 ? 1 : 0 ,
                    pairNum: pairNum
                } ,
                success: function ( data ) {
                    console.log( data );
                } ,
                error: function () {
                    console.log( 'ajax error!' );
                }
            } );
            getData(fm.anoPlayer).then( function () {
                fm.powerBar.power = 0;
                fm.curPlayer.attack( fm.anoPlayer.x , fm.anoPlayer );
                fm.anoPlayer.attack( fm.curPlayer.x , fm.curPlayer );
            } );
        } );
        return defer;
    };
    FightMenu.prototype.draw = function (  ) {
        ctx.clearRect(0, 0, this.width, this.height);

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

        if(this.player2.attacking && this.player1.attacking && Math.abs(this.player1.waveX - this.player2.waveX) < 10){
            if(this.player1.power > this.player2.power){
                this.player1.power -= this.player2.power;
                this.player2.power = 0;
            } else{
                this.player2.power -= this.player1.power;
                this.player1.power = 0;
            }
        }
    };
    FightMenu.prototype.start = function (  ) {
        var fm = this;
        window.setInterval(function (  ) {
           fm.draw();
        }, 30);
    };
    FightMenu.prototype.roundBegin = function (  ) {
        var roundBegin = $('#round-begin'),
            fm = this;
        roundBegin.removeClass('hidden');
        roundBegin.addClass('ease-in');
        window.setTimeout(function (  ) {
            roundBegin.addClass("hidden");
            roundBegin.removeClass('ease-in');
            fm.volumnSet();
        }, 3000);
    };
    FightMenu.prototype.clearVolume = function (  ) {
        window.clearInterval(this.volumeInter);
    };
    FightMenu.prototype.volumnSet = function (  ){
        var shouting = false ,
            canShout = true ,
            initReduce = 100 ,
            reduce = 100 ;
        var fm = this;
        fm.volumeInter = window.setInterval( function () {
            var volumn = voice.getVolume();
            if (volumn > fm.minVolumn && canShout) {
                fm.powerBar.update();
                console.log("?");
                if (!shouting) {
                    shouting = true;
                }
            } else {
                if (shouting) {
                    if (reduce > 0) {
                        reduce--;
                    } else {
                        canShout = false;
                        shouting = false;
                        fm.clearVolume();
                        fm.curPlayer.power = fm.powerBar.power;
                        $.ajax( baseUrl + '/update' , {
                            data: {
                                power: fm.powerBar.power ,
                                p1: ifP1 ? 1 : 0 ,
                                pairNum: pairNum
                            } ,
                            success: function ( data ) {
                                console.log( data );
                            } ,
                            error: function () {
                                console.log( 'ajax error!' );
                            }
                        } );
                        getData(fm.anoPlayer).then( function () {
                            reduce = initReduce;
                            fm.powerBar.power = 0;
                            fm.curPlayer.attack( fm.anoPlayer.x , fm.anoPlayer );
                            fm.anoPlayer.attack( fm.curPlayer.x , fm.curPlayer );
                            window.setTimeout(function (  ) {
                                fm.roundBegin();
                            }, 5000);
                        } );
                    }
                }
            }
        } , 20 );
    };
    var getData = function (anoPlayer) {
        var defer = $.Deferred();

        var b = window.setInterval( function () {
            $.ajax( baseUrl + '/getData' , {
                data: {
                    p1: ifP1 ? 0 : 1 ,
                    pairNum: pairNum
                } ,
                timeout: 2000 ,
                success: function ( data ) {
                    if (data === 'no-update') {

                    } else {
                        anoPlayer.power = data;
                        window.clearInterval( b );
                        defer.resolve();
                    }
                }
            } );
        } , 1500 );
        return defer;
    };

   return {
        fightMenu: new FightMenu()
   };
});