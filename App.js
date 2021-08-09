// import HomeScreen from './Home'
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { Dimensions, StyleSheet, Text,TouchableOpacity, View } from 'react-native';
import { Image, ImageBackground } from 'react-native';
import button from './Ellipse29.png';
import nametag from './nametag.png';
import map from './map1.png';
import log from './log.png';
import recycle from './recycle.png';
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

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
      <Navbar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function MapScreen() {
  return (
    <View>
      <View>
        <Text>Map</Text>
      </View>
      <Navbar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function ClassifyScreen() {
  return (
    <View>
      <Text>Classify</Text>
      <Navbar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

function LogScreen() {
  return (
    <View>
      <Text>Log</Text>
      <Navbar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const Navbar = props => {

  const listItems = props.images.map((image, index) =>
      <NavItem image={image} width={42} height={49} label={props.labels[index]} key={index}/>
  );

  return (
    <View style={styles.rectangle}>
      {listItems}
    </View>

  );
}
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
        <Iconoclast imgUri={props.image} width={props.width} height={props.height} label={props.label}/>
        {/* <Link to=""/> */}
        <Label label={props.label} />
      </View>
    </TouchableOpacity>
  );
}
function Iconoclast(props)  {
  return (
    <View>
      <ImageBackground source={button} style={styles.navlog}>
        <Image source={props.imgUri} style={{
          width: props.width,
          height: props.height,
          marginTop: -10,
        }}>
        </Image>
      </ImageBackground>
    </View>
  );
}
function Label(props) {
  return (
    <ImageBackground source={nametag} style={{
      width: 69.34,
      height: 18.13
    }}>
      <Text style={styles.label}>
        {props.label}
      </Text>
    </ImageBackground>
  );
}

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
        <Stack.Screen style={styles.container} name="MAP" component={MapScreen} />
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
