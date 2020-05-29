import React, { Component } from 'react';
import { GoogleMap, Marker, Circle, withGoogleMap } from 'react-google-maps';

import icon from './mapIconPinMon.png';
import icon2 from './mapIconPinVol.png';
// import demoFancyMapStyles from './demoFancyMapStyles.json';

class myMap extends Component {

	render() {
		const { lat, lng, range, chooseLocationFromMap, onCircleRangeChanged } = this.props;
		
		return (
			<GoogleMap
				onClick={chooseLocationFromMap}
				defaultZoom={12}
				defaultCenter={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
				center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
				defaultOptions={{
					// styles: demoFancyMapStyles,
					streetViewControl: false,
					scaleControl: false,
					mapTypeControl: false,
					panControl: false,
					zoomControl: false,
					rotateControl: false,
					fullscreenControl: false
				}}>
				<Circle
					ref={circle => this.mapCircle = circle} 
					center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
					defaultCenter={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
					radius={range}
					options={{
						fillColor: "#1AAAFF",
						strokeColor: "#1AAAFF"
					}}
					editable={true}
					// draggable={true}
					onRadiusChanged={onCircleRangeChanged(this.mapCircle)}
				/>
				<Marker
					position={{ lat, lng }}
					icon={{
						url: true ? icon2 : icon,
						size: { height: 48, width: 36 }
					}}
				/>
			</GoogleMap>
		)
	}

}

export default withGoogleMap(myMap)