/*自调用函数，会开启新的局部作用域，可以防止命名冲突*/
(function () {

    var  position='absolute';
    var elements=[];/*记录之前创建的蛇，有助于移除*/

    function Snake(options) {
        options=options||{};
        //蛇节的大小
        this.width=options.width||20;
        this.height=options.height||20;

        /*蛇移动的方向*/
        this.direction=options.direction||'right';
        /* 蛇的身体（蛇节）第一个元素是蛇头*/
        this.body=[{x:3,y:2,color:'red'},
            {x:2,y:2,color:'blue'},
            {x:1,y:2,color:'blue'}];

        /*在重新渲染前应该删除前面渲染的那条蛇，不然蛇身就边长*/

    }

    Snake.prototype.render = function (map) {
        /*在重新渲染前，应该移除之前的那条蛇,调用remove 函数*/
        remove();
        /*把每个蛇节渲染到地图上*/
        for (var  i=0,len=this.body.length;i<len;i++){
            var object=this.body[i];
            var  div=document.createElement('div');
            map.appendChild(div);
            /*记录下来传递给数组*/
            elements.push(div);
            div.style.position=position;/*脱离文档流*/
            div.style.width=this.width+'px';
            div.style.height=this.height+'px';
            /*以下是设置的是蛇身体对象的属性*/
            div.style.left=object.x*this.width+'px';
            div.style.top=object.y*this.height+'px';
            div.style.backgroundColor=object.color;

        }

    }
    /*私有的成员,外部访问不了*/
    function remove() {
        for(var i=elements.length-1;i>=0;i--){
            /*删除页面中的div*/
            elements[i].parentNode.removeChild(elements[i]);
            /*删除数组中的元素*/
            elements.splice(i,1);
        }

    }

    /*控制蛇移动的方法*/
    Snake.prototype.move=function (food,map) {

        /*控制蛇的身体移动（当前蛇节 到 上一个蛇节的位置,跟着上一蛇节就就对了）*/
        for (var  i=this.body.length-1;i>0;i--){

            this.body[i].x=this.body[i-1].x;
            this.body[i].y=this.body[i-1].y;
        }
        /*控制蛇头移动*/
        /*1、判断蛇移动的方向*/
        var head=this.body[0];
        switch (this.direction){
            case  'right':
                head.x+=1;
                break;
            case 'left':
                head.x-=1;
                break;
            case  'top':
                head.y-=1;
                break;
            case  'bottom':
                head.y+=1;
                break;


        }
        /*判断蛇头是否和食物的坐标重叠了，是则要蛇身变长*/
        var  headX=head.x*this.width;
        var  headY=head.y*this.height;
        if(headX===food.x&&headY===food.y){
            /*吃到了食物，要让蛇节长长一节，并且在地图上重新生成食物*/
            /*获取蛇的最后一节*/
            var  last=this.body[this.body.length-1];
            /*this.body.push({
               x:last.x,
               y:last.y,
                color:last.color
            });*/

            /*代替以上代码，因为obj继承了last所有属性，所以直接把obj  push进body就是一样的，
            * 而且方便许多*/
            var  obj={};
            extend(last,obj);
            this.body.push(obj);
            food.render(map);/*增长后重新渲染*/



        }
    }
    /*暴露构造函数给外部*/
    window.Snake=Snake;
})();
/*测试*/
/*
var map=document.getElementById('map');
var snake=new Snake();
snake.render(map);*/
