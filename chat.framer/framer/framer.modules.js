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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9jaGF0LmZyYW1lci9tb2R1bGVzL1RleHRMYXllci5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9jaGF0LmZyYW1lci9tb2R1bGVzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvR2l0SHViL1Byb2plY3RPbmVGcmFtZXJQcm90b3R5cGVzL2NoYXQuZnJhbWVyL21vZHVsZXMvZmluZE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9jaGF0LmZyYW1lci9tb2R1bGVzL2ZpcmViYXNlLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvR2l0SHViL1Byb2plY3RPbmVGcmFtZXJQcm90b3R5cGVzL2NoYXQuZnJhbWVyL21vZHVsZXMvaXRpbmVyYXJ5Vmlldy5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9jaGF0LmZyYW1lci9tb2R1bGVzL2l0aW5lcmFyeS5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9jaGF0LmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvR2l0SHViL1Byb2plY3RPbmVGcmFtZXJQcm90b3R5cGVzL2NoYXQuZnJhbWVyL21vZHVsZXMvdXNlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxnREFBQTtFQUFBOzs7QUFBTTs7O0VBRVEsbUJBQUMsT0FBRDs7TUFBQyxVQUFROztJQUNyQixJQUFDLENBQUEsVUFBRCxHQUFj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USxLQU5UO0lBT0MsV0FBQSxFQUFhLEtBUGQ7R0F4RFcsRUFpRVg7SUFDRSxRQUFBLEVBQVMsb0JBRFg7SUFFRSxVQUFBLEVBQVksd0JBRmQ7SUFHRSxXQUFBLEVBQWEsS0FIZjtJQUlFLFFBQUEsRUFBVSxLQUpaO0lBS0UsWUFBQSxFQUFhLHNCQUxmO0lBTUUsTUFBQSxFQUFRLEtBTlY7SUFPRSxXQUFBLEVBQWEsS0FQZjtHQWpFVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBUZXh0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0QGRvQXV0b1NpemUgPSBmYWxzZVxuXHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gZmFsc2Vcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBpZiBvcHRpb25zLnNldHVwIHRoZW4gXCJoc2xhKDYwLCA5MCUsIDQ3JSwgLjQpXCIgZWxzZSBcInRyYW5zcGFyZW50XCJcblx0XHRvcHRpb25zLmNvbG9yID89IFwicmVkXCJcblx0XHRvcHRpb25zLmxpbmVIZWlnaHQgPz0gMS4yNVxuXHRcdG9wdGlvbnMuZm9udEZhbWlseSA/PSBcIkhlbHZldGljYVwiXG5cdFx0b3B0aW9ucy5mb250U2l6ZSA/PSAyMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlVzZSBsYXllci50ZXh0IHRvIGFkZCB0ZXh0XCJcblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QHN0eWxlLndoaXRlU3BhY2UgPSBcInByZS1saW5lXCIgIyBhbGxvdyBcXG4gaW4gLnRleHRcblx0XHRAc3R5bGUub3V0bGluZSA9IFwibm9uZVwiICMgbm8gYm9yZGVyIHdoZW4gc2VsZWN0ZWRcblx0XHRcblx0c2V0U3R5bGU6IChwcm9wZXJ0eSwgdmFsdWUsIHB4U3VmZml4ID0gZmFsc2UpIC0+XG5cdFx0QHN0eWxlW3Byb3BlcnR5XSA9IGlmIHB4U3VmZml4IHRoZW4gdmFsdWUrXCJweFwiIGVsc2UgdmFsdWVcblx0XHRAZW1pdChcImNoYW5nZToje3Byb3BlcnR5fVwiLCB2YWx1ZSlcblx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdFx0XG5cdGNhbGNTaXplOiAtPlxuXHRcdHNpemVBZmZlY3RpbmdTdHlsZXMgPVxuXHRcdFx0bGluZUhlaWdodDogQHN0eWxlW1wibGluZS1oZWlnaHRcIl1cblx0XHRcdGZvbnRTaXplOiBAc3R5bGVbXCJmb250LXNpemVcIl1cblx0XHRcdGZvbnRXZWlnaHQ6IEBzdHlsZVtcImZvbnQtd2VpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nVG9wOiBAc3R5bGVbXCJwYWRkaW5nLXRvcFwiXVxuXHRcdFx0cGFkZGluZ1JpZ2h0OiBAc3R5bGVbXCJwYWRkaW5nLXJpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nQm90dG9tOiBAc3R5bGVbXCJwYWRkaW5nLWJvdHRvbVwiXVxuXHRcdFx0cGFkZGluZ0xlZnQ6IEBzdHlsZVtcInBhZGRpbmctbGVmdFwiXVxuXHRcdFx0dGV4dFRyYW5zZm9ybTogQHN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl1cblx0XHRcdGJvcmRlcldpZHRoOiBAc3R5bGVbXCJib3JkZXItd2lkdGhcIl1cblx0XHRcdGxldHRlclNwYWNpbmc6IEBzdHlsZVtcImxldHRlci1zcGFjaW5nXCJdXG5cdFx0XHRmb250RmFtaWx5OiBAc3R5bGVbXCJmb250LWZhbWlseVwiXVxuXHRcdFx0Zm9udFN0eWxlOiBAc3R5bGVbXCJmb250LXN0eWxlXCJdXG5cdFx0XHRmb250VmFyaWFudDogQHN0eWxlW1wiZm9udC12YXJpYW50XCJdXG5cdFx0Y29uc3RyYWludHMgPSB7fVxuXHRcdGlmIEBkb0F1dG9TaXplSGVpZ2h0IHRoZW4gY29uc3RyYWludHMud2lkdGggPSBAd2lkdGhcblx0XHRzaXplID0gVXRpbHMudGV4dFNpemUgQHRleHQsIHNpemVBZmZlY3RpbmdTdHlsZXMsIGNvbnN0cmFpbnRzXG5cdFx0aWYgQHN0eWxlLnRleHRBbGlnbiBpcyBcInJpZ2h0XCJcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRcdEB4ID0gQHgtQHdpZHRoXG5cdFx0ZWxzZVxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdEBoZWlnaHQgPSBzaXplLmhlaWdodFxuXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZVwiLFxuXHRcdGdldDogLT4gQGRvQXV0b1NpemVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZUhlaWdodFwiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImNvbnRlbnRFZGl0YWJsZVwiLFxuXHRcdHNldDogKGJvb2xlYW4pIC0+XG5cdFx0XHRAX2VsZW1lbnQuY29udGVudEVkaXRhYmxlID0gYm9vbGVhblxuXHRcdFx0QGlnbm9yZUV2ZW50cyA9ICFib29sZWFuXG5cdFx0XHRAb24gXCJpbnB1dFwiLCAtPiBAY2FsY1NpemUoKSBpZiBAZG9BdXRvU2l6ZVxuXHRAZGVmaW5lIFwidGV4dFwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LnRleHRDb250ZW50XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2VsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZVxuXHRcdFx0QGVtaXQoXCJjaGFuZ2U6dGV4dFwiLCB2YWx1ZSlcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImZvbnRGYW1pbHlcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udEZhbWlseVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250RmFtaWx5XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFNpemVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFNpemUucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFNpemVcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsaW5lSGVpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmxpbmVIZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxpbmVIZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250V2VpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRXZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRXZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U3R5bGVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFN0eWxlXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTdHlsZVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRWYXJpYW50XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRWYXJpYW50XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRWYXJpYW50XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1wiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nVG9wXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdUb3AucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdSaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nUmlnaHQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1JpZ2h0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ0JvdHRvbVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nQm90dG9tLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nTGVmdFwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdMZWZ0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwidGV4dEFsaWduXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRBbGlnblwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInRleHRUcmFuc2Zvcm1cIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUudGV4dFRyYW5zZm9ybSBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dFRyYW5zZm9ybVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImxldHRlclNwYWNpbmdcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGV0dGVyU3BhY2luZy5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsZXR0ZXJTcGFjaW5nXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGVuZ3RoXCIsIFxuXHRcdGdldDogLT4gQHRleHQubGVuZ3RoXG5cbmNvbnZlcnRUb1RleHRMYXllciA9IChsYXllcikgLT5cblx0dCA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBsYXllci5uYW1lXG5cdFx0ZnJhbWU6IGxheWVyLmZyYW1lXG5cdFx0cGFyZW50OiBsYXllci5wYXJlbnRcblx0XG5cdGNzc09iaiA9IHt9XG5cdGNzcyA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLmNzc1xuXHRjc3MuZm9yRWFjaCAocnVsZSkgLT5cblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyBydWxlLCAnLyonXG5cdFx0YXJyID0gcnVsZS5zcGxpdCgnOiAnKVxuXHRcdGNzc09ialthcnJbMF1dID0gYXJyWzFdLnJlcGxhY2UoJzsnLCcnKVxuXHR0LnN0eWxlID0gY3NzT2JqXG5cdFxuXHRpbXBvcnRQYXRoID0gbGF5ZXIuX19mcmFtZXJJbXBvcnRlZEZyb21QYXRoXG5cdGlmIF8uaW5jbHVkZXMgaW1wb3J0UGF0aCwgJ0AyeCdcblx0XHR0LmZvbnRTaXplICo9IDJcblx0XHR0LmxpbmVIZWlnaHQgPSAocGFyc2VJbnQodC5saW5lSGVpZ2h0KSoyKSsncHgnXG5cdFx0dC5sZXR0ZXJTcGFjaW5nICo9IDJcblx0XHRcdFx0XHRcblx0dC55IC09IChwYXJzZUludCh0LmxpbmVIZWlnaHQpLXQuZm9udFNpemUpLzIgIyBjb21wZW5zYXRlIGZvciBob3cgQ1NTIGhhbmRsZXMgbGluZSBoZWlnaHRcblx0dC55IC09IHQuZm9udFNpemUgKiAwLjEgIyBza2V0Y2ggcGFkZGluZ1xuXHR0LnggLT0gdC5mb250U2l6ZSAqIDAuMDggIyBza2V0Y2ggcGFkZGluZ1xuXHR0LndpZHRoICs9IHQuZm9udFNpemUgKiAwLjUgIyBza2V0Y2ggcGFkZGluZ1xuXG5cdHQudGV4dCA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLnN0cmluZ1xuXHRsYXllci5kZXN0cm95KClcblx0cmV0dXJuIHRcblxuTGF5ZXI6OmNvbnZlcnRUb1RleHRMYXllciA9IC0+IGNvbnZlcnRUb1RleHRMYXllcihAKVxuXG5jb252ZXJ0VGV4dExheWVycyA9IChvYmopIC0+XG5cdGZvciBwcm9wLGxheWVyIG9mIG9ialxuXHRcdGlmIGxheWVyLl9pbmZvLmtpbmQgaXMgXCJ0ZXh0XCJcblx0XHRcdG9ialtwcm9wXSA9IGNvbnZlcnRUb1RleHRMYXllcihsYXllcilcblxuIyBCYWNrd2FyZHMgY29tcGFiaWxpdHkuIFJlcGxhY2VkIGJ5IGNvbnZlcnRUb1RleHRMYXllcigpXG5MYXllcjo6ZnJhbWVBc1RleHRMYXllciA9IChwcm9wZXJ0aWVzKSAtPlxuICAgIHQgPSBuZXcgVGV4dExheWVyXG4gICAgdC5mcmFtZSA9IEBmcmFtZVxuICAgIHQuc3VwZXJMYXllciA9IEBzdXBlckxheWVyXG4gICAgXy5leHRlbmQgdCxwcm9wZXJ0aWVzXG4gICAgQGRlc3Ryb3koKVxuICAgIHRcblxuZXhwb3J0cy5UZXh0TGF5ZXIgPSBUZXh0TGF5ZXJcbmV4cG9ydHMuY29udmVydFRleHRMYXllcnMgPSBjb252ZXJ0VGV4dExheWVyc1xuIiwiY2xhc3MgbW9kdWxlLmV4cG9ydHMgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5iYWNrQnV0dG9uTmFtZSA/PSAnYmFja0J1dHRvbidcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5zY3JvbGwgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmF1dG9MaW5rID89IHRydWVcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cblx0XHRAb25DaGFuZ2UgXCJzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpID0+XG5cdFx0XHR2aWV3ID0gY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0aWYgdmlldz9cblx0XHRcdFx0IyBkZWZhdWx0IGJlaGF2aW9ycyBmb3Igdmlld3Ncblx0XHRcdFx0dmlldy5jbGlwID0gdHJ1ZVxuXHRcdFx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0XHRcdCMgYWRkIHNjcm9sbGNvbXBvbmVudFxuXHRcdFx0XHRpZiBAc2Nyb2xsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gPSB2aWV3LmNoaWxkcmVuXG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0XHRcdFx0bmFtZTogXCJzY3JvbGxDb21wb25lbnRcIlxuXHRcdFx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHZpZXdcblx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuY29udGVudC5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRcdFx0aWYgdmlldy53aWR0aCA8PSBAd2lkdGhcblx0XHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2Vcblx0XHRcdFx0XHRpZiB2aWV3LmhlaWdodCA8PSBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsVmVydGljYWwgPSBmYWxzZVxuXHRcdFx0XHRcdGZvciBjIGluIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHRjLnBhcmVudCA9IHNjcm9sbENvbXBvbmVudC5jb250ZW50XG5cdFx0XHRcdFx0dmlldy5zY3JvbGxDb21wb25lbnQgPSBzY3JvbGxDb21wb25lbnQgIyBtYWtlIGl0IGFjY2Vzc2libGUgYXMgYSBwcm9wZXJ0eVxuXHRcdFx0XHRcdCMgcmVzZXQgc2l6ZSBzaW5jZSBjb250ZW50IG1vdmVkIHRvIHNjcm9sbENvbXBvbmVudC4gcHJldmVudHMgc2Nyb2xsIGJ1ZyB3aGVuIGRyYWdnaW5nIG91dHNpZGUuXG5cdFx0XHRcdFx0dmlldy5zaXplID0ge3dpZHRoOiBAd2lkdGgsIGhlaWdodDogQGhlaWdodH1cblxuXHRcdHRyYW5zaXRpb25zID1cblx0XHRcdHN3aXRjaEluc3RhbnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiAwLCB5OiAwfVxuXHRcdFx0ZmFkZUluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHtvcGFjaXR5OiAwfVxuXHRcdFx0XHRcdHRvOiB7b3BhY2l0eTogMX1cblx0XHRcdHpvb21Jbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7c2NhbGU6IDAuOCwgb3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge3NjYWxlOiAxLCBvcGFjaXR5OiAxfVxuXHRcdFx0em9vbU91dDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRzbGlkZUluVXA6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3k6IEBoZWlnaHR9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0c2xpZGVJblJpZ2h0OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkRvd246XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFk6IDB9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0bW92ZUluUmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0bW92ZUluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRzbGlkZUluTGVmdDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge21heFg6IEB3aWR0aH1cblx0XHRcdHB1c2hJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogLShAd2lkdGgvNSksIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaEluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogLUB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRwdXNoT3V0UmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHB1c2hPdXRMZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRoLzUsIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRcdHRvOiB7eDogMCwgYnJpZ2h0bmVzczogMTAwfVxuXHRcdFx0c2xpZGVPdXRVcDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFk6IDB9XG5cdFx0XHRzbGlkZU91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0c2xpZGVPdXREb3duOlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eTogQGhlaWdodH1cblx0XHRcdHNsaWRlT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cblx0XHQjIHNob3J0Y3V0c1xuXHRcdHRyYW5zaXRpb25zLnNsaWRlSW4gPSB0cmFuc2l0aW9ucy5zbGlkZUluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5zbGlkZU91dCA9IHRyYW5zaXRpb25zLnNsaWRlT3V0UmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoSW4gPSB0cmFuc2l0aW9ucy5wdXNoSW5SaWdodFxuXHRcdHRyYW5zaXRpb25zLnB1c2hPdXQgPSB0cmFuc2l0aW9ucy5wdXNoT3V0UmlnaHRcblxuXHRcdCMgZXZlbnRzXG5cdFx0RXZlbnRzLlZpZXdXaWxsU3dpdGNoID0gXCJ2aWV3V2lsbFN3aXRjaFwiXG5cdFx0RXZlbnRzLlZpZXdEaWRTd2l0Y2ggPSBcInZpZXdEaWRTd2l0Y2hcIlxuXHRcdExheWVyOjpvblZpZXdXaWxsU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBjYilcblx0XHRMYXllcjo6b25WaWV3RGlkU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIGNiKVx0XHRcblxuXHRcdF8uZWFjaCB0cmFuc2l0aW9ucywgKGFuaW1Qcm9wcywgbmFtZSkgPT5cblxuXHRcdFx0aWYgb3B0aW9ucy5hdXRvTGlua1xuXHRcdFx0XHRsYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0XHRcdFx0Zm9yIGJ0biBpbiBsYXllcnNcblx0XHRcdFx0XHRpZiBfLmluY2x1ZGVzIGJ0bi5uYW1lLCBuYW1lXG5cdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlciA9IEBcblx0XHRcdFx0XHRcdGJ0bi5vbkNsaWNrIC0+XG5cdFx0XHRcdFx0XHRcdGFuaW0gPSBAbmFtZS5zcGxpdCgnXycpWzBdXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gQG5hbWUucmVwbGFjZShhbmltKydfJywnJylcblx0XHRcdFx0XHRcdFx0bGlua05hbWUgPSBsaW5rTmFtZS5yZXBsYWNlKC9cXGQrL2csICcnKSAjIHJlbW92ZSBudW1iZXJzXG5cdFx0XHRcdFx0XHRcdHZpZXdDb250cm9sbGVyW2FuaW1dIF8uZmluZChsYXllcnMsIChsKSAtPiBsLm5hbWUgaXMgbGlua05hbWUpXG5cblx0XHRcdEBbbmFtZV0gPSAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSA9PlxuXG5cdFx0XHRcdHJldHVybiBpZiBuZXdWaWV3IGlzIEBjdXJyZW50Vmlld1xuXG5cdFx0XHRcdCMgbWFrZSBzdXJlIHRoZSBuZXcgbGF5ZXIgaXMgaW5zaWRlIHRoZSB2aWV3Y29udHJvbGxlclxuXHRcdFx0XHRuZXdWaWV3LnBhcmVudCA9IEBcblx0XHRcdFx0bmV3Vmlldy5zZW5kVG9CYWNrKClcblxuXHRcdFx0XHQjIHJlc2V0IHByb3BzIGluIGNhc2UgdGhleSB3ZXJlIGNoYW5nZWQgYnkgYSBwcmV2IGFuaW1hdGlvblxuXHRcdFx0XHRuZXdWaWV3LnBvaW50ID0ge3g6MCwgeTogMH1cblx0XHRcdFx0bmV3Vmlldy5vcGFjaXR5ID0gMVxuXHRcdFx0XHRuZXdWaWV3LnNjYWxlID0gMVxuXHRcdFx0XHRuZXdWaWV3LmJyaWdodG5lc3MgPSAxMDBcblxuXHRcdFx0XHQjIG9sZFZpZXdcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wb2ludCA9IHt4OiAwLCB5OiAwfSAjIGZpeGVzIG9mZnNldCBpc3N1ZSB3aGVuIG1vdmluZyB0b28gZmFzdCBiZXR3ZWVuIHNjcmVlbnNcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wcm9wcyA9IGFuaW1Qcm9wcy5vbGRWaWV3Py5mcm9tXG5cdFx0XHRcdG91dGdvaW5nID0gQGN1cnJlbnRWaWV3Py5hbmltYXRlIF8uZXh0ZW5kIGFuaW1hdGlvbk9wdGlvbnMsIHtwcm9wZXJ0aWVzOiBhbmltUHJvcHMub2xkVmlldz8udG99XG5cblx0XHRcdFx0IyBuZXdWaWV3XG5cdFx0XHRcdG5ld1ZpZXcucHJvcHMgPSBhbmltUHJvcHMubmV3Vmlldz8uZnJvbVxuXHRcdFx0XHRpbmNvbWluZyA9IG5ld1ZpZXcuYW5pbWF0ZSBfLmV4dGVuZCBhbmltYXRpb25PcHRpb25zLCB7cHJvcGVydGllczogYW5pbVByb3BzLm5ld1ZpZXc/LnRvfVxuXHRcdFx0XHRcblx0XHRcdFx0IyBsYXllciBvcmRlclxuXHRcdFx0XHRpZiBfLmluY2x1ZGVzIG5hbWUsICdPdXQnXG5cdFx0XHRcdFx0bmV3Vmlldy5wbGFjZUJlaGluZChAY3VycmVudFZpZXcpXG5cdFx0XHRcdFx0b3V0Z29pbmcub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdWaWV3LnBsYWNlQmVmb3JlKEBjdXJyZW50Vmlldylcblx0XHRcdFx0XHRcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBAY3VycmVudFZpZXcsIG5ld1ZpZXcpXG5cdFx0XHRcdFxuXHRcdFx0XHQjIGNoYW5nZSBDdXJyZW50VmlldyBiZWZvcmUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCBzbyBvbmUgY291bGQgZ28gYmFjayBpbiBoaXN0b3J5XG5cdFx0XHRcdCMgd2l0aG91dCBoYXZpbmcgdG8gd2FpdCBmb3IgdGhlIHRyYW5zaXRpb24gdG8gZmluaXNoXG5cdFx0XHRcdEBzYXZlQ3VycmVudFZpZXdUb0hpc3RvcnkgbmFtZSwgb3V0Z29pbmcsIGluY29taW5nXG5cdFx0XHRcdEBjdXJyZW50VmlldyA9IG5ld1ZpZXdcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6cHJldmlvdXNWaWV3XCIsIEBwcmV2aW91c1ZpZXcpXG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOmN1cnJlbnRWaWV3XCIsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cdFx0XHRcdGlmIGluY29taW5nLmlzQW5pbWF0aW5nXG5cdFx0XHRcdFx0aG9vayA9IGluY29taW5nIFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aG9vayA9IG91dGdvaW5nXG5cdFx0XHRcdGhvb2sub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0XHRAZW1pdChFdmVudHMuVmlld0RpZFN3aXRjaCwgQHByZXZpb3VzVmlldywgQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lP1xuXHRcdFx0YXV0b0luaXRpYWwgPSBfLmZpbmQgRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpLCAobCkgLT4gbC5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRpZiBhdXRvSW5pdGlhbD8gdGhlbiBAc3dpdGNoSW5zdGFudCBhdXRvSW5pdGlhbFxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlldz9cblx0XHRcdEBzd2l0Y2hJbnN0YW50IG9wdGlvbnMuaW5pdGlhbFZpZXdcblxuXHRcdGlmIG9wdGlvbnMuYmFja0J1dHRvbk5hbWU/XG5cdFx0XHRiYWNrQnV0dG9ucyA9IF8uZmlsdGVyIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IF8uaW5jbHVkZXMgbC5uYW1lLCBvcHRpb25zLmJhY2tCdXR0b25OYW1lXG5cdFx0XHRmb3IgYnRuIGluIGJhY2tCdXR0b25zXG5cdFx0XHRcdGJ0bi5vbkNsaWNrID0+IEBiYWNrKClcblxuXHRAZGVmaW5lIFwicHJldmlvdXNWaWV3XCIsXG5cdFx0XHRnZXQ6IC0+IEBoaXN0b3J5WzBdLnZpZXdcblxuXHRzYXZlQ3VycmVudFZpZXdUb0hpc3Rvcnk6IChuYW1lLG91dGdvaW5nQW5pbWF0aW9uLGluY29taW5nQW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50Vmlld1xuXHRcdFx0YW5pbWF0aW9uTmFtZTogbmFtZVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb246IGluY29taW5nQW5pbWF0aW9uXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbjogb3V0Z29pbmdBbmltYXRpb25cblxuXHRiYWNrOiAtPlxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRpZiBfLmluY2x1ZGVzIHByZXZpb3VzLmFuaW1hdGlvbk5hbWUsICdPdXQnXG5cdFx0XHRcdHByZXZpb3VzLnZpZXcuYnJpbmdUb0Zyb250KClcblxuXHRcdFx0YmFja0luID0gcHJldmlvdXMub3V0Z29pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cdFx0XHRtb3ZlT3V0ID0gcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cblx0XHRcdGJhY2tJbi5zdGFydCgpXG5cdFx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdFx0QGN1cnJlbnRWaWV3ID0gcHJldmlvdXMudmlld1xuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0bW92ZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudFZpZXcuYnJpbmdUb0Zyb250KClcbiIsIl9nZXRIaWVyYXJjaHkgPSAobGF5ZXIpIC0+XG4gIHN0cmluZyA9ICcnXG4gIGZvciBhIGluIGxheWVyLmFuY2VzdG9ycygpXG4gICAgc3RyaW5nID0gYS5uYW1lKyc+JytzdHJpbmdcbiAgcmV0dXJuIHN0cmluZyA9IHN0cmluZytsYXllci5uYW1lXG5cbl9tYXRjaCA9IChoaWVyYXJjaHksIHN0cmluZykgLT5cbiAgIyBwcmVwYXJlIHJlZ2V4IHRva2Vuc1xuICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxzKj5cXHMqL2csJz4nKSAjIGNsZWFuIHVwIHNwYWNlcyBhcm91bmQgYXJyb3dzXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnKicpLmpvaW4oJ1tePl0qJykgIyBhc3RlcmlrcyBhcyBsYXllciBuYW1lIHdpbGRjYXJkXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnICcpLmpvaW4oJyg/Oi4qKT4nKSAjIHNwYWNlIGFzIHN0cnVjdHVyZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJywnKS5qb2luKCckfCcpICMgYWxsb3cgbXVsdGlwbGUgc2VhcmNoZXMgdXNpbmcgY29tbWFcbiAgcmVnZXhTdHJpbmcgPSBcIihefD4pXCIrc3RyaW5nK1wiJFwiICMgYWx3YXlzIGJvdHRvbSBsYXllciwgbWF5YmUgcGFydCBvZiBoaWVyYXJjaHlcblxuICByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKSBcbiAgcmV0dXJuIGhpZXJhcmNoeS5tYXRjaChyZWdFeHApXG5cbl9maW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+XG4gIGxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXG4gIGlmIHNlbGVjdG9yP1xuICAgIHN0cmluZ05lZWRzUmVnZXggPSBfLmZpbmQgWycqJywnICcsJz4nLCcsJ10sIChjKSAtPiBfLmNvbnRhaW5zIHNlbGVjdG9yLGNcbiAgICB1bmxlc3Mgc3RyaW5nTmVlZHNSZWdleCBvciBmcm9tTGF5ZXJcbiAgICAgIGxheWVycyA9IF8uZmlsdGVyIGxheWVycywgKGxheWVyKSAtPiBcbiAgICAgICAgaWYgbGF5ZXIubmFtZSBpcyBzZWxlY3RvciB0aGVuIHRydWVcbiAgICBlbHNlXG4gICAgICBsYXllcnMgPSBfLmZpbHRlciBsYXllcnMsIChsYXllcikgLT5cbiAgICAgICAgICBoaWVyYXJjaHkgPSBfZ2V0SGllcmFyY2h5KGxheWVyKVxuICAgICAgICAgIGlmIGZyb21MYXllcj9cbiAgICAgICAgICAgIF9tYXRjaChoaWVyYXJjaHksIGZyb21MYXllci5uYW1lKycgJytzZWxlY3RvcilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBfbWF0Y2goaGllcmFyY2h5LCBzZWxlY3RvcilcbiAgZWxzZVxuICAgIGxheWVyc1xuXG5cbiMgR2xvYmFsXG5leHBvcnRzLkZpbmQgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cbmV4cG9ydHMuxpIgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cblxuZXhwb3J0cy5GaW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpXG5leHBvcnRzLsaSxpIgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVxuXG4jIE1ldGhvZHNcbkxheWVyOjpmaW5kICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClbMF1cbkxheWVyOjrGkiAgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApWzBdXG5cbkxheWVyOjpmaW5kQWxsICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClcbkxheWVyOjrGksaSICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKSIsIlxuXG5cbiMgJ0ZpcmViYXNlIFJFU1QgQVBJIENsYXNzJyBtb2R1bGUgdjEuMFxuIyBieSBNYXJjIEtyZW5uLCBNYXkgMzFzdCwgMjAxNiB8IG1hcmMua3Jlbm5AZ21haWwuY29tIHwgQG1hcmNfa3Jlbm5cblxuIyBEb2N1bWVudGF0aW9uIG9mIHRoaXMgTW9kdWxlOiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2tyZW5uL2ZyYW1lci1GaXJlYmFzZVxuIyAtLS0tLS0gOiAtLS0tLS0tIEZpcmViYXNlIFJFU1QgQVBJOiBodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vZG9jcy9yZWZlcmVuY2UvcmVzdC9kYXRhYmFzZS9cblxuXG4jIFRvRG86XG4jIEZpeCBvbkNoYW5nZSBcImNvbm5lY3Rpb25cIiwgYHRoaXPCtCBjb250ZXh0XG5cblxuXG4jIEZpcmViYXNlIFJFU1QgQVBJIENsYXNzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2xhc3MgZXhwb3J0cy5GaXJlYmFzZSBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3NcblxuXG5cblx0Z2V0Q09SU3VybCA9IChzZXJ2ZXIsIHBhdGgsIHNlY3JldCwgcHJvamVjdCkgLT5cblxuXHRcdHN3aXRjaCBVdGlscy5pc1dlYktpdCgpXG5cdFx0XHR3aGVuIHRydWUgdGhlbiB1cmwgPSBcImh0dHBzOi8vI3tzZXJ2ZXJ9I3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9Jm5zPSN7cHJvamVjdH0mc3NlPXRydWVcIiAjIFdlYmtpdCBYU1Mgd29ya2Fyb3VuZFxuXHRcdFx0ZWxzZSAgICAgICAgICAgdXJsID0gXCJodHRwczovLyN7cHJvamVjdH0uZmlyZWJhc2Vpby5jb20je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH1cIlxuXG5cdFx0cmV0dXJuIHVybFxuXG5cblx0QC5kZWZpbmUgXCJzdGF0dXNcIixcblx0XHRnZXQ6IC0+IEBfc3RhdHVzICMgcmVhZE9ubHlcblxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXHRcdEBwcm9qZWN0SUQgPSBAb3B0aW9ucy5wcm9qZWN0SUQgPz0gbnVsbFxuXHRcdEBzZWNyZXQgICAgPSBAb3B0aW9ucy5zZWNyZXQgICAgPz0gbnVsbFxuXHRcdEBzZXJ2ZXIgICAgPSBAb3B0aW9ucy5zZXJ2ZXIgICAgPz0gdW5kZWZpbmVkICMgcmVxdWlyZWQgZm9yIFdlYktpdCBYU1Mgd29ya2Fyb3VuZFxuXHRcdEBkZWJ1ZyAgICAgPSBAb3B0aW9ucy5kZWJ1ZyAgICAgPz0gZmFsc2Vcblx0XHRAX3N0YXR1cyAgICAgICAgICAgICAgICAgICAgICAgID89IFwiZGlzY29ubmVjdGVkXCJcblx0XHRzdXBlclxuXG5cblx0XHRpZiBAc2VydmVyIGlzIHVuZGVmaW5lZFxuXHRcdFx0VXRpbHMuZG9tTG9hZEpTT04gXCJodHRwczovLyN7QHByb2plY3RJRH0uZmlyZWJhc2Vpby5jb20vLnNldHRpbmdzL293bmVyLmpzb25cIiwgKGEsc2VydmVyKSAtPlxuXHRcdFx0XHRwcmludCBtc2cgPSBcIkFkZCBfX19fX18gc2VydmVyOlwiICsgJyAgIFwiJyArIHNlcnZlciArICdcIicgKyBcIiBfX19fXyB0byB5b3VyIGluc3RhbmNlIG9mIEZpcmViYXNlLlwiXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6ICN7bXNnfVwiIGlmIEBkZWJ1Z1xuXG5cblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBDb25uZWN0aW5nIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIC4uLiBcXG4gVVJMOiAnI3tnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKX0nXCIgaWYgQGRlYnVnXG5cdFx0QC5vbkNoYW5nZSBcImNvbm5lY3Rpb25cIlxuXG5cblx0cmVxdWVzdCA9IChwcm9qZWN0LCBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBtZXRob2QsIGRhdGEsIHBhcmFtZXRlcnMsIGRlYnVnKSAtPlxuXG5cdFx0dXJsID0gXCJodHRwczovLyN7cHJvamVjdH0uZmlyZWJhc2Vpby5jb20je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH1cIlxuXG5cblx0XHR1bmxlc3MgcGFyYW1ldGVycyBpcyB1bmRlZmluZWRcblx0XHRcdGlmIHBhcmFtZXRlcnMuc2hhbGxvdyAgICAgICAgICAgIHRoZW4gdXJsICs9IFwiJnNoYWxsb3c9dHJ1ZVwiXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLmZvcm1hdCBpcyBcImV4cG9ydFwiIHRoZW4gdXJsICs9IFwiJmZvcm1hdD1leHBvcnRcIlxuXG5cdFx0XHRzd2l0Y2ggcGFyYW1ldGVycy5wcmludFxuXHRcdFx0XHR3aGVuIFwicHJldHR5XCIgdGhlbiB1cmwgKz0gXCImcHJpbnQ9cHJldHR5XCJcblx0XHRcdFx0d2hlbiBcInNpbGVudFwiIHRoZW4gdXJsICs9IFwiJnByaW50PXNpbGVudFwiXG5cblx0XHRcdGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmRvd25sb2FkIGlzIFwic3RyaW5nXCJcblx0XHRcdFx0dXJsICs9IFwiJmRvd25sb2FkPSN7cGFyYW1ldGVycy5kb3dubG9hZH1cIlxuXHRcdFx0XHR3aW5kb3cub3Blbih1cmwsXCJfc2VsZlwiKVxuXG5cblx0XHRcdHVybCArPSBcIiZvcmRlckJ5PVwiICsgJ1wiJyArIHBhcmFtZXRlcnMub3JkZXJCeSArICdcIicgaWYgdHlwZW9mIHBhcmFtZXRlcnMub3JkZXJCeSAgICAgIGlzIFwic3RyaW5nXCJcblx0XHRcdHVybCArPSBcIiZsaW1pdFRvRmlyc3Q9I3twYXJhbWV0ZXJzLmxpbWl0VG9GaXJzdH1cIiAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmxpbWl0VG9GaXJzdCBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0xhc3Q9I3twYXJhbWV0ZXJzLmxpbWl0VG9MYXN0fVwiICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvTGFzdCAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJnN0YXJ0QXQ9I3twYXJhbWV0ZXJzLnN0YXJ0QXR9XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuc3RhcnRBdCAgICAgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZlbmRBdD0je3BhcmFtZXRlcnMuZW5kQXR9XCIgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmVuZEF0ICAgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZXF1YWxUbz0je3BhcmFtZXRlcnMuZXF1YWxUb31cIiAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lcXVhbFRvICAgICAgaXMgXCJudW1iZXJcIlxuXG5cblx0XHR4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdFxuXHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IE5ldyAnI3ttZXRob2R9Jy1yZXF1ZXN0IHdpdGggZGF0YTogJyN7SlNPTi5zdHJpbmdpZnkoZGF0YSl9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cdFx0eGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gPT5cblxuXHRcdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRcdGlmIHBhcmFtZXRlcnMucHJpbnQgaXMgXCJzaWxlbnRcIiBvciB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiIHRoZW4gcmV0dXJuICMgdWdoXG5cblx0XHRcdHN3aXRjaCB4aHR0cC5yZWFkeVN0YXRlXG5cdFx0XHRcdHdoZW4gMCB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3Qgbm90IGluaXRpYWxpemVkIFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAxIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogU2VydmVyIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDIgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IHJlY2VpdmVkIFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMyB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFByb2Nlc3NpbmcgcmVxdWVzdCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiA0XG5cdFx0XHRcdFx0Y2FsbGJhY2soSlNPTi5wYXJzZSh4aHR0cC5yZXNwb25zZVRleHQpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IGZpbmlzaGVkLCByZXNwb25zZTogJyN7SlNPTi5wYXJzZSh4aHR0cC5yZXNwb25zZVRleHQpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cdFx0XHRpZiB4aHR0cC5zdGF0dXMgaXMgXCI0MDRcIlxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogSW52YWxpZCByZXF1ZXN0LCBwYWdlIG5vdCBmb3VuZCBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cblxuXHRcdHhodHRwLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXG5cdFx0eGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIilcblx0XHR4aHR0cC5zZW5kKGRhdGEgPSBcIiN7SlNPTi5zdHJpbmdpZnkoZGF0YSl9XCIpXG5cblxuXG5cdCMgQXZhaWxhYmxlIG1ldGhvZHNcblxuXHRnZXQ6ICAgIChwYXRoLCBjYWxsYmFjaywgICAgICAgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJHRVRcIiwgICAgbnVsbCwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwdXQ6ICAgIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQVVRcIiwgICAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwb3N0OiAgIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQT1NUXCIsICAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwYXRjaDogIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQQVRDSFwiLCAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRkZWxldGU6IChwYXRoLCBjYWxsYmFjaywgICAgICAgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJERUxFVEVcIiwgbnVsbCwgcGFyYW1ldGVycywgQGRlYnVnKVxuXG5cblxuXHRvbkNoYW5nZTogKHBhdGgsIGNhbGxiYWNrKSAtPlxuXG5cblx0XHRpZiBwYXRoIGlzIFwiY29ubmVjdGlvblwiXG5cblx0XHRcdHVybCA9IGdldENPUlN1cmwoQHNlcnZlciwgXCIvXCIsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRjdXJyZW50U3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0c291cmNlID0gbmV3IEV2ZW50U291cmNlKHVybClcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJvcGVuXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImNvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBDb25uZWN0aW9uIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIGVzdGFibGlzaGVkXCIgaWYgQGRlYnVnXG5cdFx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwiZXJyb3JcIiwgPT5cblx0XHRcdFx0aWYgY3VycmVudFN0YXR1cyBpcyBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0QC5fc3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdGNhbGxiYWNrKFwiZGlzY29ubmVjdGVkXCIpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybiBcIkZpcmViYXNlOiBDb25uZWN0aW9uIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIGNsb3NlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXG5cblx0XHRlbHNlXG5cblx0XHRcdHVybCA9IGdldENPUlN1cmwoQHNlcnZlciwgcGF0aCwgQHNlY3JldCwgQHByb2plY3RJRClcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBMaXN0ZW5pbmcgdG8gY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIEBkZWJ1Z1xuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcInB1dFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwdXRcIiwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGguc3BsaXQoXCIvXCIpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVjZWl2ZWQgY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyB2aWEgJ1BVVCc6ICN7SlNPTi5wYXJzZShldi5kYXRhKS5kYXRhfSBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIEBkZWJ1Z1xuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcInBhdGNoXCIsIChldikgPT5cblx0XHRcdFx0Y2FsbGJhY2soSlNPTi5wYXJzZShldi5kYXRhKS5kYXRhLCBcInBhdGNoXCIsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aCwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQQVRDSCc6ICN7SlNPTi5wYXJzZShldi5kYXRhKS5kYXRhfSBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIEBkZWJ1Z1xuIiwiI2ltcG9ydHNcbml0aW5lcmFyeURhdGEgPSByZXF1aXJlIFwiaXRpbmVyYXJ5XCIgIyMgbW9kdWxlIHdpdGggb2JqZWN0IGNvbnRhaW5pbmcgaXRpbmVyYXJ5SW5mb1xue1RleHRMYXllcn0gPSByZXF1aXJlICdUZXh0TGF5ZXInXG5cbiMgZ2xvYmFsIHZhcmlhYmxlcyAoQDJ4KVxuZ3V0dGVyID0gNDBcbmF2YXRhclNpemUgPSA3MlxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMjIyMjIyMjIyAgICAgICAgSVRJTkVSQVJZIFZJRVcgICAgICAgICAgICAgICAgICAgICAgICAjIyMjIyMjIyMjIyNcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuI2Jhc2Ugdmlld1xuZXhwb3J0cy5pdGluZXJhcnlWaWV3ID0gbmV3IExheWVyXG5cdGhlaWdodDpTY3JlZW4uaGVpZ2h0XG5cdHdpZHRoOlNjcmVlbi53aWR0aFxuXHRuYW1lOlwiSXRpbmVyYXJ5XCJcblx0YmFja2dyb3VuZENvbG9yOiBcInB1cnBsZVwiXG5cbiMgcGFnZXJcbmV4cG9ydHMuaXRpbmVyYXJ5UGFnZXIgPSBuZXcgUGFnZUNvbXBvbmVudFxuXHRzaXplOlNjcmVlbi5zaXplXG5cdGJhY2tncm91bmRDb2xvcjpcIiNFRUVFRUVcIlxuXHRuYW1lOlwiaXRpbmVyYXJ5UGFnZXJcIlxuXHRzY3JvbGxWZXJ0aWNhbDogZmFsc2Vcblx0cGFyZW50OiBAaXRpbmVyYXJ5Vmlld1xuXG5cbiNidWlsZCBpdGluZXJhcnkgcGFnZXNcblxuZm9yIGl0ZW0gaW4gaXRpbmVyYXJ5RGF0YS5pdGluZXJhcnlcblxuXG5cdCMgYWRkIHBhZ2Ugd2l0aCBpbWFnZSBmb3IgZWFjaCBub2RlIGluIGl0aW5lcmFyeSBkYXRhXG5cdGV4cG9ydHMuaXRpblZpZXcgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOlNjcmVlbi53aWR0aFxuXHRcdFx0aGVpZ2h0OlNjcmVlbi5oZWlnaHRcblx0XHRcdGltYWdlOml0ZW0uaW1hZ2Vcblx0XHRcdG5hbWU6IFwiaXRpblBhZ2VfXCIgKyBpdGVtLmRheVxuXG5cdFx0XHQjIGRpbSBpbWFnZSB3aXRoIGdyYWRpZW50XG5cdGdyYWRpZW50TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHNpemU6QGl0aW5lcmFyeVZpZXcuc2l6ZVxuXHRcdFx0cGFyZW50OkBpdGluVmlld1xuXHRcdFx0bmFtZTpcInRpbnRcIlxuXHRncmFkaWVudExheWVyLnN0eWxlLmJhY2tncm91bmQgPSBcIi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgwLDAsMCwuMikgMCUscmdiYSgwLDAsMCwuMzUpIDg1JSxyZ2JhKDAsMCwwLDAuNjUpIDEwMCUpXCJcblxuXG4jIGFkZCBjb250ZW50cyAtIGJ1aWxkIGZyb20gYm90dG9tIHRvIHRvcFxuXG4jZGVzdGluYXRpb24gYXJ0aWNsZSwgdGltZXMsIGRlc3Rpb25hdGlvbiBuYW1lLCBkYXkgbmFtZVxuXG5cdGV4cG9ydHMuZGVzdGluYXRpb25BcnRpY2xlID0gbmV3IExheWVyXG5cdFx0c2l6ZTp7d2lkdGg6U2NyZWVuLndpZHRoLCBoZWlnaHQ6MTYwfVxuXHRcdHk6QWxpZ24uYm90dG9tXG5cdFx0bmFtZTpcImFydGljbGVHcm91cFwiXG5cdFx0YmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIlxuXHRcdHBhcmVudDpAaXRpblZpZXdcblxuXHRleHBvcnRzLmRlc3RBcnRpY2xlQXV0aG9yID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OmF2YXRhclNpemVcblx0XHR3aWR0aDphdmF0YXJTaXplXG5cdFx0Ym9yZGVyUmFkaXVzOmF2YXRhclNpemVcblx0XHRuYW1lOlwiYXJ0aWNsZUF1dGhvclwiXG5cdFx0cGFyZW50OkBkZXN0aW5hdGlvbkFydGljbGVcblx0XHR5OkFsaWduLmNlbnRlclxuXHRcdHg6QWxpZ24ubGVmdChndXR0ZXIpXG5cblx0ZXhwb3J0cy5kaXNjbG9zdXJlSW5kaWNhdG9yID0gbmV3IExheWVyXG5cdFx0aW1hZ2U6XCJpbWFnZXMvaWNuLW1vcmVAMngucG5nXCJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdGhlaWdodDo0MFxuXHRcdHdpZHRoOjI2XG5cdFx0bmFtZTpcIj5cIlxuXHRcdHBhcmVudDpAZGVzdGluYXRpb25BcnRpY2xlXG5cdFx0Y29sb3I6XCJ3aGl0ZVwiXG5cdFx0eDpBbGlnbi5yaWdodCgtMSpndXR0ZXIpXG5cdFx0eTpBbGlnbi5jZW50ZXJcblxuXHRleHBvcnRzLmRlc3RBcnRpY2xlU2VwICA9IG5ldyBMYXllclxuXHRcdHdpZHRoOjY4MFxuXHRcdGhlaWdodDo0XG5cdFx0eDpBbGlnbi5sZWZ0KGd1dHRlcilcblx0XHRuYW1lOlwiLS0tLS1cIlxuXHRcdGltYWdlOlwiaW1hZ2VzL3NlcC1kb3Quc3ZnXCJcblx0XHRwYXJlbnQ6QGRlc3RpbmF0aW9uQXJ0aWNsZVxuXG5cdGV4cG9ydHMuZGVzdGluYXRpb25BcnRpY2xlSGVhZGluZyA9IG5ldyBUZXh0TGF5ZXJcblx0XHR0ZXh0OlwiRGVzdGluYXRpb24gYXJ0aWNsZSBoZWFkZXJcIlxuXHRcdGZvbnRTaXplOjI4XG5cdFx0YXV0b1NpemU6dHJ1ZVxuXHRcdGZvbnRGYW1pbHk6XCJGcnV0aWdlciBMVCBQcm9cIlxuXHRcdGNvbG9yOlwiI2JjYmFiNlwiXG5cdFx0bmFtZTpcImRlc3RBcnRpY2xlSGVhZGVyXCJcblx0XHR0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiXG5cdFx0cGFyZW50OkBkZXN0aW5hdGlvbkFydGljbGVcblx0XHR4OkFsaWduLmxlZnQoQGRlc3RBcnRpY2xlQXV0aG9yLm1heFggKyAyMClcblx0XHR5OkBkZXN0QXJ0aWNsZUF1dGhvci55ICsgNFxuXG5cdGV4cG9ydHMuZGVzdEFydGljbGVBdXRob3JCeWxpbmUgPSBuZXcgVGV4dExheWVyXG5cdFx0dGV4dDpcIkRlc3RpbmF0aW9uIEFydGljbGUgQXV0aG9yXCJcblx0XHRmb250U2l6ZToyNFxuXHRcdGF1dG9TaXplOnRydWVcblx0XHRuYW1lOlwiQnlsaW5lXCJcblx0XHRmb250RmFtaWx5OlwiRnJ1dGlnZXIgTFQgUHJvXCJcblx0XHRjb2xvcjpcIiM3YzdjN2NcIlxuXHRcdHRleHRUcmFuc2Zvcm06IFwiY2FwaXRhbGl6ZVwiXG5cdFx0cGFyZW50OkBkZXN0aW5hdGlvbkFydGljbGVcblx0XHR4OkFsaWduLmxlZnQoQGRlc3RBcnRpY2xlQXV0aG9yLm1heFggKyAyMClcblx0XHR5OkBkZXN0aW5hdGlvbkFydGljbGVIZWFkaW5nLm1heFlcblxuIyBcdCNhZGQgdmlld3MgZm9yIGVhY2ggdGltZSBpbiBkYXRhLCBhZGQgdG8gYW4gYXJyYXlcblx0ZXhwb3J0cy50aW1lc0dyb3VwID0gbmV3IExheWVyXG5cdFx0cGFyZW50OkBpdGluVmlld1xuXHRcdHg6QWxpZ24ubGVmdFxuXHRcdG5hbWU6XCJpdGluZXJhcnlUaW1lc0dyb3VwXCJcblx0XHR3aWR0aDpTY3JlZW4ud2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cbiMgaXRlcmF0ZSB0aHJvdWdoIHRpbWVzIGFycmF5LCBjcmVhdGUgYnVsbGV0cyBmb3IgZWFjaCB0aW1lICh0cmF2ZWwgZGF0YSlcblx0Y3VycmVudE1heFkgPSAwXG5cdHRvdGFsSGVpZ2h0ID0gMFxuXG5cdGZvciB0aW1lLCBpIGluIGl0ZW0udHJhdmVsRGF0YVxuXG5cdFx0ZXhwb3J0cy5lbnRyeUdyb3VwID0gbmV3IExheWVyXG5cdFx0XHRwYXJlbnQ6QHRpbWVzR3JvdXBcblx0XHRcdHg6QWxpZ24ubGVmdCg0MClcblx0XHRcdG5hbWU6XCJ0aW1lRW50cnlHcm91cFwiXG5cdFx0XHR3aWR0aDpTY3JlZW4ud2lkdGggLSAyNDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblxuXHRcdGV4cG9ydHMudGltZUVudHJ5QnVsbGV0ID0gbmV3IExheWVyXG5cdFx0XHRpbWFnZTpcImltYWdlcy9nci1hcnJvdy1jYWxsb3V0QDJ4LnBuZ1wiXG5cdFx0XHR4OjBcblx0XHRcdG5hbWU6XCItLS0+XCJcblx0XHRcdHdpZHRoOjUyXG5cdFx0XHRoZWlnaHQ6MTZcblx0XHRcdHBhcmVudDpAZW50cnlHcm91cFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIlxuXG5cdFx0ZXhwb3J0cy50aW1lRW50cnlUZXh0ID0gbmV3IFRleHRMYXllclxuXHRcdFx0XHR0ZXh0OnRpbWVcblx0XHRcdFx0bmFtZTp0aW1lXG5cdFx0XHRcdHg6QHRpbWVFbnRyeUJ1bGxldC5tYXhYICsgOFxuXHRcdFx0XHR3aWR0aDpTY3JlZW4ud2lkdGggLSAyODBcblx0XHRcdFx0YXV0b1NpemVIZWlnaHQ6dHJ1ZVxuXHRcdFx0XHRmb250U2l6ZTozMlxuXHRcdFx0XHRmb250V2VpZ2h0OjIwMFxuXHRcdFx0XHRmb250RmFtaWx5OlwiRnJ1dGlnZXIgTFQgUHJvXCJcblx0XHRcdFx0Y29sb3I6XCJ3aGl0ZVwiXG5cdFx0XHRcdHBhcmVudDpAZW50cnlHcm91cFxuXG5cdFx0QGVudHJ5R3JvdXAuaGVpZ2h0ID0gQHRpbWVFbnRyeVRleHQuaGVpZ2h0XG5cdFx0QGVudHJ5R3JvdXAueSA9IGN1cnJlbnRNYXhZXG5cdFx0Y3VycmVudE1heFkgPSBAZW50cnlHcm91cC5tYXhZICsgOFxuXHRcdHRvdGFsSGVpZ2h0ID0gY3VycmVudE1heFlcblx0XHRAdGltZUVudHJ5QnVsbGV0LnkgPSBAdGltZUVudHJ5VGV4dC55ICsgOFxuXHRcdEB0aW1lc0dyb3VwLmhlaWdodCA9IHRvdGFsSGVpZ2h0XG5cdFx0QHRpbWVzR3JvdXAubWF4WSA9IEBkZXN0aW5hdGlvbkFydGljbGUueSAtIDIwXG5cblx0ZXhwb3J0cy5kZXN0aW5hdGlvblRpdGxlID0gbmV3IFRleHRMYXllclxuXHRcdHRleHQ6IGl0ZW0uZGVzdGluYXRpb25OYW1lXG5cdFx0bmFtZTppdGVtLmRlc3RpbmF0aW9uTmFtZVxuXHRcdHBhcmVudDpAaXRpblZpZXdcblx0XHR3aWR0aDpTY3JlZW4ud2lkdGggLSAxMDBcblx0XHR4OkFsaWduLmxlZnQoMzApXG5cdFx0YXV0b1NpemVIZWlnaHQ6dHJ1ZVxuXHRcdGZvbnRTaXplOjkyXG5cdFx0bGluZUhlaWdodDoxXG5cdFx0Zm9udFdlaWdodDo3MDBcblx0XHRsZXR0ZXJTcGFjaW5nOi0zXG5cdFx0dGV4dFRyYW5zZm9ybTpcInVwcGVyY2FzZVwiXG5cdFx0Zm9udEZhbWlseTpcIkZydXRpZ2VyIExUIFByb1wiXG5cdFx0Y29sb3I6XCJ3aGl0ZVwiXG5cdEBkZXN0aW5hdGlvblRpdGxlLm1heFkgPSBAdGltZXNHcm91cC55XG5cblx0ZXhwb3J0cy5kYXlUaXRsZSA9IG5ldyBUZXh0TGF5ZXJcblx0XHR0ZXh0OiBpdGVtLmRheVxuXHRcdHBhcmVudDpAaXRpblZpZXdcblx0XHR3aWR0aDpTY3JlZW4ud2lkdGggLSAxMDBcblx0XHR4OkFsaWduLmxlZnQoMzApXG5cdFx0YXV0b1NpemVIZWlnaHQ6dHJ1ZVxuXHRcdGZvbnRTaXplOjM2XG5cdFx0bGluZUhlaWdodDoxXG5cdFx0Zm9udFdlaWdodDozMDBcblx0XHRmb250RmFtaWx5OlwiRnJ1dGlnZXIgTFQgUHJvXCJcblx0XHRjb2xvcjpcIndoaXRlXCJcblx0QGRheVRpdGxlLm1heFkgPSBAZGVzdGluYXRpb25UaXRsZS55ICsgLTE2XG5cdEBpdGluZXJhcnlQYWdlci5hZGRQYWdlKEBpdGluVmlldywgXCJyaWdodFwiKVxuXG5cdCMgbWFpbiBhY3Rpb25zXG5leHBvcnRzLm1haW5BY3Rpb25zID0gbmV3IExheWVyXG5cdHdpZHRoOjEwMFxuXHRoZWlnaHQ6NzAwXG5cdHk6NTVcblx0eDpBbGlnbi5yaWdodCgtMSogZ3V0dGVyKVxuXHRwYXJlbnQ6QGl0aW5lcmFyeVZpZXdcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0bmFtZTpcIm1haW5BY3Rpb25zXCJcblxuQG1haW5BY3Rpb25zLnN0YXRlcy5hZGRcblx0b3JhbmdlOlxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJvcmFuZ2VcIlxuXG5leHBvcnRzLmJ0bl9wcm9maWxlID0gbmV3IExheWVyXG5cdHBhcmVudDpAbWFpbkFjdGlvbnNcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aW1hZ2U6XCJpbWFnZXMvaWNuLXByb2ZpbGUtY29weUAyeC5wbmdcIlxuXHR3aWR0aDpAbWFpbkFjdGlvbnMud2lkdGhcblx0aGVpZ2h0OiBAbWFpbkFjdGlvbnMud2lkdGhcblx0bmFtZTpcImJ0bl9wcm9maWxlXCJcblxuXG5leHBvcnRzLmJ0bl9jaGF0ID0gbmV3IExheWVyXG5cdHBhcmVudDpAbWFpbkFjdGlvbnNcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aW1hZ2U6XCJpbWFnZXMvaWNuLWNoYXQuc3ZnXCJcblx0d2lkdGg6QG1haW5BY3Rpb25zLndpZHRoXG5cdGhlaWdodDogQG1haW5BY3Rpb25zLndpZHRoXG5cdHk6IEBidG5fcHJvZmlsZS5tYXhZICsgMjhcblx0bmFtZTpcImJ0bl9jaGF0XCJcblxuZXhwb3J0cy5idG5fcmVzdGF1cmFudCA9IG5ldyBMYXllclxuXHRwYXJlbnQ6QG1haW5BY3Rpb25zXG5cdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdGltYWdlOlwiaW1hZ2VzL2ljbi1yZXN0YXVyYW50LWNvcHlAMngucG5nXCJcblx0d2lkdGg6QG1haW5BY3Rpb25zLndpZHRoXG5cdGhlaWdodDogQG1haW5BY3Rpb25zLndpZHRoXG5cdHk6IEBidG5fY2hhdC5tYXhZICsgMjhcblx0bmFtZTpcImJ0bl9yZXN0YXVyYW50XCJcblxuZXhwb3J0cy5idG5fcmVzZXJ2YXRpb25zID0gbmV3IExheWVyXG5cdHBhcmVudDpAbWFpbkFjdGlvbnNcblx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0aW1hZ2U6XCJpbWFnZXMvaWNuLXJlc2VydmF0aW9ucy1jb3B5QDJ4LnBuZ1wiXG5cdHdpZHRoOkBtYWluQWN0aW9ucy53aWR0aFxuXHRoZWlnaHQ6IEBtYWluQWN0aW9ucy53aWR0aFxuXHR5OiBAYnRuX3Jlc3RhdXJhbnQubWF4WSArIDI4XG5cdG5hbWU6XCJidG5fcmVzZXJ2YXRpb25zXCJcblxuIyBidG5fcHJvZmlsZS5vbiBFdmVudHMuQ2xpY2ssIC0+XG4jIFx0bWFpbkFjdGlvbnMuc3RhdGVzLm5leHQoKVxuIiwiZXhwb3J0cy5pdGluZXJhcnkgPSBbXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyAxXCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJIYW1idXJnXCJcbiAgICAgIHRyYXZlbERhdGE6W1wiQWxsZSBhbiBCb3JkIHVtIDE3OjAwXCIsXCJXZWl0ZXJmYWhydCBuYWNoIFNvdXRoYW1wdG9uIHVtIDE4OjAwXCJdXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctaGFtYnVyZ0AyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgMlwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiQXVmIFNlZVwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IGluIFNvdXRoYW1wdG9uIE1vcmdlbiB1bSA5OjMwXCJdXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctc2VhZGF5QDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyAzXCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJMb25kb24gLyBTb3V0aGFtcHRvblwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IHVtIDk6MzBcIixcIkFsbGUgYW4gQm9yZCB1bSAyMDozMFwiLFwiV2VpdGVyZmFocnQgbmFjaCBQYXJpcyAvIExlSGF2cmUgdW0gMjE6MzBcIl1cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1zb3V0aGFtcHRvbkAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgNFwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiUGFyaXMgLyBMZUhhdnJlXCJcbiAgICAgIHRyYXZlbERhdGE6IFtcIkFua3VuZnQgdW0gNzowMFwiLFwiQWxsZSBhbiBCb3JkIHVtIDE4OjAwXCIsXCJXZWl0ZXJmYWhydCBuYWNoIFplZWJyw7xnZ2UgdW0gMTk6MDBcIl1cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1sZWhhdnJlLTFAMngucG5nXCJcbiAgICAgfSxcbiAgICAge1xuICAgICAgZGF5OlwiVGFnIDVcIlxuICAgICAgZGVzdGluYXRpb25OYW1lOiBcIkJyw7xzc2VsIC8gWmVlYnLDvGdnZVwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IHVtIDEwOjAwXCIsXCJBbGxlIGFuIEJvcmQgdW0gMTg6MDBcIixcIldlaXRlcmZhaHJ0IG5hY2ggUm90dGVyZGFtIHVtIDE5OjAwXCJdXG5cblxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLWJydWdnZS0yQDJ4LnBuZ1wiXG4gICAgIH0sXG4gICAgIHtcbiAgICAgIGRheTpcIlRhZyA2XCJcbiAgICAgIGRlc3RpbmF0aW9uTmFtZTogXCJSb3R0ZXJkYW1cIlxuICAgICAgdHJhdmVsRGF0YTogW1wiQW5rdW5mdCB1bSA4OjAwXCIsXCJBbGxlIGFuIEJvcmQgbW9yZ2VuIHVtIDU6MDBcIixcIldlaXRlcmZhaHJ0IG5hY2ggSGFtYnVyZyB1bSA2OjAwXCJdXG5cbiAgICAgIGltYWdlOlwiaW1hZ2VzL2ltZy1yb3R0ZXJkYW0tMkAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgN1wiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiQXVmIFNlZVwiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IGluIEhhbWJ1cmcgTW9yZ2VuIHVtIDY6MDBcIl1cblxuICAgICAgaW1hZ2U6XCJpbWFnZXMvaW1nLXNlYWRheUAyeC5wbmdcIlxuICAgICB9LFxuICAgICB7XG4gICAgICBkYXk6XCJUYWcgOFwiXG4gICAgICBkZXN0aW5hdGlvbk5hbWU6IFwiSGFtYnVyZ1wiXG4gICAgICB0cmF2ZWxEYXRhOiBbXCJBbmt1bmZ0IGluIEhhbWJ1cmcgdW0gNjowMFwiLFwiQWxsZSB2b24gQm9yZCB1bSA4OjAwXCJdXG4gICAgICBpbWFnZTpcImltYWdlcy9pbWctaGFtYnVyZ0AyeC5wbmdcIlxuICAgICB9LFxuXVxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsIiMgVGhpcyBpcyBhIHVzZXJzIGZpbGVcbmV4cG9ydHMudXNlcnMgPSBbXG4gICAgIHtcbiAgICAgIHVzZXJOYW1lOlwiSm9obm55MTMzMlwiXG4gICAgICB1c2VySGFuZGxlOiBcImFsbCBhcm91bmQgZ29vZCBndXlcIlxuICAgICAgaXNBdmFpbGFibGU6IHRydWVcbiAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzAxLnBuZ1wiXG4gICAgICBpc0NyZXc6IGZhbHNlXG4gICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbiAgICAge1xuICAgICAgIHVzZXJOYW1lOlwiUGF0dHk5OTNcIlxuICAgICAgIHVzZXJIYW5kbGU6IFwiQ3VzdG9tZXIgU2VydmljZSBBZ2VudFwiXG4gICAgICAgaXNBdmFpbGFibGU6IGZhbHNlXG4gICAgICAgaXNPbmxpbmU6IGZhbHNlXG4gICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwMi5wbmdcIlxuICAgICAgIGlzQ3JldzogdHJ1ZVxuICAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICB1c2VyTmFtZTpcIkFhcm9uX2dUaGF0c01lXCJcbiAgICAgIHVzZXJIYW5kbGU6IFwiU29tZSB0YWdsaW5lXCJcbiAgICAgIGlzQXZhaWxhYmxlOiB0cnVlXG4gICAgICBpc09ubGluZTogdHJ1ZVxuICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwMy5wbmdcIlxuICAgICAgaXNDcmV3OiBmYWxzZVxuICAgICAgaXNDb2NydWlzZXI6IGZhbHNlXG4gICAgIH0sXG4gICAgIHtcbiAgICAgICB1c2VyTmFtZTpcIkR1ZGVPblRoZUZseVwiXG4gICAgICAgdXNlckhhbmRsZTogXCJcIlxuICAgICAgIGlzQXZhaWxhYmxlOiBmYWxzZVxuICAgICAgIGlzT25saW5lOiB0cnVlXG4gICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwNC5wbmdcIlxuICAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcblxuICAgICB9LFxuICAgICB7XG4gICAgICB1c2VyTmFtZTpcIkZseU9uVGhlRHVkZVwiXG4gICAgICB1c2VySGFuZGxlOiBcIlwiXG4gICAgICBpc0F2YWlsYWJsZTogdHJ1ZVxuICAgICAgaXNPbmxpbmU6IHRydWVcbiAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDUucG5nXCJcbiAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICAgdXNlck5hbWU6XCJXSFlNRTIyMzNcIlxuICAgICAgIHVzZXJIYW5kbGU6IFwiXCJcbiAgICAgICBpc0F2YWlsYWJsZTogZmFsc2VcbiAgICAgICBpc09ubGluZTogZmFsc2VcbiAgICAgICBwcm9maWxlSW1hZ2U6XCJpbWFnZXMvcHJvZkltZzA2LnBuZ1wiXG4gICAgICAgaXNDcmV3OiBmYWxzZVxuICAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICB1c2VyTmFtZTpcIkp1c3RSYXBoYWVsXCJcbiAgICAgIHVzZXJIYW5kbGU6IFwiYWxsIGFyb3VuZCBnb29kIGd1eVwiXG4gICAgICBpc0F2YWlsYWJsZTogdHJ1ZVxuICAgICAgaXNPbmxpbmU6IHRydWVcbiAgICAgIHByb2ZpbGVJbWFnZTpcImltYWdlcy9wcm9mSW1nMDcucG5nXCJcbiAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgIGlzQ29jcnVpc2VyOiBmYWxzZVxuICAgICB9LFxuICAgICB7XG4gICAgICAgdXNlck5hbWU6XCJKb25pZWxGcm9tVGhlQmxvY2tcIlxuICAgICAgIHVzZXJIYW5kbGU6IFwiQ3VzdG9tZXIgU2VydmljZSBBZ2VudFwiXG4gICAgICAgaXNBdmFpbGFibGU6IGZhbHNlXG4gICAgICAgaXNPbmxpbmU6IGZhbHNlXG4gICAgICAgcHJvZmlsZUltYWdlOlwiaW1hZ2VzL3Byb2ZJbWcwOC5wbmdcIlxuICAgICAgIGlzQ3JldzogZmFsc2VcbiAgICAgICBpc0NvY3J1aXNlcjogZmFsc2VcbiAgICAgfSxcbl1cbiJdfQ==
