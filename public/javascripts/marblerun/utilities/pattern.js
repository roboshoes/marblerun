var Pattern = {};

Pattern.addPattern = function(name, path) {
  var image = new Image();
  image.src = path;

  Pattern[name] = Pattern.context.createPattern(image, "repeat");
}