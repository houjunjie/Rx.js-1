// import Rx from 'rxjs';
// console.log(Rx);

// Rx.Observable.of(1,2,3);
const [a,b,c] = [1,2,3];
// console.log(a,b,c);
async function d(e=1,f=2) {
    console.log(333);
    let _res = [1,2];
    console.log(123);
    await new Promise((resolve)=>{
        resolve([e,f])
    }).then((res)=>{
        console.log(123);
        _res = res
    })
    console.log(_res);
}



d(3,4);