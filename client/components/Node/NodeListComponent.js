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
} from '../../util/firebase';

import client from '../../util/lokka';


export default class NodeList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      createUserModalOpen: false,
      nodes: [],
      isSearching: false,
    };
  }

  componentDidMount() {
    this.userRootChildAdded = refs.node.root.orderByKey().on('child_added', (data) => {
      console.log(data.val());
      this.setState({ nodes: this.state.nodes.concat(data.val()) });
    });
  }

  componentWillUnmount() {
    refs.node.root.off('child_added', this.userRootChildAdded);
  }

  handleCreateNodeModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateNodeModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };

  handleCreateNodeModalCreate = () => {
    client.mutate(`{
     createNodeFromAdmin(
       input:{
         name: "${this.nameInput.getValue()}",
         address: "${this.addressInput.getValue()}",
         category1: "${this.firstCategoryInput.getValue()}",
         category2: "${this.secondCategoryInput.getValue()}",
         type: "${this.typeInput.getValue()}",
         lat: ${this.latInput.getValue()}
         lng: ${this.lngInput.getValue()}
       }
     ) {
       result
     }
   }`
    )
      .then(() => {
        this.setState({ createUserModalOpen: false });
      })
      .catch(console.log);
  };

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
        onTouchTap={this.handleCreateNodeModalClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleCreateNodeModalCreate}
      />,
    ];

    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Node</h3>
              <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleCreateNodeModalOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>
            </div>


            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                {/* <TextField*/}
                {/* onChange={this.onSearchQueryChange.bind(this)}*/}
                {/* floatingLabelText='Search User by E-mail...'*/}
                {/* />*/}
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
                    <TableHeaderColumn colSpan='4'>Name</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Address</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>lat</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>lng</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>CreatedAt</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.state.nodes.map((node) => {
                    const time = node.createdAt ? moment(node.createdAt).calendar() : 'N/A';
                    return (
                      <TableRow key={node.id}>
                        <TableRowColumn colSpan='4'>{node.name}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{node.address}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{node.lat}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{node.lng}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{`${time}`}</TableRowColumn>
                        <TableRowColumn colSpan='3'>
                          <Link to={`/node/${node.id}`}>
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
          <Dialog
            title='Create Node'
            actions={createUserModalActions}
            modal
            open={this.state.createUserModalOpen}
            contentStyle={{ width: 400 }}
            onRequestClose={this.handleCreateNodeModalClose}
          >
            <Paper zDepth={0}>
              <TextField
                ref={(ref) => { this.nameInput = ref; }}
                hintText='Name'
                style={{ marginLeft: 20 }}
                underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.addressInput = ref; }}
                hintText='Address'
                style={{ marginLeft: 20 }}
                underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.firstCategoryInput = ref; }}
                hintText='Category 1' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.secondCategoryInput = ref; }}
                hintText='Category 2' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.typeInput = ref; }}
                hintText='Type' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.latInput = ref; }}
                hintText='Lat' style={{
                  marginLeft: 20,
                }} underlineShow={false}
              />
              <Divider />
              <TextField
                ref={(ref) => { this.lngInput = ref; }}
                hintText='Lng' style={{
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
