/*
	demo.js for Imgslide
*/

window.onload = function() {
	/*
		helper
	*/

	function createEl(tagName, className) {

		var el = document.createElement(tagName || 'div');

		if (className) { el.setAttribute('class', className); }

		return el;
	}

	function insertTextNode(el, text) {
		el.appendChild(document.createTextNode(text));
	}

	/*
		main
	*/

	var body = document.body;

	var container = createEl('', 'container');

	body.appendChild(container);

	var topFrame = createEl();

	container.appendChild(topFrame);

	var brand = createEl('h1', 'brand');

	brand.appendChild(document.createTextNode('Imgslider'));
	topFrame.appendChild(brand);

	var panel = createEl('', 'panel');

	topFrame.appendChild(panel);

	var imgs = [
			{
				imgURL: './images/slide.jpg',
				text: 'This is Imgslider',
				story: 'Imgslider makes it possible to show many images in only one block.',
				linkURL: null,
				tip: null,
				openInBlank: null
			},
			{
				imgURL: './images/slide2.jpg',
				text: 'This is Imgslider with no \'story\'',
				story: null,
				linkURL: null,
				tip: null,
				openInBlank: null
			},
			{
				imgURL: './images/notebook-731212_1920.jpg',
				text: null,
				story: 'This is Imgslider with no \'text\'',
				linkURL: null,
				tip: 'This is Imgslider with no \'text\'',
				openInBlank: null
			},
	];

	// add to imgslider
	for (var i = 0; i < imgs.length; i++) {
		Imgslider.add(imgs[i]);
	}

	// set
	Imgslider.set({
		height: 'calc(100% - 5rem)',
		transitionTime: 500,
		duration: 5000
	});

	// install
	var imgslider = document.createElement('div');

	imgslider.setAttribute('class', 'imgslider');
	container.appendChild(imgslider);

	Imgslider.install();

	// control panel
	(function() {

		var State = 0; // 0: hide, 1: show
		var toogle = function() {

			State = State ? 0 : 1;

			if (State) { // show
				ctrlPanel.style.left = '61.8%';
			} else {
				ctrlPanel.style.left = '100%';
			}
		};
		var panelBtn = createEl('', 'btn');

		panelBtn.appendChild(document.createTextNode('Control Panel'));
		panelBtn.addEventListener('click', toogle, false);
		panel.appendChild(panelBtn);

		var ctrlPanel = createEl('', 'ctrlPanel');

		document.body.appendChild(ctrlPanel);

		var ctrlPanelHolder = createEl('', 'ctrlPanelHolder');

		ctrlPanel.appendChild(ctrlPanelHolder);

		var header = createEl('', 'cpHeader');

		insertTextNode(header, 'Control Panel');
		ctrlPanelHolder.appendChild(header);

		var closeBtn = createEl('', 'btn');

		insertTextNode(closeBtn, 'Close');
		closeBtn.style.float = 'right';
		closeBtn.addEventListener('click', toogle, false);
		header.appendChild(closeBtn);
		// body
		var body = createEl('', 'cpBody');

		ctrlPanelHolder.appendChild(body);

		var props = [
			{
				name:'height',
				type: 'text',
				default: 'calc(100% - 5rem)',
				detail: 'Value of style.height of Imgslider.'
			},
			{
				name:'loop',
				type: 'checkbox',
				default: true,
				detail: 'Set this value to true to loop images.'
			},
			{
				name:'transitionTime',
				type: 'text',
				default: 500,
				detail: 'The time of animation of change one image to another.'
			},
			{
				name:'duration',
				type: 'text',
				default: 3500,
				detail: 'The time between change one image to another.'
			},
			{
				name:'wheelSlide',
				type: 'checkbox',
				default: false,
				detail: 'Set this value to true to enable mouse wheel slide.'
			},
			{
				name:'switchBy',
				type: 'text',
				default: 'click',
				detail: 'Switch images when click / mouseover radio button.'
			},
			{
				name:'showTip',
				type: 'checkbox',
				default: true,
				detail: 'Showing tip when mouseover at arrows or radio buttons.'
			},
		];
		var Props = {};
		var Inputs = {};

		for (var prop in props) {
			Props[props[prop].name] = props[prop].default;
		}

		for (var i in props) {
			var contentHolder = createEl('', 'cpContent');
			
			body.appendChild(contentHolder);

			var title = createEl();

			insertTextNode(title, props[i].name);
			contentHolder.appendChild(title);

			var input = createEl('input');

			input.setAttribute('type', props[i].type);
			
			if (props[i].type === 'checkbox') {
				input.checked = props[i].default;
			} else {
				input.value = props[i].default;
			}

			contentHolder.appendChild(input);
			Inputs[props[i].name] = input;

			var detail = createEl('span');

			insertTextNode(detail, props[i].detail);
			contentHolder.appendChild(detail);
		}
		// footer
		var comfirm = function() {

			var setting = {};

			for (var i in Props) {
				var value = Inputs[i][((Inputs[i].type === 'checkbox') ? 'checked' : 'value')];

				Props[i] = setting[i] = value;
			}

			imgslider.innHTML = '';

			Imgslider.set(setting);

			Imgslider.uninstall();

			Imgslider.install(imgslider);

			toogle();
		};
		var cancel = function() {

			for (var i in Props) {
				if (Inputs[i].type === 'checkbox') {
					Inputs[i].checked = Props[i];
				} else {
					Inputs[i].value = Props[i];
				}
			}

			toogle();
		};
		var reset = function() {

			for (var prop in props) {
				Props[props[prop].name] = props[prop].default;
			}

			cancel();
			comfirm();
			toogle();
		};
		var footer = createEl('', 'cpFooter');

		ctrlPanelHolder.appendChild(footer);

		var cancelBtn = createEl('', 'btn');

		insertTextNode(cancelBtn, 'Cancel');
		cancelBtn.addEventListener('click', cancel, false);
		footer.appendChild(cancelBtn);

		var comfirmBtn = createEl('', 'btn');

		insertTextNode(comfirmBtn, 'Comfirm');
		comfirmBtn.addEventListener('click', comfirm, false);
		footer.appendChild(comfirmBtn);

		var resetBtn = createEl('', 'btn');

		insertTextNode(resetBtn, 'Reset');
		resetBtn.style.background = 'red';
		resetBtn.addEventListener('click', reset, false);
		footer.appendChild(resetBtn);
	}());
};