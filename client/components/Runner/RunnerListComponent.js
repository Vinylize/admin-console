import React from 'react';
import { Link } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DataTable from '../Table/TableComponent';

import {
  refs
} from '../../util/firebase';

import store from '../../util/redux/redux.store';

const uploadBaseUrl = 'https://api.yetta.co/graphql?query=';

export default class RunnerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createUserModalOpen: false,
      tempUsers: [],
      users: [],
      items: [],
      selectedKey: -1,
      isSelected: false,
      searchBy: 'e',
      searchWord: '',
      searchedItems: [],
      isSearching: false,
      searchOptions: [
        { name: 'Email', value: 'e' },
        { name: 'Name', value: 'n' },
        { name: 'Phone Number', value: 'p' }
      ],
      pDisplay: 15,
      pCurrent: 1,
      pTotal: 0,
      sortBy: 'cAt',
      sortOrder: 'dsc',
      headers: [
        { name: 'Email', value: 'e', size: 3 },
        { name: 'Name', value: 'n', size: 2 },
        { name: 'Phone Number', value: 'p', size: 2 },
        { name: 'RunnerApprovedAt', value: 'rAAt', size: 3 },
        { name: 'CreatedAt', value: 'cAt', size: 3 },
        { name: 'State', value: 'isB', size: 2 }
      ],
      loadedAtOnce: 500,
      loadedCurrent: 0,
      sLoadedCurrent: 0
    };
  }

  componentDidMount() {
    this.handleLoadData();
  }

  onSearchQueryKeyPress(e) {
    if (e.charCode === 13) this.handleSearching(e.target.value);
  }

  onSearchQueryChange(e) {
    if (!e.target.value) this.handleSearching(null);
  }

  handleSearching = (word) => {
    if (word) {
      this.setState({ sLoadedCurrent: this.state.sLoadedCurrent + this.state.loadedAtOnce }, () => {
        this.setState({ searchWord: word }, () => {
          const searchQuery = refs.user.root.orderByChild('isRA').equalTo(true).limitToLast(this.state.sLoadedCurrent);

          searchQuery.once('value')
          .then((data) => {
            this.setState({
              searchedItems: data.val() ? Object.keys(data.val()).map(key => data.val()[key])
              .filter((item) => {
                if (item.id && item[this.state.searchBy] && item[this.state.searchBy].match(word)) return true;
                return false;
              }).sort((a, b) => {
                const sortBy = this.state.sortBy;
                if (this.state.sortOrder === 'asc') return this.ascSorting(a[sortBy], b[sortBy]);
                return this.dscSorting(a[sortBy], b[sortBy]);
              }) : [],
            }, () => {
              this.setState({ isSearching: true });
              this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length) });
              this.handleSetTotalPage(this.state.searchedItems.length);
            });
          });

          this.userSearchedChangedEvents = searchQuery.on('child_changed', (data) => {
            this.setState({
              searchedItems: this.state.searchedItems.map((item) => {
                if (item.id === data.val().id) return data.val();
                return item;
              }).filter((item) => {
                if (!item.isRA) return false;
                return true;
              }),
            }, () => {
              this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length) });
              this.handleSetTotalPage(this.state.searchedItems.length);
            });
          });

          this.userSearchedRemovedEvents = searchQuery.on('child_removed', (data) => {
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
          refs.user.root.off('child_changed', this.userSearchedChangedEvents);
          refs.user.root.off('child_removed', this.userSearchedRemovedEvents);
        }
      });
    }
  }

  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };

  handleApproveRunner = (e, uid) => {
    e.preventDefault();
    this.setState({ isSelected: false });
    const url = `${uploadBaseUrl}mutation{adminDisapproveRunner(input:{uid:"${uid}"}){result}}`;
    const token = store.getState().auth.token;
    return fetch(url,
      {
        method: 'POST',
        headers: {
          authorization: token
        }
      })
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          console.log(response.errors);
          alert(response.errors[0].message);
          return;
        }
        alert('The user is disapproved!');
      })
      .catch();
  }

  handleBlockUser = (e, uid, isB) => {
    e.preventDefault();
    this.setState({ isSelected: false });
    const url = isB ? `${uploadBaseUrl}mutation{adminUnblockUser(input:{uid:"${uid}"}){result}}` : `${uploadBaseUrl}mutation{adminBlockUser(input:{uid:"${uid}"}){result}}`;
    const token = store.getState().auth.token;
    return fetch(url,
      {
        method: 'POST',
        headers: {
          authorization: token
        }
      })
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          console.log(response.errors);
          alert(response.errors[0].message);
          return;
        }
        if (isB) alert('The user is unblocked!');
        else alert('Ther user is blocked!');
      })
      .catch();
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
    if (pCurrent === this.state.pTotal) this.handleLoadNextData();
  }

  handleSetTotalPage = (itemLength) => {
    const pTotal = Math.ceil(itemLength / this.state.pDisplay);
    if (pTotal < this.state.pCurrent) this.handleSetPage(1);
    if (pTotal !== this.state.pTotal) this.setState({ pTotal });
  }

  handleLoadNextData = () => {
    if (this.state.isSearching) this.handleSearching(this.state.searchWord);
    else this.handleLoadData();
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
    if (a > b || !b) return 1;
    else if (a < b || !a) return -1;
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
      const userLoadQuery = refs.user.root.orderByChild('isRA').equalTo(true).limitToLast(this.state.loadedCurrent);
      userLoadQuery.once('value')
      .then((data) => {
        this.setState({
          tempUsers: data.val() ? Object.keys(data.val()).map(key => data.val()[key]) : []
        }, () => {
          this.setState({ items: this.state.tempUsers }, () => {
            if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);

            this.userAddedEvents = userLoadQuery.on('child_added', (user) => {
              let isIn = false;
              const len = this.state.items.length;
              for (let i = 0; i < len; ++i) {
                if (this.state.items[i].id === user.val().id) {
                  isIn = true;
                  break;
                }
              }
              if (!isIn && user.child('isRA').val() === true) {
                this.setState({ items: this.state.items.concat(user.val()) }, () => {
                  this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
                  if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);
                });
              }
            });

            this.userChangedEvents = userLoadQuery.on('child_changed', (user) => {
              this.setState({
                items: this.state.items.map((item) => {
                  if (user.child('id').val() === item.id) return user.val();
                  return item;
                }).filter((item) => {
                  if (!item.isRA) return false;
                  return true;
                }),
                isSelected: false
              }, () => {
                this.setState({ isSelected: this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length) });
                if (!this.state.isSearching) this.handleSetTotalPage(this.state.items.length);
              });
            });

            this.userRemovedEvents = userLoadQuery.on('child_removed', (user) => {
              this.setState({
                items: this.state.items.filter((o) => {
                  if (user.child('id').val() === o.id) return false;
                  return true;
                }),
                isSelected: false
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
              <h3>List of Runners</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label={this.state.isSelected && items.length > 0 ? (<Link to={`/user/${items[this.state.selectedKey] ? items[this.state.selectedKey].id : ''}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
                  primary
                  disabled={!this.state.isSelected}
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block'
                  secondary
                  disabled={!this.state.isSelected || (items[this.state.selectedKey] && items[this.state.selectedKey].isB)}
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, (items[this.state.selectedKey] && items[this.state.selectedKey].id), false); }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled={!this.state.isSelected || (items[this.state.selectedKey] && !items[this.state.selectedKey].isB)}
                  style={{
                    margin: 12,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, (items[this.state.selectedKey] && items[this.state.selectedKey].id), true); }}
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
                  onClick={(e) => { this.handleApproveRunner(e, (items[this.state.selectedKey] && items[this.state.selectedKey].id), true); }}
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled={!this.state.isSelected}
                  secondary
                  style={{
                    margin: 12
                  }}
                  onClick={(e) => { this.handleApproveRunner(e, (items[this.state.selectedKey] && items[this.state.selectedKey].id), false); }}
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
                  floatingLabelText={'Search Runner...'}
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
              class='user'
              items={items}
              headers={this.state.headers}
              pCurrent={this.state.pCurrent}
              pDisplay={this.state.pDisplay}
              pTotal={this.state.pTotal}
              handleRowSelection={this.handleRowSelection}
              handleSetPage={this.handleSetPage}
              handleSetTotalPage={this.handleSetTotalPage}
              sortOrder={this.state.sortOrder}
              sortBy={this.state.sortBy}
              onClickSort={this.handleSorting}
              isSearching={this.state.isSearching}
              handleLoadNextData={this.handleLoadNextData}
              loadedAtOnce={this.state.loadedAtOnce}
            />
          </Paper>
        </div>
      </div>
    );
  }
}
