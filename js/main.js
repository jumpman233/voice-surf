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
        'PowerBar': 'app/game-obj/PowerBar'
    }
});

require(['PowerBar'],function (PowerBar) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var newBar = new PowerBar();
    newBar.init(100, 100);
    newBar.update(0);
    var d = 3;
    function add(  ) {
        newBar.power += d;
        if(newBar.power >= 100 || newBar.power <= 0){
            d = -d;
        }
        ctx.clearRect(0, 0, 1000, 1000);
        newBar.draw(ctx);
    }
    var a;
    document.addEventListener('mousedown', function (  ) {
        a = window.setInterval(add, 50);
    });
    document.addEventListener('mouseup', function (  ) {
        console.log("!!");
        window.clearInterval(a);
    });
    newBar.draw(ctx);
});