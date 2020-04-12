import React from 'react';
import { StyleSheet, Text, TouchableOpacity  } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

export default props => {

    let fontSize = { fontSize: RFPercentage(2) }

    return(<Text style={[fontSize,{...props.style}]}>{props.text}{props.child}</Text>)

}

