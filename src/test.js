// import Rx from 'rxjs';
// console.log(Rx);

// Rx.Observable.of(1,2,3);
const [a, b, c] = [1, 2, 3];
// console.log(a,b,c);
function d(e = 1, f = 2) {
    console.log(1);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(7)
        }, 3000);
    }).then((res) => {
        return res;
    })
}

let bb = async function () {
    console.log(4);
    let shit = await d();
    console.log(5);
    console.log(shit);
    console.log(6);
}

var cc = bb();
// console.log(cc);