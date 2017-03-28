$( document ).ready(function() {
    let preloaderhtmlString = `<div class="preloader-wrapper small active">
        <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
        <div class="circle"></div>
        </div><div class="gap-patch">
        <div class="circle"></div>
        </div><div class="circle-clipper right">
        <div class="circle"></div>
            </div>
        </div>
        </div>`;

    $('.search-form').submit(function(e) {
        e.preventDefault();
        if ($('#search').val() !== '') {
            $('#preloader').append(preloaderhtmlString);
            window.location.href = 'search_results/' + $('#search').val();
        }
    });

    $('#current-location-button').click(function(e) {
        e.preventDefault();
        $('#preloader').append(preloaderhtmlString);
        if (navigator.geolocation) { // checks if the browser supports Geolocation
            navigator.geolocation.getCurrentPosition(showResults); // Get location of the user and send position into showResults
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    function showResults(position) { // using the longitude and latitude from your current position as parameter for when
                                        // I call the current_location page 
        window.location.href = 'current_location/' + position.coords.latitude + '&' + position.coords.longitude;
    }
});