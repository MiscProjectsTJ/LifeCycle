import React, { Component } from 'react';
import { Text, View } from 'react-native';
import mapInfo from '../map.json';

function MapScreen() {
    return (
      <View>
        <View>
          <Text>Test</Text>
          {/* console.log(mapInfo) */}
        </View>
        <Navbar images={[map, log, recycle]} labels={['MAP', 'LOG', 'CLASSIFY']}/>
      </View>
    );
 }
  
 export default MapScreen;