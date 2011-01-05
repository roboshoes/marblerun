var Pattern = {};
Pattern.image = {};

Pattern.onload = null;
Pattern.loaded = 0;
Pattern.total = 0;

Pattern.onLoaded = function() {
  Pattern.loaded++;

  if (Pattern.loaded == Pattern.total) {
    if (Pattern.onload) Pattern.onload();
  }
}

Pattern.loadPattern = function(patterns) {

  Pattern.total = patterns.length;

  for (var i = 0; i < patterns.length; i++) {
    var image = new Image();
    image.src = patterns[i].path;
    image.name = patterns[i].name;

    Pattern.image[patterns[i].name] = image;

    image.onload = function() {
      Pattern[this.name] = Pattern.context.createPattern(this, "repeat");
      Pattern.onLoaded();
    }
  }
}

