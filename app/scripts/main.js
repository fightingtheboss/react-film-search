'use strict';

(function($) {
  $(document).ready(function() {
    // Add your jQuery code here
    $.getJSON(TMDB.base_url + '/configuration', {
      api_key: TMDB.api_key,
      language: "en"
    }).done(function(data) {
      if ( data ) {
        TMDB.images = data.images;
        React.render(<FilmSearchApp films={FILMS} />, document.body);
      }
    });
  });
})(jQuery);
