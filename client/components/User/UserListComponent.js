import React from 'react';
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
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DataTable from '../Table/TableComponent';

import {
  refs,
  firebase
} from '../../util/firebase';

const uploadBaseUrl = 'http://localhost:5002/graphql?query=';

class UserList extends React.Component {
  // static propTypes = {
  //   viewer: React.PropTypes.object.isRequired
  // };

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
        { name: 'Phone Number', value: 'p', size: 3 },
        { name: 'isPhoneValid', value: 'isPV', size: 2 },
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

  componentWillUnmount() {
    refs.user.root.off();
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
          const searchQuery = refs.user.root.orderByChild('permission').equalTo(null).limitToFirst(this.state.sLoadedCurrent);

          searchQuery.once('value')
          .then((data) => {
            this.setState({
              searchedItems: data.val() ? Object.keys(data.val()).map(key => data.val()[key])
              .filter((item) => {
                if (item.id && item[this.state.searchBy] && item[this.state.searchBy].match(word)) return true;
                return false;
              }).sort((a, b) => {
                const sortBy = this.state.sortBy;
                if (this.state.sortOrder === 'asc') {
                  return this.ascSorting(a[sortBy], b[sortBy]);
                }
                return this.dscSorting(a[sortBy], b[sortBy]);
              }) : [],
              isSelected: false
            }, () => {
              this.setState({ isSearching: true });
              if (this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.searchedItems.length)) this.setState({ isSelected: true });
              this.handleSetTotalPage(this.state.searchedItems.length);
            });
          });

          this.userSearchedChangedEvents = searchQuery.on('child_changed', (data) => {
            this.setState({
              searchedItems: this.state.searchedItems.map((item) => {
                if (item.id === data.val().id) return data.val();
                return item;
              }).filter((item) => {
                if (!item.id && item.permission === 'admin') return false;
                return true;
              })
            });
          });

          this.userSearchedRemovedEvents = searchQuery.on('child_removed', (data) => {
            this.setState({
              searchedItems: this.state.searchedItems.filter((item) => {
                if (item.id === data.val().id) return false;
                return true;
              })
            });
          });
        });
      });
    } else {
      setTimeout(() => {
        this.setState({ isSearching: false, sLoadedCurrent: 0 }, () => {
          if (this.state.selectedKey >= 0 && (this.state.selectedKey < this.state.items.length)) this.setState({ isSelected: true });
          if (this.state.searchedItems.length) {
            refs.user.root.off('child_changed', this.userSearchedChangedEvents);
            refs.user.root.off('child_removed', this.userSearchedRemovedEvents);
          }
          this.handleSetTotalPage(this.state.items.length);
        });
      }, 100);
    }
  }

  handleCreateUserModalOpen = () => {
    this.setState({ createUserModalOpen: true });
  };

  handleCreateUserModalClose = () => {
    this.setState({ createUserModalOpen: false });
  };

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
          const len = this.state.isSearching ? this.state.searchedItems.length : this.state.items.length;
          if (this.state.selectedKey >= 0 && (this.state.selectedKey < len)) this.setState({ isSelected: true });
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
    if (pCurrent === this.state.pTotal) {
      if (this.state.isSearching) this.handleSearching(this.state.searchWord);
      else this.handleLoadData();
    }
  }

  handleSetTotalPage = (itemLength) => {
    const pTotal = Math.ceil(itemLength / this.state.pDisplay);
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
      const userLoadQuery = refs.user.root.orderByChild('permission').equalTo(null).limitToFirst(this.state.loadedCurrent);
      userLoadQuery.once('value')
      .then((data) => {
        this.setState({
          tempUsers: data.val() ? Object.keys(data.val()).map(key => data.val()[key]).filter(key => key.id) : []
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
              if (!isIn && user.child('permission').val() !== null) {
                this.setState({ items: this.state.items.concat(user.val()) }, () => {
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
                  if (item.permission === 'admin' && !item.id) return false;
                  return true;
                }),
                isSelected: false
              }, () => {
                const len = this.state.isSearching ? this.state.searchedItems.length : this.state.items.length;
                if (this.state.selectedKey >= 0 && (this.state.selectedKey < len)) this.setState({ isSelected: true });
                if (!this.state.isSearching) this.handleSetTotalPage(len);
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
                const len = this.state.isSearching ? this.state.searchedItems.length : this.state.items.length;
                if (this.state.selectedKey >= 0 && (this.state.selectedKey < len)) this.setState({ isSelected: true });
                if (!this.state.isSearching) this.handleSetTotalPage(len);
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
      // if (this.state.isSearching) this.handleSearching(this.state.searchWord, true);
    });
  }

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
        onTouchTap={this.handleCreateUserModalClose}
      />,
      <FlatButton
        label='Create'
        primary
        onTouchTap={this.handleCreateUserModalClose}
      />,
    ];
    const items = this.state.isSearching ? this.state.searchedItems : this.state.items;
    return (
      <div>
        <div style={{ width: '100%', margin: 'auto' }}>
          <Paper>
            <div style={{ display: 'flex', height: 150, flexDirection: 'row', paddingLeft: 30, paddingRight: 40, alignItems: 'center' }} >
              <h3>List of Users</h3>
              <div style={{ display: 'flex', height: 56, flex: 1, justifyContent: 'flex-end', }}>
                <FloatingActionButton onClick={this.handleCreateUserModalOpen}>
                  <ContentAdd name='add' />
                </FloatingActionButton>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label={this.state.isSelected && items.length > 0 ? (<Link to={`/user/${items[this.state.selectedKey].id}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
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
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled
                  secondary
                  style={{
                    margin: 12
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
                  floatingLabelText={'Search User...'}
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
                <div style={{ textAlign: 'right', marginRight: 0 }}><h5>{`${items.length} Searched!`}</h5></div>
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
              sortOrder={this.state.sortOrder}
              sortBy={this.state.sortBy}
              onClickSort={this.handleSorting}
            />
          </Paper>
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

export default UserList;
