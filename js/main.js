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
        'HpBar': 'app/game-obj/hp-bar'
    }
});

require(['HpBar'],function (HpBar) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var newBar = new HpBar();
    newBar.init(50, 50);
    newBar.reduce(20);
    newBar.draw(ctx);
});