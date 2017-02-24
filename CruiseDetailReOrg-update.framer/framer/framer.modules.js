require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StickyHeaders":[function(require,module,exports){

/*
StickyHeaders for FramerJS
Created by @72mena
 */
exports.StickyHeaders = (function() {
  function StickyHeaders() {}

  StickyHeaders.enableFor = function(sC) {
    var _dataSH, _stickyHeaders, i, j, layer, len;
    _stickyHeaders = [];
    _dataSH = [];
    _stickyHeaders = sC.content.children[0].childrenWithName("StickyHeader");
    if (_stickyHeaders.length > 0) {
      for (i = j = 0, len = _stickyHeaders.length; j < len; i = ++j) {
        layer = _stickyHeaders[i];
        _dataSH.push(layer.y);
      }
    }
    return sC.content.on("change:y", function() {
      var _fixedY, _prevMaxY, _prevStickyPosition, _thisY, k, len1, results;
      if (_stickyHeaders.length > 0) {
        results = [];
        for (i = k = 0, len1 = _stickyHeaders.length; k < len1; i = ++k) {
          layer = _stickyHeaders[i];
          layer.y = _dataSH[i];
          _thisY = _dataSH[i] - sC.scrollY;
          _fixedY = _dataSH[i] + -_thisY;
          if (i === 0) {
            if (_thisY <= 0) {
              layer.y = _fixedY;
            }
          }
          if (i > 0) {
            _prevStickyPosition = _dataSH[i] - _stickyHeaders[i - 1].height;
            _prevMaxY = _stickyHeaders[i - 1].height;
            if (_thisY < _prevMaxY) {
              _stickyHeaders[i - 1].y = _prevStickyPosition;
            }
            if (_thisY <= 0) {
              results.push(layer.y = _fixedY);
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    });
  };

  return StickyHeaders;

})();


},{}],"TextLayer":[function(require,module,exports){
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


},{}],"contentModel":[function(require,module,exports){
exports.detailContent = [
  {
    navName: "T2",
    headline: "Mediterranean Sea with Costa Diadema",
    isInNav: false,
    sections: ["OverviewP1", "OverviewP1", "The Destinations", "Costa Diadema", "Life on Board", "Cruise Dates and Prices", "Special Offers"]
  }, {
    navName: "Destinations",
    headline: "DESTINATIONS",
    isInNav: true,
    sections: ["map", "day detail", "what's included"]
  }, {
    navName: "Costa Diadema",
    headline: "COSTA DIADEMA",
    isInNav: true,
    sections: ["shipPhoto", "facts", "accomodations", "safety"]
  }, {
    navName: "Life on Board",
    headline: "LIFE ON BOARD",
    isInNav: true,
    sections: ["overview", "dining", "spa and wellness", "kids and families", "nightlife", "events"]
  }, {
    navName: "Cruise Dates and Prices",
    headline: "LIFE ON BOARD",
    isInNav: true,
    sections: ["dates interaction"]
  }, {
    navName: "Special Deals",
    headline: "LIFE ON BOARD",
    isInNav: true,
    sections: ["deal 1", "deal 2"]
  }
];


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


},{}],"framerKit":[function(require,module,exports){

/*
  FramerKit for Framer
  https://github.com/raphdamico/framerKit

  Copyright (c) 2015, Raph D'Amico http://raphdamico.com (@raphdamico)
  MIT License

  Readme:
  https://github.com/raphdamico/framerKit

  License:
  https://github.com/raphdamico/framerKit/blob/master/LICENSE.md
 */

/*
	DEFAULT STYLES
	Note the screenwidth constant: this is probably one of the
	first things you want to change so it matches the device
	you're prototyping on.
 */
var Caret, Check, Cross, Drum, Switch, defaults, quantize;

defaults = {
  screenWidth: 750
};


/*
	MORE STYLES
 */

defaults.tableRowHeight = 88;

defaults.tableRowHorizontalPadding = 20;

defaults.tint = 'grey';

defaults.lineTint = "rgba(200,200,200,1)";

defaults.switchTint = '#1DC24B';

defaults.itemBackground = 'white';

defaults.listItemTextStyle = {
  fontSize: "32px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
};

defaults.dividerItemTextStyle = {
  fontSize: "22px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200",
  textTransform: 'uppercase'
};

defaults.pickerTextStyle = {
  fontSize: "42px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
};

exports.defaults = defaults;


/*
	TABLE VIEW ELEMENTS
	(e.g. "Thumb" for the switch control)
 */

Switch = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius;
  params = params || {};
  _.defaults(params, {
    switchTint: defaults.switchTint,
    screenWidth: defaults.screenWidth,
    tableRowHeight: defaults.tableRowHeight,
    switchContainerBorder: 4,
    switchContainerHeight: 54,
    switchContainerWidth: 94,
    borderColor: defaults.lineTint
  });
  this.selected = true;
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.switchButtonContainer = new Layer({
    x: 0,
    y: 0,
    clip: false,
    width: params.switchContainerWidth,
    height: params.switchContainerHeight,
    backgroundColor: "",
    opacity: 1
  });
  this.switchBackground = new Layer({
    x: switchButtonRadius - shrunkenBackgroundDiameter / 2,
    y: switchButtonRadius - shrunkenBackgroundDiameter / 2 - 4,
    width: params.switchContainerWidth - params.switchContainerHeight + shrunkenBackgroundDiameter,
    height: params.switchContainerHeight - params.switchContainerHeight + shrunkenBackgroundDiameter,
    borderRadius: params.switchContainerHeight,
    shadowSpread: switchButtonRadius - shrunkenBackgroundDiameter / 2 + params.switchContainerBorder,
    shadowColor: params.switchTint,
    backgroundColor: '',
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchButton = new Layer({
    x: params.switchContainerWidth - params.switchContainerHeight,
    y: -4,
    width: switchButtonRadius * 2,
    height: switchButtonRadius * 2,
    borderRadius: switchButtonRadius,
    shadowY: 3,
    shadowBlur: 5,
    shadowColor: 'rgba(0,0,0,0.3)',
    backgroundColor: "white",
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchBackground.states.add({
    deselected: {
      x: 0,
      y: -4,
      width: params.switchContainerWidth,
      height: params.switchContainerHeight,
      shadowSpread: params.switchContainerBorder,
      saturate: 0,
      brightness: 153,
      backgroundColor: ""
    }
  });
  this.switchBackground.states.animationOptions = {
    curve: "ease-in-out",
    time: 0.3
  };
  this.switchBackground.on(Events.AnimationEnd, (function(_this) {
    return function() {
      return Utils.delay(0, function() {
        if (_this.selected) {
          return _this.switchBackground.backgroundColor = params.switchTint;
        }
      });
    };
  })(this));
  this.switchBackground.on(Events.AnimationStart, (function(_this) {
    return function() {
      return _this.switchBackground.backgroundColor = '';
    };
  })(this));
  this.switchButton.states.add({
    deselected: {
      x: 0
    }
  });
  this.switchButton.states.animationOptions = {
    curve: "spring(400,25,0)"
  };
  this.switchButtonContainer.select = (function(_this) {
    return function() {
      _this.selected = true;
      _this.switchBackground.states["switch"]("default");
      return _this.switchButton.states["switch"]("default");
    };
  })(this);
  this.switchButtonContainer.deselect = (function(_this) {
    return function() {
      _this.selected = false;
      _this.switchBackground.states["switch"]("deselected");
      return _this.switchButton.states["switch"]("deselected");
    };
  })(this);
  if (this.selected === false) {
    this.switchBackground.states.switchInstant("deselected");
    this.switchButton.states.switchInstant("deselected");
  } else {
    this.switchBackground.backgroundColor = params.switchTint;
  }
  return this.switchButtonContainer;
};

Cross = function() {
  var color, cross, crossDownstroke, crossThickness, crossUpstroke;
  color = defaults.tint;
  crossThickness = 4;
  cross = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  crossUpstroke = new Layer({
    height: crossThickness,
    width: 20,
    backgroundColor: color,
    originX: 1,
    superLayer: cross
  });
  crossUpstroke.y = 14;
  crossUpstroke.rotationZ = 45;
  crossDownstroke = new Layer({
    height: crossThickness,
    width: 20,
    originX: 1,
    backgroundColor: color,
    superLayer: cross
  });
  crossDownstroke.rotationZ = -45;
  cross.select = function() {
    return cross.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  cross.deselect = function() {
    return cross.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return cross;
};

Caret = function() {
  var caret, caretDownstroke, caretThickness, caretUpstroke, color;
  color = defaults.tint;
  caretThickness = 4;
  caret = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  caretUpstroke = new Layer({
    height: caretThickness,
    width: 18,
    backgroundColor: color,
    originX: 1,
    superLayer: caret
  });
  caretUpstroke.y = 14;
  caretUpstroke.rotationZ = 45;
  caretDownstroke = new Layer({
    height: caretThickness,
    width: 18,
    originX: 1,
    backgroundColor: color,
    superLayer: caret
  });
  caretDownstroke.y = 12;
  caretDownstroke.rotationZ = -45;
  caret.select = function() {
    return caret.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  caret.deselect = function() {
    return caret.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return caret;
};

Check = function() {
  var check, checkDownstroke, checkThickness, checkUpstroke, color;
  color = defaults.tint;
  checkThickness = 4;
  check = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  checkUpstroke = new Layer({
    height: checkThickness,
    width: 13,
    backgroundColor: color,
    originX: 1,
    superLayer: check
  });
  checkUpstroke.y = 16;
  checkUpstroke.rotationZ = 45;
  checkDownstroke = new Layer({
    height: checkThickness,
    width: 22,
    originX: 1,
    backgroundColor: color,
    superLayer: check
  });
  checkDownstroke.x = 4;
  checkDownstroke.rotationZ = -45;
  check.select = function() {
    return check.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  check.deselect = function() {
    return check.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return check;
};


/*
	TABLE VIEW
	
	--------------------------------------
	TableViewRow		[Elements go here]
	--------------------------------------
 */

exports.TableViewRow = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius, thingToSwitch;
  _.defaults(params, {
    name: 'Give me a name!',
    x: 0,
    y: 0,
    enabled: true,
    selected: true,
    icon: 'check',
    textColor: defaults.tint,
    switchTint: defaults.switchTint,
    firstItemInList: true,
    lastItemInList: true,
    screenWidth: defaults.screenWidth,
    tableRowHorizontalPadding: defaults.tableRowHorizontalPadding,
    tableRowHeight: defaults.tableRowHeight,
    borderColor: defaults.lineTint
  });
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.listItemContainer = new Layer({
    x: params.x,
    y: params.y,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    clip: false,
    backgroundColor: defaults.itemBackground
  });
  this.listItemContainer.style = {
    borderTop: params.firstItemInList ? "1px solid " + params.borderColor : "",
    borderBottom: params.lastItemInList ? "1px solid " + params.borderColor : ""
  };
  this.enabled = params.enabled;
  this.selected = params.selected;
  this.listItem = new Layer({
    x: params.tableRowHorizontalPadding,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    superLayer: this.listItemContainer,
    backgroundColor: 'none'
  });
  this.listItem.style = defaults.listItemTextStyle;
  this.listItem.style = {
    color: params.textColor,
    borderTop: params.firstItemInList ? "" : "1px solid " + params.borderColor
  };
  this.listItem.html = params.name;
  thingToSwitch = (function() {
    switch (false) {
      case params.icon !== 'check':
        return new Check();
      case params.icon !== 'cross':
        return new Cross();
      case params.icon !== 'caret':
        return new Caret();
      case params.icon !== 'switch':
        return new Switch();
    }
  })();
  thingToSwitch.superLayer = this.listItemContainer;
  thingToSwitch.x = defaults.screenWidth - thingToSwitch.width - defaults.tableRowHorizontalPadding;
  thingToSwitch.centerY(2);
  if (params.icon === 'switch') {
    thingToSwitch.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  } else {
    this.listItem.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  }
  this.listItemContainer["switch"] = (function(_this) {
    return function() {
      if (_this.selected) {
        return _this.listItemContainer.deselect();
      } else {
        return _this.listItemContainer.select();
      }
    };
  })(this);
  this.listItemContainer.select = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.select();
        _this.selected = true;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.deselect = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.deselect();
        _this.selected = false;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.updateLabel = (function(_this) {
    return function(newText) {
      return _this.listItem.html = newText;
    };
  })(this);
  this.listItemContainer.selected = (function(_this) {
    return function() {
      return _this.selected;
    };
  })(this);
  this.listItemContainer.updateLabel(params.name);
  return this.listItemContainer;
};

exports.TableView = function(params) {
  var attachDefaultValidation, attachRadioButtonValidation, buttonName, firstItemInList, i, j, lastItemInList, len, newButton, ref;
  params = params || {};
  _.defaults(params, {
    y: 0,
    width: defaults.screenWidth,
    items: ["It's just me!"],
    icon: 'check',
    validation: 'none'
  });
  this.buttonGroupContainer = new Layer({
    x: 0,
    y: params.y,
    width: params.width,
    height: defaults.tableRowHeight * params.items.length,
    backgroundColor: "none"
  });
  this.buttonArray = [];
  ref = params.items;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    buttonName = ref[i];
    firstItemInList = i === 0 ? true : false;
    lastItemInList = i === (params.items.length - 1) ? true : false;
    newButton = new exports.TableViewRow({
      x: 0,
      y: i * defaults.tableRowHeight,
      name: buttonName,
      icon: params.icon,
      firstItemInList: firstItemInList,
      lastItemInList: lastItemInList
    });
    this.buttonArray.push(newButton);
    newButton.superLayer = this.buttonGroupContainer;
  }
  attachRadioButtonValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var l, len2, otherButton, otherButtonIndex;
              for (otherButtonIndex = l = 0, len2 = buttonArray.length; l < len2; otherButtonIndex = ++l) {
                otherButton = buttonArray[otherButtonIndex];
                if (otherButtonIndex !== indexOfButtonClicked) {
                  otherButton.deselect({
                    suppressEvents: true
                  });
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: indexOfButtonClicked,
                numSelected: 1,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  attachDefaultValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var button, l, len2, numSelected, tableViewStates;
              numSelected = 0;
              tableViewStates = [];
              for (l = 0, len2 = buttonArray.length; l < len2; l++) {
                button = buttonArray[l];
                tableViewStates.push(button.selected());
                if (button.selected()) {
                  numSelected++;
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: tableViewStates,
                numSelected: numSelected,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  if (params.validation === 'radio') {
    attachRadioButtonValidation(this.buttonArray);
  } else {
    attachDefaultValidation(this.buttonArray);
  }
  return this.buttonGroupContainer;
};


/*
	TABLE VIEW HEADER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

exports.TableViewHeader = function(params) {
  var listDivider;
  params = params || {};
  _.defaults(params, {
    text: 'I am a divider',
    x: 0,
    y: 0
  });
  listDivider = new Layer({
    x: params.x + defaults.tableRowHorizontalPadding,
    y: params.y,
    width: defaults.screenWidth,
    backgroundColor: 'none'
  });
  listDivider.html = params.text;
  listDivider.style = defaults.dividerItemTextStyle;
  listDivider.style = {
    color: defaults.tint
  };
  return listDivider;
};


/*
	PICKER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

quantize = function(input, stepSize) {
  return Math.floor(input / stepSize) * stepSize;
};

Drum = function(parentDrumLayer, drumName, listItems, params) {
  var drumContainerHeight, firstTouchAvailable, i, intervalToupdateDrumAppearance, j, len, li, listHeight, listItemLayer, listLayer, listMaxYPos, listMinYPos, stopDrum, updateDrumAppearance, updateDrumValues;
  this.parentDrumLayer = parentDrumLayer;
  params = params || {};
  _.defaults(params, {
    enabled: true,
    xPct: 0,
    widthPct: 1,
    textAlign: "center",
    textPadding: "0",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  listItems = listItems;
  this.name = drumName;
  this.index = 0;
  this.val = listItems[this.index];
  this.velocity = 0;
  firstTouchAvailable = true;
  intervalToupdateDrumAppearance = 0;
  listMinYPos = -defaults.tableRowHeight / 2;
  listMaxYPos = -listItems.length * defaults.tableRowHeight + defaults.tableRowHeight / 2;
  listHeight = listItems.length * defaults.tableRowHeight + drumContainerHeight;
  this.drumContainer = new Layer({
    x: params.xPct * defaults.screenWidth,
    y: 0,
    width: params.widthPct * defaults.screenWidth,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: parentDrumLayer
  });
  listLayer = new Layer({
    x: 0,
    y: -defaults.tableRowHeight / 2,
    width: params.widthPct * defaults.screenWidth,
    height: listHeight,
    superLayer: this.drumContainer,
    backgroundColor: "none"
  });
  listLayer.draggable.enabled = params.enabled;
  listLayer.draggable.speedX = 0;
  for (i = j = 0, len = listItems.length; j < len; i = ++j) {
    li = listItems[i];
    listItemLayer = new Layer({
      x: 0,
      y: i * defaults.tableRowHeight + drumContainerHeight / 2,
      width: params.widthPct * defaults.screenWidth,
      height: defaults.tableRowHeight,
      superLayer: listLayer,
      backgroundColor: "none"
    });
    listItemLayer.html = li;
    listItemLayer.style = {
      color: params.textColor,
      fontFamily: defaults.pickerTextStyle.fontFamily,
      fontWeight: defaults.pickerTextStyle.fontWeight,
      fontSize: defaults.pickerTextStyle.fontSize,
      lineHeight: defaults.tableRowHeight + "px",
      textAlign: params.textAlign,
      padding: params.textPadding
    };
    listItemLayer.startY = i * defaults.tableRowHeight + drumContainerHeight / 2;
  }
  listLayer.on(Events.DragMove, (function(_this) {
    return function() {
      if (firstTouchAvailable) {
        _this.drumContainer.emit("DrumStartedMoving", {
          drum: drumName,
          index: _this.index,
          value: _this.val,
          velocity: 0
        });
        firstTouchAvailable = false;
      }
      return updateDrumAppearance();
    };
  })(this));
  listLayer.on(Events.DragEnd, (function(_this) {
    return function(e, f) {
      var bottomOverflow, distanceToTravel, finalPositionAfterMomentum, listHeightWithoutEndBuffer, newDistanceToTravel, overflowDampening, scrollVelocity, timeAfterDrag, topOverflow;
      firstTouchAvailable = true;
      scrollVelocity = listLayer.draggable.calculateVelocity().y;
      timeAfterDrag = (0.5 + Math.abs(scrollVelocity * 0.2)).toFixed(1);
      finalPositionAfterMomentum = quantize(listLayer.y + scrollVelocity * 400, defaults.tableRowHeight) + defaults.tableRowHeight / 2;
      distanceToTravel = finalPositionAfterMomentum - listLayer.y;
      listHeightWithoutEndBuffer = -listItems.length * defaults.tableRowHeight;
      bottomOverflow = Math.max(0, listHeightWithoutEndBuffer - finalPositionAfterMomentum);
      topOverflow = Math.max(0, finalPositionAfterMomentum);
      overflowDampening = 10;
      if (bottomOverflow > 0) {
        finalPositionAfterMomentum = listHeightWithoutEndBuffer - (bottomOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      if (topOverflow > 0) {
        finalPositionAfterMomentum = 40 + (topOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      listLayer.animate({
        properties: {
          y: finalPositionAfterMomentum
        },
        time: timeAfterDrag,
        curve: "ease-out"
      });
      return Utils.delay(timeAfterDrag, function() {
        return stopDrum();
      });
    };
  })(this));
  listLayer.on(Events.AnimationStart, function() {
    clearInterval(intervalToupdateDrumAppearance);
    return intervalToupdateDrumAppearance = Utils.interval(1 / 30, updateDrumAppearance);
  });
  listLayer.on(Events.AnimationEnd, (function(_this) {
    return function() {
      clearInterval(intervalToupdateDrumAppearance);
      return _this.drumContainer.emit("DrumFinishedChanging", {
        list: drumName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this));
  updateDrumAppearance = (function(_this) {
    return function() {
      var cappedListPosition, distanceFromMiddle, focusItem, itemsInDrum, k, listPosition, ref, ref1;
      itemsInDrum = 4;
      listPosition = listLayer.y / -defaults.tableRowHeight - 0.5;
      cappedListPosition = Math.max(0, Math.min(listLayer.y / -defaults.tableRowHeight - 0.5, listItems.length - 1));
      focusItem = Math.round(cappedListPosition);
      distanceFromMiddle = Math.abs(focusItem - cappedListPosition);
      for (i = k = ref = focusItem - itemsInDrum, ref1 = focusItem + itemsInDrum; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
        if (i >= 0 && i < listItems.length) {
          listLayer.subLayers[i].opacity = 1 - Math.abs(listPosition - i) / 5 - (i !== focusItem ? 0.3 : 0);
          listLayer.subLayers[i].scaleY = 1 - Math.min(1, Math.abs(listPosition - i) / 4);
          listLayer.subLayers[i].y = listLayer.subLayers[i].startY - (i - listPosition) * Math.abs(i - listPosition) * 10;
        }
      }
      if (_this.index !== focusItem) {
        return updateDrumValues(focusItem);
      }
    };
  })(this);
  stopDrum = (function(_this) {
    return function() {
      if (listLayer.y > listMinYPos) {
        listLayer.animate({
          properties: {
            y: listMinYPos
          },
          curve: "spring(400,50,0)"
        });
      }
      if (listLayer.y < listMaxYPos) {
        return listLayer.animate({
          properties: {
            y: listMaxYPos
          },
          curve: "spring(400,50,0)"
        });
      }
    };
  })(this);
  updateDrumValues = (function(_this) {
    return function(newIndex) {
      _this.index = newIndex;
      _this.val = listItems[_this.index];
      return _this.drumContainer.emit("DrumDidChange", {
        list: drumName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this);
  updateDrumAppearance();
  this.setIndex = (function(_this) {
    return function(index) {
      var yPositionForThisIndex;
      yPositionForThisIndex = -defaults.tableRowHeight / 2 - (index * defaults.tableRowHeight);
      return listLayer.animate({
        properties: {
          y: yPositionForThisIndex
        },
        time: 0.5,
        curve: "ease-out"
      });
    };
  })(this);
  this.setValue = (function(_this) {
    return function(val) {
      var index;
      index = listItems.indexOf(val);
      if (index !== -1) {
        return _this.setIndex(index);
      }
    };
  })(this);
  return this;
};


/*
	PICKER
	This contains the picker
 */

exports.Picker = function(params) {
  var drum, drumContainerHeight, j, len, newDrum, pickerDidChange, pickerFinishedChanging, pickerStartedMoving, ref;
  params = params || {};
  _.defaults(params, {
    x: 0,
    y: 0,
    width: defaults.screenWidth,
    defaultText: "",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  this.pickerContainer = new Layer({
    x: params.x,
    y: params.y,
    width: params.width,
    height: drumContainerHeight + 88,
    backgroundColor: defaults.itemBackground
  });
  this.drum = new Layer({
    x: 0,
    y: 88,
    width: params.width,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: this.pickerContainer
  });
  this.selectedItem = new Layer({
    x: 0,
    y: drumContainerHeight / 2 - defaults.tableRowHeight / 2,
    width: params.width,
    height: defaults.tableRowHeight,
    backgroundColor: "none",
    superLayer: this.drum
  });
  this.pickerContainer.pickerHeader = new Layer({
    x: 0,
    y: 0,
    width: params.width,
    height: 88,
    backgroundColor: defaults.itemBackground,
    superLayer: this.pickerContainer
  });
  this.drum.style = {
    pointerEvents: "none",
    borderTop: "1px solid " + defaults.lineTint,
    borderBottom: "1px solid " + defaults.lineTint
  };
  this.selectedItem.style = {
    pointerEvents: "none",
    borderTop: "1px solid rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(0,0,0,0.3)"
  };
  this.pickerContainer.pickerHeader.style = defaults.listItemTextStyle;
  this.pickerContainer.pickerHeader.style = {
    color: params.textColor,
    paddingLeft: "20px",
    borderTop: "1px solid " + defaults.lineTint
  };
  this.pickerContainer.pickerHeader.html = params.defaultText;
  this.pickerContainer.drums = [];
  this.pickerContainer.drumsByName = {};
  pickerStartedMoving = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val,
            velocity: 0
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerStartedMoving");
    };
  })(this);
  pickerDidChange = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerDidChange", drumValues);
    };
  })(this);
  pickerFinishedChanging = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerFinishedChanging", drumValues);
    };
  })(this);
  if (params.drums && params.drums.length > 0) {
    ref = params.drums;
    for (j = 0, len = ref.length; j < len; j++) {
      drum = ref[j];
      newDrum = new Drum(this.drum, drum.name, drum.items, drum.params);
      this.pickerContainer.drums.push(newDrum);
      this.pickerContainer.drumsByName[drum.name] = newDrum;
      newDrum.drumContainer.on("DrumDidChange", pickerDidChange);
      newDrum.drumContainer.on("DrumFinishedChanging", pickerFinishedChanging);
      newDrum.drumContainer.on("DrumStartedMoving", pickerStartedMoving);
    }
  }
  return this.pickerContainer;
};


},{}],"iOSKit":[function(require,module,exports){
var bannerBG, comp, components, defaults, error, framerDevices, iconLibrary, j, layoutAlign, layoutChange, layoutSize, len, listenToKeys, onResize, screen, setProps, setupComponent, specialChar, textAutoSize;

framerDevices = {
  "fullscreen": {
    height: window.innerHeight,
    width: window.innerWidth,
    scale: 1,
    mobile: false,
    platform: "web"
  },
  "apple-iphone-5s-space-gray": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5s-silver": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5s-gold": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-green": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-blue": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-red": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-white": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-yellow": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-5c-pink": {
    height: 1136,
    width: 640,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-space-gray": {
    height: 1334,
    width: 750,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-silver": {
    height: 1334,
    width: 750,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-gold": {
    height: 1334,
    width: 750,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-rose-gold": {
    height: 1334,
    width: 750,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-plus-gold": {
    height: 2208,
    width: 1242,
    scale: 3,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-plus-silver": {
    height: 2208,
    width: 1242,
    scale: 3,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-plus-space-gray": {
    height: 2208,
    width: 1242,
    scale: 3,
    mobile: true,
    platform: "iOS"
  },
  "apple-iphone-6s-plus-rose-gold": {
    height: 2208,
    width: 1242,
    scale: 3,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-air-2-gold": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-air-2-silver": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-air-2-space-gray": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-mini-4-gold": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-mini-4-space-gray": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-mini-4-silver": {
    height: 2048,
    width: 1536,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-pro-gold": {
    height: 2732,
    width: 2048,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-pro-silver": {
    height: 2732,
    width: 2048,
    scale: 2,
    mobile: true,
    platform: "iOS"
  },
  "apple-ipad-pro-space-gray": {
    height: 2732,
    width: 2048,
    scale: 2,
    mobile: true,
    platform: "iOS"
  }
};

exports.device = 0;

exports.name = 0;

exports.scale = 0;

exports.height = 0;

exports.width = 0;

exports.mobile = 0;

exports.platform = 0;

exports.orientation = 0;

screen = {};

exports.getDevice = function() {
  var device;
  device = Framer.Device.deviceType;

  /* This switch looks at the innerWidth to determine if the prototype is being opened on a device. 
  	If so, it'll override the device, and it'll adjust the view to fullscreen.
   */
  switch (innerWidth) {
    case 640:
      device = "apple-iphone-5s-silver";
      Framer.Device.deviceType = "fullscreen";
      break;
    case 750:
      device = "apple-iphone-6s-silver";
      Framer.Device.deviceType = "fullscreen";
      break;
    case 1242:
      if (innerHeight === 2208) {
        device = "apple-iphone-6s-plus-silver";
        Framer.Device.deviceType = "fullscreen";
      }
      break;
    case 1536:
      if (innerHeight === 2048) {
        device = "apple-ipad-air-2-silver";
        Framer.Device.deviceType = "fullscreen";
      }
      break;
    case 2048:
      if (innerHeight === 2732) {
        device = "apple-ipad-pro-silver";
      }
      if (innerHeight === 1536) {
        device = "apple-ipad-air-2-silver";
      }
      Framer.Device.deviceType = "fullscreen";
      break;
    case 2732:
      if (innerHeight === 2048) {
        device = "apple-ipad-pro-silver";
        Framer.Device.deviceType = "fullscreen";
      }
  }
  exports.scale = framerDevices[device].scale;
  if (device === "fullscreen") {
    exports.width = window.innerWidth;
    exports.height = window.innerHeight;
  } else {
    exports.width = framerDevices[device].width;
    exports.height = framerDevices[device].height;
    if (window.innerWidth === 1242 || window.innerWidth === 2208) {
      exports.width = window.innerWidth;
      exports.height = window.innerHeight;
      exports.scale = 3;
    }
  }
  exports.mobile = framerDevices[device].mobile;
  exports.platform = framerDevices[device].platform;
  exports.orientation = Framer.Device.orientation;
  device = device.replace("apple-", "");
  device = device.replace("-gold", "");
  device = device.replace("-green", "");
  device = device.replace("-blue", "");
  device = device.replace("-red", "");
  device = device.replace("-white", "");
  device = device.replace("-yellow", "");
  device = device.replace("-pink", "");
  device = device.replace("-space-grey", "");
  device = device.replace("-rose", "");
  device = device.replace("5s", "5");
  device = device.replace("5c", "5");
  device = device.replace("-mini", "");
  device = device.replace("-air", "");
  device = device.replace("-2", "");
  device = device.replace("-4", "");
  exports.device = device.replace("-silver", "");
  return screen = {
    width: exports.width,
    height: exports.height
  };
};

exports.orient = function() {
  var tempHeight, tempWidth;
  if (exports.orientation === -90) {
    tempHeight = exports.height;
    tempWidth = exports.width;
    exports.height = tempWidth;
    return exports.width = tempHeight;
  }
};

exports.getDevice();

exports.orient();

window.addEventListener("resize", onResize);

window.addEventListener("orientationchange", onResize);

onResize = function() {
  exports.getDevice();
  return exports.layout();
};

exports.pt = function(px) {
  var pt;
  pt = px / exports.scale;
  pt = Math.round(pt);
  return pt;
};

exports.px = function(pt) {
  var px;
  px = pt * exports.scale;
  px = Math.round(px);
  return px;
};

exports.clean = function(string) {
  string = string.replace(/[&]nbsp[;]/gi, " ").replace(/[<]br[>]/gi, "");
  return string;
};

exports.svg = function(svg) {
  var endIndex, hEndIndex, hStartIndex, height, heightString, newHeight, newString, newWidth, startIndex, string, wEndIndex, wStartIndex, width;
  startIndex = svg.search("<svg width=");
  endIndex = svg.search(" viewBox");
  string = svg.slice(startIndex, endIndex);
  wStartIndex = string.search("=") + 2;
  wEndIndex = string.search("px");
  width = string.slice(wStartIndex, wEndIndex);
  newWidth = exports.px(width);
  heightString = string.slice(wEndIndex + 4, string.length);
  hStartIndex = heightString.search("=") + 2;
  hEndIndex = heightString.search("px");
  height = heightString.slice(hStartIndex, hEndIndex);
  newHeight = exports.px(height);
  newString = string.replace(width, newWidth);
  newString = newString.replace(height, newHeight);
  svg = svg.replace(string, newString);
  return {
    svg: svg,
    width: newWidth,
    height: newHeight
  };
};

exports.changeFill = function(layer, color) {
  var endIndex, fillString, newString, startIndex, string;
  startIndex = layer.html.search("fill=\"#");
  fillString = layer.html.slice(startIndex, layer.html.length);
  endIndex = fillString.search("\">");
  string = fillString.slice(0, endIndex);
  newString = "fill=\"" + exports.color(color).toHexString();
  return layer.html = layer.html.replace(string, newString);
};

exports.capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.getTime = function() {
  var date, dateObj, day, daysOfTheWeek, hours, mins, month, monthsOfTheYear, secs;
  daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dateObj = new Date();
  month = monthsOfTheYear[dateObj.getMonth()];
  date = dateObj.getDate();
  day = daysOfTheWeek[dateObj.getDay()];
  hours = dateObj.getHours();
  mins = dateObj.getMinutes();
  secs = dateObj.getSeconds();
  return {
    month: month,
    date: date,
    day: day,
    hours: hours,
    mins: mins,
    secs: secs
  };
};

exports.color = function(colorString) {
  var color;
  color = "";
  if (typeof colorString === "string") {
    colorString = colorString.toLowerCase();
  }
  switch (colorString) {
    case "red":
      color = new Color("#FE3824");
      break;
    case "blue":
      color = new Color("#0076FF");
      break;
    case "pink":
      color = new Color("#FE2851");
      break;
    case "grey":
      color = new Color("#929292");
      break;
    case "gray":
      color = new Color("#929292");
      break;
    case "black":
      color = new Color("#030303");
      break;
    case "white":
      color = new Color("#EFEFF4");
      break;
    case "orange":
      color = new Color("#FF9600");
      break;
    case "green":
      color = new Color("#44DB5E");
      break;
    case "light blue":
      color = new Color("#54C7FC");
      break;
    case "light-blue":
      color = new Color("#54C7FC");
      break;
    case "yellow":
      color = new Color("#FFCD00");
      break;
    case "light key":
      color = new Color("#9DA7B3");
      break;
    case "light-key":
      color = new Color("#9DA7B3");
      break;
    default:
      if (colorString[0] === "#" || colorString.toHexString()[0] === "#") {
        color = new Color(colorString);
      } else {
        color = new Color("#929292");
      }
  }
  return color;
};

defaults = {
  animations: {
    target: void 0,
    constraints: void 0,
    curve: "ease-in-out",
    curveOptions: void 0,
    time: 1,
    delay: 0,
    repeat: void 0,
    colorModel: void 0,
    stagger: void 0,
    fadeOut: false,
    fadeIn: false
  },
  alert: {
    title: "Title",
    message: "Message",
    actions: ["OK"],
    action: "Action",
    secondaryAction: "secondaryAction"
  },
  banner: {
    title: "Title",
    message: "Message",
    action: "Action",
    time: "now",
    icon: void 0,
    duration: 7,
    animated: false
  },
  button: {
    text: "text",
    type: "button",
    buttonType: "text",
    style: "light",
    backgroundColor: "white",
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "regular",
    name: "button",
    blur: true,
    superLayer: void 0,
    constraints: void 0
  },
  framerProps: ["name", "width", "height", "superLayer", "opacity", "color", "backgroundColor", "x", "y", "midX", "midY", "maxX", "minX", "visible", "clip", "scrollHorizontal", "scrollVertical", "ignoreEvents", "z", "scaleX", "scaleY", "scaleZ", "scale", "skewX", "skewY", "skew", "originX", "originY", "originZ", "perspective", "perspectiveOriginX", "perspectiveOriginY", "rotationX", "rotationY", "rotationZ", "rotation", "blur", "brightness", "saturate", "hueRotate", "contrast", "invert", "grayscale", "sepia", "shadowX", "shadowY", "shadowBlur", "shadowSpread", "shadowColor", "borderColor", "borderWidth", "force2d", "flat", "backfaceVisible", "name", "matrix", "_matrix2d", "transformMatrix", "matrix3d", "borderRadius", "point", "size", "frame", "html", "image", "scrollX", "scrollY", "_domEventManager", "mouseWheelSpeedMultiplier", "velocityThreshold", "animationOptions", "constrained"],
  cssProps: ["fontFamily", "fontSize", "textAlign", "fontWeight", "lineHeight"],
  styleProps: ["fontFamily", "fontSize", "textAlign", "fontWeight", "lineHeight"],
  constraintProps: ["height", "width"],
  constraintTypes: ["top", "leading", "trailing", "bottom"],
  constraintAligns: ["horizontalCenter", "verticalCenter", "leadingEdges", "trailingEdges", "topEdges", "bottomEdges", "align", "vertical", "horizontal"],
  constraints: {
    top: {
      "prop": "y",
      "objProp": "maxY",
      "objProp2": "height",
      "opp": "bottom"
    },
    leading: {
      "prop": "x",
      "objProp": "maxX",
      "objProp2": "width",
      "opp": "trailing"
    },
    bottom: {
      "prop": "maxY",
      "objProp": "height",
      "objProp2": "y",
      "opp": "top"
    },
    trailing: {
      "prop": "maxX",
      "objProp": "width",
      "objProp2": "x",
      "opp": "leading"
    }
  },
  cursor: {
    color: "blue",
    height: 20,
    width: 1
  },
  field: {
    isEditing: false,
    cursor: {},
    borderRadius: 5,
    borderWidth: 0,
    borderColor: "transparent",
    color: "#090908",
    backgroundColor: "#FFF",
    returnText: "return",
    returnColor: "light-key",
    style: "light",
    type: "field",
    constraints: void 0,
    superLayer: void 0,
    width: 258,
    height: 30,
    fontSize: 15,
    fontWeight: "regular",
    placeholderText: "placeholderText",
    placeholderColor: "#808080",
    text: "",
    textConstraints: {
      align: "vertical",
      leading: 8
    },
    input: true
  },
  lockScreen: {
    time: "default",
    date: "default",
    passcode: false,
    clock24: false,
    type: "lockScreen"
  },
  keyboard: {
    returnText: "return",
    returnColor: "light-key",
    animated: false,
    output: void 0
  },
  sheet: {
    actions: ["OK"],
    exit: "Cancel",
    animated: false,
    description: void 0
  },
  navBar: {
    title: "Title",
    left: void 0,
    right: "Edit",
    blur: true,
    superLayer: void 0,
    type: "navBar"
  },
  statusBar: {
    carrier: "",
    network: "LTE",
    battery: 100,
    signal: 5,
    style: "dark",
    clock24: false,
    type: "statusBar"
  },
  tabBar: {
    tabs: [],
    start: 0,
    type: "tabBar",
    backgroundColor: "white",
    activeColor: "blue",
    inactiveColor: "gray",
    blur: true
  },
  tab: {
    label: "label",
    icon: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='25px' height='25px' viewBox='0 0 25 25' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>1</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='1'> <g id='Bottom-Bar/Tab-Bar' transform='translate(-25.000000, -7.000000)' fill='#0076FF'> <g id='Placeholders' transform='translate(25.000000, 7.000000)'> <rect id='1' x='0' y='0' width='25' height='25' rx='3'></rect> </g> </g> </g> </svg>",
    active: void 0,
    unactive: void 0,
    tabBar: void 0,
    type: "tab"
  },
  table: {
    constraints: void 0,
    type: "table",
    content: [
      {
        "label": "A",
        "detail": "letter"
      }, {
        "label": "B",
        "detail": "letter"
      }
    ],
    cell: "default",
    superLayer: void 0
  },
  tableCell: {
    type: "tableCell",
    properties: "default",
    height: 50,
    swipe: false,
    swipeAction: "Delete",
    swipeColor: "#FE3824",
    swipeTextColor: "#FFF"
  },
  text: {
    text: "iOS Text Layer",
    type: "text",
    x: 0,
    y: 0,
    width: -1,
    height: -1,
    superLayer: void 0,
    style: "default",
    lines: 1,
    textAlign: "left",
    backgroundColor: "transparent",
    color: "black",
    fontSize: 17,
    fontFamily: "-apple-system, Helvetica, Arial, sans-serif",
    fontWeight: "regular",
    lineHeight: "auto",
    name: "text layer",
    opacity: 1,
    textTransform: "none",
    name: "text layer",
    constraints: {}
  }
};

setProps = function(object) {
  var keys;
  keys = Object.keys(object);
  return object["props"] = keys;
};

components = [defaults.text, defaults.alert, defaults.banner, defaults.sheet, defaults.field, defaults.table, defaults.tableCell, defaults.keyboard, defaults.button, defaults.navBar, defaults.tabBar, defaults.tab, defaults.statusBar, defaults.lockScreen];

for (j = 0, len = components.length; j < len; j++) {
  comp = components[j];
  setProps(comp);
}

setupComponent = function(component, array) {
  var i, l, len1, obj, ref;
  if (array === void 0) {
    array = [];
  }
  obj = {};
  ref = defaults[component].props;
  for (l = 0, len1 = ref.length; l < len1; l++) {
    i = ref[l];
    if (array[i] !== void 0) {
      obj[i] = array[i];
    } else {
      obj[i] = defaults[component][i];
    }
  }
  return obj;
};

error = function(context, code) {
  if (code === 10) {
    print("Error Invalid Relationship – Layer id:" + context.id + " has a relationship with another layer not in the same superLayer.");
  }
  if (code === 20) {
    print("Error " + context + " requires a layer");
  }
  if (code === 21) {
    print("Error " + context + " cannot refer to itself");
  }
  if (code === 40) {
    print("Error " + context + " is not a valid weight. Please use 100, 200, 300... or Thin, Light, Regular...");
  }
  if (code === 50) {
    return print("Error Layer id:" + context + " is not a valid Tab object. Please create a Tab using new module.Tab.");
  }
};

specialChar = function(layer) {
  var chosenColor, newText, text;
  text = layer;
  if (layer.type === "button") {
    text = layer.label;
  }
  if (text.html.indexOf("-b") !== -1) {
    newText = text.html.replace("-b ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        fontWeight: 600
      }
    ]);
  }
  if (text.html.indexOf("-r") !== -1) {
    newText = text.html.replace("-r ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "red"
      }
    ]);
  }
  if (text.html.indexOf("-rb") !== -1) {
    newText = text.html.replace("-rb ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "blue"
      }
    ]);
  }
  if (text.html.indexOf("-lb") !== -1) {
    newText = text.html.replace("-lb ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "light-blue"
      }
    ]);
  }
  if (text.html.indexOf("-g") !== -1) {
    newText = text.html.replace("-g ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "green"
      }
    ]);
  }
  if (text.html.indexOf("-o") !== -1) {
    newText = text.html.replace("-o ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "orange"
      }
    ]);
  }
  if (text.html.indexOf("-p") !== -1) {
    newText = text.html.replace("-p ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "orange"
      }
    ]);
  }
  if (text.html.indexOf("-y") !== -1) {
    newText = text.html.replace("-y ", "");
    exports.update(text, [
      {
        text: newText
      }, {
        color: "yellow"
      }
    ]);
  }
  if (text.html.indexOf("-#") !== -1) {
    chosenColor = text.html.slice(1, 8);
    newText = text.html.slice(9, text.html.length);
    exports.update(text, [
      {
        text: newText
      }, {
        color: chosenColor
      }
    ]);
  }
  if (text.html.indexOf("-") !== -1) {
    newText = text.html.replace("- ", "");
    exports.update(text, [
      {
        text: newText
      }
    ]);
  }
  if (layer.buttonType === "text") {
    layer.width = text.width;
  }
  return exports.layout();
};

exports.setTextColor = function(colorObject) {
  var blue, color, green, red, rgb;
  rgb = colorObject.toRgbString();
  rgb = rgb.substring(4, rgb.length - 1);
  rgb = rgb.replace(/ /g, '');
  rgb = rgb.replace(/ /g, '');
  rgb = rgb.split(',');
  red = rgb[0];
  green = rgb[1];
  blue = rgb[2];
  color = "";
  if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) {
    color = "#000";
  } else {
    color = "FFF";
  }
  return color;
};

exports.sameParent = function(layer1, layer2) {
  var parentOne, parentTwo;
  parentOne = layer1.superLayer;
  parentTwo = layer2.superLayer;
  if (parentOne === parentTwo) {
    return true;
  } else {
    return false;
  }
};

exports.animateLayout = function(array) {
  var animatedLayers, delay, i, index, l, layer, len1, len2, len3, m, n, newConstraint, props, ref, ref1, results, setup, stag;
  setup = {};
  animatedLayers = [];
  if (array) {
    ref = Object.keys(defaults.animations);
    for (l = 0, len1 = ref.length; l < len1; l++) {
      i = ref[l];
      if (array[i]) {
        setup[i] = array[i];
      } else {
        setup[i] = defaults.animations[i];
      }
    }
  }
  if (setup.target) {
    if (setup.target.length) {
      animatedLayers = setup.target;
    } else {
      animatedLayers.push(setup.target);
    }
  } else {
    animatedLayers = Framer.CurrentContext.layers;
  }
  if (setup.target) {
    if (setup.constraints) {
      ref1 = Object.keys(setup.constraints);
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        newConstraint = ref1[m];
        setup.target.constraints[newConstraint] = setup.constraints[newConstraint];
      }
    }
  }
  results = [];
  for (index = n = 0, len3 = animatedLayers.length; n < len3; index = ++n) {
    layer = animatedLayers[index];
    if (layer.constraints) {
      layer.end = {};
      props = {};
      layer.superFrame = {};
      if (layer.superLayer) {
        layer.superFrame.height = layer.superLayer.height;
        layer.superFrame.width = layer.superLayer.width;
      } else {
        layer.superFrame.height = exports.height;
        layer.superFrame.width = exports.width;
      }
      if (layer.constraints.leading !== void 0 && layer.constraints.trailing !== void 0) {
        layer.constraints.autoWidth = {};
      }
      if (layer.constraints.top !== void 0 && layer.constraints.bottom !== void 0) {
        layer.constraints.autoHeight = {};
      }
      if (layer.constraints.width !== void 0) {
        props.width = exports.px(layer.constraints.width);
      } else {
        props.width = layer.width;
      }
      if (layer.constraints.height !== void 0) {
        props.height = exports.px(layer.constraints.height);
      } else {
        props.height = layer.height;
      }
      if (layer.constraints.leading !== void 0) {
        if (layer.constraints.leading === parseInt(layer.constraints.leading, 10)) {
          props.x = exports.px(layer.constraints.leading);
        } else {
          if (layer.constraints.leading[0].end === void 0) {
            exports.animateLayout({
              layer: layer.constraints.leading[0]
            });
          }
          if (layer.constraints.leading.length === void 0) {
            props.x = layer.constraints.leading.end.x + layer.constraints.leading.end.width;
          } else {
            props.x = layer.constraints.leading[0].end.x + layer.constraints.leading[0].end.width + exports.px(layer.constraints.leading[1]);
          }
        }
      }
      if (layer.constraints.autoWidth !== void 0) {
        layer.constraints.autoWidth.startX = props.x;
      }
      if (layer.constraints.trailing !== void 0) {
        if (layer.constraints.trailing === parseInt(layer.constraints.trailing, 10)) {
          props.x = layer.superFrame.width - exports.px(layer.constraints.trailing) - props.width;
        } else {
          if (layer.constraints.trailing[0].end === void 0) {
            exports.animateLayout({
              layer: layer.constraints.trailing[0]
            });
          }
          if (layer.constraints.trailing.length === void 0) {
            props.x = layer.constraints.trailing.end.x - props.width;
          } else {
            props.x = layer.constraints.trailing[0].end.x - exports.px(layer.constraints.trailing[1]) - props.width;
          }
        }
      }
      if (layer.constraints.autoWidth !== void 0) {
        layer.constraints.autoWidth.endX = props.x;
        props.x = layer.constraints.autoWidth.startX;
        props.width = layer.constraints.autoWidth.endX - layer.constraints.autoWidth.startX + props.width;
      }
      if (layer.constraints.top !== void 0) {
        if (layer.constraints.top === parseInt(layer.constraints.top, 10)) {
          props.y = exports.px(layer.constraints.top);
        } else {
          if (layer.constraints.top.length === void 0) {
            props.y = layer.constraints.top.end.y + layer.constraints.top.end.height;
          } else {
            props.y = layer.constraints.top[0].end.y + layer.constraints.top[0].end.height + exports.px(layer.constraints.top[1]);
          }
        }
      }
      if (layer.constraints.autoHeight !== void 0) {
        layer.constraints.autoHeight.startY = props.y;
      }
      if (layer.constraints.bottom !== void 0) {
        if (layer.constraints.bottom === parseInt(layer.constraints.bottom, 10)) {
          props.y = layer.superFrame.height - exports.px(layer.constraints.bottom) - props.height;
        } else {
          if (layer.constraints.bottom[0].end === void 0) {
            exports.animateLayout({
              layer: layer.constraints.bottom[0]
            });
          }
          if (layer.constraints.bottom.length === void 0) {
            props.y = layer.constraints.bottom.end.y - props.height;
          } else {
            props.y = layer.constraints.bottom[0].end.y - exports.px(layer.constraints.bottom[1]);
          }
        }
      }
      if (layer.constraints.autoHeight !== void 0) {
        layer.constraints.autoHeight.endY = props.y;
        props.height = layer.constraints.autoHeight.endY - layer.constraints.autoHeight.startY;
        props.y = layer.constraints.autoHeight.startY;
      }
      if (layer.constraints.align !== void 0) {
        if (layer.constraints.align === "horizontal") {
          props.x = layer.superFrame.width / 2 - props.width / 2;
        }
        if (layer.constraints.align === "vertical") {
          props.y = layer.superFrame.height / 2 - props.height / 2;
        }
        if (layer.constraints.align === "center") {
          props.x = layer.superFrame.width / 2 - props.width / 2;
          props.y = layer.superFrame.height / 2 - props.height / 2;
        }
      }
      if (layer.constraints.horizontalCenter !== void 0) {
        props.x = layer.constraints.horizontalCenter.end.x + (layer.constraints.horizontalCenter.end.width - props.width) / 2;
      }
      if (layer.constraints.verticalCenter !== void 0) {
        props.y = layer.constraints.verticalCenter.end.y + (layer.constraints.verticalCenter.end.height - props.height) / 2;
      }
      if (layer.constraints.center !== void 0) {
        props.x = layer.constraints.center.end.x + (layer.constraints.center.end.width - props.width) / 2;
        props.y = layer.constraints.center.end.y + (layer.constraints.center.end.height - props.height) / 2;
      }
      if (layer.constraints.leadingEdges !== void 0) {
        props.x = layer.constraints.leadingEdges.end.x;
      }
      if (layer.constraints.trailingEdges !== void 0) {
        props.x = layer.constraints.trailingEdges.end.x - props.width + layer.constraints.trailingEdges.end.width;
      }
      if (layer.constraints.topEdges !== void 0) {
        props.y = layer.constraints.topEdges.end.y;
      }
      if (layer.constraints.bottomEdges !== void 0) {
        props.y = layer.constraints.bottomEdges.end.y - props.height + layer.constraints.bottomEdges.end.height;
      }
      delay = setup.delay;
      if (setup.stagger) {
        stag = setup.stagger;
        delay = index * stag;
      }
      if (setup.fadeOut) {
        if (layer === setup.fadeOut) {
          props.opacity = 0;
        }
      }
      if (setup.fadeIn) {
        props.opacity = 1;
      }
      layer.animate({
        properties: props,
        time: setup.time,
        delay: delay,
        curve: setup.curve,
        repeat: setup.repeat,
        colorModel: setup.colorModel,
        curveOptions: setup.curveOptions
      });
      results.push(layer.end = props);
    } else {
      results.push(void 0);
    }
  }
  return results;
};

exports.layout = function(layer) {
  var a, c, l, len1, len2, len3, len4, m, n, p, q, ref, ref1, ref2, ref3, results;
  if (layer === void 0) {
    this.array = Framer.CurrentContext.layers;
  } else {
    this.array = [layer];
  }
  ref = this.array;
  results = [];
  for (l = 0, len1 = ref.length; l < len1; l++) {
    layer = ref[l];
    if (layer.constraints) {
      ref1 = defaults.constraintProps;
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        p = ref1[m];
        layoutSize(layer, p);
      }
      ref2 = defaults.constraintTypes;
      for (n = 0, len3 = ref2.length; n < len3; n++) {
        c = ref2[n];
        if (layer.constraints[c] !== void 0) {
          layoutChange(layer, c);
        }
      }
      ref3 = defaults.constraintAligns;
      for (q = 0, len4 = ref3.length; q < len4; q++) {
        a = ref3[q];
        if (layer.constraints[a]) {
          layoutAlign(layer, a);
        }
      }
      if (layer.constraintListener === void 0) {
        results.push(layer.constraintListener = true);
      } else {
        results.push(void 0);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;
};

layoutAlign = function(layer, type) {
  var declaredConstraint, deltaMove, i, l, len1;
  declaredConstraint = layer.constraints[type];
  if (layer.superLayer) {
    this.superLayer = layer.superLayer;
  } else {
    this.superLayer = screen;
  }
  if (declaredConstraint === parseInt(declaredConstraint, 10)) {
    error(type, 20);
  }
  if (declaredConstraint === layer) {
    error(type, 21);
  }
  if (typeof declaredConstraint === "object") {
    for (l = 0, len1 = declaredConstraint.length; l < len1; l++) {
      i = declaredConstraint[l];
      if (typeof i === "string") {
        this.type = i;
      }
      if (typeof i === "object") {
        this.layer = i;
      }
    }
    if (this.type === "horizontalCenter" || this.type === "horizontal") {
      deltaMove = (this.layer.width - layer.width) / 2;
      layer.x = this.layer.x + deltaMove;
      layer.constraints["leading"] = exports.pt(layer.x);
    }
    if (this.type === "verticalCenter" || this.type === "vertical") {
      deltaMove = (this.layer.height - layer.height) / 2;
      layer.y = this.layer.y + deltaMove;
      layer.constraints["top"] = exports.pt(layer.y);
    }
    if (this.type === "leadingEdges" || this.type === "leading") {
      layer.x = this.layer.x;
      layer.constraints["leading"] = exports.pt(layer.x);
    }
    if (this.type === "trailingEdges" || this.type === "trailing") {
      layer.maxX = this.layer.maxX;
      layer.constraints["trailing"] = exports.pt(this.superLayer.width - layer.maxX);
    }
    if (this.type === "topEdges" || this.type === "top") {
      layer.y = this.layer.y;
      layer.constraints["top"] = exports.pt(layer.y);
    }
    if (this.type === "bottomEdges" || this.type === "bottom") {
      layer.maxY = this.layer.maxY;
      layer.constraints["bottom"] = exports.pt(this.superLayer.height - layer.maxY);
    }
  }
  if (type === "horizontalCenter" || type === "horizontal") {
    deltaMove = (declaredConstraint.width - layer.width) / 2;
    layer.x = declaredConstraint.x + deltaMove;
  }
  if (type === "verticalCenter" || type === "vertical") {
    deltaMove = (declaredConstraint.height - layer.height) / 2;
    layer.y = declaredConstraint.y + deltaMove;
  }
  if (type === "leadingEdges") {
    layer.x = declaredConstraint.x;
    layer.constraints["leading"] = exports.pt(declaredConstraint.x);
  }
  if (type === "trailingEdges") {
    layer.maxX = declaredConstraint.maxX;
    layer.constraints["trailing"] = exports.pt(this.superLayer.height - layer.maxX);
  }
  if (type === "topEdges") {
    layer.y = declaredConstraint.y;
    layer.constraints["top"] = exports.pt(layer.y);
  }
  if (type === "bottomEdges") {
    layer.maxY = declaredConstraint.maxY;
    layer.constraints["bottom"] = exports.pt(this.superLayer.height - layer.maxY);
  }
  if (type === "align") {
    if (declaredConstraint === "horizontal") {
      layer.centerX();
    }
    if (declaredConstraint === "vertical") {
      layer.centerY();
    }
    if (declaredConstraint === "center") {
      layer.center();
    }
    if (declaredConstraint === "vertical") {
      return layer.centerY();
    }
  }
};

layoutSize = function(layer, type) {
  var textFrame;
  if (layer.constraints[type]) {
    layer[type] = exports.px(layer.constraints[type]);
    if (layer.type === "text") {
      textFrame = textAutoSize(layer);
      layer.width = textFrame.width;
      return layer.height = textFrame.height;
    }
  }
};

layoutChange = function(layer, type) {
  var endTrait, endX, l, len1, len2, len3, m, n, objProp, objProp2, object, opp, prop, ref, ref1, ref2, results, startX, superTrait, trait;
  if (layer.constraints[type] !== void 0) {
    prop = defaults.constraints[type].prop;
    objProp = defaults.constraints[type].objProp;
    opp = defaults.constraints[type].opp;
    superTrait = defaults.constraints[type].objProp;
    if (objProp !== "width" && objProp !== "height") {
      superTrait = defaults.constraints[type].objProp2;
    }
    if (layer.superLayer !== null) {
      this[superTrait] = layer.superLayer[superTrait];
    } else {
      this[superTrait] = exports[superTrait];
    }
    if (type === "top" || type === "leading") {
      if (layer.constraints[type] === parseInt(layer.constraints[type], 10)) {
        layer[prop] = layer.constraints[type] * exports.scale;
      } else {
        if (layer.constraints[type].length === void 0) {
          layer[prop] = layer.constraints[type][objProp];
        }
        if (layer.constraints[type].length === 1) {
          if (layer.constraints[type][0] === parseInt(layer.constraints[type][0], 10)) {
            layer[prop] = layer.constraints[type][0] * exports.scale;
          } else {
            layer[prop] = layer.constraints[type][0][objProp];
          }
        }
        if (layer.constraints[type].length > 1) {
          ref = layer.constraints[type];
          for (l = 0, len1 = ref.length; l < len1; l++) {
            object = ref[l];
            if (object === parseInt(object, 10)) {
              this.objInt = object;
            } else {
              this.objLayer = object;
            }
          }
          layer[prop] = (this.objInt * exports.scale) + this.objLayer[objProp];
        }
      }
      if (layer.constraints[opp] !== void 0) {
        trait = defaults.constraints[opp]["objProp"];
        if (layer.constraints[opp] === parseInt(layer.constraints[opp], 10)) {
          return layer[trait] = this[superTrait] - (layer[prop] + (exports.scale * layer.constraints[opp]));
        } else {
          if (layer.constraints[opp].length === void 0) {
            layer[trait] = layer[prop] - layer.constraints[opp][prop];
            if (layer[trait] < 0) {
              return layer[trait] = layer[trait] * -1;
            }
          } else {
            startX = layer.x;
            endX = 0;
            ref1 = layer.constraints[opp];
            for (m = 0, len2 = ref1.length; m < len2; m++) {
              object = ref1[m];
              if (object === parseInt(object, 10)) {
                endX = endX - object;
              } else {
                endTrait = defaults.constraints[opp].objProp2;
                endX = endX + object[endTrait];
              }
            }
            return layer.width = endX - startX;
          }
        }
      }
    } else {
      objProp2 = defaults.constraints[type].objProp2;
      if (layer.constraints[opp] === void 0) {
        if (layer.constraints[type] === parseInt(layer.constraints[type], 10)) {
          return layer[prop] = this[superTrait] - (layer.constraints[type] * exports.scale);
        } else {
          if (layer.constraints[type].length === void 0) {
            if (exports.sameParent(layer, layer.constraints[type])) {
              layer[prop] = layer.constraints[type][objProp2];
            } else {
              error(layer, 10);
            }
          }
          if (layer.constraints[type].length === 1) {
            if (layer.constraints[type][0] === parseInt(layer.constraints[type][0], 10)) {
              layer[prop] = this[objProp] - (layer.constraints[type][0] * exports.scale);
            } else {
              if (exports.sameParent(layer, layer.constraints[type][0])) {
                layer[prop] = layer.constraints[type][0][objProp2];
              } else {
                error(layer, 10);
              }
            }
          }
          if (layer.constraints[type].length > 1) {
            ref2 = layer.constraints[type];
            results = [];
            for (n = 0, len3 = ref2.length; n < len3; n++) {
              object = ref2[n];
              if (object === parseInt(object, 10)) {
                this.objInt = object;
              } else {
                this.objLayer = object;
              }
              results.push(layer[prop] = this.objLayer[objProp2] - exports.scale * this.objInt);
            }
            return results;
          }
        }
      }
    }
  }
};

exports.styles = {};

exports.bgBlur = function(layer) {
  layer.style["-webkit-backdrop-filter"] = "blur(" + (exports.px(5)) + "px)";
  return layer;
};

textAutoSize = function(textLayer) {
  var constraints, styles, textWidth;
  constraints = {};
  if (textLayer.constraints) {
    if (textLayer.constraints.height) {
      constraints.height = exports.px(textLayer.constraints.height);
    }
    if (textLayer.constraints.width) {
      constraints.width = exports.px(textLayer.constraints.width);
    }
  }
  styles = {
    fontSize: textLayer.style["font-size"],
    fontFamily: textLayer.style["font-family"],
    fontWeight: textLayer.style["font-weight"],
    lineHeight: textLayer.style["line-height"],
    letterSpacing: textLayer.style["letter-spacing"],
    textTransform: textLayer.style["text-transform"]
  };
  textWidth = Utils.textSize(textLayer.html, styles, constraints);
  return {
    width: textWidth.width,
    height: textWidth.height
  };
};

listenToKeys = function(field, keyboard) {
  var allSelected, codes, isCommand, isShift, keypress;
  keypress = function(key) {
    var boxKey, originalColor;
    originalColor = key.backgroundColor;
    switch (key.name) {
      case "shift":
        key.icon.states.switchInstant("on");
        return key.backgroundColor = "white";
      case "delete":
        key.icon.states.switchInstant("on");
        key.backgroundColor = "white";
        return key.icon.states.switchInstant("on");
      case "space":
        return key.backgroundColor = exports.color("light-key");
      default:
        if (exports.device !== "ipad") {
          keyboard.keyPopUp.visible = true;
          boxKey = key.name;
          if (isShift) {
            boxKey = boxKey.toUpperCase();
          }
          keyboard.keyPopUp.box.html = boxKey;
          keyboard.keyPopUp.maxY = key.maxY;
          return keyboard.keyPopUp.midX = key.midX;
        } else {
          return key.animate({
            properties: {
              backgroundColor: exports.color("light-key")
            },
            time: .2
          });
        }
    }
  };
  isCommand = false;
  allSelected = false;
  isShift = false;
  codes = {
    13: "<br>",
    32: "&nbsp;",
    33: "!",
    34: "\"",
    35: "#",
    36: "$",
    37: "%",
    38: "&",
    39: "\'",
    40: "(",
    41: ")",
    42: "*",
    43: "+",
    44: ",",
    45: "-",
    47: "/",
    46: ".",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    58: ":",
    59: ";",
    60: "<",
    61: "=",
    62: ">",
    63: "?",
    64: "@",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    91: "[",
    92: "\\",
    93: "]",
    94: "^",
    95: "_",
    96: "`",
    97: "a",
    98: "b",
    99: "c",
    100: "d",
    101: "e",
    102: "f",
    103: "g",
    104: "h",
    105: "i",
    106: "j",
    107: "k",
    108: "l",
    109: "m",
    110: "n",
    111: "o",
    112: "p",
    113: "q",
    114: "r",
    115: "s",
    116: "t",
    117: "u",
    118: "v",
    119: "w",
    120: "x",
    121: "y",
    122: "z",
    123: "{",
    124: "|",
    125: "}",
    126: "~"
  };
  document.addEventListener('keydown', function(e) {
    var endLength, initialLength, k, l, len1, newText, ref;
    if (field.active) {
      if (e.keyCode === 27) {
        e.preventDefault();
        keyboard.animate({
          properties: {
            y: exports.height
          },
          time: .25,
          curve: "ease-in-out"
        });
        field.active = false;
        field.clickZone.destroy();
      }
      if (e.keyCode === 16) {
        isShift = true;
        if (keyboard) {
          keypress(keyboard.keys.shift);
          ref = keyboard.keysArray;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            k = ref[l];
            k.style["text-transform"] = "uppercase";
          }
        }
      }
      if (allSelected === true) {
        if (e.keyCode === 37 || e.keyCode === 39) {
          allSelected = false;
          field.text.backgroundColor = "transparent";
        }
      }
      if (e.keyCode === 91) {
        isCommand = true;
      }
      if (e.keyCode === 13) {
        e.preventDefault();
        keyboard.keys["return"].backgroundColor = "white";
      }
      if (e.keyCode === 8) {
        e.preventDefault();
        if (keyboard) {
          keypress(keyboard.keys["delete"]);
        }
        if (allSelected === true) {
          exports.update(field.text, [
            {
              text: ""
            }
          ]);
          field.text.backgroundColor = "transparent";
          allSelected = false;
        }
        initialLength = field.text.html.length;
        newText = field.text.html.slice(0, -1);
        exports.update(field.text, [
          {
            text: newText
          }
        ]);
        endLength = field.text.html.length;
        if (initialLength === endLength) {
          newText = field.text.html.slice(0, -6);
          exports.update(field.text, [
            {
              text: newText
            }
          ]);
        }
        if (field.text.html === "") {
          field.placeholder.visible = true;
        }
        return field.value = exports.clean(newText);
      }
    }
  });
  document.addEventListener('keyup', function(e) {
    var k, l, len1, ref;
    if (field.active) {
      if (e.keyCode === 13 && keyboard) {
        keyboard.keys["return"].backgroundColor = exports.color("light-key");
      }
      if (e.keyCode === 32 && keyboard) {
        keyboard.keys.space.backgroundColor = "White";
      }
      if (e.keyCode === 8 && keyboard) {
        keyboard.keys["delete"].animate({
          properties: {
            backgroundColor: exports.color("light-key")
          },
          time: .1
        });
        keyboard.keys["delete"].icon.states["switch"]("off");
      }
      if (e.keyCode === 91) {
        isCommand = false;
      }
      if (e.keyCode === 16) {
        isShift = false;
        if (keyboard) {
          ref = keyboard.keysArray;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            k = ref[l];
            k.style["text-transform"] = "lowercase";
          }
          keyboard.keys.shift.animate({
            properties: {
              backgroundColor: exports.color("light-key")
            },
            time: .2
          });
          keyboard.keys.shift.icon.states.next();
        }
      }
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (keyboard && exports.device !== "ipad") {
          return keyboard.keyPopUp.visible = false;
        } else {
          k = keyboard.keys[codes[e.keyCode].toLowerCase()];
          return k.animate({
            properties: {
              backgroundColor: "white"
            },
            time: .2
          });
        }
      }
    }
  });
  return document.addEventListener('keypress', function(e) {
    var char, char2, key, newText;
    if (field.active) {
      char = codes[e.keyCode];
      if (keyboard) {
        key = keyboard.keys[char];
      }
      if (isCommand === true) {
        if (e.keyCode === 97) {
          field.text.backgroundColor = "rgba(0, 118, 255, .2)";
          allSelected = true;
        }
      }
      if (isCommand === false) {
        e.preventDefault();
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          char2 = char.toLowerCase();
          if (keyboard) {
            key = keyboard.keys[char2];
            keypress(key);
          }
        }
        if (e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode === 32) {
          if (keyboard) {
            keypress(key);
          }
        }
        if (e.keyCode > 31) {
          newText = field.text.html + char;
          exports.update(field.text, [
            {
              text: newText
            }
          ]);
          return field.value = exports.clean(newText);
        }
      }
    }
  });
};

exports.update = function(layer, array) {
  var change, key, l, len1, textFrame, value;
  if (array === void 0) {
    array = [];
  }
  if (layer.type === "text") {
    for (l = 0, len1 = array.length; l < len1; l++) {
      change = array[l];
      key = Object.keys(change)[0];
      value = change[key];
      if (key === "text") {
        layer.html = value;
      }
      if (key === "fontWeight") {
        layer.style[key] = value;
      }
      if (key === "color") {
        layer.color = exports.color(value);
      }
    }
    textFrame = textAutoSize(layer);
    layer.width = textFrame.width;
    layer.height = textFrame.height;
  }
  return exports.layout();
};

exports.timeDelegate = function(layer, clockType) {
  this.time = exports.getTime();
  return Utils.delay(60 - this.time.secs, function() {
    this.time = exports.getTime();
    exports.update(layer, [
      {
        text: exports.timeFormatter(this.time, clockType)
      }
    ]);
    return Utils.interval(60, function() {
      this.time = exports.getTime();
      return exports.update(layer, [
        {
          text: exports.timeFormatter(this.time, clockType)
        }
      ]);
    });
  });
};

exports.timeFormatter = function(timeObj, clockType) {
  if (clockType === false) {
    if (timeObj.hours > 12) {
      timeObj.hours = timeObj.hours - 12;
    }
    if (timeObj.hours === 0) {
      timeObj.hours = 12;
    }
  }
  if (timeObj.mins < 10) {
    timeObj.mins = "0" + timeObj.mins;
  }
  return timeObj.hours + ":" + timeObj.mins;
};

exports.Alert = function(array) {
  var act, actLabel, actLabel2, action, action2, actionDivider, actions, alert, divider, index, l, len1, len2, m, message, modal, overlay, ref, setup, title, vertDivider;
  setup = setupComponent("alert", array);
  alert = new Layer({
    backgroundColor: "transparent",
    name: "alert"
  });
  alert.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  overlay = new Layer({
    backgroundColor: "rgba(0,0,0,.3)",
    superLayer: alert,
    name: "overlay"
  });
  overlay.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  modal = new Layer({
    backgroundColor: "white",
    superLayer: alert,
    borderRadius: exports.px(10),
    name: "modal",
    x: 92,
    y: 537
  });
  modal.constraints = {
    align: "center",
    width: 280,
    height: 400
  };
  title = new exports.Text({
    style: "alertTitle",
    superLayer: modal,
    text: setup.title,
    fontWeight: "semibold",
    name: "title",
    textAlign: "center",
    lineHeight: 20
  });
  title.constraints = {
    align: "horizontal",
    width: 220,
    top: 20
  };
  message = new exports.Text({
    style: "alertMessage",
    text: setup.message,
    fontSize: 13,
    superLayer: modal,
    textAlign: "center",
    lineHeight: 16,
    width: 240,
    name: "message"
  });
  message.constraints = {
    top: [title, 10],
    align: "horizontal",
    width: 220
  };
  divider = new Layer({
    superLayer: modal,
    backgroundColor: "#E2E8EB",
    name: "horizontal divider"
  });
  divider.constraints = {
    leading: 0,
    trailing: 0,
    height: 1,
    bottom: 44
  };
  exports.layout();
  modal.constraints["height"] = 20 + exports.pt(title.height) + 10 + exports.pt(message.height) + 24 + 44;
  actions = [];
  switch (setup.actions.length) {
    case 1:
      actLabel = exports.capitalize(setup.actions[0]);
      action = new Layer({
        superLayer: modal,
        backgroundColor: "transparent",
        name: setup.actions[0],
        borderRadius: exports.px(10)
      });
      action.constraints = {
        leading: 0,
        trailing: 0,
        bottom: 0,
        height: 44
      };
      action.label = new exports.Text({
        style: "alertAction",
        color: exports.color("blue"),
        superLayer: action,
        text: actLabel,
        name: "label"
      });
      action.label.constraints = {
        align: "horizontal",
        bottom: 16
      };
      actions.push(action);
      break;
    case 2:
      actLabel = exports.capitalize(setup.actions[0]);
      action = new Layer({
        superLayer: modal,
        name: setup.actions[0],
        borderRadius: exports.px(10),
        backgroundColor: "white"
      });
      action.constraints = {
        leading: 0,
        trailing: exports.pt(modal.width / 2),
        bottom: 0,
        height: 44
      };
      action.label = new exports.Text({
        style: "alertAction",
        color: exports.color("blue"),
        superLayer: action,
        text: actLabel,
        name: "label"
      });
      action.label.constraints = {
        align: "horizontal",
        bottom: 16
      };
      actions.push(action);
      vertDivider = new Layer({
        superLayer: modal,
        backgroundColor: "#E2E8EB",
        name: "vertical divider"
      });
      vertDivider.constraints = {
        width: 1,
        bottom: 0,
        height: 44,
        align: "horizontal"
      };
      actLabel2 = exports.capitalize(setup.actions[1]);
      action2 = new Layer({
        superLayer: modal,
        name: setup.actions[1],
        borderRadius: exports.px(10),
        backgroundColor: "white"
      });
      action2.constraints = {
        leading: exports.pt(modal.width / 2),
        trailing: 0,
        bottom: 0,
        height: 44
      };
      action2.label = new exports.Text({
        style: "alertAction",
        color: exports.color("blue"),
        superLayer: action2,
        text: actLabel2,
        name: "label"
      });
      action2.label.constraints = {
        align: "horizontal",
        bottom: 16
      };
      actions.push(action2);
      break;
    default:
      ref = setup.actions;
      for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
        act = ref[index];
        actLabel = exports.capitalize(act);
        action = new Layer({
          superLayer: modal,
          name: act,
          borderRadius: exports.px(10),
          backgroundColor: "white"
        });
        action.constraints = {
          leading: 0,
          trailing: 0,
          bottom: 0 + ((setup.actions.length - index - 1) * 44),
          height: 44
        };
        actionDivider = new Layer({
          superLayer: modal,
          backgroundColor: "#E2E8EB",
          name: "horizontal divider"
        });
        actionDivider.constraints = {
          leading: 0,
          trailing: 0,
          height: 1,
          bottom: 0 + ((setup.actions.length - index) * 44)
        };
        action.label = new exports.Text({
          style: "alertAction",
          color: exports.color("blue"),
          superLayer: action,
          text: actLabel,
          name: "label"
        });
        action.label.constraints = {
          align: "horizontal",
          bottom: 14
        };
        actions.push(action);
        modal.constraints["height"] = modal.constraints["height"] + 42 - 12;
      }
  }
  alert.actions = {};
  for (index = m = 0, len2 = actions.length; m < len2; index = ++m) {
    act = actions[index];
    act.type = "button";
    specialChar(act);
    if (setup.actions[index].indexOf("-r") === 0) {
      act.origColor = exports.color("red");
    } else {
      act.origColor = exports.color("blue");
    }
    act.on(Events.TouchStart, function() {
      this.backgroundColor = "white";
      this.animate({
        properties: {
          backgroundColor: act.backgroundColor.darken(5)
        },
        time: .25
      });
      return this.label.animate({
        properties: {
          color: this.origColor.lighten(10)
        },
        time: .25
      });
    });
    act.on(Events.TouchEnd, function() {
      this.animate({
        properties: {
          backgroundColor: "white"
        },
        time: .25
      });
      return this.label.animate({
        properties: {
          color: this.origColor
        },
        time: .25
      });
    });
    alert.actions[act.name] = act;
  }
  exports.layout();
  alert.overlay = overlay;
  alert.modal = modal;
  alert.title = title;
  alert.message = message;
  return alert;
};

exports.Banner = function(array) {
  var banner, bannerBuffer, message, setup, time, title;
  setup = setupComponent("banner", array);
  banner = new Layer({
    backgroundColor: "transparent",
    name: "banner"
  });
  banner.html = exports.svg(bannerBG[exports.device]).svg;
  banner.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    height: 68
  };
  switch (exports.device) {
    case "ipad":
      this.leadingIcon = 200;
      this.topIcon = 15;
      this.topTitle = 11;
      break;
    case "ipad-pro":
      this.leadingIcon = 192;
      this.topIcon = 12;
      this.topTitle = 9;
      break;
    default:
      this.leadingIcon = 15;
      this.topIcon = 8;
      this.topTitle = 5;
  }
  if (setup.icon === void 0) {
    setup.icon = new Layer({
      superLayer: banner
    });
    setup.icon.style["background"] = "linear-gradient(-180deg, #67FF81 0%, #01B41F 100%)";
  } else {
    banner.addSubLayer(setup.icon);
  }
  setup.icon.borderRadius = exports.px(4.5);
  setup.icon.name = "icon";
  setup.icon.constraints = {
    height: 20,
    width: 20,
    leading: this.leadingIcon,
    top: this.topIcon
  };
  title = new exports.Text({
    style: "bannerTitle",
    text: setup.title,
    color: "white",
    fontWeight: "medium",
    fontSize: 13,
    superLayer: banner,
    name: "title"
  });
  title.constraints = {
    top: this.topTitle,
    leading: [setup.icon, 11]
  };
  message = new exports.Text({
    style: "bannerMessage",
    text: setup.message,
    color: "white",
    fontSize: 13,
    superLayer: banner,
    name: "message"
  });
  message.constraints = {
    leadingEdges: title,
    top: [title, 2]
  };
  time = new exports.Text({
    style: "bannerTime",
    text: setup.time,
    color: "white",
    fontSize: 11,
    superLayer: banner,
    name: "time"
  });
  time.constraints = {
    leading: [title, 5],
    bottomEdges: title
  };
  if (exports.device === "ipad" || exports.device === "ipad-pro") {
    time.constraints = {
      bottomEdges: title,
      trailing: this.leadingIcon
    };
  }
  exports.layout();
  exports.bgBlur(banner);
  banner.draggable = true;
  banner.draggable.horizontal = false;
  banner.draggable.constraints = {
    y: 0
  };
  banner.draggable.bounceOptions = {
    friction: 25,
    tension: 250
  };
  banner.on(Events.DragEnd, function() {
    if (banner.maxY < exports.px(68)) {
      banner.animate({
        properties: {
          maxY: 0
        },
        time: .15,
        curve: "ease-in-out"
      });
      return Utils.delay(.25, function() {
        return banner.destroy();
      });
    }
  });
  bannerBuffer = new Layer({
    maxY: 0,
    name: "buffer",
    backgroundColor: "#1B1B1C",
    opacity: .9,
    superLayer: banner,
    width: exports.width,
    maxY: banner.y,
    height: exports.height
  });
  exports.bgBlur(bannerBuffer);
  if (setup.animated === true) {
    banner.y = 0 - banner.height;
    banner.animate({
      properties: {
        y: 0
      },
      time: .25,
      curve: "ease-in-out"
    });
  }
  if (setup.duration) {
    Utils.delay(setup.duration, function() {
      return banner.animate({
        properties: {
          maxY: 0
        },
        time: .25,
        curve: "ease-in-out"
      });
    });
    Utils.delay(setup.duration + .25, function() {
      return banner.destroy();
    });
  }
  banner.icon = setup.icon;
  banner.title = title;
  banner.message = message;
  return banner;
};

exports.Button = function(array) {
  var backgroundColor, button, color, rgbString, rgbaString, setup, textLayer;
  setup = setupComponent("button", array);
  button = new Layer({
    name: setup.name
  });
  button.buttonType = setup.buttonType;
  button.type = setup.type;
  color = "";
  if (setup.constraints) {
    button.constraints = setup.constraints;
  }
  if (setup.superLayer) {
    setup.superLayer.addSubLayer(button);
  }
  switch (setup.buttonType) {
    case "big":
      this.fontSize = 20;
      this.top = 18;
      this.fontWeight = "medium";
      if (button.constraints === void 0) {
        button.constraints = {};
      }
      if (button.constraints.leading === void 0) {
        button.constraints.leading = 10;
      }
      if (button.constraints.trailing === void 0) {
        button.constraints.trailing = 10;
      }
      if (button.constraints.height === void 0) {
        button.constraints.height = 57;
      }
      button.borderRadius = exports.px(12.5);
      backgroundColor = "";
      switch (setup.style) {
        case "light":
          color = "#007AFF";
          if (setup.blur) {
            backgroundColor = "rgba(255, 255, 255, .9)";
            exports.bgBlur(button);
          } else {
            backgroundColor = "white";
          }
          break;
        case "dark":
          color = "#FFF";
          if (setup.blur) {
            backgroundColor = "rgba(43, 43, 43, .9)";
            exports.bgBlur(button);
          } else {
            backgroundColor = "#282828";
          }
          break;
        default:
          if (setup.blur) {
            color = setup.color;
            backgroundColor = new Color(setup.backgroundColor);
            rgbString = backgroundColor.toRgbString();
            rgbaString = rgbString.replace(")", ", .9)");
            rgbaString = rgbaString.replace("rgb", "rgba");
            backgroundColor = rgbaString;
            exports.bgBlur(button);
          } else {
            color = setup.color;
            backgroundColor = new Color(setup.backgroundColor);
          }
      }
      button.backgroundColor = backgroundColor;
      button.on(Events.TouchStart, function() {
        var newColor;
        newColor = "";
        if (setup.style === "dark") {
          newColor = button.backgroundColor.lighten(10);
        } else {
          newColor = button.backgroundColor.darken(10);
        }
        return button.animate({
          properties: {
            backgroundColor: newColor
          },
          time: .5
        });
      });
      button.on(Events.TouchEnd, function() {
        return button.animate({
          properties: {
            backgroundColor: backgroundColor
          },
          time: .5
        });
      });
      break;
    case "small":
      this.fontSize = 16;
      this.top = 4;
      button.borderRadius = exports.px(2.5);
      switch (setup.style) {
        case "light":
          color = "#007AFF";
          button.borderColor = "#007AFF";
          break;
        default:
          color = setup.color;
          button.borderColor = setup.color;
      }
      button.backgroundColor = "transparent";
      button.borderWidth = exports.px(1);
      break;
    default:
      button.backgroundColor = "transparent";
      color = setup.color;
      this.fontSize = setup.fontSize;
      this.fontWeight = setup.fontWeight;
      button.on(Events.TouchStart, function() {
        var newColor;
        newColor = button.subLayers[0].color.lighten(30);
        return button.subLayers[0].animate({
          properties: {
            color: newColor
          },
          time: .5
        });
      });
      button.on(Events.TouchEnd, function() {
        return button.subLayers[0].animate({
          properties: {
            color: setup.color
          },
          time: .5
        });
      });
  }
  textLayer = new exports.Text({
    text: setup.text,
    color: color,
    superLayer: button,
    fontSize: this.fontSize,
    fontWeight: this.fontWeight
  });
  textLayer.constraints = {
    align: "center"
  };
  switch (setup.buttonType) {
    case "small":
      button.props = {
        width: textLayer.width + exports.px(60),
        height: textLayer.height + exports.px(10)
      };
      button.on(Events.TouchStart, function() {
        button.animate({
          properties: {
            backgroundColor: color
          },
          time: .5
        });
        return textLayer.animate({
          properties: {
            color: "#FFF"
          },
          time: .5
        });
      });
      button.on(Events.TouchEnd, function() {
        button.animate({
          properties: {
            backgroundColor: "transparent"
          },
          time: .5
        });
        return textLayer.animate({
          properties: {
            color: color
          },
          time: .5
        });
      });
      break;
    default:
      button.props = {
        width: textLayer.width,
        height: textLayer.height
      };
  }
  exports.layout();
  button.label = textLayer;
  return button;
};

exports.Field = function(array) {
  var field, placeholder, setup, text;
  setup = setupComponent("field", array);
  field = new Layer({
    borderRadius: exports.px(setup.borderRadius),
    backgroundColor: setup.backgroundColor,
    width: exports.px(setup.width),
    height: exports.px(setup.height)
  });
  if (setup.constraints) {
    field.constraints = setup.constraints;
  }
  field.active = false;
  text = new exports.Text({
    style: "fieldText",
    superLayer: field,
    text: setup.text,
    fontSize: setup.fontSize,
    fontWeight: setup.fontWeight,
    color: setup.color
  });
  if (setup.textConstraints) {
    text.constraints = setup.textConstraints;
  }
  field.text = text;
  if (setup.superLayer) {
    setup.superLayer.addSubLayer(field);
  }
  text.on("change:html", function() {
    if (text.html === "") {
      field.cursor.constraints = {
        align: "vertical",
        leading: 8
      };
    } else {
      field.cursor.constraints = {
        align: "vertical",
        trailingEdges: text
      };
    }
    if (field.placeholder) {
      return field.placeholder.visible = false;
    }
  });
  if (setup.text === "" || setup.text === void 0) {
    placeholder = new exports.Text({
      style: "fieldPlaceholder",
      superLayer: field,
      text: setup.placeholderText,
      fontSize: setup.fontSize,
      fontWeight: setup.fontWeight,
      color: setup.placeholderColor
    });
    if (setup.textConstraints) {
      placeholder.constraints = setup.textConstraints;
    }
    field.placeholder = placeholder;
  }
  field.on(Events.TouchEnd, function() {
    var clickZone, cursor, keyboard, keys;
    field.active = true;
    text.visible = true;
    clickZone = new Layer({
      name: "fieldActive",
      opacity: 0
    });
    if (setup.input) {
      keyboard = new exports.Keyboard({
        animated: true,
        output: field,
        returnText: setup.returnText,
        returnColor: setup.returnColor
      });
      field.keyboard = keyboard;
      clickZone.constraints = {
        top: 0,
        bottom: keyboard.specs.height,
        leading: 0,
        trailing: 0
      };
    } else {
      clickZone.constraints = {
        top: 0,
        bottom: 0,
        leading: 0,
        trailing: 0
      };
    }
    clickZone.on(Events.TouchEnd, function(handler) {
      field.keyboard.animate({
        properties: {
          y: exports.height
        },
        time: .4,
        curve: "ease-in-out"
      });
      return Utils.delay(.5, function() {
        field.keyboard.destroy();
        field.active = false;
        return clickZone.destroy();
      });
    });
    field.clickZone = clickZone;
    if (exports.device === "ipad") {
      field.keyboard.keys.dismiss.on(Events.TouchEnd, function() {
        field.keyboard.animate({
          properties: {
            y: exports.height
          },
          time: .4,
          curve: "ease-in-out"
        });
        return Utils.delay(.5, function() {
          field.keyboard.destroy();
          field.active = false;
          return clickZone.destroy();
        });
      });
    }
    keys = Object.keys(setup.cursor);
    if (keys.length < 1) {
      setup.cursor.constraints = {
        align: "vertical",
        leading: 8
      };
      setup.cursor.width = 2;
      setup.cursor.height = 20;
    }
    if (field.cursor === void 0) {
      listenToKeys(field, keyboard);
      cursor = new Layer({
        width: exports.px(setup.cursor.width),
        height: exports.px(setup.cursor.height),
        superLayer: field,
        name: "cursor",
        backgroundColor: exports.color("blue"),
        borderRadius: exports.px(1)
      });
      field.cursor = cursor;
      cursor.constraints = setup.cursor.constraints;
      Utils.interval(.5, function() {
        if (field.active === true) {
          if (field.cursor.opacity === 0) {
            return field.cursor.animate({
              properties: {
                opacity: 1
              },
              time: .3
            });
          } else {
            return field.cursor.animate({
              properties: {
                opacity: 0
              },
              time: .3
            });
          }
        } else {
          return field.cursor.opacity = 0;
        }
      });
    }
    return exports.layout();
  });
  exports.layout();
  return field;
};

exports.StatusBar = function(array) {
  var batteryIcon, batteryPercent, bluetooth, carrier, dot, gripper, i, l, layer, len1, m, n, network, noNetwork, nonDot, nonDots, ref, ref1, ref2, setup, signal, statusBar, time;
  setup = setupComponent("statusBar", array);
  statusBar = new Layer({
    backgroundColor: "transparent",
    name: "statusBar.all"
  });
  statusBar.type = setup.type;
  statusBar.constraints = {
    leading: 0,
    trailing: 0,
    height: 20
  };
  switch (exports.device) {
    case "iphone-6s-plus":
      this.topConstraint = 5;
      this.batteryIcon = 6;
      this.bluetooth = 5;
      break;
    case "fullscreen":
      this.batteryIcon = -12;
      this.bluetooth = -10;
      break;
    default:
      this.topConstraint = 3;
      this.batteryIcon = 2;
      this.bluetooth = 3;
  }
  if (setup.style === "light") {
    this.color = "white";
  } else {
    this.color = "black";
  }
  ref = Framer.CurrentContext.layers;
  for (l = 0, len1 = ref.length; l < len1; l++) {
    layer = ref[l];
    if (layer.type === "lockScreen") {
      this.isLockScreenPresent = true;
    }
  }
  if (this.isLockScreenPresent) {
    gripper = new Layer({
      superLayer: statusBar,
      width: exports.px(37),
      height: exports.px(5),
      name: "gripper",
      backgroundColor: "transparent",
      opacity: .5,
      name: "gripper"
    });
    gripper.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(37)) + "px' height='" + (exports.px(5)) + "px' viewBox='0 0 37 5' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Gripper</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Keyboard/Auto-Complete-Bar-Closed' transform='translate(-169.000000, -2.000000)' fill='#FFFFFF'> <rect id='Gripper' x='169.5' y='2.5' width='36' height='4' rx='2.5'></rect> </g> </g> </svg>";
    gripper.constraints = {
      align: "horizontal",
      top: 2
    };
  } else {
    this.time = exports.getTime();
    if (setup.clock24 === false) {
      if (this.time.hours > 11) {
        this.time.stamp = "PM";
      } else {
        this.time.stamp = "AM";
      }
    } else {
      this.time.stamp = "";
    }
    time = new exports.Text({
      style: "statusBarTime",
      text: exports.timeFormatter(this.time, setup.clock24) + " " + this.time.stamp,
      fontSize: 12,
      fontWeight: "semibold",
      superLayer: statusBar,
      color: this.color,
      name: "time"
    });
    time.constraints = {
      align: "horizontal",
      top: this.topConstraint
    };
  }
  signal = [];
  if (setup.signal < 1) {
    noNetwork = new exports.Text({
      superLayer: statusBar,
      fontSize: 12,
      text: "No Network"
    });
    noNetwork.constraints = {
      leading: 7,
      top: 3
    };
  } else {
    for (i = m = 0, ref1 = setup.signal; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
      dot = new Layer({
        height: exports.px(5.5),
        width: exports.px(5.5),
        backgroundColor: "black",
        superLayer: statusBar,
        borderRadius: exports.px(5.5) / 2,
        backgroundColor: this.color,
        name: "signal[" + i + "]"
      });
      if (i === 0) {
        dot.constraints = {
          leading: 7,
          top: 7
        };
      } else {
        dot.constraints = {
          leading: [signal[i - 1], 1],
          top: 7
        };
      }
      signal.push(dot);
      exports.layout();
    }
    if (setup.signal < 5) {
      nonDots = 5 - setup.signal;
      for (i = n = 0, ref2 = nonDots; 0 <= ref2 ? n < ref2 : n > ref2; i = 0 <= ref2 ? ++n : --n) {
        nonDot = new Layer({
          height: exports.px(5.5),
          width: exports.px(5.5),
          superLayer: statusBar,
          borderRadius: exports.px(5.5) / 2,
          backgroundColor: "transparent",
          name: "signal[" + signal.length + "]"
        });
        nonDot.style.border = (exports.px(1)) + "px solid " + this.color;
        nonDot.constraints = {
          leading: [signal[signal.length - 1], 1],
          top: 7
        };
        signal.push(nonDot);
        exports.layout();
      }
    }
    carrier = new exports.Text({
      style: "statusBarCarrier",
      text: setup.carrier,
      superLayer: statusBar,
      fontSize: 12,
      color: this.color,
      name: "carrier",
      textTransform: "capitalize"
    });
    carrier.constraints = {
      leading: [signal[signal.length - 1], 7],
      top: 3
    };
    exports.layout();
    if (setup.carrier) {
      network = new exports.Text({
        style: "statusBarNetwork",
        text: setup.network,
        superLayer: statusBar,
        fontSize: 12,
        color: this.color,
        name: "network",
        textTransform: "uppercase"
      });
      network.constraints = {
        leading: [carrier, 5],
        top: 3
      };
    }
    if (setup.carrier === "" || setup.carrier === "wifi") {
      network = new Layer({
        width: exports.px(14),
        height: exports.px(10),
        superLayer: statusBar,
        backgroundColor: "transparent",
        name: "network"
      });
      network.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(14)) + "px' height='" + (exports.px(10)) + "px' viewBox='0 0 14 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Wi-Fi</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Status-Bar/Black/Charging' transform='translate(-87.000000, -5.000000)' fill='" + this.color + "'> <path d='M96.1444208,12.4385043 C95.626374,11.8454456 94.8523616,11.4689119 93.987563,11.4689119 C93.1390073,11.4689119 92.3778594,11.8314341 91.8601652,12.4053177 L94.0225391,14.5 L96.1444208,12.4385043 Z M98.3234964,10.3214425 C97.2447794,9.19174563 95.7014387,8.48445596 93.987563,8.48445596 C92.2882723,8.48445596 90.7566264,9.17975893 89.6792698,10.2926936 L90.7692987,11.3486 C91.567205,10.5053708 92.713648,9.97668394 93.987563,9.97668394 C95.2768836,9.97668394 96.4356305,10.518235 97.2346215,11.3793293 L98.3234964,10.3214425 L98.3234964,10.3214425 Z M100.5,8.20687933 C98.8629578,6.53943672 96.5505699,5.5 93.987563,5.5 C91.4375103,5.5 89.1355496,6.52895605 87.5,8.18164431 L88.5895579,9.23709441 C89.9460798,7.85431655 91.8628921,6.99222798 93.987563,6.99222798 C96.1260026,6.99222798 98.0538809,7.86552609 99.4118698,9.26404272 L100.5,8.20687933 Z' id='Wi-Fi'></path> </g> </g> </svg>";
      network.constraints = {
        leading: [signal[signal.length - 1], 7],
        top: this.topConstraint
      };
    }
  }
  batteryIcon = new Layer({
    width: exports.px(25),
    height: exports.px(10),
    superLayer: statusBar,
    backgroundColor: "transparent",
    name: "batteryIcon"
  });
  if (setup.battery > 70) {
    batteryIcon.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(25)) + "px' height='" + (exports.px(10)) + "px' viewBox='0 0 25 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Battery</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Status-Bar/Black/100%' transform='translate(-345.000000, -5.000000)' fill='" + this.color + "'> <path d='M346.493713,5.5 C345.668758,5.5 345,6.16802155 345,7.00530324 L345,13.4946968 C345,14.3260528 345.67338,15 346.493713,15 L366.006287,15 C366.831242,15 367.5,14.3319784 367.5,13.4946968 L367.5,7.00530324 C367.5,6.17394722 366.82662,5.5 366.006287,5.5 L346.493713,5.5 Z M368,8.5 L368,12 L368.75,12 C369.164214,12 369.5,11.6644053 369.5,11.25774 L369.5,9.24225998 C369.5,8.83232111 369.167101,8.5 368.75,8.5 L368,8.5 Z M346.508152,6 C345.951365,6 345.5,6.45699692 345.5,7.00844055 L345.5,13.4915594 C345.5,14.0485058 345.949058,14.5 346.508152,14.5 L365.991848,14.5 C366.548635,14.5 367,14.0430031 367,13.4915594 L367,7.00844055 C367,6.45149422 366.550942,6 365.991848,6 L346.508152,6 Z M346.506744,6.5 C346.226877,6.5 346,6.71637201 346,6.99209595 L346,13.5079041 C346,13.7796811 346.230225,14 346.506744,14 L365.993256,14 C366.273123,14 366.5,13.783628 366.5,13.5079041 L366.5,6.99209595 C366.5,6.72031886 366.269775,6.5 365.993256,6.5 L346.506744,6.5 Z' id='Battery'></path> </g> </g> </svg>";
  }
  if (setup.battery <= 70 && setup.battery > 20) {
    batteryIcon.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(25)) + "px' height='" + (exports.px(10)) + "px' viewBox='0 0 25 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Battery</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Status-Bar/White/100%' transform='translate(-345.000000, -5.000000)' fill='" + this.color + "'> <path d='M346.493713,5.5 C345.668758,5.5 345,6.16802155 345,7.00530324 L345,13.4946968 C345,14.3260528 345.67338,15 346.493713,15 L366.006287,15 C366.831242,15 367.5,14.3319784 367.5,13.4946968 L367.5,7.00530324 C367.5,6.17394722 366.82662,5.5 366.006287,5.5 L346.493713,5.5 Z M368,8.5 L368,12 L368.75,12 C369.164214,12 369.5,11.6644053 369.5,11.25774 L369.5,9.24225998 C369.5,8.83232111 369.167101,8.5 368.75,8.5 L368,8.5 Z M346.508152,6 C345.951365,6 345.5,6.45699692 345.5,7.00844055 L345.5,13.4915594 C345.5,14.0485058 345.949058,14.5 346.508152,14.5 L365.991848,14.5 C366.548635,14.5 367,14.0430031 367,13.4915594 L367,7.00844055 C367,6.45149422 366.550942,6 365.991848,6 L346.508152,6 Z M346.501231,6.5 C346.224409,6.5 346,6.71637201 346,6.99209595 L346,13.5079041 C346,13.7796811 346.229751,14 346.501231,14 L356.498769,14 C356.775591,14 357,13.783628 357,13.5079041 L357,6.99209595 C357,6.72031886 356.770249,6.5 356.498769,6.5 L346.501231,6.5 Z' id='Battery'></path> </g> </g> </svg>";
  }
  if (setup.battery <= 20) {
    batteryIcon.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(25)) + "px' height='" + (exports.px(10)) + "px' viewBox='0 0 25 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Battery</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Status-Bar/White/100%' transform='translate(-345.000000, -5.000000)' fill='" + this.color + "'> <path d='M346.493713,5.5 C345.668758,5.5 345,6.16802155 345,7.00530324 L345,13.4946968 C345,14.3260528 345.67338,15 346.493713,15 L366.006287,15 C366.831242,15 367.5,14.3319784 367.5,13.4946968 L367.5,7.00530324 C367.5,6.17394722 366.82662,5.5 366.006287,5.5 L346.493713,5.5 Z M368,8.5 L368,12 L368.75,12 C369.164214,12 369.5,11.6644053 369.5,11.25774 L369.5,9.24225998 C369.5,8.83232111 369.167101,8.5 368.75,8.5 L368,8.5 Z M346.508152,6 C345.951365,6 345.5,6.45699692 345.5,7.00844055 L345.5,13.4915594 C345.5,14.0485058 345.949058,14.5 346.508152,14.5 L365.991848,14.5 C366.548635,14.5 367,14.0430031 367,13.4915594 L367,7.00844055 C367,6.45149422 366.550942,6 365.991848,6 L346.508152,6 Z M346.490479,6.5 C346.219595,6.5 346,6.71637201 346,6.99209595 L346,13.5079041 C346,13.7796811 346.215057,14 346.490479,14 L349.509521,14 C349.780405,14 350,13.783628 350,13.5079041 L350,6.99209595 C350,6.72031886 349.784943,6.5 349.509521,6.5 L346.490479,6.5 Z' id='Battery'></path> </g> </g> </svg>";
  }
  batteryPercent = new exports.Text({
    style: "statusBarBatteryPercent",
    text: setup.battery + "%",
    superLayer: statusBar,
    fontSize: 12,
    color: this.color,
    name: "batteryPercent"
  });
  batteryPercent.constraints = {
    trailing: [batteryIcon, 3],
    verticalCenter: time
  };
  batteryIcon.constraints = {
    trailing: 7,
    top: this.batteryIcon
  };
  bluetooth = new Layer({
    width: exports.px(8),
    height: exports.px(15),
    superLayer: statusBar,
    opacity: .5,
    backgroundColor: "transparent",
    name: "bluetooth"
  });
  bluetooth.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(7)) + "px' height='" + (exports.px(13)) + "px' viewBox='0 0 8 15' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Bluetooth</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Status-Icons-(White)' transform='translate(-137.000000, 0.000000)' fill='" + this.color + "'> <path d='M140.5,14.5 L145,10.25 L141.8,7.5 L145,4.75 L140.5,0.5 L140.5,6.07142857 L137.8,3.75 L137,4.5 L140.258333,7.375 L137,10.25 L137.8,11 L140.5,8.67857143 L140.5,14.5 Z M141.5,3 L143.366667,4.75 L141.5,6.25 L141.5,3 Z M141.5,8.5 L143.366667,10.25 L141.5,12 L141.5,8.5 Z' id='Bluetooth'></path> </g> </g> </svg>";
  bluetooth.constraints = {
    top: this.bluetooth,
    trailing: [batteryPercent, 7]
  };
  exports.layout();
  statusBar.battery = {};
  statusBar.battery.percent = batteryPercent;
  statusBar.battery.icon = batteryIcon;
  statusBar.bluetooth = bluetooth;
  statusBar.time = time;
  statusBar.network = network;
  statusBar.carrier = carrier;
  statusBar.signal = signal;
  return statusBar;
};

exports.Keyboard = function(array) {
  var board, boardSpecs, box, deleteIcon, deleteKey, em, emojiFormatter, emojiIcon, emojiKey, emojiSections, emojisArray, extraSymbol, firstRowKeyWidth, freqEmojisArray, frequentlyUsedEmojisRaw, index, key, keyPopUp, keyboardIcon, keyboardKey, keysArray, l, len1, len2, len3, letter, lettersArray, m, n, numKey, numKey2, numsArray, path, rawEmojis, returnKey, rowIndex, rowsMap, secondArray, secondRowKeyWidth, setup, shiftIcon, shiftIcon2, shiftKey, shiftKey2, spaceKey, storedTextColor, thirdArray;
  setup = setupComponent("keyboard", array);
  boardSpecs = {};
  switch (exports.device) {
    case "iphone-5":
      boardSpecs.height = 215;
      boardSpecs.key = {
        width: exports.px(26),
        height: exports.px(39)
      };
      boardSpecs.expandedKey = exports.px(39);
      boardSpecs.expandedSpacer = exports.px(12);
      boardSpecs.padding = {};
      boardSpecs.padding.row1 = exports.px(3);
      boardSpecs.padding.row2 = exports.px(19);
      boardSpecs.padding.row3 = exports.px(54);
      boardSpecs.marginTop = {};
      boardSpecs.marginTop.row1 = exports.px(11);
      boardSpecs.marginTop.row2 = exports.px(26);
      boardSpecs.marginTop.row3 = exports.px(41);
      boardSpecs.marginTop.row4 = exports.px(55);
      boardSpecs.shiftIcon = {
        x: exports.px(9),
        y: exports.px(2)
      };
      boardSpecs.deleteIcon = {
        x: exports.px(7),
        y: exports.px(10)
      };
      boardSpecs.emojiIcon = {
        x: exports.px(8),
        y: exports.px(9)
      };
      boardSpecs.sideKey = exports.px(36.5);
      boardSpecs.sideKeyRadius = exports.px(4);
      boardSpecs.sideKeyBottom = exports.px(58);
      boardSpecs.iPadDeleteOffset = 0;
      boardSpecs.bottomRow = 8;
      boardSpecs.returnKey = exports.px(74);
      boardSpecs.spacer = exports.px(6);
      break;
    case "iphone-6s":
      boardSpecs.height = 216;
      boardSpecs.key = {
        width: exports.px(31.5),
        height: exports.px(42)
      };
      boardSpecs.expandedKey = exports.px(46.5);
      boardSpecs.expandedSpacer = exports.px(14);
      boardSpecs.padding = {};
      boardSpecs.padding.row1 = exports.px(3);
      boardSpecs.padding.row2 = exports.px(22);
      boardSpecs.padding.row3 = exports.px(59);
      boardSpecs.marginTop = {};
      boardSpecs.marginTop.row1 = exports.px(10);
      boardSpecs.marginTop.row2 = exports.px(22);
      boardSpecs.marginTop.row3 = exports.px(34);
      boardSpecs.marginTop.row4 = exports.px(44);
      boardSpecs.shiftIcon = {
        x: exports.px(11),
        y: exports.px(2)
      };
      boardSpecs.deleteIcon = {
        x: exports.px(10),
        y: exports.px(13)
      };
      boardSpecs.emojiIcon = {
        x: exports.px(11),
        y: exports.px(11)
      };
      boardSpecs.returnKey = exports.px(87.5);
      boardSpecs.bottomRow = 6;
      boardSpecs.iPadDeleteOffset = 0;
      boardSpecs.sideKey = exports.px(42);
      boardSpecs.sideKeyRadius = exports.px(5);
      boardSpecs.sideKeyBottom = exports.px(56);
      boardSpecs.spacer = exports.px(6);
      break;
    case "iphone-6s-plus":
      boardSpecs.height = 226;
      boardSpecs.key = {
        width: exports.px(35),
        height: exports.px(45)
      };
      boardSpecs.expandedKey = exports.px(50);
      boardSpecs.expandedSpacer = exports.px(20);
      boardSpecs.padding = {};
      boardSpecs.padding.row1 = exports.px(4);
      boardSpecs.padding.row2 = exports.px(25);
      boardSpecs.padding.row3 = exports.px(67);
      boardSpecs.marginTop = {};
      boardSpecs.marginTop.row1 = exports.px(8);
      boardSpecs.marginTop.row2 = exports.px(19);
      boardSpecs.marginTop.row3 = exports.px(30);
      boardSpecs.marginTop.row4 = exports.px(41);
      boardSpecs.shiftIcon = {
        x: exports.px(13),
        y: exports.px(2)
      };
      boardSpecs.deleteIcon = {
        x: exports.px(11),
        y: exports.px(14)
      };
      boardSpecs.emojiIcon = {
        x: exports.px(13),
        y: exports.px(13)
      };
      boardSpecs.bottomRow = 6;
      boardSpecs.iPadDeleteOffset = 0;
      boardSpecs.returnKey = exports.px(97);
      boardSpecs.sideKey = exports.px(45);
      boardSpecs.sideKeyRadius = exports.px(5);
      boardSpecs.spacer = exports.px(6);
      break;
    case "ipad":
      boardSpecs.height = 268;
      boardSpecs.key = {
        width: exports.px(56),
        height: exports.px(56)
      };
      boardSpecs.padding = {};
      boardSpecs.padding.row1 = exports.px(6);
      boardSpecs.padding.row2 = exports.px(35);
      boardSpecs.padding.row3 = exports.px(74);
      boardSpecs.marginTop = {};
      boardSpecs.marginTop.row1 = exports.px(10);
      boardSpecs.marginTop.row2 = exports.px(18);
      boardSpecs.marginTop.row3 = exports.px(28);
      boardSpecs.marginTop.row4 = exports.px(40);
      boardSpecs.shiftIcon = {
        x: exports.px(18),
        y: exports.px(2)
      };
      boardSpecs.deleteIcon = {
        x: exports.px(18),
        y: exports.px(20)
      };
      boardSpecs.emojiIcon = {
        x: exports.px(18),
        y: exports.px(18)
      };
      boardSpecs.bottomRow = 7;
      boardSpecs.iPadDeleteOffset = boardSpecs.marginTop.row3 + boardSpecs.key.height * 2 - boardSpecs.marginTop.row1;
      boardSpecs.returnKey = exports.px(106);
      boardSpecs.sideKey = exports.px(56);
      boardSpecs.sideKey2 = exports.px(76);
      boardSpecs.sideKeyRadius = exports.px(5);
      boardSpecs.spacer = exports.px(12);
  }
  board = new Layer({
    backgroundColor: "#D1D5DA",
    name: "keyboard"
  });
  board.specs = boardSpecs;
  board.constraints = {
    height: boardSpecs.height,
    trailing: 0,
    leading: 0
  };
  exports.layout();
  if (setup.animated) {
    board.y = exports.height;
    board.animate({
      properties: {
        maxY: exports.height
      },
      time: .25,
      curve: "ease-in-out"
    });
  } else {
    board.maxY = exports.height;
  }
  lettersArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
  secondArray = [];
  thirdArray = [];
  switch (exports.device) {
    case "ipad":
      secondArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "/", ":", ";", "(", ")", "$", "&", "@", "undo", "hide", ".", ',', "?", "!", "'", "\""];
      thirdArray = ["\[", "\]", "\{", "\}", "#", "%", "^", "*", "+", "=", "_", "\\", "|", "~", "<", ">", "€", "£", "¥", "redo", "hide", ".", ',', "?", "!", "'", "\""];
      break;
    default:
      secondArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "/", ":", ";", "(", ")", "$", "&", "@", "\"", ".", ',', "?", "!", "'"];
      thirdArray = ["\[", "\]", "\{", "\}", "#", "%", "^", "*", "+", "=", "_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•", ".", ',', "?", "!", "'", "\""];
  }
  if (exports.device === "ipad") {
    lettersArray.push(",");
    lettersArray.push(".");
  }
  numsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  keysArray = [];
  keyPopUp = new Layer({
    width: this.keyWidth,
    height: this.keyHeight,
    x: this.x - 16 * exports.scale,
    backgroundColor: "transparent",
    superLayer: board,
    name: "key pop up"
  });
  box = new Layer({
    borderRadius: exports.px(10),
    superLayer: keyPopUp,
    backgroundColor: "transparent",
    color: "black",
    name: "letter"
  });
  box.style = {
    "font-size": 39 * exports.scale + "px",
    "font-weight": 300,
    "font-family": '-apple-system, Helvetica, Arial, sans-serif',
    'text-align': 'center',
    'line-height': this.lineHeight
  };
  this.color = "white";
  path = new Layer({
    superLayer: keyPopUp,
    backgroundColor: "transparent",
    name: "shape path"
  });
  board.keyPopUp = keyPopUp;
  board.keyPopUp.box = box;
  rowsMap = [
    {
      "padding": boardSpecs.padding.row1,
      "startIndex": 0,
      "endIndex": 9,
      "marginTop": boardSpecs.marginTop.row1
    }, {
      "padding": boardSpecs.padding.row2,
      "startIndex": 10,
      "endIndex": 18,
      "marginTop": boardSpecs.marginTop.row2
    }, {
      "padding": boardSpecs.padding.row3,
      "startIndex": 19,
      "endIndex": 25,
      "marginTop": boardSpecs.marginTop.row3
    }
  ];
  firstRowKeyWidth = 0;
  secondRowKeyWidth = 0;
  board.keys = {};
  for (l = 0, len1 = lettersArray.length; l < len1; l++) {
    letter = lettersArray[l];
    index = lettersArray.indexOf(letter);
    key = new Layer({
      name: letter,
      superLayer: board,
      borderRadius: 5 * exports.scale,
      backgroundColor: "white",
      color: "black",
      shadowY: exports.px(1),
      shadowColor: "#929498",
      width: boardSpecs.key.width,
      height: boardSpecs.key.height
    });
    board.keys[letter] = key;
    keyPopUp.bringToFront();
    box.bringToFront();
    if (exports.scale === 2) {
      keyPopUp.constraints = {
        width: 65,
        height: 122
      };
      path.constraints = {
        width: 65,
        height: 122
      };
      path.y = 10;
      this.pathWidth = exports.px(65);
      this.pathHeight = exports.px(122);
      this.keyHeight = exports.px(32);
      this.keyWidth = exports.px(44);
      this.lineHeight = this.keyWidth - 17 + "px";
      box.constraints = {
        width: 32,
        height: 44
      };
      box.centerX();
      box.y = exports.px(28);
    }
    if (exports.scale === 3) {
      keyPopUp.constraints = {
        width: 68,
        height: 122
      };
      this.keyHeight = exports.px(122);
      this.keyWidth = exports.px(65);
      this.lineHeight = this.keyWidth + "px";
      this.pathWidth = exports.px(68);
      this.pathHeight = exports.px(128);
      path.y = 0;
      box.constraints = {
        width: 35,
        height: 46
      };
      box.centerX();
      box.y = exports.px(28);
    }
    if (exports.width === 640) {
      key.constraints = {
        width: 26,
        height: 39
      };
    }
    keyPopUp.visible = false;
    exports.layout();
    key.style = {
      "font-size": 25 * exports.scale + "px",
      "font-weight": 300,
      "font-family": '-apple-system, Helvetica, Arial, sans-serif',
      'text-align': 'center',
      'line-height': key.height - exports.px(2) + "px"
    };
    if (letter === "," || letter === ".") {
      extraSymbol = new Layer({
        superLayer: key,
        width: exports.px(30),
        height: exports.px(30),
        backgroundColor: "transparent",
        y: exports.px(15),
        color: exports.color("black"),
        name: "!/?"
      });
      extraSymbol.centerX();
      extraSymbol.style = {
        "font-size": exports.px(24) + "px",
        "font-weight": 300,
        "font-family": '-apple-system, Helvetica, Arial, sans-serif',
        'text-align': 'center',
        'line-height': "20px"
      };
      switch (letter) {
        case ",":
          extraSymbol.html = "!";
          break;
        case ".":
          extraSymbol.html = "?";
      }
      key.style["line-height"] = key.height + exports.px(10) + "px";
    }
    key.html = letter;
    if (index <= rowsMap[0].endIndex) {
      rowIndex = index - rowsMap[0].startIndex;
      key.x = rowsMap[0].padding + (rowIndex * boardSpecs.spacer) + firstRowKeyWidth;
      key.y = rowsMap[0].marginTop;
      if (exports.device === "ipad") {
        if (index % 2 !== 0) {
          key.width = key.width + exports.px(2);
        } else {
          key.width = key.width + exports.px(1);
        }
      }
      firstRowKeyWidth = firstRowKeyWidth + key.width;
    }
    if (index > rowsMap[0].endIndex && index <= rowsMap[1].endIndex) {
      rowIndex = index - rowsMap[1].startIndex;
      key.x = rowsMap[1].padding + (rowIndex * boardSpecs.spacer) + secondRowKeyWidth;
      key.y = rowsMap[1].marginTop + key.height;
      key.width = key.width + exports.px(1);
      secondRowKeyWidth = secondRowKeyWidth + key.width;
    }
    if (index > rowsMap[1].endIndex) {
      rowIndex = index - rowsMap[2].startIndex;
      key.x = rowsMap[2].padding + (rowIndex * boardSpecs.spacer) + (rowIndex * key.width);
      key.y = rowsMap[2].marginTop + key.height * 2;
    }
    path.html = "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + this.pathWidth + "px' height='" + this.pathHeight + "' viewBox='0 0 63 114' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <title>Rectangle 44 Copy</title> <desc>Created with Sketch.</desc> <defs> <filter x='-50%' y='-50%' width='200%' height='200%' filterUnits='objectBoundingBox' id='filter-1'> <feOffset dx='0' dy='0' in='SourceAlpha' result='shadowOffsetOuter1'></feOffset> <feGaussianBlur stdDeviation='1.5' in='shadowOffsetOuter1' result='shadowBlurOuter1'></feGaussianBlur> <feColorMatrix values='0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.21 0' in='shadowBlurOuter1' type='matrix' result='shadowMatrixOuter1'></feColorMatrix> <feMerge> <feMergeNode in='shadowMatrixOuter1'></feMergeNode> <feMergeNode in='SourceGraphic'></feMergeNode> </feMerge> </filter> </defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6' sketch:type='MSArtboardGroup' transform='translate(-118.000000, -240.000000)' stroke='#C7C7C7' filter='url(#filter-1)' stroke-width='0.5' fill='#FFFFFF' opacity='0.998367537'> <path d='M134,306 C134,306 121,295 121,290 C121,279.616788 121,253.001456 121,253.001456 C121,247.477804 125.485832,243 131.002774,243 L167.862127,243 C173.386507,243 177.880862,247.469905 177.900044,252.997271 C177.900044,252.997271 178,280 177.999999,290 C177.999999,295.006553 165,306 165,306 L165,346.049594 C165,348.806807 162.770556,351.041969 160.002098,351.041969 L138.997902,351.041969 C136.237637,351.041969 134,348.808331 134,346.049594 L134,306 Z' id='Rectangle-44-Copy' sketch:type='MSShapeGroup' transform='translate(149.500000, 297.020985) scale(-1, 1) translate(-149.500000, -297.020985) '> </path> </g> </g> </svg>";
    keysArray.push(key);
    if (exports.device !== "ipad" && exports.device !== "ipad-pro") {
      key.on(Events.TouchStart, function() {
        keyPopUp.visible = true;
        box.html = this.name;
        keyPopUp.maxY = this.maxY;
        return keyPopUp.midX = this.midX;
      });
      key.on(Events.TouchMove, function() {
        box.html = this.name;
        keyPopUp.maxY = this.maxY;
        return keyPopUp.midX = this.midX;
      });
      key.on(Events.TouchEnd, function() {
        return keyPopUp.visible = false;
      });
    } else {
      key.on(Events.TouchStart, function() {
        return this.backgroundColor = exports.color("light-key");
      });
      key.on(Events.TouchEnd, function() {
        return this.backgroundColor = "white";
      });
    }
    key.on(Events.TouchEnd, function() {
      var len2, m;
      if (shiftIcon.states.state === "on") {
        shiftIcon.states["switch"]("default");
        shiftKey.backgroundColor = exports.color("light-key");
        if (exports.device === "ipad") {
          shiftIcon2.states["switch"]("default");
          shiftKey2.backgroundColor = exports.color("light-key");
        }
        for (m = 0, len2 = keysArray.length; m < len2; m++) {
          key = keysArray[m];
          key.style['text-transform'] = 'lowercase';
        }
        box.style['text-transform'] = 'lowercase';
        if (setup.output) {
          this.newText = setup.output.text.html + this.name.toUpperCase();
          return exports.update(setup.output.text, [
            {
              text: this.newText
            }
          ]);
        }
      } else {
        if (setup.output) {
          this.newText = setup.output.text.html + this.name;
          return exports.update(setup.output.text, [
            {
              text: this.newText
            }
          ]);
        }
      }
    });
  }
  board.keysArray = keysArray;
  board.keyboardState = 1;
  shiftKey = new Layer({
    superLayer: board,
    name: "shift",
    borderRadius: boardSpecs.sideKeyRadius,
    color: exports.color("black"),
    backgroundColor: exports.color("light-key"),
    shadowY: exports.px(1),
    shadowColor: "#929498",
    width: boardSpecs.sideKey,
    height: boardSpecs.sideKey,
    y: boardSpecs.marginTop.row3 + boardSpecs.key.height * 2
  });
  shiftKey.constraints = {
    leading: exports.pt(boardSpecs.padding.row1)
  };
  shiftIcon = new Layer({
    width: exports.px(20),
    height: exports.px(19),
    superLayer: shiftKey,
    backgroundColor: "transparent",
    x: boardSpecs.shiftIcon.x,
    y: boardSpecs.shiftIcon.y
  });
  shiftIcon.html = iconLibrary.shift.off;
  shiftIcon.states.add({
    "on": {
      html: iconLibrary.shift.on
    }
  });
  shiftIcon.states.animationOptions = {
    time: .01
  };
  shiftKey.style = {
    "font-size": exports.px(16) + "px",
    "font-weight": 400,
    "font-family": '-apple-system, Helvetica, Arial, sans-serif',
    'text-align': 'center',
    'line-height': boardSpecs.key.height + "px"
  };
  shiftKey.on(Events.TouchEnd, function() {
    var len2, len3, len4, len5, m, n, q, r;
    switch (board.keyboardState) {
      case 1:
        shiftIcon.states.next();
        if (exports.device === "ipad") {
          shiftIcon2.states.next();
        }
        if (shiftIcon.states.state === "on") {
          shiftKey.backgroundColor = "white";
          if (exports.device === "ipad") {
            shiftKey2.backgroundColor = "white";
          }
          for (m = 0, len2 = keysArray.length; m < len2; m++) {
            key = keysArray[m];
            key.style['text-transform'] = 'uppercase';
          }
          return box.style['text-transform'] = 'uppercase';
        } else {
          shiftKey.backgroundColor = exports.color("light-key");
          if (exports.device === "ipad") {
            shiftKey2.backgroundColor = exports.color("light-key");
          }
          for (n = 0, len3 = keysArray.length; n < len3; n++) {
            key = keysArray[n];
            key.style["text-transform"] = 'lowercase';
          }
          return box.style["text-transform"] = 'lowercase';
        }
        break;
      case 2:
        for (index = q = 0, len4 = keysArray.length; q < len4; index = ++q) {
          key = keysArray[index];
          key.html = thirdArray[index];
          key.name = thirdArray[index];
        }
        board.keyboardState = 3;
        shiftKey.html = "123";
        if (exports.device === "ipad") {
          return shiftKey2.html = "123";
        }
        break;
      case 3:
        for (index = r = 0, len5 = keysArray.length; r < len5; index = ++r) {
          key = keysArray[index];
          if (index < 27) {
            key.name = secondArray[index];
            key.html = secondArray[index];
            if (index === 26) {
              key.subLayers[0].visible = false;
            }
          } else {
            key.visible = false;
          }
        }
        shiftKey.html = "#+=";
        if (exports.device === "ipad") {
          shiftKey2.html = "#+=";
        }
        return board.keyboardState = 2;
    }
  });
  board.keys.shift = shiftKey;
  board.keys.shift.icon = shiftIcon;
  deleteKey = new Layer({
    superLayer: board,
    borderRadius: boardSpecs.sideKeyRadius,
    backgroundColor: exports.color("light-key"),
    shadowY: exports.px(1),
    shadowColor: "#929498",
    name: "delete",
    width: boardSpecs.sideKey,
    height: boardSpecs.sideKey,
    y: boardSpecs.marginTop.row3 + boardSpecs.key.height * 2 - boardSpecs.iPadDeleteOffset
  });
  deleteKey.constraints = {
    trailing: exports.pt(boardSpecs.spacer) / 2
  };
  deleteIcon = new Layer({
    superLayer: deleteKey,
    width: exports.px(24),
    height: exports.px(18),
    backgroundColor: "transparent",
    x: boardSpecs.deleteIcon.x,
    y: boardSpecs.deleteIcon.y
  });
  if (exports.device === "ipad") {
    deleteKey.width = deleteKey.width + exports.px(5);
  }
  deleteIcon.states.add({
    "on": {
      html: iconLibrary["delete"].on
    }
  });
  deleteIcon.states.add({
    off: {
      html: iconLibrary["delete"].off
    }
  });
  deleteKey.on(Events.TouchStart, function() {
    deleteKey.backgroundColor = "white";
    return deleteIcon.states.switchInstant("on");
  });
  deleteKey.on(Events.TouchEnd, function() {
    var endLength, initialLength, newText;
    deleteKey.backgroundColor = exports.color("light-key");
    deleteIcon.states.switchInstant("off");
    if (setup.output) {
      initialLength = setup.output.text.html.length;
      newText = setup.output.text.html.slice(0, -1);
      exports.update(setup.output.text, [
        {
          text: newText
        }
      ]);
      endLength = setup.output.text.html.length;
      if (initialLength === endLength) {
        newText = setup.output.text.html.slice(0, -6);
        exports.update(setup.output.text, [
          {
            text: newText
          }
        ]);
      }
      if (setup.output.text.html === "") {
        return setup.output.placeholder.visible = true;
      }
    }
  });
  deleteIcon.states.switchInstant("off");
  board.keys["delete"] = deleteKey;
  board.keys["delete"].icon = deleteIcon;
  if (exports.device === "ipad") {
    keyboardKey = new Layer({
      superLayer: board,
      name: "dismiss",
      borderRadius: boardSpecs.sideKeyRadius,
      backgroundColor: exports.color("light-key"),
      shadowY: exports.px(1),
      shadowColor: "#929498",
      width: boardSpecs.sideKey,
      height: boardSpecs.sideKey
    });
    keyboardKey.constraints = {
      trailingEdges: deleteKey,
      bottom: boardSpecs.bottomRow
    };
    keyboardIcon = new Layer({
      superLayer: keyboardKey,
      width: exports.px(32.5),
      height: exports.px(23.5),
      backgroundColor: "transparent"
    });
    keyboardIcon.html = iconLibrary.keyboard;
    keyboardIcon.center();
    board.keys.dismiss = keyboardKey;
    shiftKey2 = new Layer({
      superLayer: board,
      name: "shift",
      borderRadius: boardSpecs.sideKeyRadius,
      color: exports.color("black"),
      backgroundColor: exports.color("light-key"),
      shadowY: exports.px(1),
      shadowColor: "#929498",
      width: boardSpecs.sideKey2,
      height: boardSpecs.sideKey
    });
    shiftKey2.constraints = {
      trailingEdges: deleteKey,
      bottomEdges: shiftKey
    };
    shiftIcon2 = new Layer({
      width: exports.px(20),
      height: exports.px(19),
      superLayer: shiftKey2,
      backgroundColor: "transparent",
      x: boardSpecs.shiftIcon.x + exports.px(10),
      y: boardSpecs.shiftIcon.y
    });
    shiftIcon2.html = iconLibrary.shift.off;
    shiftKey2.style = {
      "font-size": exports.px(16) + "px",
      "font-weight": 400,
      "font-family": '-apple-system, Helvetica, Arial, sans-serif',
      'text-align': 'center',
      'line-height': boardSpecs.key.height + "px"
    };
    shiftIcon2.states.add({
      "on": {
        html: iconLibrary.shift.on
      }
    });
    shiftIcon2.states.animationOptions = {
      time: .01
    };
    shiftIcon2.on(Events.TouchStart, function() {
      var len2, len3, len4, len5, m, n, q, r;
      switch (board.keyboardState) {
        case 1:
          shiftIcon.states.next();
          shiftIcon2.states.next();
          if (shiftIcon.states.state === "on") {
            shiftKey.backgroundColor = "white";
            shiftKey2.backgroundColor = "white";
            for (m = 0, len2 = keysArray.length; m < len2; m++) {
              key = keysArray[m];
              key.style['text-transform'] = 'uppercase';
            }
            return box.style['text-transform'] = 'uppercase';
          } else {
            shiftKey.backgroundColor = exports.color("light-key");
            shiftKey2.backgroundColor = exports.color("light-key");
            for (n = 0, len3 = keysArray.length; n < len3; n++) {
              key = keysArray[n];
              key.style["text-transform"] = 'lowercase';
            }
            return box.style["text-transform"] = 'lowercase';
          }
          break;
        case 2:
          for (index = q = 0, len4 = keysArray.length; q < len4; index = ++q) {
            key = keysArray[index];
            key.html = thirdArray[index];
            key.name = thirdArray[index];
          }
          board.keyboardState = 3;
          shiftKey.html = "123";
          if (exports.device === "ipad") {
            return shiftKey2.html = "123";
          }
          break;
        case 3:
          for (index = r = 0, len5 = keysArray.length; r < len5; index = ++r) {
            key = keysArray[index];
            if (index < 27) {
              key.name = secondArray[index];
              key.html = secondArray[index];
              if (index === 26) {
                key.subLayers[0].visible = false;
              }
            } else {
              key.visible = false;
            }
          }
          shiftKey.html = "#+=";
          if (exports.device === "ipad") {
            shiftKey2.html = "#+=";
          }
          return board.keyboardState = 2;
      }
    });
    numKey2 = new Layer({
      superLayer: board,
      name: "num",
      borderRadius: boardSpecs.sideKeyRadius,
      color: exports.color("black"),
      backgroundColor: exports.color("light-key"),
      shadowY: exports.px(1),
      shadowColor: "#929498",
      width: boardSpecs.sideKey2,
      height: boardSpecs.key.height
    });
    numKey2.html = ".?123";
    numKey2.style = {
      "font-size": exports.px(16) + "px",
      "font-weight": 400,
      "font-family": '-apple-system, Helvetica, Arial, sans-serif',
      'text-align': 'center',
      'line-height': boardSpecs.key.height + "px"
    };
    numKey2.constraints = {
      trailing: [keyboardKey, 12],
      bottomEdges: keyboardKey
    };
    numKey2.on(Events.TouchStart, function() {
      var len2, len3, m, n;
      switch (board.keyboardState) {
        case 1:
          for (index = m = 0, len2 = keysArray.length; m < len2; index = ++m) {
            key = keysArray[index];
            if (index < 27) {
              if (secondArray[index] === "undo") {
                key.width = key.width * 2 + boardSpecs.spacer;
                key.style["font-size"] = exports.px(17) + "px";
                key.style["font-weight"] = 400;
              }
              if (secondArray[index] === "hide") {
                key.visible = false;
              }
              key.name = secondArray[index];
              key.html = secondArray[index];
              if (index === 26) {
                key.subLayers[0].visible = false;
              }
            } else {
              key.visible = false;
            }
          }
          numKey.html = "ABC";
          shiftKey.html = "#+=";
          shiftIcon.visible = false;
          if (exports.device === "ipad") {
            shiftIcon2.visible = false;
            shiftKey2.html = "#+=";
            numKey2.html = "ABC";
          }
          return board.keyboardState = 2;
        default:
          for (index = n = 0, len3 = keysArray.length; n < len3; index = ++n) {
            key = keysArray[index];
            if (key.html === "undo" || "redo") {
              key.width = boardSpecs.key.width;
              key.style["font-size"] = exports.px(25) + "px";
              key.style["font-weight"] = 300;
            }
            key.visible = true;
            key.name = lettersArray[index];
            key.html = lettersArray[index];
            if (index > 25) {
              key.subLayers[0].visible = true;
            }
          }
          shiftKey.html = "";
          shiftIcon.visible = true;
          if (exports.device === "ipad") {
            numKey.html = ".?123";
            numKey2.html = ".?123";
            shiftKey2.html = "";
            shiftIcon2.visible = true;
          }
          return board.keyboardState = 1;
      }
    });
  }
  numKey = new Layer({
    superLayer: board,
    name: "num",
    borderRadius: exports.px(5),
    backgroundColor: exports.color("light-key"),
    shadowY: exports.px(1),
    shadowColor: "#929498",
    color: "black",
    width: boardSpecs.sideKey,
    height: boardSpecs.key.height
  });
  numKey.constraints = {
    bottom: boardSpecs.bottomRow,
    leadingEdges: shiftKey
  };
  if (exports.device !== "ipad" && exports.device !== "ipad-pro") {
    numKey.html = "123";
  } else {
    numKey.html = ".?123";
  }
  numKey.style = {
    "font-size": exports.px(16) + "px",
    "font-weight": 400,
    "font-family": '-apple-system, Helvetica, Arial, sans-serif',
    'text-align': 'center',
    'line-height': boardSpecs.key.height + "px"
  };
  numKey.on(Events.TouchStart, function() {
    var len2, len3, len4, len5, m, n, q, r;
    switch (board.keyboardState) {
      case 1:
        switch (exports.device) {
          case "ipad":
            for (index = m = 0, len2 = keysArray.length; m < len2; index = ++m) {
              key = keysArray[index];
              if (index < 27) {
                if (secondArray[index] === "undo") {
                  key.width = key.width * 2 + boardSpecs.spacer;
                  key.style["font-size"] = exports.px(17) + "px";
                  key.style["font-weight"] = 400;
                }
                if (secondArray[index] === "hide") {
                  key.visible = false;
                }
                key.name = secondArray[index];
                key.html = secondArray[index];
                if (index === 26) {
                  key.subLayers[0].visible = false;
                }
              } else {
                key.visible = false;
              }
            }
            shiftIcon2.visible = false;
            shiftKey2.html = "#+=";
            numKey2.html = "ABC";
            board.keyboardState = 2;
            break;
          default:
            rowIndex = 0;
            secondRowKeyWidth = 0;
            for (index = n = 0, len3 = keysArray.length; n < len3; index = ++n) {
              key = keysArray[index];
              key.name = secondArray[index];
              key.html = secondArray[index];
              if (index === 19) {
                key.y = rowsMap[1].marginTop + key.height;
              }
              if (index > 9 && index < 20) {
                key.x = rowsMap[0].padding + (rowIndex * boardSpecs.spacer) + secondRowKeyWidth;
                rowIndex++;
                secondRowKeyWidth = secondRowKeyWidth + boardSpecs.key.width;
              }
              if (index === 20) {
                key.constraints = {
                  leading: [shiftKey, exports.pt(boardSpecs.expandedSpacer)]
                };
                exports.layout();
              }
              if (index > 19) {
                key.width = boardSpecs.expandedKey;
              }
              if (index > 20) {
                key.constraints = {
                  leading: [keysArray[index - 1], exports.pt(boardSpecs.spacer)]
                };
                exports.layout();
              }
              if (index > 24) {
                key.visible = false;
              }
            }
            board.keyboardState = 2;
        }
        numKey.html = "ABC";
        shiftKey.html = "#+=";
        return shiftIcon.visible = false;
      default:
        if (exports.device !== "ipad") {
          secondRowKeyWidth = 0;
          rowIndex = 0;
          for (index = q = 0, len4 = keysArray.length; q < len4; index = ++q) {
            key = keysArray[index];
            key.width = boardSpecs.key.width;
            if (index > 9 && index < 19) {
              key.x = rowsMap[1].padding + (rowIndex * boardSpecs.spacer) + secondRowKeyWidth;
              key.y = rowsMap[1].marginTop + key.height;
              rowIndex++;
              secondRowKeyWidth = secondRowKeyWidth + key.width;
            }
            if (index === 19) {
              key.y = rowsMap[2].marginTop + key.height * 2;
            }
            if (index >= 19) {
              rowIndex = index - rowsMap[2].startIndex;
              key.x = rowsMap[2].padding + (rowIndex * boardSpecs.spacer) + (rowIndex * key.width);
              key.y = rowsMap[2].marginTop + key.height * 2;
              key.constraints = {};
            }
          }
        }
        for (index = r = 0, len5 = keysArray.length; r < len5; index = ++r) {
          key = keysArray[index];
          if (key.html === "undo" || "redo") {
            key.width = boardSpecs.key.width;
            key.style["font-size"] = exports.px(25) + "px";
            key.style["font-weight"] = 300;
          }
          key.visible = true;
          key.name = lettersArray[index];
          key.html = lettersArray[index];
          if (index > 25) {
            key.subLayers[0].visible = true;
          }
        }
        shiftKey.html = "";
        shiftIcon.visible = true;
        if (exports.device === "ipad") {
          numKey.html = ".?123";
          numKey2.html = ".?123";
          shiftKey2.html = "";
          shiftIcon2.visible = true;
        }
        return board.keyboardState = 1;
    }
  });
  exports.layout();
  emojiKey = new Layer({
    superLayer: board,
    name: "emoji",
    borderRadius: exports.px(5),
    backgroundColor: exports.color("light-key"),
    shadowY: exports.px(1),
    shadowColor: "#929498",
    width: boardSpecs.sideKey,
    height: boardSpecs.key.height
  });
  emojiKey.constraints = {
    bottomEdges: numKey,
    leading: [numKey, 6]
  };
  emojiIcon = new Layer({
    width: exports.px(20),
    height: exports.px(19),
    superLayer: emojiKey,
    backgroundColor: "transparent",
    x: boardSpecs.emojiIcon.x,
    y: boardSpecs.emojiIcon.y
  });
  emojiIcon.html = iconLibrary.emoji;
  returnKey = new Layer({
    superLayer: board,
    borderRadius: exports.px(5),
    backgroundColor: exports.color(setup.returnColor),
    shadowY: exports.px(1),
    shadowColor: "#929498",
    color: "black",
    name: "return",
    width: boardSpecs.returnKey,
    height: boardSpecs.key.height
  });
  if (setup.returnColor !== "light-key") {
    returnKey.color = exports.setTextColor(exports.color(setup.returnColor));
  }
  if (exports.device === "ipad") {
    returnKey.constraints = {
      trailingEdges: deleteKey,
      top: exports.pt(boardSpecs.marginTop.row2 + boardSpecs.key.height)
    };
  } else {
    returnKey.constraints = {
      trailing: exports.pt(boardSpecs.spacer) / 2,
      bottomEdges: numKey
    };
  }
  returnKey.html = setup.returnText;
  returnKey.style = {
    "font-size": exports.px(16) + "px",
    "font-weight": 400,
    "font-family": '-apple-system, Helvetica, Arial, sans-serif',
    'text-align': 'center',
    'line-height': boardSpecs.key.height + "px"
  };
  exports.layout();
  storedTextColor = returnKey.color;
  returnKey.on(Events.TouchStart, function() {
    returnKey.backgroundColor = "white";
    return returnKey.color = exports.color("black");
  });
  returnKey.on(Events.TouchEnd, function() {
    returnKey.backgroundColor = exports.color(setup.returnColor);
    return returnKey.color = storedTextColor;
  });
  board.keys["return"] = returnKey;
  spaceKey = new Layer({
    superLayer: board,
    borderRadius: exports.px(5),
    backgroundColor: "white",
    shadowY: exports.px(1),
    shadowColor: "#929498",
    color: "black",
    name: "space",
    height: boardSpecs.key.height
  });
  if (exports.device !== "ipad") {
    spaceKey.constraints = {
      bottomEdges: numKey,
      leading: [emojiKey, exports.pt(boardSpecs.spacer)],
      trailing: [returnKey, boardSpecs.spacer]
    };
    spaceKey.html = "space";
    spaceKey.style = {
      "font-size": exports.px(16) + "px",
      "font-weight": 400,
      "font-family": '-apple-system, Helvetica, Arial, sans-serif',
      'text-align': 'center',
      'line-height': boardSpecs.key.height + "px"
    };
  } else {
    spaceKey.constraints = {
      bottomEdges: numKey,
      leading: [emojiKey, exports.pt(boardSpecs.spacer)],
      trailing: [numKey2, boardSpecs.spacer]
    };
  }
  board.keys["&nbsp;"] = spaceKey;
  board.keys.space = spaceKey;
  exports.layout();
  spaceKey.on(Events.TouchStart, function() {
    return spaceKey.backgroundColor = exports.color("light-key");
  });
  spaceKey.on(Events.TouchEnd, function() {
    spaceKey.backgroundColor = "white";
    if (setup.output) {
      this.newText = setup.output.text.html + "&nbsp;";
      return exports.update(setup.output.text, [
        {
          text: this.newText
        }
      ]);
    }
  });
  emojiFormatter = function(string) {
    var arrayOfCodes, code, len2, len3, m, n, unicodeFormat;
    unicodeFormat = "";
    if (string[0] === "E" || string[0] === "3" || string[0] === "2" || string[0] === "C") {
      arrayOfCodes = string.split(" ");
      for (m = 0, len2 = arrayOfCodes.length; m < len2; m++) {
        code = arrayOfCodes[m];
        unicodeFormat = unicodeFormat + "%" + code;
      }
    } else {
      arrayOfCodes = string.split(" ");
      unicodeFormat = "%F0%9F";
      for (n = 0, len3 = arrayOfCodes.length; n < len3; n++) {
        code = arrayOfCodes[n];
        unicodeFormat = unicodeFormat + "%" + code;
      }
    }
    return unicodeFormat;
  };
  exports.layout();
  emojiSections = ["Frequnetly Used", "Smileys & People", "Animals & Nature", "Food & Drink", "Activity", "Travel & Places", "Objects", "Symbols", "Flags"];
  rawEmojis = ["98 80", "98 AC", "98 81", "98 82", "98 83", "98 84", "98 85", "98 86", "98 87", "98 89", "98 8a", "99 82", "99 83", "E2 98 BA EF B8 8F", "98 8B", "98 8C", "98 8D", "98 98", "98 97", "98 99", "98 9A", "98 9C", "98 9D", "98 9B", "A4 91", "A4 93", "98 8E", "A4 97", "98 8F", "98 B6", "98 90", "98 91", "98 92", "99 84", "A4 94", "98 B3", "98 9E", "98 9F", "98 A0", "98 A1", "98 94", "98 95", "99 81", "E2 98 B9 EF B8 8F", "98 A3", "98 96", "98 AB", "98 A9", "98 A4", "98 AE", "98 B1", "98 A8", "98 B0", "98 AF", "98 A6", "98 A7", "98 A2", "98 A5", "98 AA", "98 93", "98 AD", "98 B5", "98 B2", "A4 90", "98 B7", "A4 92", "A4 95", "98 B4", "92 A4", "92 A9", "98 88", "91 BF", "91 B9", "91 BA", "92 80", "91 BB", "91 BD", "A4 96", "98 BA", "98 B8", "98 B9", "98 BB", "98 BC", "98 BD", "99 80", "98 BF", "98 BE", "99 8C", "91 8F", "91 8B", "91 8D", "91 8E", "91 8A", "E2 9C 8A", "E2 9C 8C EF B8 8F", "91 8C", "E2 9C 8B", "91 90", "92 AA", "99 8F", "E2 98 9D EF B8 8F", "91 86", "91 87", "91 88", "91 89", "96 95", "96 90", "A4 98", "96 96", "E2 9C 8D EF B8 8F", "92 85", "91 84", "91 85", "91 82", "91 83", "91 81", "91 80", "91 A4", "91 A5", "97 A3", "91 B6", "91 A6", "91 A7", "91 A8", "91 A9", "91 B1", "91 B4", "91 B5", "91 B2", "91 B3", "91 AE", "91 B7", "92 82", "95 B5", "8E 85", "91 BC", "91 B8", "91 B0", "9A B6", "8F 83", "92 83", "91 AF", "91 AB", "91 AC", "91 AD", "99 87", "92 81", "99 85", "99 86", "99 8B", "99 8E", "99 8D", "92 87", "92 86", "92 91", "91 A9 E2 80 8D E2 9D A4 EF B8 8F E2 80 8D F0 9F 91 A9", "91 A8 E2 80 8D E2 9D A4 EF B8 8F E2 80 8D F0 9F 91 A8", "92 8F", "91 A9 E2 80 8D E2 9D A4 EF B8 8F E2 80 8D F0 9F 92 8B E2 80 8D F0 9F 91 A9", "91 A8 E2 80 8D E2 9D A4 EF B8 8F E2 80 8D F0 9F 92 8B E2 80 8D F0 9F 91 A8", "91 AA", "91 A8 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7", "91 A8 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A6", "91 A8 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A6 E2 80 8D F0 9F 91 A6", "91 A8 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A7", "91 A9 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A6", "91 A9 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7", "91 A9 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A6", "91 A9 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A6 E2 80 8D F0 9F 91 A6", "91 A9 E2 80 8D F0 9F 91 A9 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A7", "91 A8 E2 80 8D F0 9F 91 A8 E2 80 8D F0 9F 91 A6", "91 A8 E2 80 8D F0 9F 91 A8 E2 80 8D F0 9F 91 A7", "91 A8 E2 80 8D F0 9F 91 A8 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A6", "91 A8 E2 80 8D F0 9F 91 A8 E2 80 8D F0 9F 91 A6 E2 80 8D F0 9F 91 A6", "91 A8 E2 80 8D F0 9F 91 A8 E2 80 8D F0 9F 91 A7 E2 80 8D F0 9F 91 A7", "91 9A", "91 95", "91 96", "91 94", "91 97", "91 99", "91 98", "92 84", "92 8B", "91 A3", "91 A0", "91 A1", "91 A2", "91 9E", "91 9F", "91 92", "8E A9", "E2 9B 91", "8E 93", "91 91", "8E 92", "91 9D", "91 9B", "91 9C", "92 BC", "91 93", "95 B6", "92 8D", "8C 82", "9B 91", "90 B6", "90 B1", "90 AD", "90 B9", "90 B0", "90 BB", "90 BC", "90 A8", "90 AF", "A6 81", "90 AE", "90 B7", "90 BD", "90 B8", "90 99", "90 B5", "99 88", "99 89", "99 8A", "90 92", "90 94", "90 A7", "90 A6", "90 A4", "90 A3", "90 A5", "90 BA", "90 97", "90 B4", "A6 84", "90 9D", "90 9B", "90 8C", "90 9E", "90 9C", "95 B7", "A6 82", "A6 80", "90 8D", "90 A2", "90 A0", "90 9F", "90 A1", "90 AC", "90 B3", "90 8B", "90 8A", "90 86", "90 85", "90 83", "90 82", "90 84", "90 AA", "90 AB", "90 98", "90 90", "90 8F", "90 91", "90 8E", "90 96", "90 80", "90 81", "90 93", "A6 83", "95 8A", "90 95", "90 A9", "90 88", "90 87", "90 BF", "90 BE", "90 89", "90 B2", "8C B5", "8E 84", "8C B2", "8C B3", "8C B4", "8C B1", "8C BF", "E2 98 98", "8D 80", "8E 8D", "8E 8B", "8D 83", "8D 82", "8D 81", "8C BE", "8C BA", "8C BA", "8C BB", "8C B9", "8C B7", "8C BC", "8C B8", "92 90", "8D 84", "8C B0", "8E 83", "90 9A", "95 B8", "8C 8E", "8C 8D", "8C 8F", "8C 95", "8C 96", "8C 97", "8C 98", "8C 91", "8C 92", "8C 93", "8C 94", "8C 9A", "8C 9D", "8C 9B", "8C 9C", "8C 9E", "8C 99", "E2 AD 90 EF B8 8F", "8C 9F", "92 AB", "E2 9C A8", "E2 98 84 EF B8 8F", "E2 98 80 EF B8 8F", "8C A4", "E2 9B 85 EF B8 8F", "8C A5", "8C A6", "E2 98 81 EF B8 8F", "8C A7", "E2 9B 88", "8C A9", "E2 9A A1 EF B8 8F", "94 A5", "92 A5", "E2 9D 84 EF B8 8F", "8C A8", "E2 98 83 EF B8 8F", "E2 9B 84 EF B8 8F", "8C AC", "92 A8", "8C AA", "8C AB", "E2 98 82 EF B8 8F", "E2 98 94 EF B8 8F", "92 A7", "92 A6", "8C 8A", "9B 91", "9B 91", "8D 8F", "8D 8E", "8D 90", "8D 8A", "8D 8B", "8D 8C", "8D 89", "8D 87", "8D 93", "8D 88", "8D 92", "8D 91", "8D 8D", "8D 85", "8D 86", "8C B6", "8C BD", "8D A0", "8D AF", "8D 9E", "A7 80", "8D 97", "8D 96", "8D A4", "8D B3", "8D 94", "8D 9F", "8C AD", "8D 95", "8D 9D", "8C AE", "8C AF", "8D 9C", "8D B2", "8D A5", "8D A3", "8D B1", "8D 9B", "8D 99", "8D 9A", "8D 98", "8D A2", "8D A1", "8D A7", "8D A8", "8D A6", "8D B0", "8E 82", "8D AE", "8D AC", "8D AD", "8D AB", "8D BF", "8D A9", "8D AA", "8D BA", "8D BB", "8D B7", "8D B8", "8D B9", "8D BE", "8D B6", "8D B5", "E2 98 95 EF B8 8F", "8D BC", "8D B4", "8D BD", "9B 91", "9B 91", "9B 91", "E2 9A BD EF B8 8F", "8F 80", "8F 88", "E2 9A BE EF B8 8F", "8E BE", "8F 90", "8F 89", "8E B1", "E2 9B B3 EF B8 8F", "8F 8C", "8F 93", "8F B8", "8F 92", "8F 91", "8F 8F", "8E BF", "E2 9B B7", "8F 82", "E2 9B B8", "8F B9", "8E A3", "9A A3", "8F 8A", "8F 84", "9B 80", "E2 9B B9", "8F 8B", "9A B4", "9A B5", "8F 87", "95 B4", "8F 86", "8E BD", "8F 85", "8E 96", "8E 97", "8F B5", "8E AB", "8E 9F", "8E AD", "8E A8", "8E AA", "8E A4", "8E A7", "8E BC", "8E B9", "8E B7", "8E BA", "8E B8", "8E BB", "8E AC", "8E AE", "91 BE", "8E AF", "8E B2", "8E B0", "8E B3", "9B 91", "9B 91", "9B 91", "9A 97", "9A 95", "9A 99", "9A 8C", "9A 8E", "8F 8E", "9A 93", "9A 91", "9A 92", "9A 90", "9A 9A", "9A 9B", "9A 9C", "8F 8D", "9A B2", "9A A8", "9A 94", "9A 8D", "9A 98", "9A 96", "9A A1", "9A A0", "9A AF", "9A 83", "9A 8B", "9A 9D", "9A 84", "9A 85", "9A 88", "9A 9E", "9A 82", "9A 86", "9A 87", "9A 8A", "9A 89", "9A 81", "9B A9", "E2 9C 88 EF B8 8F", "9B AB", "9B AC", "E2 9B B5 EF B8 8F", "9B A5", "9A A4", "E2 9B B4", "9B B3", "9A 80", "9B B0", "92 BA", "E2 9A 93 EF B8 8F", "9A A7", "E2 9B BD EF B8 8F", "9A 8F", "9A A6", "9A A5", "8F 81", "9A A2", "8E A1", "8E A2", "8E A0", "8F 97", "8C 81", "97 BC", "8F AD", "E2 9B B2 EF B8 8F", "8E 91", "E2 9B B0", "8F 94", "97 BB", "8C 8B", "97 BE", "8F 95", "E2 9B BA EF B8 8F", "8F 9E", "9B A3", "9B A4", "8C 85", "8C 84", "8F 9C", "8F 96", "8F 9D", "8C 87", "8C 86", "8F 99", "8C 83", "8C 89", "8C 8C", "8C A0", "8E 87", "8E 86", "8C 88", "8F 98", "8F B0", "8F AF", "8F 9F", "97 BD", "8F A0", "8F A1", "8F 9A", "8F A2", "8F AC", "8F A3", "8F A4", "8F A5", "8F A6", "8F A8", "8F AA", "8F AB", "8F A9", "92 92", "8F 9B", "E2 9B AA EF B8 8F", "95 8C", "95 8D", "95 8B", "E2 9B A9", "E2 8C 9A EF B8 8F", "93 B1", "93 B2", "92 BB", "E2 8C A8 EF B8 8F", "96 A5", "96 A8", "96 B1", "96 B2", "95 B9", "97 9C", "92 BD", "92 BE", "92 BF", "93 80", "93 BC", "93 B7", "93 B8", "93 B9", "8E A5", "93 BD", "8E 9E", "93 9E", "E2 98 8E EF B8 8F", "93 9F", "93 A0", "93 BA", "93 BB", "8E 99", "8E 9A", "8E 9B", "E2 8F B1", "E2 8F B2", "E2 8F B0", "95 B0", "E2 8F B3", "E2 8C 9B EF B8 8F", "93 A1", "94 8B", "94 8C", "92 A1", "94 A6", "95 AF", "97 91", "9B A2", "92 B8", "92 B5", "92 B4", "92 B6", "92 B7", "92 B0", "92 B3", "92 8E", "E2 9A 96", "94 A7", "94 A8", "E2 9A 92", "9B A0", "E2 9B 8F", "94 A9", "E2 9A 99", "E2 9B 93", "94 AB", "92 A3", "94 AA", "97 A1", "E2 9A 94", "9B A1", "9A AC", "E2 98 A0 EF B8 8F", "E2 9A B0", "E2 9A B1", "8F BA", "94 AE", "93 BF", "92 88", "E2 9A 97", "94 AD", "94 AC", "95 B3", "92 8A", "92 89", "8C A1", "8F B7", "94 96", "9A BD", "9A BF", "9B 81", "94 91", "97 9D", "9B 8B", "9B 8C", "9B 8F", "9A AA", "9B 8E", "96 BC", "97 BA", "E2 9B B1", "97 BF", "9B 8D", "8E 88", "8E 8F", "8E 80", "8E 81", "8E 8A", "8E 89", "8E 8E", "8E 90", "8E 8C", "8F AE", "E2 9C 89 EF B8 8F", "93 A9", "93 A8", "93 A7", "92 8C", "93 AE", "93 AA", "93 AB", "93 AC", "93 AD", "93 A6", "93 AF", "93 A5", "93 A4", "93 9C", "93 83", "93 91", "93 8A", "93 88", "93 89", "93 84", "93 85", "93 86", "97 93", "93 87", "97 83", "97 B3", "97 84", "93 8B", "97 92", "93 81", "93 82", "97 82", "97 9E", "93 B0", "93 93", "93 95", "93 97", "93 98", "93 99", "93 94", "93 92", "93 9A", "93 96", "94 97", "93 8E", "96 87", "E2 9C 82 EF B8 8F", "93 90", "93 8F", "93 8C", "93 8D", "9A A9", "8F B3", "8F B4", "94 90", "94 92", "94 93", "94 8F", "96 8A", "96 8B", "E2 9C 92 EF B8 8F", "93 9D", "E2 9C 8F EF B8 8F", "96 8D", "96 8C", "94 8D", "94 8E", "9B 91", "9B 91", "E2 9D A4 EF B8 8F", "92 9B", "92 9A", "92 99", "92 9C", "92 94", "E2 9D A3 EF B8 8F", "92 95", "92 9E", "92 93", "92 97", "92 96", "92 98", "92 9D", "92 9F", "E2 98 AE EF B8 8F", "E2 9C 9D EF B8 8F", "E2 98 AA EF B8 8F", "95 89", "E2 98 B8 EF B8 8F", "E2 9C A1 EF B8 8F", "94 AF", "95 8E", "E2 98 AF EF B8 8F", "E2 98 A6 EF B8 8F", "9B 90", "E2 9B 8E", "E2 99 88 EF B8 8F", "E2 99 89 EF B8 8F", "E2 99 8A EF B8 8F", "E2 99 8B EF B8 8F", "E2 99 8C EF B8 8F", "E2 99 8D EF B8 8F", "E2 99 8E EF B8 8F", "E2 99 8F EF B8 8F", "E2 99 90 EF B8 8F", "E2 99 91 EF B8 8F", "E2 99 92 EF B8 8F", "E2 99 93 EF B8 8F", "86 94", "E2 9A 9B", "88 B3", "88 B9", "E2 98 A2 EF B8 8F", "E2 98 A3 EF B8 8F", "93 B4", "93 B3", "88 B6", "88 9A EF B8 8F", "88 B8", "88 BA", "88 B7 EF B8 8F", "E2 9C B4 EF B8 8F", "86 9A", "89 91", "92 AE", "89 90", "E3 8A 99 EF B8 8F", "E3 8A 97 EF B8 8F", "88 B4", "88 B5", "88 B2", "85 B0 EF B8 8F", "85 B1 EF B8 8F", "86 8E", "86 91", "85 BE EF B8 8F", "86 98", "E2 9B 94 EF B8 8F", "93 9B", "9A AB", "E2 9D 8C", "E2 AD 95 EF B8 8F", "92 A2", "E2 99 A8 EF B8 8F", "9A B7", "9A AF", "9A B3", "9A B1", "94 9E", "93 B5", "E2 9D 97 EF B8 8F", "E2 9D 95", "E2 9D 93", "E2 9D 94", "E2 80 BC EF B8 8F", "E2 81 89 EF B8 8F", "92 AF", "94 85", "94 86", "94 B1", "E2 9A 9C", "E3 80 BD EF B8 8F", "E2 9A A0 EF B8 8F", "9A B8", "94 B0", "E2 99 BB EF B8 8F", "88 AF EF B8 8F", "92 B9", "E2 9D 87 EF B8 8F", "E2 9C B3 EF B8 8F", "E2 9D 8E", "E2 9C 85", "92 A0", "8C 80", "E2 9E BF", "8C 90", "E2 93 82 EF B8 8F", "8F A7", "88 82 EF B8 8F", "9B 82", "9B 83", "9B 84", "9B 85", "E2 99 BF EF B8 8F", "9A AD", "9A BE", "85 BF EF B8 8F", "9A B0", "9A B9", "9A BA", "9A BC", "9A BB", "9A AE", "8E A6", "93 B6", "88 81", "86 96", "86 97", "86 99", "86 92", "86 95", "86 93", "30 EF B8 8F E2 83 A3", "31 EF B8 8F E2 83 A3", "32 EF B8 8F E2 83 A3", "33 EF B8 8F E2 83 A3", "34 EF B8 8F E2 83 A3", "35 EF B8 8F E2 83 A3", "36 EF B8 8F E2 83 A3", "37 EF B8 8F E2 83 A3", "38 EF B8 8F E2 83 A3", "39 EF B8 8F E2 83 A3", "94 9F", "94 A2", "E2 96 B6 EF B8 8F", "E2 8F B8", "E2 8F AF", "E2 8F B9", "E2 8F BA", "E2 8F AD", "E2 8F AE", "E2 8F A9", "E2 8F AA", "94 80", "94 81", "94 82", "E2 97 80 EF B8 8F", "94 BC", "94 BD", "E2 8F AB", "E2 8F AC", "E2 9E A1 EF B8 8F", "E2 AC 85 EF B8 8F", "E2 AC 86 EF B8 8F", "E2 AC 87 EF B8 8F", "E2 86 97 EF B8 8F", "E2 86 98 EF B8 8F", "E2 86 99 EF B8 8F", "E2 86 96 EF B8 8F", "E2 86 95 EF B8 8F", "E2 86 94 EF B8 8F", "94 84", "E2 86 AA EF B8 8F", "E2 86 A9 EF B8 8F", "E2 A4 B4 EF B8 8F", "E2 A4 B5 EF B8 8F", "23 EF B8 8F E2 83 A3", "2A EF B8 8F E2 83 A3", "E2 84 B9 EF B8 8F", "94 A4", "94 A1", "94 A0", "94 A3", "8E B5", "8E B6", "E3 80 B0 EF B8 8F", "E2 9E B0", "E2 9C 94 EF B8 8F", "94 83", "E2 9E 95", "E2 9E 96", "E2 9E 97", "E2 9C 96 EF B8 8F", "92 B2", "92 B1", "C2 A9 EF B8 8F", "C2 AE EF B8 8F", "E2 84 A2 EF B8 8F", "94 9A", "94 99", "94 9B", "94 9D", "94 9C", "E2 98 91 EF B8 8F", "94 98", "E2 9A AA EF B8 8F", "E2 9A AB EF B8 8F", "94 B4", "94 B5", "94 B8", "94 B9", "94 B6", "94 B7", "94 BA", "E2 96 AA EF B8 8F", "E2 96 AB EF B8 8F", "E2 AC 9B EF B8 8F", "E2 AC 9C EF B8 8F", "94 BB", "E2 97 BC EF B8 8F", "E2 97 BB EF B8 8F", "E2 97 BE EF B8 8F", "E2 97 BD EF B8 8F", "94 B2", "94 B3", "94 88", "94 89", "94 8A", "94 87", "93 A3", "93 A2", "94 94", "94 95", "83 8F", "80 84 EF B8 8F", "E2 99 A0 EF B8 8F", "E2 99 A3 EF B8 8F", "E2 99 A5 EF B8 8F", "E2 99 A6 EF B8 8F", "8E B4", "91 81 E2 80 8D F0 9F 97 A8", "92 AD", "97 AF", "92 AC", "95 90", "95 91", "95 92", "95 93", "95 94", "95 95", "95 96", "95 97", "95 98", "95 99", "95 9A", "95 9B", "95 9C", "95 9D", "95 9E", "95 9F", "95 A0", "95 A1", "95 A2", "95 A3", "95 A4", "95 A5", "95 A6", "95 A7", "9B 91", "87 A6 F0 9F 87 AB", "87 A6 F0 9F 87 BD", "87 A6 F0 9F 87 B1", "87 A9 F0 9F 87 BF", "87 A6 F0 9F 87 B8", "87 A6 F0 9F 87 A9", "87 A6 F0 9F 87 B4", "87 A6 F0 9F 87 AE", "87 A6 F0 9F 87 B6", "87 A6 F0 9F 87 AC", "87 A6 F0 9F 87 B7", "87 A6 F0 9F 87 B2", "87 A6 F0 9F 87 BC", "87 A6 F0 9F 87 BA", "87 A6 F0 9F 87 B9", "87 A6 F0 9F 87 BF", "87 A7 F0 9F 87 B8", "87 A7 F0 9F 87 AD", "87 A7 F0 9F 87 A9", "87 A7 F0 9F 87 A7", "87 A7 F0 9F 87 BE", "87 A7 F0 9F 87 AA", "87 A7 F0 9F 87 BF", "87 A7 F0 9F 87 AF", "87 A7 F0 9F 87 B2", "87 A7 F0 9F 87 B9", "87 A7 F0 9F 87 B4", "87 A7 F0 9F 87 B6", "87 A7 F0 9F 87 A6", "87 A7 F0 9F 87 BC", "87 A7 F0 9F 87 B7", "87 AE F0 9F 87 B4", "87 BB F0 9F 87 AC", "87 A7 F0 9F 87 B3", "87 A7 F0 9F 87 AC", "87 A7 F0 9F 87 AB", "87 A7 F0 9F 87 AE", "87 A8 F0 9F 87 BB", "87 B0 F0 9F 87 AD", "87 A8 F0 9F 87 B2", "87 A8 F0 9F 87 A6", "87 AE F0 9F 87 A8", "87 B0 F0 9F 87 BE", "87 A8 F0 9F 87 AB", "87 B9 F0 9F 87 A9", "87 A8 F0 9F 87 B1", "87 A8 F0 9F 87 B3", "87 A8 F0 9F 87 BD", "87 A8 F0 9F 87 A8", "87 A8 F0 9F 87 B4", "87 B0 F0 9F 87 B2", "87 A8 F0 9F 87 AC", "87 A8 F0 9F 87 A9", "87 A8 F0 9F 87 B0", "87 A8 F0 9F 87 B7", "87 AD F0 9F 87 B7", "87 A8 F0 9F 87 BA", "87 A8 F0 9F 87 BC", "87 A8 F0 9F 87 BE", "87 A8 F0 9F 87 BF", "87 A9 F0 9F 87 B0", "87 A9 F0 9F 87 AF", "87 A9 F0 9F 87 B2", "87 A9 F0 9F 87 B4", "87 AA F0 9F 87 A8", "87 AA F0 9F 87 AC", "87 B8 F0 9F 87 BB", "87 AC F0 9F 87 B6", "87 AA F0 9F 87 B7", "87 AA F0 9F 87 AA", "87 AA F0 9F 87 B9", "87 AA F0 9F 87 BA", "87 AB F0 9F 87 B0", "87 AB F0 9F 87 B4", "87 AB F0 9F 87 AF", "87 AB F0 9F 87 AE", "87 AB F0 9F 87 B7", "87 AC F0 9F 87 AB", "87 B5 F0 9F 87 AB", "87 B9 F0 9F 87 AB", "87 AC F0 9F 87 A6", "87 AC F0 9F 87 B2", "87 AC F0 9F 87 AA", "87 A9 F0 9F 87 AA", "87 AC F0 9F 87 AD", "87 AC F0 9F 87 AE", "87 AC F0 9F 87 B7", "87 AC F0 9F 87 B1", "87 AC F0 9F 87 A9", "87 AC F0 9F 87 B5", "87 AC F0 9F 87 BA", "87 AC F0 9F 87 B9", "87 AC F0 9F 87 AC", "87 AC F0 9F 87 B3", "87 AC F0 9F 87 BC", "87 AC F0 9F 87 BE", "87 AD F0 9F 87 B9", "87 AD F0 9F 87 B3", "87 AD F0 9F 87 B0", "87 AD F0 9F 87 BA", "87 AE F0 9F 87 B8", "87 AE F0 9F 87 B3", "87 AE F0 9F 87 A9", "87 AE F0 9F 87 B7", "87 AE F0 9F 87 B6", "87 AE F0 9F 87 AA", "87 AE F0 9F 87 B2", "87 AE F0 9F 87 B1", "87 AE F0 9F 87 B9", "87 A8 F0 9F 87 AE", "87 AF F0 9F 87 B2", "87 AF F0 9F 87 B5", "87 AF F0 9F 87 AA", "87 AF F0 9F 87 B4", "87 B0 F0 9F 87 BF", "87 B0 F0 9F 87 AA", "87 B0 F0 9F 87 AE", "87 BD F0 9F 87 B0", "87 B0 F0 9F 87 BC", "87 B0 F0 9F 87 AC", "87 B1 F0 9F 87 A6", "87 B1 F0 9F 87 BB", "87 B1 F0 9F 87 A7", "87 B1 F0 9F 87 B8", "87 B1 F0 9F 87 B7", "87 B1 F0 9F 87 BE", "87 B1 F0 9F 87 AE", "87 B1 F0 9F 87 B9", "87 B1 F0 9F 87 BA", "87 B2 F0 9F 87 B4", "87 B2 F0 9F 87 B0", "87 B2 F0 9F 87 AC", "87 B2 F0 9F 87 BC", "87 B2 F0 9F 87 BE", "87 B2 F0 9F 87 BB", "87 B2 F0 9F 87 B1", "87 B2 F0 9F 87 B9", "87 B2 F0 9F 87 AD", "87 B2 F0 9F 87 B6", "87 B2 F0 9F 87 B7", "87 B2 F0 9F 87 BA", "87 BE F0 9F 87 B9", "87 B2 F0 9F 87 BD", "87 AB F0 9F 87 B2", "87 B2 F0 9F 87 A9", "87 B2 F0 9F 87 A8", "87 B2 F0 9F 87 B3", "87 B2 F0 9F 87 AA", "87 B2 F0 9F 87 B8", "87 B2 F0 9F 87 A6", "87 B2 F0 9F 87 BF", "87 B2 F0 9F 87 B2", "87 B3 F0 9F 87 A6", "87 B3 F0 9F 87 B7", "87 B3 F0 9F 87 B5", "87 B3 F0 9F 87 B1", "87 B3 F0 9F 87 A8", "87 B3 F0 9F 87 BF", "87 B3 F0 9F 87 AE", "87 B3 F0 9F 87 AA", "87 B3 F0 9F 87 AC", "87 B3 F0 9F 87 BA", "87 B3 F0 9F 87 AB", "87 B2 F0 9F 87 B5", "87 B0 F0 9F 87 B5", "87 B3 F0 9F 87 B4", "87 B4 F0 9F 87 B2", "87 B5 F0 9F 87 B0", "87 B5 F0 9F 87 BC", "87 B5 F0 9F 87 B8", "87 B5 F0 9F 87 A6", "87 B5 F0 9F 87 AC", "87 B5 F0 9F 87 BE", "87 B5 F0 9F 87 AA", "87 B5 F0 9F 87 AD", "87 B5 F0 9F 87 B3", "87 B5 F0 9F 87 B1", "87 B5 F0 9F 87 B9", "87 B5 F0 9F 87 B7", "87 B6 F0 9F 87 A6", "87 B7 F0 9F 87 AA", "87 B7 F0 9F 87 B4", "87 B7 F0 9F 87 BA", "87 B7 F0 9F 87 BC", "87 A7 F0 9F 87 B1", "87 B8 F0 9F 87 AD", "87 B0 F0 9F 87 B3", "87 B1 F0 9F 87 A8", "87 B5 F0 9F 87 B2", "87 BB F0 9F 87 A8", "87 BC F0 9F 87 B8", "87 B8 F0 9F 87 B2", "87 B8 F0 9F 87 B9", "87 B8 F0 9F 87 A6", "87 B8 F0 9F 87 B3", "87 B7 F0 9F 87 B8", "87 B8 F0 9F 87 A8", "87 B8 F0 9F 87 B1", "87 B8 F0 9F 87 AC", "87 B8 F0 9F 87 BD", "87 B8 F0 9F 87 B0", "87 B8 F0 9F 87 AE", "87 B8 F0 9F 87 A7", "87 B8 F0 9F 87 B4", "87 BF F0 9F 87 A6", "87 AC F0 9F 87 B8", "87 B0 F0 9F 87 B7", "87 B8 F0 9F 87 B8", "87 AA F0 9F 87 B8", "87 B1 F0 9F 87 B0", "87 B8 F0 9F 87 A9", "87 B8 F0 9F 87 B7", "87 B8 F0 9F 87 BF", "87 B8 F0 9F 87 AA", "87 A8 F0 9F 87 AD", "87 B8 F0 9F 87 BE", "87 B9 F0 9F 87 BC", "87 B9 F0 9F 87 AF", "87 B9 F0 9F 87 BF", "87 B9 F0 9F 87 AD", "87 B9 F0 9F 87 B1", "87 B9 F0 9F 87 AC", "87 B9 F0 9F 87 B0", "87 B9 F0 9F 87 B4", "87 B9 F0 9F 87 B9", "87 B9 F0 9F 87 B3", "87 B9 F0 9F 87 B7", "87 B9 F0 9F 87 B2", "87 B9 F0 9F 87 A8", "87 B9 F0 9F 87 BB", "87 BA F0 9F 87 AC", "87 BA F0 9F 87 A6", "87 A6 F0 9F 87 AA", "87 AC F0 9F 87 A7", "87 BA F0 9F 87 B8", "87 BB F0 9F 87 AE", "87 BA F0 9F 87 BE", "87 BA F0 9F 87 BF", "87 BB F0 9F 87 BA", "87 BB F0 9F 87 A6", "87 BB F0 9F 87 AA", "87 BB F0 9F 87 B3", "87 BC F0 9F 87 AB", "87 AA F0 9F 87 AD", "87 BE F0 9F 87 AA", "87 BF F0 9F 87 B2", "87 BF F0 9F 87 BC"];
  emojisArray = [];
  freqEmojisArray = [];
  for (m = 0, len2 = rawEmojis.length; m < len2; m++) {
    em = rawEmojis[m];
    emojisArray.push(emojiFormatter(em));
  }
  frequentlyUsedEmojisRaw = ["92 85", "91 84", "91 85", "91 82", "91 83", "92 85", "91 84", "91 85", "91 82", "91 83", "92 85", "91 84", "91 85", "91 82", "91 83", "92 85", "91 84", "91 85", "91 82", "91 83", "92 85", "91 84", "91 85", "91 82", "91 83"];
  for (n = 0, len3 = frequentlyUsedEmojisRaw.length; n < len3; n++) {
    em = frequentlyUsedEmojisRaw[n];
    freqEmojisArray.push(emojiFormatter(em));
  }
  return board;
};

exports.Sheet = function(array) {
  var act, actions, acts, button, description, descriptionBuffer, divider, exitButton, index, l, len1, o, overlay, ref, setup, sheet, sheets;
  setup = setupComponent("sheet", array);
  sheet = new Layer({
    backgroundColor: "transparent"
  });
  sheet.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  overlay = new Layer({
    backgroundColor: "rgba(0, 0, 0, .4)",
    superLayer: sheet,
    name: "overlay"
  });
  overlay.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  sheets = new Layer({
    backgroundColor: "transparent",
    superLayer: sheet
  });
  sheets.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  exitButton = new exports.Button({
    buttonType: "big",
    text: setup.exit,
    blur: false,
    superLayer: sheets
  });
  exitButton.constraints = {
    bottom: 10,
    align: "horizontal"
  };
  actions = new Layer({
    superLayer: sheets,
    borderRadius: exports.px(12.5),
    backgroundColor: "rgba(255,255,255, .85)"
  });
  descriptionBuffer = 0;
  if (setup.description) {
    description = new exports.Text({
      style: "sheetDescription",
      text: setup.description,
      superLayer: actions,
      fontSize: 13,
      color: "#8F8E94",
      textAlign: "center"
    });
    description.constraints = {
      top: 21,
      align: "horizontal",
      width: exports.pt(exports.width) - 100
    };
    exports.layout();
    descriptionBuffer = exports.pt(description.height) + 42;
    divider = new Layer({
      superLayer: actions,
      backgroundColor: "#D6E3E7"
    });
    divider.constraints = {
      height: 1,
      top: descriptionBuffer,
      leading: 0,
      trailing: 0
    };
  }
  exports.bgBlur(actions);
  actions.constraints = {
    leading: 10,
    trailing: 10,
    bottom: [exitButton, 10],
    height: 58 * setup.actions.length + descriptionBuffer
  };
  exports.layout();
  acts = {};
  ref = setup.actions;
  for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
    act = ref[index];
    o = new Layer({
      superLayer: actions,
      width: actions.width,
      backgroundColor: "transparent",
      borderRadius: exports.px(12.5)
    });
    o.constraints = {
      top: index * 58 + descriptionBuffer,
      height: 58
    };
    button = new exports.Button({
      text: act,
      superLayer: o,
      fontSize: 20
    });
    specialChar(button);
    button.constraints = {
      align: "center"
    };
    button.color = "#FE3824";
    if (index !== setup.actions.length - 1) {
      divider = new Layer({
        superLayer: o,
        width: actions.width,
        backgroundColor: "#D6E3E7"
      });
      divider.constraints = {
        height: 1,
        bottom: 0
      };
    }
    exports.layout();
    o.on(Events.TouchStart, function() {
      var backgroundColor;
      backgroundColor = "rgba(215,215,215,.7)";
      return this.animate({
        properties: {
          backgroundColor: backgroundColor
        },
        time: .5
      });
    });
    o.on(Events.TouchEnd, function() {
      this.animate({
        properties: {
          backgroundColor: "transparent"
        },
        time: .5
      });
      sheets.animate({
        properties: {
          maxY: exports.height + exports.px((setup.actions.length + 3) * 58)
        },
        time: .3
      });
      overlay.animate({
        properties: {
          opacity: 0
        },
        time: .3
      });
      return Utils.delay(.3, function() {
        return sheet.destroy();
      });
    });
    acts[act] = o;
  }
  if (setup.animated === true) {
    overlay.opacity = 0;
    sheets.maxY = exports.height + exports.px((setup.actions.length + 3) * 58);
    overlay.animate({
      properties: {
        opacity: 1
      },
      time: .3
    });
    sheets.animate({
      properties: {
        maxY: exports.height
      },
      time: .3
    });
  }
  overlay.on(Events.TouchEnd, function() {
    sheets.animate({
      properties: {
        maxY: exports.height + exports.px((setup.actions.length + 3) * 58)
      },
      time: .3
    });
    overlay.animate({
      properties: {
        opacity: 0
      },
      time: .3
    });
    return Utils.delay(.3, function() {
      return sheet.destroy();
    });
  });
  exitButton.on(Events.TouchEnd, function() {
    sheets.animate({
      properties: {
        maxY: exports.height + exports.px((setup.actions.length + 3) * 58)
      },
      time: .3
    });
    overlay.animate({
      properties: {
        opacity: 0
      },
      time: .3
    });
    return Utils.delay(.3, function() {
      return sheet.destroy();
    });
  });
  sheet.cancel = exitButton;
  sheet.description = description;
  sheet.overlay = overlay;
  sheet.actions = acts;
  return sheet;
};

exports.NavBar = function(array) {
  var bar, barArea, divider, l, layer, leading, len1, ref, setup, svg, title;
  setup = setupComponent("navBar", array);
  bar = new Layer({
    name: "navbar"
  });
  barArea = new Layer({
    superLayer: bar,
    backgroundColor: "transparent"
  });
  divider = new Layer({
    backgroundColor: "#B2B2B2",
    name: "nav divider",
    superLayer: barArea
  });
  if (setup.superLayer) {
    setup.superLayer.addSubLayer(bar);
  }
  divider.constraints = {
    height: .5,
    bottom: 0,
    leading: 0,
    trailing: 0
  };
  if (setup.blur) {
    bar.backgroundColor = "rgba(255, 255, 255, .8)";
    exports.bgBlur(bar);
  } else {
    bar.backgroundColor = "rgba(255, 255, 255, 1)";
    exports.bgBlur(bar);
  }
  bar.type = setup.type;
  barArea.constraints = {
    leading: 0,
    trailing: 0,
    height: 44,
    bottom: 0
  };
  bar.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    height: 64
  };
  ref = Framer.CurrentContext.layers;
  for (l = 0, len1 = ref.length; l < len1; l++) {
    layer = ref[l];
    if (layer.type === "statusBar") {
      this.statusBar = layer;
      bar.placeBehind(this.statusBar);
    }
  }
  if (typeof setup.title === "string") {
    title = new exports.Text({
      style: "navBarTitle",
      fontWeight: "semibold",
      superLayer: barArea,
      text: setup.title
    });
  }
  if (typeof setup.title === "object") {
    title = new exports.Text({
      style: "navBarTitle",
      fontWeight: "semibold",
      superLayer: barArea,
      text: setup.title.label.html
    });
    bar.superLayer = setup.title.view;
  }
  specialChar(title);
  title.constraints = {
    align: "horizontal",
    bottom: 12
  };
  if (typeof setup.right === "string" && typeof setup.right !== "boolean") {
    bar.right = new exports.Button({
      superLayer: barArea,
      text: setup.right,
      fontWeight: 500,
      constraints: {
        bottom: 12,
        trailing: 8
      }
    });
    bar.right.type = "button";
    specialChar(bar.right);
  }
  if (typeof setup.right === "object") {
    bar.right = setup.right;
    bar.right.superLayer = barArea;
    bar.right.constraints = {
      trailing: 8,
      bottom: 12
    };
  }
  if (typeof setup.left === "string" && typeof setup.left !== "boolean") {
    leading = 8;
    if (setup.left.indexOf("<") !== -1) {
      svg = exports.svg(iconLibrary.chevron);
      bar.chevron = new Layer({
        width: svg.width,
        height: svg.height,
        backgroundColor: "transparent",
        superLayer: barArea
      });
      bar.chevron.html = svg.svg;
      bar.chevron.constraints = {
        bottom: 9,
        leading: 8
      };
      setup.left = setup.left.replace("<", "");
      leading = [bar.chevron, 4];
    }
    bar.left = new exports.Button({
      superLayer: barArea,
      text: setup.left,
      fontWeight: 500,
      constraints: {
        bottom: 12,
        leading: leading
      }
    });
    bar.left.on(Events.TouchStart, function() {
      if (bar.chevron) {
        return bar.chevron.animate({
          properties: {
            opacity: .25
          },
          time: .5
        });
      }
    });
    bar.left.on(Events.TouchEnd, function() {
      if (bar.chevron) {
        return bar.chevron.animate({
          properties: {
            opacity: 1
          },
          time: .5
        });
      }
    });
  }
  if (typeof setup.left === "object") {
    bar.left = setup.left;
    bar.left.superLayer = barArea;
    bar.left.constraints = {
      leading: 8,
      bottom: 12
    };
  }
  exports.layout();
  return bar;
};

exports.Tab = function(array) {
  var icon, label, setup, svgFrame, tabBox, tabView;
  setup = setupComponent("tab", array);
  switch (exports.device) {
    case "iphone-5":
      this.tabWidth = 55;
      break;
    default:
      this.tabWidth = 75;
  }
  tabView = new Layer({
    name: setup.label + " view",
    backgroundColor: "transparent"
  });
  tabView.constraints = {
    leading: 0,
    trailing: 0,
    top: 0,
    bottom: 0
  };
  tabBox = new Layer({
    backgroundColor: "transparent",
    name: setup.label + " tab"
  });
  tabBox.constraints = {
    width: this.tabWidth,
    height: 49
  };
  icon = new Layer({
    width: exports.px(25),
    height: exports.px(25),
    backgroundColor: "transparent",
    name: "icon",
    superLayer: tabBox
  });
  icon.constraints = {
    align: "horizontal",
    top: 7
  };
  svgFrame = exports.svg(setup.icon);
  icon.html = svgFrame.svg;
  icon.width = svgFrame.width;
  icon.height = svgFrame.height;
  label = new exports.Text({
    text: setup.label,
    superLayer: tabBox,
    color: "#929292",
    fontSize: 10,
    name: "label",
    textTransform: "capitalize"
  });
  label.constraints = {
    bottom: 2,
    horizontalCenter: icon
  };
  exports.layout();
  tabBox.type = "tab";
  tabBox.icon = icon;
  tabBox.view = tabView;
  tabBox.label = label;
  return tabBox;
};

exports.TabBar = function(array) {
  var divider, dummyTab, dummyTab2, index, l, len1, ref, setActive, setup, tab, tabBar, tabBarBG, tabBarBox, tabWidth;
  setup = setupComponent("tabBar", array);
  if (setup.tabs.length === 0) {
    dummyTab = new exports.Tab;
    dummyTab2 = new exports.Tab;
    setup.tabs.push(dummyTab);
    setup.tabs.push(dummyTab2);
  }
  tabWidth = 75;
  switch (exports.device) {
    case "iphone-5":
      tabWidth = 55;
      break;
    default:
      tabWidth = 75;
  }
  tabBar = new Layer({
    backgroundColor: "transparent",
    name: "tab bar"
  });
  tabBarBG = new BackgroundLayer({
    superLayer: tabBar,
    name: "tabBar background"
  });
  tabBar.constraints = {
    leading: 0,
    trailing: 0,
    bottom: 0,
    height: 49
  };
  tabBarBG.constraints = {
    leading: 0,
    trailing: 0,
    bottom: 0,
    height: 49
  };
  divider = new Layer({
    backgroundColor: "#B2B2B2",
    name: "tabDivider",
    superLayer: tabBar
  });
  divider.constraints = {
    top: 0,
    leading: 0,
    trailing: 0,
    height: .5
  };
  tabBarBox = new Layer({
    superLayer: tabBar,
    backgroundColor: "transparent",
    name: "tabBar box"
  });
  tabBarBox.constraints = {
    height: 49,
    width: setup.tabs.length * tabWidth
  };
  exports.layout();
  setActive = function(tabIndex) {
    var index, l, len1, ref, results, tab;
    ref = setup.tabs;
    results = [];
    for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
      tab = ref[index];
      if (index === tabIndex) {
        exports.changeFill(tab.icon, exports.color(setup.activeColor));
        tab.label.color = exports.color(setup.activeColor);
        results.push(tab.view.visible = true);
      } else {
        exports.changeFill(tab.icon, exports.color(setup.inactiveColor));
        tab.label.color = exports.color(setup.inactiveColor);
        results.push(tab.view.visible = false);
      }
    }
    return results;
  };
  ref = setup.tabs;
  for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
    tab = ref[index];
    if (tab.type !== "tab") {
      error(tab.id, 5);
    }
    tabBarBox.addSubLayer(tab);
    exports.changeFill(tab.icon, exports.color(setup.inactiveColor));
    tab.label.color = exports.color(setup.inactiveColor);
    tabBarBG.backgroundColor = setup.backgroundColor;
    if (setup.blur) {
      tabBarBG.backgroundColor = "rgba(255,255,255, .9)";
      exports.bgBlur(tabBarBG);
    }
    if (index !== 0) {
      tab.constraints = {
        leading: setup.tabs[index - 1]
      };
      exports.layout();
    }
    tab.on(Events.TouchStart, function() {
      var tabIndex;
      tabIndex = this.x / exports.px(tabWidth);
      return setActive(tabIndex);
    });
  }
  tabBarBox.constraints = {
    align: "horizontal"
  };
  setActive(setup.start);
  exports.layout();
  return tabBar;
};

exports.Text = function(array) {
  var exceptions, l, len1, len2, m, prop, ref, ref1, setup, textFrame, textLayer;
  setup = setupComponent("text", array);
  exceptions = Object.keys(setup);
  textLayer = new Layer({
    backgroundColor: "transparent",
    name: setup.name
  });
  textLayer.type = "text";
  textLayer.html = setup.text;
  ref = defaults.framerProps;
  for (l = 0, len1 = ref.length; l < len1; l++) {
    prop = ref[l];
    if (setup[prop]) {
      if (prop === "color") {
        setup[prop] = exports.color(setup[prop]);
      }
      textLayer[prop] = setup[prop];
    }
  }
  ref1 = defaults.styleProps;
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    prop = ref1[m];
    if (setup[prop]) {
      if (prop === "lineHeight" && setup[prop] === "auto") {
        setup[prop] = setup["fontSize"];
      }
      if (prop === "fontWeight") {
        switch (setup[prop]) {
          case "ultrathin":
            setup[prop] = 100;
            break;
          case "thin":
            setup[prop] = 200;
            break;
          case "light":
            setup[prop] = 300;
            break;
          case "regular":
            setup[prop] = 400;
            break;
          case "medium":
            setup[prop] = 500;
            break;
          case "semibold":
            setup[prop] = 600;
            break;
          case "bold":
            setup[prop] = 700;
            break;
          case "black":
            setup[prop] = 800;
        }
      }
      if (setup[prop] === parseInt(setup[prop], 10) && setup[prop] < 99) {
        setup[prop] = exports.px(setup[prop]) + "px";
      }
      textLayer.style[prop] = setup[prop];
    }
  }
  textFrame = textAutoSize(textLayer);
  textLayer.props = {
    height: textFrame.height,
    width: textFrame.width
  };
  textLayer.constraints = setup.constraints;
  exports.layout();
  return textLayer;
};

iconLibrary = {
  activity: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(16)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 16 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Soccer Ball</title> <desc>Created with Sketch.</desc> <defs> <circle id='path-1' cx='8' cy='8' r='8'></circle> </defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6' sketch:type='MSArtboardGroup' transform='translate(-179.000000, -639.000000)'> <g id='Soccer-Ball' sketch:type='MSLayerGroup' transform='translate(179.000000, 639.000000)'> <mask id='mask-2' sketch:name='Mask' fill='white'> <use xlink:href='#path-1'></use> </mask> <use id='Mask' stroke='#4A5361' sketch:type='MSShapeGroup' xlink:href='#path-1'></use> <path d='M6,12.1203046 L12.8573384,8 L13.3723765,8.8571673 L6.51503807,12.9774719 L6,12.1203046 L6,12.1203046 Z' id='Rectangle-47' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M11.849648,8.7260551 L19.1001103,5.34510901 L19.5227285,6.2514168 L12.2722662,9.63236289 L11.849648,8.7260551 L11.849648,8.7260551 Z' id='Rectangle-47-Copy-3' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M6,3.1203046 L12.8573384,-1 L13.3723765,-0.142832699 L6.51503807,3.9774719 L6,3.1203046 L6,3.1203046 Z' id='Rectangle-47-Copy-2' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M-1,7.1203046 L5.85733841,3 L6.37237648,3.8571673 L-0.484961925,7.9774719 L-1,7.1203046 L-1,7.1203046 Z' id='Rectangle-47-Copy-4' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <rect id='Rectangle-50' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)' x='4' y='6' width='1' height='5'></rect> <rect id='Rectangle-51' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)' x='11.5' y='3' width='1' height='12'></rect> <path d='M5,4.8571673 L11.8573384,8.9774719 L12.3723765,8.1203046 L5.51503807,4 L5,4.8571673' id='Rectangle-47-Copy' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M5,12.8571673 L11.8573384,16.9774719 L12.3723765,16.1203046 L5.51503807,12 L5,12.8571673' id='Rectangle-47-Copy-5' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M11.9048972,6.14766064 L13.8714227,8.33170849 L12.4019596,10.8768933 L9.52725589,10.2658562 L9.22005445,7.34302965 L11.9048972,6.14766064' id='Polygon-1' fill='#D8D8D8' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M11.9048972,6.14766064 L13.8714227,8.33170849 L12.4019596,10.8768933 L9.52725589,10.2658562 L9.22005445,7.34302965 L11.9048972,6.14766064' id='Polygon-1-Copy' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M7.45771189,3.19504739 L7.35514484,6.13218333 L4.5300676,6.9422612 L2.88664089,4.5057809 L4.69602457,2.18987541 L7.45771189,3.19504739' id='Polygon-1-Copy-2' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M7.45771189,11.1950474 L7.35514484,14.1321833 L4.5300676,14.9422612 L2.88664089,12.5057809 L4.69602457,10.1898754 L7.45771189,11.1950474' id='Polygon-1-Copy-3' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> <path d='M14.5431701,0.0725939314 L14.4406031,3.00972988 L11.6155258,3.81980774 L9.97209912,1.38332745 L11.7814828,-0.93257805 L14.5431701,0.0725939314' id='Polygon-1-Copy-4' fill='#4A5361' sketch:type='MSShapeGroup' mask='url(#mask-2)'></path> </g> </g> </g> </svg>",
  animals: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(17)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 17 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Group</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6' sketch:type='MSArtboardGroup' transform='translate(-117.000000, -639.000000)' stroke='#4A5361'> <g id='ic_Food' sketch:type='MSLayerGroup' transform='translate(118.000000, 640.000000)'> <g id='Group' sketch:type='MSShapeGroup'> <path d='M5.68377537,1.38156646 C6.23926066,1.13624 6.85372005,1 7.5,1 C8.14627995,1 8.76073934,1.13624 9.31622463,1.38156646 C9.80879275,0.562359019 10.8255888,0 12,0 C13.6568542,0 15,1.11928813 15,2.5 C15,3.5571398 14.2126246,4.46102843 13.0999226,4.82662514 C14.2496528,5.64185422 15,6.98330062 15,8.5 C15,10.7167144 13.3971873,12.5590719 11.2872671,12.9313673 C10.4867248,14.1757703 9.08961696,15 7.5,15 C5.91038304,15 4.51327524,14.1757703 3.71273291,12.9313673 C1.60281268,12.5590719 0,10.7167144 0,8.5 C0,6.98330062 0.750347244,5.64185422 1.90007741,4.82662514 C0.787375445,4.46102843 0,3.5571398 0,2.5 C0,1.11928813 1.34314575,0 3,0 C4.17441122,0 5.19120725,0.562359019 5.68377537,1.38156646 Z' id='Oval-8'></path> <path d='M5.73834228,12 C5.86290979,12 6.14642353,12 6.14642353,12 C6.14642353,12 6.43215696,12.4426123 6.5246582,12.4919739 C6.66455601,12.5666277 7,12.4919739 7,12.4919739 L7,12 L8,12 L8,12.4919739 L8.49799228,12.4919739 L8.84301769,12 L9.3918457,12 C9.3918457,12 8.99598457,12.9839478 8.49799228,12.9839478 L6.60702407,12.9839478 C6.21404813,12.9839478 5.45996094,12 5.73834228,12 Z' id='Rectangle-44-Copy-2'></path> <circle id='Oval-14' cx='10.5' cy='7.5' r='0.5'></circle> <circle id='Oval-14-Copy' cx='4.5' cy='7.5' r='0.5'></circle> <path d='M12.6999969,5 C12.6999969,3.06700338 11.1329936,1.5 9.19999695,1.5' id='Oval-16'></path> <path d='M5.5,5 C5.5,3.06700338 3.93299662,1.5 2,1.5' id='Oval-16-Copy' transform='translate(3.750000, 3.250000) scale(-1, 1) translate(-3.750000, -3.250000) '></path> <rect id='Rectangle-44-Copy' x='7' y='11' width='1' height='1'></rect> <path d='M6,10 L6.5,10 L6.49999999,9.5 L8.50000005,9.5 L8.50000005,10 L9,10 L9,10.5 L8.5,10.5 L8.5,11 L6.5,11 L6.5,10.5 L6,10.5 L6,10 Z' id='Path'></path> </g> </g> </g> </g> </svg>",
  chevron: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='13px' height='22px' viewBox='0 0 13 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Back Chevron</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='Navigation-Bar/Back' transform='translate(-8.000000, -31.000000)' fill='#0076FF'> <path d='M8.5,42 L19,31.5 L21,33.5 L12.5,42 L21,50.5 L19,52.5 L8.5,42 Z' id='Back-Chevron'></path> </g> </g> </svg>",
  emoji: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(20)) + "px' height='" + (exports.px(20)) + "px' viewBox='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Emoji</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Keyboard/Light/Lower' sketch:type='MSLayerGroup' transform='translate(-60.000000, -181.000000)' fill='#030303'> <g id='Bottom-Row' transform='translate(3.000000, 170.000000)' sketch:type='MSShapeGroup'> <path d='M66.75,30.5 C72.1347763,30.5 76.5,26.1347763 76.5,20.75 C76.5,15.3652237 72.1347763,11 66.75,11 C61.3652237,11 57,15.3652237 57,20.75 C57,26.1347763 61.3652237,30.5 66.75,30.5 Z M66.75,29.5 C71.5824916,29.5 75.5,25.5824916 75.5,20.75 C75.5,15.9175084 71.5824916,12 66.75,12 C61.9175084,12 58,15.9175084 58,20.75 C58,25.5824916 61.9175084,29.5 66.75,29.5 Z M63.75,19 C64.4403559,19 65,18.4403559 65,17.75 C65,17.0596441 64.4403559,16.5 63.75,16.5 C63.0596441,16.5 62.5,17.0596441 62.5,17.75 C62.5,18.4403559 63.0596441,19 63.75,19 Z M69.75,19 C70.4403559,19 71,18.4403559 71,17.75 C71,17.0596441 70.4403559,16.5 69.75,16.5 C69.0596441,16.5 68.5,17.0596441 68.5,17.75 C68.5,18.4403559 69.0596441,19 69.75,19 Z M59.8876334,22.1641444 C59.6390316,21.383134 60.065918,20.9785156 60.8530951,21.2329304 C60.8530951,21.2329304 63.0937503,22.2125 66.7500001,22.2125 C70.4062499,22.2125 72.6469047,21.2329304 72.6469047,21.2329304 C73.4287162,20.9662153 73.8812463,21.4044097 73.6058477,22.1807437 C73.6058477,22.1807437 72.6,27.575 66.75,27.575 C60.9,27.575 59.8876334,22.1641444 59.8876334,22.1641444 Z M66.75,23.1875 C64.06875,23.1875 61.8544055,22.4737821 61.8544055,22.4737821 C61.3273019,22.32948 61.1781233,22.5721615 61.5639555,22.957075 C61.5639555,22.957075 62.3625,24.65 66.75,24.65 C71.1375,24.65 71.9508503,22.9438304 71.9508503,22.9438304 C72.3093659,22.5399278 72.1690793,22.3359844 71.6354273,22.476349 C71.6354273,22.476349 69.43125,23.1875 66.75,23.1875 Z' id='Emoji'></path> </g> </g> </g> </svg>",
  "delete": {
    on: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(24)) + "px' height='" + (exports.px(18)) + "px' viewBox='0 0 24 18' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Back</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Keyboard/Light/Upper' sketch:type='MSLayerGroup' transform='translate(-339.000000, -130.000000)' fill='#030303'> <g id='Third-Row' transform='translate(3.000000, 118.000000)' sketch:type='MSShapeGroup'> <path d='M351.642663,20.9776903 L354.466795,18.1535585 C354.760106,17.8602476 354.763983,17.3814962 354.47109,17.088603 C354.176155,16.7936677 353.7014,16.7976328 353.406135,17.0928983 L350.582003,19.9170301 L347.757871,17.0928983 C347.46456,16.7995874 346.985809,16.7957097 346.692916,17.088603 C346.39798,17.3835382 346.401945,17.858293 346.697211,18.1535585 L349.521343,20.9776903 L346.697211,23.801822 C346.4039,24.0951329 346.400022,24.5738843 346.692916,24.8667776 C346.987851,25.1617128 347.462606,25.1577477 347.757871,24.8624822 L350.582003,22.0383504 L353.406135,24.8624822 C353.699445,25.1557931 354.178197,25.1596708 354.47109,24.8667776 C354.766025,24.5718423 354.76206,24.0970875 354.466795,23.801822 L351.642663,20.9776903 Z M337.059345,22.0593445 C336.474285,21.4742847 336.481351,20.5186489 337.059345,19.9406555 L343.789915,13.2100853 C344.182084,12.817916 344.94892,12.5 345.507484,12.5 L356.002098,12.5 C357.933936,12.5 359.5,14.0688477 359.5,16.0017983 L359.5,25.9982017 C359.5,27.9321915 357.923088,29.5 356.002098,29.5 L345.507484,29.5 C344.951066,29.5 344.177169,29.1771693 343.789915,28.7899148 L337.059345,22.0593445 Z' id='Back'></path> </g> </g> </g> </svg>",
    off: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(24)) + "px' height='" + (exports.px(18)) + "px' viewBox='0 0 24 18' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Back</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Keyboard/Light/Upper' sketch:type='MSLayerGroup' transform='translate(-339.000000, -130.000000)' fill='#030303'> <g id='Third-Row' transform='translate(3.000000, 118.000000)' sketch:type='MSShapeGroup'> <path d='M337.059345,22.0593445 C336.474285,21.4742847 336.481351,20.5186489 337.059345,19.9406555 L343.789915,13.2100853 C344.182084,12.817916 344.94892,12.5 345.507484,12.5 L356.002098,12.5 C357.933936,12.5 359.5,14.0688477 359.5,16.0017983 L359.5,25.9982017 C359.5,27.9321915 357.923088,29.5 356.002098,29.5 L345.507484,29.5 C344.951066,29.5 344.177169,29.1771693 343.789915,28.7899148 L337.059345,22.0593445 Z M351.642663,20.9776903 L354.466795,18.1535585 C354.760106,17.8602476 354.763983,17.3814962 354.47109,17.088603 C354.176155,16.7936677 353.7014,16.7976328 353.406135,17.0928983 L350.582003,19.9170301 L347.757871,17.0928983 C347.46456,16.7995874 346.985809,16.7957097 346.692916,17.088603 C346.39798,17.3835382 346.401945,17.858293 346.697211,18.1535585 L349.521343,20.9776903 L346.697211,23.801822 C346.4039,24.0951329 346.400022,24.5738843 346.692916,24.8667776 C346.987851,25.1617128 347.462606,25.1577477 347.757871,24.8624822 L350.582003,22.0383504 L353.406135,24.8624822 C353.699445,25.1557931 354.178197,25.1596708 354.47109,24.8667776 C354.766025,24.5718423 354.76206,24.0970875 354.466795,23.801822 L351.642663,20.9776903 Z M338.70972,21.7097195 C338.317752,21.3177522 338.318965,20.6810349 338.70972,20.2902805 L344.643245,14.3567547 C344.840276,14.1597245 345.225639,14 345.493741,14 L355.997239,14 C357.103333,14 357.999999,14.8970601 357.999999,16.0058586 L357.999999,25.9941412 C357.999999,27.1019464 357.106457,27.9999999 355.997239,27.9999999 L345.493741,28 C345.221056,28 344.840643,27.8406431 344.643246,27.6432453 L338.70972,21.7097195 Z' id='Back'></path> </g> </g> </g> </svg>"
  },
  food: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(17)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 17 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Food</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-148.000000, -637.000000)'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id='Food' transform='translate(149.500000, 229.500000)' sketch:type='MSShapeGroup'> <path d='M5.5,15.5 L1,15.5 L0,5 L6.5,5 L6.26360933,7.48210202' id='Drink' stroke='#4A5461'></path> <path d='M6.01077545,1.96930098 L6.51571352,5.22270539 L5.71908184,5.67947812 L5.0389009,1.96930098 L4.85557247,1.96930098 L4.85557247,0.96930098 L8.85557247,0.96930098 L8.85557247,1.96930098 L6.01077545,1.96930098 Z' id='Straw' fill='#4A5461' transform='translate(6.855572, 3.324390) rotate(24.000000) translate(-6.855572, -3.324390) '></path> <rect id='Bottom-Bun' stroke='#4A5461' x='3' y='14' width='10.5' height='1.5' rx='1'></rect> <path d='M1.5,12.5024408 C1.5,11.948808 1.94916916,11.5 2.49268723,11.5 L14.0073128,11.5 C14.5555588,11.5 15,11.9469499 15,12.5024408 L15,12.9975592 C15,13.551192 14.5508308,14 14.0073128,14 L2.49268723,14 C1.94444121,14 1.5,13.5530501 1.5,12.9975592 L1.5,12.5024408 Z M3.93300003,11.8392727 C3.41771834,11.6518976 3.44483697,11.5 3.9955775,11.5 L13.0044225,11.5 C13.5542648,11.5 13.5866061,11.6503251 13.067,11.8392727 L8.5,13.5 L3.93300003,11.8392727 Z' id='&quot;Patty&quot;' fill='#4A5461'></path> <path d='M2.5,10.5 L13.5,10.5 L15,11.5 L1,11.5 L2.5,10.5 Z' id='Cheese' fill='#4A5461'></path> <path d='M8.25,10.5 C11.4256373,10.5 14,10.3284271 14,9.5 C14,8.67157288 11.4256373,8 8.25,8 C5.07436269,8 2.5,8.67157288 2.5,9.5 C2.5,10.3284271 5.07436269,10.5 8.25,10.5 Z' id='Top-Bun' stroke='#4A5461' stroke-width='0.75'></path> </g> </g> </g> </g> </svg>",
  flags: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(11)) + "px' height='" + (exports.px(15)) + "px' viewBox='0 0 11 15' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Flag</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-275.000000, -639.000000)'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id='Flag' transform='translate(275.000000, 231.500000)' sketch:type='MSShapeGroup'> <rect id='Pole' fill='#4A5461' x='0' y='0' width='1' height='14'></rect> <path d='M1,1 C1,1 1.25,2 3.5,2 C5.75,2 6,0.749999998 8,0.75 C10,0.749999998 10,1.5 10,1.5 L10,7.5 C10,7.5 10,6.5 8,6.5 C6,6.5 4.80623911,8 3.5,8 C2.19376089,8 1,7 1,7 L1,1 Z' stroke='#4A5461' stroke-linejoin='round'></path> </g> </g> </g> </g> </svg>",
  frequent: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(17)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 17 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Recent</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-55.000000, -638.000000)'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id='Recent' transform='translate(55.500000, 230.000000)' sketch:type='MSShapeGroup'> <circle id='Body' stroke='#4A5461' cx='8' cy='8' r='8'></circle> <path d='M7.5,7.5 L7.5,8.5 L8.5,8.5 L8.5,2 L7.5,2 L7.5,7.5 L4,7.5 L4,8.5 L8.5,8.5 L8.5,7.5 L7.5,7.5 Z' id='Hands' fill='#4A5461'></path> </g> </g> </g> </g> </svg>",
  keyboard: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(32.5)) + "px' height='" + (exports.px(23.5)) + "px' viewBox='0 0 65 47' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>Shape</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'> <g id='iPad-Portrait' transform='translate(-1436.000000, -1956.000000)' fill='#000000'> <g id='Keyboard-Light' transform='translate(0.000000, 1422.000000)'> <g id='Keyboard-down' transform='translate(1412.000000, 500.000000)'> <path d='M87.001332,34 C88.1051659,34 89,34.8997127 89,35.9932874 L89,61.0067126 C89,62.1075748 88.1058759,63 87.001332,63 L25.998668,63 C24.8948341,63 24,62.1002873 24,61.0067126 L24,35.9932874 C24,34.8924252 24.8941241,34 25.998668,34 L87.001332,34 Z M26,36 L26,61 L87,61 L87,36 L26,36 Z M79,40 L83,40 L83,44 L79,44 L79,40 Z M72,40 L76,40 L76,44 L72,44 L72,40 Z M65,40 L69,40 L69,44 L65,44 L65,40 Z M58,40 L62,40 L62,44 L58,44 L58,40 Z M51,40 L55,40 L55,44 L51,44 L51,40 Z M44,40 L48,40 L48,44 L44,44 L44,40 Z M37,40 L41,40 L41,44 L37,44 L37,40 Z M30,40 L34,40 L34,44 L30,44 L30,40 Z M79,47 L83,47 L83,51 L79,51 L79,47 Z M72,47 L76,47 L76,51 L72,51 L72,47 Z M65,47 L69,47 L69,51 L65,51 L65,47 Z M58,47 L62,47 L62,51 L58,51 L58,47 Z M51,47 L55,47 L55,51 L51,51 L51,47 Z M44,47 L48,47 L48,51 L44,51 L44,47 Z M37,47 L41,47 L41,51 L37,51 L37,47 Z M30,47 L34,47 L34,51 L30,51 L30,47 Z M79,54 L83,54 L83,58 L79,58 L79,54 Z M72,54 L76,54 L76,58 L72,58 L72,54 Z M44,54 L69,54 L69,58 L44,58 L44,54 Z M37,54 L41,54 L41,58 L37,58 L37,54 Z M30,54 L34,54 L34,58 L30,58 L30,54 Z M44.3163498,69.9771047 C43.3684225,70.5420342 43.3338721,71.5096495 44.2378217,72.1373912 L55.3621539,79.8626088 C56.2667113,80.4907726 57.7338965,80.4903505 58.6378461,79.8626088 L69.7621783,72.1373912 C70.6667357,71.5092274 70.648012,70.5205204 69.7115187,69.9234166 L69.9825731,70.0962396 C69.5181333,69.800115 68.7782557,69.8126493 68.3261307,70.1269323 L57.8154999,77.4331263 C57.3651117,77.746202 56.628165,77.7381786 56.1762103,77.4199424 L45.8386137,70.1408977 C45.3836472,69.8205407 44.6375039,69.7857088 44.1566393,70.0722862 L44.3163498,69.9771047 Z' id='Shape'></path> </g> </g> </g> </g> </svg>",
  objects: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(11)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 11 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Lightbulb</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6' sketch:type='MSArtboardGroup' transform='translate(-244.000000, -639.000000)' stroke='#4A5361'> <g id='Lightbulb' sketch:type='MSLayerGroup' transform='translate(244.000000, 639.000000)'> <path d='M8,10.4002904 C9.78083795,9.48993491 11,7.63734273 11,5.5 C11,2.46243388 8.53756612,0 5.5,0 C2.46243388,0 0,2.46243388 0,5.5 C0,7.63734273 1.21916205,9.48993491 3,10.4002904 L3,14.0020869 C3,15.1017394 3.89761602,16 5.0048815,16 L5.9951185,16 C7.1061002,16 8,15.1055038 8,14.0020869 L8,10.4002904 Z' id='Oval-17' sketch:type='MSShapeGroup'></path> <rect id='Rectangle-50' sketch:type='MSShapeGroup' x='3' y='12' width='5' height='1'></rect> <rect id='Rectangle-51' sketch:type='MSShapeGroup' x='4' y='13.5' width='1.5' height='1'></rect> <path d='M5,8.5 C5,8.5 3.49999999,7.50000001 4,7 C4.50000001,6.49999999 5,7.66666667 5.5,8 C5.5,8 6.5,6.50000001 7,7 C7.5,7.49999999 6,8.5 6,8.5 L6,11 L5,11 L5,8.5 Z' id='Rectangle-52' sketch:type='MSShapeGroup'></path> </g> </g> </g> </svg>",
  shift: {
    on: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(20)) + "px' height='" + (exports.px(18)) + "px' viewBox='0 0 20 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Shift</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Keyboard/Light/Upper' sketch:type='MSLayerGroup' transform='translate(-14.000000, -130.000000)' fill='#030303'> <g id='Third-Row' transform='translate(3.000000, 118.000000)' sketch:type='MSShapeGroup'> <path d='M21.7052388,13.2052388 C21.3157462,12.8157462 20.6857559,12.8142441 20.2947612,13.2052388 L11.9160767,21.5839233 C11.1339991,22.3660009 11.3982606,23 12.4979131,23 L16.5,23 L16.5,28.009222 C16.5,28.5564136 16.9463114,29 17.4975446,29 L24.5024554,29 C25.053384,29 25.5,28.5490248 25.5,28.009222 L25.5,23 L29.5020869,23 C30.6055038,23 30.866824,22.366824 30.0839233,21.5839233 L21.7052388,13.2052388 Z' id='Shift'></path> </g> </g> </g> </svg>",
    off: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(20)) + "px' height='" + (exports.px(18)) + "px' viewBox='0 0 20 19' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Shift</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Keyboard/Light/Lower' sketch:type='MSLayerGroup' transform='translate(-14.000000, -129.000000)' fill='#030303'> <g id='Third-Row' transform='translate(3.000000, 118.000000)' sketch:type='MSShapeGroup'> <path d='M21.6719008,12.2325898 C21.301032,11.8279916 20.6946892,11.8334731 20.3288195,12.2325898 L11.6947023,21.6512983 C10.7587441,22.672308 11.1285541,23.5 12.5097751,23.5 L15.9999999,23.5000002 L15.9999999,28.0014241 C15.9999999,28.8290648 16.6716559,29.5000001 17.497101,29.5000001 L24.5028992,29.5000001 C25.3297253,29.5000001 26.0000003,28.8349703 26.0000003,28.0014241 L26.0000003,23.5000001 L29.4902251,23.5000002 C30.8763357,23.5000002 31.2439521,22.6751916 30.3054161,21.6512985 L21.6719008,12.2325898 Z M21.341748,14.3645316 C21.1530056,14.1632064 20.8433515,14.1670914 20.6582514,14.3645316 L13.5,21.9999998 L17.5000001,21.9999999 L17.5000002,27.5089956 C17.5000002,27.7801703 17.7329027,28.0000008 18.0034229,28.0000008 L23.996577,28.0000008 C24.2746097,28.0000008 24.4999997,27.7721203 24.4999997,27.5089956 L24.4999997,21.9999999 L28.5,21.9999999 L21.341748,14.3645316 Z' id='Shift'></path> </g> </g> </g> </svg>"
  },
  smileys: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(17)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 17 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>:D</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-86.000000, -638.000000)'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id=':D' transform='translate(87.000000, 230.500000)' sketch:type='MSShapeGroup'> <circle id='Head' stroke='#4A5461' stroke-width='0.789473684' cx='7.5' cy='7.5' r='7.5'></circle> <path d='M7.5,13.5263158 C10.2686907,13.5263158 12.5131579,10.3684212 12.5131579,9.18421045 C12.5131579,7.60526317 11.4389098,9.18421043 7.5,9.18421053 C3.56109023,9.18421062 2.48684211,7.60526317 2.48684211,9.18421045 C2.48684211,10.368421 4.73130935,13.5263158 7.5,13.5263158 Z M7.5,10.9605263 C8.93233083,11.1578947 11.7969925,10.368421 11.7969925,9.44423552 C11.7969925,8.78947368 10.8762084,9.57894727 7.5,9.77631579 C4.12379162,9.57894743 3.20300872,8.78947369 3.20300752,9.44423552 C3.20300582,10.368421 6.06766917,11.1578947 7.5,10.9605263 Z' id='Smile' fill='#4A5461'></path> <path d='M5.23684211,6.3236598 C5.64378876,6.3236598 5.97368421,5.88183554 5.97368421,5.33681769 C5.97368421,4.79179985 5.64378876,4.34997559 5.23684211,4.34997559 C4.82989545,4.34997559 4.5,4.79179985 4.5,5.33681769 C4.5,5.88183554 4.82989545,6.3236598 5.23684211,6.3236598 Z M9.73684211,6.3236598 C10.1437888,6.3236598 10.4736842,5.88183554 10.4736842,5.33681769 C10.4736842,4.79179985 10.1437888,4.34997559 9.73684211,4.34997559 C9.32989545,4.34997559 9,4.79179985 9,5.33681769 C9,5.88183554 9.32989545,6.3236598 9.73684211,6.3236598 Z' id='Eyes' fill='#4A5461'></path> </g> </g> </g> </g> </svg>",
  symbols: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(16)) + "px' height='" + (exports.px(17)) + "px' viewBox='0 0 15 17' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Objects &amp; Symbols</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-304.000000, -638.000000)' fill='#4A5461'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id='Objects-&amp;-Symbols' transform='translate(304.000000, 230.000000)'> <g id='Thing' transform='translate(0.000000, 0.500000)' sketch:type='MSShapeGroup'> <rect id='Rectangle-1209' x='0' y='0' width='7' height='1'></rect> <rect id='Rectangle-1209' x='0' y='2' width='7' height='1'></rect> <rect id='Rectangle-1211' x='3' y='3' width='1' height='4'></rect> </g> <path d='M11.75,0.159263978 L11.75,0 L11,0 L11,5.091493 C10.59344,4.94221392 10.0639662,4.96453224 9.55715399,5.19017957 C8.69849293,5.5724801 8.23003835,6.39365621 8.51083141,7.02432774 C8.79162447,7.65499928 9.71533454,7.85634375 10.5739956,7.47404321 C11.2761183,7.16143803 11.7173393,6.55538972 11.7013595,6 L11.75,6 L11.75,1.39385056 C12.3175908,1.59590037 13,2.0817456 13,3.25 C13,4.25 12.75,5.5 12.75,5.5 C12.75,5.5 13.75,4.75 13.75,2.5 C13.75,1.02256101 12.5642674,0.407473019 11.75,0.159263978 Z' id='Note' sketch:type='MSShapeGroup'></path> <text id='&amp;' sketch:type='MSTextLayer' font-family='SF UI Display' font-size='9.5' font-weight='normal'> <tspan x='0.25' y='16'>&amp;</tspan> </text> <text id='%' sketch:type='MSTextLayer' font-family='SF UI Display' font-size='9.5' font-weight='normal'> <tspan x='7.75' y='16'>%</tspan> </text> </g> </g> </g> </g> </svg>",
  travel: "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='" + (exports.px(17)) + "px' height='" + (exports.px(16)) + "px' viewBox='0 0 17 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'> <!-- Generator: Sketch 3.5.2 (25235) - http://www.bohemiancoding.com/sketch --> <title>Transport</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='iOS-9-Keyboards' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='iPhone-6-Portrait-Light-Copy' sketch:type='MSArtboardGroup' transform='translate(-241.000000, -638.000000)'> <g id='Keyboards' sketch:type='MSLayerGroup' transform='translate(0.000000, 408.000000)'> <g id='Transport' transform='translate(241.500000, 230.000000)' sketch:type='MSShapeGroup'> <path d='M0,6 L1,6 L1,15 L0,15 L0,6 Z M15,4 L16,4 L16,15 L15,15 L15,4 Z M3.5,0 L4.5,0 L4.5,7 L3.5,7 L3.5,0 Z M1,6 L3.5,6 L3.5,7 L1,7 L1,6 Z M4.5,0 L9.5,0 L9.5,1 L4.5,1 L4.5,0 Z M9.5,0 L10.5,0 L10.5,6 L9.5,6 L9.5,0 Z M10.5,4 L15,4 L15,5 L10.5,5 L10.5,4 Z' id='Skyline' fill='#4A5461'></path> <g id='Windows' transform='translate(2.000000, 2.000000)' fill='#4A5461'> <rect id='Window' x='0' y='6' width='1' height='1'></rect> <rect id='Window' x='3.5' y='0' width='1' height='1'></rect> <rect id='Window' x='5.5' y='0' width='1' height='1'></rect> <rect id='Window' x='5.5' y='2' width='1' height='1'></rect> <rect id='Window' x='3.5' y='2' width='1' height='1'></rect> <rect id='Window' x='11' y='4' width='1' height='1'></rect> <rect id='Window' x='11' y='6' width='1' height='1'></rect> </g> <g id='Car' transform='translate(2.500000, 6.500000)'> <path d='M8.5,8 L2.5,8 L2.5,9.5 L0.5,9.5 L0.5,7.8681145 C0.201202192,7.69582702 0,7.37091363 0,6.9906311 L0,5.0093689 C0,4.45190985 0.444836974,4 0.995577499,4 L10.0044225,4 C10.5542648,4 11,4.44335318 11,5.0093689 L11,6.9906311 C11,7.3653315 10.7990244,7.69234519 10.5,7.86649002 L10.5,9.5 L8.5,9.5 L8.5,8 Z M1.75,6.5 C2.16421356,6.5 2.5,6.16421356 2.5,5.75 C2.5,5.33578644 2.16421356,5 1.75,5 C1.33578644,5 1,5.33578644 1,5.75 C1,6.16421356 1.33578644,6.5 1.75,6.5 Z M9.25,6.5 C9.66421356,6.5 10,6.16421356 10,5.75 C10,5.33578644 9.66421356,5 9.25,5 C8.83578644,5 8.5,5.33578644 8.5,5.75 C8.5,6.16421356 8.83578644,6.5 9.25,6.5 Z M0.5,7 L10.5,7 L10.5,7.5 L0.5,7.5 L0.5,7 Z M3,6.5 L8,6.5 L8,7 L3,7 L3,6.5 Z' id='Body' fill='#4A5461'></path> <path d='M1.5,4.5 L1.5,3 C1.5,1.34314575 2.83902013,0 4.50166547,0 L6.49833453,0 C8.15610859,0 9.5,1.34651712 9.5,3 L9.5,5' id='Roof' stroke='#4A5461'></path> </g> </g> </g> </g> </g> </svg>"
};

bannerBG = {
  "iphone-5": "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='320px' height='68px' viewBox='0 0 320 68' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>iphone5</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.9'> <g id='iPhone-5/5S/5C' fill='#1A1A1C'> <path d='M0,0 L320,0 L320,68 L0,68 L0,0 Z M142,61.0048815 C142,59.897616 142.896279,59 144.0024,59 L176.9976,59 C178.103495,59 179,59.8938998 179,61.0048815 L179,61.9951185 C179,63.102384 178.103721,64 176.9976,64 L144.0024,64 C142.896505,64 142,63.1061002 142,61.9951185 L142,61.0048815 Z' id='iphone5'></path> </g> </g> </svg>",
  "iphone-6s": "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='375px' height='68px' viewBox='0 0 375 68' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6 (26304) - http://www.bohemiancoding.com/sketch --> <title>Notification background</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.9'> <g id='iOS8-Push-Notification' transform='translate(-58.000000, -23.000000)' fill='#1A1A1C'> <g transform='translate(58.000000, 7.000000)' id='Notification-container'> <g> <path d='M0,16 L375,16 L375,84 L0,84 L0,16 Z M169,77.0048815 C169,75.897616 169.896279,75 171.0024,75 L203.9976,75 C205.103495,75 206,75.8938998 206,77.0048815 L206,77.9951185 C206,79.102384 205.103721,80 203.9976,80 L171.0024,80 C169.896505,80 169,79.1061002 169,77.9951185 L169,77.0048815 Z' id='Notification-background'></path> </g> </g> </g> </g> </svg>",
  "iphone-6s-plus": "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='414px' height='68px' viewBox='0 0 414 68' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6 (26304) - http://www.bohemiancoding.com/sketch --> <title>Notification background Copy</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.9'> <g id='iOS8-Push-Notification' transform='translate(-43.000000, -74.000000)' fill='#1A1A1C'> <g transform='translate(43.000000, 74.000000)' id='Notification-container'> <g> <path d='M0,0 L414,0 L414,68 L0,68 L0,0 Z M189,61.0048815 C189,59.897616 189.896279,59 191.0024,59 L223.9976,59 C225.103495,59 226,59.8938998 226,61.0048815 L226,61.9951185 C226,63.102384 225.103721,64 223.9976,64 L191.0024,64 C189.896505,64 189,63.1061002 189,61.9951185 L189,61.0048815 Z' id='Notification-background-Copy'></path> </g> </g> </g> </g> </svg>",
  "ipad": "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='768px' height='68px' viewBox='0 0 768 68' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>ipad-portrait</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.9'> <g id='iPad-Portrait' fill='#1A1A1C'> <path d='M0,0 L768,0 L768,68 L0,68 L0,0 Z M366,61.0048815 C366,59.897616 366.896279,59 368.0024,59 L400.9976,59 C402.103495,59 403,59.8938998 403,61.0048815 L403,61.9951185 C403,63.102384 402.103721,64 400.9976,64 L368.0024,64 C366.896505,64 366,63.1061002 366,61.9951185 L366,61.0048815 Z' id='ipad-portrait'></path> </g> </g> </svg>",
  "ipad-pro": "<?xml version='1.0' encoding='UTF-8' standalone='no'?> <svg width='1024px' height='68px' viewBox='0 0 1024 68' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch --> <title>ipad-pro-portrait</title> <desc>Created with Sketch.</desc> <defs></defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0.9'> <g id='iPad-Pro-Portrait' fill='#1A1A1C'> <path d='M0,0 L1024,0 L1024,68 L0,68 L0,0 Z M494,61.0048815 C494,59.897616 494.896279,59 496.0024,59 L528.9976,59 C530.103495,59 531,59.8938998 531,61.0048815 L531,61.9951185 C531,63.102384 530.103721,64 528.9976,64 L496.0024,64 C494.896505,64 494,63.1061002 494,61.9951185 L494,61.0048815 Z' id='ipad-pro-portrait'></path> </g> </g> </svg>"
};


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9pT1NLaXQuY29mZmVlIiwiLi4vbW9kdWxlcy9mcmFtZXJLaXQuY29mZmVlIiwiLi4vbW9kdWxlcy9maXJlYmFzZS5jb2ZmZWUiLCIuLi9tb2R1bGVzL2ZpbmRNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9jb250ZW50TW9kZWwuY29mZmVlIiwiLi4vbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiLCIuLi9tb2R1bGVzL1RleHRMYXllci5jb2ZmZWUiLCIuLi9tb2R1bGVzL1N0aWNreUhlYWRlcnMuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiI2lPU0tpdCBNb2R1bGVcbiNCeSBLZXZ5biBBcm5vdHQgXG5cblxuZnJhbWVyRGV2aWNlcyA9IHtcblxuIyBGdWxsc2NyZWVuXG5cImZ1bGxzY3JlZW5cIiA6IHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcdHNjYWxlOjEsIG1vYmlsZTpmYWxzZSwgcGxhdGZvcm06XCJ3ZWJcIn1cblxuIyBpUGhvbmVzXG5cbiMjIDVTXG5cImFwcGxlLWlwaG9uZS01cy1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNXMtc2lsdmVyXCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNXMtZ29sZFwiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNWNcblwiYXBwbGUtaXBob25lLTVjLWdyZWVuXCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTVjLWJsdWVcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy1yZWRcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy13aGl0ZVwiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy15ZWxsb3dcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNWMtcGlua1wiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNnNcblwiYXBwbGUtaXBob25lLTZzLXNwYWNlLWdyYXlcIiA6IHsgaGVpZ2h0OiAxMzM0LCB3aWR0aDogNzUwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtc2lsdmVyXCI6IHsgaGVpZ2h0OiAxMzM0LCB3aWR0aDogNzUwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtZ29sZFwiOiB7IGhlaWdodDogMTMzNCwgd2lkdGg6IDc1MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTZzLXJvc2UtZ29sZFwiOiB7IGhlaWdodDogMTMzNCwgd2lkdGg6IDc1MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNnMgcGx1c1xuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1nb2xkXCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0Miwgc2NhbGU6IDMsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1zaWx2ZXJcIjogeyBoZWlnaHQ6IDIyMDgsIHdpZHRoOiAxMjQyLFx0c2NhbGU6IDMsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0MixcdHNjYWxlOiAzLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTZzLXBsdXMtcm9zZS1nb2xkXCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0MixcdHNjYWxlOiAzLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyBpUGFkc1xuXG4jIyBBaXIgXG5cImFwcGxlLWlwYWQtYWlyLTItZ29sZFwiOiB7IGhlaWdodDogMjA0OCwgd2lkdGg6IDE1MzYsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwYWQtYWlyLTItc2lsdmVyXCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1haXItMi1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgTWluaVxuXCJhcHBsZS1pcGFkLW1pbmktNC1nb2xkXCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1taW5pLTQtc3BhY2UtZ3JheVwiOiB7IGhlaWdodDogMjA0OCwgd2lkdGg6IDE1MzYsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwYWQtbWluaS00LXNpbHZlclwiOnsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNiwgc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXG4jIyBQcm9cblwiYXBwbGUtaXBhZC1wcm8tZ29sZFwiOiB7IGhlaWdodDogMjczMiwgd2lkdGg6IDIwNDgsIHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1wcm8tc2lsdmVyXCI6IHsgaGVpZ2h0OiAyNzMyLCB3aWR0aDogMjA0OCwgc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGFkLXByby1zcGFjZS1ncmF5XCIgOiB7IGhlaWdodDogMjczMiwgd2lkdGg6IDIwNDgsIHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cbn1cblxuIyMgVGhlc2UgdmFyaWFibGVzIHdpbGwgYmUgcG9wdWxhdGVkIHdpdGggZGV0YWlscyBmcm9tIHRoZSBkZXZpY2UgdXBvbiBydW5uaW5nLiBcbmV4cG9ydHMuZGV2aWNlID0gMFxuZXhwb3J0cy5uYW1lID0gMFxuZXhwb3J0cy5zY2FsZSA9IDBcbmV4cG9ydHMuaGVpZ2h0ID0gMFxuZXhwb3J0cy53aWR0aCA9IDBcbmV4cG9ydHMubW9iaWxlID0gMFxuZXhwb3J0cy5wbGF0Zm9ybSA9IDBcbmV4cG9ydHMub3JpZW50YXRpb24gPSAwXG5cbnNjcmVlbiA9IHt9XG5cblxuXG4jIGdldERldmljZSB3aWxsIHBvcHVsYXRlIGRldmljZSB2YXJpYWJsZXMsIGFuZCBpdCdsbCBvdmVycmlkZSB0aGUgZnJhbWUgaWYgdGhlIGRldmljZSBpcyBkaWZmZXJlbnQuIFxuZXhwb3J0cy5nZXREZXZpY2UgPSAtPlxuXG5cdCMgTG9hZHMgdGhlIGluaXRpYWwgZnJhbWVcblx0ZGV2aWNlID0gRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlXG5cblx0IyMjIFRoaXMgc3dpdGNoIGxvb2tzIGF0IHRoZSBpbm5lcldpZHRoIHRvIGRldGVybWluZSBpZiB0aGUgcHJvdG90eXBlIGlzIGJlaW5nIG9wZW5lZCBvbiBhIGRldmljZS4gXG5cdElmIHNvLCBpdCdsbCBvdmVycmlkZSB0aGUgZGV2aWNlLCBhbmQgaXQnbGwgYWRqdXN0IHRoZSB2aWV3IHRvIGZ1bGxzY3JlZW4uIyMjXG5cblx0c3dpdGNoIGlubmVyV2lkdGhcblx0XHQjIGlQaG9uZSA1Yy81cy9TRVxuXHRcdHdoZW4gNjQwXG5cdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwaG9uZS01cy1zaWx2ZXJcIlxuXHRcdFx0RnJhbWVyLkRldmljZS5kZXZpY2VUeXBlID0gXCJmdWxsc2NyZWVuXCJcblxuXHRcdCMgaVBob25lIDZzXG5cdFx0d2hlbiA3NTBcblx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBob25lLTZzLXNpbHZlclwiXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgPSBcImZ1bGxzY3JlZW5cIlxuXG5cdFx0IyBpUGhvbmUgNnMrXG5cdFx0d2hlbiAxMjQyIFxuXHRcdFx0aWYgaW5uZXJIZWlnaHQgPT0gMjIwOFxuXHRcdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwaG9uZS02cy1wbHVzLXNpbHZlclwiXG5cdFx0XHRcdEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSA9IFwiZnVsbHNjcmVlblwiXG5cblx0XHQjIGlQYWQgaW4gcG9ydHJhaXRcblx0XHR3aGVuIDE1MzYgXG5cdFx0XHRpZiBpbm5lckhlaWdodCA9PSAyMDQ4XG5cdFx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBhZC1haXItMi1zaWx2ZXJcIlxuXHRcdFx0XHRGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgPSBcImZ1bGxzY3JlZW5cIlxuXG5cdFx0IyBpUGFkXG5cdFx0d2hlbiAyMDQ4XG5cblx0XHRcdCMgaVBhZCBQcm8gaW4gcG9ydHJhaXRcblx0XHRcdGlmIGlubmVySGVpZ2h0ID09IDI3MzJcblx0XHRcdFx0ZGV2aWNlID0gXCJhcHBsZS1pcGFkLXByby1zaWx2ZXJcIlxuXG5cdFx0XHQjIGlQYWQgaW4gbGFuZHNjY2FwZVxuXHRcdFx0aWYgaW5uZXJIZWlnaHQgPT0gMTUzNlxuXHRcdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwYWQtYWlyLTItc2lsdmVyXCJcblx0XHRcdEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSA9IFwiZnVsbHNjcmVlblwiXG5cblx0XHQjIGlQYWQgUHJvXG5cdFx0d2hlbiAyNzMyXG5cdFx0XHRpZiBpbm5lckhlaWdodCA9PSAyMDQ4XG5cdFx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBhZC1wcm8tc2lsdmVyXCJcblx0XHRcdFx0RnJhbWVyLkRldmljZS5kZXZpY2VUeXBlID0gXCJmdWxsc2NyZWVuXCJcblxuXHRleHBvcnRzLnNjYWxlID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLnNjYWxlXG5cblx0aWYgZGV2aWNlID09IFwiZnVsbHNjcmVlblwiXG5cdFx0ZXhwb3J0cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG5cdFx0ZXhwb3J0cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0ZWxzZVxuXHRcdGV4cG9ydHMud2lkdGggPSBmcmFtZXJEZXZpY2VzW2RldmljZV0ud2lkdGhcblx0XHRleHBvcnRzLmhlaWdodCA9IGZyYW1lckRldmljZXNbZGV2aWNlXS5oZWlnaHRcblx0XHRpZiB3aW5kb3cuaW5uZXJXaWR0aCA9PSAxMjQyIHx8IHdpbmRvdy5pbm5lcldpZHRoID09IDIyMDhcblx0XHRcdGV4cG9ydHMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuXHRcdFx0ZXhwb3J0cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHRcdGV4cG9ydHMuc2NhbGUgPSAzXG5cdGV4cG9ydHMubW9iaWxlID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLm1vYmlsZVxuXHRleHBvcnRzLnBsYXRmb3JtID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLnBsYXRmb3JtXG5cdGV4cG9ydHMub3JpZW50YXRpb24gPSAgRnJhbWVyLkRldmljZS5vcmllbnRhdGlvblxuXG5cdCMgRGV2aWNlIFN0cmluZyBTY3J1YmJlclxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcImFwcGxlLVwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1nb2xkXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWdyZWVuXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWJsdWVcIiwgXCJcIilcblx0ZGV2aWNlID0gZGV2aWNlLnJlcGxhY2UoXCItcmVkXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXdoaXRlXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXllbGxvd1wiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1waW5rXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXNwYWNlLWdyZXlcIiwgXCJcIilcblx0ZGV2aWNlID0gZGV2aWNlLnJlcGxhY2UoXCItcm9zZVwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIjVzXCIsIFwiNVwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIjVjXCIsIFwiNVwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1taW5pXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWFpclwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi0yXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLTRcIiwgXCJcIilcblx0ZXhwb3J0cy5kZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1zaWx2ZXJcIiwgXCJcIilcblx0XG5cdCMgZXhwb3J0cy5kZXZpY2UgYmVjb21lcyBlaXRoZXIgaXBhZCwgaXBhZC1wcm8sIGlwaG9uZS01LCBpcGhvbmUtNnMsIGlwaG9uZS02cy1wbHVzXG5cblx0c2NyZWVuID0ge1xuXHRcdHdpZHRoOmV4cG9ydHMud2lkdGhcblx0XHRoZWlnaHQ6ZXhwb3J0cy5oZWlnaHRcblx0fVxuXG5leHBvcnRzLm9yaWVudCA9ICgpIC0+XG5cdGlmIGV4cG9ydHMub3JpZW50YXRpb24gPT0gLTkwXG5cdFx0dGVtcEhlaWdodCA9IGV4cG9ydHMuaGVpZ2h0XG5cdFx0dGVtcFdpZHRoID0gZXhwb3J0cy53aWR0aFxuXHRcdGV4cG9ydHMuaGVpZ2h0ID0gdGVtcFdpZHRoXG5cdFx0ZXhwb3J0cy53aWR0aCA9IHRlbXBIZWlnaHRcblxuZXhwb3J0cy5nZXREZXZpY2UoKVxuZXhwb3J0cy5vcmllbnQoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiAsIG9uUmVzaXplKVxuXG4jIExpc3RlbiB0byB3aW5kb3cgcmVpemVcblxub25SZXNpemUgPSAoKSAtPlxuXHRleHBvcnRzLmdldERldmljZSgpXG5cdGV4cG9ydHMubGF5b3V0KClcblxuIyBTdXBwb3J0aW5nIEZ1bmN0aW9uc1xuXG4jIyBDb252ZXJ0cyBweCB0byBwdFxuZXhwb3J0cy5wdCA9IChweCkgLT5cblx0cHQgPSBweC9leHBvcnRzLnNjYWxlXG5cdHB0ID0gTWF0aC5yb3VuZChwdClcblx0cmV0dXJuIHB0XG5cbiMjIENvbnZlcnRzIHB0IHRvIHB4XG5leHBvcnRzLnB4ID0gKHB0KSAtPlxuXHRweCA9IHB0ICogZXhwb3J0cy5zY2FsZVxuXHRweCA9IE1hdGgucm91bmQocHgpXG5cdHJldHVybiBweFxuXG4jIENsZWFucyBhIHN0cmluZyBvZiA8YnI+IGFuZCAmbmJzcDtcbmV4cG9ydHMuY2xlYW4gPSAoc3RyaW5nKSAtPlxuXHQjIyByZW1vdmUgd2hpdGUgc3BhY2Vcblx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1smXW5ic3BbO10vZ2ksIFwiIFwiKS5yZXBsYWNlKC9bPF1icls+XS9naSwgXCJcIilcblx0cmV0dXJuIHN0cmluZ1xuXG4jIENvbnZlcnRzIHB4J3Mgb2YgYW4gU1ZHIHRvIHNjYWxhYmxlIHZhcmlhYmxlc1xuZXhwb3J0cy5zdmcgPSAoc3ZnKSAtPlxuXHQjIEZpbmQgU3RyaW5nXG5cdHN0YXJ0SW5kZXggPSBzdmcuc2VhcmNoKFwiPHN2ZyB3aWR0aD1cIikgXG5cdGVuZEluZGV4ID0gc3ZnLnNlYXJjaChcIiB2aWV3Qm94XCIpXG5cdHN0cmluZyA9IHN2Zy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcblxuXHQjRmluZCB3aWR0aFxuXHR3U3RhcnRJbmRleCA9IHN0cmluZy5zZWFyY2goXCI9XCIpICsgMlxuXHR3RW5kSW5kZXggPSAgc3RyaW5nLnNlYXJjaChcInB4XCIpXG5cdHdpZHRoID0gc3RyaW5nLnNsaWNlKHdTdGFydEluZGV4LCB3RW5kSW5kZXgpXG5cdG5ld1dpZHRoID0gZXhwb3J0cy5weCh3aWR0aClcblxuXHQjIEZpbmQgSGVpZ2h0XG5cdGhlaWdodFN0cmluZyA9IHN0cmluZy5zbGljZSh3RW5kSW5kZXggKyA0LCBzdHJpbmcubGVuZ3RoKVxuXHRoU3RhcnRJbmRleCA9IGhlaWdodFN0cmluZy5zZWFyY2goXCI9XCIpKyAyXG5cdGhFbmRJbmRleCA9IGhlaWdodFN0cmluZy5zZWFyY2goXCJweFwiKSBcblx0aGVpZ2h0ID0gaGVpZ2h0U3RyaW5nLnNsaWNlKGhTdGFydEluZGV4LCBoRW5kSW5kZXgpXG5cdG5ld0hlaWdodCA9IGV4cG9ydHMucHgoaGVpZ2h0KVxuXG5cdCNDcmVhdGUgbmV3IHN0cmluZ1xuXHRuZXdTdHJpbmcgPSBzdHJpbmcucmVwbGFjZSh3aWR0aCwgbmV3V2lkdGgpXG5cdG5ld1N0cmluZyA9IG5ld1N0cmluZy5yZXBsYWNlKGhlaWdodCwgbmV3SGVpZ2h0KVxuXG5cdCNSZXBsYWNlIHN0cmluZ3Ncblx0c3ZnID0gc3ZnLnJlcGxhY2Uoc3RyaW5nLCBuZXdTdHJpbmcpXG5cblx0cmV0dXJuIHtcblx0XHRzdmc6c3ZnXG5cdFx0d2lkdGg6bmV3V2lkdGhcblx0XHRoZWlnaHQ6bmV3SGVpZ2h0XG5cdH1cblxuIyBDaGFuZ2VzIHRoZSBmaWxsIG9mIGFuIFNWR1xuZXhwb3J0cy5jaGFuZ2VGaWxsID0gKGxheWVyLCBjb2xvcikgLT5cblx0c3RhcnRJbmRleCA9IGxheWVyLmh0bWwuc2VhcmNoKFwiZmlsbD1cXFwiI1wiKVxuXHRmaWxsU3RyaW5nID0gbGF5ZXIuaHRtbC5zbGljZShzdGFydEluZGV4LCBsYXllci5odG1sLmxlbmd0aClcblx0ZW5kSW5kZXggPSBmaWxsU3RyaW5nLnNlYXJjaChcIlxcXCI+XCIpXG5cdHN0cmluZyA9IGZpbGxTdHJpbmcuc2xpY2UoMCwgZW5kSW5kZXgpXG5cdG5ld1N0cmluZyA9IFwiZmlsbD1cXFwiXCIgKyBleHBvcnRzLmNvbG9yKGNvbG9yKS50b0hleFN0cmluZygpXG5cdGxheWVyLmh0bWwgPSBsYXllci5odG1sLnJlcGxhY2Uoc3RyaW5nLCBuZXdTdHJpbmcpXG5cbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IChzdHJpbmcpIC0+XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcblxuIyBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWVcbmV4cG9ydHMuZ2V0VGltZSA9IC0+XG5cdGRheXNPZlRoZVdlZWsgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXVxuXHRtb250aHNPZlRoZVllYXIgPSBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXVxuXHRkYXRlT2JqID0gbmV3IERhdGUoKVxuXHRtb250aCA9IG1vbnRoc09mVGhlWWVhcltkYXRlT2JqLmdldE1vbnRoKCldXG5cdGRhdGUgPSBkYXRlT2JqLmdldERhdGUoKVxuXHRkYXkgPSBkYXlzT2ZUaGVXZWVrW2RhdGVPYmouZ2V0RGF5KCldXG5cdGhvdXJzID0gZGF0ZU9iai5nZXRIb3VycygpXG5cdG1pbnMgPSBkYXRlT2JqLmdldE1pbnV0ZXMoKVxuXHRzZWNzID0gZGF0ZU9iai5nZXRTZWNvbmRzKClcblx0cmV0dXJuIHtcblx0XHRtb250aDptb250aFxuXHRcdGRhdGU6ZGF0ZVxuXHRcdGRheTpkYXlcblx0XHRob3Vyczpob3Vyc1xuXHRcdG1pbnM6bWluc1xuXHRcdHNlY3M6c2Vjc1xuXHR9XG5cbiMjIGlPUyBDb2xvciDigJMgVGhpcyB3aWxsIHN0b3JlIGFsbCBvZiB0aGUgZGVmYXVsdCBpT1MgY29sb3JzIGludGVhZCBvZiB0aGUgZGVmYXVsdCBDU1MgY29sb3JzLiAqVGhpcyBpcyBvbmx5IHVwIGhlcmUgYmVjYXVzZSBJIHJlZmVyIHRvIGl0IGluIHRoZSBkZWZhdWx0cy4qXG5leHBvcnRzLmNvbG9yID0gKGNvbG9yU3RyaW5nKSAtPlxuXHRjb2xvciA9IFwiXCJcblx0aWYgdHlwZW9mIGNvbG9yU3RyaW5nID09IFwic3RyaW5nXCJcblx0XHRjb2xvclN0cmluZyA9IGNvbG9yU3RyaW5nLnRvTG93ZXJDYXNlKClcblx0c3dpdGNoIGNvbG9yU3RyaW5nXG5cdFx0d2hlbiBcInJlZFwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiNGRTM4MjRcIilcblx0XHR3aGVuIFwiYmx1ZVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiMwMDc2RkZcIilcblx0XHR3aGVuIFwicGlua1wiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiNGRTI4NTFcIilcblx0XHR3aGVuIFwiZ3JleVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5MjkyOTJcIilcblx0XHR3aGVuIFwiZ3JheVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5MjkyOTJcIilcblx0XHR3aGVuIFwiYmxhY2tcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjMDMwMzAzXCIpXG5cdFx0d2hlbiBcIndoaXRlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiI0VGRUZGNFwiKVxuXHRcdHdoZW4gXCJvcmFuZ2VcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjRkY5NjAwXCIpXG5cdFx0d2hlbiBcImdyZWVuXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzQ0REI1RVwiKVxuXHRcdHdoZW4gXCJsaWdodCBibHVlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzU0QzdGQ1wiKVxuXHRcdHdoZW4gXCJsaWdodC1ibHVlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzU0QzdGQ1wiKVxuXHRcdHdoZW4gXCJ5ZWxsb3dcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjRkZDRDAwXCIpXG5cdFx0d2hlbiBcImxpZ2h0IGtleVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5REE3QjNcIilcblx0XHR3aGVuIFwibGlnaHQta2V5XCIgXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5REE3QjNcIilcblx0XHRlbHNlIFxuXHRcdFx0aWYgY29sb3JTdHJpbmdbMF0gPT0gXCIjXCIgfHwgY29sb3JTdHJpbmcudG9IZXhTdHJpbmcoKVswXSA9PSBcIiNcIlxuXHRcdFx0XHRjb2xvciA9IG5ldyBDb2xvcihjb2xvclN0cmluZylcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjOTI5MjkyXCIpXG5cdHJldHVybiBjb2xvclxuXG4jIyBEZWZhdWx0cyBmb3IgZXZlcnl0aGluZ1xuZGVmYXVsdHMgPSB7XG5cdGFuaW1hdGlvbnM6IHtcblx0XHR0YXJnZXQ6dW5kZWZpbmVkXG5cdFx0Y29uc3RyYWludHM6IHVuZGVmaW5lZFxuXHRcdGN1cnZlIDogXCJlYXNlLWluLW91dFwiXG5cdFx0Y3VydmVPcHRpb25zOiB1bmRlZmluZWRcblx0XHR0aW1lOjFcblx0XHRkZWxheTowXG5cdFx0cmVwZWF0OnVuZGVmaW5lZFxuXHRcdGNvbG9yTW9kZWw6dW5kZWZpbmVkXG5cdFx0c3RhZ2dlcjp1bmRlZmluZWRcblx0XHRmYWRlT3V0OmZhbHNlXG5cdFx0ZmFkZUluOmZhbHNlXG5cdH1cblx0YWxlcnQ6IHtcblx0XHR0aXRsZTogXCJUaXRsZVwiXG5cdFx0bWVzc2FnZTpcIk1lc3NhZ2VcIlxuXHRcdGFjdGlvbnM6W1wiT0tcIl1cblx0XHRhY3Rpb246XCJBY3Rpb25cIlxuXHRcdHNlY29uZGFyeUFjdGlvbjogXCJzZWNvbmRhcnlBY3Rpb25cIlxuXHR9XG5cdGJhbm5lcjoge1xuXHRcdHRpdGxlOiBcIlRpdGxlXCJcblx0XHRtZXNzYWdlOlwiTWVzc2FnZVwiXG5cdFx0YWN0aW9uOlwiQWN0aW9uXCJcblx0XHR0aW1lOlwibm93XCJcblx0XHRpY29uOnVuZGVmaW5lZFxuXHRcdGR1cmF0aW9uOjdcblx0XHRhbmltYXRlZDpmYWxzZVxuXHR9XG5cdGJ1dHRvbjp7XG5cdFx0dGV4dDpcInRleHRcIlxuXHRcdHR5cGU6XCJidXR0b25cIlxuXHRcdGJ1dHRvblR5cGU6XCJ0ZXh0XCJcblx0XHRzdHlsZTpcImxpZ2h0XCJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XCJ3aGl0ZVwiXG5cdFx0Y29sb3I6XCIjMDA3QUZGXCJcblx0XHRmb250U2l6ZToxN1xuXHRcdGZvbnRXZWlnaHQ6XCJyZWd1bGFyXCJcblx0XHRuYW1lOlwiYnV0dG9uXCJcblx0XHRibHVyOnRydWVcblx0XHRzdXBlckxheWVyOnVuZGVmaW5lZFxuXHRcdGNvbnN0cmFpbnRzOnVuZGVmaW5lZFxuXHR9XG5cdGZyYW1lclByb3BzIDpbXCJuYW1lXCIsIFwid2lkdGhcIiwgXCJoZWlnaHRcIiwgXCJzdXBlckxheWVyXCIsIFwib3BhY2l0eVwiLCBcImNvbG9yXCIsIFwiYmFja2dyb3VuZENvbG9yXCIsIFwieFwiLCBcInlcIiwgXCJtaWRYXCIsIFwibWlkWVwiLCBcIm1heFhcIiwgXCJtaW5YXCIsIFwidmlzaWJsZVwiLCBcImNsaXBcIiwgXCJzY3JvbGxIb3Jpem9udGFsXCIsIFwic2Nyb2xsVmVydGljYWxcIiwgXCJpZ25vcmVFdmVudHNcIiwgXCJ6XCIsIFwic2NhbGVYXCIsIFwic2NhbGVZXCIsIFwic2NhbGVaXCIsIFwic2NhbGVcIiwgXCJza2V3WFwiLCBcInNrZXdZXCIsIFwic2tld1wiLCBcIm9yaWdpblhcIiwgXCJvcmlnaW5ZXCIsIFwib3JpZ2luWlwiLCBcInBlcnNwZWN0aXZlXCIsIFwicGVyc3BlY3RpdmVPcmlnaW5YXCIsIFwicGVyc3BlY3RpdmVPcmlnaW5ZXCIsIFwicm90YXRpb25YXCIsIFwicm90YXRpb25ZXCIsIFwicm90YXRpb25aXCIsIFwicm90YXRpb25cIiwgXCJibHVyXCIsIFwiYnJpZ2h0bmVzc1wiLCBcInNhdHVyYXRlXCIsIFwiaHVlUm90YXRlXCIsIFwiY29udHJhc3RcIiwgXCJpbnZlcnRcIiwgXCJncmF5c2NhbGVcIiwgXCJzZXBpYVwiLCBcInNoYWRvd1hcIiwgXCJzaGFkb3dZXCIsIFwic2hhZG93Qmx1clwiLCBcInNoYWRvd1NwcmVhZFwiLCBcInNoYWRvd0NvbG9yXCIsIFwiYm9yZGVyQ29sb3JcIiwgXCJib3JkZXJXaWR0aFwiLCBcImZvcmNlMmRcIiwgXCJmbGF0XCIsIFwiYmFja2ZhY2VWaXNpYmxlXCIsIFwibmFtZVwiLCBcIm1hdHJpeFwiLCBcIl9tYXRyaXgyZFwiLCBcInRyYW5zZm9ybU1hdHJpeFwiLCBcIm1hdHJpeDNkXCIsIFwiYm9yZGVyUmFkaXVzXCIsIFwicG9pbnRcIiwgXCJzaXplXCIsIFwiZnJhbWVcIiwgXCJodG1sXCIsIFwiaW1hZ2VcIiwgXCJzY3JvbGxYXCIsIFwic2Nyb2xsWVwiLCBcIl9kb21FdmVudE1hbmFnZXJcIiwgXCJtb3VzZVdoZWVsU3BlZWRNdWx0aXBsaWVyXCIsIFwidmVsb2NpdHlUaHJlc2hvbGRcIiwgXCJhbmltYXRpb25PcHRpb25zXCIsIFwiY29uc3RyYWluZWRcIl1cblx0Y3NzUHJvcHMgOiBbXCJmb250RmFtaWx5XCIsIFwiZm9udFNpemVcIiwgXCJ0ZXh0QWxpZ25cIiwgXCJmb250V2VpZ2h0XCIsIFwibGluZUhlaWdodFwiXVxuXHRzdHlsZVByb3BzOiBbXCJmb250RmFtaWx5XCIsIFwiZm9udFNpemVcIiwgXCJ0ZXh0QWxpZ25cIiwgXCJmb250V2VpZ2h0XCIsIFwibGluZUhlaWdodFwiXVxuXHRjb25zdHJhaW50UHJvcHMgOiBbXCJoZWlnaHRcIiwgXCJ3aWR0aFwiXVxuXHRjb25zdHJhaW50VHlwZXM6IFtcInRvcFwiLCBcImxlYWRpbmdcIiwgXCJ0cmFpbGluZ1wiLCBcImJvdHRvbVwiXVxuXHRjb25zdHJhaW50QWxpZ25zIDogW1wiaG9yaXpvbnRhbENlbnRlclwiLCBcInZlcnRpY2FsQ2VudGVyXCIsIFwibGVhZGluZ0VkZ2VzXCIsIFwidHJhaWxpbmdFZGdlc1wiLCBcInRvcEVkZ2VzXCIsIFwiYm90dG9tRWRnZXNcIiwgXCJhbGlnblwiLCBcInZlcnRpY2FsXCIsIFwiaG9yaXpvbnRhbFwiXVxuXHRjb25zdHJhaW50czoge1xuXHRcdHRvcDoge1xuXHRcdFx0XCJwcm9wXCIgOiBcInlcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcIm1heFlcIlxuXHRcdFx0XCJvYmpQcm9wMlwiIDogXCJoZWlnaHRcIlxuXHRcdFx0XCJvcHBcIiA6IFwiYm90dG9tXCJcblx0XHR9XG5cdFx0bGVhZGluZzoge1xuXHRcdFx0XCJwcm9wXCIgOiBcInhcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcIm1heFhcIlxuXHRcdFx0XCJvYmpQcm9wMlwiIDogXCJ3aWR0aFwiXG5cdFx0XHRcIm9wcFwiIDogXCJ0cmFpbGluZ1wiXG5cdFx0fVxuXHRcdGJvdHRvbToge1xuXHRcdFx0XCJwcm9wXCIgOiBcIm1heFlcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcImhlaWdodFwiXG5cdFx0XHRcIm9ialByb3AyXCIgOiBcInlcIlxuXHRcdFx0XCJvcHBcIiA6IFwidG9wXCJcblx0XHR9XG5cdFx0dHJhaWxpbmc6IHtcblx0XHRcdFwicHJvcFwiIDogXCJtYXhYXCJcblx0XHRcdFwib2JqUHJvcFwiIDogXCJ3aWR0aFwiXG5cdFx0XHRcIm9ialByb3AyXCIgOiBcInhcIlxuXHRcdFx0XCJvcHBcIiA6IFwibGVhZGluZ1wiXG5cdFx0fVxuXHR9XG5cdGN1cnNvcjp7XG5cdFx0Y29sb3I6XCJibHVlXCJcblx0XHRoZWlnaHQ6MjBcblx0XHR3aWR0aDoxXG5cdH1cblx0ZmllbGQ6IHtcblx0XHRpc0VkaXRpbmc6ZmFsc2Vcblx0XHRjdXJzb3I6e31cblx0XHRib3JkZXJSYWRpdXM6NVxuXHRcdGJvcmRlcldpZHRoOjBcblx0XHRib3JkZXJDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRjb2xvcjpcIiMwOTA5MDhcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcIiNGRkZcIlxuXHRcdHJldHVyblRleHQ6XCJyZXR1cm5cIlxuXHRcdHJldHVybkNvbG9yOlwibGlnaHQta2V5XCJcblx0XHRzdHlsZTpcImxpZ2h0XCJcblx0XHR0eXBlOlwiZmllbGRcIlxuXHRcdGNvbnN0cmFpbnRzOnVuZGVmaW5lZFxuXHRcdHN1cGVyTGF5ZXI6dW5kZWZpbmVkXG5cdFx0d2lkdGg6MjU4XG5cdFx0aGVpZ2h0OjMwXG5cdFx0Zm9udFNpemU6MTVcblx0XHRmb250V2VpZ2h0OlwicmVndWxhclwiXG5cdFx0cGxhY2Vob2xkZXJUZXh0OlwicGxhY2Vob2xkZXJUZXh0XCJcblx0XHRwbGFjZWhvbGRlckNvbG9yOlwiIzgwODA4MFwiXG5cdFx0dGV4dDpcIlwiXG5cdFx0dGV4dENvbnN0cmFpbnRzOnthbGlnbjpcInZlcnRpY2FsXCIsIGxlYWRpbmc6OH1cblx0XHRpbnB1dDp0cnVlXG5cblx0fVxuXHRsb2NrU2NyZWVuOiB7XG5cdFx0dGltZTpcImRlZmF1bHRcIlxuXHRcdGRhdGU6XCJkZWZhdWx0XCJcblx0XHRwYXNzY29kZTpmYWxzZVxuXHRcdGNsb2NrMjQ6ZmFsc2Vcblx0XHR0eXBlOlwibG9ja1NjcmVlblwiXG5cdH1cblx0a2V5Ym9hcmQ6IHtcblx0XHRyZXR1cm5UZXh0OlwicmV0dXJuXCJcblx0XHRyZXR1cm5Db2xvcjpcImxpZ2h0LWtleVwiXG5cdFx0YW5pbWF0ZWQ6ZmFsc2Vcblx0XHRvdXRwdXQ6dW5kZWZpbmVkXG5cdH1cblx0c2hlZXQ6IHtcblx0XHRhY3Rpb25zOltcIk9LXCJdXG5cdFx0ZXhpdDpcIkNhbmNlbFwiXG5cdFx0YW5pbWF0ZWQ6ZmFsc2Vcblx0XHRkZXNjcmlwdGlvbjp1bmRlZmluZWRcblx0fVxuXHRuYXZCYXI6IHtcblx0XHR0aXRsZTpcIlRpdGxlXCJcblx0XHRsZWZ0OnVuZGVmaW5lZFxuXHRcdHJpZ2h0OlwiRWRpdFwiXG5cdFx0Ymx1cjp0cnVlXG5cdFx0c3VwZXJMYXllcjp1bmRlZmluZWRcblx0XHR0eXBlOlwibmF2QmFyXCJcblx0fVxuXHRzdGF0dXNCYXI6IHtcblx0XHRjYXJyaWVyOlwiXCJcblx0XHRuZXR3b3JrOlwiTFRFXCJcblx0XHRiYXR0ZXJ5OjEwMFxuXHRcdHNpZ25hbDo1XG5cdFx0c3R5bGU6XCJkYXJrXCJcblx0XHRjbG9jazI0OmZhbHNlXG5cdFx0dHlwZTpcInN0YXR1c0JhclwiXG5cdH1cblx0dGFiQmFyIDoge1xuXHRcdHRhYnM6IFtdXG5cdFx0c3RhcnQ6MFxuXHRcdHR5cGU6XCJ0YWJCYXJcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRhY3RpdmVDb2xvcjpcImJsdWVcIlxuXHRcdGluYWN0aXZlQ29sb3I6XCJncmF5XCJcblx0XHRibHVyOnRydWVcblx0fVxuXHR0YWIgOiB7XG5cdFx0bGFiZWw6IFwibGFiZWxcIlxuXHRcdGljb246XCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JzI1cHgnIGhlaWdodD0nMjVweCcgdmlld0JveD0nMCAwIDI1IDI1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNi4xICgyNjMxMykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT4xPC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScxJz5cblx0XHRcdFx0XHQ8ZyBpZD0nQm90dG9tLUJhci9UYWItQmFyJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtNy4wMDAwMDApJyBmaWxsPScjMDA3NkZGJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdQbGFjZWhvbGRlcnMnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDI1LjAwMDAwMCwgNy4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9JzEnIHg9JzAnIHk9JzAnIHdpZHRoPScyNScgaGVpZ2h0PScyNScgcng9JzMnPjwvcmVjdD5cblx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdFx0YWN0aXZlOiB1bmRlZmluZWRcblx0XHR1bmFjdGl2ZTogdW5kZWZpbmVkXG5cdFx0dGFiQmFyOiB1bmRlZmluZWRcblx0XHR0eXBlOiBcInRhYlwiXG5cdH1cblx0dGFibGUgOiB7XG5cdFx0Y29uc3RyYWludHM6IHVuZGVmaW5lZFxuXHRcdHR5cGU6XCJ0YWJsZVwiXG5cdFx0Y29udGVudDpbXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIjogXCJBXCIgXG5cdFx0XHRcdFwiZGV0YWlsXCIgOiBcImxldHRlclwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIkJcIlxuXHRcdFx0XHRcImRldGFpbFwiIDogXCJsZXR0ZXJcIlxuXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHRjZWxsOlwiZGVmYXVsdFwiXG5cdFx0c3VwZXJMYXllcjp1bmRlZmluZWRcblx0fVxuXHR0YWJsZUNlbGwgOiB7XG5cdFx0dHlwZTpcInRhYmxlQ2VsbFwiXG5cdFx0cHJvcGVydGllczogXCJkZWZhdWx0XCJcblx0XHRoZWlnaHQ6NTBcblx0XHRzd2lwZTpmYWxzZVxuXHRcdHN3aXBlQWN0aW9uOlwiRGVsZXRlXCJcblx0XHRzd2lwZUNvbG9yOlwiI0ZFMzgyNFwiXG5cdFx0c3dpcGVUZXh0Q29sb3I6XCIjRkZGXCJcblx0fVxuXG5cdHRleHQ6IHtcblx0XHR0ZXh0OiBcImlPUyBUZXh0IExheWVyXCJcblx0XHR0eXBlOlwidGV4dFwiXG5cdFx0eDowXG5cdFx0eTowXG5cdFx0d2lkdGg6LTFcblx0XHRoZWlnaHQ6LTFcblx0XHRzdXBlckxheWVyOnVuZGVmaW5lZFxuXHRcdHN0eWxlOlwiZGVmYXVsdFwiXG5cdFx0bGluZXM6MVxuXHRcdHRleHRBbGlnbjpcImxlZnRcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRjb2xvcjpcImJsYWNrXCJcblx0XHRmb250U2l6ZTogMTdcblx0XHRmb250RmFtaWx5OlwiLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0Zm9udFdlaWdodDpcInJlZ3VsYXJcIlxuXHRcdGxpbmVIZWlnaHQ6XCJhdXRvXCJcblx0XHRuYW1lOlwidGV4dCBsYXllclwiXG5cdFx0b3BhY2l0eToxXG5cdFx0dGV4dFRyYW5zZm9ybTpcIm5vbmVcIlxuXHRcdG5hbWU6XCJ0ZXh0IGxheWVyXCJcblx0XHRjb25zdHJhaW50czp7fVxuXHR9XG59XG5cblxuIyBDb21wb25lbnQgQ29uZmlndXJhdGlvbiBGdW5jdGlvbnNcbnNldFByb3BzID0gKG9iamVjdCkgLT5cblx0a2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdClcblx0b2JqZWN0W1wicHJvcHNcIl0gPSBrZXlzXG5cbmNvbXBvbmVudHMgPSBbZGVmYXVsdHMudGV4dCwgZGVmYXVsdHMuYWxlcnQsIGRlZmF1bHRzLmJhbm5lciwgZGVmYXVsdHMuc2hlZXQsIGRlZmF1bHRzLmZpZWxkLCBkZWZhdWx0cy50YWJsZSwgZGVmYXVsdHMudGFibGVDZWxsLCBkZWZhdWx0cy5rZXlib2FyZCwgZGVmYXVsdHMuYnV0dG9uLCBkZWZhdWx0cy5uYXZCYXIsIGRlZmF1bHRzLnRhYkJhciwgZGVmYXVsdHMudGFiLCBkZWZhdWx0cy5zdGF0dXNCYXIsIGRlZmF1bHRzLmxvY2tTY3JlZW5dXG5cbmZvciBjb21wIGluIGNvbXBvbmVudHNcblx0c2V0UHJvcHMoY29tcClcblxuc2V0dXBDb21wb25lbnQgPSAoY29tcG9uZW50LCBhcnJheSkgLT5cblx0aWYgYXJyYXkgPT0gdW5kZWZpbmVkXG5cdFx0YXJyYXkgPSBbXVxuXHRvYmogPSB7fVxuXHRmb3IgaSBpbiBkZWZhdWx0c1tjb21wb25lbnRdLnByb3BzXG5cdFx0aWYgYXJyYXlbaV0gIT0gdW5kZWZpbmVkXG5cdFx0XHRvYmpbaV0gPSBhcnJheVtpXVxuXHRcdGVsc2Vcblx0XHRcdG9ialtpXSA9IGRlZmF1bHRzW2NvbXBvbmVudF1baV1cblx0cmV0dXJuIG9ialxuXG4jIEVycm9yc1xuZXJyb3IgPSAoY29udGV4dCwgY29kZSkgLT5cblx0IyMgRXJyb3IgY29kZSBmcm9tIHNhbWVQYXJlbnRcblx0aWYgY29kZSA9PSAxMFxuXHRcdHByaW50IFwiRXJyb3IgSW52YWxpZCBSZWxhdGlvbnNoaXAg4oCTIExheWVyIGlkOiN7Y29udGV4dC5pZH0gaGFzIGEgcmVsYXRpb25zaGlwIHdpdGggYW5vdGhlciBsYXllciBub3QgaW4gdGhlIHNhbWUgc3VwZXJMYXllci5cIlxuXG5cdCMjIEVycm9yIGNvZGVzIGZyb20gbGF5b3V0QWxpZ24gXG5cdGlmIGNvZGUgPT0gMjBcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gcmVxdWlyZXMgYSBsYXllclwiXG5cdGlmIGNvZGUgPT0gMjFcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gY2Fubm90IHJlZmVyIHRvIGl0c2VsZlwiXG5cblx0IyMgRXJyb3IgY29kZXMgZm9yIGFwcGx5XG5cdGlmIGNvZGUgPT0gNDBcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gaXMgbm90IGEgdmFsaWQgd2VpZ2h0LiBQbGVhc2UgdXNlIDEwMCwgMjAwLCAzMDAuLi4gb3IgVGhpbiwgTGlnaHQsIFJlZ3VsYXIuLi5cIlxuXG5cdCMjIEVycm9yIGNvZGVzIGZvciBub3QgYSB2YWxpZCB0YWJcblx0aWYgY29kZSA9PSA1MFxuXHRcdHByaW50IFwiRXJyb3IgTGF5ZXIgaWQ6I3tjb250ZXh0fSBpcyBub3QgYSB2YWxpZCBUYWIgb2JqZWN0LiBQbGVhc2UgY3JlYXRlIGEgVGFiIHVzaW5nIG5ldyBtb2R1bGUuVGFiLlwiXG5cbiMgU3BlY2lhbCBDaGFyYWN0ZXJzXG5zcGVjaWFsQ2hhciA9IChsYXllcikgLT5cblx0dGV4dCA9IGxheWVyXG5cdGlmIGxheWVyLnR5cGUgPT0gXCJidXR0b25cIlxuXHRcdHRleHQgPSBsYXllci5sYWJlbFxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1iXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLWIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Zm9udFdlaWdodDo2MDB9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItclwiKSAhPSAtMVxuXHRcdG5ld1RleHQgPSB0ZXh0Lmh0bWwucmVwbGFjZShcIi1yIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fSwge2NvbG9yOlwicmVkXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItcmJcIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItcmIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJibHVlXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItbGJcIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItbGIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJsaWdodC1ibHVlXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItZ1wiKSAhPSAtMVxuXHRcdG5ld1RleHQgPSB0ZXh0Lmh0bWwucmVwbGFjZShcIi1nIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fSwge2NvbG9yOlwiZ3JlZW5cIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1vXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLW8gXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJvcmFuZ2VcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1wXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLXAgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJvcmFuZ2VcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi15XCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLXkgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJ5ZWxsb3dcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi0jXCIpICE9IC0xXG5cdFx0Y2hvc2VuQ29sb3IgPSB0ZXh0Lmh0bWwuc2xpY2UoMSwgOClcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnNsaWNlKDksIHRleHQuaHRtbC5sZW5ndGgpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6Y2hvc2VuQ29sb3J9XSlcdFxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1cIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fV0pXG5cdGlmIGxheWVyLmJ1dHRvblR5cGUgPT0gXCJ0ZXh0XCJcblx0XHRsYXllci53aWR0aCA9IHRleHQud2lkdGhcblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG4jIERlY2lkZXMgaWYgaXQgc2hvdWxkIGJlIHdoaXRlL2JsYWNrIHRleHRcbmV4cG9ydHMuc2V0VGV4dENvbG9yID0gKGNvbG9yT2JqZWN0KSAtPlxuXHRyZ2IgPSBjb2xvck9iamVjdC50b1JnYlN0cmluZygpXG5cdHJnYiA9IHJnYi5zdWJzdHJpbmcoNCwgcmdiLmxlbmd0aC0xKVxuXHRyZ2IgPSByZ2IucmVwbGFjZSgvIC9nLCAnJylcblx0cmdiID0gcmdiLnJlcGxhY2UoLyAvZywgJycpXG5cdHJnYiA9IHJnYi5zcGxpdCgnLCcpXG5cdHJlZCA9IHJnYlswXVxuXHRncmVlbiA9IHJnYlsxXVxuXHRibHVlID0gcmdiWzJdXG5cdGNvbG9yID0gXCJcIlxuXHRpZiAocmVkKjAuMjk5ICsgZ3JlZW4qMC41ODcgKyBibHVlKjAuMTE0KSA+IDE4NiBcblx0XHRjb2xvciA9IFwiIzAwMFwiXG5cdGVsc2Vcblx0XHRjb2xvciA9IFwiRkZGXCJcblx0cmV0dXJuIGNvbG9yXG5cbmV4cG9ydHMuc2FtZVBhcmVudCA9IChsYXllcjEsIGxheWVyMikgLT5cblx0cGFyZW50T25lID0gbGF5ZXIxLnN1cGVyTGF5ZXJcblx0cGFyZW50VHdvID0gbGF5ZXIyLnN1cGVyTGF5ZXJcblx0aWYgcGFyZW50T25lID09IHBhcmVudFR3b1xuXHRcdHJldHVybiB0cnVlXG5cdGVsc2UgXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuIyB1cGRhdGVDb25zdHJhaW50cyA9IChsYXllcikgLT5cbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZyA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLCAxMClcdFxuIyBcdFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcubGVuZ3RoID09IHVuZGVmaW5lZFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgPSBleHBvcnRzLnB0KGxheWVyLngpXG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgPSBbbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXSwgZXhwb3J0cy5wdChsYXllci54IC0gbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXS5tYXhYKV1cblxuIyBcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcsIDEwKVx0XG4jIFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nID0gZXhwb3J0cy5wdChsYXllci5tYXhYKVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nLmxlbmd0aCA9PSB1bmRlZmluZWRcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy50cmFpbGluZyA9IGV4cG9ydHMucHQobGF5ZXIubWF4WClcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdCNJZiBpdCdzIGEgcmVsYXRpb25zaGlwXG4jIFx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPSBbbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0sIGV4cG9ydHMucHQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0ueCAtIGxheWVyLm1heFgpXVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzLnRvcCwgMTApXHRcbiMgXHRcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRvcC5sZW5ndGggPT0gdW5kZWZpbmVkXG4jIFx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuIyBcdFx0XHRlbHNlXG4jIFx0XHRcdFx0I0lmIGl0J3MgYSByZWxhdGlvbnNoaXBcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy50b3AgPSBbbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLCBleHBvcnRzLnB0KGxheWVyLnkgLSBsYXllci5jb25zdHJhaW50cy50b3BbMF0ubWF4WSldXG5cbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b21cbiMgXHRcdCNJZiBpdCdzIGEgbnVtYmVyXG4jIFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b20gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMuYm90dG9tLCAxMClcdFxuIyBcdFx0XHRsYXllci5jb25zdHJhaW50cy5ib3R0b20gPSBleHBvcnRzLnB0KGxheWVyLm1heFkpXG4jIFx0XHRlbHNlXG4jIFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcbiMgXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYm90dG9tLmxlbmd0aCA9PSB1bmRlZmluZWRcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5ib3R0b20gPSBleHBvcnRzLnB0KGxheWVyLm1heFkpXG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSA9IFtsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF0sIGV4cG9ydHMucHQobGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzBdLnkgLSBsYXllci5tYXhZKV1cblxuIyBcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID09IFwiY2VudGVyXCJcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID0gdW5kZWZpbmVkXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuIyBcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJob3Jpem9udGFsXCJcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID0gdW5kZWZpbmVkXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJ2ZXJ0aWNhbFwiXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5hbGlnbiA9IHVuZGVmaW5lZFxuIyBcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMud2lkdGhcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLndpZHRoID0gZXhwb3J0cy5wdChsYXllci53aWR0aClcbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5oZWlnaHRcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLndpZHRoID0gZXhwb3J0cy5wdChsYXllci5oZWlnaHQpXG4gXG5leHBvcnRzLmFuaW1hdGVMYXlvdXQgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0ge31cblx0YW5pbWF0ZWRMYXllcnMgPSBbXVxuXHRpZiBhcnJheVxuXHRcdGZvciBpIGluIE9iamVjdC5rZXlzKGRlZmF1bHRzLmFuaW1hdGlvbnMpXG5cdFx0XHRpZiBhcnJheVtpXVxuXHRcdFx0XHRzZXR1cFtpXSA9IGFycmF5W2ldXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHNldHVwW2ldID0gZGVmYXVsdHMuYW5pbWF0aW9uc1tpXVxuXG5cdGlmIHNldHVwLnRhcmdldCBcblx0XHRpZiBzZXR1cC50YXJnZXQubGVuZ3RoIFxuXHRcdFx0YW5pbWF0ZWRMYXllcnMgPSBzZXR1cC50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHRhbmltYXRlZExheWVycy5wdXNoIHNldHVwLnRhcmdldFxuXHRlbHNlXG5cdFx0YW5pbWF0ZWRMYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cblx0aWYgc2V0dXAudGFyZ2V0XG5cdFx0aWYgc2V0dXAuY29uc3RyYWludHNcblx0XHRcdGZvciBuZXdDb25zdHJhaW50IGluIE9iamVjdC5rZXlzKHNldHVwLmNvbnN0cmFpbnRzKVxuXHRcdFx0XHRzZXR1cC50YXJnZXQuY29uc3RyYWludHNbbmV3Q29uc3RyYWludF0gPSBzZXR1cC5jb25zdHJhaW50c1tuZXdDb25zdHJhaW50XVxuXG5cdCNUcmFuc2xhdGUgbmV3IGNvbnN0cmFpbnRzXG5cdGZvciBsYXllciwgaW5kZXggaW4gYW5pbWF0ZWRMYXllcnNcblx0XHRpZiBsYXllci5jb25zdHJhaW50c1xuXHRcdFx0bGF5ZXIuZW5kID0ge31cblx0XHRcdHByb3BzID0ge31cblx0XHRcdGxheWVyLnN1cGVyRnJhbWUgPSB7fVxuXG5cdFx0XHRpZiBsYXllci5zdXBlckxheWVyXG5cdFx0XHRcdGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0ID0gbGF5ZXIuc3VwZXJMYXllci5oZWlnaHRcblx0XHRcdFx0bGF5ZXIuc3VwZXJGcmFtZS53aWR0aCA9IGxheWVyLnN1cGVyTGF5ZXIud2lkdGhcblx0XHRcdGVsc2Vcblx0XHRcdFx0bGF5ZXIuc3VwZXJGcmFtZS5oZWlnaHQgPSBleHBvcnRzLmhlaWdodFxuXHRcdFx0XHRsYXllci5zdXBlckZyYW1lLndpZHRoID0gZXhwb3J0cy53aWR0aFxuXHRcdFx0XG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nICE9IHVuZGVmaW5lZCAmJiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZyAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoID0ge31cdFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AgIT0gdW5kZWZpbmVkICYmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b0hlaWdodCA9IHt9XG5cblx0XHRcdCMgU2l6ZSBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMud2lkdGggIT0gdW5kZWZpbmVkXG5cdFx0XHRcdHByb3BzLndpZHRoID0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy53aWR0aClcblx0XHRcdGVsc2UgXG5cdFx0XHRcdHByb3BzLndpZHRoID0gbGF5ZXIud2lkdGhcblxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuaGVpZ2h0ICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy5oZWlnaHQgPSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLmhlaWdodClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHJvcHMuaGVpZ2h0ID0gbGF5ZXIuaGVpZ2h0XG5cblx0XHRcdCMgUG9zaXRpb25pbmcgY29uc3RyYWludHNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdCNJZiBpdCdzIGEgbnVtYmVyYFxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcsIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueCA9IGV4cG9ydHMucHgobGF5ZXIuY29uc3RyYWludHMubGVhZGluZylcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiB0aGUgbGF5ZXIgcmVmZXJlbmNlZCBoYXNuJ3QgYmVlbiBzZXRcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nWzBdLmVuZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0ZXhwb3J0cy5hbmltYXRlTGF5b3V0XG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXI6bGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLmxlbmd0aCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLmVuZC54ICsgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZy5lbmQud2lkdGhcblx0XHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nWzBdLmVuZC54ICsgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXS5lbmQud2lkdGggKyBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmdbMV0pXG5cblx0XHRcdCMgT3Bwb3NpbmcgY29uc3RyYWludHMgaGFuZGxlclxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYID0gcHJvcHMueFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZyAhPSB1bmRlZmluZWRcblx0XHRcdFx0I0lmIGl0J3MgYSBudW1iZXJcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcsIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueCA9IGxheWVyLnN1cGVyRnJhbWUud2lkdGggLSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nKSAtIHByb3BzLndpZHRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjSWYgdGhlIGxheWVyIHJlZmVyZW5jZWQgaGFzbid0IGJlZW4gc2V0XG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0uZW5kID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRleHBvcnRzLmFuaW1hdGVMYXlvdXRcblx0XHRcdFx0XHRcdFx0XHRsYXllcjpsYXllci5jb25zdHJhaW50cy50cmFpbGluZ1swXVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZy5sZW5ndGggPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcuZW5kLnggLSBwcm9wcy53aWR0aFxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgcmVsYXRpb25zaGlwXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nWzBdLmVuZC54IC0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy50cmFpbGluZ1sxXSkgLSBwcm9wcy53aWR0aFxuXG5cdFx0XHQjIE9wcG9zaW5nIGNvbnN0cmFpbnRzIGhhbmRsZXJcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmF1dG9XaWR0aCAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoLmVuZFggPSBwcm9wcy54XG5cblx0XHRcdFx0IyNwZXJmb3JtIGF1dG9zaXplXG5cdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYXG5cdFx0XHRcdHByb3BzLndpZHRoID0gbGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoLmVuZFggLSBsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYICsgcHJvcHMud2lkdGhcblxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wICE9IHVuZGVmaW5lZFxuXHRcdFx0XHQjSWYgaXQncyBhIG51bWJlclxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudG9wLCAxMClcdFxuXHRcdFx0XHRcdHByb3BzLnkgPSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRvcClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLnRvcC5lbmQueSArIGxheWVyLmNvbnN0cmFpbnRzLnRvcC5lbmQuaGVpZ2h0XG5cdFx0XHRcdFx0I0lmIGl0J3MgYSByZWxhdGlvbnNoaXBcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLmVuZC55ICsgbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLmVuZC5oZWlnaHQgKyBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRvcFsxXSlcblxuXHRcdFx0IyBPcHBvc2luZyBjb25zdHJhaW50cyBoYW5kbGVyXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0ICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LnN0YXJ0WSA9IHByb3BzLnlcblxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b20gIT0gdW5kZWZpbmVkXG5cdFx0XHRcdCNJZiBpdCdzIGEgbnVtYmVyXG5cdFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50cy5ib3R0b20sIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0IC0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy5ib3R0b20pIC0gcHJvcHMuaGVpZ2h0XG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiB0aGUgbGF5ZXIgcmVmZXJlbmNlZCBoYXNuJ3QgYmVlbiBzZXRcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF0uZW5kID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRleHBvcnRzLmFuaW1hdGVMYXlvdXRcblx0XHRcdFx0XHRcdFx0XHRsYXllcjpsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF1cblx0XHRcdFx0XHQjSWYgaXQncyBhIGxheWVyXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYm90dG9tLmxlbmd0aCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdHByb3BzLnkgPSBsYXllci5jb25zdHJhaW50cy5ib3R0b20uZW5kLnkgLSBwcm9wcy5oZWlnaHRcblx0XHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuXHRcdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzBdLmVuZC55IC0gIGV4cG9ydHMucHgobGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzFdKVxuXG5cdFx0XHQjIE9wcG9zaW5nIGNvbnN0cmFpbnRzIGhhbmRsZXJcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQuZW5kWSA9IHByb3BzLnlcblx0XHRcdFx0IyMgcGVyZm9ybSBhdXRvc2l6ZVxuXHRcdFx0XHRwcm9wcy5oZWlnaHQgPSBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LmVuZFkgLSBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LnN0YXJ0WSBcblx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQuc3RhcnRZXG5cblxuXHRcdFx0IyBBbGlnbm1lbnQgY29uc3RyYWludHNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmFsaWduICE9IHVuZGVmaW5lZFxuXHRcdFx0XHQjU2V0IHRoZSBjZW50ZXJpbmcgZnJhbWVcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJob3Jpem9udGFsXCJcblx0XHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuc3VwZXJGcmFtZS53aWR0aCAvIDIgLSBwcm9wcy53aWR0aCAvIDIgXG5cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0IC8gMiAtIHByb3BzLmhlaWdodCAvIDIgXG5cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJjZW50ZXJcIlxuXHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5zdXBlckZyYW1lLndpZHRoIC8gMiAtIHByb3BzLndpZHRoIC8gMiBcblx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuc3VwZXJGcmFtZS5oZWlnaHQgLyAyIC0gcHJvcHMuaGVpZ2h0IC8gMiBcblxuXG5cdFx0XHQjIENlbnRlcmluZyBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuaG9yaXpvbnRhbENlbnRlciAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLmhvcml6b250YWxDZW50ZXIuZW5kLnggKyAobGF5ZXIuY29uc3RyYWludHMuaG9yaXpvbnRhbENlbnRlci5lbmQud2lkdGggLSBwcm9wcy53aWR0aCkgLyAyXG5cblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnZlcnRpY2FsQ2VudGVyICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMudmVydGljYWxDZW50ZXIuZW5kLnkgKyAobGF5ZXIuY29uc3RyYWludHMudmVydGljYWxDZW50ZXIuZW5kLmhlaWdodCAtIHByb3BzLmhlaWdodCkgLyAyXG5cblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlciAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlci5lbmQueCArIChsYXllci5jb25zdHJhaW50cy5jZW50ZXIuZW5kLndpZHRoIC0gcHJvcHMud2lkdGgpIC8gMlxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuY2VudGVyLmVuZC55ICsgKGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlci5lbmQuaGVpZ2h0IC0gcHJvcHMuaGVpZ2h0KSAvIDJcblxuXHRcdFx0IyBBbGlnbmluZyBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ0VkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ0VkZ2VzLmVuZC54IFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZ0VkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdFZGdlcy5lbmQueCAtIHByb3BzLndpZHRoICsgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdFZGdlcy5lbmQud2lkdGhcblxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3BFZGdlcyAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLnRvcEVkZ2VzLmVuZC55XG5cdFx0XHRcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbUVkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuYm90dG9tRWRnZXMuZW5kLnkgLSBwcm9wcy5oZWlnaHQgKyBsYXllci5jb25zdHJhaW50cy5ib3R0b21FZGdlcy5lbmQuaGVpZ2h0IFxuXG5cdFx0XHQjVGltaW5nXG5cdFx0XHRkZWxheSA9IHNldHVwLmRlbGF5XG5cdFx0XHRpZiBzZXR1cC5zdGFnZ2VyXG5cdFx0XHRcdHN0YWcgPSBzZXR1cC5zdGFnZ2VyXG5cdFx0XHRcdGRlbGF5ID0gKChpbmRleCkgKiBzdGFnKVxuXG5cdFx0XHRpZiBzZXR1cC5mYWRlT3V0XG5cdFx0XHRcdCMgaWYgdHlwZW9mID09IFwiYm9vbGVhblwiXG5cdFx0XHRcdCMgXHRwcm9wcy5vcGFjaXR5ID0gMFxuXHRcdFx0XHRpZiBsYXllciA9PSBzZXR1cC5mYWRlT3V0XG5cdFx0XHRcdFx0cHJvcHMub3BhY2l0eSA9IDBcblxuXHRcdFx0aWYgc2V0dXAuZmFkZUluXG5cdFx0XHRcdHByb3BzLm9wYWNpdHkgPSAxXG5cblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOnByb3BzXG5cdFx0XHRcdHRpbWU6c2V0dXAudGltZVxuXHRcdFx0XHRkZWxheTpkZWxheVxuXHRcdFx0XHRjdXJ2ZTpzZXR1cC5jdXJ2ZVxuXHRcdFx0XHRyZXBlYXQ6c2V0dXAucmVwZWF0XG5cdFx0XHRcdGNvbG9yTW9kZWw6c2V0dXAuY29sb3JNb2RlbFxuXHRcdFx0XHRjdXJ2ZU9wdGlvbnM6c2V0dXAuY3VydmVPcHRpb25zXG5cblx0XHRcdGxheWVyLmVuZCA9IHByb3BzXG5cbiNSZWZyZXNoZXMgTGF5ZXIgb3IgQWxsIExheWVyc1xuZXhwb3J0cy5sYXlvdXQgPSAobGF5ZXIpIC0+XG5cdGlmIGxheWVyID09IHVuZGVmaW5lZFxuXHRcdEAuYXJyYXkgPSBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdGVsc2UgXG5cdFx0QC5hcnJheSA9IFtsYXllcl1cblx0Zm9yIGxheWVyIGluIEAuYXJyYXlcblx0XHRpZiBsYXllci5jb25zdHJhaW50c1xuXHRcdFx0Zm9yIHAgaW4gZGVmYXVsdHMuY29uc3RyYWludFByb3BzXG5cdFx0XHRcdGxheW91dFNpemUobGF5ZXIsIHApXG5cdFx0XHRmb3IgYyBpbiBkZWZhdWx0cy5jb25zdHJhaW50VHlwZXNcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbY10gIT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0bGF5b3V0Q2hhbmdlKGxheWVyLCBjKVxuXHRcdFx0Zm9yIGEgaW4gZGVmYXVsdHMuY29uc3RyYWludEFsaWduc1xuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1thXVxuXHRcdFx0XHRcdGxheW91dEFsaWduKGxheWVyLCBhKVxuXG5cdFx0XHQjVXBkYXRlcyB0aGUgY29uc3RyYWludHMgaWYgdGhlIGxheWVyIGlzIG1hbmlwdWxhdGVkIHRocm91Z2ggb3RoZXIgbWVhbnNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRMaXN0ZW5lciA9PSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludExpc3RlbmVyID0gdHJ1ZVxuXG4jQWxpZ24gY29uc3RyYWludHNcbmxheW91dEFsaWduID0gKGxheWVyLCB0eXBlKSAtPlxuXHRkZWNsYXJlZENvbnN0cmFpbnQgPSBsYXllci5jb25zdHJhaW50c1t0eXBlXVxuXHRpZiBsYXllci5zdXBlckxheWVyXG5cdFx0QHN1cGVyTGF5ZXIgPSBsYXllci5zdXBlckxheWVyXG5cdGVsc2Vcblx0XHRAc3VwZXJMYXllciA9IHNjcmVlblxuXHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gcGFyc2VJbnQoZGVjbGFyZWRDb25zdHJhaW50LCAxMClcblx0XHRlcnJvcih0eXBlLCAyMClcblx0aWYgZGVjbGFyZWRDb25zdHJhaW50ID09IGxheWVyXG5cdFx0ZXJyb3IodHlwZSwgMjEpXG5cdGlmIHR5cGVvZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJvYmplY3RcIlxuXHRcdGZvciBpIGluIGRlY2xhcmVkQ29uc3RyYWludFxuXHRcdFx0aWYgdHlwZW9mIGkgPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHRAdHlwZSA9IGlcblx0XHRcdGlmIHR5cGVvZiBpID09IFwib2JqZWN0XCJcblx0XHRcdFx0QGxheWVyID0gaSBcblx0XHRpZiBAdHlwZSA9PSBcImhvcml6b250YWxDZW50ZXJcIiB8fCBAdHlwZSA9PSBcImhvcml6b250YWxcIlxuXHRcdFx0ZGVsdGFNb3ZlID0gKEBsYXllci53aWR0aCAtIGxheWVyLndpZHRoKSAvIDJcblx0XHRcdGxheWVyLnggPSBAbGF5ZXIueCArIGRlbHRhTW92ZVxuXHRcdFx0bGF5ZXIuY29uc3RyYWludHNbXCJsZWFkaW5nXCJdID0gZXhwb3J0cy5wdChsYXllci54KVxuXHRcdGlmIEB0eXBlID09IFwidmVydGljYWxDZW50ZXJcIiB8fCBAdHlwZSA9PSBcInZlcnRpY2FsXCIgIFxuXHRcdFx0ZGVsdGFNb3ZlID0gKEBsYXllci5oZWlnaHQgLSBsYXllci5oZWlnaHQpIC8gMlxuXHRcdFx0bGF5ZXIueSA9IEBsYXllci55ICsgZGVsdGFNb3ZlXG5cdFx0XHRsYXllci5jb25zdHJhaW50c1tcInRvcFwiXSA9IGV4cG9ydHMucHQobGF5ZXIueSlcblx0XHRpZiBAdHlwZSA9PSBcImxlYWRpbmdFZGdlc1wiIHx8IEB0eXBlID09IFwibGVhZGluZ1wiXG5cdFx0XHRsYXllci54ID0gQGxheWVyLnhcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1wibGVhZGluZ1wiXSA9IGV4cG9ydHMucHQobGF5ZXIueClcblx0XHRpZiBAdHlwZSA9PSBcInRyYWlsaW5nRWRnZXNcIiB8fCBAdHlwZSA9PSBcInRyYWlsaW5nXCJcblx0XHRcdGxheWVyLm1heFggPSBAbGF5ZXIubWF4WFxuXHRcdFx0bGF5ZXIuY29uc3RyYWludHNbXCJ0cmFpbGluZ1wiXSA9IGV4cG9ydHMucHQoQHN1cGVyTGF5ZXIud2lkdGggLSBsYXllci5tYXhYKVxuXHRcdGlmIEB0eXBlID09IFwidG9wRWRnZXNcIiB8fCBAdHlwZSA9PSBcInRvcFwiXG5cdFx0XHRsYXllci55ID0gQGxheWVyLnlcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1widG9wXCJdID0gZXhwb3J0cy5wdChsYXllci55KVxuXHRcdGlmIEB0eXBlID09IFwiYm90dG9tRWRnZXNcIiB8fCBAdHlwZSA9PSBcImJvdHRvbVwiXG5cdFx0XHRsYXllci5tYXhZID0gQGxheWVyLm1heFlcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1wiYm90dG9tXCJdID0gZXhwb3J0cy5wdChAc3VwZXJMYXllci5oZWlnaHQgLSBsYXllci5tYXhZKVxuXHRpZiB0eXBlID09IFwiaG9yaXpvbnRhbENlbnRlclwiIHx8IHR5cGUgPT0gXCJob3Jpem9udGFsXCJcblx0XHRkZWx0YU1vdmUgPSAoZGVjbGFyZWRDb25zdHJhaW50LndpZHRoIC0gbGF5ZXIud2lkdGgpIC8gMlxuXHRcdGxheWVyLnggPSBkZWNsYXJlZENvbnN0cmFpbnQueCArIGRlbHRhTW92ZVxuXHRpZiB0eXBlID09IFwidmVydGljYWxDZW50ZXJcIiB8fCB0eXBlID09IFwidmVydGljYWxcIiAgXG5cdFx0ZGVsdGFNb3ZlID0gKGRlY2xhcmVkQ29uc3RyYWludC5oZWlnaHQgLSBsYXllci5oZWlnaHQpIC8gMlxuXHRcdGxheWVyLnkgPSBkZWNsYXJlZENvbnN0cmFpbnQueSArIGRlbHRhTW92ZVxuXHRpZiB0eXBlID09IFwibGVhZGluZ0VkZ2VzXCIgXG5cdFx0bGF5ZXIueCA9IGRlY2xhcmVkQ29uc3RyYWludC54XG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJsZWFkaW5nXCJdID0gZXhwb3J0cy5wdChkZWNsYXJlZENvbnN0cmFpbnQueClcblx0aWYgdHlwZSA9PSBcInRyYWlsaW5nRWRnZXNcIlxuXHRcdGxheWVyLm1heFggPSBkZWNsYXJlZENvbnN0cmFpbnQubWF4WFxuXHRcdGxheWVyLmNvbnN0cmFpbnRzW1widHJhaWxpbmdcIl0gPSBleHBvcnRzLnB0KEBzdXBlckxheWVyLmhlaWdodCAtIGxheWVyLm1heFgpXG5cdGlmIHR5cGUgPT0gXCJ0b3BFZGdlc1wiXG5cdFx0bGF5ZXIueSA9IGRlY2xhcmVkQ29uc3RyYWludC55XG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJ0b3BcIl0gPSBleHBvcnRzLnB0KGxheWVyLnkpXG5cdGlmIHR5cGUgPT0gXCJib3R0b21FZGdlc1wiXG5cdFx0bGF5ZXIubWF4WSA9IGRlY2xhcmVkQ29uc3RyYWludC5tYXhZXG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJib3R0b21cIl0gPSBleHBvcnRzLnB0KEBzdXBlckxheWVyLmhlaWdodCAtIGxheWVyLm1heFkpXG5cdGlmIHR5cGUgPT0gXCJhbGlnblwiXG5cdFx0aWYgZGVjbGFyZWRDb25zdHJhaW50ID09IFwiaG9yaXpvbnRhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJYKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJZKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJjZW50ZXJcIlxuXHRcdFx0bGF5ZXIuY2VudGVyKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJZKClcblxuXG5cbiNTaXplIENvbnN0cmFpbnRzXG5sYXlvdXRTaXplID0gKGxheWVyLCB0eXBlKSAtPlxuXHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXVxuXHRcdGxheWVyW3R5cGVdID0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50c1t0eXBlXSlcblx0XHRpZiBsYXllci50eXBlID09IFwidGV4dFwiXG5cdFx0XHR0ZXh0RnJhbWUgPSB0ZXh0QXV0b1NpemUobGF5ZXIpXG5cdFx0XHRsYXllci53aWR0aCA9IHRleHRGcmFtZS53aWR0aFxuXHRcdFx0bGF5ZXIuaGVpZ2h0ID0gdGV4dEZyYW1lLmhlaWdodFxuXG4jTW92ZSAmIFJlc2l6ZXMgTGF5ZXJzXG5sYXlvdXRDaGFuZ2UgPSAobGF5ZXIsIHR5cGUpIC0+XG5cdGlmIGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdICE9IHVuZGVmaW5lZCBcblx0XHRwcm9wID0gZGVmYXVsdHMuY29uc3RyYWludHNbdHlwZV0ucHJvcFxuXHRcdG9ialByb3AgPSBkZWZhdWx0cy5jb25zdHJhaW50c1t0eXBlXS5vYmpQcm9wXG5cdFx0b3BwID0gZGVmYXVsdHMuY29uc3RyYWludHNbdHlwZV0ub3BwXG5cdFx0c3VwZXJUcmFpdCA9IGRlZmF1bHRzLmNvbnN0cmFpbnRzW3R5cGVdLm9ialByb3BcblxuXHRcdGlmIG9ialByb3AgIT0gXCJ3aWR0aFwiICYmIG9ialByb3AgIT0gXCJoZWlnaHRcIlxuXHRcdFx0c3VwZXJUcmFpdCA9IGRlZmF1bHRzLmNvbnN0cmFpbnRzW3R5cGVdLm9ialByb3AyXG5cblx0XHRpZiBsYXllci5zdXBlckxheWVyICE9IG51bGxcblx0XHRcdCNIYXMgYSBzdXBlckxheWVyXG5cdFx0XHRAW3N1cGVyVHJhaXRdID0gbGF5ZXIuc3VwZXJMYXllcltzdXBlclRyYWl0XVxuXHRcdGVsc2Vcblx0XHRcdCNEb2VzIG5vdCBoYXZlIGEgc3VwZXJMYXllclxuXHRcdFx0QFtzdXBlclRyYWl0XSA9IGV4cG9ydHNbc3VwZXJUcmFpdF1cblx0XHRpZiB0eXBlID09IFwidG9wXCIgfHwgdHlwZSA9PSBcImxlYWRpbmdcIlxuXHRcdFx0IyBIYW5kbGUgVG9wICYgTGVhZGluZ1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV0sIDEwKVxuXHRcdFx0XHRsYXllcltwcm9wXSA9IGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdICogZXhwb3J0cy5zY2FsZVxuXHRcdFx0ZWxzZSBcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bb2JqUHJvcF1cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IDFcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSwgMTApXG5cdFx0XHRcdFx0XHRsYXllcltwcm9wXSA9IGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdWzBdICogZXhwb3J0cy5zY2FsZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF1bb2JqUHJvcF1cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID4gMSBcblx0XHRcdFx0XHRmb3Igb2JqZWN0IGluIGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3QgPT0gcGFyc2VJbnQob2JqZWN0LCAxMClcblx0XHRcdFx0XHRcdFx0QC5vYmpJbnQgPSBvYmplY3Rcblx0XHRcdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0XHRcdEAub2JqTGF5ZXIgPSBvYmplY3Rcblx0XHRcdFx0XHRsYXllcltwcm9wXSA9IChALm9iakludCAqIGV4cG9ydHMuc2NhbGUpICsgQC5vYmpMYXllcltvYmpQcm9wXVxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXSAhPSB1bmRlZmluZWRcblx0XHRcdFx0dHJhaXQgPSBkZWZhdWx0cy5jb25zdHJhaW50c1tvcHBdW1wib2JqUHJvcFwiXVxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1tvcHBdID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzW29wcF0sIDEwKVxuXHRcdFx0XHRcdGxheWVyW3RyYWl0XSA9IEBbc3VwZXJUcmFpdF0gLSAobGF5ZXJbcHJvcF0gKyAoZXhwb3J0cy5zY2FsZSAqIGxheWVyLmNvbnN0cmFpbnRzW29wcF0pKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXS5sZW5ndGggPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRsYXllclt0cmFpdF0gPSBsYXllcltwcm9wXSAtIGxheWVyLmNvbnN0cmFpbnRzW29wcF1bcHJvcF1cblx0XHRcdFx0XHRcdGlmIGxheWVyW3RyYWl0XSA8IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXJbdHJhaXRdID0gbGF5ZXJbdHJhaXRdICogLTFcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGFydFggPSBsYXllci54XG5cdFx0XHRcdFx0XHRlbmRYID0gMFxuXHRcdFx0XHRcdFx0Zm9yIG9iamVjdCBpbiBsYXllci5jb25zdHJhaW50c1tvcHBdXG5cdFx0XHRcdFx0XHRcdCMgSWYgaXQncyBhIG51bWJlclxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3QgPT0gcGFyc2VJbnQob2JqZWN0LCAxMClcblx0XHRcdFx0XHRcdFx0XHRlbmRYID0gZW5kWCAtIG9iamVjdFxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZW5kVHJhaXQgPSBkZWZhdWx0cy5jb25zdHJhaW50c1tvcHBdLm9ialByb3AyXG5cdFx0XHRcdFx0XHRcdFx0ZW5kWCA9IGVuZFggKyBvYmplY3RbZW5kVHJhaXRdXG5cdFx0XHRcdFx0XHRsYXllci53aWR0aCA9IGVuZFggLSBzdGFydFhcblx0XHRcdFx0XHRcdFxuXHRcdGVsc2Vcblx0XHRcdCMjIEhhbmRsZSBCb3R0b20gJiBUcmFpbGluZ1xuXHRcdFx0b2JqUHJvcDIgPSBkZWZhdWx0cy5jb25zdHJhaW50c1t0eXBlXS5vYmpQcm9wMlxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXSA9PSB1bmRlZmluZWRcblx0XHRcdFx0IyMgTm8gb3Bwb3NpdGVcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV0sIDEwKVxuXHRcdFx0XHRcdCMjIE9ubHkgSW50ZWdlclxuXHRcdFx0XHRcdGxheWVyW3Byb3BdID0gQFtzdXBlclRyYWl0XSAtIChsYXllci5jb25zdHJhaW50c1t0eXBlXSAqIGV4cG9ydHMuc2NhbGUpXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0I0VudGVyZWQgTGF5ZXJcblx0XHRcdFx0XHRcdGlmIGV4cG9ydHMuc2FtZVBhcmVudChsYXllciwgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0pXG5cdFx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bb2JqUHJvcDJdXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGVycm9yKGxheWVyLCAxMClcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXS5sZW5ndGggPT0gMVxuXHRcdFx0XHRcdFx0I0FycmF5IG9mIE9uZVxuXHRcdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0sIDEwKVxuXHRcdFx0XHRcdFx0XHQjSW50XG5cdFx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gQFtvYmpQcm9wXSAtIChsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSAqIGV4cG9ydHMuc2NhbGUpXG5cdFx0XHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdFx0XHQjT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGlmIGV4cG9ydHMuc2FtZVBhcmVudChsYXllciwgbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0pXG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXJbcHJvcF0gPSBsYXllci5jb25zdHJhaW50c1t0eXBlXVswXVtvYmpQcm9wMl1cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGVycm9yKGxheWVyLCAxMClcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXS5sZW5ndGggPiAxXHRcblx0XHRcdFx0XHRcdCNSZWxhdGlvbnNoaXAgQXJyYXlcblx0XHRcdFx0XHRcdGZvciBvYmplY3QgaW4gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1cblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0ID09IHBhcnNlSW50KG9iamVjdCwgMTApXG5cdFx0XHRcdFx0XHRcdFx0QC5vYmpJbnQgPSBvYmplY3Rcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdEAub2JqTGF5ZXIgPSBvYmplY3Rcblx0XHRcdFx0XHRcdFx0bGF5ZXJbcHJvcF0gPSBALm9iakxheWVyW29ialByb3AyXSAtIGV4cG9ydHMuc2NhbGUgKiBALm9iakludFxuI1RleHQgTGF5ZXJzXG5leHBvcnRzLnN0eWxlcyA9IHt9XG5cbmV4cG9ydHMuYmdCbHVyID0gKGxheWVyKSAtPlxuXHRsYXllci5zdHlsZVtcIi13ZWJraXQtYmFja2Ryb3AtZmlsdGVyXCJdID0gXCJibHVyKCN7ZXhwb3J0cy5weCg1KX1weClcIlxuXHRyZXR1cm4gbGF5ZXIgXG5cbnRleHRBdXRvU2l6ZSA9ICh0ZXh0TGF5ZXIpIC0+XG5cdCNEZWZpbmUgV2lkdGhcblx0Y29uc3RyYWludHMgPSB7fVxuXHRpZiB0ZXh0TGF5ZXIuY29uc3RyYWludHMgXG5cdFx0aWYgdGV4dExheWVyLmNvbnN0cmFpbnRzLmhlaWdodFxuXHRcdFx0Y29uc3RyYWludHMuaGVpZ2h0ID0gZXhwb3J0cy5weCh0ZXh0TGF5ZXIuY29uc3RyYWludHMuaGVpZ2h0KVxuXHRcdGlmIHRleHRMYXllci5jb25zdHJhaW50cy53aWR0aFxuXHRcdFx0Y29uc3RyYWludHMud2lkdGggPSBleHBvcnRzLnB4KHRleHRMYXllci5jb25zdHJhaW50cy53aWR0aClcblx0c3R5bGVzID1cblx0XHRmb250U2l6ZTogdGV4dExheWVyLnN0eWxlW1wiZm9udC1zaXplXCJdXG5cdFx0Zm9udEZhbWlseTogdGV4dExheWVyLnN0eWxlW1wiZm9udC1mYW1pbHlcIl1cblx0XHRmb250V2VpZ2h0OiB0ZXh0TGF5ZXIuc3R5bGVbXCJmb250LXdlaWdodFwiXVxuXHRcdGxpbmVIZWlnaHQ6IHRleHRMYXllci5zdHlsZVtcImxpbmUtaGVpZ2h0XCJdXG5cdFx0bGV0dGVyU3BhY2luZzogdGV4dExheWVyLnN0eWxlW1wibGV0dGVyLXNwYWNpbmdcIl1cblx0XHR0ZXh0VHJhbnNmb3JtOiB0ZXh0TGF5ZXIuc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXVxuXHR0ZXh0V2lkdGggPSBVdGlscy50ZXh0U2l6ZSB0ZXh0TGF5ZXIuaHRtbCwgc3R5bGVzLCBjb25zdHJhaW50c1xuXHRyZXR1cm4ge1xuXHRcdHdpZHRoIDogdGV4dFdpZHRoLndpZHRoXG5cdFx0aGVpZ2h0OiB0ZXh0V2lkdGguaGVpZ2h0XG5cdH1cblxubGlzdGVuVG9LZXlzID0gKGZpZWxkLCBrZXlib2FyZCkgLT5cblxuXHRrZXlwcmVzcyA9IChrZXkpIC0+XG5cdFx0b3JpZ2luYWxDb2xvciA9IGtleS5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRzd2l0Y2gga2V5Lm5hbWVcblx0XHRcdHdoZW4gXCJzaGlmdFwiXG5cdFx0XHRcdGtleS5pY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblx0XHRcdFx0a2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0d2hlbiBcImRlbGV0ZVwiXG5cdFx0XHRcdGtleS5pY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblx0XHRcdFx0a2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0XHRrZXkuaWNvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcIm9uXCIpXG5cdFx0XHR3aGVuIFwic3BhY2VcIlxuXHRcdFx0XHRrZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSAhPSBcImlwYWRcIlxuXHRcdFx0XHRcdGtleWJvYXJkLmtleVBvcFVwLnZpc2libGUgPSB0cnVlXHRcblx0XHRcdFx0XHRib3hLZXkgPSBrZXkubmFtZVxuXHRcdFx0XHRcdGlmIGlzU2hpZnRcblx0XHRcdFx0XHRcdGJveEtleSA9IGJveEtleS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0a2V5Ym9hcmQua2V5UG9wVXAuYm94Lmh0bWwgPSBib3hLZXlcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlQb3BVcC5tYXhZID0ga2V5Lm1heFlcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlQb3BVcC5taWRYID0ga2V5Lm1pZFhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGtleS5hbmltYXRlXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHRcdHRpbWU6LjJcblxuXHRpc0NvbW1hbmQgPSBmYWxzZVxuXHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdGlzU2hpZnQgPSBmYWxzZVxuXHRjb2RlcyA9IHtcblx0XHQxMzpcIjxicj5cIlxuXHRcdDMyOlwiJm5ic3A7XCJcblx0XHQzMzpcIiFcIlxuXHRcdDM0OlwiXFxcIlwiXG5cdFx0MzU6XCIjXCJcblx0XHQzNjpcIiRcIlxuXHRcdDM3OlwiJVwiXG5cdFx0Mzg6XCImXCJcblx0XHQzOTpcIlxcJ1wiXG5cdFx0NDA6XCIoXCJcblx0XHQ0MTpcIilcIlxuXHRcdDQyOlwiKlwiXG5cdFx0NDM6XCIrXCJcblx0XHQ0NDpcIixcIlxuXHRcdDQ1OlwiLVwiXG5cdFx0NDc6XCIvXCJcblx0XHQ0NjpcIi5cIlxuXHRcdDQ4OlwiMFwiXG5cdFx0NDk6XCIxXCJcblx0XHQ1MDpcIjJcIlxuXHRcdDUxOlwiM1wiXG5cdFx0NTI6XCI0XCJcblx0XHQ1MzpcIjVcIlxuXHRcdDU0OlwiNlwiXG5cdFx0NTU6XCI3XCJcblx0XHQ1NjpcIjhcIlxuXHRcdDU3OlwiOVwiXG5cdFx0NTg6XCI6XCJcblx0XHQ1OTpcIjtcIlxuXHRcdDYwOlwiPFwiXG5cdFx0NjE6XCI9XCJcblx0XHQ2MjpcIj5cIlxuXHRcdDYzOlwiP1wiXG5cdFx0NjQ6XCJAXCJcblx0XHQ2NTpcIkFcIlxuXHRcdDY2OlwiQlwiXG5cdFx0Njc6XCJDXCJcblx0XHQ2ODpcIkRcIlxuXHRcdDY5OlwiRVwiXG5cdFx0NzA6XCJGXCJcblx0XHQ3MTpcIkdcIlxuXHRcdDcyOlwiSFwiXG5cdFx0NzM6XCJJXCJcblx0XHQ3NDpcIkpcIlxuXHRcdDc1OlwiS1wiXG5cdFx0NzY6XCJMXCJcblx0XHQ3NzpcIk1cIlxuXHRcdDc4OlwiTlwiXG5cdFx0Nzk6XCJPXCJcblx0XHQ4MDpcIlBcIlxuXHRcdDgxOlwiUVwiXG5cdFx0ODI6XCJSXCJcblx0XHQ4MzpcIlNcIlxuXHRcdDg0OlwiVFwiXG5cdFx0ODU6XCJVXCJcblx0XHQ4NjpcIlZcIlxuXHRcdDg3OlwiV1wiXG5cdFx0ODg6XCJYXCJcblx0XHQ4OTpcIllcIlxuXHRcdDkwOlwiWlwiXG5cdFx0OTE6XCJbXCJcblx0XHQ5MjpcIlxcXFxcIlxuXHRcdDkzOlwiXVwiXG5cdFx0OTQ6XCJeXCJcblx0XHQ5NTpcIl9cIlxuXHRcdDk2OlwiYFwiXG5cdFx0OTc6XCJhXCJcblx0XHQ5ODpcImJcIlxuXHRcdDk5OlwiY1wiXG5cdFx0MTAwOlwiZFwiXG5cdFx0MTAxOlwiZVwiXG5cdFx0MTAyOlwiZlwiXG5cdFx0MTAzOlwiZ1wiXG5cdFx0MTA0OlwiaFwiXG5cdFx0MTA1OlwiaVwiXG5cdFx0MTA2OlwialwiXG5cdFx0MTA3Olwia1wiXG5cdFx0MTA4OlwibFwiXG5cdFx0MTA5OlwibVwiXG5cdFx0MTEwOlwiblwiXG5cdFx0MTExOlwib1wiXG5cdFx0MTEyOlwicFwiXG5cdFx0MTEzOlwicVwiXG5cdFx0MTE0OlwiclwiXG5cdFx0MTE1Olwic1wiXG5cdFx0MTE2OlwidFwiXG5cdFx0MTE3OlwidVwiXG5cdFx0MTE4OlwidlwiXG5cdFx0MTE5Olwid1wiXG5cdFx0MTIwOlwieFwiXG5cdFx0MTIxOlwieVwiXG5cdFx0MTIyOlwielwiXG5cdFx0MTIzOlwie1wiXG5cdFx0MTI0OlwifFwiXG5cdFx0MTI1OlwifVwiXG5cdFx0MTI2OlwiflwiXG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpIC0+XG5cdFx0aWYgZmllbGQuYWN0aXZlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMjdcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOih5OmV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0XHRcdGZpZWxkLmFjdGl2ZSA9IGZhbHNlXG5cdFx0XHRcdGZpZWxkLmNsaWNrWm9uZS5kZXN0cm95KClcblx0XHRcdGlmIGUua2V5Q29kZSA9PSAxNlxuXHRcdFx0XHRpc1NoaWZ0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBrZXlib2FyZFxuXHRcdFx0XHRcdGtleXByZXNzKGtleWJvYXJkLmtleXMuc2hpZnQpXG5cdFx0XHRcdFx0Zm9yIGsgaW4ga2V5Ym9hcmQua2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrLnN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl0gPSBcInVwcGVyY2FzZVwiXG5cdFx0XHRpZiBhbGxTZWxlY3RlZCA9PSB0cnVlXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA9PSAzNyB8fCBlLmtleUNvZGUgPT0gMzlcblx0XHRcdFx0XHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZmllbGQudGV4dC5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRcdGlmIGUua2V5Q29kZSA9PSA5MVxuXHRcdFx0XHRpc0NvbW1hbmQgPSB0cnVlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMTNcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGtleWJvYXJkLmtleXMucmV0dXJuLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gOFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0aWYga2V5Ym9hcmRcblx0XHRcdFx0XHRrZXlwcmVzcyhrZXlib2FyZC5rZXlzLmRlbGV0ZSlcblx0XHRcdFx0aWYgYWxsU2VsZWN0ZWQgPT0gdHJ1ZVxuXHRcdFx0XHRcdGV4cG9ydHMudXBkYXRlKGZpZWxkLnRleHQsIFt0ZXh0OlwiXCJdKVxuXHRcdFx0XHRcdGZpZWxkLnRleHQuYmFja2dyb3VuZENvbG9yID1cInRyYW5zcGFyZW50XCJcblx0XHRcdFx0XHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdFx0XHRcdGluaXRpYWxMZW5ndGggPSBmaWVsZC50ZXh0Lmh0bWwubGVuZ3RoXG5cdFx0XHRcdG5ld1RleHQgPSBmaWVsZC50ZXh0Lmh0bWwuc2xpY2UoMCwgLTEpXG5cdFx0XHRcdGV4cG9ydHMudXBkYXRlKGZpZWxkLnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0XHRlbmRMZW5ndGggPSBmaWVsZC50ZXh0Lmh0bWwubGVuZ3RoXG5cdFx0XHRcdGlmIGluaXRpYWxMZW5ndGggPT0gZW5kTGVuZ3RoXG5cdFx0XHRcdFx0bmV3VGV4dCA9IGZpZWxkLnRleHQuaHRtbC5zbGljZSgwLCAtNilcblx0XHRcdFx0XHRleHBvcnRzLnVwZGF0ZShmaWVsZC50ZXh0LCBbdGV4dDpuZXdUZXh0XSlcblx0XHRcdFx0aWYgZmllbGQudGV4dC5odG1sID09IFwiXCJcblx0XHRcdFx0XHRmaWVsZC5wbGFjZWhvbGRlci52aXNpYmxlID0gdHJ1ZVxuXG5cdFx0XHRcdCMgR2V0IHJpZCBvZiAmIG5ic3A7XG5cblx0XHRcdFx0ZmllbGQudmFsdWUgPSBleHBvcnRzLmNsZWFuKG5ld1RleHQpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAna2V5dXAnLCAoZSkgLT5cblx0XHRpZiBmaWVsZC5hY3RpdmVcblx0XHRcdGlmIGUua2V5Q29kZSA9PSAxMyAmJiBrZXlib2FyZFxuXHRcdFx0XHRrZXlib2FyZC5rZXlzLnJldHVybi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMzIgJiYga2V5Ym9hcmRcblx0XHRcdFx0a2V5Ym9hcmQua2V5cy5zcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIldoaXRlXCJcblx0XHRcdGlmIGUua2V5Q29kZSA9PSA4ICYmIGtleWJvYXJkXG5cdFx0XHRcdGtleWJvYXJkLmtleXMuZGVsZXRlLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHR0aW1lOi4xXG5cdFx0XHRcdGtleWJvYXJkLmtleXMuZGVsZXRlLmljb24uc3RhdGVzLnN3aXRjaChcIm9mZlwiKVxuXHRcdFx0aWYgZS5rZXlDb2RlID09IDkxXG5cdFx0XHRcdGlzQ29tbWFuZCA9IGZhbHNlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMTZcblx0XHRcdFx0aXNTaGlmdCA9IGZhbHNlXG5cdFx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdFx0Zm9yIGsgaW4ga2V5Ym9hcmQua2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrLnN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl0gPSBcImxvd2VyY2FzZVwiXG5cdFx0XHRcdFx0a2V5Ym9hcmQua2V5cy5zaGlmdC5hbmltYXRlXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHRcdHRpbWU6LjJcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlzLnNoaWZ0Lmljb24uc3RhdGVzLm5leHQoKVxuXHRcdFx0aWYgZS5rZXlDb2RlID49IDY1ICYmIGUua2V5Q29kZSA8PSA5MFxuXHRcdFx0XHRpZiBrZXlib2FyZCAmJiBleHBvcnRzLmRldmljZSAhPSBcImlwYWRcIlxuXHRcdFx0XHRcdGtleWJvYXJkLmtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ayA9IGtleWJvYXJkLmtleXNbY29kZXNbZS5rZXlDb2RlXS50b0xvd2VyQ2FzZSgpXVxuXHRcdFx0XHRcdGsuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0cHJvcGVydGllczooYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIilcblx0XHRcdFx0XHRcdHRpbWU6LjJcblxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2tleXByZXNzJywgKGUpIC0+XG5cdFx0aWYgZmllbGQuYWN0aXZlIFxuXHRcdFx0Y2hhciA9IGNvZGVzW2Uua2V5Q29kZV1cblx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdGtleSA9IGtleWJvYXJkLmtleXNbY2hhcl1cblx0XHRcdGlmIGlzQ29tbWFuZCA9PSB0cnVlXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA9PSA5N1xuXHRcdFx0XHRcdGZpZWxkLnRleHQuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDAsIDExOCwgMjU1LCAuMilcIlxuXHRcdFx0XHRcdGFsbFNlbGVjdGVkID0gdHJ1ZVxuXG5cdFx0XHRpZiBpc0NvbW1hbmQgPT0gZmFsc2Vcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+PSA2NSAmJiBlLmtleUNvZGUgPD0gOTBcblx0XHRcdFx0XHRjaGFyMiA9IGNoYXIudG9Mb3dlckNhc2UoKVxuXHRcdFx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdFx0XHRrZXkgPSBrZXlib2FyZC5rZXlzW2NoYXIyXVxuXHRcdFx0XHRcdFx0a2V5cHJlc3Moa2V5KVxuXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+PSA5NyAmJiBlLmtleUNvZGUgPD0gMTIyIHx8IGUua2V5Q29kZSA9PSAzMlx0XHRcblx0XHRcdFx0XHRpZiBrZXlib2FyZFxuXHRcdFx0XHRcdFx0a2V5cHJlc3Moa2V5KVxuXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+IDMxXG5cdFx0XHRcdFx0bmV3VGV4dCA9IGZpZWxkLnRleHQuaHRtbCArIGNoYXJcblx0XHRcdFx0XHRleHBvcnRzLnVwZGF0ZShmaWVsZC50ZXh0LCBbdGV4dDpuZXdUZXh0XSlcblx0XHRcdFx0XHRmaWVsZC52YWx1ZSA9IGV4cG9ydHMuY2xlYW4obmV3VGV4dClcblxuZXhwb3J0cy51cGRhdGUgPSAobGF5ZXIsIGFycmF5KSAtPlxuXHRpZiBhcnJheSA9PSB1bmRlZmluZWRcblx0XHRhcnJheSA9IFtdXG5cdGlmIGxheWVyLnR5cGUgPT0gXCJ0ZXh0XCJcblx0XHRmb3IgY2hhbmdlIGluIGFycmF5XG5cdFx0XHRrZXkgPSBPYmplY3Qua2V5cyhjaGFuZ2UpWzBdXG5cdFx0XHR2YWx1ZSA9IGNoYW5nZVtrZXldXG5cdFx0XHRpZiBrZXkgPT0gXCJ0ZXh0XCJcblx0XHRcdFx0bGF5ZXIuaHRtbCA9IHZhbHVlXG5cdFx0XHRpZiBrZXkgPT0gXCJmb250V2VpZ2h0XCJcblx0XHRcdFx0bGF5ZXIuc3R5bGVba2V5XSA9IHZhbHVlXG5cdFx0XHRpZiBrZXkgPT0gXCJjb2xvclwiXG5cdFx0XHRcdGxheWVyLmNvbG9yID0gZXhwb3J0cy5jb2xvcih2YWx1ZSlcblxuXHRcdHRleHRGcmFtZSA9IHRleHRBdXRvU2l6ZShsYXllcilcblx0XHRsYXllci53aWR0aCA9IHRleHRGcmFtZS53aWR0aFxuXHRcdGxheWVyLmhlaWdodCA9IHRleHRGcmFtZS5oZWlnaHRcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuZXhwb3J0cy50aW1lRGVsZWdhdGUgPSAobGF5ZXIsIGNsb2NrVHlwZSkgLT5cblx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRVdGlscy5kZWxheSA2MCAtIEB0aW1lLnNlY3MsIC0+XG5cdFx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRcdGV4cG9ydHMudXBkYXRlKGxheWVyLCBbdGV4dDpleHBvcnRzLnRpbWVGb3JtYXR0ZXIoQHRpbWUsIGNsb2NrVHlwZSldKVxuXHRcdFV0aWxzLmludGVydmFsIDYwLCAtPlxuXHRcdFx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRcdFx0ZXhwb3J0cy51cGRhdGUobGF5ZXIsIFt0ZXh0OmV4cG9ydHMudGltZUZvcm1hdHRlcihAdGltZSwgY2xvY2tUeXBlKV0pXG4gXG5leHBvcnRzLnRpbWVGb3JtYXR0ZXIgPSAodGltZU9iaiwgY2xvY2tUeXBlKSAtPlxuXHRpZiBjbG9ja1R5cGUgPT0gZmFsc2UgXG5cdFx0aWYgdGltZU9iai5ob3VycyA+IDEyXG5cdFx0XHR0aW1lT2JqLmhvdXJzID0gdGltZU9iai5ob3VycyAtIDEyXG5cdFx0aWYgdGltZU9iai5ob3VycyA9PSAwIHRoZW4gdGltZU9iai5ob3VycyA9IDEyXG5cdGlmIHRpbWVPYmoubWlucyA8IDEwXG5cdFx0dGltZU9iai5taW5zID0gXCIwXCIgKyB0aW1lT2JqLm1pbnNcblx0cmV0dXJuIHRpbWVPYmouaG91cnMgKyBcIjpcIiArIHRpbWVPYmoubWluc1xuXG4jIyBDb21wb25lbnRzIFxuZXhwb3J0cy5BbGVydCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcImFsZXJ0XCIsIGFycmF5KVxuXHRhbGVydCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYWxlcnRcIlxuXHRhbGVydC5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdG92ZXJsYXkgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwicmdiYSgwLDAsMCwuMylcIiwgc3VwZXJMYXllcjphbGVydCwgbmFtZTpcIm92ZXJsYXlcIlxuXHRvdmVybGF5LmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0dG9wOjBcblx0XHRib3R0b206MFxuXHRtb2RhbCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ3aGl0ZVwiLCBzdXBlckxheWVyOmFsZXJ0LCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIG5hbWU6XCJtb2RhbFwiLCB4OjkyLCB5OjUzN1xuXHRtb2RhbC5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJjZW50ZXJcIlxuXHRcdHdpZHRoOjI4MFxuXHRcdGhlaWdodDo0MDBcblx0dGl0bGUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRUaXRsZVwiLCBzdXBlckxheWVyOm1vZGFsLCB0ZXh0OnNldHVwLnRpdGxlLCBmb250V2VpZ2h0Olwic2VtaWJvbGRcIiwgIG5hbWU6XCJ0aXRsZVwiLCB0ZXh0QWxpZ246XCJjZW50ZXJcIiwgbGluZUhlaWdodDoyMFxuXHR0aXRsZS5jb25zdHJhaW50cyA9IFxuXHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0d2lkdGg6MjIwXG5cdFx0dG9wOjIwXG5cdG1lc3NhZ2UgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRNZXNzYWdlXCIsIHRleHQ6c2V0dXAubWVzc2FnZSwgZm9udFNpemU6MTMsIHN1cGVyTGF5ZXI6bW9kYWwsIHRleHRBbGlnbjpcImNlbnRlclwiLCBsaW5lSGVpZ2h0OjE2LCB3aWR0aDoyNDAsIG5hbWU6XCJtZXNzYWdlXCJcblx0bWVzc2FnZS5jb25zdHJhaW50cyA9XG5cdFx0dG9wOiBbdGl0bGUsIDEwXVxuXHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0d2lkdGg6IDIyMFxuXHRkaXZpZGVyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bW9kYWwsIGJhY2tncm91bmRDb2xvcjpcIiNFMkU4RUJcIiwgbmFtZTpcImhvcml6b250YWwgZGl2aWRlclwiXG5cdGRpdmlkZXIuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjFcblx0XHRib3R0b206NDRcblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcblx0I1RpdGxlICsgTWVzc2FnZSArIDEgc2V0IG9mIGFjdGlvbnNcblx0bW9kYWwuY29uc3RyYWludHNbXCJoZWlnaHRcIl0gPSAyMCArIGV4cG9ydHMucHQodGl0bGUuaGVpZ2h0KSArIDEwICsgZXhwb3J0cy5wdChtZXNzYWdlLmhlaWdodCkgKyAyNCArIDQ0XG5cblx0YWN0aW9ucyA9IFtdXG5cdHN3aXRjaCBzZXR1cC5hY3Rpb25zLmxlbmd0aFxuXHRcdHdoZW4gMVxuXHRcdFx0YWN0TGFiZWwgPSBleHBvcnRzLmNhcGl0YWxpemUoc2V0dXAuYWN0aW9uc1swXSlcblx0XHRcdGFjdGlvbiA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOnNldHVwLmFjdGlvbnNbMF0sIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKVxuXHRcdFx0YWN0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdGxlYWRpbmc6MFxuXHRcdFx0XHR0cmFpbGluZzowXG5cdFx0XHRcdGJvdHRvbTowXG5cdFx0XHRcdGhlaWdodDo0NFxuXHRcdFx0YWN0aW9uLmxhYmVsID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImFsZXJ0QWN0aW9uXCIsIGNvbG9yOmV4cG9ydHMuY29sb3IoXCJibHVlXCIpLCBzdXBlckxheWVyOmFjdGlvbiwgdGV4dDphY3RMYWJlbCwgbmFtZTpcImxhYmVsXCJcblx0XHRcdGFjdGlvbi5sYWJlbC5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0XHRib3R0b206MTZcblx0XHRcdGFjdGlvbnMucHVzaCBhY3Rpb25cblx0XHR3aGVuIDJcblx0XHRcdGFjdExhYmVsID0gZXhwb3J0cy5jYXBpdGFsaXplKHNldHVwLmFjdGlvbnNbMF0pXG5cdFx0XHRhY3Rpb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjptb2RhbCwgbmFtZTpzZXR1cC5hY3Rpb25zWzBdLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRcdGFjdGlvbi5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRsZWFkaW5nOjBcblx0XHRcdFx0dHJhaWxpbmc6ZXhwb3J0cy5wdChtb2RhbC53aWR0aC8yKVxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdGFjdGlvbi5sYWJlbCA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJhbGVydEFjdGlvblwiLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmx1ZVwiKSwgc3VwZXJMYXllcjphY3Rpb24sIHRleHQ6YWN0TGFiZWwsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRhY3Rpb24ubGFiZWwuY29uc3RyYWludHMgPSBcblx0XHRcdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHRcdFx0Ym90dG9tOjE2XG5cdFx0XHRhY3Rpb25zLnB1c2ggYWN0aW9uXHRcdFxuXG5cdFx0XHR2ZXJ0RGl2aWRlciA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRTJFOEVCXCIsIG5hbWU6XCJ2ZXJ0aWNhbCBkaXZpZGVyXCJcblx0XHRcdHZlcnREaXZpZGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdHdpZHRoOjFcblx0XHRcdFx0Ym90dG9tOjBcblx0XHRcdFx0aGVpZ2h0OjQ0XG5cdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cblx0XHRcdGFjdExhYmVsMiA9IGV4cG9ydHMuY2FwaXRhbGl6ZShzZXR1cC5hY3Rpb25zWzFdKVxuXHRcdFx0YWN0aW9uMiA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBuYW1lOnNldHVwLmFjdGlvbnNbMV0sIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKSwgYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIlxuXHRcdFx0YWN0aW9uMi5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRsZWFkaW5nOmV4cG9ydHMucHQobW9kYWwud2lkdGgvMilcblx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdGFjdGlvbjIubGFiZWwgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRBY3Rpb25cIiwgY29sb3I6ZXhwb3J0cy5jb2xvcihcImJsdWVcIiksIHN1cGVyTGF5ZXI6YWN0aW9uMiwgdGV4dDphY3RMYWJlbDIsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRhY3Rpb24yLmxhYmVsLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHRcdGJvdHRvbToxNlxuXHRcdFx0YWN0aW9ucy5wdXNoIGFjdGlvbjJcblx0XHRlbHNlXG5cdFx0XHRmb3IgYWN0LCBpbmRleCBpbiBzZXR1cC5hY3Rpb25zXG5cdFx0XHRcdGFjdExhYmVsID0gZXhwb3J0cy5jYXBpdGFsaXplKGFjdClcblx0XHRcdFx0YWN0aW9uID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bW9kYWwsIG5hbWU6YWN0LCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRcdFx0YWN0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRcdGJvdHRvbTowICsgKChzZXR1cC5hY3Rpb25zLmxlbmd0aCAtIGluZGV4IC0gMSkgKiA0NClcblx0XHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdFx0YWN0aW9uRGl2aWRlciA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRTJFOEVCXCIsIG5hbWU6XCJob3Jpem9udGFsIGRpdmlkZXJcIlxuXHRcdFx0XHRhY3Rpb25EaXZpZGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRcdGhlaWdodDoxXG5cdFx0XHRcdFx0Ym90dG9tOjAgKyAoKHNldHVwLmFjdGlvbnMubGVuZ3RoIC0gaW5kZXgpICogNDQpXG5cdFx0XHRcdGFjdGlvbi5sYWJlbCA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJhbGVydEFjdGlvblwiLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmx1ZVwiKSwgc3VwZXJMYXllcjphY3Rpb24sIHRleHQ6YWN0TGFiZWwsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRcdGFjdGlvbi5sYWJlbC5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHRcdFx0Ym90dG9tOjE0XG5cdFx0XHRcdGFjdGlvbnMucHVzaCBhY3Rpb25cdFx0XG5cdFx0XHRcdG1vZGFsLmNvbnN0cmFpbnRzW1wiaGVpZ2h0XCJdID0gbW9kYWwuY29uc3RyYWludHNbXCJoZWlnaHRcIl0gKyA0MiAtIDEyXG5cblx0YWxlcnQuYWN0aW9ucyA9IHt9XHRcblx0Zm9yIGFjdCxpbmRleCBpbiBhY3Rpb25zXG5cblx0XHQjSGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVyc1xuXHRcdGFjdC50eXBlID0gXCJidXR0b25cIlxuXHRcdHNwZWNpYWxDaGFyKGFjdClcblx0XHRcblx0XHRpZiBzZXR1cC5hY3Rpb25zW2luZGV4XS5pbmRleE9mKFwiLXJcIikgPT0gMFxuXHRcdFx0YWN0Lm9yaWdDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJyZWRcIilcblx0XHRlbHNlXG5cdFx0XHRhY3Qub3JpZ0NvbG9yID0gZXhwb3J0cy5jb2xvcihcImJsdWVcIilcblxuXHRcdCNBZGQgVG91Y2ggRXZlbnRzXG5cdFx0YWN0Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0QC5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRcdEAuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6YWN0LmJhY2tncm91bmRDb2xvci5kYXJrZW4oNSkpXG5cdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRALmxhYmVsLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooY29sb3I6QC5vcmlnQ29sb3IubGlnaHRlbigxMCkpXG5cdFx0XHRcdHRpbWU6LjI1XG5cblx0XHRhY3Qub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdFx0QC5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCIpXG5cdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRALmxhYmVsLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooY29sb3I6QC5vcmlnQ29sb3IpXG5cdFx0XHRcdHRpbWU6LjI1XG5cblx0XHQjIEV4cG9ydCBhY3Rpb25zXG5cdFx0YWxlcnQuYWN0aW9uc1thY3QubmFtZV0gPSBhY3RcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHQjIEV4cG9ydCBhbGVydFxuXHRhbGVydC5vdmVybGF5ID0gb3ZlcmxheVxuXHRhbGVydC5tb2RhbCA9IG1vZGFsXG5cdGFsZXJ0LnRpdGxlID0gdGl0bGVcblx0YWxlcnQubWVzc2FnZSA9IG1lc3NhZ2VcblxuXHRyZXR1cm4gYWxlcnRcblxuZXhwb3J0cy5CYW5uZXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJiYW5uZXJcIiwgYXJyYXkpXG5cdGJhbm5lciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYmFubmVyXCJcblx0YmFubmVyLmh0bWwgPSBleHBvcnRzLnN2ZyhiYW5uZXJCR1tleHBvcnRzLmRldmljZV0pLnN2Z1xuXHRiYW5uZXIuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGhlaWdodDo2OFxuXG5cdCMgRGlmZmVyZW50IHBvc2l0aW9uaW5ncyBmb3IgZWFjaCBkZXZpY2Vcblx0c3dpdGNoIGV4cG9ydHMuZGV2aWNlIFxuXHRcdHdoZW4gXCJpcGFkXCIgXG5cdFx0XHRAbGVhZGluZ0ljb24gPSAyMDBcblx0XHRcdEB0b3BJY29uID0gMTVcblx0XHRcdEB0b3BUaXRsZSA9IDExXG5cdFx0d2hlbiBcImlwYWQtcHJvXCJcblx0XHRcdEBsZWFkaW5nSWNvbiA9IDE5MlxuXHRcdFx0QHRvcEljb24gPSAxMlxuXHRcdFx0QHRvcFRpdGxlID0gOVxuXHRcdGVsc2Vcblx0XHRcdEBsZWFkaW5nSWNvbiA9IDE1XG5cdFx0XHRAdG9wSWNvbiA9IDhcblx0XHRcdEB0b3BUaXRsZSA9IDVcblxuXHRpZiBzZXR1cC5pY29uID09IHVuZGVmaW5lZFxuXHRcdHNldHVwLmljb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpiYW5uZXJcblx0XHRzZXR1cC5pY29uLnN0eWxlW1wiYmFja2dyb3VuZFwiXSA9IFwibGluZWFyLWdyYWRpZW50KC0xODBkZWcsICM2N0ZGODEgMCUsICMwMUI0MUYgMTAwJSlcIlxuXHRlbHNlXG5cdFx0YmFubmVyLmFkZFN1YkxheWVyKHNldHVwLmljb24pXG5cblx0c2V0dXAuaWNvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDQuNSlcblx0c2V0dXAuaWNvbi5uYW1lID0gXCJpY29uXCJcblx0c2V0dXAuaWNvbi5jb25zdHJhaW50cyA9XG5cdFx0aGVpZ2h0OjIwXG5cdFx0d2lkdGg6MjBcblx0XHRsZWFkaW5nOkBsZWFkaW5nSWNvblxuXHRcdHRvcDpAdG9wSWNvbiBcblxuXHR0aXRsZSA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJiYW5uZXJUaXRsZVwiLCB0ZXh0OnNldHVwLnRpdGxlLCBjb2xvcjpcIndoaXRlXCIsIGZvbnRXZWlnaHQ6XCJtZWRpdW1cIiwgZm9udFNpemU6MTMsIHN1cGVyTGF5ZXI6YmFubmVyLCBuYW1lOlwidGl0bGVcIlxuXHR0aXRsZS5jb25zdHJhaW50cyA9IFxuXHRcdHRvcDpAdG9wVGl0bGVcblxuXHRcdGxlYWRpbmc6W3NldHVwLmljb24sIDExXVxuXHRtZXNzYWdlID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImJhbm5lck1lc3NhZ2VcIiwgdGV4dDpzZXR1cC5tZXNzYWdlLCBjb2xvcjpcIndoaXRlXCIsIGZvbnRTaXplOjEzLCBzdXBlckxheWVyOmJhbm5lciwgbmFtZTpcIm1lc3NhZ2VcIlxuXHRtZXNzYWdlLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nRWRnZXM6dGl0bGVcblx0XHR0b3A6W3RpdGxlLCAyXVxuXG5cdHRpbWUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYmFubmVyVGltZVwiLCB0ZXh0OnNldHVwLnRpbWUsIGNvbG9yOlwid2hpdGVcIiwgZm9udFNpemU6MTEsIHN1cGVyTGF5ZXI6YmFubmVyLCBuYW1lOlwidGltZVwiXG5cdHRpbWUuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6W3RpdGxlLCA1XVxuXHRcdGJvdHRvbUVkZ2VzOiB0aXRsZVxuXG5cdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiIHx8IGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZC1wcm9cIlxuXHRcdHRpbWUuY29uc3RyYWludHMgPVxuXHRcdFx0Ym90dG9tRWRnZXM6IHRpdGxlXG5cdFx0XHR0cmFpbGluZzogQGxlYWRpbmdJY29uXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRleHBvcnRzLmJnQmx1cihiYW5uZXIpXG5cblx0IyMgQmFubmVyIERyYWcgc2V0dGluZ3Ncblx0YmFubmVyLmRyYWdnYWJsZSA9IHRydWVcblx0YmFubmVyLmRyYWdnYWJsZS5ob3Jpem9udGFsID0gZmFsc2Vcblx0YmFubmVyLmRyYWdnYWJsZS5jb25zdHJhaW50cyA9XG5cdFx0eTowXG5cblx0YmFubmVyLmRyYWdnYWJsZS5ib3VuY2VPcHRpb25zID1cblx0ICAgIGZyaWN0aW9uOiAyNVxuXHQgICAgdGVuc2lvbjogMjUwXG5cblx0YmFubmVyLm9uIEV2ZW50cy5EcmFnRW5kLCAtPlxuXHRcdGlmIGJhbm5lci5tYXhZIDwgZXhwb3J0cy5weCg2OClcblx0XHRcdGJhbm5lci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KG1heFk6MClcblx0XHRcdFx0dGltZTouMTVcblx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0XHRVdGlscy5kZWxheSAuMjUsIC0+XG5cdFx0XHRcdGJhbm5lci5kZXN0cm95KClcblxuXG5cdCMgQnVmZmVyIHRoYXQgc2l0cyBhYm92ZSB0aGUgYmFubmVyXG5cdGJhbm5lckJ1ZmZlciA9IG5ldyBMYXllciBtYXhZOjAsIG5hbWU6XCJidWZmZXJcIiwgYmFja2dyb3VuZENvbG9yOlwiIzFCMUIxQ1wiLCBvcGFjaXR5Oi45LCBzdXBlckxheWVyOmJhbm5lciwgd2lkdGg6ZXhwb3J0cy53aWR0aCwgbWF4WTpiYW5uZXIueSwgaGVpZ2h0OmV4cG9ydHMuaGVpZ2h0XG5cdGV4cG9ydHMuYmdCbHVyKGJhbm5lckJ1ZmZlcilcblxuXHQjIEFuaW1hdGUtaW5cblx0aWYgc2V0dXAuYW5pbWF0ZWQgPT0gdHJ1ZVxuXHRcdGJhbm5lci55ID0gMCAtIGJhbm5lci5oZWlnaHRcblx0XHRiYW5uZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczooeTowKVxuXHRcdFx0dGltZTouMjVcblx0XHRcdGN1cnZlOlwiZWFzZS1pbi1vdXRcIlxuXG5cdCMgQW5pbWF0ZS1vdXRcblx0aWYgc2V0dXAuZHVyYXRpb25cblx0XHRVdGlscy5kZWxheSBzZXR1cC5kdXJhdGlvbiwgLT5cblx0XHRcdGJhbm5lci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KG1heFk6MClcblx0XHRcdFx0dGltZTouMjVcblx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0VXRpbHMuZGVsYXkgc2V0dXAuZHVyYXRpb24gKyAuMjUsIC0+XG5cdFx0XHRiYW5uZXIuZGVzdHJveSgpXG5cdFx0XG5cdCMgRXhwb3J0IEJhbm5lclxuXHRiYW5uZXIuaWNvbiA9IHNldHVwLmljb25cblx0YmFubmVyLnRpdGxlID0gdGl0bGVcblx0YmFubmVyLm1lc3NhZ2UgPSBtZXNzYWdlXG5cdHJldHVybiBiYW5uZXJcblxuZXhwb3J0cy5CdXR0b24gPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJidXR0b25cIiwgYXJyYXkpXG5cdGJ1dHRvbiA9IG5ldyBMYXllciBuYW1lOnNldHVwLm5hbWVcblx0YnV0dG9uLmJ1dHRvblR5cGUgPSBzZXR1cC5idXR0b25UeXBlXG5cdGJ1dHRvbi50eXBlID0gc2V0dXAudHlwZVxuXHRjb2xvciA9IFwiXCJcblx0aWYgc2V0dXAuY29uc3RyYWludHNcblx0XHRidXR0b24uY29uc3RyYWludHMgPSBcblx0XHRcdHNldHVwLmNvbnN0cmFpbnRzXG5cdGlmIHNldHVwLnN1cGVyTGF5ZXIgXG5cdFx0c2V0dXAuc3VwZXJMYXllci5hZGRTdWJMYXllcihidXR0b24pXG5cdHN3aXRjaCBzZXR1cC5idXR0b25UeXBlXG5cdFx0d2hlbiBcImJpZ1wiXG5cdFx0XHRAZm9udFNpemUgPSAyMFxuXHRcdFx0QHRvcCA9IDE4XG5cdFx0XHRAZm9udFdlaWdodCA9IFwibWVkaXVtXCJcblx0XHRcdGlmIGJ1dHRvbi5jb25zdHJhaW50cyA9PSB1bmRlZmluZWRcblx0XHRcdFx0YnV0dG9uLmNvbnN0cmFpbnRzID0ge31cblx0XHRcdGlmIGJ1dHRvbi5jb25zdHJhaW50cy5sZWFkaW5nID09IHVuZGVmaW5lZFxuXHRcdFx0XHRidXR0b24uY29uc3RyYWludHMubGVhZGluZyA9IDEwXG5cdFx0XHRpZiBidXR0b24uY29uc3RyYWludHMudHJhaWxpbmcgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdGJ1dHRvbi5jb25zdHJhaW50cy50cmFpbGluZyA9IDEwXG5cdFx0XHRpZiBidXR0b24uY29uc3RyYWludHMuaGVpZ2h0ID09IHVuZGVmaW5lZFxuXHRcdFx0XHRidXR0b24uY29uc3RyYWludHMuaGVpZ2h0ID0gNTdcblx0XHRcdGJ1dHRvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDEyLjUpXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRzd2l0Y2ggc2V0dXAuc3R5bGVcblx0XHRcdFx0d2hlbiBcImxpZ2h0XCJcblx0XHRcdFx0XHRjb2xvciA9IFwiIzAwN0FGRlwiXG5cdFx0XHRcdFx0aWYgc2V0dXAuYmx1ciBcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAuOSlcIlxuXHRcdFx0XHRcdFx0ZXhwb3J0cy5iZ0JsdXIoYnV0dG9uKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXG5cdFx0XHRcdHdoZW4gXCJkYXJrXCJcblx0XHRcdFx0XHRjb2xvciA9IFwiI0ZGRlwiXG5cdFx0XHRcdFx0aWYgc2V0dXAuYmx1clxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDQzLCA0MywgNDMsIC45KVwiXG5cdFx0XHRcdFx0XHRleHBvcnRzLmJnQmx1cihidXR0b24pXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCIjMjgyODI4XCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIHNldHVwLmJsdXIgXG5cdFx0XHRcdFx0XHRjb2xvciA9IHNldHVwLmNvbG9yXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3Ioc2V0dXAuYmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHRcdFx0cmdiU3RyaW5nID0gYmFja2dyb3VuZENvbG9yLnRvUmdiU3RyaW5nKClcblx0XHRcdFx0XHRcdHJnYmFTdHJpbmcgPSByZ2JTdHJpbmcucmVwbGFjZShcIilcIiwgXCIsIC45KVwiKVxuXHRcdFx0XHRcdFx0cmdiYVN0cmluZyAgPSByZ2JhU3RyaW5nLnJlcGxhY2UoXCJyZ2JcIiwgXCJyZ2JhXCIpXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSByZ2JhU3RyaW5nXG5cdFx0XHRcdFx0XHRleHBvcnRzLmJnQmx1cihidXR0b24pXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0Y29sb3IgPSBzZXR1cC5jb2xvclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gbmV3IENvbG9yKHNldHVwLmJhY2tncm91bmRDb2xvcilcblxuXG5cdFx0XHRidXR0b24uYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yXG5cblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0bmV3Q29sb3IgPSBcIlwiXG5cdFx0XHRcdGlmIHNldHVwLnN0eWxlID09IFwiZGFya1wiXG5cdFx0XHRcdFx0bmV3Q29sb3IgPSBidXR0b24uYmFja2dyb3VuZENvbG9yLmxpZ2h0ZW4oMTApXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdDb2xvciA9IGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IuZGFya2VuKDEwKVxuXHRcdFx0XHRidXR0b24uYW5pbWF0ZSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6bmV3Q29sb3IpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6YmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblxuXHRcdHdoZW4gXCJzbWFsbFwiXG5cdFx0XHRAZm9udFNpemUgPSAxNlxuXHRcdFx0QHRvcCA9IDRcblx0XHRcdGJ1dHRvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDIuNSlcblx0XHRcdHN3aXRjaCBzZXR1cC5zdHlsZVxuXHRcdFx0XHR3aGVuIFwibGlnaHRcIlxuXHRcdFx0XHRcdGNvbG9yID0gXCIjMDA3QUZGXCJcblx0XHRcdFx0XHRidXR0b24uYm9yZGVyQ29sb3IgPSBcIiMwMDdBRkZcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y29sb3IgPSBzZXR1cC5jb2xvclxuXHRcdFx0XHRcdGJ1dHRvbi5ib3JkZXJDb2xvciA9IHNldHVwLmNvbG9yXG5cdFx0XHRidXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRidXR0b24uYm9yZGVyV2lkdGggPSBleHBvcnRzLnB4KDEpXG5cblxuXHRcdGVsc2Vcblx0XHRcdGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRcdGNvbG9yID0gc2V0dXAuY29sb3Jcblx0XHRcdEBmb250U2l6ZSA9IHNldHVwLmZvbnRTaXplXG5cdFx0XHRAZm9udFdlaWdodCA9IHNldHVwLmZvbnRXZWlnaHRcblxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0XHRuZXdDb2xvciA9IGJ1dHRvbi5zdWJMYXllcnNbMF0uY29sb3IubGlnaHRlbigzMClcblx0XHRcdFx0YnV0dG9uLnN1YkxheWVyc1swXS5hbmltYXRlIFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOm5ld0NvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGJ1dHRvbi5zdWJMYXllcnNbMF0uYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOnNldHVwLmNvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0dGV4dExheWVyID0gbmV3IGV4cG9ydHMuVGV4dCB0ZXh0OnNldHVwLnRleHQsIGNvbG9yOmNvbG9yLCBzdXBlckxheWVyOmJ1dHRvbiwgZm9udFNpemU6QGZvbnRTaXplLCBmb250V2VpZ2h0OkBmb250V2VpZ2h0XG5cdHRleHRMYXllci5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJjZW50ZXJcIlxuXHRzd2l0Y2ggc2V0dXAuYnV0dG9uVHlwZSBcblx0XHR3aGVuIFwic21hbGxcIlxuXHRcdFx0YnV0dG9uLnByb3BzID0gKHdpZHRoOnRleHRMYXllci53aWR0aCArIGV4cG9ydHMucHgoNjApLCBoZWlnaHQ6IHRleHRMYXllci5oZWlnaHQgKyBleHBvcnRzLnB4KDEwKSlcblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6Y29sb3IpXG5cdFx0XHRcdFx0dGltZTouNVx0XG5cdFx0XHRcdHRleHRMYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczooY29sb3I6XCIjRkZGXCIpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiKVxuXHRcdFx0XHRcdHRpbWU6LjVcdFxuXHRcdFx0XHR0ZXh0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOmNvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0XHRlbHNlIFxuXHRcdFx0YnV0dG9uLnByb3BzID0gKHdpZHRoOnRleHRMYXllci53aWR0aCwgaGVpZ2h0OnRleHRMYXllci5oZWlnaHQpXG5cdGV4cG9ydHMubGF5b3V0KClcblx0YnV0dG9uLmxhYmVsID0gdGV4dExheWVyXG5cdHJldHVybiBidXR0b25cblxuZXhwb3J0cy5GaWVsZCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcImZpZWxkXCIsIGFycmF5KVxuXHRmaWVsZCA9IG5ldyBMYXllciBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weChzZXR1cC5ib3JkZXJSYWRpdXMpLCBiYWNrZ3JvdW5kQ29sb3I6c2V0dXAuYmFja2dyb3VuZENvbG9yLCB3aWR0aDpleHBvcnRzLnB4KHNldHVwLndpZHRoKSwgaGVpZ2h0OmV4cG9ydHMucHgoc2V0dXAuaGVpZ2h0KVxuXHRpZiBzZXR1cC5jb25zdHJhaW50c1xuXHRcdGZpZWxkLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRzZXR1cC5jb25zdHJhaW50c1xuXHRmaWVsZC5hY3RpdmUgPSBmYWxzZVxuXHR0ZXh0ID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImZpZWxkVGV4dFwiLCBzdXBlckxheWVyOmZpZWxkLCB0ZXh0OnNldHVwLnRleHQsIGZvbnRTaXplOnNldHVwLmZvbnRTaXplLCBmb250V2VpZ2h0OnNldHVwLmZvbnRXZWlnaHQsIGNvbG9yOnNldHVwLmNvbG9yXG5cdGlmIHNldHVwLnRleHRDb25zdHJhaW50c1xuXHRcdHRleHQuY29uc3RyYWludHMgPVxuXHRcdFx0c2V0dXAudGV4dENvbnN0cmFpbnRzXG5cdGZpZWxkLnRleHQgPSB0ZXh0XG5cblx0aWYgc2V0dXAuc3VwZXJMYXllclxuXHRcdHNldHVwLnN1cGVyTGF5ZXIuYWRkU3ViTGF5ZXIoZmllbGQpXG5cblxuXG5cblx0IyNIYW5kbGUga2V5cHJlc3Ncblx0dGV4dC5vbiBcImNoYW5nZTpodG1sXCIsIC0+XG5cdFx0aWYgdGV4dC5odG1sID09IFwiXCJcblx0XHRcdGZpZWxkLmN1cnNvci5jb25zdHJhaW50cyA9IHthbGlnbjpcInZlcnRpY2FsXCIsIGxlYWRpbmc6OH1cblx0XHRlbHNlXG5cdFx0XHRmaWVsZC5jdXJzb3IuY29uc3RyYWludHMgPSB7YWxpZ246XCJ2ZXJ0aWNhbFwiLCB0cmFpbGluZ0VkZ2VzOnRleHR9XG5cdFx0aWYgZmllbGQucGxhY2Vob2xkZXJcblx0XHRcdGZpZWxkLnBsYWNlaG9sZGVyLnZpc2libGUgPSBmYWxzZVxuXG5cdGlmIHNldHVwLnRleHQgPT0gXCJcIiB8fCBzZXR1cC50ZXh0ID09IHVuZGVmaW5lZFxuXHRcdHBsYWNlaG9sZGVyID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImZpZWxkUGxhY2Vob2xkZXJcIiwgc3VwZXJMYXllcjpmaWVsZCwgdGV4dDpzZXR1cC5wbGFjZWhvbGRlclRleHQsIGZvbnRTaXplOnNldHVwLmZvbnRTaXplLCBmb250V2VpZ2h0OnNldHVwLmZvbnRXZWlnaHQsIGNvbG9yOnNldHVwLnBsYWNlaG9sZGVyQ29sb3Jcblx0XHRpZiBzZXR1cC50ZXh0Q29uc3RyYWludHMgXG5cdFx0XHRwbGFjZWhvbGRlci5jb25zdHJhaW50cyA9XG5cdFx0XHRcdHNldHVwLnRleHRDb25zdHJhaW50c1xuXHRcdGZpZWxkLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJcblxuXHRmaWVsZC5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0ZmllbGQuYWN0aXZlID0gdHJ1ZVxuXHRcdHRleHQudmlzaWJsZSA9IHRydWVcblx0XHRjbGlja1pvbmUgPSBuZXcgTGF5ZXIgbmFtZTpcImZpZWxkQWN0aXZlXCIsIG9wYWNpdHk6MFxuXHRcdGlmIHNldHVwLmlucHV0XG5cdFx0XHRrZXlib2FyZCA9IG5ldyBleHBvcnRzLktleWJvYXJkIGFuaW1hdGVkOnRydWUsIG91dHB1dDpmaWVsZCwgcmV0dXJuVGV4dDpzZXR1cC5yZXR1cm5UZXh0LCByZXR1cm5Db2xvcjpzZXR1cC5yZXR1cm5Db2xvclxuXHRcdFx0ZmllbGQua2V5Ym9hcmQgPSBrZXlib2FyZFxuXHRcdFx0Y2xpY2tab25lLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdHRvcDowXG5cdFx0XHRcdGJvdHRvbTprZXlib2FyZC5zcGVjcy5oZWlnaHRcblx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdHRyYWlsaW5nOjBcblx0XHRlbHNlXG5cdFx0XHRjbGlja1pvbmUuY29uc3RyYWludHMgPVxuXHRcdFx0XHR0b3A6MFxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRsZWFkaW5nOjBcblx0XHRcdFx0dHJhaWxpbmc6MFxuXG5cdFx0Y2xpY2tab25lLm9uIEV2ZW50cy5Ub3VjaEVuZCwgKGhhbmRsZXIpIC0+XG5cdFx0XHQjICMgbGlzdGVuIGZvciBzb21ldGhpbmcgZWxzZVxuXHRcdFx0IyBpZiBoYW5kbGVyLm9mZnNldFggPCBmaWVsZC54IHx8IGhhbmRsZXIub2Zmc2V0WCA+IGZpZWxkLm1heFggfHwgaGFuZGxlci5vZmZzZXRZIDwgZmllbGQueSB8fCBoYW5kbGVyLm9mZnNldFkgPiBmaWVsZC5tYXhZXG5cdFx0XHQjIFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdGZpZWxkLmtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooeTpleHBvcnRzLmhlaWdodClcblx0XHRcdFx0dGltZTouNFxuXHRcdFx0XHRjdXJ2ZTpcImVhc2UtaW4tb3V0XCJcblx0XHRcdFV0aWxzLmRlbGF5IC41LCAtPlxuXHRcdFx0XHRmaWVsZC5rZXlib2FyZC5kZXN0cm95KClcblx0XHRcdFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0Y2xpY2tab25lLmRlc3Ryb3koKVxuXHRcdGZpZWxkLmNsaWNrWm9uZSA9IGNsaWNrWm9uZVxuXG5cdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdGZpZWxkLmtleWJvYXJkLmtleXMuZGlzbWlzcy5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGZpZWxkLmtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOih5OmV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0XHRcdHRpbWU6LjRcblx0XHRcdFx0XHRjdXJ2ZTpcImVhc2UtaW4tb3V0XCJcblx0XHRcdFx0VXRpbHMuZGVsYXkgLjUsIC0+XG5cdFx0XHRcdFx0ZmllbGQua2V5Ym9hcmQuZGVzdHJveSgpXG5cdFx0XHRcdFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0XHRjbGlja1pvbmUuZGVzdHJveSgpXG4gXG5cblx0XHQjIyBEZWZhdWx0IEN1cnNvclxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhzZXR1cC5jdXJzb3IpXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRzZXR1cC5jdXJzb3IuY29uc3RyYWludHMgPSB7YWxpZ246XCJ2ZXJ0aWNhbFwiLCBsZWFkaW5nOjh9XG5cdFx0XHRzZXR1cC5jdXJzb3Iud2lkdGggPSAyXG5cdFx0XHRzZXR1cC5jdXJzb3IuaGVpZ2h0ID0gMjBcblxuXHRcdGlmIGZpZWxkLmN1cnNvciA9PSB1bmRlZmluZWRcblx0XHRcdGxpc3RlblRvS2V5cyhmaWVsZCwga2V5Ym9hcmQpXG5cdFx0XHRjdXJzb3IgPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weChzZXR1cC5jdXJzb3Iud2lkdGgpLCBoZWlnaHQ6ZXhwb3J0cy5weChzZXR1cC5jdXJzb3IuaGVpZ2h0KSwgc3VwZXJMYXllcjpmaWVsZCwgbmFtZTpcImN1cnNvclwiLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImJsdWVcIiksIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEpXG5cdFx0XHRmaWVsZC5jdXJzb3IgPSBjdXJzb3Jcblx0XHRcdGN1cnNvci5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRzZXR1cC5jdXJzb3IuY29uc3RyYWludHNcblxuXHRcdFx0VXRpbHMuaW50ZXJ2YWwgLjUsIC0+XG5cdFx0XHRcdGlmIGZpZWxkLmFjdGl2ZSA9PSB0cnVlXG5cdFx0XHRcdFx0aWYgZmllbGQuY3Vyc29yLm9wYWNpdHkgPT0gMFxuXHRcdFx0XHRcdFx0ZmllbGQuY3Vyc29yLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eToxKVxuXHRcdFx0XHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZmllbGQuY3Vyc29yLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eTowKVxuXHRcdFx0XHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmaWVsZC5jdXJzb3Iub3BhY2l0eSA9IDBcblx0XHRleHBvcnRzLmxheW91dCgpXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRyZXR1cm4gZmllbGRcblxuZXhwb3J0cy5TdGF0dXNCYXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJzdGF0dXNCYXJcIiwgYXJyYXkpXG5cdHN0YXR1c0JhciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwic3RhdHVzQmFyLmFsbFwiXG5cdHN0YXR1c0Jhci50eXBlID0gc2V0dXAudHlwZVxuXHRzdGF0dXNCYXIuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjIwXG5cdHN3aXRjaCBleHBvcnRzLmRldmljZVxuXHRcdHdoZW4gXCJpcGhvbmUtNnMtcGx1c1wiXG5cdFx0XHRAdG9wQ29uc3RyYWludCA9IDVcblx0XHRcdEBiYXR0ZXJ5SWNvbiA9IDZcblx0XHRcdEBibHVldG9vdGggPSA1XG5cdFx0d2hlbiBcImZ1bGxzY3JlZW5cIlxuXHRcdFx0QGJhdHRlcnlJY29uID0gLSAxMlxuXHRcdFx0QGJsdWV0b290aCA9IC0gMTBcblx0XHRlbHNlXG5cdFx0XHRAdG9wQ29uc3RyYWludCA9IDNcblx0XHRcdEBiYXR0ZXJ5SWNvbiA9IDJcblx0XHRcdEBibHVldG9vdGggPSAzXG5cdGlmIHNldHVwLnN0eWxlID09IFwibGlnaHRcIlxuXHRcdEBjb2xvciA9IFwid2hpdGVcIlxuXHRlbHNlXG5cdFx0QGNvbG9yID0gXCJibGFja1wiXG5cdGZvciBsYXllciBpbiBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdFx0aWYgbGF5ZXIudHlwZSA9PSBcImxvY2tTY3JlZW5cIlxuXHRcdFx0QGlzTG9ja1NjcmVlblByZXNlbnQgPSB0cnVlXG5cdGlmIEBpc0xvY2tTY3JlZW5QcmVzZW50XG5cdFx0Z3JpcHBlciA9IG5ldyBMYXllciBzdXBlckxheWVyOnN0YXR1c0Jhciwgd2lkdGg6ZXhwb3J0cy5weCgzNyksIGhlaWdodDpleHBvcnRzLnB4KDUpLCBuYW1lOlwiZ3JpcHBlclwiLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi41LCBuYW1lOlwiZ3JpcHBlclwiXG5cdFx0Z3JpcHBlci5odG1sID0gXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgzNyl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDUpfXB4JyB2aWV3Qm94PScwIDAgMzcgNScgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+R3JpcHBlcjwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9BdXRvLUNvbXBsZXRlLUJhci1DbG9zZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNjkuMDAwMDAwLCAtMi4wMDAwMDApJyBmaWxsPScjRkZGRkZGJz5cblx0XHRcdFx0XHRcdDxyZWN0IGlkPSdHcmlwcGVyJyB4PScxNjkuNScgeT0nMi41JyB3aWR0aD0nMzYnIGhlaWdodD0nNCcgcng9JzIuNSc+PC9yZWN0PlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0XHRncmlwcGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0dG9wOjJcblx0ZWxzZSBcblx0XHRAdGltZSA9IGV4cG9ydHMuZ2V0VGltZSgpXG5cdFx0aWYgc2V0dXAuY2xvY2syNCA9PSBmYWxzZVxuXHRcdFx0aWYgQHRpbWUuaG91cnMgPiAxMSBcblx0XHRcdFx0QHRpbWUuc3RhbXAgPSBcIlBNXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0QHRpbWUuc3RhbXAgPSBcIkFNXCJcblx0XHRlbHNlXG5cdFx0XHRAdGltZS5zdGFtcCA9IFwiXCJcblx0XHR0aW1lID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhclRpbWVcIiwgdGV4dDpleHBvcnRzLnRpbWVGb3JtYXR0ZXIoQHRpbWUsIHNldHVwLmNsb2NrMjQpICsgXCIgXCIgKyBAdGltZS5zdGFtcCwgZm9udFNpemU6MTIsIGZvbnRXZWlnaHQ6XCJzZW1pYm9sZFwiLCBzdXBlckxheWVyOnN0YXR1c0JhciwgY29sb3I6QGNvbG9yLCBuYW1lOlwidGltZVwiXG5cdFx0dGltZS5jb25zdHJhaW50cyA9XG5cdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0dG9wOkB0b3BDb25zdHJhaW50XG5cdHNpZ25hbCA9IFtdXG5cdGlmIHNldHVwLnNpZ25hbCA8IDFcblx0XHRub05ldHdvcmsgPSBuZXcgZXhwb3J0cy5UZXh0IHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBmb250U2l6ZToxMiwgdGV4dDpcIk5vIE5ldHdvcmtcIlxuXHRcdG5vTmV0d29yay5jb25zdHJhaW50cyA9XG5cdFx0XHRsZWFkaW5nOjdcblx0XHRcdHRvcDozXG5cdGVsc2Vcblx0XHRmb3IgaSBpbiBbMC4uLnNldHVwLnNpZ25hbF1cblx0XHRcdGRvdCA9IG5ldyBMYXllciBoZWlnaHQ6ZXhwb3J0cy5weCg1LjUpLCB3aWR0aDpleHBvcnRzLnB4KDUuNSksIGJhY2tncm91bmRDb2xvcjpcImJsYWNrXCIsIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1LjUpLzIsIGJhY2tncm91bmRDb2xvcjpAY29sb3IsIG5hbWU6XCJzaWduYWxbI3tpfV1cIlxuXHRcdFx0aWYgaSA9PSAwXG5cdFx0XHRcdGRvdC5jb25zdHJhaW50cyA9XG5cdFx0XHRcdFx0bGVhZGluZzo3XG5cdFx0XHRcdFx0dG9wOjdcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb3QuY29uc3RyYWludHMgPVxuXHRcdFx0XHRcdGxlYWRpbmc6W3NpZ25hbFtpIC0gMSBdLCAxXVxuXHRcdFx0XHRcdHRvcDo3XHRcdFx0XHRcdFxuXHRcdFx0c2lnbmFsLnB1c2ggZG90IFxuXHRcdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGlmIHNldHVwLnNpZ25hbCA8IDVcblx0XHRcdG5vbkRvdHMgPSA1IC0gc2V0dXAuc2lnbmFsXG5cdFx0XHRmb3IgaSBpbiBbMC4uLm5vbkRvdHNdXG5cdFx0XHRcdG5vbkRvdCA9IG5ldyBMYXllciBoZWlnaHQ6ZXhwb3J0cy5weCg1LjUpLCB3aWR0aDpleHBvcnRzLnB4KDUuNSksIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1LjUpLzIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJzaWduYWxbI3tzaWduYWwubGVuZ3RofV1cIlxuXHRcdFx0XHRub25Eb3Quc3R5bGUuYm9yZGVyID0gXCIje2V4cG9ydHMucHgoMSl9cHggc29saWQgI3tAY29sb3J9XCJcblx0XHRcdFx0bm9uRG90LmNvbnN0cmFpbnRzID1cblx0XHRcdFx0XHRsZWFkaW5nOltzaWduYWxbc2lnbmFsLmxlbmd0aCAtIDFdLCAxXVxuXHRcdFx0XHRcdHRvcDo3XG5cdFx0XHRcdHNpZ25hbC5wdXNoIG5vbkRvdFxuXHRcdFx0XHRleHBvcnRzLmxheW91dCgpXHRcblx0XHRjYXJyaWVyID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhckNhcnJpZXJcIiwgdGV4dDpzZXR1cC5jYXJyaWVyLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcImNhcnJpZXJcIiwgdGV4dFRyYW5zZm9ybTpcImNhcGl0YWxpemVcIlxuXHRcdGNhcnJpZXIuY29uc3RyYWludHMgPSBcblx0XHRcdGxlYWRpbmc6W3NpZ25hbFtzaWduYWwubGVuZ3RoIC0gMV0sIDddXG5cdFx0XHR0b3A6M1xuXHRcdGV4cG9ydHMubGF5b3V0KClcblx0XHRpZiBzZXR1cC5jYXJyaWVyXG5cdFx0XHRuZXR3b3JrID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0Jhck5ldHdvcmtcIiwgdGV4dDpzZXR1cC5uZXR3b3JrLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcIm5ldHdvcmtcIiwgdGV4dFRyYW5zZm9ybTpcInVwcGVyY2FzZVwiXG5cdFx0XHRuZXR3b3JrLmNvbnN0cmFpbnRzID1cblx0XHRcdFx0bGVhZGluZzpbY2FycmllciwgNV1cblx0XHRcdFx0dG9wOjNcblx0XHRpZiBzZXR1cC5jYXJyaWVyID09IFwiXCIgfHwgc2V0dXAuY2FycmllciA9PSBcIndpZmlcIlxuXHRcdFx0bmV0d29yayA9IG5ldyBMYXllciB3aWR0aDpleHBvcnRzLnB4KDE0KSwgaGVpZ2h0OmV4cG9ydHMucHgoMTApLCBzdXBlckxheWVyOnN0YXR1c0JhciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpcIm5ldHdvcmtcIlxuXHRcdFx0bmV0d29yay5odG1sID0gXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE0KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTApfXB4JyB2aWV3Qm94PScwIDAgMTQgMTAnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHRcdDx0aXRsZT5XaS1GaTwvdGl0bGU+XG5cdFx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J1N0YXR1cy1CYXIvQmxhY2svQ2hhcmdpbmcnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC04Ny4wMDAwMDAsIC01LjAwMDAwMCknIGZpbGw9JyN7QGNvbG9yfSc+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J005Ni4xNDQ0MjA4LDEyLjQzODUwNDMgQzk1LjYyNjM3NCwxMS44NDU0NDU2IDk0Ljg1MjM2MTYsMTEuNDY4OTExOSA5My45ODc1NjMsMTEuNDY4OTExOSBDOTMuMTM5MDA3MywxMS40Njg5MTE5IDkyLjM3Nzg1OTQsMTEuODMxNDM0MSA5MS44NjAxNjUyLDEyLjQwNTMxNzcgTDk0LjAyMjUzOTEsMTQuNSBMOTYuMTQ0NDIwOCwxMi40Mzg1MDQzIFogTTk4LjMyMzQ5NjQsMTAuMzIxNDQyNSBDOTcuMjQ0Nzc5NCw5LjE5MTc0NTYzIDk1LjcwMTQzODcsOC40ODQ0NTU5NiA5My45ODc1NjMsOC40ODQ0NTU5NiBDOTIuMjg4MjcyMyw4LjQ4NDQ1NTk2IDkwLjc1NjYyNjQsOS4xNzk3NTg5MyA4OS42NzkyNjk4LDEwLjI5MjY5MzYgTDkwLjc2OTI5ODcsMTEuMzQ4NiBDOTEuNTY3MjA1LDEwLjUwNTM3MDggOTIuNzEzNjQ4LDkuOTc2NjgzOTQgOTMuOTg3NTYzLDkuOTc2NjgzOTQgQzk1LjI3Njg4MzYsOS45NzY2ODM5NCA5Ni40MzU2MzA1LDEwLjUxODIzNSA5Ny4yMzQ2MjE1LDExLjM3OTMyOTMgTDk4LjMyMzQ5NjQsMTAuMzIxNDQyNSBMOTguMzIzNDk2NCwxMC4zMjE0NDI1IFogTTEwMC41LDguMjA2ODc5MzMgQzk4Ljg2Mjk1NzgsNi41Mzk0MzY3MiA5Ni41NTA1Njk5LDUuNSA5My45ODc1NjMsNS41IEM5MS40Mzc1MTAzLDUuNSA4OS4xMzU1NDk2LDYuNTI4OTU2MDUgODcuNSw4LjE4MTY0NDMxIEw4OC41ODk1NTc5LDkuMjM3MDk0NDEgQzg5Ljk0NjA3OTgsNy44NTQzMTY1NSA5MS44NjI4OTIxLDYuOTkyMjI3OTggOTMuOTg3NTYzLDYuOTkyMjI3OTggQzk2LjEyNjAwMjYsNi45OTIyMjc5OCA5OC4wNTM4ODA5LDcuODY1NTI2MDkgOTkuNDExODY5OCw5LjI2NDA0MjcyIEwxMDAuNSw4LjIwNjg3OTMzIFonIGlkPSdXaS1GaSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XCJcblx0XHRcdG5ldHdvcmsuY29uc3RyYWludHMgPSBcblx0XHRcdFx0bGVhZGluZzpbc2lnbmFsW3NpZ25hbC5sZW5ndGggLSAxXSwgN11cblx0XHRcdFx0dG9wOkB0b3BDb25zdHJhaW50XG5cdGJhdHRlcnlJY29uID0gbmV3IExheWVyIHdpZHRoOmV4cG9ydHMucHgoMjUpLCBoZWlnaHQ6ZXhwb3J0cy5weCgxMCksIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYmF0dGVyeUljb25cIlxuXHRpZiBzZXR1cC5iYXR0ZXJ5ID4gNzAgXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL0JsYWNrLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni41MDY3NDQsNi41IEMzNDYuMjI2ODc3LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMzAyMjUsMTQgMzQ2LjUwNjc0NCwxNCBMMzY1Ljk5MzI1NiwxNCBDMzY2LjI3MzEyMywxNCAzNjYuNSwxMy43ODM2MjggMzY2LjUsMTMuNTA3OTA0MSBMMzY2LjUsNi45OTIwOTU5NSBDMzY2LjUsNi43MjAzMTg4NiAzNjYuMjY5Nzc1LDYuNSAzNjUuOTkzMjU2LDYuNSBMMzQ2LjUwNjc0NCw2LjUgWicgaWQ9J0JhdHRlcnknPjwvcGF0aD5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdGlmIHNldHVwLmJhdHRlcnkgPD0gNzAgJiYgc2V0dXAuYmF0dGVyeSA+IDIwXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL1doaXRlLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni41MDEyMzEsNi41IEMzNDYuMjI0NDA5LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMjk3NTEsMTQgMzQ2LjUwMTIzMSwxNCBMMzU2LjQ5ODc2OSwxNCBDMzU2Ljc3NTU5MSwxNCAzNTcsMTMuNzgzNjI4IDM1NywxMy41MDc5MDQxIEwzNTcsNi45OTIwOTU5NSBDMzU3LDYuNzIwMzE4ODYgMzU2Ljc3MDI0OSw2LjUgMzU2LjQ5ODc2OSw2LjUgTDM0Ni41MDEyMzEsNi41IFonIGlkPSdCYXR0ZXJ5Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRpZiBzZXR1cC5iYXR0ZXJ5IDw9IDIwXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL1doaXRlLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni40OTA0NzksNi41IEMzNDYuMjE5NTk1LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMTUwNTcsMTQgMzQ2LjQ5MDQ3OSwxNCBMMzQ5LjUwOTUyMSwxNCBDMzQ5Ljc4MDQwNSwxNCAzNTAsMTMuNzgzNjI4IDM1MCwxMy41MDc5MDQxIEwzNTAsNi45OTIwOTU5NSBDMzUwLDYuNzIwMzE4ODYgMzQ5Ljc4NDk0Myw2LjUgMzQ5LjUwOTUyMSw2LjUgTDM0Ni40OTA0NzksNi41IFonIGlkPSdCYXR0ZXJ5Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXG5cdGJhdHRlcnlQZXJjZW50ID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhckJhdHRlcnlQZXJjZW50XCIsIHRleHQ6c2V0dXAuYmF0dGVyeSArIFwiJVwiLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcImJhdHRlcnlQZXJjZW50XCJcblx0YmF0dGVyeVBlcmNlbnQuY29uc3RyYWludHMgPSBcblx0XHR0cmFpbGluZzogW2JhdHRlcnlJY29uLCAzXVxuXHRcdHZlcnRpY2FsQ2VudGVyOnRpbWVcblx0YmF0dGVyeUljb24uY29uc3RyYWludHMgPVxuXHRcdHRyYWlsaW5nIDogN1xuXHRcdHRvcDpAYmF0dGVyeUljb25cblx0Ymx1ZXRvb3RoID0gbmV3IExheWVyIHdpZHRoOmV4cG9ydHMucHgoOCksIGhlaWdodDpleHBvcnRzLnB4KDE1KSwgc3VwZXJMYXllcjpzdGF0dXNCYXIsIG9wYWNpdHk6LjUsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJibHVldG9vdGhcIlxuXHRibHVldG9vdGguaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMyl9cHgnIHZpZXdCb3g9JzAgMCA4IDE1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPkJsdWV0b290aDwvdGl0bGU+XG5cdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHQ8ZyBpZD0nU3RhdHVzLUljb25zLShXaGl0ZSknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xMzcuMDAwMDAwLCAwLjAwMDAwMCknIGZpbGw9JyN7QGNvbG9yfSc+XG5cdFx0XHRcdFx0PHBhdGggZD0nTTE0MC41LDE0LjUgTDE0NSwxMC4yNSBMMTQxLjgsNy41IEwxNDUsNC43NSBMMTQwLjUsMC41IEwxNDAuNSw2LjA3MTQyODU3IEwxMzcuOCwzLjc1IEwxMzcsNC41IEwxNDAuMjU4MzMzLDcuMzc1IEwxMzcsMTAuMjUgTDEzNy44LDExIEwxNDAuNSw4LjY3ODU3MTQzIEwxNDAuNSwxNC41IFogTTE0MS41LDMgTDE0My4zNjY2NjcsNC43NSBMMTQxLjUsNi4yNSBMMTQxLjUsMyBaIE0xNDEuNSw4LjUgTDE0My4zNjY2NjcsMTAuMjUgTDE0MS41LDEyIEwxNDEuNSw4LjUgWicgaWQ9J0JsdWV0b290aCc+PC9wYXRoPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XCJcblx0Ymx1ZXRvb3RoLmNvbnN0cmFpbnRzID0gXG5cdFx0dG9wOiBAYmx1ZXRvb3RoXG5cdFx0dHJhaWxpbmc6IFtiYXR0ZXJ5UGVyY2VudCwgN11cblxuXHRleHBvcnRzLmxheW91dCgpXG5cblx0IyBFeHBvcnQgc3RhdHVzQmFyXG5cdHN0YXR1c0Jhci5iYXR0ZXJ5ID0ge31cblx0c3RhdHVzQmFyLmJhdHRlcnkucGVyY2VudCA9IGJhdHRlcnlQZXJjZW50XG5cdHN0YXR1c0Jhci5iYXR0ZXJ5Lmljb24gPSBiYXR0ZXJ5SWNvblxuXHRzdGF0dXNCYXIuYmx1ZXRvb3RoID0gYmx1ZXRvb3RoXG5cdHN0YXR1c0Jhci50aW1lID0gdGltZVxuXHRzdGF0dXNCYXIubmV0d29yayA9IG5ldHdvcmtcblx0c3RhdHVzQmFyLmNhcnJpZXIgPSBjYXJyaWVyXG5cdHN0YXR1c0Jhci5zaWduYWwgPSBzaWduYWxcblx0cmV0dXJuIHN0YXR1c0JhclxuXG5leHBvcnRzLktleWJvYXJkID0gKGFycmF5KSAtPlxuXHRzZXR1cCA9IHNldHVwQ29tcG9uZW50KFwia2V5Ym9hcmRcIiwgYXJyYXkpXG5cblx0I1RoaXMgd2lsbCBob2xkIGFsbCBvZiB0aGUgc3BlY3MgZm9yIGVhY2ggZGV2aWNlJ3Mga2V5Ym9hcmRcblx0Ym9hcmRTcGVjcyA9IHt9XG5cblx0I1RoaXMgd2lsbCBzZXQgdGhlIHNwZWNzXG5cdHN3aXRjaCBleHBvcnRzLmRldmljZVxuXHRcdHdoZW4gXCJpcGhvbmUtNVwiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIxNVxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMjYpXG5cdFx0XHRcdGhlaWdodDpleHBvcnRzLnB4KDM5KVxuXHRcdFx0fVxuXHRcdFx0Ym9hcmRTcGVjcy5leHBhbmRlZEtleSA9IGV4cG9ydHMucHgoMzkpXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgxMilcblxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nID0ge31cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cxID0gZXhwb3J0cy5weCgzKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzIgPSBleHBvcnRzLnB4KDE5KVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzMgPSBleHBvcnRzLnB4KDU0KVxuXG5cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wID0ge31cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzEgPSBleHBvcnRzLnB4KDExKVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMjYpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCg0MSlcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDU1KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoOSksIHk6ZXhwb3J0cy5weCgyKX1cblx0XHRcdGJvYXJkU3BlY3MuZGVsZXRlSWNvbiA9IHt4OmV4cG9ydHMucHgoNyksIHk6ZXhwb3J0cy5weCgxMCl9XG5cdFx0XHRib2FyZFNwZWNzLmVtb2ppSWNvbiA9IHt4OmV4cG9ydHMucHgoOCksIHk6ZXhwb3J0cy5weCg5KX1cblxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5ID0gZXhwb3J0cy5weCgzNi41KVxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzID0gZXhwb3J0cy5weCg0KVxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5Qm90dG9tID0gZXhwb3J0cy5weCg1OClcblxuXHRcdFx0Ym9hcmRTcGVjcy5pUGFkRGVsZXRlT2Zmc2V0ID0gMFxuXHRcdFx0Ym9hcmRTcGVjcy5ib3R0b21Sb3cgPSA4XG5cdFx0XHRib2FyZFNwZWNzLnJldHVybktleSA9IGV4cG9ydHMucHgoNzQpXG5cblx0XHRcdGJvYXJkU3BlY3Muc3BhY2VyID0gZXhwb3J0cy5weCg2KVxuXG5cdFx0d2hlbiBcImlwaG9uZS02c1wiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIxNlxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMzEuNSlcblx0XHRcdFx0aGVpZ2h0OmV4cG9ydHMucHgoNDIpXG5cdFx0XHR9XG5cblx0XHRcdGJvYXJkU3BlY3MuZXhwYW5kZWRLZXkgPSBleHBvcnRzLnB4KDQ2LjUpXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgxNClcblxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nID0ge31cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cxID0gZXhwb3J0cy5weCgzKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzIgPSBleHBvcnRzLnB4KDIyKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzMgPSBleHBvcnRzLnB4KDU5KVxuXG5cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wID0ge31cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzEgPSBleHBvcnRzLnB4KDEwKVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMjIpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCgzNClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDQ0KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoMTEpLCB5OmV4cG9ydHMucHgoMil9XG5cdFx0XHRib2FyZFNwZWNzLmRlbGV0ZUljb24gPSB7eDpleHBvcnRzLnB4KDEwKSwgeTpleHBvcnRzLnB4KDEzKX1cblx0XHRcdGJvYXJkU3BlY3MuZW1vamlJY29uID0ge3g6ZXhwb3J0cy5weCgxMSksIHk6ZXhwb3J0cy5weCgxMSl9XG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCg4Ny41KVxuXHRcdFx0Ym9hcmRTcGVjcy5ib3R0b21Sb3cgPSA2XG5cdFx0XHRib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQgPSAwXG5cblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleSA9IGV4cG9ydHMucHgoNDIpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXlSYWRpdXMgPSBleHBvcnRzLnB4KDUpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXlCb3R0b20gPSBleHBvcnRzLnB4KDU2KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNwYWNlciA9IGV4cG9ydHMucHgoNilcblxuXHRcdHdoZW4gXCJpcGhvbmUtNnMtcGx1c1wiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIyNlxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMzUpXG5cdFx0XHRcdGhlaWdodDpleHBvcnRzLnB4KDQ1KVxuXHRcdFx0fVxuXHRcdFx0Ym9hcmRTcGVjcy5leHBhbmRlZEtleSA9IGV4cG9ydHMucHgoNTApXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgyMClcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZyA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLnBhZGRpbmcucm93MSA9IGV4cG9ydHMucHgoNClcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cyID0gZXhwb3J0cy5weCgyNSlcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3czID0gZXhwb3J0cy5weCg2NylcblxuXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcCA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxID0gZXhwb3J0cy5weCg4KVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMTkpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCgzMClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDQxKVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoMTMpLCB5OmV4cG9ydHMucHgoMil9XG5cdFx0XHRib2FyZFNwZWNzLmRlbGV0ZUljb24gPSB7eDpleHBvcnRzLnB4KDExKSwgeTpleHBvcnRzLnB4KDE0KX1cblx0XHRcdGJvYXJkU3BlY3MuZW1vamlJY29uID0ge3g6ZXhwb3J0cy5weCgxMyksIHk6ZXhwb3J0cy5weCgxMyl9XG5cblx0XHRcdGJvYXJkU3BlY3MuYm90dG9tUm93ID0gNlxuXG5cdFx0XHRib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQgPSAwXG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCg5NylcblxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5ID0gZXhwb3J0cy5weCg0NSlcblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleVJhZGl1cyA9IGV4cG9ydHMucHgoNSlcblxuXHRcdFx0Ym9hcmRTcGVjcy5zcGFjZXIgPSBleHBvcnRzLnB4KDYpXG5cdFx0d2hlbiBcImlwYWRcIlxuXHRcdFx0Ym9hcmRTcGVjcy5oZWlnaHQgPSAyNjhcblx0XHRcdGJvYXJkU3BlY3Mua2V5ID0ge1xuXHRcdFx0XHR3aWR0aDpleHBvcnRzLnB4KDU2KVxuXHRcdFx0XHRoZWlnaHQ6ZXhwb3J0cy5weCg1Nilcblx0XHRcdH1cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZyA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLnBhZGRpbmcucm93MSA9IGV4cG9ydHMucHgoNilcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cyID0gZXhwb3J0cy5weCgzNSlcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3czID0gZXhwb3J0cy5weCg3NClcblxuXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcCA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxID0gZXhwb3J0cy5weCgxMClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzIgPSBleHBvcnRzLnB4KDE4KVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyA9IGV4cG9ydHMucHgoMjgpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3c0ID0gZXhwb3J0cy5weCg0MClcblxuXHRcdFx0Ym9hcmRTcGVjcy5zaGlmdEljb24gPSB7eDpleHBvcnRzLnB4KDE4KSwgeTpleHBvcnRzLnB4KDIpfVxuXHRcdFx0Ym9hcmRTcGVjcy5kZWxldGVJY29uID0ge3g6ZXhwb3J0cy5weCgxOCksIHk6ZXhwb3J0cy5weCgyMCl9XG5cdFx0XHRib2FyZFNwZWNzLmVtb2ppSWNvbiA9IHt4OmV4cG9ydHMucHgoMTgpLCB5OmV4cG9ydHMucHgoMTgpfVxuXG5cdFx0XHRib2FyZFNwZWNzLmJvdHRvbVJvdyA9IDdcblxuXHRcdFx0Ym9hcmRTcGVjcy5pUGFkRGVsZXRlT2Zmc2V0ID0gYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyArIGJvYXJkU3BlY3Mua2V5LmhlaWdodCAqIDIgLSBib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxXG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCgxMDYpXG5cblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleSA9IGV4cG9ydHMucHgoNTYpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXkyID0gZXhwb3J0cy5weCg3Nilcblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleVJhZGl1cyA9IGV4cG9ydHMucHgoNSlcblxuXHRcdFx0Ym9hcmRTcGVjcy5zcGFjZXIgPSBleHBvcnRzLnB4KDEyKVxuXG5cdGJvYXJkID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcIiNEMUQ1REFcIiwgbmFtZTpcImtleWJvYXJkXCJcblxuXHRib2FyZC5zcGVjcyA9IGJvYXJkU3BlY3NcblxuXHQjVGhpcyB3aWxsIGdlbmVyYXRlIGEgb2JqZWN0IHdpdGggMjE2IGhlaWdodCBhbmQgaXQnbGwgc3RyZXRjaCBlbmQgdG8gZW5kLiBcblx0Ym9hcmQuY29uc3RyYWludHMgPSAoaGVpZ2h0OmJvYXJkU3BlY3MuaGVpZ2h0LCB0cmFpbGluZzowLCBsZWFkaW5nOjApXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdCNUaGlzIHdpbGwgZGV0ZXJpbmUgaWYgaXQgc3RhcnRzIG9uIHRoZSBib3R0b20gb3IgcG9wcyB1cCBmcm9tIHRoZSBib3R0b20gXG5cdGlmIHNldHVwLmFuaW1hdGVkXG5cdFx0Ym9hcmQueSA9IGV4cG9ydHMuaGVpZ2h0XG5cdFx0Ym9hcmQuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6KG1heFk6IGV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0dGltZTouMjVcblx0XHRcdGN1cnZlOlwiZWFzZS1pbi1vdXRcIlxuXHRlbHNlXG5cdFx0Ym9hcmQubWF4WSA9IGV4cG9ydHMuaGVpZ2h0XG5cblx0I0xldHRlcnMgdG8gYmUgbWFkZVxuXHRsZXR0ZXJzQXJyYXkgPSBbXCJxXCIsIFwid1wiLCBcImVcIiwgXCJyXCIsIFwidFwiLCBcInlcIiwgXCJ1XCIsIFwiaVwiLCBcIm9cIiwgXCJwXCIsIFwiYVwiLCBcInNcIiwgXCJkXCIsIFwiZlwiLCBcImdcIiwgXCJoXCIsIFwialwiLCBcImtcIiwgXCJsXCIsIFwielwiLCBcInhcIiwgXCJjXCIsIFwidlwiLCAgXCJiXCIsIFwiblwiLCBcIm1cIl1cblx0I1RoZXNlIGFycmF5cyBhcmUgZGVwZW5lZGVudCBvbiB0aGUgRGV2aWNlXG5cdHNlY29uZEFycmF5ID0gW11cblx0dGhpcmRBcnJheSA9IFtdXG5cblx0c3dpdGNoIGV4cG9ydHMuZGV2aWNlXG5cdFx0d2hlbiBcImlwYWRcIlxuXHRcdFx0c2Vjb25kQXJyYXkgPSBbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCIwXCIsIFwiLVwiLCBcIi9cIiwgXCI6XCIsIFwiO1wiLCBcIihcIiwgXCIpXCIsIFwiJFwiLCBcIiZcIiwgXCJAXCIsIFwidW5kb1wiLCBcImhpZGVcIiwgXCIuXCIsICcsJywgXCI/XCIsIFwiIVwiLCBcIidcIiwgXCJcXFwiXCJdXG5cdFx0XHR0aGlyZEFycmF5ID0gW1wiXFxbXCIsIFwiXFxdXCIsIFwiXFx7XCIsIFwiXFx9XCIsIFwiI1wiLCBcIiVcIiwgXCJeXCIsIFwiKlwiLCBcIitcIiwgXCI9XCIsIFwiX1wiLCBcIlxcXFxcIiwgXCJ8XCIsIFwiflwiLCBcIjxcIiwgXCI+XCIsIFwi4oKsXCIsIFwiwqNcIiwgXCLCpVwiLCBcInJlZG9cIiwgXCJoaWRlXCIsIFwiLlwiLCAnLCcsIFwiP1wiLCBcIiFcIiwgXCInXCIsIFwiXFxcIlwiXVxuXHRcdGVsc2Vcblx0XHRcdHNlY29uZEFycmF5ID0gW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCIsIFwiMFwiLCBcIi1cIiwgXCIvXCIsIFwiOlwiLCBcIjtcIiwgXCIoXCIsIFwiKVwiLCBcIiRcIiwgXCImXCIsIFwiQFwiLCBcIlxcXCJcIiwgXCIuXCIsICcsJywgXCI/XCIsIFwiIVwiLCBcIidcIl1cblx0XHRcdHRoaXJkQXJyYXkgPSBbXCJcXFtcIiwgXCJcXF1cIiwgXCJcXHtcIiwgXCJcXH1cIiwgXCIjXCIsIFwiJVwiLCBcIl5cIiwgXCIqXCIsIFwiK1wiLCBcIj1cIiwgXCJfXCIsIFwiXFxcXFwiLCBcInxcIiwgXCJ+XCIsIFwiPFwiLCBcIj5cIiwgXCLigqxcIiwgXCLCo1wiLCBcIsKlXCIsIFwi4oCiXCIsIFwiLlwiLCAnLCcsIFwiP1wiLCBcIiFcIiwgXCInXCIsIFwiXFxcIlwiXVxuXHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdGxldHRlcnNBcnJheS5wdXNoIFwiLFwiXG5cdFx0bGV0dGVyc0FycmF5LnB1c2ggXCIuXCJcblxuXHQjTnVtYmVycyB0byBiZSBtYWRlIChkZXBlbmRpbmcgb24gZGV2aWNlKVxuXHRudW1zQXJyYXkgPSBbMC4uOV1cblxuXHQjSG9sZHMgdGhlIGtleXMgdGhhdCB3ZSBtYWtlLiBUaGlzIHdpbGwgYWxsb3dzIHVzIHRvIHF1aWNrbHkgaXRlcmF0ZSB0aHJvdWdoIHRoZW0uIFxuXHRrZXlzQXJyYXkgPSBbXVxuXG5cdGtleVBvcFVwID0gbmV3IExheWVyIHdpZHRoOkBrZXlXaWR0aCwgaGVpZ2h0OkBrZXlIZWlnaHQsIHg6QC54LTE2KmV4cG9ydHMuc2NhbGUsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJrZXkgcG9wIHVwXCJcblx0Ym94ID0gbmV3IExheWVyIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKSwgc3VwZXJMYXllcjprZXlQb3BVcCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgY29sb3I6XCJibGFja1wiLCBuYW1lOlwibGV0dGVyXCJcblx0Ym94LnN0eWxlID0ge1xuXHRcdFwiZm9udC1zaXplXCIgOiAzOSAqIGV4cG9ydHMuc2NhbGUgKyBcInB4XCJcblx0XHRcImZvbnQtd2VpZ2h0XCIgOiAzMDBcblx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdCdsaW5lLWhlaWdodCcgOiBAbGluZUhlaWdodFxuXHR9XG5cdEAuY29sb3IgPSBcIndoaXRlXCJcblx0cGF0aCA9IG5ldyBMYXllciBzdXBlckxheWVyOmtleVBvcFVwLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwic2hhcGUgcGF0aFwiXG5cdGJvYXJkLmtleVBvcFVwID0ga2V5UG9wVXBcblx0Ym9hcmQua2V5UG9wVXAuYm94ID0gYm94XG5cblx0cm93c01hcCA9IFtcblx0XHR7IFxuXHRcdFx0XCJwYWRkaW5nXCIgOiBib2FyZFNwZWNzLnBhZGRpbmcucm93MVxuXHRcdFx0XCJzdGFydEluZGV4XCIgOiAwXG5cdFx0XHRcImVuZEluZGV4XCIgOiA5XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MVxuXHRcdH0sXG5cdFx0eyBcblx0XHRcdFwicGFkZGluZ1wiIDogYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzJcblx0XHRcdFwic3RhcnRJbmRleFwiIDogMTBcblx0XHRcdFwiZW5kSW5kZXhcIiA6IDE4XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MlxuXHRcdH0sXG5cdFx0eyBcblx0XHRcdFwicGFkZGluZ1wiIDogYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzNcblx0XHRcdFwic3RhcnRJbmRleFwiIDogMTlcblx0XHRcdFwiZW5kSW5kZXhcIiA6IDI1XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93M1xuXHRcdH1cblx0XVxuXG5cdGZpcnN0Um93S2V5V2lkdGggPSAwXG5cdHNlY29uZFJvd0tleVdpZHRoID0gMFxuXG5cdGJvYXJkLmtleXMgPSB7fVxuXHRmb3IgbGV0dGVyIGluIGxldHRlcnNBcnJheVxuXHRcdGluZGV4ID0gbGV0dGVyc0FycmF5LmluZGV4T2YobGV0dGVyKSBcblx0XHRrZXkgPSBuZXcgTGF5ZXIgbmFtZTpsZXR0ZXIsIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czo1KmV4cG9ydHMuc2NhbGUsIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCIsIGNvbG9yOlwiYmxhY2tcIiwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgd2lkdGg6Ym9hcmRTcGVjcy5rZXkud2lkdGgsIGhlaWdodDpib2FyZFNwZWNzLmtleS5oZWlnaHRcblx0XHRib2FyZC5rZXlzW2xldHRlcl0gPSBrZXlcblx0XHRrZXlQb3BVcC5icmluZ1RvRnJvbnQoKVxuXHRcdGJveC5icmluZ1RvRnJvbnQoKVxuXHRcdGlmIGV4cG9ydHMuc2NhbGUgPT0gMlxuXHRcdFx0a2V5UG9wVXAuY29uc3RyYWludHMgPSAod2lkdGg6NjUsIGhlaWdodDoxMjIpXG5cdFx0XHRwYXRoLmNvbnN0cmFpbnRzID0gKHdpZHRoOjY1LCBoZWlnaHQ6IDEyMilcblx0XHRcdHBhdGgueSA9IDEwXG5cdFx0XHRAcGF0aFdpZHRoID0gZXhwb3J0cy5weCg2NSlcblx0XHRcdEBwYXRoSGVpZ2h0ID0gZXhwb3J0cy5weCgxMjIpXG5cdFx0XHRAa2V5SGVpZ2h0ID0gZXhwb3J0cy5weCgzMilcblx0XHRcdEBrZXlXaWR0aCA9IGV4cG9ydHMucHgoNDQpXG5cdFx0XHRAbGluZUhlaWdodCA9IEBrZXlXaWR0aCAtIDE3ICsgXCJweFwiXG5cdFx0XHRib3guY29uc3RyYWludHMgPSAod2lkdGg6MzIsIGhlaWdodDo0NClcblx0XHRcdGJveC5jZW50ZXJYKClcblx0XHRcdGJveC55ID0gZXhwb3J0cy5weCgyOClcblxuXHRcdGlmIGV4cG9ydHMuc2NhbGUgPT0gM1xuXHRcdFx0a2V5UG9wVXAuY29uc3RyYWludHMgPSAod2lkdGg6NjgsIGhlaWdodDoxMjIpXG5cdFx0XHRAa2V5SGVpZ2h0ID0gZXhwb3J0cy5weCgxMjIpXG5cdFx0XHRAa2V5V2lkdGggPSBleHBvcnRzLnB4KDY1KVxuXHRcdFx0QGxpbmVIZWlnaHQgPSBAa2V5V2lkdGggKyBcInB4XCJcblx0XHRcdEBwYXRoV2lkdGggPSBleHBvcnRzLnB4KDY4KVxuXHRcdFx0QHBhdGhIZWlnaHQgPSBleHBvcnRzLnB4KDEyOClcblx0XHRcdHBhdGgueSA9IDBcblxuXG5cdFx0XHRib3guY29uc3RyYWludHMgPSAod2lkdGg6MzUsIGhlaWdodDo0Nilcblx0XHRcdGJveC5jZW50ZXJYKClcblx0XHRcdGJveC55ID0gZXhwb3J0cy5weCgyOClcblxuXHRcdGlmIGV4cG9ydHMud2lkdGggPT0gNjQwXG5cdFx0XHRrZXkuY29uc3RyYWludHMgPSAod2lkdGg6MjYsIGhlaWdodDozOSlcblxuXHRcdGtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGtleS5zdHlsZSA9IHtcblx0XHRcdFwiZm9udC1zaXplXCIgOiAyNSAqIGV4cG9ydHMuc2NhbGUgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDMwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGtleS5oZWlnaHQgLSBleHBvcnRzLnB4KDIpICsgXCJweFwiXG5cdFx0fVxuXHRcdGlmIGxldHRlciA9PSBcIixcIiB8fCBsZXR0ZXIgPT0gXCIuXCJcblx0XHRcdGV4dHJhU3ltYm9sID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6a2V5LCB3aWR0aDpleHBvcnRzLnB4KDMwKSwgaGVpZ2h0OmV4cG9ydHMucHgoMzApLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCB5OmV4cG9ydHMucHgoMTUpLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIG5hbWU6XCIhLz9cIlxuXHRcdFx0ZXh0cmFTeW1ib2wuY2VudGVyWCgpXG5cdFx0XHRleHRyYVN5bWJvbC5zdHlsZSA9IHtcblx0XHRcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMjQpICsgXCJweFwiXG5cdFx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDMwMFxuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHRcdFx0J3RleHQtYWxpZ24nIDogJ2NlbnRlcidcblx0XHRcdFx0J2xpbmUtaGVpZ2h0JyA6IFwiMjBweFwiXG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCBsZXR0ZXJcblx0XHRcdFx0d2hlbiBcIixcIiB0aGVuIGV4dHJhU3ltYm9sLmh0bWwgPSBcIiFcIlxuXHRcdFx0XHR3aGVuIFwiLlwiIHRoZW4gZXh0cmFTeW1ib2wuaHRtbCA9IFwiP1wiXG5cdFx0XHRrZXkuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IGtleS5oZWlnaHQgKyBleHBvcnRzLnB4KDEwKSArIFwicHhcIlxuXG5cdFx0a2V5Lmh0bWwgPSBsZXR0ZXJcblx0XHRcblx0XHRpZiBpbmRleCA8PSByb3dzTWFwWzBdLmVuZEluZGV4XG5cdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFswXS5zdGFydEluZGV4XG5cdFx0XHRrZXkueCA9IHJvd3NNYXBbMF0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAoZmlyc3RSb3dLZXlXaWR0aClcblx0XHRcdGtleS55ID0gcm93c01hcFswXS5tYXJnaW5Ub3Bcblx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdCNIYW5kbGUgdGhlIGV4dHJhIHBpeGVscyBvbiB0aGUgdG9wIHJvd1xuXHRcdFx0XHRpZiBpbmRleCAlIDIgIT0gMFxuXHRcdFx0XHRcdGtleS53aWR0aCA9IGtleS53aWR0aCArIGV4cG9ydHMucHgoMilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGtleS53aWR0aCA9IGtleS53aWR0aCArIGV4cG9ydHMucHgoMSlcblx0XHRcdGZpcnN0Um93S2V5V2lkdGggPSBmaXJzdFJvd0tleVdpZHRoICsga2V5LndpZHRoXG5cdFx0aWYgaW5kZXggPiByb3dzTWFwWzBdLmVuZEluZGV4ICYmIGluZGV4IDw9IHJvd3NNYXBbMV0uZW5kSW5kZXhcblx0XHRcdHJvd0luZGV4ID0gaW5kZXggLSByb3dzTWFwWzFdLnN0YXJ0SW5kZXhcblx0XHRcdGtleS54ID0gcm93c01hcFsxXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChzZWNvbmRSb3dLZXlXaWR0aClcblx0XHRcdGtleS55ID0gcm93c01hcFsxXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0XG5cdFx0XHRrZXkud2lkdGggPSBrZXkud2lkdGggKyBleHBvcnRzLnB4KDEpXG5cdFx0XHRzZWNvbmRSb3dLZXlXaWR0aCA9IHNlY29uZFJvd0tleVdpZHRoICsga2V5LndpZHRoXG5cdFx0aWYgaW5kZXggPiByb3dzTWFwWzFdLmVuZEluZGV4XG5cdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFsyXS5zdGFydEluZGV4XG5cdFx0XHRrZXkueCA9IHJvd3NNYXBbMl0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAocm93SW5kZXgqa2V5LndpZHRoKVxuXHRcdFx0a2V5LnkgPSByb3dzTWFwWzJdLm1hcmdpblRvcCArIGtleS5oZWlnaHQgKiAyXG5cblx0XHRwYXRoLmh0bWwgPSBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tAcGF0aFdpZHRofXB4JyBoZWlnaHQ9JyN7QHBhdGhIZWlnaHR9JyB2aWV3Qm94PScwIDAgNjMgMTE0JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PHRpdGxlPlJlY3RhbmdsZSA0NCBDb3B5PC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPlxuXHRcdFx0XHRcdDxmaWx0ZXIgeD0nLTUwJScgeT0nLTUwJScgd2lkdGg9JzIwMCUnIGhlaWdodD0nMjAwJScgZmlsdGVyVW5pdHM9J29iamVjdEJvdW5kaW5nQm94JyBpZD0nZmlsdGVyLTEnPlxuXHRcdFx0XHRcdFx0PGZlT2Zmc2V0IGR4PScwJyBkeT0nMCcgaW49J1NvdXJjZUFscGhhJyByZXN1bHQ9J3NoYWRvd09mZnNldE91dGVyMSc+PC9mZU9mZnNldD5cblx0XHRcdFx0XHRcdDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249JzEuNScgaW49J3NoYWRvd09mZnNldE91dGVyMScgcmVzdWx0PSdzaGFkb3dCbHVyT3V0ZXIxJz48L2ZlR2F1c3NpYW5CbHVyPlxuXHRcdFx0XHRcdFx0PGZlQ29sb3JNYXRyaXggdmFsdWVzPScwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjEgMCcgaW49J3NoYWRvd0JsdXJPdXRlcjEnIHR5cGU9J21hdHJpeCcgcmVzdWx0PSdzaGFkb3dNYXRyaXhPdXRlcjEnPjwvZmVDb2xvck1hdHJpeD5cblx0XHRcdFx0XHRcdDxmZU1lcmdlPlxuXHRcdFx0XHRcdFx0XHQ8ZmVNZXJnZU5vZGUgaW49J3NoYWRvd01hdHJpeE91dGVyMSc+PC9mZU1lcmdlTm9kZT5cblx0XHRcdFx0XHRcdFx0PGZlTWVyZ2VOb2RlIGluPSdTb3VyY2VHcmFwaGljJz48L2ZlTWVyZ2VOb2RlPlxuXHRcdFx0XHRcdFx0PC9mZU1lcmdlPlxuXHRcdFx0XHRcdDwvZmlsdGVyPlxuXHRcdFx0XHQ8L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNicgc2tldGNoOnR5cGU9J01TQXJ0Ym9hcmRHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTExOC4wMDAwMDAsIC0yNDAuMDAwMDAwKScgc3Ryb2tlPScjQzdDN0M3JyBmaWx0ZXI9J3VybCgjZmlsdGVyLTEpJyBzdHJva2Utd2lkdGg9JzAuNScgXG5cdFx0XHRcdFx0ZmlsbD0nI0ZGRkZGRicgb3BhY2l0eT0nMC45OTgzNjc1MzcnPlxuXHRcdFx0XHRcdCA8cGF0aCBkPSdNMTM0LDMwNiBDMTM0LDMwNiAxMjEsMjk1IDEyMSwyOTAgQzEyMSwyNzkuNjE2Nzg4IDEyMSwyNTMuMDAxNDU2IDEyMSwyNTMuMDAxNDU2IEMxMjEsMjQ3LjQ3NzgwNCAxMjUuNDg1ODMyLDI0MyAxMzEuMDAyNzc0LDI0MyBMMTY3Ljg2MjEyNywyNDMgQzE3My4zODY1MDcsMjQzIDE3Ny44ODA4NjIsMjQ3LjQ2OTkwNSBcblx0XHRcdFx0XHQgMTc3LjkwMDA0NCwyNTIuOTk3MjcxIEMxNzcuOTAwMDQ0LDI1Mi45OTcyNzEgMTc4LDI4MCAxNzcuOTk5OTk5LDI5MCBDMTc3Ljk5OTk5OSwyOTUuMDA2NTUzIDE2NSwzMDYgMTY1LDMwNiBMMTY1LDM0Ni4wNDk1OTQgXG5cdFx0XHRcdFx0IEMxNjUsMzQ4LjgwNjgwNyAxNjIuNzcwNTU2LDM1MS4wNDE5NjkgMTYwLjAwMjA5OCwzNTEuMDQxOTY5IEwxMzguOTk3OTAyLDM1MS4wNDE5NjkgXG5cdFx0XHRcdFx0ICBDMTM2LjIzNzYzNywzNTEuMDQxOTY5IDEzNCwzNDguODA4MzMxIDEzNCwzNDYuMDQ5NTk0IEwxMzQsMzA2IFonIGlkPSdSZWN0YW5nbGUtNDQtQ29weScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTQ5LjUwMDAwMCwgMjk3LjAyMDk4NSkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMTQ5LjUwMDAwMCwgLTI5Ny4wMjA5ODUpICc+XG5cdFx0XHRcdFx0ICA8L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRcdGtleXNBcnJheS5wdXNoIGtleVxuXG5cdFx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCIgJiYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkLXByb1wiXG5cdFx0XHQjIyBpUGhvbmUgS2V5IEFuaW1hdGlvbnNcblx0XHRcdGtleS5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0a2V5UG9wVXAudmlzaWJsZSA9IHRydWVcdFxuXHRcdFx0XHRib3guaHRtbCA9IEAubmFtZVxuXHRcdFx0XHRrZXlQb3BVcC5tYXhZID0gQC5tYXhZXG5cdFx0XHRcdGtleVBvcFVwLm1pZFggPSBALm1pZFhcblxuXHRcdFx0a2V5Lm9uIEV2ZW50cy5Ub3VjaE1vdmUsIC0+XG5cdFx0XHRcdGJveC5odG1sID0gQC5uYW1lXG5cdFx0XHRcdGtleVBvcFVwLm1heFkgPSBALm1heFlcblx0XHRcdFx0a2V5UG9wVXAubWlkWCA9IEAubWlkWFx0XG5cblx0XHRcdGtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0ZWxzZSBcblx0XHRcdCNpUGFkIEtleSBBbmltYXRpb25zXG5cdFx0XHRrZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0XHRcdEAuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0a2V5Lm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0QC5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblxuXHRcdGtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRpZiBzaGlmdEljb24uc3RhdGVzLnN0YXRlID09IFwib25cIlxuXHRcdFx0XHRzaGlmdEljb24uc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRcdFx0c2hpZnRLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXG5cdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0c2hpZnRJY29uMi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cblx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRrZXkuc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAnbG93ZXJjYXNlJ1xuXHRcdFx0XHRib3guc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAnbG93ZXJjYXNlJ1xuXG5cdFx0XHRcdGlmIHNldHVwLm91dHB1dFxuXHRcdFx0XHRcdEBuZXdUZXh0ID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbCArIEAubmFtZS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0OkBuZXdUZXh0XSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRcdFx0QG5ld1RleHQgPSBzZXR1cC5vdXRwdXQudGV4dC5odG1sICsgQC5uYW1lXG5cdFx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0OkBuZXdUZXh0XSlcblxuXHRib2FyZC5rZXlzQXJyYXkgPSBrZXlzQXJyYXlcblxuXHRib2FyZC5rZXlib2FyZFN0YXRlID0gMVxuXG5cdCMjIFNISUZUIEtFWVxuXG5cdHNoaWZ0S2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJzaGlmdFwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXksIGhlaWdodDpib2FyZFNwZWNzLnNpZGVLZXksIHk6KGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzMgKyBib2FyZFNwZWNzLmtleS5oZWlnaHQgKiAyKVxuXHRzaGlmdEtleS5jb25zdHJhaW50cyA9IChsZWFkaW5nOmV4cG9ydHMucHQoYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzEpKVxuXHRzaGlmdEljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjpzaGlmdEtleSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLnNoaWZ0SWNvbi54LCB5OmJvYXJkU3BlY3Muc2hpZnRJY29uLnlcblx0c2hpZnRJY29uLmh0bWwgPSBpY29uTGlicmFyeS5zaGlmdC5vZmZcblxuXHRzaGlmdEljb24uc3RhdGVzLmFkZFxuXHRcdFwib25cIjpcblx0XHRcdGh0bWw6IGljb25MaWJyYXJ5LnNoaWZ0Lm9uXG5cdHNoaWZ0SWNvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdCAgdGltZTogLjAxXG5cblx0c2hpZnRLZXkuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdFx0fVxuXG5cblxuXHRzaGlmdEtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGUgXG5cdFx0XHR3aGVuIDFcblx0XHRcdFx0c2hpZnRJY29uLnN0YXRlcy5uZXh0KClcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzaGlmdEljb24yLnN0YXRlcy5uZXh0KClcblx0XHRcdFx0aWYgc2hpZnRJY29uLnN0YXRlcy5zdGF0ZSA9PSBcIm9uXCJcblx0XHRcdFx0XHRzaGlmdEtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlx0XG5cdFx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS5zdHlsZVsndGV4dC10cmFuc2Zvcm0nXSA9ICd1cHBlcmNhc2UnXG5cdFx0XHRcdFx0Ym94LnN0eWxlWyd0ZXh0LXRyYW5zZm9ybSddID0gJ3VwcGVyY2FzZSdcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRzaGlmdEtleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0XHRib3guc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXSA9ICdsb3dlcmNhc2UnXG5cdFx0XHR3aGVuIDJcblx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0a2V5Lmh0bWwgPSB0aGlyZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdGtleS5uYW1lID0gdGhpcmRBcnJheVtpbmRleF1cblx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDNcblx0XHRcdFx0c2hpZnRLZXkuaHRtbCA9IFwiMTIzXCJcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiMTIzXCJcblx0XHRcdHdoZW4gM1xuXHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRpZiBpbmRleCA8IDI3XG5cdFx0XHRcdFx0XHRrZXkubmFtZSA9IHNlY29uZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0a2V5Lmh0bWwgPSBzZWNvbmRBcnJheVtpbmRleF1cblx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXG5cdGJvYXJkLmtleXMuc2hpZnQgPSBzaGlmdEtleVxuXHRib2FyZC5rZXlzLnNoaWZ0Lmljb24gPSBzaGlmdEljb25cblxuXHQjIyBERUxFVEUgS0VZXG5cblx0ZGVsZXRlS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czpib2FyZFNwZWNzLnNpZGVLZXlSYWRpdXMsIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCBuYW1lOlwiZGVsZXRlXCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleSwgaGVpZ2h0OmJvYXJkU3BlY3Muc2lkZUtleSwgeTooYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyArIGJvYXJkU3BlY3Mua2V5LmhlaWdodCAqIDIgLSBib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQpXG5cblxuXHRkZWxldGVLZXkuY29uc3RyYWludHMgPSAodHJhaWxpbmc6ZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcikvMilcblx0ZGVsZXRlSWNvbiA9IG5ldyBMYXllciBzdXBlckxheWVyOmRlbGV0ZUtleSwgd2lkdGg6ZXhwb3J0cy5weCgyNCksIGhlaWdodDpleHBvcnRzLnB4KDE4KSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLmRlbGV0ZUljb24ueCwgeTpib2FyZFNwZWNzLmRlbGV0ZUljb24ueVxuXHRcblx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRkZWxldGVLZXkud2lkdGggPSBkZWxldGVLZXkud2lkdGggKyBleHBvcnRzLnB4KDUpXG5cblx0ZGVsZXRlSWNvbi5zdGF0ZXMuYWRkIFxuXHRcdFwib25cIjogXG5cdFx0XHRodG1sOiBpY29uTGlicmFyeS5kZWxldGUub25cblxuXHRkZWxldGVJY29uLnN0YXRlcy5hZGRcblx0XHRvZmY6IFxuXHRcdFx0aHRtbDogaWNvbkxpYnJhcnkuZGVsZXRlLm9mZlxuXG5cblx0ZGVsZXRlS2V5Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdGRlbGV0ZUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRkZWxldGVJY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblxuXHRkZWxldGVLZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdGRlbGV0ZUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0ZGVsZXRlSWNvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcIm9mZlwiKVxuXG5cdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRpbml0aWFsTGVuZ3RoID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5sZW5ndGhcblx0XHRcdG5ld1RleHQgPSBzZXR1cC5vdXRwdXQudGV4dC5odG1sLnNsaWNlKDAsIC0xKVxuXHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0ZW5kTGVuZ3RoID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5sZW5ndGhcblx0XHRcdGlmIGluaXRpYWxMZW5ndGggPT0gZW5kTGVuZ3RoIFxuXHRcdFx0XHRuZXdUZXh0ID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5zbGljZSgwLCAtNilcblx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0aWYgc2V0dXAub3V0cHV0LnRleHQuaHRtbCA9PSBcIlwiXG5cdFx0XHRcdHNldHVwLm91dHB1dC5wbGFjZWhvbGRlci52aXNpYmxlID0gdHJ1ZVxuXG5cblxuXHRkZWxldGVJY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib2ZmXCIpXG5cblx0Ym9hcmQua2V5cy5kZWxldGUgPSBkZWxldGVLZXlcblx0Ym9hcmQua2V5cy5kZWxldGUuaWNvbiA9IGRlbGV0ZUljb25cblxuXHQjIyBFWFRSQSBLRVlTXG5cblx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRrZXlib2FyZEtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBuYW1lOlwiZGlzbWlzc1wiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgd2lkdGg6Ym9hcmRTcGVjcy5zaWRlS2V5LCBoZWlnaHQ6Ym9hcmRTcGVjcy5zaWRlS2V5XG5cdFx0a2V5Ym9hcmRLZXkuY29uc3RyYWludHMgPSB7dHJhaWxpbmdFZGdlczpkZWxldGVLZXksIGJvdHRvbTpib2FyZFNwZWNzLmJvdHRvbVJvd31cblx0XHRrZXlib2FyZEljb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjprZXlib2FyZEtleSwgd2lkdGg6ZXhwb3J0cy5weCgzMi41KSwgaGVpZ2h0OmV4cG9ydHMucHgoMjMuNSksIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRrZXlib2FyZEljb24uaHRtbCA9IGljb25MaWJyYXJ5LmtleWJvYXJkXG5cdFx0a2V5Ym9hcmRJY29uLmNlbnRlcigpXG5cblx0XHRib2FyZC5rZXlzLmRpc21pc3MgPSBrZXlib2FyZEtleVxuXG5cdFx0c2hpZnRLZXkyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJzaGlmdFwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLGNvbG9yOmV4cG9ydHMuY29sb3IoXCJibGFja1wiKSwgYmFja2dyb3VuZENvbG9yOmV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIiksIHNoYWRvd1k6ZXhwb3J0cy5weCgxKSwgc2hhZG93Q29sb3I6XCIjOTI5NDk4XCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleTIsIGhlaWdodDpib2FyZFNwZWNzLnNpZGVLZXlcblx0XHRzaGlmdEtleTIuY29uc3RyYWludHMgPSAodHJhaWxpbmdFZGdlczpkZWxldGVLZXksIGJvdHRvbUVkZ2VzOnNoaWZ0S2V5KVxuXHRcdHNoaWZ0SWNvbjIgPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjpzaGlmdEtleTIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIHg6Ym9hcmRTcGVjcy5zaGlmdEljb24ueCtleHBvcnRzLnB4KDEwKSwgeTpib2FyZFNwZWNzLnNoaWZ0SWNvbi55XG5cdFx0c2hpZnRJY29uMi5odG1sID0gaWNvbkxpYnJhcnkuc2hpZnQub2ZmXG5cblx0XHRzaGlmdEtleTIuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IChib2FyZFNwZWNzLmtleS5oZWlnaHQpICsgXCJweFwiXG5cblx0XHR9XG5cblxuXHRcdHNoaWZ0SWNvbjIuc3RhdGVzLmFkZFxuXHRcdFx0XCJvblwiOlxuXHRcdFx0XHRodG1sOiBpY29uTGlicmFyeS5zaGlmdC5vblxuXHRcdHNoaWZ0SWNvbjIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdCAgdGltZTogLjAxXG5cblx0XHRzaGlmdEljb24yLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGUgXG5cdFx0XHRcdHdoZW4gMVxuXHRcdFx0XHRcdHNoaWZ0SWNvbi5zdGF0ZXMubmV4dCgpXG5cdFx0XHRcdFx0c2hpZnRJY29uMi5zdGF0ZXMubmV4dCgpXG5cdFx0XHRcdFx0aWYgc2hpZnRJY29uLnN0YXRlcy5zdGF0ZSA9PSBcIm9uXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlx0XG5cdFx0XHRcdFx0XHRmb3Iga2V5IGluIGtleXNBcnJheVxuXHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAndXBwZXJjYXNlJ1xuXHRcdFx0XHRcdFx0Ym94LnN0eWxlWyd0ZXh0LXRyYW5zZm9ybSddID0gJ3VwcGVyY2FzZSdcblx0XHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdFx0c2hpZnRLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIilcblx0XHRcdFx0XHRcdGZvciBrZXkgaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0XHRcdGJveC5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0d2hlbiAyXG5cdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrZXkuaHRtbCA9IHRoaXJkQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRrZXkubmFtZSA9IHRoaXJkQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDNcblx0XHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIxMjNcIlxuXHRcdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiMTIzXCJcblx0XHRcdFx0d2hlbiAzXG5cdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRpZiBpbmRleCA8IDI3XG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRcdHNoaWZ0S2V5Lmh0bWwgPSBcIiMrPVwiXG5cdFx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRcdGJvYXJkLmtleWJvYXJkU3RhdGUgPSAyXG5cblxuXHRcdG51bUtleTIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpib2FyZCwgbmFtZTpcIm51bVwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXkyLCBoZWlnaHQ6Ym9hcmRTcGVjcy5rZXkuaGVpZ2h0XG5cdFx0bnVtS2V5Mi5odG1sID0gXCIuPzEyM1wiXG5cdFx0bnVtS2V5Mi5zdHlsZSA9IHtcblx0XHRcdFwiZm9udC1zaXplXCIgOiBleHBvcnRzLnB4KDE2KSArIFwicHhcIlxuXHRcdFx0XCJmb250LXdlaWdodFwiIDogNDAwXG5cdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHRcdCd0ZXh0LWFsaWduJyA6ICdjZW50ZXInXG5cdFx0XHQnbGluZS1oZWlnaHQnIDogYm9hcmRTcGVjcy5rZXkuaGVpZ2h0ICsgXCJweFwiXG5cblx0XHR9XG5cdFx0bnVtS2V5Mi5jb25zdHJhaW50cyA9IHt0cmFpbGluZzpba2V5Ym9hcmRLZXksIDEyXSwgYm90dG9tRWRnZXM6a2V5Ym9hcmRLZXl9XG5cblx0XHRudW1LZXkyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGVcblx0XHRcdFx0d2hlbiAxXG5cdFx0XHRcdFx0IyMgQ2hhbmdlIExldHRlcnNcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGlmIGluZGV4IDwgMjdcblx0XHRcdFx0XHRcdFx0aWYgc2Vjb25kQXJyYXlbaW5kZXhdID09IFwidW5kb1wiXG5cdFx0XHRcdFx0XHRcdFx0a2V5LndpZHRoID0ga2V5LndpZHRoICogMiArIGJvYXJkU3BlY3Muc3BhY2VyXG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC1zaXplXCJdID0gZXhwb3J0cy5weCgxNykgKyBcInB4XCJcblx0XHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbXCJmb250LXdlaWdodFwiXSA9IDQwMFxuXHRcdFx0XHRcdFx0XHRpZiBzZWNvbmRBcnJheVtpbmRleF0gPT0gXCJoaWRlXCJcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXG5cdFx0XHRcdFx0IyMgSGFuZGxlIG51bSBrZXlzIGFuZCBzaGlmdCBrZXlzXG5cdFx0XHRcdFx0bnVtS2V5Lmh0bWwgPSBcIkFCQ1wiXG5cdFx0XHRcdFx0c2hpZnRLZXkuaHRtbCA9IFwiIys9XCJcblx0XHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdFx0c2hpZnRJY29uMi52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRcdFx0bnVtS2V5Mi5odG1sID0gXCJBQkNcIlxuXHRcdFx0XHRcdGJvYXJkLmtleWJvYXJkU3RhdGUgPSAyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGlmIGtleS5odG1sID09IFwidW5kb1wiIHx8IFwicmVkb1wiXG5cdFx0XHRcdFx0XHRcdGtleS53aWR0aCA9IGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IGV4cG9ydHMucHgoMjUpICsgXCJweFwiXG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtd2VpZ2h0XCJdID0gMzAwXG5cdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRcdGtleS5uYW1lID0gbGV0dGVyc0FycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0a2V5Lmh0bWwgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+IDI1XG5cdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCJcIlxuXHRcdFx0XHRcdHNoaWZ0SWNvbi52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRudW1LZXkuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdFx0bnVtS2V5Mi5odG1sID0gXCIuPzEyM1wiXG5cdFx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiXCJcblx0XHRcdFx0XHRcdHNoaWZ0SWNvbjIudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMVxuXG5cblx0IyMgTlVNIEtFWSB0b3A6ZXhwb3J0cy5wdChib2FyZFNwZWNzLm1hcmdpblRvcC5yb3c0ICsgYm9hcmRTcGVjcy5rZXkuaGVpZ2h0KjMpXG5cblx0bnVtS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJudW1cIiwgYm9yZGVyUmFkaXVzOmV4cG9ydHMucHgoNSksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCBjb2xvcjpcImJsYWNrXCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleSwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRudW1LZXkuY29uc3RyYWludHMgPSAoYm90dG9tOmJvYXJkU3BlY3MuYm90dG9tUm93LCBsZWFkaW5nRWRnZXM6c2hpZnRLZXkpXG5cdGlmIGV4cG9ydHMuZGV2aWNlICE9IFwiaXBhZFwiICYmIGV4cG9ydHMuZGV2aWNlICE9IFwiaXBhZC1wcm9cIlxuXHRcdG51bUtleS5odG1sID0gXCIxMjNcIlxuXHRlbHNlIFxuXHRcdG51bUtleS5odG1sID0gXCIuPzEyM1wiXG5cdG51bUtleS5zdHlsZSA9IHtcblx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcImZvbnQtd2VpZ2h0XCIgOiA0MDBcblx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdCdsaW5lLWhlaWdodCcgOiBib2FyZFNwZWNzLmtleS5oZWlnaHQgKyBcInB4XCJcblx0fVxuXG5cdG51bUtleS5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRzd2l0Y2ggYm9hcmQua2V5Ym9hcmRTdGF0ZVxuXHRcdFx0d2hlbiAxXG5cdFx0XHRcdCMjIENoYW5nZSBMZXR0ZXJzXHRcdFxuXHRcdFx0XHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2Vcblx0XHRcdFx0XHR3aGVuIFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdFx0aWYgaW5kZXggPCAyN1xuXHRcdFx0XHRcdFx0XHRcdGlmIHNlY29uZEFycmF5W2luZGV4XSA9PSBcInVuZG9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5LndpZHRoID0ga2V5LndpZHRoICogMiArIGJvYXJkU3BlY3Muc3BhY2VyXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbXCJmb250LXNpemVcIl0gPSBleHBvcnRzLnB4KDE3KSArIFwicHhcIlxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC13ZWlnaHRcIl0gPSA0MDBcblx0XHRcdFx0XHRcdFx0XHRpZiBzZWNvbmRBcnJheVtpbmRleF0gPT0gXCJoaWRlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGtleS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRrZXkubmFtZSA9IHNlY29uZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdFx0aWYgaW5kZXggPT0gMjZcblx0XHRcdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRzaGlmdEljb24yLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmh0bWwgPSBcIiMrPVwiXG5cdFx0XHRcdFx0XHRudW1LZXkyLmh0bWwgPSBcIkFCQ1wiXG5cdFx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJvd0luZGV4ID0gMCBcblx0XHRcdFx0XHRcdHNlY29uZFJvd0tleVdpZHRoID0gMFxuXHRcdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDE5XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnkgPSByb3dzTWFwWzFdLm1hcmdpblRvcCArIGtleS5oZWlnaHRcblx0XHRcdFx0XHRcdFx0IyMgMm5kIFJvd1xuXHRcdFx0XHRcdFx0XHRpZiBpbmRleCA+IDkgJiYgaW5kZXggPCAyMFxuXHRcdFx0XHRcdFx0XHRcdGtleS54ID0gcm93c01hcFswXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChzZWNvbmRSb3dLZXlXaWR0aClcblx0XHRcdFx0XHRcdFx0XHRyb3dJbmRleCsrXG5cdFx0XHRcdFx0XHRcdFx0c2Vjb25kUm93S2V5V2lkdGggPSBzZWNvbmRSb3dLZXlXaWR0aCArIGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDIwXG5cdFx0XHRcdFx0XHRcdFx0a2V5LmNvbnN0cmFpbnRzID0ge2xlYWRpbmc6W3NoaWZ0S2V5LCBleHBvcnRzLnB0KGJvYXJkU3BlY3MuZXhwYW5kZWRTcGFjZXIpXX1cblx0XHRcdFx0XHRcdFx0XHRleHBvcnRzLmxheW91dCgpXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMTlcblx0XHRcdFx0XHRcdFx0XHRrZXkud2lkdGggPSBib2FyZFNwZWNzLmV4cGFuZGVkS2V5XG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMjBcblx0XHRcdFx0XHRcdFx0XHRrZXkuY29uc3RyYWludHMgPSB7bGVhZGluZzpba2V5c0FycmF5W2luZGV4IC0gMV0sIGV4cG9ydHMucHQoYm9hcmRTcGVjcy5zcGFjZXIpXX1cblx0XHRcdFx0XHRcdFx0XHRleHBvcnRzLmxheW91dCgpXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMjRcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXG5cblx0XHRcdFx0IyMgSGFuZGxlIG51bSBrZXlzIGFuZCBzaGlmdCBrZXlzXG5cdFx0XHRcdG51bUtleS5odG1sID0gXCJBQkNcIlxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzZWNvbmRSb3dLZXlXaWR0aCA9IDBcblx0XHRcdFx0XHRyb3dJbmRleCA9IDBcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS53aWR0aCA9IGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+IDkgJiYgaW5kZXggPCAxOVxuXHRcdFx0XHRcdFx0XHRrZXkueCA9IHJvd3NNYXBbMV0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAoc2Vjb25kUm93S2V5V2lkdGgpXG5cdFx0XHRcdFx0XHRcdGtleS55ID0gcm93c01hcFsxXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0XG5cdFx0XHRcdFx0XHRcdHJvd0luZGV4Kytcblx0XHRcdFx0XHRcdFx0c2Vjb25kUm93S2V5V2lkdGggPSBzZWNvbmRSb3dLZXlXaWR0aCArIGtleS53aWR0aFxuXHRcdFx0XHRcdFx0aWYgaW5kZXggPT0gMTlcblx0XHRcdFx0XHRcdFx0a2V5LnkgPSByb3dzTWFwWzJdLm1hcmdpblRvcCArIGtleS5oZWlnaHQgKiAyXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+PSAxOVxuXHRcdFx0XHRcdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFsyXS5zdGFydEluZGV4XG5cdFx0XHRcdFx0XHRcdGtleS54ID0gcm93c01hcFsyXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChyb3dJbmRleCprZXkud2lkdGgpXG5cdFx0XHRcdFx0XHRcdGtleS55ID0gcm93c01hcFsyXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0ICogMlxuXHRcdFx0XHRcdFx0XHRrZXkuY29uc3RyYWludHMgPSB7fVxuXG5cdFx0XHRcdGZvciBrZXksIGluZGV4IGluIGtleXNBcnJheVxuXHRcdFx0XHRcdGlmIGtleS5odG1sID09IFwidW5kb1wiIHx8IFwicmVkb1wiXG5cdFx0XHRcdFx0XHRrZXkud2lkdGggPSBib2FyZFNwZWNzLmtleS53aWR0aFxuXHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC1zaXplXCJdID0gZXhwb3J0cy5weCgyNSkgKyBcInB4XCJcblx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtd2VpZ2h0XCJdID0gMzAwXG5cdFx0XHRcdFx0a2V5LnZpc2libGUgPSB0cnVlXG5cdFx0XHRcdFx0a2V5Lm5hbWUgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0a2V5Lmh0bWwgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0aWYgaW5kZXggPiAyNVxuXHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCJcIlxuXHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IHRydWVcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRudW1LZXkuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdG51bUtleTIuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCJcIlxuXHRcdFx0XHRcdHNoaWZ0SWNvbjIudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDFcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHQjIyBFTU9KSSBLRVlcblxuXHRlbW9qaUtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBuYW1lOlwiZW1vamlcIiwgYm9yZGVyUmFkaXVzOmV4cG9ydHMucHgoNSksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXksIGhlaWdodDpib2FyZFNwZWNzLmtleS5oZWlnaHRcblx0ZW1vamlLZXkuY29uc3RyYWludHMgPSAoYm90dG9tRWRnZXM6bnVtS2V5LCBsZWFkaW5nOltudW1LZXksIDZdKVxuXHRlbW9qaUljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjplbW9qaUtleSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLmVtb2ppSWNvbi54LCB5OmJvYXJkU3BlY3MuZW1vamlJY29uLnlcblx0ZW1vamlJY29uLmh0bWwgPSBpY29uTGlicmFyeS5lbW9qaVxuXG5cblxuXHQjIyBSRVRVUk4gS0VZXG5cblx0cmV0dXJuS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDUpLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihzZXR1cC5yZXR1cm5Db2xvciksIHNoYWRvd1k6ZXhwb3J0cy5weCgxKSwgc2hhZG93Q29sb3I6XCIjOTI5NDk4XCIsIGNvbG9yOlwiYmxhY2tcIiwgbmFtZTpcInJldHVyblwiLCB3aWR0aDpib2FyZFNwZWNzLnJldHVybktleSwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRpZiBzZXR1cC5yZXR1cm5Db2xvciAhPSBcImxpZ2h0LWtleVwiXG5cdFx0cmV0dXJuS2V5LmNvbG9yID0gZXhwb3J0cy5zZXRUZXh0Q29sb3IoZXhwb3J0cy5jb2xvcihzZXR1cC5yZXR1cm5Db2xvcikpXG5cdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0cmV0dXJuS2V5LmNvbnN0cmFpbnRzID0gKHRyYWlsaW5nRWRnZXM6ZGVsZXRlS2V5LCB0b3A6ZXhwb3J0cy5wdChib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cyICsgYm9hcmRTcGVjcy5rZXkuaGVpZ2h0KSApXG5cdGVsc2Vcblx0XHRyZXR1cm5LZXkuY29uc3RyYWludHMgPSAodHJhaWxpbmc6ZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcikvMiwgYm90dG9tRWRnZXM6bnVtS2V5KVxuXHRyZXR1cm5LZXkuaHRtbCA9IHNldHVwLnJldHVyblRleHRcblx0cmV0dXJuS2V5LnN0eWxlID0ge1xuXHRcdFwiZm9udC1zaXplXCIgOiBleHBvcnRzLnB4KDE2KSArIFwicHhcIlxuXHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFwiZm9udC1mYW1pbHlcIiA6ICctYXBwbGUtc3lzdGVtLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmJ1xuXHRcdCd0ZXh0LWFsaWduJyA6ICdjZW50ZXInXG5cdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdH1cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdHN0b3JlZFRleHRDb2xvciA9IHJldHVybktleS5jb2xvclxuXHRyZXR1cm5LZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0cmV0dXJuS2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdHJldHVybktleS5jb2xvciA9IGV4cG9ydHMuY29sb3IoXCJibGFja1wiKVxuXHRyZXR1cm5LZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdHJldHVybktleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLnJldHVybkNvbG9yKVxuXHRcdHJldHVybktleS5jb2xvciA9IHN0b3JlZFRleHRDb2xvclxuXG5cdGJvYXJkLmtleXMucmV0dXJuID0gcmV0dXJuS2V5XG5cblxuXHQjIyBTUEFDRSBLRVlcblxuXHRzcGFjZUtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1KSwgYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIiwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgY29sb3I6XCJibGFja1wiLCBuYW1lOlwic3BhY2VcIiwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRcblx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCJcblx0XHRzcGFjZUtleS5jb25zdHJhaW50cyA9IChib3R0b21FZGdlczpudW1LZXksIGxlYWRpbmc6W2Vtb2ppS2V5LCBleHBvcnRzLnB0KGJvYXJkU3BlY3Muc3BhY2VyKV0sIHRyYWlsaW5nOltyZXR1cm5LZXksIGJvYXJkU3BlY3Muc3BhY2VyXSlcblx0XHRzcGFjZUtleS5odG1sID0gXCJzcGFjZVwiXG5cdFx0c3BhY2VLZXkuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdFx0fVxuXHRlbHNlXG5cdFx0c3BhY2VLZXkuY29uc3RyYWludHMgPSAoYm90dG9tRWRnZXM6bnVtS2V5LCBsZWFkaW5nOltlbW9qaUtleSwgZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcildLCB0cmFpbGluZzpbbnVtS2V5MiwgYm9hcmRTcGVjcy5zcGFjZXJdKVxuXHRib2FyZC5rZXlzW1wiJm5ic3A7XCJdID0gc3BhY2VLZXlcblx0Ym9hcmQua2V5cy5zcGFjZSA9IHNwYWNlS2V5XG5cdGV4cG9ydHMubGF5b3V0KClcblxuXG5cdHNwYWNlS2V5Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdHNwYWNlS2V5LmJhY2tncm91bmRDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIilcblxuXHRzcGFjZUtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c3BhY2VLZXkuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiXG5cdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRAbmV3VGV4dCA9IHNldHVwLm91dHB1dC50ZXh0Lmh0bWwgKyBcIiZuYnNwO1wiXG5cdFx0XHRleHBvcnRzLnVwZGF0ZShzZXR1cC5vdXRwdXQudGV4dCwgW3RleHQ6QG5ld1RleHRdKVxuXG5cblx0IyMgRU1PSklTXG5cblx0ZW1vamlGb3JtYXR0ZXIgPSAoc3RyaW5nKSAtPlxuXHRcdHVuaWNvZGVGb3JtYXQgPSBcIlwiXG5cdFx0aWYgc3RyaW5nWzBdID09IFwiRVwiIHx8IHN0cmluZ1swXSA9PSBcIjNcIiB8fCBzdHJpbmdbMF0gPT0gXCIyXCIgfHwgc3RyaW5nWzBdID09IFwiQ1wiXG5cdFx0XHRhcnJheU9mQ29kZXMgPSBzdHJpbmcuc3BsaXQoXCIgXCIpXG5cdFx0XHRmb3IgY29kZSBpbiBhcnJheU9mQ29kZXNcblx0XHRcdFx0dW5pY29kZUZvcm1hdCA9IHVuaWNvZGVGb3JtYXQgKyBcIiVcIiArIGNvZGVcblx0XHRlbHNlIFxuXHRcdFx0YXJyYXlPZkNvZGVzID0gc3RyaW5nLnNwbGl0KFwiIFwiKVxuXHRcdFx0dW5pY29kZUZvcm1hdCA9IFwiJUYwJTlGXCJcblx0XHRcdGZvciBjb2RlIGluIGFycmF5T2ZDb2Rlc1xuXHRcdFx0XHR1bmljb2RlRm9ybWF0ID0gdW5pY29kZUZvcm1hdCArIFwiJVwiICsgY29kZVxuXHRcdHJldHVybiB1bmljb2RlRm9ybWF0XG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRlbW9qaVNlY3Rpb25zID0gW1wiRnJlcXVuZXRseSBVc2VkXCIsIFwiU21pbGV5cyAmIFBlb3BsZVwiLCBcIkFuaW1hbHMgJiBOYXR1cmVcIiwgXCJGb29kICYgRHJpbmtcIiwgXCJBY3Rpdml0eVwiLCBcIlRyYXZlbCAmIFBsYWNlc1wiLCBcIk9iamVjdHNcIiwgXCJTeW1ib2xzXCIsIFwiRmxhZ3NcIl1cblx0cmF3RW1vamlzID0gW1wiOTggODBcIiwgXCI5OCBBQ1wiLCBcIjk4IDgxXCIsIFwiOTggODJcIiwgXCI5OCA4M1wiLCBcIjk4IDg0XCIsIFwiOTggODVcIiwgXCI5OCA4NlwiLCBcIjk4IDg3XCIsIFwiOTggODlcIiwgXCI5OCA4YVwiLCBcIjk5IDgyXCIsIFwiOTkgODNcIiwgXCJFMiA5OCBCQSBFRiBCOCA4RlwiLCBcIjk4IDhCXCIgLCBcIjk4IDhDXCIsIFwiOTggOERcIiwgXCI5OCA5OFwiLCBcIjk4IDk3XCIsIFwiOTggOTlcIiwgXCI5OCA5QVwiLCBcIjk4IDlDXCIsIFwiOTggOURcIiwgXCI5OCA5QlwiLCBcIkE0IDkxXCIsIFwiQTQgOTNcIiwgXCI5OCA4RVwiLCBcIkE0IDk3XCIsIFwiOTggOEZcIiwgXCI5OCBCNlwiLCBcIjk4IDkwXCIsIFwiOTggOTFcIiwgXCI5OCA5MlwiLCBcIjk5IDg0XCIsIFwiQTQgOTRcIiwgXCI5OCBCM1wiLCBcIjk4IDlFXCIsIFwiOTggOUZcIiwgXCI5OCBBMFwiLCBcIjk4IEExXCIsIFwiOTggOTRcIiwgXCI5OCA5NVwiLCBcIjk5IDgxXCIsIFwiRTIgOTggQjkgRUYgQjggOEZcIiwgXCI5OCBBM1wiLCBcIjk4IDk2XCIsIFwiOTggQUJcIiwgXCI5OCBBOVwiLCBcIjk4IEE0XCIsIFwiOTggQUVcIiwgXCI5OCBCMVwiLCBcIjk4IEE4XCIsIFwiOTggQjBcIiwgXCI5OCBBRlwiLCBcIjk4IEE2XCIsIFwiOTggQTdcIiwgXCI5OCBBMlwiLCBcIjk4IEE1XCIsIFwiOTggQUFcIiwgXCI5OCA5M1wiLCBcIjk4IEFEXCIsIFwiOTggQjVcIiwgXCI5OCBCMlwiLCBcIkE0IDkwXCIsIFwiOTggQjdcIiwgXCJBNCA5MlwiLCBcIkE0IDk1XCIsIFwiOTggQjRcIiwgXCI5MiBBNFwiLCBcIjkyIEE5XCIsIFwiOTggODhcIiwgXCI5MSBCRlwiLCBcIjkxIEI5XCIsIFwiOTEgQkFcIiwgXCI5MiA4MFwiLCBcIjkxIEJCXCIsIFwiOTEgQkRcIiwgXCJBNCA5NlwiLCBcIjk4IEJBXCIsIFwiOTggQjhcIiwgXCI5OCBCOVwiLCBcIjk4IEJCXCIsIFwiOTggQkNcIiwgXCI5OCBCRFwiLCBcIjk5IDgwXCIsIFwiOTggQkZcIiwgXCI5OCBCRVwiLCBcIjk5IDhDXCIsIFwiOTEgOEZcIiwgXCI5MSA4QlwiLCBcIjkxIDhEXCIsIFwiOTEgOEVcIiwgXCI5MSA4QVwiLCBcIkUyIDlDIDhBXCIsIFwiRTIgOUMgOEMgRUYgQjggOEZcIiwgXCI5MSA4Q1wiLCBcIkUyIDlDIDhCXCIsIFwiOTEgOTBcIiwgXCI5MiBBQVwiLCBcIjk5IDhGXCIsIFwiRTIgOTggOUQgRUYgQjggOEZcIiwgXCI5MSA4NlwiLCBcIjkxIDg3XCIsIFwiOTEgODhcIiwgXCI5MSA4OVwiLCBcIjk2IDk1XCIsIFwiOTYgOTBcIiwgXCJBNCA5OFwiLCBcIjk2IDk2XCIsIFwiRTIgOUMgOEQgRUYgQjggOEZcIiwgXCI5MiA4NVwiLCBcIjkxIDg0XCIsIFwiOTEgODVcIiwgXCI5MSA4MlwiLCBcIjkxIDgzXCIsIFwiOTEgODFcIiwgXCI5MSA4MFwiLCBcIjkxIEE0XCIsIFwiOTEgQTVcIiwgXCI5NyBBM1wiLCBcIjkxIEI2XCIsIFwiOTEgQTZcIiwgXCI5MSBBN1wiLCBcIjkxIEE4XCIsIFwiOTEgQTlcIiwgXCI5MSBCMVwiLCBcIjkxIEI0XCIsIFwiOTEgQjVcIiwgXCI5MSBCMlwiLCBcIjkxIEIzXCIsIFwiOTEgQUVcIiwgXCI5MSBCN1wiLCBcIjkyIDgyXCIsIFwiOTUgQjVcIiwgXCI4RSA4NVwiLCBcIjkxIEJDXCIsIFwiOTEgQjhcIiwgXCI5MSBCMFwiLCBcIjlBIEI2XCIsIFwiOEYgODNcIiwgXCI5MiA4M1wiLCBcIjkxIEFGXCIsIFwiOTEgQUJcIiwgXCI5MSBBQ1wiLCBcIjkxIEFEXCIsIFwiOTkgODdcIiwgXCI5MiA4MVwiLCBcIjk5IDg1XCIsIFwiOTkgODZcIiwgXCI5OSA4QlwiLCBcIjk5IDhFXCIsIFwiOTkgOERcIiwgXCI5MiA4N1wiLCBcIjkyIDg2XCIsIFwiOTIgOTFcIiwgXCI5MSBBOSBFMiA4MCA4RCBFMiA5RCBBNCBFRiBCOCA4RiBFMiA4MCA4RCBGMCA5RiA5MSBBOVwiLCBcIjkxIEE4IEUyIDgwIDhEIEUyIDlEIEE0IEVGIEI4IDhGIEUyIDgwIDhEIEYwIDlGIDkxIEE4XCIsIFwiOTIgOEZcIiwgXCI5MSBBOSBFMiA4MCA4RCBFMiA5RCBBNCBFRiBCOCA4RiBFMiA4MCA4RCBGMCA5RiA5MiA4QiBFMiA4MCA4RCBGMCA5RiA5MSBBOVwiLCBcIjkxIEE4IEUyIDgwIDhEIEUyIDlEIEE0IEVGIEI4IDhGIEUyIDgwIDhEIEYwIDlGIDkyIDhCIEUyIDgwIDhEIEYwIDlGIDkxIEE4XCIsIFwiOTEgQUFcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBN1wiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE3IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTYgRTIgODAgOEQgRjAgOUYgOTEgQTZcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBNyBFMiA4MCA4RCBGMCA5RiA5MSBBN1wiLCBcIjkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTdcIiwgXCI5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBNyBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE2IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTcgRTIgODAgOEQgRjAgOUYgOTEgQTdcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE3XCIsIFwiOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTcgRTIgODAgOEQgRjAgOUYgOTEgQTZcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBNiBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE3IEUyIDgwIDhEIEYwIDlGIDkxIEE3XCIsIFwiOTEgOUFcIiwgXCI5MSA5NVwiLCBcIjkxIDk2XCIsIFwiOTEgOTRcIiwgXCI5MSA5N1wiLCBcIjkxIDk5XCIsIFwiOTEgOThcIiwgXCI5MiA4NFwiLCBcIjkyIDhCXCIsIFwiOTEgQTNcIiwgXCI5MSBBMFwiLCBcIjkxIEExXCIsIFwiOTEgQTJcIiwgXCI5MSA5RVwiLCBcIjkxIDlGXCIsIFwiOTEgOTJcIiwgXCI4RSBBOVwiLCBcIkUyIDlCIDkxXCIsIFwiOEUgOTNcIiwgXCI5MSA5MVwiLCBcIjhFIDkyXCIsIFwiOTEgOURcIiwgXCI5MSA5QlwiLCBcIjkxIDlDXCIsIFwiOTIgQkNcIiwgXCI5MSA5M1wiLCBcIjk1IEI2XCIsIFwiOTIgOERcIiwgXCI4QyA4MlwiLCBcIjlCIDkxXCIsIFwiOTAgQjZcIiwgXCI5MCBCMVwiLCBcIjkwIEFEXCIsIFwiOTAgQjlcIiwgXCI5MCBCMFwiLCBcIjkwIEJCXCIsIFwiOTAgQkNcIiwgXCI5MCBBOFwiLCBcIjkwIEFGXCIsIFwiQTYgODFcIiwgXCI5MCBBRVwiLCBcIjkwIEI3XCIsIFwiOTAgQkRcIiwgXCI5MCBCOFwiLCBcIjkwIDk5XCIsIFwiOTAgQjVcIiwgXCI5OSA4OFwiLCBcIjk5IDg5XCIsIFwiOTkgOEFcIiwgXCI5MCA5MlwiLCBcIjkwIDk0XCIsIFwiOTAgQTdcIiwgXCI5MCBBNlwiLCBcIjkwIEE0XCIsIFwiOTAgQTNcIiwgXCI5MCBBNVwiLCBcIjkwIEJBXCIsIFwiOTAgOTdcIiwgXCI5MCBCNFwiLCBcIkE2IDg0XCIsIFwiOTAgOURcIiwgXCI5MCA5QlwiLCBcIjkwIDhDXCIsIFwiOTAgOUVcIiwgXCI5MCA5Q1wiLCBcIjk1IEI3XCIsIFwiQTYgODJcIiwgXCJBNiA4MFwiLCBcIjkwIDhEXCIsIFwiOTAgQTJcIiwgXCI5MCBBMFwiLCBcIjkwIDlGXCIsIFwiOTAgQTFcIiwgXCI5MCBBQ1wiLCBcIjkwIEIzXCIsIFwiOTAgOEJcIiwgXCI5MCA4QVwiLCBcIjkwIDg2XCIsIFwiOTAgODVcIiwgXCI5MCA4M1wiLCBcIjkwIDgyXCIsIFwiOTAgODRcIiwgXCI5MCBBQVwiLCBcIjkwIEFCXCIsIFwiOTAgOThcIiwgXCI5MCA5MFwiLCBcIjkwIDhGXCIsIFwiOTAgOTFcIiwgXCI5MCA4RVwiLCBcIjkwIDk2XCIsIFwiOTAgODBcIiwgXCI5MCA4MVwiLCBcIjkwIDkzXCIsIFwiQTYgODNcIiwgXCI5NSA4QVwiLCBcIjkwIDk1XCIsIFwiOTAgQTlcIiwgXCI5MCA4OFwiLCBcIjkwIDg3XCIsIFwiOTAgQkZcIiwgXCI5MCBCRVwiLCBcIjkwIDg5XCIsIFwiOTAgQjJcIiwgXCI4QyBCNVwiLCBcIjhFIDg0XCIsIFwiOEMgQjJcIiwgXCI4QyBCM1wiLCBcIjhDIEI0XCIsIFwiOEMgQjFcIiwgXCI4QyBCRlwiLCBcIkUyIDk4IDk4XCIsIFwiOEQgODBcIiwgXCI4RSA4RFwiLCBcIjhFIDhCXCIsIFwiOEQgODNcIiwgXCI4RCA4MlwiLCBcIjhEIDgxXCIsIFwiOEMgQkVcIiwgXCI4QyBCQVwiLCBcIjhDIEJBXCIsIFwiOEMgQkJcIiwgXCI4QyBCOVwiLCBcIjhDIEI3XCIsIFwiOEMgQkNcIiwgXCI4QyBCOFwiLCBcIjkyIDkwXCIsIFwiOEQgODRcIiwgXCI4QyBCMFwiLCBcIjhFIDgzXCIsIFwiOTAgOUFcIiwgXCI5NSBCOFwiLCBcIjhDIDhFXCIsIFwiOEMgOERcIiwgXCI4QyA4RlwiLCBcIjhDIDk1XCIsIFwiOEMgOTZcIiwgXCI4QyA5N1wiLCBcIjhDIDk4XCIsIFwiOEMgOTFcIiwgXCI4QyA5MlwiLCBcIjhDIDkzXCIsIFwiOEMgOTRcIiwgXCI4QyA5QVwiLCBcIjhDIDlEXCIsIFwiOEMgOUJcIiwgXCI4QyA5Q1wiLCBcIjhDIDlFXCIsIFwiOEMgOTlcIiwgXCJFMiBBRCA5MCBFRiBCOCA4RlwiLCBcIjhDIDlGXCIsIFwiOTIgQUJcIiwgXCJFMiA5QyBBOFwiLCBcIkUyIDk4IDg0IEVGIEI4IDhGXCIsIFwiRTIgOTggODAgRUYgQjggOEZcIiwgXCI4QyBBNFwiLCBcIkUyIDlCIDg1IEVGIEI4IDhGXCIsIFwiOEMgQTVcIiwgXCI4QyBBNlwiLCBcIkUyIDk4IDgxIEVGIEI4IDhGXCIsIFwiOEMgQTdcIiwgXCJFMiA5QiA4OFwiLCBcIjhDIEE5XCIsIFwiRTIgOUEgQTEgRUYgQjggOEZcIiwgXCI5NCBBNVwiLCBcIjkyIEE1XCIsIFwiRTIgOUQgODQgRUYgQjggOEZcIiwgXCI4QyBBOFwiLCBcIkUyIDk4IDgzIEVGIEI4IDhGXCIsIFwiRTIgOUIgODQgRUYgQjggOEZcIiwgXCI4QyBBQ1wiLCBcIjkyIEE4XCIsIFwiOEMgQUFcIiwgXCI4QyBBQlwiLCBcIkUyIDk4IDgyIEVGIEI4IDhGXCIsIFwiRTIgOTggOTQgRUYgQjggOEZcIiwgXCI5MiBBN1wiLCBcIjkyIEE2XCIsIFwiOEMgOEFcIiwgXCI5QiA5MVwiLCBcIjlCIDkxXCIsIFwiOEQgOEZcIiwgXCI4RCA4RVwiLCBcIjhEIDkwXCIsIFwiOEQgOEFcIiwgXCI4RCA4QlwiLCBcIjhEIDhDXCIsIFwiOEQgODlcIiwgXCI4RCA4N1wiLCBcIjhEIDkzXCIsIFwiOEQgODhcIiwgXCI4RCA5MlwiLCBcIjhEIDkxXCIsIFwiOEQgOERcIiwgXCI4RCA4NVwiLCBcIjhEIDg2XCIsIFwiOEMgQjZcIiwgXCI4QyBCRFwiLCBcIjhEIEEwXCIsIFwiOEQgQUZcIiwgXCI4RCA5RVwiLCBcIkE3IDgwXCIsIFwiOEQgOTdcIiwgXCI4RCA5NlwiLCBcIjhEIEE0XCIsIFwiOEQgQjNcIiwgXCI4RCA5NFwiLCBcIjhEIDlGXCIsIFwiOEMgQURcIiwgXCI4RCA5NVwiLCBcIjhEIDlEXCIsIFwiOEMgQUVcIiwgXCI4QyBBRlwiLCBcIjhEIDlDXCIsIFwiOEQgQjJcIiwgXCI4RCBBNVwiLCBcIjhEIEEzXCIsIFwiOEQgQjFcIiwgXCI4RCA5QlwiLCBcIjhEIDk5XCIsIFwiOEQgOUFcIiwgXCI4RCA5OFwiLCBcIjhEIEEyXCIsIFwiOEQgQTFcIiwgXCI4RCBBN1wiLCBcIjhEIEE4XCIsIFwiOEQgQTZcIiwgXCI4RCBCMFwiLCBcIjhFIDgyXCIsIFwiOEQgQUVcIiwgXCI4RCBBQ1wiLCBcIjhEIEFEXCIsIFwiOEQgQUJcIiwgXCI4RCBCRlwiLCBcIjhEIEE5XCIsIFwiOEQgQUFcIiwgXCI4RCBCQVwiLCBcIjhEIEJCXCIsIFwiOEQgQjdcIiwgXCI4RCBCOFwiLCBcIjhEIEI5XCIsIFwiOEQgQkVcIiwgXCI4RCBCNlwiLCBcIjhEIEI1XCIsIFwiRTIgOTggOTUgRUYgQjggOEZcIiwgXCI4RCBCQ1wiLCBcIjhEIEI0XCIsIFwiOEQgQkRcIixcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCI5QiA5MVwiLCBcIkUyIDlBIEJEIEVGIEI4IDhGXCIsIFwiOEYgODBcIiwgXCI4RiA4OFwiLCBcIkUyIDlBIEJFIEVGIEI4IDhGXCIsIFwiOEUgQkVcIiwgXCI4RiA5MFwiLCBcIjhGIDg5XCIsIFwiOEUgQjFcIiwgXCJFMiA5QiBCMyBFRiBCOCA4RlwiLCBcIjhGIDhDXCIsIFwiOEYgOTNcIiwgXCI4RiBCOFwiLCBcIjhGIDkyXCIsIFwiOEYgOTFcIiwgXCI4RiA4RlwiLCBcIjhFIEJGXCIsIFwiRTIgOUIgQjdcIiwgXCI4RiA4MlwiLCBcIkUyIDlCIEI4XCIsIFwiOEYgQjlcIiwgXCI4RSBBM1wiLCBcIjlBIEEzXCIsIFwiOEYgOEFcIiwgXCI4RiA4NFwiLCBcIjlCIDgwXCIsIFwiRTIgOUIgQjlcIiwgXCI4RiA4QlwiLCBcIjlBIEI0XCIsIFwiOUEgQjVcIiwgXCI4RiA4N1wiLCBcIjk1IEI0XCIsIFwiOEYgODZcIiwgXCI4RSBCRFwiLCBcIjhGIDg1XCIsIFwiOEUgOTZcIiwgXCI4RSA5N1wiLCBcIjhGIEI1XCIsIFwiOEUgQUJcIiwgXCI4RSA5RlwiLCBcIjhFIEFEXCIsIFwiOEUgQThcIiwgXCI4RSBBQVwiLCBcIjhFIEE0XCIsIFwiOEUgQTdcIiwgXCI4RSBCQ1wiLCBcIjhFIEI5XCIsIFwiOEUgQjdcIiwgXCI4RSBCQVwiLCBcIjhFIEI4XCIsIFwiOEUgQkJcIiwgXCI4RSBBQ1wiLCBcIjhFIEFFXCIsIFwiOTEgQkVcIiwgXCI4RSBBRlwiLCBcIjhFIEIyXCIsIFwiOEUgQjBcIiwgXCI4RSBCM1wiLCBcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCI5QiA5MVwiLCBcIjlBIDk3XCIsIFwiOUEgOTVcIiwgXCI5QSA5OVwiLCBcIjlBIDhDXCIsIFwiOUEgOEVcIiwgXCI4RiA4RVwiLCBcIjlBIDkzXCIsIFwiOUEgOTFcIiwgXCI5QSA5MlwiLCBcIjlBIDkwXCIsIFwiOUEgOUFcIiwgXCI5QSA5QlwiLCBcIjlBIDlDXCIsXCI4RiA4RFwiLCBcIjlBIEIyXCIsIFwiOUEgQThcIiwgXCI5QSA5NFwiLCBcIjlBIDhEXCIsIFwiOUEgOThcIiwgXCI5QSA5NlwiLCBcIjlBIEExXCIsIFwiOUEgQTBcIiwgXCI5QSBBRlwiLCBcIjlBIDgzXCIsIFwiOUEgOEJcIiwgXCI5QSA5RFwiLCBcIjlBIDg0XCIsIFwiOUEgODVcIiwgXCI5QSA4OFwiLCBcIjlBIDlFXCIsIFwiOUEgODJcIiwgXCI5QSA4NlwiLCBcIjlBIDg3XCIsIFwiOUEgOEFcIiwgXCI5QSA4OVwiLCBcIjlBIDgxXCIsIFwiOUIgQTlcIiwgXCJFMiA5QyA4OCBFRiBCOCA4RlwiLCBcIjlCIEFCXCIsIFwiOUIgQUNcIiwgXCJFMiA5QiBCNSBFRiBCOCA4RlwiLCBcIjlCIEE1XCIsIFwiOUEgQTRcIiwgXCJFMiA5QiBCNFwiLCBcIjlCIEIzXCIsIFwiOUEgODBcIiwgXCI5QiBCMFwiLCBcIjkyIEJBXCIsIFwiRTIgOUEgOTMgRUYgQjggOEZcIiwgXCI5QSBBN1wiLCBcIkUyIDlCIEJEIEVGIEI4IDhGXCIsIFwiOUEgOEZcIiwgXCI5QSBBNlwiLCBcIjlBIEE1XCIsIFwiOEYgODFcIiwgXCI5QSBBMlwiLCBcIjhFIEExXCIsIFwiOEUgQTJcIiwgXCI4RSBBMFwiLCBcIjhGIDk3XCIsIFwiOEMgODFcIiwgXCI5NyBCQ1wiLCBcIjhGIEFEXCIsIFwiRTIgOUIgQjIgRUYgQjggOEZcIiwgXCI4RSA5MVwiLCBcIkUyIDlCIEIwXCIsIFwiOEYgOTRcIiwgXCI5NyBCQlwiLCBcIjhDIDhCXCIsIFwiOTcgQkVcIiwgXCI4RiA5NVwiLCBcIkUyIDlCIEJBIEVGIEI4IDhGXCIsIFwiOEYgOUVcIiwgXCI5QiBBM1wiLCBcIjlCIEE0XCIsIFwiOEMgODVcIiwgXCI4QyA4NFwiLCBcIjhGIDlDXCIsIFwiOEYgOTZcIiwgXCI4RiA5RFwiLCBcIjhDIDg3XCIsIFwiOEMgODZcIiwgXCI4RiA5OVwiLCBcIjhDIDgzXCIsIFwiOEMgODlcIiwgXCI4QyA4Q1wiLCBcIjhDIEEwXCIsIFwiOEUgODdcIiwgXCI4RSA4NlwiLCBcIjhDIDg4XCIsIFwiOEYgOThcIiwgXCI4RiBCMFwiLCBcIjhGIEFGXCIsIFwiOEYgOUZcIiwgXCI5NyBCRFwiLCBcIjhGIEEwXCIsIFwiOEYgQTFcIiwgXCI4RiA5QVwiLCBcIjhGIEEyXCIsIFwiOEYgQUNcIiwgXCI4RiBBM1wiLCBcIjhGIEE0XCIsIFwiOEYgQTVcIiwgXCI4RiBBNlwiLCBcIjhGIEE4XCIsIFwiOEYgQUFcIiwgXCI4RiBBQlwiLCBcIjhGIEE5XCIsIFwiOTIgOTJcIiwgXCI4RiA5QlwiLCBcIkUyIDlCIEFBIEVGIEI4IDhGXCIsIFwiOTUgOENcIiwgXCI5NSA4RFwiLCBcIjk1IDhCXCIsIFwiRTIgOUIgQTlcIiwgXCJFMiA4QyA5QSBFRiBCOCA4RlwiLCBcIjkzIEIxXCIsIFwiOTMgQjJcIiwgXCI5MiBCQlwiLCBcIkUyIDhDIEE4IEVGIEI4IDhGXCIsIFwiOTYgQTVcIiwgXCI5NiBBOFwiLCBcIjk2IEIxXCIsIFwiOTYgQjJcIiwgXCI5NSBCOVwiLCBcIjk3IDlDXCIsIFwiOTIgQkRcIiwgXCI5MiBCRVwiLCBcIjkyIEJGXCIsIFwiOTMgODBcIiwgXCI5MyBCQ1wiLCBcIjkzIEI3XCIsIFwiOTMgQjhcIiwgXCI5MyBCOVwiLCBcIjhFIEE1XCIsIFwiOTMgQkRcIiwgXCI4RSA5RVwiLCBcIjkzIDlFXCIsIFwiRTIgOTggOEUgRUYgQjggOEZcIiwgXCI5MyA5RlwiLCBcIjkzIEEwXCIsIFwiOTMgQkFcIiwgXCI5MyBCQlwiLCBcIjhFIDk5XCIsIFwiOEUgOUFcIiwgXCI4RSA5QlwiLCBcIkUyIDhGIEIxXCIsIFwiRTIgOEYgQjJcIiwgXCJFMiA4RiBCMFwiLCBcIjk1IEIwXCIsIFwiRTIgOEYgQjNcIiwgXCJFMiA4QyA5QiBFRiBCOCA4RlwiLCBcIjkzIEExXCIsIFwiOTQgOEJcIiwgXCI5NCA4Q1wiLCBcIjkyIEExXCIsIFwiOTQgQTZcIiwgXCI5NSBBRlwiLCBcIjk3IDkxXCIsIFwiOUIgQTJcIiwgXCI5MiBCOFwiLCBcIjkyIEI1XCIsIFwiOTIgQjRcIiwgXCI5MiBCNlwiLCBcIjkyIEI3XCIsIFwiOTIgQjBcIiwgXCI5MiBCM1wiLCBcIjkyIDhFXCIsIFwiRTIgOUEgOTZcIiwgXCI5NCBBN1wiLCBcIjk0IEE4XCIsIFwiRTIgOUEgOTJcIiwgXCI5QiBBMFwiLCBcIkUyIDlCIDhGXCIsIFwiOTQgQTlcIiwgXCJFMiA5QSA5OVwiLCBcIkUyIDlCIDkzXCIsIFwiOTQgQUJcIiwgXCI5MiBBM1wiLCBcIjk0IEFBXCIsIFwiOTcgQTFcIiwgXCJFMiA5QSA5NFwiLCBcIjlCIEExXCIsIFwiOUEgQUNcIiwgXCJFMiA5OCBBMCBFRiBCOCA4RlwiLCBcIkUyIDlBIEIwXCIsIFwiRTIgOUEgQjFcIiwgXCI4RiBCQVwiLCBcIjk0IEFFXCIsIFwiOTMgQkZcIiwgXCI5MiA4OFwiLCBcIkUyIDlBIDk3XCIsIFwiOTQgQURcIiwgXCI5NCBBQ1wiLCBcIjk1IEIzXCIsIFwiOTIgOEFcIiwgXCI5MiA4OVwiLCBcIjhDIEExXCIsIFwiOEYgQjdcIiwgXCI5NCA5NlwiLCBcIjlBIEJEXCIsIFwiOUEgQkZcIiwgXCI5QiA4MVwiLCBcIjk0IDkxXCIsIFwiOTcgOURcIiwgXCI5QiA4QlwiLCBcIjlCIDhDXCIsIFwiOUIgOEZcIiwgXCI5QSBBQVwiLCBcIjlCIDhFXCIsIFwiOTYgQkNcIiwgXCI5NyBCQVwiLCBcIkUyIDlCIEIxXCIsIFwiOTcgQkZcIiwgXCI5QiA4RFwiLCBcIjhFIDg4XCIsIFwiOEUgOEZcIiwgXCI4RSA4MFwiLCBcIjhFIDgxXCIsIFwiOEUgOEFcIiwgXCI4RSA4OVwiLCBcIjhFIDhFXCIsIFwiOEUgOTBcIiwgXCI4RSA4Q1wiLCBcIjhGIEFFXCIsIFwiRTIgOUMgODkgRUYgQjggOEZcIiwgXCI5MyBBOVwiLCBcIjkzIEE4XCIsIFwiOTMgQTdcIiwgXCI5MiA4Q1wiLCBcIjkzIEFFXCIsIFwiOTMgQUFcIiwgXCI5MyBBQlwiLCBcIjkzIEFDXCIsIFwiOTMgQURcIiwgXCI5MyBBNlwiLCBcIjkzIEFGXCIsIFwiOTMgQTVcIiwgXCI5MyBBNFwiLCBcIjkzIDlDXCIsIFwiOTMgODNcIiwgXCI5MyA5MVwiLCBcIjkzIDhBXCIsIFwiOTMgODhcIiwgXCI5MyA4OVwiLCBcIjkzIDg0XCIsIFwiOTMgODVcIiwgXCI5MyA4NlwiLCBcIjk3IDkzXCIsIFwiOTMgODdcIiwgXCI5NyA4M1wiLCBcIjk3IEIzXCIsIFwiOTcgODRcIiwgXCI5MyA4QlwiLCBcIjk3IDkyXCIsIFwiOTMgODFcIiwgXCI5MyA4MlwiLCBcIjk3IDgyXCIsIFwiOTcgOUVcIiwgXCI5MyBCMFwiLCBcIjkzIDkzXCIsIFwiOTMgOTVcIiwgXCI5MyA5N1wiLCBcIjkzIDk4XCIsIFwiOTMgOTlcIiwgXCI5MyA5NFwiLCBcIjkzIDkyXCIsIFwiOTMgOUFcIiwgXCI5MyA5NlwiLCBcIjk0IDk3XCIsIFwiOTMgOEVcIiwgXCI5NiA4N1wiLCBcIkUyIDlDIDgyIEVGIEI4IDhGXCIsIFwiOTMgOTBcIiwgXCI5MyA4RlwiLCBcIjkzIDhDXCIsIFwiOTMgOERcIiwgXCI5QSBBOVwiLCBcIjhGIEIzXCIsIFwiOEYgQjRcIiwgXCI5NCA5MFwiLCBcIjk0IDkyXCIsIFwiOTQgOTNcIiwgXCI5NCA4RlwiLCBcIjk2IDhBXCIsIFwiOTYgOEJcIiwgXCJFMiA5QyA5MiBFRiBCOCA4RlwiLCBcIjkzIDlEXCIsIFwiRTIgOUMgOEYgRUYgQjggOEZcIiwgXCI5NiA4RFwiLCBcIjk2IDhDXCIsIFwiOTQgOERcIiwgXCI5NCA4RVwiLCBcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCJFMiA5RCBBNCBFRiBCOCA4RlwiLCBcIjkyIDlCXCIsIFwiOTIgOUFcIiwgXCI5MiA5OVwiLCBcIjkyIDlDXCIsIFwiOTIgOTRcIiwgXCJFMiA5RCBBMyBFRiBCOCA4RlwiLCBcIjkyIDk1XCIsIFwiOTIgOUVcIiwgXCI5MiA5M1wiLCBcIjkyIDk3XCIsIFwiOTIgOTZcIiwgXCI5MiA5OFwiLCBcIjkyIDlEXCIsIFwiOTIgOUZcIiwgXCJFMiA5OCBBRSBFRiBCOCA4RlwiLCBcIkUyIDlDIDlEIEVGIEI4IDhGXCIsIFwiRTIgOTggQUEgRUYgQjggOEZcIiwgXCI5NSA4OVwiLCBcIkUyIDk4IEI4IEVGIEI4IDhGXCIsIFwiRTIgOUMgQTEgRUYgQjggOEZcIiwgXCI5NCBBRlwiLCBcIjk1IDhFXCIsIFwiRTIgOTggQUYgRUYgQjggOEZcIiwgXCJFMiA5OCBBNiBFRiBCOCA4RlwiLCBcIjlCIDkwXCIsIFwiRTIgOUIgOEVcIiwgXCJFMiA5OSA4OCBFRiBCOCA4RlwiLCBcIkUyIDk5IDg5IEVGIEI4IDhGXCIsIFwiRTIgOTkgOEEgRUYgQjggOEZcIiwgXCJFMiA5OSA4QiBFRiBCOCA4RlwiLCBcIkUyIDk5IDhDIEVGIEI4IDhGXCIsIFwiRTIgOTkgOEQgRUYgQjggOEZcIiwgXCJFMiA5OSA4RSBFRiBCOCA4RlwiLCBcIkUyIDk5IDhGIEVGIEI4IDhGXCIsIFwiRTIgOTkgOTAgRUYgQjggOEZcIiwgXCJFMiA5OSA5MSBFRiBCOCA4RlwiLCBcIkUyIDk5IDkyIEVGIEI4IDhGXCIsIFwiRTIgOTkgOTMgRUYgQjggOEZcIiwgXCI4NiA5NFwiLCBcIkUyIDlBIDlCXCIsIFwiODggQjNcIiwgXCI4OCBCOVwiLCBcIkUyIDk4IEEyIEVGIEI4IDhGXCIsIFwiRTIgOTggQTMgRUYgQjggOEZcIiwgXCI5MyBCNFwiLCBcIjkzIEIzXCIsIFwiODggQjZcIiwgXCI4OCA5QSBFRiBCOCA4RlwiLCBcIjg4IEI4XCIsIFwiODggQkFcIiwgXCI4OCBCNyBFRiBCOCA4RlwiLCBcIkUyIDlDIEI0IEVGIEI4IDhGXCIsIFwiODYgOUFcIiwgXCI4OSA5MVwiLCBcIjkyIEFFXCIsIFwiODkgOTBcIiwgXCJFMyA4QSA5OSBFRiBCOCA4RlwiLCBcIkUzIDhBIDk3IEVGIEI4IDhGXCIsIFwiODggQjRcIiwgXCI4OCBCNVwiLCBcIjg4IEIyXCIsIFwiODUgQjAgRUYgQjggOEZcIiwgXCI4NSBCMSBFRiBCOCA4RlwiLCBcIjg2IDhFXCIsIFwiODYgOTFcIiwgXCI4NSBCRSBFRiBCOCA4RlwiLCBcIjg2IDk4XCIsIFwiRTIgOUIgOTQgRUYgQjggOEZcIiwgXCI5MyA5QlwiLCBcIjlBIEFCXCIsIFwiRTIgOUQgOENcIiwgXCJFMiBBRCA5NSBFRiBCOCA4RlwiLCBcIjkyIEEyXCIsIFwiRTIgOTkgQTggRUYgQjggOEZcIiwgXCI5QSBCN1wiLCBcIjlBIEFGXCIsIFwiOUEgQjNcIiwgXCI5QSBCMVwiLCBcIjk0IDlFXCIsIFwiOTMgQjVcIiwgXCJFMiA5RCA5NyBFRiBCOCA4RlwiLCBcIkUyIDlEIDk1XCIsIFwiRTIgOUQgOTNcIiwgXCJFMiA5RCA5NFwiLCBcIkUyIDgwIEJDIEVGIEI4IDhGXCIsIFwiRTIgODEgODkgRUYgQjggOEZcIiwgXCI5MiBBRlwiLCBcIjk0IDg1XCIsIFwiOTQgODZcIiwgXCI5NCBCMVwiLCBcIkUyIDlBIDlDXCIsIFwiRTMgODAgQkQgRUYgQjggOEZcIiwgXCJFMiA5QSBBMCBFRiBCOCA4RlwiLCBcIjlBIEI4XCIsIFwiOTQgQjBcIiwgXCJFMiA5OSBCQiBFRiBCOCA4RlwiLCBcIjg4IEFGIEVGIEI4IDhGXCIsIFwiOTIgQjlcIiwgXCJFMiA5RCA4NyBFRiBCOCA4RlwiLCBcIkUyIDlDIEIzIEVGIEI4IDhGXCIsIFwiRTIgOUQgOEVcIiwgXCJFMiA5QyA4NVwiLCBcIjkyIEEwXCIsIFwiOEMgODBcIiwgXCJFMiA5RSBCRlwiLCBcIjhDIDkwXCIsIFwiRTIgOTMgODIgRUYgQjggOEZcIiwgXCI4RiBBN1wiLCBcIjg4IDgyIEVGIEI4IDhGXCIsIFwiOUIgODJcIiwgXCI5QiA4M1wiLCBcIjlCIDg0XCIsIFwiOUIgODVcIiwgXCJFMiA5OSBCRiBFRiBCOCA4RlwiLCBcIjlBIEFEXCIsIFwiOUEgQkVcIiwgXCI4NSBCRiBFRiBCOCA4RlwiLCBcIjlBIEIwXCIsIFwiOUEgQjlcIiwgXCI5QSBCQVwiLCBcIjlBIEJDXCIsIFwiOUEgQkJcIiwgXCI5QSBBRVwiLCBcIjhFIEE2XCIsIFwiOTMgQjZcIiwgXCI4OCA4MVwiLCBcIjg2IDk2XCIsIFwiODYgOTdcIiwgXCI4NiA5OVwiLCBcIjg2IDkyXCIsIFwiODYgOTVcIiwgXCI4NiA5M1wiLCBcIjMwIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzEgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzMiBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjMzIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzQgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzNSBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjM2IEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzcgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzOCBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjM5IEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiOTQgOUZcIiwgXCI5NCBBMlwiLCBcIkUyIDk2IEI2IEVGIEI4IDhGXCIsIFwiRTIgOEYgQjhcIiwgXCJFMiA4RiBBRlwiLCBcIkUyIDhGIEI5XCIsIFwiRTIgOEYgQkFcIiwgXCJFMiA4RiBBRFwiLCBcIkUyIDhGIEFFXCIsIFwiRTIgOEYgQTlcIiwgXCJFMiA4RiBBQVwiLCBcIjk0IDgwXCIsIFwiOTQgODFcIiwgXCI5NCA4MlwiLCBcIkUyIDk3IDgwIEVGIEI4IDhGXCIsIFwiOTQgQkNcIiwgXCI5NCBCRFwiLCBcIkUyIDhGIEFCXCIsIFwiRTIgOEYgQUNcIiwgXCJFMiA5RSBBMSBFRiBCOCA4RlwiLCBcIkUyIEFDIDg1IEVGIEI4IDhGXCIsIFwiRTIgQUMgODYgRUYgQjggOEZcIiwgXCJFMiBBQyA4NyBFRiBCOCA4RlwiLCBcIkUyIDg2IDk3IEVGIEI4IDhGXCIsIFwiRTIgODYgOTggRUYgQjggOEZcIiwgXCJFMiA4NiA5OSBFRiBCOCA4RlwiLCBcIkUyIDg2IDk2IEVGIEI4IDhGXCIsIFwiRTIgODYgOTUgRUYgQjggOEZcIiwgXCJFMiA4NiA5NCBFRiBCOCA4RlwiLCBcIjk0IDg0XCIsIFwiRTIgODYgQUEgRUYgQjggOEZcIiwgXCJFMiA4NiBBOSBFRiBCOCA4RlwiLCBcIkUyIEE0IEI0IEVGIEI4IDhGXCIsIFwiRTIgQTQgQjUgRUYgQjggOEZcIiwgXCIyMyBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjJBIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiRTIgODQgQjkgRUYgQjggOEZcIiwgXCI5NCBBNFwiLCBcIjk0IEExXCIsIFwiOTQgQTBcIiwgXCI5NCBBM1wiLCBcIjhFIEI1XCIsIFwiOEUgQjZcIiwgXCJFMyA4MCBCMCBFRiBCOCA4RlwiLCBcIkUyIDlFIEIwXCIsIFwiRTIgOUMgOTQgRUYgQjggOEZcIiwgXCI5NCA4M1wiLCBcIkUyIDlFIDk1XCIsIFwiRTIgOUUgOTZcIiwgXCJFMiA5RSA5N1wiLCBcIkUyIDlDIDk2IEVGIEI4IDhGXCIsIFwiOTIgQjJcIiwgXCI5MiBCMVwiLCBcIkMyIEE5IEVGIEI4IDhGXCIsIFwiQzIgQUUgRUYgQjggOEZcIiwgXCJFMiA4NCBBMiBFRiBCOCA4RlwiLCBcIjk0IDlBXCIsIFwiOTQgOTlcIiwgXCI5NCA5QlwiLCBcIjk0IDlEXCIsIFwiOTQgOUNcIiwgXCJFMiA5OCA5MSBFRiBCOCA4RlwiLCBcIjk0IDk4XCIsIFwiRTIgOUEgQUEgRUYgQjggOEZcIiwgXCJFMiA5QSBBQiBFRiBCOCA4RlwiLCBcIjk0IEI0XCIsIFwiOTQgQjVcIiwgXCI5NCBCOFwiLCBcIjk0IEI5XCIsIFwiOTQgQjZcIiwgXCI5NCBCN1wiLCBcIjk0IEJBXCIsIFwiRTIgOTYgQUEgRUYgQjggOEZcIiwgXCJFMiA5NiBBQiBFRiBCOCA4RlwiLCBcIkUyIEFDIDlCIEVGIEI4IDhGXCIsIFwiRTIgQUMgOUMgRUYgQjggOEZcIiwgXCI5NCBCQlwiLCBcIkUyIDk3IEJDIEVGIEI4IDhGXCIsIFwiRTIgOTcgQkIgRUYgQjggOEZcIiwgXCJFMiA5NyBCRSBFRiBCOCA4RlwiLCBcIkUyIDk3IEJEIEVGIEI4IDhGXCIsIFwiOTQgQjJcIiwgXCI5NCBCM1wiLCBcIjk0IDg4XCIsIFwiOTQgODlcIiwgXCI5NCA4QVwiLCBcIjk0IDg3XCIsIFwiOTMgQTNcIiwgXCI5MyBBMlwiLCBcIjk0IDk0XCIsIFwiOTQgOTVcIiwgXCI4MyA4RlwiLCBcIjgwIDg0IEVGIEI4IDhGXCIsIFwiRTIgOTkgQTAgRUYgQjggOEZcIiwgXCJFMiA5OSBBMyBFRiBCOCA4RlwiLCBcIkUyIDk5IEE1IEVGIEI4IDhGXCIsIFwiRTIgOTkgQTYgRUYgQjggOEZcIiwgXCI4RSBCNFwiLCBcIjkxIDgxIEUyIDgwIDhEIEYwIDlGIDk3IEE4XCIsIFwiOTIgQURcIiwgXCI5NyBBRlwiLCBcIjkyIEFDXCIsIFwiOTUgOTBcIiwgXCI5NSA5MVwiLCBcIjk1IDkyXCIsIFwiOTUgOTNcIiwgXCI5NSA5NFwiLCBcIjk1IDk1XCIsIFwiOTUgOTZcIiwgXCI5NSA5N1wiLCBcIjk1IDk4XCIsIFwiOTUgOTlcIiwgXCI5NSA5QVwiLCBcIjk1IDlCXCIsIFwiOTUgOUNcIiwgXCI5NSA5RFwiLCBcIjk1IDlFXCIsIFwiOTUgOUZcIiwgXCI5NSBBMFwiLCBcIjk1IEExXCIsIFwiOTUgQTJcIiwgXCI5NSBBM1wiLCBcIjk1IEE0XCIsIFwiOTUgQTVcIiwgXCI5NSBBNlwiLCBcIjk1IEE3XCIsIFwiOUIgOTFcIiwgXCI4NyBBNiBGMCA5RiA4NyBBQlwiLCBcIjg3IEE2IEYwIDlGIDg3IEJEXCIsIFwiODcgQTYgRjAgOUYgODcgQjFcIiwgXCI4NyBBOSBGMCA5RiA4NyBCRlwiLCBcIjg3IEE2IEYwIDlGIDg3IEI4XCIsIFwiODcgQTYgRjAgOUYgODcgQTlcIiwgXCI4NyBBNiBGMCA5RiA4NyBCNFwiLCBcIjg3IEE2IEYwIDlGIDg3IEFFXCIsIFwiODcgQTYgRjAgOUYgODcgQjZcIiwgXCI4NyBBNiBGMCA5RiA4NyBBQ1wiLCBcIjg3IEE2IEYwIDlGIDg3IEI3XCIsIFwiODcgQTYgRjAgOUYgODcgQjJcIiwgXCI4NyBBNiBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE2IEYwIDlGIDg3IEJBXCIsIFwiODcgQTYgRjAgOUYgODcgQjlcIiwgXCI4NyBBNiBGMCA5RiA4NyBCRlwiLCBcIjg3IEE3IEYwIDlGIDg3IEI4XCIsIFwiODcgQTcgRjAgOUYgODcgQURcIiwgXCI4NyBBNyBGMCA5RiA4NyBBOVwiLCBcIjg3IEE3IEYwIDlGIDg3IEE3XCIsIFwiODcgQTcgRjAgOUYgODcgQkVcIiwgXCI4NyBBNyBGMCA5RiA4NyBBQVwiLCBcIjg3IEE3IEYwIDlGIDg3IEJGXCIsIFwiODcgQTcgRjAgOUYgODcgQUZcIiwgXCI4NyBBNyBGMCA5RiA4NyBCMlwiLCBcIjg3IEE3IEYwIDlGIDg3IEI5XCIsIFwiODcgQTcgRjAgOUYgODcgQjRcIiwgXCI4NyBBNyBGMCA5RiA4NyBCNlwiLCBcIjg3IEE3IEYwIDlGIDg3IEE2XCIsIFwiODcgQTcgRjAgOUYgODcgQkNcIiwgXCI4NyBBNyBGMCA5RiA4NyBCN1wiLCBcIjg3IEFFIEYwIDlGIDg3IEI0XCIsIFwiODcgQkIgRjAgOUYgODcgQUNcIiwgXCI4NyBBNyBGMCA5RiA4NyBCM1wiLCBcIjg3IEE3IEYwIDlGIDg3IEFDXCIsIFwiODcgQTcgRjAgOUYgODcgQUJcIiwgXCI4NyBBNyBGMCA5RiA4NyBBRVwiLCBcIjg3IEE4IEYwIDlGIDg3IEJCXCIsIFwiODcgQjAgRjAgOUYgODcgQURcIiwgXCI4NyBBOCBGMCA5RiA4NyBCMlwiLCBcIjg3IEE4IEYwIDlGIDg3IEE2XCIsIFwiODcgQUUgRjAgOUYgODcgQThcIiwgXCI4NyBCMCBGMCA5RiA4NyBCRVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFCXCIsIFwiODcgQjkgRjAgOUYgODcgQTlcIiwgXCI4NyBBOCBGMCA5RiA4NyBCMVwiLCBcIjg3IEE4IEYwIDlGIDg3IEIzXCIsIFwiODcgQTggRjAgOUYgODcgQkRcIiwgXCI4NyBBOCBGMCA5RiA4NyBBOFwiLCBcIjg3IEE4IEYwIDlGIDg3IEI0XCIsIFwiODcgQjAgRjAgOUYgODcgQjJcIiwgXCI4NyBBOCBGMCA5RiA4NyBBQ1wiLCBcIjg3IEE4IEYwIDlGIDg3IEE5XCIsIFwiODcgQTggRjAgOUYgODcgQjBcIiwgXCI4NyBBOCBGMCA5RiA4NyBCN1wiLCBcIjg3IEFEIEYwIDlGIDg3IEI3XCIsIFwiODcgQTggRjAgOUYgODcgQkFcIiwgXCI4NyBBOCBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE4IEYwIDlGIDg3IEJFXCIsIFwiODcgQTggRjAgOUYgODcgQkZcIiwgXCI4NyBBOSBGMCA5RiA4NyBCMFwiLCBcIjg3IEE5IEYwIDlGIDg3IEFGXCIsIFwiODcgQTkgRjAgOUYgODcgQjJcIiwgXCI4NyBBOSBGMCA5RiA4NyBCNFwiLCBcIjg3IEFBIEYwIDlGIDg3IEE4XCIsIFwiODcgQUEgRjAgOUYgODcgQUNcIiwgXCI4NyBCOCBGMCA5RiA4NyBCQlwiLCBcIjg3IEFDIEYwIDlGIDg3IEI2XCIsIFwiODcgQUEgRjAgOUYgODcgQjdcIiwgXCI4NyBBQSBGMCA5RiA4NyBBQVwiLCBcIjg3IEFBIEYwIDlGIDg3IEI5XCIsIFwiODcgQUEgRjAgOUYgODcgQkFcIiwgXCI4NyBBQiBGMCA5RiA4NyBCMFwiLCBcIjg3IEFCIEYwIDlGIDg3IEI0XCIsIFwiODcgQUIgRjAgOUYgODcgQUZcIiwgXCI4NyBBQiBGMCA5RiA4NyBBRVwiLCBcIjg3IEFCIEYwIDlGIDg3IEI3XCIsIFwiODcgQUMgRjAgOUYgODcgQUJcIiwgXCI4NyBCNSBGMCA5RiA4NyBBQlwiLCBcIjg3IEI5IEYwIDlGIDg3IEFCXCIsIFwiODcgQUMgRjAgOUYgODcgQTZcIiwgXCI4NyBBQyBGMCA5RiA4NyBCMlwiLCBcIjg3IEFDIEYwIDlGIDg3IEFBXCIsIFwiODcgQTkgRjAgOUYgODcgQUFcIiwgXCI4NyBBQyBGMCA5RiA4NyBBRFwiLCBcIjg3IEFDIEYwIDlGIDg3IEFFXCIsIFwiODcgQUMgRjAgOUYgODcgQjdcIiwgXCI4NyBBQyBGMCA5RiA4NyBCMVwiLCBcIjg3IEFDIEYwIDlGIDg3IEE5XCIsIFwiODcgQUMgRjAgOUYgODcgQjVcIiwgXCI4NyBBQyBGMCA5RiA4NyBCQVwiLCBcIjg3IEFDIEYwIDlGIDg3IEI5XCIsIFwiODcgQUMgRjAgOUYgODcgQUNcIiwgXCI4NyBBQyBGMCA5RiA4NyBCM1wiLCBcIjg3IEFDIEYwIDlGIDg3IEJDXCIsIFwiODcgQUMgRjAgOUYgODcgQkVcIiwgXCI4NyBBRCBGMCA5RiA4NyBCOVwiLCBcIjg3IEFEIEYwIDlGIDg3IEIzXCIsIFwiODcgQUQgRjAgOUYgODcgQjBcIiwgXCI4NyBBRCBGMCA5RiA4NyBCQVwiLCBcIjg3IEFFIEYwIDlGIDg3IEI4XCIsIFwiODcgQUUgRjAgOUYgODcgQjNcIiwgXCI4NyBBRSBGMCA5RiA4NyBBOVwiLCBcIjg3IEFFIEYwIDlGIDg3IEI3XCIsIFwiODcgQUUgRjAgOUYgODcgQjZcIiwgXCI4NyBBRSBGMCA5RiA4NyBBQVwiLCBcIjg3IEFFIEYwIDlGIDg3IEIyXCIsIFwiODcgQUUgRjAgOUYgODcgQjFcIiwgXCI4NyBBRSBGMCA5RiA4NyBCOVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFFXCIsIFwiODcgQUYgRjAgOUYgODcgQjJcIiwgXCI4NyBBRiBGMCA5RiA4NyBCNVwiLCBcIjg3IEFGIEYwIDlGIDg3IEFBXCIsIFwiODcgQUYgRjAgOUYgODcgQjRcIiwgXCI4NyBCMCBGMCA5RiA4NyBCRlwiLCBcIjg3IEIwIEYwIDlGIDg3IEFBXCIsIFwiODcgQjAgRjAgOUYgODcgQUVcIiwgXCI4NyBCRCBGMCA5RiA4NyBCMFwiLCBcIjg3IEIwIEYwIDlGIDg3IEJDXCIsIFwiODcgQjAgRjAgOUYgODcgQUNcIiwgXCI4NyBCMSBGMCA5RiA4NyBBNlwiLCBcIjg3IEIxIEYwIDlGIDg3IEJCXCIsIFwiODcgQjEgRjAgOUYgODcgQTdcIiwgXCI4NyBCMSBGMCA5RiA4NyBCOFwiLCBcIjg3IEIxIEYwIDlGIDg3IEI3XCIsIFwiODcgQjEgRjAgOUYgODcgQkVcIiwgXCI4NyBCMSBGMCA5RiA4NyBBRVwiLCBcIjg3IEIxIEYwIDlGIDg3IEI5XCIsIFwiODcgQjEgRjAgOUYgODcgQkFcIiwgXCI4NyBCMiBGMCA5RiA4NyBCNFwiLCBcIjg3IEIyIEYwIDlGIDg3IEIwXCIsIFwiODcgQjIgRjAgOUYgODcgQUNcIiwgXCI4NyBCMiBGMCA5RiA4NyBCQ1wiLCBcIjg3IEIyIEYwIDlGIDg3IEJFXCIsIFwiODcgQjIgRjAgOUYgODcgQkJcIiwgXCI4NyBCMiBGMCA5RiA4NyBCMVwiLCBcIjg3IEIyIEYwIDlGIDg3IEI5XCIsIFwiODcgQjIgRjAgOUYgODcgQURcIiwgXCI4NyBCMiBGMCA5RiA4NyBCNlwiLCBcIjg3IEIyIEYwIDlGIDg3IEI3XCIsIFwiODcgQjIgRjAgOUYgODcgQkFcIiwgXCI4NyBCRSBGMCA5RiA4NyBCOVwiLCBcIjg3IEIyIEYwIDlGIDg3IEJEXCIsIFwiODcgQUIgRjAgOUYgODcgQjJcIiwgXCI4NyBCMiBGMCA5RiA4NyBBOVwiLCBcIjg3IEIyIEYwIDlGIDg3IEE4XCIsIFwiODcgQjIgRjAgOUYgODcgQjNcIiwgXCI4NyBCMiBGMCA5RiA4NyBBQVwiLCBcIjg3IEIyIEYwIDlGIDg3IEI4XCIsIFwiODcgQjIgRjAgOUYgODcgQTZcIiwgXCI4NyBCMiBGMCA5RiA4NyBCRlwiLCBcIjg3IEIyIEYwIDlGIDg3IEIyXCIsIFwiODcgQjMgRjAgOUYgODcgQTZcIiwgXCI4NyBCMyBGMCA5RiA4NyBCN1wiLCBcIjg3IEIzIEYwIDlGIDg3IEI1XCIsIFwiODcgQjMgRjAgOUYgODcgQjFcIiwgXCI4NyBCMyBGMCA5RiA4NyBBOFwiLCBcIjg3IEIzIEYwIDlGIDg3IEJGXCIsIFwiODcgQjMgRjAgOUYgODcgQUVcIiwgXCI4NyBCMyBGMCA5RiA4NyBBQVwiLCBcIjg3IEIzIEYwIDlGIDg3IEFDXCIsIFwiODcgQjMgRjAgOUYgODcgQkFcIiwgXCI4NyBCMyBGMCA5RiA4NyBBQlwiLCBcIjg3IEIyIEYwIDlGIDg3IEI1XCIsIFwiODcgQjAgRjAgOUYgODcgQjVcIiwgXCI4NyBCMyBGMCA5RiA4NyBCNFwiLCBcIjg3IEI0IEYwIDlGIDg3IEIyXCIsIFwiODcgQjUgRjAgOUYgODcgQjBcIiwgXCI4NyBCNSBGMCA5RiA4NyBCQ1wiLCBcIjg3IEI1IEYwIDlGIDg3IEI4XCIsIFwiODcgQjUgRjAgOUYgODcgQTZcIiwgXCI4NyBCNSBGMCA5RiA4NyBBQ1wiLCBcIjg3IEI1IEYwIDlGIDg3IEJFXCIsIFwiODcgQjUgRjAgOUYgODcgQUFcIiwgXCI4NyBCNSBGMCA5RiA4NyBBRFwiLCBcIjg3IEI1IEYwIDlGIDg3IEIzXCIsIFwiODcgQjUgRjAgOUYgODcgQjFcIiwgXCI4NyBCNSBGMCA5RiA4NyBCOVwiLCBcIjg3IEI1IEYwIDlGIDg3IEI3XCIsIFwiODcgQjYgRjAgOUYgODcgQTZcIiwgXCI4NyBCNyBGMCA5RiA4NyBBQVwiLCBcIjg3IEI3IEYwIDlGIDg3IEI0XCIsIFwiODcgQjcgRjAgOUYgODcgQkFcIiwgXCI4NyBCNyBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE3IEYwIDlGIDg3IEIxXCIsIFwiODcgQjggRjAgOUYgODcgQURcIiwgXCI4NyBCMCBGMCA5RiA4NyBCM1wiLCBcIjg3IEIxIEYwIDlGIDg3IEE4XCIsIFwiODcgQjUgRjAgOUYgODcgQjJcIiwgXCI4NyBCQiBGMCA5RiA4NyBBOFwiLCBcIjg3IEJDIEYwIDlGIDg3IEI4XCIsIFwiODcgQjggRjAgOUYgODcgQjJcIiwgXCI4NyBCOCBGMCA5RiA4NyBCOVwiLCBcIjg3IEI4IEYwIDlGIDg3IEE2XCIsIFwiODcgQjggRjAgOUYgODcgQjNcIiwgXCI4NyBCNyBGMCA5RiA4NyBCOFwiLCBcIjg3IEI4IEYwIDlGIDg3IEE4XCIsIFwiODcgQjggRjAgOUYgODcgQjFcIiwgXCI4NyBCOCBGMCA5RiA4NyBBQ1wiLCBcIjg3IEI4IEYwIDlGIDg3IEJEXCIsIFwiODcgQjggRjAgOUYgODcgQjBcIiwgXCI4NyBCOCBGMCA5RiA4NyBBRVwiLCBcIjg3IEI4IEYwIDlGIDg3IEE3XCIsIFwiODcgQjggRjAgOUYgODcgQjRcIiwgXCI4NyBCRiBGMCA5RiA4NyBBNlwiLCBcIjg3IEFDIEYwIDlGIDg3IEI4XCIsIFwiODcgQjAgRjAgOUYgODcgQjdcIiwgXCI4NyBCOCBGMCA5RiA4NyBCOFwiLCBcIjg3IEFBIEYwIDlGIDg3IEI4XCIsIFwiODcgQjEgRjAgOUYgODcgQjBcIiwgXCI4NyBCOCBGMCA5RiA4NyBBOVwiLCBcIjg3IEI4IEYwIDlGIDg3IEI3XCIsIFwiODcgQjggRjAgOUYgODcgQkZcIiwgXCI4NyBCOCBGMCA5RiA4NyBBQVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFEXCIsIFwiODcgQjggRjAgOUYgODcgQkVcIiwgXCI4NyBCOSBGMCA5RiA4NyBCQ1wiLCBcIjg3IEI5IEYwIDlGIDg3IEFGXCIsIFwiODcgQjkgRjAgOUYgODcgQkZcIiwgXCI4NyBCOSBGMCA5RiA4NyBBRFwiLCBcIjg3IEI5IEYwIDlGIDg3IEIxXCIsIFwiODcgQjkgRjAgOUYgODcgQUNcIiwgXCI4NyBCOSBGMCA5RiA4NyBCMFwiLCBcIjg3IEI5IEYwIDlGIDg3IEI0XCIsIFwiODcgQjkgRjAgOUYgODcgQjlcIiwgXCI4NyBCOSBGMCA5RiA4NyBCM1wiLCBcIjg3IEI5IEYwIDlGIDg3IEI3XCIsIFwiODcgQjkgRjAgOUYgODcgQjJcIiwgXCI4NyBCOSBGMCA5RiA4NyBBOFwiLCBcIjg3IEI5IEYwIDlGIDg3IEJCXCIsIFwiODcgQkEgRjAgOUYgODcgQUNcIiwgXCI4NyBCQSBGMCA5RiA4NyBBNlwiLCBcIjg3IEE2IEYwIDlGIDg3IEFBXCIsIFwiODcgQUMgRjAgOUYgODcgQTdcIiwgXCI4NyBCQSBGMCA5RiA4NyBCOFwiLCBcIjg3IEJCIEYwIDlGIDg3IEFFXCIsIFwiODcgQkEgRjAgOUYgODcgQkVcIiwgXCI4NyBCQSBGMCA5RiA4NyBCRlwiLCBcIjg3IEJCIEYwIDlGIDg3IEJBXCIsIFwiODcgQkIgRjAgOUYgODcgQTZcIiwgXCI4NyBCQiBGMCA5RiA4NyBBQVwiLCBcIjg3IEJCIEYwIDlGIDg3IEIzXCIsIFwiODcgQkMgRjAgOUYgODcgQUJcIiwgXCI4NyBBQSBGMCA5RiA4NyBBRFwiLCBcIjg3IEJFIEYwIDlGIDg3IEFBXCIsIFwiODcgQkYgRjAgOUYgODcgQjJcIiwgXCI4NyBCRiBGMCA5RiA4NyBCQ1wiXVxuXHRlbW9qaXNBcnJheSA9IFtdXG5cdGZyZXFFbW9qaXNBcnJheSA9IFtdXG5cdGZvciBlbSBpbiByYXdFbW9qaXNcblx0XHRlbW9qaXNBcnJheS5wdXNoIGVtb2ppRm9ybWF0dGVyKGVtKVxuXG5cdFxuXHRmcmVxdWVudGx5VXNlZEVtb2ppc1JhdyA9IFtcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixdXG5cdGZvciBlbSBpbiBmcmVxdWVudGx5VXNlZEVtb2ppc1Jhd1xuXHRcdGZyZXFFbW9qaXNBcnJheS5wdXNoIGVtb2ppRm9ybWF0dGVyKGVtKVxuXG5cdCMgZW1vamlLZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdCMgXHRlbW9qaUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0IyBcdGVtb2ppQkcgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwiI0VDRUVGMVwiXG5cdCMgXHRib3ggPSBleHBvcnRzLnB4KDMwKVxuXHQjIFx0ZW1vamlCRy5jb25zdHJhaW50cyA9ICh0cmFpbGluZzoxLCBsZWFkaW5nOjEsIGJvdHRvbToxLCBoZWlnaHQ6MjU4KVxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0ZW1vamlHYWxsZXkgPSBuZXcgU2Nyb2xsQ29tcG9uZW50IHN1cGVyTGF5ZXI6ZW1vamlCRywgd2lkdGg6ZW1vamlCRy53aWR0aCwgaGVpZ2h0OmVtb2ppQkcuaGVpZ2h0IC0gZXhwb3J0cy5weCg0MClcblx0IyBcdGVtb2ppR2FsbGV5LnNwZWVkWSA9IDAgXG5cdCMgXHRlbW9qaVNwYWNlciA9IGV4cG9ydHMucHgoNilcblx0IyBcdGVtb2ppUGlja2VyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJlbW9qaSBwaWNrZXJcIiwgc3VwZXJMYXllcjplbW9qaUJHXG5cdCMgXHRlbW9qaVBpY2tlci5jb25zdHJhaW50cyA9IFxuXHQjIFx0XHRsZWFkaW5nOjFcblx0IyBcdFx0dHJhaWxpbmc6MVxuXHQjIFx0XHRib3R0b206MVxuXHQjIFx0XHRoZWlnaHQ6NDJcblx0IyBcdEFCQyA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBzdXBlckxheWVyOmVtb2ppUGlja2VyXG5cdCMgXHRBQkMuaHRtbCA9IFwiQUJDXCJcblx0IyBcdEFCQy5zdHlsZSA9IHtcblx0IyBcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMTUpICsgXCJweFwiXG5cdCMgXHRcdFwiZm9udC13ZWlnaHRcIiA6IDUwMFxuXHQjIFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0IyBcdFx0XCJjb2xvclwiIDogXCIjNEY1NTVEXCJcblx0IyBcdH1cblx0IyBcdEFCQy5jb25zdHJhaW50cyA9IFxuXHQjIFx0XHRsZWFkaW5nOjEyXG5cdCMgXHRcdGJvdHRvbToxNFxuXHQjIFx0XHR3aWR0aDozMFxuXHQjIFx0XHRoZWlnaHQ6MTVcblxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0cm93ID0gLTFcblx0IyBcdEFCQy5vbiBFdmVudHMuQ2xpY2ssIC0+XG5cdCMgXHRcdGVtb2ppQkcuZGVzdHJveSgpXG5cdCMgXHRmcmVxdWVudCA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdCMgXHRmcmVxdWVudC5odG1sID0gaWNvbkxpYnJhcnkuZnJlcXVlbnRcblx0IyBcdGZyZXF1ZW50LmNvbnN0cmFpbnRzID0gXG5cdCMgXHRcdGxlYWRpbmcgOiBbQUJDLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdHNtaWxleXMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0c21pbGV5cy5odG1sID0gaWNvbkxpYnJhcnkuc21pbGV5c1xuXHQjIFx0c21pbGV5cy5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbZnJlcXVlbnQsIDE1XVxuXHQjIFx0XHRib3R0b206IDE0XG5cdCMgXHRcdHdpZHRoOjE2XG5cdCMgXHRcdGhlaWdodDoyMFxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0YW5pbWFscyA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHRhbmltYWxzLmh0bWwgPSBpY29uTGlicmFyeS5hbmltYWxzXG5cdCMgXHRhbmltYWxzLmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFtzbWlsZXlzLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdGZvb2QgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0Zm9vZC5odG1sID0gaWNvbkxpYnJhcnkuZm9vZFxuXHQjIFx0Zm9vZC5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbYW5pbWFscywgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRhY3Rpdml0eSA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHRhY3Rpdml0eS5odG1sID0gaWNvbkxpYnJhcnkuYWN0aXZpdHlcblx0IyBcdGFjdGl2aXR5LmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFtmb29kLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdHRyYXZlbCA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHR0cmF2ZWwuaHRtbCA9IGljb25MaWJyYXJ5LnRyYXZlbFxuXHQjIFx0dHJhdmVsLmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFthY3Rpdml0eSwgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRvYmplY3RzID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlQaWNrZXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG9wYWNpdHk6LjRcblx0IyBcdG9iamVjdHMuaHRtbCA9IGljb25MaWJyYXJ5Lm9iamVjdHNcblx0IyBcdG9iamVjdHMuY29uc3RyYWludHMgPVxuXHQjIFx0XHRsZWFkaW5nIDogW3RyYXZlbCwgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRzeW1ib2xzID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlQaWNrZXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG9wYWNpdHk6LjRcblx0IyBcdHN5bWJvbHMuaHRtbCA9IGljb25MaWJyYXJ5LnN5bWJvbHNcblx0IyBcdHN5bWJvbHMuY29uc3RyYWludHMgPVxuXHQjIFx0XHRsZWFkaW5nIDogW29iamVjdHMsIDE1XVxuXHQjIFx0XHRib3R0b206IDE0XG5cdCMgXHRcdHdpZHRoOjE2XG5cdCMgXHRcdGhlaWdodDoyMFxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0ZmxhZ3MgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0ZmxhZ3MuaHRtbCA9IGljb25MaWJyYXJ5LmZsYWdzXG5cdCMgXHRmbGFncy5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbc3ltYm9scywgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cblx0IyBcdGxvYWRFbW9qaXMgPSAoZW0pIC0+XG5cdCMgXHRcdHJvdysrIFxuXHQjIFx0XHRpbmRleCA9IGVtb2ppc0FycmF5LmluZGV4T2YoZW0pXG5cdCMgXHRcdGNvbCA9IE1hdGguZmxvb3IoaW5kZXgvNSlcblx0IyBcdFx0aWYgcm93ID4gNFxuXHQjIFx0XHRcdHJvdyA9IDAgXG5cdCMgXHRcdGVtb2ppID0gbmV3IExheWVyIHg6Y29sKmJveCArIChlbW9qaVNwYWNlciAqIGNvbCkgKyBleHBvcnRzLnB4KDMpLCB5OnJvdypib3ggKyAoZW1vamlTcGFjZXIgKiByb3cpICsgZXhwb3J0cy5weCg0MCksIHN1cGVyTGF5ZXI6ZW1vamlHYWxsZXkuY29udGVudCwgd2lkdGg6Ym94LCBoZWlnaHQ6Ym94LCBuYW1lOmRlY29kZVVSSUNvbXBvbmVudChlbSksIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0IyBcdFx0ZW1vamkuaHRtbCA9IGRlY29kZVVSSUNvbXBvbmVudChlbSlcblx0IyBcdFx0ZW1vamkuc3R5bGUgPSB7XG5cdCMgXHRcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMjYpICsgXCJweFwiXG5cdCMgXHRcdFx0XCJsaW5lLWhlaWdodFwiIDogYm94ICsgXCJweFwiXG5cdCMgXHRcdFx0XCJ0ZXh0LWFsaWduXCIgOiBcImNlbnRlclwiXG5cdCMgXHRcdH1cblx0IyBcdFx0ZW1vamkub24gRXZlbnRzLkNsaWNrLCAtPlxuXHQjIFx0XHRcdHByaW50IEAubmFtZVxuXHQjIFx0XHRlbW9qaXNMb2FkZWQrK1xuXHQjIFx0XHRwcmludCBlbW9qaXNMb2FkZWRcblxuXHQjIFx0aW5jID0gMjAwXG5cdCMgXHRmaXJzdExvYWQgPSAuMVxuXHQjIFx0dGltZUluYyA9IDJcblx0IyBcdGZ1bGxBbW91bnQgPSBlbW9qaXNBcnJheS5sZW5ndGhcblx0IyBcdGxvYWRzID0gTWF0aC5jZWlsKGZ1bGxBbW91bnQgLyBpbmMpIC0gMVxuXHQjIFx0cGFydGlhbEFtb3VudCA9IGZ1bGxBbW91bnQgJSBpbmNcblx0IyBcdGVtb2ppc0xvYWRlZCA9IDBcblx0IyBcdGZvciBpIGluIFswLi5sb2Fkc11cblx0IyBcdFx0aSsrXG5cdFx0XHRcblx0IyBcdCNTY3JvbGwgTG9hZFxuXHQjIFx0ZW1vamlHYWxsZXkub24gRXZlbnRzLk1vdmUsIC0+XG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiAyMDAwICYmIGVtb2ppc0xvYWRlZCA8IDQwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVsyMDAuLi40MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSAyMDAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiA1MDAwICYmIGVtb2ppc0xvYWRlZCA8IDYwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs0MDAuLi42MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSA1MDAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiA3NTAwICYmIGVtb2ppc0xvYWRlZCA8IDgwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs2MDAuLi44MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSA3NTAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiAxMDAwMCAmJiBlbW9qaXNMb2FkZWQgPCAxMDAwXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzgwMC4uLjEwMDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSAxMDAwMVxuXHQjIFx0XHRpZiBlbW9qaUdhbGxleS5zY3JvbGxYID4gMTI1MDAgJiYgZW1vamlzTG9hZGVkIDwgMTIwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVsxMDAwLi4uMTI5N11cblx0IyBcdFx0XHRcdGxvYWRFbW9qaXMoZW0pXG5cdCMgXHRcdFx0ZW1vamlHYWxsZXkuc2Nyb2xsWCA9IDEyNTAxXG5cblx0IyBcdCNUaW1lIExvYWRcblx0IyBcdFV0aWxzLmRlbGF5IDEsIC0+IFxuXHQjIFx0XHRpZiBlbW9qaXNMb2FkZWQgPCA0MDAgJiYgZW1vamlHYWxsZXkuc2Nyb2xsWCA9PSAwXG5cdCMgXHRcdFx0c2Nyb2xsWCA9IGVtb2ppR2FsbGV5LnNjcm9sbFhcblx0IyBcdFx0XHRmb3IgZW0gaW4gZW1vamlzQXJyYXlbMjAwLi4uNDAwXVxuXHQjIFx0XHRcdFx0bG9hZEVtb2ppcyhlbSlcblx0IyBcdFV0aWxzLmRlbGF5IDIuNSwgLT4gXG5cdCMgXHRcdGlmIGVtb2ppc0xvYWRlZCA8IDYwMCAmJiBlbW9qaUdhbGxleS5zY3JvbGxYID09IDBcblx0IyBcdFx0XHRzY3JvbGxYID0gZW1vamlHYWxsZXkuc2Nyb2xsWFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs0MDAuLi42MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0VXRpbHMuZGVsYXkgMi41LCAtPiBcblx0IyBcdFx0aWYgZW1vamlzTG9hZGVkIDwgODAwICYmIGVtb2ppR2FsbGV5LnNjcm9sbFggPT0gMFxuXHQjIFx0XHRcdHNjcm9sbFggPSBlbW9qaUdhbGxleS5zY3JvbGxYXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzYwMC4uLjgwMF1cblx0IyBcdFx0XHRcdGxvYWRFbW9qaXMoZW0pXG5cdCMgXHRVdGlscy5kZWxheSA1LjUsIC0+IFxuXHQjIFx0XHRpZiBlbW9qaXNMb2FkZWQgPCAxMDAwICYmIGVtb2ppR2FsbGV5LnNjcm9sbFggPT0gMFxuXHQjIFx0XHRcdHNjcm9sbFggPSBlbW9qaUdhbGxleS5zY3JvbGxYXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzgwMC4uLjEwMDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0VXRpbHMuZGVsYXkgNywgLT4gXG5cdCMgXHRcdGlmIGVtb2ppc0xvYWRlZCA8IDEyOTcgJiYgZW1vamlHYWxsZXkuc2Nyb2xsWCA9PSAwXG5cdCMgXHRcdFx0c2Nyb2xsWCA9IGVtb2ppR2FsbGV5LnNjcm9sbFhcblx0IyBcdFx0XHRmb3IgZW0gaW4gZW1vamlzQXJyYXlbMTAwMC4uLjEyOTddXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXG5cblx0IyBcdGZvciBlbSBpbiBmcmVxRW1vamlzQXJyYXlcblx0IyBcdFx0bG9hZEVtb2ppcyhlbSlcblx0IyBcdGZvciBlbSBpbiBlbW9qaXNBcnJheVswLi4uaW5jXVxuXHQjIFx0XHRsb2FkRW1vamlzKGVtKVxuXG5cblx0IyBcdGZvciBzZWMgaW4gZW1vamlTZWN0aW9uc1xuXHQjIFx0XHRpbmRleCA9IGVtb2ppU2VjdGlvbnMuaW5kZXhPZihzZWMpXG5cdCMgXHRcdHRpdGxlID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlHYWxsZXkuY29udGVudCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDppbmRleCo1MDAwICsgZXhwb3J0cy5weCg4KSwgaGVpZ2h0OjgwLCB3aWR0aDo4MDBcblx0IyBcdFx0dGl0bGUuaHRtbCA9IHNlY1xuXHQjIFx0XHR0aXRsZS5zdHlsZSA9IHtcblx0IyBcdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxMikgKyBcInB4XCJcblx0IyBcdFx0XHRcImZvbnQtd2VpZ2h0XCIgOiA2MDBcblx0IyBcdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0IyBcdFx0XHQnbGluZS1oZWlnaHQnIDogZXhwb3J0cy5weCg0MikgKyBcInB4XCJcblx0IyBcdFx0XHQnbGV0dGVyLXNwYWNpbmcnIDogZXhwb3J0cy5weCgwLjcpICsgXCJweFwiXG5cdCMgXHRcdFx0J2NvbG9yJyA6IFwiI0E1QTZBOVwiXG5cdCMgXHRcdFx0J3RleHQtdHJhbnNmb3JtJyA6ICd1cHBlcmNhc2UnXG5cdCMgXHRcdH1cblxuXG5cdCMgZW1vamlLZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHQjIFx0ZW1vamlLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXG5cblxuXHRyZXR1cm4gYm9hcmRcblxuZXhwb3J0cy5TaGVldCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcInNoZWV0XCIsIGFycmF5KVxuXHRzaGVldCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdHNoZWV0LmNvbnN0cmFpbnRzID0gXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdHRvcDowXG5cdFx0Ym90dG9tOjBcblx0b3ZlcmxheSA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJyZ2JhKDAsIDAsIDAsIC40KVwiLCBzdXBlckxheWVyOnNoZWV0LCBuYW1lOlwib3ZlcmxheVwiXG5cdG92ZXJsYXkuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdHNoZWV0cyA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBzdXBlckxheWVyOnNoZWV0XG5cdHNoZWV0cy5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdGV4aXRCdXR0b24gPSBuZXcgZXhwb3J0cy5CdXR0b24gYnV0dG9uVHlwZTpcImJpZ1wiLCB0ZXh0OnNldHVwLmV4aXQsIGJsdXI6ZmFsc2UsIHN1cGVyTGF5ZXI6c2hlZXRzXG5cdGV4aXRCdXR0b24uY29uc3RyYWludHMgPSBcblx0XHRib3R0b206MTBcblx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXG5cdGFjdGlvbnMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpzaGVldHMsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEyLjUpLCBiYWNrZ3JvdW5kQ29sb3I6XCJyZ2JhKDI1NSwyNTUsMjU1LCAuODUpXCJcblxuXHRkZXNjcmlwdGlvbkJ1ZmZlciA9IDBcblx0aWYgc2V0dXAuZGVzY3JpcHRpb25cblx0XHRkZXNjcmlwdGlvbiA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJzaGVldERlc2NyaXB0aW9uXCIsIHRleHQ6c2V0dXAuZGVzY3JpcHRpb24sIHN1cGVyTGF5ZXI6YWN0aW9ucywgZm9udFNpemU6MTMsIGNvbG9yOlwiIzhGOEU5NFwiLCB0ZXh0QWxpZ246XCJjZW50ZXJcIlxuXHRcdGRlc2NyaXB0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHR0b3A6MjFcblx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHR3aWR0aDpleHBvcnRzLnB0KGV4cG9ydHMud2lkdGgpIC0gMTAwXG5cdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGRlc2NyaXB0aW9uQnVmZmVyID0gZXhwb3J0cy5wdChkZXNjcmlwdGlvbi5oZWlnaHQpICsgNDJcblx0XHRkaXZpZGVyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6YWN0aW9ucywgYmFja2dyb3VuZENvbG9yOlwiI0Q2RTNFN1wiXG5cdFx0ZGl2aWRlci5jb25zdHJhaW50cyA9XG5cdFx0XHRoZWlnaHQ6MVxuXHRcdFx0dG9wOmRlc2NyaXB0aW9uQnVmZmVyXG5cdFx0XHRsZWFkaW5nOjBcblx0XHRcdHRyYWlsaW5nOjBcblx0ZXhwb3J0cy5iZ0JsdXIoYWN0aW9ucylcblx0YWN0aW9ucy5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MTBcblx0XHR0cmFpbGluZzoxMFxuXHRcdGJvdHRvbTpbZXhpdEJ1dHRvbiwgMTBdXG5cdFx0aGVpZ2h0OjU4ICogc2V0dXAuYWN0aW9ucy5sZW5ndGggKyBkZXNjcmlwdGlvbkJ1ZmZlclxuXHRleHBvcnRzLmxheW91dCgpXG5cdGFjdHMgPSB7fVxuXHRmb3IgYWN0LCBpbmRleCBpbiBzZXR1cC5hY3Rpb25zXG5cdFx0byA9IG5ldyBMYXllciBzdXBlckxheWVyOmFjdGlvbnMsIHdpZHRoOmFjdGlvbnMud2lkdGgsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEyLjUpXG5cdFx0by5jb25zdHJhaW50cyA9IFxuXHRcdFx0dG9wOmluZGV4ICogNTggKyBkZXNjcmlwdGlvbkJ1ZmZlclxuXHRcdFx0aGVpZ2h0OjU4XG5cdFx0YnV0dG9uID0gbmV3IGV4cG9ydHMuQnV0dG9uIHRleHQ6YWN0LCBzdXBlckxheWVyOm8sIGZvbnRTaXplOjIwXG5cdFx0c3BlY2lhbENoYXIoYnV0dG9uKVxuXHRcdGJ1dHRvbi5jb25zdHJhaW50cyA9XG5cdFx0XHRhbGlnbjpcImNlbnRlclwiXG5cdFx0YnV0dG9uLmNvbG9yID0gXCIjRkUzODI0XCJcblx0XHRpZiBpbmRleCAhPSBzZXR1cC5hY3Rpb25zLmxlbmd0aCAtIDFcblx0XHRcdGRpdmlkZXIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpvLCB3aWR0aDphY3Rpb25zLndpZHRoLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRDZFM0U3XCJcblx0XHRcdGRpdmlkZXIuY29uc3RyYWludHMgPVxuXHRcdFx0XHRoZWlnaHQ6MVxuXHRcdFx0XHRib3R0b206MFxuXHRcdGV4cG9ydHMubGF5b3V0KClcblx0XHRvLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDIxNSwyMTUsMjE1LC43KVwiXG5cdFx0XHRALmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczogKGJhY2tncm91bmRDb2xvcjogYmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHR0aW1lOi41XG5cdFx0by5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRALmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIilcblx0XHRcdFx0dGltZTouNVxuXHRcdFx0c2hlZXRzLmFuaW1hdGUgXG5cdFx0XHRcdHByb3BlcnRpZXM6IChtYXhZOmV4cG9ydHMuaGVpZ2h0K2V4cG9ydHMucHgoKHNldHVwLmFjdGlvbnMubGVuZ3RoICsgMykgKiA1OCkpXG5cdFx0XHRcdHRpbWU6LjNcblx0XHRcdG92ZXJsYXkuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiAob3BhY2l0eTowKVxuXHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRVdGlscy5kZWxheSAuMywgLT5cblx0XHRcdFx0c2hlZXQuZGVzdHJveSgpXG5cdFx0YWN0c1thY3RdID0gb1xuXG5cdGlmIHNldHVwLmFuaW1hdGVkID09IHRydWVcblx0XHRvdmVybGF5Lm9wYWNpdHkgPSAwIFxuXHRcdHNoZWV0cy5tYXhZID0gZXhwb3J0cy5oZWlnaHQgKyBleHBvcnRzLnB4KChzZXR1cC5hY3Rpb25zLmxlbmd0aCArIDMpICogNTgpXG5cdFx0b3ZlcmxheS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOihvcGFjaXR5OjEpXG5cdFx0XHR0aW1lOi4zXG5cdFx0c2hlZXRzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6KG1heFk6ZXhwb3J0cy5oZWlnaHQpXG5cdFx0XHR0aW1lOi4zXG5cblx0b3ZlcmxheS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c2hlZXRzLmFuaW1hdGUgXG5cdFx0XHRwcm9wZXJ0aWVzOiAobWF4WTpleHBvcnRzLmhlaWdodCtleHBvcnRzLnB4KChzZXR1cC5hY3Rpb25zLmxlbmd0aCArIDMpICogNTgpKVxuXHRcdFx0dGltZTouM1xuXHRcdG92ZXJsYXkuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczogKG9wYWNpdHk6MClcblx0XHRcdHRpbWU6LjNcblx0XHRVdGlscy5kZWxheSAuMywgLT5cblx0XHRcdHNoZWV0LmRlc3Ryb3koKVx0XHRcblxuXHRleGl0QnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRzaGVldHMuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6IChtYXhZOmV4cG9ydHMuaGVpZ2h0K2V4cG9ydHMucHgoKHNldHVwLmFjdGlvbnMubGVuZ3RoICsgMykgKiA1OCkpXG5cdFx0XHR0aW1lOi4zXG5cdFx0b3ZlcmxheS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOiAob3BhY2l0eTowKVxuXHRcdFx0dGltZTouM1xuXHRcdFV0aWxzLmRlbGF5IC4zLCAtPlxuXHRcdFx0c2hlZXQuZGVzdHJveSgpXG5cblx0c2hlZXQuY2FuY2VsID0gZXhpdEJ1dHRvblxuXHRzaGVldC5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG5cdHNoZWV0Lm92ZXJsYXkgPSBvdmVybGF5XG5cdHNoZWV0LmFjdGlvbnMgPSBhY3RzXG5cdHJldHVybiBzaGVldFxuXG5leHBvcnRzLk5hdkJhciA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcIm5hdkJhclwiLCBhcnJheSlcblx0YmFyID0gbmV3IExheWVyIG5hbWU6XCJuYXZiYXJcIlxuXHRiYXJBcmVhID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6YmFyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdGRpdmlkZXIgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwiI0IyQjJCMlwiLCBuYW1lOlwibmF2IGRpdmlkZXJcIiwgc3VwZXJMYXllcjpiYXJBcmVhXG5cdGlmIHNldHVwLnN1cGVyTGF5ZXIgXG5cdFx0c2V0dXAuc3VwZXJMYXllci5hZGRTdWJMYXllcihiYXIpXG5cdGRpdmlkZXIuY29uc3RyYWludHMgPVxuXHRcdGhlaWdodDouNVxuXHRcdGJvdHRvbTowXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRpZiBzZXR1cC5ibHVyIFxuXHRcdGJhci5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgLjgpXCJcblx0XHRleHBvcnRzLmJnQmx1cihiYXIpXG5cdGVsc2Vcblx0XHRiYXIuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpXCJcblx0XHRleHBvcnRzLmJnQmx1cihiYXIpXG5cdGJhci50eXBlID0gc2V0dXAudHlwZVxuXHRiYXJBcmVhLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjQ0XG5cdFx0Ym90dG9tOjBcblx0YmFyLmNvbnN0cmFpbnRzID0gXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdHRvcDowXG5cdFx0aGVpZ2h0OjY0XG5cdGZvciBsYXllciBpbiBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdFx0aWYgbGF5ZXIudHlwZSA9PSBcInN0YXR1c0JhclwiXG5cdFx0XHRAc3RhdHVzQmFyID0gbGF5ZXJcblx0XHRcdGJhci5wbGFjZUJlaGluZChAc3RhdHVzQmFyKVxuXG5cdGlmIHR5cGVvZiBzZXR1cC50aXRsZSA9PSBcInN0cmluZ1wiXG5cdFx0dGl0bGUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwibmF2QmFyVGl0bGVcIiwgZm9udFdlaWdodDpcInNlbWlib2xkXCIsIHN1cGVyTGF5ZXI6YmFyQXJlYSwgdGV4dDpzZXR1cC50aXRsZVxuXHRpZiB0eXBlb2Ygc2V0dXAudGl0bGUgPT0gXCJvYmplY3RcIiBcblx0XHR0aXRsZSA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJuYXZCYXJUaXRsZVwiLCBmb250V2VpZ2h0Olwic2VtaWJvbGRcIiwgc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLnRpdGxlLmxhYmVsLmh0bWxcblx0XHRiYXIuc3VwZXJMYXllciA9IHNldHVwLnRpdGxlLnZpZXdcblx0c3BlY2lhbENoYXIodGl0bGUpXG5cdHRpdGxlLmNvbnN0cmFpbnRzID0gXG5cdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHRib3R0b206MTJcblxuXHQjIEhhbmRsZSBSaWdodFxuXHRpZiB0eXBlb2Ygc2V0dXAucmlnaHQgPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygc2V0dXAucmlnaHQgIT0gXCJib29sZWFuXCJcblx0XHRiYXIucmlnaHQgPSBuZXcgZXhwb3J0cy5CdXR0b24gc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLnJpZ2h0LCBmb250V2VpZ2h0OjUwMCwgY29uc3RyYWludHM6e2JvdHRvbToxMiwgdHJhaWxpbmc6OH1cblx0XHRiYXIucmlnaHQudHlwZSA9IFwiYnV0dG9uXCJcblx0XHRzcGVjaWFsQ2hhcihiYXIucmlnaHQpXG5cdGlmIHR5cGVvZiBzZXR1cC5yaWdodCA9PSBcIm9iamVjdFwiXG5cdFx0YmFyLnJpZ2h0ID0gc2V0dXAucmlnaHRcblx0XHRiYXIucmlnaHQuc3VwZXJMYXllciA9IGJhckFyZWFcblx0XHRiYXIucmlnaHQuY29uc3RyYWludHMgPSB7XG5cdFx0XHR0cmFpbGluZzo4XG5cdFx0XHRib3R0b206MTJcblx0XHR9XG5cblx0IyBIYW5kbGUgTGVmdFxuXHRpZiB0eXBlb2Ygc2V0dXAubGVmdCA9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBzZXR1cC5sZWZ0ICE9IFwiYm9vbGVhblwiXG5cdFx0bGVhZGluZyA9IDhcblx0XHRpZiBzZXR1cC5sZWZ0LmluZGV4T2YoXCI8XCIpICE9IC0xXG5cdFx0XHRzdmcgPSBleHBvcnRzLnN2ZyhpY29uTGlicmFyeS5jaGV2cm9uKVxuXHRcdFx0YmFyLmNoZXZyb24gPSBuZXcgTGF5ZXIgd2lkdGg6c3ZnLndpZHRoLCBoZWlnaHQ6c3ZnLmhlaWdodCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgc3VwZXJMYXllcjpiYXJBcmVhXG5cdFx0XHRiYXIuY2hldnJvbi5odG1sID0gc3ZnLnN2Z1xuXHRcdFx0YmFyLmNoZXZyb24uY29uc3RyYWludHMgPSB7Ym90dG9tOjksIGxlYWRpbmc6OH1cblx0XHRcdHNldHVwLmxlZnQgPSBzZXR1cC5sZWZ0LnJlcGxhY2UoXCI8XCIsIFwiXCIpXG5cdFx0XHRsZWFkaW5nID0gW2Jhci5jaGV2cm9uLCA0XVxuXG5cdFx0YmFyLmxlZnQgPSBuZXcgZXhwb3J0cy5CdXR0b24gc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLmxlZnQsIGZvbnRXZWlnaHQ6NTAwLCBjb25zdHJhaW50czp7Ym90dG9tOjEyLCBsZWFkaW5nOmxlYWRpbmd9XG5cdFx0XG5cdFx0YmFyLmxlZnQub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0XHRpZiBiYXIuY2hldnJvblxuXHRcdFx0XHRiYXIuY2hldnJvbi5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eTouMjUpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdGJhci5sZWZ0Lm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdGlmIGJhci5jaGV2cm9uXG5cdFx0XHRcdGJhci5jaGV2cm9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihvcGFjaXR5OjEpXG5cdFx0XHRcdFx0dGltZTouNVxuXG5cdGlmIHR5cGVvZiBzZXR1cC5sZWZ0ID09IFwib2JqZWN0XCJcblx0XHRiYXIubGVmdCA9IHNldHVwLmxlZnRcblx0XHRiYXIubGVmdC5zdXBlckxheWVyID0gYmFyQXJlYVxuXHRcdGJhci5sZWZ0LmNvbnN0cmFpbnRzID0ge1xuXHRcdFx0bGVhZGluZzo4XG5cdFx0XHRib3R0b206MTJcblx0XHR9XG5cblxuXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRyZXR1cm4gYmFyXG5cbmV4cG9ydHMuVGFiID0gKGFycmF5KSAtPlxuXHRzZXR1cCA9IHNldHVwQ29tcG9uZW50KFwidGFiXCIsIGFycmF5KVxuXHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2UgXG5cdFx0d2hlbiBcImlwaG9uZS01XCJcblx0XHRcdEB0YWJXaWR0aCA9IDU1XG5cdFx0ZWxzZVxuXHRcdFx0QHRhYldpZHRoID0gNzVcblx0dGFiVmlldyA9IG5ldyBMYXllciBuYW1lOnNldHVwLmxhYmVsICsgXCIgdmlld1wiLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdHRhYlZpZXcuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0dG9wOjBcblx0XHRib3R0b206MFxuXHR0YWJCb3ggPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpzZXR1cC5sYWJlbCArIFwiIHRhYlwiXG5cdHRhYkJveC5jb25zdHJhaW50cyA9XG5cdFx0d2lkdGg6QHRhYldpZHRoXG5cdFx0aGVpZ2h0OjQ5XG5cdGljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyNSksIGhlaWdodDpleHBvcnRzLnB4KDI1KSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpcImljb25cIiwgc3VwZXJMYXllcjp0YWJCb3hcblx0aWNvbi5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHR0b3A6N1xuXHRzdmdGcmFtZSA9IGV4cG9ydHMuc3ZnKHNldHVwLmljb24pXG5cdGljb24uaHRtbCA9IHN2Z0ZyYW1lLnN2Z1xuXHRpY29uLndpZHRoID0gc3ZnRnJhbWUud2lkdGhcblx0aWNvbi5oZWlnaHQgPSBzdmdGcmFtZS5oZWlnaHRcblx0bGFiZWwgPSBuZXcgZXhwb3J0cy5UZXh0IHRleHQ6c2V0dXAubGFiZWwsIHN1cGVyTGF5ZXI6dGFiQm94LCBjb2xvcjpcIiM5MjkyOTJcIiwgZm9udFNpemU6MTAsIG5hbWU6XCJsYWJlbFwiLCB0ZXh0VHJhbnNmb3JtOlwiY2FwaXRhbGl6ZVwiXG5cdGxhYmVsLmNvbnN0cmFpbnRzID0gXG5cdFx0Ym90dG9tOjJcblx0XHRob3Jpem9udGFsQ2VudGVyOmljb25cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdCMgRXhwb3J0IFRhYlxuXHR0YWJCb3gudHlwZSA9IFwidGFiXCJcblx0dGFiQm94Lmljb24gPSBpY29uXG5cdHRhYkJveC52aWV3ID0gdGFiVmlld1xuXHR0YWJCb3gubGFiZWwgPSBsYWJlbFxuXG5cdHJldHVybiB0YWJCb3hcblxuZXhwb3J0cy5UYWJCYXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJ0YWJCYXJcIiwgYXJyYXkpXG5cdGlmIHNldHVwLnRhYnMubGVuZ3RoID09IDBcblx0XHRkdW1teVRhYiA9IG5ldyBleHBvcnRzLlRhYlxuXHRcdGR1bW15VGFiMiA9IG5ldyBleHBvcnRzLlRhYlxuXHRcdHNldHVwLnRhYnMucHVzaCBkdW1teVRhYlxuXHRcdHNldHVwLnRhYnMucHVzaCBkdW1teVRhYjJcblx0dGFiV2lkdGggPSA3NVxuXHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2UgXG5cdFx0d2hlbiBcImlwaG9uZS01XCJcblx0XHRcdHRhYldpZHRoID0gNTVcblx0XHRlbHNlXG5cdFx0XHR0YWJXaWR0aCA9IDc1XG5cdHRhYkJhciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwidGFiIGJhclwiXG5cdHRhYkJhckJHID0gbmV3IEJhY2tncm91bmRMYXllciBzdXBlckxheWVyOnRhYkJhciwgbmFtZTpcInRhYkJhciBiYWNrZ3JvdW5kXCJcblx0dGFiQmFyLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0Ym90dG9tOjBcblx0XHRoZWlnaHQ6NDlcblx0dGFiQmFyQkcuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHRib3R0b206MFxuXHRcdGhlaWdodDo0OVxuXHRkaXZpZGVyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcIiNCMkIyQjJcIiwgbmFtZTpcInRhYkRpdmlkZXJcIiwgc3VwZXJMYXllcjp0YWJCYXJcblx0ZGl2aWRlci5jb25zdHJhaW50cyA9IFxuXHRcdHRvcDowXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdGhlaWdodDouNVxuXHR0YWJCYXJCb3ggPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjp0YWJCYXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJ0YWJCYXIgYm94XCJcblx0dGFiQmFyQm94LmNvbnN0cmFpbnRzID0gXG5cdFx0aGVpZ2h0OjQ5XG5cdFx0d2lkdGg6c2V0dXAudGFicy5sZW5ndGggKiB0YWJXaWR0aFxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHRzZXRBY3RpdmUgPSAodGFiSW5kZXgpIC0+XG5cdFx0Zm9yIHRhYiwgaW5kZXggaW4gc2V0dXAudGFic1xuXHRcdFx0aWYgaW5kZXggPT0gdGFiSW5kZXhcblx0XHRcdFx0ZXhwb3J0cy5jaGFuZ2VGaWxsKHRhYi5pY29uLCBleHBvcnRzLmNvbG9yKHNldHVwLmFjdGl2ZUNvbG9yKSlcblx0XHRcdFx0dGFiLmxhYmVsLmNvbG9yID0gZXhwb3J0cy5jb2xvcihzZXR1cC5hY3RpdmVDb2xvcilcblx0XHRcdFx0dGFiLnZpZXcudmlzaWJsZSA9IHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZXhwb3J0cy5jaGFuZ2VGaWxsKHRhYi5pY29uLCBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpKVxuXHRcdFx0XHR0YWIubGFiZWwuY29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpXG5cdFx0XHRcdHRhYi52aWV3LnZpc2libGUgPSBmYWxzZVxuXG5cdGZvciB0YWIsIGluZGV4IGluIHNldHVwLnRhYnNcblx0XHQjQ2hlY2sgZm9yIHZhaWxkIHRhYiBvYmplY3Rcblx0XHRpZiB0YWIudHlwZSAhPSBcInRhYlwiXG5cdFx0XHRlcnJvcih0YWIuaWQsIDUpXG5cblx0XHR0YWJCYXJCb3guYWRkU3ViTGF5ZXIodGFiKVxuXHRcdCMgQ2hhbmdlIGNvbG9yc1xuXHRcdGV4cG9ydHMuY2hhbmdlRmlsbCh0YWIuaWNvbiwgZXhwb3J0cy5jb2xvcihzZXR1cC5pbmFjdGl2ZUNvbG9yKSlcblx0XHR0YWIubGFiZWwuY29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpXG5cdFx0dGFiQmFyQkcuYmFja2dyb3VuZENvbG9yID0gc2V0dXAuYmFja2dyb3VuZENvbG9yXG5cdFx0aWYgc2V0dXAuYmx1clxuXHRcdFx0dGFiQmFyQkcuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwyNTUsMjU1LCAuOSlcIlxuXHRcdFx0ZXhwb3J0cy5iZ0JsdXIodGFiQmFyQkcpXG5cblx0XHRpZiBpbmRleCAhPSAwXG5cdFx0XHR0YWIuY29uc3RyYWludHMgPSBcblx0XHRcdFx0bGVhZGluZzpzZXR1cC50YWJzW2luZGV4IC0gMV1cblx0XHRcdGV4cG9ydHMubGF5b3V0KClcblxuXHRcdHRhYi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdHRhYkluZGV4ID0gQC54IC8gZXhwb3J0cy5weCh0YWJXaWR0aClcblx0XHRcdHNldEFjdGl2ZSh0YWJJbmRleClcblx0dGFiQmFyQm94LmNvbnN0cmFpbnRzID1cblx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXG5cdHNldEFjdGl2ZShzZXR1cC5zdGFydClcdFxuXG5cdGV4cG9ydHMubGF5b3V0KClcblx0cmV0dXJuIHRhYkJhclxuXG5leHBvcnRzLlRleHQgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJ0ZXh0XCIsIGFycmF5KVxuXHRleGNlcHRpb25zID0gT2JqZWN0LmtleXMoc2V0dXApXG5cdHRleHRMYXllciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOnNldHVwLm5hbWVcblx0dGV4dExheWVyLnR5cGUgPSBcInRleHRcIlxuXHR0ZXh0TGF5ZXIuaHRtbCA9IHNldHVwLnRleHRcblx0Zm9yIHByb3AgaW4gZGVmYXVsdHMuZnJhbWVyUHJvcHNcblx0XHRpZiBzZXR1cFtwcm9wXVxuXHRcdFx0aWYgcHJvcCA9PSBcImNvbG9yXCJcblx0XHRcdFx0c2V0dXBbcHJvcF0gPSBleHBvcnRzLmNvbG9yKHNldHVwW3Byb3BdKVxuXHRcdFx0dGV4dExheWVyW3Byb3BdID0gc2V0dXBbcHJvcF1cblx0Zm9yIHByb3AgaW4gZGVmYXVsdHMuc3R5bGVQcm9wc1xuXHRcdGlmIHNldHVwW3Byb3BdXG5cdFx0XHRpZiBwcm9wID09IFwibGluZUhlaWdodFwiICYmIHNldHVwW3Byb3BdID09IFwiYXV0b1wiXG5cdFx0XHRcdHNldHVwW3Byb3BdID0gIHNldHVwW1wiZm9udFNpemVcIl1cblx0XHRcdGlmIHByb3AgPT0gXCJmb250V2VpZ2h0XCJcblx0XHRcdFx0c3dpdGNoIHNldHVwW3Byb3BdXG5cdFx0XHRcdFx0d2hlbiBcInVsdHJhdGhpblwiIHRoZW4gc2V0dXBbcHJvcF0gPSAxMDBcblx0XHRcdFx0XHR3aGVuIFwidGhpblwiIHRoZW4gc2V0dXBbcHJvcF0gPSAyMDBcblx0XHRcdFx0XHR3aGVuIFwibGlnaHRcIiB0aGVuIHNldHVwW3Byb3BdID0gMzAwXG5cdFx0XHRcdFx0d2hlbiBcInJlZ3VsYXJcIiB0aGVuIHNldHVwW3Byb3BdID0gNDAwXG5cdFx0XHRcdFx0d2hlbiBcIm1lZGl1bVwiIHRoZW4gc2V0dXBbcHJvcF0gPSA1MDBcblx0XHRcdFx0XHR3aGVuIFwic2VtaWJvbGRcIiB0aGVuIHNldHVwW3Byb3BdID0gNjAwXG5cdFx0XHRcdFx0d2hlbiBcImJvbGRcIiB0aGVuIHNldHVwW3Byb3BdID0gNzAwXG5cdFx0XHRcdFx0d2hlbiBcImJsYWNrXCIgdGhlbiBzZXR1cFtwcm9wXSA9IDgwMFxuXHRcdFx0aWYgc2V0dXBbcHJvcF0gPT0gcGFyc2VJbnQoc2V0dXBbcHJvcF0sIDEwKSAmJiBzZXR1cFtwcm9wXSA8IDk5XG5cdFx0XHRcdHNldHVwW3Byb3BdID0gZXhwb3J0cy5weChzZXR1cFtwcm9wXSkgKyBcInB4XCJcblx0XHRcdHRleHRMYXllci5zdHlsZVtwcm9wXSA9IHNldHVwW3Byb3BdXG5cdHRleHRGcmFtZSA9IHRleHRBdXRvU2l6ZSh0ZXh0TGF5ZXIpXG5cdHRleHRMYXllci5wcm9wcyA9IChoZWlnaHQ6dGV4dEZyYW1lLmhlaWdodCwgd2lkdGg6dGV4dEZyYW1lLndpZHRoKVxuXHR0ZXh0TGF5ZXIuY29uc3RyYWludHMgPSBzZXR1cC5jb25zdHJhaW50c1xuXHRleHBvcnRzLmxheW91dCgpXG5cdHJldHVybiB0ZXh0TGF5ZXJcblxuaWNvbkxpYnJhcnkgPSB7XG5cdGFjdGl2aXR5OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE2KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTYgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5Tb2NjZXIgQmFsbDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz5cblx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdwYXRoLTEnIGN4PSc4JyBjeT0nOCcgcj0nOCc+PC9jaXJjbGU+XG5cdFx0XHRcdDwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lQaG9uZS02JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMTc5LjAwMDAwMCwgLTYzOS4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdTb2NjZXItQmFsbCcgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTc5LjAwMDAwMCwgNjM5LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHQ8bWFzayBpZD0nbWFzay0yJyBza2V0Y2g6bmFtZT0nTWFzaycgZmlsbD0nd2hpdGUnPlxuXHRcdFx0XHRcdFx0XHRcdDx1c2UgeGxpbms6aHJlZj0nI3BhdGgtMSc+PC91c2U+XG5cdFx0XHRcdFx0XHRcdDwvbWFzaz5cblx0XHRcdFx0XHRcdFx0PHVzZSBpZD0nTWFzaycgc3Ryb2tlPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyB4bGluazpocmVmPScjcGF0aC0xJz48L3VzZT5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTYsMTIuMTIwMzA0NiBMMTIuODU3MzM4NCw4IEwxMy4zNzIzNzY1LDguODU3MTY3MyBMNi41MTUwMzgwNywxMi45Nzc0NzE5IEw2LDEyLjEyMDMwNDYgTDYsMTIuMTIwMzA0NiBaJyBpZD0nUmVjdGFuZ2xlLTQ3JyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTExLjg0OTY0OCw4LjcyNjA1NTEgTDE5LjEwMDExMDMsNS4zNDUxMDkwMSBMMTkuNTIyNzI4NSw2LjI1MTQxNjggTDEyLjI3MjI2NjIsOS42MzIzNjI4OSBMMTEuODQ5NjQ4LDguNzI2MDU1MSBMMTEuODQ5NjQ4LDguNzI2MDU1MSBaJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktMycgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LDMuMTIwMzA0NiBMMTIuODU3MzM4NCwtMSBMMTMuMzcyMzc2NSwtMC4xNDI4MzI2OTkgTDYuNTE1MDM4MDcsMy45Nzc0NzE5IEw2LDMuMTIwMzA0NiBMNiwzLjEyMDMwNDYgWicgaWQ9J1JlY3RhbmdsZS00Ny1Db3B5LTInIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNLTEsNy4xMjAzMDQ2IEw1Ljg1NzMzODQxLDMgTDYuMzcyMzc2NDgsMy44NTcxNjczIEwtMC40ODQ5NjE5MjUsNy45Nzc0NzE5IEwtMSw3LjEyMDMwNDYgTC0xLDcuMTIwMzA0NiBaJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktNCcgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTAnIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKScgeD0nNCcgeT0nNicgd2lkdGg9JzEnIGhlaWdodD0nNSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nUmVjdGFuZ2xlLTUxJyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknIHg9JzExLjUnIHk9JzMnIHdpZHRoPScxJyBoZWlnaHQ9JzEyJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LDQuODU3MTY3MyBMMTEuODU3MzM4NCw4Ljk3NzQ3MTkgTDEyLjM3MjM3NjUsOC4xMjAzMDQ2IEw1LjUxNTAzODA3LDQgTDUsNC44NTcxNjczJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHknIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNSwxMi44NTcxNjczIEwxMS44NTczMzg0LDE2Ljk3NzQ3MTkgTDEyLjM3MjM3NjUsMTYuMTIwMzA0NiBMNS41MTUwMzgwNywxMiBMNSwxMi44NTcxNjczJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktNScgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J00xMS45MDQ4OTcyLDYuMTQ3NjYwNjQgTDEzLjg3MTQyMjcsOC4zMzE3MDg0OSBMMTIuNDAxOTU5NiwxMC44NzY4OTMzIEw5LjUyNzI1NTg5LDEwLjI2NTg1NjIgTDkuMjIwMDU0NDUsNy4zNDMwMjk2NSBMMTEuOTA0ODk3Miw2LjE0NzY2MDY0JyBpZD0nUG9seWdvbi0xJyBmaWxsPScjRDhEOEQ4JyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTExLjkwNDg5NzIsNi4xNDc2NjA2NCBMMTMuODcxNDIyNyw4LjMzMTcwODQ5IEwxMi40MDE5NTk2LDEwLjg3Njg5MzMgTDkuNTI3MjU1ODksMTAuMjY1ODU2MiBMOS4yMjAwNTQ0NSw3LjM0MzAyOTY1IEwxMS45MDQ4OTcyLDYuMTQ3NjYwNjQnIGlkPSdQb2x5Z29uLTEtQ29weScgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjQ1NzcxMTg5LDMuMTk1MDQ3MzkgTDcuMzU1MTQ0ODQsNi4xMzIxODMzMyBMNC41MzAwNjc2LDYuOTQyMjYxMiBMMi44ODY2NDA4OSw0LjUwNTc4MDkgTDQuNjk2MDI0NTcsMi4xODk4NzU0MSBMNy40NTc3MTE4OSwzLjE5NTA0NzM5JyBpZD0nUG9seWdvbi0xLUNvcHktMicgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjQ1NzcxMTg5LDExLjE5NTA0NzQgTDcuMzU1MTQ0ODQsMTQuMTMyMTgzMyBMNC41MzAwNjc2LDE0Ljk0MjI2MTIgTDIuODg2NjQwODksMTIuNTA1NzgwOSBMNC42OTYwMjQ1NywxMC4xODk4NzU0IEw3LjQ1NzcxMTg5LDExLjE5NTA0NzQnIGlkPSdQb2x5Z29uLTEtQ29weS0zJyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTE0LjU0MzE3MDEsMC4wNzI1OTM5MzE0IEwxNC40NDA2MDMxLDMuMDA5NzI5ODggTDExLjYxNTUyNTgsMy44MTk4MDc3NCBMOS45NzIwOTkxMiwxLjM4MzMyNzQ1IEwxMS43ODE0ODI4LC0wLjkzMjU3ODA1IEwxNC41NDMxNzAxLDAuMDcyNTkzOTMxNCcgaWQ9J1BvbHlnb24tMS1Db3B5LTQnIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0YW5pbWFsczogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgxNyl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE2KX1weCcgdmlld0JveD0nMCAwIDE3IDE3JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+R3JvdXA8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHQ8ZyBpZD0naVBob25lLTYnIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xMTcuMDAwMDAwLCAtNjM5LjAwMDAwMCknIHN0cm9rZT0nIzRBNTM2MSc+XG5cdFx0XHRcdFx0XHQ8ZyBpZD0naWNfRm9vZCcgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTE4LjAwMDAwMCwgNjQwLjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHQ8ZyBpZD0nR3JvdXAnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LjY4Mzc3NTM3LDEuMzgxNTY2NDYgQzYuMjM5MjYwNjYsMS4xMzYyNCA2Ljg1MzcyMDA1LDEgNy41LDEgQzguMTQ2Mjc5OTUsMSA4Ljc2MDczOTM0LDEuMTM2MjQgOS4zMTYyMjQ2MywxLjM4MTU2NjQ2IEM5LjgwODc5Mjc1LDAuNTYyMzU5MDE5IDEwLjgyNTU4ODgsMCAxMiwwIEMxMy42NTY4NTQyLDAgMTUsMS4xMTkyODgxMyAxNSwyLjUgQzE1LDMuNTU3MTM5OCAxNC4yMTI2MjQ2LDQuNDYxMDI4NDMgMTMuMDk5OTIyNiw0LjgyNjYyNTE0IEMxNC4yNDk2NTI4LDUuNjQxODU0MjIgMTUsNi45ODMzMDA2MiAxNSw4LjUgQzE1LDEwLjcxNjcxNDQgMTMuMzk3MTg3MywxMi41NTkwNzE5IDExLjI4NzI2NzEsMTIuOTMxMzY3MyBDMTAuNDg2NzI0OCwxNC4xNzU3NzAzIDkuMDg5NjE2OTYsMTUgNy41LDE1IEM1LjkxMDM4MzA0LDE1IDQuNTEzMjc1MjQsMTQuMTc1NzcwMyAzLjcxMjczMjkxLDEyLjkzMTM2NzMgQzEuNjAyODEyNjgsMTIuNTU5MDcxOSAwLDEwLjcxNjcxNDQgMCw4LjUgQzAsNi45ODMzMDA2MiAwLjc1MDM0NzI0NCw1LjY0MTg1NDIyIDEuOTAwMDc3NDEsNC44MjY2MjUxNCBDMC43ODczNzU0NDUsNC40NjEwMjg0MyAwLDMuNTU3MTM5OCAwLDIuNSBDMCwxLjExOTI4ODEzIDEuMzQzMTQ1NzUsMCAzLDAgQzQuMTc0NDExMjIsMCA1LjE5MTIwNzI1LDAuNTYyMzU5MDE5IDUuNjgzNzc1MzcsMS4zODE1NjY0NiBaJyBpZD0nT3ZhbC04Jz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTUuNzM4MzQyMjgsMTIgQzUuODYyOTA5NzksMTIgNi4xNDY0MjM1MywxMiA2LjE0NjQyMzUzLDEyIEM2LjE0NjQyMzUzLDEyIDYuNDMyMTU2OTYsMTIuNDQyNjEyMyA2LjUyNDY1ODIsMTIuNDkxOTczOSBDNi42NjQ1NTYwMSwxMi41NjY2Mjc3IDcsMTIuNDkxOTczOSA3LDEyLjQ5MTk3MzkgTDcsMTIgTDgsMTIgTDgsMTIuNDkxOTczOSBMOC40OTc5OTIyOCwxMi40OTE5NzM5IEw4Ljg0MzAxNzY5LDEyIEw5LjM5MTg0NTcsMTIgQzkuMzkxODQ1NywxMiA4Ljk5NTk4NDU3LDEyLjk4Mzk0NzggOC40OTc5OTIyOCwxMi45ODM5NDc4IEw2LjYwNzAyNDA3LDEyLjk4Mzk0NzggQzYuMjE0MDQ4MTMsMTIuOTgzOTQ3OCA1LjQ1OTk2MDk0LDEyIDUuNzM4MzQyMjgsMTIgWicgaWQ9J1JlY3RhbmdsZS00NC1Db3B5LTInPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdPdmFsLTE0JyBjeD0nMTAuNScgY3k9JzcuNScgcj0nMC41Jz48L2NpcmNsZT5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdPdmFsLTE0LUNvcHknIGN4PSc0LjUnIGN5PSc3LjUnIHI9JzAuNSc+PC9jaXJjbGU+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTEyLjY5OTk5NjksNSBDMTIuNjk5OTk2OSwzLjA2NzAwMzM4IDExLjEzMjk5MzYsMS41IDkuMTk5OTk2OTUsMS41JyBpZD0nT3ZhbC0xNic+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LjUsNSBDNS41LDMuMDY3MDAzMzggMy45MzI5OTY2MiwxLjUgMiwxLjUnIGlkPSdPdmFsLTE2LUNvcHknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMuNzUwMDAwLCAzLjI1MDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy43NTAwMDAsIC0zLjI1MDAwMCkgJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1JlY3RhbmdsZS00NC1Db3B5JyB4PSc3JyB5PScxMScgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LDEwIEw2LjUsMTAgTDYuNDk5OTk5OTksOS41IEw4LjUwMDAwMDA1LDkuNSBMOC41MDAwMDAwNSwxMCBMOSwxMCBMOSwxMC41IEw4LjUsMTAuNSBMOC41LDExIEw2LjUsMTEgTDYuNSwxMC41IEw2LDEwLjUgTDYsMTAgWicgaWQ9J1BhdGgnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0Y2hldnJvbiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nMTNweCcgaGVpZ2h0PScyMnB4JyB2aWV3Qm94PScwIDAgMTMgMjInIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0ICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42LjEgKDI2MzEzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHQgICAgPHRpdGxlPkJhY2sgQ2hldnJvbjwvdGl0bGU+XG5cdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0ICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdCAgICAgICAgPGcgaWQ9J05hdmlnYXRpb24tQmFyL0JhY2snIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC04LjAwMDAwMCwgLTMxLjAwMDAwMCknIGZpbGw9JyMwMDc2RkYnPlxuXHRcdCAgICAgICAgICAgIDxwYXRoIGQ9J004LjUsNDIgTDE5LDMxLjUgTDIxLDMzLjUgTDEyLjUsNDIgTDIxLDUwLjUgTDE5LDUyLjUgTDguNSw0MiBaJyBpZD0nQmFjay1DaGV2cm9uJz48L3BhdGg+XG5cdFx0ICAgICAgICA8L2c+XG5cdFx0ICAgIDwvZz5cblx0XHQ8L3N2Zz5cIlxuXHRlbW9qaSA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMjApfXB4JyB2aWV3Qm94PScwIDAgMjAgMjAnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPkVtb2ppPC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9Mb3dlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTYwLjAwMDAwMCwgLTE4MS4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHQ8ZyBpZD0nQm90dG9tLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDE3MC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdDxwYXRoIGQ9J002Ni43NSwzMC41IEM3Mi4xMzQ3NzYzLDMwLjUgNzYuNSwyNi4xMzQ3NzYzIDc2LjUsMjAuNzUgQzc2LjUsMTUuMzY1MjIzNyA3Mi4xMzQ3NzYzLDExIDY2Ljc1LDExIEM2MS4zNjUyMjM3LDExIDU3LDE1LjM2NTIyMzcgNTcsMjAuNzUgQzU3LDI2LjEzNDc3NjMgNjEuMzY1MjIzNywzMC41IDY2Ljc1LDMwLjUgWiBNNjYuNzUsMjkuNSBDNzEuNTgyNDkxNiwyOS41IDc1LjUsMjUuNTgyNDkxNiA3NS41LDIwLjc1IEM3NS41LDE1LjkxNzUwODQgNzEuNTgyNDkxNiwxMiA2Ni43NSwxMiBDNjEuOTE3NTA4NCwxMiA1OCwxNS45MTc1MDg0IDU4LDIwLjc1IEM1OCwyNS41ODI0OTE2IDYxLjkxNzUwODQsMjkuNSA2Ni43NSwyOS41IFogTTYzLjc1LDE5IEM2NC40NDAzNTU5LDE5IDY1LDE4LjQ0MDM1NTkgNjUsMTcuNzUgQzY1LDE3LjA1OTY0NDEgNjQuNDQwMzU1OSwxNi41IDYzLjc1LDE2LjUgQzYzLjA1OTY0NDEsMTYuNSA2Mi41LDE3LjA1OTY0NDEgNjIuNSwxNy43NSBDNjIuNSwxOC40NDAzNTU5IDYzLjA1OTY0NDEsMTkgNjMuNzUsMTkgWiBNNjkuNzUsMTkgQzcwLjQ0MDM1NTksMTkgNzEsMTguNDQwMzU1OSA3MSwxNy43NSBDNzEsMTcuMDU5NjQ0MSA3MC40NDAzNTU5LDE2LjUgNjkuNzUsMTYuNSBDNjkuMDU5NjQ0MSwxNi41IDY4LjUsMTcuMDU5NjQ0MSA2OC41LDE3Ljc1IEM2OC41LDE4LjQ0MDM1NTkgNjkuMDU5NjQ0MSwxOSA2OS43NSwxOSBaIE01OS44ODc2MzM0LDIyLjE2NDE0NDQgQzU5LjYzOTAzMTYsMjEuMzgzMTM0IDYwLjA2NTkxOCwyMC45Nzg1MTU2IDYwLjg1MzA5NTEsMjEuMjMyOTMwNCBDNjAuODUzMDk1MSwyMS4yMzI5MzA0IDYzLjA5Mzc1MDMsMjIuMjEyNSA2Ni43NTAwMDAxLDIyLjIxMjUgQzcwLjQwNjI0OTksMjIuMjEyNSA3Mi42NDY5MDQ3LDIxLjIzMjkzMDQgNzIuNjQ2OTA0NywyMS4yMzI5MzA0IEM3My40Mjg3MTYyLDIwLjk2NjIxNTMgNzMuODgxMjQ2MywyMS40MDQ0MDk3IDczLjYwNTg0NzcsMjIuMTgwNzQzNyBDNzMuNjA1ODQ3NywyMi4xODA3NDM3IDcyLjYsMjcuNTc1IDY2Ljc1LDI3LjU3NSBDNjAuOSwyNy41NzUgNTkuODg3NjMzNCwyMi4xNjQxNDQ0IDU5Ljg4NzYzMzQsMjIuMTY0MTQ0NCBaIE02Ni43NSwyMy4xODc1IEM2NC4wNjg3NSwyMy4xODc1IDYxLjg1NDQwNTUsMjIuNDczNzgyMSA2MS44NTQ0MDU1LDIyLjQ3Mzc4MjEgQzYxLjMyNzMwMTksMjIuMzI5NDggNjEuMTc4MTIzMywyMi41NzIxNjE1IDYxLjU2Mzk1NTUsMjIuOTU3MDc1IEM2MS41NjM5NTU1LDIyLjk1NzA3NSA2Mi4zNjI1LDI0LjY1IDY2Ljc1LDI0LjY1IEM3MS4xMzc1LDI0LjY1IDcxLjk1MDg1MDMsMjIuOTQzODMwNCA3MS45NTA4NTAzLDIyLjk0MzgzMDQgQzcyLjMwOTM2NTksMjIuNTM5OTI3OCA3Mi4xNjkwNzkzLDIyLjMzNTk4NDQgNzEuNjM1NDI3MywyMi40NzYzNDkgQzcxLjYzNTQyNzMsMjIuNDc2MzQ5IDY5LjQzMTI1LDIzLjE4NzUgNjYuNzUsMjMuMTg3NSBaJyBpZD0nRW1vamknPjwvcGF0aD5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvZz5cblx0XHQ8L3N2Zz5cIlxuXHRkZWxldGU6IHtcblx0XHRvbiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgyNCl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE4KX1weCcgdmlld0JveD0nMCAwIDI0IDE4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdFx0PHRpdGxlPkJhY2s8L3RpdGxlPlxuXHRcdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTMzOS4wMDAwMDAsIC0xMzAuMDAwMDAwKScgZmlsbD0nIzAzMDMwMyc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdUaGlyZC1Sb3cnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMuMDAwMDAwLCAxMTguMDAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTM1MS42NDI2NjMsMjAuOTc3NjkwMyBMMzU0LjQ2Njc5NSwxOC4xNTM1NTg1IEMzNTQuNzYwMTA2LDE3Ljg2MDI0NzYgMzU0Ljc2Mzk4MywxNy4zODE0OTYyIDM1NC40NzEwOSwxNy4wODg2MDMgQzM1NC4xNzYxNTUsMTYuNzkzNjY3NyAzNTMuNzAxNCwxNi43OTc2MzI4IDM1My40MDYxMzUsMTcuMDkyODk4MyBMMzUwLjU4MjAwMywxOS45MTcwMzAxIEwzNDcuNzU3ODcxLDE3LjA5Mjg5ODMgQzM0Ny40NjQ1NiwxNi43OTk1ODc0IDM0Ni45ODU4MDksMTYuNzk1NzA5NyAzNDYuNjkyOTE2LDE3LjA4ODYwMyBDMzQ2LjM5Nzk4LDE3LjM4MzUzODIgMzQ2LjQwMTk0NSwxNy44NTgyOTMgMzQ2LjY5NzIxMSwxOC4xNTM1NTg1IEwzNDkuNTIxMzQzLDIwLjk3NzY5MDMgTDM0Ni42OTcyMTEsMjMuODAxODIyIEMzNDYuNDAzOSwyNC4wOTUxMzI5IDM0Ni40MDAwMjIsMjQuNTczODg0MyAzNDYuNjkyOTE2LDI0Ljg2Njc3NzYgQzM0Ni45ODc4NTEsMjUuMTYxNzEyOCAzNDcuNDYyNjA2LDI1LjE1Nzc0NzcgMzQ3Ljc1Nzg3MSwyNC44NjI0ODIyIEwzNTAuNTgyMDAzLDIyLjAzODM1MDQgTDM1My40MDYxMzUsMjQuODYyNDgyMiBDMzUzLjY5OTQ0NSwyNS4xNTU3OTMxIDM1NC4xNzgxOTcsMjUuMTU5NjcwOCAzNTQuNDcxMDksMjQuODY2Nzc3NiBDMzU0Ljc2NjAyNSwyNC41NzE4NDIzIDM1NC43NjIwNiwyNC4wOTcwODc1IDM1NC40NjY3OTUsMjMuODAxODIyIEwzNTEuNjQyNjYzLDIwLjk3NzY5MDMgWiBNMzM3LjA1OTM0NSwyMi4wNTkzNDQ1IEMzMzYuNDc0Mjg1LDIxLjQ3NDI4NDcgMzM2LjQ4MTM1MSwyMC41MTg2NDg5IDMzNy4wNTkzNDUsMTkuOTQwNjU1NSBMMzQzLjc4OTkxNSwxMy4yMTAwODUzIEMzNDQuMTgyMDg0LDEyLjgxNzkxNiAzNDQuOTQ4OTIsMTIuNSAzNDUuNTA3NDg0LDEyLjUgTDM1Ni4wMDIwOTgsMTIuNSBDMzU3LjkzMzkzNiwxMi41IDM1OS41LDE0LjA2ODg0NzcgMzU5LjUsMTYuMDAxNzk4MyBMMzU5LjUsMjUuOTk4MjAxNyBDMzU5LjUsMjcuOTMyMTkxNSAzNTcuOTIzMDg4LDI5LjUgMzU2LjAwMjA5OCwyOS41IEwzNDUuNTA3NDg0LDI5LjUgQzM0NC45NTEwNjYsMjkuNSAzNDQuMTc3MTY5LDI5LjE3NzE2OTMgMzQzLjc4OTkxNSwyOC43ODk5MTQ4IEwzMzcuMDU5MzQ1LDIyLjA1OTM0NDUgWicgaWQ9J0JhY2snPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XCJcblx0XHRvZmYgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgyNCl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE4KX1weCcgdmlld0JveD0nMCAwIDI0IDE4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdDx0aXRsZT5CYWNrPC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTMzOS4wMDAwMDAsIC0xMzAuMDAwMDAwKScgZmlsbD0nIzAzMDMwMyc+XG5cdFx0XHRcdFx0PGcgaWQ9J1RoaXJkLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDExOC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdDxwYXRoIGQ9J00zMzcuMDU5MzQ1LDIyLjA1OTM0NDUgQzMzNi40NzQyODUsMjEuNDc0Mjg0NyAzMzYuNDgxMzUxLDIwLjUxODY0ODkgMzM3LjA1OTM0NSwxOS45NDA2NTU1IEwzNDMuNzg5OTE1LDEzLjIxMDA4NTMgQzM0NC4xODIwODQsMTIuODE3OTE2IDM0NC45NDg5MiwxMi41IDM0NS41MDc0ODQsMTIuNSBMMzU2LjAwMjA5OCwxMi41IEMzNTcuOTMzOTM2LDEyLjUgMzU5LjUsMTQuMDY4ODQ3NyAzNTkuNSwxNi4wMDE3OTgzIEwzNTkuNSwyNS45OTgyMDE3IEMzNTkuNSwyNy45MzIxOTE1IDM1Ny45MjMwODgsMjkuNSAzNTYuMDAyMDk4LDI5LjUgTDM0NS41MDc0ODQsMjkuNSBDMzQ0Ljk1MTA2NiwyOS41IDM0NC4xNzcxNjksMjkuMTc3MTY5MyAzNDMuNzg5OTE1LDI4Ljc4OTkxNDggTDMzNy4wNTkzNDUsMjIuMDU5MzQ0NSBaIE0zNTEuNjQyNjYzLDIwLjk3NzY5MDMgTDM1NC40NjY3OTUsMTguMTUzNTU4NSBDMzU0Ljc2MDEwNiwxNy44NjAyNDc2IDM1NC43NjM5ODMsMTcuMzgxNDk2MiAzNTQuNDcxMDksMTcuMDg4NjAzIEMzNTQuMTc2MTU1LDE2Ljc5MzY2NzcgMzUzLjcwMTQsMTYuNzk3NjMyOCAzNTMuNDA2MTM1LDE3LjA5Mjg5ODMgTDM1MC41ODIwMDMsMTkuOTE3MDMwMSBMMzQ3Ljc1Nzg3MSwxNy4wOTI4OTgzIEMzNDcuNDY0NTYsMTYuNzk5NTg3NCAzNDYuOTg1ODA5LDE2Ljc5NTcwOTcgMzQ2LjY5MjkxNiwxNy4wODg2MDMgQzM0Ni4zOTc5OCwxNy4zODM1MzgyIDM0Ni40MDE5NDUsMTcuODU4MjkzIDM0Ni42OTcyMTEsMTguMTUzNTU4NSBMMzQ5LjUyMTM0MywyMC45Nzc2OTAzIEwzNDYuNjk3MjExLDIzLjgwMTgyMiBDMzQ2LjQwMzksMjQuMDk1MTMyOSAzNDYuNDAwMDIyLDI0LjU3Mzg4NDMgMzQ2LjY5MjkxNiwyNC44NjY3Nzc2IEMzNDYuOTg3ODUxLDI1LjE2MTcxMjggMzQ3LjQ2MjYwNiwyNS4xNTc3NDc3IDM0Ny43NTc4NzEsMjQuODYyNDgyMiBMMzUwLjU4MjAwMywyMi4wMzgzNTA0IEwzNTMuNDA2MTM1LDI0Ljg2MjQ4MjIgQzM1My42OTk0NDUsMjUuMTU1NzkzMSAzNTQuMTc4MTk3LDI1LjE1OTY3MDggMzU0LjQ3MTA5LDI0Ljg2Njc3NzYgQzM1NC43NjYwMjUsMjQuNTcxODQyMyAzNTQuNzYyMDYsMjQuMDk3MDg3NSAzNTQuNDY2Nzk1LDIzLjgwMTgyMiBMMzUxLjY0MjY2MywyMC45Nzc2OTAzIFogTTMzOC43MDk3MiwyMS43MDk3MTk1IEMzMzguMzE3NzUyLDIxLjMxNzc1MjIgMzM4LjMxODk2NSwyMC42ODEwMzQ5IDMzOC43MDk3MiwyMC4yOTAyODA1IEwzNDQuNjQzMjQ1LDE0LjM1Njc1NDcgQzM0NC44NDAyNzYsMTQuMTU5NzI0NSAzNDUuMjI1NjM5LDE0IDM0NS40OTM3NDEsMTQgTDM1NS45OTcyMzksMTQgQzM1Ny4xMDMzMzMsMTQgMzU3Ljk5OTk5OSwxNC44OTcwNjAxIDM1Ny45OTk5OTksMTYuMDA1ODU4NiBMMzU3Ljk5OTk5OSwyNS45OTQxNDEyIEMzNTcuOTk5OTk5LDI3LjEwMTk0NjQgMzU3LjEwNjQ1NywyNy45OTk5OTk5IDM1NS45OTcyMzksMjcuOTk5OTk5OSBMMzQ1LjQ5Mzc0MSwyOCBDMzQ1LjIyMTA1NiwyOCAzNDQuODQwNjQzLDI3Ljg0MDY0MzEgMzQ0LjY0MzI0NiwyNy42NDMyNDUzIEwzMzguNzA5NzIsMjEuNzA5NzE5NSBaJyBpZD0nQmFjayc+PC9wYXRoPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9nPlxuXHRcdDwvc3ZnPlwiXG5cdH1cblx0Zm9vZCA6ICBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE3KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTcgMTcnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5Gb29kPC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J2lPUy05LUtleWJvYXJkcycgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lQaG9uZS02LVBvcnRyYWl0LUxpZ2h0LUNvcHknIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNDguMDAwMDAwLCAtNjM3LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J0Zvb2QnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDE0OS41MDAwMDAsIDIyOS41MDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNS41LDE1LjUgTDEsMTUuNSBMMCw1IEw2LjUsNSBMNi4yNjM2MDkzMyw3LjQ4MjEwMjAyJyBpZD0nRHJpbmsnIHN0cm9rZT0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LjAxMDc3NTQ1LDEuOTY5MzAwOTggTDYuNTE1NzEzNTIsNS4yMjI3MDUzOSBMNS43MTkwODE4NCw1LjY3OTQ3ODEyIEw1LjAzODkwMDksMS45NjkzMDA5OCBMNC44NTU1NzI0NywxLjk2OTMwMDk4IEw0Ljg1NTU3MjQ3LDAuOTY5MzAwOTggTDguODU1NTcyNDcsMC45NjkzMDA5OCBMOC44NTU1NzI0NywxLjk2OTMwMDk4IEw2LjAxMDc3NTQ1LDEuOTY5MzAwOTggWicgaWQ9J1N0cmF3JyBmaWxsPScjNEE1NDYxJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg2Ljg1NTU3MiwgMy4zMjQzOTApIHJvdGF0ZSgyNC4wMDAwMDApIHRyYW5zbGF0ZSgtNi44NTU1NzIsIC0zLjMyNDM5MCkgJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J0JvdHRvbS1CdW4nIHN0cm9rZT0nIzRBNTQ2MScgeD0nMycgeT0nMTQnIHdpZHRoPScxMC41JyBoZWlnaHQ9JzEuNScgcng9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMS41LDEyLjUwMjQ0MDggQzEuNSwxMS45NDg4MDggMS45NDkxNjkxNiwxMS41IDIuNDkyNjg3MjMsMTEuNSBMMTQuMDA3MzEyOCwxMS41IEMxNC41NTU1NTg4LDExLjUgMTUsMTEuOTQ2OTQ5OSAxNSwxMi41MDI0NDA4IEwxNSwxMi45OTc1NTkyIEMxNSwxMy41NTExOTIgMTQuNTUwODMwOCwxNCAxNC4wMDczMTI4LDE0IEwyLjQ5MjY4NzIzLDE0IEMxLjk0NDQ0MTIxLDE0IDEuNSwxMy41NTMwNTAxIDEuNSwxMi45OTc1NTkyIEwxLjUsMTIuNTAyNDQwOCBaIE0zLjkzMzAwMDAzLDExLjgzOTI3MjcgQzMuNDE3NzE4MzQsMTEuNjUxODk3NiAzLjQ0NDgzNjk3LDExLjUgMy45OTU1Nzc1LDExLjUgTDEzLjAwNDQyMjUsMTEuNSBDMTMuNTU0MjY0OCwxMS41IDEzLjU4NjYwNjEsMTEuNjUwMzI1MSAxMy4wNjcsMTEuODM5MjcyNyBMOC41LDEzLjUgTDMuOTMzMDAwMDMsMTEuODM5MjcyNyBaJyBpZD0nJnF1b3Q7UGF0dHkmcXVvdDsnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMi41LDEwLjUgTDEzLjUsMTAuNSBMMTUsMTEuNSBMMSwxMS41IEwyLjUsMTAuNSBaJyBpZD0nQ2hlZXNlJyBmaWxsPScjNEE1NDYxJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTguMjUsMTAuNSBDMTEuNDI1NjM3MywxMC41IDE0LDEwLjMyODQyNzEgMTQsOS41IEMxNCw4LjY3MTU3Mjg4IDExLjQyNTYzNzMsOCA4LjI1LDggQzUuMDc0MzYyNjksOCAyLjUsOC42NzE1NzI4OCAyLjUsOS41IEMyLjUsMTAuMzI4NDI3MSA1LjA3NDM2MjY5LDEwLjUgOC4yNSwxMC41IFonIGlkPSdUb3AtQnVuJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS13aWR0aD0nMC43NSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRmbGFnczogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgxMSl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE1KX1weCcgdmlld0JveD0nMCAwIDExIDE1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+RmxhZzwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjc1LjAwMDAwMCwgLTYzOS4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdGbGFnJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyNzUuMDAwMDAwLCAyMzEuNTAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1BvbGUnIGZpbGw9JyM0QTU0NjEnIHg9JzAnIHk9JzAnIHdpZHRoPScxJyBoZWlnaHQ9JzE0Jz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTEsMSBDMSwxIDEuMjUsMiAzLjUsMiBDNS43NSwyIDYsMC43NDk5OTk5OTggOCwwLjc1IEMxMCwwLjc0OTk5OTk5OCAxMCwxLjUgMTAsMS41IEwxMCw3LjUgQzEwLDcuNSAxMCw2LjUgOCw2LjUgQzYsNi41IDQuODA2MjM5MTEsOCAzLjUsOCBDMi4xOTM3NjA4OSw4IDEsNyAxLDcgTDEsMSBaJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0ZnJlcXVlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNil9cHgnIHZpZXdCb3g9JzAgMCAxNyAxNicgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPlJlY2VudDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtNTUuMDAwMDAwLCAtNjM4LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J1JlY2VudCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoNTUuNTAwMDAwLCAyMzAuMDAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PGNpcmNsZSBpZD0nQm9keScgc3Ryb2tlPScjNEE1NDYxJyBjeD0nOCcgY3k9JzgnIHI9JzgnPjwvY2lyY2xlPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjUsNy41IEw3LjUsOC41IEw4LjUsOC41IEw4LjUsMiBMNy41LDIgTDcuNSw3LjUgTDQsNy41IEw0LDguNSBMOC41LDguNSBMOC41LDcuNSBMNy41LDcuNSBaJyBpZD0nSGFuZHMnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0a2V5Ym9hcmQgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDMyLjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgyMy41KX1weCcgdmlld0JveD0nMCAwIDY1IDQ3JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0ICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42LjEgKDI2MzEzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdCAgICA8dGl0bGU+U2hhcGU8L3RpdGxlPlxuXHRcdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0ICAgIDxkZWZzPjwvZGVmcz5cblx0XHRcdCAgICA8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJz5cblx0XHRcdCAgICAgICAgPGcgaWQ9J2lQYWQtUG9ydHJhaXQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNDM2LjAwMDAwMCwgLTE5NTYuMDAwMDAwKScgZmlsbD0nIzAwMDAwMCc+XG5cdFx0XHQgICAgICAgICAgICA8ZyBpZD0nS2V5Ym9hcmQtTGlnaHQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCAxNDIyLjAwMDAwMCknPlxuXHRcdFx0ICAgICAgICAgICAgICAgIDxnIGlkPSdLZXlib2FyZC1kb3duJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgxNDEyLjAwMDAwMCwgNTAwLjAwMDAwMCknPlxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNODcuMDAxMzMyLDM0IEM4OC4xMDUxNjU5LDM0IDg5LDM0Ljg5OTcxMjcgODksMzUuOTkzMjg3NCBMODksNjEuMDA2NzEyNiBDODksNjIuMTA3NTc0OCA4OC4xMDU4NzU5LDYzIDg3LjAwMTMzMiw2MyBMMjUuOTk4NjY4LDYzIEMyNC44OTQ4MzQxLDYzIDI0LDYyLjEwMDI4NzMgMjQsNjEuMDA2NzEyNiBMMjQsMzUuOTkzMjg3NCBDMjQsMzQuODkyNDI1MiAyNC44OTQxMjQxLDM0IDI1Ljk5ODY2OCwzNCBMODcuMDAxMzMyLDM0IFogTTI2LDM2IEwyNiw2MSBMODcsNjEgTDg3LDM2IEwyNiwzNiBaIE03OSw0MCBMODMsNDAgTDgzLDQ0IEw3OSw0NCBMNzksNDAgWiBNNzIsNDAgTDc2LDQwIEw3Niw0NCBMNzIsNDQgTDcyLDQwIFogTTY1LDQwIEw2OSw0MCBMNjksNDQgTDY1LDQ0IEw2NSw0MCBaIE01OCw0MCBMNjIsNDAgTDYyLDQ0IEw1OCw0NCBMNTgsNDAgWiBNNTEsNDAgTDU1LDQwIEw1NSw0NCBMNTEsNDQgTDUxLDQwIFogTTQ0LDQwIEw0OCw0MCBMNDgsNDQgTDQ0LDQ0IEw0NCw0MCBaIE0zNyw0MCBMNDEsNDAgTDQxLDQ0IEwzNyw0NCBMMzcsNDAgWiBNMzAsNDAgTDM0LDQwIEwzNCw0NCBMMzAsNDQgTDMwLDQwIFogTTc5LDQ3IEw4Myw0NyBMODMsNTEgTDc5LDUxIEw3OSw0NyBaIE03Miw0NyBMNzYsNDcgTDc2LDUxIEw3Miw1MSBMNzIsNDcgWiBNNjUsNDcgTDY5LDQ3IEw2OSw1MSBMNjUsNTEgTDY1LDQ3IFogTTU4LDQ3IEw2Miw0NyBMNjIsNTEgTDU4LDUxIEw1OCw0NyBaIE01MSw0NyBMNTUsNDcgTDU1LDUxIEw1MSw1MSBMNTEsNDcgWiBNNDQsNDcgTDQ4LDQ3IEw0OCw1MSBMNDQsNTEgTDQ0LDQ3IFogTTM3LDQ3IEw0MSw0NyBMNDEsNTEgTDM3LDUxIEwzNyw0NyBaIE0zMCw0NyBMMzQsNDcgTDM0LDUxIEwzMCw1MSBMMzAsNDcgWiBNNzksNTQgTDgzLDU0IEw4Myw1OCBMNzksNTggTDc5LDU0IFogTTcyLDU0IEw3Niw1NCBMNzYsNTggTDcyLDU4IEw3Miw1NCBaIE00NCw1NCBMNjksNTQgTDY5LDU4IEw0NCw1OCBMNDQsNTQgWiBNMzcsNTQgTDQxLDU0IEw0MSw1OCBMMzcsNTggTDM3LDU0IFogTTMwLDU0IEwzNCw1NCBMMzQsNTggTDMwLDU4IEwzMCw1NCBaIE00NC4zMTYzNDk4LDY5Ljk3NzEwNDcgQzQzLjM2ODQyMjUsNzAuNTQyMDM0MiA0My4zMzM4NzIxLDcxLjUwOTY0OTUgNDQuMjM3ODIxNyw3Mi4xMzczOTEyIEw1NS4zNjIxNTM5LDc5Ljg2MjYwODggQzU2LjI2NjcxMTMsODAuNDkwNzcyNiA1Ny43MzM4OTY1LDgwLjQ5MDM1MDUgNTguNjM3ODQ2MSw3OS44NjI2MDg4IEw2OS43NjIxNzgzLDcyLjEzNzM5MTIgQzcwLjY2NjczNTcsNzEuNTA5MjI3NCA3MC42NDgwMTIsNzAuNTIwNTIwNCA2OS43MTE1MTg3LDY5LjkyMzQxNjYgTDY5Ljk4MjU3MzEsNzAuMDk2MjM5NiBDNjkuNTE4MTMzMyw2OS44MDAxMTUgNjguNzc4MjU1Nyw2OS44MTI2NDkzIDY4LjMyNjEzMDcsNzAuMTI2OTMyMyBMNTcuODE1NDk5OSw3Ny40MzMxMjYzIEM1Ny4zNjUxMTE3LDc3Ljc0NjIwMiA1Ni42MjgxNjUsNzcuNzM4MTc4NiA1Ni4xNzYyMTAzLDc3LjQxOTk0MjQgTDQ1LjgzODYxMzcsNzAuMTQwODk3NyBDNDUuMzgzNjQ3Miw2OS44MjA1NDA3IDQ0LjYzNzUwMzksNjkuNzg1NzA4OCA0NC4xNTY2MzkzLDcwLjA3MjI4NjIgTDQ0LjMxNjM0OTgsNjkuOTc3MTA0NyBaJyBpZD0nU2hhcGUnPjwvcGF0aD5cblx0XHRcdCAgICAgICAgICAgICAgICA8L2c+XG5cdFx0XHQgICAgICAgICAgICA8L2c+XG5cdFx0XHQgICAgICAgIDwvZz5cblx0XHRcdCAgICA8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRvYmplY3RzIDogXG5cdFx0XCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDExKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTEgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5MaWdodGJ1bGI8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHQ8ZyBpZD0naVBob25lLTYnIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yNDQuMDAwMDAwLCAtNjM5LjAwMDAwMCknIHN0cm9rZT0nIzRBNTM2MSc+XG5cdFx0XHRcdFx0XHQ8ZyBpZD0nTGlnaHRidWxiJyBza2V0Y2g6dHlwZT0nTVNMYXllckdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyNDQuMDAwMDAwLCA2MzkuMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J004LDEwLjQwMDI5MDQgQzkuNzgwODM3OTUsOS40ODk5MzQ5MSAxMSw3LjYzNzM0MjczIDExLDUuNSBDMTEsMi40NjI0MzM4OCA4LjUzNzU2NjEyLDAgNS41LDAgQzIuNDYyNDMzODgsMCAwLDIuNDYyNDMzODggMCw1LjUgQzAsNy42MzczNDI3MyAxLjIxOTE2MjA1LDkuNDg5OTM0OTEgMywxMC40MDAyOTA0IEwzLDE0LjAwMjA4NjkgQzMsMTUuMTAxNzM5NCAzLjg5NzYxNjAyLDE2IDUuMDA0ODgxNSwxNiBMNS45OTUxMTg1LDE2IEM3LjEwNjEwMDIsMTYgOCwxNS4xMDU1MDM4IDgsMTQuMDAyMDg2OSBMOCwxMC40MDAyOTA0IFonIGlkPSdPdmFsLTE3JyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTAnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIHg9JzMnIHk9JzEyJyB3aWR0aD0nNScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIHg9JzQnIHk9JzEzLjUnIHdpZHRoPScxLjUnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNSw4LjUgQzUsOC41IDMuNDk5OTk5OTksNy41MDAwMDAwMSA0LDcgQzQuNTAwMDAwMDEsNi40OTk5OTk5OSA1LDcuNjY2NjY2NjcgNS41LDggQzUuNSw4IDYuNSw2LjUwMDAwMDAxIDcsNyBDNy41LDcuNDk5OTk5OTkgNiw4LjUgNiw4LjUgTDYsMTEgTDUsMTEgTDUsOC41IFonIGlkPSdSZWN0YW5nbGUtNTInIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPjwvcGF0aD5cblx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdHNoaWZ0IDoge1xuXHRcdG9uIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTgpfXB4JyB2aWV3Qm94PScwIDAgMjAgMTcnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0XHQ8dGl0bGU+U2hpZnQ8L3RpdGxlPlxuXHRcdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTE0LjAwMDAwMCwgLTEzMC4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J1RoaXJkLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDExOC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMjEuNzA1MjM4OCwxMy4yMDUyMzg4IEMyMS4zMTU3NDYyLDEyLjgxNTc0NjIgMjAuNjg1NzU1OSwxMi44MTQyNDQxIDIwLjI5NDc2MTIsMTMuMjA1MjM4OCBMMTEuOTE2MDc2NywyMS41ODM5MjMzIEMxMS4xMzM5OTkxLDIyLjM2NjAwMDkgMTEuMzk4MjYwNiwyMyAxMi40OTc5MTMxLDIzIEwxNi41LDIzIEwxNi41LDI4LjAwOTIyMiBDMTYuNSwyOC41NTY0MTM2IDE2Ljk0NjMxMTQsMjkgMTcuNDk3NTQ0NiwyOSBMMjQuNTAyNDU1NCwyOSBDMjUuMDUzMzg0LDI5IDI1LjUsMjguNTQ5MDI0OCAyNS41LDI4LjAwOTIyMiBMMjUuNSwyMyBMMjkuNTAyMDg2OSwyMyBDMzAuNjA1NTAzOCwyMyAzMC44NjY4MjQsMjIuMzY2ODI0IDMwLjA4MzkyMzMsMjEuNTgzOTIzMyBMMjEuNzA1MjM4OCwxMy4yMDUyMzg4IFonIGlkPSdTaGlmdCc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cIlxuXHRcdG9mZiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTgpfXB4JyB2aWV3Qm94PScwIDAgMjAgMTknIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPlNoaWZ0PC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9Mb3dlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTE0LjAwMDAwMCwgLTEyOS4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHQ8ZyBpZD0nVGhpcmQtUm93JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgzLjAwMDAwMCwgMTE4LjAwMDAwMCknIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTIxLjY3MTkwMDgsMTIuMjMyNTg5OCBDMjEuMzAxMDMyLDExLjgyNzk5MTYgMjAuNjk0Njg5MiwxMS44MzM0NzMxIDIwLjMyODgxOTUsMTIuMjMyNTg5OCBMMTEuNjk0NzAyMywyMS42NTEyOTgzIEMxMC43NTg3NDQxLDIyLjY3MjMwOCAxMS4xMjg1NTQxLDIzLjUgMTIuNTA5Nzc1MSwyMy41IEwxNS45OTk5OTk5LDIzLjUwMDAwMDIgTDE1Ljk5OTk5OTksMjguMDAxNDI0MSBDMTUuOTk5OTk5OSwyOC44MjkwNjQ4IDE2LjY3MTY1NTksMjkuNTAwMDAwMSAxNy40OTcxMDEsMjkuNTAwMDAwMSBMMjQuNTAyODk5MiwyOS41MDAwMDAxIEMyNS4zMjk3MjUzLDI5LjUwMDAwMDEgMjYuMDAwMDAwMywyOC44MzQ5NzAzIDI2LjAwMDAwMDMsMjguMDAxNDI0MSBMMjYuMDAwMDAwMywyMy41MDAwMDAxIEwyOS40OTAyMjUxLDIzLjUwMDAwMDIgQzMwLjg3NjMzNTcsMjMuNTAwMDAwMiAzMS4yNDM5NTIxLDIyLjY3NTE5MTYgMzAuMzA1NDE2MSwyMS42NTEyOTg1IEwyMS42NzE5MDA4LDEyLjIzMjU4OTggWiBNMjEuMzQxNzQ4LDE0LjM2NDUzMTYgQzIxLjE1MzAwNTYsMTQuMTYzMjA2NCAyMC44NDMzNTE1LDE0LjE2NzA5MTQgMjAuNjU4MjUxNCwxNC4zNjQ1MzE2IEwxMy41LDIxLjk5OTk5OTggTDE3LjUwMDAwMDEsMjEuOTk5OTk5OSBMMTcuNTAwMDAwMiwyNy41MDg5OTU2IEMxNy41MDAwMDAyLDI3Ljc4MDE3MDMgMTcuNzMyOTAyNywyOC4wMDAwMDA4IDE4LjAwMzQyMjksMjguMDAwMDAwOCBMMjMuOTk2NTc3LDI4LjAwMDAwMDggQzI0LjI3NDYwOTcsMjguMDAwMDAwOCAyNC40OTk5OTk3LDI3Ljc3MjEyMDMgMjQuNDk5OTk5NywyNy41MDg5OTU2IEwyNC40OTk5OTk3LDIxLjk5OTk5OTkgTDI4LjUsMjEuOTk5OTk5OSBMMjEuMzQxNzQ4LDE0LjM2NDUzMTYgWicgaWQ9J1NoaWZ0Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XCJcblx0fVxuXHRzbWlsZXlzOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE3KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTcgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT46RDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtODYuMDAwMDAwLCAtNjM4LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9JzpEJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg4Ny4wMDAwMDAsIDIzMC41MDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdIZWFkJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS13aWR0aD0nMC43ODk0NzM2ODQnIGN4PSc3LjUnIGN5PSc3LjUnIHI9JzcuNSc+PC9jaXJjbGU+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTcuNSwxMy41MjYzMTU4IEMxMC4yNjg2OTA3LDEzLjUyNjMxNTggMTIuNTEzMTU3OSwxMC4zNjg0MjEyIDEyLjUxMzE1NzksOS4xODQyMTA0NSBDMTIuNTEzMTU3OSw3LjYwNTI2MzE3IDExLjQzODkwOTgsOS4xODQyMTA0MyA3LjUsOS4xODQyMTA1MyBDMy41NjEwOTAyMyw5LjE4NDIxMDYyIDIuNDg2ODQyMTEsNy42MDUyNjMxNyAyLjQ4Njg0MjExLDkuMTg0MjEwNDUgQzIuNDg2ODQyMTEsMTAuMzY4NDIxIDQuNzMxMzA5MzUsMTMuNTI2MzE1OCA3LjUsMTMuNTI2MzE1OCBaIE03LjUsMTAuOTYwNTI2MyBDOC45MzIzMzA4MywxMS4xNTc4OTQ3IDExLjc5Njk5MjUsMTAuMzY4NDIxIDExLjc5Njk5MjUsOS40NDQyMzU1MiBDMTEuNzk2OTkyNSw4Ljc4OTQ3MzY4IDEwLjg3NjIwODQsOS41Nzg5NDcyNyA3LjUsOS43NzYzMTU3OSBDNC4xMjM3OTE2Miw5LjU3ODk0NzQzIDMuMjAzMDA4NzIsOC43ODk0NzM2OSAzLjIwMzAwNzUyLDkuNDQ0MjM1NTIgQzMuMjAzMDA1ODIsMTAuMzY4NDIxIDYuMDY3NjY5MTcsMTEuMTU3ODk0NyA3LjUsMTAuOTYwNTI2MyBaJyBpZD0nU21pbGUnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNS4yMzY4NDIxMSw2LjMyMzY1OTggQzUuNjQzNzg4NzYsNi4zMjM2NTk4IDUuOTczNjg0MjEsNS44ODE4MzU1NCA1Ljk3MzY4NDIxLDUuMzM2ODE3NjkgQzUuOTczNjg0MjEsNC43OTE3OTk4NSA1LjY0Mzc4ODc2LDQuMzQ5OTc1NTkgNS4yMzY4NDIxMSw0LjM0OTk3NTU5IEM0LjgyOTg5NTQ1LDQuMzQ5OTc1NTkgNC41LDQuNzkxNzk5ODUgNC41LDUuMzM2ODE3NjkgQzQuNSw1Ljg4MTgzNTU0IDQuODI5ODk1NDUsNi4zMjM2NTk4IDUuMjM2ODQyMTEsNi4zMjM2NTk4IFogTTkuNzM2ODQyMTEsNi4zMjM2NTk4IEMxMC4xNDM3ODg4LDYuMzIzNjU5OCAxMC40NzM2ODQyLDUuODgxODM1NTQgMTAuNDczNjg0Miw1LjMzNjgxNzY5IEMxMC40NzM2ODQyLDQuNzkxNzk5ODUgMTAuMTQzNzg4OCw0LjM0OTk3NTU5IDkuNzM2ODQyMTEsNC4zNDk5NzU1OSBDOS4zMjk4OTU0NSw0LjM0OTk3NTU5IDksNC43OTE3OTk4NSA5LDUuMzM2ODE3NjkgQzksNS44ODE4MzU1NCA5LjMyOTg5NTQ1LDYuMzIzNjU5OCA5LjczNjg0MjExLDYuMzIzNjU5OCBaJyBpZD0nRXllcycgZmlsbD0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXG5cdHN5bWJvbHM6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTYpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNyl9cHgnIHZpZXdCb3g9JzAgMCAxNSAxNycgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPk9iamVjdHMgJmFtcDsgU3ltYm9sczwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMzA0LjAwMDAwMCwgLTYzOC4wMDAwMDApJyBmaWxsPScjNEE1NDYxJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdPYmplY3RzLSZhbXA7LVN5bWJvbHMnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMwNC4wMDAwMDAsIDIzMC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0XHQ8ZyBpZD0nVGhpbmcnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCAwLjUwMDAwMCknIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1JlY3RhbmdsZS0xMjA5JyB4PScwJyB5PScwJyB3aWR0aD0nNycgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nUmVjdGFuZ2xlLTEyMDknIHg9JzAnIHk9JzInIHdpZHRoPSc3JyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtMTIxMScgeD0nMycgeT0nMycgd2lkdGg9JzEnIGhlaWdodD0nNCc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMTEuNzUsMC4xNTkyNjM5NzggTDExLjc1LDAgTDExLDAgTDExLDUuMDkxNDkzIEMxMC41OTM0NCw0Ljk0MjIxMzkyIDEwLjA2Mzk2NjIsNC45NjQ1MzIyNCA5LjU1NzE1Mzk5LDUuMTkwMTc5NTcgQzguNjk4NDkyOTMsNS41NzI0ODAxIDguMjMwMDM4MzUsNi4zOTM2NTYyMSA4LjUxMDgzMTQxLDcuMDI0MzI3NzQgQzguNzkxNjI0NDcsNy42NTQ5OTkyOCA5LjcxNTMzNDU0LDcuODU2MzQzNzUgMTAuNTczOTk1Niw3LjQ3NDA0MzIxIEMxMS4yNzYxMTgzLDcuMTYxNDM4MDMgMTEuNzE3MzM5Myw2LjU1NTM4OTcyIDExLjcwMTM1OTUsNiBMMTEuNzUsNiBMMTEuNzUsMS4zOTM4NTA1NiBDMTIuMzE3NTkwOCwxLjU5NTkwMDM3IDEzLDIuMDgxNzQ1NiAxMywzLjI1IEMxMyw0LjI1IDEyLjc1LDUuNSAxMi43NSw1LjUgQzEyLjc1LDUuNSAxMy43NSw0Ljc1IDEzLjc1LDIuNSBDMTMuNzUsMS4wMjI1NjEwMSAxMi41NjQyNjc0LDAuNDA3NDczMDE5IDExLjc1LDAuMTU5MjYzOTc4IFonIGlkPSdOb3RlJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHRleHQgaWQ9JyZhbXA7JyBza2V0Y2g6dHlwZT0nTVNUZXh0TGF5ZXInIGZvbnQtZmFtaWx5PSdTRiBVSSBEaXNwbGF5JyBmb250LXNpemU9JzkuNScgZm9udC13ZWlnaHQ9J25vcm1hbCc+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8dHNwYW4geD0nMC4yNScgeT0nMTYnPiZhbXA7PC90c3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHRcdFx0PHRleHQgaWQ9JyUnIHNrZXRjaDp0eXBlPSdNU1RleHRMYXllcicgZm9udC1mYW1pbHk9J1NGIFVJIERpc3BsYXknIGZvbnQtc2l6ZT0nOS41JyBmb250LXdlaWdodD0nbm9ybWFsJz5cblx0XHRcdFx0XHRcdFx0XHRcdDx0c3BhbiB4PSc3Ljc1JyB5PScxNic+JTwvdHNwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHR0cmF2ZWw6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNil9cHgnIHZpZXdCb3g9JzAgMCAxNyAxNicgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPlRyYW5zcG9ydDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjQxLjAwMDAwMCwgLTYzOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdUcmFuc3BvcnQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDI0MS41MDAwMDAsIDIzMC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMCw2IEwxLDYgTDEsMTUgTDAsMTUgTDAsNiBaIE0xNSw0IEwxNiw0IEwxNiwxNSBMMTUsMTUgTDE1LDQgWiBNMy41LDAgTDQuNSwwIEw0LjUsNyBMMy41LDcgTDMuNSwwIFogTTEsNiBMMy41LDYgTDMuNSw3IEwxLDcgTDEsNiBaIE00LjUsMCBMOS41LDAgTDkuNSwxIEw0LjUsMSBMNC41LDAgWiBNOS41LDAgTDEwLjUsMCBMMTAuNSw2IEw5LjUsNiBMOS41LDAgWiBNMTAuNSw0IEwxNSw0IEwxNSw1IEwxMC41LDUgTDEwLjUsNCBaJyBpZD0nU2t5bGluZScgZmlsbD0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxnIGlkPSdXaW5kb3dzJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApJyBmaWxsPScjNEE1NDYxJz5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzAnIHk9JzYnIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzMuNScgeT0nMCcgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1dpbmRvdycgeD0nNS41JyB5PScwJyB3aWR0aD0nMScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nV2luZG93JyB4PSc1LjUnIHk9JzInIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzMuNScgeT0nMicgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1dpbmRvdycgeD0nMTEnIHk9JzQnIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzExJyB5PSc2JyB3aWR0aD0nMScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0XHRcdDxnIGlkPSdDYXInIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIuNTAwMDAwLCA2LjUwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTguNSw4IEwyLjUsOCBMMi41LDkuNSBMMC41LDkuNSBMMC41LDcuODY4MTE0NSBDMC4yMDEyMDIxOTIsNy42OTU4MjcwMiAwLDcuMzcwOTEzNjMgMCw2Ljk5MDYzMTEgTDAsNS4wMDkzNjg5IEMwLDQuNDUxOTA5ODUgMC40NDQ4MzY5NzQsNCAwLjk5NTU3NzQ5OSw0IEwxMC4wMDQ0MjI1LDQgQzEwLjU1NDI2NDgsNCAxMSw0LjQ0MzM1MzE4IDExLDUuMDA5MzY4OSBMMTEsNi45OTA2MzExIEMxMSw3LjM2NTMzMTUgMTAuNzk5MDI0NCw3LjY5MjM0NTE5IDEwLjUsNy44NjY0OTAwMiBMMTAuNSw5LjUgTDguNSw5LjUgTDguNSw4IFogTTEuNzUsNi41IEMyLjE2NDIxMzU2LDYuNSAyLjUsNi4xNjQyMTM1NiAyLjUsNS43NSBDMi41LDUuMzM1Nzg2NDQgMi4xNjQyMTM1Niw1IDEuNzUsNSBDMS4zMzU3ODY0NCw1IDEsNS4zMzU3ODY0NCAxLDUuNzUgQzEsNi4xNjQyMTM1NiAxLjMzNTc4NjQ0LDYuNSAxLjc1LDYuNSBaIE05LjI1LDYuNSBDOS42NjQyMTM1Niw2LjUgMTAsNi4xNjQyMTM1NiAxMCw1Ljc1IEMxMCw1LjMzNTc4NjQ0IDkuNjY0MjEzNTYsNSA5LjI1LDUgQzguODM1Nzg2NDQsNSA4LjUsNS4zMzU3ODY0NCA4LjUsNS43NSBDOC41LDYuMTY0MjEzNTYgOC44MzU3ODY0NCw2LjUgOS4yNSw2LjUgWiBNMC41LDcgTDEwLjUsNyBMMTAuNSw3LjUgTDAuNSw3LjUgTDAuNSw3IFogTTMsNi41IEw4LDYuNSBMOCw3IEwzLDcgTDMsNi41IFonIGlkPSdCb2R5JyBmaWxsPScjNEE1NDYxJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMS41LDQuNSBMMS41LDMgQzEuNSwxLjM0MzE0NTc1IDIuODM5MDIwMTMsMCA0LjUwMTY2NTQ3LDAgTDYuNDk4MzM0NTMsMCBDOC4xNTYxMDg1OSwwIDkuNSwxLjM0NjUxNzEyIDkuNSwzIEw5LjUsNScgaWQ9J1Jvb2YnIHN0cm9rZT0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJ9XG5cbmJhbm5lckJHID0ge1xuXHRcImlwaG9uZS01XCI6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nMzIwcHgnIGhlaWdodD0nNjhweCcgdmlld0JveD0nMCAwIDMyMCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHQgICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdCAgICA8dGl0bGU+aXBob25lNTwvdGl0bGU+XG5cdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0ICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGZpbGwtb3BhY2l0eT0nMC45Jz5cblx0XHQgICAgICAgIDxnIGlkPSdpUGhvbmUtNS81Uy81QycgZmlsbD0nIzFBMUExQyc+XG5cdFx0ICAgICAgICAgICAgPHBhdGggZD0nTTAsMCBMMzIwLDAgTDMyMCw2OCBMMCw2OCBMMCwwIFogTTE0Miw2MS4wMDQ4ODE1IEMxNDIsNTkuODk3NjE2IDE0Mi44OTYyNzksNTkgMTQ0LjAwMjQsNTkgTDE3Ni45OTc2LDU5IEMxNzguMTAzNDk1LDU5IDE3OSw1OS44OTM4OTk4IDE3OSw2MS4wMDQ4ODE1IEwxNzksNjEuOTk1MTE4NSBDMTc5LDYzLjEwMjM4NCAxNzguMTAzNzIxLDY0IDE3Ni45OTc2LDY0IEwxNDQuMDAyNCw2NCBDMTQyLjg5NjUwNSw2NCAxNDIsNjMuMTA2MTAwMiAxNDIsNjEuOTk1MTE4NSBMMTQyLDYxLjAwNDg4MTUgWicgaWQ9J2lwaG9uZTUnPjwvcGF0aD5cblx0XHQgICAgICAgIDwvZz5cblx0XHQgICAgPC9nPlxuXHRcdDwvc3ZnPlwiXG5cdFwiaXBob25lLTZzXCI6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPSczNzVweCcgaGVpZ2h0PSc2OHB4JyB2aWV3Qm94PScwIDAgMzc1IDY4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNiAoMjYzMDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+Tm90aWZpY2F0aW9uIGJhY2tncm91bmQ8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBmaWxsLW9wYWNpdHk9JzAuOSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lPUzgtUHVzaC1Ob3RpZmljYXRpb24nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC01OC4wMDAwMDAsIC0yMy4wMDAwMDApJyBmaWxsPScjMUExQTFDJz5cblx0XHRcdFx0XHRcdDxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDU4LjAwMDAwMCwgNy4wMDAwMDApJyBpZD0nTm90aWZpY2F0aW9uLWNvbnRhaW5lcic+XG5cdFx0XHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J00wLDE2IEwzNzUsMTYgTDM3NSw4NCBMMCw4NCBMMCwxNiBaIE0xNjksNzcuMDA0ODgxNSBDMTY5LDc1Ljg5NzYxNiAxNjkuODk2Mjc5LDc1IDE3MS4wMDI0LDc1IEwyMDMuOTk3Niw3NSBDMjA1LjEwMzQ5NSw3NSAyMDYsNzUuODkzODk5OCAyMDYsNzcuMDA0ODgxNSBMMjA2LDc3Ljk5NTExODUgQzIwNiw3OS4xMDIzODQgMjA1LjEwMzcyMSw4MCAyMDMuOTk3Niw4MCBMMTcxLjAwMjQsODAgQzE2OS44OTY1MDUsODAgMTY5LDc5LjEwNjEwMDIgMTY5LDc3Ljk5NTExODUgTDE2OSw3Ny4wMDQ4ODE1IFonIGlkPSdOb3RpZmljYXRpb24tYmFja2dyb3VuZCc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRcImlwaG9uZS02cy1wbHVzXCIgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nNDE0cHgnIGhlaWdodD0nNjhweCcgdmlld0JveD0nMCAwIDQxNCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42ICgyNjMwNCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHQ8dGl0bGU+Tm90aWZpY2F0aW9uIGJhY2tncm91bmQgQ29weTwvdGl0bGU+XG5cdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGZpbGwtb3BhY2l0eT0nMC45Jz5cblx0XHRcdFx0PGcgaWQ9J2lPUzgtUHVzaC1Ob3RpZmljYXRpb24nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC00My4wMDAwMDAsIC03NC4wMDAwMDApJyBmaWxsPScjMUExQTFDJz5cblx0XHRcdFx0XHQ8ZyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg0My4wMDAwMDAsIDc0LjAwMDAwMCknIGlkPSdOb3RpZmljYXRpb24tY29udGFpbmVyJz5cblx0XHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMCwwIEw0MTQsMCBMNDE0LDY4IEwwLDY4IEwwLDAgWiBNMTg5LDYxLjAwNDg4MTUgQzE4OSw1OS44OTc2MTYgMTg5Ljg5NjI3OSw1OSAxOTEuMDAyNCw1OSBMMjIzLjk5NzYsNTkgQzIyNS4xMDM0OTUsNTkgMjI2LDU5Ljg5Mzg5OTggMjI2LDYxLjAwNDg4MTUgTDIyNiw2MS45OTUxMTg1IEMyMjYsNjMuMTAyMzg0IDIyNS4xMDM3MjEsNjQgMjIzLjk5NzYsNjQgTDE5MS4wMDI0LDY0IEMxODkuODk2NTA1LDY0IDE4OSw2My4xMDYxMDAyIDE4OSw2MS45OTUxMTg1IEwxODksNjEuMDA0ODgxNSBaJyBpZD0nTm90aWZpY2F0aW9uLWJhY2tncm91bmQtQ29weSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9nPlxuXHRcdDwvc3ZnPlwiXG5cdFwiaXBhZFwiIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9Jzc2OHB4JyBoZWlnaHQ9JzY4cHgnIHZpZXdCb3g9JzAgMCA3NjggNjgnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0XHQgICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0ICAgIDx0aXRsZT5pcGFkLXBvcnRyYWl0PC90aXRsZT5cblx0XHRcdCAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0XHQgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScwLjknPlxuXHRcdFx0ICAgICAgICA8ZyBpZD0naVBhZC1Qb3J0cmFpdCcgZmlsbD0nIzFBMUExQyc+XG5cdFx0XHQgICAgICAgICAgICA8cGF0aCBkPSdNMCwwIEw3NjgsMCBMNzY4LDY4IEwwLDY4IEwwLDAgWiBNMzY2LDYxLjAwNDg4MTUgQzM2Niw1OS44OTc2MTYgMzY2Ljg5NjI3OSw1OSAzNjguMDAyNCw1OSBMNDAwLjk5NzYsNTkgQzQwMi4xMDM0OTUsNTkgNDAzLDU5Ljg5Mzg5OTggNDAzLDYxLjAwNDg4MTUgTDQwMyw2MS45OTUxMTg1IEM0MDMsNjMuMTAyMzg0IDQwMi4xMDM3MjEsNjQgNDAwLjk5NzYsNjQgTDM2OC4wMDI0LDY0IEMzNjYuODk2NTA1LDY0IDM2Niw2My4xMDYxMDAyIDM2Niw2MS45OTUxMTg1IEwzNjYsNjEuMDA0ODgxNSBaJyBpZD0naXBhZC1wb3J0cmFpdCc+PC9wYXRoPlxuXHRcdFx0ICAgICAgICA8L2c+XG5cdFx0XHQgICAgPC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0XCJpcGFkLXByb1wiIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JzEwMjRweCcgaGVpZ2h0PSc2OHB4JyB2aWV3Qm94PScwIDAgMTAyNCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdCAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNi4xICgyNjMxMykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHQgICAgPHRpdGxlPmlwYWQtcHJvLXBvcnRyYWl0PC90aXRsZT5cblx0XHRcdCAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0XHQgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScwLjknPlxuXHRcdFx0ICAgICAgICA8ZyBpZD0naVBhZC1Qcm8tUG9ydHJhaXQnIGZpbGw9JyMxQTFBMUMnPlxuXHRcdFx0ICAgICAgICAgICAgPHBhdGggZD0nTTAsMCBMMTAyNCwwIEwxMDI0LDY4IEwwLDY4IEwwLDAgWiBNNDk0LDYxLjAwNDg4MTUgQzQ5NCw1OS44OTc2MTYgNDk0Ljg5NjI3OSw1OSA0OTYuMDAyNCw1OSBMNTI4Ljk5NzYsNTkgQzUzMC4xMDM0OTUsNTkgNTMxLDU5Ljg5Mzg5OTggNTMxLDYxLjAwNDg4MTUgTDUzMSw2MS45OTUxMTg1IEM1MzEsNjMuMTAyMzg0IDUzMC4xMDM3MjEsNjQgNTI4Ljk5NzYsNjQgTDQ5Ni4wMDI0LDY0IEM0OTQuODk2NTA1LDY0IDQ5NCw2My4xMDYxMDAyIDQ5NCw2MS45OTUxMTg1IEw0OTQsNjEuMDA0ODgxNSBaJyBpZD0naXBhZC1wcm8tcG9ydHJhaXQnPjwvcGF0aD5cblx0XHRcdCAgICAgICAgPC9nPlxuXHRcdFx0ICAgIDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdH1cbiIsIiMjI1xuICBGcmFtZXJLaXQgZm9yIEZyYW1lclxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBDb3B5cmlnaHQgKGMpIDIwMTUsIFJhcGggRCdBbWljbyBodHRwOi8vcmFwaGRhbWljby5jb20gKEByYXBoZGFtaWNvKVxuICBNSVQgTGljZW5zZVxuXG4gIFJlYWRtZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgTGljZW5zZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0L2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiMjI1xuXG5cblxuXG4jIyNcblx0REVGQVVMVCBTVFlMRVNcblx0Tm90ZSB0aGUgc2NyZWVud2lkdGggY29uc3RhbnQ6IHRoaXMgaXMgcHJvYmFibHkgb25lIG9mIHRoZVxuXHRmaXJzdCB0aGluZ3MgeW91IHdhbnQgdG8gY2hhbmdlIHNvIGl0IG1hdGNoZXMgdGhlIGRldmljZVxuXHR5b3UncmUgcHJvdG90eXBpbmcgb24uXG4jIyNcbmRlZmF1bHRzID0ge1xuXHRzY3JlZW5XaWR0aDogNzUwXG59XG5cbiMjI1xuXHRNT1JFIFNUWUxFU1xuIyMjXG5kZWZhdWx0cy50YWJsZVJvd0hlaWdodCA9IDg4XG5kZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nID0gMjBcbmRlZmF1bHRzLnRpbnQgPSAnZ3JleSdcbmRlZmF1bHRzLmxpbmVUaW50ID0gXCJyZ2JhKDIwMCwyMDAsMjAwLDEpXCJcbmRlZmF1bHRzLnN3aXRjaFRpbnQgPSAnIzFEQzI0QidcbmRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kID0gJ3doaXRlJ1xuZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjMycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxufVxuZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjIycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxuXHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xufVxuZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXHRcdFwiNDJweFwiXG5cdGZvbnRGYW1pbHk6IFx0XCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFx0XCIyMDBcIlxufVxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgRUxFTUVOVFNcblx0KGUuZy4gXCJUaHVtYlwiIGZvciB0aGUgc3dpdGNoIGNvbnRyb2wpXG4jIyNcblxuU3dpdGNoID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3dpdGNoQ29udGFpbmVyQm9yZGVyOiA0XG5cdFx0c3dpdGNoQ29udGFpbmVySGVpZ2h0OiA1NFxuXHRcdHN3aXRjaENvbnRhaW5lcldpZHRoOiA5NFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XG5cdCMgVGhpcyBpcyBvdXIgZmFuY3kgYW5pbWF0ZWQgc3dpdGNoIHN3aXRjaFxuXHQjIHdlIG5lZWQgdG8gbWFrZSBhIHJvdW5kZWQgcmVjdGFuZ2xlIHdpdGggYSBjaXJjbGUgaW5zaWRlIGl0LlxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdGNsaXA6IFx0XHRcdFx0ZmFsc2UgIyBDbGlwcGluZyBodXJ0cyB0aGUgc3VidGxlIHNoYWRvdyBvbiB0aGUgYnV0dG9uXG5cdFx0d2lkdGg6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggXG5cdFx0aGVpZ2h0Olx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIlwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kID0gbmV3IExheWVyXG5cdFx0eDpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMlxuXHRcdHk6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgLSA0XG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0aGVpZ2h0OiBcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0IC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHNoYWRvd1NwcmVhZDpcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiArIHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRzaGFkb3dDb2xvcjogXHRcdHBhcmFtcy5zd2l0Y2hUaW50XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdCcnXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0eTogLTRcblx0XHR3aWR0aDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRzd2l0Y2hCdXR0b25SYWRpdXNcblx0XHRzaGFkb3dZOlx0XHRcdDNcblx0XHRzaGFkb3dCbHVyOiBcdFx0NVxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0J3JnYmEoMCwwLDAsMC4zKSdcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJ3aGl0ZVwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuXHQjIFNFVCBVUCBBTklNQVRJT05TXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiBcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHQtNFxuXHRcdFx0d2lkdGg6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoXG5cdFx0XHRoZWlnaHQ6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdFx0c2hhZG93U3ByZWFkOiBcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRcdHNhdHVyYXRlOiBcdFx0MFxuXHRcdFx0YnJpZ2h0bmVzczogXHQxNTNcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRcdHRpbWU6IDAuMyBcblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHQgXHRcdGlmIEBzZWxlY3RlZFxuIFx0XHRcdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsID0+XG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gJydcblxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiB7eDogMH1cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwyNSwwKVwiXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuZGVzZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cblx0aWYgQHNlbGVjdGVkID09IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0ZWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0cmV0dXJuIEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5Dcm9zcyA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjcm9zc1RoaWNrbmVzcyA9IDRcblx0Y3Jvc3MgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcdFxuXHRcdGhlaWdodDogMzBcdFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNyb3NzVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc1Vwc3Ryb2tlLnkgPSAxNFxuXHRjcm9zc1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNyb3NzRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y3Jvc3Muc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNyb3NzLmRlc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFx0XG5cdHJldHVybiBjcm9zc1xuXHRcbkNhcmV0ID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNhcmV0VGhpY2tuZXNzID0gNFxuXHRjYXJldCA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XHRcblx0Y2FyZXRVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0VXBzdHJva2UueSA9IDE0XG5cdGNhcmV0VXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2FyZXREb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXREb3duc3Ryb2tlLnkgPSAxMlx0XHRcblx0Y2FyZXREb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjYXJldC5zZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2FyZXQuZGVzZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XG5cdHJldHVybiBjYXJldFxuXHRcbkNoZWNrID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNoZWNrVGhpY2tuZXNzID0gNFxuXHRjaGVjayA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjaGVja1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAxM1xuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcblx0Y2hlY2tVcHN0cm9rZS55ID0gMTZcblx0Y2hlY2tVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjaGVja0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIyXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjaGVja1x0XG5cdGNoZWNrRG93bnN0cm9rZS54ID0gNFxuXHRjaGVja0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNoZWNrLnNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjaGVjay5kZXNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdHJldHVybiBjaGVja1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXXG5cdFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRUYWJsZVZpZXdSb3dcdFx0W0VsZW1lbnRzIGdvIGhlcmVdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld1JvdyA9IChwYXJhbXMpIC0+XG5cdFxuXHQjIFRoZSB0cmlja3kgdGhpbmcgYWJvdXQgcmV1c2FibGUgY29tcG9uZW50cyBpcyByZW1lbWJlcmluZ1xuXHQjIGhvdyB0byB1c2UgdGhlbSAocGFydGljdWxhcmx5IGlmIHRoZXkgaGF2ZSBsb3RzIG9mIGN1c3RvbWl6YWJsZVxuXHQjIHBhcmFtZXRlcnMpLiBTZXR0aW5nIHNlbnNpYmxlIGRlZmF1bHRzIG1ha2VzIGl0IHdheSBlYXNpZXIgdG8gZ2V0XG5cdCMgc3RhcnRlZCAoYW5kIHJlbWVtYmVyIGhvdyB0byB1c2UgdGhlIHRoaW5nIHlvdSBtYWRlKVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0bmFtZTogJ0dpdmUgbWUgYSBuYW1lISdcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHRzZWxlY3RlZDogdHJ1ZVxuXHRcdGljb246ICdjaGVjaydcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0Zmlyc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdGxhc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdFxuXHRcdCMgQ29uc3RhbnRzXG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIb3Jpem9udGFsUGFkZGluZzogZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XHRcblx0IyBUaGlzIGlzIHRoZSByb290IG9iamVjdCBmb3IgdGhpcyBlbnRpcmUgY29tcG9uZW50LlxuXHQjIFdlIHdpbGwgYXR0YWNoIGFsbCBvdXIgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIHRoaXMgbGF5ZXJcblx0QGxpc3RJdGVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnhcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGNsaXA6IGZhbHNlXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3R5bGUgPSBcblx0XHRib3JkZXJUb3A6IFx0XHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcdGlmIHBhcmFtcy5sYXN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXG5cdCMgVGhlc2Ugd2lsbCBiZSBhY2Nlc3NlZCB1c2luZyBmdW5jdGlvbnNcblx0QGVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRAc2VsZWN0ZWQgPSBwYXJhbXMuc2VsZWN0ZWRcblx0XG5cdEBsaXN0SXRlbSA9IG5ldyBMYXllciBcblx0XHR4OiBwYXJhbXMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IEBsaXN0SXRlbUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcblx0QGxpc3RJdGVtLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QGxpc3RJdGVtLnN0eWxlID1cblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdGJvcmRlclRvcDogXHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCJcIiBlbHNlIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yXG5cblx0IyBUaGlzIGlzIHdoZXJlIHRoZSBsYWJlbCBvZiB0aGUgbGlzdCBpdGVtIGxpdmVzXG5cdEBsaXN0SXRlbS5odG1sID0gcGFyYW1zLm5hbWUgXG5cblx0IyBBZGQgdGhlIGNoZWNrbWFyayBmb3IgdGhlIGxpc3Rcblx0dGhpbmdUb1N3aXRjaCA9IHN3aXRjaFxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NoZWNrJyB0aGVuIG5ldyBDaGVjaygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY3Jvc3MnIHRoZW4gbmV3IENyb3NzKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjYXJldCcgdGhlbiBuZXcgQ2FyZXQoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ3N3aXRjaCcgdGhlbiBuZXcgU3dpdGNoKClcblxuXHR0aGluZ1RvU3dpdGNoLnN1cGVyTGF5ZXIgPSBAbGlzdEl0ZW1Db250YWluZXJcblx0dGhpbmdUb1N3aXRjaC54ID0gZGVmYXVsdHMuc2NyZWVuV2lkdGggLSB0aGluZ1RvU3dpdGNoLndpZHRoIC0gZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHR0aGluZ1RvU3dpdGNoLmNlbnRlclkoMilcbiMgXHR0aGluZ1RvU3dpdGNoLnkgPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIHRoaW5nVG9Td2l0Y2guaGVpZ2h0LzJcblx0XG5cdCMgTUFLRSBJVCBBTEwgSU5URVJBQ1RJVkVcblx0IyBPbiBhIGNsaWNrLCBnbyB0byB0aGUgbmV4dCBzdGF0ZVxuXHRpZiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJ1xuXHRcdHRoaW5nVG9Td2l0Y2gub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cdGVsc2UgXG5cdFx0QGxpc3RJdGVtLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2ggPSA9PlxuXHRcdGlmIEBzZWxlY3RlZCB0aGVuIEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCgpIGVsc2UgQGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCgpXG5cdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLnNlbGVjdCgpXG5cdFx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guZGVzZWxlY3QoKVx0XHRcblx0XHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbCA9IChuZXdUZXh0KSA9PlxuXHRcdEBsaXN0SXRlbS5odG1sID0gbmV3VGV4dFxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3RlZCA9ICgpID0+XG5cdFx0cmV0dXJuIEBzZWxlY3RlZFxuXHRcdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbChwYXJhbXMubmFtZSlcblxuXHRyZXR1cm4gQGxpc3RJdGVtQ29udGFpbmVyXG5cbmV4cG9ydHMuVGFibGVWaWV3ID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGl0ZW1zOiBbXCJJdCdzIGp1c3QgbWUhXCJdXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHZhbGlkYXRpb246ICdub25lJ1xuXHRcblx0QGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKiBwYXJhbXMuaXRlbXMubGVuZ3RoXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0XHRcdFx0XG5cdEBidXR0b25BcnJheSA9IFtdXG5cdGZvciBidXR0b25OYW1lLCBpIGluIHBhcmFtcy5pdGVtc1xuXHRcdGZpcnN0SXRlbUluTGlzdCA9IGlmIGkgPT0gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdGxhc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAocGFyYW1zLml0ZW1zLmxlbmd0aC0xKSB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdG5ld0J1dHRvbiA9IG5ldyBleHBvcnRzLlRhYmxlVmlld1Jvdyh7XG5cdFx0XHR4OiAwLCBcblx0XHRcdHk6IGkqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQsIFxuXHRcdFx0bmFtZTogYnV0dG9uTmFtZSwgXG5cdFx0XHRpY29uOiBwYXJhbXMuaWNvbixcblx0XHRcdGZpcnN0SXRlbUluTGlzdDogZmlyc3RJdGVtSW5MaXN0LFxuXHRcdFx0bGFzdEl0ZW1Jbkxpc3Q6IGxhc3RJdGVtSW5MaXN0XG5cdFx0fSlcblx0XHRAYnV0dG9uQXJyYXkucHVzaChuZXdCdXR0b24pXG5cdFx0bmV3QnV0dG9uLnN1cGVyTGF5ZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdGZvciBvdGhlckJ1dHRvbiwgb3RoZXJCdXR0b25JbmRleCBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0aWYgb3RoZXJCdXR0b25JbmRleCAhPSBpbmRleE9mQnV0dG9uQ2xpY2tlZFxuXHRcdFx0XHRcdFx0XHQjIERvIHN0dWZmIHRvIHRoZSBvdGhlciBidXR0b25zXG5cdFx0XHRcdFx0XHRcdG90aGVyQnV0dG9uLmRlc2VsZWN0KHtzdXBwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBpbmRleE9mQnV0dG9uQ2xpY2tlZCwgbnVtU2VsZWN0ZWQ6IDEsIGJ1dHRvbnM6IGJ1dHRvbkFycmF5IH1cblxuXHRhdHRhY2hEZWZhdWx0VmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHQjIEp1c3QgZW1pdHMgdGhlIG5ldyB2YWx1ZXNcblx0XHRidXR0b25Hcm91cENvbnRhaW5lciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXHRcdGZvciBidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCBpbiBidXR0b25BcnJheVxuXHRcdFx0YnV0dG9uQ2xpY2tlZC5kZXNlbGVjdCh7c3VwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHQjIENyZWF0ZXMgYSBjbG9zdXJlIHRvIHNhdmUgdGhlIGluZGV4IG9mIHRoZSBidXR0b24gd2UncmUgZGVhbGluZyB3aXRoXG5cdFx0XHRkbyAoYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQpIC0+IFxuXHRcdFx0XHQjIExpc3RlbiBmb3IgZXZlbnRzIGFuZCBjaGFuZ2Ugb3RoZXIgYnV0dG9ucyBpbiByZXNwb25zZVxuXHRcdFx0XHRidXR0b25DbGlja2VkLm9uICdEaWRDaGFuZ2UnLCAoZXZlbnQpID0+XG5cdFx0XHRcdFx0bnVtU2VsZWN0ZWQgPSAwXG5cdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzID0gW11cdFx0XG5cdFx0XHRcdFx0Zm9yIGJ1dHRvbiBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzLnB1c2goYnV0dG9uLnNlbGVjdGVkKCkpXG5cdFx0XHRcdFx0XHRpZiBidXR0b24uc2VsZWN0ZWQoKSB0aGVuIG51bVNlbGVjdGVkKytcblx0XHRcdFx0XHRidXR0b25Hcm91cENvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IHRhYmxlVmlld1N0YXRlcywgbnVtU2VsZWN0ZWQ6IG51bVNlbGVjdGVkLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0aWYgcGFyYW1zLnZhbGlkYXRpb24gPT0gJ3JhZGlvJ1xuXHRcdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdGVsc2UgXG5cdFx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRcdFxuXHRyZXR1cm4gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblxuXG4jIyNcblx0VEFCTEUgVklFVyBIRUFERVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdIZWFkZXIgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0dGV4dDogJ0kgYW0gYSBkaXZpZGVyJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdGxpc3REaXZpZGVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnggKyBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRsaXN0RGl2aWRlci5odG1sID0gcGFyYW1zLnRleHRcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBkZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZVxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBkZWZhdWx0cy50aW50XG5cdHJldHVybiBsaXN0RGl2aWRlclxuXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5cbiMjIFV0aWxpdHkgZnVuY3Rpb25zXG5cbnF1YW50aXplID0gKGlucHV0LCBzdGVwU2l6ZSkgLT5cblx0cmV0dXJuIE1hdGguZmxvb3IoaW5wdXQvc3RlcFNpemUpICogc3RlcFNpemVcblxuXG4jIyBUaGUgaXRlbXMgaW4gdGhlIHBpY2tlclxuXG5EcnVtID0gKHBhcmVudERydW1MYXllciwgZHJ1bU5hbWUsIGxpc3RJdGVtcywgcGFyYW1zKSAtPlxuXHRcblx0IyBTZXR1cCB2YXJpYWJsZXNcblx0QHBhcmVudERydW1MYXllciA9IHBhcmVudERydW1MYXllclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHhQY3Q6IDAgIFx0XHRcdFx0IyAwIHRvIDFcblx0XHR3aWR0aFBjdDogMVx0XHRcdFx0IyAwIHRvIDFcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcdFx0IyBsZWZ0LCBjZW50ZXIsIHJpZ2h0XG5cdFx0dGV4dFBhZGRpbmc6IFwiMFwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFxuXHQjIFZhbHVlcyBkZXJpdmVkIGZyb20gcGFyYW1zXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0IyBTZXQgdXAgY29udGVudCBvZiBsaXN0IFx0XHRcblx0bGlzdEl0ZW1zID0gbGlzdEl0ZW1zXG5cdEBuYW1lID0gZHJ1bU5hbWVcblx0QGluZGV4ID0gMFxuXHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0QHZlbG9jaXR5ID0gMFxuXHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZSAgICAjIGlzIHRoaXMgdGhlIGZpcnN0IHRvdWNoIGluIGEgZ2l2ZW4gZ2VzdHVyZT9cblx0XG5cdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IDBcblx0XG5cdCMgQ2FsY3VsYXRlIGhlaWdodCBhbmQgdmVydGljYWwgYm91bmRzIG9mIHRoZSBsaXN0XG5cdGxpc3RNaW5ZUG9zIFx0PSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0TWF4WVBvcyBcdD0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0SGVpZ2h0IFx0XHQ9IGxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0XG5cblx0QGRydW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0cGFyYW1zLnhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRzdXBlckxheWVyOiBcdFx0cGFyZW50RHJ1bUxheWVyXG5cdFxuXHRsaXN0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRsaXN0SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogXHRcdEBkcnVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFxuXHQjIGxpc3RMYXllci5zY3JvbGwgPSB0cnVlXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuc3BlZWRYID0gMFxuXHRcblx0Zm9yIGxpLCBpIGluIGxpc3RJdGVtc1xuXHRcdGxpc3RJdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHRpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblx0XHRcdHdpZHRoOiBcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdFx0aGVpZ2h0OiBcdFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRcdHN1cGVyTGF5ZXI6IFx0bGlzdExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiI1V0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRsaXN0SXRlbUxheWVyLmh0bWwgPSBsaVxuXHRcdGxpc3RJdGVtTGF5ZXIuc3R5bGUgPVxuXHRcdFx0Y29sb3I6IFx0XHRcdHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRcdGZvbnRGYW1pbHk6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRGYW1pbHlcblx0XHRcdGZvbnRXZWlnaHQ6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRXZWlnaHRcblx0XHRcdGZvbnRTaXplOiBcdFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRTaXplXG5cdFx0XHRsaW5lSGVpZ2h0OiBcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K1wicHhcIlxuXHRcdFx0dGV4dEFsaWduOiBcdFx0cGFyYW1zLnRleHRBbGlnblxuXHRcdFx0cGFkZGluZzogXHRcdHBhcmFtcy50ZXh0UGFkZGluZ1xuXG5cdFx0bGlzdEl0ZW1MYXllci5zdGFydFkgPSBpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdNb3ZlLCA9PlxuXHRcdGlmIGZpcnN0VG91Y2hBdmFpbGFibGVcblx0XHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCB7ZHJ1bTogZHJ1bU5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsLCB2ZWxvY2l0eTogMH0pXG5cdFx0XHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gZmFsc2VcdFx0XG5cdFx0XHRcblx0XHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFx0XG5cdCMgVG8gc2ltdWxhdGUgaU9TIG1vbWVudHVtIHNjcm9sbGluZyAod2hpY2ggY2F1c2VzIHRoZSBkcnVtIHRvIGtlZXAgc3Bpbm5pbmcgXG5cdCMgYWZ0ZXIgeW91ciBmaW5nZXIgbGlmdHMgb2ZmIGl0KSwgd2UgdHJpZ2dlciBhbiBhbmltYXRpb24gdGhlIG1vbWVudCB5b3UgbGlmdFxuXHQjIHlvdXIgZmluZ2VyLiBUaGUgaW50ZW5zaXR5IG9mIHRoaXMgYW5pbWF0aW9uIGlzIHByb3BvcnRpb25hbCB0byB0aGUgc3BlZWQgd2hlblxuXHQjIG9mIHRoZSBkcmFnZ2luZyB3aGVuIHlvdXIgZmluZ2VyIHdhcyBsaWZ0ZWQuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ0VuZCwgKGUsIGYpID0+XG5cdFx0XG5cdFx0IyBOZXh0IHRvdWNoIHNob3VsZCB0cmlnZ2VyIERydW1TdGFydGVkTW92aW5nXG5cdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWVcblx0XG5cdFx0IyBUaGlzIGNhbGN1bGF0ZXMgdGhlIGFuaW1hdGlvblxuXHRcdHNjcm9sbFZlbG9jaXR5ID0gbGlzdExheWVyLmRyYWdnYWJsZS5jYWxjdWxhdGVWZWxvY2l0eSgpLnlcblx0XHR0aW1lQWZ0ZXJEcmFnID0gKDAuNStNYXRoLmFicyhzY3JvbGxWZWxvY2l0eSowLjIpKS50b0ZpeGVkKDEpXG5cdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBxdWFudGl6ZShsaXN0TGF5ZXIueSArIHNjcm9sbFZlbG9jaXR5KjQwMCwgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpICsgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdFxuXHRcdCMgQXQgdGhlIHRvcCBhbmQgYm90dG9tLCB0aGUgbW9tZW50dW0gc2hvdWxkIGJlIGFkanVzdGVkIHNvIHRoZSBcblx0XHQjIGZpcnN0IGFuZCBsYXN0IHZhbHVlcyBvbiB0aGUgZHJ1bSBkb24ndCBnbyB0b28gZmFyIG91dCBvZiB2aWV3XG5cdFx0ZGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciA9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym90dG9tT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlci1maW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0dG9wT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0b3ZlcmZsb3dEYW1wZW5pbmcgPSAxMFxuXHRcdFxuXHRcdGlmIGJvdHRvbU92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciAtIChib3R0b21PdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdGlmIHRvcE92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSA0MCArICh0b3BPdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdCMgVHJpZ2dlciB0aGUgYW5pbWF0aW9uLCBhbmQgc2NoZWR1bGUgYW4gZXZlbnQgdGhhdCB3aWxsXG5cdFx0IyB0cmlnZ2VyIHdoZW4gdGhlIGRydW0gZmluYWxseSBzdG9wcyBzcGlubmluZy5cblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bX1cblx0XHRcdFx0dGltZTogdGltZUFmdGVyRHJhZ1xuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXHRcdFV0aWxzLmRlbGF5IHRpbWVBZnRlckRyYWcsIC0+XG5cdFx0XHRzdG9wRHJ1bSgpXG5cblx0IyBUaGlzIGVuc3VyZXMgdGhhdCBkdXJpbmcgdGhlIGFuaW1hdGlvbiBvZiB0aGUgbGlzdCBsYXllciwgdGhlIGRydW0ncyBhcHBlYXJhbmNlIGNvbnRpbnVlc1xuXHQjIHRvIGJlIHVwZGF0ZWQuIEJlY2F1c2UgbXVsdGlwbGUgYW5pbWF0aW9ucyBjb3VsZCBvdmVybGFwLCB3ZSBlbnN1cmUgdGhhdCBldmVyeSBuZXcgYW5pbWF0aW9uXG5cdCMgZW5kcyB0aGUgaW50ZXJ2YWwgYW5kIHN0YXJ0cyBhIG5ldyBvbmUgc28gdGhhdCB3ZSBuZXZlciBoYXZlIG1vcmUgdGhhbiBvbmUgcnVubmluZyBcblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgLT5cblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblx0XHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSBVdGlscy5pbnRlcnZhbCAxLzMwLCB1cGRhdGVEcnVtQXBwZWFyYW5jZSAgICBcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cdFx0XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cblx0XHQjIEVtaXQgYWZ0ZXIgYWxsIG1vdmVtZW50IGVuZHMgaW4gdGhlIGxpc3Rcblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSA9PlxuXHRcdGl0ZW1zSW5EcnVtID0gNFxuXHRcdGxpc3RQb3NpdGlvbiA9IGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41XG5cdFx0Y2FwcGVkTGlzdFBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjUsIGxpc3RJdGVtcy5sZW5ndGggLSAxKSlcblx0XHRmb2N1c0l0ZW0gPSBNYXRoLnJvdW5kKGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRkaXN0YW5jZUZyb21NaWRkbGUgPSBNYXRoLmFicyhmb2N1c0l0ZW0gLSBjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0Zm9yIGkgaW4gWyhmb2N1c0l0ZW0taXRlbXNJbkRydW0pLi4oZm9jdXNJdGVtK2l0ZW1zSW5EcnVtKV1cblx0XHRcdGlmIGkgPj0gMCBhbmQgaSA8IGxpc3RJdGVtcy5sZW5ndGhcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5vcGFjaXR5ID0gMSAtIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzUgLSAoaWYgKGkgIT0gZm9jdXNJdGVtKSB0aGVuIDAuMyBlbHNlIDApXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0uc2NhbGVZID0gMSAtIE1hdGgubWluKDEsIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzQpXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ueSA9IGxpc3RMYXllci5zdWJMYXllcnNbaV0uc3RhcnRZIC0gKGktbGlzdFBvc2l0aW9uKSpNYXRoLmFicyhpLWxpc3RQb3NpdGlvbikqMTBcblxuXHRcdCMgVXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgZHJ1bSBvbmx5IHdoZW4gYSBuZXcgdmFsdWUgaXMgcmVhY2hlZFxuXHRcdGlmIChAaW5kZXggIT0gZm9jdXNJdGVtKVxuXHRcdFx0dXBkYXRlRHJ1bVZhbHVlcyhmb2N1c0l0ZW0pXG5cdFx0XG5cdHN0b3BEcnVtID0gPT5cdFx0XG5cdFx0IyBFbnN1cmUgdGhlIGRydW0gbmV2ZXIgZW5kcyBvdXQgb2YgYm91bmRzXG5cdFx0aWYgbGlzdExheWVyLnkgPiBsaXN0TWluWVBvcyBcblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHQgICAgXHRwcm9wZXJ0aWVzOiB7eTpsaXN0TWluWVBvc31cblx0XHQgICAgXHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFx0aWYgbGlzdExheWVyLnkgPCBsaXN0TWF4WVBvc1xuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogbGlzdE1heFlQb3N9XG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XG5cdCMgVXBkYXRlIHRoZSB2YWx1ZXMgb2YgdGhlIGRydW1zIGFuZCBpbnZva2UgdGhlIGNhbGxiYWNrIFxuXHR1cGRhdGVEcnVtVmFsdWVzID0gKG5ld0luZGV4KSA9PlxuXHRcdEBpbmRleCA9IG5ld0luZGV4XG5cdFx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1EaWRDaGFuZ2VcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cdFxuXHQjIFJlbmRlciBmb3IgdGhlIGZpcnN0IHRpbWVcdFx0XG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlKClcblx0XG5cdEBzZXRJbmRleCA9IChpbmRleCkgPT5cblx0XHR5UG9zaXRpb25Gb3JUaGlzSW5kZXggPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIChpbmRleCAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KVxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IHlQb3NpdGlvbkZvclRoaXNJbmRleH1cblx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cblx0QHNldFZhbHVlID0gKHZhbCkgPT5cblx0XHRpbmRleCA9IGxpc3RJdGVtcy5pbmRleE9mKHZhbClcblx0XHRpZiBpbmRleCAhPSAtMVxuXHRcdFx0QHNldEluZGV4KGluZGV4KVxuXG5cdCMgUmV0dXJuIHRoZSBkcnVtIG9iamVjdCBzbyB3ZSBjYW4gYWNjZXNzIGl0cyB2YWx1ZXNcblx0cmV0dXJuIEBcblxuXG4jIyNcblx0UElDS0VSXG5cdFRoaXMgY29udGFpbnMgdGhlIHBpY2tlciBcbiMjIyBcbmV4cG9ydHMuUGlja2VyID0gKHBhcmFtcykgLT5cblx0XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGRlZmF1bHRUZXh0OiBcIlwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHRAcGlja2VyQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdHBhcmFtcy54XG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHQrODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0ZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRcdFxuXHRAZHJ1bSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDg4XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcdFx0XG5cdFx0XG5cdEBzZWxlY3RlZEl0ZW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0LzIgLSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAZHJ1bVxuXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDpcdDg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcblx0XHRcblx0IyBTdHlsZXNcblx0QGRydW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFxuXHRAc2VsZWN0ZWRJdGVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdHBhZGRpbmdMZWZ0OiBcIjIwcHhcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLmh0bWwgPSBwYXJhbXMuZGVmYXVsdFRleHRcblx0XHRcblx0XHRcblx0IyBBZGQgZHJ1bXNcblx0QHBpY2tlckNvbnRhaW5lci5kcnVtcyA9IFtdXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWUgPSB7fVxuXHRcblx0cGlja2VyU3RhcnRlZE1vdmluZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWwsIHZlbG9jaXR5OiAwfVx0XG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyU3RhcnRlZE1vdmluZ1wiIClcblx0XHRcblx0cGlja2VyRGlkQ2hhbmdlID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckRpZENoYW5nZVwiLCBkcnVtVmFsdWVzIClcblx0XG5cdHBpY2tlckZpbmlzaGVkQ2hhbmdpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRmluaXNoZWRDaGFuZ2luZ1wiLCBkcnVtVmFsdWVzIClcdFxuXHRpZiAocGFyYW1zLmRydW1zIGFuZCBwYXJhbXMuZHJ1bXMubGVuZ3RoID4gMClcblx0XHRmb3IgZHJ1bSBpbiBwYXJhbXMuZHJ1bXNcblx0XHRcdG5ld0RydW0gPSBuZXcgRHJ1bShAZHJ1bSwgZHJ1bS5uYW1lLCBkcnVtLml0ZW1zLCBkcnVtLnBhcmFtcylcblxuXHRcdFx0IyMgU3RvcmUgZHJ1bXMgaW5zaWRlIHRoZSBwaWNrZXJcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXMucHVzaChuZXdEcnVtKVxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZVtkcnVtLm5hbWVdID0gbmV3RHJ1bSBcblxuXHRcdFx0IyMgRW5zdXJlIHRoYXQgY2hhbmdlcyB0byB0aGUgZHJ1bSBidWJibGUgdXAgdG8gdGhlIHBpY2tlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bURpZENoYW5nZVwiLCBwaWNrZXJEaWRDaGFuZ2Vcblx0XHRcdFxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGRydW1zIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcblxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGxpc3RzIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1TdGFydGVkTW92aW5nXCIsIHBpY2tlclN0YXJ0ZWRNb3ZpbmdcblxuXG5cdHJldHVybiBAcGlja2VyQ29udGFpbmVyXG4iLCJcblxuXG4jICdGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcycgbW9kdWxlIHYxLjBcbiMgYnkgTWFyYyBLcmVubiwgTWF5IDMxc3QsIDIwMTYgfCBtYXJjLmtyZW5uQGdtYWlsLmNvbSB8IEBtYXJjX2tyZW5uXG5cbiMgRG9jdW1lbnRhdGlvbiBvZiB0aGlzIE1vZHVsZTogaHR0cHM6Ly9naXRodWIuY29tL21hcmNrcmVubi9mcmFtZXItRmlyZWJhc2VcbiMgLS0tLS0tIDogLS0tLS0tLSBGaXJlYmFzZSBSRVNUIEFQSTogaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvcmVmZXJlbmNlL3Jlc3QvZGF0YWJhc2UvXG5cblxuIyBUb0RvOlxuIyBGaXggb25DaGFuZ2UgXCJjb25uZWN0aW9uXCIsIGB0aGlzwrQgY29udGV4dFxuXG5cblxuIyBGaXJlYmFzZSBSRVNUIEFQSSBDbGFzcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIGV4cG9ydHMuRmlyZWJhc2UgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cblxuXG5cdGdldENPUlN1cmwgPSAoc2VydmVyLCBwYXRoLCBzZWNyZXQsIHByb2plY3QpIC0+XG5cblx0XHRzd2l0Y2ggVXRpbHMuaXNXZWJLaXQoKVxuXHRcdFx0d2hlbiB0cnVlIHRoZW4gdXJsID0gXCJodHRwczovLyN7c2VydmVyfSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fSZucz0je3Byb2plY3R9JnNzZT10cnVlXCIgIyBXZWJraXQgWFNTIHdvcmthcm91bmRcblx0XHRcdGVsc2UgICAgICAgICAgIHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXHRcdHJldHVybiB1cmxcblxuXG5cdEAuZGVmaW5lIFwic3RhdHVzXCIsXG5cdFx0Z2V0OiAtPiBAX3N0YXR1cyAjIHJlYWRPbmx5XG5cblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAcHJvamVjdElEID0gQG9wdGlvbnMucHJvamVjdElEID89IG51bGxcblx0XHRAc2VjcmV0ICAgID0gQG9wdGlvbnMuc2VjcmV0ICAgID89IG51bGxcblx0XHRAc2VydmVyICAgID0gQG9wdGlvbnMuc2VydmVyICAgID89IHVuZGVmaW5lZCAjIHJlcXVpcmVkIGZvciBXZWJLaXQgWFNTIHdvcmthcm91bmRcblx0XHRAZGVidWcgICAgID0gQG9wdGlvbnMuZGVidWcgICAgID89IGZhbHNlXG5cdFx0QF9zdGF0dXMgICAgICAgICAgICAgICAgICAgICAgICA/PSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0c3VwZXJcblxuXG5cdFx0aWYgQHNlcnZlciBpcyB1bmRlZmluZWRcblx0XHRcdFV0aWxzLmRvbUxvYWRKU09OIFwiaHR0cHM6Ly8je0Bwcm9qZWN0SUR9LmZpcmViYXNlaW8uY29tLy5zZXR0aW5ncy9vd25lci5qc29uXCIsIChhLHNlcnZlcikgLT5cblx0XHRcdFx0cHJpbnQgbXNnID0gXCJBZGQgX19fX19fIHNlcnZlcjpcIiArICcgICBcIicgKyBzZXJ2ZXIgKyAnXCInICsgXCIgX19fX18gdG8geW91ciBpbnN0YW5jZSBvZiBGaXJlYmFzZS5cIlxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiAje21zZ31cIiBpZiBAZGVidWdcblxuXG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGluZyB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyAuLi4gXFxuIFVSTDogJyN7Z2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRCl9J1wiIGlmIEBkZWJ1Z1xuXHRcdEAub25DaGFuZ2UgXCJjb25uZWN0aW9uXCJcblxuXG5cdHJlcXVlc3QgPSAocHJvamVjdCwgc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgbWV0aG9kLCBkYXRhLCBwYXJhbWV0ZXJzLCBkZWJ1ZykgLT5cblxuXHRcdHVybCA9IFwiaHR0cHM6Ly8je3Byb2plY3R9LmZpcmViYXNlaW8uY29tI3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9XCJcblxuXG5cdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLnNoYWxsb3cgICAgICAgICAgICB0aGVuIHVybCArPSBcIiZzaGFsbG93PXRydWVcIlxuXHRcdFx0aWYgcGFyYW1ldGVycy5mb3JtYXQgaXMgXCJleHBvcnRcIiB0aGVuIHVybCArPSBcIiZmb3JtYXQ9ZXhwb3J0XCJcblxuXHRcdFx0c3dpdGNoIHBhcmFtZXRlcnMucHJpbnRcblx0XHRcdFx0d2hlbiBcInByZXR0eVwiIHRoZW4gdXJsICs9IFwiJnByaW50PXByZXR0eVwiXG5cdFx0XHRcdHdoZW4gXCJzaWxlbnRcIiB0aGVuIHVybCArPSBcIiZwcmludD1zaWxlbnRcIlxuXG5cdFx0XHRpZiB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiXG5cdFx0XHRcdHVybCArPSBcIiZkb3dubG9hZD0je3BhcmFtZXRlcnMuZG93bmxvYWR9XCJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLFwiX3NlbGZcIilcblxuXG5cdFx0XHR1cmwgKz0gXCImb3JkZXJCeT1cIiArICdcIicgKyBwYXJhbWV0ZXJzLm9yZGVyQnkgKyAnXCInIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLm9yZGVyQnkgICAgICBpcyBcInN0cmluZ1wiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0ZpcnN0PSN7cGFyYW1ldGVycy5saW1pdFRvRmlyc3R9XCIgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvRmlyc3QgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9MYXN0PSN7cGFyYW1ldGVycy5saW1pdFRvTGFzdH1cIiAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0xhc3QgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZzdGFydEF0PSN7cGFyYW1ldGVycy5zdGFydEF0fVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLnN0YXJ0QXQgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZW5kQXQ9I3twYXJhbWV0ZXJzLmVuZEF0fVwiICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lbmRBdCAgICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVxdWFsVG89I3twYXJhbWV0ZXJzLmVxdWFsVG99XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZXF1YWxUbyAgICAgIGlzIFwibnVtYmVyXCJcblxuXG5cdFx0eGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3Rcblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBOZXcgJyN7bWV0aG9kfSctcmVxdWVzdCB3aXRoIGRhdGE6ICcje0pTT04uc3RyaW5naWZ5KGRhdGEpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ID0+XG5cblx0XHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0XHRpZiBwYXJhbWV0ZXJzLnByaW50IGlzIFwic2lsZW50XCIgb3IgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIiB0aGVuIHJldHVybiAjIHVnaFxuXG5cdFx0XHRzd2l0Y2ggeGh0dHAucmVhZHlTdGF0ZVxuXHRcdFx0XHR3aGVuIDAgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IG5vdCBpbml0aWFsaXplZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMSB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFNlcnZlciBjb25uZWN0aW9uIGVzdGFibGlzaGVkIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAyIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCByZWNlaXZlZCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDMgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBQcm9jZXNzaW5nIHJlcXVlc3QgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gNFxuXHRcdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBmaW5pc2hlZCwgcmVzcG9uc2U6ICcje0pTT04ucGFyc2UoeGh0dHAucmVzcG9uc2VUZXh0KX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXHRcdFx0aWYgeGh0dHAuc3RhdHVzIGlzIFwiNDA0XCJcblx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IEludmFsaWQgcmVxdWVzdCwgcGFnZSBub3QgZm91bmQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cblx0XHR4aHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuXHRcdHhodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXG5cdFx0eGh0dHAuc2VuZChkYXRhID0gXCIje0pTT04uc3RyaW5naWZ5KGRhdGEpfVwiKVxuXG5cblxuXHQjIEF2YWlsYWJsZSBtZXRob2RzXG5cblx0Z2V0OiAgICAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiR0VUXCIsICAgIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cHV0OiAgICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUFVUXCIsICAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cG9zdDogICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUE9TVFwiLCAgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0cGF0Y2g6ICAocGF0aCwgZGF0YSwgY2FsbGJhY2ssIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiUEFUQ0hcIiwgIGRhdGEsIHBhcmFtZXRlcnMsIEBkZWJ1Zylcblx0ZGVsZXRlOiAocGF0aCwgY2FsbGJhY2ssICAgICAgIHBhcmFtZXRlcnMpIC0+IHJlcXVlc3QoQHByb2plY3RJRCwgQHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIFwiREVMRVRFXCIsIG51bGwsIHBhcmFtZXRlcnMsIEBkZWJ1ZylcblxuXG5cblx0b25DaGFuZ2U6IChwYXRoLCBjYWxsYmFjaykgLT5cblxuXG5cdFx0aWYgcGF0aCBpcyBcImNvbm5lY3Rpb25cIlxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwib3BlblwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBlc3RhYmxpc2hlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcImVycm9yXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImRpc2Nvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogQ29ubmVjdGlvbiB0byBGaXJlYmFzZSBQcm9qZWN0ICcje0Bwcm9qZWN0SUR9JyBjbG9zZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiZGlzY29ubmVjdGVkXCJcblxuXG5cdFx0ZWxzZVxuXG5cdFx0XHR1cmwgPSBnZXRDT1JTdXJsKEBzZXJ2ZXIsIHBhdGgsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTGlzdGVuaW5nIHRvIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwdXRcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicHV0XCIsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aCwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQVVQnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwYXRjaFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwYXRjaFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIikpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUEFUQ0gnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcbiIsIl9nZXRIaWVyYXJjaHkgPSAobGF5ZXIpIC0+XG4gIHN0cmluZyA9ICcnXG4gIGZvciBhIGluIGxheWVyLmFuY2VzdG9ycygpXG4gICAgc3RyaW5nID0gYS5uYW1lKyc+JytzdHJpbmdcbiAgcmV0dXJuIHN0cmluZyA9IHN0cmluZytsYXllci5uYW1lXG5cbl9tYXRjaCA9IChoaWVyYXJjaHksIHN0cmluZykgLT5cbiAgIyBwcmVwYXJlIHJlZ2V4IHRva2Vuc1xuICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxzKj5cXHMqL2csJz4nKSAjIGNsZWFuIHVwIHNwYWNlcyBhcm91bmQgYXJyb3dzXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnKicpLmpvaW4oJ1tePl0qJykgIyBhc3RlcmlrcyBhcyBsYXllciBuYW1lIHdpbGRjYXJkXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnICcpLmpvaW4oJyg/Oi4qKT4nKSAjIHNwYWNlIGFzIHN0cnVjdHVyZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJywnKS5qb2luKCckfCcpICMgYWxsb3cgbXVsdGlwbGUgc2VhcmNoZXMgdXNpbmcgY29tbWFcbiAgcmVnZXhTdHJpbmcgPSBcIihefD4pXCIrc3RyaW5nK1wiJFwiICMgYWx3YXlzIGJvdHRvbSBsYXllciwgbWF5YmUgcGFydCBvZiBoaWVyYXJjaHlcblxuICByZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKSBcbiAgcmV0dXJuIGhpZXJhcmNoeS5tYXRjaChyZWdFeHApXG5cbl9maW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+XG4gIGxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXG4gIGlmIHNlbGVjdG9yP1xuICAgIHN0cmluZ05lZWRzUmVnZXggPSBfLmZpbmQgWycqJywnICcsJz4nLCcsJ10sIChjKSAtPiBfLmNvbnRhaW5zIHNlbGVjdG9yLGNcbiAgICB1bmxlc3Mgc3RyaW5nTmVlZHNSZWdleCBvciBmcm9tTGF5ZXJcbiAgICAgIGxheWVycyA9IF8uZmlsdGVyIGxheWVycywgKGxheWVyKSAtPiBcbiAgICAgICAgaWYgbGF5ZXIubmFtZSBpcyBzZWxlY3RvciB0aGVuIHRydWVcbiAgICBlbHNlXG4gICAgICBsYXllcnMgPSBfLmZpbHRlciBsYXllcnMsIChsYXllcikgLT5cbiAgICAgICAgICBoaWVyYXJjaHkgPSBfZ2V0SGllcmFyY2h5KGxheWVyKVxuICAgICAgICAgIGlmIGZyb21MYXllcj9cbiAgICAgICAgICAgIF9tYXRjaChoaWVyYXJjaHksIGZyb21MYXllci5uYW1lKycgJytzZWxlY3RvcilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBfbWF0Y2goaGllcmFyY2h5LCBzZWxlY3RvcilcbiAgZWxzZVxuICAgIGxheWVyc1xuXG5cbiMgR2xvYmFsXG5leHBvcnRzLkZpbmQgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cbmV4cG9ydHMuxpIgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilbMF1cblxuZXhwb3J0cy5GaW5kQWxsID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpXG5leHBvcnRzLsaSxpIgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVxuXG4jIE1ldGhvZHNcbkxheWVyOjpmaW5kICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClbMF1cbkxheWVyOjrGkiAgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApWzBdXG5cbkxheWVyOjpmaW5kQWxsICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClcbkxheWVyOjrGksaSICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKSIsIiMgVGhpcyBpcyBhIHVzZXJzIGZpbGVcbmV4cG9ydHMuZGV0YWlsQ29udGVudCA9IFtcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiVDJcIlxuICAgICAgaGVhZGxpbmU6IFwiTWVkaXRlcnJhbmVhbiBTZWEgd2l0aCBDb3N0YSBEaWFkZW1hXCJcbiAgICAgIGlzSW5OYXY6IGZhbHNlXG4gICAgICBzZWN0aW9uczpbXCJPdmVydmlld1AxXCIsXCJPdmVydmlld1AxXCIsXCJUaGUgRGVzdGluYXRpb25zXCIsXCJDb3N0YSBEaWFkZW1hXCIsXCJMaWZlIG9uIEJvYXJkXCIsXCJDcnVpc2UgRGF0ZXMgYW5kIFByaWNlc1wiLFwiU3BlY2lhbCBPZmZlcnNcIl1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hdk5hbWU6XCJEZXN0aW5hdGlvbnNcIlxuICAgICAgaGVhZGxpbmU6IFwiREVTVElOQVRJT05TXCJcbiAgICAgIGlzSW5OYXY6IHRydWVcbiAgICAgIHNlY3Rpb25zOltcIm1hcFwiLFwiZGF5IGRldGFpbFwiLFwid2hhdCdzIGluY2x1ZGVkXCJdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiQ29zdGEgRGlhZGVtYVwiXG4gICAgICBoZWFkbGluZTogXCJDT1NUQSBESUFERU1BXCJcbiAgICAgIGlzSW5OYXY6IHRydWVcbiAgICAgIHNlY3Rpb25zOltcInNoaXBQaG90b1wiLFwiZmFjdHNcIixcImFjY29tb2RhdGlvbnNcIixcInNhZmV0eVwiXVxuICAgIH0sXG4gICAge1xuICAgICAgbmF2TmFtZTpcIkxpZmUgb24gQm9hcmRcIlxuICAgICAgaGVhZGxpbmU6IFwiTElGRSBPTiBCT0FSRFwiXG4gICAgICBpc0luTmF2OiB0cnVlXG4gICAgICBzZWN0aW9uczpbXCJvdmVydmlld1wiLFwiZGluaW5nXCIsXCJzcGEgYW5kIHdlbGxuZXNzXCIsXCJraWRzIGFuZCBmYW1pbGllc1wiLCBcIm5pZ2h0bGlmZVwiLFwiZXZlbnRzXCJdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiQ3J1aXNlIERhdGVzIGFuZCBQcmljZXNcIlxuICAgICAgaGVhZGxpbmU6IFwiTElGRSBPTiBCT0FSRFwiXG4gICAgICBpc0luTmF2OiB0cnVlXG4gICAgICBzZWN0aW9uczpbXCJkYXRlcyBpbnRlcmFjdGlvblwiXVxuICAgIH0sIFxuICAgIHtcbiAgICAgIG5hdk5hbWU6XCJTcGVjaWFsIERlYWxzXCJcbiAgICAgIGhlYWRsaW5lOiBcIkxJRkUgT04gQk9BUkRcIlxuICAgICAgaXNJbk5hdjogdHJ1ZVxuICAgICAgc2VjdGlvbnM6W1wiZGVhbCAxXCIsIFwiZGVhbCAyXCJdXG4gICAgfSxcbiAgXVxuIiwiY2xhc3MgbW9kdWxlLmV4cG9ydHMgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5iYWNrQnV0dG9uTmFtZSA/PSAnYmFja0J1dHRvbidcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5zY3JvbGwgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmF1dG9MaW5rID89IHRydWVcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cblx0XHRAb25DaGFuZ2UgXCJzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpID0+XG5cdFx0XHR2aWV3ID0gY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0aWYgdmlldz9cblx0XHRcdFx0IyBkZWZhdWx0IGJlaGF2aW9ycyBmb3Igdmlld3Ncblx0XHRcdFx0dmlldy5jbGlwID0gdHJ1ZVxuXHRcdFx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0XHRcdCMgYWRkIHNjcm9sbGNvbXBvbmVudFxuXHRcdFx0XHRpZiBAc2Nyb2xsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gPSB2aWV3LmNoaWxkcmVuXG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0XHRcdFx0bmFtZTogXCJzY3JvbGxDb21wb25lbnRcIlxuXHRcdFx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHZpZXdcblx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuY29udGVudC5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRcdFx0aWYgdmlldy53aWR0aCA8PSBAd2lkdGhcblx0XHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2Vcblx0XHRcdFx0XHRpZiB2aWV3LmhlaWdodCA8PSBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsVmVydGljYWwgPSBmYWxzZVxuXHRcdFx0XHRcdGZvciBjIGluIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHRjLnBhcmVudCA9IHNjcm9sbENvbXBvbmVudC5jb250ZW50XG5cdFx0XHRcdFx0dmlldy5zY3JvbGxDb21wb25lbnQgPSBzY3JvbGxDb21wb25lbnQgIyBtYWtlIGl0IGFjY2Vzc2libGUgYXMgYSBwcm9wZXJ0eVxuXHRcdFx0XHRcdCMgcmVzZXQgc2l6ZSBzaW5jZSBjb250ZW50IG1vdmVkIHRvIHNjcm9sbENvbXBvbmVudC4gcHJldmVudHMgc2Nyb2xsIGJ1ZyB3aGVuIGRyYWdnaW5nIG91dHNpZGUuXG5cdFx0XHRcdFx0dmlldy5zaXplID0ge3dpZHRoOiBAd2lkdGgsIGhlaWdodDogQGhlaWdodH1cblxuXHRcdHRyYW5zaXRpb25zID1cblx0XHRcdHN3aXRjaEluc3RhbnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiAwLCB5OiAwfVxuXHRcdFx0ZmFkZUluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHtvcGFjaXR5OiAwfVxuXHRcdFx0XHRcdHRvOiB7b3BhY2l0eTogMX1cblx0XHRcdHpvb21Jbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7c2NhbGU6IDAuOCwgb3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge3NjYWxlOiAxLCBvcGFjaXR5OiAxfVxuXHRcdFx0em9vbU91dDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRzbGlkZUluVXA6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3k6IEBoZWlnaHR9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0c2xpZGVJblJpZ2h0OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkRvd246XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFk6IDB9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0bW92ZUluUmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0bW92ZUluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRzbGlkZUluTGVmdDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge21heFg6IEB3aWR0aH1cblx0XHRcdHB1c2hJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogLShAd2lkdGgvNSksIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaEluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogLUB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRwdXNoT3V0UmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHB1c2hPdXRMZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRoLzUsIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRcdHRvOiB7eDogMCwgYnJpZ2h0bmVzczogMTAwfVxuXHRcdFx0c2xpZGVPdXRVcDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFk6IDB9XG5cdFx0XHRzbGlkZU91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0c2xpZGVPdXREb3duOlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eTogQGhlaWdodH1cblx0XHRcdHNsaWRlT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cblx0XHQjIHNob3J0Y3V0c1xuXHRcdHRyYW5zaXRpb25zLnNsaWRlSW4gPSB0cmFuc2l0aW9ucy5zbGlkZUluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5zbGlkZU91dCA9IHRyYW5zaXRpb25zLnNsaWRlT3V0UmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoSW4gPSB0cmFuc2l0aW9ucy5wdXNoSW5SaWdodFxuXHRcdHRyYW5zaXRpb25zLnB1c2hPdXQgPSB0cmFuc2l0aW9ucy5wdXNoT3V0UmlnaHRcblxuXHRcdCMgZXZlbnRzXG5cdFx0RXZlbnRzLlZpZXdXaWxsU3dpdGNoID0gXCJ2aWV3V2lsbFN3aXRjaFwiXG5cdFx0RXZlbnRzLlZpZXdEaWRTd2l0Y2ggPSBcInZpZXdEaWRTd2l0Y2hcIlxuXHRcdExheWVyOjpvblZpZXdXaWxsU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBjYilcblx0XHRMYXllcjo6b25WaWV3RGlkU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIGNiKVx0XHRcblxuXHRcdF8uZWFjaCB0cmFuc2l0aW9ucywgKGFuaW1Qcm9wcywgbmFtZSkgPT5cblxuXHRcdFx0aWYgb3B0aW9ucy5hdXRvTGlua1xuXHRcdFx0XHRsYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0XHRcdFx0Zm9yIGJ0biBpbiBsYXllcnNcblx0XHRcdFx0XHRpZiBfLmluY2x1ZGVzIGJ0bi5uYW1lLCBuYW1lXG5cdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlciA9IEBcblx0XHRcdFx0XHRcdGJ0bi5vbkNsaWNrIC0+XG5cdFx0XHRcdFx0XHRcdGFuaW0gPSBAbmFtZS5zcGxpdCgnXycpWzBdXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gQG5hbWUucmVwbGFjZShhbmltKydfJywnJylcblx0XHRcdFx0XHRcdFx0bGlua05hbWUgPSBsaW5rTmFtZS5yZXBsYWNlKC9cXGQrL2csICcnKSAjIHJlbW92ZSBudW1iZXJzXG5cdFx0XHRcdFx0XHRcdHZpZXdDb250cm9sbGVyW2FuaW1dIF8uZmluZChsYXllcnMsIChsKSAtPiBsLm5hbWUgaXMgbGlua05hbWUpXG5cblx0XHRcdEBbbmFtZV0gPSAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSA9PlxuXG5cdFx0XHRcdHJldHVybiBpZiBuZXdWaWV3IGlzIEBjdXJyZW50Vmlld1xuXG5cdFx0XHRcdCMgbWFrZSBzdXJlIHRoZSBuZXcgbGF5ZXIgaXMgaW5zaWRlIHRoZSB2aWV3Y29udHJvbGxlclxuXHRcdFx0XHRuZXdWaWV3LnBhcmVudCA9IEBcblx0XHRcdFx0bmV3Vmlldy5zZW5kVG9CYWNrKClcblxuXHRcdFx0XHQjIHJlc2V0IHByb3BzIGluIGNhc2UgdGhleSB3ZXJlIGNoYW5nZWQgYnkgYSBwcmV2IGFuaW1hdGlvblxuXHRcdFx0XHRuZXdWaWV3LnBvaW50ID0ge3g6MCwgeTogMH1cblx0XHRcdFx0bmV3Vmlldy5vcGFjaXR5ID0gMVxuXHRcdFx0XHRuZXdWaWV3LnNjYWxlID0gMVxuXHRcdFx0XHRuZXdWaWV3LmJyaWdodG5lc3MgPSAxMDBcblxuXHRcdFx0XHQjIG9sZFZpZXdcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wb2ludCA9IHt4OiAwLCB5OiAwfSAjIGZpeGVzIG9mZnNldCBpc3N1ZSB3aGVuIG1vdmluZyB0b28gZmFzdCBiZXR3ZWVuIHNjcmVlbnNcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wcm9wcyA9IGFuaW1Qcm9wcy5vbGRWaWV3Py5mcm9tXG5cdFx0XHRcdG91dGdvaW5nID0gQGN1cnJlbnRWaWV3Py5hbmltYXRlIF8uZXh0ZW5kIGFuaW1hdGlvbk9wdGlvbnMsIHtwcm9wZXJ0aWVzOiBhbmltUHJvcHMub2xkVmlldz8udG99XG5cblx0XHRcdFx0IyBuZXdWaWV3XG5cdFx0XHRcdG5ld1ZpZXcucHJvcHMgPSBhbmltUHJvcHMubmV3Vmlldz8uZnJvbVxuXHRcdFx0XHRpbmNvbWluZyA9IG5ld1ZpZXcuYW5pbWF0ZSBfLmV4dGVuZCBhbmltYXRpb25PcHRpb25zLCB7cHJvcGVydGllczogYW5pbVByb3BzLm5ld1ZpZXc/LnRvfVxuXHRcdFx0XHRcblx0XHRcdFx0IyBsYXllciBvcmRlclxuXHRcdFx0XHRpZiBfLmluY2x1ZGVzIG5hbWUsICdPdXQnXG5cdFx0XHRcdFx0bmV3Vmlldy5wbGFjZUJlaGluZChAY3VycmVudFZpZXcpXG5cdFx0XHRcdFx0b3V0Z29pbmcub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdWaWV3LnBsYWNlQmVmb3JlKEBjdXJyZW50Vmlldylcblx0XHRcdFx0XHRcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBAY3VycmVudFZpZXcsIG5ld1ZpZXcpXG5cdFx0XHRcdFxuXHRcdFx0XHQjIGNoYW5nZSBDdXJyZW50VmlldyBiZWZvcmUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCBzbyBvbmUgY291bGQgZ28gYmFjayBpbiBoaXN0b3J5XG5cdFx0XHRcdCMgd2l0aG91dCBoYXZpbmcgdG8gd2FpdCBmb3IgdGhlIHRyYW5zaXRpb24gdG8gZmluaXNoXG5cdFx0XHRcdEBzYXZlQ3VycmVudFZpZXdUb0hpc3RvcnkgbmFtZSwgb3V0Z29pbmcsIGluY29taW5nXG5cdFx0XHRcdEBjdXJyZW50VmlldyA9IG5ld1ZpZXdcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6cHJldmlvdXNWaWV3XCIsIEBwcmV2aW91c1ZpZXcpXG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOmN1cnJlbnRWaWV3XCIsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cdFx0XHRcdGlmIGluY29taW5nLmlzQW5pbWF0aW5nXG5cdFx0XHRcdFx0aG9vayA9IGluY29taW5nIFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aG9vayA9IG91dGdvaW5nXG5cdFx0XHRcdGhvb2sub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0XHRAZW1pdChFdmVudHMuVmlld0RpZFN3aXRjaCwgQHByZXZpb3VzVmlldywgQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lP1xuXHRcdFx0YXV0b0luaXRpYWwgPSBfLmZpbmQgRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpLCAobCkgLT4gbC5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRpZiBhdXRvSW5pdGlhbD8gdGhlbiBAc3dpdGNoSW5zdGFudCBhdXRvSW5pdGlhbFxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlldz9cblx0XHRcdEBzd2l0Y2hJbnN0YW50IG9wdGlvbnMuaW5pdGlhbFZpZXdcblxuXHRcdGlmIG9wdGlvbnMuYmFja0J1dHRvbk5hbWU/XG5cdFx0XHRiYWNrQnV0dG9ucyA9IF8uZmlsdGVyIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IF8uaW5jbHVkZXMgbC5uYW1lLCBvcHRpb25zLmJhY2tCdXR0b25OYW1lXG5cdFx0XHRmb3IgYnRuIGluIGJhY2tCdXR0b25zXG5cdFx0XHRcdGJ0bi5vbkNsaWNrID0+IEBiYWNrKClcblxuXHRAZGVmaW5lIFwicHJldmlvdXNWaWV3XCIsXG5cdFx0XHRnZXQ6IC0+IEBoaXN0b3J5WzBdLnZpZXdcblxuXHRzYXZlQ3VycmVudFZpZXdUb0hpc3Rvcnk6IChuYW1lLG91dGdvaW5nQW5pbWF0aW9uLGluY29taW5nQW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50Vmlld1xuXHRcdFx0YW5pbWF0aW9uTmFtZTogbmFtZVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb246IGluY29taW5nQW5pbWF0aW9uXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbjogb3V0Z29pbmdBbmltYXRpb25cblxuXHRiYWNrOiAtPlxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRpZiBfLmluY2x1ZGVzIHByZXZpb3VzLmFuaW1hdGlvbk5hbWUsICdPdXQnXG5cdFx0XHRcdHByZXZpb3VzLnZpZXcuYnJpbmdUb0Zyb250KClcblxuXHRcdFx0YmFja0luID0gcHJldmlvdXMub3V0Z29pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cdFx0XHRtb3ZlT3V0ID0gcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cblx0XHRcdGJhY2tJbi5zdGFydCgpXG5cdFx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdFx0QGN1cnJlbnRWaWV3ID0gcHJldmlvdXMudmlld1xuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0bW92ZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudFZpZXcuYnJpbmdUb0Zyb250KClcbiIsImNsYXNzIFRleHRMYXllciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRAZG9BdXRvU2l6ZSA9IGZhbHNlXG5cdFx0QGRvQXV0b1NpemVIZWlnaHQgPSBmYWxzZVxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcImhzbGEoNjAsIDkwJSwgNDclLCAuNClcIiBlbHNlIFwidHJhbnNwYXJlbnRcIlxuXHRcdG9wdGlvbnMuY29sb3IgPz0gXCJyZWRcIlxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAxLjI1XG5cdFx0b3B0aW9ucy5mb250RmFtaWx5ID89IFwiSGVsdmV0aWNhXCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDIwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiVXNlIGxheWVyLnRleHQgdG8gYWRkIHRleHRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAc3R5bGUud2hpdGVTcGFjZSA9IFwicHJlLWxpbmVcIiAjIGFsbG93IFxcbiBpbiAudGV4dFxuXHRcdEBzdHlsZS5vdXRsaW5lID0gXCJub25lXCIgIyBubyBib3JkZXIgd2hlbiBzZWxlY3RlZFxuXHRcdFxuXHRzZXRTdHlsZTogKHByb3BlcnR5LCB2YWx1ZSwgcHhTdWZmaXggPSBmYWxzZSkgLT5cblx0XHRAc3R5bGVbcHJvcGVydHldID0gaWYgcHhTdWZmaXggdGhlbiB2YWx1ZStcInB4XCIgZWxzZSB2YWx1ZVxuXHRcdEBlbWl0KFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsIHZhbHVlKVxuXHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0XHRcblx0Y2FsY1NpemU6IC0+XG5cdFx0c2l6ZUFmZmVjdGluZ1N0eWxlcyA9XG5cdFx0XHRsaW5lSGVpZ2h0OiBAc3R5bGVbXCJsaW5lLWhlaWdodFwiXVxuXHRcdFx0Zm9udFNpemU6IEBzdHlsZVtcImZvbnQtc2l6ZVwiXVxuXHRcdFx0Zm9udFdlaWdodDogQHN0eWxlW1wiZm9udC13ZWlnaHRcIl1cblx0XHRcdHBhZGRpbmdUb3A6IEBzdHlsZVtcInBhZGRpbmctdG9wXCJdXG5cdFx0XHRwYWRkaW5nUmlnaHQ6IEBzdHlsZVtcInBhZGRpbmctcmlnaHRcIl1cblx0XHRcdHBhZGRpbmdCb3R0b206IEBzdHlsZVtcInBhZGRpbmctYm90dG9tXCJdXG5cdFx0XHRwYWRkaW5nTGVmdDogQHN0eWxlW1wicGFkZGluZy1sZWZ0XCJdXG5cdFx0XHR0ZXh0VHJhbnNmb3JtOiBAc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXVxuXHRcdFx0Ym9yZGVyV2lkdGg6IEBzdHlsZVtcImJvcmRlci13aWR0aFwiXVxuXHRcdFx0bGV0dGVyU3BhY2luZzogQHN0eWxlW1wibGV0dGVyLXNwYWNpbmdcIl1cblx0XHRcdGZvbnRGYW1pbHk6IEBzdHlsZVtcImZvbnQtZmFtaWx5XCJdXG5cdFx0XHRmb250U3R5bGU6IEBzdHlsZVtcImZvbnQtc3R5bGVcIl1cblx0XHRcdGZvbnRWYXJpYW50OiBAc3R5bGVbXCJmb250LXZhcmlhbnRcIl1cblx0XHRjb25zdHJhaW50cyA9IHt9XG5cdFx0aWYgQGRvQXV0b1NpemVIZWlnaHQgdGhlbiBjb25zdHJhaW50cy53aWR0aCA9IEB3aWR0aFxuXHRcdHNpemUgPSBVdGlscy50ZXh0U2l6ZSBAdGV4dCwgc2l6ZUFmZmVjdGluZ1N0eWxlcywgY29uc3RyYWludHNcblx0XHRpZiBAc3R5bGUudGV4dEFsaWduIGlzIFwicmlnaHRcIlxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdFx0QHggPSBAeC1Ad2lkdGhcblx0XHRlbHNlXG5cdFx0XHRAd2lkdGggPSBzaXplLndpZHRoXG5cdFx0QGhlaWdodCA9IHNpemUuaGVpZ2h0XG5cblx0QGRlZmluZSBcImF1dG9TaXplXCIsXG5cdFx0Z2V0OiAtPiBAZG9BdXRvU2l6ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImF1dG9TaXplSGVpZ2h0XCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QGRvQXV0b1NpemUgPSB2YWx1ZVxuXHRcdFx0QGRvQXV0b1NpemVIZWlnaHQgPSB2YWx1ZVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiY29udGVudEVkaXRhYmxlXCIsXG5cdFx0c2V0OiAoYm9vbGVhbikgLT5cblx0XHRcdEBfZWxlbWVudC5jb250ZW50RWRpdGFibGUgPSBib29sZWFuXG5cdFx0XHRAaWdub3JlRXZlbnRzID0gIWJvb2xlYW5cblx0XHRcdEBvbiBcImlucHV0XCIsIC0+IEBjYWxjU2l6ZSgpIGlmIEBkb0F1dG9TaXplXG5cdEBkZWZpbmUgXCJ0ZXh0XCIsXG5cdFx0Z2V0OiAtPiBAX2VsZW1lbnQudGV4dENvbnRlbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfZWxlbWVudC50ZXh0Q29udGVudCA9IHZhbHVlXG5cdFx0XHRAZW1pdChcImNoYW5nZTp0ZXh0XCIsIHZhbHVlKVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiZm9udEZhbWlseVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250RmFtaWx5XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRGYW1pbHlcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U2l6ZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U2l6ZS5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250U2l6ZVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcImxpbmVIZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGluZUhlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGluZUhlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRXZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFdlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFdlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRTdHlsZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFN0eWxlXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFZhcmlhbnRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFZhcmlhbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFZhcmlhbnRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nTGVmdFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdUb3BcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1RvcC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1JpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdSaWdodC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nQm90dG9tXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdCb3R0b20ucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0JvdHRvbVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdMZWZ0XCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ0xlZnQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJ0ZXh0QWxpZ25cIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dEFsaWduXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwidGV4dFRyYW5zZm9ybVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS50ZXh0VHJhbnNmb3JtIFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJ0ZXh0VHJhbnNmb3JtXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwibGV0dGVyU3BhY2luZ1wiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5sZXR0ZXJTcGFjaW5nLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxldHRlclNwYWNpbmdcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsZW5ndGhcIiwgXG5cdFx0Z2V0OiAtPiBAdGV4dC5sZW5ndGhcblxuY29udmVydFRvVGV4dExheWVyID0gKGxheWVyKSAtPlxuXHR0ID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IGxheWVyLm5hbWVcblx0XHRmcmFtZTogbGF5ZXIuZnJhbWVcblx0XHRwYXJlbnQ6IGxheWVyLnBhcmVudFxuXHRcblx0Y3NzT2JqID0ge31cblx0Y3NzID0gbGF5ZXIuX2luZm8ubWV0YWRhdGEuY3NzXG5cdGNzcy5mb3JFYWNoIChydWxlKSAtPlxuXHRcdHJldHVybiBpZiBfLmluY2x1ZGVzIHJ1bGUsICcvKidcblx0XHRhcnIgPSBydWxlLnNwbGl0KCc6ICcpXG5cdFx0Y3NzT2JqW2FyclswXV0gPSBhcnJbMV0ucmVwbGFjZSgnOycsJycpXG5cdHQuc3R5bGUgPSBjc3NPYmpcblx0XG5cdGltcG9ydFBhdGggPSBsYXllci5fX2ZyYW1lckltcG9ydGVkRnJvbVBhdGhcblx0aWYgXy5pbmNsdWRlcyBpbXBvcnRQYXRoLCAnQDJ4J1xuXHRcdHQuZm9udFNpemUgKj0gMlxuXHRcdHQubGluZUhlaWdodCA9IChwYXJzZUludCh0LmxpbmVIZWlnaHQpKjIpKydweCdcblx0XHR0LmxldHRlclNwYWNpbmcgKj0gMlxuXHRcdFx0XHRcdFxuXHR0LnkgLT0gKHBhcnNlSW50KHQubGluZUhlaWdodCktdC5mb250U2l6ZSkvMiAjIGNvbXBlbnNhdGUgZm9yIGhvdyBDU1MgaGFuZGxlcyBsaW5lIGhlaWdodFxuXHR0LnkgLT0gdC5mb250U2l6ZSAqIDAuMSAjIHNrZXRjaCBwYWRkaW5nXG5cdHQueCAtPSB0LmZvbnRTaXplICogMC4wOCAjIHNrZXRjaCBwYWRkaW5nXG5cdHQud2lkdGggKz0gdC5mb250U2l6ZSAqIDAuNSAjIHNrZXRjaCBwYWRkaW5nXG5cblx0dC50ZXh0ID0gbGF5ZXIuX2luZm8ubWV0YWRhdGEuc3RyaW5nXG5cdGxheWVyLmRlc3Ryb3koKVxuXHRyZXR1cm4gdFxuXG5MYXllcjo6Y29udmVydFRvVGV4dExheWVyID0gLT4gY29udmVydFRvVGV4dExheWVyKEApXG5cbmNvbnZlcnRUZXh0TGF5ZXJzID0gKG9iaikgLT5cblx0Zm9yIHByb3AsbGF5ZXIgb2Ygb2JqXG5cdFx0aWYgbGF5ZXIuX2luZm8ua2luZCBpcyBcInRleHRcIlxuXHRcdFx0b2JqW3Byb3BdID0gY29udmVydFRvVGV4dExheWVyKGxheWVyKVxuXG4jIEJhY2t3YXJkcyBjb21wYWJpbGl0eS4gUmVwbGFjZWQgYnkgY29udmVydFRvVGV4dExheWVyKClcbkxheWVyOjpmcmFtZUFzVGV4dExheWVyID0gKHByb3BlcnRpZXMpIC0+XG4gICAgdCA9IG5ldyBUZXh0TGF5ZXJcbiAgICB0LmZyYW1lID0gQGZyYW1lXG4gICAgdC5zdXBlckxheWVyID0gQHN1cGVyTGF5ZXJcbiAgICBfLmV4dGVuZCB0LHByb3BlcnRpZXNcbiAgICBAZGVzdHJveSgpXG4gICAgdFxuXG5leHBvcnRzLlRleHRMYXllciA9IFRleHRMYXllclxuZXhwb3J0cy5jb252ZXJ0VGV4dExheWVycyA9IGNvbnZlcnRUZXh0TGF5ZXJzXG4iLCIjIyNcblN0aWNreUhlYWRlcnMgZm9yIEZyYW1lckpTXG5DcmVhdGVkIGJ5IEA3Mm1lbmFcbiMjI1xuY2xhc3MgZXhwb3J0cy5TdGlja3lIZWFkZXJzXG5cblx0QGVuYWJsZUZvcjogKHNDKSAtPlxuXG5cdFx0X3N0aWNreUhlYWRlcnMgPSBbXVxuXHRcdF9kYXRhU0ggPSBbXVxuXG5cdFx0IyBDaGVjayBmb3IgU3RpY2t5SGVhZGVycy5cblx0XHRfc3RpY2t5SGVhZGVycyA9IHNDLmNvbnRlbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5XaXRoTmFtZShcIlN0aWNreUhlYWRlclwiKVxuXG5cdFx0aWYgX3N0aWNreUhlYWRlcnMubGVuZ3RoID4gMFxuXHRcdFx0IyBTYXZlIHRoZWlyIGluaXRpYWwgWSB2YWx1ZS5cblx0XHRcdGZvciBsYXllciwgaSBpbiBfc3RpY2t5SGVhZGVyc1xuXHRcdFx0XHRfZGF0YVNILnB1c2gobGF5ZXIueSlcblxuXHRcdCMgU2Nyb2xsIGxvZ2ljLiBXaXRoIHRoaXMgZml4IGl0IG5vdyBkZXRlY3RzIGFuaW1hdGlvbnMgYW5kIG1vdXNld2hlZWwuXG5cdFx0c0MuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cblx0XHRcdCMgSWYgdGhlcmUgYXJlIFN0aWNreUhlYWRlcnMsIGNhbGN1bGF0ZSB0aGVpciBwbGFjZW1lbnQuXG5cdFx0XHRpZiBfc3RpY2t5SGVhZGVycy5sZW5ndGggPiAwXG5cdFx0XHRcdGZvciBsYXllciwgaSBpbiBfc3RpY2t5SGVhZGVyc1xuXG5cdFx0XHRcdFx0bGF5ZXIueSAgPSAgX2RhdGFTSFtpXVxuXHRcdFx0XHRcdF90aGlzWSAgID0gIF9kYXRhU0hbaV0gLSBzQy5zY3JvbGxZXG5cdFx0XHRcdFx0X2ZpeGVkWSAgPSAgX2RhdGFTSFtpXSArIC1fdGhpc1lcblxuXHRcdFx0XHRcdGlmIGkgaXMgMFxuXHRcdFx0XHRcdFx0aWYgX3RoaXNZIDw9IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXIueSA9IF9maXhlZFlcblxuXHRcdFx0XHRcdGlmIGkgPiAwXG5cdFx0XHRcdFx0XHRfcHJldlN0aWNreVBvc2l0aW9uID0gX2RhdGFTSFtpXSAtIF9zdGlja3lIZWFkZXJzW2ktMV0uaGVpZ2h0XG5cdFx0XHRcdFx0XHRfcHJldk1heFkgPSBfc3RpY2t5SGVhZGVyc1tpLTFdLmhlaWdodFxuXG5cdFx0XHRcdFx0XHQjIFRyYW5zaXRpb25cblx0XHRcdFx0XHRcdGlmIF90aGlzWSA8IF9wcmV2TWF4WVxuXHRcdFx0XHRcdFx0XHRfc3RpY2t5SGVhZGVyc1tpLTFdLnkgPSBfcHJldlN0aWNreVBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdCMgTmV3IFN0aWNreVxuXHRcdFx0XHRcdFx0aWYgX3RoaXNZIDw9IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXIueSA9IF9maXhlZFkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQVNBQTs7QURBQTs7OztBQUlNOzs7QUFFTjtBQUVFO0FBQUY7QUFDQTtBQUdBO0FBRUE7QUFFRzs7QUFDSDtBQURHOztBQUlIO0FBR0c7QUFBSDtBQUNJO0FBQUo7O0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRkE7O0FBSUE7QUFDQTtBQUNBO0FBR0E7QUFDQTs7QUFHQTtBQUNBO0FBREE7QUFBQTtBQVRBO0FBQUE7QUFBQTs7QUFWSTtBQURKOztBQUhBO0FBZEE7Ozs7Ozs7O0FETkE7QUFBQTs7O0FBQU07OztBQUVOOztBQUFBOztBQUNBO0FBQ0E7O0FBQ0E7OztBQUNBOzs7QUFDQTs7O0FBQ0E7OztBQUNBOzs7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFYQTs7QUFhQTs7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFIQTs7QUFLQTtBQUNFO0FBQUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUNBO0FBdkJBOztBQXlCQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUZBO0FBRkE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUhBO0FBREE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBQUE7QUFIQTtBQURBOztBQUtBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFIQTtBQUZBOztBQU1BO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBRkE7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFGQTs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUZBOztBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBRkE7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFGQTs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUZBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBREE7O0FBTUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFGQTs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUZBOztBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBRkE7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFGQTs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQURBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBRkE7O0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFGQTs7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQURBOzs7O0FBOUdBOztBQWlIQTtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNFO0FBQUY7QUFBRTs7QUFDRjtBQUNBO0FBSEE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0M7QUEzQm9COztBQTZCckI7QUFBQTtBQUE0Qjs7QUFFNUI7QUFDQztBQUFBO0FBQUQ7O0FBQ0E7QUFDQTtBQURBO0FBQUE7O0FBREM7O0FBRG1COztBQU1wQjtBQUNJO0FBQUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTjBCOztBQVExQjs7QUFDQTs7OztBRC9KQTs7O0FBQU07OztBQUVOO0FBQ0U7O0FBREY7OztBQUNBOzs7QUFDQTs7O0FBQ0E7OztBQUNBOzs7QUFDQTs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7OztBQUNBOzs7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUNHO0FBQUg7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBS0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7O0FBQ0s7O0FBQ0w7QUFESztBQUVMO0FBRUE7QUFBQTtBQUFBO0FBaEJBO0FBTEE7O0FBRkE7QUFBQTtBQXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQURBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBREE7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQURBO0FBREE7QUFSQTtBQVdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQURBO0FBWkE7QUFjQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBREE7QUFmQTtBQWtCQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBREE7QUFuQkE7QUFzQkE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFEQTtBQURBO0FBdkJBO0FBMEJBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBSEE7QUEzQkE7QUFnQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQURBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFIQTtBQWpDQTtBQXNDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQURBO0FBREE7QUF2Q0E7QUEwQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFEQTtBQUhBO0FBM0NBO0FBZ0RBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQURBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFIQTtBQWpEQTtBQXNEQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFIQTtBQXZEQTtBQTREQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFIQTtBQTdEQTtBQWtFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFuRUE7QUFxRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQURBO0FBdEVBO0FBd0VBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQXpFQTtBQTJFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUE1RUE7O0FBZ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFFRztBQUFIO0FBQ0E7QUFDSTs7QUFDSjtBQUNBO0FBQ0E7QUFDTztBQUFQO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUpBOztBQUhJOztBQVNKO0FBRUk7O0FBRko7O0FBRUE7QUFBSTs7QUFHSjtBQUNBO0FBR0E7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUFBO0FBQUE7Ozs7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFGQTtBQUlBOztBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBREE7QUFHQTs7QUFDQTtBQUNBO0FBREE7QUEzQ0E7QUFiQTtBQUFBO0FBNERBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUZBOztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFDRzs7QUFDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREc7O0FBeE1IOztBQTJNQTtBQUNBO0FBQUE7QUFBQTtBQURBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBREE7O0FBT0E7QUFDRTtBQUFGO0FBQ0E7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZkE7Ozs7QUF2TkE7Ozs7QURDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTtBQW9CQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQTBCQTtBQUNBO0FBQ0E7QUFDQTtBQTdCQTtBQWdDQTtBQUNBO0FBQ0E7QUFDQTtBQW5DQTs7Ozs7QUREQTs7QUFBQTtBQUNFO0FBQUY7QUFDRTtBQUFBOztBQUNGO0FBREU7QUFFQTtBQUpjOztBQU1oQjtBQUVFO0FBQUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0U7QUFUTzs7QUFXVDtBQUNFO0FBQUY7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQURBO0FBREE7QUFJQTtBQUNVO0FBQVY7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFMQTtBQU5BO0FBQUE7QUFhQTs7QUFoQlc7O0FBb0JYO0FBQUE7QUFBa0I7O0FBQ2xCO0FBQUE7QUFBa0I7O0FBRWxCO0FBQUE7QUFBa0I7O0FBQ2xCO0FBQUE7QUFBa0I7O0FBR2xCO0FBQUE7QUFBa0I7O0FBQ2xCO0FBQUE7QUFBa0I7O0FBRWxCO0FBQUE7QUFBa0I7O0FBQ2xCO0FBQUE7QUFBa0I7Ozs7QUQvQmxCOzs7QUFBTTtBQUlMOzs7O0FBQUQ7QUFFRTtBQUFBO0FBQUE7QUFDRjtBQUFRO0FBRE47QUFFRjtBQUZFO0FBSUE7QUFORjs7QUFTQTtBQUNBO0FBQUE7QUFBQTtBQURBOztBQUdBO0FBQ0U7QUFERjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBOztBQUNBO0FBR0E7QUFDQTtBQUNJO0FBQUo7QUFDQTtBQUFBOztBQUZBOztBQUtBO0FBQUE7O0FBQ0E7QUFoQkE7O0FBbUJBO0FBRUU7QUFBRjtBQUdBO0FBQ0E7QUFBQTs7QUFDQTtBQUFBOztBQUVHO0FBQUE7QUFDSDtBQUFTO0FBRE47QUFFSDtBQUZHO0FBSUg7QUFDQTtBQUNBOztBQUdBO0FBQUE7O0FBQ0E7QUFBQTs7QUFDQTtBQUFBOztBQUNBO0FBQUE7O0FBQ0E7QUFBQTs7QUFDQTtBQUFBO0FBbEJBOztBQXFCQTtBQUNBO0FBQUE7O0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFBbUY7QUFEbkY7O0FBR0c7QUFBQTtBQUNIO0FBQUE7O0FBQVM7QUFETjtBQUVIO0FBQUE7O0FBQVM7QUFGTjtBQUdIO0FBQUE7O0FBQVM7QUFITjtBQUlIO0FBQUE7O0FBQVM7QUFKTjtBQU1IO0FBQUE7O0FBQ0E7QUFBQTs7QUFQRztBQVNIO0FBQ0E7QUFBQTtBQURBOztBQWRBO0FBQUE7QUFrQkE7QUFDQTtBQUNBO0FBaERBOztBQXNEQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBR0U7QUFBRjtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7QUFDQTtBQUFBO0FBSEE7O0FBSUE7QUFMQTtBQUFBO0FBT0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOztBQUNBO0FBQUE7QUFIQTs7QUFJQTtBQUxBO0FBQUE7QUFiQTtBQXVCQTtBQUNBO0FBQ0E7QUFBQTs7QUFFQTtBQUFBO0FBQ0E7QUFBQTs7QUFDQTtBQUFBOztBQUZBO0FBQUE7QUFJQTtBQUFBO0FBQ0E7QUFBQTs7QUFDQTtBQUFBOztBQUZBO0FBQUE7O0FBbENBOzs7O0FBakdBOzs7OztBRGpCQTs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7Ozs7OztBQWpCQTs7QUF1QkE7QUFDQTs7OztBQUdBOzs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBRUE7OztBQUdBOzs7OztBQUtBO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBSUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQURBO0FBVUE7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRkE7QUFEQTtBQUFBO0FBS0E7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBREE7QUFFQTtBQUNBOztBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUFBO0FBS0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVDO0FBakdROztBQW1HVDtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBR0E7QUFKQTtBQURBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBR0E7QUFKQTtBQURBO0FBTUM7QUFsQ087O0FBb0NSO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUdBO0FBSkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUdBO0FBSkE7QUFEQTtBQU1DO0FBbkNPOztBQXFDUjtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFHQTtBQUpBO0FBREE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFHQTtBQUpBO0FBREE7QUFNQztBQW5DTzs7O0FBc0NSOzs7Ozs7OztBQVNBO0FBTUM7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFvQkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFPQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFHQTtBQUFpQjtBQUFBO0FBQ2pCO0FBRGlCO0FBRWpCO0FBRmlCO0FBR2pCO0FBSGlCO0FBSWpCO0FBSmlCOztBQU1qQjtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFEQTtBQUlBO0FBQUE7QUFDQTtBQURBO0FBQUE7O0FBR0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQURBO0FBQUE7QUFHQTtBQUFBO0FBQ0E7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBTkE7QUFBQTtBQVFBO0FBQUE7QUFDQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFOQTtBQUFBO0FBUUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUdBO0FBQUE7QUFDRTtBQURGO0FBQUE7QUFHQTtBQUVDO0FBNUdzQjs7QUE4R3ZCO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNDO0FBQUE7O0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBWkM7QUFjRDtBQUFBO0FBQ0U7QUFBRjtBQUNFO0FBQUY7O0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFFQTtBQUFBO0FBQ0s7QUFBQTs7QUFDTDtBQUVBO0FBQUE7QUFBQTs7QUFISztBQUlMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMQTtBQUFBO0FBRkE7QUFIRTs7QUFGRjtBQUFBO0FBY0E7QUFBQTtBQUVFO0FBQUY7QUFDRTtBQUFGOztBQUNBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFBQTtBQUNLO0FBQUw7QUFDQTtBQUNLOztBQUNMO0FBQ0E7QUFBQTs7QUFGSztBQUdMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFOQTtBQUFBO0FBRkE7QUFIRTs7QUFIRjtBQUFBO0FBZ0JBO0FBQ0E7QUFEQTtBQUdBOztBQUVDO0FBbEVtQjs7O0FBc0VwQjs7Ozs7O0FBTUE7QUFDQztBQUFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUNDO0FBZnlCOzs7QUFtQjFCOzs7Ozs7QUFTQTtBQUNDO0FBRFU7O0FBTVg7QUFHQztBQUFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBU0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBU0E7QUFDQTtBQUVDOztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFsQkM7QUFvQkQ7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7O0FBRUE7QUFMQTtBQUFBO0FBV0E7QUFBQTtBQUdFO0FBQUY7QUFHQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBSUE7QUFDQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBREE7QUFuQ0E7QUFBQTtBQXlDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQUE7QUFDQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKQTtBQUFBO0FBTUE7QUFBQTtBQUNFO0FBQUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBSkU7QUFPRjtBQUNBOztBQWRBO0FBQUE7QUFnQkE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBREE7QUFFQTtBQUZBOztBQUlBO0FBQ0E7QUFDQTtBQUFBO0FBREE7QUFFQTtBQUZBOztBQVJBO0FBQUE7QUFjQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIQTtBQUFBO0FBTUE7QUFFQTtBQUFBO0FBQ0U7QUFBRjtBQUNBO0FBQ0E7QUFBQTtBQURBO0FBRUE7QUFDQTtBQUhBO0FBRkE7QUFBQTtBQVFBO0FBQUE7QUFDRTtBQUFGO0FBQ0E7QUFDQTs7QUFIQTtBQUFBO0FBTUM7QUF6TE07OztBQTRMUDs7Ozs7QUFJQTtBQUVDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBSUE7QUFDQTtBQUVBO0FBQUE7QUFDRTtBQUFGO0FBQ0E7O0FBQWM7QUFBQTtBQUFkOztBQUNBO0FBQUE7QUFBQTtBQUFBOztBQURjOzs7QUFFZDtBQUpBO0FBQUE7QUFNQTtBQUFBO0FBQ0U7QUFBRjtBQUNBOztBQUFjO0FBQUE7QUFBZDs7QUFDQTtBQUFBO0FBQUE7O0FBRGM7OztBQUdkO0FBTEE7QUFBQTtBQU9BO0FBQUE7QUFDRTtBQUFGO0FBQ0E7O0FBQWM7QUFBQTtBQUFkOztBQUNBO0FBQUE7QUFBQTs7QUFEYzs7O0FBR2Q7QUFMQTtBQUFBO0FBTUE7QUFDRTtBQUFBOztBQUNGO0FBR0E7QUFDQTtBQUdBO0FBR0E7QUFHQTtBQWRFOztBQWlCRDtBQXhHZ0I7Ozs7QURqckJqQjs7QUFBQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhBO0FBUUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUkE7QUFTQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFUQTtBQVVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVZBO0FBYUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYkE7QUFjQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFkQTtBQWVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWZBO0FBZ0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWhCQTtBQWlCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFqQkE7QUFrQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbEJBO0FBcUJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXJCQTtBQXNCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF0QkE7QUF1QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkJBO0FBd0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXhCQTtBQTJCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEzQkE7QUE0QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNUJBO0FBNkJBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTdCQTtBQThCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE5QkE7QUFtQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbkNBO0FBb0NBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXBDQTtBQXFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFyQ0E7QUF3Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeENBO0FBeUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXpDQTtBQTBDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUExQ0E7QUE2Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBN0NBO0FBOENBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTlDQTtBQStDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEvQ0E7OztBQW1EQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFLQTtBQUdDO0FBQUQ7O0FBRUM7OztBQUdBO0FBQUE7QUFHRDtBQUNBO0FBRk87QUFGTjtBQVFEO0FBQ0E7QUFGTztBQVBOO0FBYUQ7QUFDQTtBQUNBOztBQUhPO0FBWk47QUFtQkQ7QUFDQTtBQUNBOztBQUhPO0FBbEJOO0FBMkJEO0FBQ0E7O0FBR0E7QUFDQTs7QUFDQTtBQVRPO0FBeEJOO0FBcUNEO0FBQ0E7QUFDQTs7QUF2Q0M7QUF5Q0Q7QUFFQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBOztBQVVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7O0FBeEZvQjs7QUEyRnBCO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUxpQjs7QUFPakI7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBSUE7QUFDQTtBQUNBO0FBRlc7O0FBT1g7QUFDQztBQUFEO0FBQ0E7QUFDQztBQUhZOztBQU1iO0FBQ0M7QUFBRDtBQUNBO0FBQ0M7QUFIWTs7QUFNYjtBQUVBO0FBQ0M7QUFIZTs7QUFNaEI7QUFFQztBQUFEO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUVDO0FBQ0Q7QUFDQTtBQUNBOztBQTdCYzs7QUFpQ2Q7QUFDQztBQUFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5xQjs7QUFRckI7QUFDQztBQURvQjs7QUFJckI7QUFDQztBQUFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQWhCa0I7O0FBb0JsQjtBQUNDO0FBQUQ7QUFDQTtBQUNBOztBQUNDO0FBQUE7QUFFRDtBQURPO0FBRE47QUFJRDtBQURPO0FBSE47QUFNRDtBQURPO0FBTE47QUFRRDtBQURPO0FBUE47QUFVRDtBQURPO0FBVE47QUFZRDtBQURPO0FBWE47QUFjRDtBQURPO0FBYk47QUFnQkQ7QUFETztBQWZOO0FBa0JEO0FBRE87QUFqQk47QUFvQkQ7QUFETztBQW5CTjtBQXNCRDtBQURPO0FBckJOO0FBd0JEO0FBRE87QUF2Qk47QUEwQkQ7QUFETztBQXpCTjtBQTRCRDtBQURPO0FBM0JOO0FBOEJEO0FBQ0E7QUFEQTtBQUdBOztBQWpDQztBQWtDQTtBQXRDZTs7QUF5Q2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWkE7QUFjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuQkE7QUFxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVCQTtBQThCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTFDQTtBQTRDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFqQkE7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQWxEQTtBQTRFQTtBQUNBO0FBQ0E7QUFDQTtBQS9FQTtBQWlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFyQkE7QUFzQkE7QUF2R0E7QUEwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBL0dBO0FBaUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFySEE7QUF1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNIQTtBQTZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5JQTtBQXFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUlBO0FBOElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFySkE7QUF1SkE7QUFDQTtBQUNBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUExS0E7QUE0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQ0E7QUFQQTtBQUhBO0FBY0E7QUFDQTtBQTNMQTtBQTZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcE1BO0FBdU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNU5BOzs7QUFrT0E7QUFDQztBQUFEO0FBQ0E7QUFGVzs7QUFJWDs7QUFFQTs7QUFDQTtBQURBOztBQUdBO0FBQ0M7QUFBRDtBQUNBOztBQUNBO0FBQ0M7QUFBQTs7QUFDRDtBQUNBO0FBREE7QUFHQTs7QUFKQztBQUtBO0FBVGdCOztBQVlqQjtBQUVBO0FBQ0E7O0FBR0E7QUFDQTs7QUFDQTtBQUNBOztBQUdBO0FBQ0E7O0FBR0E7QUFDQTs7QUFqQlE7O0FBb0JSO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBOztBQUNBO0FBckNjOztBQXdDZDtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBQ0M7QUFkc0I7O0FBZ0J2QjtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0U7QUFERjtBQUdFOztBQU5tQjs7QUE0RXJCO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDRTtBQUFBOztBQUNGO0FBQ0E7QUFEQTtBQUdBOztBQUpFOztBQU1GO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFKQTtBQUFBO0FBTUE7O0FBRUE7QUFDQTtBQUNHO0FBQUE7O0FBQ0g7QUFERztBQUZIOztBQU1DO0FBQUQ7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUdBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7QUFEQTtBQUdBOztBQUdBO0FBRUE7QUFDQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBREE7O0FBR0E7QUFDQTtBQURBO0FBSUE7QUFaQTtBQUZBOztBQWlCQTtBQUNBOztBQUVBO0FBRUE7QUFDQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBREE7O0FBR0E7QUFDQTtBQURBO0FBSUE7QUFaQTtBQUZBOztBQWlCQTtBQUNBO0FBR0E7QUFDQTs7QUFFQTtBQUVBO0FBQ0E7QUFEQTtBQUlBO0FBQ0E7QUFEQTtBQUlBO0FBUkE7QUFGQTs7QUFhQTtBQUNBOztBQUdBO0FBRUE7QUFDQTtBQURBO0FBS0E7QUFDQTtBQUNBO0FBREE7O0FBR0E7QUFDQTtBQURBO0FBSUE7QUFiQTtBQUZBOztBQWtCQTtBQUNBO0FBRUE7QUFDQTs7QUFJQTtBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFWQTs7QUFjQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFHQTtBQUNBO0FBSkE7O0FBTUE7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQXBMQTtBQUFBOztBQURDOztBQXhCdUI7O0FBZ054QjtBQUNDO0FBQUQ7QUFDQTtBQURBO0FBR0E7O0FBQ0M7QUFBQTtBQUFEOztBQUNBO0FBQ0c7QUFBQTs7QUFDSDtBQURHO0FBRUE7QUFBQTs7QUFDSDtBQUNBOztBQUZHO0FBR0E7QUFBQTs7QUFDSDtBQUNBOztBQUZHO0FBS0g7QUFDQTtBQURBO0FBQUE7QUFYQTtBQUFBO0FBQUE7O0FBREM7O0FBTGdCOztBQXFCakI7QUFDQztBQUFEO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQUNBO0FBQ0U7O0FBQ0Y7QUFDQTs7QUFDQTtBQUNBOztBQUpFO0FBS0Y7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBekJBOztBQTBCQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFSQTs7QUF0RGM7O0FBbUVkO0FBQ0M7QUFBRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTs7QUFEYTs7QUFTYjtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7O0FBRUE7QUFFQTtBQUZBO0FBS0E7O0FBQ0E7QUFFQTtBQUNBO0FBREE7QUFHQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFKQTs7QUFLQTtBQUNLO0FBQUE7O0FBQ0w7QUFDQTtBQURBO0FBR0E7O0FBSks7QUFLTDtBQWhCQTs7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFBQTtBQUtBO0FBQ0E7QUFDTTtBQUFBOztBQUVOO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7O0FBTk07QUFPTjtBQWpCQTtBQUZBO0FBbkJBO0FBQUE7QUEwQ0E7QUFDQTtBQUVBO0FBRUE7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQURBO0FBR0E7QUFMQTs7QUFNQTtBQUVBO0FBRUE7QUFGQTtBQUtBO0FBQ0E7QUFEQTtBQUdBO0FBUkE7QUFGQTs7QUFXQTtBQUVNO0FBQUE7QUFBTjs7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFDQTtBQUxNO0FBRk47QUFyQkE7QUFGQTtBQTNDQTtBQWZBOztBQURlOztBQTJGZjs7QUFFQTtBQUNBO0FBQ0M7QUFGZ0I7O0FBSWpCO0FBRUM7QUFBRDtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBSkE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQztBQUNEO0FBQ0E7O0FBbEJlOztBQXFCZjtBQUVDO0FBQUQ7QUFDRTtBQUFGO0FBQ0U7QUFBQTtBQUVGO0FBQ0E7QUFIRTtBQUtGO0FBQ0E7QUFDQTtBQVBFO0FBU0Y7QUFURTtBQVdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRkE7O0FBcEJFO0FBRkY7QUEwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDRTtBQUFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUhBO0FBSUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNLO0FBQUE7O0FBQ0w7QUFESztBQUpMOztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBSEE7O0FBSUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTs7QUFJQTtBQTdDQTs7QUFEQTtBQWdEQTtBQUNFO0FBQUY7QUFDQTtBQUNBOztBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRkE7QUFHQTs7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNLO0FBQUE7O0FBQ0w7QUFESztBQUVMO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBUkE7O0FBU0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUxBO0FBckJBOztBQURBO0FBZ0NBO0FBQ0U7QUFBRjtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7O0FBTUE7QUFDQTtBQUNBO0FBRkE7O0FBSUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQWZBO0FBVEE7O0FBREE7QUFsTmU7O0FBNk9mO0FBQ0M7QUFBRDtBQUNBOztBQUNBO0FBQ0U7O0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQVJFO0FBVUY7QUFDQTtBQUNBOztBQUdBO0FBbkJpQjs7QUFxQmpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFIQTtBQUZ1Qjs7QUFTdkI7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFBQTtBQUhBOztBQUlBO0FBQ0E7O0FBQ0M7QUFQdUI7O0FBVXhCO0FBQ0M7QUFBRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUdBO0FBRUE7QUFDQztBQUFBO0FBRUQ7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBWk87QUFETjtBQWVEO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQWhDTztBQWROO0FBZ0RFO0FBQUE7O0FBQ0g7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFuQkc7QUFoREY7QUFxRUQ7QUFDQzs7QUFHRDtBQUNBO0FBRUE7QUFDQTtBQURBO0FBR0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUxBO0FBU0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRkE7QUFHQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRkE7QUFKQTtBQVNBO0FBOUJDO0FBaUNEO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQztBQXhKZTs7QUEwSmhCO0FBQ0M7QUFBRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdDO0FBQUE7QUFFRDtBQUNBO0FBQ0E7QUFITztBQUROO0FBTUQ7QUFDQTtBQUNBO0FBSE87QUFMTjtBQVVEO0FBQ0E7QUFDQTtBQVpDO0FBY0Q7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUVBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBOztBQUtBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUhBO0FBSUE7QUFDQTtBQURBOztBQU5BO0FBV0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFIQTs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQUtBO0FBQ0E7QUFEQTs7QUFJQTtBQUNBO0FBQ0E7QUFDQztBQTVHZ0I7O0FBOEdqQjtBQUNDO0FBQUQ7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBQ0M7QUFBQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNHO0FBQUE7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBTlM7QUFETjtBQVVIO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFOUztBQVROO0FBaUJIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7O0FBM0JHO0FBOEJIO0FBRUE7QUFDSTtBQUFKO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBTkE7QUFTQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQURBO0FBdkRPO0FBRE47QUE4REQ7QUFDQTtBQUNBO0FBQ0c7QUFBQTtBQUVIO0FBQ0E7QUFGUztBQUROO0FBS0g7QUFDQTtBQU5HO0FBT0g7QUFDQTtBQVpPO0FBN0ROO0FBNkVEO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDSTtBQUFKO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQURBO0FBdkZDO0FBMkZEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFDQztBQUFBO0FBRUQ7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUpBO0FBVE87QUFETjtBQWtCRDtBQUFBO0FBQUE7O0FBbEJDO0FBbUJEO0FBQ0E7QUFDQztBQTlIZ0I7O0FBZ0lqQjtBQUNDO0FBQUQ7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUNBOztBQU1BO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBSEE7O0FBSUE7QUFDQTs7QUFOQTtBQVFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDRTtBQUFGO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFBQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFiQTs7QUFlQTtBQUlBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUhBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQVJBO0FBWUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBSEE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTEE7O0FBWUE7QUFDQTtBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQURBO0FBS0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBTkE7QUFBQTtBQVVBOztBQVhBOztBQVlBO0FBdkVBO0FBeUVBO0FBQ0M7QUE3R2U7O0FBK0doQjtBQUNDO0FBQUQ7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0M7QUFBQTtBQUVEO0FBQ0E7QUFDQTtBQUhPO0FBRE47QUFNRDtBQUNBO0FBRk87QUFMTjtBQVNEO0FBQ0E7QUFDQTtBQVhDO0FBWUQ7QUFDQTtBQURBO0FBR0E7O0FBQ0M7QUFBQTs7QUFDRDtBQUNBOztBQUZDO0FBR0Q7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQWhCQTtBQUFBO0FBa0JBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUpBO0FBQUE7QUFNQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUE3QkE7O0FBOEJBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFBQTtBQU1FO0FBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBUEE7O0FBUUE7QUFDQTtBQVhFO0FBWUY7QUFDQTtBQUNHO0FBQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFQRzs7QUFRSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUpBOztBQUtBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQWhCQTtBQXRDQTs7QUF1REE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQVlBO0FBQ0E7O0FBWUE7QUFDQTs7QUFhQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7O0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUE3TG1COztBQStMcEI7QUFDQztBQUFEO0FBR0E7QUFHQztBQUFBO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBakNPO0FBRE47QUFxQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBbENPO0FBcENOO0FBeUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFqQ087QUF4RU47QUEyR0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7O0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUExSUM7QUE0SUQ7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUdBO0FBQUE7QUFBQTtBQUFBOztBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFPQTs7QUFHQTtBQUVBO0FBQ0E7QUFFQztBQUFBO0FBRUQ7QUFDQTtBQUZPO0FBRE47QUFLRDtBQUNBO0FBTkM7QUFPRDtBQUNBO0FBQ0E7O0FBR0E7QUFHQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFqQkE7O0FBcUJBO0FBQ0E7QUFFQTtBQUNDOztBQUNEO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQURBOztBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHRztBQUFBO0FBQ0g7QUFBUztBQUROO0FBRUg7QUFGRztBQUdIOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7O0FBTUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBMEJBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQURBO0FBYkE7QUFrQkE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQURBOztBQUdBO0FBQ0c7QUFBSDtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUk7O0FBQ0o7QUFESTtBQUVKO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFkQTtBQUFBO0FBZ0JBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbEJBOztBQURBO0FBeklDO0FBOEpEO0FBRUE7QUFJQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFNQTtBQUNFO0FBQUE7QUFBQTtBQUVGO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDSzs7QUFDTDtBQURLO0FBRUw7QUFOQTtBQVFBO0FBQ0E7QUFDQTs7QUFDSzs7QUFDTDtBQURLO0FBRUw7O0FBakJRO0FBRE47QUFvQkU7O0FBQ0o7QUFDQTtBQUZJO0FBR0o7QUFDQTtBQUNBO0FBQ0E7O0FBUFE7QUFuQk47QUE0QkU7O0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQUE7QUFNQTs7QUFQSTtBQVFKO0FBQ0E7QUFDQTs7QUFDQTtBQXZDRTtBQURGO0FBMENBO0FBQ0E7QUFJQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0E7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDRTtBQUFGO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBVEE7O0FBSkE7QUFpQkE7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFLQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBR0E7QUFDQTs7QUFFQTtBQUNHO0FBQUE7QUFBQTtBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTTs7QUFDTjtBQURNO0FBRU47QUFMQTtBQU9BO0FBQ0E7QUFDTTs7QUFDTjtBQURNO0FBRU47O0FBZFM7QUFETjtBQWlCRTs7QUFDTDtBQUNBO0FBRks7QUFHTDtBQUNBO0FBQ0E7QUFDQTs7QUFQUztBQWhCTjtBQXlCRTs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFBQTtBQU1BOztBQVBLO0FBUUw7QUFDQTtBQUNBOztBQUNBO0FBcENHO0FBREg7QUF3Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQUE7QUFBQTs7QUFFQTtBQUNHO0FBQUE7QUFBQTtBQUdFOztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBQUE7QUFZQTs7QUFiSztBQWdCTDtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQTNCRztBQTZCRTs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQVRLO0FBVUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUE5Q0c7QUFESDs7QUFvREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDRTtBQUFBO0FBQUE7QUFHRTtBQUFBO0FBRUU7O0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFBQTtBQVlBOztBQWJNO0FBY047QUFDQTtBQUNBO0FBQ0E7QUFsQlU7QUFETjtBQXFCSjtBQUNBO0FBQ007O0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUFBOztBQUNBOztBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUFBOztBQUNBOztBQUNBO0FBQ0E7O0FBbkJNO0FBb0JOO0FBM0NJO0FBK0NKO0FBQ0E7QUFDQTtBQXBERTtBQXVERjtBQUNBO0FBQ0E7QUFDSzs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQWJLOztBQWVEOztBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBVEk7QUFVSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQTFGRTtBQURGO0FBOEZBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBTUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFEQTtBQUFBO0FBR0E7QUFBQTtBQUFBO0FBSEE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQUE7QUFZQTtBQUFBO0FBQUE7QUFBQTtBQVpBOztBQWFBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFKQTtBQVNBO0FBQ0U7QUFBRjtBQUNBO0FBQ0E7QUFDRzs7QUFDSDtBQURHO0FBRkg7QUFLQTtBQUNBO0FBQ0c7O0FBQ0g7QUFERzs7QUFFRDtBQVhGO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNDOztBQUNEO0FBREM7QUFJRDtBQUNDOztBQUNEO0FBREM7QUFzTkE7QUF0aUNrQjs7QUF3aUNuQjtBQUNDO0FBQUQ7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJBOztBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0M7QUFBQTs7QUFDRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUpBOztBQUtBO0FBQ0E7QUFDRztBQUFIO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFEQTtBQVZBO0FBWUE7QUFqQ0M7QUFtQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBOztBQUlBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBR0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUZBO0FBR0E7QUFDQTtBQURBO0FBUEE7QUFVQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTtBQUdBO0FBQ0E7QUFEQTtBQVBBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQXZIZTs7QUF5SGhCO0FBQ0M7QUFBRDtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0M7QUFBQTs7QUFDRDtBQUNBO0FBQ0E7O0FBSEM7QUFLRDtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFGQTs7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBRkE7O0FBRkE7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7O0FBV0E7QUFDQztBQTdGZ0I7O0FBK0ZqQjtBQUNDO0FBQUQ7QUFDQztBQUFBO0FBRUQ7QUFETztBQUROO0FBSUQ7QUFKQztBQUtEO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVDO0FBckNhOztBQXVDZDtBQUNDO0FBQUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0M7QUFBQTtBQUVEO0FBRE87QUFETjtBQUlEO0FBSkM7QUFLRDtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUNFO0FBQUE7QUFBQTtBQUFGOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7O0FBUkU7O0FBREY7QUFXQztBQUFBOztBQUVEO0FBQ0E7O0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUNBOztBQUVBO0FBQ0c7QUFBSDtBQUNBO0FBRkE7QUFuQkM7QUFzQkQ7QUFDQTs7QUFFQTtBQUVBO0FBQ0M7QUE3RWdCOztBQStFakI7QUFDQztBQUFEO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQztBQUFBOztBQUNEO0FBQ0E7QUFDQTs7QUFDQTs7QUFKQztBQUtBO0FBQUE7O0FBQ0Q7QUFDQTtBQUNBOztBQUNBO0FBQ0k7QUFBQTtBQUNKO0FBQVU7QUFETjtBQUVKO0FBQVU7QUFGTjtBQUdKO0FBQVU7QUFITjtBQUlKO0FBQVU7QUFKTjtBQUtKO0FBQVU7QUFMTjtBQU1KO0FBQVU7QUFOTjtBQU9KO0FBQVU7QUFQTjtBQVFKO0FBUkk7O0FBU0o7QUFDQTs7QUFDQTs7QUFoQkM7QUFpQkQ7QUFDQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUNDO0FBaENjOztBQWtDZjtBQUNBO0FBZ0NBO0FBdUJBO0FBWUE7QUFjQTtBQUNBO0FBY0E7QUFqR0E7QUFnSEE7QUFxQkE7QUFpQkE7QUFpQkE7QUFnQkE7QUFrQkE7QUFDQTtBQWNBO0FBeE5BO0FBdU9BO0FBbUJBO0FBMkJBOzs7QUE4QkE7QUFDQTtBQVlBO0FBZ0JBO0FBZ0JBO0FBWUE7Ozs7O0FEbnpIQTs7QUFFQTtBQUNBO0FBRHFCOztBQUdyQjs7OyJ9
