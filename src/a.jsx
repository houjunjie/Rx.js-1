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
    const inp = Observable.fromEvent(this.refs.ip, 'keydown')
      // .filter((e) => {
      //   return e.keyCode === 13;
      // })
      .map((e) => {
        console.log(e, 'map');
        return this.refs.ip.value
      })
      .filter((e) => {
        console.log(e, 'filter');
        return e !== ''
      })
      .do((e) => {
        console.log(e, 'do');
      })
      .subscribe();
  }
  render() {
    const { self } = this.state;
    return (
      <div ref='a' className={cx('box')}>
        {self}
        <B />
        <input type="text" ref='ip' />
      </div>
    );
  }
}


export default A;