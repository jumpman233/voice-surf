/**
 * Created by lzh on 2017/5/2.
 */

define([], function (  ) {
    var width,
        height,
        y = 0;

    var init = function ( w, h ) {
        width = w;
        height = h;

        y = height / 4 * 3;
    };

    var draw = function ( ctx ) {
        ctx.save();
        ctx.fillStyle = '#5A7C97';
        ctx.fillRect(0, y, width, height / 2);
        ctx.restore();
    };

    return {
        init: init,
        draw: draw
    };
});