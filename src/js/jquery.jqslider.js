/**
 * A responsive and fast content Slider
 * jQSlider follows a new approach in building a slider. Where most slider-plugins
 * are moving the whole list of slides when animating, jQSlider animates only the
 * two slides necessary for the animation simultaneously. This is not only an way
 * to optimize the performance of the animation, it also allows to realize a 100%
 * css based scaling which leads us to a full responsive slider.
 *
 * @module JQSlider
 * @requires jQuery
 * @extends jQuery.fn
 * @author Marcello di Simone <mdisimone.dev@googlemail.com>
 * @example Add the following markup to your page
 *
 *      <div class="jqslider">
 *          <div class="jqs-container">
 *              <ul>
 *                  <li></li>
 *                  <li></li>
 *              </ul>
 *          </div>
 *          <a href="#" class="jqs-handler-next jqs-handler"></a>
 *          <a href="#" class="jqs-handler-prev jqs-handler"></a>
 *      </div>
 *
 * And initialize the slider with the following script block
 *
 *      $(document).ready(function () {
 *          $('.jqslider').jqslider();
 *      });
 *
 * @Markdown
 */

/**
 * @namespace
 * @param {jQuery} $    Aliased `jQuery` object or alternatively `Zepto`.
 * @param {HTMLElement} windows Reference to the `window` object
 * @param {HTMLElement} document Reference to the `document` object
 * @param {undefined}   undefined this is just a way to assure that undefined has
 *      not been overloaded with some other value than undefined
 */
(function ($, window, document, undefined) {
    "use strict";
    /**
     * Plugin Constructor
     * @class JQSlider
     * @constructor
     * @param {HTMLElement} elem element to be initialized
     * @param {Object} [options] Options for the Plugin Member
     *   @param {Boolean} [options.circular=false] You can prevent an automatic
     *     initialisation of the slider if you want to run it later on. This
     *     is than helpful, if you need the instance of the plugin to access
     *     its methods, like `addSlide`, but you don't want the slides to
     *     be setup. Because `JQSlider` adds classes to all elements that
     *     applies styling to it, like hiding not needed slides, so that it
     *     can prevent you from determining the correct height and width
     *     values of its child elements.
     *   @param {Number} [options.startSlide=0] Defines the slide number to be
     *     shown initially
     *   @param {Number} [options.duration=500] Duration of the animation
     *   @param {String} [options.easingFunction='linear'] If you have included
     *     the easing plugin, you can define an easing function for the animation.
     *   @param {String} [options.containerSelector='.jqs-container'] Define
     *     the jquery selector of the container element for querying. Must
     *     be represented in the markup.
     *   @param {String} [options.listSelector='ul'] Define the jquery selector of
     *     the list element for querying.
     *   @param {String} [options.slideTag='li'] Define the tag name of the
     *     slide element for querying. It will be used for building the HTML
     *     template when
     */
    function JQSlider (elem, options) {
        /**
         * Stores a reference to the jQuery object of the module
         *
         * @property $el
         * @type {Object}
         */
        this.$el = $(elem);
        /**
         * Object with the configuration options of the module, the plugin
         * defaults will be extended with options passed while initialisation
         * and last by options set in the `data-options attribute of the HTML
         * element of the slider
         *
         * @property _o
         * @extends JQSlider.defaults
         * @type {Object}
         * @private
         */
        this._o = $.extend(JQSlider.prototype.defaults, options, $.parseJSON(( this.$el.data('options') || "" ).replace(/'/g, "\"")));
        /**
         * Defines if the layout of the slider is vertical or not. Will be
         * defined initially by the css class 'jqs-vertical' of the element.
         *
         * @property isVertical
         * @type {Boolean}
         * @default false
         */
        this.isVertical = this.$el.hasClass('jqs-vertical');
        /**
         * set to true while animating to prevent double clicking
         *
         * @property _block
         * @type {Boolean}
         * @default false
         * @private
         */
        this._block = false;
        /**
         * alignment value shortcuts
         *
         * @property _av
         * @type {Array}
         * @private
         * @final
         */
        this._av = [
            {pos: 'left', size: 'width'},
            {pos: 'top', size: 'height'}
        ];
        /**
         * This "template" is used to generate new slides, it is build using the
         * `slideTag config value.
         *
         * @property _tmpl
         * @type {String}
         * @private
         */
        this._tmpl = '<' + this._o.slideTag + '/>';

        /**
         * reference of the slider container
         *
         * @property _container
         * @type {Object}
         * @private
         */
        this._container = this.$el.children(this._o.containerSelector);
        /**
         * reference of the slider list element
         *
         * @property _list
         * @type {Object}
         * @private
         */
        this._list = this._container.children(this._o.listSelector);
        /**
         * jQuery set of all slide elements
         *
         * @property _slides
         * @type {Object}
         * @private
         */
        this._slides = this._list.children(this._o.slideTag);

        if (this._o.autoinit !== false) {
            this.init();
        }
    }

    JQSlider.prototype = {
        /**
         * Stores all configuration settings, this set will be extended with
         * client configuration objects
         *
         * @property defaults
         * @type {Object}
         */
        defaults: {
            /**
             * You can prevent an automatic initialisation of the slider if you
             * want to run it later on. This is than helpful, if you need the
             * instance of the plugin to access its methods, like addSlide, but
             * you don't want the slides to be setup. Because JQSlider adds
             * classes to all elements that applies styling to it, like hiding
             * not needed slides, so that it can prevent you from determining
             * the correct height and width values of its child elements.
             *
             * @config autoinit
             * @type {Boolean}
             * @default true
             */
            autoinit: true,
            /**
             * Set to true, for an endless animation.
             *
             * @config circular
             * @type {Boolean}
             * @default false
             */
            circular: false,
            /**
             * Zero based index of the slide to start with
             *
             * @config startSlide
             * @type {Number}
             * @default 0
             */
            startSlide: 0,
            /**
             * Duration of the animation
             *
             * @config duration
             * @type {Number}
             * @default 500
             */
            duration: 500,
            /**
             * If you have included the easing plugin, you can define an easing
             * function for the animation.
             *
             * @config easingFunction
             * @type {String}
             * @default 'linear'
             */
            easingFunction: 'linear',
            /**
             * Define the jquery selector of the container element for querying.
             * Must be represented in the markup.
             *
             * @config containerSelector
             * @type {String}
             * @default '.jqs-container'
             */
            containerSelector: '.jqs-container',
            /**
             * Define the jquery selector of the list element for querying.
             *
             * @config listSelector
             * @type {String}
             * @default 'ul'
             */
            listSelector: 'ul',
            /**
             * Define the tag name of the slide element for querying. It will be
             * used for building the HTML template when creating a new slide.
             *
             * @config slideTag
             * @type {String}
             * @default 'li'
             */
            slideTag: 'li'
        },

        /**
         * Moves to the next slide
         *
         * @method next
         * @return {JQSlider} returns a chainable reference to `JQSlider`
         * @chainable
         */
        next: function () {
            var next = this._getSibblingIndex();
            // if the slider has no circular animation and the last slide is
            // already present, do nothing
            if (next !== false) {
                this.gotoSlide(next, false);
            }

            return this;
        },

        /**
         * Moves to the previous slide
         *
         * @method prev
         * @return {JQSlider} returns a chainable reference to `JQSlider`
         * @chainable
         */
        prev: function () {
            var prev = this._getSibblingIndex(true);
            // if the slider has no circular animation and the first slide is
            // already present, do nothing
            if (prev !== false) {
                this.gotoSlide(prev, true);
            }

            return this;
        },

        /**
         * Moves to the given slide number. The direction, based on the
         * orientation (horizontal/vertical), can be set with counterwise. If
         * you want to jump directly to the slide, without an animation, pass
         * `noAnimation` as true.
         *
         * @method gotoSlide
         * @param {Number} slideNumber number of slide to go to
         * @param {Boolean} [counterwise=false] optional set to true if the
         *   animation should go to the opposite direction
         * @param {Boolean} [noAnimation=false] optional set to true if slide
         *   should be shown instantly without an animation
         * @return {JQSlider} returns a chainable reference to JQSlider
         * @chainable
         */
        gotoSlide: function (slideNumber, counterwise, noAnimation) {
            // stop if slider is currently animating or slideNumber number is out of bound
            slideNumber = parseInt(slideNumber, 10);
            if (this._block === false && slideNumber >= 0 && slideNumber < this._slides.length && slideNumber !== this.activeIndex) {

                this._block = true;

                counterwise = counterwise || false;

                var self = this,
                    next = this.getSlide(slideNumber),
                    current = this.getSlide(this.activeIndex),
                    // extend `currentCSS` with the `cssDefaults` to avoid value
                    // pollution after orientation changes, which means the top,
                    // respectively left value, would be kept in the `cssDefault`
                    // object and cause a diagonal animation
                    currentCSS = {},
                    // typecast the boolean value this.isVertical to get the
                    // first or second index of the array this._av which holds
                    // the sting top or left
                    elmPos = this._av[ +this.isVertical ].pos,
                    // typecast the boolean value `this.isVertical` to get the
                    // first or second index of the array this._av which holds
                    // the sting width or height
                    elmSize = this._av[ +this.isVertical ].size,
                    moveSize = this._list[ elmSize ]() / 2;

                this._startAnimation(slideNumber, counterwise, noAnimation, current, next);

                if (noAnimation === true) {
                    this._endAnimation(slideNumber, counterwise, noAnimation, current, next);
                } else {
                    // jQuery has a calculation bug in IE8 when translating
                    // negative percent values in pixels, therefor we set it
                    // ourself
                    this._list.toggleClass('jqs-list-before', counterwise).css(elmPos, counterwise ? -moveSize : 0);
                    next.addClass('jqs-next');
                    currentCSS[ elmPos ] = ( counterwise ) ? '0' : -moveSize;
                    this._list.animate(currentCSS, {
                        duration: this._o.duration,
                        easing: this._o.easingFunction,
                        complete: function () {
                            self._endAnimation(slideNumber, counterwise, noAnimation, current, next);
                        }
                    });
                }
            }

            return this;
        },

        /**
         * This function is called when the animation started. It is excluded
         * from the animation method to help building a inherited Slider class.
         * In this case it triggers the animation start event.
         *
         * @method _startAnimation
         * @param {Number} slideNumber  Number of the slide that had been animated in
         * @param {Boolean} counterwise if true the animation will move to the left
         *   or top if it's a vertical animation
         * @param {Boolean} noAnimation if true the slide will be shown right away,
         *   without animation
         * @param {jQuery} current      `jQuery` element of the slide that was
         *   animated out
         * @param {jQuery} next         `jQuery` element of the slide that was
         *   animated in
         * @private
         */
        _startAnimation: function (slideNumber, counterwise, noAnimation, current, next) {
            current.trigger('animationoutstart');
            next.trigger('animationinstart');
            this.$el.trigger('animationstart', [ this.activeIndex, slideNumber, counterwise, noAnimation ]);
        },

        /**
         * This function is called when the animation ends. All slides are reset
         * to default with the next slide as current slide. It is excluded from
         * the animation method to help building a inherited Slider class.
         *
         * @method _endAnimation
         * @param {Number} slideNumber  Number of the slide that had been animated in
         * @param {Boolean} counterwise if true the animation will move to the left
         *   or top if it's a vertical animation
         * @param {Boolean} noAnimation if true the slide will be shown right away,
         *   without animation
         * @param {jQuery} current      `jQuery` element of the slide that was
         *   animated out
         * @param {jQuery} next         `jQuery` element of the slide that was
         *   animated in
         * @private
         */
        _endAnimation: function (slideNumber, counterwise, noAnimation, current, next) {
            current.removeClass('jqs-current').trigger('animationoutend');
            next.removeClass('jqs-next').addClass('jqs-current').trigger('animationinend');
            this._list.attr('style', '').removeClass('jqs-list-before');
            this.activeIndex = slideNumber;
            this._block = false;
            this._resetControls();
            this.$el.trigger('animationend', [ this.activeIndex, slideNumber, counterwise, noAnimation ]);
        },

        /**
         * Returns the zero based length of the slides array.
         *
         * @method getSlideCount
         * @return {Number} returns the number of all slides
         */
        getSlideCount: function () {
            return this._slides.length;
        },

        /**
         * Switches the orientation of the slider between horizontal and vertical.
         *
         * @method switchOrientation
         * @return {JQSlider} returns a chainable reference to JQSlider
         * @chainable
         */
        switchOrientation: function () {
            this.$el.toggleClass('jqs-vertical');
            this.isVertical = !this.isVertical;

            return this;
        },

        /**
         * Adds a new slide node into the slide container. Optionally the position
         * of the new slide can be defined with `slidePosition`.
         *
         * @method addSlide
         * @param {Number} [slidePosition] position of the new slide to be appended to
         * @return {jQuery} returns the `jQuery` object of the created slide
         */
        addSlide: function (slidePosition) {
            var newSlide = $(this._tmpl, {'class': 'jqs-slide'});
            if (undefined !== slidePosition && slidePosition < this._slides.length) {
                this.getSlide(slidePosition).before(newSlide);
            } else {
                this._list.append(newSlide);
            }
            this._slides = this._list.children(this._o.slideTag);

            return newSlide;
        },

        /**
         * Returns the slide node at the given index
         *
         * @param {Number} slideIndex
         * @return {jQuery} returns the `jQuery` object of the slide with the
         * passed index
         */
        getSlide: function (slideIndex) {
            return this._slides.eq(slideIndex);
        },

        /**
         * Removes a given slide, defined by the index or ID, or a whole `jQuery` slide set.
         *
         * @method removeSlide
         * @param {Number|String|Object} slide index, ID or `jQuery` set of the
         *   slide to be removed
         */
        removeSlide: function (slide) {
            /** TODO: make this more specific */
            var foundSlide = ( typeof slide === 'number' ) ? this.getSlide(slide) : ( typeof slide === 'string') ? this._slides.find(slide) : slide;
            foundSlide.remove();
            this._slides = this._list.children(this._o.slideTag);
        },

        /**
         * Returns the zero based position of the following slider.
         *
         * @method _getSibblingIndex
         * @param {Boolean} prev
         * @return {Number|Boolean} returns index of next slide or false
         * @private
         */
        _getSibblingIndex: function (prev) {
            var index,
                circular = this._o.circular,
                activeIndex = this.activeIndex,
                slidesLength = this._slides.length;

            if (prev) {
                index = ( activeIndex > 0 ) ? --activeIndex : circular ? --slidesLength : false;
            } else {
                index = ( ++activeIndex < slidesLength ) ? activeIndex : circular ? 0 : false;
            }
            return index;
        },

        /**
         * Hides the previous handler, respectively next handler, if no circular
         * animation is configured and the first, respectively last slide is
         * reached.
         *
         * @method _resetControls
         * @private
         */
        _resetControls: function () {
            if (this._handlers.length && !this._o.circular) {
                this._handlers.removeClass('jqs-inactive');
                if (this.activeIndex === 0) {
                    this._prevHandler.addClass('jqs-inactive');
                } else if (this.activeIndex === this._slides.length - 1) {
                    this._nextHandler.addClass('jqs-inactive');
                }
            }
        },

        /**
         * Initializes the slider and all slides, set class names on all objects
         * and display the first slide
         *
         * @method _initSlider
         * @private
         */
        _initSlider: function () {
            this._list.addClass('jqs-list');
            this._slides.addClass('jqs-slide');

            var current = this._slides.filter('[class*="jqs-current"]').index();
            /**
             * Index of the current active slide. Can be defined by configuration
             * or by adding the class `jqs-current` to the appropriate slide.
             *
             * @property activeIndex
             * @type Number
             * @default 0
             */
            this.activeIndex = current >= 0 ? current : this._o.startSlide || 0;

            this.getSlide(this.activeIndex).addClass('jqs-current');
        },

        /**
         * Initialises the Slider controls and binds them to the previous and
         * next methods.
         *
         * @method _initControls
         * @private
         */
        _initControls: function () {
            var self = this,
                /**
                 * `jQuery` set with all handlers found inside the `JQSlider` element
                 * with the class defined in css.handler.
                 *
                 * @private
                 * @property _handlers
                 * @type {Object}
                 */
                handlers = this._handlers = this.$el.children('.jqs-handler');
            if (handlers.length) {
                /**
                 * `jQuery` set with all handlers found inside the `JQSlider` element
                 * with the class defined in css.nextHandler.
                 *
                 * @private
                 * @property _nextHandler
                 * @type {Object}
                 */
                this._nextHandler = handlers.filter('.jqs-handler-next').bind('click', function (e) {
                    e.preventDefault();
                    self.next();
                });
                /**
                 * `jQuery` set with all handlers found inside the `JQSlider` element
                 * with the class defined in css.prevHandler.
                 *
                 * @private
                 * @property _prevHandler
                 * @type {Object}
                 */
                this._prevHandler = handlers.filter('.jqs-handler-prev').bind('click', function (e) {
                    e.preventDefault();
                    self.prev();
                });
                if (!this._o.circular && this.activeIndex === 0) this._prevHandler.addClass('jqs-inactive');
            }
        },
        /**
         * Initializes the `JQSlider` plugin and binds the available events to it.
         * Finally it triggers the init event.
         *
         * @method init
         * @return {JQSlider} returns a chainable reference to `JQSlider`
         * @chainable
         */
        init: function () {
            var self = this;

            this._initSlider();

            this._initControls();

            /**
             * maps the event prev to the API method next
             *
             * @event prev
             * @see prev
             */

            /**
             * maps the event next to the API method next
             *
             * @event next
             * @see next
             */

            /**
             * maps the event gotoslide to the API methdo gotoSlide
             *
             * @event gotoslide
             * @see gotoSlide
             * @param {Number} slideNumber number of slide to go to
             * @param {Boolean} [counterwise=false] optional set to true if
             *   the animation should go to the opposite direction
             * @param {Boolean} [noAnimation=false] optional set to true if
             *   slide should be shown instantly without an animation
             */
            this.$el.bind({
                'prev': function (e) {
                    self.prev();
                },
                'next': function (e) {
                    self.next();
                },
                'gotoslide': function (e, slideNumber, counterwise, noAnimation) {
                    self.gotoSlide(slideNumber, counterwise, noAnimation);
                }
            }).trigger('init');
        }
    };
    JQSlider.defaults = JQSlider.prototype.defaults;

    /**
     * Initialize each object of the jQuery set as an instance of JQSlider, sets
     * a reference to the instance in data-jqslider which is used as a singleton.
     *
     * @name jqslider
     * @memberOf $.fn
     * @param {Object} options  Object with plugin settings
     * @return {jQuery} `jQuery` object
     * @chainable
     */
    $.fn.jqslider = function (options) {
        return this.each(function () {
            if (undefined === $(this).data('jqslider')) {
                $(this).data('jqslider', new JQSlider(this, options));
            }
        });
    };
    // We define a global reference to the plugin to be able to access static
    // method of the plugin or for prototypical inheritance.
    window.JQSlider = JQSlider;

})(window.jQuery || window.Zepto, window, document);

