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

var FilmPosterLink = React.createClass({
  handleClick: function(e) {
    this.props.onSelect(this.props.film);
  },

  render: function() {
    return (
      <a className="film-poster-link" key={this.props.film.id} onClick={this.handleClick}>
        <FilmPoster film={this.props.film} />
      </a>
    );
  }
});

var FilmPosterList = React.createClass({
  render: function() {
    var self = this,
        posters = [];

    this.props.films.forEach(function(film) {
      posters.push(<FilmPosterLink film={film} key={film.id} onSelect={self.props.onSelected} />);
    });

    return (
      <div className="film-poster-list">{posters}</div>
    );
  }
});

var FilmDetail = React.createClass({
  render: function() {
    var film = this.props.film,
        director = null;

    if ( this.props.film ) {
      director = _.first( (!_.isEmpty(film.casts.crew)) && _.pluck( _.filter( film.casts.crew, function(crew) { return crew.department === "Directing" && crew.job === "Director"; } ), "name" ) );

      return (
        <article className="film-detail">
          <FilmPoster film={film} />
          <div className="film-detail-content">
            <h1 className="film-title">{film.title}</h1>
            <h2 className="film-director">{director}</h2>
            <p className="film-summary">{film.overview}</p>
          </div>
        </article>
      );
    } else {
      return (
        <article className="film-detail">
          <div className="film-detail-content">
            <h1 className="film-not-selected">No film selected.</h1>
          </div>
        </article>
      );
    }
  }
});

var FilmSearch = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.searchTermInput.getDOMNode().value
    )
  },

  render: function() {
    return (
      <form>
        <input type="search" placeholder="Enter a film title" ref="searchTermInput" value={this.props.searchTerm} onChange={this.handleChange} />
      </form>
    );
  }
});

var FilmSearchApp = React.createClass({
  getInitialState: function() {
    return {
      searchTerm: '',
      films: FILMS,
      recent: [],
      current: null
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

  handleFilmSelection: function(film) {
    var filmDetail = _.find(this.state.recent, 'id', film.id);

    if ( !filmDetail ) {
      $.getJSON(TMDB.base_url + '/movie/' + film.id, {
        api_key: TMDB.api_key,
        language: "en",
        append_to_response: 'casts,images'
      }).done(function(data) {
        if ( data ) {
          this.setState({
            current: data,
            recent: this.state.recent.concat([data])
          });
        }
      }.bind(this));
    } else {
      this.setState({
        current: filmDetail
      });
    }
  },

  render: function() {
    return (
      <main className="film-search-app">
        <FilmSearch searchTerm={this.state.searchTerm} onUserInput={this.handleUserInput} />
        <FilmPosterList films={this.state.films} onSelected={this.handleFilmSelection} />
        <FilmDetail film={this.state.current} />

        <h2>Recent</h2>
        <FilmPosterList films={this.state.recent} onSelected={this.handleFilmSelection} />
      </main>
    );
  }
});

var FILMS = [
  { id: 12345, title: 'Back to the Future', year: 1985, poster_path: '/pTpxQB1N0waaSc3OSn0e9oc8kx9.jpg' },
  { id: 67890, title: 'Inherent Vice', year: 2015, poster_path: '/2fCg6FORkgRLpFIKlUg4gULIn1u.jpg' }
];

