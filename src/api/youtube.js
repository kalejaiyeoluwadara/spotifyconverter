import axios from "axios";

const key = 'AIzaSyDeGOENcYMtKNKaAVJMYVNFn8RSkQrkJf0'

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        key: key,
        maxResults:1,
        part:'snippet'
    },   
    headers:{}
});
