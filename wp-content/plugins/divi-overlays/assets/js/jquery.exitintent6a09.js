(function($){'use strict';var dovtimer;function trackLeave(ev){if(ev.clientY>0){return}if(dovtimer){clearTimeout(dovtimer)}if($.exitIntent.settings.sensitivity<=0){$.event.trigger('exitintent');return}dovtimer=setTimeout(function(){dovtimer=null;if(ev.target.length===undefined){$.event.trigger('exitintent')}},$.exitIntent.settings.sensitivity)}function trackEnter(){if(dovtimer){clearTimeout(dovtimer);dovtimer=null}}$.exitIntent=function(enable,options){let trackme=$('body,window');$.exitIntent.settings=$.extend($.exitIntent.settings,options);if(enable==='enable'){trackme.mouseleave(trackLeave);trackme.mouseenter(trackEnter)}else if(enable==='disable'){trackEnter();trackme.unbind('mouseleave',trackLeave);trackme.unbind('mouseenter',trackEnter)}else{throw "Invalid parameter to jQuery.exitIntent -- should be 'enable'/'disable'"}};$.exitIntent.settings={'sensitivity':300}})(jQuery);