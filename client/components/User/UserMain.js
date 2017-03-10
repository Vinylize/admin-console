import React from 'react';
import {
  // Badge,
  Content,
  Drawer,
  Layout,
  Navigation
} from 'react-mdl';
import { Link } from 'react-router';

export default class UserMain extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Layout fixedDrawer>
          <Drawer title='User' style={{ paddingTop: 65 }}>
            <Navigation>
              <Link to='/user/list'>
                {/* <Badge text='1' noBackground>*/}
                 List of User
                {/* </Badge>*/}
              </Link>
              <Link to='/user/'>User list</Link>
            </Navigation>
          </Drawer>
          <Content style={{ marginTop: 65, padding: 20, backgroundColor: '#EEEEEE' }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
