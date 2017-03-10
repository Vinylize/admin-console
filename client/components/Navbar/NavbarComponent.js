import React from 'react';
import { Link } from 'react-router';
import { Layout, Header, Navigation } from 'react-mdl';
import styles from './Navbar.scss';

export default class Navbar extends React.Component {
  render() {
    const title = 'Yetta Console';
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
        {/* <Drawer title='Title'>
          <Navigation>
            <a href=''>Link</a>
            <a href=''>Link</a>
            <a href=''>Link</a>
            <a href=''>Link</a>
          </Navigation>
        </Drawer>*/}
        {/* <Drawer title={<Link to='/' style={{ fontSize: '1.5em' }}>{title}</Link>} className='mdl-layout--small-screen-only'>
          <Navigation>
            <Link to='/signup'>Sign up</Link>
            <Link to='/login'>Login</Link>
          </Navigation>
        </Drawer>*/}
      </Layout>
    );
  }
}
