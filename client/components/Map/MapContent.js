import React from 'react';
import {
  Textfield
} from 'react-mdl';
import GoogleMapReact from 'google-map-react';

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

  render() {
    return (

      <div style={{ width: '100%', height: '100vh' }}>
        <div style={{ width: '65%', height: '100vh', float: 'left' }}>
          <GoogleMapReact
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          />
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
