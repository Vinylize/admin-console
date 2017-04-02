import React from 'react';
import {
  Textfield
} from 'react-mdl';
import GoogleMapReact from 'google-map-react';

import {
  refs,
} from '../../util/firebase';

export default class MapContent extends React.Component {
  static propTypes = {
    center: React.PropTypes.object.isRequired,
    zoom: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    center: { lat: 37, lng: 127.33 },
    zoom: 11,
    text: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      runners: {},
    };
  }

  componentDidMount() {
    this.userCoordinateChildAdded = refs.user.coordinate.on('child_added', (data) => {
      this.setState({ runners: { ...this.state.runners, [`${data.key}`]: data.val() } });
    });

    this.userCoordinateChildChanged = refs.user.coordinate.on('child_changed', (data) => {
      console.log('child_changed', data.key, data.val());
      const newState = this.state.runners;
      newState[data.key] = data.val();
      this.setState({ runners: newState });
    });

    this.userCoordinateChildRemoved = refs.user.coordinate.on('child_removed', (data) => {
      console.log('child_removed', data.key, data.val());
      const newState = this.state.runners;
      delete newState[data.key];
      this.setState({ runners: newState });
    });
  }

  componentWillUnmount() {
    refs.user.coordinate.off('child_added', this.userCoordinateChildAdded);
    refs.user.coordinate.off('child_changed', this.userCoordinateChildChanged);
    refs.user.coordinate.off('child_removed', this.userCoordinateChildRemoved);
  }

  render() {
    const AnyReactComponent = () => <div
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: 'blue',
        borderRadius: '5px' }}
    />
    ;
    return (

      <div style={{ width: '100%', height: '100vh' }}>
        <div style={{ width: '65%', height: '100vh', float: 'left' }}>
          <GoogleMapReact
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            {
              Object.keys(this.state.runners).map(key => (<AnyReactComponent
                key={key}
                lat={this.state.runners[key].lat}
                lng={this.state.runners[key].lon}
              />))
            }
          </GoogleMapReact>
        </div>
        <div style={{ width: '35%', float: 'right', marginTop: 65, minHeight: '100vh' }}>
          <div style={{ padding: 20 }}>
            <h4> Search Address</h4>
            <Textfield
              onChange={() => {}}
              pattern='-?[0-9]*(\.[0-9]+)?'
              error='Input is not a number!'
              label='Number...'
              style={{ width: '300px' }}
            />
          </div>
        </div>
      </div>
    );
  }
}
