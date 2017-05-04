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
  firebase,
  refs
} from '../../util/firebase';

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
      sortBy: 'id',
      sortOrder: 'dsc',
      headers: [
        { name: 'Email', value: 'e', size: 3 },
        { name: 'Name', value: 'n', size: 2 },
        { name: 'Phone Number', value: 'p', size: 2 },
        { name: 'RunnerApprovedAt', value: 'rAAt', size: 3 },
        { name: 'CreatedAt', value: 'cAt', size: 3 },
        { name: 'State', value: 'isB', size: 2 }
      ],
      loadedAtOnce: 100,
      loadedCurrent: 0
    };
  }

  componentDidMount() {
    this.handleLoadData();
  }

  componentWillUnmount() {
    refs.user.root.off();
  }

  onSearchQueryChange(e) {
    this.handleSearching(e.target.value);
  }

  handleSearching = (word) => {
    if (word) {
      this.setState({
        searchedItems: this.state.items.filter((item) => {
          if (item[this.state.searchBy] && item[this.state.searchBy].match(word)) return true;
          return false;
        }),
        isSelected: false,
        isSearching: true,
        searchWord: word,
      }, () => {
        if (this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length)) this.setState({ isSelected: true });
        this.handleSetTotalPage(this.state.searchedItems.length);
      });
    } else {
      this.setState({ isSearching: false }, () => {
        if (this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length)) this.setState({ isSelected: true });
        this.handleSetTotalPage(this.state.items.length);
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
        alert('The user is disapproved!');
        setTimeout(() => {
          this.handleLoadData();
        }, 100);
      })
      .catch();
  }

  handleBlockUser = (e, uid, isB) => {
    e.preventDefault();
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
          this.handleLoadData();
        }, 100);
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
    if (pCurrent === this.state.pTotal) this.handleLoadData();
  }

  handleSetTotalPage = (itemLength) => {
    const pTotal = Math.ceil(itemLength / this.state.pDisplay);
    if (pTotal < this.state.pCurrent) this.handleSetPage(1);
    if (pTotal !== this.state.pTotal) this.setState({ pTotal });
  }

  handleSorting = (e, prop) => {
    const sortOrder = this.state.sortOrder;
    const sortBy = this.state.sortBy;
    this.setState({
      items: prop !== 'No' ? this.state.items.sort((a, b) => {
        if (((sortOrder === 'asc' || sortBy !== prop) && e) || (sortOrder === 'dsc' && !e)) {
          if (a[prop] > b[prop] || !a[prop]) return 1;
          else if (a[prop] < b[prop] || !b[prop]) return -1;
          return 0;
        }
        if (a[prop] < b[prop] || !b[prop]) return 1;
        else if (a[prop] > b[prop] || !a[prop]) return -1;
        return 0;
      }) : this.state.items.reverse()
    }, () => {
      if (e) {
        const nextSortOrder = this.state.sortOrder === 'asc' ? 'dsc' : 'asc';
        this.setState({ sortOrder: this.state.sortBy === prop ? nextSortOrder : 'dsc' });
        this.setState({ sortBy: prop });
      }
      if (this.state.isSearching) this.handleSearching(this.state.searchWord);
    });
  }

  handleLoadData = () => {
    this.setState({
      loadedCurrent: this.state.loadedCurrent + this.state.loadedAtOnce
    }, () => {
      this.userRootEvents = refs.user.root.orderByKey().limitToFirst(this.state.loadedCurrent);
      this.userRootEvents.once('value')
      .then((data) => {
        this.setState({
          tempUsers: Object.keys(data.val()).map(key => data.val()[key])
          .filter((user) => {
            if (user.isRA === true && user.id) return true;
            return false;
          })
        }, () => {
          this.setState({ users: this.state.tempUsers }, () => {
            this.setState({ items: this.state.users }, () => {
              this.handleSetTotalPage(this.state.users.length);
              this.userRootEvents.on('child_added', (user) => {
                let isIn = false;
                const len = this.state.users.length;
                for (let i = 0; i < len; ++i) {
                  if (this.state.users[i].id === user.val().id) {
                    isIn = true;
                    break;
                  }
                }
                if (user.child('isRA').val() === true && user.child('id').val() && !isIn) {
                  this.setState({ users: this.state.users.concat(user.val()) }, () => {
                    this.setState({ items: this.state.users });
                    this.handleSetTotalPage();
                  });
                }
              });
              this.userRootEvents.on('child_changed', (user) => {
                let isIn = false;
                this.setState({
                  users: this.state.users.map((u) => {
                    if (user.child('id').val() === u.id) {
                      isIn = true;
                      return user.val();
                    }
                    return u;
                  })
                }, () => {
                  if (user.child('isRA').val() === true && user.child('id').val() && !isIn) {
                    this.setState({ users: this.state.users.concat(user.val()) }, () => {
                      this.setState({ items: this.state.users });
                      this.handleSetTotalPage();
                    });
                  }
                });
              });
              this.userRootEvents.on('child_removed', (user) => {
                this.setState({
                  users: this.state.users.filter((o) => {
                    if (user.child('id').val() === o.id) {
                      return false;
                    }
                    return true;
                  })
                }, () => {
                  this.setState({ items: this.state.users });
                  this.handleSetTotalPage();
                });
              });
              setTimeout(() => {
                this.handleSorting(null, this.state.sortBy);
              }, 500);
            });
          });
        });
      });
    });
  }

  handleChangeSearchBy = (e, i, v) => {
    this.setState({ searchBy: v }, () => {
      if (this.state.isSearching) this.handleSearching(this.state.searchWord);
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
                  label={this.state.isSelected && items.length > 0 ? (<Link to={`/runner/${items[this.state.selectedKey].id}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
                  primary
                  disabled={!this.state.isSelected}
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block'
                  secondary
                  disabled={!this.state.isSelected || items[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, items[this.state.selectedKey].id, false); }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled={!this.state.isSelected || !items[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, items[this.state.selectedKey].id, true); }}
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
                  onClick={(e) => { this.handleApproveRunner(e, items[this.state.selectedKey].id, true); }}
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled={!this.state.isSelected}
                  secondary
                  style={{
                    margin: 12
                  }}
                  onClick={(e) => { this.handleApproveRunner(e, items[this.state.selectedKey].id, false); }}
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
                  floatingLabelText={'Search Runner...'}
                />
                <SelectField
                  floatingLabelText='SEARCH BY'
                  value={this.state.searchBy}
                  onChange={this.handleChangeSearchBy}
                >
                  {this.state.searchOptions.map(option => (
                    <MenuItem key={option.value} value={option.value} primaryText={option.name} />
                  ))}
                </SelectField>
                <div style={{ paddingLeft: 20, width: 40, height: 40 }}>
                  {this.renderSpinner()}
                </div>

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
            />
          </Paper>
        </div>
      </div>
    );
  }
}
