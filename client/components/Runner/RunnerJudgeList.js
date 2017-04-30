import React from 'react';
import moment from 'moment';

import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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

export default class RunnerJudgeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idImageModalOpen: false,
      users: [],
      selectedKey: 0,
      isSelected: false,
      isSearching: false,
      idImageUrl: '',
    };
    this.handleIdImageModalOpen = this.handleIdImageModalOpen.bind(this);
    this.handleIdImageModalClose = this.handleIdImageModalClose.bind(this);
    this.handleApproveRunner = this.handleApproveRunner.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (data) => {
        if (data.child('isWJ').val() === true) this.setState({ users: this.state.users.concat(data.val()) });
      });
    }, 100);
  }

  componentWillUnmount() {
    refs.user.root.off('child_added', this.userRootChildAdded);
  }

  onSearchQueryChange(evt) {
    this.setState({ isSearching: true });
    setTimeout(() => {
      this.setState({ isSearching: false });
    }, 4000);
    console.log(evt.target.value);
  }

  handleIdImageModalOpen = (evt, idUrl) => {
    this.setState({ idImageModalOpen: true });
    this.setState({ idUrl });
  };

  handleIdImageModalClose = () => {
    this.setState({ idImageModalOpen: false });
    this.setState({ idUrl: '' });
  };

  handleApproveRunner = (evt, uid, isA) => {
    evt.preventDefault();
    this.setState({ isSelected: false });
    const url = isA ? `${uploadBaseUrl}mutation{adminApproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}` : `${uploadBaseUrl}mutation{adminDisapproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}`;
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
        if (isA) alert('The user is approved!');
        else alert('The user is disapproved!');
        setTimeout(() => {
          this.setState({ users: [] });
          this.userRootChildAdded = refs.user.root.orderByKey().on('child_added', (data) => {
            if (data.child('isWJ').val() === true) this.setState({ users: this.state.users.concat(data.val()) });
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
            if (data.child('isWJ').val() === true) this.setState({ users: this.state.users.concat(data.val()) });
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
    const idImageModalActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleIdImageModalClose}
      />
    ];
    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Users Waiting for Judge</h3>
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
                  disabled={!this.state.isSelected}
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
                    <TableHeaderColumn colSpan='2'>Identification</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Email</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>phoneNumber</TableHeaderColumn>
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
                    return (
                      <TableRow key={user.id} onClick={this.handleRowSelection} selected={this.state.setSel}>
                        <TableRowColumn colSpan='2'>
                          <button onClick={({ evt }) => this.handleIdImageModalOpen(evt, user.idUrl)} style={{ border: 0, outline: 0, background: 'none' }}>
                            <img
                              width={75}
                              role='presentation'
                              src={user.idUrl}
                              style={{ cursor: 'pointer' }}
                            />
                          </button>
                        </TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.e}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.n}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.p}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${cTime}`}</TableRowColumn>
                        <TableHeaderColumn colSpan='2'>{user.isB ? 'Blocked' : 'Unblocked'}</TableHeaderColumn>
                        <TableRowColumn colSpan='2'>
                          <Link to={`/runner/${user.id}`}>
                            <RaisedButton
                              label='Details'
                              primary
                              style={{
                                margin: 5
                              }}
                            />
                          </Link>
                        </TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>

          </Paper>
          <Dialog
            title='Identification'
            actions={idImageModalActions}
            modal
            open={this.state.idImageModalOpen}
            contentStyle={{ width: 500 }}
            onRequestClose={this.idImageModalClose}
          >
            <Paper zDepth={0}>
              <img
                width={400}
                role='presentation'
                src={this.state.idUrl}
                style={{
                  cursor: 'pointer',
                  margin: 20
                }}
              />
            </Paper>
          </Dialog>
        </div>
      </div>
    );
  }
}
