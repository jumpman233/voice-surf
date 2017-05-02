/**
 * Created by lzh on 2017/4/22.
 */

define(['rect'], function ( Rect ) {
    function PowerBar(  ) {
        this.power = 0;

        this.powerRect = new Rect;
        this.powerRect.border = false;
        this.bkRect = new Rect;

        this.gradiant = null;
    }
    PowerBar.prototype = {
        constructor: PowerBar,
        init: function ( x, y ) {
            this.power = 100;

            this.powerRect.height = 80 - 2;
            this.powerRect.width = 30 - 2;
            this.powerRect.x = x + 1;
            this.powerRect.y = y + 1;

            this.bkRect.x = x;
            this.bkRect.y = y;
            this.bkRect.height = 200;
            this.bkRect.width = 30;
        },
        update: function ( power ) {
            this.power = power;
        },
        draw: function ( ctx ) {
            if(!this.gradiant){
                this.gradiant = ctx.createLinearGradient(0, this.powerRect.height, 0, 0);
                this.gradiant.addColorStop(0, 'rgb(255, 0, 0)');
                this.gradiant.addColorStop(0.3, 'rgb(0, 255, 0)');
                this.gradiant.addColorStop(1, 'rgb(0, 0, 255)');
                this.bkRect.fillStyle = this.gradiant;
            }
            this.powerRect.height = this.bkRect.height * (100 - this.power) / 100;
            this.bkRect.draw(ctx);
            this.powerRect.draw(ctx);
        },
        getSpeed: function (  ) {
            return this.power / 10 < 1 ? 1 : this.power / 10;
        }
    };

    return PowerBar;
});