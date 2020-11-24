/*自调用函数--开启一个新的作用域，避免全局函数、变量的命名冲突,因为怕其他js文件也有同样的命名,若用自调用函数，则开启了新的作用域，
相当于自调用函数是一个局部作用域，在它里面的变量都是局部变量*/
(function () {

    //动态产生DIV，也就是页面上的食物
    var  div=document.createElement('div');
    /*记录上一次创建的食物，为删除做准备,把食物记录到elements数组中*/
    var  elements=[];
    function  Food(options) {//options是传进来的对象

        options=options||{};//在Food中，options属性是传进来的对象，若没有传进来，则认为是空对象
        this.x=options.x||0;
        this.y=options.y||0;
        this.width=options.width||20;
        this.height=options.height||20;

        this.color=options.color||'green';

    }
    var  position='absolute';/*不要把定位写死，应该写成变量方便后期改*/
    /*让食物构造函数也就是食物对象具有一个render方法,在它的原型链上,该方法是把食物渲染到map上*/
    Food.prototype.render=function (map) {//map是食物的父容器，需要传进来，食物的div就在该父容器上
        /*删除之前创建的食物，在elements里找要删除的食物*/
        remove();

        /*s随机设置x和y的值*/
        this.x=Tools.getRandom(0,map.offsetWidth/this.width-1)*this.width;
        this.y=Tools.getRandom(0,map.offsetHeight/this.height-1)*this.height;



        map.appendChild(div);

        elements.push(div);/*把食物记录到elements数组中*!/*/

        /*设置div的样式*/
        div.style.position=position;
        div.style.left=this.x+'px';
        div.style.top=this.y+'px';
        div.style.width=this.width+'px';
        div.style.height=this.height+'px';
        div.style.backgroundColor=this.color;

    };
    function  remove() {

        /*  -----从序号大的开会删除*/
        for (var  i=elements.length-1;i>=0;i--){
            elements[i].parentNode.removeChild(elements[i]);//删除页面上的元素
            elements.splice(i,1);/*删除数组中的元素----第一参数从哪个元素开始删除，删除几个元素*/
        }

    }
    /*让Food构造函数再外部可以访问，不止是在局部匿名函数里*/
    window.Food=Food;
})();





/*测试*/
/*
var  map=document.getElementById('map');/!*获取父容器*!/
var  food=new Food();//window省略了，其实可以写成  var  food=new window.Food();
food.render(map);*/
