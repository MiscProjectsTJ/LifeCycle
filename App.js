import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TextPropTypes, View } from 'react-native';
import map from './map1.png';
import { Image, ImageBackground } from 'react-native';
import button from './Ellipse29.png';
import nametag from './nametag.png';
import log from './log.png';
import recycle from './recycle.png';

function Navbar(props){
  return (
    <View style={styles.rectangle}>
      <NavItem image={map} width={42.64} height={49} label="MAP"/>
      <NavItem image={recycle} width={52.78} height={52.27} label="CLASSIFY"/>
      <NavItem image={log} width={70} height={70} label="LOG"/>
    </View>
  );
}
function NavItem(props){
  var style = {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  };
  return(
    <View style={style}>
        <Iconoclast imgUri={props.image} width={props.width} height={props.height}/>
        <Label label={props.label}/>
    </View>
  );
}
const Iconoclast = props => (
  <ImageBackground source={button} style={styles.navlog}>
    <Image source={props.imgUri} style={{
      width: props.width,
      height: props.height,
      marginTop: -10,
    }}>
    </Image>
  </ImageBackground>
);
function Label(props){
  return(
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
    <View style={styles.container}>
      <Text>Open up App.js to start working on pp!</Text>
      <StatusBar style="auto" />
      <Navbar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    width: 363,
    height: 70,
    top: 292,
    backgroundColor: "#8AC755",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  badge: {
    textAlign: "center",
    justifyContent: 'center',
    width: "100%",
    marginTop:0,
  },
  navlog: {
    width: 79.34,
    height: 70,
    marginTop:-20,
    justifyContent:'center',
    alignItems: 'center',
  },
  label: {
    position: 'relative',
    textAlign: "center",
    justifyContent: "center",
    color: "#19C5E0"
  },
});
