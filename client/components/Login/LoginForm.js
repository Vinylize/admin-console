import React from 'react';
import { Grid, Cell, Textfield, Button } from 'react-mdl';

export default class LoginForm extends React.Component {
    render() {
        return (
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
        );
    }
}