import React from 'react';
import {
  Content,
  Drawer,
  Layout,
  Navigation
} from 'react-mdl';
import { Link } from 'react-router';

export default class RunnerMain extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    // viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Layout fixedDrawer>
          <Drawer title='Runner Management' style={{ paddingTop: 65 }}>
            <Navigation>
              <Link to='/runner/list'>List of Runner</Link>
              <Link to='/runner/list'>1st Judge</Link>
              <Link to='/runner/list'>2nd Judge</Link>
            </Navigation>
          </Drawer>
          <Content style={{ paddingTop: 65 }}>{this.props.children}</Content>
        </Layout>
      </div>
    );
  }
}
