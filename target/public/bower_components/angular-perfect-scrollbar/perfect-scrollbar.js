/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */

(function ($) {

        var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
                toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                                        ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
                slice  = Array.prototype.slice,
                nullLowestDeltaTimeout, lowestDelta;

        if ( $.event.fixHooks ) {
                for ( var i = toFix.length; i; ) {
                        $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
                }
        }

        var special = $.event.special.mousewheel = {
                version: '3.1.9',

                setup: function() {
                        if ( this.addEventListener ) {
                                for ( var i = toBind.length; i; ) {
                                        this.addEventListener( toBind[--i], handler, false );
                                }
                        } else {
                                this.onmousewheel = handler;
                        }
                        // Store the line height and page height for this particular element
                        $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
                        $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
                },

                teardown: function() {
                        if ( this.removeEventListener ) {
                                for ( var i = toBind.length; i; ) {
                                        this.removeEventListener( toBind[--i], handler, false );
                                }
                        } else {
                                this.onmousewheel = null;
                        }
                },

                getLineHeight: function(elem) {
                        return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
                },

                getPageHeight: function(elem) {
                        return $(elem).height();
                },

                settings: {
                        adjustOldDeltas: true
                }
        };

        $.fn.extend({
                mousewheel: function(fn) {
                        return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
                },

                unmousewheel: function(fn) {
                        return this.unbind('mousewheel', fn);
                }
        });


        function handler(event) {
                var orgEvent   = event || window.event,
                        args       = slice.call(arguments, 1),
                        delta      = 0,
                        deltaX     = 0,
                        deltaY     = 0,
                        absDelta   = 0;
                event = $.event.fix(orgEvent);
                event.type = 'mousewheel';

                // Old school scrollwheel delta
                if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
                if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
                if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
                if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

                // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
                if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
                        deltaX = deltaY * -1;
                        deltaY = 0;
                }

                // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
                delta = deltaY === 0 ? deltaX : deltaY;

                // New school wheel delta (wheel event)
                if ( 'deltaY' in orgEvent ) {
                        deltaY = orgEvent.deltaY * -1;
                        delta  = deltaY;
                }
                if ( 'deltaX' in orgEvent ) {
                        deltaX = orgEvent.deltaX;
                        if ( deltaY === 0 ) { delta  = deltaX * -1; }
                }

                // No change actually happened, no reason to go any further
                if ( deltaY === 0 && deltaX === 0 ) { return; }

                // Need to convert lines and pages to pixels if we aren't already in pixels
                // There are three delta modes:
                //   * deltaMode 0 is by pixels, nothing to do
                //   * deltaMode 1 is by lines
                //   * deltaMode 2 is by pages
                if ( orgEvent.deltaMode === 1 ) {
                        var lineHeight = $.data(this, 'mousewheel-line-height');
                        delta  *= lineHeight;
                        deltaY *= lineHeight;
                        deltaX *= lineHeight;
                } else if ( orgEvent.deltaMode === 2 ) {
                        var pageHeight = $.data(this, 'mousewheel-page-height');
                        delta  *= pageHeight;
                        deltaY *= pageHeight;
                        deltaX *= pageHeight;
                }

                // Store lowest absolute delta to normalize the delta values
                absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

                if ( !lowestDelta || absDelta < lowestDelta ) {
                        lowestDelta = absDelta;

                        // Adjust older deltas if necessary
                        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                                lowestDelta /= 40;
                        }
                }

                // Adjust older deltas if necessary
                if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                        // Divide all the things by 40!
                        delta  /= 40;
                        deltaX /= 40;
                        deltaY /= 40;
                }

                // Get a whole, normalized value for the deltas
                delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
                deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
                deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

                // Add information to the event object
                event.deltaX = deltaX;
                event.deltaY = deltaY;
                event.deltaFactor = lowestDelta;
                // Go ahead and set deltaMode to 0 since we converted to pixels
                // Although this is a little odd since we overwrite the deltaX/Y
                // properties with normalized deltas.
                event.deltaMode = 0;

                // Add event and delta to the front of the arguments
                args.unshift(event, delta, deltaX, deltaY);

                // Clearout lowestDelta after sometime to better
                // handle multiple device types that give different
                // a different lowestDelta
                // Ex: trackpad = 3 and mouse wheel = 120
                if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
                nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

                return ($.event.dispatch || $.event.handle).apply(this, args);
        }

        function nullLowestDelta() {
                lowestDelta = null;
        }

        function shouldAdjustOldDeltas(orgEvent, absDelta) {
                // If this is an older event and the delta is divisable by 120,
                // then we are assuming that the browser is treating this as an
                // older mouse wheel event and that we should divide the deltas
                // by 40 to try and get a more usable deltaFactor.
                // Side note, this actually impacts the reported scroll distance
                // in older browsers and can cause scrolling to be slower than native.
                // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
                return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
        }

})(jQuery);


/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
'use strict';
(function ($) {

    // The default settings for the plugin
    var defaultSettings = {
        wheelSpeed: 10,
        wheelPropagation: false,
        minScrollbarLength: null,
        useBothWheelAxes: false,
        useKeyboard: true,
        suppressScrollX: false,
        suppressScrollY: false,
        scrollXMarginOffset: 0,
        scrollYMarginOffset: 0
    };

    var getEventClassName = (function () {
        var incrementingId = 0;
        return function () {
            var id = incrementingId;
            incrementingId += 1;
            return '.perfect-scrollbar-' + id;
        };
    }());

    $.fn.perfectScrollbar = function (suppliedSettings, option) {

        return this.each(function () {
            // Use the default settings
            var settings = $.extend(true, {}, defaultSettings),
                    $this = $(this);

            if (typeof suppliedSettings === "object") {
                // But over-ride any supplied
                $.extend(true, settings, suppliedSettings);
            } else {
                // If no settings were supplied, then the first param must be the option
                option = suppliedSettings;
            }

            // Catch options

            if (option === 'update') {
                if ($this.data('perfect-scrollbar-update')) {
                    $this.data('perfect-scrollbar-update')();
                }
                return $this;
            }
            else if (option === 'destroy') {
                if ($this.data('perfect-scrollbar-destroy')) {
                    $this.data('perfect-scrollbar-destroy')();
                }
                return $this;
            }

            if ($this.data('perfect-scrollbar')) {
                // if there's already perfect-scrollbar
                return $this.data('perfect-scrollbar');
            }


            // Or generate new perfectScrollbar

            // Set class to the container
            $this.addClass('ps-container');

            var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'></div>").appendTo($this),
                    $scrollbarYRail = $("<div class='ps-scrollbar-y-rail'></div>").appendTo($this),
                    $scrollbarX = $("<div class='ps-scrollbar-x'></div>").appendTo($scrollbarXRail),
                    $scrollbarY = $("<div class='ps-scrollbar-y'></div>").appendTo($scrollbarYRail),
                    scrollbarXActive,
                    scrollbarYActive,
                    containerWidth,
                    containerHeight,
                    contentWidth,
                    contentHeight,
                    scrollbarXWidth,
                    scrollbarXLeft,
                    scrollbarXBottom = parseInt($scrollbarXRail.css('bottom'), 10),
                    scrollbarYHeight,
                    scrollbarYTop,
                    scrollbarYRight = parseInt($scrollbarYRail.css('right'), 10),
                    eventClassName = getEventClassName();

            var updateContentScrollTop = function (currentTop, deltaY) {
                var newTop = currentTop + deltaY,
                        maxTop = containerHeight - scrollbarYHeight;

                if (newTop < 0) {
                    scrollbarYTop = 0;
                }
                else if (newTop > maxTop) {
                    scrollbarYTop = maxTop;
                }
                else {
                    scrollbarYTop = newTop;
                }

                var scrollTop = parseInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight), 10);
                $this.scrollTop(scrollTop);
                $scrollbarXRail.css({bottom: scrollbarXBottom - scrollTop});
            };

            var updateContentScrollLeft = function (currentLeft, deltaX) {
                var newLeft = currentLeft + deltaX,
                    maxLeft = containerWidth - scrollbarXWidth;

                if (newLeft < 0) {
                    scrollbarXLeft = 0;
                } else if (newLeft > maxLeft) {
                    scrollbarXLeft = maxLeft;
                } else {
                    scrollbarXLeft = newLeft;
                }

                var scrollLeft = parseInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth), 10);

                $this.scrollLeft(scrollLeft);
                $scrollbarYRail.css({right: scrollbarYRight - scrollLeft});
            };

            var getSettingsAdjustedThumbSize = function (thumbSize) {
                if (settings.minScrollbarLength) {
                    thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
                }

                return thumbSize;
            };

            var updateScrollbarCss = function () {
                $scrollbarXRail.css({
                    left: $this.scrollLeft(),
                    bottom: scrollbarXBottom - $this.scrollTop(),
                    width: containerWidth,
                    display: scrollbarXActive ? "inherit": "none"
                });

                $scrollbarYRail.css({
                    top: $this.scrollTop(),
                    right: scrollbarYRight - $this.scrollLeft(),
                    height: containerHeight,
                    display: scrollbarYActive ? "inherit": "none"
                });


                $scrollbarX.css({
                    left: scrollbarXLeft,
                    width: scrollbarXWidth}
                );

                $scrollbarY.css({
                    top: scrollbarYTop,
                    height: scrollbarYHeight
                });
            };

            var updateBarSizeAndPosition = function () {
                containerWidth = $this.width();
                containerHeight = $this.height();
                contentWidth = $this.prop('scrollWidth');
                contentHeight = $this.prop('scrollHeight');

                if (!settings.suppressScrollX && ((containerWidth + settings.scrollXMarginOffset) < contentWidth)) {
                    scrollbarXActive = true;
                    scrollbarXWidth = getSettingsAdjustedThumbSize(parseInt(containerWidth * containerWidth / contentWidth, 10));
                    scrollbarXLeft = parseInt($this.scrollLeft() * (containerWidth - scrollbarXWidth) / (contentWidth - containerWidth), 10);
                } else {
                    scrollbarXActive = false;
                    scrollbarXWidth = 0;
                    scrollbarXLeft = 0;
                    $this.scrollLeft(0);
                }

                if (!settings.suppressScrollY && ((containerHeight + settings.scrollYMarginOffset) < contentHeight)) {
                    scrollbarYActive = true;
                    scrollbarYHeight = getSettingsAdjustedThumbSize(parseInt(containerHeight * containerHeight / contentHeight, 10));
                    scrollbarYTop = parseInt($this.scrollTop() * (containerHeight - scrollbarYHeight) / (contentHeight - containerHeight), 10);
                } else {
                    scrollbarYActive = false;
                    scrollbarYHeight = 0;
                    scrollbarYTop = 0;
                    $this.scrollTop(0);
                }

                if (scrollbarYTop >= (containerHeight - scrollbarYHeight)) {
                    scrollbarYTop = containerHeight - scrollbarYHeight;
                }

                if (scrollbarXLeft >= (containerWidth - scrollbarXWidth)) {
                    scrollbarXLeft = containerWidth - scrollbarXWidth;
                }

                updateScrollbarCss();
            };

            var bindMouseScrollXHandler = function () {
                var currentLeft,
                    currentPageX;

                $scrollbarX.bind('mousedown' + eventClassName, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    currentPageX = e.pageX;
                    currentLeft = $scrollbarX.position().left;
                    $scrollbarXRail.addClass('in-scrolling');
                });

                $(document).bind('mousemove' + eventClassName, function (e) {
                    if ($scrollbarXRail.hasClass('in-scrolling')) {
                        e.stopPropagation();
                        e.preventDefault();

                        updateContentScrollLeft(currentLeft, e.pageX - currentPageX);
                    }
                });

                $(document).bind('mouseup' + eventClassName, function (e) {
                    if ($scrollbarXRail.hasClass('in-scrolling')) {
                        $scrollbarXRail.removeClass('in-scrolling');
                    }
                });

                currentLeft = currentPageX = null;
            };

            var bindMouseScrollYHandler = function () {
                var currentTop,
                    currentPageY;

                $scrollbarY.bind('mousedown' + eventClassName, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    currentPageY = e.pageY;
                    currentTop = $scrollbarY.position().top;
                    $scrollbarYRail.addClass('in-scrolling');
                });

                $(document).bind('mousemove' + eventClassName, function (e) {
                    if ($scrollbarYRail.hasClass('in-scrolling')) {
                        e.stopPropagation();
                        e.preventDefault();

                        updateContentScrollTop(currentTop, e.pageY - currentPageY);
                    }
                });

                $(document).bind('mouseup' + eventClassName, function (e) {
                    if ($scrollbarYRail.hasClass('in-scrolling')) {
                        $scrollbarYRail.removeClass('in-scrolling');
                    }
                });

                currentTop = currentPageY = null;
            };

            // check if the default scrolling should be prevented.
            var shouldPreventDefault = function (deltaX, deltaY) {
                var scrollTop = $this.scrollTop();
                if (deltaX === 0) {
                    if (!scrollbarYActive) {
                        return false;
                    }
                    if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
                        return !settings.wheelPropagation;
                    }
                }

                var scrollLeft = $this.scrollLeft();
                if (deltaY === 0) {
                    if (!scrollbarXActive) {
                        return false;
                    }

                    if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
                        return !settings.wheelPropagation;
                    }
                }

                return true;
            };

            // bind handlers
            var bindMouseWheelHandler = function () {
                var shouldPrevent = false;
                $this.bind('mousewheel' + eventClassName, function (e, deprecatedDelta, deprecatedDeltaX, deprecatedDeltaY) {
                    var deltaX = e.deltaX ? (e.deltaX / 10) : deprecatedDeltaX,
                        deltaY = e.deltaY ? (e.deltaY / 10) : deprecatedDeltaY;

                    if (!settings.useBothWheelAxes) {
                        // deltaX will only be used for horizontal scrolling and deltaY will
                        // only be used for vertical scrolling - this is the default
                        $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
                        $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                    } else if (scrollbarYActive && !scrollbarXActive) {
                        // only vertical scrollbar is active and useBothWheelAxes option is
                        // active, so let's scroll vertical bar using both mouse wheel axes
                        if (deltaY) {
                            $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
                        } else {
                            $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
                        }
                    } else if (scrollbarXActive && !scrollbarYActive) {
                        // useBothWheelAxes and only horizontal bar is active, so use both
                        // wheel axes for horizontal bar
                        if (deltaX) {
                            $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                        } else {
                            $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
                        }
                    }

                    // update bar position
                    updateBarSizeAndPosition();

                    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
                    if (shouldPrevent) {
                        e.preventDefault();
                    }
                });

                // fix Firefox scroll problem
                $this.bind('MozMousePixelScroll' + eventClassName, function (e) {
                    if (shouldPrevent) {
                        e.preventDefault();
                    }
                });
            };

            var bindKeyboardHandler = function () {
                var hovered = false;
                $this.bind('mouseenter' + eventClassName, function (e) {
                    hovered = true;
                });
                $this.bind('mouseleave' + eventClassName, function (e) {
                    hovered = false;
                });

                var shouldPrevent = false;
                $(document).bind('keydown' + eventClassName, function (e) {
                    if (!hovered) {
                        return;
                    }

                    var deltaX = 0,
                        deltaY = 0;

                    switch (e.which) {
                        case 37: // left
                            deltaX = -3;
                            break;
                        case 38: // up
                            deltaY = 3;
                            break;
                        case 39: // right
                            deltaX = 3;
                            break;
                        case 40: // down
                            deltaY = -3;
                            break;
                        case 33: // page up
                            deltaY = 9;
                            break;
                        case 32: // space bar
                        case 34: // page down
                            deltaY = -9;
                            break;
                        case 35: // end
                            deltaY = -containerHeight;
                            break;
                        case 36: // home
                            deltaY = containerHeight;
                            break;
                        default:
                            return;
                    }

                    $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
                    $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));

                    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
                    if (shouldPrevent) {
                        e.preventDefault();
                    }
                });
            };

            var bindRailClickHandler = function () {
                var stopPropagation = function (e) { e.stopPropagation(); };

                $scrollbarY.bind('click' + eventClassName, stopPropagation);
                $scrollbarYRail.bind('click' + eventClassName, function (e) {
                    var halfOfScrollbarLength = parseInt(scrollbarYHeight / 2, 10),
                        positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength,
                        maxPositionTop = containerHeight - scrollbarYHeight,
                        positionRatio = positionTop / maxPositionTop;

                    if (positionRatio < 0) {
                        positionRatio = 0;
                    } else if (positionRatio > 1) {
                        positionRatio = 1;
                    }

                    $this.scrollTop((contentHeight - containerHeight) * positionRatio);
                });

                $scrollbarX.bind('click' + eventClassName, stopPropagation);
                $scrollbarXRail.bind('click' + eventClassName, function (e) {
                    var halfOfScrollbarLength = parseInt(scrollbarXWidth / 2, 10),
                        positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength,
                        maxPositionLeft = containerWidth - scrollbarXWidth,
                        positionRatio = positionLeft / maxPositionLeft;

                    if (positionRatio < 0) {
                        positionRatio = 0;
                    } else if (positionRatio > 1) {
                        positionRatio = 1;
                    }

                    $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
                });
            };

            // bind mobile touch handler
            var bindMobileTouchHandler = function () {
                var applyTouchMove = function (differenceX, differenceY) {
                    $this.scrollTop($this.scrollTop() - differenceY);
                    $this.scrollLeft($this.scrollLeft() - differenceX);

                    // update bar position
                    updateBarSizeAndPosition();
                };

                var startCoords = {},
                    startTime = 0,
                    speed = {},
                    breakingProcess = null,
                    inGlobalTouch = false;

                $(window).bind("touchstart" + eventClassName, function (e) {
                    inGlobalTouch = true;
                });

                $(window).bind("touchend" + eventClassName, function (e) {
                    inGlobalTouch = false;
                });

                $this.bind("touchstart" + eventClassName, function (e) {
                    var touch = e.originalEvent.targetTouches[0];

                    startCoords.pageX = touch.pageX;
                    startCoords.pageY = touch.pageY;

                    startTime = (new Date()).getTime();

                    if (breakingProcess !== null) {
                        clearInterval(breakingProcess);
                    }

                    e.stopPropagation();
                });

                $this.bind("touchmove" + eventClassName, function (e) {
                    if (!inGlobalTouch && e.originalEvent.targetTouches.length === 1) {
                        var touch = e.originalEvent.targetTouches[0];

                        var currentCoords = {};
                        currentCoords.pageX = touch.pageX;
                        currentCoords.pageY = touch.pageY;

                        var differenceX = currentCoords.pageX - startCoords.pageX,
                            differenceY = currentCoords.pageY - startCoords.pageY;

                        applyTouchMove(differenceX, differenceY);
                        startCoords = currentCoords;

                        var currentTime = (new Date()).getTime();

                        var timeGap = currentTime - startTime;
                        if (timeGap > 0) {
                            speed.x = differenceX / timeGap;
                            speed.y = differenceY / timeGap;
                            startTime = currentTime;
                        }

                        e.preventDefault();
                    }
                });

                $this.bind("touchend" + eventClassName, function (e) {
                    clearInterval(breakingProcess);

                    breakingProcess = setInterval(function () {
                        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                            clearInterval(breakingProcess);
                            return;
                        }

                        applyTouchMove(speed.x * 30, speed.y * 30);

                        speed.x *= 0.8;
                        speed.y *= 0.8;
                    }, 10);
                });
            };

            var bindScrollHandler = function () {
                $this.bind('scroll' + eventClassName, function (e) {
                    updateBarSizeAndPosition();
                });
            };

            var destroy = function () {
                $this.unbind(eventClassName);
                $(window).unbind(eventClassName);
                $(document).unbind(eventClassName);
                $this.data('perfect-scrollbar', null);
                $this.data('perfect-scrollbar-update', null);
                $this.data('perfect-scrollbar-destroy', null);
                $scrollbarX.remove();
                $scrollbarY.remove();
                $scrollbarXRail.remove();
                $scrollbarYRail.remove();

                // clean all variables
                $scrollbarX =
                $scrollbarY =
                containerWidth =
                containerHeight =
                contentWidth =
                contentHeight =
                scrollbarXWidth =
                scrollbarXLeft =
                scrollbarXBottom =
                scrollbarYHeight =
                scrollbarYTop =
                scrollbarYRight = null;
            };

            var supportsTouch = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch));

            var initialize = function () {

                updateBarSizeAndPosition();
                bindScrollHandler();
                bindMouseScrollXHandler();
                bindMouseScrollYHandler();
                bindRailClickHandler();

                if (supportsTouch) {
                    bindMobileTouchHandler();
                }

                if ($this.mousewheel) {
                    bindMouseWheelHandler();
                }

                if (settings.useKeyboard) {
                    bindKeyboardHandler();
                }

                $this.data('perfect-scrollbar', $this);
                $this.data('perfect-scrollbar-update', updateBarSizeAndPosition);
                $this.data('perfect-scrollbar-destroy', destroy);
            };

            // initialize
            initialize();

            return $this;
        });
    };
})(jQuery);