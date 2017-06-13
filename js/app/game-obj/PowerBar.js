/**
 * Created by lzh on 2017/4/22.
 */

define(['rect'], function ( Rect ) {
    function PowerBar(  ) {
        this.power = 0;
        this.dir = 1;

        this.powerRect = new Rect;
        this.powerRect.border = false;
        this.bkRect = new Rect;

        this.gradiant = null;
    }
    PowerBar.prototype = {
        constructor: PowerBar,
        init: function ( x, y ) {
            this.power = 0;

            this.powerRect.height = 80 - 2;
            this.powerRect.width = 30 - 2;
            this.powerRect.x = x + 1;
            this.powerRect.y = y + 1;

            this.bkRect.x = x;
            this.bkRect.y = y;
            this.bkRect.height = 200;
            this.bkRect.width = 30;
        },
        update: function ( ) {
            this.power += this.getSpeed();
            if(this.power >= 100){
                this.power = 100;
                this.dir = -1;
            } else if(this.power <= 0){
                this.power = 0;
                this.dir = 1;
            } else {
            }
        },
        getDirection: function (  ) {
            return this.dir;
        },
        draw: function ( ctx ) {
            ctx.save();
            if(!this.gradiant){
                this.gradiant = ctx.createLinearGradient(0, this.bkRect.height, 0, 0);
                this.gradiant.addColorStop(0, 'rgb(255, 255, 255)');
                this.gradiant.addColorStop(1, '#5A7C97');
                this.bkRect.fillStyle = this.gradiant;
            }
            this.powerRect.height = this.bkRect.height * (100 - this.power) / 100;
            this.bkRect.draw(ctx);
            this.powerRect.draw(ctx);
            ctx.restore();
        },
        getSpeed: function (  ) {
            return Math.log(this.power + Math.E) < 1 ? 1 : Math.log(this.power + Math.E) * this.dir / 1.5;
        },
        reset: function (  ) {
            this.power = 0;
        }
    };

    return PowerBar;
});