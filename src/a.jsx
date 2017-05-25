import React, { Component } from 'react';
import B from './b.jsx';

import { Observable } from 'rxjs';


import classNames from 'classnames/bind';
import style from './stylus.styl';


const cx = classNames.bind(style);


class A extends Component {
  constructor(props) {
    super(props);
    this.state = {
      self: 'A'
    }
  }
  componentDidMount() {
    const enter = Observable.fromEvent(this.refs.ipt, 'keydown')
      .filter((e) => {
        return e.keyCode === 13;
      })
    const click = Observable.fromEvent(this.refs.btn, 'click');

    const input = enter.merge(click);

    input.map(() => {
      return this.refs.ipt.value
    })
      .map((e) => {
        return `<p>${e}</p>`
      })
      .do((e) => {
        document.querySelector('.fuck').innerHTML = e;
        this.refs.ipt.value = '';
      })
      .mergeMap((e) => {
        return Observable.fromEvent(e, 'click').filter((ee) => {
          return ee.target === e
        }).mapTo(e)
      })
      .do((e) => {
        console.log('last', e);
      })
      .subscribe();
    const fuck = 11;
    const shit = 22;
    function test({
      fuck2 = fuck,
      shit2 = shit
      } = {}) {

    }
  }
  render() {
    const { self } = this.state;
    return (
      <div ref='a' className={cx('box', 'slide-left')}>
        {self}
        <B />
        <input type="text" ref='ipt' />
        <button ref='btn'>add</button>
      </div>
    );
  }
}


export default A;