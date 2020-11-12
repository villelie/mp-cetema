import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, View, Dimensions, ToastAndroid, Text, LogBox } from 'react-native';
import * as Location from "expo-location";
import firebase from '../helpers/firebase';
import * as TaskManager from 'expo-task-manager';
import mapStyles from '../helpers/mapStyle';

let LOCATION_TASK = "backgroundLocation";

TaskManager.defineTask(LOCATION_TASK, ({ data: { locations }, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Received new locations');
});

export default class MapScreen extends React.Component {
  constructor() {

    //ignore yellow errors
    LogBox.ignoreAllLogs(true)

    super();
    this.state = {
      initialRegion: {
        latitude: 60.1587262,
        longitude: 24.922834,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      },
      uid: '',
      result: [],
      userMarkers: []
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getUserLocation()
        this.setState({
          uid: firebase.auth().currentUser.uid,
        });
      } else {
        console.log("user not logged in")
      }
    });

    fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
      .then(res => res.json())
      .then(data => {
        this.setState({ result: data.features })
      })
      .catch(console.error)
  }

  componentWillMount() {
    this.getMarkers();
  }

  async componentWillUnmount() {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  }

  mapMarkers = () => {

    //get current time in milliseconds from unix epoch
    const currentTime = Date.now()

    //current time minus 1 hour in milliseconds
    const filterTime = currentTime - 3600000

    //accept results when result timestamp is larger than the filterTime
    return this.state.result.filter(result => result.properties.timestampExternal >= filterTime).map((result) => <Marker
      key={result.mmsi}
      coordinate={{ latitude: result.geometry.coordinates[1], longitude: result.geometry.coordinates[0] }}
      title={result.mmsi.toString()}
      description={((currentTime - result.properties.timestampExternal) / 1000).toString()}>
    </Marker >)
  }

  getUserLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {

      // foreground service to track location on background
      await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Boat App",
          notificationBody: "Tracking location",
          notificationColor: "#FFFFF",
        },
      });
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 10,
          timeInterval: 10000
        },
        (location) => {
          this.persistLocation(location)
          console.log("Watch Position", location)
        }
      );
    } else {
      // do something if location permissions not accepted
    }
  }

  persistLocation = async (location) => {
    firebase.firestore().collection('locations').doc(this.state.uid).set(location, { merge: true }).then((docRef) => {
      console.log('New document added', JSON.stringify(location));
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  getMarkers = () => {
    firebase.firestore().collection('locations').get().then(snapshot => {
      let userMarkers = []
      snapshot.forEach(location => {
        userMarkers.push(location.data())
      });
      this.setState({ userMarkers });
    });
  }

  createMarkers = () => {
    console.log("createMarkers", this.state.userMarkers)
    return this.state.userMarkers.map((location, index) => {
      if (location.coords.latitude && location.coords.longitude) {
        return (
          <Marker
            key={index}
            coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            title={"usermarker"}
            description={"usermarker"}>
          </Marker>
        )
      }
    })
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
            {this.createMarkers()}
            {this.mapMarkers()}
          </MapView>
        </View>
      </View>
    );
  }
}