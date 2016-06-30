# Rx.js 
__基于^4.1.0版本__

[rx-book](http://xgrommx.github.io/rx-book/why_rx.html)

[API文档-Rx](http://reactivex.io/documentation/observable.html)

[API宝珠图](http://rxmarbles.com/)

##Creating Observables

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

##

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
