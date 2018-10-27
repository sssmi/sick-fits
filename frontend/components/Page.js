import React, { Component } from 'react';
import Header from '../components/Header';
import Meta from './Meta';

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <p>Hei im page</p>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
