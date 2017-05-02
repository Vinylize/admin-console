import React from 'react';
import moment from 'moment';

import { Link } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
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
  refs,
  firebase
} from '../../util/firebase';

const uploadBaseUrl = 'https://api.yetta.co/graphql?query=';

class UserList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

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

  componentWillMount() {
    refs.user.root.once('value', (data) => {
      this.setState({ tempUsers: Object.keys(data.val()).map(key => data.val()[key])
        .filter((user) => {
          if (user.permission !== 'admin') return true;
          return false;
        })
      }, () => {
        this.setState({ users: this.state.tempUsers }, () => {
          this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (user) => {
            let isIn = false;
            const len = this.state.users.length;
            for (let i = 0; i < len; ++i) {
              if (this.state.users[i].id === user.val().id) {
                isIn = true;
                break;
              }
            }
            if (user.child('permission').val() !== 'admin' && !isIn) this.setState({ users: this.state.users.concat(user.val()) });
          });
          this.userRootChildChanged = refs.user.root.orderByKey().on('child_changed', (user) => {
            this.setState({ isSelected: false });
            if (user.child('permission').val() !== 'admin') {
              let isIn = false;
              this.setState({
                users: this.state.users.map((u) => {
                  if (user.child('id').val() === u.id) {
                    isIn = true;
                    return user.val();
                  }
                  return u;
                })
              }, () => {
                if (!isIn) this.setState({ users: this.state.users.concat(user.val()) });
              });
            } else {
              this.setState({
                users: this.state.users.filter((u) => {
                  if (user.child('id').val() === u.id) {
                    return false;
                  }
                  return true;
                })
              }, () => {
                if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
              });
            }
          });
        });
      });
    });
  }

  componentWillUnmount() {
    refs.user.root.off('child_added', this.userRootChildAdded);
    refs.user.root.off('child_changed', this.userRootChildChanged);
  }

  onSearchQueryChange(e) {
    this.setState({ isSearching: true });
    setTimeout(() => {
      this.setState({ isSearching: false });
    }, 4000);
    console.log(e.target.value);
  }
  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };

  handleBlockUser = (e, uid, isB) => {
    e.preventDefault();
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
            if (data.child('permission').val() === null) this.setState({ users: this.state.users.concat(data.val()) });
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
    const createUserModalActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleCreateUserModalClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleCreateUserModalClose}
      />,
    ];
    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Users</h3>
              <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleCreateUserModalOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>
            </div>
            {/* <i style={{ paddingLeft: 31 }} >Action for selected user...</i>*/}
            {/* <i style={{ paddingLeft: 31 }} >{this.props.viewer.users}</i>*/}


            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label={this.state.isSelected && this.state.users.length > 0 ? (<Link to={`/user/${this.state.users[this.state.selectedKey].id}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
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
                  onClick={(e) => { this.handleBlockUser(e, this.state.users[this.state.selectedKey].id, false); }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled={!this.state.isSelected || !this.state.users[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, this.state.users[this.state.selectedKey].id, true); }}
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
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled
                  secondary
                  style={{
                    margin: 12
                  }}
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
                    <TableHeaderColumn colSpan='3'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>phoneNumber</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>isPhoneValid</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>State</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  deselectOnClickaway={false}
                >
                  {this.state.users.map((user) => {
                    const time = moment(user.cAt).calendar();
                    return (
                      <TableRow key={user.id}>
                        <TableRowColumn colSpan='3'>{user.e}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.n}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.p}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{user.isPV ? 'YES' : 'NO'}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${time}`}</TableRowColumn>
                        <TableHeaderColumn colSpan='2'>{user.isB ? 'Blocked' : 'Unblocked'}</TableHeaderColumn>
                        <TableRowColumn colSpan='2'>
                          <Link to={`/user/${user.id}`}>
                            <RaisedButton label='Details' primary />
                          </Link>
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>

          </Paper>


          {/* <DataTable
            width='100%'
            selectable
            onSelectionChanged={() => {}}
            shadow={0}
            rowKeyColumn='id'
            rows={data}
          >
            <TableHeader name='name' tooltip='name of UserList'>Name</TableHeader>
            <TableHeader name='email' tooltip='email of user'>email</TableHeader>
            <TableHeader numeric name='rating' tooltip='rating of user.'>Rating</TableHeader>
            <TableHeader name='action' tooltip='Action for user.'>Action</TableHeader>
             <TableHeader numeric name='rating' cellFormatter={price => `\$${price.toFixed(2)}`} tooltip='Price pet unit'>rating</TableHeader>

          </DataTable>*/}
          <Dialog
            title='Create User'
            actions={createUserModalActions}
            modal
            open={this.state.createUserModalOpen}
            contentStyle={{ width: 400 }}
            onRequestClose={this.handleCreateUserModalClose}
          >
            <Paper zDepth={0}>
              <TextField
                hintText='Name' style={{
                  marginLeft: 20
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                hintText='Email address' style={{
                  marginLeft: 20
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                hintText='Password' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
            </Paper>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default UserList;
