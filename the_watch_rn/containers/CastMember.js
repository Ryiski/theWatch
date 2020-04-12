import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalStore, useObserver, inject,  } from 'mobx-react'
import { action, toJS } from 'mobx'
import CastCard from '../components/CastCard';
import { Viewport } from '@skele/components';
import { FlatList } from 'react-native-gesture-handler';
import Loading from '../components/Loading';

const ViewportAware = Viewport.Aware(View);

const CastMember = inject('store')(({ store, route, fontSize }) => {

    const { container, hr   } = style;
    const state = useLocalStore(() => ({
        cast: null,
        loading:true,
        isFirstRenderDone: false,
        change: action(obj => {
            for(let key in obj){
              state[key] = obj[key];
            }
          })
    }));

    useEffect(() => {
        if(state.isFirstRenderDone){
            fetchCast()
        }
    },[route.params.movieId])

    const fetchCast = (stateObject) => {
         store.getMovie(route.params.movieId,'/credits')
            .then(data => state.change({ 
                'cast': data.cast,
                'loading':false,
                ...stateObject
            }))
            .catch(err => console.log(err))
    }

    return useObserver(()=> (
        <ViewportAware  style={container} onViewportEnter={() => !state.isFirstRenderDone && fetchCast({ loading:false, isFirstRenderDone:true})}>
            <Text style={{...fontSize, color: '#fff'}}>Cast Members</Text>
            <View style={hr} />
        {
            !state.loading?
                <View>
                {
                    state.cast.length > 0?
                        <FlatList
                        data={state.cast} 
                        horizontal={true}
                        contentContainerStyle={{}}
                        keyExtractor={item => `${item.id}`}
                        renderItem={ ({item}) => (
                            <CastCard
                                imgUrl={item.profile_path}
                                name={item.name}
                                fontSize={fontSize}
                                />
                         )} 
                        />
                        
                            
                        
                    :
                        <Text style={{textAlign:'center', color: '#fff', ...fontSize}}>No cast found for this movie</Text>
                }
                </View>
            :
                <Loading size={50}/>
        }

        </ViewportAware>
    ))
})

const style = StyleSheet.create({
    hr: {
        marginBottom: 5,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    container: {
        // backgroundColor: '#eee',
        borderRadius: 10,
        borderWidth: 5,
        borderColor: '#333',
        marginTop: 20,
        padding: 5,
    }
});
export default CastMember

