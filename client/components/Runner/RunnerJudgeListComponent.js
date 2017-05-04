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

export default class RunnerJudgeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idImageModalOpen: false,
      users: [],
      items: [],
      selectedKey: 0,
      isSelected: false,
      searchBy: 'e',
      isSearching: false,
      searchOptions: [
        { name: 'Email', value: 'e' },
        { name: 'Name', value: 'n' },
        { name: 'Phone Number', value: 'p' }
      ],
      idUrl: '',
      pDisplay: 15,
      pCurrent: 1,
      pTotal: 0,
      sortBy: 'id',
      sortOrder: 'dsc',
      headers: [
        { name: 'Identification', value: 'idUrl', size: 3 },
        { name: 'Email', value: 'e', size: 3 },
        { name: 'Name', value: 'n', size: 2 },
        { name: 'Phone Number', value: 'p', size: 2 },
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
    if (e.target.value) {
      this.setState({
        items: this.state.users.filter((user) => {
          if (user[this.state.searchBy] && user[this.state.searchBy].match(e.target.value)) return true;
          return false;
        })
      }, () => {
        this.handleSetTotalPage();
      });
      this.setState({ isSearching: true });
      setTimeout(() => {
        this.setState({ isSearching: false });
      }, 4000);
    } else {
      this.setState({ items: this.state.users }, () => {
        this.handleSetTotalPage();
        this.handleSorting(null, this.state.sortBy);
      });
    }
  }

  handleIdImageModalOpen = (e, idUrl) => {
    this.setState({ idImageModalOpen: true });
    this.setState({ idUrl });
  };

  handleIdImageModalClose = () => {
    this.setState({ idImageModalOpen: false });
    this.setState({ idUrl: '' });
  };

  handleApproveRunner = (e, uid, isA) => {
    e.preventDefault();
    this.setState({ isSelected: false });
    const url = isA ? `${uploadBaseUrl}mutation{adminApproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}` : `${uploadBaseUrl}mutation{adminDisapproveRunnerFirstJudge(input:{uid:"${uid}"}){result}}`;
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
        if (isA) alert('The user is approved!');
        else alert('The user is disapproved!');
        setTimeout(() => {
          this.handleLoadData();
          if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
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
          if (this.state.users.length > this.state.selectedKey) this.setState({ isSelected: true });
        }, 100);
      })
      .catch();
  }

  handleRowSelection = (keys) => {
    this.setState({ selectedKey: 0 }, () => {
      if (keys.length > 0) {
        keys.map((key) => {
          this.setState({ selectedKey: (key + (this.state.pCurrent - 1)) * this.state.pDisplay });
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

  handleSetTotalPage = () => {
    const pTotal = Math.ceil(this.state.items.length / this.state.pDisplay);
    if (pTotal !== this.state.pTotal) this.setState({ pTotal });
  }

  handleSorting = (e, prop) => {
    const sortOrder = this.state.sortOrder;
    const sortBy = this.state.sortBy;
    this.setState({
      items: prop !== 'No' ? this.state.items.sort((a, b) => {
        if (((sortOrder === 'asc' || sortBy !== prop) && e) || (sortOrder === 'dsc' && !e)) {
          if (!a[prop]) return -1;
          if (!b[prop]) return 1;
          if (a[prop] > b[prop]) return 1;
          else if (a[prop] < b[prop]) return -1;
          return 0;
        }
        if (!a[prop]) return 1;
        if (!b[prop]) return -1;
        if (a[prop] < b[prop]) return 1;
        else if (a[prop] > b[prop]) return -1;
        return 0;
      }) : this.state.items.reverse()
    }, () => {
      if (e) {
        const nextSortOrder = this.state.sortOrder === 'asc' ? 'dsc' : 'asc';
        this.setState({ sortOrder: this.state.sortBy === prop ? nextSortOrder : 'dsc' });
        this.setState({ sortBy: prop });
      }
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
            if (user.isWJ === true && user.id) return true;
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
                if (user.child('isWJ').val() === true && user.child('id').val() && !isIn) {
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
                  if (user.child('isWJ').val() === true && user.child('id').val() && !isIn) {
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
              setTimeout(() => { this.handleSorting(null, this.state.sortBy); }, 1000);
            });
          });
        });
      });
    });
  }

  handleChangeSearchBy = (e, i, v) => {
    this.setState({ searchBy: v });
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
              <h3>List of Users Waiting for Judge</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', paddingRight: 30, paddingLeft: 16 }}>
              <div>
                <RaisedButton
                  label={this.state.isSelected && this.state.items.length > 0 ? (<Link to={`/runner/${this.state.items[this.state.selectedKey].id}`} style={{ textDecoration: 'none', color: '#ffffff' }}>Detail</Link>) : 'Detail'}
                  primary
                  disabled={!this.state.isSelected}
                  style={{
                    margin: 12,
                  }}
                />
                <RaisedButton
                  label='Block'
                  secondary
                  disabled={!this.state.isSelected || this.state.items[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, this.state.items[this.state.selectedKey].id, false); }}
                />
                <RaisedButton
                  label='Unblock'
                  primary
                  disabled={!this.state.isSelected || !this.state.items[this.state.selectedKey].isB}
                  style={{
                    margin: 12,
                  }}
                  onClick={(e) => { this.handleBlockUser(e, this.state.items[this.state.selectedKey].id, true); }}
                />
                <RaisedButton
                  label='APPROVE'
                  disabled={!this.state.isSelected}
                  backgroundColor='#a4c639'
                  labelColor='#FFFFFF'
                  style={{
                    margin: 12,
                    marginLeft: 50,
                  }}
                  onClick={(e) => { this.handleApproveRunner(e, this.state.items[this.state.selectedKey].id, true); }}
                />
                <RaisedButton
                  label='DISAPPROVE'
                  disabled={!this.state.isSelected}
                  secondary
                  style={{
                    margin: 12
                  }}
                  onClick={(e) => { this.handleApproveRunner(e, this.state.items[this.state.selectedKey].id, false); }}
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
              items={this.state.items}
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
