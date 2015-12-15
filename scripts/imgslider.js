/*
	imgslider.js
	2015-dec-05
*/
var Imgslider;

(function() {

	/*
		methods
	*/

	Imgslider = {

		set: function(settings) {

			for (var propName in Setting) {
				if (settings[propName] !== undefined) {
					Setting[propName] = settings[propName];
				}
			}
		},

		add: function(props) {
			
			var p = props;

			if (!p.imgURL) { return; }

			Setting.imgs.push({
				imgURL: p.imgURL,
				title: p.title || null,
				story: p.story || null,
				linkURL: p.linkURL || null,
				tip: p.tip || p.title || null,
				openInBlank: p.openInBlank || Setting.openInBlank
			});
		},

		install: function(target) {
			// target element, if undefined, will search for first element has class 'imgslider'
			// get and set SliderHolder
			SliderHolder = (target === undefined) ? document.getElementsByClassName('imgslider')[0] : target;
			SliderHolder.setAttribute('class', Object.keys(Classes)[0]);
			evaluate();
			generateStyleTag();
			build();
			handleEvt(1);
			// first render
			changeView();
			// auto slide
			if (Setting.loop) {
				startLoop();
			}
		},

		uninstall: function() {

			State.onLoop = false;
			window.clearInterval(State.timer);
			window.clearInterval(State.leaveTimer);
			handleEvt(0);
			StyleTag.parentNode.removeChild(StyleTag);
			SliderHolder.innerHTML = '';
		},

		startLoop: function() {

			Setting.loop = true;
			startLoop();
		},

		stopLoop: function() {

			Setting.loop = false;
			pauseLoop();
		},

		loop: function(Switch) {

			if (Switch) {
				Setting.loop = true;
				startLoop();
			}
		}
	};

	var Setting = {

		imgs: [],

		// style
		height: '480px',
		
		// auto slide
		loop: true, // Boolean
		transitionTime: 500, // ms
		duration: 3500, // ms

		// wheel slide
		wheelSlide: false,

		// link
		openInBlank: false, // Boolean

		// radio button
		switchBy: 'click', // click, mouseover
		showTip: true, // Boolean
	};

	var Classes = {

		sliderHolder: {
			overflow: 'hidden',
			margin: '0 auto',
			height: undefined // will generate by generateStyleTag()
		},
		// arrowHolder
		'sliderHolder > *': {
			position: 'relative',
			width: '100%',
			height: '100%',
			background: '#000'
		},
		// arrows
		'sliderHolder > * > span': {
			'z-index': 622,
			position: 'absolute',
			top: 'calc((100% - 60px) / 2)',
			width: '60px',
			height: '60px',
			background: 'rgba(0, 0, 0, 0.618)',
			cursor: 'pointer',
			transition: 'opacity 500ms',
			'-ms-transition': 'opacity 500ms',
			'-moz-transition': 'opacity 500ms',
			'-webkit-transition': 'opacity 500ms'
		},
		'sliderHolder > * > span::before, .sliderHolder > * > span::after': {
			content: '\'\'',
			position: 'absolute',
			right: 0,
			top: '25px',
			width: '40px',
			height: '10px',
			background: '#FFF',
			'border-radius': '0 5px 5px 0',
			'transform-origin': '5px 50%',
			'-ms-transform-origin': '5px 50%',
			'-moz-transform-origin': '5px 50%',
			'-webkit-transform-origin': '5px 50%'
		},
		'sliderHolder > * > span:nth-child(2)': {
			right: 0,
			transform: 'scaleX(-1)',
			'-ms-transform': 'scaleX(-1)',
			'-moz-transform': 'scaleX(-1)',
			'-webkit-transform': 'scaleX(-1)'
		},
		'sliderHolder > * > span::before': {
			transform: 'rotate(-45deg)',
			'-ms-transform': 'rotate(-45deg)',
			'-moz-transform': 'rotate(-45deg)',
			'-webkit-transform': 'rotate(-45deg)',
		},
		'sliderHolder > * > span::after': {
			transform: 'rotate(45deg)',
			'-ms-transform': 'rotate(45deg)',
			'-moz-transform': 'rotate(45deg)',
			'-webkit-transform': 'rotate(45deg)',
		},
		// imgHolder
		'sliderHolder > * > *:nth-child(3)': {
			position: 'relative',
			width: '100%',
			height: '100%',
			transition: undefined // will generate by generateStyleTag()
		},
		// imgs
		'sliderHolder > * > *:nth-child(3) > a': {
			position: 'absolute',
			left: undefined, // nth * 100%, will generate by generateStyleTag()
			width: '100%',
			height: '100%',
			color: '#FFF',
			'text-decoration': 'none'
		},
		// title
		'sliderHolder > * > *:nth-child(3) > a > h2': {
			position: 'relative',
			margin: '1.5rem 0',
			padding: '0.927rem',
			background: 'rgba(0, 0, 0, 0.618)',
			'font-size': '3rem',
			'line-height': 1
		},
		// story
		'sliderHolder > * > *:nth-child(3) > a > div': {
			position: 'absolute',
			right: '12.5%',
			top: '38.2%',
			float: 'right',
			padding: '1rem',
			width: '25.7%',
			'max-height': '61.8%',
			background: 'rgba(0, 0, 0, 0.618)',
			'line-height': 1.5,
			'font-size': '1.2rem'
		},
		// radioHolder
		'sliderHolder > * > *:nth-child(4)': {
			display: 'inline-block',
			position: 'relative',
			top: '-40px',
			left: undefined, // will generate by generateStyleTag()
			padding: '10px',
			height: '20px',
			transition: 'opacity 500ms',
			'-ms-transition': 'opacity 500ms',
			'-moz-transition': 'opacity 500ms',
			'-webkit-transition': 'opacity 500ms'
		},
		// radioBtns
		'sliderHolder > * > *:nth-child(4) > span': {
			float: 'left',
			margin: '0 10px',
			width: '10px',
			height: '10px',
			background: '#FFF',
			cursor: 'pointer',
			border: '5px solid #FFF',
			'border-radius': '50%'
		},
		// radioBtnsActive, radioBtns:hover
		'sliderHolder > * > *:nth-child(4) > span:hover, .radioBtnsActive': {
			background: '#333!important'
		}
	};

	var State = {

		onLoop: false,

		maxCount: undefined, // will set by install()

		count: 0,

		timer: null,
		// for transition of IE less then IE10
		translateValue: 0, // for drag(), too

		transitionTimer: null,
		// for drag()(touch action)
		startPos: null,

		onTouchmove: false, // throttle of drag()'s touchmove

		leaveTimer: null,
	};

	var StyleTag = null;
	var SliderHolder = null;
	var ArrowHolder = null;
	var ImgHolder = null;
	var RadioHolder = null;

	var evaluate = function() {
		// global
		State.maxCount = Setting.imgs.length;
		// SliderHolder
		Classes.sliderHolder.height = Setting.height;
		// ImgHolder
		var ImgHolderClasses = Classes['sliderHolder > * > *:nth-child(3)'];
		var transitionValue = 'transform ' + Setting.transitionTime + 'ms';

		ImgHolderClasses.transition = transitionValue;
		ImgHolderClasses['-ms-transition'] = '-ms-' + transitionValue;
		ImgHolderClasses['-moz-transition'] = '-moz-' + transitionValue;
		ImgHolderClasses['-webkit-transition'] = '-webkit-' + transitionValue;
		// RadiioHolder
		Classes['sliderHolder > * > *:nth-child(4)'].left = 'calc(50% - 30px * ' + State.maxCount + ' / 2)';
	};

	var generateStyleTag = function() {
		
		var styleText = '';

		StyleTag = createEl('style');

		for (var className in Classes) {
			styleText += '.' + className + ' {\n';

			for (var propertyName in Classes[className]) {
				styleText += propertyName + ': ' + Classes[className][propertyName] + ';\n';
			}

			styleText += '}\n';
		}

		var imgs = Setting.imgs;

		for (var i = 0; i < imgs.length; i++) {
			styleText +=
				'.sliderHolder > * > * > a:nth-child(' + (i + 1) +') {\n' +
				'left: ' + (i * 100) + '%;\n' +
				'background: url(' + imgs[i].imgURL + ') 50% 50% no-repeat; \n' +
				//'background-size: 100%;' +
				'}';

		}

		StyleTag.appendChild(document.createTextNode(styleText));
		document.head.appendChild(StyleTag);
	};

	var build = function(target) {

		var imgs = Setting.imgs;
		var i;
		// SliderHolder
		SliderHolder.innerHTML = '';
		// ArrowHolder
		ArrowHolder = createEl();
		SliderHolder.appendChild(ArrowHolder);
		// arrows
		arrowLeft = createEl('span');
		ArrowHolder.appendChild(arrowLeft);

		arrowRight = createEl('span');
		ArrowHolder.appendChild(arrowRight);
		// Img Holder
		ImgHolder = createEl();
		ArrowHolder.appendChild(ImgHolder);

		for (i = 0; i < imgs.length; i++) {
			var img = createEl('a');

			if (imgs[i].linkURL) {
				img.setAttribute('href', imgs[i].linkURL);
				if (imgs[i].openInBlank) { img.setAttribute('target', '_blank'); }
			}
			ImgHolder.appendChild(img);

			if (imgs[i].title) {
				var title = createEl('h2');

				title.appendChild(document.createTextNode(imgs[i].title));
				img.appendChild(title);
			}

			if (imgs[i].story) {
				var story = createEl('div');

				story.appendChild(document.createTextNode(imgs[i].story));
				img.appendChild(story);
			}
		}
		// RadioHolder
		RadioHolder = createEl();
		ArrowHolder.appendChild(RadioHolder);

		for (i = 0; i < imgs.length; i++) {
			var radioBtn = createEl('span');

			radioBtn.setAttribute('count_imgslider', i);

			if (i === 0) {
				radioBtn.setAttribute('class', 'radioBtnsActive');
			}

			if (Setting.showTip && imgs[i].tip) {
				radioBtn.setAttribute('title', imgs[i].tip);
			}

			RadioHolder.appendChild(radioBtn);
		}
	};

	var handleEvt = function(Switch) {

		var handleEvtListener = (Switch ? 'add' : 'remove') + 'EventListener';
		// sliderHolder
		SliderHolder[handleEvtListener]('mouseover', hover, false);
		SliderHolder[handleEvtListener]('mouseout', leave, false);

		if (Setting.wheelSlide) {
			SliderHolder[handleEvtListener]('wheel', wheel, false);
		}

		SliderHolder[handleEvtListener]('touchstart', drag, false);
		// arrows
		ArrowHolder.children[0][handleEvtListener]('click', function() {
			switchImgByArrow(-1);
		}, false);
		ArrowHolder.children[1][handleEvtListener]('click', function() {
			switchImgByArrow(1);
		}, false);
		// radioBtns
		var radioBtns = RadioHolder.children;

		for (var i = 0; i < radioBtns.length; i++) {

			(function() {
				var count = i;

				radioBtns[i][handleEvtListener](Setting.switchBy, function() {

					switchImgTo(count);
				}, false);
			}());
		}
	};

	var EventHandler = {

		touchmove: function(Switch) {

			SliderHolder[(Switch ? 'add' : 'remove') + 'EventListener']('touchmove', drag, false);
		},

		touchend: function(Switch) {

			SliderHolder[(Switch ? 'add' : 'remove') + 'EventListener']('touchend', drag, false);
		},
	};

	/*
		actions
	*/

	var slide = function() {

		State.count++;
		changeView();
	};

	var startLoop = function() {

		if (State.onLoop) { return; }

		State.onLoop = true;
		State.timer = window.setInterval(slide, Setting.duration);
	};

	var pauseLoop = function() {

		State.onLoop = false;
		window.clearInterval(State.timer);
	};

	var switchOpacity = function(Switch) {

		ArrowHolder.children[0].style.opacity =
		ArrowHolder.children[1].style.opacity =
		RadioHolder.style.opacity = Switch;
	};

	/*
		user actions
	*/

	var hover = function() {

		pauseLoop();
		switchOpacity(1);
	};

	var leave = function() {

		if (Setting.loop) { startLoop(); }

		switchOpacity(0);
	};

	var wheel = function(e) {

		State.count += (e.deltaY > 0) ? 1 : -1;
		changeView();
	};

	var drag = function(e) {

		var transformValue;

		if (e.type === 'touchstart') {
			window.clearTimeout(State.leaveTimer);
			hover();
			// stroe state
			transformValue = (ImgHolder.style.webkitTransform || ImgHolder.style.transform);
			State.translateValue = transformValue.split('(')[1].split('%')[0] + '%';
			State.startPos = e.touches[0].clientX;
			// handle event
			EventHandler.touchmove(1);
			EventHandler.touchend(1);
			// handle transition
			ImgHolder.style.cssText +=
				'transition: none;' +
				'-ms-transition: none;' +
				'-moz-transition: none;' +
				'-webkit-transition: none;';

			return;
		}

		var movePos, gap;

		if (e.type === 'touchmove') {
			// throttle
			if (State.onTouchmove === true) {
				window.requestAnimationFrame(function() {
					State.onTouchmove = false;
				});
				return;
			}

			State.onTouchmove = true;
			// main process
			movePos = e.changedTouches[0].clientX;
			gap = movePos - State.startPos;
			transformValue = 'translate3d(calc(' + State.translateValue + ' + ' + gap + 'px), 0, 0)';
			transform(ImgHolder, transformValue);
		}

		if (e.type === 'touchend') {
			if (Setting.loop) {
				State.leaveTimer = window.setTimeout(leave, Setting.duration);
			}

			movePos = e.changedTouches[0].clientX;
			gap = movePos - State.startPos;

			if (Math.abs(gap) > 5) {
				State.count += (gap < 0) ? 1 : -1;
				changeView();
			}
			// handle event
			EventHandler.touchmove(0);
			EventHandler.touchend(0);
			// handle transition
			ImgHolder.style.transition = '';
			ImgHolder.style.msTransition = '';
			ImgHolder.style.mozTransition = '';
			ImgHolder.style.webkitTransition = '';
		}
	};

	var switchImgByArrow = function(Switch) {

		State.count += Switch;
		changeView();
	};

	var switchImgTo = function(countNum) {

		State.count = countNum;
		changeView();
	};

	/*
		view-changer
	*/

	var changeView = function() {
		// trim count
		if (State.count === State.maxCount) { State.count = 0; }
		if (State.count === -1) { State.count = State.maxCount - 1; }

		var Count = State.count;
		var Imgs = Setting.imgs;
		var i;

		if (Setting.showTip) {
			var adjacentCount = [
				(Count === 0) ? State.maxCount -1 : Count - 1, // previous count
				(Count === State.maxCount - 1) ? 0 : Count + 1	// next count
			];
			var arrows = ArrowHolder.children;

			for (i = 0; i < adjacentCount.length; i++) {
				var count = adjacentCount[i];

				if (Imgs[count].tip) {
					arrows[i].setAttribute('title', Imgs[count].tip);
				} else {
					arrows[i].removeAttribute('title');
				}
			}
		}

		var slideValue = Count * -100;

		if (!ltIE10) {
			var transformValue = 'translate3d(' + slideValue + '%, 0, 0);';

			ImgHolder.style.cssText +=
				'transform: ' + transformValue +
				'-ms-transform: ' + transformValue +
				'-moz-transform: ' + transformValue +
				'-webkit-transform: ' + transformValue;
		} else { // less than IE10
			var fps = 60;
			var gap = slideValue - State.translateValue;
			var delta = (gap > 0) ? 1 : -1;
			var dpf = 1000 / fps; // duration per frame
			var frames = Math.round(Setting.transitionTime / dpf);
			var halfFrames = Math.round(frames / 2);
			var parity = (frames % 2) ? 1 : 2; // odd : even
			var partAmount = (parity + frames) * halfFrames / 2;
			var apf = Math.abs(gap) / partAmount; // accelerate per frame
			var frameCount = 0;
			var speed = 0; // px per frame

			window.clearInterval(State.transitionTimer);

			State.transitionTimer = window.setInterval(function() {

				if (apf > 0) {
					if (
						parity === 1 && frameCount >= halfFrames ||
						parity === 2 && frameCount > halfFrames
					) { apf *= -1; }
				}
				if (
					parity === 1 ||
					parity === 2 && frameCount !== halfFrames
				) { speed += apf; }

				var transformValue = 'translateX(' + (State.translateValue += speed * delta) + '%)';

				transform(ImgHolder, transformValue);

				frameCount++;

				if (frameCount >= frames) {
					// match value
					State.translateValue = slideValue;
					transformValue = 'translateX(' + slideValue + '%)';
					transform(ImgHolder, transformValue);
					// clear interval
					window.clearInterval(State.transitionTimer);
				}
			}, 1000 / 60);
		}

		var radioBtns = RadioHolder.children;

		for (i = 0; i < radioBtns.length; i++) {
			radioBtns[i].removeAttribute('class');
		}

		radioBtns[Count].setAttribute('class', 'radioBtnsActive');
	};

	/*
		helper
	*/

	var createEl = function(tagName) {

		return document.createElement(tagName || 'div');
	};

	var transform = function(el, value) {

		el.style.cssText +=
			'transform: ' + value + ';' +
			'-ms-transform: ' + value + ';' +
			'-moz-transform: ' + value + ';' +
			'-webkit-transform: ' + value + ';';
	};

	var IsTouch = (function() {

		var detector = function(e) {

			if (e.type === 'mousemove') {
				IsTouch = false;
			} else if (e.touches[0]) {
				IsTouch = true;
			}

			document.removeEventListener('mousemove', detector, false);
			document.removeEventListener('touchstart', detector, false);

			console.log('IsTouch: ', IsTouch);
		};

		document.addEventListener('mousemove', detector, false);
		document.addEventListener('touchstart', detector, false);
	})();

	/*
		polyfills
	*/

	window.requestAnimationFrame = (function(){
		return window.requestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	/*
		IE checker
	*/

	var ltIE10 = (function() {

		var div = document.createElement('div');

		div.innerHTML = '<!--[if lt IE 10]><i></i><![endif]-->';

		return div.getElementsByTagName('i').length;
	}());

	window.onload = function() {
		
		Imgslider.install();
	};
}());