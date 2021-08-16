import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera} from 'expo-camera';

const ClassifyPane = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const[cameraRef, setCameraRef] = useState(null);
  const[img, setImg] = useState(null);
  const[imgUri, setImgUri] = useState(null);
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
      <Camera style={styles.camera} ref={ref => {setCameraRef(ref);}}/>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              "use strict";
              if(cameraRef){
                let photo = await cameraRef.takePictureAsync({base64: true});
                setImg(photo);
                // return <Image source={img.uri}/>;
                // console.log(JSON.stringify(img.base64));
                fetch("http://192.168.0.112:5000/add", {
                  method: "POST",
                  headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({val: img.uri}),
                })
                .then(response => response.json())
                .then(data => {
                  setImgUri(data.result);
                  console.log('Success:', data);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
              }
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
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