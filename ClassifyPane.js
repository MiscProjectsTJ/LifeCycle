import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, AppRegistry } from 'react-native';
import { Camera} from 'expo-camera';
import SQLite from 'react-native-sqlite-storage';
import { setData, getData } from './database_functions';

const ClassifyPane = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const[cameraRef, setCameraRef] = useState(null);
  const[img, setImg] = useState(null);
  const[text, setText] = useState(<Text></Text>);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const[camera, setCamera] = useState()

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
      <Text style={styles.text}>classify</Text>
      {camera}
      <Camera style={styles.camera} ref={ref => {setCameraRef(ref);}}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            "use strict";
            if(cameraRef){
              let photo = await cameraRef.takePictureAsync({base64: true});
              setData(new Date().getTime(), 'plastic', JSON.stringify(photo.base64));

              setImg(photo);
              setTimeout(function(){
              setText(<Text style={{color:"white",fontSize:20, alignSelf:"center"}}>plastc</Text>);
              }, 1000,);
              // body = JSON.stringify({"val":btoa(photo.base64)})

              // return <Image source={img.uri}/>;
              // console.log(JSON.stringify(img.base64));
              // fetch("https://lifecycleapi-production.up.railway.app/add", {
              //   "method": "POST",
              //   "headers": {
              //     Accept: "*/*",
              //     "Content-Type": "application/json"
              //   },
              //   "body": body,
              // })
              // .then(response => response.json())
              // .then(data => {
              //   setImgUri(data.result);
              //   console.log('Success:', data);
              // })
              // .catch((error) => {
              //   console.error('Error:', error);
              // });
            }
          }}>
          <Text style={styles.buttonText}> capture </Text>
        </TouchableOpacity>
        </View>        
        <ScrollView>
          {text}
        </ScrollView>
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
      height:"50%",
      alignSelf:'center',
      marginTop: '5%',
      overflow: 'hidden',
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'center',
    },
    button: {
      width: 300,
      height: 41,
      borderWidth: 1,
      borderColor: '#BED751',
      borderRadius: 10,
      alignItems: 'center',
    },
    text: {
      fontSize: 36,
      color: '#BED751',
      alignSelf:'center',
    },
    buttonText: {
      fontSize: 24,
      color: '#E74C3C',
      alignSelf:'center',
    },
});
export default ClassifyPane;