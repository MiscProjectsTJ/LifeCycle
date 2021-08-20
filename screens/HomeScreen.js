import React from 'react';
import { Text, View } from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';

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

export default HomeScreen