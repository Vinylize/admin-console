import React from 'react';
import moment from 'moment';

import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import {
  firebase,
  refs
} from '../../util/firebase';

const uploadBaseUrl = 'http://localhost:5002/graphql?query=';

export default class RunnerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createUserModalOpen: false,
      tempUsers: [],
      users: [],
      selectedKey: 0,
      isSelected: false,
      isSearching: false,
    };
  }

  componentDidMount() {
    refs.user.root.once('value', (data) => {
      this.setState({ tempUsers: Object.keys(data.val()).map(key => data.val()[key])
        .filter((user) => {
          if (user.isRA === true) return true;
          return false;
        })
      }, () => {
        this.setState({ users: this.state.tempUsers }, () => {
          this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (user) => {
            if (user.child('isRA').val() === true) {
              let isIn = false;
              const len = this.state.users.length;
              for (let i = 0; i < len; ++i) {
                if (this.state.users[i].id === user.val().id) {
                  isIn = true;
                  break;
                }
              }
              if (!isIn) this.setState({ users: this.state.users.concat(user.val()) });
            }
          });
        });
      });
    });
    this.userRootChildChanged = refs.user.root.orderByKey().on('child_changed', (data) => {
      this.setState({ isSelected: false });
      if (data.child('isRA').val() === true) {
        let isIn = false;
        this.setState({
          users: this.state.users.map((user) => {
            if (data.child('id').val() === user.id) {
              isIn = true;
              return data.val();
            }
            return user;
          })
        }, () => {
          if (!isIn) this.setState({ users: this.state.users.concat(data.val()) });
        });
      } else {
        this.setState({
          users: this.state.users.filter((user) => {
            if (data.child('id').val() === user.id) return false;
            return true;
          })
        }, () => {
          if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
        });
      }
    });
  }

  componentWillUnmount() {
    refs.user.root.off('child_added', this.userRootChildAdded);
    refs.user.root.off('child_changed', this.userRootChildChanged);
  }

  onSearchQueryChange(evt) {
    this.setState({ isSearching: true });
    setTimeout(() => {
      this.setState({ isSearching: false });
    }, 4000);
    console.log(evt.target.value);
  }
  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };

  handleApproveRunner = (evt, uid) => {
    evt.preventDefault();
    this.setState({ isSelected: false });
    const url = `${uploadBaseUrl}mutation{adminDisapproveRunner(input:{uid:"${uid}"}){result}}`;
    console.log(url);
    return firebase.auth().getToken()
      .then(token => fetch(url,
        {
          method: 'POST',
          headers: {
            authorization: token.accessToken
          }
        }))
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          console.log(response.errors);
          alert(response.errors[0].message);
          return;
        }
        alert('The user is disapproved!');
        setTimeout(() => {
          this.setState({ users: [] });
          this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (data) => {
            if (data.child('isRA').val() === true) this.setState({ users: this.state.users.concat(data.val()) });
          });
          if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
        }, 100);
      })
      .catch();
  }

  handleBlockUser = (evt, uid, isB) => {
    evt.preventDefault();
    this.setState({ isSelected: false });
    const url = isB ? `${uploadBaseUrl}mutation{adminUnblockUser(input:{uid:"${uid}"}){result}}` : `${uploadBaseUrl}mutation{adminBlockUser(input:{uid:"${uid}"}){result}}`;
    return firebase.auth().getToken()
      .then(token => fetch(url,
        {
          method: 'POST',
          headers: {
            authorization: token.accessToken
          }
        }))
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          console.log(response.errors);
          alert(response.errors[0].message);
          return;
        }
        if (isB) alert('The user is unblocked!');
        else alert('Ther user is blocked!');
        setTimeout(() => {
          this.setState({ users: [] });
          this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (data) => {
            if (data.child('isRA').val() === true) this.setState({ users: this.state.users.concat(data.val()) });
          });
          if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
        }, 100);
      })
      .catch();
  }

  handleRowSelection = (keys) => {
    this.setState({ selectedKey: 0 }, () => {
      if (keys.length > 0) {
        keys.map((key) => {
          this.setState({ selectedKey: key });
          return key;
        });
        this.setState({ isSelected: true });
      } else if (keys.length === 0) {
        this.setState({ isSelected: false });
      }
    });
  }

  renderSpinner() {
    if (this.state.isSearching) {
      return (<CircularProgress size={25} thickness={2} />);
    }
    return null;
  }

  render() {
    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Runners</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label={this.state.isSelected && this.state.users.length > 0 ? (<Link to={`/runner/${this.state.users[this.state.selectedKey].id}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
                  primary
                  disabled={!this.state.isSelected}
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block'
                  secondary
                  disabled={!this.state.isSelected || this.state.users[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(evt) => { this.handleBlockUser(evt, this.state.users[this.state.selectedKey].id, false); }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled={!this.state.isSelected || !this.state.users[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                  }}
                  onClick={(evt) => { this.handleBlockUser(evt, this.state.users[this.state.selectedKey].id, true); }}
                />
                <RaisedButton
                  label='APPROVE'
                  disabled
                  backgroundColor='#a4c639'
                  labelColor='#FFFFFF'
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(evt) => { this.handleApproveRunner(evt, this.state.users[this.state.selectedKey].id, true); }}
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled={!this.state.isSelected}
                  secondary
                  style={{
                    margin: 12
                  }}
                  onClick={(evt) => { this.handleApproveRunner(evt, this.state.users[this.state.selectedKey].id, false); }}
                />

              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                <TextField
                  onChange={this.onSearchQueryChange.bind(this)}
                  floatingLabelText='Search User by E-mail...'
                />
                <div style={{ paddingLeft: 20, width: 40, height: 40 }}>
                  {this.renderSpinner()}
                </div>

              </div>
            </div>
            <div style={{ float: 'clear' }} >
              <Table
                selectable
                fixedHeader
                onRowSelection={this.handleRowSelection}
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn colSpan='3'>Email</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>phoneNumber</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>runnerApprovedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>State</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  deselectOnClickaway={false}
                >
                  {this.state.users.map((user) => {
                    const cTime = moment(user.cAt).calendar();
                    const rATime = moment(user.rAAt).calendar();
                    return (
                      <TableRow key={user.id}>
                        <TableRowColumn colSpan='3'>{user.e}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{user.n}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.p}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${rATime}`}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${cTime}`}</TableRowColumn>
                        <TableHeaderColumn colSpan='2'>{user.isB ? 'Blocked' : 'Unblocked'}</TableHeaderColumn>
                        <TableRowColumn colSpan='2'>
                          <Link to={`/runner/${user.id}`}>
                            <RaisedButton label='Details' primary />
                          </Link>
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>
          </Paper>
        </div>
      </div>
    );
  }
}
