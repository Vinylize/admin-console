/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import { withRouter } from 'react-router';
import { Grid, Cell, Textfield, Button } from 'react-mdl';
import Page from '../Page/PageComponent';
import { getAuth } from '../../auth/Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAuthSuccess = this.handleAuthSuccess.bind(this);
    this.handleAuthFail = this.handleAuthFail.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    getAuth(this.state.email, this.state.password)
    .then(this.handleAuthSuccess)
    .catch(this.handleAuthFail);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAuthSuccess() {
    const nextLocation = this.props.location.state;
    console.log('success!', nextLocation);
    if (!nextLocation || nextLocation === '/login') this.props.router.replace('/');
    else this.props.router.replace(nextLocation);
  }

  handleAuthFail(error) {
    alert(error);
  }

  render() {
    return (
      <Page heading='Login For Admin'>
        <div style={{ width: '70%', margin: 'auto' }}>
          <Grid>
            <form style={{ margin: 'auto' }} onSubmit={this.handleSubmit}>
              {/* <Cell col={12}>*/}
              {/* <Textfield onChange={() => {}} label='Username' />*/}
              {/* </Cell>*/}
              <Cell col={12} style={{ marginTop: '100px' }}>
                <Textfield onChange={this.handleChange} name='email' label='Email' placeholder='email' type='text' />
              </Cell>
              <Cell col={12} style={{ marginTop: '100px' }}>
                <Textfield onChange={this.handleChange} name='password' label='Password' placeholder='password' type='password' />
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

Login.propTypes = {
  location: React.PropTypes.object,
  router: React.PropTypes.object
};

withRouter(Login);

export default Login;
