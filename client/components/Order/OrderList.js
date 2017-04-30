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

class UserList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      tempOrders: [],
      orders: [],
      isSearching: false,
    };
  }

  componentDidMount() {
    refs.order.root.once('value', (data) => {
      this.setState({
        tempOrders: Object.keys(data.val()).map(key => data.val()[key])
      }, () => {
        this.setState({ orders: this.state.tempOrders }, () => {
          this.orderRootChildAdded = refs.order.root.orderByKey().on('child_added', (order) => {
            let isIn = false;
            const len = this.state.orders.length;
            for (let i = 0; i < len; ++i) {
              if (this.state.orders[i].id === order.val().id) {
                isIn = true;
                break;
              }
            }
            if (!isIn) this.setState({ orders: this.state.orders.concat(order.val()) });
          });
        });
      });
    });
    this.orderRootChildChanged = refs.order.root.orderByKey().on('child_changed', (data) => {
      let isIn = false;
      this.setState({
        orders: this.state.orders.map((order) => {
          if (data.child('id').val() === order.id) {
            isIn = true;
            return data.val();
          }
          return order;
        })
      }, () => {
        if (!isIn) this.setState({ orders: this.state.orders.concat(data.val()) });
      });
    });
  }

  componentWillUnmount() {
    refs.order.root.off('child_added', this.orderRootChildAdded);
    refs.order.root.off('child_changed', this.orderRootChildAdded);
  }

  onSearchQueryChange(e) {
    this.setState({ isSearching: true });
    setTimeout(() => {
      this.setState({ isSearching: false });
    }, 4000);
    console.log(e.target.value);
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
              <h3>List of Orders</h3>
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
                    <TableHeaderColumn colSpan='3'>Orderer</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Runner</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Node</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>EDP</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>Total Price</TableHeaderColumn>
                    <TableHeaderColumn colSpan='2'>State</TableHeaderColumn>
                    <TableHeaderColumn colSpan='3'>Action</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.state.orders.map((order) => {
                    const time = moment(order.cAt).calendar();
                    return (
                      <TableRow key={order.id}>
                        <TableRowColumn colSpan='3'>{refs.user.root.child(order.oId).name}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{order.rId ? refs.user.root.child(order.rId).name : ''}</TableRowColumn>
                        <TableRowColumn colSpan='3'>{refs.node.root.child(order.nId).name}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{order.eDP}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{order.tP}</TableRowColumn>
                        <TableRowColumn colSpan='2'>{time}</TableRowColumn>
                        <TableRowColumn colSpan='3'>
                          <Link to={`/order/${order.id}`}>
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

export default UserList;
