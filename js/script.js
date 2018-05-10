(function($) {

    "use strict";

    /**
     * Get data movies from API
     */
    var urlData = "https://api.themoviedb.org/3/movie/upcoming?api_key=e082a5c50ed38ae74299db1d0eb822fe";
    var getDataMovies = $.getJSON(urlData, function(data){
        
        var result = data.results;

        // Split variables of the template
        var tplSlide = splitTemplate($('script[data-template="templateSlide"]'));
        var tplBullet = splitTemplate($('script[data-template="templateBullet"]'));
        
        $.each( result, function( i, movie ) {

            // Show first slide by default
            var classActive = "";
            if (i === 0) {
                classActive = " active";
            }

            // Limit characters of the description
            var descMovie = limitCharacters(movie.overview);

            // Round vote in percent
            var vote = Math.round(movie.vote_average) * 10;

            // Store values needed
            var items = [{
                index: i,
                active: classActive,
                title: movie.original_title,
                desc: descMovie,
                img: movie.backdrop_path,
                vote: vote
            }];

            // Render slide template on the .slides element
            $(".slides").append(items.map(function(item) {
                return tplSlide.map(render(item)).join("");
            }));

            // Render pagination template on the .pagination element
            $(".pagination").append(items.map(function(item) {
                return tplBullet.map(render(item)).join("");
            }));

            // Limit 8 slides
            if ( i === 8 ) {
                return false;
            }
        });

    }).always(function() {

        // Variables
        var bullets = $(".bullet");
        var slides = $(".slide");


        /**
         * Click navigation - Slider
         */
        $(".nav").click(function() {
            var slideActive = $(".slide.active");

            // Hide the prev slide and bullet
            hidePrevSlide(slides, bullets);

            if ($(this).hasClass("nav-left")) {

                // If the prev slide exist
                if (slideActive.prev(".slide").length) {
                    // Activate the prev slide
                    var prevSlide = slideActive.prev(".slide");
                    activeCurrentSlide(prevSlide);
                } else {
                    // Activate the last slide
                    var lastSlide = slides.last();
                    activeCurrentSlide(lastSlide);
                }

            } else {

                // If the next slide exist
                if (slideActive.next(".slide").length) {
                    // Activate the next slide
                    var nextSlide = slideActive.next(".slide");
                    activeCurrentSlide(nextSlide);
                } else {
                    // Activate the first slide
                    var firstSlide = slides.first();
                    activeCurrentSlide(firstSlide);
                }
            }
        });


        /**
         * Click pagination - Slider
         */
        $(".bullet").click(function() {
            var currentBullet = $(this);
            if (!currentBullet.hasClass("active")) {
                // Hide the prev slide and bullet
                hidePrevSlide(slides, bullets);

                // Activate the current slide
                activeCurrentSlide(currentBullet);
            }
        });

    });
    

    /**
     * Function to hide the prev slide and bullet
     * @param slides : jQuery element of the prev slide
     * @param bullets : jQuery element of the prev bullet
     */
    function hidePrevSlide(slides, bullets) {
        slides.removeClass("active");
        bullets.removeClass("active");
    }

    /**
     * Function to activate the current slide
     * @param element : jQuery element of the current slide or bullet
     */
    function activeCurrentSlide(element) {
        var currentDataSlide = element.data("slide");
        $("[data-slide=" + currentDataSlide + "]").addClass("active");
    }

    /**
     * Function return split variables of the template
     * @param {*} element 
     */
    function splitTemplate(element) {
        return element.text().split(/\$\{(.+?)\}/g);
    }

    /**
     * Function to render template
     * @param {*} props 
     */
    function render(props) {
        return function(tok, i) {
            return (i % 2) ? props[tok] : tok;
        };
    }

    /**
     * Function to return string with limit characters
     * @param {*} string 
     */
    function limitCharacters(string) {
        if (string.length > 130) {
            string = string.substring(0,127) + "...";
        }
        return string;
    }

})(jQuery);