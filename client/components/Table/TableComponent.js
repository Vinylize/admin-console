import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Pagination from 'material-ui-pagination';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import TableHeaderColumnSort from '../Table/TableHeaderComponent';

export default class DataTable extends React.Component {
  static propTypes = {
    // Table properties can be added
    class: React.PropTypes.string.isRequired,
    items: React.PropTypes.array,
    headers: React.PropTypes.array,
    pCurrent: React.PropTypes.number.isRequired,
    pDisplay: React.PropTypes.number.isRequired,
    pTotal: React.PropTypes.number.isRequired,
    handleSetPage: React.PropTypes.func.isRequired,
    handleRowSelection: React.PropTypes.func,
    sortOrder: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    onClickSort: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      idImageModalOpen: false,
      idUrl: '',
    };
  }


  handleIdImageModalOpen = (e, idUrl) => {
    this.setState({ idImageModalOpen: true });
    this.setState({ idUrl });
  };

  handleIdImageModalClose = () => {
    this.setState({ idImageModalOpen: false });
    this.setState({ idUrl: '' });
  };

  render() {
    const idImageModalActions = [
      <FlatButton
        label='Cancel'
        primary
        onTouchTap={this.handleIdImageModalClose}
      />
    ];
    return (
      <div style={{ float: 'clear' }}>
        <Table
          selectable
          fixedHeader
          onRowSelection={this.props.handleRowSelection}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumnSort colSpan='1' header='No' value='id' sortOrder={this.props.sortOrder} sortBy={this.props.sortBy} onClickSort={this.props.onClickSort} />
              {this.props.headers.map(header => (
                <TableHeaderColumnSort
                  key={header.value}
                  size={header.size}
                  header={header.name}
                  value={header.value}
                  sortOrder={this.props.sortOrder}
                  sortBy={this.props.sortBy}
                  onClickSort={this.props.onClickSort}
                />
              ))}
              <TableHeaderColumn colSpan='2'><h6>Action</h6></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway={false}
          >
            {this.props.items.map((item, index1) => {
              if ((this.props.pCurrent - 1) * this.props.pDisplay < index1 + 1 && index1 < this.props.pCurrent * this.props.pDisplay) {
                return (
                  <TableRow key={item.id}>
                    <TableRowColumn colSpan='1'>{index1 + 1}</TableRowColumn>
                    {Object.keys(this.props.headers).map((index2) => {
                      if (this.props.headers[index2].value === 'cAt' || this.props.headers[index2].value === 'rAAt') {
                        const time = item[this.props.headers[index2].value] ? moment(item[this.props.headers[index2].value]).calendar() : 'N/A';
                        return (<TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}>{time}</TableRowColumn>);
                      } else if (this.props.headers[index2].value === 'isB') {
                        return (<TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}>{item[this.props.headers[index2].value] ? 'Blocked' : 'Unblocked'}</TableRowColumn>);
                      } else if (this.props.headers[index2].value === 'isPV') {
                        return (<TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}>{item[this.props.headers[index2].value] ? 'Y' : 'N'}</TableRowColumn>);
                      } else if (this.props.headers[index2].value === 'oName' || this.props.headers[index2].value === 'rName' || this.props.headers[index2].value === 'nName') {
                        return (<TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}><Link to={`/${this.props.class}/${item.id}`} style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>{item[this.props.headers[index2].value]}</Link></TableRowColumn>);
                      } else if (this.props.headers[index2].value === 'idUrl' || this.props.headers[index2].value === 'imgUrl') {
                        return (
                          <TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}>
                            <button onClick={e => this.handleIdImageModalOpen(e, item[this.props.headers[index2].value])} style={{ border: 0, outline: 0, background: 'none' }}>
                              <img
                                width={75}
                                role='presentation'
                                src={item[this.props.headers[index2].value]}
                                style={{ cursor: 'pointer' }}
                              />
                            </button>
                          </TableRowColumn>
                        );
                      }
                      return (<TableRowColumn key={this.props.headers[index2].value} colSpan={`${this.props.headers[index2].size}`}>{item[this.props.headers[index2].value]}</TableRowColumn>);
                    })}
                    <TableRowColumn colSpan='2'>
                      <Link to={`/${this.props.class}/${item.id}`}>
                        <RaisedButton label='Details' primary />
                      </Link>
                    </TableRowColumn>
                  </TableRow>
                );
              }
              return '';
            })}
          </TableBody>
        </Table>
        <div style={{ textAlign: 'center', paddingBottom: '50px' }}>
          <Pagination
            total={this.props.pTotal}
            display={this.props.pDisplay}
            current={this.props.pCurrent}
            onChange={pCurrent => this.props.handleSetPage(pCurrent)}
          />
        </div>
        <Dialog
          title='Identification'
          actions={idImageModalActions}
          modal
          open={this.state.idImageModalOpen}
          contentStyle={{ width: 500 }}
          onRequestClose={this.idImageModalClose}
        >
          <Paper zDepth={0}>
            <img
              width={400}
              role='presentation'
              src={this.state.idUrl}
              style={{
                cursor: 'pointer',
                margin: 20
              }}
            />
          </Paper>
        </Dialog>
      </div>
    );
  }
}

DataTable.defaultProps = {
  items: [],
  headers: [],
  searchBy: 'id',
  searchWord: ''
};
