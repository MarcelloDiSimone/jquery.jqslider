/*!*
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
 */

/**
 * @fileOverview This is a jquery slider plugin
 * @name JQSlider
 * @date $Date: 2012-01-07 $
 * @author Marcello di Simone
 * @version 0.0.1
 */

/**
 * Closure Function to create a namespace for the initialization of the Plugin
 * @name anonymous
 * @function
 * @param {Object}      $            Aliased jQuery object.
 * @param {HTMLElement}  windows     Reference to the window object
 * @param {HTMLElement}  document    Reference to the document object
 * @param {undefined}   undefined    Reference to the document object
 */
;(function( $, window, document, undefined ){

     /**
      * jQuery definition to anchor JsDoc comments.
      *
      * @see http://jquery.com/
      * @name fn
      * @memberOf $
      * @namespace jQuery user methods container (plungin)
      * @ignore
      */

    /**
     * @class JQSlider Plugin Class
     * @name JQSlider
     * @constructor
     * @param {HTMLElement} elem    element to be initialized
     * @param {Object}    options   Options for the Plugin Member
     */
    function JQSlider( elem, options ){
        /**
         * Stores a reference to the jQuery object of the module
         * @name JQSlider#$el
         * @type Object
         */
        this.$el = $(elem);
        /**
         * Stores a reference to the document object
         * @name JQSlider#$doc
         * @type Object
         */
        this.$body = $('body');
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
        this.isVertical = this.$el.hasClass( 'jqs-vertical' );
        /**
         * @name JQSlider#animating
         * @type Boolean
         * @default false
         */
        this.animating = false;
        /**
         * @name JQSlider#slideTemplate
         * @type String
         * @default '<li/>'
         */
        this.slideTemplate = '<' + this.o.slideSelector + '/>';
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
         * reference of the slider container
         * @name JQSlider#container
         * @type jQuery
         */
        this.container = this.$el.children( this.o.containerSelector );
        /**
         * reference of the slider list element
         * @name JQSlider#list
         * @type jQuery
         */
        this.list = this.container.children( this.o.listSelector ).addClass( this.o.listClass );
        /**
         * jQuery set of all slide elements
         * @name JQSlider#children
         * @type jQuery
         */
        this.slides = this.list.children( this.o.slideSelector ).addClass( this.o.slideClass );

        if( this.o.autosetup !== false ) this.setup();
    }

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
            containerSelector:'.jqs-container',
            listSelector:'ul',
            listClass:'jqs-list',
            slideSelector:'li',
            slideClass:'jqs-slide'
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
         * @param {Boolean} [moveCounterwise=false]        set to true if animation should go to the left
         * @param {Boolean} [noAnimation=false]     set to true if slide should be shown instantly without an animation
         * @public
         */
        gotoSlide:function( slide, moveCounterwise, noAnimation ){
            // stop if slider is currently animating or slide number is out of bound
            if( this.animating === true || slide < 0 && slide >= this.slides.length ) return;

            this.animating = true;

            moveCounterwise = moveCounterwise || false;
            
            this.$el.trigger('animationstart', [ { current:this.currentSlide, next:slide, counterwise: moveCounterwise } ] );

            var self = this,
                next = $( this.slides[ slide ] ),
                current = $( this.slides[ this.currentSlide ] ),
                // extend currentCSS with the cssDefaults to avoid value pollution after orientation changes, which means
                // the top ,respectively left value, would be kept in the cssDefault object and cause a diagonal animation
                currentCSS = {},
                // here I typecast the boolean value this.isVertical to get the first or second index of the array av which holds the sting top or left
                elmPos = this.av[ +this.isVertical ].pos,
                // here I typecast the boolean value this.isVertical to get the first or second index of the array av which holds the sting width or height
                elmSize = this.av[ +this.isVertical ].size,
                moveSize = current[ elmSize ]();
            if( noAnimation === true ){
                next.addClass('jqs-current');
                current.removeClass('jqs-current');
                this.currentSlide = slide;
                this.animating = false;
                this._resetControls();
                this.$el.trigger('animationend',[ { current:this.currentSlide, next:slide, counterwise: moveCounterwise } ]);
            } else {
                // jQuery has a calculation bug in IE8 when translating negative percent values in pixels, therefor we set it ourself
                this.list.toggleClass( 'jqs-list-before', moveCounterwise ).css( elmPos, moveCounterwise? -moveSize:0 );
                next.addClass('jqs-next');
                currentCSS[ elmPos ]= ( moveCounterwise )? '0':-moveSize;
                // for debuging only
                //return
                this.list.animate( currentCSS, {
                    duration: this.o.animationSpeed,
                    easing: this.o.easingFunction,
                    complete:  function(){
                        current.removeClass('jqs-current');
                        next.removeClass('jqs-next').addClass('jqs-current');
                        self.list.attr('style','').removeClass( 'jqs-list-before' );
                        self.currentSlide = slide;
                        self.animating = false;
                        self._resetControls();
                        self.$el.trigger('animationend',[ { current:self.currentSlide, next:slide, counterwise: moveCounterwise } ]);
                    }
                    // for debuging only
                    //,step:function(){window.console.debug('')}
                });
            }
        },
        /**
         * Returns the count of all slides
         * @return {Number}     returns the number of all slides
         * @public
         */
        getSlideCount:function(){
            return this.slides.length;
        },
        /**
         * Returns the position number of the current active slide
         * @return {Number}     returns the index of the current slide in slides
         * @see JQSlider#slides
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
            this.$el.toggleClass( 'jqs-vertical' );
            this.isVertical = !this.isVertical;
        },
        /**
         * Adds a new slide node to the slider, if slidePosition is passed the new slide node will be added at a designated position
         * @param {Number} [slidePosition]     position of the new slide to be added at
         * @return {jQuery}                    returns the jquery object of the created slide
         * @public
         */
        addSlide:function( slidePosition ){
            var newSlide = $( this.slideTemplate );
            if( undefined !== slidePosition && slidePosition < this.slides.length - 1 ){
                $( this.slides[ slidePosition ] ).before( newSlide );
            } else {
                this.list.append( newSlide );
            }
            this.slides = this.list.children().addClass( this.o.slideClass );

            return newSlide;
        },
        /**
         * Returns the position of the next slider
         * @return {Number|Boolean}     returns index of next slide or false
         * @private
         */
        _getNextSlideNumber:function(){
            return ( ( this.currentSlide + 1 ) < this.slides.length )? ( this.currentSlide + 1 ):( this.o.circular )? 0:false;
        },
        /**
         * Returns the position of the previous slider or false
         * @return {Number|Boolean}     returns index of previous slide or false
         * @private
         */
        _getPrevSlideNumber:function(){
            return ( ( this.currentSlide - 1 ) >= 0 )? ( this.currentSlide - 1 ):( this.o.circular )? this.slides.length-1:false;
        },
        /**
         * Hides the previousButton, respectively nextButton, if no circular animation is set and the first, respectively
         * last slide is reached
         * @private
         */
        _resetControls:function(){
            if( this.buttons.length && !this.o.circular ){
                this.buttons.removeClass('jqs-inactive');
                if( this.currentSlide == 0 ) {
                    this.prevButton.addClass('jqs-inactive');
                } else if( this.currentSlide == this.slides.length - 1 ){
                    this.nextButton.addClass('jqs-inactive');
                }
            }
        },
        /**
         * Initialises the Slider controls and binds them to the previous and next methods
         * @private
         */
        _initControls:function(){
            var self = this;
            this.buttons = this.$el.children('.jqs-handler');

            if( this.buttons.length ){
                this.nextButton = this.buttons.filter('.jqs-handler-next').bind('click',function(e){
                    e.preventDefault();
                    self.gotoNextSlide();
                });
                this.prevButton = this.buttons.filter('.jqs-handler-prev').bind('click',function(e){
                    e.preventDefault();
                    self.gotoPrevSlide();
                });
                if( !this.o.circular && this.currentSlide == 0 ) this.prevButton.addClass('jqs-inactive');
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
            /**
             * Namespace for the events that are triggered by self Instance
             * this can also be used to have multiple slider with the same
             * namespace so you're able to control same all at once with one event
             * @name JQSlider#namespace
             * @type String
             */
            this.nsSuffix = '.' + this.o.namespace || 'jqslider';

            $( this.slides[ this.currentSlide ] ).addClass('jqs-current');

            this._initControls();

            this.$el.addClass('jqs-initialiced');

            this.$el.bind( 'gotoprevslide' + this.nsSuffix, function( e ){ self.gotoPrevSlide(); } );
            this.$el.bind( 'gotonextslide' + this.nsSuffix, function( e ){ self.gotoNextSlide(); } );
            this.$el.bind( 'gotoslide' + this.nsSuffix, function( e, slideNum, counterwise, noAnimation ){ self.gotoSlide( slideNum, counterwise, noAnimation ); } );

            this.$el.trigger( 'init' );

            return this;
        }
    };
    /**
     * Expose the defaults options to the global scope (window) so you can change them for all modules at once
     * @type    Object
     */
    JQSlider.defaults = JQSlider.prototype.defaults;
    /**
     * Initialize each object of the jQuery set as an instance of PluginBoilerplate
     * @function
     * @name jqslider
     * @memberOf $.fn
     * @param {Object} options  Object with plugin settings
     * @return {Object} chainable jQuery object
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