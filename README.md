jQuery.jQSlider - Fast and responsive content slider
==================================================

jQSlider follows a new approach in sliding content. Where most slider-plugins are moving the whole list of slides
when animating, jQSlider animates only the list with two visible slides at the time. But the most important difference is,
that it is not cloning the first (respectively last) slides to realize a circular movement. This is important if you have rich content
inside of your slide that would break when it's cloned. This approach makes it also possible to have a fully css based
scaling.

If you have grunt installed (see http://gruntjs.com/) you can build a minified version with

    $ grunt

You can also build an API reference (generated in './doc') by running:

    $ grunt yuidoc

A HowTo can be found here:

http://marcellodisimone.github.com/jquery.jqslider/

And here some examples:

[Simple Slider Setup](http://marcellodisimone.github.com/jquery.jqslider/examples/simple.html)
[Slider with responsive images](http://marcellodisimone.github.com/jquery.jqslider/examples/images.html)
[Slider with responsive videos](http://marcellodisimone.github.com/jquery.jqslider/examples/video.html)
[An individual customized slider](http://marcellodisimone.github.com/jquery.jqslider/examples/customized.html)
[Extending the plugin](http://marcellodisimone.github.com/jquery.jqslider/examples/extending-jqslider.html)
