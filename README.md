jQuery.jQSlider - Fast and responsive content slider
==================================================

jQSlider follows a new approach in sliding content. Where most slider-plugins are moving the whole list of slides
when animating, jQSlider animates only two slides simultaneously. But the most important difference is, that it is not
cloning the first (respectively last) slides to realize a circular movement. This is important if you have rich content
inside of your slide that would break when it's cloned. This approach makes it also possible to have a fully css based
scaling.

## Usage


    <div class="jqslider">
        <a href="#" class="jqs-handler-next jqs-handler"></a>
        <a href="#" class="jqs-handler-prev jqs-handler"></a>
        <ul>
            <li>
                <!-- Your content goes here -->
            </li>
        </ul>
    </div>

    <script>
        var slider = $('#firstlevel-slider').jqslider();
    </script>

## Options

**autosetup [true]**
You can prevent an automatic setup of the slider and run the setup manually. This is helpfull if you want to add new
slides programmaticly and need access to the plugin instance. Because jqslider hides all slides not currently needed,
it's sometimes not possible to retrieve the right dimensions of the slide.

    var slider = $('#firstlevel-slider').jqslider({autosetup:false});
    var sliderClass = slider.data('jqslider');
    for( var i = 0; i <= 10; i++ ){
        var currentSlide = sliderClass.addSlide();
        currentSlide.append('<p>Slide ' + i + '</p>');
    }
    sliderClass.setup();

**circular [false]**
if set to true the slider will do a circular roundtrip

**animationSpeed [500]**
Speed of the animation

**easingFunction ['linear']**
if you have included the easing plugin, you can pass the easing function here

**listSelector ['ul']**
Defines the element type of the slide container element

**slideSelector ['li']**
Defines the element type of the slide element

**slideTemplate ['<li />']**
Defines the HTML snippet that is used to create a new slide