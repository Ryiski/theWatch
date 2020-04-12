import {types, configure} from 'mobx-state-tree';
// configure({enforceActions: ''});

const replaceStr = (url, find, replace) => {
  for (let i = 0; i < find.length; i++) {
    url = url.replace(new RegExp(`<<${find[i]}>>`, 'gi'), replace[i]);
  }
  return url;
};

export default types
  .model({
    movieBase: types.string, // `https://api.themoviedb.org/3/movie/${param[/videos,/credits,/reviews,/similar]}?api_key=${apiKey}`
    //movieBase2: types.string, // `https://api.themoviedb.org/3/movie/${param[/videos,/credits,/reviews,/similar]}?api_key=${apiKey}`
    searchMovie: types.string, //`https://api.themoviedb.org/3/search/movie/?api_key=${apiKey}&query=${movieName}&page=${pageNum}`
    genres: types.string, //`https://api.themoviedb.org/4/discover/movie${apiKey}&with_genres=${genresId}&language=en-US&sort_by=popularity.desc&page=${pageNum}`
    year: types.string, // `https://api.themoviedb.org/4/discover/movie${apiKey}&year=${year}&language=en-US&sort_by=popularity.desc&page=${pageNum}`
    upComing: types.string, // `https://api.themoviedb.org/3/movie/upcoming${apiKey}&language=en-US&page=${pageNum}`
    popular: types.string, // `https://api.themoviedb.org/3/movie/popular${apiKey}&language=en-US&page=1`
    topRated: types.string, // `https://api.themoviedb.org/3/movie/top_rated${apiKey}&language=en-US&page=1`
    latest: types.string, // `https://api.themoviedb.org/3/movie/latest${apiKey}&language=en-US`
    nowPlaying: types.string, // `https://api.themoviedb.org/3/movie/now_playing${apiKey}&language=en-US&page=1&region=${ip}`
    trending: types.string, // `https://api.themoviedb.org/3/trending/movie/day${apiKey}`
    // currentRoute: types.optional(types.string, "", [null, undefined])
  })
  .views(self => ({
    useFetch: async (storeProperty, object = {}, fetchOptions = {}) => {
      try {
        const {key} = await fetch(
          'https://us-central1-thewatch-4308d.cloudfunctions.net/api/key',
        ).then(res => res.json());

        const url = self[storeProperty];
        const find = ['apiKey', ...Object.keys(object)];
        const replace = [key, ...Object.values(object)];

        const movieDbEndPoint = replaceStr(url, find, replace);

        const response = fetch(movieDbEndPoint, {...fetchOptions}).then(res =>
          res.json(),
        );

        return response;
      } catch (error) {
        console.log('error', error);
      }
    },
    nowPlaying: async () => {
      const ip = await fetch(
        'https://us-central1-thewatch-4308d.cloudfunctions.net/api/userIp',
      ).then(res => res.json());
      const {key} = await fetch(
        'https://us-central1-thewatch-4308d.cloudfunctions.net/api/key',
      ).then(res => res.json());
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1&region=${
          ip.country
        }`,
      ).then(res => res.json());
      return response;
    },
    getTicket: async (movieId, ipAd) => {
      const ip = ipAd;
      const ticket = await fetch(
        `https://videospider.in/getticket.php?key=gddDirmhUmiZiNlE&secret_key=ci460v939w527xyoo3e23rhe5mwah4&video_id=${movieId}&ip=${ip}`,
      ).then(res => res.text());
      return ticket;
    },

    getMovie: async (movieId, param = '') => {
      try {
        const {key} = await fetch(
          'https://us-central1-thewatch-4308d.cloudfunctions.net/api/key',
        ).then(res => res.json());
        const data = await fetch(
          `${self.movieBase}${movieId}${param}?api_key=${key}`,
        ).then(res => res.json());

        return data;
      } catch (error) {
        alert('Failed to fetch', error);
      }
    },
    fetchLatest: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/latest${apiKey}&language=en-US`,
      ).then(res => res.json());
      return response;
    },

    getLink: (id, ticket) => {
      const url = `https://videospider.stream/getvideo?key=gddDirmhUmiZiNlE&video_id=${id}&tmdb=1&ticket=${ticket}`;
      return url;
    },
  }))
  .actions(self => ({
    change: obj => {
      for (let key in obj) {
        self[key] = obj[key];
      }
    },
  }));
