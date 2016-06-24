require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"TextLayer":[function(require,module,exports){
var TextLayer, convertTextLayers, convertToTextLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TextLayer = (function(superClass) {
  extend(TextLayer, superClass);

  function TextLayer(options) {
    if (options == null) {
      options = {};
    }
    this.doAutoSize = false;
    this.doAutoSizeHeight = false;
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "hsla(60, 90%, 47%, .4)" : "transparent";
    }
    if (options.color == null) {
      options.color = "red";
    }
    if (options.lineHeight == null) {
      options.lineHeight = 1.25;
    }
    if (options.fontFamily == null) {
      options.fontFamily = "Helvetica";
    }
    if (options.fontSize == null) {
      options.fontSize = 20;
    }
    if (options.text == null) {
      options.text = "Use layer.text to add text";
    }
    TextLayer.__super__.constructor.call(this, options);
    this.style.whiteSpace = "pre-line";
    this.style.outline = "none";
  }

  TextLayer.prototype.setStyle = function(property, value, pxSuffix) {
    if (pxSuffix == null) {
      pxSuffix = false;
    }
    this.style[property] = pxSuffix ? value + "px" : value;
    this.emit("change:" + property, value);
    if (this.doAutoSize) {
      return this.calcSize();
    }
  };

  TextLayer.prototype.calcSize = function() {
    var constraints, size, sizeAffectingStyles;
    sizeAffectingStyles = {
      lineHeight: this.style["line-height"],
      fontSize: this.style["font-size"],
      fontWeight: this.style["font-weight"],
      paddingTop: this.style["padding-top"],
      paddingRight: this.style["padding-right"],
      paddingBottom: this.style["padding-bottom"],
      paddingLeft: this.style["padding-left"],
      textTransform: this.style["text-transform"],
      borderWidth: this.style["border-width"],
      letterSpacing: this.style["letter-spacing"],
      fontFamily: this.style["font-family"],
      fontStyle: this.style["font-style"],
      fontVariant: this.style["font-variant"]
    };
    constraints = {};
    if (this.doAutoSizeHeight) {
      constraints.width = this.width;
    }
    size = Utils.textSize(this.text, sizeAffectingStyles, constraints);
    if (this.style.textAlign === "right") {
      this.width = size.width;
      this.x = this.x - this.width;
    } else {
      this.width = size.width;
    }
    return this.height = size.height;
  };

  TextLayer.define("autoSize", {
    get: function() {
      return this.doAutoSize;
    },
    set: function(value) {
      this.doAutoSize = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("autoSizeHeight", {
    set: function(value) {
      this.doAutoSize = value;
      this.doAutoSizeHeight = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("contentEditable", {
    set: function(boolean) {
      this._element.contentEditable = boolean;
      this.ignoreEvents = !boolean;
      return this.on("input", function() {
        if (this.doAutoSize) {
          return this.calcSize();
        }
      });
    }
  });

  TextLayer.define("text", {
    get: function() {
      return this._element.textContent;
    },
    set: function(value) {
      this._element.textContent = value;
      this.emit("change:text", value);
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("fontFamily", {
    get: function() {
      return this.style.fontFamily;
    },
    set: function(value) {
      return this.setStyle("fontFamily", value);
    }
  });

  TextLayer.define("fontSize", {
    get: function() {
      return this.style.fontSize.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("fontSize", value, true);
    }
  });

  TextLayer.define("lineHeight", {
    get: function() {
      return this.style.lineHeight;
    },
    set: function(value) {
      return this.setStyle("lineHeight", value);
    }
  });

  TextLayer.define("fontWeight", {
    get: function() {
      return this.style.fontWeight;
    },
    set: function(value) {
      return this.setStyle("fontWeight", value);
    }
  });

  TextLayer.define("fontStyle", {
    get: function() {
      return this.style.fontStyle;
    },
    set: function(value) {
      return this.setStyle("fontStyle", value);
    }
  });

  TextLayer.define("fontVariant", {
    get: function() {
      return this.style.fontVariant;
    },
    set: function(value) {
      return this.setStyle("fontVariant", value);
    }
  });

  TextLayer.define("padding", {
    set: function(value) {
      this.setStyle("paddingTop", value, true);
      this.setStyle("paddingRight", value, true);
      this.setStyle("paddingBottom", value, true);
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("paddingTop", {
    get: function() {
      return this.style.paddingTop.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingTop", value, true);
    }
  });

  TextLayer.define("paddingRight", {
    get: function() {
      return this.style.paddingRight.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingRight", value, true);
    }
  });

  TextLayer.define("paddingBottom", {
    get: function() {
      return this.style.paddingBottom.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingBottom", value, true);
    }
  });

  TextLayer.define("paddingLeft", {
    get: function() {
      return this.style.paddingLeft.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("textAlign", {
    set: function(value) {
      return this.setStyle("textAlign", value);
    }
  });

  TextLayer.define("textTransform", {
    get: function() {
      return this.style.textTransform;
    },
    set: function(value) {
      return this.setStyle("textTransform", value);
    }
  });

  TextLayer.define("letterSpacing", {
    get: function() {
      return this.style.letterSpacing.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("letterSpacing", value, true);
    }
  });

  TextLayer.define("length", {
    get: function() {
      return this.text.length;
    }
  });

  return TextLayer;

})(Layer);

convertToTextLayer = function(layer) {
  var css, cssObj, importPath, t;
  t = new TextLayer({
    name: layer.name,
    frame: layer.frame,
    parent: layer.parent
  });
  cssObj = {};
  css = layer._info.metadata.css;
  css.forEach(function(rule) {
    var arr;
    if (_.includes(rule, '/*')) {
      return;
    }
    arr = rule.split(': ');
    return cssObj[arr[0]] = arr[1].replace(';', '');
  });
  t.style = cssObj;
  importPath = layer.__framerImportedFromPath;
  if (_.includes(importPath, '@2x')) {
    t.fontSize *= 2;
    t.lineHeight = (parseInt(t.lineHeight) * 2) + 'px';
    t.letterSpacing *= 2;
  }
  t.y -= (parseInt(t.lineHeight) - t.fontSize) / 2;
  t.y -= t.fontSize * 0.1;
  t.x -= t.fontSize * 0.08;
  t.width += t.fontSize * 0.5;
  t.text = layer._info.metadata.string;
  layer.destroy();
  return t;
};

Layer.prototype.convertToTextLayer = function() {
  return convertToTextLayer(this);
};

convertTextLayers = function(obj) {
  var layer, prop, results;
  results = [];
  for (prop in obj) {
    layer = obj[prop];
    if (layer._info.kind === "text") {
      results.push(obj[prop] = convertToTextLayer(layer));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

Layer.prototype.frameAsTextLayer = function(properties) {
  var t;
  t = new TextLayer;
  t.frame = this.frame;
  t.superLayer = this.superLayer;
  _.extend(t, properties);
  this.destroy();
  return t;
};

exports.TextLayer = TextLayer;

exports.convertTextLayers = convertTextLayers;


},{}],"ViewController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = (function(superClass) {
  extend(exports, superClass);

  function exports(options) {
    var autoInitial, backButtons, btn, i, len, transitions;
    if (options == null) {
      options = {};
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.height == null) {
      options.height = Screen.height;
    }
    if (options.clip == null) {
      options.clip = true;
    }
    if (options.initialViewName == null) {
      options.initialViewName = 'initialView';
    }
    if (options.backButtonName == null) {
      options.backButtonName = 'backButton';
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "cubic-bezier(0.19, 1, 0.22, 1)",
        time: .7
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "black";
    }
    if (options.scroll == null) {
      options.scroll = false;
    }
    if (options.autoLink == null) {
      options.autoLink = true;
    }
    exports.__super__.constructor.call(this, options);
    this.history = [];
    this.onChange("subLayers", (function(_this) {
      return function(changeList) {
        var c, children, i, len, scrollComponent, view;
        view = changeList.added[0];
        if (view != null) {
          view.clip = true;
          view.on(Events.Click, function() {});
          if (_this.scroll) {
            children = view.children;
            scrollComponent = new ScrollComponent({
              name: "scrollComponent",
              width: _this.width,
              height: _this.height,
              parent: view
            });
            scrollComponent.content.backgroundColor = "";
            if (view.width <= _this.width) {
              scrollComponent.scrollHorizontal = false;
            }
            if (view.height <= _this.height) {
              scrollComponent.scrollVertical = false;
            }
            for (i = 0, len = children.length; i < len; i++) {
              c = children[i];
              c.parent = scrollComponent.content;
            }
            view.scrollComponent = scrollComponent;
            return view.size = {
              width: _this.width,
              height: _this.height
            };
          }
        }
      };
    })(this));
    transitions = {
      switchInstant: {
        newView: {
          to: {
            x: 0,
            y: 0
          }
        }
      },
      fadeIn: {
        newView: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      },
      zoomIn: {
        newView: {
          from: {
            scale: 0.8,
            opacity: 0
          },
          to: {
            scale: 1,
            opacity: 1
          }
        }
      },
      zoomOut: {
        oldView: {
          to: {
            scale: 0.8,
            opacity: 0
          }
        }
      },
      slideInUp: {
        newView: {
          from: {
            y: this.height
          },
          to: {
            y: 0
          }
        }
      },
      slideInRight: {
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      slideInDown: {
        newView: {
          from: {
            maxY: 0
          },
          to: {
            y: 0
          }
        }
      },
      moveInRight: {
        oldView: {
          to: {
            maxX: 0
          }
        },
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      moveInLeft: {
        oldView: {
          to: {
            x: this.width
          }
        },
        newView: {
          from: {
            maxX: 0
          },
          to: {
            x: 0
          }
        }
      },
      slideInLeft: {
        newView: {
          from: {
            maxX: 0
          },
          to: {
            maxX: this.width
          }
        }
      },
      pushInRight: {
        oldView: {
          to: {
            x: -(this.width / 5),
            brightness: 70
          }
        },
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      pushInLeft: {
        oldView: {
          to: {
            x: this.width / 5,
            brightness: 70
          }
        },
        newView: {
          from: {
            x: -this.width
          },
          to: {
            x: 0
          }
        }
      },
      pushOutRight: {
        oldView: {
          to: {
            x: this.width
          }
        },
        newView: {
          from: {
            x: -(this.width / 5),
            brightness: 70
          },
          to: {
            x: 0,
            brightness: 100
          }
        }
      },
      pushOutLeft: {
        oldView: {
          to: {
            maxX: 0
          }
        },
        newView: {
          from: {
            x: this.width / 5,
            brightness: 70
          },
          to: {
            x: 0,
            brightness: 100
          }
        }
      },
      slideOutUp: {
        oldView: {
          to: {
            maxY: 0
          }
        }
      },
      slideOutRight: {
        oldView: {
          to: {
            x: this.width
          }
        }
      },
      slideOutDown: {
        oldView: {
          to: {
            y: this.height
          }
        }
      },
      slideOutLeft: {
        oldView: {
          to: {
            maxX: 0
          }
        }
      }
    };
    transitions.slideIn = transitions.slideInRight;
    transitions.slideOut = transitions.slideOutRight;
    transitions.pushIn = transitions.pushInRight;
    transitions.pushOut = transitions.pushOutRight;
    Events.ViewWillSwitch = "viewWillSwitch";
    Events.ViewDidSwitch = "viewDidSwitch";
    Layer.prototype.onViewWillSwitch = function(cb) {
      return this.on(Events.ViewWillSwitch, cb);
    };
    Layer.prototype.onViewDidSwitch = function(cb) {
      return this.on(Events.ViewDidSwitch, cb);
    };
    _.each(transitions, (function(_this) {
      return function(animProps, name) {
        var btn, i, layers, len, viewController;
        if (options.autoLink) {
          layers = Framer.CurrentContext.getLayers();
          for (i = 0, len = layers.length; i < len; i++) {
            btn = layers[i];
            if (_.includes(btn.name, name)) {
              viewController = _this;
              btn.onClick(function() {
                var anim, linkName;
                anim = this.name.split('_')[0];
                linkName = this.name.replace(anim + '_', '');
                linkName = linkName.replace(/\d+/g, '');
                return viewController[anim](_.find(layers, function(l) {
                  return l.name === linkName;
                }));
              });
            }
          }
        }
        return _this[name] = function(newView, animationOptions) {
          var hook, incoming, outgoing, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          if (animationOptions == null) {
            animationOptions = _this.animationOptions;
          }
          if (newView === _this.currentView) {
            return;
          }
          newView.parent = _this;
          newView.sendToBack();
          newView.point = {
            x: 0,
            y: 0
          };
          newView.opacity = 1;
          newView.scale = 1;
          newView.brightness = 100;
          if ((ref = _this.currentView) != null) {
            ref.point = {
              x: 0,
              y: 0
            };
          }
          if ((ref1 = _this.currentView) != null) {
            ref1.props = (ref2 = animProps.oldView) != null ? ref2.from : void 0;
          }
          outgoing = (ref3 = _this.currentView) != null ? ref3.animate(_.extend(animationOptions, {
            properties: (ref4 = animProps.oldView) != null ? ref4.to : void 0
          })) : void 0;
          newView.props = (ref5 = animProps.newView) != null ? ref5.from : void 0;
          incoming = newView.animate(_.extend(animationOptions, {
            properties: (ref6 = animProps.newView) != null ? ref6.to : void 0
          }));
          if (_.includes(name, 'Out')) {
            newView.placeBehind(_this.currentView);
            outgoing.on(Events.AnimationEnd, function() {
              return _this.currentView.bringToFront();
            });
          } else {
            newView.placeBefore(_this.currentView);
          }
          _this.emit(Events.ViewWillSwitch, _this.currentView, newView);
          _this.saveCurrentViewToHistory(name, outgoing, incoming);
          _this.currentView = newView;
          _this.emit("change:previousView", _this.previousView);
          _this.emit("change:currentView", _this.currentView);
          if (incoming.isAnimating) {
            hook = incoming;
          } else {
            hook = outgoing;
          }
          return hook.on(Events.AnimationEnd, function() {
            return _this.emit(Events.ViewDidSwitch, _this.previousView, _this.currentView);
          });
        };
      };
    })(this));
    if (options.initialViewName != null) {
      autoInitial = _.find(Framer.CurrentContext.getLayers(), function(l) {
        return l.name === options.initialViewName;
      });
      if (autoInitial != null) {
        this.switchInstant(autoInitial);
      }
    }
    if (options.initialView != null) {
      this.switchInstant(options.initialView);
    }
    if (options.backButtonName != null) {
      backButtons = _.filter(Framer.CurrentContext.getLayers(), function(l) {
        return _.includes(l.name, options.backButtonName);
      });
      for (i = 0, len = backButtons.length; i < len; i++) {
        btn = backButtons[i];
        btn.onClick((function(_this) {
          return function() {
            return _this.back();
          };
        })(this));
      }
    }
  }

  exports.define("previousView", {
    get: function() {
      return this.history[0].view;
    }
  });

  exports.prototype.saveCurrentViewToHistory = function(name, outgoingAnimation, incomingAnimation) {
    return this.history.unshift({
      view: this.currentView,
      animationName: name,
      incomingAnimation: incomingAnimation,
      outgoingAnimation: outgoingAnimation
    });
  };

  exports.prototype.back = function() {
    var backIn, moveOut, previous;
    previous = this.history[0];
    if (previous.view != null) {
      if (_.includes(previous.animationName, 'Out')) {
        previous.view.bringToFront();
      }
      backIn = previous.outgoingAnimation.reverse();
      moveOut = previous.incomingAnimation.reverse();
      backIn.start();
      moveOut.start();
      this.currentView = previous.view;
      this.history.shift();
      return moveOut.on(Events.AnimationEnd, (function(_this) {
        return function() {
          return _this.currentView.bringToFront();
        };
      })(this));
    }
  };

  return exports;

})(Layer);


},{}],"chatView":[function(require,module,exports){
exports.addToChat = new Layer({
  height: Screen.height,
  width: Screen.width,
  backgroundColor: "lightgrey"
});


},{}],"findModule":[function(require,module,exports){
var _findAll, _getHierarchy, _match;

_getHierarchy = function(layer) {
  var a, i, len, ref, string;
  string = '';
  ref = layer.ancestors();
  for (i = 0, len = ref.length; i < len; i++) {
    a = ref[i];
    string = a.name + '>' + string;
  }
  return string = string + layer.name;
};

_match = function(hierarchy, string) {
  var regExp, regexString;
  string = string.replace(/\s*>\s*/g, '>');
  string = string.split('*').join('[^>]*');
  string = string.split(' ').join('(?:.*)>');
  string = string.split(',').join('$|');
  regexString = "(^|>)" + string + "$";
  regExp = new RegExp(regexString);
  return hierarchy.match(regExp);
};

_findAll = function(selector, fromLayer) {
  var layers, stringNeedsRegex;
  layers = Framer.CurrentContext.getLayers();
  if (selector != null) {
    stringNeedsRegex = _.find(['*', ' ', '>', ','], function(c) {
      return _.contains(selector, c);
    });
    if (!(stringNeedsRegex || fromLayer)) {
      return layers = _.filter(layers, function(layer) {
        if (layer.name === selector) {
          return true;
        }
      });
    } else {
      return layers = _.filter(layers, function(layer) {
        var hierarchy;
        hierarchy = _getHierarchy(layer);
        if (fromLayer != null) {
          return _match(hierarchy, fromLayer.name + ' ' + selector);
        } else {
          return _match(hierarchy, selector);
        }
      });
    }
  } else {
    return layers;
  }
};

exports.Find = function(selector, fromLayer) {
  return _findAll(selector, fromLayer)[0];
};

exports.ƒ = function(selector, fromLayer) {
  return _findAll(selector, fromLayer)[0];
};

exports.FindAll = function(selector, fromLayer) {
  return _findAll(selector, fromLayer);
};

exports.ƒƒ = function(selector, fromLayer) {
  return _findAll(selector, fromLayer);
};

Layer.prototype.find = function(selector, fromLayer) {
  return _findAll(selector, this)[0];
};

Layer.prototype.ƒ = function(selector, fromLayer) {
  return _findAll(selector, this)[0];
};

Layer.prototype.findAll = function(selector, fromLayer) {
  return _findAll(selector, this);
};

Layer.prototype.ƒƒ = function(selector, fromLayer) {
  return _findAll(selector, this);
};


},{}],"firebase":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Firebase = (function(superClass) {
  var getCORSurl, request;

  extend(Firebase, superClass);

  getCORSurl = function(server, path, secret, project) {
    var url;
    switch (Utils.isWebKit()) {
      case true:
        url = "https://" + server + path + ".json?auth=" + secret + "&ns=" + project + "&sse=true";
        break;
      default:
        url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    }
    return url;
  };

  Firebase.define("status", {
    get: function() {
      return this._status;
    }
  });

  function Firebase(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.projectID = (base = this.options).projectID != null ? base.projectID : base.projectID = null;
    this.secret = (base1 = this.options).secret != null ? base1.secret : base1.secret = null;
    this.server = (base2 = this.options).server != null ? base2.server : base2.server = void 0;
    this.debug = (base3 = this.options).debug != null ? base3.debug : base3.debug = false;
    if (this._status == null) {
      this._status = "disconnected";
    }
    Firebase.__super__.constructor.apply(this, arguments);
    if (this.server === void 0) {
      Utils.domLoadJSON("https://" + this.projectID + ".firebaseio.com/.settings/owner.json", function(a, server) {
        var msg;
        print(msg = "Add ______ server:" + '   "' + server + '"' + " _____ to your instance of Firebase.");
        if (this.debug) {
          return console.log("Firebase: " + msg);
        }
      });
    }
    if (this.debug) {
      console.log("Firebase: Connecting to Firebase Project '" + this.projectID + "' ... \n URL: '" + (getCORSurl(this.server, "/", this.secret, this.projectID)) + "'");
    }
    this.onChange("connection");
  }

  request = function(project, secret, path, callback, method, data, parameters, debug) {
    var url, xhttp;
    url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    if (parameters !== void 0) {
      if (parameters.shallow) {
        url += "&shallow=true";
      }
      if (parameters.format === "export") {
        url += "&format=export";
      }
      switch (parameters.print) {
        case "pretty":
          url += "&print=pretty";
          break;
        case "silent":
          url += "&print=silent";
      }
      if (typeof parameters.download === "string") {
        url += "&download=" + parameters.download;
        window.open(url, "_self");
      }
      if (typeof parameters.orderBy === "string") {
        url += "&orderBy=" + '"' + parameters.orderBy + '"';
      }
      if (typeof parameters.limitToFirst === "number") {
        url += "&limitToFirst=" + parameters.limitToFirst;
      }
      if (typeof parameters.limitToLast === "number") {
        url += "&limitToLast=" + parameters.limitToLast;
      }
      if (typeof parameters.startAt === "number") {
        url += "&startAt=" + parameters.startAt;
      }
      if (typeof parameters.endAt === "number") {
        url += "&endAt=" + parameters.endAt;
      }
      if (typeof parameters.equalTo === "number") {
        url += "&equalTo=" + parameters.equalTo;
      }
    }
    xhttp = new XMLHttpRequest;
    if (debug) {
      console.log("Firebase: New '" + method + "'-request with data: '" + (JSON.stringify(data)) + "' \n URL: '" + url + "'");
    }
    xhttp.onreadystatechange = (function(_this) {
      return function() {
        if (parameters !== void 0) {
          if (parameters.print === "silent" || typeof parameters.download === "string") {
            return;
          }
        }
        switch (xhttp.readyState) {
          case 0:
            if (debug) {
              console.log("Firebase: Request not initialized \n URL: '" + url + "'");
            }
            break;
          case 1:
            if (debug) {
              console.log("Firebase: Server connection established \n URL: '" + url + "'");
            }
            break;
          case 2:
            if (debug) {
              console.log("Firebase: Request received \n URL: '" + url + "'");
            }
            break;
          case 3:
            if (debug) {
              console.log("Firebase: Processing request \n URL: '" + url + "'");
            }
            break;
          case 4:
            if (callback != null) {
              callback(JSON.parse(xhttp.responseText));
            }
            if (debug) {
              console.log("Firebase: Request finished, response: '" + (JSON.parse(xhttp.responseText)) + "' \n URL: '" + url + "'");
            }
        }
        if (xhttp.status === "404") {
          if (debug) {
            return console.warn("Firebase: Invalid request, page not found \n URL: '" + url + "'");
          }
        }
      };
    })(this);
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    return xhttp.send(data = "" + (JSON.stringify(data)));
  };

  Firebase.prototype.get = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "GET", null, parameters, this.debug);
  };

  Firebase.prototype.put = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PUT", data, parameters, this.debug);
  };

  Firebase.prototype.post = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "POST", data, parameters, this.debug);
  };

  Firebase.prototype.patch = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PATCH", data, parameters, this.debug);
  };

  Firebase.prototype["delete"] = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "DELETE", null, parameters, this.debug);
  };

  Firebase.prototype.onChange = function(path, callback) {
    var currentStatus, source, url;
    if (path === "connection") {
      url = getCORSurl(this.server, "/", this.secret, this.projectID);
      currentStatus = "disconnected";
      source = new EventSource(url);
      source.addEventListener("open", (function(_this) {
        return function() {
          if (currentStatus === "disconnected") {
            _this._status = "connected";
            if (callback != null) {
              callback("connected");
            }
            if (_this.debug) {
              console.log("Firebase: Connection to Firebase Project '" + _this.projectID + "' established");
            }
          }
          return currentStatus = "connected";
        };
      })(this));
      return source.addEventListener("error", (function(_this) {
        return function() {
          if (currentStatus === "connected") {
            _this._status = "disconnected";
            if (callback != null) {
              callback("disconnected");
            }
            if (_this.debug) {
              console.warn("Firebase: Connection to Firebase Project '" + _this.projectID + "' closed");
            }
          }
          return currentStatus = "disconnected";
        };
      })(this));
    } else {
      url = getCORSurl(this.server, path, this.secret, this.projectID);
      source = new EventSource(url);
      if (this.debug) {
        console.log("Firebase: Listening to changes made to '" + path + "' \n URL: '" + url + "'");
      }
      source.addEventListener("put", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "put", JSON.parse(ev.data).path, JSON.parse(ev.data).path.split("/"));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PUT': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
      return source.addEventListener("patch", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "patch", JSON.parse(ev.data).path, JSON.parse(ev.data).path.split("/"));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PATCH': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
    }
  };

  return Firebase;

})(Framer.BaseClass);


},{}],"itinerary":[function(require,module,exports){
exports.itinerary = [
  {
    day: "Tag 1",
    destinationName: "Hamburg",
    travelData: ["Alle an Bord um 17:00", "Weiterfahrt nach Southampton um 18:00"],
    image: "images/img-hamburg@2x.png"
  }, {
    day: "Tag 2",
    destinationName: "Auf See",
    travelData: ["Ankunft in Southampton Morgen um 9:30"],
    image: "images/img-seaday@2x.png"
  }, {
    day: "Tag 3",
    destinationName: "London / Southampton",
    travelData: ["Ankunft um 9:30", "Alle an Bord um 20:30", "Weiterfahrt nach Paris / LeHavre um 21:30"],
    image: "images/img-southampton@2x.png"
  }, {
    day: "Tag 4",
    destinationName: "Paris / LeHavre",
    travelData: ["Ankunft um 7:00", "Alle an Bord um 18:00", "Weiterfahrt nach Zeebrügge um 19:00"],
    image: "images/img-lehavre-1@2x.png"
  }, {
    day: "Tag 5",
    destinationName: "Brüssel / Zeebrügge",
    travelData: ["Ankunft um 10:00", "Alle an Bord um 18:00", "Weiterfahrt nach Rotterdam um 19:00"],
    image: "images/img-brugge-2@2x.png"
  }, {
    day: "Tag 6",
    destinationName: "Rotterdam",
    travelData: ["Ankunft um 8:00", "Alle an Bord morgen um 5:00", "Weiterfahrt nach Hamburg um 6:00"],
    image: "images/img-rotterdam-2@2x.png"
  }, {
    day: "Tag 7",
    destinationName: "Auf See",
    travelData: ["Ankunft in Hamburg Morgen um 6:00"],
    image: "images/img-seaday@2x.png"
  }, {
    day: "Tag 8",
    destinationName: "Hamburg",
    travelData: ["Ankunft in Hamburg um 6:00", "Alle von Bord um 8:00"],
    image: "images/img-hamburg@2x.png"
  }
];


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"users":[function(require,module,exports){
exports.users = [
  {
    userName: "Johnny1332",
    userHandle: "all around good guy",
    isAvailable: true,
    isOnline: true,
    profileImage: "images/profImg01.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "Patty993",
    userHandle: "Customer Service Agent",
    isAvailable: false,
    isOnline: false,
    profileImage: "images/profImg02.png",
    isCrew: true,
    isCocruiser: false
  }, {
    userName: "Aaron_gThatsMe",
    userHandle: "Some tagline",
    isAvailable: true,
    isOnline: true,
    profileImage: "images/profImg03.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "DudeOnTheFly",
    userHandle: "",
    isAvailable: false,
    isOnline: true,
    profileImage: "images/profImg04.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "FlyOnTheDude",
    userHandle: "",
    isAvailable: true,
    isOnline: true,
    profileImage: "images/profImg05.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "WHYME2233",
    userHandle: "",
    isAvailable: false,
    isOnline: false,
    profileImage: "images/profImg06.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "JustRaphael",
    userHandle: "all around good guy",
    isAvailable: true,
    isOnline: true,
    profileImage: "images/profImg07.png",
    isCrew: false,
    isCocruiser: false
  }, {
    userName: "JonielFromTheBlock",
    userHandle: "Customer Service Agent",
    isAvailable: false,
    isOnline: false,
    profileImage: "images/profImg08.png",
    isCrew: false,
    isCocruiser: false
  }
];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvNDAxMTI1Ly5UcmFzaC9jaGF0LmZyYW1lci9tb2R1bGVzL1RleHRMYXllci5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1Ly5UcmFzaC9jaGF0LmZyYW1lci9tb2R1bGVzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvLlRyYXNoL2NoYXQuZnJhbWVyL21vZHVsZXMvY2hhdFZpZXcuY29mZmVlIiwiL1VzZXJzLzQwMTEyNS8uVHJhc2gvY2hhdC5mcmFtZXIvbW9kdWxlcy9maW5kTW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvLlRyYXNoL2NoYXQuZnJhbWVyL21vZHVsZXMvZmlyZWJhc2UuY29mZmVlIiwiL1VzZXJzLzQwMTEyNS8uVHJhc2gvY2hhdC5mcmFtZXIvbW9kdWxlcy9pdGluZXJhcnkuY29mZmVlIiwiL1VzZXJzLzQwMTEyNS8uVHJhc2gvY2hhdC5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1Ly5UcmFzaC9jaGF0LmZyYW1lci9tb2R1bGVzL3VzZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsZ0RBQUE7RUFBQTs7O0FBQU07OztFQUVRLG1CQUFDLE9BQUQ7O01BQUMsVUFBUTs7SUFDckIsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjs7TUFDcEIsT0FBTyxDQUFDLGtCQUFzQixPQUFPLENBQUMsS0FBWCxHQUFzQix3QkFBdEIsR0FBb0Q7OztNQUMvRSxPQUFPLENBQUMsUUFBUzs7O01BQ2pCLE9BQU8sQ0FBQyxhQUFjOzs7TUFDdEIsT0FBTyxDQUFDLGFBQWM7OztNQUN0QixPQUFPLENBQUMsV0FBWTs7O01BQ3BCLE9BQU8sQ0FBQyxPQUFROztJQUNoQiwyQ0FBTSxPQUFOO0lB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UGY7R0EvQ1csRUF3RFg7SUFDQyxRQUFBLEVBQVMsYUFEVjtJQUVDLFVBQUEsRUFBWSxxQkFGYjtJQUdDLFdBQUEsRUFBYSxJQUhkO0lBSUMsUUFBQSxFQUFVLElBSlg7SUFLQyxZQUFBLEVBQWEsc0JBTGQ7SUFNQyxNQUFBLEVBQVEsS0FOVDtJQU9DLFdBQUEsRUFBYSxLQVBkO0dBeERXLEVBaUVYO0lBQ0UsUUFBQSxFQUFTLG9CQURYO0lBRUUsVUFBQSxFQUFZLHdCQUZkO0lBR0UsV0FBQSxFQUFhLEtBSGY7SUFJRSxRQUFBLEVBQVUsS0FKWjtJQUtFLFlBQUEsRUFBYSxzQkFMZjtJQU1FLE1BQUEsRUFBUSxLQU5WO0lBT0UsV0FBQSxFQUFhLEtBUGY7R0FqRVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgVGV4dExheWVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdEBkb0F1dG9TaXplID0gZmFsc2Vcblx0XHRAZG9BdXRvU2l6ZUhlaWdodCA9IGZhbHNlXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gaWYgb3B0aW9ucy5zZXR1cCB0aGVuIFwiaHNsYSg2MCwgOTAlLCA0NyUsIC40KVwiIGVsc2UgXCJ0cmFuc3BhcmVudFwiXG5cdFx0b3B0aW9ucy5jb2xvciA/PSBcInJlZFwiXG5cdFx0b3B0aW9ucy5saW5lSGVpZ2h0ID89IDEuMjVcblx0XHRvcHRpb25zLmZvbnRGYW1pbHkgPz0gXCJIZWx2ZXRpY2FcIlxuXHRcdG9wdGlvbnMuZm9udFNpemUgPz0gMjBcblx0XHRvcHRpb25zLnRleHQgPz0gXCJVc2UgbGF5ZXIudGV4dCB0byBhZGQgdGV4dFwiXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBzdHlsZS53aGl0ZVNwYWNlID0gXCJwcmUtbGluZVwiICMgYWxsb3cgXFxuIGluIC50ZXh0XG5cdFx0QHN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIiAjIG5vIGJvcmRlciB3aGVuIHNlbGVjdGVkXG5cdFx0XG5cdHNldFN0eWxlOiAocHJvcGVydHksIHZhbHVlLCBweFN1ZmZpeCA9IGZhbHNlKSAtPlxuXHRcdEBzdHlsZVtwcm9wZXJ0eV0gPSBpZiBweFN1ZmZpeCB0aGVuIHZhbHVlK1wicHhcIiBlbHNlIHZhbHVlXG5cdFx0QGVtaXQoXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgdmFsdWUpXG5cdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRcdFxuXHRjYWxjU2l6ZTogLT5cblx0XHRzaXplQWZmZWN0aW5nU3R5bGVzID1cblx0XHRcdGxpbmVIZWlnaHQ6IEBzdHlsZVtcImxpbmUtaGVpZ2h0XCJdXG5cdFx0XHRmb250U2l6ZTogQHN0eWxlW1wiZm9udC1zaXplXCJdXG5cdFx0XHRmb250V2VpZ2h0OiBAc3R5bGVbXCJmb250LXdlaWdodFwiXVxuXHRcdFx0cGFkZGluZ1RvcDogQHN0eWxlW1wicGFkZGluZy10b3BcIl1cblx0XHRcdHBhZGRpbmdSaWdodDogQHN0eWxlW1wicGFkZGluZy1yaWdodFwiXVxuXHRcdFx0cGFkZGluZ0JvdHRvbTogQHN0eWxlW1wicGFkZGluZy1ib3R0b21cIl1cblx0XHRcdHBhZGRpbmdMZWZ0OiBAc3R5bGVbXCJwYWRkaW5nLWxlZnRcIl1cblx0XHRcdHRleHRUcmFuc2Zvcm06IEBzdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdXG5cdFx0XHRib3JkZXJXaWR0aDogQHN0eWxlW1wiYm9yZGVyLXdpZHRoXCJdXG5cdFx0XHRsZXR0ZXJTcGFjaW5nOiBAc3R5bGVbXCJsZXR0ZXItc3BhY2luZ1wiXVxuXHRcdFx0Zm9udEZhbWlseTogQHN0eWxlW1wiZm9udC1mYW1pbHlcIl1cblx0XHRcdGZvbnRTdHlsZTogQHN0eWxlW1wiZm9udC1zdHlsZVwiXVxuXHRcdFx0Zm9udFZhcmlhbnQ6IEBzdHlsZVtcImZvbnQtdmFyaWFudFwiXVxuXHRcdGNvbnN0cmFpbnRzID0ge31cblx0XHRpZiBAZG9BdXRvU2l6ZUhlaWdodCB0aGVuIGNvbnN0cmFpbnRzLndpZHRoID0gQHdpZHRoXG5cdFx0c2l6ZSA9IFV0aWxzLnRleHRTaXplIEB0ZXh0LCBzaXplQWZmZWN0aW5nU3R5bGVzLCBjb25zdHJhaW50c1xuXHRcdGlmIEBzdHlsZS50ZXh0QWxpZ24gaXMgXCJyaWdodFwiXG5cdFx0XHRAd2lkdGggPSBzaXplLndpZHRoXG5cdFx0XHRAeCA9IEB4LUB3aWR0aFxuXHRcdGVsc2Vcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRAaGVpZ2h0ID0gc2l6ZS5oZWlnaHRcblxuXHRAZGVmaW5lIFwiYXV0b1NpemVcIixcblx0XHRnZXQ6IC0+IEBkb0F1dG9TaXplXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QGRvQXV0b1NpemUgPSB2YWx1ZVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiYXV0b1NpemVIZWlnaHRcIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRAZG9BdXRvU2l6ZUhlaWdodCA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJjb250ZW50RWRpdGFibGVcIixcblx0XHRzZXQ6IChib29sZWFuKSAtPlxuXHRcdFx0QF9lbGVtZW50LmNvbnRlbnRFZGl0YWJsZSA9IGJvb2xlYW5cblx0XHRcdEBpZ25vcmVFdmVudHMgPSAhYm9vbGVhblxuXHRcdFx0QG9uIFwiaW5wdXRcIiwgLT4gQGNhbGNTaXplKCkgaWYgQGRvQXV0b1NpemVcblx0QGRlZmluZSBcInRleHRcIixcblx0XHRnZXQ6IC0+IEBfZWxlbWVudC50ZXh0Q29udGVudFxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0QF9lbGVtZW50LnRleHRDb250ZW50ID0gdmFsdWVcblx0XHRcdEBlbWl0KFwiY2hhbmdlOnRleHRcIiwgdmFsdWUpXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJmb250RmFtaWx5XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRGYW1pbHlcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udEZhbWlseVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRTaXplXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRTaXplLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTaXplXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGluZUhlaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5saW5lSGVpZ2h0IFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsaW5lSGVpZ2h0XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFdlaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250V2VpZ2h0IFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250V2VpZ2h0XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFN0eWxlXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRTdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250U3R5bGVcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250VmFyaWFudFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250VmFyaWFudFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250VmFyaWFudFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdcIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ1JpZ2h0XCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0JvdHRvbVwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1RvcFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nVG9wLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nUmlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1JpZ2h0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdCb3R0b21cIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ0JvdHRvbS5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ0xlZnRcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nTGVmdC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nTGVmdFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInRleHRBbGlnblwiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJ0ZXh0QWxpZ25cIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJ0ZXh0VHJhbnNmb3JtXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnRleHRUcmFuc2Zvcm0gXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRUcmFuc2Zvcm1cIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJsZXR0ZXJTcGFjaW5nXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmxldHRlclNwYWNpbmcucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGV0dGVyU3BhY2luZ1wiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcImxlbmd0aFwiLCBcblx0XHRnZXQ6IC0+IEB0ZXh0Lmxlbmd0aFxuXG5jb252ZXJ0VG9UZXh0TGF5ZXIgPSAobGF5ZXIpIC0+XG5cdHQgPSBuZXcgVGV4dExheWVyXG5cdFx0bmFtZTogbGF5ZXIubmFtZVxuXHRcdGZyYW1lOiBsYXllci5mcmFtZVxuXHRcdHBhcmVudDogbGF5ZXIucGFyZW50XG5cdFxuXHRjc3NPYmogPSB7fVxuXHRjc3MgPSBsYXllci5faW5mby5tZXRhZGF0YS5jc3Ncblx0Y3NzLmZvckVhY2ggKHJ1bGUpIC0+XG5cdFx0cmV0dXJuIGlmIF8uaW5jbHVkZXMgcnVsZSwgJy8qJ1xuXHRcdGFyciA9IHJ1bGUuc3BsaXQoJzogJylcblx0XHRjc3NPYmpbYXJyWzBdXSA9IGFyclsxXS5yZXBsYWNlKCc7JywnJylcblx0dC5zdHlsZSA9IGNzc09ialxuXHRcblx0aW1wb3J0UGF0aCA9IGxheWVyLl9fZnJhbWVySW1wb3J0ZWRGcm9tUGF0aFxuXHRpZiBfLmluY2x1ZGVzIGltcG9ydFBhdGgsICdAMngnXG5cdFx0dC5mb250U2l6ZSAqPSAyXG5cdFx0dC5saW5lSGVpZ2h0ID0gKHBhcnNlSW50KHQubGluZUhlaWdodCkqMikrJ3B4J1xuXHRcdHQubGV0dGVyU3BhY2luZyAqPSAyXG5cdFx0XHRcdFx0XG5cdHQueSAtPSAocGFyc2VJbnQodC5saW5lSGVpZ2h0KS10LmZvbnRTaXplKS8yICMgY29tcGVuc2F0ZSBmb3IgaG93IENTUyBoYW5kbGVzIGxpbmUgaGVpZ2h0XG5cdHQueSAtPSB0LmZvbnRTaXplICogMC4xICMgc2tldGNoIHBhZGRpbmdcblx0dC54IC09IHQuZm9udFNpemUgKiAwLjA4ICMgc2tldGNoIHBhZGRpbmdcblx0dC53aWR0aCArPSB0LmZvbnRTaXplICogMC41ICMgc2tldGNoIHBhZGRpbmdcblxuXHR0LnRleHQgPSBsYXllci5faW5mby5tZXRhZGF0YS5zdHJpbmdcblx0bGF5ZXIuZGVzdHJveSgpXG5cdHJldHVybiB0XG5cbkxheWVyOjpjb252ZXJ0VG9UZXh0TGF5ZXIgPSAtPiBjb252ZXJ0VG9UZXh0TGF5ZXIoQClcblxuY29udmVydFRleHRMYXllcnMgPSAob2JqKSAtPlxuXHRmb3IgcHJvcCxsYXllciBvZiBvYmpcblx0XHRpZiBsYXllci5faW5mby5raW5kIGlzIFwidGV4dFwiXG5cdFx0XHRvYmpbcHJvcF0gPSBjb252ZXJ0VG9UZXh0TGF5ZXIobGF5ZXIpXG5cbiMgQmFja3dhcmRzIGNvbXBhYmlsaXR5LiBSZXBsYWNlZCBieSBjb252ZXJ0VG9UZXh0TGF5ZXIoKVxuTGF5ZXI6OmZyYW1lQXNUZXh0TGF5ZXIgPSAocHJvcGVydGllcykgLT5cbiAgICB0ID0gbmV3IFRleHRMYXllclxuICAgIHQuZnJhbWUgPSBAZnJhbWVcbiAgICB0LnN1cGVyTGF5ZXIgPSBAc3VwZXJMYXllclxuICAgIF8uZXh0ZW5kIHQscHJvcGVydGllc1xuICAgIEBkZXN0cm95KClcbiAgICB0XG5cbmV4cG9ydHMuVGV4dExheWVyID0gVGV4dExheWVyXG5leHBvcnRzLmNvbnZlcnRUZXh0TGF5ZXJzID0gY29udmVydFRleHRMYXllcnNcbiIsImNsYXNzIG1vZHVsZS5leHBvcnRzIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5pbml0aWFsVmlld05hbWUgPz0gJ2luaXRpYWxWaWV3J1xuXHRcdG9wdGlvbnMuYmFja0J1dHRvbk5hbWUgPz0gJ2JhY2tCdXR0b24nXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKVwiLCB0aW1lOiAuN1xuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiYmxhY2tcIlxuXHRcdG9wdGlvbnMuc2Nyb2xsID89IGZhbHNlXG5cdFx0b3B0aW9ucy5hdXRvTGluayA/PSB0cnVlXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXG5cdFx0QG9uQ2hhbmdlIFwic3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSA9PlxuXHRcdFx0dmlldyA9IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGlmIHZpZXc/XG5cdFx0XHRcdCMgZGVmYXVsdCBiZWhhdmlvcnMgZm9yIHZpZXdzXG5cdFx0XHRcdHZpZXcuY2xpcCA9IHRydWVcblx0XHRcdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdFx0XHQjIGFkZCBzY3JvbGxjb21wb25lbnRcblx0XHRcdFx0aWYgQHNjcm9sbFxuXHRcdFx0XHRcdGNoaWxkcmVuID0gdmlldy5jaGlsZHJlblxuXHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudCA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdFx0XHRcdG5hbWU6IFwic2Nyb2xsQ29tcG9uZW50XCJcblx0XHRcdFx0XHRcdHdpZHRoOiBAd2lkdGhcblx0XHRcdFx0XHRcdGhlaWdodDogQGhlaWdodFxuXHRcdFx0XHRcdFx0cGFyZW50OiB2aWV3XG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50LmNvbnRlbnQuYmFja2dyb3VuZENvbG9yID0gXCJcIlxuXHRcdFx0XHRcdGlmIHZpZXcud2lkdGggPD0gQHdpZHRoXG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsSG9yaXpvbnRhbCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgdmlldy5oZWlnaHQgPD0gQGhlaWdodFxuXHRcdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50LnNjcm9sbFZlcnRpY2FsID0gZmFsc2Vcblx0XHRcdFx0XHRmb3IgYyBpbiBjaGlsZHJlblxuXHRcdFx0XHRcdFx0Yy5wYXJlbnQgPSBzY3JvbGxDb21wb25lbnQuY29udGVudFxuXHRcdFx0XHRcdHZpZXcuc2Nyb2xsQ29tcG9uZW50ID0gc2Nyb2xsQ29tcG9uZW50ICMgbWFrZSBpdCBhY2Nlc3NpYmxlIGFzIGEgcHJvcGVydHlcblx0XHRcdFx0XHQjIHJlc2V0IHNpemUgc2luY2UgY29udGVudCBtb3ZlZCB0byBzY3JvbGxDb21wb25lbnQuIHByZXZlbnRzIHNjcm9sbCBidWcgd2hlbiBkcmFnZ2luZyBvdXRzaWRlLlxuXHRcdFx0XHRcdHZpZXcuc2l6ZSA9IHt3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEBoZWlnaHR9XG5cblx0XHR0cmFuc2l0aW9ucyA9XG5cdFx0XHRzd2l0Y2hJbnN0YW50OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogMCwgeTogMH1cblx0XHRcdGZhZGVJbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7b3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge29wYWNpdHk6IDF9XG5cdFx0XHR6b29tSW46XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRcdFx0dG86IHtzY2FsZTogMSwgb3BhY2l0eTogMX1cblx0XHRcdHpvb21PdXQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHtzY2FsZTogMC44LCBvcGFjaXR5OiAwfVxuXHRcdFx0c2xpZGVJblVwOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt5OiBAaGVpZ2h0fVxuXHRcdFx0XHRcdHRvOiB7eTogMH1cblx0XHRcdHNsaWRlSW5SaWdodDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHNsaWRlSW5Eb3duOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHttYXhZOiAwfVxuXHRcdFx0XHRcdHRvOiB7eTogMH1cblx0XHRcdG1vdmVJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdG1vdmVJbkxlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFg6IDB9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkxlZnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFg6IDB9XG5cdFx0XHRcdFx0dG86IHttYXhYOiBAd2lkdGh9XG5cdFx0XHRwdXNoSW5SaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHB1c2hJbkxlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGgvNSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC1Ad2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaE91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiAtKEB3aWR0aC81KSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdFx0dG86IHt4OiAwLCBicmlnaHRuZXNzOiAxMDB9XG5cdFx0XHRwdXNoT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHNsaWRlT3V0VXA6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhZOiAwfVxuXHRcdFx0c2xpZGVPdXRSaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdHNsaWRlT3V0RG93bjpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3k6IEBoZWlnaHR9XG5cdFx0XHRzbGlkZU91dExlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXG5cdFx0IyBzaG9ydGN1dHNcblx0XHR0cmFuc2l0aW9ucy5zbGlkZUluID0gdHJhbnNpdGlvbnMuc2xpZGVJblJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMuc2xpZGVPdXQgPSB0cmFuc2l0aW9ucy5zbGlkZU91dFJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMucHVzaEluID0gdHJhbnNpdGlvbnMucHVzaEluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoT3V0ID0gdHJhbnNpdGlvbnMucHVzaE91dFJpZ2h0XG5cblx0XHQjIGV2ZW50c1xuXHRcdEV2ZW50cy5WaWV3V2lsbFN3aXRjaCA9IFwidmlld1dpbGxTd2l0Y2hcIlxuXHRcdEV2ZW50cy5WaWV3RGlkU3dpdGNoID0gXCJ2aWV3RGlkU3dpdGNoXCJcblx0XHRMYXllcjo6b25WaWV3V2lsbFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3V2lsbFN3aXRjaCwgY2IpXG5cdFx0TGF5ZXI6Om9uVmlld0RpZFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3RGlkU3dpdGNoLCBjYilcdFx0XG5cblx0XHRfLmVhY2ggdHJhbnNpdGlvbnMsIChhbmltUHJvcHMsIG5hbWUpID0+XG5cblx0XHRcdGlmIG9wdGlvbnMuYXV0b0xpbmtcblx0XHRcdFx0bGF5ZXJzID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpXG5cdFx0XHRcdGZvciBidG4gaW4gbGF5ZXJzXG5cdFx0XHRcdFx0aWYgXy5pbmNsdWRlcyBidG4ubmFtZSwgbmFtZVxuXHRcdFx0XHRcdFx0dmlld0NvbnRyb2xsZXIgPSBAXG5cdFx0XHRcdFx0XHRidG4ub25DbGljayAtPlxuXHRcdFx0XHRcdFx0XHRhbmltID0gQG5hbWUuc3BsaXQoJ18nKVswXVxuXHRcdFx0XHRcdFx0XHRsaW5rTmFtZSA9IEBuYW1lLnJlcGxhY2UoYW5pbSsnXycsJycpXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gbGlua05hbWUucmVwbGFjZSgvXFxkKy9nLCAnJykgIyByZW1vdmUgbnVtYmVyc1xuXHRcdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlclthbmltXSBfLmZpbmQobGF5ZXJzLCAobCkgLT4gbC5uYW1lIGlzIGxpbmtOYW1lKVxuXG5cdFx0XHRAW25hbWVdID0gKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgPT5cblxuXHRcdFx0XHRyZXR1cm4gaWYgbmV3VmlldyBpcyBAY3VycmVudFZpZXdcblxuXHRcdFx0XHQjIG1ha2Ugc3VyZSB0aGUgbmV3IGxheWVyIGlzIGluc2lkZSB0aGUgdmlld2NvbnRyb2xsZXJcblx0XHRcdFx0bmV3Vmlldy5wYXJlbnQgPSBAXG5cdFx0XHRcdG5ld1ZpZXcuc2VuZFRvQmFjaygpXG5cblx0XHRcdFx0IyByZXNldCBwcm9wcyBpbiBjYXNlIHRoZXkgd2VyZSBjaGFuZ2VkIGJ5IGEgcHJldiBhbmltYXRpb25cblx0XHRcdFx0bmV3Vmlldy5wb2ludCA9IHt4OjAsIHk6IDB9XG5cdFx0XHRcdG5ld1ZpZXcub3BhY2l0eSA9IDFcblx0XHRcdFx0bmV3Vmlldy5zY2FsZSA9IDFcblx0XHRcdFx0bmV3Vmlldy5icmlnaHRuZXNzID0gMTAwXG5cblx0XHRcdFx0IyBvbGRWaWV3XG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucG9pbnQgPSB7eDogMCwgeTogMH0gIyBmaXhlcyBvZmZzZXQgaXNzdWUgd2hlbiBtb3ZpbmcgdG9vIGZhc3QgYmV0d2VlbiBzY3JlZW5zXG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucHJvcHMgPSBhbmltUHJvcHMub2xkVmlldz8uZnJvbVxuXHRcdFx0XHRvdXRnb2luZyA9IEBjdXJyZW50Vmlldz8uYW5pbWF0ZSBfLmV4dGVuZCBhbmltYXRpb25PcHRpb25zLCB7cHJvcGVydGllczogYW5pbVByb3BzLm9sZFZpZXc/LnRvfVxuXG5cdFx0XHRcdCMgbmV3Vmlld1xuXHRcdFx0XHRuZXdWaWV3LnByb3BzID0gYW5pbVByb3BzLm5ld1ZpZXc/LmZyb21cblx0XHRcdFx0aW5jb21pbmcgPSBuZXdWaWV3LmFuaW1hdGUgXy5leHRlbmQgYW5pbWF0aW9uT3B0aW9ucywge3Byb3BlcnRpZXM6IGFuaW1Qcm9wcy5uZXdWaWV3Py50b31cblx0XHRcdFx0XG5cdFx0XHRcdCMgbGF5ZXIgb3JkZXJcblx0XHRcdFx0aWYgXy5pbmNsdWRlcyBuYW1lLCAnT3V0J1xuXHRcdFx0XHRcdG5ld1ZpZXcucGxhY2VCZWhpbmQoQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcdG91dGdvaW5nLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+IEBjdXJyZW50Vmlldy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmV3Vmlldy5wbGFjZUJlZm9yZShAY3VycmVudFZpZXcpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5WaWV3V2lsbFN3aXRjaCwgQGN1cnJlbnRWaWV3LCBuZXdWaWV3KVxuXHRcdFx0XHRcblx0XHRcdFx0IyBjaGFuZ2UgQ3VycmVudFZpZXcgYmVmb3JlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgc28gb25lIGNvdWxkIGdvIGJhY2sgaW4gaGlzdG9yeVxuXHRcdFx0XHQjIHdpdGhvdXQgaGF2aW5nIHRvIHdhaXQgZm9yIHRoZSB0cmFuc2l0aW9uIHRvIGZpbmlzaFxuXHRcdFx0XHRAc2F2ZUN1cnJlbnRWaWV3VG9IaXN0b3J5IG5hbWUsIG91dGdvaW5nLCBpbmNvbWluZ1xuXHRcdFx0XHRAY3VycmVudFZpZXcgPSBuZXdWaWV3XG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOnByZXZpb3VzVmlld1wiLCBAcHJldmlvdXNWaWV3KVxuXHRcdFx0XHRAZW1pdChcImNoYW5nZTpjdXJyZW50Vmlld1wiLCBAY3VycmVudFZpZXcpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBpbmNvbWluZy5pc0FuaW1hdGluZ1xuXHRcdFx0XHRcdGhvb2sgPSBpbmNvbWluZyBcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhvb2sgPSBvdXRnb2luZ1xuXHRcdFx0XHRob29rLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIEBwcmV2aW91c1ZpZXcsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3TmFtZT9cblx0XHRcdGF1dG9Jbml0aWFsID0gXy5maW5kIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IGwubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0aWYgYXV0b0luaXRpYWw/IHRoZW4gQHN3aXRjaEluc3RhbnQgYXV0b0luaXRpYWxcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXc/XG5cdFx0XHRAc3dpdGNoSW5zdGFudCBvcHRpb25zLmluaXRpYWxWaWV3XG5cblx0XHRpZiBvcHRpb25zLmJhY2tCdXR0b25OYW1lP1xuXHRcdFx0YmFja0J1dHRvbnMgPSBfLmZpbHRlciBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIChsKSAtPiBfLmluY2x1ZGVzIGwubmFtZSwgb3B0aW9ucy5iYWNrQnV0dG9uTmFtZVxuXHRcdFx0Zm9yIGJ0biBpbiBiYWNrQnV0dG9uc1xuXHRcdFx0XHRidG4ub25DbGljayA9PiBAYmFjaygpXG5cblx0QGRlZmluZSBcInByZXZpb3VzVmlld1wiLFxuXHRcdFx0Z2V0OiAtPiBAaGlzdG9yeVswXS52aWV3XG5cblx0c2F2ZUN1cnJlbnRWaWV3VG9IaXN0b3J5OiAobmFtZSxvdXRnb2luZ0FuaW1hdGlvbixpbmNvbWluZ0FuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFZpZXdcblx0XHRcdGFuaW1hdGlvbk5hbWU6IG5hbWVcblx0XHRcdGluY29taW5nQW5pbWF0aW9uOiBpbmNvbWluZ0FuaW1hdGlvblxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb246IG91dGdvaW5nQW5pbWF0aW9uXG5cblx0YmFjazogLT5cblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0aWYgXy5pbmNsdWRlcyBwcmV2aW91cy5hbmltYXRpb25OYW1lLCAnT3V0J1xuXHRcdFx0XHRwcmV2aW91cy52aWV3LmJyaW5nVG9Gcm9udCgpXG5cblx0XHRcdGJhY2tJbiA9IHByZXZpb3VzLm91dGdvaW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRiYWNrSW4uc3RhcnQoKVxuXHRcdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHRcdEBjdXJyZW50VmlldyA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdG1vdmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG4iLCIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIyMjIyMjIyMgICAgICAgIEFERCBBQ1RJVkUgVVNFUiBUTyBDSEFUICAgICAgICAgICAgICAgIyMjIyMjIyMjIyMjXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5leHBvcnRzLmFkZFRvQ2hhdCA9IG5ldyBMYXllclxuXHRoZWlnaHQ6U2NyZWVuLmhlaWdodFxuXHR3aWR0aDpTY3JlZW4ud2lkdGhcblx0YmFja2dyb3VuZENvbG9yOiBcImxpZ2h0Z3JleVwiXG5cdCMgcGFyZW50OlZpZXdzXG4iLCJfZ2V0SGllcmFyY2h5ID0gKGxheWVyKSAtPlxuICBzdHJpbmcgPSAnJ1xuICBmb3IgYSBpbiBsYXllci5hbmNlc3RvcnMoKVxuICAgIHN0cmluZyA9IGEubmFtZSsnPicrc3RyaW5nXG4gIHJldHVybiBzdHJpbmcgPSBzdHJpbmcrbGF5ZXIubmFtZVxuXG5fbWF0Y2ggPSAoaGllcmFyY2h5LCBzdHJpbmcpIC0+XG4gICMgcHJlcGFyZSByZWdleCB0b2tlbnNcbiAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xccyo+XFxzKi9nLCc+JykgIyBjbGVhbiB1cCBzcGFjZXMgYXJvdW5kIGFycm93c1xuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJyonKS5qb2luKCdbXj5dKicpICMgYXN0ZXJpa3MgYXMgbGF5ZXIgbmFtZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJyAnKS5qb2luKCcoPzouKik+JykgIyBzcGFjZSBhcyBzdHJ1Y3R1cmUgd2lsZGNhcmRcbiAgc3RyaW5nID0gc3RyaW5nLnNwbGl0KCcsJykuam9pbignJHwnKSAjIGFsbG93IG11bHRpcGxlIHNlYXJjaGVzIHVzaW5nIGNvbW1hXG4gIHJlZ2V4U3RyaW5nID0gXCIoXnw+KVwiK3N0cmluZytcIiRcIiAjIGFsd2F5cyBib3R0b20gbGF5ZXIsIG1heWJlIHBhcnQgb2YgaGllcmFyY2h5XG5cbiAgcmVnRXhwID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZykgXG4gIHJldHVybiBoaWVyYXJjaHkubWF0Y2gocmVnRXhwKVxuXG5fZmluZEFsbCA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPlxuICBsYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblxuICBpZiBzZWxlY3Rvcj9cbiAgICBzdHJpbmdOZWVkc1JlZ2V4ID0gXy5maW5kIFsnKicsJyAnLCc+JywnLCddLCAoYykgLT4gXy5jb250YWlucyBzZWxlY3RvcixjXG4gICAgdW5sZXNzIHN0cmluZ05lZWRzUmVnZXggb3IgZnJvbUxheWVyXG4gICAgICBsYXllcnMgPSBfLmZpbHRlciBsYXllcnMsIChsYXllcikgLT4gXG4gICAgICAgIGlmIGxheWVyLm5hbWUgaXMgc2VsZWN0b3IgdGhlbiB0cnVlXG4gICAgZWxzZVxuICAgICAgbGF5ZXJzID0gXy5maWx0ZXIgbGF5ZXJzLCAobGF5ZXIpIC0+XG4gICAgICAgICAgaGllcmFyY2h5ID0gX2dldEhpZXJhcmNoeShsYXllcilcbiAgICAgICAgICBpZiBmcm9tTGF5ZXI/XG4gICAgICAgICAgICBfbWF0Y2goaGllcmFyY2h5LCBmcm9tTGF5ZXIubmFtZSsnICcrc2VsZWN0b3IpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgX21hdGNoKGhpZXJhcmNoeSwgc2VsZWN0b3IpXG4gIGVsc2VcbiAgICBsYXllcnNcblxuXG4jIEdsb2JhbFxuZXhwb3J0cy5GaW5kICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpWzBdXG5leHBvcnRzLsaSICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpWzBdXG5cbmV4cG9ydHMuRmluZEFsbCA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVxuZXhwb3J0cy7GksaSICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilcblxuIyBNZXRob2RzXG5MYXllcjo6ZmluZCAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApWzBdXG5MYXllcjo6xpIgICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVswXVxuXG5MYXllcjo6ZmluZEFsbCAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApXG5MYXllcjo6xpLGkiAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQCkiLCJcblxuXG4jICdGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcycgbW9kdWxlIHYxLjBcbiMgYnkgTWFyYyBLcmVubiwgTWF5IDMxc3QsIDIwMTYgfCBtYXJjLmtyZW5uQGdtYWlsLmNvbSB8IEBtYXJjX2tyZW5uXG5cbiMgRG9jdW1lbnRhdGlvbiBvZiB0aGlzIE1vZHVsZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmNrcmVubi9mcmFtZXItRmlyZWJhc2VcbiMgLS0tLS0tIDogLS0tLS0tLSBGaXJlYmFzZSBSRVNUIEFQSTogaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvcmVmZXJlbmNlL3Jlc3QvZGF0YWJhc2UvXG5cblxuIyBUb0RvOlxuIyBGaXggb25DaGFuZ2UgXCJjb25uZWN0aW9uXCIsIGB0aGlzwrQgY29udGV4dFxuXG5cblxuIyBGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIGV4cG9ydHMuRmlyZWJhc2UgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cblxuXG5cdGdldENPUlN1cmwgPSAoc2VydmVyLCBwYXRoLCBzZWNyZXQsIHByb2plY3QpIC0+XG5cblx0XHRzd2l0Y2ggVXRpbHMuaXNXZWJLaXQoKVxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gdXJsID0gXCJodHRwczovLyN7c2VydmVyfSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fSZucz0je3Byb2plY3R9JnNzZT10cnVlXCIgIyBXZWJraXQgWFNTIHdvcmthcm91bmRcblx0XHRcdGVsc2UgICAgICAgICAgIHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXHRcdHJldHVybiB1cmxcblxuXG5cdEAuZGVmaW5lIFwic3RhdHVzXCIsXG5cdFx0Z2V0OiAtPiBAX3N0YXR1cyAjIHJlYWRPbmx5XG5cblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAcHJvamVjdElEID0gQG9wdGlvbnMucHJvamVjdElEID89IG51bGxcblx0XHRAc2VjcmV0ICAgID0gQG9wdGlvbnMuc2VjcmV0ICAgID89IG51bGxcblx0XHRAc2VydmVyICAgID0gQG9wdGlvbnMuc2VydmVyICAgID89IHVuZGVmaW5lZCAjIHJlcXVpcmVkIGZvciBXZWJLaXQgWFNTIHdvcmthcm91bmRcblx0XHRAZGVidWcgICAgID0gQG9wdGlvbnMuZGVidWcgICAgID89IGZhbHNlXG5cdFx0QF9zdGF0dXMgICAgICAgICAgICAgICAgICAgICAgICA/PSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0c3VwZXJcblxuXG5cdFx0aWYgQHNlcnZlciBpcyB1bmRlZmluZWRcblx0XHRcdFV0aWxzLmRvbUxvYWRKU09OIFwiaHR0cHM6Ly8je0Bwcm9qZWN0SUR9LmZpcmViYXNlaW8uY29tLy5zZXR0aW5ncy9vd25lci5qc29uXCIsIChhLHNlcnZlcikgLT5cblx0XHRcdFx0cHJpbnQgbXNnID0gXCJBZGQgX19fX19fIHNlcnZlcjpcIiArICcgICBcIicgKyBzZXJ2ZXIgKyAnXCInICsgXCIgX19fX18gdG8geW91ciBpbnN0YW5jZSBvZiBGaXJlYmFzZS5cIlxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiAje21zZ31cIiBpZiBAZGVidWdcblxuXG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGluZyB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyAuLi4gXFxuIFVSTDogJyN7Z2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRCl9J1wiIGlmIEBkZWJ1Z1xuXHRcdEAub25DaGFuZ2UgXCJjb25uZWN0aW9uXCJcblxuXG5cdHJlcXVlc3QgPSAocHJvamVjdCwgc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBwYXJhbWV0ZXJzLCBkZWJ1ZykgLT5cblxuXHRcdHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXG5cdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLnNoYWxsb3cgICAgICAgICAgICB0aGVuIHVybCArPSBcIiZzaGFsbG93PXRydWVcIlxuXHRcdFx0aWYgcGFyYW1ldGVycy5mb3JtYXQgaXMgXCJleHBvcnRcIiB0aGVuIHVybCArPSBcIiZmb3JtYXQ9ZXhwb3J0XCJcblxuXHRcdFx0c3dpdGNoIHBhcmFtZXRlcnMucHJpbnRcblx0XHRcdFx0d2hlbiBcInByZXR0eVwiIHRoZW4gdXJsICs9IFwiJnByaW50PXByZXR0eVwiXG5cdFx0XHRcdHdoZW4gXCJzaWxlbnRcIiB0aGVuIHVybCArPSBcIiZwcmludD1zaWxlbnRcIlxuXG5cdFx0XHRpZiB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiXG5cdFx0XHRcdHVybCArPSBcIiZkb3dubG9hZD0je3BhcmFtZXRlcnMuZG93bmxvYWR9XCJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLFwiX3NlbGZcIilcblxuXG5cdFx0XHR1cmwgKz0gXCImb3JkZXJCeT1cIiArICdcIicgKyBwYXJhbWV0ZXJzLm9yZGVyQnkgKyAnXCInIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLm9yZGVyQnkgICAgICBpcyBcInN0cmluZ1wiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0ZpcnN0PSN7cGFyYW1ldGVycy5saW1pdFRvRmlyc3R9XCIgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvRmlyc3QgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9MYXN0PSN7cGFyYW1ldGVycy5saW1pdFRvTGFzdH1cIiAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0xhc3QgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZzdGFydEF0PSN7cGFyYW1ldGVycy5zdGFydEF0fVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLnN0YXJ0QXQgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZW5kQXQ9I3twYXJhbWV0ZXJzLmVuZEF0fVwiICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lbmRBdCAgICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVxdWFsVG89I3twYXJhbWV0ZXJzLmVxdWFsVG99XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZXF1YWxUbyAgICAgIGlzIFwibnVtYmVyXCJcblxuXG5cdFx0eGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3Rcblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBOZXcgJyN7bWV0aG9kfSctcmVxdWVzdCB3aXRoIGRhdGE6ICcje0pTT04uc3RyaW5naWZ5KGRhdGEpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ID0+XG5cblx0XHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRpZiBwYXJhbWV0ZXJzLnByaW50IGlzIFwic2lsZW50XCIgb3IgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIiB0aGVuIHJldHVybiAjIHVnaFxuXG5cdFx0XHRzd2l0Y2ggeGh0dHAucmVhZHlTdGF0ZVxuXHRcdFx0XHR3aGVuIDAgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IG5vdCBpbml0aWFsaXplZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMSB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFNlcnZlciBjb25uZWN0aW9uIGVzdGFibGlzaGVkIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAyIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCByZWNlaXZlZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDMgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBQcm9jZXNzaW5nIHJlcXVlc3QgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gNFxuXHRcdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBmaW5pc2hlZCwgcmVzcG9uc2U6ICcje0pTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXHRcdFx0aWYgeGh0dHAuc3RhdHVzIGlzIFwiNDA0XCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IEludmFsaWQgcmVxdWVzdCwgcGFnZSBub3QgZm91bmQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cblx0XHR4aHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuXHRcdHhodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0eGh0dHAuc2VuZChkYXRhID0gXCIje0pTT04uc3RyaW5naWZ5KGRhdGEpfVwiKVxuXG5cblxuXHQjIEF2YWlsYWJsZSBtZXRob2RzXG5cblx0Z2V0OiAgICAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiR0VUXCIsICAgIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cHV0OiAgICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUFVUXCIsICAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cG9zdDogICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUE9TVFwiLCAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cGF0Y2g6ICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUEFUQ0hcIiwgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0ZGVsZXRlOiAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiREVMRVRFXCIsIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1ZylcblxuXG5cblx0b25DaGFuZ2U6IChwYXRoLCBjYWxsYmFjaykgLT5cblxuXG5cdFx0aWYgcGF0aCBpcyBcImNvbm5lY3Rpb25cIlxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwib3BlblwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBlc3RhYmxpc2hlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcImVycm9yXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImRpc2Nvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBjbG9zZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblxuXG5cdFx0ZWxzZVxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIHBhdGgsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTGlzdGVuaW5nIHRvIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwdXRcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicHV0XCIsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aCwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQVVQnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwYXRjaFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwYXRjaFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIikpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUEFUQ0gnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcbiIsImV4cG9ydHMuaXRpbmVyYXJ5ID0gW1xuICAgICB7XG4gICAgICBkYXk6XCJUYWcgMVwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiSGFtYnVyZ1wiXG4gICAgICB0cmF2ZWxEYXRhOltcIkFsbGUgYW4gQm9yZCB1bSAxNzowMFwiLFwiV2VpdGVyZmFocnQgbmFjaCBTb3V0aGFtcHRvbiB1bSAxODowMFwiXVxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLWhhbWJ1cmdAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDJcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkF1ZiBTZWVcIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCBpbiBTb3V0aGFtcHRvbiBNb3JnZW4gdW0gOTozMFwiXVxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLXNlYWRheUAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgM1wiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiTG9uZG9uIC8gU291dGhhbXB0b25cIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCB1bSA5OjMwXCIsXCJBbGxlIGFuIEJvcmQgdW0gMjA6MzBcIixcIldlaXRlcmZhaHJ0IG5hY2ggUGFyaXMgLyBMZUhhdnJlIHVtIDIxOjMwXCJdXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctc291dGhhbXB0b25AMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDRcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIlBhcmlzIC8gTGVIYXZyZVwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IHVtIDc6MDBcIixcIkFsbGUgYW4gQm9yZCB1bSAxODowMFwiLFwiV2VpdGVyZmFocnQgbmFjaCBaZWVicsO8Z2dlIHVtIDE5OjAwXCJdXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctbGVoYXZyZS0xQDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyA1XCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJCcsO8c3NlbCAvIFplZWJyw7xnZ2VcIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCB1bSAxMDowMFwiLFwiQWxsZSBhbiBCb3JkIHVtIDE4OjAwXCIsXCJXZWl0ZXJmYWhydCBuYWNoIFJvdHRlcmRhbSB1bSAxOTowMFwiXVxuXG5cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1icnVnZ2UtMkAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgNlwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiUm90dGVyZGFtXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgdW0gODowMFwiLFwiQWxsZSBhbiBCb3JkIG1vcmdlbiB1bSA1OjAwXCIsXCJXZWl0ZXJmYWhydCBuYWNoIEhhbWJ1cmcgdW0gNjowMFwiXVxuXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctcm90dGVyZGFtLTJAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDdcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkF1ZiBTZWVcIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCBpbiBIYW1idXJnIE1vcmdlbiB1bSA2OjAwXCJdXG5cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1zZWFkYXlAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDhcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkhhbWJ1cmdcIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCBpbiBIYW1idXJnIHVtIDY6MDBcIixcIkFsbGUgdm9uIEJvcmQgdW0gODowMFwiXVxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLWhhbWJ1cmdAMngucG5nXCJcbiAgICAgfSxcbl1cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIFRoaXMgaXMgYSB1c2VycyBmaWxlXG5leHBvcnRzLnVzZXJzID0gW1xuICAgICB7XG4gICAgICB1c2VyTmFtZTpcIkpvaG5ueTEzMzJcIlxuICAgICAgdXNlckhhbmRsZTogXCJhbGwgYXJvdW5kIGdvb2QgZ3V5XCJcbiAgICAgIGlzQXZhaWxhYmxlOiB0cnVlXG4gICAgICBpc09ubGluZTogdHJ1ZVxuICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwMS5wbmdcIlxuICAgICAgaXNDcmV3OiBmYWxzZVxuICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG4gICAgIH0sXG4gICAgIHtcbiAgICAgICB1c2VyTmFtZTpcIlBhdHR5OTkzXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIkN1c3RvbWVyIFNlcnZpY2UgQWdlbnRcIlxuICAgICAgIGlzQXZhaWxhYmxlOiBmYWxzZVxuICAgICAgIGlzT25saW5lOiBmYWxzZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDIucG5nXCJcbiAgICAgICBpc0NyZXc6IHRydWVcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJBYXJvbl9nVGhhdHNNZVwiXG4gICAgICB1c2VySGFuZGxlOiBcIlNvbWUgdGFnbGluZVwiXG4gICAgICBpc0F2YWlsYWJsZTogdHJ1ZVxuICAgICAgaXNPbmxpbmU6IHRydWVcbiAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDMucG5nXCJcbiAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICAgdXNlck5hbWU6XCJEdWRlT25UaGVGbHlcIlxuICAgICAgIHVzZXJIYW5kbGU6IFwiXCJcbiAgICAgICBpc0F2YWlsYWJsZTogZmFsc2VcbiAgICAgICBpc09ubGluZTogdHJ1ZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDQucG5nXCJcbiAgICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG5cbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJGbHlPblRoZUR1ZGVcIlxuICAgICAgdXNlckhhbmRsZTogXCJcIlxuICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzA1LnBuZ1wiXG4gICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgIHVzZXJOYW1lOlwiV0hZTUUyMjMzXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIlwiXG4gICAgICAgaXNBdmFpbGFibGU6IGZhbHNlXG4gICAgICAgaXNPbmxpbmU6IGZhbHNlXG4gICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwNi5wbmdcIlxuICAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJKdXN0UmFwaGFlbFwiXG4gICAgICB1c2VySGFuZGxlOiBcImFsbCBhcm91bmQgZ29vZCBndXlcIlxuICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzA3LnBuZ1wiXG4gICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgIHVzZXJOYW1lOlwiSm9uaWVsRnJvbVRoZUJsb2NrXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIkN1c3RvbWVyIFNlcnZpY2UgQWdlbnRcIlxuICAgICAgIGlzQXZhaWxhYmxlOiBmYWxzZVxuICAgICAgIGlzT25saW5lOiBmYWxzZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDgucG5nXCJcbiAgICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG4gICAgIH0sXG5dXG4iXX0=
