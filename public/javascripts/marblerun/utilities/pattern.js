var Pattern = {};

Pattern.addPattern = function(name, path, direction) {
  if (!direction) direction = "repeat";

  var image = new Image();
  image.src = path;

  Pattern[name] = Pattern.context.createPattern(image, direction);
}