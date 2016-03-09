(function($) {

  // THIS PART HERE COVERS ALL DOM MANIPULATION FOR AESTHETIC PURPOSES
  // wont explain a lot here, cos it's not the main functionalities
  $(".input input").focus(function() {
    $(this).parent(".input").each(function() {
      $("label", this).css({
        "line-height": "18px",
        "font-size": "18px",
        "font-weight": "100",
        "top": "0px"
      });

      $(".spin", this).css({
        "width": "100%"
      });
    });
  }).blur(function() {
    $(".spin").css({
      "width": "0px"
    });

    if ($(this).val() === "") {
      $(this).parent(".input").each(function() {
        $("label", this).css({
          "line-height": "60px",
          "font-size": "24px",
          "font-weight": "300",
          "top": "10px"
        });
      });
    }
  });

  // TODO Get random movie poster, put it as the body background
  function randomID(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // console.log(randomID(0, 9999999));
  // getMovieDetails( randomID() );
})(jQuery);
