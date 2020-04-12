import React,{ useEffect, useRef } from 'react'
import { ActivityIndicator, View, Text, FlatList, StyleSheet } from 'react-native';
import { inject, useLocalStore, useObserver } from "mobx-react";
import { action } from 'mobx';
import { Viewport } from '@skele/components';
import Loading from '../components/Loading';

const ViewportAware = Viewport.Aware(View);
import MovieCard from '../components/MovieCard';

const SimilarMovie = inject('store')(({ store, route, fontSize , scroll }) => {
    const { hr, container } = style;


    const state = useLocalStore(() => ({
        movies: null,
        loading: true,
        isFirstRenderDone: false,
        change: action(obj => {
            for(let key in obj){
              state[key] = obj[key];
            }
          })
    }));

    const similarMovieScroll = useRef(null)

    useEffect(() => {

        if(state.isFirstRenderDone){
            fetchSimilar();
        } 

    },[store.getMovie, route.params.movieId, state])

    const fetchSimilar = (stateObjects) => {
        state.loading || state.isFirstRenderDone? store.getMovie(route.params.movieId,'/similar')
        .then(data => state.change({ 
            'movies': data,
            ...stateObjects
            
         }))
        .catch(err => console.log(err))
        :
        null
    }

    return useObserver(() => (
       <ViewportAware style={container} onViewportEnter={()=> !state.isFirstRenderDone && fetchSimilar({'loading': false, 'isFirstRenderDone': true})}>

        
            <Text style={{...fontSize, color: '#fff'}}>Similar Movies</Text>
            <View style={hr} />
            <View style={{minHeight:100, justifyContent:'center'}}>
            {!state.loading?
                state.movies.results.length > 0?
                    <FlatList
                        ref={ref => similarMovieScroll.current = ref }
                        data={state.movies.results} 
                        horizontal={true}
                        contentContainerStyle={{}}
                        keyExtractor={item => `${item.id}`}
                        renderItem={ ({item,index}) => (
                            <MovieCard
                            key={item.id}
                            title={item.title}
                            imgPath={item.poster_path}
                            id={item.id}
                            fontSize={fontSize}
                            index={index}
                            scroll={{ parentScroll:scroll, similarMovieScroll }}
                        />
                         )}   
                        />
                :
                <Text style={{textAlign:'center',fontSize: 20,color: '#fff'}}>No Similar Movies Found</Text>
            :
                <Loading size={50}/>

            }
            
            </View>
        </ViewportAware>
    ))
})


const style = StyleSheet.create({
    hr: {
        marginBottom: 15,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },
    container: {
        padding: 5,
    }
})

export default SimilarMovie
