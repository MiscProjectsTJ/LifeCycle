// REACT/REACT NATIVE COMPONENT IMPORTS
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect, useCallback } from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import HeatMap from 'react-native-heatmap-chart';
import { Dimensions, StyleSheet, Text, Button, TouchableOpacity, View, ScrollView, ImageBackground, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Image, TextInput } from 'react-native';
import * as Clipboard from "expo-clipboard";
import * as Permissions from 'expo-permissions';

// REACT NAVIGATION IMPORTS
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// IMAGE IMPORTS
import map from './icons/map1.png';
import log from './icons/log.png';
import recycle from './icons/recycle.png';
import arrow from './icons/7arrow.png';
import button from './icons/Ellipse29.png';
import turtle from './icons/turtle.png';
import nametag from './icons/nametag.png';
import loadGif from './gifs/R.gif'
import 'react-native-gesture-handler';

// MAP IMPORTS
import { mapInfo } from './map.js';
import MapboxGL from '@react-native-mapbox-gl/maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

// OTHER
import styles from './styles';
import ClassifyPane from './ClassifyPane.js';
import Grid from 'react-native-easy-grid';
// import NavBar from './components/NavBar';
import SQLite from 'react-native-sqlite-storage';

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

const HomeScreen = (props) => {

  setData('10-20-2021', 'plastic',turtle)
  const [totalCnt, setTotalCnt] = useState('');
  useEffect(() => {
    setTotalCnt(getTotalData())
    console.log("HOMESCREEN: ", totalCnt)
  }, []);

  const t =  parseInt(10/3) // totalCnt/3
  console.log("Turtles: ", t)
  const con = []
  for (let i = 0; i < t; i++) {
     con.push(<Image source={turtle} />);
  }
  const values = [0, 4, 6, 1, 7, 3, 0, 8, 6, 2, 0, 10, 20, 12, 0, 0, 10, 0, 17, 8, 0, 6, 0, 6, 10, 23, 0, 6, 10, 23] // getData()
  const colors = 	['#504f55', '#655488', '#9F7DE1', '#FFFFFF']
  // const blocksStyles
  return (
    <View>
      <View style ={styles.home_container}>
        <ScrollView>        
          <View style={styles.home_log}>
            <Text style={styles.home_text}> You have saved {JSON.stringify(totalCnt)} turtles </Text>
            <View style= {{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              {con}
            </View>
          </View>
          <Text style={styles.home_text}> Heatmap for last {values.length} days </Text>
          <TouchableOpacity>
            <ScrollView style={styles.heatmap}> 
              <HeatMap numberOfLines={parseInt(values.length/7)+1} values={values} blocksSize={20} colors={colors}/>
            </ScrollView>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']} />
    </View>
  );
}

const Log = props => {

}

const setData = async (date, label, image) => { // adds new data to table 
  await db.transaction(async (tx) => {
    await tx.executeSql(
      "INSERT INTO Logs (Date, Label, Image) VALUES (?, ?, ?)",
      [date, label, image]
    )
  })
}

const getData = () => { // retrieves data from table
  let dates = [], labels = [], images = [];

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT Date, Label, Image FROM Logs",
      [],
      (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          dates.push(results.rows.item(i).Date); 
          labels.push(results.rows.item(i).Label);
          images.push(results.rows.item(i).Image);
          console.log(dates[i], results[i])
        }
      }
    )
  })
  return [dates, labels, images];
}

const getTotalData = () => { // retrieves data from table

  try {

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT count(*)  FROM Logs ",
      [],
      (tx, results) => {
       
        console.log("inside "+results.rows.length);
        setTotalCnt(results.rows.length)
        console.log("inside2 "+results.rows.length);
      }
    )
  })
  // console.log("Outside: ", totalCount)
} catch (error) {
  console.error(error);
}
}

const LogScreen = () => {
  const [data, setD] = useState({});

  return (
    <View>
      <View style={styles.home_log}>
        <Text></Text>
      </View>
      {/*<Button title="click for sex" onPress={() => setData(data.date, 'FUNNY NUMBER')} />*/}
      <Button title="click for return" onPress={() => {setD(getData())}} />
      <Text>here data: {JSON.stringify(data)}</Text>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']} />
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

      <NavBar
        images={[map, log, recycle]}
        labels={["MAP", "LOG", "CLASSIFY"]}
      />
    </View>
  );
}

function MapScreen({ navigation, route }) {
  var text2 = [];
  text2.push(<Text key="text2"></Text>);
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

      results.push(<Text key="directions" style={{ fontSize:20,color:"red",textAlign:"center"}}>Press on one of the addresses below to copy to clipboard.</Text>);
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
                      key={listAddress[x]}
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

const Stack = createNativeStackNavigator();

const NavBar = (props) => {
  const listItems = props.images.map((image, index) => (
    <NavItem
      image={image}
      width={42}
      height={49}
      label={props.labels[index]}
      key={index}
    />
  ));

  return <View style={styles.rectangle}>{listItems}</View>;
};
function NavItem(props) {
  var style = {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  };

  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(props.label)}>
      <View style={style}>
        <Iconoclast
          imgUri={props.image}
          width={props.width}
          height={props.height}
          label={props.label}
        />
        {/* <Link to=""/> */}
        <Label label={props.label} />
      </View>
    </TouchableOpacity>
  );
}
function Iconoclast(props) {
  return (
    <View>
      <ImageBackground source={button} style={styles.navlog}>
        <Image
          source={props.imgUri}
          style={{
            width: props.width,
            height: props.height,
            marginTop: -10,
          }}
        ></Image>
      </ImageBackground>
    </View>
  );
}
function Label(props) {
  return (
    <ImageBackground
      source={nametag}
      style={{
        width: 69.34,
        height: 18.13,
      }}
    >
      <Text style={styles.label}>{props.label}</Text>
    </ImageBackground>
  );
}

export default function App() {
  useEffect(() => { // creates Logs table upon initialization of App
    createTable();
  });

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        + "Logs "
        + "(Date INTEGER, Label STRING, Photo BLOB);"
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
          component={ClassifyPane}
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