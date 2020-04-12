import React, { Fragment } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const ReviewCard = ({ fontSize, name, review, isLastElement }) => {
    const { hr, container, icon, reviewName } = style;
    return (
        <Fragment>
            <View style={container}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        style={icon}
                        source={require('../assets/images/user.png')}
                    />
                    <Text style={[{...fontSize},reviewName]}>{name}</Text>
                </View>
                <Text style={{...fontSize, marginVertical:10}}>{review}</Text>
            </View>
            {!isLastElement?<View style={hr} />:null}
        </Fragment>                
    )
}

const style = StyleSheet.create({

    hr: {
        marginBottom: 5,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    container: {
        marginTop: 10,
        marginBottom: 10,
    },
    icon: {
        height: 30,
        width: 30,
        marginRight: 10,
        marginBottom: 10,
    },
    reviewName: {
        color: 'rgb(151, 139, 123)',
        textAlignVertical: "center",
        textDecorationLine: 'underline'
    }
});

export default ReviewCard
