import React from 'react';
import {
  Spinner
} from 'react-mdl';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
  {
    name: 'John Smith',
    status: 'Employed',
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
  {
    name: 'John Smith',
    status: 'Employed',
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
  {
    name: 'John Smith',
    status: 'Employed',
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  renderSpinner() {
    // if (true) {
    return (<Spinner />);
    // }
    // return null;
  }

  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          title='Create User'
          actions={actions}
          modal
          open={this.state.open}
          contentStyle={{ width: 400 }}
          onRequestClose={this.handleClose}
        >
          <Paper zDepth={0}>
            <TextField
              hintText='Last name' style={{
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
        <div style={{ width: '90%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 30, alignItems: 'center' }} >
              <h2> List of User</h2>
              <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>
            </div>
            <i style={{ paddingLeft: 31 }} >Action for selected user...</i>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label='Detail' style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block' secondary style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                />
                <RaisedButton
                  label='Unblock' primary style={{
                    margin: 12,
                  }}
                />

              </div>
              <div style={{ flex: 1, justifyContent: 'flex-end' }} />
              <TextField
                onChange={() => {}}
                floatingLabelText='Search User by E-mail...'
              />
            </div>
            <div style={{ float: 'clear' }} >
              <Table
                selectable
                fixedHeader
              >
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableRowColumn>{row.name}</TableRowColumn>
                      <TableRowColumn>{row.status}</TableRowColumn>
                    </TableRow>
              ))}
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
        </div>
      </div>
    );
  }
}
