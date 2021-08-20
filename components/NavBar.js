import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from '../styles';

const Iconoclast = props => (
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

const Label = props => (
  <ImageBackground source={nametag} style={{
    width: 69.34,
    height: 18.13
  }}>
    <Text style={styles.label}>
      {props.label}
    </Text>
  </ImageBackground>
);

const NavItem = props => {
  var style = {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  };
  
  const navigation = useNavigation();
  return (
    <TouchableOpacity >
      <View onPress={() => navigation.navigate(props.label)} style={style}>
        <Iconoclast imgUri={props.image} width={props.width} height={props.height} label={props.label}/>
        {/* <Link to=""/> */}
        <Label label={props.label} />
      </View>
    </TouchableOpacity>
  );
}

const NavBar = props => {
  const listItems = props.images.map((image, index) =>
      <NavItem image={image} width={42} height={49} label={props.labels[index]} key={index}/>
  );

  return (
    <View style={styles.rectangle}>
      {listItems}
    </View>

  );
}

export default NavBar;
  