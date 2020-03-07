import React from 'react';
import GoogleMapReact from 'google-map-react';
import Keys from '../server/keys';
 

type MyProps = {
	lat: number;
	lng: number;
	zoom: number;
};
type MyState = {

};

const AnyReactComponent = ({ lat, lng }) => <div className="mapMarker"></div>;

class SimpleMap extends React.Component <MyProps, MyState> {
 
  render() {
  	const center = { lat: this.props.lat, lng: this.props.lng}
    return (
      // Important! Always set the container height explicitly
      <div className="mapSpace">
        <GoogleMapReact
          bootstrapURLKeys={{ key: Keys.GOOGLE_API_KEY }}
          defaultCenter={center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={this.props.lat}
            lng={this.props.lng}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;