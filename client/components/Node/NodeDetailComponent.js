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

import {
  firebase,
  refs,
} from '../../util/firebase';

const uploadBaseUrl = 'http://localhost:5002/graphql/upload?query=';

export default class NodeDetail extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      node: {},
      nodeProperties: {},
    };
  }

  componentDidMount() {
    this.nodeRootCallback = refs.node.root.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ node: data.val() });
      }
    });
    this.nodeCoordinateCallback = refs.node.coordinate.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ nodeProperties: { ...this.state.nodeProperties, nodeCoordinate: data.val() } });
      }
    });
    this.nodeItemsCallback = refs.node.items.child(this.props.params.id).on('value', (data) => {
      if (data.val()) {
        this.setState({ nodeProperties: { ...this.state.nodeProperties, nodeItems: data.val() } });
      }
    });
  }

  componentWillUnmount() {
    refs.node.root.off('value', this.nodeRootCallback);
    refs.node.coordinate.off('value', this.nodeCoordinateCallback);
    refs.node.items.off('value', this.nodeItemsCallback);
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);

    const data = new FormData();
    data.append('file', this.state.file);
    const url = `${uploadBaseUrl}mutation{uploadNodeImage(input:{nodeId:"${this.props.params.id}"}){imageUrl clientMutationId}}`;
    console.log(url);
    return firebase.auth().getToken()
      .then(token => fetch(url,
        {
          method: 'POST',
          body: data,
          headers: {
            authorization: token.accessToken
          }
        }))
      .then(response => response.json())
      .then((response) => {
        if (response.errors) {
          console.log(response.errors);
          return;
        }

        console.log(response.data);
      })
      .catch(console.log);
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    let $imagePreview = null;
    if (this.state.imagePreviewUrl) {
      $imagePreview = (<img width={200} role='presentation' src={this.state.imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className='previewText'>Please select an Image for Preview</div>);
    }
    return (
      <div>
        <div style={{ width: '90%', margin: 'auto' }}>
          <Paper style={{ paddingLeft: '70px', paddingTop: '30px', paddingBottom: '30px' }}>
            <h4>{`Node ${this.props.params.id} - Basic Information`}</h4>
            <h6>Image</h6><img width={100} role='presentation' src={this.state.node.imageUrl} />
            <h6>update Image</h6>
            <div className='previewComponent'>
              <form onSubmit={e => this.handleSubmit(e)}>
                <input
                  className='fileInput'
                  type='file'
                  onChange={e => this.handleImageChange(e)}
                />
                <button
                  className='submitButton'
                  type='submit'
                  onClick={e => this.handleSubmit(e)}
                >
                  Upload Image
                </button>
              </form>
              <div className='imgPreview'>
                {$imagePreview}
              </div>
            </div>
            {
              Object.keys(this.state.node).map(nodeKey => (<h6 key={nodeKey}>{`${nodeKey} : ${this.state.node[nodeKey]}`}</h6>))}
            {Object.keys(this.state.nodeProperties).map(nodePropertiesKey => (
              <div key={nodePropertiesKey}>
                <Divider />
                <h4>Node Detail - {nodePropertiesKey}</h4>
                {
                    Object.keys(this.state.nodeProperties[nodePropertiesKey])
                      .map(key => (
                        <h6 key={`${nodePropertiesKey}-${key}`}>
                          {`${key} : ${this.state.nodeProperties[nodePropertiesKey][key]}`}
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
