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
      isSearching: false,
      idImageUrl: '',
    };
    this.handleIdImageModalOpen = this.handleIdImageModalOpen.bind(this);
    this.handleIdImageModalClose = this.handleIdImageModalClose.bind(this);
    this.handleApproveRunner = this.handleApproveRunner.bind(this);
  }

  componentDidMount() {
    this.userRootChildAdded = refs.user.root.orderByChild('isWJ').equalTo(true).on('child_added', (data) => {
      this.setState({ users: this.state.users.concat(data.val()) });
    });
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

  handleApproveRunner = (evt, uid, approve) => {
    evt.preventDefault();
    // TODO: do something with -> this.state.file
    const url = approve ? `${uploadBaseUrl}mutation{adminApproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}` : `${uploadBaseUrl}mutation{adminDisapproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}`;
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
        console.log(response.data);
        setTimeout(() => {
          this.setState({ users: [] });
          this.userRootChildAdded = refs.user.root.orderByChild('isWJ').equalTo(true).on('child_added', (data) => {
            if (data.val()) this.setState({ users: this.state.users.concat(data.val()) });
          });
        }, 200);
      })
      .catch();
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
              <h3>List of user waiting for judge</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label='Detail'
                  disabled
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block'
                  secondary
                  disabled
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='APPROVE'
                  primary
                  disabled
                  style={{
                    margin: 12,
                    marginLeft: 50,
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
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn colSpan='2'>Identification</TableHeaderColumn>
                    <TableHeaderColumn colSpan='4'>Email</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>phoneNumber</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='4'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.state.users.map((user) => {
                    const cTime = moment(user.cAt).calendar();
                    return (
                      <TableRow key={user.id}>
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
                        <TableRowColumn colSpan='4'>{user.e}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.n}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.p}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${cTime}`}</TableRowColumn>
                        <TableRowColumn colSpan='4'>
                          <Link to={`/runner/${user.id}`}>
                            <RaisedButton
                              label='Details'
                              primary
                              style={{
                                margin: 5
                              }}
                            />
                          </Link>
                          <br />
                          <RaisedButton
                            label='Approve'
                            backgroundColor='#a4c639'
                            labelColor='#FFFFFF'
                            style={{
                              margin: 5
                            }}
                            onClick={({ evt }) => this.handleApproveRunner(evt, user.id, true)}
                          />
                          <RaisedButton
                            label='Disapprove'
                            secondary
                            style={{
                              margin: 5
                            }}
                            onClick={({ evt }) => this.handleApproveRunner(evt, user.id, false)}
                          />
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
