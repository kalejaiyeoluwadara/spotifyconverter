import axios from "axios";

const key = 'AIzaSyDEmTTY2neJdt5GT6Y378zryQAo_j7EDvQ'

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        key: key,
        maxResults:1,
        part:'snippet'
    },   
    headers:{}
});
