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

export default class UserDetail extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      refs: {},
      user: {},
      userProperties: {},
      coordinate: {}
    };
  }

  componentDidMount() {
    this.userRootCallback = refs.user.root.child(this.props.params.id).on('value', (data) => {
      this.setState({ user: data.val() });
    });
    this.runnerQualificationCallback = refs.user.runnerQualification.child(this.props.params.id).on('value', (data) => {
      this.setState({ userProperties: { ...this.state.userProperties, runnerQualification: data.val() } });
    });
    this.userQualificationCallback = refs.user.userQualification.child(this.props.params.id).on('value', (data) => {
      this.setState({ userProperties: { ...this.state.userProperties, userQualification: data.val() } });
    });
    this.coordinateCallback = refs.user.coordinate.child(this.props.params.id).on('value', (data) => {
      this.setState({ userProperties: { ...this.state.userProperties, coordinate: data.val() } });
    });
  }

  componentWillUnmount() {
    refs.user.root.off('value', this.userRootCallback);
    refs.user.runnerQualification.off('value', this.runnerQualificationCallback);
    refs.user.userQualification.off('value', this.userQualificationCallback);
    refs.user.coordinate.off('value', this.coordinateCallback);
  }

  render() {
    return (
      <div>
        <div style={{ width: '90%', margin: 'auto' }}>
          <Paper style={{ paddingLeft: '70px', paddingTop: '30px', paddingBottom: '30px' }}>
            <h4>{`User ${this.props.params.id} - Basic Information`}</h4>
            {
              Object.keys(this.state.user).map((userKey) => {
                if (userKey !== 'password') {
                  return (<h6 key={userKey}>{`${userKey} : ${this.state.user[userKey]}`}</h6>);
                }
                return null;
              })}
            {Object.keys(this.state.userProperties).map(userPropertiesKey => (
              <div key={userPropertiesKey}>
                <Divider />
                <h4>User Detail - {userPropertiesKey}</h4>
                {
                    Object.keys(this.state.userProperties[userPropertiesKey])
                      .map(key => (
                        <h6 key={`${userPropertiesKey}-${key}`}>
                          {`${key} : ${this.state.userProperties[userPropertiesKey][key]}`}
                        </h6>))
                  }
              </div>
              ))}
          </Paper>
        </div>
      </div>
    );
  }
}
