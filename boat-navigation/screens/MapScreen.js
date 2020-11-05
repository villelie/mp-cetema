import React from 'react';
import MapView, { Marker } from 'react-native-maps'
import { StyleSheet, View, Dimensions, ToastAndroid, Text, LogBox } from 'react-native';
import * as Location from "expo-location";
import firebase from '../database/firebase';
import * as TaskManager from 'expo-task-manager';

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
        LogBox.ignoreLogs

        super();
        this.state = {
            uid: '',
            result: []
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                uid: firebase.auth().currentUser.uid,
            });
            this.getUserLocation();
            console.log("firebase user uid:", this.state.uid)
        });

        fetch('https://meri.digitraffic.fi/api/v1/locations/latest')
            .then(res => res.json())
            .then(data => {
                this.setState({ result: data.features })
            })
            .catch(console.error)
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
        let coords = {
            uid: this.state.uid,
            latitude: [location.coords.latitude],
            longitude: [location.coords.longitude],
            speed: [location.coords.speed],
            heading: [location.coords.heading],
            timestamp: [location.timestamp]
        };

        firebase.firestore().collection('locations').doc(coords.uid).set(coords, { merge: true }).then((docRef) => {
            console.log('New document added', JSON.stringify(coords));
        }).catch((error) => {
            console.error('Error adding document: ', error);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.mapStyle}
                    showsUserLocation={true}
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
        backgroundColor: '#ffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
