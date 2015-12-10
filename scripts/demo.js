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

	function createRow(ratio) {

		var holder = createEl();

		holder.style.cssText +=
			'height: 100%;';

		for (var i = 0; i < ratio.length; i++) {
			var row = createEl();

			row.style.cssText +=
				'height: ' + ratio[i] + ';';
			holder.appendChild(row);
		}

		return holder;
	}

	/*
		main
	*/

	var body = document.body;

	var topFrame = createEl();

	document.body.appendChild(topFrame);

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
		height: 'calc(100% - 5.09rem)',
		transitionTime: 500,
		duration: 5000
	});

	// install
	var imgslider = document.createElement('div');

	imgslider.setAttribute('class', 'imgslider');
	document.body.appendChild(imgslider);

	Imgslider.install();

	// footer
	var footer = createEl();

	footer.setAttribute('class', 'footer');
	document.body.appendChild(footer);
};