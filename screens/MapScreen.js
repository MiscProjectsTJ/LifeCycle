import React, { Component } from 'react';
import { Text, View } from 'react-native';

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
  
 export default MapScreen;