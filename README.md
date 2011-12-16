jQuery.jQSlider - Fast and responsive content slider
==================================================

jQSlider follows a new approach in sliding content. Where most slider-plugins are moving the whole list of slides
when animating, jQSlider animates only two slides simultaneously. But the most important difference is, that it is not
cloning the first (respectively last) slides to realize a circular movement. This is important if you have rich content
inside of your slide that would break when it's cloned. This approach makes it also possible to have a fully css based
scaling.

## Usage


    <div class="jqslider">
        <div class="jqslider-container">
            <div class="jqslider-list">
                <div class="jqslider-slide">
                </div>
            </div>
        </div>
    </div>

    <script>
    var slider = $('#firstlevel-slider').jqslider();
    </script>