import React from 'react';
import { TouchableOpacity, View, Label, Iconoclast } from 'react-native';

function NavItem(props) {
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

const Navbar = props => {
    const listItems = props.images.map((image, index) =>
        <NavItem image={image} width={42} height={49} label={props.labels[index]} key={index}/>
    );
  
    return (
      <View style={styles.rectangle}>
        {listItems}
      </View>
  
    );
}
  