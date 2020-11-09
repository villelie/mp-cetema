import React, { Component } from 'react';
import MapView, { Marker,  } from 'react-native-maps'
import { StyleSheet, View, Dimensions, Image, ToastAndroid, Button } from 'react-native';
import {useEffect, useState} from 'react';



const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

export default class NauticalDetails extends React.Component {

  componentDidMount() {
    this.handleUserLocation();
    setTimeout(()=>this.setState({marginBottom: 0}), 100)
    fetch('https://meri.digitraffic.fi/api/v1/nautical-warnings/published')
        .then(res => res.json())
        .then(data => {
          this.setState({ result: data.features })
        })
        .catch(console.error)
  }

  constructor(props){
    super(props);
  this.state={
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

mapMarkers = () => {
  return this.state.result.filter(result => result).map((result) => <Marker
    key={result.id}
    coordinate={{ latitude: result.geometry.coordinates[1], longitude: result.geometry.coordinates[0] }}
    title={'asd'/*result.mmsi.toString()*/}
    description={('asd')}>
  </Marker >)
}

handleUserLocation =() => {
  navigator.geolocation.getCurrentPosition(pos => {
    this.map.animateToRegion({
      ...this.state.initialRegion,
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude
    })

    this.setState({
      ...this.state.initialRegion,
      latitude : pos.coords.latitude,
      longitude : pos.coords.longitude
    })
  },
  err => {
    console.log(err);
    alert("something went wrong");
  }
  )
}

  /*onChangeValue = initialRegion =>{
    ToastAndroid.show(JSON.stringify(initialRegion), ToastAndroid.SHORT)
    this.setState ({
      initialRegion
    })
  }*/

  render() {
    //console.disableYellowBox = true;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
        <MapView style={{flex: 1, marginBottom: this.state.marginBottom}}
        showsUserLocation = {true}
        showsMyLocationButton = {true}
        initialRegion = {this.state.initialRegion}
        onRegionChangeComplete = {this.onChangeValue}
        ref = {ref => this.map = ref}>
        {this.mapMarkers()}
        </MapView>
        <View style={{top: '50%', left: '50%', marginLeft: -24, marginTop: -48, position: 'absolute' }}>
        </View>
      </View>
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
  warningButton: {
    position: 'absolute',
    bottom:0,
    left:0,
},
});