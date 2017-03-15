import React from 'react';
import {
  Spinner
} from 'react-mdl';
import moment from 'moment';

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

export default class UserList extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      createUserModalOpen: false,
    };
  }

  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };


  renderSpinner() {
    // if (true) {
    return (<Spinner />);
    // }
    // return null;
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
        <div style={{ width: '90%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of user</h3>
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
                  onChange={() => {}}
                  floatingLabelText='Search User by E-mail...'
                />
                <div style={{ paddingLeft: 20, width: 40, height: 40 }}>
                  <CircularProgress size={25} thickness={2} />
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
                    <TableHeaderColumn>Email</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>phoneNumber</TableHeaderColumn>
                    <TableHeaderColumn>isPhoneValid</TableHeaderColumn>
                    <TableHeaderColumn>CreatedAt</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.props.viewer.users.edges.map((edge) => {
                    const time = moment(edge.node.createdAt).calendar();

                    return (
                      <TableRow key={edge.node.id}>
                        <TableRowColumn>{edge.node.email}</TableRowColumn>
                        <TableRowColumn>{edge.node.name}</TableRowColumn>
                        <TableRowColumn>{edge.node.phoneNumber}</TableRowColumn>
                        <TableRowColumn>{edge.node.isPhoneValid ? 'OK' : ''}</TableRowColumn>
                        <TableRowColumn>{`${time}`}</TableRowColumn>
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
