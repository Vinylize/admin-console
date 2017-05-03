import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import DataTable from '../Table/TableComponent';

import { refs } from '../../util/firebase';

class OrderList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      tempOrders: [],
      orders: [],
      selectedKey: 0,
      isSelected: false,
      isSearching: false,
      pDisplay: 15,
      pCurrent: 1,
      pTotal: 0,
      sortBy: 'id',
      sortOrder: 'asc',
      headers: [
        { name: 'Orderer', value: 'oDd', size: 2 },
        { name: 'Runner', value: 'rId', size: 2 },
        { name: 'Node', value: 'nId', size: 3 },
        { name: 'EDP', value: 'eDP', size: 2 },
        { name: 'Total Price', value: 'tP', size: 2 },
        { name: 'Currency', value: 'curr', size: 1 },
        { name: 'createdAt', value: 'cAt', size: 3 }
      ],
      loadedAtOnce: 100,
      loadedCurrent: 0,
    };
  }

  componentDidMount() {
    this.handleLoadData();
  }

  componentWillUnmount() {
    refs.order.root.off();
  }

  onSearchQueryChange(e) {
    this.setState({ isSearching: true });
    setTimeout(() => {
      this.setState({ isSearching: false });
    }, 4000);
    console.log(e.target.value);
  }

  handleRowSelection = (keys) => {
    this.setState({ selectedKey: 0 }, () => {
      if (keys.length > 0) {
        keys.map((key) => {
          this.setState({ selectedKey: key + ((this.state.pCurrent - 1) * this.state.pDisplay) });
          return key;
        });
        this.setState({ isSelected: true });
      } else if (keys.length === 0) {
        this.setState({ isSelected: false });
      }
    });
  }

  handleSetPage = (pCurrent) => {
    this.setState({ selectedKey: (this.state.selectedKey % this.state.pDisplay) + ((pCurrent - 1) * this.state.pDisplay) });
    if (pCurrent !== this.state.pCurrent) this.setState({ pCurrent });
    if (pCurrent === this.state.pTotal) this.handleLoadData();
  }

  handleSetTotalPage = (itemLength) => {
    const pTotal = Math.ceil(itemLength / this.state.pDisplay);
    if (pTotal !== this.state.pTotal) this.setState({ pTotal });
  }

  handleSorting = (e, prop) => {
    const sortOrder = this.state.sortOrder;
    const sortBy = this.state.sortBy;
    this.setState({
      orders: prop !== 'No' ? this.state.orders.sort((a, b) => {
        if (((sortOrder === 'asc' || sortBy !== prop) && e) || (sortOrder === 'dsc' && !e)) {
          if (!a[prop]) return -1;
          if (a[prop] > b[prop]) return 1;
          else if (a[prop] < b[prop]) return -1;
          return 0;
        }
        if (!a[prop]) return 1;
        if (a[prop] < b[prop]) return 1;
        else if (a[prop] > b[prop]) return -1;
        return 0;
      }) : this.state.orders.reverse()
    }, () => {
      if (e) {
        const nextSortOrder = this.state.sortOrder === 'asc' ? 'dsc' : 'asc';
        this.setState({ sortOrder: this.state.sortBy === prop ? nextSortOrder : 'dsc' });
        this.setState({ sortBy: prop });
      }
    });
  }

  handleLoadData = () => {
    this.setState({ isLoading: true });
    this.setState({
      loadedCurrent: this.state.loadedCurrent + this.state.loadedAtOnce
    }, () => {
      this.orderRootEvents = refs.order.root.orderByKey().limitToFirst(this.state.loadedCurrent);
      this.orderRootEvents.once('value')
      .then((data) => {
        this.setState({
          tempOrders: Object.keys(data.val()).map(key => data.val()[key])
        }, () => {
          this.setState({ orders: this.state.tempOrders }, () => {
            this.handleSetTotalPage(this.state.orders.length);
            this.orderRootEvents.on('child_added', (order) => {
              let isIn = false;
              const len = this.state.orders.length;
              for (let i = 0; i < len; ++i) {
                if (this.state.orders[i].id === order.val().id) {
                  isIn = true;
                  break;
                }
              }
              if (!isIn) {
                this.setState({ orders: this.state.orders.concat(order.val()) }, () => {
                  this.handleSetTotalPage(this.state.orders.length);
                });
              }
            });
            this.orderRootEvents.on('child_changed', (order) => {
              let isIn = false;
              this.setState({
                orders: this.state.orders.map((o) => {
                  if (order.child('id').val() === o.id) {
                    isIn = true;
                    return order.val();
                  }
                  return o;
                })
              }, () => {
                if (!isIn) {
                  this.setState({ orders: this.state.orders.concat(order.val()) }, () => {
                    this.handleSetTotalPage(this.state.orders.length);
                  });
                }
              });
            });
            this.orderRootEvents.on('child_removed', (order) => {
              this.setState({
                orders: this.state.orders.filter((o) => {
                  if (order.child('id').val() === o.id) {
                    return false;
                  }
                  return true;
                })
              }, () => {
                this.handleSetTotalPage(this.state.orders.length);
              });
            });
            setTimeout(() => { this.handleSorting(null, this.state.sortBy); }, 1000);
          });
        });
      });
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
              <h3>List of Orders</h3>
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
            <DataTable
              class='order'
              items={this.state.orders}
              headers={this.state.headers}
              pCurrent={this.state.pCurrent}
              pDisplay={this.state.pDisplay}
              pTotal={this.state.pTotal}
              handleRowSelection={this.handleRowSelection}
              handleSetPage={this.handleSetPage}
              sortOrder={this.state.sortOrder}
              sortBy={this.state.sortBy}
              onClickSort={this.handleSorting}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default OrderList;
