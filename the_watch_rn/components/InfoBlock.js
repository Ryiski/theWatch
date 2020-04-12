import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFa from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

const InfoBlock = ({ movieInfo: { vote_average, release_date, runtime, trailer, id }, fontSize }) => {


    return (


        <Fragment>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <IconFa name="imdb" size={45} color="rgb(255, 230, 0)" />
                <Text style={{ fontSize:fontSize.fontSize / 1.5, color: '#fff' }}>{vote_average} / 10</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Icon name="md-calendar" size={45} color="rgb(143, 70, 70)" />
                <Text style={{ fontSize:fontSize.fontSize / 1.5, color: '#fff' }}>
                    {release_date.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1')}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Icon name="md-timer" size={45} color="rgb(143, 70, 70)" />
                <Text style={{ fontSize:fontSize.fontSize / 1.5, color: '#fff' }}>{runtime} mins</Text>
            </View>
            {
                trailer ?
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={trailerButton} onPress={() => Linking.openURL(`https://www.youtube.com/embed/${trailer}`).catch((err) => console.error('An error occurred', err))}>
                            <Icon name="logo-youtube" size={45} color="#ff0000" />
                            <Text style={{ fontSize:fontSize.fontSize / 1.5, color: '#fff' }}>Watch Trailer</Text>
                        </TouchableOpacity>

                    </View>
                    :
                    null
            }
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={trailerButton} onPress={() => {
                    
                    Share.open({
                        title: 'The Watch',
                        message: 'Spotted a sick Movie 😍',
                        url: `https://thewatch.herokuapp.com/movie/${id}`,
                        failOnCancel: true
                    })
                    }}>
                    <Icon name="md-share" size={45} color="#adacac" />
                    <Text style={{ fontSize:fontSize.fontSize / 1.5, color: '#fff' }}>Share</Text>
                </TouchableOpacity>

            </View>
        </Fragment>
            
            

    )
}

const { trailerButton } = StyleSheet.create({

    trailerButton: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

});

export default InfoBlock