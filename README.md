# imgslider
An image slider.

# Compatibility
### Desktop
Browser       | IE            | Firefox       | Chrome        | Sarafi
------------- | ------------- | ------------- | ------------- | ------------- |
Ver.          | 9+            | 42+           | Yes           | ?
### Mobile
OS            | iOS           | android
------------- | ------------- | ------------- |
Ver.          | 8             | ?

# Usage
Insert a \<div\> element with calss name "imgslider" into \<body\>,
```HTML
<body>
  <div class="imgslider"></div>
</body>
```
and run following code step by step:
### (1) Set properties
```javascript
Imgslider.set({
  height: '480px',
  // (set rule is the same as css, String)
  loop: true,
  // (Whether to launch auto-loop when imgslider installed, Boolean)
  transitionTime: 500,
  // (the animation duration between slide one image to another, unit: ms)
  duration: 3500,
  // (the duration before slide one image to another, unit: ms)
  wheelSlide: false,
  // (whether to enable mouse-wheel slide, Boolean)
  openInBlank: false,
  // (the default value of whether open link in new tab, if not set when add image, Boolean)
  switchBy: 'click',
  // (define the behavior of radio-buttons, value: 'click' / 'mouseover', String)
  showTip: true,
  // (whether to show tip at radio-bitton and arrows, Boolean)
});
```
### (2) Add images
#### Note: the more images you want to include the more Imgslider.add() you should do.
```javascript
Imgslider.add({
  imgURL: 'path/to/img.jpg',
  // (URL of image of this block, String)
  title: 'image title',
  // (title text of this block, String)
  story: 'image story',
  // (story text of this block, String)
  linkURL: 'linkURL',
  // (URL of link when click on this image. String)
  tip: 'tip',
  // (tip text of this block, if undefined, will set it the same as title, String)
  openInBlank: (true / false)
  // (whether to open link in new tab. Boolean)
});
```
### (3) Install
```javascript
Imgslider.install();
```
or, without class name:
```HTML
<body>
  <div id="id-of-your-slider"></div>
</body>
```
```javascript
var slider = document.getElementById('id-of-your-slider');

Imgslider.install(slider);
```
