//import React from 'react';
//import './Playlist.css';
//import TrackList from '../TrackList/TrackList'

//class Spotify extends React.Component{
    let accessToken = '';
    let Spotify = {
        getAccessToken(){
            if(accessToken !== '') return accessToken;
        }
    }
//}

export default Spotify;