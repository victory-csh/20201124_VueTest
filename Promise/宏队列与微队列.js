/* 宏队列：dom事件回调 、ajax回调、定时器回调
微队列：promise回调、mutation回调
微队列的回调优先级高于宏队列，一旦微队列里有元素一定要执行完才会去执行宏队列里的*/
//面试题
setTimeout(() => {
    console.log("0");
}, 0)
new Promise((resolve, reject) => {
    console.log("1")
    resolve()
}).then(() => {
    console.log("2")//因为上面有resolve，它才被放到微队列里面
    new Promise((resolve, reject) => {//要等上面的console执行完毕才会开始new
            console.log("3")
            resolve()
        }).then(() => {
            console.log("4")
        }).then(() => {
            console.log("5")//要等上面的log4执行完它才会被放进微队里面
        })
    }).then(() => {
            console.log("6")//要等上面的.then（console.log("2")的执行完才执行,而标志它执行完的是它里面的newpromise和then执行完
        });

//宏队列：0 
//微队列：   6 5
//1 7 2 3 8 4 6 5
new Promise((resolve,reject)=>{
    console.log("7")
    resolve()
}).then(()=>{
    console.log("8")
}) 

