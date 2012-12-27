/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/


(function ($) {

    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit

     Test methods:
     expect(numAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     raises(block, [expected], [message])
     */

    function EventLogger( target, event ) {
        if ( !(this instanceof EventLogger) ) {
            return new EventLogger( target );
        }
        this.target = target;
        this.log = [];

        var self = this;

        this.target.off( event ).on( event, function( e ) {
            self.log.push(e.type);
        });
    }

    module('jQuery#JQSlider', {
        setup: function () {
            this.elems = $('.jqslider');
            this.elems.jqslider();
        }
    });

    test('is chainable', 1, function () {
        // Not a bad test to run on collection methods.
        strictEqual(this.elems.jqslider(), this.elems, 'should be chaninable');
    });

    test("initialize correctly", 3, function () {
        var container = this.elems.children(),
            list = container.children(),
            slides = list.children();
        equal(container.hasClass("jqs-container"), true, "class for container element was added correctly");
        equal(list.hasClass("jqs-list"), true, "class for list element was added correctly");
        equal(slides.hasClass("jqs-slide"), true, "class for slide elements are added correctly");
    });

    module('Test Events', {
        setup: function () {
            this.elems = $('.jqslider');
            this.slider = this.elems.jqslider({autoinit: false, circular: true});
            this.instance = this.slider.data('jqslider');
            this.firstSlide = this.instance.getSlide(0);
            this.newSlide = this.instance.getSlide(1);
        },
        teardown: function () {
            $(document).off();
            this.slider.off();
            this.newSlide.off();
            this.firstSlide.off();
        }
    });

    asyncTest( "testing events being triggered by the slider", 7, function() {
        var that = this;
        $(document).on( "init", function() {
            ok( true, "init event is fired" );
            that.slider.on({
                "animationstart": function(e) {
                    ok( true, "animationstart event is fired" );
                },
                "animationend": function(e) {
                    ok( true, "animationend event is fired" );
                    start();
                }
            });

            that.newSlide.on(
                {
                    'animationinstart':function(e){
                        ok( true, "animationinstart event is fired" );
                    },
                    'animationinend':function(e){
                        ok( true, "animationinend event is fired" );
                    }
                }
             );
            that.firstSlide.on(
                {
                    'animationoutstart':function(e){
                        ok( true, "animationoutstart event is fired" );
                    },
                    'animationoutend':function(e){
                        ok( true, "animationoutend event is fired" );
                    }
                }
            );
            that.instance.next();
        });

        this.instance.init();
    });

    module('Test programmatic API', {
        setup: function () {
            this.elems = $('.jqslider');
            this.elems.jqslider();
        }
    });

    test('getSlideCount works', 1, function () {
        // Not a bad test to run on collection methods.
        equal(this.elems.data('jqslider').getSlideCount(), 2, 'slide number is correct');
    });

    test('test method addSlide to return an object who\'s an instance of jQuery ', 2, function () {
        // Not a bad test to run on collection methods.
        var instance = this.elems.data('jqslider'),
            newSlide = instance.addSlide();
        ok(typeof newSlide === 'object' && newSlide instanceof $, 'returned object is an instance of jQuery"');
        equal(instance.getSlideCount(), 3, 'slide count was incremented');
    });

    test('test method removeSlide to removing element', 3, function () {
        // Not a bad test to run on collection methods.
        equal(this.elems.data('jqslider').getSlideCount(), 2, 'getSlideCount returns initially 2 slides');
        this.elems.data('jqslider').removeSlide(0);
        equal(this.elems.data('jqslider').getSlideCount(), 1, 'getSlideCount returns correct number of slides');
        equal(this.elems.find('ul li').length, 1, 'Slider list has correct number of DOM elements');
    });

    test('test method switchOrientation to switching CSS class', 1, function () {
        // Not a bad test to run on collection methods.
        this.elems.data('jqslider').switchOrientation();
        ok(this.elems.hasClass('jqs-vertical'), 'slider has class "jqs-vertical" set correctly');
    });

    module('Test control API', {
        setup: function () {
            this.elems = $('.jqslider');
        },
        teardown: function () {
            this.elems.off();
        }
    });

    asyncTest('test method next to trigger animation', 2, function () {
        // Not a bad test to run on collection methods.
        this.elems.jqslider({autoinit: false});
        var instance = this.elems.data('jqslider');
        instance.addSlide();
        this.elems.on({
            'animationend': function () {
                equal(instance.activeIndex, 1, 'current active slider after call of next is 1');
                start();
            }
        });
        instance.init();
        equal(instance.activeIndex, 0, 'current active slider is initialiy 0');
        this.elems.data('jqslider').next();
    });

    asyncTest('test method prev to trigger animation', 2, function () {
        // Not a bad test to run on collection methods.
        this.elems.jqslider({autoinit: false});
        var instance = this.elems.data('jqslider');
        instance.addSlide();
        this.elems.on({
            'animationend': function () {
                equal(instance.activeIndex, 1, 'current active slider after call of next is 1');
                start();
            }
        });
        instance.init();
        equal(instance.activeIndex, 0, 'current active slider is initialiy 0');
        this.elems.data('jqslider').next();
    });

}(jQuery));
