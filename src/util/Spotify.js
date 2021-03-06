const CLIENT_ID = "0bc1fd2087ab43f5b77e4186465a2ec";
const CLIENT_ID_BASE64 = "MGJjMWZkMjA4N2FiNDNmNWI3N2U0MTg2NDY1YTJlYz";
const CLIENT_SECRET = "f7b4a87ae933404fad791c523e8a135";
const CLIENT_SECRET_BASE64 = "ZjdiNGE4N2FlOTMzNDA0ZmFkNzkxYzUyM2U4YTEzNT";
const CLIENT_ID_SECRET_BASE64 ="MGJjMWZkMjA4N2FiNDNmNWI3N2U0MTg2NDY1YTJlYzJmN2I0YTg3YWU5MzM0MDRmYWQ3OTFjNTIzZThhMTM1M";
//const REDIRECT_URI = "http://localhost:3000/";
const REDIRECT_URI = "https://beispiele.grizzley.ch/jammming/";

let accessToken = '';
let Spotify = {
    getAccessToken(){
        const accessTokenReg = /access_token=([^&]*)/;
        const expiresInReg = /expires_in=([^&]*)/;
        if(accessToken.length > 0 ) return accessToken;
        else if(window.location.href.match(accessTokenReg) && 
                window.location.href.match(expiresInReg)){
            const accessTokenMatch = window.location.href.match(accessTokenReg);
            const expiresInMatch = window.location.href.match(expiresInReg);
            accessToken = accessTokenMatch[1];
            let expiresIn = expiresInMatch[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }
        else window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
    
    },
    search(searchTerm){
        accessToken = this.getAccessToken();
        //console.log('In search()',accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${accessToken}`
                }
            }).then(response =>{
                //console.log(response);
                return response.json();
            }).then(jsonResponse =>{
                if(jsonResponse.tracks.items){
                    return jsonResponse.tracks.items.map(track =>(
                        {   
                            id: track.id,
                            name: track.name,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            uri: track.uri
                        }
                    ));
                }
                else{
                    let emptyArray = [];
                    return emptyArray;
                }
            });
    },
    savePlaylist(playlistName, trackURIs){
        if(!playlistName || !trackURIs) return;
        //console.log(playlistName);
        let token = this.getAccessToken();
        let headers = {
            Authorization: `Bearer ${token}`
        };
        let userId = '';
        let playlistId = '';
        return fetch(`https://api.spotify.com/v1/me`, {
            method: 'GET',
            headers: headers
            }).then(response =>{
                return response.json();
            }).then(jsonResponse =>{
                //console.log('jsonResponse.id: ',jsonResponse.id);
                if(jsonResponse.id) userId = jsonResponse.id;
            }).then(() => {
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName}),
                json: true
                }).then(response => { 
                    return response.json();
                }).then(jsonResponse => {
                playlistId = jsonResponse.id;
                }).then(() => {
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                method: 'POST',
                headers: headers,
                body: JSON.stringify({uris: trackURIs}),
                json: true
                }).then(response => { 
                    return response.json()
                }).then(jsonResponse => {
                    playlistId = jsonResponse.id;
                })
            })
          });
        

    }
}

export default Spotify;

