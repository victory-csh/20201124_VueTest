/*自定义promise*/
(function (window) {
/*} catch (error) {//执行器执行出错，当前promise变为失败


    reject(error);

}*/
    const PENDING = 'padding';//未确定状态
    const RESOLVED = 'resolved';//成功状态
    const REJECTED = 'rejected';//失败状态
    /*Promise模块*/
    function Promise(excutor) {
        const self = this;//代表Promise的实例


        /*添加一个状态属性，最初为未确定状态（padding）*/
        self.status = PENDING;
        self.data = undefined;//成功后的value以及失败后的reason是不确定的
        self.callbacks = [];//里面放的东西是 {onResolved(){},onReject(){}}



        /*将promise状态改为成功，指定成功的值为value*/
        function resolve(value) {
            /*改状态之前要保证当前为padding状态，以免用户在new的时候调用了两次状态改变*/
            if (self.status !== PENDING) {
                return
            }
            self.status = RESOLVED;
            self.data = value;

            //调用所有缓存的待执行成功的回调函数
            if (self.callbacks !== 0) {

                self.callbacks.forEach(cbsObj => {
                    cbsObj.onResolved(value)
                })
            }


        }

        /*加个promise状态改为失败，指定失败的原因为reason*/
        function reject(reason) {

            /*改状态之前要保证当前为padding状态，以免用户在new的时候调用了两次状态改变*/
            if (self.status !== PENDING) {
                return
            }

            self.status = REJECTED;
            self.data = reason;

            /* //setTimeout是为了实现异步调用，()=>{
                self.callbacks.forEach(cbsObj=>{
                    cbsObj.onRejected(reason)
                }),会被放进队列里*/
            if (self.callbacks !== 0) {
                setTimeout(() => {
                    self.callbacks.forEach(cbsObj => {
                        cbsObj.onRejected(reason)
                    })
                })


            }



        }


        /* /!*调用excutor启动异步任务*!/*/

            excutor(resolve, reject)



    }

    /*用来指定成功、失败回调函数的方法
    * 1）、如果当前promise是resolved，异步执行成功的回调函数onResolved
    * 2）、如果当前promise是rejected，异步执行失败的回调函数onRejected
    * 3）、如果当前promise是pendding，保存回调函数就行啦
    * 执行完以上on的回调函数会返回一个promise对象
    * 它的结果状态由onResolved和onRejected执行的结果钢决定
    *  2.1）、抛出error==》变为rejected，结果为error
    *  2.2）、返回值不是promise==》变为resolved，结果值为返回值
    *  2.3)、返回值是promise===》由这个promise的决定新的promise的结果（成功、失败）
    * */
    Promise.prototype.then = function (onResolved, onRejected) {


     /*   self.callbacks.push({onRejected,onResolved});*/


        const self = this;
        onResolved=typeof onResolved==='function'?onResolved:value=>value;//如果没有定义该函数，这里是不打印但是将值value向下传递
         onRejected=typeof onRejected==='function'?onRejected:reason=>{throw  reason};//若没有写错误函数，我们这里帮它写了，没有打印但是将错误的原因向下传递了
         //返回一个新的promise对象
      return    new Promise((resolve, reject) => {


             if (self.status === RESOLVED) {
              setTimeout(() => {
                     try {
                         const result = onResolved(self.data);
                         if (result instanceof Promise) {//返回值是promise===》由这个promise的决定新的promise的结果（成功、失败）

                             result.then(//相当于又回到了then(onResolved, onRejected),但是现在调用then的是result，且参数是 value=>{resolve(value)}, reason=>{reject(reason)}

                                 value => {
                                     resolve(value)
                                 },
                                 reason => {
                                     reject(reason)
                                 }//简化写法 result.then(resolve,reject),因为进入到resolve里面成功的value会在HTML页面就传递给resolve作为参数，进而会把self.data、status等属性重新重新赋值，在进入到then中进行判断
                             )

                         } else {//  2.2）、返回值不是promise==》变为resolved，结果值为返回值
                             resolve(result);

                         }
                     } catch (error) {
                         reject(error)//2.1）、抛出error==》变为rejected，结果为error
                     }
               })


             } else if (self.status === REJECTED) {
                 setTimeout(() => {
                     try {
                         const result = onRejected(self.data);
                         if (result instanceof Promise) {//返回值是promise===》由这个promise的决定新的promise的结果（成功、失败）

                             result.then(//相当于又回到了then(onResolved, onRejected),但是现在调用then的是result，且参数是 value=>{resolve(value)}, reason=>{reject(reason)}

                                 value => {
                                     resolve(value)
                                 },
                                 reason => {
                                     reject(reason)
                                 }//简化写法 result.then(resolve,reject),因为进入到resolve里面成功的value会在HTML页面就传递给resolve作为参数，进而会把self.data、status等属性重新重新赋值，在进入到then中进行判断
                             )

                         } else {//  2.2）、返回值不是promise==》变为resolved，结果值为返回值
                             resolve(result);

                         }
                     } catch (error) {
                         reject(error);//2.1）、抛出error==》变为rejected，结果为error

                     }
                 })

             } else {//PENDING状态

                 self.callbacks.push({
                     onResolved(value) {
                         try {
                             console.log('!!!');
                             const result = onResolved(self.data);
                             if (result instanceof Promise) {//返回值是promise===》由这个promise的决定新的promise的结果（成功、失败）

                                 result.then(//相当于又回到了then(onResolved, onRejected),但是现在调用then的是result，且参数是 value=>{resolve(value)}, reason=>{reject(reason)}

                                     value => {
                                         resolve(value)
                                     },
                                     reason => {
                                         reject(reason)
                                     }//简化写法 result.then(resolve,reject),因为进入到resolve里面成功的value会在HTML页面就传递给resolve作为参数，进而会把self.data、status等属性重新重新赋值，在进入到then中进行判断
                                 )

                             } else {//  2.2）、返回值不是promise==》变为resolved，结果值为返回值
                                 resolve(result);

                             }
                         } catch (error) {
                             reject(error)//2.1）、抛出error==》变为rejected，结果为error
                         }
                     }
                     , onRejected(reason) {
                         try {
                             const result = onRejected(self.data);
                             if (result instanceof Promise) {//返回值是promise===》由这个promise的决定新的promise的结果（成功、失败）

                                 result.then(//相当于又回到了then(onResolved, onRejected),但是现在调用then的是result，且参数是 value=>{resolve(value)}, reason=>{reject(reason)}

                                     value => {
                                         resolve(value)
                                     },
                                     reason => {
                                         reject(reason)
                                     }//简化写法 result.then(resolve,reject),因为进入到resolve里面成功的value会在HTML页面就传递给resolve作为参数，进而会把self.data、status等属性重新重新赋值，在进入到then中进行判断
                                 )

                             } else {//  2.2）、返回值不是promise==》变为resolved，结果值为返回值
                                 resolve(result);

                             }
                         } catch (error) {
                             reject(error)//2.1）、抛出error==》变为rejected，结果为error
                         }
                     }
                 })

             }


         })

    };


  //专门的失败的回调方法
    Promise.prototype.catch = function (onRejected) {
        return this.then(undefined,onRejected);

    };
    //promise的几个静态的方法:
    //返回一个指定value的成功的promise
    Promise.resolve = function (value) {

    };
    //返回一个指定reason的失败的promise
    Promise.reject = function (reason) {

    };
    //返回一个promise，只有当数组中的所有promise都成功了才成功，只要数组中有失败的则整个promise都失败
    Promise.all = function (promises) {

    };
    //返回一个promise，数组中的所有promise执行最快订单那个被返回
    Promise.race = function (promises) {

    };

    /*向外暴露promise*/
    window.Promise = Promise;

})(window);

