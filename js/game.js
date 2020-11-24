/*使用自调用，防止作用变量冲突*/
(function () {
    /*记录游戏对象*/
    var that;

    function  Game(map) {
        this.food=new  Food();
        this.snake=new Snake();
        this.map=map;
        that=this;/*//that就是游戏对象，获取到游戏对象就能获取到蛇对象和食物对象了，
        // 而且that有是window下的对象，在定时器里可以调用得到*/

       }
    Game.prototype.start=function () {
        /*1、把蛇和食物渲染到地图*/
        this.food.render(this.map);
        this.snake.render(this.map);
        runSnake();
        bindKey();

  /*    2、游戏的逻辑*/




    };
    /*私有的函数，游戏一开始时，让蛇移动起来，开启定时器,并且当蛇遇到边界，整个游戏结束*/
    //2.1游戏一开始时，让蛇移动起来
    function runSnake() {
        var  timerId=setInterval(function () {
           /*每隔150ms让蛇走一格,获取游戏对象中的蛇属性*/
           this.snake.move(that.food,that.map);//传进food对象用于判断是否吃到了食物了
           this.snake.render(that.map);


           /*获取蛇头坐标*/
           var  headX=this.snake.body[0].x;
           var  headY=this.snake.body[0].y;
           var  maxX=this.map.offsetWidth/this.snake.width;
           var maxY=this.map.offsetHeight/this.snake.height;
            /*当蛇移动过程中是否遇到了边界，遇到就结束游戏*/
           if (headX<0||headX>=maxX){
               alert('Game Over!');
               clearInterval(timerId);

           }
            if (headY<0||headY>=maxY){
                alert('Game Over!');
                clearInterval(timerId);

            }

        }.bind(that),150)/*bind(that)，把runsnake的this指向了that而不是window了*/

    }
    // 2.2、通过键盘控制蛇移动的方向
    function bindKey() {
        /* document.onkeydown=function () {}-----注册事件的方法之一*/
        document.addEventListener('keydown',function (e) {
            /*键值:
            37-left
            * 38-top
            * 39-right
            * 40-bottom
            * */
            switch (e.keyCode){
                case 37:
                    this.snake.direction='left';
                    break;
                case 39:
                    this.snake.direction='right';
                    break;
                case 38:
                    this.snake.direction='top';
                    break;
                case  40:
                    this.snake.direction='bottom'
                    break;

            }

        }.bind(that),false);

    }
    //2.3、当蛇遇到食物，做相应的处理

    /*暴露构造函数给外部*/
    window.Game=Game;

})();

var  map=document.getElementById('map');
var  game=new Game(map);
game.statr();