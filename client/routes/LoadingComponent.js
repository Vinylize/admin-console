import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

export default class Loading extends React.Component {
  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div style={{ height: '100%', width: '25%', backgroudColor: 'white', margin: 'auto' }}>
          <RefreshIndicator
            size={500}
            left={0}
            top={0}
            status='loading'
            style={{
              display: 'inline-block',
              position: 'relative',
              textAlign: 'center'
            }}
          />
          <p style={{ textAlign: 'center', fontSize: '50px', marginTop: '30px' }}>{'Now Loading'}</p>
        </div>
      </div>
    );
  }
}
