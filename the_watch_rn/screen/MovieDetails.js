import React, { Fragment, useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MovieInfo from '../containers/MovieInfo'
import CastMember from '../containers/CastMember';
import Review from '../containers/Review';
import SimilarMovie from '../containers/SimilarMovie';
import Header from '../components/Header'
import { Viewport } from '@skele/components';

export const MovieDetails = ({ route, navigation }) => {

    const { viewContainer, scrollContainer } = style;

    let fontSize = { fontSize: RFPercentage(2) }

    const _scrollView = useRef(null);

    return (
        <Fragment>
            <Header style={{}} />
                <View style={viewContainer}>
                <Viewport.Tracker>
                    <ScrollView ref={ref => _scrollView.current = ref} style={scrollContainer} contentContainerStyle={{paddingBottom:0}} nestedScrollEnabled={true}>
                        <MovieInfo fontSize={fontSize} route={route} />
                        <CastMember fontSize={fontSize} route={route} />
                        <Review fontSize={fontSize} route={route} />
                        <SimilarMovie scroll={_scrollView} fontSize={fontSize} route={route} navigation={navigation} />
                    </ScrollView>
                </Viewport.Tracker>
                </View>            
        </Fragment>

    )
};

const style = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#333'
    },
    scrollContainer: {
        flex: 1,

    }
});