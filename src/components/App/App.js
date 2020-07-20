import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ok: true,
      searchResults: [{
        name: 'Yellow Submarine',
        artist: 'The Beatles',
        album: 'Revolver',
        id: 1
      },{
        name: 'Tiny Dancer',
        artist: 'Elton John',
        album: 'Madman Across The Water',
        id: 2
      },{
        name: 'Yellow Submarine',
        artist: 'Sweet Little Band',
        album: 'Beatles Para Bebês Vol. 2',
        id: 3
      },{
        name: 'Yellow Submarine',
        artist: 'Beat Bugs',
        album: 'WhoSampled',
        id: 4
      },{
        name: 'Tiny Dancer',
        artist: 'Tim McGraw',
        album: 'Love Story',
        id: 5
      }],
      playlistName: 'New Playlist',
      playlistTracks: [{
        name: 'Stronger',
        artist: 'Britney Spears',
        album: 'Oops!.. I Did It Again',
        id: 6
        },{
          name: 'So Emontional',
          artist: 'Whitney Houston',
          album: 'Whitney',
          id: 7
        },{
          name: 'It\'s Not Right But It\'s Okay',
          artist: 'Whitney Houston',
          album: 'My Love Is Your Love',
          id: 8
        }

      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  componentDidMount(){
    if(this.state.ok) Spotify.getAccessToken();
  }
  componentDidUpdate(){
    this.setState({
      ok: false
    })
  }
  addTrack(track){
    if(this.state.playlistTracks.find
      (savedTrack => savedTrack.id === track.id)) return;
    else{
      let playlistTracks = this.state.playlistTracks;
      playlistTracks.push(track);
      this.setState({
        playlistTracks: playlistTracks
      });
    }
    console.log(this.state.playlistTracks);      
  }
  removeTrack(track){
    if(this.state.playlistTracks.find
      (savedTrack => savedTrack.id === track.id)){
      let playlistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
      this.setState({
        playlistTracks: playlistTracks
      });
    }
    else return;
  }
  updatePlaylistName(name){
    this.setState({
      playlistName: name
    })
  }
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playListName, trackURIs).then((results) => {
        this.setState({
            searchResults: [],
            playListName: 'New Playlist',
            playlistTracks: []
        });
      });
  }
  search(searchTerm){
    Spotify.search(searchTerm).then((results) => {
      if (results) this.setState({ 
        searchResults: results 
      });
    })
  }
  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
              onRemove={this.removeTrack} 
              playlistTracks={this.state.playlistTracks}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
