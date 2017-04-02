import React from 'react';
import {
  Content,
  Drawer,
  Layout,
  Navigation
} from 'react-mdl';
import { Link } from 'react-router';

export default class NodeMain extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Layout fixedDrawer>
          <Drawer title='Node' style={{ paddingTop: 65 }}>
            <Navigation>
              <Link to='/node/list'>List of Node</Link>
            </Navigation>
          </Drawer>
          <Content style={{ marginTop: 65, padding: 20, backgroundColor: '#EEEEEE' }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
