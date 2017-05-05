import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
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
      itmes: [],
      selectedKey: -1,
      isSelected: false,
      searchBy: 'oName',
      searchWord: '',
      isSearching: false,
      searchedItems: [],
      searchOptions: [
        { name: 'Orderer', value: 'oName' },
        { name: 'Runner', value: 'rName' },
        { name: 'Node', value: 'nName' }
      ],
      pDisplay: 15,
      pCurrent: 1,
      pTotal: 0,
      sortBy: 'cAt',
      sortOrder: 'dsc',
      headers: [
        { name: 'Orderer', value: 'oName', size: 2 },
        { name: 'Runner', value: 'rName', size: 2 },
        { name: 'Node', value: 'nName', size: 3 },
        { name: 'EDP', value: 'eDP', size: 2 },
        { name: 'Total Price', value: 'tP', size: 2 },
        { name: 'Currency', value: 'curr', size: 1 },
        { name: 'createdAt', value: 'cAt', size: 3 }
      ],
      loadedAtOnce: 500,
      loadedCurrent: 0,
      sLoadedCurrent: 0
    };
  }

  componentDidMount() {
    this.handleLoadData();
  }

  componentWillUnmount() {
    refs.order.root.off();
  }

  onSearchQueryKeyPress(e) {
    if (e.charCode === 13) this.handleSearching(e.target.value);
  }

  onSearchQueryChange(e) {
    if (!e.target.value) this.handleSearching(null);
  }

  setNameFromId = (item) => {
    /* eslint-disable no-param-reassign */
    if (item) {
      if (item.oId) {
        refs.user.root.child(item.oId).child('n').once('value')
        .then((o) => {
          item.oName = item.oId ? o.val() : '';
        });
      }
      if (item.rId) {
        refs.user.root.child(item.rId).child('n').once('value')
        .then((r) => {
          item.rName = item.oId ? r.val() : '';
        });
      }
      if (item.nId) {
        refs.node.root.child(item.nId).child('n').once('value')
        .then((n) => {
          item.nName = item.nId ? n.val() : '';
        });
      }
    }
    /* eslint-enable no-param-reassign */
    return item;
  }

  handleSearching = (word) => {
    if (word) {
      this.setState({ sLoadedCurrent: this.state.sLoadedCurrent + this.state.loadedAtOnce }, () => {
        this.setState({ searchWord: word }, () => {
          const searchQuery = refs.order.root.orderByChild('cAt').limitToFirst(this.state.sLoadedCurrent);

          searchQuery.once('value')
          .then((data) => {
            this.setState({
              searchedItems: data.val() ? Object.keys(data.val()).map(key => this.setNameFromId(data.val()[key]))
              .sort((a, b) => {
                const sortBy = this.state.sortBy;
                if (this.state.sortOrder === 'asc') return this.ascSorting(a[sortBy], b[sortBy]);
                return this.dscSorting(a[sortBy], b[sortBy]);
              }) : []
            }, () => {
              setTimeout(() => {
                this.setState({
                  searchedItems: this.state.searchedItems.filter((item) => {
                    if (item.id && item[this.state.searchBy] && item[this.state.searchBy].match(word)) return true;
                    return false;
                  })
                }, () => {
                  this.setState({ isSearching: true });
                  this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length) });
                  this.handleSetTotalPage(this.state.searchedItems.length);
                });
              }, 1000);
            });
          });

          this.orderSearchedChangedEvents = searchQuery.on('child_changed', (data) => {
            this.setState({
              searchedItems: this.state.searchedItems.map((item) => {
                if (item.id === data.val().id) return this.setNameFromId(data.val());
                return item;
              })
            }, () => {
              this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length) });
              this.handleSetTotalPage(this.state.searchedItems.length);
            });
          });

          this.orderSearchedRemovedEvents = searchQuery.on('child_removed', (data) => {
            this.setState({
              searchedItems: this.state.searchedItems.filter((item) => {
                if (item.id === data.val().id) return false;
                return true;
              })
            }, () => {
              this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length) });
              this.handleSetTotalPage(this.state.searchedItems.length);
            });
          });
        });
      });
    } else {
      this.setState({ isSearching: false, sLoadedCurrent: 0 }, () => {
        this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
        this.handleSetTotalPage(this.state.items.length);
        if (this.state.searchedItems.length) {
          refs.order.root.off('child_changed', this.orderSearchedChangedEvents);
          refs.order.root.off('child_removed', this.orderSearchedRemovedEvents);
        }
      });
    }
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
    if (pCurrent === this.state.pTotal) {
      if (this.state.isSearching) this.handleSearching(this.state.searchWord);
      else this.handleLoadData();
    }
  }

  handleSetTotalPage = (itemLength) => {
    const pTotal = Math.ceil(itemLength / this.state.pDisplay) === 0 ? 1 : Math.ceil(itemLength / this.state.pDisplay);
    if (pTotal < this.state.pCurrent) this.handleSetPage(1);
    if (pTotal !== this.state.pTotal) this.setState({ pTotal });
  }

  handleSorting = (e, prop) => {
    const sortOrder = this.state.sortOrder;
    const sortBy = this.state.sortBy;
    if (((sortOrder === 'asc' || sortBy !== prop) && e) || (sortOrder === 'dsc' && !e)) {
      this.setState({ items: this.state.items.sort((a, b) => this.dscSorting(a[prop], b[prop])) });
      this.setState({ searchedItems: this.state.searchedItems.sort((a, b) => this.dscSorting(a[prop], b[prop])) });
    } else {
      this.setState({ items: this.state.items.sort((a, b) => this.ascSorting(a[prop], b[prop])) });
      this.setState({ searchedItems: this.state.searchedItems.sort((a, b) => this.ascSorting(a[prop], b[prop])) });
    }
    if (e) {
      const nextSortOrder = this.state.sortOrder === 'asc' ? 'dsc' : 'asc';
      this.setState({ sortOrder: this.state.sortBy === prop ? nextSortOrder : 'dsc' });
      this.setState({ sortBy: prop });
    }
  }

  ascSorting = (a, b) => {
    if (a > b || !a) return 1;
    else if (a < b || !b) return -1;
    return 0;
  }

  dscSorting = (a, b) => {
    if (a > b || !b) return -1;
    else if (a < b || !a) return 1;
    return 0;
  }

  handleLoadData = () => {
    this.setState({
      loadedCurrent: this.state.loadedCurrent + this.state.loadedAtOnce
    }, () => {
      const loadQuery = refs.order.root.orderByChild('cAt').limitToFirst(this.state.loadedCurrent);
      loadQuery.once('value')
      .then((data) => {
        this.setState({
          tempOrders: data.val() ? Object.keys(data.val()).map(key => this.setNameFromId(data.val()[key])) : []
        }, () => {
          this.setState({ items: this.state.tempOrders }, () => {
            if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);

            this.orderAddedEvents = loadQuery.on('child_added', (order) => {
              let isIn = false;
              const len = this.state.items.length;
              for (let i = 0; i < len; ++i) {
                if (this.state.items[i].id === order.val().id) {
                  isIn = true;
                  break;
                }
              }
              if (!isIn) {
                this.setState({ items: this.state.items.concat(this.setNameFromId(order.val())) }, () => {
                  this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
                  if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);
                });
              }
            });

            this.orderChangedEvents = loadQuery.on('child_changed', (order) => {
              this.setState({
                items: this.state.items.map((o) => {
                  if (order.child('id').val() === o.id) return this.setNameFromId(order.val());
                  return o;
                })
              }, () => {
                this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
                if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);
              });
            });

            this.orderRemovedEvents = loadQuery.on('child_removed', (order) => {
              this.setState({
                items: this.state.items.filter((o) => {
                  if (order.child('id').val() === o.id) return false;
                  return true;
                })
              }, () => {
                this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
                if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);
              });
            });

            setTimeout(() => {
              this.handleSorting(null, this.state.sortBy);
            }, 100);
          });
        });
      });
    });
  }

  handleChangeSearchBy = (e, i, v) => {
    this.setState({ searchBy: v }, () => {
      // if (this.state.isSearching) this.handleSearching(this.state.searchWord);
    });
  }

  renderSpinner() {
    if (this.state.isSearching) {
      return (<CircularProgress size={25} thickness={2} />);
    }
    return null;
  }

  render() {
    const items = this.state.isSearching ? this.state.searchedItems : this.state.items;
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
                  onKeyPress={this.onSearchQueryKeyPress.bind(this)}
                  onChange={this.onSearchQueryChange.bind(this)}
                  floatingLabelText={'Search Order...'}
                />
                <SelectField
                  floatingLabelText='SEARCH BY'
                  value={this.state.searchBy}
                  onChange={this.handleChangeSearchBy}
                  style={{
                    width: 180,
                    marginLeft: 20
                  }}
                >
                  {this.state.searchOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} primaryText={option.name} />
                  ))}
                </SelectField>
                <div style={{ paddingLeft: 20, width: 40, height: 40 }}>
                  {this.renderSpinner()}
                </div>
                <div style={{ textAlign: 'right', marginRight: 0 }}><h5>{`${items ? items.length : 0} Searched!`}</h5></div>
              </div>
            </div>
            <DataTable
              class='order'
              items={items}
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
