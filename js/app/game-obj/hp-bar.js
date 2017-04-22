/**
 * Created by lzh on 2017/4/22.
 */

define(['rect'], function ( Rect ) {
    function HpBar (  ) {
        this.hp = 0;
        this.bkRect = new Rect();
        this.hpRect = new Rect();
    }
    HpBar.prototype = {
        constructor: HpBar,
        init: function ( x, y ) {
            this.hp = 100;
            this.bkRect.x = x;
            this.bkRect.y = y;
            this.bkRect.fillColor = 'white';
            this.bkRect.strokeColor = 'black';
            this.bkRect.width = 200;
            this.bkRect.height = 30;

            this.hpRect.x = x + 1;
            this.hpRect.y = y + 1;
            this.hpRect.fillColor = 'red';
            this.hpRect.strokeColor = 'red';
            this.hpRect.width = this.bkRect.width - 2;
            this.hpRect.height = this.bkRect.height - 2;
        },
        update: function ( hp ) {
            this.hp = hp;
        },
        reduce: function ( hp ) {
            this.hp -= hp;
        },
        draw: function ( ctx ) {
            this.hpRect.width = (this.bkRect.width - 2) * this.hp / 100;
            this.bkRect.draw(ctx);
            this.hpRect.draw(ctx);
        }
    };

    return HpBar;
});