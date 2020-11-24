/*生成随机数的模块*/
var  Tools={

    getRandom: function (min,max) {
        return Math.floor(Math.random()*(max-min+1))+min;

    }

}