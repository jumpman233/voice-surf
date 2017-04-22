/**
 * Created by lzh on 2017/3/8.
 */

define(['graph', 'util'], function ( Graph, util ) {
    'use strict';
    function Rect(  ) {
        Graph.apply(this, arguments);
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
        this.fillColor = '#fff';
        this.strokeColor = '#333';
        this.fillStyle = null;
        this.scale = 1;
        this.rotate = 0;

        this.border = true;
    }
    Rect.prototype = util.copy(Graph.prototype);
    Rect.prototype.constructor= Rect;
    Rect.prototype.draw= function ( ctx ) {
        var rect = this;
        ctx.save();
        ctx.translate(rect.x, rect.y);
        if(this.fillStyle){
            ctx.fillStyle = rect.fillStyle;
        } else{
            ctx.fillStyle = rect.fillColor;
        }
        if(rect.border){
            ctx.strokeStyle = rect.strokeColor;
        }

        ctx.shadowColor = "#333"; // string
        ctx.scale(rect.scale, rect.scale);
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.strokeRect(0, 0, rect.width, rect.height);
        ctx.restore();
    };
    Rect.prototype.isInBound= function ( ctx ) {
        var rect = this,
            width = ctx.canvas.width,
            height = ctx.canvas.height;
        return rect.x >= 0 && rect.x + rect.width <= width &&
                rect.y >= 0 && rect.y + rect.height <= height
    };
    Rect.prototype.isInclude= function ( x, y ) {
        if(typeof x !== 'number' || typeof y !== 'number'){
            throw TypeError('Rect inInclude(): params are not right!');
        }
        var rect = this;
        return rect.x <= x && rect.x + rect.width >= x &&
                rect.y <= y && rect.y + rect.height >= y;
    };

    return Rect;
});