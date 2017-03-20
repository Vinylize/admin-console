/* eslint-disable global-require */
import React from 'react';
import {
  Grid,
  Cell,
  Card,
  CardTitle,
  CardText,
  CardActions,
  Button
} from 'react-mdl';
import Page from '../Page/PageComponent';
// import styles from './Dashboard.scss';
// import AddFeature from './AddFeatureComponent';

export default class Feature extends React.Component {
  static propTypes = {};

  render() {
    return (
      <div>
        <Page heading='Dashboard'>
          <Grid>
            {/* start of user count card */}
            <Cell col={3}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand><h1>14</h1></CardTitle>
                <CardText>
                  <h4>User Count</h4>
                </CardText>
                <CardActions border>
                  <Button colored>View Details</Button>
                </CardActions>
              </Card>
            </Cell>
            {/* we need more reference. */}
            <Cell col={3}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand><h1>?</h1></CardTitle>
                <CardText>
                  <h4>We need more reference</h4>
                </CardText>
                <CardActions border>
                  <Button colored>View Details</Button>
                </CardActions>
              </Card>
            </Cell>
            <Cell col={6}>
              <Card shadow={0} style={{ width: '100%', margin: 'auto' }}>
                <CardTitle expand><h1>?</h1></CardTitle>
                <CardText>
                  <h4>We need more reference</h4>
                </CardText>
                <CardActions border>
                  <Button colored>View Details</Button>
                </CardActions>
              </Card>
            </Cell>
          </Grid>
        </Page>
      </div>
    );
  }
}
