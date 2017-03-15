import React from 'react';
import { Link } from 'react-router';
import { Layout, Header, Navigation } from 'react-mdl';
import styles from './Navbar.scss';

export default class Navbar extends React.Component {
  render() {
    const title = 'Yetta Management Console';
    return (
      <Layout className={styles.root}>
        <Header title={<Link to='/'>{title}</Link>} style={{ position: 'relative', zIndex: '99' }}>
          <Navigation >
            <Link to='/user'>User</Link>
            <Link to='/runner'>Runner</Link>
            <Link to='/node'>Node</Link>
            <Link to='/order'>Order</Link>
            <Link to='/partner'>Partner</Link>
            <Link to='/map'>Open Map</Link>
            <Link to='/'>Experimental</Link>
            <Link to='/login'>Login</Link>
          </Navigation>
        </Header>
      </Layout>
    );
  }
}
