import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, takePictureAsync} from 'expo-camera';
const ClassifyPane = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={ref => {this.camera=ref}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if(this.camera){
                let photo = await this.camera.takePictureAsync(base64=true);
                photo.then((val)=> console.log(val));
              }
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:"100%",
      backgroundColor: '#36425C',
      alignSelf: 'center',
      overflow: 'hidden',
    },
    camera: {
      width:"70%",
      height:"60%",
      alignSelf:'center',
      marginTop: '10%',
      overflow: 'hidden',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.12,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
});
export default ClassifyPane;