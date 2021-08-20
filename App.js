// REACT/REACT NATIVE COMPONENT IMPORTS
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { Dimensions, StyleSheet, Text,TouchableOpacity, View, ScrollView, PermissionsAndroid } from 'react-native';
import { Image, ImageBackground } from 'react-native';

// REACT NAVIGATION IMPORTS
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// IMAGE IMPORTS
import button from './icons/Ellipse29.png';
import nametag from './icons/nametag.png';
import map from './icons/map1.png';
import log from './icons/log.png';
import recycle from './icons/recycle.png';
import arrow from './icons/7arrow.png';
import 'react-native-gesture-handler';

// MAP IMPORTS
import {mapInfo} from './map.js';
import MapboxGL from '@react-native-mapbox-gl/maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import NavBar from './components/NavBar';

LocationServicesDialogBox.checkLocationServicesIsEnabled({
  message: "Use Location ?",
  ok: "YES",
  cancel: "NO"
}).then(function(success) {
  console.log(success); // success => "enabled"
}).catch((error) => {
  console.log(error.message); // error.message => "disabled"
});

MapboxGL.setAccessToken("pk.eyJ1Ijoicm9taW92aWN0b3IxMjMiLCJhIjoiY2tzOXJ4YndkMHZpdjJzbno5emZic2hzNCJ9.0HQbmymuNzk0S4Ofsi2y-A");
MapboxGL.setConnected(true);

const { height, width } = Dimensions.get("window");
const images = [map, log, recycle]
const labels = ['MAP', 'LOG', 'CLASSIFY']

function HomeScreen() {
  return (
    <View>
      <View>
        <Text>Home</Text>
        <Text>Turtles Saved</Text>
        <View style={styles.home_log} />
      </View>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function MapScreenSelection() {

  var mapOptions = []
  const navigation = useNavigation();
  for(let x in mapInfo) {
    mapOptions.push(
      <View key={x} style={[styles.rectangleMap, styles.elevation, styles.layoutMap]}>
        <Image style={styles.imageMap} source={mapInfo[x]["Image"]}/>
        <Text style={ {fontSize:30} }>{mapInfo[x]["Type"]}</Text>
        <TouchableOpacity key={x} onPress={() => navigation.navigate('Map Screen', {index: x})}>
          <Image style={styles.imageMap2} source={arrow}/>      
        </TouchableOpacity>
      </View>

    )
  }
  return (
    <View style={{backgroundColor: "#36425C"}}>
      <ScrollView>  
          {mapOptions}
      </ScrollView>

      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function MapScreen({ navigation, route }) {
  var text2 = []
  text2.push(
    <Text>Loading...</Text>
  )
  const update = true
  const [text, setText] = useState(text2);
  const [mapText, setMapText] = useState(
    <MapboxGL.MapView style={{width: width}, {height: 0.4*height}}>
      <MapboxGL.UserLocation visible={true} />
      <MapboxGL.Camera
        zoomLevel={10}
        followUserMode={'normal'}
        followUserLocation
      />
    </MapboxGL.MapView>
  );
  useEffect(() => { 
    setTimeout(() =>  {
      var lat = MapboxGL.locationManager["_lastKnownLocation"]["coords"]["latitude"]
        var long = MapboxGL.locationManager["_lastKnownLocation"]["coords"]["longitude"]
        var listAddress = []
        var listLong = []
        var listLat = []
        var results = []
        var mapResults = []

          
          results.push(<Text>Press to copy to clipboard.</Text>)
          let tempKeys = mapInfo[route.params.index]["Keywords"]
          for(let query in tempKeys) {
            fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+tempKeys[query]+".json?country=US&proximity="+long+","+lat+"&limit=3&access_token=pk.eyJ1Ijoicm9taW92aWN0b3IxMjMiLCJhIjoiY2tzOXJ4YndkMHZpdjJzbno5emZic2hzNCJ9.0HQbmymuNzk0S4Ofsi2y-A")
              .then(response => response.json())
              .then(response => {
                for(let i = 0; i<response["features"].length; i++) {
                  let temp =  response["features"][i]
                  listAddress.push(temp["place_name"])
                  listLong.push(temp.geometry.coordinates[0])
                  listLat.push(temp.geometry.coordinates[1])
                }  
                if((3*tempKeys.length) === listAddress.length) {
                  if(listAddress.length === 0) {
                    setText(<Text>Map API is offline. Sorry for the inconvenience.</Text>)
                  } else {
                    console.log(listAddress)
                    console.log(listLong)
                    console.log(listLat)
                    for(let x in listAddress){
                      results.push(
                        <View key={x} style={[styles.rectangleMap, styles.elevation, styles.layoutMap]}>
                          <Text style={ {fontSize:15} }>{x}  {listAddress[x]}</Text>
                        </View>
                      )
                      mapResults.push(
                        <MapboxGL.PointAnnotation
                          key={x}
                          id={x}
                          coordinate={[listLong[x],listLat[x]]}>
                          <View style={{
                                    height: 30, 
                                    width: 30, 
                                    backgroundColor: '#00cccc', 
                                    borderRadius: 50, 
                                    borderColor: '#fff', 
                                    borderWidth: 3
                                  }} />
                          <MapboxGL.Callout 
                            title={"Point " + x}
                          />
                        </MapboxGL.PointAnnotation>
                      )
                    }
                    setText(results)
                    setMapText(
                      <MapboxGL.MapView style={{width: width}, {height: 0.4*height}}>
                        <MapboxGL.UserLocation visible={true} />
                        <MapboxGL.Camera
                          zoomLevel={6}
                          followUserMode={'normal'}
                          followUserLocation
                        />
                        {mapResults}
                      </MapboxGL.MapView>
                    )
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
    
    }, 5000)
  }, [update])
  

  return (
    <View>
      {mapText}
      <View style={{backgroundColor: "#36425C"}, {height:height-(0.4*height)}}>
        <ScrollView style={{flex:1}}>
          {text}
        </ScrollView>
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

function LogScreen() {
  return (
    <View>
      <Text>Log</Text>
      <NavBar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HOME"        
        screenOptions={{
          headerStyle: {
            backgroundColor: '#36425C',
          },
          headerTintColor: '#BED751',
          headerTitleStyle: {
            fontWeight: 'bold',
          }
        }}
      >
        <Stack.Screen style={styles.container} name="HOME" component={HomeScreen}/>
        <Stack.Screen style={styles.container} name="CLASSIFY" component={ClassifyScreen} />
        <Stack.Screen style={styles.container} name="LOG" component={LogScreen} />
        <Stack.Screen style={styles.container} name="MAP" component={MapScreenSelection} />
        <Stack.Screen style={styles.container} name="Map Screen" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#36425C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    width: width,
    height: 0.1 * height,
    marginTop: 0.822 * height,
    position: 'absolute',
    backgroundColor: "#8AC755",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  layoutMap: {
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
  },
  rectangleMap: {
    width: 0.9 * width,
    height: 0.15 * height,
    borderRadius: 15,
    marginTop: 0.04 * height,
    backgroundColor: '#8AC755',
    marginLeft: 0.5 * 0.1 * width
  },
  imageMap: {
    width: 0.27 * width,
    height: 0.15 * height,
    marginLeft: -30
  },  
  imageMap2: {
    width: 0.1 * width,
    height: 0.05 * height,
  },
  mapScreenContainer: {
    alignItems: 'center',
    width: 100,
    backgroundColor: 'transparent',
    height: 100,
  },
  mapScreenTextContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapScreenText: {
    textAlign: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },
  mapScreenIcon: {
    paddingTop:5,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#000000',
  },
  badge: {
    textAlign: "center",
    justifyContent: 'center',
    width: "100%",
    marginTop: 0,
  },
  navlog: {
    width: 79.34,
    height: 70,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'relative',
    textAlign: "center",
    justifyContent: "center",
    color: "#19C5E0"
  },
  home_log: {
    width: 0.9 * width,
    height: 0.43 * height,
    marginTop: 0.1 * height,
    backgroundColor: '#8AC755',
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: '#fff',
  }
});
