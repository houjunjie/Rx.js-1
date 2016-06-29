# Rx.js

###Rx.Observable.amb(x,y)

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

