// import Rx from 'rxjs';
// console.log(Rx);

// Rx.Observable.of(1,2,3);
const [a,b,c] = [1,2,3];
console.log(a,b,c);

function d(e=1,f=2) {
    let _res = [1,2];
    new Promise((resolve)=>{
        resolve([e,f])
    }).then((res)=>{
        _res = res
    })
    console.log(_res);
}



d(3,4);