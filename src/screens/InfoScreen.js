import React, {useEffect, useState} from "react";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Text,
} from "native-base";

const InfoScreen = (props) => {
  const [nauticalWarnings, setNauticalWarnings] = useState([]);

  const fetchData = () => {
    fetch("https://meri.digitraffic.fi/api/v1/nautical-warnings/published")
      .then((response) => response.json())
      .then((data) => setNauticalWarnings(data.features));
  };

  const fetchToken = () => {
    fetch('https://pfa.foreca.com/authorize/token?user=daniel-finnerman&password=LQ7gKLa3mzTkFoWgTh', {
      method: 'POST'
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        console.log(responseJson.access_token);
        token = responseJson.access_token;
        fetch("https://pfa.foreca.com/api/v1/marine/forecast/hourly/:location?location= 24.940266, 60.148091&token=" + token)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
          })
      });
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchData();
      fetchToken();
    }
    return () => (mounted = false);
  }, []);

  return (
    <Container>
      <Content>
        <Body>
          <Text>aSD</Text>
          {nauticalWarnings.map((warning, i) => {
            if (i < 3) {
              return (
                <Card key={i}>
                  <CardItem>
                    <Text
                      onPress={() =>
                        props.navigation.navigate("Nautical Warning", {
                          warning,
                        })
                      }
                    >
                      {warning.properties.areasEn},{" "}
                      {warning.properties.locationEn}:{" "}
                      {warning.properties.contentsEn}
                    </Text>
                  </CardItem>
                </Card>
              );
            }
          })}
          <Button
            onPress={() => props.navigation.navigate("Nautical Warnings")}
          >
            <Text>Show all Nautical Warnings</Text>
          </Button>
        </Body>
      </Content>
    </Container>
  );
};

export default InfoScreen;
