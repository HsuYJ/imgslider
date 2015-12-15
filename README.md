# imgslider
An image slider.

# Usage
Insert a \<div\> element with calss name "imgslider" into \<body\>,
```
<body>
  <div class="imgslider"></div>
</body>
```
and run following code:
```
Imgslider.install();
```
or, without class name:
```
<body>
  <div id="id-of-your-slider"></div>
</body>
```
```
var slider = document.getElementById('id-of-your-slider');

Imgslider.install(slider);
```
