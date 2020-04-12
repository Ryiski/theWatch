import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native'

export default Loading = ({ style = {},size = null, color = null}) => (
<View style={{flex:1,alignItems:'center', justifyContent:'center',...style}}>
    <ActivityIndicator size={Platform.OS !== 'ios' && size ? size : 'Large'} color={color? color:'rgb(110, 138, 146)'}/>
</View>)
