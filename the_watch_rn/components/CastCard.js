import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import Loading from '../components/Loading';

const CastCard = ({ fontSize, imgUrl, name }) => {

    const { container, castImg, castName } = style;
    return (
        <View style={container}>
        
            <View style={{ position:'relative', minHeight: 100, minWidth: 100, elevation:2,}}>
                <Image
                    onError={() => imgUrl = require('../assets/images/noimage-actor.png')}
                    style={castImg}
                    source={imgUrl?{ uri: `https://image.tmdb.org/t/p/w185/${imgUrl}` }:require('../assets/images/noimage-actor.png')}
                />
                <Loading size={50}/>
            </View>
            <Text style={[fontSize,castName]}>{name}</Text>
        </View>
                    
    )
}

const style = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 5,
        
    },
    castImg: {
        width: null,
        height: null,
        borderRadius: 100 / 2,
        resizeMode: 'cover',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        // flex:1,
        zIndex:1
    },
    castName: {
        width: 100,
        textAlign: 'center',
        color: '#fff'
    }
});
export default CastCard

