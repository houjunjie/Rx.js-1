# Rx.js 
__基于^4.1.0版本__

[rx-book](http://xgrommx.github.io/rx-book/why_rx.html)

[API文档-Rx](http://reactivex.io/documentation/observable.html)

[API宝珠图](http://rxmarbles.com/)

##Creating Observables

####Rx.Observable.create(f())

**创建一个自定义的流,返回值(return)为缺省,可以是一个函数或者一个Disposable.函数回调参数obs有3个方法onNext,onError和onCompleted**

```javascript
let source = Rx.Observable.create((obs) => {
    obs.onNext(42);
    obs.onCompleted();
    // return ()=>{}
    return Rx.Disposable.create(()=>{
        console.log('fin');
    })
}).subscribe(
    (x) => {
        console.log(x);
    }
);
```
---
####Rx.Observable.generate(iterate,f(x),f(x),f(x))

**创建一个generate的流,第一个参数为初始值,第二个参数为判断条件,第三个参数为当前item的操作,第四个参数为返回**

```javascript
var source = Rx.Observable.generate(
    4,
    function (x) { return x < 7; },
    function (x) { return x + 1; },
    function (x) { return x; }
)
.subscribe(
    (x) => {
        console.log(x);   //4, 5, 6 
    }
);
```
---

####Rx.Observable.defer(f())

**需要在回调函数里面返回一个流,在defer里面的方法会在subscribe之后定义**

```JavaScript 
console.log(1);
var source = Rx.Observable.defer(() => {
    console.log(2);
    return Rx.Observable.return('boom');
});
console.log(3);
let go = source.subscribe(
    (x) => {
        console.log(4);
        console.log(x);
    }
);
console.log(5);       //顺序 1,3,2,4,boom,5
```
---

####Rx.Observable.if(f():true|flase,x::steam[,y::steam])

**第一个参数函数返回判断条件,根据前面的返回,判断是执行后面的哪个流,true=>x(),false=>y()**

```JavaScript 
let _b = true;
let source = Rx.Observable.if(
    function () { return _b; },
    Rx.Observable.return('对的'),
    Rx.Observable.return('错了')
).subscribe(
    (x) => {
        console.log(x);  //对的
    }
);
```
---

####Rx.Observable.case(f(name),sources::{steam}[,Defaults::Rx.Observable.empty()])

**选择流对象里面对应的流**

```JavaScript 
let sources = {
    l3ve: Rx.Observable.just('l3ve'),
    zwei: Rx.Observable.just('zwei')
};
//f为选择器函数,返回一个字符串,Defaults为选择器返回无法匹配时的默认对象
let subscription = Rx.Observable.case(() => "l3ve", sources, Rx.Observable.empty());

subscription.subscribe(function (x) {
    console.log(x)
});
```
---

####Rx.Observable.empty()
**创建一个空的流,但是会正常结束**

####Rx.Observable.never()
**创建一个空的流,但是不会结束**

####Rx.Observable.throw(error::object)

**创建一个错误流,传入的参数必须输Error类**

```JavaScript 
let empty = Rx.Observable.empty().subscribe(
    (x) => {
        console.log(x);
    }
);
let never = Rx.Observable.never().subscribe(
    (x) => {
        console.log(x);
    }
);
let throwError = Rx.Observable.return(42)
    .selectMany(
        Rx.Observable.throw(new Error('error!'))
    )
    .subscribe(
   	 	(x) => {
       	console.log(x);
    	}
    );
```

##From Observables

####Rx.Observable.from(string||array||object(.length)||set||map[,selector::function])
**遍历参数所有项**

```JavaScript
Rx.Observable.from({length:5},(x,y)=>{return y; }).subscribe(
    (x)=>{
        console.log(x); //0,1,2,3,4
    }
)
```

##fuck Observables


####Rx.Observable.amb(x::steam,y::steam)

**优先选择有返回值的流**

```javascript
let source = Rx.Observable.amb(
    Rx.Observable.fromEvent(Button, 'click').map(() => 'one'),
    Rx.Observable.fromEvent(Button2, 'click').map(() => 'two')
);
let subscription = source.subscribe(
    (x) => {
        console.log(x);//先点击button则只会输出one
    }
);
```
---

####Rx.Observable.combineLatest(x::steam,y::steam,f(xv,yv))
    
**返回2个流各自最新的值(流有返回的时候触发,第一次必须2个流都有返回)**

```javascript
let num = ["1", "2", "3"];
let string = ["a", "b", "c", "d", "e", "f"];
let source1 = Rx.Observable.interval(2000) //延迟2s
    .map(() => num.pop());
let source2 = Rx.Observable.interval(1000) //延迟1s
    .map(() => string.pop());

let combined = Rx.Observable.combineLatest(source1, source2, function (x, y) {
    return x + "-" + y;
}).take(8);//执行8次

combined.subscribe((comb) => console.log(comb));
//3-f 3-e 3-d 2-d 2-c 2-b 1-b 1-a
```
---
####Rx.Observable.reduce(f(x,y))
    
**与[Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)功能一样**

```JavaScript
let source = Rx.Observable.range(0,4).reduce((x,y)=>{  
                         //range:从0开始输出4个数 这里即输出0,1,2,3
    console.log(x,y);  0,1   1,2   3,3
    return x+y;         1     3     6
})
.subscribe(
    (x)=>{
        console.log('fin:',x);  fin:6
    }
)
```
---
####Rx.Observable.every(f(x))
**遍历所有,返回`true`||`false`**
####Rx.Observable.indeOf(x)
**与[Array.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)相同,遍历所有查询,返回`true`||`false`**
####Rx.Observable. findIndex(f(x))
**与[Array.prototype.findIndex()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)相同,查询指定条件元素的索引**

```javascript
let source = Rx.Observable.of(1, 2, 3, 4, 5)
    .every(function (x) {
        return x < 6;
	 })
	.subscribe(
    	(x) => { console.log(x); } //true
	)

let source = Rx.Observable.of(1,'b','2',4)
    .indexOf('b')
    .subscribe(
        (x) => { console.log(x); //true
        }
    );
    
    
let source = Rx.Observable.of(1,'b','2',4)
    .findIndex((item)=>{
        return item == 'b';
    })
    .subscribe(
        (x) => { console.log(x);  //1
        }
    );
```
