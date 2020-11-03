import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('https://meri.digitraffic.fi/api/v1/nautical-warnings/published')
      .then((response) => response.json())
      .then(data => {
        this.setState({ result: data.features, isLoading: false })
      })
  }
  
  renderSeparatorView = () => {
    return (
      <View style={{
          height: 1, 
          width: "100%",
          backgroundColor: "#CEDCCE",
        }}
      />
    );
  };


  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={{ flex: 1, padding: 12 }}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            ItemSeparatorComponent={this.renderSeparatorView}
            data = { this.state.result }
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
            <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.properties.areasEn}</Text>
            <Text>{item.properties.locationEn, item.properties.contentsEn}</Text>
            </View>
            )}
          />
        )}
      </View>
    );
  }
};