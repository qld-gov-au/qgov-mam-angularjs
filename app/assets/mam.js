angular.module( 'qgov', [] )

.controller( 'QgovTemplateController', function( $scope ) {
	// view model
	var swe = {};

	swe.pageTitle = 'Hello world';
	swe.franchiseName = 'Transport and motoring';
	swe.franchisePath = 'transport';

	$scope.swe = swe;
});
;/*global $, L, qg*/
angular.module( 'map', [] )

// map details
.constant( 'MAX_ZOOM', $( '#app-viewport' ).hasClass( 'obscure' ) ? 12 : 17 )


.factory( 'mapModel', [ '$rootScope', 'MAX_ZOOM',
function(                $rootScope,   MAX_ZOOM ) {
	// leaflet config
	L.Icon.Default.imagePath = qg.swe.paths.assets + 'images/skin/map-marker';

	var model = {
		center: {
			lat: -23,
			lng: 143,
			zoom: 4
		},
		layers: {
			baselayers: {
				street: {
					name: 'Street map',
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
					type: 'xyz',
					options: { attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2013' }
				},
				satellite: {
					name: 'Satellite',
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
					type: 'xyz',
					options: { attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community' }
				}
				// , {
				// 	url: '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
				// 	options: { attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom' }
				// }, {
				// 	url: '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
				// 	options: { attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom' }
				// }]
			}
		},
		markers: {},
		paths: {}
	};

	return {
		center: function() {
			return model.center;
		},
		layers: function() {
			return model.layers;
		},
		markers: function() {
			return model.markers;
		},
		paths: function() {
			return model.paths;
		},
		setMarkers: function( dataset ) {
			// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/marker
			model.markers = $.map( dataset, function( marker ) {
				marker.focus = true;
				marker.draggable = false;
				marker.group = 'cluster';
				return marker;
			});

			if ( model.markers.length === 1 ) {
				// only one marker, zoom in on it
				model.center.lat = model.markers[ 0 ].lat;
				model.center.lng = model.markers[ 0 ].lng;
				model.center.zoom = MAX_ZOOM;

				model.paths.target = {
					type: 'circleMarker',
					radius: 100,
					latlngs: [ model.center.lat, model.center.lng ],
					color: '#f00',
					opacity: 0.8,
					weight: 3,
					fill: false,
					clickable: false
				};
			} else {
				model.paths = {};
			}

			$rootScope.$broadcast( 'changeMapMarkers' );
		}
	};
}])


.controller( 'MapController', [ 'mapModel', '$scope', '$location',
function(                        mapModel,   $scope,   $location ) {

	// view model
	var map = this;

	// map UI
	// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/simple-map
	map.config = { scrollWheelZoom: true };

	// http://leaflet-extras.github.io/leaflet-providers/preview/
	map.layers = mapModel.layers();

	function updateMap() {
		map.center = mapModel.center();
		map.markers = mapModel.markers();
		map.paths = mapModel.paths();
	}

	// when markers change
	$scope.$on( 'changeMapMarkers', updateMap );

	// onload
	updateMap();

	// marker click
	$scope.$on( 'leafletDirectiveMarker.click', function( event, args ) {
		var marker = map.markers[ args.markerName ];
		$location.path( '/' + marker.title );
	});

}]);
;/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
!function(t,e,i){var n=t.L,o={};o.version="0.7.3","object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),o.noConflict=function(){return t.L=n,this},t.L=o,o.Util={extend:function(t){var e,i,n,o,s=Array.prototype.slice.call(arguments,1);for(i=0,n=s.length;n>i;i++){o=s[i]||{};for(e in o)o.hasOwnProperty(e)&&(t[e]=o[e])}return t},bind:function(t,e){var i=arguments.length>2?Array.prototype.slice.call(arguments,2):null;return function(){return t.apply(e,i||arguments)}},stamp:function(){var t=0,e="_leaflet_id";return function(i){return i[e]=i[e]||++t,i[e]}}(),invokeEach:function(t,e,i){var n,o;if("object"==typeof t){o=Array.prototype.slice.call(arguments,3);for(n in t)e.apply(i,[n,t[n]].concat(o));return!0}return!1},limitExecByInterval:function(t,e,i){var n,o;return function s(){var a=arguments;return n?void(o=!0):(n=!0,setTimeout(function(){n=!1,o&&(s.apply(i,a),o=!1)},e),void t.apply(i,a))}},falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){return t.options=o.extend({},t.options,e),t.options},getParamString:function(t,e,i){var n=[];for(var o in t)n.push(encodeURIComponent(i?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+n.join("&")},template:function(t,e){return t.replace(/\{ *([\w_]+) *\}/g,function(t,n){var o=e[n];if(o===i)throw new Error("No value provided for variable "+t);return"function"==typeof o&&(o=o(e)),o})},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){var i,n,o=["webkit","moz","o","ms"];for(i=0;i<o.length&&!n;i++)n=t[o[i]+e];return n}function i(e){var i=+new Date,o=Math.max(0,16-(i-n));return n=i+o,t.setTimeout(e,o)}var n=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||i,a=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,n,a,r){return e=o.bind(e,n),a&&s===i?void e():s.call(t,e,r)},o.Util.cancelAnimFrame=function(e){e&&a.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this._initHooks&&this.callInitHooks()},i=function(){};i.prototype=this.prototype;var n=new i;n.constructor=e,e.prototype=n;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),t.options&&n.options&&(t.options=o.extend({},n.options,t.options)),o.extend(n,t),n._initHooks=[];var a=this;return e.__super__=a.prototype,n.callInitHooks=function(){if(!this._initHooksCalled){a.prototype.callInitHooks&&a.prototype.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=n._initHooks.length;e>t;t++)n._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)};var s="_leaflet_events";o.Mixin={},o.Mixin.Events={addEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d=this[s]=this[s]||{},p=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)r={action:e,context:i||this},h=t[n],p?(l=h+"_idx",u=l+"_len",c=d[l]=d[l]||{},c[p]||(c[p]=[],d[u]=(d[u]||0)+1),c[p].push(r)):(d[h]=d[h]||[],d[h].push(r));return this},hasEventListeners:function(t){var e=this[s];return!!e&&(t in e&&e[t].length>0||t+"_idx"in e&&e[t+"_idx_len"]>0)},removeEventListener:function(t,e,i){if(!this[s])return this;if(!t)return this.clearAllEventListeners();if(o.Util.invokeEach(t,this.removeEventListener,this,e,i))return this;var n,a,r,h,l,u,c,d,p,_=this[s],m=i&&i!==this&&o.stamp(i);for(t=o.Util.splitWords(t),n=0,a=t.length;a>n;n++)if(r=t[n],u=r+"_idx",c=u+"_len",d=_[u],e){if(h=m&&d?d[m]:_[r]){for(l=h.length-1;l>=0;l--)h[l].action!==e||i&&h[l].context!==i||(p=h.splice(l,1),p[0].action=o.Util.falseFn);i&&d&&0===h.length&&(delete d[m],_[c]--)}}else delete _[r],delete _[u],delete _[c];return this},clearAllEventListeners:function(){return delete this[s],this},fireEvent:function(t,e){if(!this.hasEventListeners(t))return this;var i,n,a,r,h,l=o.Util.extend({},e,{type:t,target:this}),u=this[s];if(u[t])for(i=u[t].slice(),n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);r=u[t+"_idx"];for(h in r)if(i=r[h].slice())for(n=0,a=i.length;a>n;n++)i[n].action.call(i[n].context,l);return this},addOneTimeEventListener:function(t,e,i){if(o.Util.invokeEach(t,this.addOneTimeEventListener,this,e,i))return this;var n=o.bind(function(){this.removeEventListener(t,e,i).removeEventListener(t,n,i)},this);return this.addEventListener(t,e,i).addEventListener(t,n,i)}},o.Mixin.Events.on=o.Mixin.Events.addEventListener,o.Mixin.Events.off=o.Mixin.Events.removeEventListener,o.Mixin.Events.once=o.Mixin.Events.addOneTimeEventListener,o.Mixin.Events.fire=o.Mixin.Events.fireEvent,function(){var n="ActiveXObject"in t,s=n&&!e.addEventListener,a=navigator.userAgent.toLowerCase(),r=-1!==a.indexOf("webkit"),h=-1!==a.indexOf("chrome"),l=-1!==a.indexOf("phantom"),u=-1!==a.indexOf("android"),c=-1!==a.search("android [23]"),d=-1!==a.indexOf("gecko"),p=typeof orientation!=i+"",_=t.navigator&&t.navigator.msPointerEnabled&&t.navigator.msMaxTouchPoints&&!t.PointerEvent,m=t.PointerEvent&&t.navigator.pointerEnabled&&t.navigator.maxTouchPoints||_,f="devicePixelRatio"in t&&t.devicePixelRatio>1||"matchMedia"in t&&t.matchMedia("(min-resolution:144dpi)")&&t.matchMedia("(min-resolution:144dpi)").matches,g=e.documentElement,v=n&&"transition"in g.style,y="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix&&!c,P="MozPerspective"in g.style,L="OTransition"in g.style,x=!t.L_DISABLE_3D&&(v||y||P||L)&&!l,w=!t.L_NO_TOUCH&&!l&&function(){var t="ontouchstart";if(m||t in g)return!0;var i=e.createElement("div"),n=!1;return i.setAttribute?(i.setAttribute(t,"return;"),"function"==typeof i[t]&&(n=!0),i.removeAttribute(t),i=null,n):!1}();o.Browser={ie:n,ielt9:s,webkit:r,gecko:d&&!r&&!t.opera&&!n,android:u,android23:c,chrome:h,ie3d:v,webkit3d:y,gecko3d:P,opera3d:L,any3d:x,mobile:p,mobileWebkit:p&&r,mobileWebkit3d:p&&y,mobileOpera:p&&t.opera,touch:w,msPointer:_,pointer:m,retina:f}}(),o.Point=function(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,n){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===i||null===t?t:new o.Point(t,e,n)},o.Bounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.Bounds.prototype={extend:function(t){return t=o.point(t),this.min||this.max?(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(t.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(t.y,this.max.y)):(this.min=t.clone(),this.max=t.clone()),this},getCenter:function(t){return new o.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return new o.Point(this.min.x,this.max.y)},getTopRight:function(){return new o.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return t="number"==typeof t[0]||t instanceof o.Point?o.point(t):o.bounds(t),t instanceof o.Bounds?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=o.bounds(t);var e=this.min,i=this.max,n=t.min,s=t.max,a=s.x>=e.x&&n.x<=i.x,r=s.y>=e.y&&n.y<=i.y;return a&&r},isValid:function(){return!(!this.min||!this.max)}},o.bounds=function(t,e){return!t||t instanceof o.Bounds?t:new o.Bounds(t,e)},o.Transformation=function(t,e,i,n){this._a=t,this._b=e,this._c=i,this._d=n},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,i){var n=t.style[i];if(!n&&t.currentStyle&&(n=t.currentStyle[i]),(!n||"auto"===n)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);n=o?o[i]:null}return"auto"===n?null:n},getViewportOffset:function(t){var i,n=0,s=0,a=t,r=e.body,h=e.documentElement;do{if(n+=a.offsetTop||0,s+=a.offsetLeft||0,n+=parseInt(o.DomUtil.getStyle(a,"borderTopWidth"),10)||0,s+=parseInt(o.DomUtil.getStyle(a,"borderLeftWidth"),10)||0,i=o.DomUtil.getStyle(a,"position"),a.offsetParent===r&&"absolute"===i)break;if("fixed"===i){n+=r.scrollTop||h.scrollTop||0,s+=r.scrollLeft||h.scrollLeft||0;break}if("relative"===i&&!a.offsetLeft){var l=o.DomUtil.getStyle(a,"width"),u=o.DomUtil.getStyle(a,"max-width"),c=a.getBoundingClientRect();("none"!==l||"none"!==u)&&(s+=c.left+a.clientLeft),n+=c.top+(r.scrollTop||h.scrollTop||0);break}a=a.offsetParent}while(a);a=t;do{if(a===r)break;n-=a.scrollTop||0,s-=a.scrollLeft||0,a=a.parentNode}while(a);return new o.Point(s,n)},documentIsLtr:function(){return o.DomUtil._docIsLtrCached||(o.DomUtil._docIsLtrCached=!0,o.DomUtil._docIsLtr="ltr"===o.DomUtil.getStyle(e.body,"direction")),o.DomUtil._docIsLtr},create:function(t,i,n){var o=e.createElement(t);return o.className=i,n&&n.appendChild(o),o},hasClass:function(t,e){if(t.classList!==i)return t.classList.contains(e);var n=o.DomUtil._getClass(t);return n.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(n)},addClass:function(t,e){if(t.classList!==i)for(var n=o.Util.splitWords(e),s=0,a=n.length;a>s;s++)t.classList.add(n[s]);else if(!o.DomUtil.hasClass(t,e)){var r=o.DomUtil._getClass(t);o.DomUtil._setClass(t,(r?r+" ":"")+e)}},removeClass:function(t,e){t.classList!==i?t.classList.remove(e):o.DomUtil._setClass(t,o.Util.trim((" "+o.DomUtil._getClass(t)+" ").replace(" "+e+" "," ")))},_setClass:function(t,e){t.className.baseVal===i?t.className=e:t.className.baseVal=e},_getClass:function(t){return t.className.baseVal===i?t.className:t.className.baseVal},setOpacity:function(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch(o){if(1===e)return}e=Math.round(100*e),i?(i.Enabled=100!==e,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"}},testProp:function(t){for(var i=e.documentElement.style,n=0;n<t.length;n++)if(t[n]in i)return t[n];return!1},getTranslateString:function(t){var e=o.Browser.webkit3d,i="translate"+(e?"3d":"")+"(",n=(e?",0":"")+")";return i+t.x+"px,"+t.y+"px"+n},getScaleString:function(t,e){var i=o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1*t))),n=" scale("+t+") ";return i+n},setPosition:function(t,e,i){t._leaflet_pos=e,!i&&o.Browser.any3d?t.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(e):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]),o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),o.DomUtil.TRANSITION_END="webkitTransition"===o.DomUtil.TRANSITION||"OTransition"===o.DomUtil.TRANSITION?o.DomUtil.TRANSITION+"End":"transitionend",function(){if("onselectstart"in e)o.extend(o.DomUtil,{disableTextSelection:function(){o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault)},enableTextSelection:function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault)}});else{var i=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.extend(o.DomUtil,{disableTextSelection:function(){if(i){var t=e.documentElement.style;this._userSelect=t[i],t[i]="none"}},enableTextSelection:function(){i&&(e.documentElement.style[i]=this._userSelect,delete this._userSelect)}})}o.extend(o.DomUtil,{disableImageDrag:function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},enableImageDrag:function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)}})}(),o.LatLng=function(t,e,n){if(t=parseFloat(t),e=parseFloat(e),isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=t,this.lng=e,n!==i&&(this.alt=parseFloat(n))},o.extend(o.LatLng,{DEG_TO_RAD:Math.PI/180,RAD_TO_DEG:180/Math.PI,MAX_MARGIN:1e-9}),o.LatLng.prototype={equals:function(t){if(!t)return!1;t=o.latLng(t);var e=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return e<=o.LatLng.MAX_MARGIN},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){t=o.latLng(t);var e=6378137,i=o.LatLng.DEG_TO_RAD,n=(t.lat-this.lat)*i,s=(t.lng-this.lng)*i,a=this.lat*i,r=t.lat*i,h=Math.sin(n/2),l=Math.sin(s/2),u=h*h+l*l*Math.cos(a)*Math.cos(r);return 2*e*Math.atan2(Math.sqrt(u),Math.sqrt(1-u))},wrap:function(t,e){var i=this.lng;return t=t||-180,e=e||180,i=(i+e)%(e-t)+(t>i||i===e?e:t),new o.LatLng(this.lat,i)}},o.latLng=function(t,e){return t instanceof o.LatLng?t:o.Util.isArray(t)?"number"==typeof t[0]||"string"==typeof t[0]?new o.LatLng(t[0],t[1],t[2]):null:t===i||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon):e===i?null:new o.LatLng(t,e)},o.LatLngBounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.LatLngBounds.prototype={extend:function(t){if(!t)return this;var e=o.latLng(t);return t=null!==e?e:o.latLngBounds(t),t instanceof o.LatLng?this._southWest||this._northEast?(this._southWest.lat=Math.min(t.lat,this._southWest.lat),this._southWest.lng=Math.min(t.lng,this._southWest.lng),this._northEast.lat=Math.max(t.lat,this._northEast.lat),this._northEast.lng=Math.max(t.lng,this._northEast.lng)):(this._southWest=new o.LatLng(t.lat,t.lng),this._northEast=new o.LatLng(t.lat,t.lng)):t instanceof o.LatLngBounds&&(this.extend(t._southWest),this.extend(t._northEast)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,s=Math.abs(e.lng-i.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-n,e.lng-s),new o.LatLng(i.lat+n,i.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,i,n=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),i=t.getNorthEast()):e=i=t,e.lat>=n.lat&&i.lat<=s.lat&&e.lng>=n.lng&&i.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),a=s.lat>=e.lat&&n.lat<=i.lat,r=s.lng>=e.lng&&n.lng<=i.lng;return a&&r},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.SphericalMercator={MAX_LATITUDE:85.0511287798,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=t.lng*e,a=n*e;return a=Math.log(Math.tan(Math.PI/4+a/2)),new o.Point(s,a)},unproject:function(t){var e=o.LatLng.RAD_TO_DEG,i=t.x*e,n=(2*Math.atan(Math.exp(t.y))-Math.PI/2)*e;return new o.LatLng(n,i)}},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)}},o.CRS={latLngToPoint:function(t,e){var i=this.projection.project(t),n=this.scale(e);return this.transformation._transform(i,n)},pointToLatLng:function(t,e){var i=this.scale(e),n=this.transformation.untransform(t,i);return this.projection.unproject(n)},project:function(t){return this.projection.project(t)},scale:function(t){return 256*Math.pow(2,t)},getSize:function(t){var e=this.scale(t);return o.point(e,e)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)}}),o.CRS.EPSG3857=o.extend({},o.CRS,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:new o.Transformation(.5/Math.PI,.5,-.5/Math.PI,.5),project:function(t){var e=this.projection.project(t),i=6378137;return e.multiplyBy(i)}}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/360,.5,-1/360,.5)}),o.Map=o.Class.extend({includes:o.Mixin.Events,options:{crs:o.CRS.EPSG3857,fadeAnimation:o.DomUtil.TRANSITION&&!o.Browser.android23,trackResize:!0,markerZoomAnimation:o.DomUtil.TRANSITION&&o.Browser.any3d},initialize:function(t,e){e=o.setOptions(this,e),this._initContainer(t),this._initLayout(),this._onResize=o.bind(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.center&&e.zoom!==i&&this.setView(o.latLng(e.center),e.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._tileLayersNum=0,this.callInitHooks(),this._addLayers(e.layers)},setView:function(t,e){return e=e===i?this.getZoom():e,this._resetView(o.latLng(t),this._limitZoom(e)),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=this._limitZoom(t),this)},zoomIn:function(t,e){return this.setZoom(this._zoom+(t||1),e)},zoomOut:function(t,e){return this.setZoom(this._zoom-(t||1),e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),s=this.getSize().divideBy(2),a=t instanceof o.Point?t:this.latLngToContainerPoint(t),r=a.subtract(s).multiplyBy(1-1/n),h=this.containerPointToLatLng(s.add(r));return this.setView(h,e,{zoom:i})},fitBounds:function(t,e){e=e||{},t=t.getBounds?t.getBounds():o.latLngBounds(t);var i=o.point(e.paddingTopLeft||e.padding||[0,0]),n=o.point(e.paddingBottomRight||e.padding||[0,0]),s=this.getBoundsZoom(t,!1,i.add(n)),a=n.subtract(i).divideBy(2),r=this.project(t.getSouthWest(),s),h=this.project(t.getNorthEast(),s),l=this.unproject(r.add(h).divideBy(2).add(a),s);return s=e&&e.maxZoom?Math.min(e.maxZoom,s):s,this.setView(l,s,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t){return this.fire("movestart"),this._rawPanBy(o.point(t)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(t){return t=o.latLngBounds(t),this.options.maxBounds=t,t?(this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds,this)):this.off("moveend",this._panInsideMaxBounds,this)},panInsideBounds:function(t,e){var i=this.getCenter(),n=this._limitCenter(i,this._zoom,t);return i.equals(n)?this:this.panTo(n,e)},addLayer:function(t){var e=o.stamp(t);return this._layers[e]?this:(this._layers[e]=t,!t.options||isNaN(t.options.maxZoom)&&isNaN(t.options.minZoom)||(this._zoomBoundLayers[e]=t,this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum++,this._tileLayersToLoad++,t.on("load",this._onTileLayerLoad,this)),this._loaded&&this._layerAdd(t),this)},removeLayer:function(t){var e=o.stamp(t);return this._layers[e]?(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&this.fire("layerremove",{layer:t}),this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels()),this.options.zoomAnimation&&o.TileLayer&&t instanceof o.TileLayer&&(this._tileLayersNum--,this._tileLayersToLoad--,t.off("load",this._onTileLayerLoad,this)),this):this},hasLayer:function(t){return t?o.stamp(t)in this._layers:!1},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},invalidateSize:function(t){if(!this._loaded)return this;t=o.extend({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var i=this.getSize(),n=e.divideBy(2).round(),s=i.divideBy(2).round(),a=n.subtract(s);return a.x||a.y?(t.animate&&t.pan?this.panBy(a):(t.pan&&this._rawPanBy(a),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(o.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i})):this},addHandler:function(t,e){if(!e)return this;var i=this[t]=new e(this);return this._handlers.push(i),this.options[t]&&i.enable(),this},remove:function(){this._loaded&&this.fire("unload"),this._initEvents("off");try{delete this._container._leaflet}catch(t){this._container._leaflet=i}return this._clearPanes(),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),i=this.unproject(t.getTopRight());return new o.LatLngBounds(e,i)},getMinZoom:function(){return this.options.minZoom===i?this._layersMinZoom===i?0:this._layersMinZoom:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===i?this._layersMaxZoom===i?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=o.latLngBounds(t);var n,s=this.getMinZoom()-(e?1:0),a=this.getMaxZoom(),r=this.getSize(),h=t.getNorthWest(),l=t.getSouthEast(),u=!0;i=o.point(i||[0,0]);do s++,n=this.project(l,s).subtract(this.project(h,s)).add(i),u=e?n.x<r.x||n.y<r.y:r.contains(n);while(u&&a>=s);return u&&e?null:e?s:s-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new o.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(){var t=this._getTopLeftPoint();return new o.Bounds(t,t.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._initialTopLeftPoint},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t){var e=this.options.crs;return e.scale(t)/e.scale(this._zoom)},getScaleZoom:function(t){return this._zoom+Math.log(t)/Math.LN2},project:function(t,e){return e=e===i?this._zoom:e,this.options.crs.latLngToPoint(o.latLng(t),e)},unproject:function(t,e){return e=e===i?this._zoom:e,this.options.crs.pointToLatLng(o.point(t),e)},layerPointToLatLng:function(t){var e=o.point(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(o.latLng(t))._round();return e._subtract(this.getPixelOrigin())},containerPointToLayerPoint:function(t){return o.point(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return o.point(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(o.point(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(o.latLng(t)))},mouseEventToContainerPoint:function(t){return o.DomEvent.getMousePosition(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._leaflet)throw new Error("Map container is already initialized.");e._leaflet=!0},_initLayout:function(){var t=this._container;o.DomUtil.addClass(t,"leaflet-container"+(o.Browser.touch?" leaflet-touch":"")+(o.Browser.retina?" leaflet-retina":"")+(o.Browser.ielt9?" leaflet-oldie":"")+(this.options.fadeAnimation?" leaflet-fade-anim":""));var e=o.DomUtil.getStyle(t,"position");"absolute"!==e&&"relative"!==e&&"fixed"!==e&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._mapPane=t.mapPane=this._createPane("leaflet-map-pane",this._container),this._tilePane=t.tilePane=this._createPane("leaflet-tile-pane",this._mapPane),t.objectsPane=this._createPane("leaflet-objects-pane",this._mapPane),t.shadowPane=this._createPane("leaflet-shadow-pane"),t.overlayPane=this._createPane("leaflet-overlay-pane"),t.markerPane=this._createPane("leaflet-marker-pane"),t.popupPane=this._createPane("leaflet-popup-pane");var e=" leaflet-zoom-hide";this.options.markerZoomAnimation||(o.DomUtil.addClass(t.markerPane,e),o.DomUtil.addClass(t.shadowPane,e),o.DomUtil.addClass(t.popupPane,e))},_createPane:function(t,e){return o.DomUtil.create("div",t,e||this._panes.objectsPane)},_clearPanes:function(){this._container.removeChild(this._mapPane)},_addLayers:function(t){t=t?o.Util.isArray(t)?t:[t]:[];for(var e=0,i=t.length;i>e;e++)this.addLayer(t[e])},_resetView:function(t,e,i,n){var s=this._zoom!==e;n||(this.fire("movestart"),s&&this.fire("zoomstart")),this._zoom=e,this._initialCenter=t,this._initialTopLeftPoint=this._getNewTopLeftPoint(t),i?this._initialTopLeftPoint._add(this._getMapPanePos()):o.DomUtil.setPosition(this._mapPane,new o.Point(0,0)),this._tileLayersToLoad=this._tileLayersNum;var a=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!i}),a&&(this.fire("load"),this.eachLayer(this._layerAdd,this)),this.fire("move"),(s||n)&&this.fire("zoomend"),this.fire("moveend",{hard:!i})},_rawPanBy:function(t){o.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_updateZoomLevels:function(){var t,e=1/0,n=-1/0,o=this._getZoomSpan();for(t in this._zoomBoundLayers){var s=this._zoomBoundLayers[t];isNaN(s.options.minZoom)||(e=Math.min(e,s.options.minZoom)),isNaN(s.options.maxZoom)||(n=Math.max(n,s.options.maxZoom))}t===i?this._layersMaxZoom=this._layersMinZoom=i:(this._layersMaxZoom=n,this._layersMinZoom=e),o!==this._getZoomSpan()&&this.fire("zoomlevelschange")},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){if(o.DomEvent){e=e||"on",o.DomEvent[e](this._container,"click",this._onMouseClick,this);var i,n,s=["dblclick","mousedown","mouseup","mouseenter","mouseleave","mousemove","contextmenu"];for(i=0,n=s.length;n>i;i++)o.DomEvent[e](this._container,s[i],this._fireMouseEvent,this);this.options.trackResize&&o.DomEvent[e](t,"resize",this._onResize,this)}},_onResize:function(){o.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=o.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onMouseClick:function(t){!this._loaded||!t._simulated&&(this.dragging&&this.dragging.moved()||this.boxZoom&&this.boxZoom.moved())||o.DomEvent._skipped(t)||(this.fire("preclick"),this._fireMouseEvent(t))},_fireMouseEvent:function(t){if(this._loaded&&!o.DomEvent._skipped(t)){var e=t.type;if(e="mouseenter"===e?"mouseover":"mouseleave"===e?"mouseout":e,this.hasEventListeners(e)){"contextmenu"===e&&o.DomEvent.preventDefault(t);var i=this.mouseEventToContainerPoint(t),n=this.containerPointToLayerPoint(i),s=this.layerPointToLatLng(n);this.fire(e,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t})}}},_onTileLayerLoad:function(){this._tileLayersToLoad--,this._tileLayersNum&&!this._tileLayersToLoad&&this.fire("tilelayersload")},_clearHandlers:function(){for(var t=0,e=this._handlers.length;e>t;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,this):this.on("load",t,e),this},_layerAdd:function(t){t.onAdd(this),this.fire("layeradd",{layer:t})},_getMapPanePos:function(){return o.DomUtil.getPosition(this._mapPane)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(){return this.getPixelOrigin().subtract(this._getMapPanePos())},_getNewTopLeftPoint:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._round()},_latLngToNewLayerPoint:function(t,e,i){var n=this._getNewTopLeftPoint(i,e).add(this._getMapPanePos());return this.project(t,e)._subtract(n)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){if(!i)return t;var n=this.project(t,e),s=this.getSize().divideBy(2),a=new o.Bounds(n.subtract(s),n.add(s)),r=this._getBoundsOffset(a,i,e);return this.unproject(n.add(r),e)},_limitOffset:function(t,e){if(!e)return t;var i=this.getPixelBounds(),n=new o.Bounds(i.min.add(t),i.max.add(t));return t.add(this._getBoundsOffset(n,e))},_getBoundsOffset:function(t,e,i){var n=this.project(e.getNorthWest(),i).subtract(t.min),s=this.project(e.getSouthEast(),i).subtract(t.max),a=this._rebound(n.x,-s.x),r=this._rebound(n.y,-s.y);return new o.Point(a,r)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom();return Math.max(e,Math.min(i,t))}}),o.map=function(t,e){return new o.Map(t,e)},o.Projection.Mercator={MAX_LATITUDE:85.0840591556,R_MINOR:6356752.314245179,R_MAJOR:6378137,project:function(t){var e=o.LatLng.DEG_TO_RAD,i=this.MAX_LATITUDE,n=Math.max(Math.min(i,t.lat),-i),s=this.R_MAJOR,a=this.R_MINOR,r=t.lng*e*s,h=n*e,l=a/s,u=Math.sqrt(1-l*l),c=u*Math.sin(h);c=Math.pow((1-c)/(1+c),.5*u);var d=Math.tan(.5*(.5*Math.PI-h))/c;return h=-s*Math.log(d),new o.Point(r,h)},unproject:function(t){for(var e,i=o.LatLng.RAD_TO_DEG,n=this.R_MAJOR,s=this.R_MINOR,a=t.x*i/n,r=s/n,h=Math.sqrt(1-r*r),l=Math.exp(-t.y/n),u=Math.PI/2-2*Math.atan(l),c=15,d=1e-7,p=c,_=.1;Math.abs(_)>d&&--p>0;)e=h*Math.sin(u),_=Math.PI/2-2*Math.atan(l*Math.pow((1-e)/(1+e),.5*h))-u,u+=_;
return new o.LatLng(u*i,a)}},o.CRS.EPSG3395=o.extend({},o.CRS,{code:"EPSG:3395",projection:o.Projection.Mercator,transformation:function(){var t=o.Projection.Mercator,e=t.R_MAJOR,i=.5/(Math.PI*e);return new o.Transformation(i,.5,-i,.5)}()}),o.TileLayer=o.Class.extend({includes:o.Mixin.Events,options:{minZoom:0,maxZoom:18,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:o.Browser.mobile,updateWhenIdle:o.Browser.mobile},initialize:function(t,e){e=o.setOptions(this,e),e.detectRetina&&o.Browser.retina&&e.maxZoom>0&&(e.tileSize=Math.floor(e.tileSize/2),e.zoomOffset++,e.minZoom>0&&e.minZoom--,this.options.maxZoom--),e.bounds&&(e.bounds=o.latLngBounds(e.bounds)),this._url=t;var i=this.options.subdomains;"string"==typeof i&&(this.options.subdomains=i.split(""))},onAdd:function(t){this._map=t,this._animated=t._zoomAnimated,this._initContainer(),t.on({viewreset:this._reset,moveend:this._update},this),this._animated&&t.on({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||(this._limitedUpdate=o.Util.limitExecByInterval(this._update,150,this),t.on("move",this._limitedUpdate,this)),this._reset(),this._update()},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this._container.parentNode.removeChild(this._container),t.off({viewreset:this._reset,moveend:this._update},this),this._animated&&t.off({zoomanim:this._animateZoom,zoomend:this._endZoomAnim},this),this.options.updateWhenIdle||t.off("move",this._limitedUpdate,this),this._container=null,this._map=null},bringToFront:function(){var t=this._map._panes.tilePane;return this._container&&(t.appendChild(this._container),this._setAutoZIndex(t,Math.max)),this},bringToBack:function(){var t=this._map._panes.tilePane;return this._container&&(t.insertBefore(this._container,t.firstChild),this._setAutoZIndex(t,Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},setUrl:function(t,e){return this._url=t,e||this.redraw(),this},redraw:function(){return this._map&&(this._reset({hard:!0}),this._update()),this},_updateZIndex:function(){this._container&&this.options.zIndex!==i&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t,e){var i,n,o,s=t.children,a=-e(1/0,-1/0);for(n=0,o=s.length;o>n;n++)s[n]!==this._container&&(i=parseInt(s[n].style.zIndex,10),isNaN(i)||(a=e(a,i)));this.options.zIndex=this._container.style.zIndex=(isFinite(a)?a:0)+e(1,-1)},_updateOpacity:function(){var t,e=this._tiles;if(o.Browser.ielt9)for(t in e)o.DomUtil.setOpacity(e[t],this.options.opacity);else o.DomUtil.setOpacity(this._container,this.options.opacity)},_initContainer:function(){var t=this._map._panes.tilePane;if(!this._container){if(this._container=o.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this._animated){var e="leaflet-tile-container";this._bgBuffer=o.DomUtil.create("div",e,this._container),this._tileContainer=o.DomUtil.create("div",e,this._container)}else this._tileContainer=this._container;t.appendChild(this._container),this.options.opacity<1&&this._updateOpacity()}},_reset:function(t){for(var e in this._tiles)this.fire("tileunload",{tile:this._tiles[e]});this._tiles={},this._tilesToLoad=0,this.options.reuseTiles&&(this._unusedTiles=[]),this._tileContainer.innerHTML="",this._animated&&t&&t.hard&&this._clearBgBuffer(),this._initContainer()},_getTileSize:function(){var t=this._map,e=t.getZoom()+this.options.zoomOffset,i=this.options.maxNativeZoom,n=this.options.tileSize;return i&&e>i&&(n=Math.round(t.getZoomScale(e)/t.getZoomScale(i)*n)),n},_update:function(){if(this._map){var t=this._map,e=t.getPixelBounds(),i=t.getZoom(),n=this._getTileSize();if(!(i>this.options.maxZoom||i<this.options.minZoom)){var s=o.bounds(e.min.divideBy(n)._floor(),e.max.divideBy(n)._floor());this._addTilesFromCenterOut(s),(this.options.unloadInvisibleTiles||this.options.reuseTiles)&&this._removeOtherTiles(s)}}},_addTilesFromCenterOut:function(t){var i,n,s,a=[],r=t.getCenter();for(i=t.min.y;i<=t.max.y;i++)for(n=t.min.x;n<=t.max.x;n++)s=new o.Point(n,i),this._tileShouldBeLoaded(s)&&a.push(s);var h=a.length;if(0!==h){a.sort(function(t,e){return t.distanceTo(r)-e.distanceTo(r)});var l=e.createDocumentFragment();for(this._tilesToLoad||this.fire("loading"),this._tilesToLoad+=h,n=0;h>n;n++)this._addTile(a[n],l);this._tileContainer.appendChild(l)}},_tileShouldBeLoaded:function(t){if(t.x+":"+t.y in this._tiles)return!1;var e=this.options;if(!e.continuousWorld){var i=this._getWrapTileNum();if(e.noWrap&&(t.x<0||t.x>=i.x)||t.y<0||t.y>=i.y)return!1}if(e.bounds){var n=e.tileSize,o=t.multiplyBy(n),s=o.add([n,n]),a=this._map.unproject(o),r=this._map.unproject(s);if(e.continuousWorld||e.noWrap||(a=a.wrap(),r=r.wrap()),!e.bounds.intersects([a,r]))return!1}return!0},_removeOtherTiles:function(t){var e,i,n,o;for(o in this._tiles)e=o.split(":"),i=parseInt(e[0],10),n=parseInt(e[1],10),(i<t.min.x||i>t.max.x||n<t.min.y||n>t.max.y)&&this._removeTile(o)},_removeTile:function(t){var e=this._tiles[t];this.fire("tileunload",{tile:e,url:e.src}),this.options.reuseTiles?(o.DomUtil.removeClass(e,"leaflet-tile-loaded"),this._unusedTiles.push(e)):e.parentNode===this._tileContainer&&this._tileContainer.removeChild(e),o.Browser.android||(e.onload=null,e.src=o.Util.emptyImageUrl),delete this._tiles[t]},_addTile:function(t,e){var i=this._getTilePos(t),n=this._getTile();o.DomUtil.setPosition(n,i,o.Browser.chrome),this._tiles[t.x+":"+t.y]=n,this._loadTile(n,t),n.parentNode!==this._tileContainer&&e.appendChild(n)},_getZoomForUrl:function(){var t=this.options,e=this._map.getZoom();return t.zoomReverse&&(e=t.maxZoom-e),e+=t.zoomOffset,t.maxNativeZoom?Math.min(e,t.maxNativeZoom):e},_getTilePos:function(t){var e=this._map.getPixelOrigin(),i=this._getTileSize();return t.multiplyBy(i).subtract(e)},getTileUrl:function(t){return o.Util.template(this._url,o.extend({s:this._getSubdomain(t),z:t.z,x:t.x,y:t.y},this.options))},_getWrapTileNum:function(){var t=this._map.options.crs,e=t.getSize(this._map.getZoom());return e.divideBy(this._getTileSize())._floor()},_adjustTilePoint:function(t){var e=this._getWrapTileNum();this.options.continuousWorld||this.options.noWrap||(t.x=(t.x%e.x+e.x)%e.x),this.options.tms&&(t.y=e.y-t.y-1),t.z=this._getZoomForUrl()},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_getTile:function(){if(this.options.reuseTiles&&this._unusedTiles.length>0){var t=this._unusedTiles.pop();return this._resetTile(t),t}return this._createTile()},_resetTile:function(){},_createTile:function(){var t=o.DomUtil.create("img","leaflet-tile");return t.style.width=t.style.height=this._getTileSize()+"px",t.galleryimg="no",t.onselectstart=t.onmousemove=o.Util.falseFn,o.Browser.ielt9&&this.options.opacity!==i&&o.DomUtil.setOpacity(t,this.options.opacity),o.Browser.mobileWebkit3d&&(t.style.WebkitBackfaceVisibility="hidden"),t},_loadTile:function(t,e){t._layer=this,t.onload=this._tileOnLoad,t.onerror=this._tileOnError,this._adjustTilePoint(e),t.src=this.getTileUrl(e),this.fire("tileloadstart",{tile:t,url:t.src})},_tileLoaded:function(){this._tilesToLoad--,this._animated&&o.DomUtil.addClass(this._tileContainer,"leaflet-zoom-animated"),this._tilesToLoad||(this.fire("load"),this._animated&&(clearTimeout(this._clearBgBufferTimer),this._clearBgBufferTimer=setTimeout(o.bind(this._clearBgBuffer,this),500)))},_tileOnLoad:function(){var t=this._layer;this.src!==o.Util.emptyImageUrl&&(o.DomUtil.addClass(this,"leaflet-tile-loaded"),t.fire("tileload",{tile:this,url:this.src})),t._tileLoaded()},_tileOnError:function(){var t=this._layer;t.fire("tileerror",{tile:this,url:this.src});var e=t.options.errorTileUrl;e&&(this.src=e),t._tileLoaded()}}),o.tileLayer=function(t,e){return new o.TileLayer(t,e)},o.TileLayer.WMS=o.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},initialize:function(t,e){this._url=t;var i=o.extend({},this.defaultWmsParams),n=e.tileSize||this.options.tileSize;i.width=i.height=e.detectRetina&&o.Browser.retina?2*n:n;for(var s in e)this.options.hasOwnProperty(s)||"crs"===s||(i[s]=e[s]);this.wmsParams=i,o.setOptions(this,e)},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,o.TileLayer.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._map,i=this.options.tileSize,n=t.multiplyBy(i),s=n.add([i,i]),a=this._crs.project(e.unproject(n,t.z)),r=this._crs.project(e.unproject(s,t.z)),h=this._wmsVersion>=1.3&&this._crs===o.CRS.EPSG4326?[r.y,a.x,a.y,r.x].join(","):[a.x,r.y,r.x,a.y].join(","),l=o.Util.template(this._url,{s:this._getSubdomain(t)});return l+o.Util.getParamString(this.wmsParams,l,!0)+"&BBOX="+h},setParams:function(t,e){return o.extend(this.wmsParams,t),e||this.redraw(),this}}),o.tileLayer.wms=function(t,e){return new o.TileLayer.WMS(t,e)},o.TileLayer.Canvas=o.TileLayer.extend({options:{async:!1},initialize:function(t){o.setOptions(this,t)},redraw:function(){this._map&&(this._reset({hard:!0}),this._update());for(var t in this._tiles)this._redrawTile(this._tiles[t]);return this},_redrawTile:function(t){this.drawTile(t,t._tilePoint,this._map._zoom)},_createTile:function(){var t=o.DomUtil.create("canvas","leaflet-tile");return t.width=t.height=this.options.tileSize,t.onselectstart=t.onmousemove=o.Util.falseFn,t},_loadTile:function(t,e){t._layer=this,t._tilePoint=e,this._redrawTile(t),this.options.async||this.tileDrawn(t)},drawTile:function(){},tileDrawn:function(t){this._tileOnLoad.call(t)}}),o.tileLayer.canvas=function(t){return new o.TileLayer.Canvas(t)},o.ImageOverlay=o.Class.extend({includes:o.Mixin.Events,options:{opacity:1},initialize:function(t,e,i){this._url=t,this._bounds=o.latLngBounds(e),o.setOptions(this,i)},onAdd:function(t){this._map=t,this._image||this._initImage(),t._panes.overlayPane.appendChild(this._image),t.on("viewreset",this._reset,this),t.options.zoomAnimation&&o.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._image),t.off("viewreset",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},bringToFront:function(){return this._image&&this._map._panes.overlayPane.appendChild(this._image),this},bringToBack:function(){var t=this._map._panes.overlayPane;return this._image&&t.insertBefore(this._image,t.firstChild),this},setUrl:function(t){this._url=t,this._image.src=this._url},getAttribution:function(){return this.options.attribution},_initImage:function(){this._image=o.DomUtil.create("img","leaflet-image-layer"),this._map.options.zoomAnimation&&o.Browser.any3d?o.DomUtil.addClass(this._image,"leaflet-zoom-animated"):o.DomUtil.addClass(this._image,"leaflet-zoom-hide"),this._updateOpacity(),o.extend(this._image,{galleryimg:"no",onselectstart:o.Util.falseFn,onmousemove:o.Util.falseFn,onload:o.bind(this._onImageLoad,this),src:this._url})},_animateZoom:function(t){var e=this._map,i=this._image,n=e.getZoomScale(t.zoom),s=this._bounds.getNorthWest(),a=this._bounds.getSouthEast(),r=e._latLngToNewLayerPoint(s,t.zoom,t.center),h=e._latLngToNewLayerPoint(a,t.zoom,t.center)._subtract(r),l=r._add(h._multiplyBy(.5*(1-1/n)));i.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(l)+" scale("+n+") "},_reset:function(){var t=this._image,e=this._map.latLngToLayerPoint(this._bounds.getNorthWest()),i=this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(e);o.DomUtil.setPosition(t,e),t.style.width=i.x+"px",t.style.height=i.y+"px"},_onImageLoad:function(){this.fire("load")},_updateOpacity:function(){o.DomUtil.setOpacity(this._image,this.options.opacity)}}),o.imageOverlay=function(t,e,i){return new o.ImageOverlay(t,e,i)},o.Icon=o.Class.extend({options:{className:""},initialize:function(t){o.setOptions(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(!i){if("icon"===t)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n;return n=e&&"IMG"===e.tagName?this._createImg(i,e):this._createImg(i),this._setIconStyles(n,t),n},_setIconStyles:function(t,e){var i,n=this.options,s=o.point(n[e+"Size"]);i=o.point("shadow"===e?n.shadowAnchor||n.iconAnchor:n.iconAnchor),!i&&s&&(i=s.divideBy(2,!0)),t.className="leaflet-marker-"+e+" "+n.className,i&&(t.style.marginLeft=-i.x+"px",t.style.marginTop=-i.y+"px"),s&&(t.style.width=s.x+"px",t.style.height=s.y+"px")},_createImg:function(t,i){return i=i||e.createElement("img"),i.src=t,i},_getIconUrl:function(t){return o.Browser.retina&&this.options[t+"RetinaUrl"]?this.options[t+"RetinaUrl"]:this.options[t+"Url"]}}),o.icon=function(t){return new o.Icon(t)},o.Icon.Default=o.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(t){var e=t+"Url";if(this.options[e])return this.options[e];o.Browser.retina&&"icon"===t&&(t+="-2x");var i=o.Icon.Default.imagePath;if(!i)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return i+"/marker-"+t+".png"}}),o.Icon.Default.imagePath=function(){var t,i,n,o,s,a=e.getElementsByTagName("script"),r=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,i=a.length;i>t;t++)if(n=a[t].src,o=n.match(r))return s=n.split(r)[0],(s?s+"/":"")+"images"}(),o.Marker=o.Class.extend({includes:o.Mixin.Events,options:{icon:new o.Icon.Default,title:"",alt:"",clickable:!0,draggable:!1,keyboard:!0,zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250},initialize:function(t,e){o.setOptions(this,e),this._latlng=o.latLng(t)},onAdd:function(t){this._map=t,t.on("viewreset",this.update,this),this._initIcon(),this.update(),this.fire("add"),t.options.zoomAnimation&&t.options.markerZoomAnimation&&t.on("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){this.dragging&&this.dragging.disable(),this._removeIcon(),this._removeShadow(),this.fire("remove"),t.off({viewreset:this.update,zoomanim:this._animateZoom},this),this._map=null},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this.update(),this.fire("move",{latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update(),this},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup),this},update:function(){if(this._icon){var t=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t)}return this},_initIcon:function(){var t=this.options,e=this._map,i=e.options.zoomAnimation&&e.options.markerZoomAnimation,n=i?"leaflet-zoom-animated":"leaflet-zoom-hide",s=t.icon.createIcon(this._icon),a=!1;s!==this._icon&&(this._icon&&this._removeIcon(),a=!0,t.title&&(s.title=t.title),t.alt&&(s.alt=t.alt)),o.DomUtil.addClass(s,n),t.keyboard&&(s.tabIndex="0"),this._icon=s,this._initInteraction(),t.riseOnHover&&o.DomEvent.on(s,"mouseover",this._bringToFront,this).on(s,"mouseout",this._resetZIndex,this);var r=t.icon.createShadow(this._shadow),h=!1;r!==this._shadow&&(this._removeShadow(),h=!0),r&&o.DomUtil.addClass(r,n),this._shadow=r,t.opacity<1&&this._updateOpacity();var l=this._map._panes;a&&l.markerPane.appendChild(this._icon),r&&h&&l.shadowPane.appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&o.DomEvent.off(this._icon,"mouseover",this._bringToFront).off(this._icon,"mouseout",this._resetZIndex),this._map._panes.markerPane.removeChild(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&this._map._panes.shadowPane.removeChild(this._shadow),this._shadow=null},_setPos:function(t){o.DomUtil.setPosition(this._icon,t),this._shadow&&o.DomUtil.setPosition(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon.style.zIndex=this._zIndex+t},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.clickable){var t=this._icon,e=["dblclick","mousedown","mouseover","mouseout","contextmenu"];o.DomUtil.addClass(t,"leaflet-clickable"),o.DomEvent.on(t,"click",this._onMouseClick,this),o.DomEvent.on(t,"keypress",this._onKeyPress,this);for(var i=0;i<e.length;i++)o.DomEvent.on(t,e[i],this._fireMouseEvent,this);o.Handler.MarkerDrag&&(this.dragging=new o.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_onMouseClick:function(t){var e=this.dragging&&this.dragging.moved();(this.hasEventListeners(t.type)||e)&&o.DomEvent.stopPropagation(t),e||(this.dragging&&this.dragging._enabled||!this._map.dragging||!this._map.dragging.moved())&&this.fire(t.type,{originalEvent:t,latlng:this._latlng})},_onKeyPress:function(t){13===t.keyCode&&this.fire("click",{originalEvent:t,latlng:this._latlng})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t,latlng:this._latlng}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&o.DomEvent.preventDefault(t),"mousedown"!==t.type?o.DomEvent.stopPropagation(t):o.DomEvent.preventDefault(t)},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){o.DomUtil.setOpacity(this._icon,this.options.opacity),this._shadow&&o.DomUtil.setOpacity(this._shadow,this.options.opacity)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),o.marker=function(t,e){return new o.Marker(t,e)},o.DivIcon=o.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(t){var i=t&&"DIV"===t.tagName?t:e.createElement("div"),n=this.options;return i.innerHTML=n.html!==!1?n.html:"",n.bgPos&&(i.style.backgroundPosition=-n.bgPos.x+"px "+-n.bgPos.y+"px"),this._setIconStyles(i,"icon"),i},createShadow:function(){return null}}),o.divIcon=function(t){return new o.DivIcon(t)},o.Map.mergeOptions({closePopupOnClick:!0}),o.Popup=o.Class.extend({includes:o.Mixin.Events,options:{minWidth:50,maxWidth:300,autoPan:!0,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],keepInView:!1,className:"",zoomAnimation:!0},initialize:function(t,e){o.setOptions(this,t),this._source=e,this._animated=o.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._container||this._initLayout();var e=t.options.fadeAnimation;e&&o.DomUtil.setOpacity(this._container,0),t._panes.popupPane.appendChild(this._container),t.on(this._getEvents(),this),this.update(),e&&o.DomUtil.setOpacity(this._container,1),this.fire("open"),t.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this})},addTo:function(t){return t.addLayer(this),this},openOn:function(t){return t.openPopup(this),this},onRemove:function(t){t._panes.popupPane.removeChild(this._container),o.Util.falseFn(this._container.offsetWidth),t.off(this._getEvents(),this),t.options.fadeAnimation&&o.DomUtil.setOpacity(this._container,0),this._map=null,this.fire("close"),t.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this})},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},_getEvents:function(){var t={viewreset:this._updatePosition};return this._animated&&(t.zoomanim=this._zoomAnimation),("closeOnClick"in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this._close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var t,e="leaflet-popup",i=e+" "+this.options.className+" leaflet-zoom-"+(this._animated?"animated":"hide"),n=this._container=o.DomUtil.create("div",i);this.options.closeButton&&(t=this._closeButton=o.DomUtil.create("a",e+"-close-button",n),t.href="#close",t.innerHTML="&#215;",o.DomEvent.disableClickPropagation(t),o.DomEvent.on(t,"click",this._onCloseButtonClick,this));var s=this._wrapper=o.DomUtil.create("div",e+"-content-wrapper",n);o.DomEvent.disableClickPropagation(s),this._contentNode=o.DomUtil.create("div",e+"-content",s),o.DomEvent.disableScrollPropagation(this._contentNode),o.DomEvent.on(s,"contextmenu",o.DomEvent.stopPropagation),this._tipContainer=o.DomUtil.create("div",e+"-tip-container",n),this._tip=o.DomUtil.create("div",e+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){if("string"==typeof this._content)this._contentNode.innerHTML=this._content;else{for(;this._contentNode.hasChildNodes();)this._contentNode.removeChild(this._contentNode.firstChild);this._contentNode.appendChild(this._content)}this.fire("contentupdate")}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var i=t.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="";var n=t.offsetHeight,s=this.options.maxHeight,a="leaflet-popup-scrolled";s&&n>s?(e.height=s+"px",o.DomUtil.addClass(t,a)):o.DomUtil.removeClass(t,a),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=this._animated,i=o.point(this.options.offset);e&&o.DomUtil.setPosition(this._container,t),this._containerBottom=-i.y-(e?0:t.y),this._containerLeft=-Math.round(this._containerWidth/2)+i.x+(e?0:t.x),this._container.style.bottom=this._containerBottom+"px",this._container.style.left=this._containerLeft+"px"}},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);o.DomUtil.setPosition(this._container,e)},_adjustPan:function(){if(this.options.autoPan){var t=this._map,e=this._container.offsetHeight,i=this._containerWidth,n=new o.Point(this._containerLeft,-e-this._containerBottom);this._animated&&n._add(o.DomUtil.getPosition(this._container));var s=t.layerPointToContainerPoint(n),a=o.point(this.options.autoPanPadding),r=o.point(this.options.autoPanPaddingTopLeft||a),h=o.point(this.options.autoPanPaddingBottomRight||a),l=t.getSize(),u=0,c=0;s.x+i+h.x>l.x&&(u=s.x+i-l.x+h.x),s.x-u-r.x<0&&(u=s.x-r.x),s.y+e+h.y>l.y&&(c=s.y+e-l.y+h.y),s.y-c-r.y<0&&(c=s.y-r.y),(u||c)&&t.fire("autopanstart").panBy([u,c])}},_onCloseButtonClick:function(t){this._close(),o.DomEvent.stop(t)}}),o.popup=function(t,e){return new o.Popup(t,e)},o.Map.include({openPopup:function(t,e,i){if(this.closePopup(),!(t instanceof o.Popup)){var n=t;t=new o.Popup(i).setLatLng(e).setContent(n)}return t._isOpen=!0,this._popup=t,this.addLayer(t)},closePopup:function(t){return t&&t!==this._popup||(t=this._popup,this._popup=null),t&&(this.removeLayer(t),t._isOpen=!1),this}}),o.Marker.include({openPopup:function(){return this._popup&&this._map&&!this._map.hasLayer(this._popup)&&(this._popup.setLatLng(this._latlng),this._map.openPopup(this._popup)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(){return this._popup&&(this._popup._isOpen?this.closePopup():this.openPopup()),this},bindPopup:function(t,e){var i=o.point(this.options.icon.options.popupAnchor||[0,0]);return i=i.add(o.Popup.prototype.options.offset),e&&e.offset&&(i=i.add(e.offset)),e=o.extend({offset:i},e),this._popupHandlersAdded||(this.on("click",this.togglePopup,this).on("remove",this.closePopup,this).on("move",this._movePopup,this),this._popupHandlersAdded=!0),t instanceof o.Popup?(o.setOptions(t,e),this._popup=t):this._popup=new o.Popup(e,this).setContent(t),this},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this.togglePopup,this).off("remove",this.closePopup,this).off("move",this._movePopup,this),this._popupHandlersAdded=!1),this},getPopup:function(){return this._popup},_movePopup:function(t){this._popup.setLatLng(t.latlng)}}),o.LayerGroup=o.Class.extend({initialize:function(t){this._layers={};var e,i;if(t)for(e=0,i=t.length;i>e;e++)this.addLayer(t[e])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){return t?t in this._layers||this.getLayerId(t)in this._layers:!1},clearLayers:function(){return this.eachLayer(this.removeLayer,this),this},invoke:function(t){var e,i,n=Array.prototype.slice.call(arguments,1);for(e in this._layers)i=this._layers[e],i[t]&&i[t].apply(i,n);return this},onAdd:function(t){this._map=t,this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t),this._map=null},addTo:function(t){return t.addLayer(this),this},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];for(var e in this._layers)t.push(this._layers[e]);return t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return o.stamp(t)}}),o.layerGroup=function(t){return new o.LayerGroup(t)},o.FeatureGroup=o.LayerGroup.extend({includes:o.Mixin.Events,statics:{EVENTS:"click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"},addLayer:function(t){return this.hasLayer(t)?this:("on"in t&&t.on(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.addLayer.call(this,t),this._popupContent&&t.bindPopup&&t.bindPopup(this._popupContent,this._popupOptions),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),t.off(o.FeatureGroup.EVENTS,this._propagateEvent,this),o.LayerGroup.prototype.removeLayer.call(this,t),this._popupContent&&this.invoke("unbindPopup"),this.fire("layerremove",{layer:t})):this},bindPopup:function(t,e){return this._popupContent=t,this._popupOptions=e,this.invoke("bindPopup",t,e)},openPopup:function(t){for(var e in this._layers){this._layers[e].openPopup(t);break}return this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new o.LatLngBounds;return this.eachLayer(function(e){t.extend(e instanceof o.Marker?e.getLatLng():e.getBounds())}),t},_propagateEvent:function(t){t=o.extend({layer:t.target,target:this},t),this.fire(t.type,t)}}),o.featureGroup=function(t){return new o.FeatureGroup(t)},o.Path=o.Class.extend({includes:[o.Mixin.Events],statics:{CLIP_PADDING:function(){var e=o.Browser.mobile?1280:2e3,i=(e/Math.max(t.outerWidth,t.outerHeight)-1)/2;return Math.max(0,Math.min(.5,i))}()},options:{stroke:!0,color:"#0033ff",dashArray:null,lineCap:null,lineJoin:null,weight:5,opacity:.5,fill:!1,fillColor:null,fillOpacity:.2,clickable:!0},initialize:function(t){o.setOptions(this,t)},onAdd:function(t){this._map=t,this._container||(this._initElements(),this._initEvents()),this.projectLatlngs(),this._updatePath(),this._container&&this._map._pathRoot.appendChild(this._container),this.fire("add"),t.on({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},addTo:function(t){return t.addLayer(this),this},onRemove:function(t){t._pathRoot.removeChild(this._container),this.fire("remove"),this._map=null,o.Browser.vml&&(this._container=null,this._stroke=null,this._fill=null),t.off({viewreset:this.projectLatlngs,moveend:this._updatePath},this)},projectLatlngs:function(){},setStyle:function(t){return o.setOptions(this,t),this._container&&this._updateStyle(),this},redraw:function(){return this._map&&(this.projectLatlngs(),this._updatePath()),this}}),o.Map.include({_updatePathViewport:function(){var t=o.Path.CLIP_PADDING,e=this.getSize(),i=o.DomUtil.getPosition(this._mapPane),n=i.multiplyBy(-1)._subtract(e.multiplyBy(t)._round()),s=n.add(e.multiplyBy(1+2*t)._round());this._pathViewport=new o.Bounds(n,s)}}),o.Path.SVG_NS="http://www.w3.org/2000/svg",o.Browser.svg=!(!e.createElementNS||!e.createElementNS(o.Path.SVG_NS,"svg").createSVGRect),o.Path=o.Path.extend({statics:{SVG:o.Browser.svg},bringToFront:function(){var t=this._map._pathRoot,e=this._container;return e&&t.lastChild!==e&&t.appendChild(e),this},bringToBack:function(){var t=this._map._pathRoot,e=this._container,i=t.firstChild;return e&&i!==e&&t.insertBefore(e,i),this},getPathString:function(){},_createElement:function(t){return e.createElementNS(o.Path.SVG_NS,t)},_initElements:function(){this._map._initPathRoot(),this._initPath(),this._initStyle()},_initPath:function(){this._container=this._createElement("g"),this._path=this._createElement("path"),this.options.className&&o.DomUtil.addClass(this._path,this.options.className),this._container.appendChild(this._path)},_initStyle:function(){this.options.stroke&&(this._path.setAttribute("stroke-linejoin","round"),this._path.setAttribute("stroke-linecap","round")),this.options.fill&&this._path.setAttribute("fill-rule","evenodd"),this.options.pointerEvents&&this._path.setAttribute("pointer-events",this.options.pointerEvents),this.options.clickable||this.options.pointerEvents||this._path.setAttribute("pointer-events","none"),this._updateStyle()},_updateStyle:function(){this.options.stroke?(this._path.setAttribute("stroke",this.options.color),this._path.setAttribute("stroke-opacity",this.options.opacity),this._path.setAttribute("stroke-width",this.options.weight),this.options.dashArray?this._path.setAttribute("stroke-dasharray",this.options.dashArray):this._path.removeAttribute("stroke-dasharray"),this.options.lineCap&&this._path.setAttribute("stroke-linecap",this.options.lineCap),this.options.lineJoin&&this._path.setAttribute("stroke-linejoin",this.options.lineJoin)):this._path.setAttribute("stroke","none"),this.options.fill?(this._path.setAttribute("fill",this.options.fillColor||this.options.color),this._path.setAttribute("fill-opacity",this.options.fillOpacity)):this._path.setAttribute("fill","none")},_updatePath:function(){var t=this.getPathString();t||(t="M0 0"),this._path.setAttribute("d",t)},_initEvents:function(){if(this.options.clickable){(o.Browser.svg||!o.Browser.vml)&&o.DomUtil.addClass(this._path,"leaflet-clickable"),o.DomEvent.on(this._container,"click",this._onMouseClick,this);for(var t=["dblclick","mousedown","mouseover","mouseout","mousemove","contextmenu"],e=0;e<t.length;e++)o.DomEvent.on(this._container,t[e],this._fireMouseEvent,this)}},_onMouseClick:function(t){this._map.dragging&&this._map.dragging.moved()||this._fireMouseEvent(t)},_fireMouseEvent:function(t){if(this.hasEventListeners(t.type)){var e=this._map,i=e.mouseEventToContainerPoint(t),n=e.containerPointToLayerPoint(i),s=e.layerPointToLatLng(n);this.fire(t.type,{latlng:s,layerPoint:n,containerPoint:i,originalEvent:t}),"contextmenu"===t.type&&o.DomEvent.preventDefault(t),"mousemove"!==t.type&&o.DomEvent.stopPropagation(t)}}}),o.Map.include({_initPathRoot:function(){this._pathRoot||(this._pathRoot=o.Path.prototype._createElement("svg"),this._panes.overlayPane.appendChild(this._pathRoot),this.options.zoomAnimation&&o.Browser.any3d?(o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-animated"),this.on({zoomanim:this._animatePathZoom,zoomend:this._endPathZoom})):o.DomUtil.addClass(this._pathRoot,"leaflet-zoom-hide"),this.on("moveend",this._updateSvgViewport),this._updateSvgViewport())
},_animatePathZoom:function(t){var e=this.getZoomScale(t.zoom),i=this._getCenterOffset(t.center)._multiplyBy(-e)._add(this._pathViewport.min);this._pathRoot.style[o.DomUtil.TRANSFORM]=o.DomUtil.getTranslateString(i)+" scale("+e+") ",this._pathZooming=!0},_endPathZoom:function(){this._pathZooming=!1},_updateSvgViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max,n=i.x-e.x,s=i.y-e.y,a=this._pathRoot,r=this._panes.overlayPane;o.Browser.mobileWebkit&&r.removeChild(a),o.DomUtil.setPosition(a,e),a.setAttribute("width",n),a.setAttribute("height",s),a.setAttribute("viewBox",[e.x,e.y,n,s].join(" ")),o.Browser.mobileWebkit&&r.appendChild(a)}}}),o.Path.include({bindPopup:function(t,e){return t instanceof o.Popup?this._popup=t:((!this._popup||e)&&(this._popup=new o.Popup(e,this)),this._popup.setContent(t)),this._popupHandlersAdded||(this.on("click",this._openPopup,this).on("remove",this.closePopup,this),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this._popup=null,this.off("click",this._openPopup).off("remove",this.closePopup),this._popupHandlersAdded=!1),this},openPopup:function(t){return this._popup&&(t=t||this._latlng||this._latlngs[Math.floor(this._latlngs.length/2)],this._openPopup({latlng:t})),this},closePopup:function(){return this._popup&&this._popup._close(),this},_openPopup:function(t){this._popup.setLatLng(t.latlng),this._map.openPopup(this._popup)}}),o.Browser.vml=!o.Browser.svg&&function(){try{var t=e.createElement("div");t.innerHTML='<v:shape adj="1"/>';var i=t.firstChild;return i.style.behavior="url(#default#VML)",i&&"object"==typeof i.adj}catch(n){return!1}}(),o.Path=o.Browser.svg||!o.Browser.vml?o.Path:o.Path.extend({statics:{VML:!0,CLIP_PADDING:.02},_createElement:function(){try{return e.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return e.createElement("<lvml:"+t+' class="lvml">')}}catch(t){return function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}(),_initPath:function(){var t=this._container=this._createElement("shape");o.DomUtil.addClass(t,"leaflet-vml-shape"+(this.options.className?" "+this.options.className:"")),this.options.clickable&&o.DomUtil.addClass(t,"leaflet-clickable"),t.coordsize="1 1",this._path=this._createElement("path"),t.appendChild(this._path),this._map._pathRoot.appendChild(t)},_initStyle:function(){this._updateStyle()},_updateStyle:function(){var t=this._stroke,e=this._fill,i=this.options,n=this._container;n.stroked=i.stroke,n.filled=i.fill,i.stroke?(t||(t=this._stroke=this._createElement("stroke"),t.endcap="round",n.appendChild(t)),t.weight=i.weight+"px",t.color=i.color,t.opacity=i.opacity,t.dashStyle=i.dashArray?o.Util.isArray(i.dashArray)?i.dashArray.join(" "):i.dashArray.replace(/( *, *)/g," "):"",i.lineCap&&(t.endcap=i.lineCap.replace("butt","flat")),i.lineJoin&&(t.joinstyle=i.lineJoin)):t&&(n.removeChild(t),this._stroke=null),i.fill?(e||(e=this._fill=this._createElement("fill"),n.appendChild(e)),e.color=i.fillColor||i.color,e.opacity=i.fillOpacity):e&&(n.removeChild(e),this._fill=null)},_updatePath:function(){var t=this._container.style;t.display="none",this._path.v=this.getPathString()+" ",t.display=""}}),o.Map.include(o.Browser.svg||!o.Browser.vml?{}:{_initPathRoot:function(){if(!this._pathRoot){var t=this._pathRoot=e.createElement("div");t.className="leaflet-vml-container",this._panes.overlayPane.appendChild(t),this.on("moveend",this._updatePathViewport),this._updatePathViewport()}}}),o.Browser.canvas=function(){return!!e.createElement("canvas").getContext}(),o.Path=o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?o.Path:o.Path.extend({statics:{CANVAS:!0,SVG:!1},redraw:function(){return this._map&&(this.projectLatlngs(),this._requestUpdate()),this},setStyle:function(t){return o.setOptions(this,t),this._map&&(this._updateStyle(),this._requestUpdate()),this},onRemove:function(t){t.off("viewreset",this.projectLatlngs,this).off("moveend",this._updatePath,this),this.options.clickable&&(this._map.off("click",this._onClick,this),this._map.off("mousemove",this._onMouseMove,this)),this._requestUpdate(),this.fire("remove"),this._map=null},_requestUpdate:function(){this._map&&!o.Path._updateRequest&&(o.Path._updateRequest=o.Util.requestAnimFrame(this._fireMapMoveEnd,this._map))},_fireMapMoveEnd:function(){o.Path._updateRequest=null,this.fire("moveend")},_initElements:function(){this._map._initPathRoot(),this._ctx=this._map._canvasCtx},_updateStyle:function(){var t=this.options;t.stroke&&(this._ctx.lineWidth=t.weight,this._ctx.strokeStyle=t.color),t.fill&&(this._ctx.fillStyle=t.fillColor||t.color)},_drawPath:function(){var t,e,i,n,s,a;for(this._ctx.beginPath(),t=0,i=this._parts.length;i>t;t++){for(e=0,n=this._parts[t].length;n>e;e++)s=this._parts[t][e],a=(0===e?"move":"line")+"To",this._ctx[a](s.x,s.y);this instanceof o.Polygon&&this._ctx.closePath()}},_checkIfEmpty:function(){return!this._parts.length},_updatePath:function(){if(!this._checkIfEmpty()){var t=this._ctx,e=this.options;this._drawPath(),t.save(),this._updateStyle(),e.fill&&(t.globalAlpha=e.fillOpacity,t.fill()),e.stroke&&(t.globalAlpha=e.opacity,t.stroke()),t.restore()}},_initEvents:function(){this.options.clickable&&(this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onClick,this))},_onClick:function(t){this._containsPoint(t.layerPoint)&&this.fire("click",t)},_onMouseMove:function(t){this._map&&!this._map._animatingZoom&&(this._containsPoint(t.layerPoint)?(this._ctx.canvas.style.cursor="pointer",this._mouseInside=!0,this.fire("mouseover",t)):this._mouseInside&&(this._ctx.canvas.style.cursor="",this._mouseInside=!1,this.fire("mouseout",t)))}}),o.Map.include(o.Path.SVG&&!t.L_PREFER_CANVAS||!o.Browser.canvas?{}:{_initPathRoot:function(){var t,i=this._pathRoot;i||(i=this._pathRoot=e.createElement("canvas"),i.style.position="absolute",t=this._canvasCtx=i.getContext("2d"),t.lineCap="round",t.lineJoin="round",this._panes.overlayPane.appendChild(i),this.options.zoomAnimation&&(this._pathRoot.className="leaflet-zoom-animated",this.on("zoomanim",this._animatePathZoom),this.on("zoomend",this._endPathZoom)),this.on("moveend",this._updateCanvasViewport),this._updateCanvasViewport())},_updateCanvasViewport:function(){if(!this._pathZooming){this._updatePathViewport();var t=this._pathViewport,e=t.min,i=t.max.subtract(e),n=this._pathRoot;o.DomUtil.setPosition(n,e),n.width=i.x,n.height=i.y,n.getContext("2d").translate(-e.x,-e.y)}}}),o.LineUtil={simplify:function(t,e){if(!e||!t.length)return t.slice();var i=e*e;return t=this._reducePoints(t,i),t=this._simplifyDP(t,i)},pointToSegmentDistance:function(t,e,i){return Math.sqrt(this._sqClosestPointOnSegment(t,e,i,!0))},closestPointOnSegment:function(t,e,i){return this._sqClosestPointOnSegment(t,e,i)},_simplifyDP:function(t,e){var n=t.length,o=typeof Uint8Array!=i+""?Uint8Array:Array,s=new o(n);s[0]=s[n-1]=1,this._simplifyDPStep(t,s,e,0,n-1);var a,r=[];for(a=0;n>a;a++)s[a]&&r.push(t[a]);return r},_simplifyDPStep:function(t,e,i,n,o){var s,a,r,h=0;for(a=n+1;o-1>=a;a++)r=this._sqClosestPointOnSegment(t[a],t[n],t[o],!0),r>h&&(s=a,h=r);h>i&&(e[s]=1,this._simplifyDPStep(t,e,i,n,s),this._simplifyDPStep(t,e,i,s,o))},_reducePoints:function(t,e){for(var i=[t[0]],n=1,o=0,s=t.length;s>n;n++)this._sqDist(t[n],t[o])>e&&(i.push(t[n]),o=n);return s-1>o&&i.push(t[s-1]),i},clipSegment:function(t,e,i,n){var o,s,a,r=n?this._lastCode:this._getBitCode(t,i),h=this._getBitCode(e,i);for(this._lastCode=h;;){if(!(r|h))return[t,e];if(r&h)return!1;o=r||h,s=this._getEdgeIntersection(t,e,o,i),a=this._getBitCode(s,i),o===r?(t=s,r=a):(e=s,h=a)}},_getEdgeIntersection:function(t,e,i,n){var s=e.x-t.x,a=e.y-t.y,r=n.min,h=n.max;return 8&i?new o.Point(t.x+s*(h.y-t.y)/a,h.y):4&i?new o.Point(t.x+s*(r.y-t.y)/a,r.y):2&i?new o.Point(h.x,t.y+a*(h.x-t.x)/s):1&i?new o.Point(r.x,t.y+a*(r.x-t.x)/s):void 0},_getBitCode:function(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n},_sqClosestPointOnSegment:function(t,e,i,n){var s,a=e.x,r=e.y,h=i.x-a,l=i.y-r,u=h*h+l*l;return u>0&&(s=((t.x-a)*h+(t.y-r)*l)/u,s>1?(a=i.x,r=i.y):s>0&&(a+=h*s,r+=l*s)),h=t.x-a,l=t.y-r,n?h*h+l*l:new o.Point(a,r)}},o.Polyline=o.Path.extend({initialize:function(t,e){o.Path.prototype.initialize.call(this,e),this._latlngs=this._convertLatLngs(t)},options:{smoothFactor:1,noClip:!1},projectLatlngs:function(){this._originalPoints=[];for(var t=0,e=this._latlngs.length;e>t;t++)this._originalPoints[t]=this._map.latLngToLayerPoint(this._latlngs[t])},getPathString:function(){for(var t=0,e=this._parts.length,i="";e>t;t++)i+=this._getPathPartStr(this._parts[t]);return i},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._latlngs=this._convertLatLngs(t),this.redraw()},addLatLng:function(t){return this._latlngs.push(o.latLng(t)),this.redraw()},spliceLatLngs:function(){var t=[].splice.apply(this._latlngs,arguments);return this._convertLatLngs(this._latlngs,!0),this.redraw(),t},closestLayerPoint:function(t){for(var e,i,n=1/0,s=this._parts,a=null,r=0,h=s.length;h>r;r++)for(var l=s[r],u=1,c=l.length;c>u;u++){e=l[u-1],i=l[u];var d=o.LineUtil._sqClosestPointOnSegment(t,e,i,!0);n>d&&(n=d,a=o.LineUtil._sqClosestPointOnSegment(t,e,i))}return a&&(a.distance=Math.sqrt(n)),a},getBounds:function(){return new o.LatLngBounds(this.getLatLngs())},_convertLatLngs:function(t,e){var i,n,s=e?t:[];for(i=0,n=t.length;n>i;i++){if(o.Util.isArray(t[i])&&"number"!=typeof t[i][0])return;s[i]=o.latLng(t[i])}return s},_initEvents:function(){o.Path.prototype._initEvents.call(this)},_getPathPartStr:function(t){for(var e,i=o.Path.VML,n=0,s=t.length,a="";s>n;n++)e=t[n],i&&e._round(),a+=(n?"L":"M")+e.x+" "+e.y;return a},_clipPoints:function(){var t,e,i,n=this._originalPoints,s=n.length;if(this.options.noClip)return void(this._parts=[n]);this._parts=[];var a=this._parts,r=this._map._pathViewport,h=o.LineUtil;for(t=0,e=0;s-1>t;t++)i=h.clipSegment(n[t],n[t+1],r,t),i&&(a[e]=a[e]||[],a[e].push(i[0]),(i[1]!==n[t+1]||t===s-2)&&(a[e].push(i[1]),e++))},_simplifyPoints:function(){for(var t=this._parts,e=o.LineUtil,i=0,n=t.length;n>i;i++)t[i]=e.simplify(t[i],this.options.smoothFactor)},_updatePath:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),o.Path.prototype._updatePath.call(this))}}),o.polyline=function(t,e){return new o.Polyline(t,e)},o.PolyUtil={},o.PolyUtil.clipPolygon=function(t,e){var i,n,s,a,r,h,l,u,c,d=[1,4,2,8],p=o.LineUtil;for(n=0,l=t.length;l>n;n++)t[n]._code=p._getBitCode(t[n],e);for(a=0;4>a;a++){for(u=d[a],i=[],n=0,l=t.length,s=l-1;l>n;s=n++)r=t[n],h=t[s],r._code&u?h._code&u||(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)):(h._code&u&&(c=p._getEdgeIntersection(h,r,u,e),c._code=p._getBitCode(c,e),i.push(c)),i.push(r));t=i}return t},o.Polygon=o.Polyline.extend({options:{fill:!0},initialize:function(t,e){o.Polyline.prototype.initialize.call(this,t,e),this._initWithHoles(t)},_initWithHoles:function(t){var e,i,n;if(t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0])for(this._latlngs=this._convertLatLngs(t[0]),this._holes=t.slice(1),e=0,i=this._holes.length;i>e;e++)n=this._holes[e]=this._convertLatLngs(this._holes[e]),n[0].equals(n[n.length-1])&&n.pop();t=this._latlngs,t.length>=2&&t[0].equals(t[t.length-1])&&t.pop()},projectLatlngs:function(){if(o.Polyline.prototype.projectLatlngs.call(this),this._holePoints=[],this._holes){var t,e,i,n;for(t=0,i=this._holes.length;i>t;t++)for(this._holePoints[t]=[],e=0,n=this._holes[t].length;n>e;e++)this._holePoints[t][e]=this._map.latLngToLayerPoint(this._holes[t][e])}},setLatLngs:function(t){return t&&o.Util.isArray(t[0])&&"number"!=typeof t[0][0]?(this._initWithHoles(t),this.redraw()):o.Polyline.prototype.setLatLngs.call(this,t)},_clipPoints:function(){var t=this._originalPoints,e=[];if(this._parts=[t].concat(this._holePoints),!this.options.noClip){for(var i=0,n=this._parts.length;n>i;i++){var s=o.PolyUtil.clipPolygon(this._parts[i],this._map._pathViewport);s.length&&e.push(s)}this._parts=e}},_getPathPartStr:function(t){var e=o.Polyline.prototype._getPathPartStr.call(this,t);return e+(o.Browser.svg?"z":"x")}}),o.polygon=function(t,e){return new o.Polygon(t,e)},function(){function t(t){return o.FeatureGroup.extend({initialize:function(t,e){this._layers={},this._options=e,this.setLatLngs(t)},setLatLngs:function(e){var i=0,n=e.length;for(this.eachLayer(function(t){n>i?t.setLatLngs(e[i++]):this.removeLayer(t)},this);n>i;)this.addLayer(new t(e[i++],this._options));return this},getLatLngs:function(){var t=[];return this.eachLayer(function(e){t.push(e.getLatLngs())}),t}})}o.MultiPolyline=t(o.Polyline),o.MultiPolygon=t(o.Polygon),o.multiPolyline=function(t,e){return new o.MultiPolyline(t,e)},o.multiPolygon=function(t,e){return new o.MultiPolygon(t,e)}}(),o.Rectangle=o.Polygon.extend({initialize:function(t,e){o.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=o.latLngBounds(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}}),o.rectangle=function(t,e){return new o.Rectangle(t,e)},o.Circle=o.Path.extend({initialize:function(t,e,i){o.Path.prototype.initialize.call(this,i),this._latlng=o.latLng(t),this._mRadius=e},options:{fill:!0},setLatLng:function(t){return this._latlng=o.latLng(t),this.redraw()},setRadius:function(t){return this._mRadius=t,this.redraw()},projectLatlngs:function(){var t=this._getLngRadius(),e=this._latlng,i=this._map.latLngToLayerPoint([e.lat,e.lng-t]);this._point=this._map.latLngToLayerPoint(e),this._radius=Math.max(this._point.x-i.x,1)},getBounds:function(){var t=this._getLngRadius(),e=this._mRadius/40075017*360,i=this._latlng;return new o.LatLngBounds([i.lat-e,i.lng-t],[i.lat+e,i.lng+t])},getLatLng:function(){return this._latlng},getPathString:function(){var t=this._point,e=this._radius;return this._checkIfEmpty()?"":o.Browser.svg?"M"+t.x+","+(t.y-e)+"A"+e+","+e+",0,1,1,"+(t.x-.1)+","+(t.y-e)+" z":(t._round(),e=Math.round(e),"AL "+t.x+","+t.y+" "+e+","+e+" 0,23592600")},getRadius:function(){return this._mRadius},_getLatRadius:function(){return this._mRadius/40075017*360},_getLngRadius:function(){return this._getLatRadius()/Math.cos(o.LatLng.DEG_TO_RAD*this._latlng.lat)},_checkIfEmpty:function(){if(!this._map)return!1;var t=this._map._pathViewport,e=this._radius,i=this._point;return i.x-e>t.max.x||i.y-e>t.max.y||i.x+e<t.min.x||i.y+e<t.min.y}}),o.circle=function(t,e,i){return new o.Circle(t,e,i)},o.CircleMarker=o.Circle.extend({options:{radius:10,weight:2},initialize:function(t,e){o.Circle.prototype.initialize.call(this,t,null,e),this._radius=this.options.radius},projectLatlngs:function(){this._point=this._map.latLngToLayerPoint(this._latlng)},_updateStyle:function(){o.Circle.prototype._updateStyle.call(this),this.setRadius(this.options.radius)},setLatLng:function(t){return o.Circle.prototype.setLatLng.call(this,t),this._popup&&this._popup._isOpen&&this._popup.setLatLng(t),this},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius}}),o.circleMarker=function(t,e){return new o.CircleMarker(t,e)},o.Polyline.include(o.Path.CANVAS?{_containsPoint:function(t,e){var i,n,s,a,r,h,l,u=this.options.weight/2;for(o.Browser.touch&&(u+=10),i=0,a=this._parts.length;a>i;i++)for(l=this._parts[i],n=0,r=l.length,s=r-1;r>n;s=n++)if((e||0!==n)&&(h=o.LineUtil.pointToSegmentDistance(t,l[s],l[n]),u>=h))return!0;return!1}}:{}),o.Polygon.include(o.Path.CANVAS?{_containsPoint:function(t){var e,i,n,s,a,r,h,l,u=!1;if(o.Polyline.prototype._containsPoint.call(this,t,!0))return!0;for(s=0,h=this._parts.length;h>s;s++)for(e=this._parts[s],a=0,l=e.length,r=l-1;l>a;r=a++)i=e[a],n=e[r],i.y>t.y!=n.y>t.y&&t.x<(n.x-i.x)*(t.y-i.y)/(n.y-i.y)+i.x&&(u=!u);return u}}:{}),o.Circle.include(o.Path.CANVAS?{_drawPath:function(){var t=this._point;this._ctx.beginPath(),this._ctx.arc(t.x,t.y,this._radius,0,2*Math.PI,!1)},_containsPoint:function(t){var e=this._point,i=this.options.stroke?this.options.weight/2:0;return t.distanceTo(e)<=this._radius+i}}:{}),o.CircleMarker.include(o.Path.CANVAS?{_updateStyle:function(){o.Path.prototype._updateStyle.call(this)}}:{}),o.GeoJSON=o.FeatureGroup.extend({initialize:function(t,e){o.setOptions(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e,i,n,s=o.Util.isArray(t)?t:t.features;if(s){for(e=0,i=s.length;i>e;e++)n=s[e],(n.geometries||n.geometry||n.features||n.coordinates)&&this.addData(s[e]);return this}var a=this.options;if(!a.filter||a.filter(t)){var r=o.GeoJSON.geometryToLayer(t,a.pointToLayer,a.coordsToLatLng,a);return r.feature=o.GeoJSON.asFeature(t),r.defaultOptions=r.options,this.resetStyle(r),a.onEachFeature&&a.onEachFeature(t,r),this.addLayer(r)}},resetStyle:function(t){var e=this.options.style;e&&(o.Util.extend(t.options,t.defaultOptions),this._setLayerStyle(t,e))},setStyle:function(t){this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){"function"==typeof e&&(e=e(t.feature)),t.setStyle&&t.setStyle(e)}}),o.extend(o.GeoJSON,{geometryToLayer:function(t,e,i,n){var s,a,r,h,l="Feature"===t.type?t.geometry:t,u=l.coordinates,c=[];switch(i=i||this.coordsToLatLng,l.type){case"Point":return s=i(u),e?e(t,s):new o.Marker(s);case"MultiPoint":for(r=0,h=u.length;h>r;r++)s=i(u[r]),c.push(e?e(t,s):new o.Marker(s));return new o.FeatureGroup(c);case"LineString":return a=this.coordsToLatLngs(u,0,i),new o.Polyline(a,n);case"Polygon":if(2===u.length&&!u[1].length)throw new Error("Invalid GeoJSON object.");return a=this.coordsToLatLngs(u,1,i),new o.Polygon(a,n);case"MultiLineString":return a=this.coordsToLatLngs(u,1,i),new o.MultiPolyline(a,n);case"MultiPolygon":return a=this.coordsToLatLngs(u,2,i),new o.MultiPolygon(a,n);case"GeometryCollection":for(r=0,h=l.geometries.length;h>r;r++)c.push(this.geometryToLayer({geometry:l.geometries[r],type:"Feature",properties:t.properties},e,i,n));return new o.FeatureGroup(c);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(t){return new o.LatLng(t[1],t[0],t[2])},coordsToLatLngs:function(t,e,i){var n,o,s,a=[];for(o=0,s=t.length;s>o;o++)n=e?this.coordsToLatLngs(t[o],e-1,i):(i||this.coordsToLatLng)(t[o]),a.push(n);return a},latLngToCoords:function(t){var e=[t.lng,t.lat];return t.alt!==i&&e.push(t.alt),e},latLngsToCoords:function(t){for(var e=[],i=0,n=t.length;n>i;i++)e.push(o.GeoJSON.latLngToCoords(t[i]));return e},getFeature:function(t,e){return t.feature?o.extend({},t.feature,{geometry:e}):o.GeoJSON.asFeature(e)},asFeature:function(t){return"Feature"===t.type?t:{type:"Feature",properties:{},geometry:t}}});var a={toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"Point",coordinates:o.GeoJSON.latLngToCoords(this.getLatLng())})}};o.Marker.include(a),o.Circle.include(a),o.CircleMarker.include(a),o.Polyline.include({toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"LineString",coordinates:o.GeoJSON.latLngsToCoords(this.getLatLngs())})}}),o.Polygon.include({toGeoJSON:function(){var t,e,i,n=[o.GeoJSON.latLngsToCoords(this.getLatLngs())];if(n[0].push(n[0][0]),this._holes)for(t=0,e=this._holes.length;e>t;t++)i=o.GeoJSON.latLngsToCoords(this._holes[t]),i.push(i[0]),n.push(i);return o.GeoJSON.getFeature(this,{type:"Polygon",coordinates:n})}}),function(){function t(t){return function(){var e=[];return this.eachLayer(function(t){e.push(t.toGeoJSON().geometry.coordinates)}),o.GeoJSON.getFeature(this,{type:t,coordinates:e})}}o.MultiPolyline.include({toGeoJSON:t("MultiLineString")}),o.MultiPolygon.include({toGeoJSON:t("MultiPolygon")}),o.LayerGroup.include({toGeoJSON:function(){var e,i=this.feature&&this.feature.geometry,n=[];if(i&&"MultiPoint"===i.type)return t("MultiPoint").call(this);var s=i&&"GeometryCollection"===i.type;return this.eachLayer(function(t){t.toGeoJSON&&(e=t.toGeoJSON(),n.push(s?e.geometry:o.GeoJSON.asFeature(e)))}),s?o.GeoJSON.getFeature(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n}}})}(),o.geoJson=function(t,e){return new o.GeoJSON(t,e)},o.DomEvent={addListener:function(t,e,i,n){var s,a,r,h=o.stamp(i),l="_leaflet_"+e+h;return t[l]?this:(s=function(e){return i.call(n||t,e||o.DomEvent._getEvent())},o.Browser.pointer&&0===e.indexOf("touch")?this.addPointerListener(t,e,s,h):(o.Browser.touch&&"dblclick"===e&&this.addDoubleTapListener&&this.addDoubleTapListener(t,s,h),"addEventListener"in t?"mousewheel"===e?(t.addEventListener("DOMMouseScroll",s,!1),t.addEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?(a=s,r="mouseenter"===e?"mouseover":"mouseout",s=function(e){return o.DomEvent._checkMouse(t,e)?a(e):void 0},t.addEventListener(r,s,!1)):"click"===e&&o.Browser.android?(a=s,s=function(t){return o.DomEvent._filterClick(t,a)},t.addEventListener(e,s,!1)):t.addEventListener(e,s,!1):"attachEvent"in t&&t.attachEvent("on"+e,s),t[l]=s,this))},removeListener:function(t,e,i){var n=o.stamp(i),s="_leaflet_"+e+n,a=t[s];return a?(o.Browser.pointer&&0===e.indexOf("touch")?this.removePointerListener(t,e,n):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,n):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",a,!1),t.removeEventListener(e,a,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",a,!1):t.removeEventListener(e,a,!1):"detachEvent"in t&&t.detachEvent("on"+e,a),t[s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableScrollPropagation:function(t){var e=o.DomEvent.stopPropagation;return o.DomEvent.on(t,"mousewheel",e).on(t,"MozMousePixelScroll",e)},disableClickPropagation:function(t){for(var e=o.DomEvent.stopPropagation,i=o.Draggable.START.length-1;i>=0;i--)o.DomEvent.on(t,o.Draggable.START[i],e);return o.DomEvent.on(t,"click",o.DomEvent._fakeStop).on(t,"dblclick",e)},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,e){if(!e)return new o.Point(t.clientX,t.clientY);var i=e.getBoundingClientRect();return new o.Point(t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop)},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(n){return!1}return i!==t},_getEvent:function(){var e=t.event;if(!e)for(var i=arguments.callee.caller;i&&(e=i.arguments[0],!e||t.Event!==e.constructor);)i=i.caller;return e},_filterClick:function(t,e){var i=t.timeStamp||t.originalEvent.timeStamp,n=o.DomEvent._lastClick&&i-o.DomEvent._lastClick;return n&&n>100&&500>n||t.target._simulatedClick&&!t._simulated?void o.DomEvent.stop(t):(o.DomEvent._lastClick=i,e(t))}},o.DomEvent.on=o.DomEvent.addListener,o.DomEvent.off=o.DomEvent.removeListener,o.Draggable=o.Class.extend({includes:o.Mixin.Events,statics:{START:o.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(t,e){this._element=t,this._dragStartTarget=e||t},enable:function(){if(!this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.on(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!0}},disable:function(){if(this._enabled){for(var t=o.Draggable.START.length-1;t>=0;t--)o.DomEvent.off(this._dragStartTarget,o.Draggable.START[t],this._onDown,this);this._enabled=!1,this._moved=!1}},_onDown:function(t){if(this._moved=!1,!(t.shiftKey||1!==t.which&&1!==t.button&&!t.touches||(o.DomEvent.stopPropagation(t),o.Draggable._disabled||(o.DomUtil.disableImageDrag(),o.DomUtil.disableTextSelection(),this._moving)))){var i=t.touches?t.touches[0]:t;this._startPoint=new o.Point(i.clientX,i.clientY),this._startPos=this._newPos=o.DomUtil.getPosition(this._element),o.DomEvent.on(e,o.Draggable.MOVE[t.type],this._onMove,this).on(e,o.Draggable.END[t.type],this._onUp,this)}},_onMove:function(t){if(t.touches&&t.touches.length>1)return void(this._moved=!0);var i=t.touches&&1===t.touches.length?t.touches[0]:t,n=new o.Point(i.clientX,i.clientY),s=n.subtract(this._startPoint);(s.x||s.y)&&(o.Browser.touch&&Math.abs(s.x)+Math.abs(s.y)<3||(o.DomEvent.preventDefault(t),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=o.DomUtil.getPosition(this._element).subtract(s),o.DomUtil.addClass(e.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,o.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(s),this._moving=!0,o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){this.fire("predrag"),o.DomUtil.setPosition(this._element,this._newPos),this.fire("drag")},_onUp:function(){o.DomUtil.removeClass(e.body,"leaflet-dragging"),this._lastTarget&&(o.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var t in o.Draggable.MOVE)o.DomEvent.off(e,o.Draggable.MOVE[t],this._onMove).off(e,o.Draggable.END[t],this._onUp);o.DomUtil.enableImageDrag(),o.DomUtil.enableTextSelection(),this._moved&&this._moving&&(o.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),o.Handler=o.Class.extend({initialize:function(t){this._map=t},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),o.Map.mergeOptions({dragging:!0,inertia:!o.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,inertiaThreshold:o.Browser.touch?32:18,easeLinearity:.25,worldCopyJump:!1}),o.Map.Drag=o.Handler.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new o.Draggable(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),t.on("viewreset",this._onViewReset,this),t.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){var t=this._map;t._panAnim&&t._panAnim.stop(),t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(){if(this._map.options.inertia){var t=this._lastTime=+new Date,e=this._lastPos=this._draggable._newPos;this._positions.push(e),this._times.push(t),t-this._times[0]>200&&(this._positions.shift(),this._times.shift())}this._map.fire("move").fire("drag")},_onViewReset:function(){var t=this._map.getSize()._divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.project([0,180]).x},_onPreDrag:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,o=(n-e+i)%t+e-i,s=(n+e+i)%t-e-i,a=Math.abs(o+i)<Math.abs(s+i)?o:s;this._draggable._newPos.x=a},_onDragEnd:function(t){var e=this._map,i=e.options,n=+new Date-this._lastTime,s=!i.inertia||n>i.inertiaThreshold||!this._positions[0];if(e.fire("dragend",t),s)e.fire("moveend");else{var a=this._lastPos.subtract(this._positions[0]),r=(this._lastTime+n-this._times[0])/1e3,h=i.easeLinearity,l=a.multiplyBy(h/r),u=l.distanceTo([0,0]),c=Math.min(i.inertiaMaxSpeed,u),d=l.multiplyBy(c/u),p=c/(i.inertiaDeceleration*h),_=d.multiplyBy(-p/2).round();_.x&&_.y?(_=e._limitOffset(_,e.options.maxBounds),o.Util.requestAnimFrame(function(){e.panBy(_,{duration:p,easeLinearity:h,noMoveStart:!0})})):e.fire("moveend")}}}),o.Map.addInitHook("addHandler","dragging",o.Map.Drag),o.Map.mergeOptions({doubleClickZoom:!0}),o.Map.DoubleClickZoom=o.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom()+(t.originalEvent.shiftKey?-1:1);"center"===e.options.doubleClickZoom?e.setZoom(i):e.setZoomAround(t.containerPoint,i)}}),o.Map.addInitHook("addHandler","doubleClickZoom",o.Map.DoubleClickZoom),o.Map.mergeOptions({scrollWheelZoom:!0}),o.Map.ScrollWheelZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"mousewheel",this._onWheelScroll,this),o.DomEvent.on(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault),this._delta=0},removeHooks:function(){o.DomEvent.off(this._map._container,"mousewheel",this._onWheelScroll),o.DomEvent.off(this._map._container,"MozMousePixelScroll",o.DomEvent.preventDefault)},_onWheelScroll:function(t){var e=o.DomEvent.getWheelDelta(t);this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var i=Math.max(40-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(o.bind(this._performZoom,this),i),o.DomEvent.preventDefault(t),o.DomEvent.stopPropagation(t)},_performZoom:function(){var t=this._map,e=this._delta,i=t.getZoom();e=e>0?Math.ceil(e):Math.floor(e),e=Math.max(Math.min(e,4),-4),e=t._limitZoom(i+e)-i,this._delta=0,this._startTime=null,e&&("center"===t.options.scrollWheelZoom?t.setZoom(i+e):t.setZoomAround(this._lastMousePos,i+e))}}),o.Map.addInitHook("addHandler","scrollWheelZoom",o.Map.ScrollWheelZoom),o.extend(o.DomEvent,{_touchstart:o.Browser.msPointer?"MSPointerDown":o.Browser.pointer?"pointerdown":"touchstart",_touchend:o.Browser.msPointer?"MSPointerUp":o.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(t,i,n){function s(t){var e;if(o.Browser.pointer?(_.push(t.pointerId),e=_.length):e=t.touches.length,!(e>1)){var i=Date.now(),n=i-(r||i);h=t.touches?t.touches[0]:t,l=n>0&&u>=n,r=i}}function a(t){if(o.Browser.pointer){var e=_.indexOf(t.pointerId);if(-1===e)return;_.splice(e,1)}if(l){if(o.Browser.pointer){var n,s={};for(var a in h)n=h[a],s[a]="function"==typeof n?n.bind(h):n;h=s}h.type="dblclick",i(h),r=null}}var r,h,l=!1,u=250,c="_leaflet_",d=this._touchstart,p=this._touchend,_=[];t[c+d+n]=s,t[c+p+n]=a;var m=o.Browser.pointer?e.documentElement:t;return t.addEventListener(d,s,!1),m.addEventListener(p,a,!1),o.Browser.pointer&&m.addEventListener(o.DomEvent.POINTER_CANCEL,a,!1),this},removeDoubleTapListener:function(t,i){var n="_leaflet_";return t.removeEventListener(this._touchstart,t[n+this._touchstart+i],!1),(o.Browser.pointer?e.documentElement:t).removeEventListener(this._touchend,t[n+this._touchend+i],!1),o.Browser.pointer&&e.documentElement.removeEventListener(o.DomEvent.POINTER_CANCEL,t[n+this._touchend+i],!1),this}}),o.extend(o.DomEvent,{POINTER_DOWN:o.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:o.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:o.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:o.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:[],_pointerDocumentListener:!1,addPointerListener:function(t,e,i,n){switch(e){case"touchstart":return this.addPointerListenerStart(t,e,i,n);case"touchend":return this.addPointerListenerEnd(t,e,i,n);case"touchmove":return this.addPointerListenerMove(t,e,i,n);default:throw"Unknown touch event type"}},addPointerListenerStart:function(t,i,n,s){var a="_leaflet_",r=this._pointers,h=function(t){o.DomEvent.preventDefault(t);for(var e=!1,i=0;i<r.length;i++)if(r[i].pointerId===t.pointerId){e=!0;
break}e||r.push(t),t.touches=r.slice(),t.changedTouches=[t],n(t)};if(t[a+"touchstart"+s]=h,t.addEventListener(this.POINTER_DOWN,h,!1),!this._pointerDocumentListener){var l=function(t){for(var e=0;e<r.length;e++)if(r[e].pointerId===t.pointerId){r.splice(e,1);break}};e.documentElement.addEventListener(this.POINTER_UP,l,!1),e.documentElement.addEventListener(this.POINTER_CANCEL,l,!1),this._pointerDocumentListener=!0}return this},addPointerListenerMove:function(t,e,i,n){function o(t){if(t.pointerType!==t.MSPOINTER_TYPE_MOUSE&&"mouse"!==t.pointerType||0!==t.buttons){for(var e=0;e<a.length;e++)if(a[e].pointerId===t.pointerId){a[e]=t;break}t.touches=a.slice(),t.changedTouches=[t],i(t)}}var s="_leaflet_",a=this._pointers;return t[s+"touchmove"+n]=o,t.addEventListener(this.POINTER_MOVE,o,!1),this},addPointerListenerEnd:function(t,e,i,n){var o="_leaflet_",s=this._pointers,a=function(t){for(var e=0;e<s.length;e++)if(s[e].pointerId===t.pointerId){s.splice(e,1);break}t.touches=s.slice(),t.changedTouches=[t],i(t)};return t[o+"touchend"+n]=a,t.addEventListener(this.POINTER_UP,a,!1),t.addEventListener(this.POINTER_CANCEL,a,!1),this},removePointerListener:function(t,e,i){var n="_leaflet_",o=t[n+e+i];switch(e){case"touchstart":t.removeEventListener(this.POINTER_DOWN,o,!1);break;case"touchmove":t.removeEventListener(this.POINTER_MOVE,o,!1);break;case"touchend":t.removeEventListener(this.POINTER_UP,o,!1),t.removeEventListener(this.POINTER_CANCEL,o,!1)}return this}}),o.Map.mergeOptions({touchZoom:o.Browser.touch&&!o.Browser.android23,bounceAtZoomLimits:!0}),o.Map.TouchZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var i=this._map;if(t.touches&&2===t.touches.length&&!i._animatingZoom&&!this._zooming){var n=i.mouseEventToLayerPoint(t.touches[0]),s=i.mouseEventToLayerPoint(t.touches[1]),a=i._getCenterLayerPoint();this._startCenter=n.add(s)._divideBy(2),this._startDist=n.distanceTo(s),this._moved=!1,this._zooming=!0,this._centerOffset=a.subtract(this._startCenter),i._panAnim&&i._panAnim.stop(),o.DomEvent.on(e,"touchmove",this._onTouchMove,this).on(e,"touchend",this._onTouchEnd,this),o.DomEvent.preventDefault(t)}},_onTouchMove:function(t){var e=this._map;if(t.touches&&2===t.touches.length&&this._zooming){var i=e.mouseEventToLayerPoint(t.touches[0]),n=e.mouseEventToLayerPoint(t.touches[1]);this._scale=i.distanceTo(n)/this._startDist,this._delta=i._add(n)._divideBy(2)._subtract(this._startCenter),1!==this._scale&&(e.options.bounceAtZoomLimits||!(e.getZoom()===e.getMinZoom()&&this._scale<1||e.getZoom()===e.getMaxZoom()&&this._scale>1))&&(this._moved||(o.DomUtil.addClass(e._mapPane,"leaflet-touching"),e.fire("movestart").fire("zoomstart"),this._moved=!0),o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),o.DomEvent.preventDefault(t))}},_updateOnMove:function(){var t=this._map,e=this._getScaleOrigin(),i=t.layerPointToLatLng(e),n=t.getScaleZoom(this._scale);t._animateZoom(i,n,this._startCenter,this._scale,this._delta,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);var t=this._map;this._zooming=!1,o.DomUtil.removeClass(t._mapPane,"leaflet-touching"),o.Util.cancelAnimFrame(this._animRequest),o.DomEvent.off(e,"touchmove",this._onTouchMove).off(e,"touchend",this._onTouchEnd);var i=this._getScaleOrigin(),n=t.layerPointToLatLng(i),s=t.getZoom(),a=t.getScaleZoom(this._scale)-s,r=a>0?Math.ceil(a):Math.floor(a),h=t._limitZoom(s+r),l=t.getZoomScale(h)/this._scale;t._animateZoom(n,h,i,l)},_getScaleOrigin:function(){var t=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(t)}}),o.Map.addInitHook("addHandler","touchZoom",o.Map.TouchZoom),o.Map.mergeOptions({tap:!0,tapTolerance:15}),o.Map.Tap=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(t.touches){if(o.DomEvent.preventDefault(t),this._fireClick=!0,t.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var i=t.touches[0],n=i.target;this._startPos=this._newPos=new o.Point(i.clientX,i.clientY),n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.addClass(n,"leaflet-active"),this._holdTimeout=setTimeout(o.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",i))},this),1e3),o.DomEvent.on(e,"touchmove",this._onMove,this).on(e,"touchend",this._onUp,this)}},_onUp:function(t){if(clearTimeout(this._holdTimeout),o.DomEvent.off(e,"touchmove",this._onMove,this).off(e,"touchend",this._onUp,this),this._fireClick&&t&&t.changedTouches){var i=t.changedTouches[0],n=i.target;n&&n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.removeClass(n,"leaflet-active"),this._isTapValid()&&this._simulateEvent("click",i)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(t){var e=t.touches[0];this._newPos=new o.Point(e.clientX,e.clientY)},_simulateEvent:function(i,n){var o=e.createEvent("MouseEvents");o._simulated=!0,n.target._simulatedClick=!0,o.initMouseEvent(i,!0,!0,t,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(o)}}),o.Browser.touch&&!o.Browser.pointer&&o.Map.addInitHook("addHandler","tap",o.Map.Tap),o.Map.mergeOptions({boxZoom:!0}),o.Map.BoxZoom=o.Handler.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._moved=!1},addHooks:function(){o.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){o.DomEvent.off(this._container,"mousedown",this._onMouseDown),this._moved=!1},moved:function(){return this._moved},_onMouseDown:function(t){return this._moved=!1,!t.shiftKey||1!==t.which&&1!==t.button?!1:(o.DomUtil.disableTextSelection(),o.DomUtil.disableImageDrag(),this._startLayerPoint=this._map.mouseEventToLayerPoint(t),void o.DomEvent.on(e,"mousemove",this._onMouseMove,this).on(e,"mouseup",this._onMouseUp,this).on(e,"keydown",this._onKeyDown,this))},_onMouseMove:function(t){this._moved||(this._box=o.DomUtil.create("div","leaflet-zoom-box",this._pane),o.DomUtil.setPosition(this._box,this._startLayerPoint),this._container.style.cursor="crosshair",this._map.fire("boxzoomstart"));var e=this._startLayerPoint,i=this._box,n=this._map.mouseEventToLayerPoint(t),s=n.subtract(e),a=new o.Point(Math.min(n.x,e.x),Math.min(n.y,e.y));o.DomUtil.setPosition(i,a),this._moved=!0,i.style.width=Math.max(0,Math.abs(s.x)-4)+"px",i.style.height=Math.max(0,Math.abs(s.y)-4)+"px"},_finish:function(){this._moved&&(this._pane.removeChild(this._box),this._container.style.cursor=""),o.DomUtil.enableTextSelection(),o.DomUtil.enableImageDrag(),o.DomEvent.off(e,"mousemove",this._onMouseMove).off(e,"mouseup",this._onMouseUp).off(e,"keydown",this._onKeyDown)},_onMouseUp:function(t){this._finish();var e=this._map,i=e.mouseEventToLayerPoint(t);if(!this._startLayerPoint.equals(i)){var n=new o.LatLngBounds(e.layerPointToLatLng(this._startLayerPoint),e.layerPointToLatLng(i));e.fitBounds(n),e.fire("boxzoomend",{boxZoomBounds:n})}},_onKeyDown:function(t){27===t.keyCode&&this._finish()}}),o.Map.addInitHook("addHandler","boxZoom",o.Map.BoxZoom),o.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),o.Map.Keyboard=o.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,173]},initialize:function(t){this._map=t,this._setPanOffset(t.options.keyboardPanOffset),this._setZoomOffset(t.options.keyboardZoomOffset)},addHooks:function(){var t=this._map._container;-1===t.tabIndex&&(t.tabIndex="0"),o.DomEvent.on(t,"focus",this._onFocus,this).on(t,"blur",this._onBlur,this).on(t,"mousedown",this._onMouseDown,this),this._map.on("focus",this._addHooks,this).on("blur",this._removeHooks,this)},removeHooks:function(){this._removeHooks();var t=this._map._container;o.DomEvent.off(t,"focus",this._onFocus,this).off(t,"blur",this._onBlur,this).off(t,"mousedown",this._onMouseDown,this),this._map.off("focus",this._addHooks,this).off("blur",this._removeHooks,this)},_onMouseDown:function(){if(!this._focused){var i=e.body,n=e.documentElement,o=i.scrollTop||n.scrollTop,s=i.scrollLeft||n.scrollLeft;this._map._container.focus(),t.scrollTo(s,o)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(t){var e,i,n=this._panKeys={},o=this.keyCodes;for(e=0,i=o.left.length;i>e;e++)n[o.left[e]]=[-1*t,0];for(e=0,i=o.right.length;i>e;e++)n[o.right[e]]=[t,0];for(e=0,i=o.down.length;i>e;e++)n[o.down[e]]=[0,t];for(e=0,i=o.up.length;i>e;e++)n[o.up[e]]=[0,-1*t]},_setZoomOffset:function(t){var e,i,n=this._zoomKeys={},o=this.keyCodes;for(e=0,i=o.zoomIn.length;i>e;e++)n[o.zoomIn[e]]=t;for(e=0,i=o.zoomOut.length;i>e;e++)n[o.zoomOut[e]]=-t},_addHooks:function(){o.DomEvent.on(e,"keydown",this._onKeyDown,this)},_removeHooks:function(){o.DomEvent.off(e,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){var e=t.keyCode,i=this._map;if(e in this._panKeys){if(i._panAnim&&i._panAnim._inProgress)return;i.panBy(this._panKeys[e]),i.options.maxBounds&&i.panInsideBounds(i.options.maxBounds)}else{if(!(e in this._zoomKeys))return;i.setZoom(i.getZoom()+this._zoomKeys[e])}o.DomEvent.stop(t)}}),o.Map.addInitHook("addHandler","keyboard",o.Map.Keyboard),o.Handler.MarkerDrag=o.Handler.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new o.Draggable(t,t)),this._draggable.on("dragstart",this._onDragStart,this).on("drag",this._onDrag,this).on("dragend",this._onDragEnd,this),this._draggable.enable(),o.DomUtil.addClass(this._marker._icon,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off("dragstart",this._onDragStart,this).off("drag",this._onDrag,this).off("dragend",this._onDragEnd,this),this._draggable.disable(),o.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(){var t=this._marker,e=t._shadow,i=o.DomUtil.getPosition(t._icon),n=t._map.layerPointToLatLng(i);e&&o.DomUtil.setPosition(e,i),t._latlng=n,t.fire("move",{latlng:n}).fire("drag")},_onDragEnd:function(t){this._marker.fire("moveend").fire("dragend",t)}}),o.Control=o.Class.extend({options:{position:"topright"},initialize:function(t){o.setOptions(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),n=t._controlCorners[i];return o.DomUtil.addClass(e,"leaflet-control"),-1!==i.indexOf("bottom")?n.insertBefore(e,n.firstChild):n.appendChild(e),this},removeFrom:function(t){var e=this.getPosition(),i=t._controlCorners[e];return i.removeChild(this._container),this._map=null,this.onRemove&&this.onRemove(t),this},_refocusOnMap:function(){this._map&&this._map.getContainer().focus()}}),o.control=function(t){return new o.Control(t)},o.Map.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.removeFrom(this),this},_initControlPos:function(){function t(t,s){var a=i+t+" "+i+s;e[t+s]=o.DomUtil.create("div",a,n)}var e=this._controlCorners={},i="leaflet-",n=this._controlContainer=o.DomUtil.create("div",i+"control-container",this._container);t("top","left"),t("top","right"),t("bottom","left"),t("bottom","right")},_clearControlPos:function(){this._container.removeChild(this._controlContainer)}}),o.Control.Zoom=o.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=o.DomUtil.create("div",e+" leaflet-bar");return this._map=t,this._zoomInButton=this._createButton(this.options.zoomInText,this.options.zoomInTitle,e+"-in",i,this._zoomIn,this),this._zoomOutButton=this._createButton(this.options.zoomOutText,this.options.zoomOutTitle,e+"-out",i,this._zoomOut,this),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},_zoomIn:function(t){this._map.zoomIn(t.shiftKey?3:1)},_zoomOut:function(t){this._map.zoomOut(t.shiftKey?3:1)},_createButton:function(t,e,i,n,s,a){var r=o.DomUtil.create("a",i,n);r.innerHTML=t,r.href="#",r.title=e;var h=o.DomEvent.stopPropagation;return o.DomEvent.on(r,"click",h).on(r,"mousedown",h).on(r,"dblclick",h).on(r,"click",o.DomEvent.preventDefault).on(r,"click",s,a).on(r,"click",this._refocusOnMap,a),r},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";o.DomUtil.removeClass(this._zoomInButton,e),o.DomUtil.removeClass(this._zoomOutButton,e),t._zoom===t.getMinZoom()&&o.DomUtil.addClass(this._zoomOutButton,e),t._zoom===t.getMaxZoom()&&o.DomUtil.addClass(this._zoomInButton,e)}}),o.Map.mergeOptions({zoomControl:!0}),o.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new o.Control.Zoom,this.addControl(this.zoomControl))}),o.control.zoom=function(t){return new o.Control.Zoom(t)},o.Control.Attribution=o.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(t){o.setOptions(this,t),this._attributions={}},onAdd:function(t){this._container=o.DomUtil.create("div","leaflet-control-attribution"),o.DomEvent.disableClickPropagation(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return t.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(t){t.off("layeradd",this._onLayerAdd).off("layerremove",this._onLayerRemove)},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):void 0},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):void 0},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var i=[];this.options.prefix&&i.push(this.options.prefix),t.length&&i.push(t.join(", ")),this._container.innerHTML=i.join(" | ")}},_onLayerAdd:function(t){t.layer.getAttribution&&this.addAttribution(t.layer.getAttribution())},_onLayerRemove:function(t){t.layer.getAttribution&&this.removeAttribution(t.layer.getAttribution())}}),o.Map.mergeOptions({attributionControl:!0}),o.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new o.Control.Attribution).addTo(this))}),o.control.attribution=function(t){return new o.Control.Attribution(t)},o.Control.Scale=o.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0,updateWhenIdle:!1},onAdd:function(t){this._map=t;var e="leaflet-control-scale",i=o.DomUtil.create("div",e),n=this.options;return this._addScales(n,e,i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=o.DomUtil.create("div",e+"-line",i)),t.imperial&&(this._iScale=o.DomUtil.create("div",e+"-line",i))},_update:function(){var t=this._map.getBounds(),e=t.getCenter().lat,i=6378137*Math.PI*Math.cos(e*Math.PI/180),n=i*(t.getNorthEast().lng-t.getSouthWest().lng)/180,o=this._map.getSize(),s=this.options,a=0;o.x>0&&(a=n*(s.maxWidth/o.x)),this._updateScales(s,a)},_updateScales:function(t,e){t.metric&&e&&this._updateMetric(e),t.imperial&&e&&this._updateImperial(e)},_updateMetric:function(t){var e=this._getRoundNum(t);this._mScale.style.width=this._getScaleWidth(e/t)+"px",this._mScale.innerHTML=1e3>e?e+" m":e/1e3+" km"},_updateImperial:function(t){var e,i,n,o=3.2808399*t,s=this._iScale;o>5280?(e=o/5280,i=this._getRoundNum(e),s.style.width=this._getScaleWidth(i/e)+"px",s.innerHTML=i+" mi"):(n=this._getRoundNum(o),s.style.width=this._getScaleWidth(n/o)+"px",s.innerHTML=n+" ft")},_getScaleWidth:function(t){return Math.round(this.options.maxWidth*t)-10},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),i=t/e;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,e*i}}),o.control.scale=function(t){return new o.Control.Scale(t)},o.Control.Layers=o.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0},initialize:function(t,e,i){o.setOptions(this,i),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var n in t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(t){return this._initLayout(),this._update(),t.on("layeradd",this._onLayerChange,this).on("layerremove",this._onLayerChange,this),this._container},onRemove:function(t){t.off("layeradd",this._onLayerChange,this).off("layerremove",this._onLayerChange,this)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._update(),this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._update(),this},removeLayer:function(t){var e=o.stamp(t);return delete this._layers[e],this._update(),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=o.DomUtil.create("div",t);e.setAttribute("aria-haspopup",!0),o.Browser.touch?o.DomEvent.on(e,"click",o.DomEvent.stopPropagation):o.DomEvent.disableClickPropagation(e).disableScrollPropagation(e);var i=this._form=o.DomUtil.create("form",t+"-list");if(this.options.collapsed){o.Browser.android||o.DomEvent.on(e,"mouseover",this._expand,this).on(e,"mouseout",this._collapse,this);var n=this._layersLink=o.DomUtil.create("a",t+"-toggle",e);n.href="#",n.title="Layers",o.Browser.touch?o.DomEvent.on(n,"click",o.DomEvent.stop).on(n,"click",this._expand,this):o.DomEvent.on(n,"focus",this._expand,this),o.DomEvent.on(i,"click",function(){setTimeout(o.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=o.DomUtil.create("div",t+"-base",i),this._separator=o.DomUtil.create("div",t+"-separator",i),this._overlaysList=o.DomUtil.create("div",t+"-overlays",i),e.appendChild(i)},_addLayer:function(t,e,i){var n=o.stamp(t);this._layers[n]={layer:t,name:e,overlay:i},this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex))},_update:function(){if(this._container){this._baseLayersList.innerHTML="",this._overlaysList.innerHTML="";var t,e,i=!1,n=!1;for(t in this._layers)e=this._layers[t],this._addItem(e),n=n||e.overlay,i=i||!e.overlay;this._separator.style.display=n&&i?"":"none"}},_onLayerChange:function(t){var e=this._layers[o.stamp(t.layer)];if(e){this._handlingClick||this._update();var i=e.overlay?"layeradd"===t.type?"overlayadd":"overlayremove":"layeradd"===t.type?"baselayerchange":null;i&&this._map.fire(i,e)}},_createRadioElement:function(t,i){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"';i&&(n+=' checked="checked"'),n+="/>";var o=e.createElement("div");return o.innerHTML=n,o.firstChild},_addItem:function(t){var i,n=e.createElement("label"),s=this._map.hasLayer(t.layer);t.overlay?(i=e.createElement("input"),i.type="checkbox",i.className="leaflet-control-layers-selector",i.defaultChecked=s):i=this._createRadioElement("leaflet-base-layers",s),i.layerId=o.stamp(t.layer),o.DomEvent.on(i,"click",this._onInputClick,this);var a=e.createElement("span");a.innerHTML=" "+t.name,n.appendChild(i),n.appendChild(a);var r=t.overlay?this._overlaysList:this._baseLayersList;return r.appendChild(n),n},_onInputClick:function(){var t,e,i,n=this._form.getElementsByTagName("input"),o=n.length;for(this._handlingClick=!0,t=0;o>t;t++)e=n[t],i=this._layers[e.layerId],e.checked&&!this._map.hasLayer(i.layer)?this._map.addLayer(i.layer):!e.checked&&this._map.hasLayer(i.layer)&&this._map.removeLayer(i.layer);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){o.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){this._container.className=this._container.className.replace(" leaflet-control-layers-expanded","")}}),o.control.layers=function(t,e,i){return new o.Control.Layers(t,e,i)},o.PosAnimation=o.Class.extend({includes:o.Mixin.Events,run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._newPos=e,this.fire("start"),t.style[o.DomUtil.TRANSITION]="all "+(i||.25)+"s cubic-bezier(0,0,"+(n||.5)+",1)",o.DomEvent.on(t,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),o.DomUtil.setPosition(t,e),o.Util.falseFn(t.offsetWidth),this._stepTimer=setInterval(o.bind(this._onStep,this),50)},stop:function(){this._inProgress&&(o.DomUtil.setPosition(this._el,this._getPos()),this._onTransitionEnd(),o.Util.falseFn(this._el.offsetWidth))},_onStep:function(){var t=this._getPos();return t?(this._el._leaflet_pos=t,void this.fire("step")):void this._onTransitionEnd()},_transformRe:/([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,_getPos:function(){var e,i,n,s=this._el,a=t.getComputedStyle(s);if(o.Browser.any3d){if(n=a[o.DomUtil.TRANSFORM].match(this._transformRe),!n)return;e=parseFloat(n[1]),i=parseFloat(n[2])}else e=parseFloat(a.left),i=parseFloat(a.top);return new o.Point(e,i,!0)},_onTransitionEnd:function(){o.DomEvent.off(this._el,o.DomUtil.TRANSITION_END,this._onTransitionEnd,this),this._inProgress&&(this._inProgress=!1,this._el.style[o.DomUtil.TRANSITION]="",this._el._leaflet_pos=this._newPos,clearInterval(this._stepTimer),this.fire("step").fire("end"))}}),o.Map.include({setView:function(t,e,n){if(e=e===i?this._zoom:this._limitZoom(e),t=this._limitCenter(o.latLng(t),e,this.options.maxBounds),n=n||{},this._panAnim&&this._panAnim.stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==i&&(n.zoom=o.extend({animate:n.animate},n.zoom),n.pan=o.extend({animate:n.animate},n.pan));var s=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,n.zoom):this._tryAnimatedPan(t,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e),this},panBy:function(t,e){if(t=o.point(t).round(),e=e||{},!t.x&&!t.y)return this;if(this._panAnim||(this._panAnim=new o.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){o.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(t);this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){o.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var i=this._getCenterOffset(t)._floor();return(e&&e.animate)===!0||this.getSize().contains(i)?(this.panBy(i,e),!0):!1}}),o.PosAnimation=o.DomUtil.TRANSITION?o.PosAnimation:o.PosAnimation.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=o.DomUtil.getPosition(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(),this._complete())},_animate:function(){this._animId=o.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(){var t=+new Date-this._startTime,e=1e3*this._duration;e>t?this._runFrame(this._easeOut(t/e)):(this._runFrame(1),this._complete())},_runFrame:function(t){var e=this._startPos.add(this._offset.multiplyBy(t));o.DomUtil.setPosition(this._el,e),this.fire("step")},_complete:function(){o.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),o.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4}),o.DomUtil.TRANSITION&&o.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation&&o.DomUtil.TRANSITION&&o.Browser.any3d&&!o.Browser.android23&&!o.Browser.mobileOpera,this._zoomAnimated&&o.DomEvent.on(this._mapPane,o.DomUtil.TRANSITION_END,this._catchTransitionEnd,this)}),o.Map.include(o.DomUtil.TRANSITION?{_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),o=this._getCenterOffset(t)._divideBy(1-1/n),s=this._getCenterLayerPoint()._add(o);return i.animate===!0||this.getSize().contains(o)?(this.fire("movestart").fire("zoomstart"),this._animateZoom(t,e,s,n,null,!0),!0):!1},_animateZoom:function(t,e,i,n,s,a,r){r||(this._animatingZoom=!0),o.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim"),this._animateToCenter=t,this._animateToZoom=e,o.Draggable&&(o.Draggable._disabled=!0),o.Util.requestAnimFrame(function(){this.fire("zoomanim",{center:t,zoom:e,origin:i,scale:n,delta:s,backwards:a})},this)},_onZoomTransitionEnd:function(){this._animatingZoom=!1,o.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0),o.Draggable&&(o.Draggable._disabled=!1)}}:{}),o.TileLayer.include({_animateZoom:function(t){this._animating||(this._animating=!0,this._prepareBgBuffer());var e=this._bgBuffer,i=o.DomUtil.TRANSFORM,n=t.delta?o.DomUtil.getTranslateString(t.delta):e.style[i],s=o.DomUtil.getScaleString(t.scale,t.origin);e.style[i]=t.backwards?s+" "+n:n+" "+s},_endZoomAnim:function(){var t=this._tileContainer,e=this._bgBuffer;t.style.visibility="",t.parentNode.appendChild(t),o.Util.falseFn(e.offsetWidth),this._animating=!1},_clearBgBuffer:function(){var t=this._map;!t||t._animatingZoom||t.touchZoom._zooming||(this._bgBuffer.innerHTML="",this._bgBuffer.style[o.DomUtil.TRANSFORM]="")},_prepareBgBuffer:function(){var t=this._tileContainer,e=this._bgBuffer,i=this._getLoadedTilesPercentage(e),n=this._getLoadedTilesPercentage(t);return e&&i>.5&&.5>n?(t.style.visibility="hidden",void this._stopLoadingImages(t)):(e.style.visibility="hidden",e.style[o.DomUtil.TRANSFORM]="",this._tileContainer=e,e=this._bgBuffer=t,this._stopLoadingImages(e),void clearTimeout(this._clearBgBufferTimer))},_getLoadedTilesPercentage:function(t){var e,i,n=t.getElementsByTagName("img"),o=0;for(e=0,i=n.length;i>e;e++)n[e].complete&&o++;return o/i},_stopLoadingImages:function(t){var e,i,n,s=Array.prototype.slice.call(t.getElementsByTagName("img"));for(e=0,i=s.length;i>e;e++)n=s[e],n.complete||(n.onload=o.Util.falseFn,n.onerror=o.Util.falseFn,n.src=o.Util.emptyImageUrl,n.parentNode.removeChild(n))}}),o.Map.include({_defaultLocateOptions:{watch:!1,setView:!1,maxZoom:1/0,timeout:1e4,maximumAge:0,enableHighAccuracy:!1},locate:function(t){if(t=this._locateOptions=o.extend(this._defaultLocateOptions,t),!navigator.geolocation)return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=o.bind(this._handleGeolocationResponse,this),i=o.bind(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){var e=t.code,i=t.message||(1===e?"permission denied":2===e?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+i+"."})},_handleGeolocationResponse:function(t){var e=t.coords.latitude,i=t.coords.longitude,n=new o.LatLng(e,i),s=180*t.coords.accuracy/40075017,a=s/Math.cos(o.LatLng.DEG_TO_RAD*e),r=o.latLngBounds([e-s,i-a],[e+s,i+a]),h=this._locateOptions;if(h.setView){var l=Math.min(this.getBoundsZoom(r),h.maxZoom);this.setView(n,l)}var u={latlng:n,bounds:r,timestamp:t.timestamp};for(var c in t.coords)"number"==typeof t.coords[c]&&(u[c]=t.coords[c]);this.fire("locationfound",u)}})}(window,document);;/*
 Leaflet.markercluster, Provides Beautiful Animated Marker Clustering functionality for Leaflet, a JS library for interactive maps.
 https://github.com/Leaflet/Leaflet.markercluster
 (c) 2012-2013, Dave Leaver, smartrak
*/
!function(t,e){L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,polygonOptions:{}},initialize:function(t){L.Util.setOptions(this,t),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[]},addLayer:function(t){if(t instanceof L.LayerGroup){var e=[];for(var i in t._layers)e.push(t._layers[i]);return this.addLayers(e)}if(!t.getLatLng)return this._nonPointGroup.addLayer(t),this;if(!this._map)return this._needsClustering.push(t),this;if(this.hasLayer(t))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(t,this._maxZoom);var n=t,s=this._map.getZoom();if(t.__parent)for(;n.__parent._zoom>=s;)n=n.__parent;return this._currentShownBounds.contains(n.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(t,n):this._animationAddLayerNonAnimated(t,n)),this},removeLayer:function(t){if(t instanceof L.LayerGroup){var e=[];for(var i in t._layers)e.push(t._layers[i]);return this.removeLayers(e)}return t.getLatLng?this._map?t.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(t)),this._removeLayer(t,!0),this._featureGroup.hasLayer(t)&&(this._featureGroup.removeLayer(t),t.setOpacity&&t.setOpacity(1)),this):this:(!this._arraySplice(this._needsClustering,t)&&this.hasLayer(t)&&this._needsRemoving.push(t),this):(this._nonPointGroup.removeLayer(t),this)},addLayers:function(t){var e,i,n,s=this._map,r=this._featureGroup,o=this._nonPointGroup;for(e=0,i=t.length;i>e;e++)if(n=t[e],n.getLatLng){if(!this.hasLayer(n))if(s){if(this._addLayer(n,this._maxZoom),n.__parent&&2===n.__parent.getChildCount()){var a=n.__parent.getAllChildMarkers(),h=a[0]===n?a[1]:a[0];r.removeLayer(h)}}else this._needsClustering.push(n)}else o.addLayer(n);return s&&(r.eachLayer(function(t){t instanceof L.MarkerCluster&&t._iconNeedsUpdate&&t._updateIcon()}),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)),this},removeLayers:function(t){var e,i,n,s=this._featureGroup,r=this._nonPointGroup;if(!this._map){for(e=0,i=t.length;i>e;e++)n=t[e],this._arraySplice(this._needsClustering,n),r.removeLayer(n);return this}for(e=0,i=t.length;i>e;e++)n=t[e],n.__parent?(this._removeLayer(n,!0,!0),s.hasLayer(n)&&(s.removeLayer(n),n.setOpacity&&n.setOpacity(1))):r.removeLayer(n);return this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),s.eachLayer(function(t){t instanceof L.MarkerCluster&&t._updateIcon()}),this},clearLayers:function(){return this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(t){delete t.__parent}),this._map&&this._generateInitialClusters(),this},getBounds:function(){var t=new L.LatLngBounds;if(this._topClusterLevel)t.extend(this._topClusterLevel._bounds);else for(var e=this._needsClustering.length-1;e>=0;e--)t.extend(this._needsClustering[e].getLatLng());return t.extend(this._nonPointGroup.getBounds()),t},eachLayer:function(t,e){var i,n=this._needsClustering.slice();for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(n),i=n.length-1;i>=0;i--)t.call(e,n[i]);this._nonPointGroup.eachLayer(t,e)},getLayers:function(){var t=[];return this.eachLayer(function(e){t.push(e)}),t},getLayer:function(t){var e=null;return this.eachLayer(function(i){L.stamp(i)===t&&(e=i)}),e},hasLayer:function(t){if(!t)return!1;var e,i=this._needsClustering;for(e=i.length-1;e>=0;e--)if(i[e]===t)return!0;for(i=this._needsRemoving,e=i.length-1;e>=0;e--)if(i[e]===t)return!1;return!(!t.__parent||t.__parent._group!==this)||this._nonPointGroup.hasLayer(t)},zoomToShowLayer:function(t,e){var i=function(){if((t._icon||t.__parent._icon)&&!this._inZoomAnimation)if(this._map.off("moveend",i,this),this.off("animationend",i,this),t._icon)e();else if(t.__parent._icon){var n=function(){this.off("spiderfied",n,this),e()};this.on("spiderfied",n,this),t.__parent.spiderfy()}};t._icon&&this._map.getBounds().contains(t.getLatLng())?e():t.__parent._zoom<this._map.getZoom()?(this._map.on("moveend",i,this),this._map.panTo(t.getLatLng())):(this._map.on("moveend",i,this),this.on("animationend",i,this),this._map.setView(t.getLatLng(),t.__parent._zoom+1),t.__parent.zoomToBounds())},onAdd:function(t){this._map=t;var e,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.onAdd(t),this._nonPointGroup.onAdd(t),this._gridClusters||this._generateInitialClusters(),e=0,i=this._needsRemoving.length;i>e;e++)n=this._needsRemoving[e],this._removeLayer(n,!0);for(this._needsRemoving=[],e=0,i=this._needsClustering.length;i>e;e++)n=this._needsClustering[e],n.getLatLng?n.__parent||this._addLayer(n,this._maxZoom):this._featureGroup.addLayer(n);this._needsClustering=[],this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),this._zoom=this._map.getZoom(),this._currentShownBounds=this._getExpandedVisibleBounds(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)},onRemove:function(t){t.off("zoomend",this._zoomEnd,this),t.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),this._hideCoverage(),this._featureGroup.onRemove(t),this._nonPointGroup.onRemove(t),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(t){for(var e=t;e&&!e._icon;)e=e.__parent;return e||null},_arraySplice:function(t,e){for(var i=t.length-1;i>=0;i--)if(t[i]===e)return t.splice(i,1),!0},_removeLayer:function(t,e,i){var n=this._gridClusters,s=this._gridUnclustered,r=this._featureGroup,o=this._map;if(e)for(var a=this._maxZoom;a>=0&&s[a].removeObject(t,o.project(t.getLatLng(),a));a--);var h,_=t.__parent,u=_._markers;for(this._arraySplice(u,t);_&&(_._childCount--,!(_._zoom<0));)e&&_._childCount<=1?(h=_._markers[0]===t?_._markers[1]:_._markers[0],n[_._zoom].removeObject(_,o.project(_._cLatLng,_._zoom)),s[_._zoom].addObject(h,o.project(h.getLatLng(),_._zoom)),this._arraySplice(_.__parent._childClusters,_),_.__parent._markers.push(h),h.__parent=_.__parent,_._icon&&(r.removeLayer(_),i||r.addLayer(h))):(_._recalculateBounds(),i&&_._icon||_._updateIcon()),_=_.__parent;delete t.__parent},_isOrIsParent:function(t,e){for(;e;){if(t===e)return!0;e=e.parentNode}return!1},_propagateEvent:function(t){if(t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;t.type="cluster"+t.type}this.fire(t.type,t)},_defaultIconCreateFunction:function(t){var e=t.getChildCount(),i=" marker-cluster-";return i+=10>e?"small":100>e?"medium":"large",new L.DivIcon({html:"<div><span>"+e+"</span></div>",className:"marker-cluster"+i,iconSize:new L.Point(40,40)})},_bindEvents:function(){var t=this._map,e=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(e||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),t.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(t){var e=this._map;e.getMaxZoom()===e.getZoom()?this.options.spiderfyOnMaxZoom&&t.layer.spiderfy():this.options.zoomToBoundsOnClick&&t.layer.zoomToBounds(),t.originalEvent&&13===t.originalEvent.keyCode&&e._container.focus()},_showCoverage:function(t){var e=this._map;this._inZoomAnimation||(this._shownPolygon&&e.removeLayer(this._shownPolygon),t.layer.getChildCount()>2&&t.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(t.layer.getConvexHull(),this.options.polygonOptions),e.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var t=this.options.spiderfyOnMaxZoom,e=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(t||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),e&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=this._map._zoom,this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var t=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._map._zoom,t),this._currentShownBounds=t}},_generateInitialClusters:function(){var t=this._map.getMaxZoom(),e=this.options.maxClusterRadius;this.options.disableClusteringAtZoom&&(t=this.options.disableClusteringAtZoom-1),this._maxZoom=t,this._gridClusters={},this._gridUnclustered={};for(var i=t;i>=0;i--)this._gridClusters[i]=new L.DistanceGrid(e),this._gridUnclustered[i]=new L.DistanceGrid(e);this._topClusterLevel=new L.MarkerCluster(this,-1)},_addLayer:function(t,e){var i,n,s=this._gridClusters,r=this._gridUnclustered;for(this.options.singleMarkerMode&&(t.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[t]}}));e>=0;e--){i=this._map.project(t.getLatLng(),e);var o=s[e].getNearObject(i);if(o)return o._addChild(t),t.__parent=o,void 0;if(o=r[e].getNearObject(i)){var a=o.__parent;a&&this._removeLayer(o,!1);var h=new L.MarkerCluster(this,e,o,t);s[e].addObject(h,this._map.project(h._cLatLng,e)),o.__parent=h,t.__parent=h;var _=h;for(n=e-1;n>a._zoom;n--)_=new L.MarkerCluster(this,n,_),s[n].addObject(_,this._map.project(o.getLatLng(),n));for(a._addChild(_),n=e;n>=0&&r[n].removeObject(o,this._map.project(o.getLatLng(),n));n--);return}r[e].addObject(t,i)}this._topClusterLevel._addChild(t),t.__parent=this._topClusterLevel},_enqueue:function(t){this._queue.push(t),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var t=0;t<this._queue.length;t++)this._queue[t].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){this._processQueue(),this._zoom<this._map._zoom&&this._currentShownBounds.contains(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,this._map._zoom)):this._zoom>this._map._zoom?(this._animationStart(),this._animationZoomOut(this._zoom,this._map._zoom)):this._moveEnd()},_getExpandedVisibleBounds:function(){if(!this.options.removeOutsideVisibleBounds)return this.getBounds();var t=this._map,e=t.getBounds(),i=e._southWest,n=e._northEast,s=L.Browser.mobile?0:Math.abs(i.lat-n.lat),r=L.Browser.mobile?0:Math.abs(i.lng-n.lng);return new L.LatLngBounds(new L.LatLng(i.lat-s,i.lng-r,!0),new L.LatLng(n.lat+s,n.lng+r,!0))},_animationAddLayerNonAnimated:function(t,e){if(e===t)this._featureGroup.addLayer(t);else if(2===e._childCount){e._addToMap();var i=e.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else e._updateIcon()}}),L.MarkerClusterGroup.include(L.DomUtil.TRANSITION?{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_animationZoomIn:function(t,e){var i,n=this._getExpandedVisibleBounds(),s=this._featureGroup;this._topClusterLevel._recursively(n,t,0,function(r){var o,a=r._latlng,h=r._markers;for(n.contains(a)||(a=null),r._isSingleParent()&&t+1===e?(s.removeLayer(r),r._recursivelyAddChildrenToMap(null,e,n)):(r.setOpacity(0),r._recursivelyAddChildrenToMap(a,e,n)),i=h.length-1;i>=0;i--)o=h[i],n.contains(o._latlng)||s.removeLayer(o)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(n,e),s.eachLayer(function(t){t instanceof L.MarkerCluster||!t._icon||t.setOpacity(1)}),this._topClusterLevel._recursively(n,t,e,function(t){t._recursivelyRestoreChildPositions(e)}),this._enqueue(function(){this._topClusterLevel._recursively(n,t,0,function(t){s.removeLayer(t),t.setOpacity(1)}),this._animationEnd()})},_animationZoomOut:function(t,e){this._animationZoomOutSingle(this._topClusterLevel,t-1,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t,this._getExpandedVisibleBounds())},_animationZoomOutSingle:function(t,e,i){var n=this._getExpandedVisibleBounds();t._recursivelyAnimateChildrenInAndAddSelfToMap(n,e+1,i);var s=this;this._forceLayout(),t._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(1===t._childCount){var r=t._markers[0];r.setLatLng(r.getLatLng()),r.setOpacity(1)}else t._recursively(n,i,0,function(t){t._recursivelyRemoveChildrenFromMap(n,e+1)});s._animationEnd()})},_animationAddLayer:function(t,e){var i=this,n=this._featureGroup;n.addLayer(t),e!==t&&(e._childCount>2?(e._updateIcon(),this._forceLayout(),this._animationStart(),t._setPos(this._map.latLngToLayerPoint(e.getLatLng())),t.setOpacity(0),this._enqueue(function(){n.removeLayer(t),t.setOpacity(1),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(e,this._map.getMaxZoom(),this._map.getZoom())))},_forceLayout:function(){L.Util.falseFn(e.body.offsetWidth)}}:{_animationStart:function(){},_animationZoomIn:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds())},_animationZoomOut:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds())},_animationAddLayer:function(t,e){this._animationAddLayerNonAnimated(t,e)}}),L.markerClusterGroup=function(t){return new L.MarkerClusterGroup(t)},L.MarkerCluster=L.Marker.extend({initialize:function(t,e,i,n){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this}),this._group=t,this._zoom=e,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(t){t=t||[];for(var e=this._childClusters.length-1;e>=0;e--)this._childClusters[e].getAllChildMarkers(t);for(var i=this._markers.length-1;i>=0;i--)t.push(this._markers[i]);return t},getChildCount:function(){return this._childCount},zoomToBounds:function(){for(var t,e=this._childClusters.slice(),i=this._group._map,n=i.getBoundsZoom(this._bounds),s=this._zoom+1,r=i.getZoom();e.length>0&&n>s;){s++;var o=[];for(t=0;t<e.length;t++)o=o.concat(e[t]._childClusters);e=o}n>s?this._group._map.setView(this._latlng,s):r>=n?this._group._map.setView(this._latlng,r+1):this._group._map.fitBounds(this._bounds)},getBounds:function(){var t=new L.LatLngBounds;return t.extend(this._bounds),t},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(t,e){this._iconNeedsUpdate=!0,this._expandBounds(t),t instanceof L.MarkerCluster?(e||(this._childClusters.push(t),t.__parent=this),this._childCount+=t._childCount):(e||this._markers.push(t),this._childCount++),this.__parent&&this.__parent._addChild(t,!0)},_expandBounds:function(t){var e,i=t._wLatLng||t._latlng;t instanceof L.MarkerCluster?(this._bounds.extend(t._bounds),e=t._childCount):(this._bounds.extend(i),e=1),this._cLatLng||(this._cLatLng=t._cLatLng||i);var n=this._childCount+e;this._wLatLng?(this._wLatLng.lat=(i.lat*e+this._wLatLng.lat*this._childCount)/n,this._wLatLng.lng=(i.lng*e+this._wLatLng.lng*this._childCount)/n):this._latlng=this._wLatLng=new L.LatLng(i.lat,i.lng)},_addToMap:function(t){t&&(this._backupLatlng=this._latlng,this.setLatLng(t)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(t,e,i){this._recursively(t,0,i-1,function(t){var i,n,s=t._markers;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))},function(t){var i,n,s=t._childClusters;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(t,e,i){this._recursively(t,i,0,function(n){n._recursivelyAnimateChildrenIn(t,n._group._map.latLngToLayerPoint(n.getLatLng()).round(),e),n._isSingleParent()&&e-1===i?(n.setOpacity(1),n._recursivelyRemoveChildrenFromMap(t,e)):n.setOpacity(0),n._addToMap()})},_recursivelyBecomeVisible:function(t,e){this._recursively(t,0,e,null,function(t){t.setOpacity(1)})},_recursivelyAddChildrenToMap:function(t,e,i){this._recursively(i,-1,e,function(n){if(e!==n._zoom)for(var s=n._markers.length-1;s>=0;s--){var r=n._markers[s];i.contains(r._latlng)&&(t&&(r._backupLatlng=r.getLatLng(),r.setLatLng(t),r.setOpacity&&r.setOpacity(0)),n._group._featureGroup.addLayer(r))}},function(e){e._addToMap(t)})},_recursivelyRestoreChildPositions:function(t){for(var e=this._markers.length-1;e>=0;e--){var i=this._markers[e];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(t-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var s=this._childClusters.length-1;s>=0;s--)this._childClusters[s]._recursivelyRestoreChildPositions(t)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(t,e,i){var n,s;this._recursively(t,-1,e-1,function(t){for(s=t._markers.length-1;s>=0;s--)n=t._markers[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))},function(t){for(s=t._childClusters.length-1;s>=0;s--)n=t._childClusters[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))})},_recursively:function(t,e,i,n,s){var r,o,a=this._childClusters,h=this._zoom;if(e>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s);else if(n&&n(this),s&&this._zoom===i&&s(this),i>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s)},_recalculateBounds:function(){var t,e=this._markers,i=this._childClusters;for(this._bounds=new L.LatLngBounds,delete this._wLatLng,t=e.length-1;t>=0;t--)this._expandBounds(e[t]);for(t=i.length-1;t>=0;t--)this._expandBounds(i[t])},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}}),L.DistanceGrid=function(t){this._cellSize=t,this._sqCellSize=t*t,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(t,e){var i=this._getCoord(e.x),n=this._getCoord(e.y),s=this._grid,r=s[n]=s[n]||{},o=r[i]=r[i]||[],a=L.Util.stamp(t);this._objectPoint[a]=e,o.push(t)},updateObject:function(t,e){this.removeObject(t),this.addObject(t,e)},removeObject:function(t,e){var i,n,s=this._getCoord(e.x),r=this._getCoord(e.y),o=this._grid,a=o[r]=o[r]||{},h=a[s]=a[s]||[];for(delete this._objectPoint[L.Util.stamp(t)],i=0,n=h.length;n>i;i++)if(h[i]===t)return h.splice(i,1),1===n&&delete a[s],!0},eachObject:function(t,e){var i,n,s,r,o,a,h,_=this._grid;for(i in _){o=_[i];for(n in o)for(a=o[n],s=0,r=a.length;r>s;s++)h=t.call(e,a[s]),h&&(s--,r--)}},getNearObject:function(t){var e,i,n,s,r,o,a,h,_=this._getCoord(t.x),u=this._getCoord(t.y),l=this._objectPoint,d=this._sqCellSize,p=null;for(e=u-1;u+1>=e;e++)if(s=this._grid[e])for(i=_-1;_+1>=i;i++)if(r=s[i])for(n=0,o=r.length;o>n;n++)a=r[n],h=this._sqDist(l[L.Util.stamp(a)],t),d>h&&(d=h,p=a);return p},_getCoord:function(t){return Math.floor(t/this._cellSize)},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n}},function(){L.QuickHull={getDistant:function(t,e){var i=e[1].lat-e[0].lat,n=e[0].lng-e[1].lng;return n*(t.lat-e[0].lat)+i*(t.lng-e[0].lng)},findMostDistantPointFromBaseLine:function(t,e){var i,n,s,r=0,o=null,a=[];for(i=e.length-1;i>=0;i--)n=e[i],s=this.getDistant(n,t),s>0&&(a.push(n),s>r&&(r=s,o=n));return{maxPoint:o,newPoints:a}},buildConvexHull:function(t,e){var i=[],n=this.findMostDistantPointFromBaseLine(t,e);return n.maxPoint?(i=i.concat(this.buildConvexHull([t[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,t[1]],n.newPoints))):[t[0]]},getConvexHull:function(t){var e,i=!1,n=!1,s=null,r=null;for(e=t.length-1;e>=0;e--){var o=t[e];(i===!1||o.lat>i)&&(s=o,i=o.lat),(n===!1||o.lat<n)&&(r=o,n=o.lat)}var a=[].concat(this.buildConvexHull([r,s],t),this.buildConvexHull([s,r],t));return a}}}(),L.MarkerCluster.include({getConvexHull:function(){var t,e,i=this.getAllChildMarkers(),n=[];for(e=i.length-1;e>=0;e--)t=i[e].getLatLng(),n.push(t);return L.QuickHull.getConvexHull(n)}}),L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var t,e=this.getAllChildMarkers(),i=this._group,n=i._map,s=n.latLngToLayerPoint(this._latlng);this._group._unspiderfy(),this._group._spiderfied=this,e.length>=this._circleSpiralSwitchover?t=this._generatePointsSpiral(e.length,s):(s.y+=10,t=this._generatePointsCircle(e.length,s)),this._animationSpiderfy(e,t)}},unspiderfy:function(t){this._group._inZoomAnimation||(this._animationUnspiderfy(t),this._group._spiderfied=null)},_generatePointsCircle:function(t,e){var i,n,s=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+t),r=s/this._2PI,o=this._2PI/t,a=[];for(a.length=t,i=t-1;i>=0;i--)n=this._circleStartAngle+i*o,a[i]=new L.Point(e.x+r*Math.cos(n),e.y+r*Math.sin(n))._round();return a},_generatePointsSpiral:function(t,e){var i,n=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthStart,s=this._group.options.spiderfyDistanceMultiplier*this._spiralFootSeparation,r=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthFactor,o=0,a=[];for(a.length=t,i=t-1;i>=0;i--)o+=s/n+5e-4*i,a[i]=new L.Point(e.x+n*Math.cos(o),e.y+n*Math.sin(o))._round(),n+=this._2PI*r/o;return a},_noanimationUnspiderfy:function(){var t,e,i=this._group,n=i._map,s=i._featureGroup,r=this.getAllChildMarkers();for(this.setOpacity(1),e=r.length-1;e>=0;e--)t=r[e],s.removeLayer(t),t._preSpiderfyLatlng&&(t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng),t.setZIndexOffset&&t.setZIndexOffset(0),t._spiderLeg&&(n.removeLayer(t._spiderLeg),delete t._spiderLeg);i._spiderfied=null}}),L.MarkerCluster.include(L.DomUtil.TRANSITION?{SVG_ANIMATION:function(){return e.createElementNS("http://www.w3.org/2000/svg","animate").toString().indexOf("SVGAnimate")>-1}(),_animationSpiderfy:function(t,i){var n,s,r,o,a=this,h=this._group,_=h._map,u=h._featureGroup,l=_.latLngToLayerPoint(this._latlng);for(n=t.length-1;n>=0;n--)s=t[n],s.setOpacity?(s.setZIndexOffset(1e6),s.setOpacity(0),u.addLayer(s),s._setPos(l)):u.addLayer(s);h._forceLayout(),h._animationStart();var d=L.Path.SVG?0:.3,p=L.Path.SVG_NS;for(n=t.length-1;n>=0;n--)if(o=_.layerPointToLatLng(i[n]),s=t[n],s._preSpiderfyLatlng=s._latlng,s.setLatLng(o),s.setOpacity&&s.setOpacity(1),r=new L.Polyline([a._latlng,o],{weight:1.5,color:"#222",opacity:d}),_.addLayer(r),s._spiderLeg=r,L.Path.SVG&&this.SVG_ANIMATION){var c=r._path.getTotalLength();r._path.setAttribute("stroke-dasharray",c+","+c);var m=e.createElementNS(p,"animate");m.setAttribute("attributeName","stroke-dashoffset"),m.setAttribute("begin","indefinite"),m.setAttribute("from",c),m.setAttribute("to",0),m.setAttribute("dur",.25),r._path.appendChild(m),m.beginElement(),m=e.createElementNS(p,"animate"),m.setAttribute("attributeName","stroke-opacity"),m.setAttribute("attributeName","stroke-opacity"),m.setAttribute("begin","indefinite"),m.setAttribute("from",0),m.setAttribute("to",.5),m.setAttribute("dur",.25),r._path.appendChild(m),m.beginElement()}if(a.setOpacity(.3),L.Path.SVG)for(this._group._forceLayout(),n=t.length-1;n>=0;n--)s=t[n]._spiderLeg,s.options.opacity=.5,s._path.setAttribute("stroke-opacity",.5);setTimeout(function(){h._animationEnd(),h.fire("spiderfied")},200)},_animationUnspiderfy:function(t){var e,i,n,s=this._group,r=s._map,o=s._featureGroup,a=t?r._latLngToNewLayerPoint(this._latlng,t.zoom,t.center):r.latLngToLayerPoint(this._latlng),h=this.getAllChildMarkers(),_=L.Path.SVG&&this.SVG_ANIMATION;for(s._animationStart(),this.setOpacity(1),i=h.length-1;i>=0;i--)e=h[i],e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng,e.setOpacity?(e._setPos(a),e.setOpacity(0)):o.removeLayer(e),_&&(n=e._spiderLeg._path.childNodes[0],n.setAttribute("to",n.getAttribute("from")),n.setAttribute("from",0),n.beginElement(),n=e._spiderLeg._path.childNodes[1],n.setAttribute("from",.5),n.setAttribute("to",0),n.setAttribute("stroke-opacity",0),n.beginElement(),e._spiderLeg._path.setAttribute("stroke-opacity",0)));setTimeout(function(){var t=0;for(i=h.length-1;i>=0;i--)e=h[i],e._spiderLeg&&t++;for(i=h.length-1;i>=0;i--)e=h[i],e._spiderLeg&&(e.setOpacity&&(e.setOpacity(1),e.setZIndexOffset(0)),t>1&&o.removeLayer(e),r.removeLayer(e._spiderLeg),delete e._spiderLeg);s._animationEnd()},200)}}:{_animationSpiderfy:function(t,e){var i,n,s,r,o=this._group,a=o._map,h=o._featureGroup;for(i=t.length-1;i>=0;i--)r=a.layerPointToLatLng(e[i]),n=t[i],n._preSpiderfyLatlng=n._latlng,n.setLatLng(r),n.setZIndexOffset&&n.setZIndexOffset(1e6),h.addLayer(n),s=new L.Polyline([this._latlng,r],{weight:1.5,color:"#222"}),a.addLayer(s),n._spiderLeg=s;this.setOpacity(.3),o.fire("spiderfied")},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerClusterGroup.include({_spiderfied:null,_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Path.SVG&&!L.Browser.touch&&this._map._initPathRoot()},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(t){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(t))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(t){this._spiderfied&&this._spiderfied.unspiderfy(t)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(t){t._spiderLeg&&(this._featureGroup.removeLayer(t),t.setOpacity(1),t.setZIndexOffset(0),this._map.removeLayer(t._spiderLeg),delete t._spiderLeg)}})}(window,document);;(function() {

"use strict";

angular.module("leaflet-directive", []).directive('leaflet', ["$q", "leafletData", "leafletMapDefaults", "leafletHelpers", "leafletEvents", function ($q, leafletData, leafletMapDefaults, leafletHelpers, leafletEvents) {
    var _leafletMap;
    return {
        restrict: "EA",
        replace: true,
        scope: {
            center         : '=center',
            defaults       : '=defaults',
            maxbounds      : '=maxbounds',
            bounds         : '=bounds',
            markers        : '=markers',
            legend         : '=legend',
            geojson        : '=geojson',
            paths          : '=paths',
            tiles          : '=tiles',
            layers         : '=layers',
            controls       : '=controls',
            decorations    : '=decorations',
            eventBroadcast : '=eventBroadcast'
        },
        transclude: true,
        template: '<div class="angular-leaflet-map"><div ng-transclude></div></div>',
        controller: ["$scope", function ($scope) {
            _leafletMap = $q.defer();
            this.getMap = function () {
                return _leafletMap.promise;
            };

            this.getLeafletScope = function() {
                return $scope;
            };
        }],

        link: function(scope, element, attrs) {
            var isDefined = leafletHelpers.isDefined,
                defaults = leafletMapDefaults.setDefaults(scope.defaults, attrs.id),
                genDispatchMapEvent = leafletEvents.genDispatchMapEvent,
                mapEvents = leafletEvents.getAvailableMapEvents();

            // Set width and height utility functions
            function updateWidth() {
                if (isNaN(attrs.width)) {
                    element.css('width', attrs.width);
                } else {
                    element.css('width', attrs.width + 'px');
                }
            }

            function updateHeight() {
                if (isNaN(attrs.height)) {
                    element.css('height', attrs.height);
                } else {
                    element.css('height', attrs.height + 'px');
                }
            }

            // If the width attribute defined update css
            // Then watch if bound property changes and update css
            if (isDefined(attrs.width)) {
                updateWidth();

                scope.$watch(
                    function () {
                        return element[0].getAttribute('width');
                    },
                    function () {
                        updateWidth();
                        map.invalidateSize();
                    });
            }

            // If the height attribute defined update css
            // Then watch if bound property changes and update css
            if (isDefined(attrs.height)) {
                updateHeight();

                scope.$watch(
                    function () {
                        return element[0].getAttribute('height');
                    },
                    function () {
                        updateHeight();
                        map.invalidateSize();
                    });
            }

            // Create the Leaflet Map Object with the options
            var map = new L.Map(element[0], leafletMapDefaults.getMapCreationDefaults(attrs.id));
            _leafletMap.resolve(map);

            if (!isDefined(attrs.center)) {
                map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
            }

            // If no layers nor tiles defined, set the default tileLayer
            if (!isDefined(attrs.tiles) && (!isDefined(attrs.layers))) {
                var tileLayerObj = L.tileLayer(defaults.tileLayer, defaults.tileLayerOptions);
                tileLayerObj.addTo(map);
                leafletData.setTiles(tileLayerObj, attrs.id);
            }

            // Set zoom control configuration
            if (isDefined(map.zoomControl) &&
                isDefined(defaults.zoomControlPosition)) {
                map.zoomControl.setPosition(defaults.zoomControlPosition);
            }

            if (isDefined(map.zoomControl) &&
                defaults.zoomControl===false) {
                map.zoomControl.removeFrom(map);
            }

            if (isDefined(map.zoomsliderControl) &&
                isDefined(defaults.zoomsliderControl) &&
                defaults.zoomsliderControl===false) {
                map.zoomsliderControl.removeFrom(map);
            }


            // if no event-broadcast attribute, all events are broadcasted
            if (!isDefined(attrs.eventBroadcast)) {
                var logic = "broadcast";
                for (var i = 0; i < mapEvents.length; i++) {
                    var eventName = mapEvents[i];
                    map.on(eventName, genDispatchMapEvent(scope, eventName, logic), {
                        eventName: eventName
                    });
                }
            }

            // Resolve the map object to the promises
            map.whenReady(function() {
                leafletData.setMap(map, attrs.id);
            });

            scope.$on('$destroy', function () {
                map.remove();
                leafletData.unresolveMap(attrs.id);
            });

            //Handle request to invalidate the map size 
	        //Up scope using $scope.$emit('invalidateSize') 
	        //Down scope using $scope.$broadcast('invalidateSize')
            scope.$on('invalidateSize', function() {
                map.invalidateSize();
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('center',
    ["$log", "$q", "$location", "$timeout", "leafletMapDefaults", "leafletHelpers", "leafletBoundsHelpers", "leafletEvents", function ($log, $q, $location, $timeout, leafletMapDefaults, leafletHelpers, leafletBoundsHelpers, leafletEvents) {

    var isDefined     = leafletHelpers.isDefined,
        isNumber      = leafletHelpers.isNumber,
        isSameCenterOnMap = leafletHelpers.isSameCenterOnMap,
        safeApply     = leafletHelpers.safeApply,
        isValidCenter = leafletHelpers.isValidCenter,
        isEmpty       = leafletHelpers.isEmpty,
        isUndefinedOrEmpty = leafletHelpers.isUndefinedOrEmpty;

    var shouldInitializeMapWithBounds = function(bounds, center) {
        return (isDefined(bounds) && !isEmpty(bounds)) && isUndefinedOrEmpty(center);
    };

    var _leafletCenter;
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function () {
            _leafletCenter = $q.defer();
            this.getCenter = function() {
                return _leafletCenter.promise;
            };
        },
        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
                centerModel   = leafletScope.center;

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);

                if (attrs.center.search("-") !== -1) {
                    $log.error('The "center" variable can\'t use a "-" on his key name: "' + attrs.center + '".');
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                } else if (shouldInitializeMapWithBounds(leafletScope.bounds, centerModel)) {
                    map.fitBounds(leafletBoundsHelpers.createLeafletBounds(leafletScope.bounds));
                    centerModel = map.getCenter();
                    safeApply(leafletScope, function (scope) {
                        scope.center = {
                            lat: map.getCenter().lat,
                            lng: map.getCenter().lng,
                            zoom: map.getZoom(),
                            autoDiscover: false
                        };
                    });
                    safeApply(leafletScope, function (scope) {
                        var mapBounds = map.getBounds();
                        var newScopeBounds = {
                            northEast: {
                                lat: mapBounds._northEast.lat,
                                lng: mapBounds._northEast.lng
                            },
                            southWest: {
                                lat: mapBounds._southWest.lat,
                                lng: mapBounds._southWest.lng
                            }
                        };
                        scope.bounds = newScopeBounds;
                    });
                } else if (!isDefined(centerModel)) {
                    $log.error('The "center" property is not defined in the main scope');
                    map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                    return;
                } else if (!(isDefined(centerModel.lat) && isDefined(centerModel.lng)) && !isDefined(centerModel.autoDiscover)) {
                    angular.copy(defaults.center, centerModel);
                }

                var urlCenterHash, mapReady;
                if (attrs.urlHashCenter === "yes") {
                    var extractCenterFromUrl = function() {
                        var search = $location.search();
                        var centerParam;
                        if (isDefined(search.c)) {
                            var cParam = search.c.split(":");
                            if (cParam.length === 3) {
                                centerParam = { lat: parseFloat(cParam[0]), lng: parseFloat(cParam[1]), zoom: parseInt(cParam[2], 10) };
                            }
                        }
                        return centerParam;
                    };
                    urlCenterHash = extractCenterFromUrl();

                    leafletScope.$on('$locationChangeSuccess', function(event) {
                        var scope = event.currentScope;
                        //$log.debug("updated location...");
                        var urlCenter = extractCenterFromUrl();
                        if (isDefined(urlCenter) && !isSameCenterOnMap(urlCenter, map)) {
                            //$log.debug("updating center model...", urlCenter);
                            scope.center = {
                                lat: urlCenter.lat,
                                lng: urlCenter.lng,
                                zoom: urlCenter.zoom
                            };
                        }
                    });
                }

                leafletScope.$watch("center", function(center) {
                    //$log.debug("updated center model...");
                    // The center from the URL has priority
                    if (isDefined(urlCenterHash)) {
                        angular.copy(urlCenterHash, center);
                        urlCenterHash = undefined;
                    }

                    if (!isValidCenter(center) && center.autoDiscover !== true) {
                        $log.warn("[AngularJS - Leaflet] invalid 'center'");
                        //map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        return;
                    }

                    if (center.autoDiscover === true) {
                        if (!isNumber(center.zoom)) {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                        }
                        if (isNumber(center.zoom) && center.zoom > defaults.center.zoom) {
                            map.locate({ setView: true, maxZoom: center.zoom });
                        } else if (isDefined(defaults.maxZoom)) {
                            map.locate({ setView: true, maxZoom: defaults.maxZoom });
                        } else {
                            map.locate({ setView: true });
                        }
                        return;
                    }

                    if (mapReady && isSameCenterOnMap(center, map)) {
                        //$log.debug("no need to update map again.");
                        return;
                    }

                    //$log.debug("updating map center...", center);
                    leafletScope.settingCenterFromScope = true;
                    map.setView([center.lat, center.lng], center.zoom);
                    leafletEvents.notifyCenterChangedToBounds(leafletScope, map);
                    $timeout(function() {
                        leafletScope.settingCenterFromScope = false;
                        //$log.debug("allow center scope updates");
                    });
                }, true);

                map.whenReady(function() {
                    mapReady = true;
                });

                map.on("moveend", function(/* event */) {
                    // Resolve the center after the first map position
                    _leafletCenter.resolve();
                    leafletEvents.notifyCenterUrlHashChanged(leafletScope, map, attrs, $location.search());
                    //$log.debug("updated center on map...");
                    if (isSameCenterOnMap(centerModel, map) || scope.settingCenterFromScope) {
                        //$log.debug("same center in model, no need to update again.");
                        return;
                    }
                    safeApply(leafletScope, function(scope) {
                        if (!leafletScope.settingCenterFromScope) {
                            //$log.debug("updating center model...", map.getCenter(), map.getZoom());
                            scope.center = {
                                lat: map.getCenter().lat,
                                lng: map.getCenter().lng,
                                zoom: map.getZoom(),
                                autoDiscover: false
                            };
                        }
                        leafletEvents.notifyCenterChangedToBounds(leafletScope, map);
                    });
                });

                if (centerModel.autoDiscover === true) {
                    map.on("locationerror", function() {
                        $log.warn("[AngularJS - Leaflet] The Geolocation API is unauthorized on this page.");
                        if (isValidCenter(centerModel)) {
                            map.setView([centerModel.lat, centerModel.lng], centerModel.zoom);
                            leafletEvents.notifyCenterChangedToBounds(leafletScope, map);
                        } else {
                            map.setView([defaults.center.lat, defaults.center.lng], defaults.center.zoom);
                            leafletEvents.notifyCenterChangedToBounds(leafletScope, map);
                        }
                    });
                }
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('tiles', ["$log", "leafletData", "leafletMapDefaults", "leafletHelpers", function ($log, leafletData, leafletMapDefaults, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                tiles = leafletScope.tiles;

            if (!isDefined(tiles) && !isDefined(tiles.url)) {
                $log.warn("[AngularJS - Leaflet] The 'tiles' definition doesn't have the 'url' property.");
                return;
            }

            controller.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id);
                var tileLayerObj;
                leafletScope.$watch("tiles", function(tiles) {
                    var tileLayerOptions = defaults.tileLayerOptions;
                    var tileLayerUrl = defaults.tileLayer;

                    // If no valid tiles are in the scope, remove the last layer
                    if (!isDefined(tiles.url) && isDefined(tileLayerObj)) {
                        map.removeLayer(tileLayerObj);
                        return;
                    }

                    // No leafletTiles object defined yet
                    if (!isDefined(tileLayerObj)) {
                        if (isDefined(tiles.options)) {
                            angular.copy(tiles.options, tileLayerOptions);
                        }

                        if (isDefined(tiles.url)) {
                            tileLayerUrl = tiles.url;
                        }

                        tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                        tileLayerObj.addTo(map);
                        leafletData.setTiles(tileLayerObj, attrs.id);
                        return;
                    }

                    // If the options of the tilelayer is changed, we need to redraw the layer
                    if (isDefined(tiles.url) && isDefined(tiles.options) && !angular.equals(tiles.options, tileLayerOptions)) {
                        map.removeLayer(tileLayerObj);
                        tileLayerOptions = defaults.tileLayerOptions;
                        angular.copy(tiles.options, tileLayerOptions);
                        tileLayerUrl = tiles.url;
                        tileLayerObj = L.tileLayer(tileLayerUrl, tileLayerOptions);
                        tileLayerObj.addTo(map);
                        leafletData.setTiles(tileLayerObj, attrs.id);
                        return;
                    }

                    // Only the URL of the layer is changed, update the tiles object
                    if (isDefined(tiles.url)) {
                        tileLayerObj.setUrl(tiles.url);
                    }
                }, true);
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('legend', ["$log", "$http", "leafletHelpers", "leafletLegendHelpers", function ($log, $http, leafletHelpers, leafletLegendHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isArray      = leafletHelpers.isArray,
                isDefined = leafletHelpers.isDefined,
                isFunction = leafletHelpers.isFunction,
                leafletScope = controller.getLeafletScope(),
                legend       = leafletScope.legend;

            var legendClass = legend.legendClass ? legend.legendClass : "legend";
            var position = legend.position || 'bottomright';
            var leafletLegend;

            controller.getMap().then(function(map) {
                leafletScope.$watch('legend', function (legend) {
                    if (!isDefined(legend.url) && (!isArray(legend.colors) || !isArray(legend.labels) || legend.colors.length !== legend.labels.length)) {
                        $log.warn("[AngularJS - Leaflet] legend.colors and legend.labels must be set.");
                    } else if(isDefined(legend.url)){
                        $log.info("[AngularJS - Leaflet] loading arcgis legend service.");
                    } else {
                        if (isDefined(leafletLegend)) {
						    leafletLegend.removeFrom(map);
						}
                        leafletLegend = L.control({ position: position });
                        leafletLegend.onAdd = leafletLegendHelpers.getOnAddArrayLegend(legend, legendClass);
                        leafletLegend.addTo(map);
                    }
                });

                leafletScope.$watch('legend.url', function(newURL) {
                    if(!isDefined(newURL)) {
                        return;
                    }
                    $http.get(newURL)
                        .success(function(legendData) {
                            if(isDefined(leafletLegend)) {
                                leafletLegendHelpers.updateArcGISLegend(leafletLegend.getContainer(),legendData);
                            } else {
                                leafletLegend = L.control({ position: position });
                                leafletLegend.onAdd = leafletLegendHelpers.getOnAddArcGISLegend(legendData, legendClass);
                                leafletLegend.addTo(map);
                            }
                            if(isDefined(legend.loadedData) && isFunction(legend.loadedData)) {
                                legend.loadedData();
                            }
                        })
                        .error(function() {
                            $log.warn('[AngularJS - Leaflet] legend.url not loaded.');
                        });
                });
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('geojson', ["$log", "$rootScope", "leafletData", "leafletHelpers", function ($log, $rootScope, leafletData, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var safeApply = leafletHelpers.safeApply,
                isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                leafletGeoJSON = {};

            controller.getMap().then(function(map) {
                leafletScope.$watch("geojson", function(geojson) {
                    if (isDefined(leafletGeoJSON) && map.hasLayer(leafletGeoJSON)) {
                        map.removeLayer(leafletGeoJSON);
                    }

                    if (!(isDefined(geojson) && isDefined(geojson.data))) {
                        return;
                    }

                    var resetStyleOnMouseout = geojson.resetStyleOnMouseout,
                        onEachFeature = geojson.onEachFeature;

                    if (!onEachFeature) {
                        onEachFeature = function(feature, layer) {
                            if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(geojson.label)) {
                                layer.bindLabel(feature.properties.description);
                            }

                            layer.on({
                                mouseover: function(e) {
                                    safeApply(leafletScope, function() {
                                        geojson.selected = feature;
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseover', e);
                                    });
                                },
                                mouseout: function(e) {
                                    if (resetStyleOnMouseout) {
                                        leafletGeoJSON.resetStyle(e.target);
                                    }
                                    safeApply(leafletScope, function() {
                                        geojson.selected = undefined;
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonMouseout', e);
                                    });
                                },
                                click: function(e) {
                                    safeApply(leafletScope, function() {
                                        geojson.selected = feature;
                                        $rootScope.$broadcast('leafletDirectiveMap.geojsonClick', geojson.selected, e);
                                    });
                                }
                            });
                        };
                    }

                    geojson.options = {
                        style: geojson.style,
                        filter: geojson.filter,
                        onEachFeature: onEachFeature,
                        pointToLayer: geojson.pointToLayer
                    };

                    leafletGeoJSON = L.geoJson(geojson.data, geojson.options);
                    leafletData.setGeoJSON(leafletGeoJSON, attrs.id);
                    leafletGeoJSON.addTo(map);
                });
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('layers', ["$log", "$q", "leafletData", "leafletHelpers", "leafletLayerHelpers", "leafletControlHelpers", function ($log, $q, leafletData, leafletHelpers, leafletLayerHelpers, leafletControlHelpers) {
    var _leafletLayers;

    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',
        controller: function () {
            _leafletLayers = $q.defer();
            this.getLayers = function() {
                return _leafletLayers.promise;
            };
        },
        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                leafletLayers = {},
                leafletScope  = controller.getLeafletScope(),
                layers = leafletScope.layers,
                createLayer = leafletLayerHelpers.createLayer,
                updateLayersControl = leafletControlHelpers.updateLayersControl,
                isLayersControlVisible = false;

            controller.getMap().then(function(map) {
                // Do we have a baselayers property?
                if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
                    // No baselayers property
                    $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                    return;
                }

                // We have baselayers to add to the map
                _leafletLayers.resolve(leafletLayers);
                leafletData.setLayers(leafletLayers, attrs.id);

                leafletLayers.baselayers = {};
                leafletLayers.overlays = {};

                var mapId = attrs.id;

                // Setup all baselayers definitions
                var oneVisibleLayer = false;
                for (var layerName in layers.baselayers) {
                    var newBaseLayer = createLayer(layers.baselayers[layerName]);
                    if (!isDefined(newBaseLayer)) {
                        delete layers.baselayers[layerName];
                        continue;
                    }
                    leafletLayers.baselayers[layerName] = newBaseLayer;
                    // Only add the visible layer to the map, layer control manages the addition to the map
                    // of layers in its control
                    if (layers.baselayers[layerName].top === true) {
                        map.addLayer(leafletLayers.baselayers[layerName]);
                        oneVisibleLayer = true;
                    }
                }

                // If there is no visible layer add first to the map
                if (!oneVisibleLayer && Object.keys(leafletLayers.baselayers).length > 0) {
                    map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                }

                // Setup the Overlays
                for (layerName in layers.overlays) {
                    if(layers.overlays[layerName].type === 'cartodb') {

                    }
                    var newOverlayLayer = createLayer(layers.overlays[layerName]);
                    if (!isDefined(newOverlayLayer)) {
                        delete layers.overlays[layerName];
                        continue;
                    }
                    leafletLayers.overlays[layerName] = newOverlayLayer;
                    // Only add the visible overlays to the map
                    if (layers.overlays[layerName].visible === true) {
                        map.addLayer(leafletLayers.overlays[layerName]);
                    }
                }

                // Watch for the base layers
                leafletScope.$watch('layers.baselayers', function(newBaseLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.baselayers) {
                        if (!isDefined(newBaseLayers[name])) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.baselayers[name])) {
                                map.removeLayer(leafletLayers.baselayers[name]);
                            }
                            delete leafletLayers.baselayers[name];
                        }
                    }
                    // add new layers
                    for (var newName in newBaseLayers) {
                        if (!isDefined(leafletLayers.baselayers[newName])) {
                            var testBaseLayer = createLayer(newBaseLayers[newName]);
                            if (isDefined(testBaseLayer)) {
                                leafletLayers.baselayers[newName] = testBaseLayer;
                                // Only add the visible layer to the map
                                if (newBaseLayers[newName].top === true) {
                                    map.addLayer(leafletLayers.baselayers[newName]);
                                }
                            }
                        }
                    }
                    if (Object.keys(leafletLayers.baselayers).length === 0) {
                        $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                        return;
                    }

                    //we have layers, so we need to make, at least, one active
                    var found = false;
                    // search for an active layer
                    for (var key in leafletLayers.baselayers) {
                        if (map.hasLayer(leafletLayers.baselayers[key])) {
                            found = true;
                            break;
                        }
                    }
                    // If there is no active layer make one active
                    if (!found) {
                        map.addLayer(leafletLayers.baselayers[Object.keys(layers.baselayers)[0]]);
                    }

                    // Only show the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, newBaseLayers, layers.overlays, leafletLayers);
                }, true);

                // Watch for the overlay layers
                leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
                    // Delete layers from the array
                    for (var name in leafletLayers.overlays) {
                        if (!isDefined(newOverlayLayers[name])) {
                            // Remove from the map if it's on it
                            if (map.hasLayer(leafletLayers.overlays[name])) {
                                map.removeLayer(leafletLayers.overlays[name]);
                            }
                            // TODO: Depending on the layer type we will have to delete what's included on it
                            delete leafletLayers.overlays[name];
                        }
                    }

                    // add new overlays
                    for (var newName in newOverlayLayers) {
                        if (!isDefined(leafletLayers.overlays[newName])) {
                            var testOverlayLayer = createLayer(newOverlayLayers[newName]);
                            if (isDefined(testOverlayLayer)) {
                                leafletLayers.overlays[newName] = testOverlayLayer;
                                if (newOverlayLayers[newName].visible === true) {
                                    map.addLayer(leafletLayers.overlays[newName]);
                                }
                            }
                        }

                        // check for the .visible property to hide/show overLayers
                        if (newOverlayLayers[newName].visible && !map.hasLayer(leafletLayers.overlays[newName])) {
                            map.addLayer(leafletLayers.overlays[newName]);
                        } else if (newOverlayLayers[newName].visible === false && map.hasLayer(leafletLayers.overlays[newName])) {
                            map.removeLayer(leafletLayers.overlays[newName]);
                        }
                    }

                    // Only add the layers switch selector control if we have more than one baselayer + overlay
                    isLayersControlVisible = updateLayersControl(map, mapId, isLayersControlVisible, layers.baselayers, newOverlayLayers, leafletLayers);
                }, true);
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('bounds', ["$log", "$timeout", "leafletHelpers", "leafletBoundsHelpers", function ($log, $timeout, leafletHelpers, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: [ 'leaflet', 'center' ],

        link: function(scope, element, attrs, controller) {
            var isDefined = leafletHelpers.isDefined,
                createLeafletBounds = leafletBoundsHelpers.createLeafletBounds,
                leafletScope = controller[0].getLeafletScope(),
                mapController = controller[0];

            var emptyBounds = function(bounds) {
                if (bounds._southWest.lat === 0 && bounds._southWest.lng === 0 && bounds._northEast.lat === 0 && bounds._northEast.lng === 0) {
                    return true;
                }
                return false;
            };

            mapController.getMap().then(function (map) {
                leafletScope.$on('boundsChanged', function (event) {
                    var scope = event.currentScope;
                    var bounds = map.getBounds();
                    //$log.debug('updated map bounds...', bounds);
                    if (emptyBounds(bounds) || scope.settingBoundsFromScope) {
                        return;
                    }
                    var newScopeBounds = {
                        northEast: {
                            lat: bounds._northEast.lat,
                            lng: bounds._northEast.lng
                        },
                        southWest: {
                            lat: bounds._southWest.lat,
                            lng: bounds._southWest.lng
                        }
                    };
                    if (!angular.equals(scope.bounds, newScopeBounds)) {
                        //$log.debug('Need to update scope bounds.');
                        scope.bounds = newScopeBounds;
                    }
                });
                leafletScope.$watch('bounds', function (bounds) {
                    //$log.debug('updated bounds...', bounds);
                    if (!isDefined(bounds)) {
                        $log.error('[AngularJS - Leaflet] Invalid bounds');
                        return;
                    }
                    var leafletBounds = createLeafletBounds(bounds);
                    if (leafletBounds && !map.getBounds().equals(leafletBounds)) {
                        //$log.debug('Need to update map bounds.');
                        scope.settingBoundsFromScope = true;
                        map.fitBounds(leafletBounds);
                        $timeout( function() {
                            //$log.debug('Allow bound updates.');
                            scope.settingBoundsFromScope = false;
                        });
                    }
                }, true);
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('markers', ["$log", "$rootScope", "$q", "leafletData", "leafletHelpers", "leafletMapDefaults", "leafletMarkersHelpers", "leafletEvents", function ($log, $rootScope, $q, leafletData, leafletHelpers, leafletMapDefaults, leafletMarkersHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', '?layers'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                Helpers = leafletHelpers,
                isDefined = leafletHelpers.isDefined,
                isString = leafletHelpers.isString,
                leafletScope  = mapController.getLeafletScope(),
                deleteMarker = leafletMarkersHelpers.deleteMarker,
                addMarkerWatcher = leafletMarkersHelpers.addMarkerWatcher,
                listenMarkerEvents = leafletMarkersHelpers.listenMarkerEvents,
                addMarkerToGroup = leafletMarkersHelpers.addMarkerToGroup,
                bindMarkerEvents = leafletEvents.bindMarkerEvents,
                createMarker = leafletMarkersHelpers.createMarker;

            mapController.getMap().then(function(map) {
                var leafletMarkers = {},
                    getLayers;

                // If the layers attribute is used, we must wait until the layers are created
                if (isDefined(controller[1])) {
                    getLayers = controller[1].getLayers;
                } else {
                    getLayers = function() {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }

                getLayers().then(function(layers) {
                    leafletData.setMarkers(leafletMarkers, attrs.id);
                    leafletScope.$watch('markers', function(newMarkers) {
                        // Delete markers from the array
                        for (var name in leafletMarkers) {
                            if (!isDefined(newMarkers) || !isDefined(newMarkers[name])) {
                                deleteMarker(leafletMarkers[name], map, layers);
                                delete leafletMarkers[name];
                            }
                        }

                        // add new markers
                        for (var newName in newMarkers) {
                            if (newName.search("-") !== -1) {
                                $log.error('The marker can\'t use a "-" on his key name: "' + newName + '".');
                                continue;
                            }

                            if (!isDefined(leafletMarkers[newName])) {
                                var markerData = newMarkers[newName];
                                var marker = createMarker(markerData);
                                if (!isDefined(marker)) {
                                    $log.error('[AngularJS - Leaflet] Received invalid data on the marker ' + newName + '.');
                                    continue;
                                }
                                leafletMarkers[newName] = marker;

                                // Bind message
                                if (isDefined(markerData.message)) {
                                    marker.bindPopup(markerData.message, markerData.popupOptions);
                                }

                                // Add the marker to a cluster group if needed
                                if (isDefined(markerData.group)) {
                                    var groupOptions = isDefined(markerData.groupOption) ? markerData.groupOption : null;
                                    addMarkerToGroup(marker, markerData.group, groupOptions, map);
                                }

                                // Show label if defined
                                if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message)) {
                                    marker.bindLabel(markerData.label.message, markerData.label.options);
                                }

                                // Check if the marker should be added to a layer
                                if (isDefined(markerData) && isDefined(markerData.layer)) {
                                    if (!isString(markerData.layer)) {
                                        $log.error('[AngularJS - Leaflet] A layername must be a string');
                                        continue;
                                    }
                                    if (!isDefined(layers)) {
                                        $log.error('[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.');
                                        continue;
                                    }

                                    if (!isDefined(layers.overlays) || !isDefined(layers.overlays[markerData.layer])) {
                                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                        continue;
                                    }
                                    var layerGroup = layers.overlays[markerData.layer];
                                    if (!(layerGroup instanceof L.LayerGroup || layerGroup instanceof L.FeatureGroup)) {
                                        $log.error('[AngularJS - Leaflet] Adding a marker to an overlay needs a overlay of the type "group" or "featureGroup"');
                                        continue;
                                    }

                                    // The marker goes to a correct layer group, so first of all we add it
                                    layerGroup.addLayer(marker);

                                    // The marker is automatically added to the map depending on the visibility
                                    // of the layer, so we only have to open the popup if the marker is in the map
                                    if (map.hasLayer(marker) && markerData.focus === true) {
                                        marker.openPopup();
                                    }

                                // Add the marker to the map if it hasn't been added to a layer or to a group
                                } else if (!isDefined(markerData.group)) {
                                    // We do not have a layer attr, so the marker goes to the map layer
                                    map.addLayer(marker);
                                    if (markerData.focus === true) {
                                        marker.openPopup();
                                    }
                                    if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.options) && markerData.label.options.noHide === true) {
                                        marker.showLabel();
                                    }
                                }

                                // Should we watch for every specific marker on the map?
                                var shouldWatch = (!isDefined(attrs.watchMarkers) || attrs.watchMarkers === 'true');

                                if (shouldWatch) {
                                    addMarkerWatcher(marker, newName, leafletScope, layers, map);
                                    listenMarkerEvents(marker, markerData, leafletScope);
                                }
                                bindMarkerEvents(marker, newName, markerData, leafletScope);
                            }
                        }
                    }, true);
                });
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('paths', ["$log", "$q", "leafletData", "leafletMapDefaults", "leafletHelpers", "leafletPathsHelpers", "leafletEvents", function ($log, $q, leafletData, leafletMapDefaults, leafletHelpers, leafletPathsHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: ['leaflet', '?layers'],

        link: function(scope, element, attrs, controller) {
            var mapController = controller[0],
                isDefined = leafletHelpers.isDefined,
                isString = leafletHelpers.isString,
                leafletScope  = mapController.getLeafletScope(),
                paths     = leafletScope.paths,
                createPath = leafletPathsHelpers.createPath,
                bindPathEvents = leafletEvents.bindPathEvents,
                setPathOptions = leafletPathsHelpers.setPathOptions;

            mapController.getMap().then(function(map) {
                var defaults = leafletMapDefaults.getDefaults(attrs.id),
                    getLayers;

                // If the layers attribute is used, we must wait until the layers are created
                if (isDefined(controller[1])) {
                    getLayers = controller[1].getLayers;
                } else {
                    getLayers = function() {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    };
                }

                if (!isDefined(paths)) {
                    return;
                }

                getLayers().then(function(layers) {

                    var leafletPaths = {};
                    leafletData.setPaths(leafletPaths, attrs.id);

                    // Function for listening every single path once created
                    var watchPathFn = function(leafletPath, name) {
                        var clearWatch = leafletScope.$watch('paths.' + name, function(pathData) {
                            if (!isDefined(pathData)) {
                                map.removeLayer(leafletPath);
                                clearWatch();
                                return;
                            }
                            setPathOptions(leafletPath, pathData.type, pathData);
                        }, true);
                    };

                    leafletScope.$watch("paths", function (newPaths) {

                        // Create the new paths
                        for (var newName in newPaths) {
                            if (newName.search('\\$') === 0) {
                                continue;
                            }
                            if (newName.search("-") !== -1) {
                                $log.error('[AngularJS - Leaflet] The path name "' + newName + '" is not valid. It must not include "-" and a number.');
                                continue;
                            }

                            if (!isDefined(leafletPaths[newName])) {
                                var pathData = newPaths[newName];
                                var newPath = createPath(newName, newPaths[newName], defaults);

                                // bind popup if defined
                                if (isDefined(newPath) && isDefined(pathData.message)) {
                                    newPath.bindPopup(pathData.message);
                                }

                                // Show label if defined
                                if (leafletHelpers.LabelPlugin.isLoaded() && isDefined(pathData.label) && isDefined(pathData.label.message)) {
                                    newPath.bindLabel(pathData.label.message, pathData.label.options);
                                }

                                // Check if the marker should be added to a layer
                                if (isDefined(pathData) && isDefined(pathData.layer)) {

                                    if (!isString(pathData.layer)) {
                                        $log.error('[AngularJS - Leaflet] A layername must be a string');
                                        continue;
                                    }
                                    if (!isDefined(layers)) {
                                        $log.error('[AngularJS - Leaflet] You must add layers to the directive if the markers are going to use this functionality.');
                                        continue;
                                    }

                                    if (!isDefined(layers.overlays) || !isDefined(layers.overlays[pathData.layer])) {
                                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group"');
                                        continue;
                                    }
                                    var layerGroup = layers.overlays[pathData.layer];
                                    if (!(layerGroup instanceof L.LayerGroup || layerGroup instanceof L.FeatureGroup)) {
                                        $log.error('[AngularJS - Leaflet] Adding a marker to an overlay needs a overlay of the type "group" or "featureGroup"');
                                        continue;
                                    }

                                    // Listen for changes on the new path
                                    leafletPaths[newName] = newPath;
                                    // The path goes to a correct layer group, so first of all we add it
                                    layerGroup.addLayer(newPath);

                                    watchPathFn(newPath, newName);
                                } else if (isDefined(newPath)) {
                                    // Listen for changes on the new path
                                    leafletPaths[newName] = newPath;
                                    map.addLayer(newPath);
                                    watchPathFn(newPath, newName);
                                }

                                bindPathEvents(newPath, newName, pathData, leafletScope);
                            }
                        }

                        // Delete paths (by name) from the array
                        for (var name in leafletPaths) {
                            if (!isDefined(newPaths[name])) {
                                delete leafletPaths[name];
                            }
                        }

                    }, true);

                });
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('controls', ["$log", "leafletHelpers", function ($log, leafletHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: '?^leaflet',

        link: function(scope, element, attrs, controller) {
            if(!controller) {
                return;
            }

            var isDefined = leafletHelpers.isDefined,
                leafletScope  = controller.getLeafletScope(),
                controls = leafletScope.controls;

            controller.getMap().then(function(map) {
                if (isDefined(L.Control.Draw) && isDefined(controls.draw)) {
                    var drawnItems = new L.FeatureGroup();
                    var options = {
                        edit: {
                            featureGroup: drawnItems
                        }
                    };
                    angular.extend(options, controls.draw);
                    controls.draw = options;
                    map.addLayer(options.edit.featureGroup);

                    var drawControl = new L.Control.Draw(options);
                    map.addControl(drawControl);
                }

                if(isDefined(controls.custom)) {
                    for(var i in controls.custom) {
                        map.addControl(controls.custom[i]);
                    }
                }
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('eventBroadcast', ["$log", "$rootScope", "leafletHelpers", "leafletEvents", function ($log, $rootScope, leafletHelpers, leafletEvents) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var isObject = leafletHelpers.isObject,
                leafletScope  = controller.getLeafletScope(),
                eventBroadcast = leafletScope.eventBroadcast,
                availableMapEvents = leafletEvents.getAvailableMapEvents(),
                genDispatchMapEvent = leafletEvents.genDispatchMapEvent;

            controller.getMap().then(function(map) {

                var mapEvents = [];
                var i;
                var eventName;
                var logic = "broadcast";

                if (isObject(eventBroadcast)) {
                    // We have a possible valid object
                    if (eventBroadcast.map === undefined || eventBroadcast.map === null) {
                        // We do not have events enable/disable do we do nothing (all enabled by default)
                        mapEvents = availableMapEvents;
                    } else if (typeof eventBroadcast.map !== 'object') {
                        // Not a valid object
                        $log.warn("[AngularJS - Leaflet] event-broadcast.map must be an object check your model.");
                    } else {
                        // We have a possible valid map object
                        // Event propadation logic
                        if (eventBroadcast.map.logic !== undefined && eventBroadcast.map.logic !== null) {
                            // We take care of possible propagation logic
                            if (eventBroadcast.map.logic !== "emit" && eventBroadcast.map.logic !== "broadcast") {
                                // This is an error
                                $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                            } else if (eventBroadcast.map.logic === "emit") {
                                logic = "emit";
                            }
                        }
                        // Enable / Disable
                        var mapEventsEnable = false, mapEventsDisable = false;
                        if (eventBroadcast.map.enable !== undefined && eventBroadcast.map.enable !== null) {
                            if (typeof eventBroadcast.map.enable === 'object') {
                                mapEventsEnable = true;
                            }
                        }
                        if (eventBroadcast.map.disable !== undefined && eventBroadcast.map.disable !== null) {
                            if (typeof eventBroadcast.map.disable === 'object') {
                                mapEventsDisable = true;
                            }
                        }
                        if (mapEventsEnable && mapEventsDisable) {
                            // Both are active, this is an error
                            $log.warn("[AngularJS - Leaflet] can not enable and disable events at the time");
                        } else if (!mapEventsEnable && !mapEventsDisable) {
                            // Both are inactive, this is an error
                            $log.warn("[AngularJS - Leaflet] must enable or disable events");
                        } else {
                            // At this point the map object is OK, lets enable or disable events
                            if (mapEventsEnable) {
                                // Enable events
                                for (i = 0; i < eventBroadcast.map.enable.length; i++) {
                                    eventName = eventBroadcast.map.enable[i];
                                    // Do we have already the event enabled?
                                    if (mapEvents.indexOf(eventName) !== -1) {
                                        // Repeated event, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                    } else {
                                        // Does the event exists?
                                        if (availableMapEvents.indexOf(eventName) === -1) {
                                            // The event does not exists, this is an error
                                            $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                        } else {
                                            // All ok enable the event
                                            mapEvents.push(eventName);
                                        }
                                    }
                                }
                            } else {
                                // Disable events
                                mapEvents = availableMapEvents;
                                for (i = 0; i < eventBroadcast.map.disable.length; i++) {
                                    eventName = eventBroadcast.map.disable[i];
                                    var index = mapEvents.indexOf(eventName);
                                    if (index === -1) {
                                        // The event does not exist
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");
                                    } else {
                                        mapEvents.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }

                    for (i = 0; i < mapEvents.length; i++) {
                        eventName = mapEvents[i];
                        map.on(eventName, genDispatchMapEvent(leafletScope, eventName, logic), {
                            eventName: eventName
                        });
                    }
                } else {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast must be an object, check your model.");
                }
            });
        }
    };
}]);

angular.module("leaflet-directive").directive('maxbounds', ["$log", "leafletMapDefaults", "leafletBoundsHelpers", function ($log, leafletMapDefaults, leafletBoundsHelpers) {
    return {
        restrict: "A",
        scope: false,
        replace: false,
        require: 'leaflet',

        link: function(scope, element, attrs, controller) {
            var leafletScope  = controller.getLeafletScope(),
                isValidBounds = leafletBoundsHelpers.isValidBounds;


            controller.getMap().then(function(map) {
                leafletScope.$watch("maxbounds", function (maxbounds) {
                    if (!isValidBounds(maxbounds)) {
                        // Unset any previous maxbounds
                        map.setMaxBounds();
                        return;
                    }
                    var bounds = [
                        [ maxbounds.southWest.lat, maxbounds.southWest.lng ],
                        [ maxbounds.northEast.lat, maxbounds.northEast.lng ]
                    ];

                    map.setMaxBounds(bounds);
                    if (!attrs.center) {
                            map.fitBounds(bounds);
                        }
                });
            });
        }
    };
}]);

angular.module("leaflet-directive").directive("decorations", ["$log", "leafletHelpers", function($log, leafletHelpers) {
	return {
		restrict: "A", 
		scope: false,
		replace: false,
		require: 'leaflet',

		link: function(scope, element, attrs, controller) {
			var leafletScope = controller.getLeafletScope(),
				PolylineDecoratorPlugin = leafletHelpers.PolylineDecoratorPlugin,
				isDefined = leafletHelpers.isDefined,
				leafletDecorations = {};

			/* Creates an "empty" decoration with a set of coordinates, but no pattern. */
			function createDecoration(options) {
				if (isDefined(options) && isDefined(options.coordinates)) {
					if (!PolylineDecoratorPlugin.isLoaded()) {
						$log.error('[AngularJS - Leaflet] The PolylineDecorator Plugin is not loaded.');
					}
				}

				return L.polylineDecorator(options.coordinates);
			}

			/* Updates the path and the patterns for the provided decoration, and returns the decoration. */
			function setDecorationOptions(decoration, options) {
				if (isDefined(decoration) && isDefined(options)) {
					if (isDefined(options.coordinates) && isDefined(options.patterns)) {
						decoration.setPaths(options.coordinates);
						decoration.setPatterns(options.patterns);
						return decoration;
					}
				}
			}

			controller.getMap().then(function(map) {
				leafletScope.$watch("decorations", function(newDecorations) {
					for (var name in leafletDecorations) {
						if (!isDefined(newDecorations) || !isDefined(newDecorations[name])) {
							delete leafletDecorations[name];
						}
						map.removeLayer(leafletDecorations[name]);
					}
					
					for (var newName in newDecorations) {
						var decorationData = newDecorations[newName],
							newDecoration = createDecoration(decorationData);

						if (isDefined(newDecoration)) {
							leafletDecorations[newName] = newDecoration;
							map.addLayer(newDecoration);
							setDecorationOptions(newDecoration, decorationData);
						}
					}
				}, true);
			});
		}
	};
}]);
angular.module("leaflet-directive").directive('layercontrol', ["$log", "leafletData", "leafletHelpers", function ($log, leafletData, leafletHelpers) {
  return {
    restrict: "E",
    scope: {
    },
    replace: true,
    transclude: false,
    require: '^leaflet',
    controller: ["$scope", "$element", "$sce", function ($scope, $element, $sce) {
      $log.debug('[Angular Directive - Layers] layers', $scope, $element);
      var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined;
      angular.extend($scope, {
        baselayer: '',
        icons: {
          uncheck: 'fa fa-check-square-o',
          check: 'fa fa-square-o',
          radio: 'fa fa-dot-circle-o',
          unradio: 'fa fa-circle-o',
          up: 'fa fa-angle-up',
          down: 'fa fa-angle-down',
          open: 'fa fa-angle-double-down',
          close: 'fa fa-angle-double-up'
        },
        changeBaseLayer: function(key, e) {
          leafletHelpers.safeApply($scope, function(scp) {
            scp.baselayer = key;
            leafletData.getMap().then(function(map) {
              leafletData.getLayers().then(function(leafletLayers) {
                if(map.hasLayer(leafletLayers.baselayers[key])) {
                  return;
                }
                for(var i in scp.layers.baselayers) {
                  scp.layers.baselayers[i].icon = scp.icons.unradio;
                  if(map.hasLayer(leafletLayers.baselayers[i])) {
                    map.removeLayer(leafletLayers.baselayers[i]);
                  }
                }
                map.addLayer(leafletLayers.baselayers[key]);
                scp.layers.baselayers[key].icon = $scope.icons.radio;
              });
            });
          });
          e.preventDefault();
        },
        moveLayer: function(ly, newIndex, e) {
            var delta = Object.keys($scope.layers.baselayers).length;
            if(newIndex >= (1+delta) && newIndex <= ($scope.overlaysArray.length+delta)) {
                var oldLy;
                for(var key in $scope.layers.overlays) {
                    if($scope.layers.overlays[key].index === newIndex) {
                        oldLy = $scope.layers.overlays[key];
                        break;
                    }
                }
                if(oldLy) {
                    safeApply($scope, function() {
                        oldLy.index = ly.index;
                        ly.index = newIndex;
                    });
                }
            }
            e.stopPropagation();
            e.preventDefault();
        },
        initIndex: function(layer, idx) {
            var delta = Object.keys($scope.layers.baselayers).length;
            layer.index = isDefined(layer.index)? layer.index:idx+delta+1;
        },
        toggleOpacity: function(e, layer) {
            $log.debug('Event', e);
            if(layer.visible) {
                var el = angular.element(e.currentTarget);
                el.toggleClass($scope.icons.close + ' ' + $scope.icons.open);
                el = el.parents('.lf-row').find('.lf-opacity');
                el.toggle('fast', function() {
                    safeApply($scope, function() {
                        layer.opacityControl = !layer.opacityControl;
                    });
                });
            }
            e.stopPropagation();
            e.preventDefault();
        },
        unsafeHTML: function(html) {
          return $sce.trustAsHtml(html);
        }
      });

      var div = $element.get(0);
      if (!L.Browser.touch) {
          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
      } else {
          L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
      }
    }],
    template:
      '<div class="angular-leaflet-control-layers" ng-show="overlaysArray.length">' +
        '<div class="lf-baselayers">' +
            '<div class="lf-row" ng-repeat="(key, layer) in layers.baselayers">' +
                '<label class="lf-icon-bl" ng-click="changeBaseLayer(key, $event)">' +
                    '<input class="leaflet-control-layers-selector" type="radio" name="lf-radio" ' +
                        'ng-show="false" ng-checked="baselayer === key" ng-value="key" /> ' +
                    '<i class="lf-icon lf-icon-radio" ng-class="layer.icon"></i>' +
                    '<div class="lf-text">{{layer.name}}</div>' +
                '</label>' +
            '</div>' +
        '</div>' +
        '<div class="lf-overlays">' +
            '<div class="lf-container">' +
                '<div class="lf-row" ng-repeat="layer in overlaysArray | orderBy:\'index\':order" ng-init="initIndex(layer, $index)">' +
                    '<label class="lf-icon-ol">' +
                        '<input class="lf-control-layers-selector" type="checkbox" ng-show="false" ng-model="layer.visible"/> ' +
                        '<i class="lf-icon lf-icon-check" ng-class="layer.icon"></i>' +
                        '<div class="lf-text">{{layer.name}}</div>' +
                        '<div class="lf-icons">' +
                            '<i class="lf-icon lf-up" ng-class="icons.up" ng-click="moveLayer(layer, layer.index - orderNumber, $event)"></i> ' +
                            '<i class="lf-icon lf-down" ng-class="icons.down" ng-click="moveLayer(layer, layer.index + orderNumber, $event)"></i> ' +
                            '<i class="lf-icon lf-open" ng-class="layer.opacityControl? icons.close:icons.open" ng-click="toggleOpacity($event, layer)"></i>' +
                        '</div>' +
                    '</label>'+
                    '<div class="lf-legend" ng-if="layer.legend" ng-bind-html="unsafeHTML(layer.legend)"></div>' +
                    '<div class="lf-opacity" ng-show="layer.visible &amp;&amp; layer.opacityControl">' +
                        '<input type="text" class="lf-opacity-control" name="lf-opacity-control" data-key="{{layer.index}}" />' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs, controller) {
        var isDefined = leafletHelpers.isDefined,
        leafletScope = controller.getLeafletScope(),
        layers = leafletScope.layers;

        // Setting layer stack order.
        attrs.order = (isDefined(attrs.order) && (attrs.order === 'normal' || attrs.order === 'reverse'))? attrs.order:'normal';
        scope.order = attrs.order === 'normal';
        scope.orderNumber = attrs.order === 'normal'? -1:1;

        scope.layers = layers;
        controller.getMap().then(function(map) {
            // Do we have a baselayers property?
            if (!isDefined(layers) || !isDefined(layers.baselayers) || Object.keys(layers.baselayers).length === 0) {
                // No baselayers property
                $log.error('[AngularJS - Leaflet] At least one baselayer has to be defined');
                return;
            }

            leafletScope.$watch('layers.baselayers', function(newBaseLayers) {
                leafletData.getLayers().then(function(leafletLayers) {
                    var key;
                    for(key in newBaseLayers) {
                      if(map.hasLayer(leafletLayers.baselayers[key])) {
                        newBaseLayers[key].icon = scope.icons.radio;
                      } else {
                        newBaseLayers[key].icon = scope.icons.unradio;
                      }
                    }
                });
            });

            leafletScope.$watch('layers.overlays', function(newOverlayLayers) {
                var overlaysArray = [];
                leafletData.getLayers().then(function(leafletLayers) {
                    for(var key in newOverlayLayers) {
                        newOverlayLayers[key].icon = scope.icons[(newOverlayLayers[key].visible? 'uncheck':'check')];
                        overlaysArray.push(newOverlayLayers[key]);
                        if(isDefined(newOverlayLayers[key].index) && leafletLayers.overlays[key].setZIndex) {
                            leafletLayers.overlays[key].setZIndex(newOverlayLayers[key].index);
                        }
                    }
                });

                var unreg = scope.$watch(function() {
                    if(element.children().size() > 1) {
                        element.find('.lf-overlays').trigger('resize');
                        return element.find('.lf-opacity').size() === Object.keys(layers.overlays).length;
                    }
                }, function(el) {
                    if(el === true) {
                        if(isDefined(element.find('.lf-opacity-control').ionRangeSlider)) {
                            element.find('.lf-opacity-control').each(function(idx, inp) {
                                var delta =  Object.keys(layers.baselayers).length,
                                    lyAux;
                                for(var key in scope.overlaysArray) {
                                    if(scope.overlaysArray[key].index === idx+delta+1) {
                                        lyAux = scope.overlaysArray[key];
                                    }
                                }

                                var input = angular.element(inp),
                                    op = isDefined(lyAux) && isDefined(lyAux.layerOptions)?
                                        lyAux.layerOptions.opacity:undefined;
                                input.ionRangeSlider({
                                    min: 0,
                                    from: isDefined(op)? Math.ceil(op*100):100,
                                    step: 1,
                                    max: 100,
                                    prettify: false,
                                    hasGrid: false,
                                    hideMinMax: true,
                                    onChange: function(val) {
                                        leafletData.getLayers().then(function(leafletLayers) {
                                            var key = val.input.data().key;
                                            var ly, layer;
                                            for(var k in layers.overlays) {
                                                if(layers.overlays[k].index === key) {
                                                    ly = leafletLayers.overlays[k];
                                                    layer = layers.overlays[k];
                                                    break;
                                                }
                                            }
                                            if(map.hasLayer(ly)) {
                                                layer.layerOptions = isDefined(layer.layerOptions)? layer.layerOptions:{};
                                                layer.layerOptions.opacity = val.input.val()/100;
                                                if(ly.setOpacity) {
                                                    ly.setOpacity(val.input.val()/100);
                                                }
                                                if(ly.getLayers && ly.eachLayer) {
                                                    ly.eachLayer(function(lay) {
                                                        if(lay.setOpacity) {
                                                            lay.setOpacity(val.input.val()/100);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            $log.warn('[AngularJS - Leaflet] Ion Slide Range Plugin is not loaded');
                        }
                        unreg();
                    }
                });

                scope.overlaysArray = overlaysArray;
            }, true);
        });
    }
  };
}]);

angular.module("leaflet-directive").service('leafletData', ["$log", "$q", "leafletHelpers", function ($log, $q, leafletHelpers) {
    var getDefer = leafletHelpers.getDefer,
        getUnresolvedDefer = leafletHelpers.getUnresolvedDefer,
        setResolvedDefer = leafletHelpers.setResolvedDefer;

    var maps = {};
    var tiles = {};
    var layers = {};
    var paths = {};
    var markers = {};
    var geoJSON = {};
    var utfGrid = {};
    var decorations = {};

    this.setMap = function(leafletMap, scopeId) {
        var defer = getUnresolvedDefer(maps, scopeId);
        defer.resolve(leafletMap);
        setResolvedDefer(maps, scopeId);
    };

    this.getMap = function(scopeId) {
        var defer = getDefer(maps, scopeId);
        return defer.promise;
    };

    this.unresolveMap = function (scopeId) {
        var id = leafletHelpers.obtainEffectiveMapId(maps, scopeId);
        maps[id] = undefined;
    };

    this.getPaths = function(scopeId) {
        var defer = getDefer(paths, scopeId);
        return defer.promise;
    };

    this.setPaths = function(leafletPaths, scopeId) {
        var defer = getUnresolvedDefer(paths, scopeId);
        defer.resolve(leafletPaths);
        setResolvedDefer(paths, scopeId);
    };

    this.getMarkers = function(scopeId) {
        var defer = getDefer(markers, scopeId);
        return defer.promise;
    };

    this.setMarkers = function(leafletMarkers, scopeId) {
        var defer = getUnresolvedDefer(markers, scopeId);
        defer.resolve(leafletMarkers);
        setResolvedDefer(markers, scopeId);
    };

    this.getLayers = function(scopeId) {
        var defer = getDefer(layers, scopeId);
        return defer.promise;
    };

    this.setLayers = function(leafletLayers, scopeId) {
        var defer = getUnresolvedDefer(layers, scopeId);
        defer.resolve(leafletLayers);
        setResolvedDefer(layers, scopeId);
    };
    
    this.getUTFGrid = function(scopeId) {
        var defer = getDefer(utfGrid, scopeId);
        return defer.promise;
    };
    
    this.setUTFGrid = function(leafletUTFGrid, scopeId) {
        var defer = getUnresolvedDefer(utfGrid, scopeId);
        defer.resolve(leafletUTFGrid);
        setResolvedDefer(utfGrid, scopeId);
    };

    this.setTiles = function(leafletTiles, scopeId) {
        var defer = getUnresolvedDefer(tiles, scopeId);
        defer.resolve(leafletTiles);
        setResolvedDefer(tiles, scopeId);
    };

    this.getTiles = function(scopeId) {
        var defer = getDefer(tiles, scopeId);
        return defer.promise;
    };

    this.setGeoJSON = function(leafletGeoJSON, scopeId) {
        var defer = getUnresolvedDefer(geoJSON, scopeId);
        defer.resolve(leafletGeoJSON);
        setResolvedDefer(geoJSON, scopeId);
    };

    this.getGeoJSON = function(scopeId) {
        var defer = getDefer(geoJSON, scopeId);
        return defer.promise;
    };

    this.setDecorations = function(leafletDecorations, scopeId) {
        var defer = getUnresolvedDefer(decorations, scopeId);
        defer.resolve(leafletDecorations);
        setResolvedDefer(decorations, scopeId);
    };

    this.getDecorations = function(scopeId) {
        var defer = getDefer(decorations, scopeId);
        return defer.promise;
    };
}]);

angular.module("leaflet-directive").factory('leafletMapDefaults', ["$q", "leafletHelpers", function ($q, leafletHelpers) {
    function _getDefaults() {
        return {
            keyboard: true,
            dragging: true,
            worldCopyJump: false,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            touchZoom: true,
            zoomControl: true,
            zoomsliderControl: false,
            zoomControlPosition: 'topleft',
            attributionControl: true,
            controls: {
                layers: {
                    visible: true,
                    position: 'topright',
                    collapsed: true
                }
            },
            crs: L.CRS.EPSG3857,
            tileLayer: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileLayerOptions: {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            path: {
                weight: 10,
                opacity: 1,
                color: '#0000ff'
            },
            center: {
                lat: 0,
                lng: 0,
                zoom: 1
            }
        };
    }

    var isDefined = leafletHelpers.isDefined,
        isObject = leafletHelpers.isObject,
        obtainEffectiveMapId = leafletHelpers.obtainEffectiveMapId,
        defaults = {};

    // Get the _defaults dictionary, and override the properties defined by the user
    return {
        getDefaults: function (scopeId) {
            var mapId = obtainEffectiveMapId(defaults, scopeId);
            return defaults[mapId];
        },

        getMapCreationDefaults: function (scopeId) {
            var mapId = obtainEffectiveMapId(defaults, scopeId);
            var d = defaults[mapId];

            var mapDefaults = {
                maxZoom: d.maxZoom,
                keyboard: d.keyboard,
                dragging: d.dragging,
                zoomControl: d.zoomControl,
                doubleClickZoom: d.doubleClickZoom,
                scrollWheelZoom: d.scrollWheelZoom,
                touchZoom: d.touchZoom,
                attributionControl: d.attributionControl,
                worldCopyJump: d.worldCopyJump,
                crs: d.crs
            };

            if (isDefined(d.minZoom)) {
                mapDefaults.minZoom = d.minZoom;
            }

            if (isDefined(d.zoomAnimation)) {
                mapDefaults.zoomAnimation = d.zoomAnimation;
            }

            if (isDefined(d.fadeAnimation)) {
                mapDefaults.fadeAnimation = d.fadeAnimation;
            }

            if (isDefined(d.markerZoomAnimation)) {
                mapDefaults.markerZoomAnimation = d.markerZoomAnimation;
            }

            if (d.map) {
                for (var option in d.map) {
                    mapDefaults[option] = d.map[option];
                }
            }

            return mapDefaults;
        },

        setDefaults: function (userDefaults, scopeId) {
            var newDefaults = _getDefaults();

            if (isDefined(userDefaults)) {
                newDefaults.doubleClickZoom = isDefined(userDefaults.doubleClickZoom) ? userDefaults.doubleClickZoom : newDefaults.doubleClickZoom;
                newDefaults.scrollWheelZoom = isDefined(userDefaults.scrollWheelZoom) ? userDefaults.scrollWheelZoom : newDefaults.doubleClickZoom;
                newDefaults.touchZoom = isDefined(userDefaults.touchZoom) ? userDefaults.touchZoom : newDefaults.doubleClickZoom;
                newDefaults.zoomControl = isDefined(userDefaults.zoomControl) ? userDefaults.zoomControl : newDefaults.zoomControl;
                newDefaults.zoomsliderControl = isDefined(userDefaults.zoomsliderControl) ? userDefaults.zoomsliderControl : newDefaults.zoomsliderControl;
                newDefaults.attributionControl = isDefined(userDefaults.attributionControl) ? userDefaults.attributionControl : newDefaults.attributionControl;
                newDefaults.tileLayer = isDefined(userDefaults.tileLayer) ? userDefaults.tileLayer : newDefaults.tileLayer;
                newDefaults.zoomControlPosition = isDefined(userDefaults.zoomControlPosition) ? userDefaults.zoomControlPosition : newDefaults.zoomControlPosition;
                newDefaults.keyboard = isDefined(userDefaults.keyboard) ? userDefaults.keyboard : newDefaults.keyboard;
                newDefaults.dragging = isDefined(userDefaults.dragging) ? userDefaults.dragging : newDefaults.dragging;

                if (isDefined(userDefaults.controls)) {
                    angular.extend(newDefaults.controls, userDefaults.controls);
                }

                if (isObject(userDefaults.crs)) {
                    newDefaults.crs = userDefaults.crs;
                } else if (isDefined(L.CRS[userDefaults.crs])) {
                    newDefaults.crs = L.CRS[userDefaults.crs];
                }

                if (isDefined(userDefaults.tileLayerOptions)) {
                    angular.copy(userDefaults.tileLayerOptions, newDefaults.tileLayerOptions);
                }

                if (isDefined(userDefaults.maxZoom)) {
                    newDefaults.maxZoom = userDefaults.maxZoom;
                }

                if (isDefined(userDefaults.minZoom)) {
                    newDefaults.minZoom = userDefaults.minZoom;
                }

                if (isDefined(userDefaults.zoomAnimation)) {
                    newDefaults.zoomAnimation = userDefaults.zoomAnimation;
                }

                if (isDefined(userDefaults.fadeAnimation)) {
                    newDefaults.fadeAnimation = userDefaults.fadeAnimation;
                }

                if (isDefined(userDefaults.markerZoomAnimation)) {
                    newDefaults.markerZoomAnimation = userDefaults.markerZoomAnimation;
                }

                if (isDefined(userDefaults.worldCopyJump)) {
                    newDefaults.worldCopyJump = userDefaults.worldCopyJump;
                }

                if (isDefined(userDefaults.map)) {
                    newDefaults.map = userDefaults.map;
                }
            }

            var mapId = obtainEffectiveMapId(defaults, scopeId);
            defaults[mapId] = newDefaults;
            return newDefaults;
        }
    };
}]);

angular.module("leaflet-directive").factory('leafletEvents', ["$rootScope", "$q", "$log", "leafletHelpers", function ($rootScope, $q, $log, leafletHelpers) {
    var safeApply = leafletHelpers.safeApply,
        isDefined = leafletHelpers.isDefined,
        isObject = leafletHelpers.isObject,
        Helpers = leafletHelpers;

    var _getAvailableLabelEvents = function() {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu'
        ];
    };

    var genLabelEvents = function(leafletScope, logic, marker, name) {
        var labelEvents = _getAvailableLabelEvents();
        var scopeWatchName = "markers." + name;
        for (var i = 0; i < labelEvents.length; i++) {
            var eventName = labelEvents[i];
            marker.label.on(eventName, genDispatchLabelEvent(leafletScope, eventName, logic, marker.label, scopeWatchName));
        }
    };

    var genDispatchMarkerEvent = function(eventName, logic, leafletScope, marker, name, markerData) {
        return function(e) {
            var broadcastName = 'leafletDirectiveMarker.' + eventName;

            // Broadcast old marker click name for backwards compatibility
            if (eventName === "click") {
                safeApply(leafletScope, function() {
                    $rootScope.$broadcast('leafletDirectiveMarkersClick', name);
                });
            } else if (eventName === 'dragend') {
                safeApply(leafletScope, function() {
                    markerData.lat = marker.getLatLng().lat;
                    markerData.lng = marker.getLatLng().lng;
                });
                if (markerData.message && markerData.focus === true) {
                    marker.openPopup();
                }
            }

            safeApply(leafletScope, function(scope){
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        markerName: name,
                        leafletEvent: e
                    });
                } else {
                    $rootScope.$broadcast(broadcastName, {
                        markerName: name,
                        leafletEvent: e
                    });
                }
            });
        };
    };

    var genDispatchPathEvent = function(eventName, logic, leafletScope, marker, name) {
        return function(e) {
            var broadcastName = 'leafletDirectivePath.' + eventName;

            safeApply(leafletScope, function(scope){
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        pathName: name,
                        leafletEvent: e
                    });
                } else {
                    $rootScope.$broadcast(broadcastName, {
                        pathName: name,
                        leafletEvent: e
                    });
                }
            });
        };
    };

    var genDispatchLabelEvent = function(scope, eventName, logic, label, scope_watch_name) {
        return function(e) {
            // Put together broadcast name
            var broadcastName = 'leafletDirectiveLabel.' + eventName;
            var markerName = scope_watch_name.replace('markers.', '');

            // Safely broadcast the event
            safeApply(scope, function(scope) {
                if (logic === "emit") {
                    scope.$emit(broadcastName, {
                        leafletEvent : e,
                        label: label,
                        markerName: markerName
                    });
                } else if (logic === "broadcast") {
                    $rootScope.$broadcast(broadcastName, {
                        leafletEvent : e,
                        label: label,
                        markerName: markerName
                    });
                }
            });
        };
    };

    var _getAvailableMarkerEvents = function() {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu',
            'dragstart',
            'drag',
            'dragend',
            'move',
            'remove',
            'popupopen',
            'popupclose'
        ];
    };

    var _getAvailablePathEvents = function() {
        return [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'contextmenu',
            'add',
            'remove',
            'popupopen',
            'popupclose'
        ];
    };

    return {
        getAvailableMapEvents: function() {
            return [
                'click',
                'dblclick',
                'mousedown',
                'mouseup',
                'mouseover',
                'mouseout',
                'mousemove',
                'contextmenu',
                'focus',
                'blur',
                'preclick',
                'load',
                'unload',
                'viewreset',
                'movestart',
                'move',
                'moveend',
                'dragstart',
                'drag',
                'dragend',
                'zoomstart',
                'zoomend',
                'zoomlevelschange',
                'resize',
                'autopanstart',
                'layeradd',
                'layerremove',
                'baselayerchange',
                'overlayadd',
                'overlayremove',
                'locationfound',
                'locationerror',
                'popupopen',
                'popupclose',
                'draw:created',
                'draw:edited',
                'draw:deleted',
                'draw:drawstart',
                'draw:drawstop',
                'draw:editstart',
                'draw:editstop',
                'draw:deletestart',
                'draw:deletestop'
            ];
        },

        genDispatchMapEvent: function(scope, eventName, logic) {
            return function(e) {
                // Put together broadcast name
                var broadcastName = 'leafletDirectiveMap.' + eventName;
                // Safely broadcast the event
                safeApply(scope, function(scope) {
                    if (logic === "emit") {
                        scope.$emit(broadcastName, {
                            leafletEvent : e
                        });
                    } else if (logic === "broadcast") {
                        $rootScope.$broadcast(broadcastName, {
                            leafletEvent : e
                        });
                    }
                });
            };
        },

        getAvailableMarkerEvents: _getAvailableMarkerEvents,

        getAvailablePathEvents: _getAvailablePathEvents,

        notifyCenterChangedToBounds: function(scope) {
            scope.$broadcast("boundsChanged");
        },

        notifyCenterUrlHashChanged: function(scope, map, attrs, search) {
            if (!isDefined(attrs.urlHashCenter)) {
                return;
            }
            var center = map.getCenter();
            var centerUrlHash = (center.lat).toFixed(4) + ":" + (center.lng).toFixed(4) + ":" + map.getZoom();
            if (!isDefined(search.c) || search.c !== centerUrlHash) {
                //$log.debug("notified new center...");
                scope.$emit("centerUrlHash", centerUrlHash);
            }
        },

        bindMarkerEvents: function(marker, name, markerData, leafletScope) {
            var markerEvents = [];
            var i;
            var eventName;
            var logic = "broadcast";

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                markerEvents = _getAvailableMarkerEvents();
            } else if (!isObject(leafletScope.eventBroadcast)) {
                // Not a valid object
                $log.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.marker)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    markerEvents = _getAvailableMarkerEvents();
                } else if (!isObject(leafletScope.eventBroadcast.marker)) {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast.marker must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (leafletScope.eventBroadcast.marker.logic !== undefined && leafletScope.eventBroadcast.marker.logic !== null) {
                        // We take care of possible propagation logic
                        if (leafletScope.eventBroadcast.marker.logic !== "emit" && leafletScope.eventBroadcast.marker.logic !== "broadcast") {
                            // This is an error
                            $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                        } else if (leafletScope.eventBroadcast.marker.logic === "emit") {
                            logic = "emit";
                        }
                    }
                    // Enable / Disable
                    var markerEventsEnable = false, markerEventsDisable = false;
                    if (leafletScope.eventBroadcast.marker.enable !== undefined && leafletScope.eventBroadcast.marker.enable !== null) {
                        if (typeof leafletScope.eventBroadcast.marker.enable === 'object') {
                            markerEventsEnable = true;
                        }
                    }
                    if (leafletScope.eventBroadcast.marker.disable !== undefined && leafletScope.eventBroadcast.marker.disable !== null) {
                        if (typeof leafletScope.eventBroadcast.marker.disable === 'object') {
                            markerEventsDisable = true;
                        }
                    }
                    if (markerEventsEnable && markerEventsDisable) {
                        // Both are active, this is an error
                        $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                    } else if (!markerEventsEnable && !markerEventsDisable) {
                        // Both are inactive, this is an error
                        $log.warn("[AngularJS - Leaflet] must enable or disable events");
                    } else {
                        // At this point the marker object is OK, lets enable or disable events
                        if (markerEventsEnable) {
                            // Enable events
                            for (i = 0; i < leafletScope.eventBroadcast.marker.enable.length; i++) {
                                eventName = leafletScope.eventBroadcast.marker.enable[i];
                                // Do we have already the event enabled?
                                if (markerEvents.indexOf(eventName) !== -1) {
                                    // Repeated event, this is an error
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                } else {
                                    // Does the event exists?
                                    if (_getAvailableMarkerEvents().indexOf(eventName) === -1) {
                                        // The event does not exists, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                    } else {
                                        // All ok enable the event
                                        markerEvents.push(eventName);
                                    }
                                }
                            }
                        } else {
                            // Disable events
                            markerEvents = _getAvailableMarkerEvents();
                            for (i = 0; i < leafletScope.eventBroadcast.marker.disable.length; i++) {
                                eventName = leafletScope.eventBroadcast.marker.disable[i];
                                var index = markerEvents.indexOf(eventName);
                                if (index === -1) {
                                    // The event does not exist
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");

                                } else {
                                    markerEvents.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }

            for (i = 0; i < markerEvents.length; i++) {
                eventName = markerEvents[i];
                marker.on(eventName, genDispatchMarkerEvent(eventName, logic, leafletScope, marker, name, markerData));
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(marker.label)) {
                genLabelEvents(leafletScope, logic, marker, name);
            }
        },

        bindPathEvents: function(path, name, pathData, leafletScope) {
            var pathEvents = [];
            var i;
            var eventName;
            var logic = "broadcast";

            if (!isDefined(leafletScope.eventBroadcast)) {
                // Backward compatibility, if no event-broadcast attribute, all events are broadcasted
                pathEvents = _getAvailablePathEvents();
            } else if (!isObject(leafletScope.eventBroadcast)) {
                // Not a valid object
                $log.error("[AngularJS - Leaflet] event-broadcast must be an object check your model.");
            } else {
                // We have a possible valid object
                if (!isDefined(leafletScope.eventBroadcast.path)) {
                    // We do not have events enable/disable do we do nothing (all enabled by default)
                    pathEvents = _getAvailablePathEvents();
                } else if (isObject(leafletScope.eventBroadcast.paths)) {
                    // Not a valid object
                    $log.warn("[AngularJS - Leaflet] event-broadcast.path must be an object check your model.");
                } else {
                    // We have a possible valid map object
                    // Event propadation logic
                    if (leafletScope.eventBroadcast.path.logic !== undefined && leafletScope.eventBroadcast.path.logic !== null) {
                        // We take care of possible propagation logic
                        if (leafletScope.eventBroadcast.path.logic !== "emit" && leafletScope.eventBroadcast.path.logic !== "broadcast") {
                            // This is an error
                            $log.warn("[AngularJS - Leaflet] Available event propagation logic are: 'emit' or 'broadcast'.");
                        } else if (leafletScope.eventBroadcast.path.logic === "emit") {
                            logic = "emit";
                        }
                    }
                    // Enable / Disable
                    var pathEventsEnable = false, pathEventsDisable = false;
                    if (leafletScope.eventBroadcast.path.enable !== undefined && leafletScope.eventBroadcast.path.enable !== null) {
                        if (typeof leafletScope.eventBroadcast.path.enable === 'object') {
                            pathEventsEnable = true;
                        }
                    }
                    if (leafletScope.eventBroadcast.path.disable !== undefined && leafletScope.eventBroadcast.path.disable !== null) {
                        if (typeof leafletScope.eventBroadcast.path.disable === 'object') {
                            pathEventsDisable = true;
                        }
                    }
                    if (pathEventsEnable && pathEventsDisable) {
                        // Both are active, this is an error
                        $log.warn("[AngularJS - Leaflet] can not enable and disable events at the same time");
                    } else if (!pathEventsEnable && !pathEventsDisable) {
                        // Both are inactive, this is an error
                        $log.warn("[AngularJS - Leaflet] must enable or disable events");
                    } else {
                        // At this point the path object is OK, lets enable or disable events
                        if (pathEventsEnable) {
                            // Enable events
                            for (i = 0; i < leafletScope.eventBroadcast.path.enable.length; i++) {
                                eventName = leafletScope.eventBroadcast.path.enable[i];
                                // Do we have already the event enabled?
                                if (pathEvents.indexOf(eventName) !== -1) {
                                    // Repeated event, this is an error
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " is already enabled");
                                } else {
                                    // Does the event exists?
                                    if (_getAvailablePathEvents().indexOf(eventName) === -1) {
                                        // The event does not exists, this is an error
                                        $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist");
                                    } else {
                                        // All ok enable the event
                                        pathEvents.push(eventName);
                                    }
                                }
                            }
                        } else {
                            // Disable events
                            pathEvents = _getAvailablePathEvents();
                            for (i = 0; i < leafletScope.eventBroadcast.path.disable.length; i++) {
                                eventName = leafletScope.eventBroadcast.path.disable[i];
                                var index = pathEvents.indexOf(eventName);
                                if (index === -1) {
                                    // The event does not exist
                                    $log.warn("[AngularJS - Leaflet] This event " + eventName + " does not exist or has been already disabled");

                                } else {
                                    pathEvents.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }

            for (i = 0; i < pathEvents.length; i++) {
                eventName = pathEvents[i];
                path.on(eventName, genDispatchPathEvent(eventName, logic, leafletScope, pathEvents, name));
            }

            if (Helpers.LabelPlugin.isLoaded() && isDefined(path.label)) {
                genLabelEvents(leafletScope, logic, path, name);
            }
        }

    };
}]);


angular.module("leaflet-directive").factory('leafletLayerHelpers', ["$rootScope", "$log", "leafletHelpers", function ($rootScope, $log, leafletHelpers) {
    var Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isObject = leafletHelpers.isObject,
        isDefined = leafletHelpers.isDefined;

    var utfGridCreateLayer = function(params) {
        if (!Helpers.UTFGridPlugin.isLoaded()) {
            $log.error('[AngularJS - Leaflet] The UTFGrid plugin is not loaded.');
            return;
        }
        var utfgrid = new L.UtfGrid(params.url, params.pluginOptions);

        utfgrid.on('mouseover', function(e) {
            $rootScope.$broadcast('leafletDirectiveMap.utfgridMouseover', e);
        });

        utfgrid.on('mouseout', function(e) {
            $rootScope.$broadcast('leafletDirectiveMap.utfgridMouseout', e);
        });

        utfgrid.on('click', function(e) {
            $rootScope.$broadcast('leafletDirectiveMap.utfgridClick', e);
        });

        return utfgrid;
    };

    var layerTypes = {
        xyz: {
            mustHaveUrl: true,
            createLayer: function(params) {
                return L.tileLayer(params.url, params.options);
            }
        },
        mapbox: {
            mustHaveKey: true,
            createLayer: function(params) {
                var url = '//{s}.tiles.mapbox.com/v3/' + params.key + '/{z}/{x}/{y}.png';
                return L.tileLayer(url, params.options);
            }
        },
        geoJSON: {
            mustHaveUrl: true,
            createLayer: function(params) {
                if (!Helpers.GeoJSONPlugin.isLoaded()) {
                    return;
                }
                return new L.TileLayer.GeoJSON(params.url, params.pluginOptions, params.options);
            }
        },
        utfGrid: {
            mustHaveUrl: true,
            createLayer: utfGridCreateLayer
        },
        cartodbTiles: {
            mustHaveKey: true,
            createLayer: function(params) {
                var url = '//' + params.user + '.cartodb.com/api/v1/map/' + params.key + '/{z}/{x}/{y}.png';
                return L.tileLayer(url, params.options);
            }
        },
        cartodbUTFGrid: {
            mustHaveKey: true,
            mustHaveLayer : true,
            createLayer: function(params) {
                params.url = '//' + params.user + '.cartodb.com/api/v1/map/' + params.key + '/' + params.layer + '/{z}/{x}/{y}.grid.json';
                return utfGridCreateLayer(params);
            }
        },
        cartodbInteractive: {
            mustHaveKey: true,
            mustHaveLayer : true,
            createLayer: function(params) {
                var tilesURL = '//' + params.user + '.cartodb.com/api/v1/map/' + params.key + '/{z}/{x}/{y}.png';
                var tileLayer = L.tileLayer(tilesURL, params.options);
                params.url = '//' + params.user + '.cartodb.com/api/v1/map/' + params.key + '/' + params.layer + '/{z}/{x}/{y}.grid.json';
                var utfLayer = utfGridCreateLayer(params);
                return L.layerGroup([tileLayer, utfLayer]);
            }
        },
        wms: {
            mustHaveUrl: true,
            createLayer: function(params) {
                return L.tileLayer.wms(params.url, params.options);
            }
        },
        wmts: {
            mustHaveUrl: true,
            createLayer: function(params) {
                return L.tileLayer.wmts(params.url, params.options);
            }
        },
        wfs: {
            mustHaveUrl: true,
            mustHaveLayer : true,
            createLayer: function(params) {
                if (!Helpers.WFSLayerPlugin.isLoaded()) {
                    return;
                }
                var options = angular.copy(params.options);
                if(options.crs && 'string' === typeof options.crs) {
                    /*jshint -W061 */
                    options.crs = eval(options.crs);
                }
                return new L.GeoJSON.WFS(params.url, params.layer, options);
            }
        },
        group: {
            mustHaveUrl: false,
            createLayer: function () {
                return L.layerGroup();
            }
        },
        featureGroup: {
            mustHaveUrl: false,
            createLayer: function () {
                return L.featureGroup();
            }
        },
        google: {
            mustHaveUrl: false,
            createLayer: function(params) {
                var type = params.type || 'SATELLITE';
                if (!Helpers.GoogleLayerPlugin.isLoaded()) {
                    return;
                }
                return new L.Google(type, params.options);
            }
        },
        china:{
            mustHaveUrl:false,
            createLayer:function(params){
                var type = params.type || '';
                if(!Helpers.ChinaLayerPlugin.isLoaded()){
                    return;
                }
                return L.tileLayer.chinaProvider(type, params.options);
            }
        },
        ags: {
            mustHaveUrl: true,
            createLayer: function(params) {
                if (!Helpers.AGSLayerPlugin.isLoaded()) {
                    return;
                }

                var options = angular.copy(params.options);
                angular.extend(options, {
                    url: params.url
                });
                var layer = new lvector.AGS(options);
                layer.onAdd = function(map) {
                    this.setMap(map);
                };
                layer.onRemove = function() {
                    this.setMap(null);
                };
                return layer;
            }
        },
        dynamic: {
            mustHaveUrl: true,
            createLayer: function(params) {
                if (!Helpers.DynamicMapLayerPlugin.isLoaded()) {
                    return;
                }
                return L.esri.dynamicMapLayer(params.url, params.options);
            }
        },
        markercluster: {
            mustHaveUrl: false,
            createLayer: function(params) {
                if (!Helpers.MarkerClusterPlugin.isLoaded()) {
                    $log.error('[AngularJS - Leaflet] The markercluster plugin is not loaded.');
                    return;
                }
                return new L.MarkerClusterGroup(params.options);
            }
        },
        bing: {
            mustHaveUrl: false,
            createLayer: function(params) {
                if (!Helpers.BingLayerPlugin.isLoaded()) {
                    return;
                }
                return new L.BingLayer(params.key, params.options);
            }
        },
        heatmap: {
            mustHaveUrl: false,
            mustHaveData: true,
            createLayer: function(params) {
                if (!Helpers.HeatMapLayerPlugin.isLoaded()) {
                    return;
                }
                var layer = new L.TileLayer.WebGLHeatMap(params.options);
                if (isDefined(params.data)) {
                    layer.setData(params.data);
                }

                return layer;
            }
        },
        yandex: {
            mustHaveUrl: false,
            createLayer: function(params) {
                var type = params.type || 'map';
                if (!Helpers.YandexLayerPlugin.isLoaded()) {
                    return;
                }
                return new L.Yandex(type, params.options);
            }
        },
        imageOverlay: {
            mustHaveUrl: true,
            mustHaveBounds : true,
            createLayer: function(params) {
                return L.imageOverlay(params.url, params.bounds, params.options);
            }
        },

        // This "custom" type is used to accept every layer that user want to define himself.
        // We can wrap these custom layers like heatmap or yandex, but it means a lot of work/code to wrap the world,
        // so we let user to define their own layer outside the directive,
        // and pass it on "createLayer" result for next processes
        custom: {
            createLayer: function (params) {
                if (params.layer instanceof L.Class) {
                    return angular.copy(params.layer);
                }
                else {
                    $log.error('[AngularJS - Leaflet] A custom layer must be a leaflet Class');
                }
            }
        },
        cartodb: {
            mustHaveUrl: true,
            createLayer: function(params) {
                return cartodb.createLayer(params.map, params.url);
            }
        }
    };

    function isValidLayerType(layerDefinition) {
        // Check if the baselayer has a valid type
        if (!isString(layerDefinition.type)) {
            $log.error('[AngularJS - Leaflet] A layer must have a valid type defined.');
            return false;
        }

        if (Object.keys(layerTypes).indexOf(layerDefinition.type) === -1) {
            $log.error('[AngularJS - Leaflet] A layer must have a valid type: ' + Object.keys(layerTypes));
            return false;
        }

        // Check if the layer must have an URL
        if (layerTypes[layerDefinition.type].mustHaveUrl && !isString(layerDefinition.url)) {
            $log.error('[AngularJS - Leaflet] A base layer must have an url');
            return false;
        }

        if (layerTypes[layerDefinition.type].mustHaveData && !isDefined(layerDefinition.data)) {
            $log.error('[AngularJS - Leaflet] The base layer must have a "data" array attribute');
            return false;
        }

        if(layerTypes[layerDefinition.type].mustHaveLayer && !isDefined(layerDefinition.layer)) {
            $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have an layer defined');
            return false;
        }

        if (layerTypes[layerDefinition.type].mustHaveBounds && !isDefined(layerDefinition.bounds)) {
            $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have bounds defined');
            return false ;
        }

        if (layerTypes[layerDefinition.type].mustHaveKey && !isDefined(layerDefinition.key)) {
            $log.error('[AngularJS - Leaflet] The type of layer ' + layerDefinition.type + ' must have key defined');
            return false ;
        }
        return true;
    }

    return {
        createLayer: function(layerDefinition) {
            if (!isValidLayerType(layerDefinition)) {
                return;
            }

            if (!isString(layerDefinition.name)) {
                $log.error('[AngularJS - Leaflet] A base layer must have a name');
                return;
            }
            if (!isObject(layerDefinition.layerParams)) {
                layerDefinition.layerParams = {};
            }
            if (!isObject(layerDefinition.layerOptions)) {
                layerDefinition.layerOptions = {};
            }

            // Mix the layer specific parameters with the general Leaflet options. Although this is an overhead
            // the definition of a base layers is more 'clean' if the two types of parameters are differentiated
            for (var attrname in layerDefinition.layerParams) {
                layerDefinition.layerOptions[attrname] = layerDefinition.layerParams[attrname];
            }

            var params = {
                url: layerDefinition.url,
                data: layerDefinition.data,
                options: layerDefinition.layerOptions,
                layer: layerDefinition.layer,
                type: layerDefinition.layerType,
                bounds: layerDefinition.bounds,
                key: layerDefinition.key,
                pluginOptions: layerDefinition.pluginOptions,
                user: layerDefinition.user
            };

            //TODO Add $watch to the layer properties
            return layerTypes[layerDefinition.type].createLayer(params);
        }
    };
}]);

angular.module("leaflet-directive").factory('leafletControlHelpers', ["$rootScope", "$log", "leafletHelpers", "leafletMapDefaults", function ($rootScope, $log, leafletHelpers, leafletMapDefaults) {
    var isObject = leafletHelpers.isObject,
        isDefined = leafletHelpers.isDefined;
    var _layersControl;

    var _controlLayersMustBeVisible = function(baselayers, overlays, mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        if(!defaults.controls.layers.visible) {
            return false;
        }

        var numberOfLayers = 0;
        if (isObject(baselayers)) {
            numberOfLayers += Object.keys(baselayers).length;
        }
        if (isObject(overlays)) {
            numberOfLayers += Object.keys(overlays).length;
        }
        return numberOfLayers > 1;
    };

    var _createLayersControl = function(mapId) {
        var defaults = leafletMapDefaults.getDefaults(mapId);
        var controlOptions = {
            collapsed: defaults.controls.layers.collapsed,
            position: defaults.controls.layers.position
        };

        angular.extend(controlOptions, defaults.controls.layers.options);

        var control;
        if(defaults.controls.layers && isDefined(defaults.controls.layers.control)) {
			control = defaults.controls.layers.control.apply(this, [[], [], controlOptions]);
		} else {
			control = new L.control.layers([], [], controlOptions);
		}

        return control;
    };

    return {
        layersControlMustBeVisible: _controlLayersMustBeVisible,

        updateLayersControl: function(map, mapId, loaded, baselayers, overlays, leafletLayers) {
            var i;

            var mustBeLoaded = _controlLayersMustBeVisible(baselayers, overlays, mapId);
            if (isDefined(_layersControl) && loaded) {
                for (i in leafletLayers.baselayers) {
                    _layersControl.removeLayer(leafletLayers.baselayers[i]);
                }
                for (i in leafletLayers.overlays) {
                    _layersControl.removeLayer(leafletLayers.overlays[i]);
                }
                _layersControl.removeFrom(map);
            }

            if (mustBeLoaded) {
                _layersControl = _createLayersControl(mapId);
                for (i in baselayers) {
                    if (isDefined(leafletLayers.baselayers[i])) {
                        _layersControl.addBaseLayer(leafletLayers.baselayers[i], baselayers[i].name);
                    }
                }
                for (i in overlays) {
                    if (isDefined(leafletLayers.overlays[i])) {
                        _layersControl.addOverlay(leafletLayers.overlays[i], overlays[i].name);
                    }
                }
                _layersControl.addTo(map);
            }
            return mustBeLoaded;
        }
    };
}]);

angular.module("leaflet-directive").factory('leafletLegendHelpers', function () {
	var _updateArcGISLegend = function(div, legendData) {
		div.innerHTML = '';
		if(legendData.error) {
			div.innerHTML += '<div class="info-title alert alert-danger">' + legendData.error.message + '</div>';
		} else {
			for (var i = 0; i < legendData.layers.length; i++) {
				var layer = legendData.layers[i];
				div.innerHTML += '<div class="info-title" data-layerid="' + layer.layerId + '">' + layer.layerName + '</div>';
				for(var j = 0; j < layer.legend.length; j++) {
					var leg = layer.legend[j];
					div.innerHTML +=
						'<div class="inline" data-layerid="' + layer.layerId + '"><img src="data:' + leg.contentType + ';base64,' + leg.imageData + '" /></div>' +
						'<div class="info-label" data-layerid="' + layer.layerId + '">' + leg.label + '</div>';
				}
			}
		}
	};

	var _getOnAddArcGISLegend = function(legendData, legendClass) {
		return function(/*map*/) {
			var div = L.DomUtil.create('div', legendClass);

			if (!L.Browser.touch) {
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
			} else {
				L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
			}
			_updateArcGISLegend(div, legendData);
			return div;
		};
	};

	var _getOnAddArrayLegend = function(legend, legendClass) {
		return function(/*map*/) {
			var div = L.DomUtil.create('div', legendClass);
            for (var i = 0; i < legend.colors.length; i++) {
                div.innerHTML +=
                    '<div class="outline"><i style="background:' + legend.colors[i] + '"></i></div>' +
                    '<div class="info-label">' + legend.labels[i] + '</div>';
            }
            if (!L.Browser.touch) {
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
			} else {
				L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
			}
            return div;
		};
	};

	return {
		getOnAddArcGISLegend: _getOnAddArcGISLegend,
		getOnAddArrayLegend: _getOnAddArrayLegend,
		updateArcGISLegend: _updateArcGISLegend,
	};
});

angular.module("leaflet-directive").factory('leafletPathsHelpers', ["$rootScope", "$log", "leafletHelpers", function ($rootScope, $log, leafletHelpers) {
    var isDefined = leafletHelpers.isDefined,
        isArray = leafletHelpers.isArray,
        isNumber = leafletHelpers.isNumber,
        isValidPoint = leafletHelpers.isValidPoint;
    var availableOptions = [
        // Path options
        'stroke', 'weight', 'color', 'opacity',
        'fill', 'fillColor', 'fillOpacity',
        'dashArray', 'lineCap', 'lineJoin', 'clickable',
        'pointerEvents', 'className',

        // Polyline options
        'smoothFactor', 'noClip'
    ];
    function _convertToLeafletLatLngs(latlngs) {
        return latlngs.filter(function(latlng) {
            return isValidPoint(latlng);
        }).map(function (latlng) {
            return _convertToLeafletLatLng(latlng);
        });
    }

    function _convertToLeafletLatLng(latlng) {
        if (isArray(latlng)) {
            return new L.LatLng(latlng[0], latlng[1]);
        } else {
            return new L.LatLng(latlng.lat, latlng.lng);
        }
    }

    function _convertToLeafletMultiLatLngs(paths) {
        return paths.map(function(latlngs) {
            return _convertToLeafletLatLngs(latlngs);
        });
    }

    function _getOptions(path, defaults) {
        var options = {};
        for (var i = 0; i < availableOptions.length; i++) {
            var optionName = availableOptions[i];

            if (isDefined(path[optionName])) {
                options[optionName] = path[optionName];
            } else if (isDefined(defaults.path[optionName])) {
                options[optionName] = defaults.path[optionName];
            }
        }

        return options;
    }

    var _updatePathOptions = function (path, data) {
        var updatedStyle = {};
        for (var i = 0; i < availableOptions.length; i++) {
            var optionName = availableOptions[i];
            if (isDefined(data[optionName])) {
                updatedStyle[optionName] = data[optionName];
            }
        }
        path.setStyle(data);
    };

    var _isValidPolyline = function(latlngs) {
        if (!isArray(latlngs)) {
            return false;
        }
        for (var i = 0; i < latlngs.length; i++) {
            var point = latlngs[i];
            if (!isValidPoint(point)) {
                return false;
            }
        }
        return true;
    };

    var pathTypes = {
        polyline: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                return _isValidPolyline(latlngs);
            },
            createPath: function(options) {
                return new L.Polyline([], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        multiPolyline: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                if (!isArray(latlngs)) {
                    return false;
                }

                for (var i in latlngs) {
                    var polyline = latlngs[i];
                    if (!_isValidPolyline(polyline)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.multiPolyline([[[0,0],[1,1]]], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        } ,
        polygon: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;
                return _isValidPolyline(latlngs);
            },
            createPath: function(options) {
                return new L.Polygon([], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        multiPolygon: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;

                if (!isArray(latlngs)) {
                    return false;
                }

                for (var i in latlngs) {
                    var polyline = latlngs[i];
                    if (!_isValidPolyline(polyline)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.MultiPolygon([[[0,0],[1,1],[0,1]]], options);
            },
            setPath: function(path, data) {
                path.setLatLngs(_convertToLeafletMultiLatLngs(data.latlngs));
                _updatePathOptions(path, data);
                return;
            }
        },
        rectangle: {
            isValid: function(pathData) {
                var latlngs = pathData.latlngs;

                if (!isArray(latlngs) || latlngs.length !== 2) {
                    return false;
                }

                for (var i in latlngs) {
                    var point = latlngs[i];
                    if (!isValidPoint(point)) {
                        return false;
                    }
                }

                return true;
            },
            createPath: function(options) {
                return new L.Rectangle([[0,0],[1,1]], options);
            },
            setPath: function(path, data) {
                path.setBounds(new L.LatLngBounds(_convertToLeafletLatLngs(data.latlngs)));
                _updatePathOptions(path, data);
            }
        },
        circle: {
            isValid: function(pathData) {
                var point= pathData.latlngs;
                return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function(options) {
                return new L.Circle([0,0], 1, options);
            },
            setPath: function(path, data) {
                path.setLatLng(_convertToLeafletLatLng(data.latlngs));
                if (isDefined(data.radius)) {
                    path.setRadius(data.radius);
                }
                _updatePathOptions(path, data);
            }
        },
        circleMarker: {
            isValid: function(pathData) {
                var point= pathData.latlngs;
                return isValidPoint(point) && isNumber(pathData.radius);
            },
            createPath: function(options) {
                return new L.CircleMarker([0,0], options);
            },
            setPath: function(path, data) {
                path.setLatLng(_convertToLeafletLatLng(data.latlngs));
                if (isDefined(data.radius)) {
                    path.setRadius(data.radius);
                }
                _updatePathOptions(path, data);
            }
        }
    };

    var _getPathData = function(path) {
        var pathData = {};
        if (path.latlngs) {
            pathData.latlngs = path.latlngs;
        }

        if (path.radius) {
            pathData.radius = path.radius;
        }

        return pathData;
    };

    return {
        setPathOptions: function(leafletPath, pathType, data) {
            if(!isDefined(pathType)) {
                pathType = "polyline";
            }
            pathTypes[pathType].setPath(leafletPath, data);
        },
        createPath: function(name, path, defaults) {
            if(!isDefined(path.type)) {
                path.type = "polyline";
            }
            var options = _getOptions(path, defaults);
            var pathData = _getPathData(path);

            if (!pathTypes[path.type].isValid(pathData)) {
                $log.error("[AngularJS - Leaflet] Invalid data passed to the " + path.type + " path");
                return;
            }

            return pathTypes[path.type].createPath(options);
        }
    };
}]);

angular.module("leaflet-directive").factory('leafletBoundsHelpers', ["$log", "leafletHelpers", function ($log, leafletHelpers) {

    var isArray = leafletHelpers.isArray,
        isNumber = leafletHelpers.isNumber;

    function _isValidBounds(bounds) {
        return angular.isDefined(bounds) && angular.isDefined(bounds.southWest) &&
               angular.isDefined(bounds.northEast) && angular.isNumber(bounds.southWest.lat) &&
               angular.isNumber(bounds.southWest.lng) && angular.isNumber(bounds.northEast.lat) &&
               angular.isNumber(bounds.northEast.lng);
    }

    return {
        createLeafletBounds: function(bounds) {
            if (_isValidBounds(bounds)) {
                return L.latLngBounds([bounds.southWest.lat, bounds.southWest.lng],
                                      [bounds.northEast.lat, bounds.northEast.lng ]);
            }
        },

        isValidBounds: _isValidBounds,

        createBoundsFromArray: function(boundsArray) {
            if (!(isArray(boundsArray) && boundsArray.length === 2 &&
                  isArray(boundsArray[0]) && isArray(boundsArray[1]) &&
                  boundsArray[0].length === 2 && boundsArray[1].length === 2 &&
                  isNumber(boundsArray[0][0]) && isNumber(boundsArray[0][1]) &&
                  isNumber(boundsArray[1][0]) && isNumber(boundsArray[1][1]))) {
                $log.error("[AngularJS - Leaflet] The bounds array is not valid.");
                return;
            }

            return {
                northEast: {
                    lat: boundsArray[0][0],
                    lng: boundsArray[0][1]
                },
                southWest: {
                    lat: boundsArray[1][0],
                    lng: boundsArray[1][1]
                }
            };

        }
    };
}]);

angular.module("leaflet-directive").factory('leafletMarkersHelpers', ["$rootScope", "leafletHelpers", "$log", function ($rootScope, leafletHelpers, $log) {

    var isDefined = leafletHelpers.isDefined,
        MarkerClusterPlugin = leafletHelpers.MarkerClusterPlugin,
        AwesomeMarkersPlugin = leafletHelpers.AwesomeMarkersPlugin,
        MakiMarkersPlugin = leafletHelpers.MakiMarkersPlugin,
        safeApply     = leafletHelpers.safeApply,
        Helpers = leafletHelpers,
        isString = leafletHelpers.isString,
        isNumber  = leafletHelpers.isNumber,
        isObject = leafletHelpers.isObject,
        groups = {};

    var createLeafletIcon = function(iconData) {
        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'awesomeMarker') {
            if (!AwesomeMarkersPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The AwesomeMarkers Plugin is not loaded.');
            }

            return new L.AwesomeMarkers.icon(iconData);
        }

        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'makiMarker') {
            if (!MakiMarkersPlugin.isLoaded()) {
                $log.error('[AngularJS - Leaflet] The MakiMarkers Plugin is not loaded.');
            }

            return new L.MakiMarkers.icon(iconData);
        }

        if (isDefined(iconData) && isDefined(iconData.type) && iconData.type === 'div') {
            return new L.divIcon(iconData);
        }

        var base64icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAGmklEQVRYw7VXeUyTZxjvNnfELFuyIzOabermMZEeQC/OclkO49CpOHXOLJl/CAURuYbQi3KLgEhbrhZ1aDwmaoGqKII6odATmH/scDFbdC7LvFqOCc+e95s2VG50X/LLm/f4/Z7neY/ne18aANCmAr5E/xZf1uDOkTcGcWR6hl9247tT5U7Y6SNvWsKT63P58qbfeLJG8M5qcgTknrvvrdDbsT7Ml+tv82X6vVxJE33aRmgSyYtcWVMqX97Yv2JvW39UhRE2HuyBL+t+gK1116ly06EeWFNlAmHxlQE0OMiV6mQCScusKRlhS3QLeVJdl1+23h5dY4FNB3thrbYboqptEFlphTC1hSpJnbRvxP4NWgsE5Jyz86QNNi/5qSUTGuFk1gu54tN9wuK2wc3o+Wc13RCmsoBwEqzGcZsxsvCSy/9wJKf7UWf1mEY8JWfewc67UUoDbDjQC+FqK4QqLVMGGR9d2wurKzqBk3nqIT/9zLxRRjgZ9bqQgub+DdoeCC03Q8j+0QhFhBHR/eP3U/zCln7Uu+hihJ1+bBNffLIvmkyP0gpBZWYXhKussK6mBz5HT6M1Nqpcp+mBCPXosYQfrekGvrjewd59/GvKCE7TbK/04/ZV5QZYVWmDwH1mF3xa2Q3ra3DBC5vBT1oP7PTj4C0+CcL8c7C2CtejqhuCnuIQHaKHzvcRfZpnylFfXsYJx3pNLwhKzRAwAhEqG0SpusBHfAKkxw3w4627MPhoCH798z7s0ZnBJ/MEJbZSbXPhER2ih7p2ok/zSj2cEJDd4CAe+5WYnBCgR2uruyEw6zRoW6/DWJ/OeAP8pd/BGtzOZKpG8oke0SX6GMmRk6GFlyAc59K32OTEinILRJRchah8HQwND8N435Z9Z0FY1EqtxUg+0SO6RJ/mmXz4VuS+DpxXC3gXmZwIL7dBSH4zKE50wESf8qwVgrP1EIlTO5JP9Igu0aexdh28F1lmAEGJGfh7jE6ElyM5Rw/FDcYJjWhbeiBYoYNIpc2FT/SILivp0F1ipDWk4BIEo2VuodEJUifhbiltnNBIXPUFCMpthtAyqws/BPlEF/VbaIxErdxPphsU7rcCp8DohC+GvBIPJS/tW2jtvTmmAeuNO8BNOYQeG8G/2OzCJ3q+soYB5i6NhMaKr17FSal7GIHheuV3uSCY8qYVuEm1cOzqdWr7ku/R0BDoTT+DT+ohCM6/CCvKLKO4RI+dXPeAuaMqksaKrZ7L3FE5FIFbkIceeOZ2OcHO6wIhTkNo0ffgjRGxEqogXHYUPHfWAC/lADpwGcLRY3aeK4/oRGCKYcZXPVoeX/kelVYY8dUGf8V5EBRbgJXT5QIPhP9ePJi428JKOiEYhYXFBqou2Guh+p/mEB1/RfMw6rY7cxcjTrneI1FrDyuzUSRm9miwEJx8E/gUmqlyvHGkneiwErR21F3tNOK5Tf0yXaT+O7DgCvALTUBXdM4YhC/IawPU+2PduqMvuaR6eoxSwUk75ggqsYJ7VicsnwGIkZBSXKOUww73WGXyqP+J2/b9c+gi1YAg/xpwck3gJuucNrh5JvDPvQr0WFXf0piyt8f8/WI0hV4pRxxkQZdJDfDJNOAmM0Ag8jyT6hz0WGXWuP94Yh2jcfjmXAGvHCMslRimDHYuHuDsy2QtHuIavznhbYURq5R57KpzBBRZKPJi8eQg48h4j8SDdowifdIrEVdU+gbO6QNvRRt4ZBthUaZhUnjlYObNagV3keoeru3rU7rcuceqU1mJBxy+BWZYlNEBH+0eH4vRiB+OYybU2hnblYlTvkHinM4m54YnxSyaZYSF6R3jwgP7udKLGIX6r/lbNa9N6y5MFynjWDtrHd75ZvTYAPO/6RgF0k76mQla3FGq7dO+cH8sKn0Vo7nDllwAhqwLPkxrHwWmHJOo+AKJ4rab5OgrM7rVu8eWb2Pu0Dh4eDgXoOfvp7Y7QeqknRmvcTBEyq9m/HQQSCSz6LHq3z0yzsNySRfMS253wl2KyRDbcZPcfJKjZmSEOjcxyi+Y8dUOtsIEH6R2wNykdqrkYJ0RV92H0W58pkfQk7cKevsLK10Py8SdMGfXNXATY+pPbyJR/ET6n9nIfztNtZYRV9XniQu9IA2vOVgy4ir7GCLVmmd+zjkH0eAF9Po6K61pmCXHxU5rHMYd1ftc3owjwRSVRzLjKvqZEty6cRUD7jGqiOdu5HG6MdHjNcNYGqfDm5YRzLBBCCDl/2bk8a8gdbqcfwECu62Fg/HrggAAAABJRU5ErkJggg==";

        var base64shadow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAC5ElEQVRYw+2YW4/TMBCF45S0S1luXZCABy5CgLQgwf//S4BYBLTdJLax0fFqmB07nnQfEGqkIydpVH85M+NLjPe++dcPc4Q8Qh4hj5D/AaQJx6H/4TMwB0PeBNwU7EGQAmAtsNfAzoZkgIa0ZgLMa4Aj6CxIAsjhjOCoL5z7Glg1JAOkaicgvQBXuncwJAWjksLtBTWZe04CnYRktUGdilALppZBOgHGZcBzL6OClABvMSVIzyBjazOgrvACf1ydC5mguqAVg6RhdkSWQFj2uxfaq/BrIZOLEWgZdALIDvcMcZLD8ZbLC9de4yR1sYMi4G20S4Q/PWeJYxTOZn5zJXANZHIxAd4JWhPIloTJZhzMQduM89WQ3MUVAE/RnhAXpTycqys3NZALOBbB7kFrgLesQl2h45Fcj8L1tTSohUwuxhy8H/Qg6K7gIs+3kkaigQCOcyEXCHN07wyQazhrmIulvKMQAwMcmLNqyCVyMAI+BuxSMeTk3OPikLY2J1uE+VHQk6ANrhds+tNARqBeaGc72cK550FP4WhXmFmcMGhTwAR1ifOe3EvPqIegFmF+C8gVy0OfAaWQPMR7gF1OQKqGoBjq90HPMP01BUjPOqGFksC4emE48tWQAH0YmvOgF3DST6xieJgHAWxPAHMuNhrImIdvoNOKNWIOcE+UXE0pYAnkX6uhWsgVXDxHdTfCmrEEmMB2zMFimLVOtiiajxiGWrbU52EeCdyOwPEQD8LqyPH9Ti2kgYMf4OhSKB7qYILbBv3CuVTJ11Y80oaseiMWOONc/Y7kJYe0xL2f0BaiFTxknHO5HaMGMublKwxFGzYdWsBF174H/QDknhTHmHHN39iWFnkZx8lPyM8WHfYELmlLKtgWNmFNzQcC1b47gJ4hL19i7o65dhH0Negbca8vONZoP7doIeOC9zXm8RjuL0Gf4d4OYaU5ljo3GYiqzrWQHfJxA6ALhDpVKv9qYeZA8eM3EhfPSCmpuD0AAAAASUVORK5CYII=";

        if (!isDefined(iconData)) {
            return new L.Icon.Default({
                iconUrl: base64icon,
                shadowUrl: base64shadow
            });
        }

        if (!isDefined(iconData.iconUrl)) {
            iconData.iconUrl = base64icon;
            iconData.shadowUrl = base64shadow;
        }

        return new L.Icon(iconData);
    };

    var _resetMarkerGroup = function(groupName) {
      if (isDefined(groups[groupName])) {
        groups.splice(groupName, 1);
      }
    };

    var _resetMarkerGroups = function() {
      groups = {};
    };

    var _deleteMarker = function(marker, map, layers) {
        marker.closePopup();
        // There is no easy way to know if a marker is added to a layer, so we search for it
        // if there are overlays
        if (isDefined(layers) && isDefined(layers.overlays)) {
            for (var key in layers.overlays) {
                if (layers.overlays[key] instanceof L.LayerGroup || layers.overlays[key] instanceof L.FeatureGroup) {
                    if (layers.overlays[key].hasLayer(marker)) {
                        layers.overlays[key].removeLayer(marker);
                        return;
                    }
                }
            }
        }

        if (isDefined(groups)) {
            for (var groupKey in groups) {
                if (groups[groupKey].hasLayer(marker)) {
                    groups[groupKey].removeLayer(marker);
                }
            }
        }

        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    };

    return {
        resetMarkerGroup: _resetMarkerGroup,

        resetMarkerGroups: _resetMarkerGroups,

        deleteMarker: _deleteMarker,

        createMarker: function(markerData) {
            if (!isDefined(markerData)) {
                $log.error('[AngularJS - Leaflet] The marker definition is not valid.');
                return;
            }

            var markerOptions = {
                icon: createLeafletIcon(markerData.icon),
                title: isDefined(markerData.title) ? markerData.title : '',
                draggable: isDefined(markerData.draggable) ? markerData.draggable : false,
                clickable: isDefined(markerData.clickable) ? markerData.clickable : true,
                riseOnHover: isDefined(markerData.riseOnHover) ? markerData.riseOnHover : false,
                zIndexOffset: isDefined(markerData.zIndexOffset) ? markerData.zIndexOffset : 0,
                iconAngle: isDefined(markerData.iconAngle) ? markerData.iconAngle : 0
            };
            // Add any other options not added above to markerOptions
            for (var markerDatum in markerData) {
                if (markerData.hasOwnProperty(markerDatum) && !markerOptions.hasOwnProperty(markerDatum)) {
                    markerOptions[markerDatum] = markerData[markerDatum];
                }
            }

            var marker = new L.marker(markerData, markerOptions);

            if (!isString(markerData.message)) {
                marker.unbindPopup();
            }

            return marker;
        },

        addMarkerToGroup: function(marker, groupName, groupOptions, map) {
            if (!isString(groupName)) {
                $log.error('[AngularJS - Leaflet] The marker group you have specified is invalid.');
                return;
            }

            if (!MarkerClusterPlugin.isLoaded()) {
                $log.error("[AngularJS - Leaflet] The MarkerCluster plugin is not loaded.");
                return;
            }
            if (!isDefined(groups[groupName])) {
                groups[groupName] = new L.MarkerClusterGroup(groupOptions);
                map.addLayer(groups[groupName]);
            }
            groups[groupName].addLayer(marker);
        },

        listenMarkerEvents: function(marker, markerData, leafletScope) {
            marker.on("popupopen", function(/* event */) {
                safeApply(leafletScope, function() {
                    markerData.focus = true;
                });
            });
            marker.on("popupclose", function(/* event */) {
                safeApply(leafletScope, function() {
                    markerData.focus = false;
                });
            });
        },

        addMarkerWatcher: function(marker, name, leafletScope, layers, map) {
            var clearWatch = leafletScope.$watch("markers[\""+name+"\"]", function(markerData, oldMarkerData) {
                if (!isDefined(markerData)) {
                    _deleteMarker(marker, map, layers);
                    clearWatch();
                    return;
                }

                if (!isDefined(oldMarkerData)) {
                    return;
                }

                // Update the lat-lng property (always present in marker properties)
                if (!(isNumber(markerData.lat) && isNumber(markerData.lng))) {
                    $log.warn('There are problems with lat-lng data, please verify your marker model');
                    _deleteMarker(marker, map, layers);
                    return;
                }

                // It is possible that the layer has been removed or the layer marker does not exist
                // Update the layer group if present or move it to the map if not
                if (!isString(markerData.layer)) {
                    // There is no layer information, we move the marker to the map if it was in a layer group
                    if (isString(oldMarkerData.layer)) {
                        // Remove from the layer group that is supposed to be
                        if (isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                            layers.overlays[oldMarkerData.layer].removeLayer(marker);
                            marker.closePopup();
                        }
                        // Test if it is not on the map and add it
                        if (!map.hasLayer(marker)) {
                            map.addLayer(marker);
                        }
                    }
                }

                if (isString(markerData.layer) && oldMarkerData.layer !== markerData.layer) {
                    // If it was on a layer group we have to remove it
                    if (isString(oldMarkerData.layer) && isDefined(layers.overlays[oldMarkerData.layer]) && layers.overlays[oldMarkerData.layer].hasLayer(marker)) {
                        layers.overlays[oldMarkerData.layer].removeLayer(marker);
                    }
                    marker.closePopup();

                    // Remove it from the map in case the new layer is hidden or there is an error in the new layer
                    if (map.hasLayer(marker)) {
                        map.removeLayer(marker);
                    }

                    // The markerData.layer is defined so we add the marker to the layer if it is different from the old data
                    if (!isDefined(layers.overlays[markerData.layer])) {
                        $log.error('[AngularJS - Leaflet] You must use a name of an existing layer');
                        return;
                    }
                    // Is a group layer?
                    var layerGroup = layers.overlays[markerData.layer];
                    if (!(layerGroup instanceof L.LayerGroup || layerGroup instanceof L.FeatureGroup)) {
                        $log.error('[AngularJS - Leaflet] A marker can only be added to a layer of type "group" or "featureGroup"');
                        return;
                    }
                    // The marker goes to a correct layer group, so first of all we add it
                    layerGroup.addLayer(marker);
                    // The marker is automatically added to the map depending on the visibility
                    // of the layer, so we only have to open the popup if the marker is in the map
                    if (map.hasLayer(marker) && markerData.focus === true) {
                        marker.openPopup();
                    }
                }

                // Update the draggable property
                if (markerData.draggable !== true && oldMarkerData.draggable === true && (isDefined(marker.dragging))) {
                    marker.dragging.disable();
                }

                if (markerData.draggable === true && oldMarkerData.draggable !== true) {
                    // The markerData.draggable property must be true so we update if there wasn't a previous value or it wasn't true
                    if (marker.dragging) {
                        marker.dragging.enable();
                    } else {
                        if (L.Handler.MarkerDrag) {
                            marker.dragging = new L.Handler.MarkerDrag(marker);
                            marker.options.draggable = true;
                            marker.dragging.enable();
                        }
                    }
                }

                // Update the icon property
                if (!isObject(markerData.icon)) {
                    // If there is no icon property or it's not an object
                    if (isObject(oldMarkerData.icon)) {
                        // If there was an icon before restore to the default
                        marker.setIcon(createLeafletIcon());
                        marker.closePopup();
                        marker.unbindPopup();
                        if (isString(markerData.message)) {
                            marker.bindPopup(markerData.message, markerData.popupOptions);
                        }
                    }
                }

                if (isObject(markerData.icon) && isObject(oldMarkerData.icon) && !angular.equals(markerData.icon, oldMarkerData.icon)) {
                    var dragG = false;
                    if (marker.dragging) {
                        dragG = marker.dragging.enabled();
                    }
                    marker.setIcon(createLeafletIcon(markerData.icon));
                    if (dragG) {
                        marker.dragging.enable();
                    }
                    marker.closePopup();
                    marker.unbindPopup();
                    if (isString(markerData.message)) {
                        marker.bindPopup(markerData.message, markerData.popupOptions);
                    }
                }

                // Update the Popup message property
                if (!isString(markerData.message) && isString(oldMarkerData.message)) {
                    marker.closePopup();
                    marker.unbindPopup();
                }

                // Update the label content
                if (Helpers.LabelPlugin.isLoaded() && isDefined(markerData.label) && isDefined(markerData.label.message) && !angular.equals(markerData.label.message, oldMarkerData.label.message)) {
                    marker.updateLabelContent(markerData.label.message);
                }

                // There is some text in the popup, so we must show the text or update existing
                if (isString(markerData.message) && !isString(oldMarkerData.message)) {
                    // There was no message before so we create it
                    marker.bindPopup(markerData.message, markerData.popupOptions);
                    if (markerData.focus === true) {
                        // If the focus is set, we must open the popup, because we do not know if it was opened before
                        marker.openPopup();
                    }
                }

                if (isString(markerData.message) && isString(oldMarkerData.message) && markerData.message !== oldMarkerData.message) {
                    // There was a different previous message so we update it
                    marker.setPopupContent(markerData.message);
                }

                // Update the focus property
                var updatedFocus = false;
                if (markerData.focus !== true && oldMarkerData.focus === true) {
                    // If there was a focus property and was true we turn it off
                    marker.closePopup();
                    updatedFocus = true;
                }

                // The markerData.focus property must be true so we update if there wasn't a previous value or it wasn't true
                if (markerData.focus === true && oldMarkerData.focus !== true) {
                    marker.openPopup();
                    updatedFocus = true;
                }

                if(oldMarkerData.focus === true && markerData.focus === true){
                    // Reopen the popup when focus is still true
                    marker.openPopup();
                    updatedFocus = true;
                }

                // zIndexOffset adjustment
                if (oldMarkerData.zIndexOffset !== markerData.zIndexOffset) {
                    marker.setZIndexOffset(markerData.zIndexOffset);
                }

                var markerLatLng = marker.getLatLng();
                var isCluster = (isString(markerData.layer) && Helpers.MarkerClusterPlugin.is(layers.overlays[markerData.layer]));
                // If the marker is in a cluster it has to be removed and added to the layer when the location is changed
                if (isCluster) {
                    // The focus has changed even by a user click or programatically
                    if (updatedFocus) {
                        // We only have to update the location if it was changed programatically, because it was
                        // changed by a user drag the marker data has already been updated by the internal event
                        // listened by the directive
                        if ((markerData.lat !== oldMarkerData.lat) || (markerData.lng !== oldMarkerData.lng)) {
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        }
                    } else {
                        // The marker has possibly moved. It can be moved by a user drag (marker location and data are equal but old
                        // data is diferent) or programatically (marker location and data are diferent)
                        if ((markerLatLng.lat !== markerData.lat) || (markerLatLng.lng !== markerData.lng)) {
                            // The marker was moved by a user drag
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        } else if ((markerData.lat !== oldMarkerData.lat) || (markerData.lng !== oldMarkerData.lng)) {
                            // The marker was moved programatically
                            layers.overlays[markerData.layer].removeLayer(marker);
                            marker.setLatLng([markerData.lat, markerData.lng]);
                            layers.overlays[markerData.layer].addLayer(marker);
                        } else if (isObject(markerData.icon) && isObject(oldMarkerData.icon) && !angular.equals(markerData.icon, oldMarkerData.icon)) {
                            layers.overlays[markerData.layer].removeLayer(marker);
                            layers.overlays[markerData.layer].addLayer(marker);
                        }
                    }
                } else if (markerLatLng.lat !== markerData.lat || markerLatLng.lng !== markerData.lng) {
                    marker.setLatLng([markerData.lat, markerData.lng]);
                }
            }, true);
        }
    };
}]);

angular.module("leaflet-directive").factory('leafletHelpers', ["$q", "$log", function ($q, $log) {

    function _obtainEffectiveMapId(d, mapId) {
        var id, i;
        if (!angular.isDefined(mapId)) {
        if (Object.keys(d).length === 0) {
            id = "main";
        } else if (Object.keys(d).length >= 1) {
            for (i in d) {
                if (d.hasOwnProperty(i)) {
                    id = i;
                }
            }
        } else if (Object.keys(d).length === 0) {
            id = "main";
        } else {
                $log.error("[AngularJS - Leaflet] - You have more than 1 map on the DOM, you must provide the map ID to the leafletData.getXXX call");
            }
        } else {
            id = mapId;
        }

        return id;
    }

    function _getUnresolvedDefer(d, mapId) {
        var id = _obtainEffectiveMapId(d, mapId),
            defer;

        if (!angular.isDefined(d[id]) || d[id].resolvedDefer === true) {
            defer = $q.defer();
            d[id] = {
                defer: defer,
                resolvedDefer: false
            };
        } else {
            defer = d[id].defer;
        }

        return defer;
    }

    return {
        //Determine if a reference is {}
        isEmpty: function(value) {
            return Object.keys(value).length === 0;
        },

        //Determine if a reference is undefined or {}
        isUndefinedOrEmpty: function (value) {
            return (angular.isUndefined(value) || value === null) || Object.keys(value).length === 0;
        },

        // Determine if a reference is defined
        isDefined: function(value) {
            return angular.isDefined(value) && value !== null;
        },

        // Determine if a reference is a number
        isNumber: function(value) {
            return angular.isNumber(value);
        },

        // Determine if a reference is a string
        isString: function(value) {
            return angular.isString(value);
        },

        // Determine if a reference is an array
        isArray: function(value) {
            return angular.isArray(value);
        },

        // Determine if a reference is an object
        isObject: function(value) {
            return angular.isObject(value);
        },

		// Determine if a reference is a function.
		isFunction: function(value) {
			return angular.isFunction(value);
		},

        // Determine if two objects have the same properties
        equals: function(o1, o2) {
            return angular.equals(o1, o2);
        },

        isValidCenter: function(center) {
            return angular.isDefined(center) && angular.isNumber(center.lat) &&
                   angular.isNumber(center.lng) && angular.isNumber(center.zoom);
        },

        isValidPoint: function(point) {
            if (!angular.isDefined(point)) {
                return false;
            }
            if (angular.isArray(point)) {
                return point.length === 2 && angular.isNumber(point[0]) && angular.isNumber(point[1]);
            }
            return angular.isNumber(point.lat) && angular.isNumber(point.lng);
        },

        isSameCenterOnMap: function(centerModel, map) {
            var mapCenter = map.getCenter();
            var zoom = map.getZoom();
            if (centerModel.lat && centerModel.lng &&
                mapCenter.lat.toFixed(4) === centerModel.lat.toFixed(4) &&
                mapCenter.lng.toFixed(4) === centerModel.lng.toFixed(4) &&
                zoom === centerModel.zoom) {
                    return true;
            }
            return false;
        },

        safeApply: function($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                $scope.$eval(fn);
            } else {
                $scope.$apply(fn);
            }
        },

        obtainEffectiveMapId: _obtainEffectiveMapId,

        getDefer: function(d, mapId) {
            var id = _obtainEffectiveMapId(d, mapId),
                defer;
            if (!angular.isDefined(d[id]) || d[id].resolvedDefer === false) {
                defer = _getUnresolvedDefer(d, mapId);
            } else {
                defer = d[id].defer;
            }
            return defer;
        },

        getUnresolvedDefer: _getUnresolvedDefer,

        setResolvedDefer: function(d, mapId) {
            var id = _obtainEffectiveMapId(d, mapId);
            d[id].resolvedDefer = true;
        },

        AwesomeMarkersPlugin: {
            isLoaded: function() {
                if (angular.isDefined(L.AwesomeMarkers) && angular.isDefined(L.AwesomeMarkers.Icon)) {
                    return true;
                } else {
                    return false;
                }
            },
            is: function(icon) {
                if (this.isLoaded()) {
                    return icon instanceof L.AwesomeMarkers.Icon;
                } else {
                    return false;
                }
            },
            equal: function (iconA, iconB) {
                if (!this.isLoaded()) {
                    return false;
                }
                if (this.is(iconA)) {
                    return angular.equals(iconA, iconB);
                } else {
                    return false;
                }
            }
        },

        PolylineDecoratorPlugin: {
            isLoaded: function() {
                if (angular.isDefined(L.PolylineDecorator)) {
                    return true;
                } else {
                    return false;
                }
            },
            is: function(decoration) {
                if (this.isLoaded()) {
                    return decoration instanceof L.PolylineDecorator;
                } else {
                    return false;
                }
            },
            equal: function(decorationA, decorationB) {
                if (!this.isLoaded()) {
                    return false;
                }
                if (this.is(decorationA)) {
                    return angular.equals(decorationA, decorationB);
                } else {
                    return false;
                }
            }
        },

        MakiMarkersPlugin: {
            isLoaded: function() {
                if (angular.isDefined(L.MakiMarkers) && angular.isDefined(L.MakiMarkers.Icon)) {
                    return true;
                } else {
                    return false;
                }
            },
            is: function(icon) {
                if (this.isLoaded()) {
                    return icon instanceof L.MakiMarkers.Icon;
                } else {
                    return false;
                }
            },
            equal: function (iconA, iconB) {
                if (!this.isLoaded()) {
                    return false;
                }
                if (this.is(iconA)) {
                    return angular.equals(iconA, iconB);
                } else {
                    return false;
                }
            }
        },
        LabelPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.Label);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.MarkerClusterGroup;
                } else {
                    return false;
                }
            }
        },
        MarkerClusterPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.MarkerClusterGroup);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.MarkerClusterGroup;
                } else {
                    return false;
                }
            }
        },
        GoogleLayerPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.Google);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.Google;
                } else {
                    return false;
                }
            }
        },
        ChinaLayerPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.tileLayer.chinaProvider);
            }
        },
        HeatMapLayerPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.TileLayer.WebGLHeatMap);
            }
        },
        BingLayerPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.BingLayer);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.BingLayer;
                } else {
                    return false;
                }
            }
        },
        WFSLayerPlugin: {
            isLoaded: function() {
                return L.GeoJSON.WFS !== undefined;
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.GeoJSON.WFS;
                } else {
                    return false;
                }
            }
        },
        AGSLayerPlugin: {
            isLoaded: function() {
                return lvector !== undefined && lvector.AGS !== undefined;
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof lvector.AGS;
                } else {
                    return false;
                }
            }
        },
        YandexLayerPlugin: {
            isLoaded: function() {
                return angular.isDefined(L.Yandex);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.Yandex;
                } else {
                    return false;
                }
            }
        },
		DynamicMapLayerPlugin: {
			isLoaded: function() {
				return L.esri !== undefined && L.esri.dynamicMapLayer !== undefined;
			},
			is: function(layer) {
				if (this.isLoaded()) {
					return layer instanceof L.esri.dynamicMapLayer;
				} else {
					return false;
				}
			}
        },
        GeoJSONPlugin: {
            isLoaded: function(){
                return angular.isDefined(L.TileLayer.GeoJSON);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.TileLayer.GeoJSON;
                } else {
                    return false;
                }
            }
        },
		UTFGridPlugin: {
            isLoaded: function(){
                return angular.isDefined(L.UtfGrid);
            },
            is: function(layer) {
                if (this.isLoaded()) {
                    return layer instanceof L.UtfGrid;
                } else {
                    $log.error('[AngularJS - Leaflet] No UtfGrid plugin found.');
                    return false;
                }
            }
        },
        CartoDB: {
            isLoaded: function(){
                return cartodb;
            },
            is: function(/*layer*/) {
                return true;
                /*
                if (this.isLoaded()) {
                    return layer instanceof L.TileLayer.GeoJSON;
                } else {
                    return false;
                }*/
            }
        },
        Leaflet: {
            DivIcon: {
                is: function(icon) {
                    return icon instanceof L.DivIcon;
                },
                equal: function(iconA, iconB) {
                    if (this.is(iconA)) {
                        return angular.equals(iconA, iconB);
                    } else {
                        return false;
                    }
                }
            },
            Icon: {
                is: function(icon) {
                    return icon instanceof L.Icon;
                },
                equal: function(iconA, iconB) {
                    if (this.is(iconA)) {
                        return angular.equals(iconA, iconB);
                    } else {
                        return false;
                    }
                }
            }
        }
    };
}]);

}());;/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
;/*
 * angular-marked
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */

(function () {
	'use strict';

  var app = angular.module('hc.marked', []);

  //app.constant('marked', window.marked);

  app.provider('marked', function () {

    var self = this;

    self.setOptions = function(opts) {  // Store options for later
      this.defaults = opts;
    };

    self.$get = ['$window',function ($window) { 
      var m = $window.marked;

      self.setOptions = m.setOptions;
      m.setOptions(self.defaults);

      return m;
    }];

  });

  // TODO: filter tests */
  //app.filter('marked', ['marked', function(marked) {
	//  return marked;
	//}]);

  app.directive('marked', ['marked', function (marked) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        opts: '=',
        marked: '='
      },
      link: function (scope, element, attrs) {
        set(scope.marked || element.text() || '');

        function set(val) {
        	element.html(marked(val || '', scope.opts || null));
        }
        
        if (attrs.marked) {
          scope.$watch('marked', set);        	
        }

      }
    };
  }]);

}());;angular.module( 'ckanApi', [] )


// SQL request
// http://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql
.factory( 'sqlRequest', [ '$http', '$q',
function(                  $http,   $q ) {

	return function( args ) {
		var params = {};
		var defer = $q.defer();
		var from = [];
		var where = [];

		// dataset UUID format check
		// http://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
		if ( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/.test( args.resourceId )) {
			from.push( '"' + args.resourceId + '"' );
		} else {
			defer.reject( 'Invalid resource ID: ' + args.resourceId );
			return defer.promise;
		}

		// full text searching
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+%22Latitude%22%2C%22Longitude%22%2C%22Name%22%2C%22Description%22%2C%22Capabilities%22%2C%22Facilities%22%2C%22Weblink%22%2C%22Sector%22+from+%228b9178e0-2995-42ad-8e55-37c15b4435a3%22%2C+plainto_tsquery(+%27english%27%2C+%27innovation%27+)+query+WHERE+1+%3D+1+AND+_full_text+%40%40+query
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+*+from+%228b9178e0-2995-42ad-8e55-37c15b4435a3%22%2C+plainto_tsquery(+%27english%27%2C+%27innovation%27+)+query+WHERE+1+%3D+1+AND+_full_text+%40%40+query
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+*+FROM+%2281d78d4f-0cad-4145-9fe6-43526036cabf,plainto_tsquery(+%27english%27,+%27Brisbane%27+)+query%22+WHERE+1=1+AND+_full_text+@@+query
		if ( args.fullText ) {
			from.push( 'plainto_tsquery( \'english\', \'' + args.fullText + '\' ) query' );
			where.push( '_full_text @@ query' );
		}

		// where clause
		if ( where.length > 0 ) {
			where = where.join( ' AND ' );
		} else {
			where = '1=1';
		}

		angular.extend( params, {
			sql: 'SELECT * FROM ' + from.join( ',' ) + ' WHERE ' + where
		});
		// console.log( params.sql );

		$http.get( 'https://data.qld.gov.au/api/action/datastore_search_sql', {
			params: params,
			cache: true
		})
		.success(function( data ) {
			defer.resolve( data );
		})
		.error(function( data, status ) {
			defer.reject( status );
		});

		return defer.promise;
	};
}])


// CKAN API
.factory( 'ckan', [ 'sqlRequest',
function(            sqlRequest ) {

	return ({
		'sqlRequest': sqlRequest
	});
}])
;;angular.module( 'mam.errorView', [ 'ngRoute' ])


.config([ '$routeProvider',
function(  $routeProvider ) {
	$routeProvider.when( '/error', {
		templateUrl: 'error.html'
	});
}]);
;/*global $*/
angular.module( 'mam.searchView', [ 'ngRoute', 'qgovMam.config' ])


.config([ '$routeProvider', 'SOURCE',
function(  $routeProvider,   SOURCE ) {
// search results
	$routeProvider.when( '/', {
		// old MAM detail view URLs: ?title=<title>
		redirectTo: function() {
			// https://github.com/angular/angular.js/issues/7239
			if ( /title=[^&]/.test( window.location.search )) {
				return '/' + window.location.search.replace( /^.*[?&]title=([^&]+).*?$/, '$1' );
			}
		},
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl: 'search.html',
		resolve: {
			pageNumber: [ '$location', function( $location ) {
				return parseInt( $location.search().page, 10 ) || 1;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest({ resourceId: SOURCE.resourceId });
			}]
		}
	});
}])


.controller( 'SearchController', [ 'RESULTS_PER_PAGE', 'PAGES_AVAILABLE', 'mapModel', 'pageNumber', 'json',
function(                           RESULTS_PER_PAGE,   PAGES_AVAILABLE,   mapModel,   pageNumber,   json ) {

	// view model
	var vm = this;

	var total = json.result.records.length;
	var firstResultOnPage = ( pageNumber - 1 ) * RESULTS_PER_PAGE + 1;

	vm.searchResults = json.result.records.slice( firstResultOnPage - 1, firstResultOnPage + RESULTS_PER_PAGE );

	mapModel.setMarkers(
		$.map( json.result.records, function( record ) {
			return {
				title: record.Title || record.Name,
				lat: parseFloat( record.Latitude ),
				lng: parseFloat( record.Longitude )
			};
		})
	);

	// result set description
	// http://www.qld.gov.au/web/cue/module5/checkpoints/checkpoint09/
	vm.description = {
		start: firstResultOnPage,
		end: Math.min( firstResultOnPage + RESULTS_PER_PAGE - 1, total ),
		total: total,
		keywords: ''
	};

	var lastPage = Math.ceil( total / RESULTS_PER_PAGE );
	var minPage = Math.max( 1, Math.min( pageNumber - Math.ceil( PAGES_AVAILABLE / 2 ), lastPage - PAGES_AVAILABLE ));
	var maxPage = Math.min( lastPage, minPage + PAGES_AVAILABLE );

	// pagination
	// http://www.qld.gov.au/web/cue/module5/checkpoints/checkpoint15/
	vm.pagination = {
		current: pageNumber,
		previous: pageNumber > 1 ? pageNumber - 1 : null,
		next: pageNumber < lastPage ? pageNumber + 1 : null,
		limit: RESULTS_PER_PAGE,
		pages: []
	};

	for ( var i = minPage; i <= maxPage; i++ ) {
		vm.pagination.pages.push( i );
	}

}]);
;/*global $*/
angular.module( 'mam.detailView', [ 'ngRoute', 'qgovMam.config' ] )


.config([ '$routeProvider', 'SOURCE',
function(  $routeProvider,   SOURCE ) {
	$routeProvider.when( '/:title', {
		// tidy up old MAM URLs
		redirectTo: function() {
			window.location.href = window.location.href.replace( /\?[^#]*/, '' );
		},
		controller: 'DetailController',
		controllerAs: 'vm',
		templateUrl: 'detail.html',
		resolve: {
			title: [ '$route', function( $route ) {
				return $route.current.params.title;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest({ resourceId: SOURCE.resourceId });
			}]
		}
	});
}])


.controller( 'DetailController', [ 'title', 'mapModel', 'json',
function(                           title,   mapModel,   json ) {

	// view model
	var vm = this;

	var item = json.result.records.filter(function( item ) {
		return title === $.trim( item.Title ) || title === $.trim( item.Name );
	});

	if ( item.length > 0 ) {
		vm.item = item[ 0 ];
	} else {
		// error, no match
	}

	mapModel.setMarkers([{
		title: vm.item.Title || vm.item.Name,
		lat: parseFloat( vm.item.Latitude ),
		lng: parseFloat( vm.item.Longitude )
	}]);

}]);
;/*global $*/
angular.module( 'qgovMam.config', [] )

// search results
.constant( 'RESULTS_PER_PAGE', 10 )
.constant( 'PAGES_AVAILABLE', 10 )

// CKAN URI format
// example: https://data.qld.gov.au/dataset/science-capability-directory/resource/8b9178e0-2995-42ad-8e55-37c15b4435a3
.constant( 'SOURCE', (function() {
	var sourceUri = $( 'meta[name="DCTERMS.source"]' ).attr( 'content' );
	var source = sourceUri.split( /\/+/ );
	return {
		resourceId: source[ source.length - 1],
		server: source[ 1 ],
		uri: sourceUri
	};
}()));
;/*global $*/
angular.module( 'qgovMam', [ 'ngRoute', 'qgov', 'ckanApi', 'leaflet-directive', 'map', 'hc.marked', 'mam.errorView', 'mam.searchView', 'mam.detailView' ])

// markdown config
.config([ 'markedProvider',
function(  markedProvider ) {
	// https://github.com/chjj/marked#options-1
	markedProvider.setOptions({
		gfm: true,
		tables: true,
		sanitize: true, // no HTML
	});
}])


// routing
.config([ '$routeProvider',
function(  $routeProvider ) {
	// default routes
	$routeProvider
	.otherwise({ redirectTo : '/' });
}])


.run([   '$rootScope', '$location',
function( $rootScope,   $location ) {
	// $rootScope.$on( '$routeChangeStart', function() {
	// 	$rootScope.isLoading = true;
	// 	$rootScope.loadingPercent = 10;
	// });

	$rootScope.$on( '$routeChangeSuccess', function() {
		// $rootScope.isLoading = false;
		// $rootScope.loadingPercent = 100;
		$( '#article' ).trigger( 'x-height-change' );
	});

	$rootScope.$on( '$routeChangeError', function() {
		// console.log( '$routeChangeError' );
		$location.path( '/error' );
	});
}]);
