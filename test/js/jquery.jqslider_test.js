/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
QUnit.config.autostart = false;

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

    module('jQuery#JQSlider', {
        setup: function () {
            this.elems = $('.jqslider');
            this.elems.jqslider();
        }
    });

    test('is chainable', 1, function () {
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
            $(document).off('init');
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

    module('Test programmatic API methods:', {
        setup: function () {
            this.elems = $('.jqslider');
            this.elems.jqslider();
        }
    });

    test('getSlideCount', 1, function () {
        equal(this.elems.data('jqslider').getSlideCount(), 2, 'getSlideCount returns correct number of slides');
    });

    test('addSlide', 2, function () {
        var instance = this.elems.data('jqslider'),
            newSlide = instance.addSlide();
        ok(typeof newSlide === 'object' && newSlide instanceof $, 'addSlide returns a jQuery slide object"');
        equal(instance.getSlideCount(), 3, 'Number of slides is incremented');
    });

    test('removeSlide', 2, function () {
        this.elems.data('jqslider').removeSlide(0);
        equal(this.elems.data('jqslider').getSlideCount(), 1, 'removeSlide removed the slide and number of slides is incremented');
        equal(this.elems.find('ul li').length, 1, 'The slider has the correct number of DOM elements');
    });

    test('switchOrientation', 1, function () {
        this.elems.data('jqslider').switchOrientation();
        ok(this.elems.hasClass('jqs-vertical'), 'switchOrientation set the CSS class "jqs-vertical" correctly');
    });

    module('Test control API methods:', {
        setup: function () {
            this.elems = $('.jqslider').jqslider({autoinit: false});
            this.instance = this.elems.data('jqslider');
        },
        teardown: function () {
            $(document).off('animationend');
        }
    });

    asyncTest('next', 1, function () {
        var that = this
        this.instance.init();
        $(document).on({
            'animationend': function () {
                equal(that.instance.activeIndex, 1, 'current active slider changed to 1');
                start();
            }
        });
        this.instance.next();
    });

    asyncTest('prev', 1, function () {
        var that = this;
        this.instance.init();
        $(document).on({
            'animationend': function () {
                equal(that.instance.activeIndex, 1, 'current active slider changed to 1');
                start();
            }
        });
        this.instance.next();
    });

    asyncTest('gotoSlide', 1, function () {
        var that = this;
        this.instance.addSlide();
        $(document).on({
            'animationend': function () {
                equal(that.instance.activeIndex, 2, 'current active slider changed to 2');
                start();
            }
        });
        this.instance.init();
        this.instance.gotoSlide(2);
    });

    start();
}(jQuery));
