/**
 * Title: A responsive and performant content Slider
 * jQSlider follows a new approach in sliding content. Where most slider-plugins are moving the whole list of slides
 * when animating, jQSlider animates only the two slides necessary for the animation simultaneously. But the most
 * important difference is, that it is not cloning the first (respectively last) slides to realize a circular movement.
 * This is important if you have rich content inside of your slide that would break when it's cloned. This approach
 * makes it also possible to have a fully css based scaling.
 *
 * Usage:
 *
 * (start code)
 *  $("#my-jqslider").jqslider();
 * (end)
 *
 * See the jqslider documentation page for a full description.
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and/or GPL (GPL-LICENSE.txt) licenses.
 *
 * Id: $Id: jquery.boilerplate.js 187 2011-11-27 13:03:28Z tom $
 */

/**
 * @fileOverview This is a jquery slider plugin
 * @name JQSlider
 * @date $Date: 2012-01-07 $
 * @author <a href="mailto:mdisimone@t8y.com">Marcello di Simone</a>
 * @version 0.0.1
 */

/**
 * Closure Function to create a namespace for the initialization of the Plugin
 * @name anonymous
 * @function
 * @param {object}      $           The name of this parameter aliased jQuery object. Here it is aliased to $.
 * @param {DOMElement}  windows     Reference to the window object
 * @param {DOMElement}  document    Reference to the document object
 * @param {undefined}   undefined   Reference to the document object
 */
;(function( $, window, document, undefined ){
    /**
     * @class JQSlider Plugin Class
     * @name JQSlider
     * @constructor
     * @param {DOMObject} elem      DOMElement to be initialized
     * @param {Object}    options   Options for the Plugin Member
     */
    function JQSlider( elem, options ){
        /**
         * Stores a reference to the DOMElement of the module
         * @name JQSlider#el
         * @type DOMObject
         */
        this.el = elem;
        /**
         * Stores a reference to the jQuery object of the module
         * @name JQSlider#$el
         * @type Object
         */
        this.$el = $(elem);
        /**
         * This next line takes advantage of HTML5 data attributes
         * to support customization of the plugin on a per-element
         * basis (valid JSON only).
         * @name JQSlider#metadata
         * @type Object
         * @example
         * <div class="item" data-options='{"autosetup":"true"}'></div>
         */
        this.metadata = this.$el.data( 'options' );
        /**
         * Object with the configuration options of the module
         * @name JQSlider#o
         * @type Object
         */
        this.o = $.extend({}, this.defaults, options, this.metadata);
        /**
         * @name JQSlider#currentSlide
         * @type Number
         * @default 0
         */
        this.currentSlide = this.o.startSlide || 0;
        /**
         * @name JQSlider#isVertical
         * @type Boolean
         * @default false
         */
        this.isVertical = this.$el.hasClass( 'jqslider-vertical' );
        /**
         * @name JQSlider#animating
         * @type Boolean
         * @default false
         */
        this.animating = false;
        /**
         * alignment value shortcuts
         * @name JQSlider#av
         * @type Array
         */
        this.av = [
            {pos:'left',size:'width'},
            {pos:'top',size:'height'}
        ];
        /**
         * set the configuration values for css3 transform plugin
         * will be ignored if it's not included
         * @name JQSlider#cssDefault
         * @type Object
         */
        this.cssDefault = {
            useTranslate3d: true,
            leaveTransforms: false,
            avoidTransforms: true
        };
        /**
         * Namespace for the events that are triggered by self Instance
         * this can also be used to have multiple slider with the same
         * namespace so you're able to control same all at once with one event
         * @name JQSlider#namespace
         * @type String
         */
        this.namespace = this.$el.attr( 'id' ) || this.o.namespace || 'jqgrid-' + this._getUID();
        /**
         * reference of the slider container
         * @name JQSlider#container
         * @type jQuery
         */
        this.container = this.$el.children( this.o.containerSelector, this.$el );
        /**
         * reference of the slider list element
         * @name JQSlider#list
         * @type jQuery
         */
        this.list = this.container.children( this.o.listSelector, this.container );
        /**
         * jQuery set of all slide elements
         * @name JQSlider#children
         * @type jQuery
         */
        this.children = this.list.children( this.o.slideSelector, this.list );

        if( this.o.autosetup !== false ) this.setup();
    };

    /** @lends JQSlider.prototype */
    JQSlider.prototype = {
        /**
         * Default configuration values
         * @field
         * @type Object
         * @property {boolean} whether or not the setup should be called automatically
         */
        defaults: {
            autosetup: true,
            circular: false,
            startSlide: 0,
            animationSpeed:500,
            easingFunction:'linear',
            containerSelector:'.jqslider-container',
            listSelector:'ul',
            slideSelector:'li',
            slideTemplate:'<li />'
        },
        /**
         * Moves to the next slide
         * @public
         */
        gotoNextSlide:function(){
            var next = this._getNextSlideNumber();
            // if the slider has no circular animation and the last slide is already present, do nothing
            if( next !== false ){
                this.gotoSlide( next, false );
            }
        },
        /**
         * Moves to the previous slide
         * @public
         */
        gotoPrevSlide:function(){
            var prev = this._getPrevSlideNumber();
            // if the slider has no circular animation and the first slide is already present, do nothing
            if( prev !== false ) {
                this.gotoSlide( prev, true );
            }
        },
        /**
         * Moves to a designated slide
         * @param {Number}  slide                   number of slide to go to
         * @param {Boolean} [movePrev=false]        set to true if animation should go to the left
         * @param {Boolean} [noAnimation=false]     set to true if slide should be shown instantly without an animation
         * @public
         */
        gotoSlide:function( slide, movePrev, noAnimation ){
            // stop if slider is currently animating or slide is out of bound
            if( this.animating === true || slide < 0 && slide >= this.children.length ) return;

            this.$el.trigger('slideanimation', [ slide, movePrev ] );

            this.animating = true;

            movePrev = movePrev || false;

            var self = this,
                next = $( this.children[ slide ] ),
                current = $( this.children[ this.currentSlide ] ),
                // extend currentCSS with the cssDefaults to avoid value pollution after orientation changes, which means
                // the top ,respectively left value, would be kept in the cssDefault object and cause a diagonal animation
                currentCSS = $.extend( {}, this.cssDefault );

            if( noAnimation === true ){
                next.addClass('jqslider-current');
                current.removeClass('jqslider-current');
                this.currentSlide = slide;
                this.animating = false;
                this._resetControls();
            } else {
                this.list.toggleClass( 'jqslider-list-before', movePrev );
                next.addClass('jqslider-next');
                currentCSS[ this.av[ +this.isVertical ].pos ]= ( movePrev )? '0%':'-100%';
                this.list.animate( currentCSS, {
                    duration: this.o.animationSpeed,
                    easing: this.o.easingFunction,
                    complete:  function(){
                        current.removeClass('jqslider-current');
                        next.removeClass('jqslider-next').addClass('jqslider-current');
                        self.list.attr('style','').removeClass( 'jqslider-list-before' );
                        self.currentSlide = slide;
                        self.animating = false;
                        self._resetControls();
                    }
                });
            }
        },
        /**
         * Returns the count of all slides
         * @return {Number}     returns the number of all slides
         * @public
         */
        getSlideCount:function(){
            return this.children.length;
        },
        /**
         * Returns the position number of the current active slide
         * @return {Number}     returns the index of the current slide in children
         * @see JQSlider#children
         * @public
         */
        getCurrentSlide:function(){
            return this.currentSlide;
        },
        /**
         * changes the orientation of the slider from horizontal to vertical or vertical to horizontal respectively
         * @public
         */
        switchOrientation:function(){
            this.$el.toggleClass( 'jqslider-vertical' );
            this.isVertical = !this.isVertical;
        },
        /**
         * Adds a new slide node to the slider, if slidePosition is passed the new slide node will be added at a designated position
         * @param {Number} [slidePosition]     position of the new slide to be added at
         * @return {jQuery}                    returns the jquery object of the created slide
         * @public
         */
        addSlide:function( slidePosition ){
            var newSlide = $( this.o.slideTemplate );
            if( undefined !== slidePosition && slidePosition < this.children.length - 1 ){
                $( this.children[ slidePosition ] ).before( newSlide );
            } else {
                this.list.append( newSlide );
            }
            this.children = this.list.children();

            return newSlide;
        },
        /**
         * Returns the position of the next slider
         * @return {Number|Boolean}     returns index of next slide or false
         * @private
         */
        _getNextSlideNumber:function(){
            return ( ( this.currentSlide + 1 ) < this.children.length )? ( this.currentSlide + 1 ):( this.o.circular )? 0:false;
        },
        /**
         * Returns the position of the previous slider or false
         * @return {Number|Boolean}     returns index of previous slide or false
         * @private
         */
        _getPrevSlideNumber:function(){
            return ( ( this.currentSlide - 1 ) >= 0 )? ( this.currentSlide - 1 ):( this.o.circular )? this.children.length-1:false;
        },
        /**
         * Hides the previousButton, respectively nextButton, if no circular animation is set and the first, respectively
         * last slide is reached
         * @private
         */
        _resetControls:function(){
            if( this.buttons.length && !this.o.circular ){
                this.buttons.removeClass('jqslider-inactive');
                if( this.currentSlide == 0 ) {
                    this.prevButton.addClass('jqslider-inactive');
                } else if( this.currentSlide == this.children.length - 1 ){
                    this.nextButton.addClass('jqslider-inactive');
                }
            }
        },
        /**
         * Initialises the Slider controls and binds them to the previous and next methods
         * @private
         */
        _initControls:function(){
            var self = this;
            this.buttons = this.$el.children('.jqslider-handler');

            if( this.buttons.length ){
                this.nextButton = this.buttons.filter('.jqslider-handler-next').bind('click',function(e){
                    e.preventDefault();
                    self.$el.trigger('gotonextslide.' + self.namespace);
                });
                this.prevButton = this.buttons.filter('.jqslider-handler-prev').bind('click',function(e){
                    e.preventDefault();
                    self.$el.trigger('gotoprevslide.' + self.namespace);
                });
                if( !this.o.circular && this.currentSlide == 0 ) this.prevButton.addClass('jqslider-inactive');
            }
        },
        /**
         * returns a random number to create an unique namespace, if no namespace is defined and no id is set on the root element
         * @returns {Number}
         * @private
         */
        _getUID:function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 );
        },
        /**
         * the setup function
         * @return JQSlider
         * @public
         */
        setup:function(){
            var self = this;
            $( this.children[ this.currentSlide ] ).addClass('jqslider-current');

            this._initControls();

            this.$el.bind('gotoprevslide.' + this.namespace, function( e ){ if( self.o.namespace && e.namespace != self.namespace ) return; self.gotoPrevSlide();});
            this.$el.bind('gotonextslide.' + this.namespace, function( e ){ if( self.o.namespace && e.namespace != self.namespace ) return; self.gotoNextSlide();});

            this.$el.addClass('jqslider-initialiced');

            this.$el.trigger('init.' + this.namespace );

            return this;
        }
    };
    /**
     * Expose the defaults options to the global scope (window) so you can change them for all modules at once
     * @see     window.JQSlider
     * @scope   window
     * @type    Object
     */
    JQSlider.defaults = JQSlider.prototype.defaults;
    /**
     * jQuery object's methods (This comment is just a JSDoc helper)
     * @name fn
     * @memberOf $
     * @see anonymous
     * @namespace jQuery user methods container (plugin)
     * @ignore
     */

    /**
     * Initialize each object of the jQuery set as an instance of PluginBoilerplate
     * @function
     * @name pluginboilerplate
     * @memberOf $.fn
     * @return {jQuery} chainable jQuery class
     */
    $.fn.jqslider = function(options) {
        return this.each(function(){
            if ( undefined == $( this ).data('jqslider') ) {
                $( this ).data('jqslider', new JQSlider( this, options) );
            }
        });
    };
    window.JQSlider = JQSlider;
})( jQuery, window , document );