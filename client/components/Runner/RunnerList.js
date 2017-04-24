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

import { refs } from '../../util/firebase';

export default class RunnerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createUserModalOpen: false,
      users: [],
      isSearching: false,
    };
  }

  componentDidMount() {
    this.userRootChildAdded = refs.user.root.orderByChild('isRA').equalTo(true).on('child_added', (data) => {
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
  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };


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
              <h3>List of runner</h3>
              {/* <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleCreateUserModalOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>*/}
            </div>
            {/* <i style={{ paddingLeft: 31 }} >Action for selected user...</i>*/}
            {/* <i style={{ paddingLeft: 31 }} >{this.props.viewer.users}</i>*/}


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
                    <TableHeaderColumn colSpan='4'>Email</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>phoneNumber</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>runnerApprovedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.state.users.map((user) => {
                    const cTime = moment(user.cAt).calendar();
                    const rATime = moment(user.rAAt).calendar();
                    return (
                      <TableRow key={user.id}>
                        <TableRowColumn colSpan='4'>{user.e}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.n}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{user.p}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${rATime}`}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${cTime}`}</TableRowColumn>
                        <TableRowColumn colSpan='3'>
                          <Link to={`/runner/${user.id}`}>
                            <RaisedButton label='Details' primary />
                          </Link>
                          {/* </RaisedButton>*/}
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
          {/* <Dialog
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
          </Dialog>*/}
        </div>
      </div>
    );
  }
}
