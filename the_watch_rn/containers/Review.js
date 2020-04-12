import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalStore, useObserver, inject,  } from 'mobx-react'
import { action, toJS } from 'mobx';
import ReviewCard from '../components/ReviewCard';
import { Viewport } from '@skele/components';
import Loading from '../components/Loading';

const ViewportAware = Viewport.Aware(View);

const Review = inject('store')(({ store, route, fontSize }) => {
    const { hr, container } = style;

    const state = useLocalStore(() => ({
        reviews: null,
        loading: true,
        isFirstRenderDone: false,
        change: action(obj => {
            for(let key in obj){
              state[key] = obj[key];
            }
          })
    }));

    useEffect(() => {

        if(state.isFirstRenderDone){
            fetchReview();
        } 

    },[store.getMovie, route.params.movieId, state])

    const fetchReview = (stateObject) => {
        store.getMovie(route.params.movieId,'/reviews')
        .then(data => state.change({ 
            'reviews': data.results,
            ...stateObject
        }))
        .catch(err => console.log(err))
    }

    return useObserver(() => (
       <ViewportAware style={container} onViewportEnter={()=> !state.isFirstRenderDone && fetchReview({'loading': false, 'isFirstRenderDone': true})}>
            <Text style={fontSize}>Reviews</Text>
            <View style={hr} />
            <View>
                <ScrollView
                contentContainerStyle={{justifyContent:'center',flex: !state.loading? state.reviews?.length > 0? null:1:null}}
                style={{maxHeight:500, minHeight:200}}
                nestedScrollEnabled={true}>
                {
                    !state.loading?
                        state.reviews.length > 0?
                            (state.reviews.map((review, i) => (
                                <ReviewCard
                                key={i}
                                isLastElement={state.reviews.length -1 === i}
                                name={review.author} 
                                review={review.content}
                                fontSize={fontSize}
                                />
                            )))
                            :
                            <Text style={{flex:1,textAlignVertical:'center', textAlign:'center',fontSize:20}}>No reviews made for this movie</Text>
                    :
                    <Loading size={40}/>
                }

                </ScrollView>
            </View>
        </ViewportAware> 
    ))
})

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
        backgroundColor: '#eee',
        borderRadius: 10,
        borderWidth: 5,
        borderColor: '#333',
        padding: 5
    }
});

export default Review
