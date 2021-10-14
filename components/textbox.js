const TextBox = () => (
    <View style={[styles.rectangleMap, styles.elevation, styles.layoutMap]}>
        <Image style={styles.imageMap} source={mapInfo[x]["Image"]}/>
        <Text style={ {fontSize:30} }>{mapInfo[x]["Type"]}</Text>
        <TouchableOpacity key={x} onPress={() => navigation.navigate('Map Screen', {index: x})}>
        <Image style={styles.imageMap2} source={arrow}/>      
        </TouchableOpacity>
    </View>
)

export default TextBox;