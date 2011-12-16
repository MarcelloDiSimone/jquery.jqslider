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
 */

;(function( $, window, document, undefined ){

    /**
     * @constructor
     * @param elem      slider root element
     * @param options
     */
    var JQSlider = function( elem, options ){
        this.el = elem;
        this.$el = $(elem);
        this.options = options;
        this.currentSlide = 0;
        this.isVertical=false;
        this.animating = false;
        // alignment value shortcuts
        this.av = [
            {pos:'left',size:'width'},
            {pos:'top',size:'height'}
        ];
        // set the configuration values for css3 transform plugin
        // will be ignored if it's not included
        this.cssDefault = {
            useTranslate3d: true,
            leaveTransforms: false,
            avoidTransforms: true
        };

        // This next line takes advantage of HTML5 data attributes
        // to support customization of the plugin on a per-element
        // basis. For example,
        // <div class=item' data-plugin-options='{"message":"Goodbye World!"}'></div>
        this.metadata = this.$el.data( 'plugin-options' );

        if( this.options.autosetup !== false ) this.init();
    };

    // the plugin prototype
    JQSlider.prototype = {
        defaults: {
            autosetup: true,
            circular: false,
            startSlide: 0,
            animationSpeed:500,
            easingFunction:'linear',
            listElement:'ul',
            slideElement:'li'
        },

        /**
         * Moves to the next slide
         * @public
         */
        gotoNextSlide:function(){
            var next = this.getNextSlideNumber();
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
            var prev = this.getPrevSlideNumber();
            // if the slider has no circular animation and the first slide is already present, do nothing
            if( prev !== false ) {
                this.gotoSlide( prev, true );
            }
        },


        /**
         * Moves to a designated slide
         * @public
         * @param {Number} slide                    number of slide to go to
         * @param {Boolean} [movePrev=false]        set to true if animation should go to the left
         * @param {Boolean} [noAnimation=false]     set to true if slide should be shown instantly without an animation
         */
        gotoSlide:function( slide, movePrev, noAnimation ){
            var self = this;
            // stop if slider is currently animating or slide is out of bound
            if( this.animating === true || slide < 0 && slide >= this.children.length ) return;

            this.animating = true;

            movePrev = movePrev || false;

            var next = $( this.children[ slide ] ),
                current = $( this.children[ this.currentSlide ] ),
                // extend currentCSS with the cssDefaults to avoid value pollution after orientation changes, which means
                // the top ,respectively left value, would be kept in the cssDefault object and cause a diagonal animation
                currentCSS = $.extend( {}, this.cssDefault );

            if( noAnimation === true ){
                next.addClass('jqslider-current');
                current.removeClass('jqslider-current');
                this.currentSlide = slide;
                this.animating = false;
                this.resetControls();
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
                        self.resetControls();
                    }
                });
            }
        },

        /**
         * Returns the count of all slides
         * @public
         * @return {Number}     returns the number of all slides
         */
		getSlideCount:function(){
			return this.children.length;
		},

        /**
         * Returns the position number of the current active slide
         * @public
         * @return {Number}     returns the index of the current slide in the children set
         */
		getCurrentSlide:function(){
			return this.currentSlide;
		},

        /**
         * Adds a new slide node to the slider, if slidePosition is passed the new slide node will be added at a designated position
         * @public
         * @param {Number} [slidePosition]     position of the new slide to be added at
         * @return {jQuery}                    returns the jquery object of the created slide
         */
        addSlide:function( slidePosition ){
            var newSlide = $('<' + this.o.slideElement + '/>');
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
         * @public
         * @return {Number|Boolean}     returns index of next slide or false
         */
        getNextSlideNumber:function(){
            return ( ( this.currentSlide + 1 ) < this.children.length )? ( this.currentSlide + 1 ):( this.o.circular )? 0:false;
        },

        /**
         * Returns the position of the previous slider or false
         * @public
         * @return {Number|Boolean}     returns index of previous slide or false
         */
        getPrevSlideNumber:function(){
            return ( ( this.currentSlide - 1 ) >= 0 )? ( this.currentSlide - 1 ):( this.o.circular )? this.children.length-1:false;
        },

        /**
         * Hides the previousButton, respectively nextButton, if no circular animation is set and the first, respectively
         * last slide is reached
         * @public
         */
        resetControls:function(){
            if( !this.o.circular ){
                this.buttons.removeClass('jqslider-inactive');
                if( this.currentSlide == 0 ) this.prevButton.addClass('jqslider-inactive');
                if( this.currentSlide == this.children.length - 1 ) this.nextButton.addClass('jqslider-inactive');
            }
        },

        /**
         * Initialises the Slider controls and binds them to the previous and next methods
         * @public
         */
        initControls:function(){
            var self = this;
        	this.buttons = this.$el.children('.jqslider-handler');
            this.nextButton = this.buttons.filter('.jqslider-handler-next').bind('click',function(e){
                e.preventDefault();
                self.$el.trigger('gotonextslide.' + self.namespace);
            });
            this.prevButton = this.buttons.filter('.jqslider-handler-prev').bind('click',function(e){
                e.preventDefault();
                self.$el.trigger('gotoprevslide.' + self.namespace);
            });

            if( !this.o.circular && this.currentSlide == 0 ) this.prevButton.addClass('jqslider-inactive');
        },

        /**
         * Initialises the Slider
         * @public
         */
        initSlider:function(){
            var self = this;
            $( this.children[ this.currentSlide ] ).addClass('jqslider-current');
            this.initControls();

            this.$el.bind('gotoprevslide.' + this.namespace, function( e ){ if( e.namespace != self.namespace ) return; self.gotoPrevSlide();});
            this.$el.bind('gotonextslide.' + this.namespace, function( e ){ if( e.namespace != self.namespace ) return; self.gotoNextSlide();});

            this.$el.addClass('jqslider-initialiced');

            this.$el.trigger('init.' + this.namespace );
        },

        /**
         * returns a random number to create an unique namespace if no namespace is defined and no id is set on the jqgrid element
         * @public
         * @returns {Number}
         */
        getUID:function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 );
        },

        /**
         * @public
         */
        init:function(){
            this.o = $.extend({}, this.defaults, this.options, this.metadata);
            //sets the namespace to the element ID or the namespace defined by the options, if neither is defined a unique namespace name is created
            this.namespace = this.$el.attr( 'id' ) || this.o.namespace || 'jqgrid-' + this.getUID();

            this.isVertical = this.$el.hasClass( 'jqslider-vertical' );

            this.currentSlide = ( this.o.startSlide != this.currentSlide )? this.o.startSlide:this.currentSlide;

            this.list = $( '>' + this.o.listElement ,this.$el);
            this.children = this.list.children( this.o.slideElement );
            this.initSlider();

            return this;
        }

    };
    
    JQSlider.defaults = JQSlider.prototype.defaults;

    $.fn.jqslider = function(options) {
        return this.each(function(){
            if ( undefined == $( this ).data('jqslider') ) {
                $( this ).data('jqslider', new JQSlider( this, options) );
            }
        });
    };

    window.Plugin = Plugin;

})( jQuery, window , document );

