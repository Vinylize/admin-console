import React from 'react';
import {
  Content,
  Drawer,
  Layout,
  Navigation
} from 'react-mdl';
import { Link } from 'react-router';

export default class PartnerMain extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Layout fixedDrawer>
          <Drawer title='Partner' style={{ paddingTop: 65 }}>
            <Navigation>
              <Link to='/partner'>Partner management</Link>
              <Link to='/partner/list'>Partner list</Link>
            </Navigation>
          </Drawer>
          <Content style={{ paddingTop: 65 }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
