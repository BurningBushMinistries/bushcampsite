!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.SignaturePad=e()}(this,function(){"use strict";function t(t,e,o){this.x=t,this.y=e,this.time=o||(new Date).getTime()}function e(t,e,o,i){this.startPoint=t,this.control1=e,this.control2=o,this.endPoint=i}function o(t,e,o){var i,n,s,r=null,h=0;o||(o={});var a=function(){h=!1===o.leading?0:Date.now(),r=null,s=t.apply(i,n),r||(i=n=null)};return function(){var c=Date.now();h||!1!==o.leading||(h=c);var u=e-(c-h);return i=this,n=arguments,u<=0||u>e?(r&&(clearTimeout(r),r=null),h=c,s=t.apply(i,n),r||(i=n=null)):r||!1===o.trailing||(r=setTimeout(a,u)),s}}function i(t,e){var n=this,s=e||{};this.velocityFilterWeight=s.velocityFilterWeight||.7,this.minWidth=s.minWidth||.5,this.maxWidth=s.maxWidth||2.5,this.throttle="throttle"in s?s.throttle:16,this.throttle?this._strokeMoveUpdate=o(i.prototype._strokeUpdate,this.throttle):this._strokeMoveUpdate=i.prototype._strokeUpdate,this.dotSize=s.dotSize||function(){return(this.minWidth+this.maxWidth)/2},this.penColor=s.penColor||"black",this.backgroundColor=s.backgroundColor||"rgba(0,0,0,0)",this.onBegin=s.onBegin,this.onEnd=s.onEnd,this._canvas=t,this._ctx=t.getContext("2d"),this.clear(),this._handleMouseDown=function(t){1===t.which&&(n._mouseButtonDown=!0,n._strokeBegin(t))},this._handleMouseMove=function(t){n._mouseButtonDown&&n._strokeMoveUpdate(t)},this._handleMouseUp=function(t){1===t.which&&n._mouseButtonDown&&(n._mouseButtonDown=!1,n._strokeEnd(t))},this._handleTouchStart=function(t){if(1===t.targetTouches.length){var e=t.changedTouches[0];n._strokeBegin(e)}},this._handleTouchMove=function(t){t.preventDefault();var e=t.targetTouches[0];n._strokeMoveUpdate(e)},this._handleTouchEnd=function(t){t.target===n._canvas&&(t.preventDefault(),n._strokeEnd(t))},this.on()}return t.prototype.velocityFrom=function(t){return this.time!==t.time?this.distanceTo(t)/(this.time-t.time):1},t.prototype.distanceTo=function(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))},e.prototype.length=function(){for(var t=0,e=void 0,o=void 0,i=0;i<=10;i+=1){var n=i/10,s=this._point(n,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),r=this._point(n,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y);if(i>0){var h=s-e,a=r-o;t+=Math.sqrt(h*h+a*a)}e=s,o=r}return t},e.prototype._point=function(t,e,o,i,n){return e*(1-t)*(1-t)*(1-t)+3*o*(1-t)*(1-t)*t+3*i*(1-t)*t*t+n*t*t*t},i.prototype.clear=function(){var t=this._ctx,e=this._canvas;t.fillStyle=this.backgroundColor,t.clearRect(0,0,e.width,e.height),t.fillRect(0,0,e.width,e.height),this._data=[],this._reset(),this._isEmpty=!0},i.prototype.fromDataURL=function(t){var e=this,o=new Image,i=window.devicePixelRatio||1,n=this._canvas.width/i,s=this._canvas.height/i;this._reset(),o.src=t,o.onload=function(){e._ctx.drawImage(o,0,0,n,s)},this._isEmpty=!1},i.prototype.toDataURL=function(t){var e;switch(t){case"image/svg+xml":return this._toSVG();default:for(var o=arguments.length,i=Array(o>1?o-1:0),n=1;n<o;n++)i[n-1]=arguments[n];return(e=this._canvas).toDataURL.apply(e,[t].concat(i))}},i.prototype.on=function(){this._handleMouseEvents(),this._handleTouchEvents()},i.prototype.off=function(){this._canvas.removeEventListener("mousedown",this._handleMouseDown),this._canvas.removeEventListener("mousemove",this._handleMouseMove),document.removeEventListener("mouseup",this._handleMouseUp),this._canvas.removeEventListener("touchstart",this._handleTouchStart),this._canvas.removeEventListener("touchmove",this._handleTouchMove),this._canvas.removeEventListener("touchend",this._handleTouchEnd)},i.prototype.isEmpty=function(){return this._isEmpty},i.prototype._strokeBegin=function(t){this._data.push([]),this._reset(),this._strokeUpdate(t),"function"==typeof this.onBegin&&this.onBegin(t)},i.prototype._strokeUpdate=function(t){var e=t.clientX,o=t.clientY,i=this._createPoint(e,o),n=this._addPoint(i),s=n.curve,r=n.widths;s&&r&&this._drawCurve(s,r.start,r.end),this._data[this._data.length-1].push({x:i.x,y:i.y,time:i.time})},i.prototype._strokeEnd=function(t){var e=this.points.length>2,o=this.points[0];!e&&o&&this._drawDot(o),"function"==typeof this.onEnd&&this.onEnd(t)},i.prototype._handleMouseEvents=function(){this._mouseButtonDown=!1,this._canvas.addEventListener("mousedown",this._handleMouseDown),this._canvas.addEventListener("mousemove",this._handleMouseMove),document.addEventListener("mouseup",this._handleMouseUp)},i.prototype._handleTouchEvents=function(){this._canvas.style.msTouchAction="none",this._canvas.style.touchAction="none",this._canvas.addEventListener("touchstart",this._handleTouchStart),this._canvas.addEventListener("touchmove",this._handleTouchMove),this._canvas.addEventListener("touchend",this._handleTouchEnd)},i.prototype._reset=function(){this.points=[],this._lastVelocity=0,this._lastWidth=(this.minWidth+this.maxWidth)/2,this._ctx.fillStyle=this.penColor},i.prototype._createPoint=function(e,o,i){var n=this._canvas.getBoundingClientRect();return new t(e-n.left,o-n.top,i||(new Date).getTime())},i.prototype._addPoint=function(t){var o=this.points,i=void 0;if(o.push(t),o.length>2){3===o.length&&o.unshift(o[0]),i=this._calculateCurveControlPoints(o[0],o[1],o[2]);var n=i.c2;i=this._calculateCurveControlPoints(o[1],o[2],o[3]);var s=i.c1,r=new e(o[1],n,s,o[2]),h=this._calculateCurveWidths(r);return o.shift(),{curve:r,widths:h}}return{}},i.prototype._calculateCurveControlPoints=function(e,o,i){var n=e.x-o.x,s=e.y-o.y,r=o.x-i.x,h=o.y-i.y,a={x:(e.x+o.x)/2,y:(e.y+o.y)/2},c={x:(o.x+i.x)/2,y:(o.y+i.y)/2},u=Math.sqrt(n*n+s*s),d=Math.sqrt(r*r+h*h),l=a.x-c.x,v=a.y-c.y,p=d/(u+d),_={x:c.x+l*p,y:c.y+v*p},y=o.x-_.x,f=o.y-_.y;return{c1:new t(a.x+y,a.y+f),c2:new t(c.x+y,c.y+f)}},i.prototype._calculateCurveWidths=function(t){var e=t.startPoint,o=t.endPoint,i={start:null,end:null},n=this.velocityFilterWeight*o.velocityFrom(e)+(1-this.velocityFilterWeight)*this._lastVelocity,s=this._strokeWidth(n);return i.start=this._lastWidth,i.end=s,this._lastVelocity=n,this._lastWidth=s,i},i.prototype._strokeWidth=function(t){return Math.max(this.maxWidth/(t+1),this.minWidth)},i.prototype._drawPoint=function(t,e,o){var i=this._ctx;i.moveTo(t,e),i.arc(t,e,o,0,2*Math.PI,!1),this._isEmpty=!1},i.prototype._drawCurve=function(t,e,o){var i=this._ctx,n=o-e,s=Math.floor(t.length());i.beginPath();for(var r=0;r<s;r+=1){var h=r/s,a=h*h,c=a*h,u=1-h,d=u*u,l=d*u,v=l*t.startPoint.x;v+=3*d*h*t.control1.x,v+=3*u*a*t.control2.x,v+=c*t.endPoint.x;var p=l*t.startPoint.y;p+=3*d*h*t.control1.y,p+=3*u*a*t.control2.y,p+=c*t.endPoint.y;var _=e+c*n;this._drawPoint(v,p,_)}i.closePath(),i.fill()},i.prototype._drawDot=function(t){var e=this._ctx,o="function"==typeof this.dotSize?this.dotSize():this.dotSize;e.beginPath(),this._drawPoint(t.x,t.y,o),e.closePath(),e.fill()},i.prototype._fromData=function(e,o,i){for(var n=0;n<e.length;n+=1){var s=e[n];if(s.length>1)for(var r=0;r<s.length;r+=1){var h=s[r],a=new t(h.x,h.y,h.time);if(0===r)this._reset(),this._addPoint(a);else if(r!==s.length-1){var c=this._addPoint(a),u=c.curve,d=c.widths;u&&d&&o(u,d)}}else{this._reset();i(s[0])}}},i.prototype._toSVG=function(){var t=this,e=this._data,o=this._canvas,i=Math.max(window.devicePixelRatio||1,1),n=o.width/i,s=o.height/i,r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttributeNS(null,"width",o.width),r.setAttributeNS(null,"height",o.height),this._fromData(e,function(e,o){var i=document.createElement("path");if(!(isNaN(e.control1.x)||isNaN(e.control1.y)||isNaN(e.control2.x)||isNaN(e.control2.y))){var n="M "+e.startPoint.x.toFixed(3)+","+e.startPoint.y.toFixed(3)+" C "+e.control1.x.toFixed(3)+","+e.control1.y.toFixed(3)+" "+e.control2.x.toFixed(3)+","+e.control2.y.toFixed(3)+" "+e.endPoint.x.toFixed(3)+","+e.endPoint.y.toFixed(3);i.setAttribute("d",n),i.setAttribute("stroke-width",(2.25*o.end).toFixed(3)),i.setAttribute("stroke",t.penColor),i.setAttribute("fill","none"),i.setAttribute("stroke-linecap","round"),r.appendChild(i)}},function(e){var o=document.createElement("circle"),i="function"==typeof t.dotSize?t.dotSize():t.dotSize;o.setAttribute("r",i),o.setAttribute("cx",e.x),o.setAttribute("cy",e.y),o.setAttribute("fill",t.penColor),r.appendChild(o)});var h='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 '+n+" "+s+'" width="'+n+'" height="'+s+'">',a=r.innerHTML;if(void 0===a){var c=document.createElement("dummy"),u=r.childNodes;c.innerHTML="";for(var d=0;d<u.length;d+=1)c.appendChild(u[d].cloneNode(!0));a=c.innerHTML}var l=h+a+"</svg>";return"data:image/svg+xml;base64,"+btoa(l)},i.prototype.fromData=function(t){var e=this;this.clear(),this._fromData(t,function(t,o){return e._drawCurve(t,o.start,o.end)},function(t){return e._drawDot(t)})},i.prototype.toData=function(){return this._data},i});