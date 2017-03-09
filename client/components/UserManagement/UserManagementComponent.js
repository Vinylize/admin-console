import React from 'react';
import { Grid, Cell, Textfield, Button } from 'react-mdl';
import Page from '../Page/PageComponent';

export default class UserManagement extends React.Component {
  render() {
    return (
      <Page heading='UserManagement'>
        <h1>This is user management page</h1>
        <div style={{ width: '70%', margin: 'auto' }}>
          <Grid>
            <form style={{ margin: 'auto' }}>
              <Cell col={12}>
                <Textfield onChange={() => {}} label='Password' type='password' />
              </Cell>
              <Cell col={12} style={{ textAlign: 'right' }}>
                <Button primary>Sign up</Button>
              </Cell>
            </form>
          </Grid>
        </div>
      </Page>
    );
  }
}
