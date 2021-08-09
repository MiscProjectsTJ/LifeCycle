import React from 'react';

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

const NavBar = props => {
    const listItems = props.images.map((image) =>
        <NavItem image={image} width={42} height={49} label="MAP" key={image}/>
    );

    return (
      <View style={styles.rectangle}>
        {props.images.map()}
        <NavItem image={map} width={42} height={49} label="MAP" />
        <NavItem image={recycle} width={52.78} height={52.27} label="CLASSIFY" />
        <NavItem image={log} width={70} height={70} label="LOG" />
      </View>
  
    );
  }