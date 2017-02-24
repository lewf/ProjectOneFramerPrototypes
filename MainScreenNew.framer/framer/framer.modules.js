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


},{}],"itineraryView":[function(require,module,exports){
var TextLayer, avatarSize, currentMaxY, gradientLayer, gutter, i, item, itineraryData, j, k, len, len1, ref, ref1, time, totalHeight;

itineraryData = require("itinerary");

TextLayer = require('TextLayer').TextLayer;

gutter = 40;

avatarSize = 72;

exports.itineraryView = new Layer({
  height: Screen.height,
  width: Screen.width,
  name: "Itinerary",
  backgroundColor: "purple"
});

exports.itineraryPager = new PageComponent({
  size: Screen.size,
  backgroundColor: "#EEEEEE",
  name: "itineraryPager",
  scrollVertical: false,
  parent: this.itineraryView
});

ref = itineraryData.itinerary;
for (j = 0, len = ref.length; j < len; j++) {
  item = ref[j];
  exports.itinView = new Layer({
    width: Screen.width,
    height: Screen.height,
    image: item.image,
    name: "itinPage_" + item.day
  });
  gradientLayer = new Layer({
    size: this.itineraryView.size,
    parent: this.itinView,
    name: "tint"
  });
  gradientLayer.style.background = "-webkit-linear-gradient(top, rgba(0,0,0,.2) 0%,rgba(0,0,0,.35) 85%,rgba(0,0,0,0.65) 100%)";
  exports.destinationArticle = new Layer({
    size: {
      width: Screen.width,
      height: 160
    },
    y: Align.bottom,
    name: "articleGroup",
    backgroundColor: "transparent",
    parent: this.itinView
  });
  exports.destArticleAuthor = new Layer({
    height: avatarSize,
    width: avatarSize,
    borderRadius: avatarSize,
    name: "articleAuthor",
    parent: this.destinationArticle,
    y: Align.center,
    x: Align.left(gutter)
  });
  exports.disclosureIndicator = new Layer({
    image: "images/icn-more@2x.png",
    backgroundColor: "transparent",
    height: 40,
    width: 26,
    name: ">",
    parent: this.destinationArticle,
    color: "white",
    x: Align.right(-1 * gutter),
    y: Align.center
  });
  exports.destArticleSep = new Layer({
    width: 680,
    height: 4,
    x: Align.left(gutter),
    name: "-----",
    image: "images/sep-dot.svg",
    parent: this.destinationArticle
  });
  exports.destinationArticleHeading = new TextLayer({
    text: "Destination article header",
    fontSize: 28,
    autoSize: true,
    fontFamily: "Frutiger LT Pro",
    color: "#bcbab6",
    name: "destArticleHeader",
    textTransform: "uppercase",
    parent: this.destinationArticle,
    x: Align.left(this.destArticleAuthor.maxX + 20),
    y: this.destArticleAuthor.y + 4
  });
  exports.destArticleAuthorByline = new TextLayer({
    text: "Destination Article Author",
    fontSize: 24,
    autoSize: true,
    name: "Byline",
    fontFamily: "Frutiger LT Pro",
    color: "#7c7c7c",
    textTransform: "capitalize",
    parent: this.destinationArticle,
    x: Align.left(this.destArticleAuthor.maxX + 20),
    y: this.destinationArticleHeading.maxY
  });
  exports.timesGroup = new Layer({
    parent: this.itinView,
    x: Align.left,
    name: "itineraryTimesGroup",
    width: Screen.width,
    backgroundColor: "transparent"
  });
  currentMaxY = 0;
  totalHeight = 0;
  ref1 = item.travelData;
  for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
    time = ref1[i];
    exports.entryGroup = new Layer({
      parent: this.timesGroup,
      x: Align.left(40),
      name: "timeEntryGroup",
      width: Screen.width - 240,
      backgroundColor: "transparent"
    });
    exports.timeEntryBullet = new Layer({
      image: "images/gr-arrow-callout@2x.png",
      x: 0,
      name: "--->",
      width: 52,
      height: 16,
      parent: this.entryGroup,
      backgroundColor: "transparent"
    });
    exports.timeEntryText = new TextLayer({
      text: time,
      name: time,
      x: this.timeEntryBullet.maxX + 8,
      width: Screen.width - 280,
      autoSizeHeight: true,
      fontSize: 32,
      fontWeight: 200,
      fontFamily: "Frutiger LT Pro",
      color: "white",
      parent: this.entryGroup
    });
    this.entryGroup.height = this.timeEntryText.height;
    this.entryGroup.y = currentMaxY;
    currentMaxY = this.entryGroup.maxY + 8;
    totalHeight = currentMaxY;
    this.timeEntryBullet.y = this.timeEntryText.y + 8;
    this.timesGroup.height = totalHeight;
    this.timesGroup.maxY = this.destinationArticle.y - 20;
  }
  exports.destinationTitle = new TextLayer({
    text: item.destinationName,
    name: item.destinationName,
    parent: this.itinView,
    width: Screen.width - 100,
    x: Align.left(30),
    autoSizeHeight: true,
    fontSize: 92,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: -3,
    textTransform: "uppercase",
    fontFamily: "Frutiger LT Pro",
    color: "white"
  });
  this.destinationTitle.maxY = this.timesGroup.y;
  exports.dayTitle = new TextLayer({
    text: item.day,
    parent: this.itinView,
    width: Screen.width - 100,
    x: Align.left(30),
    autoSizeHeight: true,
    fontSize: 36,
    lineHeight: 1,
    fontWeight: 300,
    fontFamily: "Frutiger LT Pro",
    color: "white"
  });
  this.dayTitle.maxY = this.destinationTitle.y + -16;
  this.itineraryPager.addPage(this.itinView, "right");
}

exports.mainActions = new Layer({
  width: 100,
  height: 700,
  y: 55,
  x: Align.right(-1 * gutter),
  parent: this.itineraryView,
  backgroundColor: "transparent",
  name: "mainActions"
});

this.mainActions.states.add({
  orange: {
    backgroundColor: "orange"
  }
});

exports.btn_profile = new Layer({
  parent: this.mainActions,
  backgroundColor: "transparent",
  image: "images/icn-profile-copy@2x.png",
  width: this.mainActions.width,
  height: this.mainActions.width,
  name: "btn_profile"
});

exports.btn_chat = new Layer({
  parent: this.mainActions,
  backgroundColor: "transparent",
  image: "images/icn-chat.svg",
  width: this.mainActions.width,
  height: this.mainActions.width,
  y: this.btn_profile.maxY + 28,
  name: "btn_chat"
});

exports.btn_restaurant = new Layer({
  parent: this.mainActions,
  backgroundColor: "transparent",
  image: "images/icn-restaurant-copy@2x.png",
  width: this.mainActions.width,
  height: this.mainActions.width,
  y: this.btn_chat.maxY + 28,
  name: "btn_restaurant"
});

exports.btn_reservations = new Layer({
  parent: this.mainActions,
  backgroundColor: "transparent",
  image: "images/icn-reservations-copy@2x.png",
  width: this.mainActions.width,
  height: this.mainActions.width,
  y: this.btn_restaurant.maxY + 28,
  name: "btn_reservations"
});


},{"TextLayer":"TextLayer","itinerary":"itinerary"}],"itinerary":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvdXNlcnMuY29mZmVlIiwiLi4vbW9kdWxlcy9pdGluZXJhcnkuY29mZmVlIiwiLi4vbW9kdWxlcy9pdGluZXJhcnlWaWV3LmNvZmZlZSIsIi4uL21vZHVsZXMvZmlyZWJhc2UuY29mZmVlIiwiLi4vbW9kdWxlcy9maW5kTW9kdWxlLmNvZmZlZSIsIi4uL21vZHVsZXMvVmlld0NvbnRyb2xsZXIuY29mZmVlIiwiLi4vbW9kdWxlcy9UZXh0TGF5ZXIuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIFRoaXMgaXMgYSB1c2VycyBmaWxlXG5leHBvcnRzLnVzZXJzID0gW1xuICAgICB7XG4gICAgICB1c2VyTmFtZTpcIkpvaG5ueTEzMzJcIlxuICAgICAgdXNlckhhbmRsZTogXCJhbGwgYXJvdW5kIGdvb2QgZ3V5XCJcbiAgICAgIGlzQXZhaWxhYmxlOiB0cnVlXG4gICAgICBpc09ubGluZTogdHJ1ZVxuICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwMS5wbmdcIlxuICAgICAgaXNDcmV3OiBmYWxzZVxuICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG4gICAgIH0sXG4gICAgIHtcbiAgICAgICB1c2VyTmFtZTpcIlBhdHR5OTkzXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIkN1c3RvbWVyIFNlcnZpY2UgQWdlbnRcIlxuICAgICAgIGlzQXZhaWxhYmxlOiBmYWxzZVxuICAgICAgIGlzT25saW5lOiBmYWxzZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDIucG5nXCJcbiAgICAgICBpc0NyZXc6IHRydWVcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJBYXJvbl9nVGhhdHNNZVwiXG4gICAgICB1c2VySGFuZGxlOiBcIlNvbWUgdGFnbGluZVwiXG4gICAgICBpc0F2YWlsYWJsZTogdHJ1ZVxuICAgICAgaXNPbmxpbmU6IHRydWVcbiAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDMucG5nXCJcbiAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICAgdXNlck5hbWU6XCJEdWRlT25UaGVGbHlcIlxuICAgICAgIHVzZXJIYW5kbGU6IFwiXCJcbiAgICAgICBpc0F2YWlsYWJsZTogZmFsc2VcbiAgICAgICBpc09ubGluZTogdHJ1ZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDQucG5nXCJcbiAgICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG5cbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJGbHlPblRoZUR1ZGVcIlxuICAgICAgdXNlckhhbmRsZTogXCJcIlxuICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzA1LnBuZ1wiXG4gICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgIHVzZXJOYW1lOlwiV0hZTUUyMjMzXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIlwiXG4gICAgICAgaXNBdmFpbGFibGU6IGZhbHNlXG4gICAgICAgaXNPbmxpbmU6IGZhbHNlXG4gICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwNi5wbmdcIlxuICAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgdXNlck5hbWU6XCJKdXN0UmFwaGFlbFwiXG4gICAgICB1c2VySGFuZGxlOiBcImFsbCBhcm91bmQgZ29vZCBndXlcIlxuICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzA3LnBuZ1wiXG4gICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgIHVzZXJOYW1lOlwiSm9uaWVsRnJvbVRoZUJsb2NrXCJcbiAgICAgICB1c2VySGFuZGxlOiBcIkN1c3RvbWVyIFNlcnZpY2UgQWdlbnRcIlxuICAgICAgIGlzQXZhaWxhYmxlOiBmYWxzZVxuICAgICAgIGlzT25saW5lOiBmYWxzZVxuICAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDgucG5nXCJcbiAgICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG4gICAgIH0sXG5dXG4iLCJleHBvcnRzLml0aW5lcmFyeSA9IFtcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDFcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkhhbWJ1cmdcIlxuICAgICAgdHJhdmVsRGF0YTpbXCJBbGxlIGFuIEJvcmQgdW0gMTc6MDBcIixcIldlaXRlcmZhaHJ0IG5hY2ggU291dGhhbXB0b24gdW0gMTg6MDBcIl1cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1oYW1idXJnQDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyAyXCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJBdWYgU2VlXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgaW4gU291dGhhbXB0b24gTW9yZ2VuIHVtIDk6MzBcIl1cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1zZWFkYXlAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDNcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkxvbmRvbiAvIFNvdXRoYW1wdG9uXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgdW0gOTozMFwiLFwiQWxsZSBhbiBCb3JkIHVtIDIwOjMwXCIsXCJXZWl0ZXJmYWhydCBuYWNoIFBhcmlzIC8gTGVIYXZyZSB1bSAyMTozMFwiXVxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLXNvdXRoYW1wdG9uQDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyA0XCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJQYXJpcyAvIExlSGF2cmVcIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCB1bSA3OjAwXCIsXCJBbGxlIGFuIEJvcmQgdW0gMTg6MDBcIixcIldlaXRlcmZhaHJ0IG5hY2ggWmVlYnLDvGdnZSB1bSAxOTowMFwiXVxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLWxlaGF2cmUtMUAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgNVwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiQnLDvHNzZWwgLyBaZWVicsO8Z2dlXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgdW0gMTA6MDBcIixcIkFsbGUgYW4gQm9yZCB1bSAxODowMFwiLFwiV2VpdGVyZmFocnQgbmFjaCBSb3R0ZXJkYW0gdW0gMTk6MDBcIl1cblxuXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctYnJ1Z2dlLTJAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDZcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIlJvdHRlcmRhbVwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IHVtIDg6MDBcIixcIkFsbGUgYW4gQm9yZCBtb3JnZW4gdW0gNTowMFwiLFwiV2VpdGVyZmFocnQgbmFjaCBIYW1idXJnIHVtIDY6MDBcIl1cblxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLXJvdHRlcmRhbS0yQDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyA3XCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJBdWYgU2VlXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgaW4gSGFtYnVyZyBNb3JnZW4gdW0gNjowMFwiXVxuXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctc2VhZGF5QDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyA4XCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJIYW1idXJnXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgaW4gSGFtYnVyZyB1bSA2OjAwXCIsXCJBbGxlIHZvbiBCb3JkIHVtIDg6MDBcIl1cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1oYW1idXJnQDJ4LnBuZ1wiXG4gICAgIH0sXG5dXG4iLCIjaW1wb3J0c1xuaXRpbmVyYXJ5RGF0YSA9IHJlcXVpcmUgXCJpdGluZXJhcnlcIiAjIyBtb2R1bGUgd2l0aCBvYmplY3QgY29udGFpbmluZyBpdGluZXJhcnlJbmZvXG57VGV4dExheWVyfSA9IHJlcXVpcmUgJ1RleHRMYXllcidcblxuIyBnbG9iYWwgdmFyaWFibGVzIChAMngpXG5ndXR0ZXIgPSA0MFxuYXZhdGFyU2l6ZSA9IDcyXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyMjIyMjIyMjICAgICAgICBJVElORVJBUlkgVklFVyAgICAgICAgICAgICAgICAgICAgICAgICMjIyMjIyMjIyMjI1xuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jYmFzZSB2aWV3XG5leHBvcnRzLml0aW5lcmFyeVZpZXcgPSBuZXcgTGF5ZXJcblx0aGVpZ2h0OlNjcmVlbi5oZWlnaHRcblx0d2lkdGg6U2NyZWVuLndpZHRoXG5cdG5hbWU6XCJJdGluZXJhcnlcIlxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwicHVycGxlXCJcblxuIyBwYWdlclxuZXhwb3J0cy5pdGluZXJhcnlQYWdlciA9IG5ldyBQYWdlQ29tcG9uZW50XG5cdHNpemU6U2NyZWVuLnNpemVcblx0YmFja2dyb3VuZENvbG9yOlwiI0VFRUVFRVwiXG5cdG5hbWU6XCJpdGluZXJhcnlQYWdlclwiXG5cdHNjcm9sbFZlcnRpY2FsOiBmYWxzZVxuXHRwYXJlbnQ6IEBpdGluZXJhcnlWaWV3XG5cblxuI2J1aWxkIGl0aW5lcmFyeSBwYWdlc1xuXG5mb3IgaXRlbSBpbiBpdGluZXJhcnlEYXRhLml0aW5lcmFyeVxuXG5cblx0IyBhZGQgcGFnZSB3aXRoIGltYWdlIGZvciBlYWNoIG5vZGUgaW4gaXRpbmVyYXJ5IGRhdGFcblx0ZXhwb3J0cy5pdGluVmlldyA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6U2NyZWVuLndpZHRoXG5cdFx0XHRoZWlnaHQ6U2NyZWVuLmhlaWdodFxuXHRcdFx0aW1hZ2U6aXRlbS5pbWFnZVxuXHRcdFx0bmFtZTogXCJpdGluUGFnZV9cIiArIGl0ZW0uZGF5XG5cblx0XHRcdCMgZGltIGltYWdlIHdpdGggZ3JhZGllbnRcblx0Z3JhZGllbnRMYXllciA9IG5ldyBMYXllclxuXHRcdFx0c2l6ZTpAaXRpbmVyYXJ5Vmlldy5zaXplXG5cdFx0XHRwYXJlbnQ6QGl0aW5WaWV3XG5cdFx0XHRuYW1lOlwidGludFwiXG5cdGdyYWRpZW50TGF5ZXIuc3R5bGUuYmFja2dyb3VuZCA9IFwiLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCByZ2JhKDAsMCwwLC4yKSAwJSxyZ2JhKDAsMCwwLC4zNSkgODUlLHJnYmEoMCwwLDAsMC42NSkgMTAwJSlcIlxuXG5cbiMgYWRkIGNvbnRlbnRzIC0gYnVpbGQgZnJvbSBib3R0b20gdG8gdG9wXG5cbiNkZXN0aW5hdGlvbiBhcnRpY2xlLCB0aW1lcywgZGVzdGlvbmF0aW9uIG5hbWUsIGRheSBuYW1lXG5cblx0ZXhwb3J0cy5kZXN0aW5hdGlvbkFydGljbGUgPSBuZXcgTGF5ZXJcblx0XHRzaXplOnt3aWR0aDpTY3JlZW4ud2lkdGgsIGhlaWdodDoxNjB9XG5cdFx0eTpBbGlnbi5ib3R0b21cblx0XHRuYW1lOlwiYXJ0aWNsZUdyb3VwXCJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdFx0cGFyZW50OkBpdGluVmlld1xuXG5cdGV4cG9ydHMuZGVzdEFydGljbGVBdXRob3IgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6YXZhdGFyU2l6ZVxuXHRcdHdpZHRoOmF2YXRhclNpemVcblx0XHRib3JkZXJSYWRpdXM6YXZhdGFyU2l6ZVxuXHRcdG5hbWU6XCJhcnRpY2xlQXV0aG9yXCJcblx0XHRwYXJlbnQ6QGRlc3RpbmF0aW9uQXJ0aWNsZVxuXHRcdHk6QWxpZ24uY2VudGVyXG5cdFx0eDpBbGlnbi5sZWZ0KGd1dHRlcilcblxuXHRleHBvcnRzLmRpc2Nsb3N1cmVJbmRpY2F0b3IgPSBuZXcgTGF5ZXJcblx0XHRpbWFnZTpcImltYWdlcy9pY24tbW9yZUAyeC5wbmdcIlxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0aGVpZ2h0OjQwXG5cdFx0d2lkdGg6MjZcblx0XHRuYW1lOlwiPlwiXG5cdFx0cGFyZW50OkBkZXN0aW5hdGlvbkFydGljbGVcblx0XHRjb2xvcjpcIndoaXRlXCJcblx0XHR4OkFsaWduLnJpZ2h0KC0xKmd1dHRlcilcblx0XHR5OkFsaWduLmNlbnRlclxuXG5cdGV4cG9ydHMuZGVzdEFydGljbGVTZXAgID0gbmV3IExheWVyXG5cdFx0d2lkdGg6NjgwXG5cdFx0aGVpZ2h0OjRcblx0XHR4OkFsaWduLmxlZnQoZ3V0dGVyKVxuXHRcdG5hbWU6XCItLS0tLVwiXG5cdFx0aW1hZ2U6XCJpbWFnZXMvc2VwLWRvdC5zdmdcIlxuXHRcdHBhcmVudDpAZGVzdGluYXRpb25BcnRpY2xlXG5cblx0ZXhwb3J0cy5kZXN0aW5hdGlvbkFydGljbGVIZWFkaW5nID0gbmV3IFRleHRMYXllclxuXHRcdHRleHQ6XCJEZXN0aW5hdGlvbiBhcnRpY2xlIGhlYWRlclwiXG5cdFx0Zm9udFNpemU6Mjhcblx0XHRhdXRvU2l6ZTp0cnVlXG5cdFx0Zm9udEZhbWlseTpcIkZydXRpZ2VyIExUIFByb1wiXG5cdFx0Y29sb3I6XCIjYmNiYWI2XCJcblx0XHRuYW1lOlwiZGVzdEFydGljbGVIZWFkZXJcIlxuXHRcdHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCJcblx0XHRwYXJlbnQ6QGRlc3RpbmF0aW9uQXJ0aWNsZVxuXHRcdHg6QWxpZ24ubGVmdChAZGVzdEFydGljbGVBdXRob3IubWF4WCArIDIwKVxuXHRcdHk6QGRlc3RBcnRpY2xlQXV0aG9yLnkgKyA0XG5cblx0ZXhwb3J0cy5kZXN0QXJ0aWNsZUF1dGhvckJ5bGluZSA9IG5ldyBUZXh0TGF5ZXJcblx0XHR0ZXh0OlwiRGVzdGluYXRpb24gQXJ0aWNsZSBBdXRob3JcIlxuXHRcdGZvbnRTaXplOjI0XG5cdFx0YXV0b1NpemU6dHJ1ZVxuXHRcdG5hbWU6XCJCeWxpbmVcIlxuXHRcdGZvbnRGYW1pbHk6XCJGcnV0aWdlciBMVCBQcm9cIlxuXHRcdGNvbG9yOlwiIzdjN2M3Y1wiXG5cdFx0dGV4dFRyYW5zZm9ybTogXCJjYXBpdGFsaXplXCJcblx0XHRwYXJlbnQ6QGRlc3RpbmF0aW9uQXJ0aWNsZVxuXHRcdHg6QWxpZ24ubGVmdChAZGVzdEFydGljbGVBdXRob3IubWF4WCArIDIwKVxuXHRcdHk6QGRlc3RpbmF0aW9uQXJ0aWNsZUhlYWRpbmcubWF4WVxuXG4jIFx0I2FkZCB2aWV3cyBmb3IgZWFjaCB0aW1lIGluIGRhdGEsIGFkZCB0byBhbiBhcnJheVxuXHRleHBvcnRzLnRpbWVzR3JvdXAgPSBuZXcgTGF5ZXJcblx0XHRwYXJlbnQ6QGl0aW5WaWV3XG5cdFx0eDpBbGlnbi5sZWZ0XG5cdFx0bmFtZTpcIml0aW5lcmFyeVRpbWVzR3JvdXBcIlxuXHRcdHdpZHRoOlNjcmVlbi53aWR0aFxuXHRcdGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblxuIyBpdGVyYXRlIHRocm91Z2ggdGltZXMgYXJyYXksIGNyZWF0ZSBidWxsZXRzIGZvciBlYWNoIHRpbWUgKHRyYXZlbCBkYXRhKVxuXHRjdXJyZW50TWF4WSA9IDBcblx0dG90YWxIZWlnaHQgPSAwXG5cblx0Zm9yIHRpbWUsIGkgaW4gaXRlbS50cmF2ZWxEYXRhXG5cblx0XHRleHBvcnRzLmVudHJ5R3JvdXAgPSBuZXcgTGF5ZXJcblx0XHRcdHBhcmVudDpAdGltZXNHcm91cFxuXHRcdFx0eDpBbGlnbi5sZWZ0KDQwKVxuXHRcdFx0bmFtZTpcInRpbWVFbnRyeUdyb3VwXCJcblx0XHRcdHdpZHRoOlNjcmVlbi53aWR0aCAtIDI0MFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIlxuXG5cdFx0ZXhwb3J0cy50aW1lRW50cnlCdWxsZXQgPSBuZXcgTGF5ZXJcblx0XHRcdGltYWdlOlwiaW1hZ2VzL2dyLWFycm93LWNhbGxvdXRAMngucG5nXCJcblx0XHRcdHg6MFxuXHRcdFx0bmFtZTpcIi0tLT5cIlxuXHRcdFx0d2lkdGg6NTJcblx0XHRcdGhlaWdodDoxNlxuXHRcdFx0cGFyZW50OkBlbnRyeUdyb3VwXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cblx0XHRleHBvcnRzLnRpbWVFbnRyeVRleHQgPSBuZXcgVGV4dExheWVyXG5cdFx0XHRcdHRleHQ6dGltZVxuXHRcdFx0XHRuYW1lOnRpbWVcblx0XHRcdFx0eDpAdGltZUVudHJ5QnVsbGV0Lm1heFggKyA4XG5cdFx0XHRcdHdpZHRoOlNjcmVlbi53aWR0aCAtIDI4MFxuXHRcdFx0XHRhdXRvU2l6ZUhlaWdodDp0cnVlXG5cdFx0XHRcdGZvbnRTaXplOjMyXG5cdFx0XHRcdGZvbnRXZWlnaHQ6MjAwXG5cdFx0XHRcdGZvbnRGYW1pbHk6XCJGcnV0aWdlciBMVCBQcm9cIlxuXHRcdFx0XHRjb2xvcjpcIndoaXRlXCJcblx0XHRcdFx0cGFyZW50OkBlbnRyeUdyb3VwXG5cblx0XHRAZW50cnlHcm91cC5oZWlnaHQgPSBAdGltZUVudHJ5VGV4dC5oZWlnaHRcblx0XHRAZW50cnlHcm91cC55ID0gY3VycmVudE1heFlcblx0XHRjdXJyZW50TWF4WSA9IEBlbnRyeUdyb3VwLm1heFkgKyA4XG5cdFx0dG90YWxIZWlnaHQgPSBjdXJyZW50TWF4WVxuXHRcdEB0aW1lRW50cnlCdWxsZXQueSA9IEB0aW1lRW50cnlUZXh0LnkgKyA4XG5cdFx0QHRpbWVzR3JvdXAuaGVpZ2h0ID0gdG90YWxIZWlnaHRcblx0XHRAdGltZXNHcm91cC5tYXhZID0gQGRlc3RpbmF0aW9uQXJ0aWNsZS55IC0gMjBcblxuXHRleHBvcnRzLmRlc3RpbmF0aW9uVGl0bGUgPSBuZXcgVGV4dExheWVyXG5cdFx0dGV4dDogaXRlbS5kZXN0aW5hdGlvbk5hbWVcblx0XHRuYW1lOml0ZW0uZGVzdGluYXRpb25OYW1lXG5cdFx0cGFyZW50OkBpdGluVmlld1xuXHRcdHdpZHRoOlNjcmVlbi53aWR0aCAtIDEwMFxuXHRcdHg6QWxpZ24ubGVmdCgzMClcblx0XHRhdXRvU2l6ZUhlaWdodDp0cnVlXG5cdFx0Zm9udFNpemU6OTJcblx0XHRsaW5lSGVpZ2h0OjFcblx0XHRmb250V2VpZ2h0OjcwMFxuXHRcdGxldHRlclNwYWNpbmc6LTNcblx0XHR0ZXh0VHJhbnNmb3JtOlwidXBwZXJjYXNlXCJcblx0XHRmb250RmFtaWx5OlwiRnJ1dGlnZXIgTFQgUHJvXCJcblx0XHRjb2xvcjpcIndoaXRlXCJcblx0QGRlc3RpbmF0aW9uVGl0bGUubWF4WSA9IEB0aW1lc0dyb3VwLnlcblxuXHRleHBvcnRzLmRheVRpdGxlID0gbmV3IFRleHRMYXllclxuXHRcdHRleHQ6IGl0ZW0uZGF5XG5cdFx0cGFyZW50OkBpdGluVmlld1xuXHRcdHdpZHRoOlNjcmVlbi53aWR0aCAtIDEwMFxuXHRcdHg6QWxpZ24ubGVmdCgzMClcblx0XHRhdXRvU2l6ZUhlaWdodDp0cnVlXG5cdFx0Zm9udFNpemU6MzZcblx0XHRsaW5lSGVpZ2h0OjFcblx0XHRmb250V2VpZ2h0OjMwMFxuXHRcdGZvbnRGYW1pbHk6XCJGcnV0aWdlciBMVCBQcm9cIlxuXHRcdGNvbG9yOlwid2hpdGVcIlxuXHRAZGF5VGl0bGUubWF4WSA9IEBkZXN0aW5hdGlvblRpdGxlLnkgKyAtMTZcblx0QGl0aW5lcmFyeVBhZ2VyLmFkZFBhZ2UoQGl0aW5WaWV3LCBcInJpZ2h0XCIpXG5cblx0IyBtYWluIGFjdGlvbnNcbmV4cG9ydHMubWFpbkFjdGlvbnMgPSBuZXcgTGF5ZXJcblx0d2lkdGg6MTAwXG5cdGhlaWdodDo3MDBcblx0eTo1NVxuXHR4OkFsaWduLnJpZ2h0KC0xKiBndXR0ZXIpXG5cdHBhcmVudDpAaXRpbmVyYXJ5Vmlld1xuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRuYW1lOlwibWFpbkFjdGlvbnNcIlxuXG5AbWFpbkFjdGlvbnMuc3RhdGVzLmFkZFxuXHRvcmFuZ2U6XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm9yYW5nZVwiXG5cbmV4cG9ydHMuYnRuX3Byb2ZpbGUgPSBuZXcgTGF5ZXJcblx0cGFyZW50OkBtYWluQWN0aW9uc1xuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRpbWFnZTpcImltYWdlcy9pY24tcHJvZmlsZS1jb3B5QDJ4LnBuZ1wiXG5cdHdpZHRoOkBtYWluQWN0aW9ucy53aWR0aFxuXHRoZWlnaHQ6IEBtYWluQWN0aW9ucy53aWR0aFxuXHRuYW1lOlwiYnRuX3Byb2ZpbGVcIlxuXG5cbmV4cG9ydHMuYnRuX2NoYXQgPSBuZXcgTGF5ZXJcblx0cGFyZW50OkBtYWluQWN0aW9uc1xuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRpbWFnZTpcImltYWdlcy9pY24tY2hhdC5zdmdcIlxuXHR3aWR0aDpAbWFpbkFjdGlvbnMud2lkdGhcblx0aGVpZ2h0OiBAbWFpbkFjdGlvbnMud2lkdGhcblx0eTogQGJ0bl9wcm9maWxlLm1heFkgKyAyOFxuXHRuYW1lOlwiYnRuX2NoYXRcIlxuXG5leHBvcnRzLmJ0bl9yZXN0YXVyYW50ID0gbmV3IExheWVyXG5cdHBhcmVudDpAbWFpbkFjdGlvbnNcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aW1hZ2U6XCJpbWFnZXMvaWNuLXJlc3RhdXJhbnQtY29weUAyeC5wbmdcIlxuXHR3aWR0aDpAbWFpbkFjdGlvbnMud2lkdGhcblx0aGVpZ2h0OiBAbWFpbkFjdGlvbnMud2lkdGhcblx0eTogQGJ0bl9jaGF0Lm1heFkgKyAyOFxuXHRuYW1lOlwiYnRuX3Jlc3RhdXJhbnRcIlxuXG5leHBvcnRzLmJ0bl9yZXNlcnZhdGlvbnMgPSBuZXcgTGF5ZXJcblx0cGFyZW50OkBtYWluQWN0aW9uc1xuXHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRpbWFnZTpcImltYWdlcy9pY24tcmVzZXJ2YXRpb25zLWNvcHlAMngucG5nXCJcblx0d2lkdGg6QG1haW5BY3Rpb25zLndpZHRoXG5cdGhlaWdodDogQG1haW5BY3Rpb25zLndpZHRoXG5cdHk6IEBidG5fcmVzdGF1cmFudC5tYXhZICsgMjhcblx0bmFtZTpcImJ0bl9yZXNlcnZhdGlvbnNcIlxuXG4jIGJ0bl9wcm9maWxlLm9uIEV2ZW50cy5DbGljaywgLT5cbiMgXHRtYWluQWN0aW9ucy5zdGF0ZXMubmV4dCgpXG4iLCJcblxuXG4jICdGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcycgbW9kdWxlIHYxLjBcbiMgYnkgTWFyYyBLcmVubiwgTWF5IDMxc3QsIDIwMTYgfCBtYXJjLmtyZW5uQGdtYWlsLmNvbSB8IEBtYXJjX2tyZW5uXG5cbiMgRG9jdW1lbnRhdGlvbiBvZiB0aGlzIE1vZHVsZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmNrcmVubi9mcmFtZXItRmlyZWJhc2VcbiMgLS0tLS0tIDogLS0tLS0tLSBGaXJlYmFzZSBSRVNUIEFQSTogaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvcmVmZXJlbmNlL3Jlc3QvZGF0YWJhc2UvXG5cblxuIyBUb0RvOlxuIyBGaXggb25DaGFuZ2UgXCJjb25uZWN0aW9uXCIsIGB0aGlzwrQgY29udGV4dFxuXG5cblxuIyBGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIGV4cG9ydHMuRmlyZWJhc2UgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cblxuXG5cdGdldENPUlN1cmwgPSAoc2VydmVyLCBwYXRoLCBzZWNyZXQsIHByb2plY3QpIC0+XG5cblx0XHRzd2l0Y2ggVXRpbHMuaXNXZWJLaXQoKVxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gdXJsID0gXCJodHRwczovLyN7c2VydmVyfSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fSZucz0je3Byb2plY3R9JnNzZT10cnVlXCIgIyBXZWJraXQgWFNTIHdvcmthcm91bmRcblx0XHRcdGVsc2UgICAgICAgICAgIHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXHRcdHJldHVybiB1cmxcblxuXG5cdEAuZGVmaW5lIFwic3RhdHVzXCIsXG5cdFx0Z2V0OiAtPiBAX3N0YXR1cyAjIHJlYWRPbmx5XG5cblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAcHJvamVjdElEID0gQG9wdGlvbnMucHJvamVjdElEID89IG51bGxcblx0XHRAc2VjcmV0ICAgID0gQG9wdGlvbnMuc2VjcmV0ICAgID89IG51bGxcblx0XHRAc2VydmVyICAgID0gQG9wdGlvbnMuc2VydmVyICAgID89IHVuZGVmaW5lZCAjIHJlcXVpcmVkIGZvciBXZWJLaXQgWFNTIHdvcmthcm91bmRcblx0XHRAZGVidWcgICAgID0gQG9wdGlvbnMuZGVidWcgICAgID89IGZhbHNlXG5cdFx0QF9zdGF0dXMgICAgICAgICAgICAgICAgICAgICAgICA/PSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0c3VwZXJcblxuXG5cdFx0aWYgQHNlcnZlciBpcyB1bmRlZmluZWRcblx0XHRcdFV0aWxzLmRvbUxvYWRKU09OIFwiaHR0cHM6Ly8je0Bwcm9qZWN0SUR9LmZpcmViYXNlaW8uY29tLy5zZXR0aW5ncy9vd25lci5qc29uXCIsIChhLHNlcnZlcikgLT5cblx0XHRcdFx0cHJpbnQgbXNnID0gXCJBZGQgX19fX19fIHNlcnZlcjpcIiArICcgICBcIicgKyBzZXJ2ZXIgKyAnXCInICsgXCIgX19fX18gdG8geW91ciBpbnN0YW5jZSBvZiBGaXJlYmFzZS5cIlxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiAje21zZ31cIiBpZiBAZGVidWdcblxuXG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGluZyB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyAuLi4gXFxuIFVSTDogJyN7Z2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRCl9J1wiIGlmIEBkZWJ1Z1xuXHRcdEAub25DaGFuZ2UgXCJjb25uZWN0aW9uXCJcblxuXG5cdHJlcXVlc3QgPSAocHJvamVjdCwgc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBwYXJhbWV0ZXJzLCBkZWJ1ZykgLT5cblxuXHRcdHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXG5cdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLnNoYWxsb3cgICAgICAgICAgICB0aGVuIHVybCArPSBcIiZzaGFsbG93PXRydWVcIlxuXHRcdFx0aWYgcGFyYW1ldGVycy5mb3JtYXQgaXMgXCJleHBvcnRcIiB0aGVuIHVybCArPSBcIiZmb3JtYXQ9ZXhwb3J0XCJcblxuXHRcdFx0c3dpdGNoIHBhcmFtZXRlcnMucHJpbnRcblx0XHRcdFx0d2hlbiBcInByZXR0eVwiIHRoZW4gdXJsICs9IFwiJnByaW50PXByZXR0eVwiXG5cdFx0XHRcdHdoZW4gXCJzaWxlbnRcIiB0aGVuIHVybCArPSBcIiZwcmludD1zaWxlbnRcIlxuXG5cdFx0XHRpZiB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiXG5cdFx0XHRcdHVybCArPSBcIiZkb3dubG9hZD0je3BhcmFtZXRlcnMuZG93bmxvYWR9XCJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLFwiX3NlbGZcIilcblxuXG5cdFx0XHR1cmwgKz0gXCImb3JkZXJCeT1cIiArICdcIicgKyBwYXJhbWV0ZXJzLm9yZGVyQnkgKyAnXCInIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLm9yZGVyQnkgICAgICBpcyBcInN0cmluZ1wiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0ZpcnN0PSN7cGFyYW1ldGVycy5saW1pdFRvRmlyc3R9XCIgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvRmlyc3QgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9MYXN0PSN7cGFyYW1ldGVycy5saW1pdFRvTGFzdH1cIiAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0xhc3QgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZzdGFydEF0PSN7cGFyYW1ldGVycy5zdGFydEF0fVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLnN0YXJ0QXQgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZW5kQXQ9I3twYXJhbWV0ZXJzLmVuZEF0fVwiICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lbmRBdCAgICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVxdWFsVG89I3twYXJhbWV0ZXJzLmVxdWFsVG99XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZXF1YWxUbyAgICAgIGlzIFwibnVtYmVyXCJcblxuXG5cdFx0eGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3Rcblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBOZXcgJyN7bWV0aG9kfSctcmVxdWVzdCB3aXRoIGRhdGE6ICcje0pTT04uc3RyaW5naWZ5KGRhdGEpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ID0+XG5cblx0XHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRpZiBwYXJhbWV0ZXJzLnByaW50IGlzIFwic2lsZW50XCIgb3IgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIiB0aGVuIHJldHVybiAjIHVnaFxuXG5cdFx0XHRzd2l0Y2ggeGh0dHAucmVhZHlTdGF0ZVxuXHRcdFx0XHR3aGVuIDAgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IG5vdCBpbml0aWFsaXplZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMSB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFNlcnZlciBjb25uZWN0aW9uIGVzdGFibGlzaGVkIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAyIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCByZWNlaXZlZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDMgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBQcm9jZXNzaW5nIHJlcXVlc3QgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gNFxuXHRcdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBmaW5pc2hlZCwgcmVzcG9uc2U6ICcje0pTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXHRcdFx0aWYgeGh0dHAuc3RhdHVzIGlzIFwiNDA0XCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IEludmFsaWQgcmVxdWVzdCwgcGFnZSBub3QgZm91bmQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cblx0XHR4aHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuXHRcdHhodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0eGh0dHAuc2VuZChkYXRhID0gXCIje0pTT04uc3RyaW5naWZ5KGRhdGEpfVwiKVxuXG5cblxuXHQjIEF2YWlsYWJsZSBtZXRob2RzXG5cblx0Z2V0OiAgICAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiR0VUXCIsICAgIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cHV0OiAgICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUFVUXCIsICAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cG9zdDogICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUE9TVFwiLCAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cGF0Y2g6ICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUEFUQ0hcIiwgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0ZGVsZXRlOiAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiREVMRVRFXCIsIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1ZylcblxuXG5cblx0b25DaGFuZ2U6IChwYXRoLCBjYWxsYmFjaykgLT5cblxuXG5cdFx0aWYgcGF0aCBpcyBcImNvbm5lY3Rpb25cIlxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwib3BlblwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBlc3RhYmxpc2hlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcImVycm9yXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImRpc2Nvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBjbG9zZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblxuXG5cdFx0ZWxzZVxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIHBhdGgsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTGlzdGVuaW5nIHRvIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwdXRcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicHV0XCIsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aCwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQVVQnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwYXRjaFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwYXRjaFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIikpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUEFUQ0gnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcbiIsIl9nZXRIaWVyYXJjaHkgPSAobGF5ZXIpIC0+XG4gIHN0cmluZyA9ICcnXG4gIGZvciBhIGluIGxheWVyLmFuY2VzdG9ycygpXG4gICAgc3RyaW5nID0gYS5uYW1lKyc+JytzdHJpbmdcbiAgcmV0dXJuIHN0cmluZyA9IHN0cmluZytsYXllci5uYW1lXG5cbl9tYXRjaCA9IChoaWVyYXJjaHksIHN0cmluZykgLT5cbiAgIyBwcmVwYXJlIHJlZ2V4IHRva2Vuc1xuICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxzKj5cXHMqL2csJz4nKSAjIGNsZWFuIHVwIHNwYWNlcyBhcm91bmQgYXJyb3dzXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnKicpLmpvaW4oJ1tePl0qJykgIyBhc3RlcmlrcyBhcyBsYXllciBuYW1lIHdpbGRjYXJkXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnICcpLmpvaW4oJyg/Oi4qKT4nKSAjIHNwYWNlIGFzIHN0cnVjdHVyZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJywnKS5qb2luKCckfCcpICMgYWxsb3cgbXVsdGlwbGUgc2VhcmNoZXMgdXNpbmcgY29tbWFcbiAgcmVnZXhTdHJpbmcgPSBcIihefD4pXCIrc3RyaW5nK1wiJFwiICMgYWx3YXlzIGJvdHRvbSBsYXllciwgbWF5YmUgcGFydCBvZiBoaWVyYXJjaHlcblxuICByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKSBcbiAgcmV0dXJuIGhpZXJhcmNoeS5tYXRjaChyZWdFeHApXG5cbl9maW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+XG4gIGxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXG4gIGlmIHNlbGVjdG9yP1xuICAgIHN0cmluZ05lZWRzUmVnZXggPSBfLmZpbmQgWycqJywnICcsJz4nLCcsJ10sIChjKSAtPiBfLmNvbnRhaW5zIHNlbGVjdG9yLGNcbiAgICB1bmxlc3Mgc3RyaW5nTmVlZHNSZWdleCBvciBmcm9tTGF5ZXJcbiAgICAgIGxheWVycyA9IF8uZmlsdGVyIGxheWVycywgKGxheWVyKSAtPiBcbiAgICAgICAgaWYgbGF5ZXIubmFtZSBpcyBzZWxlY3RvciB0aGVuIHRydWVcbiAgICBlbHNlXG4gICAgICBsYXllcnMgPSBfLmZpbHRlciBsYXllcnMsIChsYXllcikgLT5cbiAgICAgICAgICBoaWVyYXJjaHkgPSBfZ2V0SGllcmFyY2h5KGxheWVyKVxuICAgICAgICAgIGlmIGZyb21MYXllcj9cbiAgICAgICAgICAgIF9tYXRjaChoaWVyYXJjaHksIGZyb21MYXllci5uYW1lKycgJytzZWxlY3RvcilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBfbWF0Y2goaGllcmFyY2h5LCBzZWxlY3RvcilcbiAgZWxzZVxuICAgIGxheWVyc1xuXG5cbiMgR2xvYmFsXG5leHBvcnRzLkZpbmQgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cbmV4cG9ydHMuxpIgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cblxuZXhwb3J0cy5GaW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpXG5leHBvcnRzLsaSxpIgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVxuXG4jIE1ldGhvZHNcbkxheWVyOjpmaW5kICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClbMF1cbkxheWVyOjrGkiAgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApWzBdXG5cbkxheWVyOjpmaW5kQWxsICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClcbkxheWVyOjrGksaSICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKSIsImNsYXNzIG1vZHVsZS5leHBvcnRzIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5pbml0aWFsVmlld05hbWUgPz0gJ2luaXRpYWxWaWV3J1xuXHRcdG9wdGlvbnMuYmFja0J1dHRvbk5hbWUgPz0gJ2JhY2tCdXR0b24nXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKVwiLCB0aW1lOiAuN1xuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiYmxhY2tcIlxuXHRcdG9wdGlvbnMuc2Nyb2xsID89IGZhbHNlXG5cdFx0b3B0aW9ucy5hdXRvTGluayA/PSB0cnVlXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXG5cdFx0QG9uQ2hhbmdlIFwic3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSA9PlxuXHRcdFx0dmlldyA9IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGlmIHZpZXc/XG5cdFx0XHRcdCMgZGVmYXVsdCBiZWhhdmlvcnMgZm9yIHZpZXdzXG5cdFx0XHRcdHZpZXcuY2xpcCA9IHRydWVcblx0XHRcdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdFx0XHQjIGFkZCBzY3JvbGxjb21wb25lbnRcblx0XHRcdFx0aWYgQHNjcm9sbFxuXHRcdFx0XHRcdGNoaWxkcmVuID0gdmlldy5jaGlsZHJlblxuXHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudCA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRcdFx0XHRcdG5hbWU6IFwic2Nyb2xsQ29tcG9uZW50XCJcblx0XHRcdFx0XHRcdHdpZHRoOiBAd2lkdGhcblx0XHRcdFx0XHRcdGhlaWdodDogQGhlaWdodFxuXHRcdFx0XHRcdFx0cGFyZW50OiB2aWV3XG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50LmNvbnRlbnQuYmFja2dyb3VuZENvbG9yID0gXCJcIlxuXHRcdFx0XHRcdGlmIHZpZXcud2lkdGggPD0gQHdpZHRoXG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsSG9yaXpvbnRhbCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgdmlldy5oZWlnaHQgPD0gQGhlaWdodFxuXHRcdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50LnNjcm9sbFZlcnRpY2FsID0gZmFsc2Vcblx0XHRcdFx0XHRmb3IgYyBpbiBjaGlsZHJlblxuXHRcdFx0XHRcdFx0Yy5wYXJlbnQgPSBzY3JvbGxDb21wb25lbnQuY29udGVudFxuXHRcdFx0XHRcdHZpZXcuc2Nyb2xsQ29tcG9uZW50ID0gc2Nyb2xsQ29tcG9uZW50ICMgbWFrZSBpdCBhY2Nlc3NpYmxlIGFzIGEgcHJvcGVydHlcblx0XHRcdFx0XHQjIHJlc2V0IHNpemUgc2luY2UgY29udGVudCBtb3ZlZCB0byBzY3JvbGxDb21wb25lbnQuIHByZXZlbnRzIHNjcm9sbCBidWcgd2hlbiBkcmFnZ2luZyBvdXRzaWRlLlxuXHRcdFx0XHRcdHZpZXcuc2l6ZSA9IHt3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEBoZWlnaHR9XG5cblx0XHR0cmFuc2l0aW9ucyA9XG5cdFx0XHRzd2l0Y2hJbnN0YW50OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogMCwgeTogMH1cblx0XHRcdGZhZGVJbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7b3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge29wYWNpdHk6IDF9XG5cdFx0XHR6b29tSW46XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRcdFx0dG86IHtzY2FsZTogMSwgb3BhY2l0eTogMX1cblx0XHRcdHpvb21PdXQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHtzY2FsZTogMC44LCBvcGFjaXR5OiAwfVxuXHRcdFx0c2xpZGVJblVwOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt5OiBAaGVpZ2h0fVxuXHRcdFx0XHRcdHRvOiB7eTogMH1cblx0XHRcdHNsaWRlSW5SaWdodDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHNsaWRlSW5Eb3duOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHttYXhZOiAwfVxuXHRcdFx0XHRcdHRvOiB7eTogMH1cblx0XHRcdG1vdmVJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdG1vdmVJbkxlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFg6IDB9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkxlZnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFg6IDB9XG5cdFx0XHRcdFx0dG86IHttYXhYOiBAd2lkdGh9XG5cdFx0XHRwdXNoSW5SaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHB1c2hJbkxlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGgvNSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC1Ad2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaE91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiAtKEB3aWR0aC81KSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdFx0dG86IHt4OiAwLCBicmlnaHRuZXNzOiAxMDB9XG5cdFx0XHRwdXNoT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHNsaWRlT3V0VXA6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhZOiAwfVxuXHRcdFx0c2xpZGVPdXRSaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdHNsaWRlT3V0RG93bjpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3k6IEBoZWlnaHR9XG5cdFx0XHRzbGlkZU91dExlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXG5cdFx0IyBzaG9ydGN1dHNcblx0XHR0cmFuc2l0aW9ucy5zbGlkZUluID0gdHJhbnNpdGlvbnMuc2xpZGVJblJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMuc2xpZGVPdXQgPSB0cmFuc2l0aW9ucy5zbGlkZU91dFJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMucHVzaEluID0gdHJhbnNpdGlvbnMucHVzaEluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoT3V0ID0gdHJhbnNpdGlvbnMucHVzaE91dFJpZ2h0XG5cblx0XHQjIGV2ZW50c1xuXHRcdEV2ZW50cy5WaWV3V2lsbFN3aXRjaCA9IFwidmlld1dpbGxTd2l0Y2hcIlxuXHRcdEV2ZW50cy5WaWV3RGlkU3dpdGNoID0gXCJ2aWV3RGlkU3dpdGNoXCJcblx0XHRMYXllcjo6b25WaWV3V2lsbFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3V2lsbFN3aXRjaCwgY2IpXG5cdFx0TGF5ZXI6Om9uVmlld0RpZFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3RGlkU3dpdGNoLCBjYilcdFx0XG5cblx0XHRfLmVhY2ggdHJhbnNpdGlvbnMsIChhbmltUHJvcHMsIG5hbWUpID0+XG5cblx0XHRcdGlmIG9wdGlvbnMuYXV0b0xpbmtcblx0XHRcdFx0bGF5ZXJzID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpXG5cdFx0XHRcdGZvciBidG4gaW4gbGF5ZXJzXG5cdFx0XHRcdFx0aWYgXy5pbmNsdWRlcyBidG4ubmFtZSwgbmFtZVxuXHRcdFx0XHRcdFx0dmlld0NvbnRyb2xsZXIgPSBAXG5cdFx0XHRcdFx0XHRidG4ub25DbGljayAtPlxuXHRcdFx0XHRcdFx0XHRhbmltID0gQG5hbWUuc3BsaXQoJ18nKVswXVxuXHRcdFx0XHRcdFx0XHRsaW5rTmFtZSA9IEBuYW1lLnJlcGxhY2UoYW5pbSsnXycsJycpXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gbGlua05hbWUucmVwbGFjZSgvXFxkKy9nLCAnJykgIyByZW1vdmUgbnVtYmVyc1xuXHRcdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlclthbmltXSBfLmZpbmQobGF5ZXJzLCAobCkgLT4gbC5uYW1lIGlzIGxpbmtOYW1lKVxuXG5cdFx0XHRAW25hbWVdID0gKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgPT5cblxuXHRcdFx0XHRyZXR1cm4gaWYgbmV3VmlldyBpcyBAY3VycmVudFZpZXdcblxuXHRcdFx0XHQjIG1ha2Ugc3VyZSB0aGUgbmV3IGxheWVyIGlzIGluc2lkZSB0aGUgdmlld2NvbnRyb2xsZXJcblx0XHRcdFx0bmV3Vmlldy5wYXJlbnQgPSBAXG5cdFx0XHRcdG5ld1ZpZXcuc2VuZFRvQmFjaygpXG5cblx0XHRcdFx0IyByZXNldCBwcm9wcyBpbiBjYXNlIHRoZXkgd2VyZSBjaGFuZ2VkIGJ5IGEgcHJldiBhbmltYXRpb25cblx0XHRcdFx0bmV3Vmlldy5wb2ludCA9IHt4OjAsIHk6IDB9XG5cdFx0XHRcdG5ld1ZpZXcub3BhY2l0eSA9IDFcblx0XHRcdFx0bmV3Vmlldy5zY2FsZSA9IDFcblx0XHRcdFx0bmV3Vmlldy5icmlnaHRuZXNzID0gMTAwXG5cblx0XHRcdFx0IyBvbGRWaWV3XG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucG9pbnQgPSB7eDogMCwgeTogMH0gIyBmaXhlcyBvZmZzZXQgaXNzdWUgd2hlbiBtb3ZpbmcgdG9vIGZhc3QgYmV0d2VlbiBzY3JlZW5zXG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucHJvcHMgPSBhbmltUHJvcHMub2xkVmlldz8uZnJvbVxuXHRcdFx0XHRvdXRnb2luZyA9IEBjdXJyZW50Vmlldz8uYW5pbWF0ZSBfLmV4dGVuZCBhbmltYXRpb25PcHRpb25zLCB7cHJvcGVydGllczogYW5pbVByb3BzLm9sZFZpZXc/LnRvfVxuXG5cdFx0XHRcdCMgbmV3Vmlld1xuXHRcdFx0XHRuZXdWaWV3LnByb3BzID0gYW5pbVByb3BzLm5ld1ZpZXc/LmZyb21cblx0XHRcdFx0aW5jb21pbmcgPSBuZXdWaWV3LmFuaW1hdGUgXy5leHRlbmQgYW5pbWF0aW9uT3B0aW9ucywge3Byb3BlcnRpZXM6IGFuaW1Qcm9wcy5uZXdWaWV3Py50b31cblx0XHRcdFx0XG5cdFx0XHRcdCMgbGF5ZXIgb3JkZXJcblx0XHRcdFx0aWYgXy5pbmNsdWRlcyBuYW1lLCAnT3V0J1xuXHRcdFx0XHRcdG5ld1ZpZXcucGxhY2VCZWhpbmQoQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcdG91dGdvaW5nLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+IEBjdXJyZW50Vmlldy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bmV3Vmlldy5wbGFjZUJlZm9yZShAY3VycmVudFZpZXcpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5WaWV3V2lsbFN3aXRjaCwgQGN1cnJlbnRWaWV3LCBuZXdWaWV3KVxuXHRcdFx0XHRcblx0XHRcdFx0IyBjaGFuZ2UgQ3VycmVudFZpZXcgYmVmb3JlIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQgc28gb25lIGNvdWxkIGdvIGJhY2sgaW4gaGlzdG9yeVxuXHRcdFx0XHQjIHdpdGhvdXQgaGF2aW5nIHRvIHdhaXQgZm9yIHRoZSB0cmFuc2l0aW9uIHRvIGZpbmlzaFxuXHRcdFx0XHRAc2F2ZUN1cnJlbnRWaWV3VG9IaXN0b3J5IG5hbWUsIG91dGdvaW5nLCBpbmNvbWluZ1xuXHRcdFx0XHRAY3VycmVudFZpZXcgPSBuZXdWaWV3XG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOnByZXZpb3VzVmlld1wiLCBAcHJldmlvdXNWaWV3KVxuXHRcdFx0XHRAZW1pdChcImNoYW5nZTpjdXJyZW50Vmlld1wiLCBAY3VycmVudFZpZXcpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBpbmNvbWluZy5pc0FuaW1hdGluZ1xuXHRcdFx0XHRcdGhvb2sgPSBpbmNvbWluZyBcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGhvb2sgPSBvdXRnb2luZ1xuXHRcdFx0XHRob29rLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIEBwcmV2aW91c1ZpZXcsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3TmFtZT9cblx0XHRcdGF1dG9Jbml0aWFsID0gXy5maW5kIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IGwubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0aWYgYXV0b0luaXRpYWw/IHRoZW4gQHN3aXRjaEluc3RhbnQgYXV0b0luaXRpYWxcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXc/XG5cdFx0XHRAc3dpdGNoSW5zdGFudCBvcHRpb25zLmluaXRpYWxWaWV3XG5cblx0XHRpZiBvcHRpb25zLmJhY2tCdXR0b25OYW1lP1xuXHRcdFx0YmFja0J1dHRvbnMgPSBfLmZpbHRlciBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIChsKSAtPiBfLmluY2x1ZGVzIGwubmFtZSwgb3B0aW9ucy5iYWNrQnV0dG9uTmFtZVxuXHRcdFx0Zm9yIGJ0biBpbiBiYWNrQnV0dG9uc1xuXHRcdFx0XHRidG4ub25DbGljayA9PiBAYmFjaygpXG5cblx0QGRlZmluZSBcInByZXZpb3VzVmlld1wiLFxuXHRcdFx0Z2V0OiAtPiBAaGlzdG9yeVswXS52aWV3XG5cblx0c2F2ZUN1cnJlbnRWaWV3VG9IaXN0b3J5OiAobmFtZSxvdXRnb2luZ0FuaW1hdGlvbixpbmNvbWluZ0FuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFZpZXdcblx0XHRcdGFuaW1hdGlvbk5hbWU6IG5hbWVcblx0XHRcdGluY29taW5nQW5pbWF0aW9uOiBpbmNvbWluZ0FuaW1hdGlvblxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb246IG91dGdvaW5nQW5pbWF0aW9uXG5cblx0YmFjazogLT5cblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0aWYgXy5pbmNsdWRlcyBwcmV2aW91cy5hbmltYXRpb25OYW1lLCAnT3V0J1xuXHRcdFx0XHRwcmV2aW91cy52aWV3LmJyaW5nVG9Gcm9udCgpXG5cblx0XHRcdGJhY2tJbiA9IHByZXZpb3VzLm91dGdvaW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRiYWNrSW4uc3RhcnQoKVxuXHRcdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHRcdEBjdXJyZW50VmlldyA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdG1vdmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG4iLCJjbGFzcyBUZXh0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRAZG9BdXRvU2l6ZSA9IGZhbHNlXG5cdFx0QGRvQXV0b1NpemVIZWlnaHQgPSBmYWxzZVxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcImhzbGEoNjAsIDkwJSwgNDclLCAuNClcIiBlbHNlIFwidHJhbnNwYXJlbnRcIlxuXHRcdG9wdGlvbnMuY29sb3IgPz0gXCJyZWRcIlxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAxLjI1XG5cdFx0b3B0aW9ucy5mb250RmFtaWx5ID89IFwiSGVsdmV0aWNhXCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDIwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiVXNlIGxheWVyLnRleHQgdG8gYWRkIHRleHRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAc3R5bGUud2hpdGVTcGFjZSA9IFwicHJlLWxpbmVcIiAjIGFsbG93IFxcbiBpbiAudGV4dFxuXHRcdEBzdHlsZS5vdXRsaW5lID0gXCJub25lXCIgIyBubyBib3JkZXIgd2hlbiBzZWxlY3RlZFxuXG5cdHNldFN0eWxlOiAocHJvcGVydHksIHZhbHVlLCBweFN1ZmZpeCA9IGZhbHNlKSAtPlxuXHRcdEBzdHlsZVtwcm9wZXJ0eV0gPSBpZiBweFN1ZmZpeCB0aGVuIHZhbHVlK1wicHhcIiBlbHNlIHZhbHVlXG5cdFx0QGVtaXQoXCJjaGFuZ2U6I3twcm9wZXJ0eX1cIiwgdmFsdWUpXG5cdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXG5cdGNhbGNTaXplOiAtPlxuXHRcdHNpemVBZmZlY3RpbmdTdHlsZXMgPVxuXHRcdFx0bGluZUhlaWdodDogQHN0eWxlW1wibGluZS1oZWlnaHRcIl1cblx0XHRcdGZvbnRTaXplOiBAc3R5bGVbXCJmb250LXNpemVcIl1cblx0XHRcdGZvbnRXZWlnaHQ6IEBzdHlsZVtcImZvbnQtd2VpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nVG9wOiBAc3R5bGVbXCJwYWRkaW5nLXRvcFwiXVxuXHRcdFx0cGFkZGluZ1JpZ2h0OiBAc3R5bGVbXCJwYWRkaW5nLXJpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nQm90dG9tOiBAc3R5bGVbXCJwYWRkaW5nLWJvdHRvbVwiXVxuXHRcdFx0cGFkZGluZ0xlZnQ6IEBzdHlsZVtcInBhZGRpbmctbGVmdFwiXVxuXHRcdFx0dGV4dFRyYW5zZm9ybTogQHN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl1cblx0XHRcdGJvcmRlcldpZHRoOiBAc3R5bGVbXCJib3JkZXItd2lkdGhcIl1cblx0XHRcdGxldHRlclNwYWNpbmc6IEBzdHlsZVtcImxldHRlci1zcGFjaW5nXCJdXG5cdFx0XHRmb250RmFtaWx5OiBAc3R5bGVbXCJmb250LWZhbWlseVwiXVxuXHRcdFx0Zm9udFN0eWxlOiBAc3R5bGVbXCJmb250LXN0eWxlXCJdXG5cdFx0XHRmb250VmFyaWFudDogQHN0eWxlW1wiZm9udC12YXJpYW50XCJdXG5cdFx0Y29uc3RyYWludHMgPSB7fVxuXHRcdGlmIEBkb0F1dG9TaXplSGVpZ2h0IHRoZW4gY29uc3RyYWludHMud2lkdGggPSBAd2lkdGhcblx0XHRzaXplID0gVXRpbHMudGV4dFNpemUgQHRleHQsIHNpemVBZmZlY3RpbmdTdHlsZXMsIGNvbnN0cmFpbnRzXG5cdFx0aWYgQHN0eWxlLnRleHRBbGlnbiBpcyBcInJpZ2h0XCJcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRcdEB4ID0gQHgtQHdpZHRoXG5cdFx0ZWxzZVxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdEBoZWlnaHQgPSBzaXplLmhlaWdodFxuXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZVwiLFxuXHRcdGdldDogLT4gQGRvQXV0b1NpemVcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImF1dG9TaXplSGVpZ2h0XCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRAZG9BdXRvU2l6ZUhlaWdodCA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJjb250ZW50RWRpdGFibGVcIixcblx0XHRzZXQ6IChib29sZWFuKSAtPlxuXHRcdFx0QF9lbGVtZW50LmNvbnRlbnRFZGl0YWJsZSA9IGJvb2xlYW5cblx0XHRcdEBpZ25vcmVFdmVudHMgPSAhYm9vbGVhblxuXHRcdFx0QG9uIFwiaW5wdXRcIiwgLT4gQGNhbGNTaXplKCkgaWYgQGRvQXV0b1NpemVcblxuXHRAZGVmaW5lIFwidGV4dFwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LnRleHRDb250ZW50XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2VsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZVxuXHRcdFx0QGVtaXQoXCJjaGFuZ2U6dGV4dFwiLCB2YWx1ZSlcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImZvbnRGYW1pbHlcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250RmFtaWx5XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRGYW1pbHlcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U2l6ZVwiLFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRTaXplLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTaXplXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGluZUhlaWdodFwiLFxuXHRcdGdldDogLT4gQHN0eWxlLmxpbmVIZWlnaHRcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGluZUhlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRXZWlnaHRcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250V2VpZ2h0XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRXZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U3R5bGVcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFN0eWxlXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFZhcmlhbnRcIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250VmFyaWFudFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250VmFyaWFudFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdcIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nVG9wXCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1RvcC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1JpZ2h0XCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1JpZ2h0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdCb3R0b21cIixcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nQm90dG9tLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nTGVmdFwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdMZWZ0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwidGV4dEFsaWduXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRBbGlnblwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInRleHRUcmFuc2Zvcm1cIixcblx0XHRnZXQ6IC0+IEBzdHlsZS50ZXh0VHJhbnNmb3JtXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRUcmFuc2Zvcm1cIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJsZXR0ZXJTcGFjaW5nXCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGV0dGVyU3BhY2luZy5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsZXR0ZXJTcGFjaW5nXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGVuZ3RoXCIsXG5cdFx0Z2V0OiAtPiBAdGV4dC5sZW5ndGhcblxuY29udmVydFRvVGV4dExheWVyID0gKGxheWVyKSAtPlxuXHR0ID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IGxheWVyLm5hbWVcblx0XHRmcmFtZTogbGF5ZXIuZnJhbWVcblx0XHRwYXJlbnQ6IGxheWVyLnBhcmVudFxuXG5cdGNzc09iaiA9IHt9XG5cdGNzcyA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLmNzc1xuXHRjc3MuZm9yRWFjaCAocnVsZSkgLT5cblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyBydWxlLCAnLyonXG5cdFx0YXJyID0gcnVsZS5zcGxpdCgnOiAnKVxuXHRcdGNzc09ialthcnJbMF1dID0gYXJyWzFdLnJlcGxhY2UoJzsnLCcnKVxuXHR0LnN0eWxlID0gY3NzT2JqXG5cblx0aW1wb3J0UGF0aCA9IGxheWVyLl9fZnJhbWVySW1wb3J0ZWRGcm9tUGF0aFxuXHRpZiBfLmluY2x1ZGVzIGltcG9ydFBhdGgsICdAMngnXG5cdFx0dC5mb250U2l6ZSAqPSAyXG5cdFx0dC5saW5lSGVpZ2h0ID0gKHBhcnNlSW50KHQubGluZUhlaWdodCkqMikrJ3B4J1xuXHRcdHQubGV0dGVyU3BhY2luZyAqPSAyXG5cblx0dC55IC09IChwYXJzZUludCh0LmxpbmVIZWlnaHQpLXQuZm9udFNpemUpLzIgIyBjb21wZW5zYXRlIGZvciBob3cgQ1NTIGhhbmRsZXMgbGluZSBoZWlnaHRcblx0dC55IC09IHQuZm9udFNpemUgKiAwLjEgIyBza2V0Y2ggcGFkZGluZ1xuXHR0LnggLT0gdC5mb250U2l6ZSAqIDAuMDggIyBza2V0Y2ggcGFkZGluZ1xuXHR0LndpZHRoICs9IHQuZm9udFNpemUgKiAwLjUgIyBza2V0Y2ggcGFkZGluZ1xuXG5cdHQudGV4dCA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLnN0cmluZ1xuXHRsYXllci5kZXN0cm95KClcblx0cmV0dXJuIHRcblxuTGF5ZXI6OmNvbnZlcnRUb1RleHRMYXllciA9IC0+IGNvbnZlcnRUb1RleHRMYXllcihAKVxuXG5jb252ZXJ0VGV4dExheWVycyA9IChvYmopIC0+XG5cdGZvciBwcm9wLGxheWVyIG9mIG9ialxuXHRcdGlmIGxheWVyLl9pbmZvLmtpbmQgaXMgXCJ0ZXh0XCJcblx0XHRcdG9ialtwcm9wXSA9IGNvbnZlcnRUb1RleHRMYXllcihsYXllcilcblxuIyBCYWNrd2FyZHMgY29tcGFiaWxpdHkuIFJlcGxhY2VkIGJ5IGNvbnZlcnRUb1RleHRMYXllcigpXG5MYXllcjo6ZnJhbWVBc1RleHRMYXllciA9IChwcm9wZXJ0aWVzKSAtPlxuICAgIHQgPSBuZXcgVGV4dExheWVyXG4gICAgdC5mcmFtZSA9IEBmcmFtZVxuICAgIHQuc3VwZXJMYXllciA9IEBzdXBlckxheWVyXG4gICAgXy5leHRlbmQgdCxwcm9wZXJ0aWVzXG4gICAgQGRlc3Ryb3koKVxuICAgIHRcblxuZXhwb3J0cy5UZXh0TGF5ZXIgPSBUZXh0TGF5ZXJcbmV4cG9ydHMuY29udmVydFRleHRMYXllcnMgPSBjb252ZXJ0VGV4dExheWVyc1xuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVu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QUpBO0FBT0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFEQTtBQVJBO0FBV0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFaQTtBQWNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFEQTtBQWZBO0FBa0JBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFEQTtBQW5CQTtBQXNCQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBREE7QUF2QkE7QUEwQkE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQURBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFIQTtBQTNCQTtBQWdDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFEQTtBQUhBO0FBakNBO0FBc0NBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFEQTtBQXZDQTtBQTBDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFEQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBSEE7QUEzQ0E7QUFnREE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFEQTtBQUhBO0FBakRBO0FBc0RBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUhBO0FBdkRBO0FBNERBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUhBO0FBN0RBO0FBa0VBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQW5FQTtBQXFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUF0RUE7QUF3RUE7QUFDQTtBQUNBO0FBQUE7QUFB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QUFHRTtBQUFGO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUNBO0FBQUE7QUFIQTs7QUFJQTtBQUxBO0FBQUE7QUFPQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7O0FBQ0E7QUFBQTtBQUhBOztBQUlBO0FBTEE7QUFBQTtBQWJBO0FBdUJBO0FBQ0E7QUFDQTtBQUFBOztBQUVBO0FBQUE7QUFDQTtBQUFBOztBQUNBO0FBQUE7O0FBRkE7QUFBQTtBQUlBO0FBQUE7QUFDQTtBQUFBOztBQUNBO0FBQUE7O0FBRkE7QUFBQTs7QUFsQ0E7Ozs7QUFqR0E7Ozs7QURoQkE7O0FBQUE7O0FBQ0M7O0FBR0Q7O0FBQ0E7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBOztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBOztBQVVBO0FBQUE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUlBO0FBT0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBUUE7QUFDQTtBQUVDO0FBQUE7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBDQztBQXNDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYkE7QUFjQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVdBO0FBQ0E7QUEvSkE7O0FBa0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTs7QUFTQTtBQUNBO0FBQ0E7QUFEQTtBQURBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBOztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7Ozs7QUR6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFqQkE7QUFvQkE7QUFDQTtBQUNBO0FBQ0E7QUF2QkE7QUEwQkE7QUFDQTtBQUNBO0FBR0E7QUEvQkE7QUFrQ0E7QUFDQTtBQUNBO0FBRUE7QUF0Q0E7QUF5Q0E7QUFDQTtBQUNBO0FBRUE7QUE3Q0E7QUFnREE7QUFDQTtBQUNBO0FBQ0E7QUFuREE7Ozs7O0FEQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTtBQW9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTFCQTtBQTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5DQTtBQXVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdDQTtBQWdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXREQTtBQXlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9EQTtBQWtFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhFQTs7OzsifQ==
