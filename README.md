jQuery.jQSlider - Fast and responsive content slider
==================================================

jQSlider follows a new approach in sliding content. Where most slider-plugins are moving the whole list of slides
when animating, jQSlider animates only the list with two visible slides at the time. But the most important difference is,
that it is not cloning the first (respectively last) slides to realize a circular movement. This is important if you have rich content
inside of your slide that would break when it's cloned. This approach makes it also possible to have a fully css based
scaling.

## Usage

    <div id="content-slider" class="jqslider">
        <a href="#" class="jqs-handler-next jqs-handler"></a>
        <a href="#" class="jqs-handler-prev jqs-handler"></a>
        <div class="jqs-container">
            <ul>
                <li>
                    <!-- Your content goes here -->
                </li>
            </ul>
        </div>
    </div>

    <script>
        var slider = $('#content-slider').jqslider();
    </script>

## Options

    **autoinit [true]**
    You can prevent an automatic initialisation of the slider if you want to run it later on. This is than helpful, if you need the instance of
    the plugin to access its methods, like addSlide, but you don't want the slides to be setup. Because JQSlider adds classes to all elements that
    applies styling to it, like hiding not needed slides, so that it can prevent you from determining the correct height and width values of its
    child elements.

        var slider = $('#content-slider').jqslider({autoinit:false});
        var pluginInstance = slider.data('jqslider');
        var totalWidth = 0;
        for( var i = 0; i <= 10; i++ ){
            var currentSlide = pluginInstance.addSlide();
            currentSlide.append('<div class="slide-content">Slide ' + i + '</p>');
            totalWidth += currentSlide.width();
        }
        pluginInstance.init();

    **circular {Boolean=false}**
    Set to true, for an endless animation.

    **duration {Number=500}**
    Duration of the animation

    **easingFunction {String='linear'}**
    If you have included the easing plugin, you can define an easing function for the animation.

    **startSlide {Number=0}**
    Zero based index of the slide to start with.

    **containerSelector {String='.jqs-container'}**
    Define the jquery selector of the container element for querying. Must be set in the markup.

    **listTag {String='ul'}**
    Define the tag name of the container element for querying.

    **slideTag {String='li'}**
    Define the tag name of the slide element for querying. It will be used for building the HTML template when creating a new slide.