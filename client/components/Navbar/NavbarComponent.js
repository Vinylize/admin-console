import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import { Layout, Header, Navigation } from 'react-mdl';
import styles from './Navbar.scss';
import { checkAuth } from '../../auth/Auth';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: 'Login',
      adminEmail: ''
    };
    this.updateLoginState = this.updateLoginState.bind(this);
  }

  componentDidMount() {
    this.updateLoginState();
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.updateLoginState();
    }, 200);
  }

  updateLoginState() {
    const user = checkAuth();
    if (user) {
      this.state.adminEmail = user.e;
      this.setState({ loginState: 'Logout' });
    } else {
      this.state.adminEmail = '';
      this.setState({ loginState: 'Login' });
    }
  }
  render() {
    const title = 'Yetta Management Console';
    let $loginDropDownMenu = null;
    if (this.state.loginState === 'Login') {
      $loginDropDownMenu = (<Link to='/login'>Login</Link>);
    } else {
      $loginDropDownMenu = (
        <DropDownMenu value={1} selectedMenuItemStyle={{ color: '#000000' }}>
          <MenuItem value={1} primaryText={`${this.state.adminEmail}`} />
          <MenuItem value={2} primaryText={<Link to='/logout' style={{ textDecoration: 'none', color: '#000000' }}>Logout</Link>} />
        </DropDownMenu>
      );
    }
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
            {$loginDropDownMenu}
          </Navigation>
        </Header>
      </Layout>
    );
  }
}
