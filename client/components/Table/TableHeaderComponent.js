import React from 'react';
import {
  TableHeaderColumn
} from 'material-ui/Table';

export default class TableHeaderColumnSort extends React.Component {
  static propTypes = {
    header: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    sortOrder: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    size: React.PropTypes.number.isRequired,
    onClickSort: React.PropTypes.func
  };

  render() {
    const sortIcon = this.props.sortOrder === 'asc' ? '▲' : '▼';
    return (
      <TableHeaderColumn colSpan={`${this.props.size}`}>
        <button onClick={e => this.props.onClickSort(e, this.props.value)} style={{ border: 0, outline: 0, background: 'none' }}>
          <h6 style={{ cursor: 'pointer' }} value={`${this.props.value}`}>
            {`${this.props.header} ${this.props.sortBy === this.props.value ? sortIcon : ''}`}
          </h6>
        </button>
      </TableHeaderColumn>
    );
  }
}

TableHeaderColumnSort.defaultProps = {
  header: '',
  value: '',
  size: 1
};
