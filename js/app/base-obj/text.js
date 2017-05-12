/**
 * Created by lzh on 2017/3/8.
 */

define(['graph', 'util'], function ( Graph, util ) {
    'use strict';
    function Text( text ) {
        Graph.apply(this, arguments);

        this.fontSize = '20';
        this.fontFamily = 'Tahoma Arial';
        this.textAlign = 'center';
        this.color = '#444';
        this.text = text || '';
        this.scale = 1;
        this.rotate = 0;
        this.dAng = 0;
        this.x = 0;
        this.y = 0;
    }

    Text.prototype = util.copy(Graph.prototype);
    Text.prototype.constructor = Text;
    Text.prototype.getFont = function (  ) {
        return this.fontSize + 'px' + ' ' + this.fontFamily;
    };
    Text.prototype.draw = function ( context ) {
        var text = this;
        context.save();
        context.fillStyle = text.color;
        context.textAlign = text.textAlign;
        context.translate(text.x, text.y);
        context.rotate(text.rotate);
        context.scale(text.scale, text.scale);
        context.font = text.getFont();
        context.fillText(text.text, 0, 0);
        context.restore();
    };
    Text.prototype.isInBound = function ( context ) {
        var width = context.canvas.width,
            height = context.canvas.height,
            text = this;
        return text.x <= width && text.x >= 0 && text.y >= 0 && text.y <= height;
    };

    return Text;
});