'use strict';

var FilmPoster = React.createClass({
  render: function() {
    var imageUrl = TMDB.images.base_url + 'w185' + this.props.film.poster_path;
    var image = this.props.film.poster_path ? <img src={imageUrl} alt={this.props.film.title} /> : <h1 className="film-poster-placeholder">{this.props.film.title}</h1>;

    return (
      <figure>{image}</figure>
    );
  }
});

var FilmPosterList = React.createClass({
  render: function() {
    var posters = [];

    this.props.films.forEach(function(film) {
      posters.push(<FilmPoster film={film} key={film.id} />);
    });

    return (
      <div className="film-poster-list">{posters}</div>
    );
  }
});

// TODO
// var FilmDetail = React.createClass({
//   render: function() {
//     return ();
//   }
// });

var FilmSearch = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.searchTermInput.getDOMNode().value
    )
  },

  render: function() {
    return (
      <form>
        <input type="text" placeholder="Enter a film title" ref="searchTermInput" value={this.props.searchTerm} onChange={this.handleChange} />
      </form>
    );
  }
});

var FilmSearchApp = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: '',
      films: FILMS
    }
  },

  componentWillMount: function() {
    this.debouncedSearch = _.debounce(this.searchTMDB, 250);
  },

  searchTMDB: function(searchTerm) {
    $.getJSON(TMDB.base_url + '/search/movie', {
      query: searchTerm,
      api_key: TMDB.api_key,
      include_adult: "false",
      language: "en"
    }).done(function(data) {
      if ( data ) {
        this.setState({
          films: data.results
        });
      }
    }.bind(this));
  },

  handleUserInput: function(searchTerm) {
    // Fetch new films from database
    if ( searchTerm.length > 2 ) {
      this.debouncedSearch(searchTerm);
    }

    this.setState({
      searchTerm: searchTerm
    });
  },

  render: function() {
    return (
      <div>
        <FilmSearch searchTerm={this.state.searchTerm} onUserInput={this.handleUserInput} />
        <FilmPosterList films={this.state.films} searchTerm={this.state.searchTerm} />
      </div>
    );
  }
});

var FILMS = [
  { id: 12345, title: 'Back to the Future', year: 1985, poster_path: '/pTpxQB1N0waaSc3OSn0e9oc8kx9.jpg' },
  { id: 67890, title: 'Inherent Vice', year: 2015, poster_path: '/2fCg6FORkgRLpFIKlUg4gULIn1u.jpg' }
];

