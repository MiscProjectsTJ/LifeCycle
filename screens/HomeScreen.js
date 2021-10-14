import React from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <Text>Turtles Saved</Text>
        <View style={styles.home_log} />
        <Navbar />
      </View>
    );
}

export default HomeScreen