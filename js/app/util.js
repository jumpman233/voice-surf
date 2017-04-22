/**
 * Created by lzh on 2017/2/28.
 */

define([],function () {
    'use strict';
    /**
     * GameUtil
     */
    function GameUtil(){

    }
    GameUtil.prototype = {
        copy: function (obj) {
            var util = this;

            if(obj == undefined) return;
            if(Array.isArray(obj) && obj) {
                var list = [];
                for(var i in obj){
                    list.push(util.copy(obj[i]));
                }
                return list;
            } else if(typeof obj == 'object'){
                var newObj = new Object();
                if(obj && obj.clone){
                    return obj.clone();
                }
                for(var i in obj){
                    if(obj[i] instanceof HTMLElement || obj[i] == Object.getPrototypeOf(obj)[i]){
                        newObj[i] = obj[i];
                    } else{
                        newObj[i] = util.copy(obj[i]);
                    }
                }
                return newObj;
            }
            else {
                return obj;
            }
        }
    };
    return new GameUtil();
});
