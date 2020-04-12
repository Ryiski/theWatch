import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient'

const MovieCardList = ({ item: { title, poster_path, id, }, index, dataLength, navigation, }) => {

    const fontSize = { fontSize: RFPercentage(2) }
    
    const imageSrc = poster_path ? { uri: `https://image.tmdb.org/t/p/w500/${poster_path}` } : require('../assets/images/placeholder.jpg')

    return (
        <TouchableOpacity
            style={{ ...clickable, maxWidth: dataLength === index + 1 && !((index + 1) % 2 == 0) ? '49.2%' : '50%', }}
            onPress={() => navigation.navigate('MovieDetails', { movieId: id })}>
            <ImageBackground
                source={imageSrc} 
                blurRadius={4} 
                style={movieImageBlur}>
                    <View style={loadingContainer}>
                        <ActivityIndicator size={100} color="rgb(110, 138, 146)" />
                    </View>
                    <Image source={imageSrc} style={movieImage} />
                    <LinearGradient style={lG} colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.4)', 'rgba(0,0,0,.8)']}>
                        <Text style={[movieTitle, fontSize]}>{title}</Text>
                    </LinearGradient>
            </ImageBackground>

        </TouchableOpacity>
    )
}

const { movieTitle, lG, movieImage, loadingContainer, movieImageBlur, clickable } = StyleSheet.create({
    movieTitle: {
        textAlign: 'center',
        padding: 5,
        color: 'white'
    },
    lG: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    movieImage: {
        height: '90%',
        width: '90%',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    movieImageBlur: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
    },
    clickable: {
        backgroundColor: 'rgba(255,255,255,.5)',
        height: 350,
        maxHeight: 350,
        flex: 1,
        marginRight: 10,
    }

})

export default MovieCardList