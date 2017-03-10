import React from 'react';
import {
  Content,
  Drawer,
  Layout,
  Navigation
} from 'react-mdl';
import { Link } from 'react-router';

export default class OrderMain extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Layout fixedDrawer>
          <Drawer title='Order' style={{ paddingTop: 65 }}>
            <Navigation>
              <Link to='/order'>Order</Link>
              <Link to='/order/list'>Order list</Link>
            </Navigation>
          </Drawer>
          <Content style={{ paddingTop: 65 }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
