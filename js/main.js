/**
 * Created by lzh on 2017/2/28.
 */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'graph': 'app/base-obj/graph',
        'rect': 'app/base-obj/rect',
        'ball': 'app/base-obj/ball',
        'util': 'app/util',
        'HpBar': 'app/game-obj/HpBar',
        'PowerBar': 'app/game-obj/PowerBar',
        'Player': 'app/game-obj/Player',
        'background': 'app/game-obj/background',
        'Text': 'app/base-obj/text',
        'pitchdetect': 'app/pitchdetect'
    }
});
var curPlayer, anoPlayer, players = [], pairNum, p1;

var baseUrl = 'http://127.0.0.1:3000';

function change(  ) {
    var a = curPlayer;
    curPlayer = anoPlayer;
    anoPlayer = a;
}

require(['jquery', 'PowerBar', 'HpBar', 'Player', 'background', 'Text', 'pitchdetect'],
    function ($, PowerBar, HpBar, Player, background, Text, voice) {
        var ctx = document.getElementById('canvas').getContext('2d');
        var powerBar = new PowerBar();
        var hpBar1 = new HpBar(),
            hpBar2 = new HpBar(),
            player1 = new Player('p1'),
            player2 = new Player('p2'),
            text1 = new Text(),
            text2 = new Text(),
            width = ctx.canvas.width,
            height = ctx.canvas.height,
            playerWidth = width / 10,
            playerHeight = width / 10,
            playerY = height / 4 * 3 - 5,
            ifCanStart = false,
            playing = false,
            name = "",
            nameFontSize = 20,
            powerBarHeight = height / 5;

        players.push(player1);
        players.push(player2);

        hpBar1.init(10, 30, width / 5 * 2, 30);
        hpBar2.init(width / 5 * 3 - 10, 30, width / 5 * 2, 30);
        powerBar.init(-20, powerBarHeight);
        background.init(width, height);
        text1.y = nameFontSize;
        text1.textAlign = 'left';
        text1.fontSize = nameFontSize;
        text2.y = nameFontSize;
        text2.textAlign = 'left';
        text2.fontSize = nameFontSize;
        powerBar.power = 0;

        getName()
            .then(function (  ) {
                return $.ajax(baseUrl + '/getPlayer', {
                    data: {
                        name: name
                    },
                    success: function ( data ) {
                        data = JSON.parse(data);
                        pairNum = data.pairNum;
                        if(data.player === 'p1'){
                            curPlayer = player1;
                            anoPlayer = player2;
                            text1.text = name;
                            text1.x = 10;
                            powerBar.init(10, powerBarHeight);
                            p1 = true;
                        } else{
                            curPlayer = player2;
                            anoPlayer = player1;
                            text2.text = name;
                            text2.x = width - nameFontSize * name.length - 10;
                            powerBar.init(width - 10 - powerBar.bkRect.width, powerBarHeight);
                            p1 = false;
                        }
                        curPlayer.name = name;
                    }
                })
            })
            .then(function (  ) {
                canStart();
                return player1.init({
                    src:{
                        normal: './img/dog-normal.png',
                        wave: './img/wave.png',
                        skate: './img/skate-board1.png',
                        defeat: './img/dog-defeat.png',
                        hurt: './img/dog-hurt.png'
                    },
                    width: playerWidth,
                    height: playerHeight,
                    x: width / 4 - playerWidth,
                    y: playerY - playerHeight
                })
            }).then(function (  ) {
            return player2.init({
                src:{
                    normal: './img/cat-normal.png',
                    wave: './img/wave2.png',
                    skate: './img/skate-board1.png',
                    defeat: './img/cat-defeat.png',
                    hurt: './img/cat-hurt.png'
                },
                width: playerWidth,
                height: playerHeight,
                x: width / 4 * 3 - playerWidth,
                y: playerY - playerHeight
            });
        }).then(function (  ) {
            setInterval(draw, 30);
        });

        var shouting = false,
            canShout = true,
            initReduce = 100,
            reduce = 100,
            frame = 50,
            frameCount = 0,
            minVolumn,
            totVolumn = 0,
            inter;
        var a = window.setInterval(function (  ) {
            frame--;
            if(frame <= 0){
                window.clearInterval(a);
                minVolumn = totVolumn / frameCount + 0.1;
                console.log(minVolumn);
                volumnSet();
            } else{
                var v = voice.getVolume();
                if(v !== undefined){
                    totVolumn += voice.getVolume();
                    frameCount++;
                }
            }
        }, 20);
        function volumnSet(  ) {
            window.setInterval(function (  ) {
                var volumn = voice.getVolume();
                console.log(canShout);
                if(volumn > minVolumn && canShout){
                    console.log("??");
                    powerBar.update();
                    if(!shouting){
                        shouting = true;
                    }
                } else {
                    if(shouting){
                        if(reduce > 0){
                            reduce--;
                        } else{
                            canShout = false;
                            shouting = false;
                            curPlayer.power = powerBar.power;
                            $.ajax(baseUrl+'/update',{
                                data: {
                                    power: powerBar.power,
                                    p1: p1 ? 1 : 0,
                                    pairNum: pairNum
                                },
                                success: function ( data ) {
                                    console.log(data);
                                },
                                error: function (  ) {
                                    console.log('ajax error!');
                                }
                            });
                            getData().then(function (  ) {
                                canShout = true;
                                reduce = initReduce;
                                powerBar.power = 0;
                                curPlayer.attack(anoPlayer.x, anoPlayer);
                                anoPlayer.attack(curPlayer.x, curPlayer);
                            });
                        }
                    }
                }
            }, 20);
        }

        document.addEventListener('mousedown', function (  ) {
            inter = window.setInterval(function (  ) {
                powerBar.update();
            }, 20);
        });
        document.addEventListener('mouseup', function (  ) {
            window.clearInterval(inter);
            curPlayer.power = powerBar.power;
            $.ajax(baseUrl+'/update',{
                data: {
                    power: powerBar.power,
                    p1: p1 ? 1 : 0,
                    pairNum: pairNum
                },
                success: function ( data ) {
                    console.log(data);
                },
                error: function (  ) {
                    console.log('ajax error!');
                }
            });
            getData().then(function (  ) {
                powerBar.power = 0;
                curPlayer.attack(anoPlayer.x, anoPlayer);
                anoPlayer.attack(curPlayer.x, curPlayer);
            });
        });

        var draw = function (  ) {
            ctx.clearRect(0, 0, 1000, 1000);

            player1.draw(ctx);
            player2.draw(ctx);

            background.draw(ctx);

            hpBar1.draw(ctx);
            hpBar2.draw(ctx);

            text1.draw(ctx);
            text2.draw(ctx);

            powerBar.draw(ctx);

            if(!ifCanStart){
                waiting.draw(ctx);
            }

            hpBar1.update(player1.hp);
            hpBar2.update(player2.hp);

            if(player2.attacking && player1.attacking && Math.abs(player1.waveX - player2.waveX) < 10){
                if(player1.power > player2.power){
                    player1.power -= player2.power;
                    player2.power = 0;
                } else{
                    player2.power -= player1.power;
                    player1.power = 0;
                }
            }
        };

        function getName(  ) {
            var player = JSON.parse(localStorage.getItem('player')),
                defer = $.Deferred();

            var prom = function (  ) {
                var text = prompt("please enter your name:", "");

                return text;
            };
            while(!(name = prom())){
            }
            defer.resolve();
            return defer;
        }

        var waiting = {
            updateReduce: 20,
            updateInter: 20,
            text: 'waiting for another player',
            pointNum: 0,
            draw: function ( ctx ) {
                var width = ctx.canvas.width,
                    height = ctx.canvas.height,
                    str = '';
                for(var i = 0; i < this.pointNum; i++){
                    str += '.';
                }
                this.updateReduce--;
                if(this.updateReduce <= 0){
                    this.updateReduce = this.updateInter;
                    this.pointNum++;

                    if(this.pointNum > 3){
                        this.pointNum = 0;
                    }
                }
                str = this.text + str;
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.textAlign = 'center';
                ctx.font = width / 30 + 'px ' + 'Tahoma Arial';
                ctx.fillText(str, 0, 0);
                ctx.restore();
            }

        };

        var canStart = function (  ) {
            var defer = $.Deferred();

            var b = window.setInterval(function (  ) {
                $.ajax(baseUrl + '/canStart', {
                    data: {
                        p1: p1 ? 1 : 0,
                        pairNum: pairNum
                    },
                    timeout: 2000,
                    success: function ( data ) {
                        data = JSON.parse(data);
                        if(data.state === 'yes'){
                            defer.resolve(1);
                            ifCanStart = true;
                            anoPlayer.name = data.anoPlayerName;
                            window.clearInterval(b);
                            if(text1.text){
                                text2.text = anoPlayer.name;
                                text2.x = width - nameFontSize * anoPlayer.name.length - 10;
                            } else{
                                text1.text = anoPlayer.name;
                                text1.x = 10;
                            }
                        }
                    }, error: function (  ) {
                        window.clearInterval(b);
                        console.log("error");
                    }
                })
            }, 1500);
        };

        var getData = function (  ) {
            var defer = $.Deferred();

            var b = window.setInterval(function(){
                $.ajax(baseUrl+'/getData', {
                    data: {
                        p1: p1 ? 0 : 1,
                        pairNum: pairNum
                    },
                    timeout: 2000,
                    success: function ( data ) {
                        if(data === 'no-update'){

                        } else{
                            anoPlayer.power = data;
                            window.clearInterval(b);
                            defer.resolve();
                        }
                    }
                });
            }, 1500);

            return defer;
        }
});