import React from 'react';
import { Text, View } from 'react-native';
import NavBar from '../components/NavBar';
import styles from '../styles';

const HomeScreen = props => (
  <View>
    <View>
      <Text>Home</Text>
      <Text>Turtles Saved</Text>
      <View style={styles.home_log} />
    </View>
    <NavBar images={props.images} labels={props.labels} />
  </View>
);

export default HomeScreen