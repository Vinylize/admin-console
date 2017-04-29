import React from 'react';
import {
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
              <Link to='/user/list'>List of Users</Link>
              {/* <Link to='/user/'>{this.props.viewer.id}</Link>*/}
            </Navigation>
          </Drawer>
          <Content style={{ marginTop: 65, padding: 20, backgroundColor: '#EEEEEE' }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
