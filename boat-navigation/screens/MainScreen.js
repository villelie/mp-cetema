import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { View, Dimensions } from 'react-native';
import { mapStyles } from '../helpers/mapStyle';
import * as TaskManager from 'expo-task-manager';

let LOCATION_TASK = "backgroundLocation";

TaskManager.defineTask(LOCATION_TASK, ({ data: { locations }, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Received new locations');
});

export default class MainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      initialRegion: {
        latitude: 60.1587262,
        longitude: 24.922834,
        latitudeDelta: 0.012,
        longitudeDelta: Dimensions.get('window').width / Dimensions.get('window').width,
        data: [],
        isLoading: true
      },
      marginBottom: 1
    }
  }

  componentDidMount() {
    this.handleUserLocation();
    setTimeout(() => this.setState({ marginBottom: 0 }), 100)
    fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
      .then(res => res.json())
      .then(data => {
        const currentTime = Date.now()
        const filterTime = currentTime - 3600000

        const filtered = data.features.filter(result => result.properties.timestampExternal >= filterTime)
        this.setState({ result: filtered })
      })
      .catch(console.error)
  }

  mapMarkers = () => {
    const currentTime = Date.now()
    return this.state.result.map((result) => <Marker
      key={result.mmsi}
      coordinate={{ latitude: result.geometry.coordinates[1], longitude: result.geometry.coordinates[0] }}
      title={result.mmsi.toString()}
      description={((currentTime - result.properties.timestampExternal) / 1000).toString()}
      image={require('../assets/boaticon.png')}>
    </Marker >)
  }

  handleUserLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos);
      this.map.animateToRegion({
        ...this.state.initialRegion,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })

      this.setState({
        ...this.state.initialRegion,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })
    },
      err => {
        console.log(err);
        alert("something went wrong");
      }
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1, marginBottom: this.state.marginBottom }}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyles}
            showsUserLocation={true}
            showsMyLocationButton={true}
            initialRegion={this.state.initialRegion}
            onRegionChangeComplete={this.onChangeValue}
            ref={ref => this.map = ref}>
            {this.mapMarkers()}
          </MapView>
        </View>
      </View>
    );
  }
}