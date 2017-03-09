/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import { Grid, Cell, Textfield, Button } from 'react-mdl';
import Page from '../Page/PageComponent';

export default class Login extends React.Component {
  render() {
    return (
      <Page heading='Login For Admin'>
        <div style={{ width: '70%', margin: 'auto' }}>
          <Grid>
            <form style={{ margin: 'auto' }}>
              {/* <Cell col={12}>*/}
              {/* <Textfield onChange={() => {}} label='Username' />*/}
              {/* </Cell>*/}
              <Cell col={12} style={{ marginTop: '100px' }}>
                <Textfield onChange={() => {}} label='Password' type='password' />
              </Cell>
              <Cell col={12} style={{ textAlign: 'center' }}>
                <Button primary>Login</Button>
              </Cell>
            </form>
          </Grid>
        </div>
      </Page>
    );
  }
}
