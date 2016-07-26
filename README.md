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
---
####Rx.Observable.interval(x::Number)

**同setInterval,间隔执行**

```javascript
let source = Rx.Observable
            .interval(1000)
            .subscribe(
                (x) => { console.log(x); } //0   1    2    3    ...
            )
```
---
####Rx.Observable.timer(x::Number[,y::Number])

**延迟执行订阅,第一个参数为延迟的时间,第二个参数的效果与interval类似,为固定间隔触发**

```javascript
let source = Rx.Observable
            .timer(2000,1000)
            .subscribe(
                (x) => { console.log(x); } //0{2s}   1{3s}    2{4s}    3{5s}    ...
            )
```
---
####Rx.Observable.just(x::item)

**同return,直接返回参数,只有触发一次**

```javascript
let source = Rx.Observable.just(42)
            .subscribe(
                (x) => { console.log(x); }  //42
            )
            Rx.Observable.just(42).take(3)
            .subscribe(
                (x) => { console.log(x); }  //也只会输出一个42
            )
```
---
####Rx.Observable.range(x,y::Number)

**生成一个连续的流,返回值从x开始,到x+y-1结束,x会执行+1操作,**

```javascript
Rx.Observable.range(0, 4)
    .subscribe(
        (x) => { console.log(x); }  //0 1 2 3
    )
Rx.Observable.range('a', 4)
	.subscribe(
		(x) => { console.log(x); }  //a0 a1 a2 3
	)
```
---
####Rx.Observable.repeat(x,y::Number)

**生成y次且返回值有x的流**

```javascript
Rx.Observable.repeat(42, 3)
	.subscribe(
	    (x) => { console.log(x); }  //42 42 42 3次
	)
```	
---
####Rx.Observable.doWhile(x,y::Number)
####Rx.Observable.while(true||false,y::stream)
**类似,只是参数不一样**

```javascript
let i = 0;
Rx.Observable.return(42).doWhile(
    (x)=>{ return ++i < 4; })
    .subscribe(
        (x) => { console.log(x); }  //42  42  42  42
    )
Rx.Observable.while(
	   ()=>{ return i++ < 3 },
	   Rx.Observable.return(42)
	)
	.subscribe(
	    (x) => { console.log(x); }   //42  42   42
	)
```	
---
##Transforming Observables
####Rx.Observable.XXXXX().selectMany(f())
**等于可以在流上面做特殊处理,返回一个流||Promise.同flatMap,有缺省的第二个参数函数,接受第一个函数的数组返回,遍历**

```javascript
Rx.Observable
    .range(1, 2)
    .selectMany(function (x) {
        return Rx.Observable.range(x, 2);
    }).subscribe((x) => {
        console.log(x);  //1  2  2  3
    });


//y为第一个函数返回的数组的x与i,所以会返回2次
Rx.Observable.of(1)
    .flatMap(
        function (x, i) {  return [x,i]; },
        function (x, y, ix, iy) { return x + y + ix + iy; }
    ).subscribe((x) => {
        console.log(x);  //2 2
    });
```	
---
####Rx.Observable.XXXXX().flatMapLatest()
**过滤流,返回最后一个**

```javascript
Rx.Observable
    .range(1, 2)
    .flatMapLatest(function (x) {
        return Rx.Observable.range(x, 2);
    }).subscribe((x) => {
        console.log(x);    // 1   2   3
    });
```	
---
####Rx.Observable.XXXXX().flatMapObserver()
**让可以监听状态,去响应onNext,onError,onCompleted**

```javascript
Rx.Observable.range(1, 3)
    .flatMapObserver(
    function (x, i) {
        return Rx.Observable.repeat(x, i); // 1,0  2,1  3,2
    },
    function (err) {
        return Rx.Observable.return(42);
    },
    function () {
        return Rx.Observable.empty();
    }).subscribe((x) => {
        console.log(x);   //  2 3 3
    });
```	
---
####Rx.Observable.XXXXX().groupBy(f()[,f()[,f()]])
**意如其名,分类用,第一个函数是用来返回分类的key,第二个函数用来返回返回的值,传说中的第三个,我也不知道干嘛用的.官方文档说是用来比较2各key值,但尝试后无果**
####Rx.Observable.XXXXX().groupByUntil(f(),f()[,f()[,f()]])
**触发分类是在接收到信号的时候,前2个函数参数一样,第3个返回有个Observable,对触发点进行控制,第4个依旧是个迷....**

```javascript
let codes = [
    { keyCode: 38,tail:1 }, 
    { keyCode: 38,tail:1 }, 
    { keyCode: 40,tail:2 },
    { keyCode: 40,tail:2 },
    { keyCode: 37,tail:3 },
    { keyCode: 39,tail:4 },
    { keyCode: 37,tail:3 },
    { keyCode: 39,tail:4 }
];

Rx.Observable.fromArray(codes)
    .groupBy(
     (x) => { return x.keyCode; },
     (x) => { return x.tail; }
    ).subscribe((x) => {
        console.log(x);  //  合并后的对象,对象里会有key值
        x.subscribe(function (x) {
            console.log(x);  //返回返回值
        });
    });
    
Rx.Observable
    .for(codes, function (x) { return Rx.Observable.return(x).delay(1000); })
    .groupByUntil(
        function (x) { return x.keyCode; },
        function (x) { return x.keyCode; },
        function (x) { return Rx.Observable.timer(2000); })    
	 .subscribe((x) => {
         x.subscribe(function (x) {
             console.log(x);
         });
     });
```	
---
####Rx.Observable.XXXXX().map()
####Rx.Observable.XXXXX().select()
**同义方法,遍历流的返回**

```javascript
let md = Rx.Observable.fromEvent(this.refs['refresh-btn'], 'mousedown')
    .map((x) => {
        return x;
    }).subscribe((x) => {
        console.log(x);  //x为事件
    });

// Using a function
let source = Rx.Observable.range(1, 3)
    .select(function (x, idx, obs) {
        return x * x;
    }).subscribe((x) => {
        console.log(x); //1  4   9
    });
```	
---

####Rx.Observable.XXXXX().pluck()
**过滤对象,获取对应key的值**

```javascript
let source = Rx.Observable.fromArray([
            { value: 0 },
            { value: 1 },
            { value: 2 }
        ])
            .pluck('value')
            .subscribe((x) => {
                console.log(x); //0  1   2
            });
```	
---

####Rx.Observable.XXXXX().scan(f()[,init])
**和reduce类似,如果init不存在的情况下,并不会触发第一次scan回调**

```javascript
let source = Rx.Observable.range(1, 3)
    .scan((pre,nex)=>{
        console.log(pre,nex); //none    1    3
        return pre + nex;
    }).subscribe((x) => {
        console.log(x); //1  3   6
    });
```	
---

####Rx.Observable.XXXXX().expand(f())
**和scan类似,不过他是自循环,无限次数**

```javascript
let source = Rx.Observable.return(34)
    .expand((pre)=>{
        return Rx.Observable.return(34+pre);
    }).take(5).subscribe((x) => {
        console.log(x); //34  68   102 136   170
    });
```	
---
##Filtering Observables

####Rx.Observable.XXXXX().take(x::Number)
**限制流的个数**
####Rx.Observable.XXXXX().takeUntil(x::stream)
**x时间之后中断返回**
####Rx.Observable.XXXXX().takeWhile(f())
**f返回true之后中断返回**

```javascript
Rx.Observable.range(0, 5)
    .take(3)
    .subscribe((x) => {
        console.log(x);  //0 1 2
    });
Rx.Observable.timer(0, 1000)
    .takeUntil(Rx.Observable.timer(5000)).subscribe(
		(x) => console.log(x)  //  0 1 2 3 4 5
    )
Rx.Observable.range(1, 5)
    .takeWhile(function (x) { return x < 3; }).subscribe(
    	(x) => console.log(x) // 1 2
    )
```	
---
####Rx.Observable.XXXXX().takeUntilWithTime(x::Number)
**限定时间外的流**

```javascript
Rx.Observable.timer(0, 1000)
    .takeUntilWithTime(4000)
    .subscribe((x) => {
        console.log(x);  //0 1 2 3
    });
```	
---
####Rx.Observable.XXXXX().takeLast(x::Number)
**只返回倒算的x个流**

```javascript
Rx.Observable.range(0, 5)
    .takeLast(3)
    .subscribe((x) => {
        console.log(x);  //2  3  4
    });
```	
---
####Rx.Observable.XXXXX().takeLastWithTime(x::Number)
**只返回倒算限定时间内的流**

```javascript
Rx.Observable.timer(0,1000)
	 .take(10)
    .takeLastWithTime(5000)
    .subscribe((x) => {
        console.log(x);  //5 6 7 8 9
    });
```	
---
####Rx.Observable.XXXXX().takeLastBuffer(x::Number)
**将倒数的x个流合并返回**

```javascript
Rx.Observable.range(0, 5)
    .takeLastBuffer(3)
    .subscribe((x) => {
        console.log(x); //[2,3,4]
    });
```	
---
####Rx.Observable.XXXXX().takeLastBufferWithTime(x::Number)
**将倒数时间x内的流合并返回**

```javascript
Rx.Observable.timer(0, 400)
    .take(10)
    .takeLastBufferWithTime(600)
    .subscribe((x) => {
        console.log(x);  //[8,9]
    });
```	
---
####Rx.Observable.XXXXX().debounce(x::Number)
**过滤间隔时间X内的多个事件,以最后一个为准**

```javascript
let _time = 0;
let source = Rx.Observable.fromEvent(this.refs['refresh-btn'],'click',()=>{
        console.log('click');
        return ++_time;
    })
    .debounce(500).subscribe((x) => {
        console.log(x);
    });
```	
---
####Rx.Observable.XXXXX(). throttleWithSelector(x::Number)
**过滤间隔时间X内的多个事件,以最后一个为准**

```javascript
let _time = 0;
let source = Rx.Observable.fromEvent(this.refs['refresh-btn'],'click',()=>{
        console.log('click');
        return ++_time;
    })
    .debounce(500).subscribe((x) => {
        console.log(x);
    });
```	
---
####Rx.Observable.XXXXX().distinct([,f()])
**过滤相同的流**

```javascript
Rx.Observable.fromArray([
        {value: 42}, {value: 24}, {value: 42}, {value: 24}
    ])
    .distinct(function (x) { return x.value; })
    .subscribe((x) => {
        console.log(x);  //42 24
    });
```	
---
####Rx.Observable.XXXXX().distinctUntilChanged()
**过滤相同的流,但是只在触发的时候过滤**

```javascript
Rx.Observable.fromArray([
        {value: 42}, {value: 24}, {value: 24}, {value: 42}
    ])
    . distinctUntilChanged()
    .subscribe((x) => {
        console.log(x); //42  24  42
    });
```	
---
####Rx.Observable.XXXXX().elementAt(x:Number)
**过滤其他的流,只返回第x个**

```javascript
Rx.Observable.fromArray([0,1,2,3,4,5,6])
    .elementAt(3).subscribe((x) => {
        console.log(x);     //3
    });
```	
---
####Rx.Observable.XXXXX().filter(f())
**过滤回调里面返回false的值,保留返回true的,回调里有3个参数,当前值,当前的序列号,流对象自身(filter和where异曲同工,一个尿性)**

```javascript
Rx.Observable.range(0, 5)
    .filter((x, idx, obs)=>{
        return x % 2 === 0;
    }).subscribe((x) => {
        console.log(x); // 0  2  4
    });
```	
---
####Rx.Observable.every(f(x))
**遍历所有,返回`true`||`false`**
####Rx.Observable.indexOf(x)
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
---
####Rx.Observable.XXXXX().first(f())
**以回调断言来筛选,只返回第一个流**
####Rx.Observable.XXXXX().last(f())
**以回调断言来筛选,只返回最后个流**

```javascript
Rx.Observable.range(0, 10)
    .filter((x, idx, obs)=>{
        return x % 2 === 0;
    }).subscribe((x) => {
        console.log(x); // first:1   last:9
    });
```	
---
####Rx.Observable.XXXXX().ignoreElements()
**忽略所有的返回**

```javascript
Rx.Observable.range(0, 5)
    .ignoreElements()
    .subscribe((x) => {
        console.log(x); //啥都没有
    });
```	
---
####Rx.Observable.XXXXX().sample(x)
**间隔x秒返回最新的一个流.与`debounce `的区别在于,`debounce `是每次触发重新计时.这里还有个小坑,x设为5999也是以5秒计算**

```javascript
Rx.Observable.interval(1000)
    .sample(5000)
    .take(2)
    .subscribe((x) => {
        console.log(x);  //4   9
    });
```	
---
####Rx.Observable.XXXXX().skip(x)
**忽略前面x个流**
####Rx.Observable.XXXXX().skipLast(x)
**忽略最后x个流**

```javascript
Rx.Observable.range(0, 10)
    .skip(4)
    .subscribe((x) => {
        console.log(x);  // 4 5 6 7 8 9
    });
    
Rx.Observable.range(0, 7)
    .skipLast(3)
    .subscribe((x) => {
        console.log(x);  // 0 1 2 3
    });
```	
---
####Rx.Observable.XXXXX().skipUntil(x::stream)
**根据x流返回值,来跳过**
####Rx.Observable.XXXXX().skipWhile(f())
**根据x流返回值,当为true时,开始返回**
####Rx.Observable.XXXXX().skipUntilWithTime(x)
**忽略前面x秒的流**
####Rx.Observable.XXXXX().skipLastWithTime(x)
**忽略最后x秒的流**
```javascript
Rx.Observable.timer(0, 1000)
    .skipUntil(Rx.Observable.timer(5000)).subscribe(
    	(x) => console.log(x)
    )
            
Rx.Observable.range(1, 5)
    .skipWhile(function (x) { return x < 3; }).subscribe(
        (x) => console.log(x)   //3  4  5
    )
            
Rx.Observable.timer(0, 1000)
    .skipUntilWithTime(4000).subscribe((x) => {
        console.log(x);  //4 5 6 7 8 9 ...
    });
    
Rx.Observable.timer(0, 1000)
    .take(10)
    .skipLastWithTime(5000)
    .subscribe((x) => {
        console.log(x); // 0 1 2 3 4
    });
```	
---

##Combining Observables

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
####y::steam.withLatestFrom(x::steam,f(xv,yv))
    
**当每次x流有返回值的时候,就是返回x流的当前值和y流的最后的返回值**

```javascript
let source1 = Rx.Observable.interval(140)
    .map(function (i) { return 'First: ' + i; });

let source2 = Rx.Observable.interval(50)
    .map(function (i) { return 'Second: ' + i; });

let source = source1.withLatestFrom(
    source2,
    function (s1, s2) { return s1 + ', ' + s2; }
).take(4).subscribe((x) => {
        console.log(x);   //First: 0, Second: 1
                          //First: 1, Second: 4
                          //First: 2, Second: 7
                          //First: 3, Second: 10
    });
```
---
####Rx.Observable.join(x::steam,f(),f(),f())

**合并2个流,触发返回是在x(ys)流返回的时候,第一个函数参数和第二个的返回值是对应2个流的生存周期**

```javascript
let xs = Rx.Observable.interval(1000)
    .map(function (x) { return x; });
let ys = Rx.Observable.interval(1000)
    .map(function (x) { return x; });
xs.join(
    ys,
    function () { return Rx.Observable.timer(0); },
    function () { return Rx.Observable.timer(0); },
    function (x, y) { return x +':'+ y; }
    )
    .take(5).subscribe((x) => {
        console.log(x); //0:0  1:1 2:2 3:3 4:4 
    });
```
---
####Rx.Observable.merge(x::steam,y::stream)
####Rx.Observable.mergeDelayError(x::steam,y::stream)
**合并2个流,按返回顺序返回,会在遇到错误的时候终端,mergeDelayError会延迟错误**

```javascript
let x = Rx.Observable.timer(0,1000).take(2),
    y = Rx.Observable.timer(0,100).take(10);
Rx.Observable.merge(x,y).subscribe(
        (x) => console.log(x) // 0,0 1 2 3 4 5 6 7 8 1 9
    )
```
---
####Rx.Observable.startWith(x)

**初始化的时候触发下流**

```javascript
Rx.Observable.interval(1000).startWith(10).subscribe(
    (x) => console.log(x)  //10 0 1 2 3 4 5 ...
)
```
---
####Rx.Observable.switch()

**合并多个流的返回,返回值为最新返回的准**

```javascript
Rx.Observable.range(0, 3)
    .select(function (x) { return Rx.Observable.range(x, 5); })
    .switch().subscribe(
        (x) => console.log(x)  // 0 1 2 3 4 5 6
    )
```
---
####Rx.Observable.zip(x::stream[,x::stream],f(x[,x]))

**压缩N个流的返回,并不会返回最新的值,而是根据返回的次数来压缩返回值**

```javascript
let x = Rx.Observable.timer(0, 100).take(10),
    y = Rx.Observable.timer(0, 2000).take(10),
    z = Rx.Observable.timer(0, 300).take(10);

Rx.Observable.zip(
    x,
    y,
    z,
    function (s1, s2, s3) {
        return s1 + ':' + s2 + ':' + s3;
    }
).subscribe(
    (x) => console.log(x) // n:n:n 每2秒递增1
    )
```
---
####Rx.Observable.forkJoin(x::stream[,x::stream])
**forkJoin形态一:多个流取最后一个返回值,返回为数组**
####X::stream.forkJoin(x::stream[,x::stream],f(x))
**forkJoin形态二:其中一个流为调用者,最后多一个回调函数处理返回值**

```javascript
Rx.Observable.forkJoin(
    Rx.Observable.timer(0,2000).take(2),
    Rx.Observable.range(0, 10),
    Rx.Observable.fromArray([1, 2, 3, 4])
).subscribe(
    (x) => console.log(x)  //[1,9,4]
    )
    
    
Rx.Observable.timer(0,2000).take(2).forkJoin(
    Rx.Observable.fromArray([1, 2, 3, 4]),
    (x,y)=> {
        return x+y;
    }
).subscribe(
    (x) => console.log(x)  //5  (1+4)
    )
```
---
##Observable Utility Operators
####Rx.Observable.XXXXX().delay(new Date(Date.now() + n))
**延迟返回值**
####Rx.Observable.XXXXX().delaySubscription(time)
**与delay基本一致,但会在触发返回的时间间隔与time直接取最大值**

```javascript
Rx.Observable.just(1).delay(3000).subscribe(
		(x) => console.log(x)  //3s后输出  1
)
```	
---

####Rx.Observable.XXXXX().do(f(),f(),f())
**会在每个返回值调用do的参数函数,do也可以传一个Observable的对象**

**同名tap,以下do的都有同名tapxxx的方法**

```javascript
Rx.Observable.range(0, 3)
    .do(
        function (x) { console.log('do:', x); },
        function (err) { console.log('Do Error:', err); },
        function () { console.log('Do Completed'); }
    ).subscribe(
        (x) => console.log(x)  //do:0  0  do:1  1  do:2  2
    )
```	
---

####Rx.Observable.XXXXX().doOnNext(f(),x::object)
**会把第二个参数x当做调用者,去调用f()**

```javascript
Rx.Observable.range(0, 3)
    .doOnNext(
        function (x) { this.log('do:'+ x); },
        console
    ).subscribe(
        (x) => console.log(x)  //do:0  0  do:1  1  do:2  2
    )
```	
---

####Rx.Observable.XXXXX().doOnError(f(),x::object)
**会把第二个参数x当做调用者,去调用f(),捕获异常时,返回**
####Rx.Observable.XXXXX().doOnCompleted(f(),x::object)
**会把第二个参数x当做调用者,去调用f(),完成所有返回时,返回**
####Rx.Observable.XXXXX().finally(f())
**会把第二个参数x当做调用者,去调用f(),最后的时候返回,在error之后**

```javascript
Rx.Observable.throw(new Error())
    .doOnError(function (x) {
        this.log(x);
    },console).subscribe(
        (x) => console.log(x),
        (err)=>{ console.log('Error: ' + err); },
        ()=>{ console.log('Completed'); }
    )
    
Rx.Observable.throw(new Error())
    .finally(function () {
        console.log('Finally');
    }).subscribe(
        (x) => console.log(x),
        (err)=>{ console.log('Error: ' + err); },
        ()=>{ console.log('Completed'); }
    )
    
Rx.Observable.range(0,3)
    .doOnCompleted(function () {
        this.log('do');
    },console).subscribe(
        (x) => console.log(x),     // 0 1  2  do  Completed
        (err)=>{ console.log('Error: ' + err); },
        ()=>{ console.log('Completed'); }
    )
```	
---
####Rx.Observable.XXXXX().skipUntilWithTime(x)
**忽略前面x秒的流**

```javascript
Rx.Observable.timer(0, 1000)
    .skipUntilWithTime(4000).subscribe((x) => {
        console.log(x);  //4 5 6 7 8 9 ...
    });
    
Rx.Observable.timer(0, 1000)
    .take(10)
    .skipLastWithTime(5000)
    .subscribe((x) => {
        console.log(x); // 0 1 2 3 4
    });
```	
---

##From Observables

####Rx.Observable.from(string||array||object(.length)||set||map[,selector::function])
**遍历参数所有项**
####Rx.Observable.of(x[,y[,z]])
**遍历参数所有项**

```JavaScript
Rx.Observable.from({length:5},(x,y)=>{return y; }).subscribe(
    (x)=>{
        console.log(x); //0,1,2,3,4
    }
)

Rx.Observable.of(1,2,3).subscribe(
    (x)=>{
        console.log(x); //1,2,3
    }
)
```
---


####Rx.Observable.fromCallback(f())
####Rx.Observable.fromNodeCallback(f())[针对NODE]
**传入触发函数,调用回调函数,感觉有点像切面编程,可以随时在任何地方添加回调**

```JavaScript
var fs = require('fs'),
    Rx = require('rx');

// Wrap fs.exists
var exists = Rx.Observable.fromCallback(fs.exists);

// Check if file.txt exists
var source = exists('file.txt');

var subscription = source.subscribe(
    function (x) { console.log('Next: ' + x); },
    function (err) { console.log('Error: ' + err); },
    function () { console.log('Completed'); });
```
---
####Rx.Observable.fromEvent(element::DOM,event::string[,f(x)])
**自定义一个事件流
element可以是很多类型(a simple DOM element, or a NodeList, jQuery element, Zepto Element, Angular element, Ember.js element, or EventEmitter).
触发函数的回调参数是事件本身.如果触发函数带参数的话,可以在缺省函数里取到,进行操作**

```JavaScript
let refreshButton = this.refs['refresh-btn'];   //react的写法,事实上是dom
Rx.Observable.fromEvent(refreshButton, 'click').subscribe(
    (x) => {
        console.log(x);   //x为event点击事件
    }
);
```
---

####Rx.Observable.ofArrayChanges(x::arr)
####Rx.Observable.ofObjectChanges(x::obj)
**监听对象,在改变的时候触发**

```JavaScript
let arr = [1,2,3];
let obj = {x: 1};

Rx.Observable.ofArrayChanges(arr).subscribe(
    (x) => {
        console.log(x);   //{type: "splice", object: Array[4], index: 3, removed: Array[0], addedCount: 1}
    }
);
Rx.Observable.ofObjectChanges(obj).subscribe(
    (x) => {
        console.log(x);   //{type: "update", object: Object, name: "x", oldValue: 1}
    }
);

arr.push(4);
obj.x = 42;
```
---
##Conditional and Boolean Operators

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
####Rx.Observable.xxxxx.isEmpty()

**判断流的返回值是否为空**

```javascript
Rx.Observable.of(1, 2, 3)
    .isEmpty().subscribe(
    	(x) => console.log(x)  //false
    )
```
---
####Rx.Observable.xxxxx.defaultIfEmpty(v)

**为空时的默认值**

```javascript
Rx.Observable.empty()
    .defaultIfEmpty(2).subscribe(
    	(x) => console.log(x)  // 2
    )
```
---

####Rx.Observable.sequenceEqual(x::stream)

**判断2个流的返回值是否相等,包括顺序和数据类型**

```javascript
let x = Rx.Observable.of(42,1),
    y = Rx.Observable.of(42,1);
x.sequenceEqual(y).subscribe(
    (x) => console.log(x)
)
```
---

##Mathematical and Aggregate Operators

####Rx.Observable.xxxxx.average()
    
**求所有返回值的平均数,可以有一个参数,用来打包处理每一个返回值**

```JavaScript
Rx.Observable.range(0, 9).average().subscribe(
    (x) => console.log(x)   // 4(0~8)
)
```
---

####Rx.Observable.concat(x::stream)
    
**把x的返回添加到调用者的返回后面**

```JavaScript
let x = Rx.Observable.of(1,2,3,4).delay(3000),
    y = Rx.Observable.of(5);
x.concat(y).subscribe(
    (x) => console.log(x)   //1 2 3 4 5
)
```
---

####Rx.Observable.xxxx.count(f())
    
**根据断言f的返回值,统计个数**

```JavaScript
Rx.Observable.of(1,2,3,4,5,1,3).count((y)=>{
    return y < 3;
}).subscribe(
    (x) => console.log(x) // 3
)
```
---

####Rx.Observable.xxxx.max()
**输出最大值**
####Rx.Observable.xxxx.maxBy(f())
**断言f处理判断**

####Rx.Observable.xxxx.min()
####Rx.Observable.xxxx.minBy(f())
**类同max的用法**

####Rx.Observable.xxxx.sum()
**类同max的用法**

```JavaScript
Rx.Observable.of(1,2,3,4,5,1,3).max()
	.subscribe(
    	(x) => console.log(x) // 5
	)
	
Rx.Observable.of(1,2,3,4,5,5,3).maxBy((y)=>{
    return y;
}).subscribe(
    (x) => console.log(x)  // [5,5]
)

Rx.Observable.of(1,2,3,4,5,6,7,8,9).sum().subscribe(
    (x) => console.log(x)  //  45
)
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

##Connectable Observable Operators

####Rx.Observable.connect()
**触发流的返回**
####Rx.Observable.publish()
**把普通的对象变成可控的对象,要在connect之后,才能触发返回**
####Rx.Observable.publishValue(x)
**同上,但是x为初始化返回值**
####Rx.Observable.publishLast()
**同上,只返回连接后的最后一次**
####Rx.Observable.publish().refCount()
**把可控的对象(publish)变回普通的对象**

####Rx.Observable.share()
**等同于执行了publish和refCount**

```JavaScript
let interval = Rx.Observable.interval(1000);

let source = interval
    .take(2)
    .do(function (x) { console.log('Side effect'); });

let published = source.publish();
let published2 = source.publish().refCount();
let published3 = source.share();//等同于上行


published.subscribe(createObserver('SourceA'));
published2.subscribe(createObserver('SourceB'));//不需要connect
    
function createObserver(tag) {
    return Rx.Observer.create(
        function (x) { console.log('Next: ' + tag + x); },
        function (err) { console.log('Error: ' + err); },
        function () { console.log('Completed'); });
}
// Connect the source
published.connect();
```
---