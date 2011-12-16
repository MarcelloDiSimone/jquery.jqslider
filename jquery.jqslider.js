(function($){
    $.jqslider = function(el, options){
        // set a reference to the class instance
        var base = this;
        base.o = $.extend({},$.jqslider.defaultOptions, options);
        // set a reference to the jquery object
        base.$el = $(el);
        // set a reference to the DOMNode
        base.el = el;

        var currentSlide = 0,
            test = 0,
            list,
            container,
            children,
            isVertical=false,
            buttons,
            nextButton,
            prevButton,
            namespace,
            animating = false,
            // alignment value shortcuts
            av = [
                {pos:'left',size:'width'},
                {pos:'top',size:'height'}
            ],
            // set the configuration values for css3 transform plugin
            // will be ignored if it's not included
            cssDefault = {
                useTranslate3d: true,
                leaveTransforms: false,
                avoidTransforms: true
            };

        /**
         * Moves to the next slide
         * @public
         */
        base.gotoNextSlide = function(){
            var next = getNextSlideNumber();
            // if the slider has no circular animation and the last slide is allready present, do nothing
            if( next !== false ){
                base.gotoSlide( next, false );
            }
        };

        /**
         * Moves to the previous slide
         * @public
         */
        base.gotoPrevSlide = function(){
            var prev = getPrevSlideNumber();
            // if the slider has no circular animation and the first slide is allready present, do nothing
            if( prev !== false ) {
                base.gotoSlide( prev, true );
            }
        };
        

        /**
         * Moves to a designated slide
         * @public
         * @param {Number} slide                    number of slide to go to
         * @param {Boolean} [movePrev=false]        set to true if animation should go to the left
         * @param {Boolean} [noAnimation=false]     set to true if slide should be shown instantly without an animation
         */
        base.gotoSlide = function( slide, movePrev, noAnimation ){
            // stop if slider is currently animating or slide is out of bound
            if( animating === true || slide < 0 && slide >= children.length ) return;

            animating = true;

            movePrev = movePrev || false;

            var next = $( children[ slide ] ),
                current = $( children[ currentSlide ] ),
                // extend currentCSS with the cssDefaults to avoid value pollution after orientation changes, which means
                // the top ,respectively left value, will be kept in the cssDefault object and cause a diagonal animation
                currentCSS = $.extend( {}, cssDefault );

            if( noAnimation === true ){
                next.addClass('jqslider-current');
                current.removeClass('jqslider-current');
                currentSlide = slide;
                animating = false;
                resetControls();
            } else {
                list.toggleClass( 'jqslider-list-before', movePrev );
                next.addClass('jqslider-next');
                currentCSS[ av[ +isVertical ].pos ]= ( movePrev )? '0%':'-100%';
                //if( test++ == 2) return;
                list.animate( currentCSS, {
                    duration: base.o.animationSpeed,
                    easing: base.o.easingFunction,
                    complete:  function(){
                        current.removeClass('jqslider-current');
                        next.removeClass('jqslider-next').addClass('jqslider-current');
                        list.attr('style','').removeClass( 'jqslider-list-before' );
                        currentSlide = slide;
                        animating = false;
                        resetControls();
                    }
                });
            }
        };

        /**
         * Returns the count of all slides
         * @public
         * @return {Number}     returns the number of all slides
         */
		base.getSlideCount = function(){
			return children.length;
		};

        /**
         * Returns the position number of the current active slide
         * @public
         * @return {Number}     returns the index of the current slide in the children set
         */
		base.getCurrentSlide = function(){
			return currentSlide;
		};

        /**
         * Adds a new slide node to the slider, if slidePosition is passed the new slide node will be added at a designated position
         * @public
         * @param {Number} [slidePosition]     position of the new slide to be added at
         * @return {jQuery}                    returns the jquery object of the created slide
         */
        base.addSlide = function( slidePosition ){
            var newSlide = $('<li />');
            if( undefined !== slidePosition && slidePosition < children.length - 1 ){
                $( children[ slidePosition ] ).before( newSlide );
            } else {
                list.append( newSlide );
            }
            children = list.children();

            return newSlide;
        };

        /**
         * Returns the position of the next slider
         * @private
         * @return {Number|Boolean}     returns index of next slide or false
         */
        var getNextSlideNumber = function(){
            return ( ( currentSlide + 1 ) < children.length )? ( currentSlide + 1 ):( base.o.circular )? 0:false;
        };

        /**
         * Returns the position of the previous slider or false
         * @private
         * @return {Number|Boolean}     returns index of previous slide or false
         */
        var getPrevSlideNumber = function(){
            return ( ( currentSlide - 1 ) >= 0 )? ( currentSlide - 1 ):( base.o.circular )? children.length-1:false;
        };

        /**
         * Hides the previousButton, respectively nextButton, if no circular animation is set an the first, repectively
         * last slide is reached
         * @private
         */
        var resetControls = function(){
            if( !base.o.circular ){
                buttons.removeClass('jqslider-inactive');
                if( currentSlide == 0 ) prevButton.addClass('jqslider-inactive');
                if( currentSlide == children.length - 1 ) nextButton.addClass('jqslider-inactive');
            }
        };

        /**
         * Initialises the Slider controls and binds them to the previous and next methods
         * @private
         */
        var initControls = function(){
        	buttons = base.$el.children('.jqslider-handler');
            nextButton = buttons.filter('.jqslider-handler-next').bind('click',function(e){
                e.preventDefault();
                base.$el.trigger('gotonextslide.' + namespace);
            });
            prevButton = buttons.filter('.jqslider-handler-prev').bind('click',function(e){
                e.preventDefault();
                base.$el.trigger('gotoprevslide.' + namespace);
            });

            if( !base.o.circular && currentSlide == 0 ) prevButton.addClass('jqslider-inactive');
        };

        /**
         * Initialises the Slider
         * @private
         */
        var initSlider = function(){
            $( children[ currentSlide ] ).addClass('jqslider-current');
            initControls();

            base.$el.bind('gotoprevslide.' + namespace, function( e ){ if( e.namespace != namespace ) return; base.gotoPrevSlide();});
            base.$el.bind('gotonextslide.' + namespace, function( e ){ if( e.namespace != namespace ) return; base.gotoNextSlide();});

            base.$el.addClass('jqslider-initialiced');
            
            base.$el.trigger('init.' + namespace );
        };

        /**
         * returns a random number to create an unique namespace if no namespace is defined and no id is set on the jqgrid element
         * @private
         * @returns {Number}
         */
        var getUID = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 );
        };

        /**
         * @private
         */
        var setup = function(){

            //sets the namespace to the element ID or the namespace defined by the options, if neither is defined a unique namespace name is created
            namespace = base.$el.attr( 'id' ) || base.o.namespace || 'jqgrid-' + getUID();

            isVertical = base.$el.hasClass( 'jqslider-vertical' );

            currentSlide = ( base.o.startSlide != currentSlide )? base.o.startSlide:currentSlide;

            list = $( base.o.listSelector ,base.$el);
            children = list.children( base.o.slideSelector );
            console.debug(children)
            initSlider();
        };
        if( base.o.autosetup === true ) setup();
    };
    $.jqslider.defaultOptions = {
        autosetup: true,
        circular: false,
        startSlide: 0,
        animationSpeed:500,
        easingFunction:'linear',
        listSelector:'> ul',
        slideSelector:'li'

    };
    $.fn.jqslider = function(options){
        return this.each(function( index, slider ){
            if ( undefined == $( slider ).data('jqslider') ) {
                $( slider ).data('jqslider', new $.jqslider( slider, options));
            }
        });
    };
})(jQuery);