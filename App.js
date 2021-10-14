// REACT/REACT NATIVE COMPONENT IMPORTS
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { Dimensions, StyleSheet, Text, Button, TouchableOpacity, View, ScrollView, PermissionsAndroid } from 'react-native';
import { Image, TextInput } from 'react-native';

// REACT NAVIGATION IMPORTS
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// IMAGE IMPORTS
import map from './icons/map1.png';
import log from './icons/log.png';
import recycle from './icons/recycle.png';
import arrow from './icons/7arrow.png';
import 'react-native-gesture-handler';

// MAP IMPORTS
import {mapInfo} from './map.js';
import MapboxGL from '@react-native-mapbox-gl/maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

// OTHER
import styles from './styles';
import NavBar from './components/NavBar';
import SQLite from 'react-native-sqlite-storage';
import TextBox from './components/textbox';

const db = SQLite.openDatabase(
  {
    name: 'TestDB',
    location: 'default'
  },
  () => { },
  error => { console.log(error) }
);

 MapboxGL.requestAndroidLocationPermissions()
LocationServicesDialogBox.checkLocationServicesIsEnabled({
  message: "Use Location ?",
  ok: "YES",
  cancel: "NO",
})
  .then(function (success) {
    console.log(success); // success => "enabled"
  })
  .catch((error) => {
    console.log(error.message); // error.message => "disabled"
  });

MapboxGL.setAccessToken(
  "pk.eyJ1Ijoicm9taW92aWN0b3IxMjMiLCJhIjoiY2tzOXJ4YndkMHZpdjJzbno5emZic2hzNCJ9.0HQbmymuNzk0S4Ofsi2y-A"
);
MapboxGL.setConnected(true);
const { height, width } = Dimensions.get("window");
const images = [map, log, recycle];
const labels = ["MAP", "LOG", "CLASSIFY"];

const HomeScreen = () => {
  const [data, setD] = useState({});

  const setData = async (date, label) => { // adds new data to table 
    await db.transaction(async (tx) => {
      await tx.executeSql(
        "INSERT INTO Logs (Date, Label) VALUES (?, ?)",
        [date, label]
      )
    })
  }

  const getData = () => { // retrieves data from table
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT Date, Label FROM Logs",
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var date = results.rows.item(len-1).Date;
            var img = results.rows.item(len-1).Image;
            var label = results.rows.item(len-1).Label
            setD({'date': date+1, 'label': label});
          }
        }
      )
    })
  }

  return (
    <View>
      <View>
        <Text>Home</Text>
        <Text>Turtles Saved</Text>
        <View style={styles.home_log} />
        <Button title="click for sex" onPress={() => setData(data.date, 'FUNNY NUMBER')} />
        <Button title="click for return" onPress={() => getData()} />
        <Text>here data: {JSON.stringify(data)}</Text>
      </View>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

const LogScreen = () => {
  return (
    <View>
      <Text>Log Screen</Text>
      <View style={styles.home_log} />
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
      <TextBox>
        <Text>
          {data.date}
          {data.label}
        </Text>
      </TextBox>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  )
}

function MapScreenSelection() {
  var mapOptions = [];
  const navigation = useNavigation();
  for (let x in mapInfo) {
    mapOptions.push(
      <View
        key={x}
        style={[styles.rectangleMap, styles.elevation, styles.layoutMap]}
      >
        <Image style={styles.imageMap} source={mapInfo[x]["Image"]} />
        <Text style={{ fontSize: 30 }}>{mapInfo[x]["Type"]}</Text>
        <TouchableOpacity
          key={x}
          onPress={() => navigation.navigate("Map Screen", { index: x })}
        >
          <Image style={styles.imageMap2} source={arrow} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: "#36425C" }}>
      <ScrollView>{mapOptions}</ScrollView>

      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function MapScreen({ navigation, route }) {
  var text2 = [];
  text2.push(<Text></Text>);
  const update = true;
  const [text, setText] = useState(text2);
  const [mapText, setMapText] = useState(
    <View>
      <MapboxGL.MapView style={({ width: width }, { height: 0.4 * height })}>
        <MapboxGL.UserLocation visible={true} />
        <MapboxGL.Camera
            zoomLevel={-1}
            scrollEnabled={false}
            logoEnabled={true}
        />
      </MapboxGL.MapView>
      <Image
        source={loadGif}
        style={{
          width: "50%",
          height: "70%",
          position: "absolute",
          top: "90%",
          left: "25%",
        }}
      ></Image>
    </View>
  );

  function copyToClipboard(args) {
    Clipboard.setString(args);
    ToastAndroid.show(
      "The address has been copied succesfully!",
      ToastAndroid.SHORT
    );
  }

  useEffect(() => {
    setTimeout(() => {
      var lat =
        MapboxGL.locationManager["_lastKnownLocation"]["coords"]["latitude"];
      var long =
        MapboxGL.locationManager["_lastKnownLocation"]["coords"]["longitude"];
      var listAddress = [];
      var listLong = [];
      var listLat = [];
      var results = [];
      var mapResults = [];

      results.push(<Text style={{ fontSize:20,color:"red",textAlign:"center"}}>Press on one of the addresses below to copy to clipboard.</Text>);
      let tempKeys = mapInfo[route.params.index]["Keywords"];
      for (let query in tempKeys) {
        fetch(
          "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            tempKeys[query] +
            ".json?country=US&proximity=" +
            long +
            "," +
            lat +
            "&limit=3&access_token=pk.eyJ1Ijoicm9taW92aWN0b3IxMjMiLCJhIjoiY2tzOXJ4YndkMHZpdjJzbno5emZic2hzNCJ9.0HQbmymuNzk0S4Ofsi2y-A"
        )
          .then((response) => response.json())
          .then((response) => {
            for (let i = 0; i < response["features"].length; i++) {
              let temp = response["features"][i];
              listAddress.push(temp["place_name"]);
              listLong.push(temp.geometry.coordinates[0]);
              listLat.push(temp.geometry.coordinates[1]);
            }
            if (3 * tempKeys.length === listAddress.length) {
              if (listAddress.length === 0) {
                setText(
                  <Text>Map API is offline. Sorry for the inconvenience.</Text>
                );
              } else {
                console.log(listAddress);
                console.log(listLong);
                console.log(listLat);
                for (let x in listAddress) {
                  results.push(
                    <TouchableOpacity
                      onPress={() => copyToClipboard(listAddress[x])}
                    >
                      <View
                        key={x}
                        style={[
                          styles.rectangleMap,
                          styles.elevation,
                          styles.layoutMap,
                        ]}
                      >
                        <Text style={{ fontSize: 15, textAlign:"center" }}>
                          {"Point " + x} {listAddress[x]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                  mapResults.push(
                    <MapboxGL.PointAnnotation
                      key={x}
                      id={x}
                      coordinate={[listLong[x], listLat[x]]}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          backgroundColor: "#00cccc",
                          borderRadius: 50,
                          borderColor: "#fff",
                          borderWidth: 3,
                        }}
                      />
                      <MapboxGL.Callout title={"Point " + x} />
                    </MapboxGL.PointAnnotation>
                  );
                }
                setText(results);
                setMapText(
                  <MapboxGL.MapView
                    style={({ width: width }, { height: 0.4 * height })}
                  >
                    <MapboxGL.UserLocation visible={true} />
                    <MapboxGL.Camera
                      animationDuration={5000}
                      zoomLevel={8}
                      centerCoordinate={[long, lat]}
                      scrollEnabled={false}
                      logoEnabled={true}
                    />
                    {mapResults}
                  </MapboxGL.MapView>
                );
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      
    }, 5000);
  }, [update]);

  return (
    <View style={{justifyContent:"center", textAlign: 'center', backgroundColor:"#36425C"}}>
      {mapText}
      <View
        style={
          ({ backgroundColor: "#36425C" }, { height: height - 0.4 * height })
        }
      >
        <ScrollView style={{ flex: 1}}>{text}</ScrollView>
      </View>
    </View>
  );
}

function ClassifyScreen() {
  return (
    <View>
      <Text>Classify</Text>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => { // creates Logs table upon initialization of App
    createTable();
  });

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        +"Logs "
        +"(Date INTEGER, Label STRING);"
      )
    })
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HOME"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#36425C",
          },
          headerTintColor: "#BED751",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          style={styles.container}
          name="HOME"
          component={HomeScreen}
        />
        <Stack.Screen
          style={styles.container}
          name="CLASSIFY"
          component={ClassifyScreen}
        />
        <Stack.Screen
          style={styles.container}
          name="LOG"
          component={LogScreen}
        />
        <Stack.Screen
          style={styles.container}
          name="MAP"
          component={MapScreenSelection}
        />
        <Stack.Screen
          style={styles.container}
          name="Map Screen"
          component={MapScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
