import React from 'react';
// import moment from 'moment';
// import idx from 'idx';
//
// import { Link } from 'react-router';
//
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
// import RaisedButton from 'material-ui/RaisedButton';
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
// import TextField from 'material-ui/TextField';
// import CircularProgress from 'material-ui/CircularProgress';

// import {
//   Table,
//   TableBody,
//   TableHeader,
//   TableHeaderColumn,
//   TableRow,
//   TableRowColumn
// } from 'material-ui/Table';


// import {
//   refs,
// } from '../../firebase';
import { refs } from '../../util/firebase';

export default class OrderDetail extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      refs: {},
      order: {},
      orderProperties: {},
    };
  }

  componentDidMount() {
    this.orderRootCallback = refs.order.root.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ order: data.val() });
      }
    });
    this.destCallback = refs.order.dest.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ orderProperties: { ...this.state.orderProperties, dest: data.val() } });
      }
    });
    this.regItemCallback = refs.order.regItem.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ orderProperties: { ...this.state.orderProperties, regItem: data.val() } });
      }
    });
    this.customItemCallback = refs.order.customItem.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ orderProperties: { ...this.state.orderProperties, customItem: data.val() } });
      }
    });
  }

  componentWillUnmount() {
    refs.order.root.off('value', this.orderRootCallback);
    refs.order.dest.off('value', this.destCallback);
    refs.order.regItem.off('value', this.regItemCallback);
    refs.order.customItem.off('value', this.customItemCallback);
  }

  render() {
    console.log(this.state.orderProperties);
    return (
      <div>
        <div style={{ width: '90%', margin: 'auto' }}>
          <Paper style={{ paddingLeft: '70px', paddingTop: '30px', paddingBottom: '30px' }}>
            <h4>{`Order ${this.props.params.id} - Basic Information`}</h4>
            {
              Object.keys(this.state.order).map((orderKey) => {
                if (orderKey !== 'password') {
                  return (<h6 key={orderKey}>{`${orderKey} : ${this.state.order[orderKey]}`}</h6>);
                }
                return null;
              })}
            {Object.keys(this.state.orderProperties).map(orderPropertiesKey => (
              <div key={orderPropertiesKey}>
                <Divider />
                <h4>Order Detail - {orderPropertiesKey}</h4>
                {
                   orderPropertiesKey === 'regItem' || orderPropertiesKey === 'customItem' ?
                    this.state.orderProperties[orderPropertiesKey]
                      .map((item, key1) =>
                        Object.keys(item)
                          .map((key2, i) => {
                            if (i === 0) {
                              return (
                                <div>
                                  <h5>{`ITEM ${i + 1}`}</h5>
                                  <h6 key={`${orderPropertiesKey}-${key1}-${key2}`}>
                                    {`${key2} : ${item[key2]}`}
                                  </h6>
                                </div>
                              );
                            }
                            return (
                              <h6 key={`${orderPropertiesKey}-${key1}-${key2}`}>
                                {`${key2} : ${item[key2]}`}
                              </h6>
                            );
                          })
                      )
                    : Object.keys(this.state.orderProperties[orderPropertiesKey])
                      .map(key => (
                        <h6 key={`${orderPropertiesKey}-${key}`}>
                          {`${key} : ${this.state.orderProperties[orderPropertiesKey][key]}`}
                        </h6>
                      ))
                  }
              </div>
              ))}
          </Paper>
        </div>
      </div>
    );
  }
}
