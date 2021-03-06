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
              <Link to='/order/list'>List of Orders</Link>
            </Navigation>
          </Drawer>
          <Content style={{ marginTop: 65, padding: 20, backgroundColor: '#EEEEEE' }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
