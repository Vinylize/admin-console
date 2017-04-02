import React from 'react';
import { Link } from 'react-router';
import { Layout, Header, Navigation } from 'react-mdl';
import styles from './Navbar.scss';
import { checkAuth } from '../../auth/Auth';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginOrLogout: 'login'
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (checkAuth()) this.setState({ loginOrLogout: 'logout' });
      else this.setState({ loginOrLogout: 'login' });
    }, 500);
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      if (checkAuth()) this.setState({ loginOrLogout: 'logout' });
      else this.setState({ loginOrLogout: 'login' });
    }, 200);
  }

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
            <Link to={`/${this.state.loginOrLogout}`}>{this.state.loginOrLogout}</Link>
          </Navigation>
        </Header>
      </Layout>
    );
  }
}
