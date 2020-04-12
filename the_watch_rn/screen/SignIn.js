import React from 'react'
import { View, Text, Button } from 'react-native'

export const SignIn = ({navigation:{navigate}}) => {
    return (
        <View>
            <Text>SignIn</Text>
            <Button
            title="Go to Details"
            onPress={() => navigate('Details')}
        />
        <Button
            title="Sign Up"
            onPress={() => navigate('SignUp')}
        />
        </View>
    )
}
