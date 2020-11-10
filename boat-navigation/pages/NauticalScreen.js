import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';


export default class NauticalScreen extends Component {
    constructor(props) {
        super(props);

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

    goToDetailScreen() {
        this.props.navigation.navigate('Nautical Warning');
    }

    render() {
        const { data, isLoading } = this.state;

        return (
            <View style={{ flex: 1, padding: 12 }}>
                {isLoading ? <ActivityIndicator /> : (
                    <FlatList
                        ItemSeparatorComponent={this.renderSeparatorView}
                        data={this.state.result}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <View>
                                <TouchableOpacity onPress={() => this.goToDetailScreen()}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.properties.areasEn}</Text>
                                    <Text>{item.properties.locationEn, item.properties.contentsEn}</Text>
                                </TouchableOpacity>
                            </View>

                        )}
                    />
                )}
            </View>
        );
    }
}