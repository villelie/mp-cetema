import React from 'react';
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, View, Dimensions } from 'react-native';

export default class App extends React.Component {

  state = { result: [] }

  componentDidMount() {
    fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
      .then(res => res.json())
      .then(data => {
        this.setState({ result: data.features })
      })
      .catch(console.error)
}

mapMarkers = () => {
  return this.state.result.map((result) => <Marker
    key={result.mmsi}
    coordinate={{ latitude: result.geometry.coordinates[1], longitude: result.geometry.coordinates[0] }}>
  </Marker >)
}

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle}
                initialRegion={{
                  latitude: 60.1587262,
                  longitude: 24.922834,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1
                }} >
                {this.mapMarkers()}
              </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
