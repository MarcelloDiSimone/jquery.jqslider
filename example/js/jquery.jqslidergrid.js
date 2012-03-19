
/*!*
 * @description Extension of the JQSlider Plugin, that adds a grid like slide handling
 */

var OOP = {};
OOP.extend = function(subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};

/**
 * @description JQSliderGrid Plugin
 * @module JQSliderGrid
 * @requires jQuery, JQSlider
 * @param {Object}       $            Aliased jQuery object.
 * @param {HTMLElement}  windows      Reference to the window object
 * @param {HTMLElement}  document     Reference to the document object
 * @param {undefined}    undefined    Reference to the document object
 */
(function( $, window, document, undefined ){
    /**
     * @description Plugin Constructor
     * @class JQSliderGrid
     * @constructor
     * @param {HTMLElement} elem        element to be initialized
     * @param {Object}      options     Options for the Plugin Member
     */
    function JQSliderGrid( elem, options ){
        /**
         * stores the current active row
         * @property activeRowIndex
         * @type Number
         */
        this.activeRowIndex = 0;
        /**
         * stores the current active col
         * @property activeColIndex
         * @type Number
         */
        this.activeColIndex = 0;
        /**
         * Object with the configuration options of the module
         * @property o
         * @type Object
         */
        this.o = $.extend( this.defaults, options );

        JQSliderGrid.superclass.constructor.call( this, elem, this.o );

    }
    OOP.extend( JQSliderGrid, JQSlider);

    /**
     * Stores all configuration settings, this set will be extended with client configuration objects
     * @type Object
     * @property defaults
     */
    JQSliderGrid.prototype.defaults = {

        /**
         * Defines if you want to have an endless horizontal animation
         * @config horizontalCircular
         * @type Boolean
         * @default true
         */
        horizontalCircular:true,
        /**
         * Defines if you want to have an endless vertical animation
         * @config verticalCircular
         * @type Boolean
         * @default false
         */
        verticalCircular:false,
        /**
         * Array of all slides
         * @config slides
         * @type Array
         * @default []
         */
        slides:[],
        /**
         * Multidimensional Array with the ids of the slides, defining the grid structure of the JQSlideGrid
         * @config grid
         * @type Array
         * @default []
         */
        grid:[]
    };

    /**
     * @public
     * @method up
     * @event up
     * @param {Number|String} [slide]     Number or ID of the next Slide
     */
    JQSliderGrid.prototype.up = function ( slide ) {
        !this.isVertical && this.switchOrientation();
        this.gotoDirection( slide, true );
    };

    /**
     * @public
     * @method down
     * @event down
     * @param {Number|String} [slide]     Number or ID of the next Slide
     */
    JQSliderGrid.prototype.down = function ( slide ) {
        !this.isVertical && this.switchOrientation();
        this.gotoDirection( slide, false );
    };

    /**
     * @public
     * @method left
     * @event left
     * @param {Number|String} [slide]     Number or ID of the next Slide
     */
    JQSliderGrid.prototype.left = function ( slide ) {
        this.isVertical && this.switchOrientation();
        this.gotoDirection( slide, true );
    };

    /**
     * @public
     * @method right
     * @event right
     * @param {Number|String} [slide]     Number or ID of the next Slide
     */
    JQSliderGrid.prototype.right = function ( slide ) {
        this.isVertical && this.switchOrientation();
        this.gotoDirection( slide, false );
    };

    /**
     * @public
     * @method gotoDirection
     * @param {Number|String} slide     Number or ID of the next Slide
     * @param {Boolean} [gotoPrev]      boolean value if the animation should do a prev or next movement
     */
    JQSliderGrid.prototype.gotoDirection = function ( slide, gotoPrev ) {
        switch ( typeof slide ) {
            case 'number':
                this.gotoSlide( slide, gotoPrev );
                break;
            case 'string':
                this.gotoId( slide, gotoPrev );
                break;
            default:
                if ( gotoPrev ) {
                    this.prev( this.isVertical );
                } else {
                    this.next( this.isVertical );
                }
        }
    };

    /**
     * returns the JQuery Object defined by the id or -1
     * @public
     * @method gotoId
     * @event gotoid
     * @param {String} slideId        id of the slide to go to
     * @param {Boolean} [gotoPrev]    do a prev or next animation
     */
    JQSliderGrid.prototype.gotoId = function ( slideId, gotoPrev ) {
        // finds the zero based position of a slide in the slides object
        this.gotoSlide( this.getIndexById( slideId ), gotoPrev );
    };

    /**
     * Determins the position of the next slide in the grid to have a correct prev or next animation
     * @public
     * @method gotoHistory
     * @event gotohistory
     * @param {String} slideId  id of the slide to go to
     */
    JQSliderGrid.prototype.gotoHistory = function ( slideId ) {
        var lastIndex = this.o.grid.length - 1,
            from = this._slides.eq( this.activeIndex ),
            fromRow = from.data( 'row' ),
            fromCol = from.data( 'col' ),
            to = this._slides.eq( this.getIndexById( slideId ) ),
            toRow = to.data('row'),
            toCol = to.data('col'),
            counterwise = (fromRow > toRow || (fromCol > toCol || fromCol == 0 && toCol == lastIndex) && !(fromCol == lastIndex && toCol == 0));

        if ( (fromRow !== toRow && !this.isVertical) || (fromCol !== toCol && this.isVertical) ) {
            this.switchOrientation();
        }

        this.gotoSlide( this.getIndexById( slideId ), counterwise );
    };

    /**
     * @private
     * @method _endAnimation
     * @param {Object} next         next slide object
     * @param {Object} current      current active slide object
     * @param {Number} slideNum     Number of the next Slide
     */
    JQSliderGrid.prototype._endAnimation = function (  slideNum, moveCounterwise, noAnimation, current, next ) {
        JQSliderGrid.superclass._endAnimation.call( this, slideNum, moveCounterwise, noAnimation, current, next );
        this.activeRowIndex = next.data( 'row' );
        this.activeColIndex = next.data( 'col' );
    };

    /**
     * updates the slide list array "slides"
     * @private
     * @method _update
     */
    JQSliderGrid.prototype._update = function () {
        this._slides = this._list.children();
        this.activeIndex = this._slides.index( this.o.css.current );
    };

    /**
     * Determins the index of the slide in the slides array by the id of the referenced slide node
     * @public
     * @method getIndexById
     * @param {String} slideId      Id of the slide node
     * @return {Number}             index of the slide in the slides array
     */
    JQSliderGrid.prototype.getIndexById = function ( slideId ) {
        // finds the zero based position of a slide in the slides object
        return this._slides.index( $( '#' + slideId ) );
    };

    /**
     * Moves to the next slide
     * @public
     * @method next
     * @event next
     * @param {Boolean} [vertical]   if the animation should be a vertical or horizontal movement
     */
    JQSliderGrid.prototype.next = function ( vertical ) {
        var next = this._getSibblingIndex( false, vertical );
        // if the slider has no circular animation and the last slide is already reached, do nothing
        if ( next !== false ) {
            this.gotoSlide( next, false );
        }
    };

    /**
     * Moves to the previous slide
     * @public
     * @method prev
     * @event prev
     * @param {Boolean} [vertical]   if the animation should be a vertical or horizontal movement
     */
    JQSliderGrid.prototype.prev = function ( vertical ) {
        var prev = this._getSibblingIndex( true, vertical );
        // if the slider has no circular animation and the first slide is already reached, do nothing
        if ( prev !== false ) {
            this.gotoSlide( prev, true );
        }
    };

    /**
     * returns the position of the next slider or false if it's the last slide and circular animation is false
     * @private
     * @method _getSibblingIndex
     * @param {Boolean} [prev]        return the previous or next slideNumber
     * @param {Boolean} [vertical]    determin if to check for the next vertical or horizontal slide
     * @return {Number|Boolean}                number of next slide or false
     */
    JQSliderGrid.prototype._getSibblingIndex = function( prev, vertical) {
        var row = this.activeRowIndex,
            col = this.activeColIndex,
            verticalCircular = this.o.verticalCircular,
            horizontalCircular = this.o.horizontalCircular,
            grid = this.o.grid;

        if( prev ){
            if ( vertical ) {
                row = ( row > 0 ) ? --row : ( verticalCircular ) ? grid[ col ].length - 1 : false;
            } else {
                col = ( col > 0 ) ? --col : ( horizontalCircular ) ? grid.length - 1 : false;
            }
        } else {
            if ( vertical ) {
                row = ( ++row < grid[ col ].length ) ? row : ( verticalCircular ) ? 0 : false;
            } else {
                col = ( ++col < grid.length ) ? col : ( horizontalCircular ) ? 0 : false;
            }
        }

        return ( ( col === false || row === false ) || !grid[ col ][ row ] ) ? false : this.getIndexById( grid[ col ][ row ] );
    };

    /**
     * hide the handlers if you can't navigate left or right
     * last slide is reached.
     * @private
     * @method _resetControls
     */
    JQSliderGrid.prototype._resetControls = function () {

    };

    /**
     * creates all needed slide nodes
     * @private
     * @method _setupSlides
     */
    JQSliderGrid.prototype._setupSlides = function () {
        var self = this;
        var childNumber = 0;
        $.each( this.o.grid, function ( colIndex, row ) {
            $.each( row, function ( rowIndex, slideId ) {
                var slide = $( '#' + slideId );
                slide = ( slide.length )? slide:self.addSlide().attr('id', slideId );
                slide.data( 'row', rowIndex )
                slide.data( 'col', colIndex );
                childNumber++;
            });
        });

        var firstSlide = this._slides.eq( this.activeIndex ).addClass( this.o.css.current );

        this.activeRowIndex = firstSlide.data('row');
        this.activeColIndex = firstSlide.data('col');
    };

    /**
     * Initialises the Slider controls and binds them to the previous and next methods
     * @private
     * @method _initControls
     */
    JQSliderGrid.prototype._initControls = function(){
        var self = this,
            /**
             * jQuery set with all handlers found inside the jqslider element with the class defined in css.handler
             * @private
             * @property _handlers
             * @type Object
             */
             h = this._handlers = this.$el.children( '.' + this.o.css.handler);
        if( h.length ){
            /**
             * jQuery set with all handlers found inside the jqslider element with the class defined in css.nextHandler
             * @private
             * @property _nextHandler
             * @type Object
             */
            this._nextHandler = h.filter( '.' + this.o.css.handlerNext ).bind('click',function(e){
                e.preventDefault();
                self.right();
            });
            /**
             * jQuery set with all handlers found inside the jqslider element with the class defined in css.prevHandler
             * @private
             * @property _prevHandler
             * @type Object
             */
            this._prevHandler = h.filter( '.' + this.o.css.handlerPrev ).bind('click',function(e){
                e.preventDefault();
                self.left();
            });
            if( !this.o.circular && this.activeIndex == 0 ) this._prevHandler.addClass( this.o.css.inactive );
        }
    };
    /**
     * inits the slider an finalizes the initialisation, the division of init and instantiation is helpful, so that you have
     * the functionality like addSlide available without having the slides positioned or hidden. Especially because the
     * slides except of the current visible slide are hidden so that it not possible to determine the correct height and width
     * of the slide
     * @public
     * @method init
     * @returns {Object}
     */
    JQSliderGrid.prototype.init = function(){
        JQSliderGrid.superclass.init.call( this );
        var self = this;

        this._setupSlides();

        this.$el.bind( {
            'up':function ( e, slide ) {
                self.up( slide );
            },
            'down':function ( e, slide ) {
                self.down( slide );
            },
            'left':function ( e, slide ) {
                self.left( slide );
            },
            'right':function ( e, slide ) {
                self.right( slide );
            },
            'gotoid':function ( e, slideId ) {
                self.gotoId( slideId );
            },
            'gotohistory':function ( e, slideId ) {
                self.gotoHistory( slideId );
            }
        });

        return this;
    };
    JQSliderGrid.defaults = JQSliderGrid.prototype.defaults;

    /**
     * @description Initialize each object of the jQuery set as an instance of JQSliderGrid, sets a reference to the instance
     * in data-jqslidergrid and checks for that to prevent a second initialisation.
     * @name jqslidergrid
     * @param {Object} options  Object with plugin settings
     * @return {Object} jQuery object
     */
    $.fn.jqslidergrid = function(options) {
        return this.each(function(){
            if ( undefined == $( this ).data('jqslidergrid') ) {
                $( this ).data('jqslidergrid', new JQSliderGrid( this, options) );
            }
        });
    };

    window.JQSliderGrid = JQSliderGrid;

})( window.jQuery || window.Zepto, window , document );