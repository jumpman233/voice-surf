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
        'background': 'app/game-obj/background'
    }
});
var curPlayer, anoPlayer, players = [], pairNum, p1;

function change(  ) {
    var a = curPlayer;
    curPlayer = anoPlayer;
    anoPlayer = a;
}

require(['jquery', 'PowerBar', 'HpBar', 'Player', 'background'],
    function ($, PowerBar, HpBar, Player, background) {
        var ctx = document.getElementById('canvas').getContext('2d');
        var newBar = new PowerBar();
        var hpBar1 = new HpBar(),
            hpBar2 = new HpBar(),
            player1 = new Player('p1'),
            player2 = new Player('p2'),
            width = ctx.canvas.width,
            height = ctx.canvas.height,
            playerWidth = width / 10,
            playerHeight = width / 10,
            playerY = height / 4 * 3 - 5;

        players.push(player1);
        players.push(player2);

        hpBar1.init(10, 30, width / 5 * 2, 30);
        hpBar2.init(width / 5 * 3 - 10, 30, width / 5 * 2, 30);
        newBar.init(10, height / 5);
        background.init(width, height);

        $.ajax('http://192.168.25.204:3000/getPlayer', {
            success: function ( data ) {
                data = JSON.parse(data);
                pairNum = data.pairNum;
                if(data.player === 'p1'){
                    curPlayer = player1;
                    anoPlayer = player2;
                    p1 = true;
                } else{
                    curPlayer = player2;
                    anoPlayer = player1;
                    p1 = false;
                }
                console.log(p1);
            }
        }).then(function (  ) {
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

        newBar.update(0);

        var d = 3;
        function add(  ) {
            var d = newBar.getSpeed();
            if(newBar.power > 100 || newBar.power < 0){
                d = -d;
            }
            newBar.power += d;
        }
        var a;
        document.addEventListener('mousedown', function (  ) {
            a = window.setInterval(add, 50);
        });
        document.addEventListener('mouseup', function (  ) {
            window.clearInterval(a);
            curPlayer.power = newBar.power;
            $.ajax('http://192.168.25.204:3000/update',{
                data: {
                    power: newBar.power,
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

            newBar.draw(ctx);

            hpBar1.update(player1.hp);
            hpBar2.update(player2.hp);
        };

        var getData = function (  ) {
            var defer = $.Deferred();

            $.ajax('http://192.168.25.204:3000/getData', {
                data: {
                    p1: p1 ? 0 : 1,
                    pairNum: pairNum
                },
                timeout: 60000,
                success: function ( data ) {
                    if(data === 'no-update'){
                        window.setTimeout(getData, 1000);
                    } else{
                        anoPlayer.power = data;
                        console.log(anoPlayer);
                        console.log(curPlayer);
                        defer.resolve();
                    }
                },
                error: function (  ) {
                    console.log('ajax error!');
                }
            });

            return defer;
        }
});