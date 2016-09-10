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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9DcnVpc2VEZXRhaWxSZU9yZy5mcmFtZXIvbW9kdWxlcy9TdGlja3lIZWFkZXJzLmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvR2l0SHViL1Byb2plY3RPbmVGcmFtZXJQcm90b3R5cGVzL0NydWlzZURldGFpbFJlT3JnLmZyYW1lci9tb2R1bGVzL1RleHRMYXllci5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9DcnVpc2VEZXRhaWxSZU9yZy5mcmFtZXIvbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9DcnVpc2VEZXRhaWxSZU9yZy5mcmFtZXIvbW9kdWxlcy9jb250ZW50TW9kZWwuY29mZmVlIiwiL1VzZXJzLzQwMTEyNS9HaXRIdWIvUHJvamVjdE9uZUZyYW1lclByb3RvdHlwZXMvQ3J1aXNlRGV0YWlsUmVPcmcuZnJhbWVyL21vZHVsZXMvZmluZE1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9DcnVpc2VEZXRhaWxSZU9yZy5mcmFtZXIvbW9kdWxlcy9maXJlYmFzZS5jb2ZmZWUiLCIvVXNlcnMvNDAxMTI1L0dpdEh1Yi9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9DcnVpc2VEZXRhaWxSZU9yZy5mcmFtZXIvbW9kdWxlcy9mcmFtZXJLaXQuY29mZmVlIiwiL1VzZXJzLzQwMTEyNS9HaXRIdWIvUHJvamVjdE9uZUZyYW1lclByb3RvdHlwZXMvQ3J1aXNlRGV0YWlsUmVPcmcuZnJhbWVyL21vZHVsZXMvaU9TS2l0LmNvZmZlZSIsIi9Vc2Vycy80MDExMjUvR2l0SHViL1Byb2plY3RPbmVGcmFtZXJQcm90b3R5cGVzL0NydWlzZURldGFpbFJlT3JnLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTs7OztBQUlNLE9BQU8sQ0FBQzs7O0VBRWIsYUFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLEVBQUQ7QUFFWCxRQUFBO0lBQUEsY0FBQSxHQUFpQjtJQUNqQixPQUFBLEdBQVU7SUFHVixjQUFBLEdBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUF2QixDQUF3QyxjQUF4QztJQUVqQixJQUFHLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQTNCO0FBRUMsV0FBQSx3REFBQTs7UUFDQyxPQUFPLENBQUMsSUFBUixDQUFhLEtBQUssQ0FBQyxDQUFuQjtBQURELE9BRkQ7O1dBTUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFYLENBQWMsVUFBZCxFQUEwQixTQUFBO0FBR3pCLFVBQUE7TUFBQSxJQUFHLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQTNCO0FBQ0M7YUFBQSwwREFBQTs7VUFFQyxLQUFLLENBQUMsQ0FBTixHQUFZLE9BQVEsQ0FBQSxDQUFBO1VBQ3BCLE1BQUEsR0FBWSxPQUFRLENBQUEsQ0FBQSxDQUFSLEdBQWEsRUFBRSxDQUFDO1VBQzVCLE9BQUEsR0FBWSxPQUFRLENBQUEsQ0FBQSxDQUFSLEdBQWEsQ0FBQztVQUUxQixJQUFHLENBQUEsS0FBSyxDQUFSO1lBQ0MsSUFBRyxNQUFBLElBQVUsQ0FBYjtjQUNDLEtBQUssQ0FBQyxDQUFOLEdBQVUsUUFEWDthQUREOztVQUlBLElBQUcsQ0FBQSxHQUFJLENBQVA7WUFDQyxtQkFBQSxHQUFzQixPQUFRLENBQUEsQ0FBQSxDQUFSLEdBQWEsY0FBZSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQUksQ0FBQztZQUN2RCxTQUFBLEdBQVksY0FBZSxDQUFBLENBQUEsR0FBRSxDQUFGLENBQUksQ0FBQztZQUdoQyxJQUFHLE1BQUEs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QUFDLEVBQVIsQ0FBVyxFQUFYLENBQUQsQ0FEcEMsR0FDb0Qsd2hEQWhCbkQ7R0F6TUs7RUF1T2IsT0FBQSxFQUFTLHFFQUFBLEdBQ00sQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEVBQVgsQ0FBRCxDQUROLEdBQ3NCLGNBRHRCLEdBQ21DLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxFQUFYLENBQUQsQ0FEbkMsR0FDbUQsZzlEQXhPL0M7RUEwUGIsT0FBQSxFQUFTLHFFQUFBLEdBQ00sQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEVBQVgsQ0FBRCxDQUROLEdBQ3NCLGNBRHRCLEdBQ21DLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxFQUFYLENBQUQsQ0FEbkMsR0FDbUQseTNEQTNQL0M7RUFxUmIsTUFBQSxFQUFRLHFFQUFBLEdBQ08sQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLEVBQVgsQ0FBRCxDQURQLEdBQ3VCLGNBRHZCLEdBQ29DLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxFQUFYLENBQUQsQ0FEcEMsR0FDb0QsazlFQXRSL0M7OztBQW1UZCxRQUFBLEdBQVc7RUFDVixVQUFBLEVBQVksb3pCQURGO0VBYVYsV0FBQSxFQUFhLG8rQkFiSDtFQTZCVixnQkFBQSxFQUFtQiw0K0JBN0JUO0VBNkNWLE1BQUEsRUFBUywrekJBN0NDO0VBeURWLFVBQUEsRUFBYSwrMEJBekRIOzs7OztBQzF2SFgsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7O0FBRWhCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUE7U0FDcEIsS0FBQSxDQUFNLHVCQUFOO0FBRG9COztBQUdyQixPQUFPLENBQUMsT0FBUixHQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIyNcblN0aWNreUhlYWRlcnMgZm9yIEZyYW1lckpTXG5DcmVhdGVkIGJ5IEA3Mm1lbmFcbiMjI1xuY2xhc3MgZXhwb3J0cy5TdGlja3lIZWFkZXJzXG5cblx0QGVuYWJsZUZvcjogKHNDKSAtPlxuXG5cdFx0X3N0aWNreUhlYWRlcnMgPSBbXVxuXHRcdF9kYXRhU0ggPSBbXVxuXG5cdFx0IyBDaGVjayBmb3IgU3RpY2t5SGVhZGVycy5cblx0XHRfc3RpY2t5SGVhZGVycyA9IHNDLmNvbnRlbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5XaXRoTmFtZShcIlN0aWNreUhlYWRlclwiKVxuXG5cdFx0aWYgX3N0aWNreUhlYWRlcnMubGVuZ3RoID4gMFxuXHRcdFx0IyBTYXZlIHRoZWlyIGluaXRpYWwgWSB2YWx1ZS5cblx0XHRcdGZvciBsYXllciwgaSBpbiBfc3RpY2t5SGVhZGVyc1xuXHRcdFx0XHRfZGF0YVNILnB1c2gobGF5ZXIueSlcblxuXHRcdCMgU2Nyb2xsIGxvZ2ljLiBXaXRoIHRoaXMgZml4IGl0IG5vdyBkZXRlY3RzIGFuaW1hdGlvbnMgYW5kIG1vdXNld2hlZWwuXG5cdFx0c0MuY29udGVudC5vbiBcImNoYW5nZTp5XCIsIC0+XG5cblx0XHRcdCMgSWYgdGhlcmUgYXJlIFN0aWNreUhlYWRlcnMsIGNhbGN1bGF0ZSB0aGVpciBwbGFjZW1lbnQuXG5cdFx0XHRpZiBfc3RpY2t5SGVhZGVycy5sZW5ndGggPiAwXG5cdFx0XHRcdGZvciBsYXllciwgaSBpbiBfc3RpY2t5SGVhZGVyc1xuXG5cdFx0XHRcdFx0bGF5ZXIueSAgPSAgX2RhdGFTSFtpXVxuXHRcdFx0XHRcdF90aGlzWSAgID0gIF9kYXRhU0hbaV0gLSBzQy5zY3JvbGxZXG5cdFx0XHRcdFx0X2ZpeGVkWSAgPSAgX2RhdGFTSFtpXSArIC1fdGhpc1lcblxuXHRcdFx0XHRcdGlmIGkgaXMgMFxuXHRcdFx0XHRcdFx0aWYgX3RoaXNZIDw9IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXIueSA9IF9maXhlZFlcblxuXHRcdFx0XHRcdGlmIGkgPiAwXG5cdFx0XHRcdFx0XHRfcHJldlN0aWNreVBvc2l0aW9uID0gX2RhdGFTSFtpXSAtIF9zdGlja3lIZWFkZXJzW2ktMV0uaGVpZ2h0XG5cdFx0XHRcdFx0XHRfcHJldk1heFkgPSBfc3RpY2t5SGVhZGVyc1tpLTFdLmhlaWdodFxuXG5cdFx0XHRcdFx0XHQjIFRyYW5zaXRpb25cblx0XHRcdFx0XHRcdGlmIF90aGlzWSA8IF9wcmV2TWF4WVxuXHRcdFx0XHRcdFx0XHRfc3RpY2t5SGVhZGVyc1tpLTFdLnkgPSBfcHJldlN0aWNreVBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdCMgTmV3IFN0aWNreVxuXHRcdFx0XHRcdFx0aWYgX3RoaXNZIDw9IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXIueSA9IF9maXhlZFkiLCJjbGFzcyBUZXh0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0QGRvQXV0b1NpemUgPSBmYWxzZVxuXHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gZmFsc2Vcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBpZiBvcHRpb25zLnNldHVwIHRoZW4gXCJoc2xhKDYwLCA5MCUsIDQ3JSwgLjQpXCIgZWxzZSBcInRyYW5zcGFyZW50XCJcblx0XHRvcHRpb25zLmNvbG9yID89IFwicmVkXCJcblx0XHRvcHRpb25zLmxpbmVIZWlnaHQgPz0gMS4yNVxuXHRcdG9wdGlvbnMuZm9udEZhbWlseSA/PSBcIkhlbHZldGljYVwiXG5cdFx0b3B0aW9ucy5mb250U2l6ZSA/PSAyMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlVzZSBsYXllci50ZXh0IHRvIGFkZCB0ZXh0XCJcblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QHN0eWxlLndoaXRlU3BhY2UgPSBcInByZS1saW5lXCIgIyBhbGxvdyBcXG4gaW4gLnRleHRcblx0XHRAc3R5bGUub3V0bGluZSA9IFwibm9uZVwiICMgbm8gYm9yZGVyIHdoZW4gc2VsZWN0ZWRcblx0XHRcblx0c2V0U3R5bGU6IChwcm9wZXJ0eSwgdmFsdWUsIHB4U3VmZml4ID0gZmFsc2UpIC0+XG5cdFx0QHN0eWxlW3Byb3BlcnR5XSA9IGlmIHB4U3VmZml4IHRoZW4gdmFsdWUrXCJweFwiIGVsc2UgdmFsdWVcblx0XHRAZW1pdChcImNoYW5nZToje3Byb3BlcnR5fVwiLCB2YWx1ZSlcblx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdFx0XG5cdGNhbGNTaXplOiAtPlxuXHRcdHNpemVBZmZlY3RpbmdTdHlsZXMgPVxuXHRcdFx0bGluZUhlaWdodDogQHN0eWxlW1wibGluZS1oZWlnaHRcIl1cblx0XHRcdGZvbnRTaXplOiBAc3R5bGVbXCJmb250LXNpemVcIl1cblx0XHRcdGZvbnRXZWlnaHQ6IEBzdHlsZVtcImZvbnQtd2VpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nVG9wOiBAc3R5bGVbXCJwYWRkaW5nLXRvcFwiXVxuXHRcdFx0cGFkZGluZ1JpZ2h0OiBAc3R5bGVbXCJwYWRkaW5nLXJpZ2h0XCJdXG5cdFx0XHRwYWRkaW5nQm90dG9tOiBAc3R5bGVbXCJwYWRkaW5nLWJvdHRvbVwiXVxuXHRcdFx0cGFkZGluZ0xlZnQ6IEBzdHlsZVtcInBhZGRpbmctbGVmdFwiXVxuXHRcdFx0dGV4dFRyYW5zZm9ybTogQHN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl1cblx0XHRcdGJvcmRlcldpZHRoOiBAc3R5bGVbXCJib3JkZXItd2lkdGhcIl1cblx0XHRcdGxldHRlclNwYWNpbmc6IEBzdHlsZVtcImxldHRlci1zcGFjaW5nXCJdXG5cdFx0XHRmb250RmFtaWx5OiBAc3R5bGVbXCJmb250LWZhbWlseVwiXVxuXHRcdFx0Zm9udFN0eWxlOiBAc3R5bGVbXCJmb250LXN0eWxlXCJdXG5cdFx0XHRmb250VmFyaWFudDogQHN0eWxlW1wiZm9udC12YXJpYW50XCJdXG5cdFx0Y29uc3RyYWludHMgPSB7fVxuXHRcdGlmIEBkb0F1dG9TaXplSGVpZ2h0IHRoZW4gY29uc3RyYWludHMud2lkdGggPSBAd2lkdGhcblx0XHRzaXplID0gVXRpbHMudGV4dFNpemUgQHRleHQsIHNpemVBZmZlY3RpbmdTdHlsZXMsIGNvbnN0cmFpbnRzXG5cdFx0aWYgQHN0eWxlLnRleHRBbGlnbiBpcyBcInJpZ2h0XCJcblx0XHRcdEB3aWR0aCA9IHNpemUud2lkdGhcblx0XHRcdEB4ID0gQHgtQHdpZHRoXG5cdFx0ZWxzZVxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdEBoZWlnaHQgPSBzaXplLmhlaWdodFxuXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZVwiLFxuXHRcdGdldDogLT4gQGRvQXV0b1NpemVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gXG5cdFx0XHRAZG9BdXRvU2l6ZSA9IHZhbHVlXG5cdFx0XHRpZiBAZG9BdXRvU2l6ZSB0aGVuIEBjYWxjU2l6ZSgpXG5cdEBkZWZpbmUgXCJhdXRvU2l6ZUhlaWdodFwiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdEBkb0F1dG9TaXplSGVpZ2h0ID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImNvbnRlbnRFZGl0YWJsZVwiLFxuXHRcdHNldDogKGJvb2xlYW4pIC0+XG5cdFx0XHRAX2VsZW1lbnQuY29udGVudEVkaXRhYmxlID0gYm9vbGVhblxuXHRcdFx0QGlnbm9yZUV2ZW50cyA9ICFib29sZWFuXG5cdFx0XHRAb24gXCJpbnB1dFwiLCAtPiBAY2FsY1NpemUoKSBpZiBAZG9BdXRvU2l6ZVxuXHRAZGVmaW5lIFwidGV4dFwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LnRleHRDb250ZW50XG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX2VsZW1lbnQudGV4dENvbnRlbnQgPSB2YWx1ZVxuXHRcdFx0QGVtaXQoXCJjaGFuZ2U6dGV4dFwiLCB2YWx1ZSlcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImZvbnRGYW1pbHlcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udEZhbWlseVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250RmFtaWx5XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFNpemVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFNpemUucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFNpemVcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsaW5lSGVpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmxpbmVIZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxpbmVIZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250V2VpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRXZWlnaHQgXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRXZWlnaHRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U3R5bGVcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFN0eWxlXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRTdHlsZVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRWYXJpYW50XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLmZvbnRWYXJpYW50XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRWYXJpYW50XCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1wiLFxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdUb3BcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nQm90dG9tXCIsIHZhbHVlLCB0cnVlKVxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nVG9wXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdUb3AucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdSaWdodFwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nUmlnaHQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ1JpZ2h0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ0JvdHRvbVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5wYWRkaW5nQm90dG9tLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nTGVmdFwiLFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdMZWZ0LnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInBhZGRpbmdMZWZ0XCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwidGV4dEFsaWduXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcInRleHRBbGlnblwiLCB2YWx1ZSlcblx0QGRlZmluZSBcInRleHRUcmFuc2Zvcm1cIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUudGV4dFRyYW5zZm9ybSBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dFRyYW5zZm9ybVwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImxldHRlclNwYWNpbmdcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGV0dGVyU3BhY2luZy5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJsZXR0ZXJTcGFjaW5nXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwibGVuZ3RoXCIsIFxuXHRcdGdldDogLT4gQHRleHQubGVuZ3RoXG5cbmNvbnZlcnRUb1RleHRMYXllciA9IChsYXllcikgLT5cblx0dCA9IG5ldyBUZXh0TGF5ZXJcblx0XHRuYW1lOiBsYXllci5uYW1lXG5cdFx0ZnJhbWU6IGxheWVyLmZyYW1lXG5cdFx0cGFyZW50OiBsYXllci5wYXJlbnRcblx0XG5cdGNzc09iaiA9IHt9XG5cdGNzcyA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLmNzc1xuXHRjc3MuZm9yRWFjaCAocnVsZSkgLT5cblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyBydWxlLCAnLyonXG5cdFx0YXJyID0gcnVsZS5zcGxpdCgnOiAnKVxuXHRcdGNzc09ialthcnJbMF1dID0gYXJyWzFdLnJlcGxhY2UoJzsnLCcnKVxuXHR0LnN0eWxlID0gY3NzT2JqXG5cdFxuXHRpbXBvcnRQYXRoID0gbGF5ZXIuX19mcmFtZXJJbXBvcnRlZEZyb21QYXRoXG5cdGlmIF8uaW5jbHVkZXMgaW1wb3J0UGF0aCwgJ0AyeCdcblx0XHR0LmZvbnRTaXplICo9IDJcblx0XHR0LmxpbmVIZWlnaHQgPSAocGFyc2VJbnQodC5saW5lSGVpZ2h0KSoyKSsncHgnXG5cdFx0dC5sZXR0ZXJTcGFjaW5nICo9IDJcblx0XHRcdFx0XHRcblx0dC55IC09IChwYXJzZUludCh0LmxpbmVIZWlnaHQpLXQuZm9udFNpemUpLzIgIyBjb21wZW5zYXRlIGZvciBob3cgQ1NTIGhhbmRsZXMgbGluZSBoZWlnaHRcblx0dC55IC09IHQuZm9udFNpemUgKiAwLjEgIyBza2V0Y2ggcGFkZGluZ1xuXHR0LnggLT0gdC5mb250U2l6ZSAqIDAuMDggIyBza2V0Y2ggcGFkZGluZ1xuXHR0LndpZHRoICs9IHQuZm9udFNpemUgKiAwLjUgIyBza2V0Y2ggcGFkZGluZ1xuXG5cdHQudGV4dCA9IGxheWVyLl9pbmZvLm1ldGFkYXRhLnN0cmluZ1xuXHRsYXllci5kZXN0cm95KClcblx0cmV0dXJuIHRcblxuTGF5ZXI6OmNvbnZlcnRUb1RleHRMYXllciA9IC0+IGNvbnZlcnRUb1RleHRMYXllcihAKVxuXG5jb252ZXJ0VGV4dExheWVycyA9IChvYmopIC0+XG5cdGZvciBwcm9wLGxheWVyIG9mIG9ialxuXHRcdGlmIGxheWVyLl9pbmZvLmtpbmQgaXMgXCJ0ZXh0XCJcblx0XHRcdG9ialtwcm9wXSA9IGNvbnZlcnRUb1RleHRMYXllcihsYXllcilcblxuIyBCYWNrd2FyZHMgY29tcGFiaWxpdHkuIFJlcGxhY2VkIGJ5IGNvbnZlcnRUb1RleHRMYXllcigpXG5MYXllcjo6ZnJhbWVBc1RleHRMYXllciA9IChwcm9wZXJ0aWVzKSAtPlxuICAgIHQgPSBuZXcgVGV4dExheWVyXG4gICAgdC5mcmFtZSA9IEBmcmFtZVxuICAgIHQuc3VwZXJMYXllciA9IEBzdXBlckxheWVyXG4gICAgXy5leHRlbmQgdCxwcm9wZXJ0aWVzXG4gICAgQGRlc3Ryb3koKVxuICAgIHRcblxuZXhwb3J0cy5UZXh0TGF5ZXIgPSBUZXh0TGF5ZXJcbmV4cG9ydHMuY29udmVydFRleHRMYXllcnMgPSBjb252ZXJ0VGV4dExheWVyc1xuIiwiY2xhc3MgbW9kdWxlLmV4cG9ydHMgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5iYWNrQnV0dG9uTmFtZSA/PSAnYmFja0J1dHRvbidcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5zY3JvbGwgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmF1dG9MaW5rID89IHRydWVcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cblx0XHRAb25DaGFuZ2UgXCJzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpID0+XG5cdFx0XHR2aWV3ID0gY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0aWYgdmlldz9cblx0XHRcdFx0IyBkZWZhdWx0IGJlaGF2aW9ycyBmb3Igdmlld3Ncblx0XHRcdFx0dmlldy5jbGlwID0gdHJ1ZVxuXHRcdFx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0XHRcdCMgYWRkIHNjcm9sbGNvbXBvbmVudFxuXHRcdFx0XHRpZiBAc2Nyb2xsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gPSB2aWV3LmNoaWxkcmVuXG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0XHRcdFx0bmFtZTogXCJzY3JvbGxDb21wb25lbnRcIlxuXHRcdFx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHZpZXdcblx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuY29udGVudC5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRcdFx0aWYgdmlldy53aWR0aCA8PSBAd2lkdGhcblx0XHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2Vcblx0XHRcdFx0XHRpZiB2aWV3LmhlaWdodCA8PSBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsVmVydGljYWwgPSBmYWxzZVxuXHRcdFx0XHRcdGZvciBjIGluIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHRjLnBhcmVudCA9IHNjcm9sbENvbXBvbmVudC5jb250ZW50XG5cdFx0XHRcdFx0dmlldy5zY3JvbGxDb21wb25lbnQgPSBzY3JvbGxDb21wb25lbnQgIyBtYWtlIGl0IGFjY2Vzc2libGUgYXMgYSBwcm9wZXJ0eVxuXHRcdFx0XHRcdCMgcmVzZXQgc2l6ZSBzaW5jZSBjb250ZW50IG1vdmVkIHRvIHNjcm9sbENvbXBvbmVudC4gcHJldmVudHMgc2Nyb2xsIGJ1ZyB3aGVuIGRyYWdnaW5nIG91dHNpZGUuXG5cdFx0XHRcdFx0dmlldy5zaXplID0ge3dpZHRoOiBAd2lkdGgsIGhlaWdodDogQGhlaWdodH1cblxuXHRcdHRyYW5zaXRpb25zID1cblx0XHRcdHN3aXRjaEluc3RhbnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiAwLCB5OiAwfVxuXHRcdFx0ZmFkZUluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHtvcGFjaXR5OiAwfVxuXHRcdFx0XHRcdHRvOiB7b3BhY2l0eTogMX1cblx0XHRcdHpvb21Jbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7c2NhbGU6IDAuOCwgb3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge3NjYWxlOiAxLCBvcGFjaXR5OiAxfVxuXHRcdFx0em9vbU91dDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRzbGlkZUluVXA6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3k6IEBoZWlnaHR9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0c2xpZGVJblJpZ2h0OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkRvd246XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFk6IDB9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0bW92ZUluUmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0bW92ZUluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRzbGlkZUluTGVmdDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge21heFg6IEB3aWR0aH1cblx0XHRcdHB1c2hJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogLShAd2lkdGgvNSksIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaEluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogLUB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRwdXNoT3V0UmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHB1c2hPdXRMZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRoLzUsIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRcdHRvOiB7eDogMCwgYnJpZ2h0bmVzczogMTAwfVxuXHRcdFx0c2xpZGVPdXRVcDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFk6IDB9XG5cdFx0XHRzbGlkZU91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0c2xpZGVPdXREb3duOlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eTogQGhlaWdodH1cblx0XHRcdHNsaWRlT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cblx0XHQjIHNob3J0Y3V0c1xuXHRcdHRyYW5zaXRpb25zLnNsaWRlSW4gPSB0cmFuc2l0aW9ucy5zbGlkZUluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5zbGlkZU91dCA9IHRyYW5zaXRpb25zLnNsaWRlT3V0UmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoSW4gPSB0cmFuc2l0aW9ucy5wdXNoSW5SaWdodFxuXHRcdHRyYW5zaXRpb25zLnB1c2hPdXQgPSB0cmFuc2l0aW9ucy5wdXNoT3V0UmlnaHRcblxuXHRcdCMgZXZlbnRzXG5cdFx0RXZlbnRzLlZpZXdXaWxsU3dpdGNoID0gXCJ2aWV3V2lsbFN3aXRjaFwiXG5cdFx0RXZlbnRzLlZpZXdEaWRTd2l0Y2ggPSBcInZpZXdEaWRTd2l0Y2hcIlxuXHRcdExheWVyOjpvblZpZXdXaWxsU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBjYilcblx0XHRMYXllcjo6b25WaWV3RGlkU3dpdGNoID0gKGNiKSAtPiBAb24oRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIGNiKVx0XHRcblxuXHRcdF8uZWFjaCB0cmFuc2l0aW9ucywgKGFuaW1Qcm9wcywgbmFtZSkgPT5cblxuXHRcdFx0aWYgb3B0aW9ucy5hdXRvTGlua1xuXHRcdFx0XHRsYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0XHRcdFx0Zm9yIGJ0biBpbiBsYXllcnNcblx0XHRcdFx0XHRpZiBfLmluY2x1ZGVzIGJ0bi5uYW1lLCBuYW1lXG5cdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlciA9IEBcblx0XHRcdFx0XHRcdGJ0bi5vbkNsaWNrIC0+XG5cdFx0XHRcdFx0XHRcdGFuaW0gPSBAbmFtZS5zcGxpdCgnXycpWzBdXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gQG5hbWUucmVwbGFjZShhbmltKydfJywnJylcblx0XHRcdFx0XHRcdFx0bGlua05hbWUgPSBsaW5rTmFtZS5yZXBsYWNlKC9cXGQrL2csICcnKSAjIHJlbW92ZSBudW1iZXJzXG5cdFx0XHRcdFx0XHRcdHZpZXdDb250cm9sbGVyW2FuaW1dIF8uZmluZChsYXllcnMsIChsKSAtPiBsLm5hbWUgaXMgbGlua05hbWUpXG5cblx0XHRcdEBbbmFtZV0gPSAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSA9PlxuXG5cdFx0XHRcdHJldHVybiBpZiBuZXdWaWV3IGlzIEBjdXJyZW50Vmlld1xuXG5cdFx0XHRcdCMgbWFrZSBzdXJlIHRoZSBuZXcgbGF5ZXIgaXMgaW5zaWRlIHRoZSB2aWV3Y29udHJvbGxlclxuXHRcdFx0XHRuZXdWaWV3LnBhcmVudCA9IEBcblx0XHRcdFx0bmV3Vmlldy5zZW5kVG9CYWNrKClcblxuXHRcdFx0XHQjIHJlc2V0IHByb3BzIGluIGNhc2UgdGhleSB3ZXJlIGNoYW5nZWQgYnkgYSBwcmV2IGFuaW1hdGlvblxuXHRcdFx0XHRuZXdWaWV3LnBvaW50ID0ge3g6MCwgeTogMH1cblx0XHRcdFx0bmV3Vmlldy5vcGFjaXR5ID0gMVxuXHRcdFx0XHRuZXdWaWV3LnNjYWxlID0gMVxuXHRcdFx0XHRuZXdWaWV3LmJyaWdodG5lc3MgPSAxMDBcblxuXHRcdFx0XHQjIG9sZFZpZXdcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wb2ludCA9IHt4OiAwLCB5OiAwfSAjIGZpeGVzIG9mZnNldCBpc3N1ZSB3aGVuIG1vdmluZyB0b28gZmFzdCBiZXR3ZWVuIHNjcmVlbnNcblx0XHRcdFx0QGN1cnJlbnRWaWV3Py5wcm9wcyA9IGFuaW1Qcm9wcy5vbGRWaWV3Py5mcm9tXG5cdFx0XHRcdG91dGdvaW5nID0gQGN1cnJlbnRWaWV3Py5hbmltYXRlIF8uZXh0ZW5kIGFuaW1hdGlvbk9wdGlvbnMsIHtwcm9wZXJ0aWVzOiBhbmltUHJvcHMub2xkVmlldz8udG99XG5cblx0XHRcdFx0IyBuZXdWaWV3XG5cdFx0XHRcdG5ld1ZpZXcucHJvcHMgPSBhbmltUHJvcHMubmV3Vmlldz8uZnJvbVxuXHRcdFx0XHRpbmNvbWluZyA9IG5ld1ZpZXcuYW5pbWF0ZSBfLmV4dGVuZCBhbmltYXRpb25PcHRpb25zLCB7cHJvcGVydGllczogYW5pbVByb3BzLm5ld1ZpZXc/LnRvfVxuXHRcdFx0XHRcblx0XHRcdFx0IyBsYXllciBvcmRlclxuXHRcdFx0XHRpZiBfLmluY2x1ZGVzIG5hbWUsICdPdXQnXG5cdFx0XHRcdFx0bmV3Vmlldy5wbGFjZUJlaGluZChAY3VycmVudFZpZXcpXG5cdFx0XHRcdFx0b3V0Z29pbmcub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdWaWV3LnBsYWNlQmVmb3JlKEBjdXJyZW50Vmlldylcblx0XHRcdFx0XHRcblx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdXaWxsU3dpdGNoLCBAY3VycmVudFZpZXcsIG5ld1ZpZXcpXG5cdFx0XHRcdFxuXHRcdFx0XHQjIGNoYW5nZSBDdXJyZW50VmlldyBiZWZvcmUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCBzbyBvbmUgY291bGQgZ28gYmFjayBpbiBoaXN0b3J5XG5cdFx0XHRcdCMgd2l0aG91dCBoYXZpbmcgdG8gd2FpdCBmb3IgdGhlIHRyYW5zaXRpb24gdG8gZmluaXNoXG5cdFx0XHRcdEBzYXZlQ3VycmVudFZpZXdUb0hpc3RvcnkgbmFtZSwgb3V0Z29pbmcsIGluY29taW5nXG5cdFx0XHRcdEBjdXJyZW50VmlldyA9IG5ld1ZpZXdcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6cHJldmlvdXNWaWV3XCIsIEBwcmV2aW91c1ZpZXcpXG5cdFx0XHRcdEBlbWl0KFwiY2hhbmdlOmN1cnJlbnRWaWV3XCIsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cdFx0XHRcdGlmIGluY29taW5nLmlzQW5pbWF0aW5nXG5cdFx0XHRcdFx0aG9vayA9IGluY29taW5nIFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aG9vayA9IG91dGdvaW5nXG5cdFx0XHRcdGhvb2sub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0XHRAZW1pdChFdmVudHMuVmlld0RpZFN3aXRjaCwgQHByZXZpb3VzVmlldywgQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lP1xuXHRcdFx0YXV0b0luaXRpYWwgPSBfLmZpbmQgRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpLCAobCkgLT4gbC5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRpZiBhdXRvSW5pdGlhbD8gdGhlbiBAc3dpdGNoSW5zdGFudCBhdXRvSW5pdGlhbFxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlldz9cblx0XHRcdEBzd2l0Y2hJbnN0YW50IG9wdGlvbnMuaW5pdGlhbFZpZXdcblxuXHRcdGlmIG9wdGlvbnMuYmFja0J1dHRvbk5hbWU/XG5cdFx0XHRiYWNrQnV0dG9ucyA9IF8uZmlsdGVyIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IF8uaW5jbHVkZXMgbC5uYW1lLCBvcHRpb25zLmJhY2tCdXR0b25OYW1lXG5cdFx0XHRmb3IgYnRuIGluIGJhY2tCdXR0b25zXG5cdFx0XHRcdGJ0bi5vbkNsaWNrID0+IEBiYWNrKClcblxuXHRAZGVmaW5lIFwicHJldmlvdXNWaWV3XCIsXG5cdFx0XHRnZXQ6IC0+IEBoaXN0b3J5WzBdLnZpZXdcblxuXHRzYXZlQ3VycmVudFZpZXdUb0hpc3Rvcnk6IChuYW1lLG91dGdvaW5nQW5pbWF0aW9uLGluY29taW5nQW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50Vmlld1xuXHRcdFx0YW5pbWF0aW9uTmFtZTogbmFtZVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb246IGluY29taW5nQW5pbWF0aW9uXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbjogb3V0Z29pbmdBbmltYXRpb25cblxuXHRiYWNrOiAtPlxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRpZiBfLmluY2x1ZGVzIHByZXZpb3VzLmFuaW1hdGlvbk5hbWUsICdPdXQnXG5cdFx0XHRcdHByZXZpb3VzLnZpZXcuYnJpbmdUb0Zyb250KClcblxuXHRcdFx0YmFja0luID0gcHJldmlvdXMub3V0Z29pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cdFx0XHRtb3ZlT3V0ID0gcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cblx0XHRcdGJhY2tJbi5zdGFydCgpXG5cdFx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdFx0QGN1cnJlbnRWaWV3ID0gcHJldmlvdXMudmlld1xuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0bW92ZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudFZpZXcuYnJpbmdUb0Zyb250KClcbiIsIiMgVGhpcyBpcyBhIHVzZXJzIGZpbGVcbmV4cG9ydHMuZGV0YWlsQ29udGVudCA9IFtcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiVDJcIlxuICAgICAgaGVhZGxpbmU6IFwiTWVkaXRlcnJhbmVhbiBTZWEgd2l0aCBDb3N0YSBEaWFkZW1hXCJcbiAgICAgIGlzSW5OYXY6IGZhbHNlXG4gICAgICBzZWN0aW9uczpbXCJPdmVydmlld1AxXCIsXCJPdmVydmlld1AxXCIsXCJUaGUgRGVzdGluYXRpb25zXCIsXCJDb3N0YSBEaWFkZW1hXCIsXCJMaWZlIG9uIEJvYXJkXCIsXCJDcnVpc2UgRGF0ZXMgYW5kIFByaWNlc1wiLFwiU3BlY2lhbCBPZmZlcnNcIl1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hdk5hbWU6XCJEZXN0aW5hdGlvbnNcIlxuICAgICAgaGVhZGxpbmU6IFwiREVTVElOQVRJT05TXCJcbiAgICAgIGlzSW5OYXY6IHRydWVcbiAgICAgIHNlY3Rpb25zOltcIm1hcFwiLFwiZGF5IGRldGFpbFwiLFwid2hhdCdzIGluY2x1ZGVkXCJdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiQ29zdGEgRGlhZGVtYVwiXG4gICAgICBoZWFkbGluZTogXCJDT1NUQSBESUFERU1BXCJcbiAgICAgIGlzSW5OYXY6IHRydWVcbiAgICAgIHNlY3Rpb25zOltcInNoaXBQaG90b1wiLFwiZmFjdHNcIixcImFjY29tb2RhdGlvbnNcIixcInNhZmV0eVwiXVxuICAgIH0sXG4gICAge1xuICAgICAgbmF2TmFtZTpcIkxpZmUgb24gQm9hcmRcIlxuICAgICAgaGVhZGxpbmU6IFwiTElGRSBPTiBCT0FSRFwiXG4gICAgICBpc0luTmF2OiB0cnVlXG4gICAgICBzZWN0aW9uczpbXCJvdmVydmlld1wiLFwiZGluaW5nXCIsXCJzcGEgYW5kIHdlbGxuZXNzXCIsXCJraWRzIGFuZCBmYW1pbGllc1wiLCBcIm5pZ2h0bGlmZVwiLFwiZXZlbnRzXCJdXG4gICAgfSxcbiAgICB7XG4gICAgICBuYXZOYW1lOlwiQ3J1aXNlIERhdGVzIGFuZCBQcmljZXNcIlxuICAgICAgaGVhZGxpbmU6IFwiTElGRSBPTiBCT0FSRFwiXG4gICAgICBpc0luTmF2OiB0cnVlXG4gICAgICBzZWN0aW9uczpbXCJkYXRlcyBpbnRlcmFjdGlvblwiXVxuICAgIH0sIFxuICAgIHtcbiAgICAgIG5hdk5hbWU6XCJTcGVjaWFsIERlYWxzXCJcbiAgICAgIGhlYWRsaW5lOiBcIkxJRkUgT04gQk9BUkRcIlxuICAgICAgaXNJbk5hdjogdHJ1ZVxuICAgICAgc2VjdGlvbnM6W1wiZGVhbCAxXCIsIFwiZGVhbCAyXCJdXG4gICAgfSxcbiAgXVxuIiwiX2dldEhpZXJhcmNoeSA9IChsYXllcikgLT5cbiAgc3RyaW5nID0gJydcbiAgZm9yIGEgaW4gbGF5ZXIuYW5jZXN0b3JzKClcbiAgICBzdHJpbmcgPSBhLm5hbWUrJz4nK3N0cmluZ1xuICByZXR1cm4gc3RyaW5nID0gc3RyaW5nK2xheWVyLm5hbWVcblxuX21hdGNoID0gKGhpZXJhcmNoeSwgc3RyaW5nKSAtPlxuICAjIHByZXBhcmUgcmVnZXggdG9rZW5zXG4gIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC9cXHMqPlxccyovZywnPicpICMgY2xlYW4gdXAgc3BhY2VzIGFyb3VuZCBhcnJvd3NcbiAgc3RyaW5nID0gc3RyaW5nLnNwbGl0KCcqJykuam9pbignW14+XSonKSAjIGFzdGVyaWtzIGFzIGxheWVyIG5hbWUgd2lsZGNhcmRcbiAgc3RyaW5nID0gc3RyaW5nLnNwbGl0KCcgJykuam9pbignKD86LiopPicpICMgc3BhY2UgYXMgc3RydWN0dXJlIHdpbGRjYXJkXG4gIHN0cmluZyA9IHN0cmluZy5zcGxpdCgnLCcpLmpvaW4oJyR8JykgIyBhbGxvdyBtdWx0aXBsZSBzZWFyY2hlcyB1c2luZyBjb21tYVxuICByZWdleFN0cmluZyA9IFwiKF58PilcIitzdHJpbmcrXCIkXCIgIyBhbHdheXMgYm90dG9tIGxheWVyLCBtYXliZSBwYXJ0IG9mIGhpZXJhcmNoeVxuXG4gIHJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcpIFxuICByZXR1cm4gaGllcmFyY2h5Lm1hdGNoKHJlZ0V4cClcblxuX2ZpbmRBbGwgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT5cbiAgbGF5ZXJzID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpXG5cbiAgaWYgc2VsZWN0b3I/XG4gICAgc3RyaW5nTmVlZHNSZWdleCA9IF8uZmluZCBbJyonLCcgJywnPicsJywnXSwgKGMpIC0+IF8uY29udGFpbnMgc2VsZWN0b3IsY1xuICAgIHVubGVzcyBzdHJpbmdOZWVkc1JlZ2V4IG9yIGZyb21MYXllclxuICAgICAgbGF5ZXJzID0gXy5maWx0ZXIgbGF5ZXJzLCAobGF5ZXIpIC0+IFxuICAgICAgICBpZiBsYXllci5uYW1lIGlzIHNlbGVjdG9yIHRoZW4gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGxheWVycyA9IF8uZmlsdGVyIGxheWVycywgKGxheWVyKSAtPlxuICAgICAgICAgIGhpZXJhcmNoeSA9IF9nZXRIaWVyYXJjaHkobGF5ZXIpXG4gICAgICAgICAgaWYgZnJvbUxheWVyP1xuICAgICAgICAgICAgX21hdGNoKGhpZXJhcmNoeSwgZnJvbUxheWVyLm5hbWUrJyAnK3NlbGVjdG9yKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9tYXRjaChoaWVyYXJjaHksIHNlbGVjdG9yKVxuICBlbHNlXG4gICAgbGF5ZXJzXG5cblxuIyBHbG9iYWxcbmV4cG9ydHMuRmluZCAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVswXVxuZXhwb3J0cy7GkiAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVswXVxuXG5leHBvcnRzLkZpbmRBbGwgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilcbmV4cG9ydHMuxpLGkiAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpXG5cbiMgTWV0aG9kc1xuTGF5ZXI6OmZpbmQgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVswXVxuTGF5ZXI6OsaSICAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQClbMF1cblxuTGF5ZXI6OmZpbmRBbGwgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVxuTGF5ZXI6OsaSxpIgICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApIiwiXG5cblxuIyAnRmlyZWJhc2UgUkVTVCBBUEkgQ2xhc3MnIG1vZHVsZSB2MS4wXG4jIGJ5IE1hcmMgS3Jlbm4sIE1heSAzMXN0LCAyMDE2IHwgbWFyYy5rcmVubkBnbWFpbC5jb20gfCBAbWFyY19rcmVublxuXG4jIERvY3VtZW50YXRpb24gb2YgdGhpcyBNb2R1bGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJja3Jlbm4vZnJhbWVyLUZpcmViYXNlXG4jIC0tLS0tLSA6IC0tLS0tLS0gRmlyZWJhc2UgUkVTVCBBUEk6IGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL3JlZmVyZW5jZS9yZXN0L2RhdGFiYXNlL1xuXG5cbiMgVG9EbzpcbiMgRml4IG9uQ2hhbmdlIFwiY29ubmVjdGlvblwiLCBgdGhpc8K0IGNvbnRleHRcblxuXG5cbiMgRmlyZWJhc2UgUkVTVCBBUEkgQ2xhc3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jbGFzcyBleHBvcnRzLkZpcmViYXNlIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXG5cblxuXHRnZXRDT1JTdXJsID0gKHNlcnZlciwgcGF0aCwgc2VjcmV0LCBwcm9qZWN0KSAtPlxuXG5cdFx0c3dpdGNoIFV0aWxzLmlzV2ViS2l0KClcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIHVybCA9IFwiaHR0cHM6Ly8je3NlcnZlcn0je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH0mbnM9I3twcm9qZWN0fSZzc2U9dHJ1ZVwiICMgV2Via2l0IFhTUyB3b3JrYXJvdW5kXG5cdFx0XHRlbHNlICAgICAgICAgICB1cmwgPSBcImh0dHBzOi8vI3twcm9qZWN0fS5maXJlYmFzZWlvLmNvbSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fVwiXG5cblx0XHRyZXR1cm4gdXJsXG5cblxuXHRALmRlZmluZSBcInN0YXR1c1wiLFxuXHRcdGdldDogLT4gQF9zdGF0dXMgIyByZWFkT25seVxuXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cdFx0QHByb2plY3RJRCA9IEBvcHRpb25zLnByb2plY3RJRCA/PSBudWxsXG5cdFx0QHNlY3JldCAgICA9IEBvcHRpb25zLnNlY3JldCAgICA/PSBudWxsXG5cdFx0QHNlcnZlciAgICA9IEBvcHRpb25zLnNlcnZlciAgICA/PSB1bmRlZmluZWQgIyByZXF1aXJlZCBmb3IgV2ViS2l0IFhTUyB3b3JrYXJvdW5kXG5cdFx0QGRlYnVnICAgICA9IEBvcHRpb25zLmRlYnVnICAgICA/PSBmYWxzZVxuXHRcdEBfc3RhdHVzICAgICAgICAgICAgICAgICAgICAgICAgPz0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdHN1cGVyXG5cblxuXHRcdGlmIEBzZXJ2ZXIgaXMgdW5kZWZpbmVkXG5cdFx0XHRVdGlscy5kb21Mb2FkSlNPTiBcImh0dHBzOi8vI3tAcHJvamVjdElEfS5maXJlYmFzZWlvLmNvbS8uc2V0dGluZ3Mvb3duZXIuanNvblwiLCAoYSxzZXJ2ZXIpIC0+XG5cdFx0XHRcdHByaW50IG1zZyA9IFwiQWRkIF9fX19fXyBzZXJ2ZXI6XCIgKyAnICAgXCInICsgc2VydmVyICsgJ1wiJyArIFwiIF9fX19fIHRvIHlvdXIgaW5zdGFuY2Ugb2YgRmlyZWJhc2UuXCJcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogI3ttc2d9XCIgaWYgQGRlYnVnXG5cblxuXHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IENvbm5lY3RpbmcgdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgLi4uIFxcbiBVUkw6ICcje2dldENPUlN1cmwoQHNlcnZlciwgXCIvXCIsIEBzZWNyZXQsIEBwcm9qZWN0SUQpfSdcIiBpZiBAZGVidWdcblx0XHRALm9uQ2hhbmdlIFwiY29ubmVjdGlvblwiXG5cblxuXHRyZXF1ZXN0ID0gKHByb2plY3QsIHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIG1ldGhvZCwgZGF0YSwgcGFyYW1ldGVycywgZGVidWcpIC0+XG5cblx0XHR1cmwgPSBcImh0dHBzOi8vI3twcm9qZWN0fS5maXJlYmFzZWlvLmNvbSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fVwiXG5cblxuXHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0aWYgcGFyYW1ldGVycy5zaGFsbG93ICAgICAgICAgICAgdGhlbiB1cmwgKz0gXCImc2hhbGxvdz10cnVlXCJcblx0XHRcdGlmIHBhcmFtZXRlcnMuZm9ybWF0IGlzIFwiZXhwb3J0XCIgdGhlbiB1cmwgKz0gXCImZm9ybWF0PWV4cG9ydFwiXG5cblx0XHRcdHN3aXRjaCBwYXJhbWV0ZXJzLnByaW50XG5cdFx0XHRcdHdoZW4gXCJwcmV0dHlcIiB0aGVuIHVybCArPSBcIiZwcmludD1wcmV0dHlcIlxuXHRcdFx0XHR3aGVuIFwic2lsZW50XCIgdGhlbiB1cmwgKz0gXCImcHJpbnQ9c2lsZW50XCJcblxuXHRcdFx0aWYgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIlxuXHRcdFx0XHR1cmwgKz0gXCImZG93bmxvYWQ9I3twYXJhbWV0ZXJzLmRvd25sb2FkfVwiXG5cdFx0XHRcdHdpbmRvdy5vcGVuKHVybCxcIl9zZWxmXCIpXG5cblxuXHRcdFx0dXJsICs9IFwiJm9yZGVyQnk9XCIgKyAnXCInICsgcGFyYW1ldGVycy5vcmRlckJ5ICsgJ1wiJyBpZiB0eXBlb2YgcGFyYW1ldGVycy5vcmRlckJ5ICAgICAgaXMgXCJzdHJpbmdcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9GaXJzdD0je3BhcmFtZXRlcnMubGltaXRUb0ZpcnN0fVwiICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0ZpcnN0IGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZsaW1pdFRvTGFzdD0je3BhcmFtZXRlcnMubGltaXRUb0xhc3R9XCIgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmxpbWl0VG9MYXN0ICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImc3RhcnRBdD0je3BhcmFtZXRlcnMuc3RhcnRBdH1cIiAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5zdGFydEF0ICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVuZEF0PSN7cGFyYW1ldGVycy5lbmRBdH1cIiAgICAgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZW5kQXQgICAgICAgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZlcXVhbFRvPSN7cGFyYW1ldGVycy5lcXVhbFRvfVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmVxdWFsVG8gICAgICBpcyBcIm51bWJlclwiXG5cblxuXHRcdHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0XG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTmV3ICcje21ldGhvZH0nLXJlcXVlc3Qgd2l0aCBkYXRhOiAnI3tKU09OLnN0cmluZ2lmeShkYXRhKX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHR4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSA9PlxuXG5cdFx0XHR1bmxlc3MgcGFyYW1ldGVycyBpcyB1bmRlZmluZWRcblx0XHRcdFx0aWYgcGFyYW1ldGVycy5wcmludCBpcyBcInNpbGVudFwiIG9yIHR5cGVvZiBwYXJhbWV0ZXJzLmRvd25sb2FkIGlzIFwic3RyaW5nXCIgdGhlbiByZXR1cm4gIyB1Z2hcblxuXHRcdFx0c3dpdGNoIHhodHRwLnJlYWR5U3RhdGVcblx0XHRcdFx0d2hlbiAwIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBub3QgaW5pdGlhbGl6ZWQgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDEgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBTZXJ2ZXIgY29ubmVjdGlvbiBlc3RhYmxpc2hlZCBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMiB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3QgcmVjZWl2ZWQgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAzIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUHJvY2Vzc2luZyByZXF1ZXN0IFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDRcblx0XHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKHhodHRwLnJlc3BvbnNlVGV4dCkpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3QgZmluaXNoZWQsIHJlc3BvbnNlOiAnI3tKU09OLnBhcnNlKHhodHRwLnJlc3BvbnNlVGV4dCl9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cblx0XHRcdGlmIHhodHRwLnN0YXR1cyBpcyBcIjQwNFwiXG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIkZpcmViYXNlOiBJbnZhbGlkIHJlcXVlc3QsIHBhZ2Ugbm90IGZvdW5kIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXG5cdFx0eGh0dHAub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcblx0XHR4aHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxuXHRcdHhodHRwLnNlbmQoZGF0YSA9IFwiI3tKU09OLnN0cmluZ2lmeShkYXRhKX1cIilcblxuXG5cblx0IyBBdmFpbGFibGUgbWV0aG9kc1xuXG5cdGdldDogICAgKHBhdGgsIGNhbGxiYWNrLCAgICAgICBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIkdFVFwiLCAgICBudWxsLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHB1dDogICAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBVVFwiLCAgICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHBvc3Q6ICAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBPU1RcIiwgICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHBhdGNoOiAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBBVENIXCIsICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdGRlbGV0ZTogKHBhdGgsIGNhbGxiYWNrLCAgICAgICBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIkRFTEVURVwiLCBudWxsLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cblxuXG5cdG9uQ2hhbmdlOiAocGF0aCwgY2FsbGJhY2spIC0+XG5cblxuXHRcdGlmIHBhdGggaXMgXCJjb25uZWN0aW9uXCJcblxuXHRcdFx0dXJsID0gZ2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRClcblx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcIm9wZW5cIiwgPT5cblx0XHRcdFx0aWYgY3VycmVudFN0YXR1cyBpcyBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRcdFx0QC5fc3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdGNhbGxiYWNrKFwiY29ubmVjdGVkXCIpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IENvbm5lY3Rpb24gdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgZXN0YWJsaXNoZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiY29ubmVjdGVkXCJcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJlcnJvclwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJkaXNjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IENvbm5lY3Rpb24gdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgY2xvc2VkXCIgaWYgQGRlYnVnXG5cdFx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cblxuXHRcdGVsc2VcblxuXHRcdFx0dXJsID0gZ2V0Q09SU3VybChAc2VydmVyLCBwYXRoLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0c291cmNlID0gbmV3IEV2ZW50U291cmNlKHVybClcblx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IExpc3RlbmluZyB0byBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwicHV0XCIsIChldikgPT5cblx0XHRcdFx0Y2FsbGJhY2soSlNPTi5wYXJzZShldi5kYXRhKS5kYXRhLCBcInB1dFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIikpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUFVUJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwicGF0Y2hcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicGF0Y2hcIiwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGguc3BsaXQoXCIvXCIpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVjZWl2ZWQgY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyB2aWEgJ1BBVENIJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG4iLCIjIyNcbiAgRnJhbWVyS2l0IGZvciBGcmFtZXJcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgQ29weXJpZ2h0IChjKSAyMDE1LCBSYXBoIEQnQW1pY28gaHR0cDovL3JhcGhkYW1pY28uY29tIChAcmFwaGRhbWljbylcbiAgTUlUIExpY2Vuc2VcblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG5cdERFRkFVTFQgU1RZTEVTXG5cdE5vdGUgdGhlIHNjcmVlbndpZHRoIGNvbnN0YW50OiB0aGlzIGlzIHByb2JhYmx5IG9uZSBvZiB0aGVcblx0Zmlyc3QgdGhpbmdzIHlvdSB3YW50IHRvIGNoYW5nZSBzbyBpdCBtYXRjaGVzIHRoZSBkZXZpY2Vcblx0eW91J3JlIHByb3RvdHlwaW5nIG9uLlxuIyMjXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IDc1MFxufVxuXG4jIyNcblx0TU9SRSBTVFlMRVNcbiMjI1xuZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgPSA4OFxuZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZyA9IDIwXG5kZWZhdWx0cy50aW50ID0gJ2dyZXknXG5kZWZhdWx0cy5saW5lVGludCA9IFwicmdiYSgyMDAsMjAwLDIwMCwxKVwiXG5kZWZhdWx0cy5zd2l0Y2hUaW50ID0gJyMxREMyNEInXG5kZWZhdWx0cy5pdGVtQmFja2dyb3VuZCA9ICd3aGl0ZSdcbmRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIzMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcbn1cbmRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcblx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbn1cbmRlZmF1bHRzLnBpY2tlclRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRmb250RmFtaWx5OiBcdFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEVMRU1FTlRTXG5cdChlLmcuIFwiVGh1bWJcIiBmb3IgdGhlIHN3aXRjaCBjb250cm9sKVxuIyMjXG5cblN3aXRjaCA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IHRydWVcblx0XG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFxuXHQjIFRoaXMgaXMgb3VyIGZhbmN5IGFuaW1hdGVkIHN3aXRjaCBzd2l0Y2hcblx0IyB3ZSBuZWVkIHRvIG1ha2UgYSByb3VuZGVkIHJlY3RhbmdsZSB3aXRoIGEgY2lyY2xlIGluc2lkZSBpdC5cblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHRjbGlwOiBcdFx0XHRcdGZhbHNlICMgQ2xpcHBpbmcgaHVydHMgdGhlIHN1YnRsZSBzaGFkb3cgb24gdGhlIGJ1dHRvblxuXHRcdHdpZHRoOlx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIFxuXHRcdGhlaWdodDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblxuXHRAc3dpdGNoQmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzJcblx0XHR5Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yIC0gNFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGhlaWdodDogXHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGJvcmRlclJhZGl1czogXHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRzaGFkb3dTcHJlYWQ6XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgKyBwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0c2hhZG93Q29sb3I6IFx0XHRwYXJhbXMuc3dpdGNoVGludFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHQnJ1xuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHk6IC00XG5cdFx0d2lkdGg6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGhlaWdodDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0c3dpdGNoQnV0dG9uUmFkaXVzXG5cdFx0c2hhZG93WTpcdFx0XHQzXG5cdFx0c2hhZG93Qmx1cjogXHRcdDVcblx0XHRzaGFkb3dDb2xvcjogXHRcdCdyZ2JhKDAsMCwwLDAuMyknXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwid2hpdGVcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcblx0IyBTRVQgVVAgQU5JTUFUSU9OU1xuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDogXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0LTRcblx0XHRcdHdpZHRoOlx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aFxuXHRcdFx0aGVpZ2h0Olx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRcdHNoYWRvd1NwcmVhZDogXHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0XHRzYXR1cmF0ZTogXHRcdDBcblx0XHRcdGJyaWdodG5lc3M6IFx0MTUzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0XHR0aW1lOiAwLjMgXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0IFx0XHRpZiBAc2VsZWN0ZWRcbiBcdFx0XHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCA9PlxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9ICcnXG5cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDoge3g6IDB9XG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZyg0MDAsMjUsMClcIlxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLnNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLmRlc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXG5cdGlmIEBzZWxlY3RlZCA9PSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdGVsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IHRydWVcblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdGZpcnN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRsYXN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRcblx0XHQjIENvbnN0YW50c1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmc6IGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFx0XG5cdCMgVGhpcyBpcyB0aGUgcm9vdCBvYmplY3QgZm9yIHRoaXMgZW50aXJlIGNvbXBvbmVudC5cblx0IyBXZSB3aWxsIGF0dGFjaCBhbGwgb3VyIGZ1bmN0aW9ucyBkaXJlY3RseSB0byB0aGlzIGxheWVyXG5cdEBsaXN0SXRlbUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54XG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRjbGlwOiBmYWxzZVxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnN0eWxlID0gXG5cdFx0Ym9yZGVyVG9wOiBcdFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXHRcdGJvcmRlckJvdHRvbTogXHRpZiBwYXJhbXMubGFzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblxuXHQjIFRoZXNlIHdpbGwgYmUgYWNjZXNzZWQgdXNpbmcgZnVuY3Rpb25zXG5cdEBlbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0QHNlbGVjdGVkID0gcGFyYW1zLnNlbGVjdGVkXG5cdFxuXHRAbGlzdEl0ZW0gPSBuZXcgTGF5ZXIgXG5cdFx0eDogcGFyYW1zLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzdXBlckxheWVyOiBAbGlzdEl0ZW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XG5cdEBsaXN0SXRlbS5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBsaXN0SXRlbS5zdHlsZSA9XG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRib3JkZXJUb3A6IFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiXCIgZWxzZSBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvclxuXG5cdCMgVGhpcyBpcyB3aGVyZSB0aGUgbGFiZWwgb2YgdGhlIGxpc3QgaXRlbSBsaXZlc1xuXHRAbGlzdEl0ZW0uaHRtbCA9IHBhcmFtcy5uYW1lIFxuXG5cdCMgQWRkIHRoZSBjaGVja21hcmsgZm9yIHRoZSBsaXN0XG5cdHRoaW5nVG9Td2l0Y2ggPSBzd2l0Y2hcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjaGVjaycgdGhlbiBuZXcgQ2hlY2soKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2Nyb3NzJyB0aGVuIG5ldyBDcm9zcygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2FyZXQnIHRoZW4gbmV3IENhcmV0KClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnIHRoZW4gbmV3IFN3aXRjaCgpXG5cblx0dGhpbmdUb1N3aXRjaC5zdXBlckxheWVyID0gQGxpc3RJdGVtQ29udGFpbmVyXG5cdHRoaW5nVG9Td2l0Y2gueCA9IGRlZmF1bHRzLnNjcmVlbldpZHRoIC0gdGhpbmdUb1N3aXRjaC53aWR0aCAtIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0dGhpbmdUb1N3aXRjaC5jZW50ZXJZKDIpXG4jIFx0dGhpbmdUb1N3aXRjaC55ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSB0aGluZ1RvU3dpdGNoLmhlaWdodC8yXG5cdFxuXHQjIE1BS0UgSVQgQUxMIElOVEVSQUNUSVZFXG5cdCMgT24gYSBjbGljaywgZ28gdG8gdGhlIG5leHQgc3RhdGVcblx0aWYgcGFyYW1zLmljb24gPT0gJ3N3aXRjaCdcblx0XHR0aGluZ1RvU3dpdGNoLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXHRlbHNlIFxuXHRcdEBsaXN0SXRlbS5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoID0gPT5cblx0XHRpZiBAc2VsZWN0ZWQgdGhlbiBAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QoKSBlbHNlIEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QoKVxuXHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5zZWxlY3QoKVxuXHRcdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLmRlc2VsZWN0KClcdFx0XG5cdFx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwgPSAobmV3VGV4dCkgPT5cblx0XHRAbGlzdEl0ZW0uaHRtbCA9IG5ld1RleHRcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ZWQgPSAoKSA9PlxuXHRcdHJldHVybiBAc2VsZWN0ZWRcblx0XHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwocGFyYW1zLm5hbWUpXG5cblx0cmV0dXJuIEBsaXN0SXRlbUNvbnRhaW5lclxuXG5leHBvcnRzLlRhYmxlVmlldyA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRpdGVtczogW1wiSXQncyBqdXN0IG1lIVwiXVxuXHRcdGljb246ICdjaGVjaydcblx0XHR2YWxpZGF0aW9uOiAnbm9uZSdcblx0XG5cdEBidXR0b25Hcm91cENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICogcGFyYW1zLml0ZW1zLmxlbmd0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdFx0XHRcdFxuXHRAYnV0dG9uQXJyYXkgPSBbXVxuXHRmb3IgYnV0dG9uTmFtZSwgaSBpbiBwYXJhbXMuaXRlbXNcblx0XHRmaXJzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRsYXN0SXRlbUluTGlzdCA9IGlmIGkgPT0gKHBhcmFtcy5pdGVtcy5sZW5ndGgtMSkgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRuZXdCdXR0b24gPSBuZXcgZXhwb3J0cy5UYWJsZVZpZXdSb3coe1xuXHRcdFx0eDogMCwgXG5cdFx0XHR5OiBpKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LCBcblx0XHRcdG5hbWU6IGJ1dHRvbk5hbWUsIFxuXHRcdFx0aWNvbjogcGFyYW1zLmljb24sXG5cdFx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IGZpcnN0SXRlbUluTGlzdCxcblx0XHRcdGxhc3RJdGVtSW5MaXN0OiBsYXN0SXRlbUluTGlzdFxuXHRcdH0pXG5cdFx0QGJ1dHRvbkFycmF5LnB1c2gobmV3QnV0dG9uKVxuXHRcdG5ld0J1dHRvbi5zdXBlckxheWVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0XHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogaW5kZXhPZkJ1dHRvbkNsaWNrZWQsIG51bVNlbGVjdGVkOiAxLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0IyBKdXN0IGVtaXRzIHRoZSBuZXcgdmFsdWVzXG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdG51bVNlbGVjdGVkID0gMFxuXHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcyA9IFtdXHRcdFxuXHRcdFx0XHRcdGZvciBidXR0b24gaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcy5wdXNoKGJ1dHRvbi5zZWxlY3RlZCgpKVxuXHRcdFx0XHRcdFx0aWYgYnV0dG9uLnNlbGVjdGVkKCkgdGhlbiBudW1TZWxlY3RlZCsrXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiB0YWJsZVZpZXdTdGF0ZXMsIG51bVNlbGVjdGVkOiBudW1TZWxlY3RlZCwgYnV0dG9uczogYnV0dG9uQXJyYXkgfVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRlbHNlIFxuXHRcdGF0dGFjaERlZmF1bHRWYWxpZGF0aW9uKEBidXR0b25BcnJheSlcblx0XHRcblx0cmV0dXJuIEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgSEVBREVSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3SGVhZGVyID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHRleHQ6ICdJIGFtIGEgZGl2aWRlcidcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRsaXN0RGl2aWRlciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54ICsgZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0bGlzdERpdmlkZXIuaHRtbCA9IHBhcmFtcy50ZXh0XG5cdGxpc3REaXZpZGVyLnN0eWxlID0gZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGVcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogZGVmYXVsdHMudGludFxuXHRyZXR1cm4gbGlzdERpdmlkZXJcblxuXG5cbiMjI1xuXHRQSUNLRVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuXG4jIyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG5xdWFudGl6ZSA9IChpbnB1dCwgc3RlcFNpemUpIC0+XG5cdHJldHVybiBNYXRoLmZsb29yKGlucHV0L3N0ZXBTaXplKSAqIHN0ZXBTaXplXG5cblxuIyMgVGhlIGl0ZW1zIGluIHRoZSBwaWNrZXJcblxuRHJ1bSA9IChwYXJlbnREcnVtTGF5ZXIsIGRydW1OYW1lLCBsaXN0SXRlbXMsIHBhcmFtcykgLT5cblx0XG5cdCMgU2V0dXAgdmFyaWFibGVzXG5cdEBwYXJlbnREcnVtTGF5ZXIgPSBwYXJlbnREcnVtTGF5ZXJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHR4UGN0OiAwICBcdFx0XHRcdCMgMCB0byAxXG5cdFx0d2lkdGhQY3Q6IDFcdFx0XHRcdCMgMCB0byAxXG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXHRcdCMgbGVmdCwgY2VudGVyLCByaWdodFxuXHRcdHRleHRQYWRkaW5nOiBcIjBcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcblx0IyBWYWx1ZXMgZGVyaXZlZCBmcm9tIHBhcmFtc1xuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdCMgU2V0IHVwIGNvbnRlbnQgb2YgbGlzdCBcdFx0XG5cdGxpc3RJdGVtcyA9IGxpc3RJdGVtc1xuXHRAbmFtZSA9IGRydW1OYW1lXG5cdEBpbmRleCA9IDBcblx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdEB2ZWxvY2l0eSA9IDBcblx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWUgICAgIyBpcyB0aGlzIHRoZSBmaXJzdCB0b3VjaCBpbiBhIGdpdmVuIGdlc3R1cmU/XG5cdFxuXHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSAwXG5cdFxuXHQjIENhbGN1bGF0ZSBoZWlnaHQgYW5kIHZlcnRpY2FsIGJvdW5kcyBvZiB0aGUgbGlzdFxuXHRsaXN0TWluWVBvcyBcdD0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdE1heFlQb3MgXHQ9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K2RlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdEhlaWdodCBcdFx0PSBsaXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodFxuXG5cdEBkcnVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdHBhcmFtcy54UGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogXHRcdHBhcmVudERydW1MYXllclxuXHRcblx0bGlzdExheWVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0LWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0bGlzdEhlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAZHJ1bUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcblx0IyBsaXN0TGF5ZXIuc2Nyb2xsID0gdHJ1ZVxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLmVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLnNwZWVkWCA9IDBcblx0XG5cdGZvciBsaSwgaSBpbiBsaXN0SXRlbXNcblx0XHRsaXN0SXRlbUxheWVyID0gbmV3IExheWVyXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0aSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cdFx0XHR3aWR0aDogXHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRcdGhlaWdodDogXHRcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0XHRzdXBlckxheWVyOiBcdGxpc3RMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIiNVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0bGlzdEl0ZW1MYXllci5odG1sID0gbGlcblx0XHRsaXN0SXRlbUxheWVyLnN0eWxlID1cblx0XHRcdGNvbG9yOiBcdFx0XHRwYXJhbXMudGV4dENvbG9yXG5cdFx0XHRmb250RmFtaWx5OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250RmFtaWx5XG5cdFx0XHRmb250V2VpZ2h0OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250V2VpZ2h0XG5cdFx0XHRmb250U2l6ZTogXHRcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250U2l6ZVxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHRpZiBmaXJzdFRvdWNoQXZhaWxhYmxlXG5cdFx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwge2RydW06IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbCwgdmVsb2NpdHk6IDB9KVxuXHRcdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IGZhbHNlXHRcdFxuXHRcdFx0XG5cdFx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcdFxuXHQjIFRvIHNpbXVsYXRlIGlPUyBtb21lbnR1bSBzY3JvbGxpbmcgKHdoaWNoIGNhdXNlcyB0aGUgZHJ1bSB0byBrZWVwIHNwaW5uaW5nIFxuXHQjIGFmdGVyIHlvdXIgZmluZ2VyIGxpZnRzIG9mZiBpdCksIHdlIHRyaWdnZXIgYW4gYW5pbWF0aW9uIHRoZSBtb21lbnQgeW91IGxpZnRcblx0IyB5b3VyIGZpbmdlci4gVGhlIGludGVuc2l0eSBvZiB0aGlzIGFuaW1hdGlvbiBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIHNwZWVkIHdoZW5cblx0IyBvZiB0aGUgZHJhZ2dpbmcgd2hlbiB5b3VyIGZpbmdlciB3YXMgbGlmdGVkLlxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdFbmQsIChlLCBmKSA9PlxuXHRcdFxuXHRcdCMgTmV4dCB0b3VjaCBzaG91bGQgdHJpZ2dlciBEcnVtU3RhcnRlZE1vdmluZ1xuXHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSB0cnVlXG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlclN0YXJ0ZWRNb3ZpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsLCB2ZWxvY2l0eTogMH1cdFxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlclN0YXJ0ZWRNb3ZpbmdcIiApXG5cdFx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBsaXN0cyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCBwaWNrZXJTdGFydGVkTW92aW5nXG5cblxuXHRyZXR1cm4gQHBpY2tlckNvbnRhaW5lclxuIiwiI2lPU0tpdCBNb2R1bGVcbiNCeSBLZXZ5biBBcm5vdHQgXG5cblxuZnJhbWVyRGV2aWNlcyA9IHtcblxuIyBGdWxsc2NyZWVuXG5cImZ1bGxzY3JlZW5cIiA6IHsgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcdHNjYWxlOjEsIG1vYmlsZTpmYWxzZSwgcGxhdGZvcm06XCJ3ZWJcIn1cblxuIyBpUGhvbmVzXG5cbiMjIDVTXG5cImFwcGxlLWlwaG9uZS01cy1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNXMtc2lsdmVyXCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNXMtZ29sZFwiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNWNcblwiYXBwbGUtaXBob25lLTVjLWdyZWVuXCI6IHsgaGVpZ2h0OiAxMTM2LCB3aWR0aDogNjQwLHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTVjLWJsdWVcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy1yZWRcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy13aGl0ZVwiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwaG9uZS01Yy15ZWxsb3dcIjogeyBoZWlnaHQ6IDExMzYsIHdpZHRoOiA2NDAsc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNWMtcGlua1wiOiB7IGhlaWdodDogMTEzNiwgd2lkdGg6IDY0MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNnNcblwiYXBwbGUtaXBob25lLTZzLXNwYWNlLWdyYXlcIiA6IHsgaGVpZ2h0OiAxMzM0LCB3aWR0aDogNzUwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtc2lsdmVyXCI6IHsgaGVpZ2h0OiAxMzM0LCB3aWR0aDogNzUwLFx0c2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtZ29sZFwiOiB7IGhlaWdodDogMTMzNCwgd2lkdGg6IDc1MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTZzLXJvc2UtZ29sZFwiOiB7IGhlaWdodDogMTMzNCwgd2lkdGg6IDc1MCxcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgNnMgcGx1c1xuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1nb2xkXCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0Miwgc2NhbGU6IDMsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1zaWx2ZXJcIjogeyBoZWlnaHQ6IDIyMDgsIHdpZHRoOiAxMjQyLFx0c2NhbGU6IDMsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGhvbmUtNnMtcGx1cy1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0MixcdHNjYWxlOiAzLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBob25lLTZzLXBsdXMtcm9zZS1nb2xkXCI6IHsgaGVpZ2h0OiAyMjA4LCB3aWR0aDogMTI0MixcdHNjYWxlOiAzLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyBpUGFkc1xuXG4jIyBBaXIgXG5cImFwcGxlLWlwYWQtYWlyLTItZ29sZFwiOiB7IGhlaWdodDogMjA0OCwgd2lkdGg6IDE1MzYsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwYWQtYWlyLTItc2lsdmVyXCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1haXItMi1zcGFjZS1ncmF5XCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblxuIyMgTWluaVxuXCJhcHBsZS1pcGFkLW1pbmktNC1nb2xkXCI6IHsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNixcdHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1taW5pLTQtc3BhY2UtZ3JheVwiOiB7IGhlaWdodDogMjA0OCwgd2lkdGg6IDE1MzYsXHRzY2FsZTogMiwgbW9iaWxlOnRydWUsIHBsYXRmb3JtOlwiaU9TXCJ9XG5cImFwcGxlLWlwYWQtbWluaS00LXNpbHZlclwiOnsgaGVpZ2h0OiAyMDQ4LCB3aWR0aDogMTUzNiwgc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXG4jIyBQcm9cblwiYXBwbGUtaXBhZC1wcm8tZ29sZFwiOiB7IGhlaWdodDogMjczMiwgd2lkdGg6IDIwNDgsIHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cblwiYXBwbGUtaXBhZC1wcm8tc2lsdmVyXCI6IHsgaGVpZ2h0OiAyNzMyLCB3aWR0aDogMjA0OCwgc2NhbGU6IDIsIG1vYmlsZTp0cnVlLCBwbGF0Zm9ybTpcImlPU1wifVxuXCJhcHBsZS1pcGFkLXByby1zcGFjZS1ncmF5XCIgOiB7IGhlaWdodDogMjczMiwgd2lkdGg6IDIwNDgsIHNjYWxlOiAyLCBtb2JpbGU6dHJ1ZSwgcGxhdGZvcm06XCJpT1NcIn1cbn1cblxuIyMgVGhlc2UgdmFyaWFibGVzIHdpbGwgYmUgcG9wdWxhdGVkIHdpdGggZGV0YWlscyBmcm9tIHRoZSBkZXZpY2UgdXBvbiBydW5uaW5nLiBcbmV4cG9ydHMuZGV2aWNlID0gMFxuZXhwb3J0cy5uYW1lID0gMFxuZXhwb3J0cy5zY2FsZSA9IDBcbmV4cG9ydHMuaGVpZ2h0ID0gMFxuZXhwb3J0cy53aWR0aCA9IDBcbmV4cG9ydHMubW9iaWxlID0gMFxuZXhwb3J0cy5wbGF0Zm9ybSA9IDBcbmV4cG9ydHMub3JpZW50YXRpb24gPSAwXG5cbnNjcmVlbiA9IHt9XG5cblxuXG4jIGdldERldmljZSB3aWxsIHBvcHVsYXRlIGRldmljZSB2YXJpYWJsZXMsIGFuZCBpdCdsbCBvdmVycmlkZSB0aGUgZnJhbWUgaWYgdGhlIGRldmljZSBpcyBkaWZmZXJlbnQuIFxuZXhwb3J0cy5nZXREZXZpY2UgPSAtPlxuXG5cdCMgTG9hZHMgdGhlIGluaXRpYWwgZnJhbWVcblx0ZGV2aWNlID0gRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlXG5cblx0IyMjIFRoaXMgc3dpdGNoIGxvb2tzIGF0IHRoZSBpbm5lcldpZHRoIHRvIGRldGVybWluZSBpZiB0aGUgcHJvdG90eXBlIGlzIGJlaW5nIG9wZW5lZCBvbiBhIGRldmljZS4gXG5cdElmIHNvLCBpdCdsbCBvdmVycmlkZSB0aGUgZGV2aWNlLCBhbmQgaXQnbGwgYWRqdXN0IHRoZSB2aWV3IHRvIGZ1bGxzY3JlZW4uIyMjXG5cblx0c3dpdGNoIGlubmVyV2lkdGhcblx0XHQjIGlQaG9uZSA1Yy81cy9TRVxuXHRcdHdoZW4gNjQwXG5cdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwaG9uZS01cy1zaWx2ZXJcIlxuXHRcdFx0RnJhbWVyLkRldmljZS5kZXZpY2VUeXBlID0gXCJmdWxsc2NyZWVuXCJcblxuXHRcdCMgaVBob25lIDZzXG5cdFx0d2hlbiA3NTBcblx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBob25lLTZzLXNpbHZlclwiXG5cdFx0XHRGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgPSBcImZ1bGxzY3JlZW5cIlxuXG5cdFx0IyBpUGhvbmUgNnMrXG5cdFx0d2hlbiAxMjQyIFxuXHRcdFx0aWYgaW5uZXJIZWlnaHQgPT0gMjIwOFxuXHRcdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwaG9uZS02cy1wbHVzLXNpbHZlclwiXG5cdFx0XHRcdEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSA9IFwiZnVsbHNjcmVlblwiXG5cblx0XHQjIGlQYWQgaW4gcG9ydHJhaXRcblx0XHR3aGVuIDE1MzYgXG5cdFx0XHRpZiBpbm5lckhlaWdodCA9PSAyMDQ4XG5cdFx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBhZC1haXItMi1zaWx2ZXJcIlxuXHRcdFx0XHRGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUgPSBcImZ1bGxzY3JlZW5cIlxuXG5cdFx0IyBpUGFkXG5cdFx0d2hlbiAyMDQ4XG5cblx0XHRcdCMgaVBhZCBQcm8gaW4gcG9ydHJhaXRcblx0XHRcdGlmIGlubmVySGVpZ2h0ID09IDI3MzJcblx0XHRcdFx0ZGV2aWNlID0gXCJhcHBsZS1pcGFkLXByby1zaWx2ZXJcIlxuXG5cdFx0XHQjIGlQYWQgaW4gbGFuZHNjY2FwZVxuXHRcdFx0aWYgaW5uZXJIZWlnaHQgPT0gMTUzNlxuXHRcdFx0XHRkZXZpY2UgPSBcImFwcGxlLWlwYWQtYWlyLTItc2lsdmVyXCJcblx0XHRcdEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZSA9IFwiZnVsbHNjcmVlblwiXG5cblx0XHQjIGlQYWQgUHJvXG5cdFx0d2hlbiAyNzMyXG5cdFx0XHRpZiBpbm5lckhlaWdodCA9PSAyMDQ4XG5cdFx0XHRcdGRldmljZSA9IFwiYXBwbGUtaXBhZC1wcm8tc2lsdmVyXCJcblx0XHRcdFx0RnJhbWVyLkRldmljZS5kZXZpY2VUeXBlID0gXCJmdWxsc2NyZWVuXCJcblxuXHRleHBvcnRzLnNjYWxlID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLnNjYWxlXG5cblx0aWYgZGV2aWNlID09IFwiZnVsbHNjcmVlblwiXG5cdFx0ZXhwb3J0cy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG5cdFx0ZXhwb3J0cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0ZWxzZVxuXHRcdGV4cG9ydHMud2lkdGggPSBmcmFtZXJEZXZpY2VzW2RldmljZV0ud2lkdGhcblx0XHRleHBvcnRzLmhlaWdodCA9IGZyYW1lckRldmljZXNbZGV2aWNlXS5oZWlnaHRcblx0XHRpZiB3aW5kb3cuaW5uZXJXaWR0aCA9PSAxMjQyIHx8IHdpbmRvdy5pbm5lcldpZHRoID09IDIyMDhcblx0XHRcdGV4cG9ydHMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuXHRcdFx0ZXhwb3J0cy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHRcdGV4cG9ydHMuc2NhbGUgPSAzXG5cdGV4cG9ydHMubW9iaWxlID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLm1vYmlsZVxuXHRleHBvcnRzLnBsYXRmb3JtID0gZnJhbWVyRGV2aWNlc1tkZXZpY2VdLnBsYXRmb3JtXG5cdGV4cG9ydHMub3JpZW50YXRpb24gPSAgRnJhbWVyLkRldmljZS5vcmllbnRhdGlvblxuXG5cdCMgRGV2aWNlIFN0cmluZyBTY3J1YmJlclxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcImFwcGxlLVwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1nb2xkXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWdyZWVuXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWJsdWVcIiwgXCJcIilcblx0ZGV2aWNlID0gZGV2aWNlLnJlcGxhY2UoXCItcmVkXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXdoaXRlXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXllbGxvd1wiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1waW5rXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLXNwYWNlLWdyZXlcIiwgXCJcIilcblx0ZGV2aWNlID0gZGV2aWNlLnJlcGxhY2UoXCItcm9zZVwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIjVzXCIsIFwiNVwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIjVjXCIsIFwiNVwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1taW5pXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLWFpclwiLCBcIlwiKVxuXHRkZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi0yXCIsIFwiXCIpXG5cdGRldmljZSA9IGRldmljZS5yZXBsYWNlKFwiLTRcIiwgXCJcIilcblx0ZXhwb3J0cy5kZXZpY2UgPSBkZXZpY2UucmVwbGFjZShcIi1zaWx2ZXJcIiwgXCJcIilcblx0XG5cdCMgZXhwb3J0cy5kZXZpY2UgYmVjb21lcyBlaXRoZXIgaXBhZCwgaXBhZC1wcm8sIGlwaG9uZS01LCBpcGhvbmUtNnMsIGlwaG9uZS02cy1wbHVzXG5cblx0c2NyZWVuID0ge1xuXHRcdHdpZHRoOmV4cG9ydHMud2lkdGhcblx0XHRoZWlnaHQ6ZXhwb3J0cy5oZWlnaHRcblx0fVxuXG5leHBvcnRzLm9yaWVudCA9ICgpIC0+XG5cdGlmIGV4cG9ydHMub3JpZW50YXRpb24gPT0gLTkwXG5cdFx0dGVtcEhlaWdodCA9IGV4cG9ydHMuaGVpZ2h0XG5cdFx0dGVtcFdpZHRoID0gZXhwb3J0cy53aWR0aFxuXHRcdGV4cG9ydHMuaGVpZ2h0ID0gdGVtcFdpZHRoXG5cdFx0ZXhwb3J0cy53aWR0aCA9IHRlbXBIZWlnaHRcblxuZXhwb3J0cy5nZXREZXZpY2UoKVxuZXhwb3J0cy5vcmllbnQoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiAsIG9uUmVzaXplKVxuXG4jIExpc3RlbiB0byB3aW5kb3cgcmVpemVcblxub25SZXNpemUgPSAoKSAtPlxuXHRleHBvcnRzLmdldERldmljZSgpXG5cdGV4cG9ydHMubGF5b3V0KClcblxuIyBTdXBwb3J0aW5nIEZ1bmN0aW9uc1xuXG4jIyBDb252ZXJ0cyBweCB0byBwdFxuZXhwb3J0cy5wdCA9IChweCkgLT5cblx0cHQgPSBweC9leHBvcnRzLnNjYWxlXG5cdHB0ID0gTWF0aC5yb3VuZChwdClcblx0cmV0dXJuIHB0XG5cbiMjIENvbnZlcnRzIHB0IHRvIHB4XG5leHBvcnRzLnB4ID0gKHB0KSAtPlxuXHRweCA9IHB0ICogZXhwb3J0cy5zY2FsZVxuXHRweCA9IE1hdGgucm91bmQocHgpXG5cdHJldHVybiBweFxuXG4jIENsZWFucyBhIHN0cmluZyBvZiA8YnI+IGFuZCAmbmJzcDtcbmV4cG9ydHMuY2xlYW4gPSAoc3RyaW5nKSAtPlxuXHQjIyByZW1vdmUgd2hpdGUgc3BhY2Vcblx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1smXW5ic3BbO10vZ2ksIFwiIFwiKS5yZXBsYWNlKC9bPF1icls+XS9naSwgXCJcIilcblx0cmV0dXJuIHN0cmluZ1xuXG4jIENvbnZlcnRzIHB4J3Mgb2YgYW4gU1ZHIHRvIHNjYWxhYmxlIHZhcmlhYmxlc1xuZXhwb3J0cy5zdmcgPSAoc3ZnKSAtPlxuXHQjIEZpbmQgU3RyaW5nXG5cdHN0YXJ0SW5kZXggPSBzdmcuc2VhcmNoKFwiPHN2ZyB3aWR0aD1cIikgXG5cdGVuZEluZGV4ID0gc3ZnLnNlYXJjaChcIiB2aWV3Qm94XCIpXG5cdHN0cmluZyA9IHN2Zy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcblxuXHQjRmluZCB3aWR0aFxuXHR3U3RhcnRJbmRleCA9IHN0cmluZy5zZWFyY2goXCI9XCIpICsgMlxuXHR3RW5kSW5kZXggPSAgc3RyaW5nLnNlYXJjaChcInB4XCIpXG5cdHdpZHRoID0gc3RyaW5nLnNsaWNlKHdTdGFydEluZGV4LCB3RW5kSW5kZXgpXG5cdG5ld1dpZHRoID0gZXhwb3J0cy5weCh3aWR0aClcblxuXHQjIEZpbmQgSGVpZ2h0XG5cdGhlaWdodFN0cmluZyA9IHN0cmluZy5zbGljZSh3RW5kSW5kZXggKyA0LCBzdHJpbmcubGVuZ3RoKVxuXHRoU3RhcnRJbmRleCA9IGhlaWdodFN0cmluZy5zZWFyY2goXCI9XCIpKyAyXG5cdGhFbmRJbmRleCA9IGhlaWdodFN0cmluZy5zZWFyY2goXCJweFwiKSBcblx0aGVpZ2h0ID0gaGVpZ2h0U3RyaW5nLnNsaWNlKGhTdGFydEluZGV4LCBoRW5kSW5kZXgpXG5cdG5ld0hlaWdodCA9IGV4cG9ydHMucHgoaGVpZ2h0KVxuXG5cdCNDcmVhdGUgbmV3IHN0cmluZ1xuXHRuZXdTdHJpbmcgPSBzdHJpbmcucmVwbGFjZSh3aWR0aCwgbmV3V2lkdGgpXG5cdG5ld1N0cmluZyA9IG5ld1N0cmluZy5yZXBsYWNlKGhlaWdodCwgbmV3SGVpZ2h0KVxuXG5cdCNSZXBsYWNlIHN0cmluZ3Ncblx0c3ZnID0gc3ZnLnJlcGxhY2Uoc3RyaW5nLCBuZXdTdHJpbmcpXG5cblx0cmV0dXJuIHtcblx0XHRzdmc6c3ZnXG5cdFx0d2lkdGg6bmV3V2lkdGhcblx0XHRoZWlnaHQ6bmV3SGVpZ2h0XG5cdH1cblxuIyBDaGFuZ2VzIHRoZSBmaWxsIG9mIGFuIFNWR1xuZXhwb3J0cy5jaGFuZ2VGaWxsID0gKGxheWVyLCBjb2xvcikgLT5cblx0c3RhcnRJbmRleCA9IGxheWVyLmh0bWwuc2VhcmNoKFwiZmlsbD1cXFwiI1wiKVxuXHRmaWxsU3RyaW5nID0gbGF5ZXIuaHRtbC5zbGljZShzdGFydEluZGV4LCBsYXllci5odG1sLmxlbmd0aClcblx0ZW5kSW5kZXggPSBmaWxsU3RyaW5nLnNlYXJjaChcIlxcXCI+XCIpXG5cdHN0cmluZyA9IGZpbGxTdHJpbmcuc2xpY2UoMCwgZW5kSW5kZXgpXG5cdG5ld1N0cmluZyA9IFwiZmlsbD1cXFwiXCIgKyBleHBvcnRzLmNvbG9yKGNvbG9yKS50b0hleFN0cmluZygpXG5cdGxheWVyLmh0bWwgPSBsYXllci5odG1sLnJlcGxhY2Uoc3RyaW5nLCBuZXdTdHJpbmcpXG5cbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IChzdHJpbmcpIC0+XG5cdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSlcblxuIyBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWVcbmV4cG9ydHMuZ2V0VGltZSA9IC0+XG5cdGRheXNPZlRoZVdlZWsgPSBbXCJTdW5kYXlcIiwgXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiXVxuXHRtb250aHNPZlRoZVllYXIgPSBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXVxuXHRkYXRlT2JqID0gbmV3IERhdGUoKVxuXHRtb250aCA9IG1vbnRoc09mVGhlWWVhcltkYXRlT2JqLmdldE1vbnRoKCldXG5cdGRhdGUgPSBkYXRlT2JqLmdldERhdGUoKVxuXHRkYXkgPSBkYXlzT2ZUaGVXZWVrW2RhdGVPYmouZ2V0RGF5KCldXG5cdGhvdXJzID0gZGF0ZU9iai5nZXRIb3VycygpXG5cdG1pbnMgPSBkYXRlT2JqLmdldE1pbnV0ZXMoKVxuXHRzZWNzID0gZGF0ZU9iai5nZXRTZWNvbmRzKClcblx0cmV0dXJuIHtcblx0XHRtb250aDptb250aFxuXHRcdGRhdGU6ZGF0ZVxuXHRcdGRheTpkYXlcblx0XHRob3Vyczpob3Vyc1xuXHRcdG1pbnM6bWluc1xuXHRcdHNlY3M6c2Vjc1xuXHR9XG5cbiMjIGlPUyBDb2xvciDigJMgVGhpcyB3aWxsIHN0b3JlIGFsbCBvZiB0aGUgZGVmYXVsdCBpT1MgY29sb3JzIGludGVhZCBvZiB0aGUgZGVmYXVsdCBDU1MgY29sb3JzLiAqVGhpcyBpcyBvbmx5IHVwIGhlcmUgYmVjYXVzZSBJIHJlZmVyIHRvIGl0IGluIHRoZSBkZWZhdWx0cy4qXG5leHBvcnRzLmNvbG9yID0gKGNvbG9yU3RyaW5nKSAtPlxuXHRjb2xvciA9IFwiXCJcblx0aWYgdHlwZW9mIGNvbG9yU3RyaW5nID09IFwic3RyaW5nXCJcblx0XHRjb2xvclN0cmluZyA9IGNvbG9yU3RyaW5nLnRvTG93ZXJDYXNlKClcblx0c3dpdGNoIGNvbG9yU3RyaW5nXG5cdFx0d2hlbiBcInJlZFwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiNGRTM4MjRcIilcblx0XHR3aGVuIFwiYmx1ZVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiMwMDc2RkZcIilcblx0XHR3aGVuIFwicGlua1wiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiNGRTI4NTFcIilcblx0XHR3aGVuIFwiZ3JleVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5MjkyOTJcIilcblx0XHR3aGVuIFwiZ3JheVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5MjkyOTJcIilcblx0XHR3aGVuIFwiYmxhY2tcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjMDMwMzAzXCIpXG5cdFx0d2hlbiBcIndoaXRlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiI0VGRUZGNFwiKVxuXHRcdHdoZW4gXCJvcmFuZ2VcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjRkY5NjAwXCIpXG5cdFx0d2hlbiBcImdyZWVuXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzQ0REI1RVwiKVxuXHRcdHdoZW4gXCJsaWdodCBibHVlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzU0QzdGQ1wiKVxuXHRcdHdoZW4gXCJsaWdodC1ibHVlXCJcblx0XHRcdGNvbG9yID0gbmV3IENvbG9yKFwiIzU0QzdGQ1wiKVxuXHRcdHdoZW4gXCJ5ZWxsb3dcIlxuXHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjRkZDRDAwXCIpXG5cdFx0d2hlbiBcImxpZ2h0IGtleVwiXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5REE3QjNcIilcblx0XHR3aGVuIFwibGlnaHQta2V5XCIgXG5cdFx0XHRjb2xvciA9IG5ldyBDb2xvcihcIiM5REE3QjNcIilcblx0XHRlbHNlIFxuXHRcdFx0aWYgY29sb3JTdHJpbmdbMF0gPT0gXCIjXCIgfHwgY29sb3JTdHJpbmcudG9IZXhTdHJpbmcoKVswXSA9PSBcIiNcIlxuXHRcdFx0XHRjb2xvciA9IG5ldyBDb2xvcihjb2xvclN0cmluZylcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29sb3IgPSBuZXcgQ29sb3IoXCIjOTI5MjkyXCIpXG5cdHJldHVybiBjb2xvclxuXG4jIyBEZWZhdWx0cyBmb3IgZXZlcnl0aGluZ1xuZGVmYXVsdHMgPSB7XG5cdGFuaW1hdGlvbnM6IHtcblx0XHR0YXJnZXQ6dW5kZWZpbmVkXG5cdFx0Y29uc3RyYWludHM6IHVuZGVmaW5lZFxuXHRcdGN1cnZlIDogXCJlYXNlLWluLW91dFwiXG5cdFx0Y3VydmVPcHRpb25zOiB1bmRlZmluZWRcblx0XHR0aW1lOjFcblx0XHRkZWxheTowXG5cdFx0cmVwZWF0OnVuZGVmaW5lZFxuXHRcdGNvbG9yTW9kZWw6dW5kZWZpbmVkXG5cdFx0c3RhZ2dlcjp1bmRlZmluZWRcblx0XHRmYWRlT3V0OmZhbHNlXG5cdFx0ZmFkZUluOmZhbHNlXG5cdH1cblx0YWxlcnQ6IHtcblx0XHR0aXRsZTogXCJUaXRsZVwiXG5cdFx0bWVzc2FnZTpcIk1lc3NhZ2VcIlxuXHRcdGFjdGlvbnM6W1wiT0tcIl1cblx0XHRhY3Rpb246XCJBY3Rpb25cIlxuXHRcdHNlY29uZGFyeUFjdGlvbjogXCJzZWNvbmRhcnlBY3Rpb25cIlxuXHR9XG5cdGJhbm5lcjoge1xuXHRcdHRpdGxlOiBcIlRpdGxlXCJcblx0XHRtZXNzYWdlOlwiTWVzc2FnZVwiXG5cdFx0YWN0aW9uOlwiQWN0aW9uXCJcblx0XHR0aW1lOlwibm93XCJcblx0XHRpY29uOnVuZGVmaW5lZFxuXHRcdGR1cmF0aW9uOjdcblx0XHRhbmltYXRlZDpmYWxzZVxuXHR9XG5cdGJ1dHRvbjp7XG5cdFx0dGV4dDpcInRleHRcIlxuXHRcdHR5cGU6XCJidXR0b25cIlxuXHRcdGJ1dHRvblR5cGU6XCJ0ZXh0XCJcblx0XHRzdHlsZTpcImxpZ2h0XCJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6XCJ3aGl0ZVwiXG5cdFx0Y29sb3I6XCIjMDA3QUZGXCJcblx0XHRmb250U2l6ZToxN1xuXHRcdGZvbnRXZWlnaHQ6XCJyZWd1bGFyXCJcblx0XHRuYW1lOlwiYnV0dG9uXCJcblx0XHRibHVyOnRydWVcblx0XHRzdXBlckxheWVyOnVuZGVmaW5lZFxuXHRcdGNvbnN0cmFpbnRzOnVuZGVmaW5lZFxuXHR9XG5cdGZyYW1lclByb3BzIDpbXCJuYW1lXCIsIFwid2lkdGhcIiwgXCJoZWlnaHRcIiwgXCJzdXBlckxheWVyXCIsIFwib3BhY2l0eVwiLCBcImNvbG9yXCIsIFwiYmFja2dyb3VuZENvbG9yXCIsIFwieFwiLCBcInlcIiwgXCJtaWRYXCIsIFwibWlkWVwiLCBcIm1heFhcIiwgXCJtaW5YXCIsIFwidmlzaWJsZVwiLCBcImNsaXBcIiwgXCJzY3JvbGxIb3Jpem9udGFsXCIsIFwic2Nyb2xsVmVydGljYWxcIiwgXCJpZ25vcmVFdmVudHNcIiwgXCJ6XCIsIFwic2NhbGVYXCIsIFwic2NhbGVZXCIsIFwic2NhbGVaXCIsIFwic2NhbGVcIiwgXCJza2V3WFwiLCBcInNrZXdZXCIsIFwic2tld1wiLCBcIm9yaWdpblhcIiwgXCJvcmlnaW5ZXCIsIFwib3JpZ2luWlwiLCBcInBlcnNwZWN0aXZlXCIsIFwicGVyc3BlY3RpdmVPcmlnaW5YXCIsIFwicGVyc3BlY3RpdmVPcmlnaW5ZXCIsIFwicm90YXRpb25YXCIsIFwicm90YXRpb25ZXCIsIFwicm90YXRpb25aXCIsIFwicm90YXRpb25cIiwgXCJibHVyXCIsIFwiYnJpZ2h0bmVzc1wiLCBcInNhdHVyYXRlXCIsIFwiaHVlUm90YXRlXCIsIFwiY29udHJhc3RcIiwgXCJpbnZlcnRcIiwgXCJncmF5c2NhbGVcIiwgXCJzZXBpYVwiLCBcInNoYWRvd1hcIiwgXCJzaGFkb3dZXCIsIFwic2hhZG93Qmx1clwiLCBcInNoYWRvd1NwcmVhZFwiLCBcInNoYWRvd0NvbG9yXCIsIFwiYm9yZGVyQ29sb3JcIiwgXCJib3JkZXJXaWR0aFwiLCBcImZvcmNlMmRcIiwgXCJmbGF0XCIsIFwiYmFja2ZhY2VWaXNpYmxlXCIsIFwibmFtZVwiLCBcIm1hdHJpeFwiLCBcIl9tYXRyaXgyZFwiLCBcInRyYW5zZm9ybU1hdHJpeFwiLCBcIm1hdHJpeDNkXCIsIFwiYm9yZGVyUmFkaXVzXCIsIFwicG9pbnRcIiwgXCJzaXplXCIsIFwiZnJhbWVcIiwgXCJodG1sXCIsIFwiaW1hZ2VcIiwgXCJzY3JvbGxYXCIsIFwic2Nyb2xsWVwiLCBcIl9kb21FdmVudE1hbmFnZXJcIiwgXCJtb3VzZVdoZWVsU3BlZWRNdWx0aXBsaWVyXCIsIFwidmVsb2NpdHlUaHJlc2hvbGRcIiwgXCJhbmltYXRpb25PcHRpb25zXCIsIFwiY29uc3RyYWluZWRcIl1cblx0Y3NzUHJvcHMgOiBbXCJmb250RmFtaWx5XCIsIFwiZm9udFNpemVcIiwgXCJ0ZXh0QWxpZ25cIiwgXCJmb250V2VpZ2h0XCIsIFwibGluZUhlaWdodFwiXVxuXHRzdHlsZVByb3BzOiBbXCJmb250RmFtaWx5XCIsIFwiZm9udFNpemVcIiwgXCJ0ZXh0QWxpZ25cIiwgXCJmb250V2VpZ2h0XCIsIFwibGluZUhlaWdodFwiXVxuXHRjb25zdHJhaW50UHJvcHMgOiBbXCJoZWlnaHRcIiwgXCJ3aWR0aFwiXVxuXHRjb25zdHJhaW50VHlwZXM6IFtcInRvcFwiLCBcImxlYWRpbmdcIiwgXCJ0cmFpbGluZ1wiLCBcImJvdHRvbVwiXVxuXHRjb25zdHJhaW50QWxpZ25zIDogW1wiaG9yaXpvbnRhbENlbnRlclwiLCBcInZlcnRpY2FsQ2VudGVyXCIsIFwibGVhZGluZ0VkZ2VzXCIsIFwidHJhaWxpbmdFZGdlc1wiLCBcInRvcEVkZ2VzXCIsIFwiYm90dG9tRWRnZXNcIiwgXCJhbGlnblwiLCBcInZlcnRpY2FsXCIsIFwiaG9yaXpvbnRhbFwiXVxuXHRjb25zdHJhaW50czoge1xuXHRcdHRvcDoge1xuXHRcdFx0XCJwcm9wXCIgOiBcInlcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcIm1heFlcIlxuXHRcdFx0XCJvYmpQcm9wMlwiIDogXCJoZWlnaHRcIlxuXHRcdFx0XCJvcHBcIiA6IFwiYm90dG9tXCJcblx0XHR9XG5cdFx0bGVhZGluZzoge1xuXHRcdFx0XCJwcm9wXCIgOiBcInhcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcIm1heFhcIlxuXHRcdFx0XCJvYmpQcm9wMlwiIDogXCJ3aWR0aFwiXG5cdFx0XHRcIm9wcFwiIDogXCJ0cmFpbGluZ1wiXG5cdFx0fVxuXHRcdGJvdHRvbToge1xuXHRcdFx0XCJwcm9wXCIgOiBcIm1heFlcIlxuXHRcdFx0XCJvYmpQcm9wXCIgOiBcImhlaWdodFwiXG5cdFx0XHRcIm9ialByb3AyXCIgOiBcInlcIlxuXHRcdFx0XCJvcHBcIiA6IFwidG9wXCJcblx0XHR9XG5cdFx0dHJhaWxpbmc6IHtcblx0XHRcdFwicHJvcFwiIDogXCJtYXhYXCJcblx0XHRcdFwib2JqUHJvcFwiIDogXCJ3aWR0aFwiXG5cdFx0XHRcIm9ialByb3AyXCIgOiBcInhcIlxuXHRcdFx0XCJvcHBcIiA6IFwibGVhZGluZ1wiXG5cdFx0fVxuXHR9XG5cdGN1cnNvcjp7XG5cdFx0Y29sb3I6XCJibHVlXCJcblx0XHRoZWlnaHQ6MjBcblx0XHR3aWR0aDoxXG5cdH1cblx0ZmllbGQ6IHtcblx0XHRpc0VkaXRpbmc6ZmFsc2Vcblx0XHRjdXJzb3I6e31cblx0XHRib3JkZXJSYWRpdXM6NVxuXHRcdGJvcmRlcldpZHRoOjBcblx0XHRib3JkZXJDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRjb2xvcjpcIiMwOTA5MDhcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcIiNGRkZcIlxuXHRcdHJldHVyblRleHQ6XCJyZXR1cm5cIlxuXHRcdHJldHVybkNvbG9yOlwibGlnaHQta2V5XCJcblx0XHRzdHlsZTpcImxpZ2h0XCJcblx0XHR0eXBlOlwiZmllbGRcIlxuXHRcdGNvbnN0cmFpbnRzOnVuZGVmaW5lZFxuXHRcdHN1cGVyTGF5ZXI6dW5kZWZpbmVkXG5cdFx0d2lkdGg6MjU4XG5cdFx0aGVpZ2h0OjMwXG5cdFx0Zm9udFNpemU6MTVcblx0XHRmb250V2VpZ2h0OlwicmVndWxhclwiXG5cdFx0cGxhY2Vob2xkZXJUZXh0OlwicGxhY2Vob2xkZXJUZXh0XCJcblx0XHRwbGFjZWhvbGRlckNvbG9yOlwiIzgwODA4MFwiXG5cdFx0dGV4dDpcIlwiXG5cdFx0dGV4dENvbnN0cmFpbnRzOnthbGlnbjpcInZlcnRpY2FsXCIsIGxlYWRpbmc6OH1cblx0XHRpbnB1dDp0cnVlXG5cblx0fVxuXHRsb2NrU2NyZWVuOiB7XG5cdFx0dGltZTpcImRlZmF1bHRcIlxuXHRcdGRhdGU6XCJkZWZhdWx0XCJcblx0XHRwYXNzY29kZTpmYWxzZVxuXHRcdGNsb2NrMjQ6ZmFsc2Vcblx0XHR0eXBlOlwibG9ja1NjcmVlblwiXG5cdH1cblx0a2V5Ym9hcmQ6IHtcblx0XHRyZXR1cm5UZXh0OlwicmV0dXJuXCJcblx0XHRyZXR1cm5Db2xvcjpcImxpZ2h0LWtleVwiXG5cdFx0YW5pbWF0ZWQ6ZmFsc2Vcblx0XHRvdXRwdXQ6dW5kZWZpbmVkXG5cdH1cblx0c2hlZXQ6IHtcblx0XHRhY3Rpb25zOltcIk9LXCJdXG5cdFx0ZXhpdDpcIkNhbmNlbFwiXG5cdFx0YW5pbWF0ZWQ6ZmFsc2Vcblx0XHRkZXNjcmlwdGlvbjp1bmRlZmluZWRcblx0fVxuXHRuYXZCYXI6IHtcblx0XHR0aXRsZTpcIlRpdGxlXCJcblx0XHRsZWZ0OnVuZGVmaW5lZFxuXHRcdHJpZ2h0OlwiRWRpdFwiXG5cdFx0Ymx1cjp0cnVlXG5cdFx0c3VwZXJMYXllcjp1bmRlZmluZWRcblx0XHR0eXBlOlwibmF2QmFyXCJcblx0fVxuXHRzdGF0dXNCYXI6IHtcblx0XHRjYXJyaWVyOlwiXCJcblx0XHRuZXR3b3JrOlwiTFRFXCJcblx0XHRiYXR0ZXJ5OjEwMFxuXHRcdHNpZ25hbDo1XG5cdFx0c3R5bGU6XCJkYXJrXCJcblx0XHRjbG9jazI0OmZhbHNlXG5cdFx0dHlwZTpcInN0YXR1c0JhclwiXG5cdH1cblx0dGFiQmFyIDoge1xuXHRcdHRhYnM6IFtdXG5cdFx0c3RhcnQ6MFxuXHRcdHR5cGU6XCJ0YWJCYXJcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRhY3RpdmVDb2xvcjpcImJsdWVcIlxuXHRcdGluYWN0aXZlQ29sb3I6XCJncmF5XCJcblx0XHRibHVyOnRydWVcblx0fVxuXHR0YWIgOiB7XG5cdFx0bGFiZWw6IFwibGFiZWxcIlxuXHRcdGljb246XCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JzI1cHgnIGhlaWdodD0nMjVweCcgdmlld0JveD0nMCAwIDI1IDI1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNi4xICgyNjMxMykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT4xPC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScxJz5cblx0XHRcdFx0XHQ8ZyBpZD0nQm90dG9tLUJhci9UYWItQmFyJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjUuMDAwMDAwLCAtNy4wMDAwMDApJyBmaWxsPScjMDA3NkZGJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdQbGFjZWhvbGRlcnMnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDI1LjAwMDAwMCwgNy4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9JzEnIHg9JzAnIHk9JzAnIHdpZHRoPScyNScgaGVpZ2h0PScyNScgcng9JzMnPjwvcmVjdD5cblx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdFx0YWN0aXZlOiB1bmRlZmluZWRcblx0XHR1bmFjdGl2ZTogdW5kZWZpbmVkXG5cdFx0dGFiQmFyOiB1bmRlZmluZWRcblx0XHR0eXBlOiBcInRhYlwiXG5cdH1cblx0dGFibGUgOiB7XG5cdFx0Y29uc3RyYWludHM6IHVuZGVmaW5lZFxuXHRcdHR5cGU6XCJ0YWJsZVwiXG5cdFx0Y29udGVudDpbXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIjogXCJBXCIgXG5cdFx0XHRcdFwiZGV0YWlsXCIgOiBcImxldHRlclwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIkJcIlxuXHRcdFx0XHRcImRldGFpbFwiIDogXCJsZXR0ZXJcIlxuXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHRjZWxsOlwiZGVmYXVsdFwiXG5cdFx0c3VwZXJMYXllcjp1bmRlZmluZWRcblx0fVxuXHR0YWJsZUNlbGwgOiB7XG5cdFx0dHlwZTpcInRhYmxlQ2VsbFwiXG5cdFx0cHJvcGVydGllczogXCJkZWZhdWx0XCJcblx0XHRoZWlnaHQ6NTBcblx0XHRzd2lwZTpmYWxzZVxuXHRcdHN3aXBlQWN0aW9uOlwiRGVsZXRlXCJcblx0XHRzd2lwZUNvbG9yOlwiI0ZFMzgyNFwiXG5cdFx0c3dpcGVUZXh0Q29sb3I6XCIjRkZGXCJcblx0fVxuXG5cdHRleHQ6IHtcblx0XHR0ZXh0OiBcImlPUyBUZXh0IExheWVyXCJcblx0XHR0eXBlOlwidGV4dFwiXG5cdFx0eDowXG5cdFx0eTowXG5cdFx0d2lkdGg6LTFcblx0XHRoZWlnaHQ6LTFcblx0XHRzdXBlckxheWVyOnVuZGVmaW5lZFxuXHRcdHN0eWxlOlwiZGVmYXVsdFwiXG5cdFx0bGluZXM6MVxuXHRcdHRleHRBbGlnbjpcImxlZnRcIlxuXHRcdGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRjb2xvcjpcImJsYWNrXCJcblx0XHRmb250U2l6ZTogMTdcblx0XHRmb250RmFtaWx5OlwiLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0Zm9udFdlaWdodDpcInJlZ3VsYXJcIlxuXHRcdGxpbmVIZWlnaHQ6XCJhdXRvXCJcblx0XHRuYW1lOlwidGV4dCBsYXllclwiXG5cdFx0b3BhY2l0eToxXG5cdFx0dGV4dFRyYW5zZm9ybTpcIm5vbmVcIlxuXHRcdG5hbWU6XCJ0ZXh0IGxheWVyXCJcblx0XHRjb25zdHJhaW50czp7fVxuXHR9XG59XG5cblxuIyBDb21wb25lbnQgQ29uZmlndXJhdGlvbiBGdW5jdGlvbnNcbnNldFByb3BzID0gKG9iamVjdCkgLT5cblx0a2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdClcblx0b2JqZWN0W1wicHJvcHNcIl0gPSBrZXlzXG5cbmNvbXBvbmVudHMgPSBbZGVmYXVsdHMudGV4dCwgZGVmYXVsdHMuYWxlcnQsIGRlZmF1bHRzLmJhbm5lciwgZGVmYXVsdHMuc2hlZXQsIGRlZmF1bHRzLmZpZWxkLCBkZWZhdWx0cy50YWJsZSwgZGVmYXVsdHMudGFibGVDZWxsLCBkZWZhdWx0cy5rZXlib2FyZCwgZGVmYXVsdHMuYnV0dG9uLCBkZWZhdWx0cy5uYXZCYXIsIGRlZmF1bHRzLnRhYkJhciwgZGVmYXVsdHMudGFiLCBkZWZhdWx0cy5zdGF0dXNCYXIsIGRlZmF1bHRzLmxvY2tTY3JlZW5dXG5cbmZvciBjb21wIGluIGNvbXBvbmVudHNcblx0c2V0UHJvcHMoY29tcClcblxuc2V0dXBDb21wb25lbnQgPSAoY29tcG9uZW50LCBhcnJheSkgLT5cblx0aWYgYXJyYXkgPT0gdW5kZWZpbmVkXG5cdFx0YXJyYXkgPSBbXVxuXHRvYmogPSB7fVxuXHRmb3IgaSBpbiBkZWZhdWx0c1tjb21wb25lbnRdLnByb3BzXG5cdFx0aWYgYXJyYXlbaV0gIT0gdW5kZWZpbmVkXG5cdFx0XHRvYmpbaV0gPSBhcnJheVtpXVxuXHRcdGVsc2Vcblx0XHRcdG9ialtpXSA9IGRlZmF1bHRzW2NvbXBvbmVudF1baV1cblx0cmV0dXJuIG9ialxuXG4jIEVycm9yc1xuZXJyb3IgPSAoY29udGV4dCwgY29kZSkgLT5cblx0IyMgRXJyb3IgY29kZSBmcm9tIHNhbWVQYXJlbnRcblx0aWYgY29kZSA9PSAxMFxuXHRcdHByaW50IFwiRXJyb3IgSW52YWxpZCBSZWxhdGlvbnNoaXAg4oCTIExheWVyIGlkOiN7Y29udGV4dC5pZH0gaGFzIGEgcmVsYXRpb25zaGlwIHdpdGggYW5vdGhlciBsYXllciBub3QgaW4gdGhlIHNhbWUgc3VwZXJMYXllci5cIlxuXG5cdCMjIEVycm9yIGNvZGVzIGZyb20gbGF5b3V0QWxpZ24gXG5cdGlmIGNvZGUgPT0gMjBcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gcmVxdWlyZXMgYSBsYXllclwiXG5cdGlmIGNvZGUgPT0gMjFcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gY2Fubm90IHJlZmVyIHRvIGl0c2VsZlwiXG5cblx0IyMgRXJyb3IgY29kZXMgZm9yIGFwcGx5XG5cdGlmIGNvZGUgPT0gNDBcblx0XHRwcmludCBcIkVycm9yICN7Y29udGV4dH0gaXMgbm90IGEgdmFsaWQgd2VpZ2h0LiBQbGVhc2UgdXNlIDEwMCwgMjAwLCAzMDAuLi4gb3IgVGhpbiwgTGlnaHQsIFJlZ3VsYXIuLi5cIlxuXG5cdCMjIEVycm9yIGNvZGVzIGZvciBub3QgYSB2YWxpZCB0YWJcblx0aWYgY29kZSA9PSA1MFxuXHRcdHByaW50IFwiRXJyb3IgTGF5ZXIgaWQ6I3tjb250ZXh0fSBpcyBub3QgYSB2YWxpZCBUYWIgb2JqZWN0LiBQbGVhc2UgY3JlYXRlIGEgVGFiIHVzaW5nIG5ldyBtb2R1bGUuVGFiLlwiXG5cbiMgU3BlY2lhbCBDaGFyYWN0ZXJzXG5zcGVjaWFsQ2hhciA9IChsYXllcikgLT5cblx0dGV4dCA9IGxheWVyXG5cdGlmIGxheWVyLnR5cGUgPT0gXCJidXR0b25cIlxuXHRcdHRleHQgPSBsYXllci5sYWJlbFxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1iXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLWIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Zm9udFdlaWdodDo2MDB9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItclwiKSAhPSAtMVxuXHRcdG5ld1RleHQgPSB0ZXh0Lmh0bWwucmVwbGFjZShcIi1yIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fSwge2NvbG9yOlwicmVkXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItcmJcIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItcmIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJibHVlXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItbGJcIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItbGIgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJsaWdodC1ibHVlXCJ9XSlcblx0aWYgdGV4dC5odG1sLmluZGV4T2YoXCItZ1wiKSAhPSAtMVxuXHRcdG5ld1RleHQgPSB0ZXh0Lmh0bWwucmVwbGFjZShcIi1nIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fSwge2NvbG9yOlwiZ3JlZW5cIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1vXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLW8gXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJvcmFuZ2VcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1wXCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLXAgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJvcmFuZ2VcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi15XCIpICE9IC0xXG5cdFx0bmV3VGV4dCA9IHRleHQuaHRtbC5yZXBsYWNlKFwiLXkgXCIsIFwiXCIpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6XCJ5ZWxsb3dcIn1dKVxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi0jXCIpICE9IC0xXG5cdFx0Y2hvc2VuQ29sb3IgPSB0ZXh0Lmh0bWwuc2xpY2UoMSwgOClcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnNsaWNlKDksIHRleHQuaHRtbC5sZW5ndGgpXG5cdFx0ZXhwb3J0cy51cGRhdGUodGV4dCwgW3t0ZXh0Om5ld1RleHR9LCB7Y29sb3I6Y2hvc2VuQ29sb3J9XSlcdFxuXHRpZiB0ZXh0Lmh0bWwuaW5kZXhPZihcIi1cIikgIT0gLTFcblx0XHRuZXdUZXh0ID0gdGV4dC5odG1sLnJlcGxhY2UoXCItIFwiLCBcIlwiKVxuXHRcdGV4cG9ydHMudXBkYXRlKHRleHQsIFt7dGV4dDpuZXdUZXh0fV0pXG5cdGlmIGxheWVyLmJ1dHRvblR5cGUgPT0gXCJ0ZXh0XCJcblx0XHRsYXllci53aWR0aCA9IHRleHQud2lkdGhcblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG4jIERlY2lkZXMgaWYgaXQgc2hvdWxkIGJlIHdoaXRlL2JsYWNrIHRleHRcbmV4cG9ydHMuc2V0VGV4dENvbG9yID0gKGNvbG9yT2JqZWN0KSAtPlxuXHRyZ2IgPSBjb2xvck9iamVjdC50b1JnYlN0cmluZygpXG5cdHJnYiA9IHJnYi5zdWJzdHJpbmcoNCwgcmdiLmxlbmd0aC0xKVxuXHRyZ2IgPSByZ2IucmVwbGFjZSgvIC9nLCAnJylcblx0cmdiID0gcmdiLnJlcGxhY2UoLyAvZywgJycpXG5cdHJnYiA9IHJnYi5zcGxpdCgnLCcpXG5cdHJlZCA9IHJnYlswXVxuXHRncmVlbiA9IHJnYlsxXVxuXHRibHVlID0gcmdiWzJdXG5cdGNvbG9yID0gXCJcIlxuXHRpZiAocmVkKjAuMjk5ICsgZ3JlZW4qMC41ODcgKyBibHVlKjAuMTE0KSA+IDE4NiBcblx0XHRjb2xvciA9IFwiIzAwMFwiXG5cdGVsc2Vcblx0XHRjb2xvciA9IFwiRkZGXCJcblx0cmV0dXJuIGNvbG9yXG5cbmV4cG9ydHMuc2FtZVBhcmVudCA9IChsYXllcjEsIGxheWVyMikgLT5cblx0cGFyZW50T25lID0gbGF5ZXIxLnN1cGVyTGF5ZXJcblx0cGFyZW50VHdvID0gbGF5ZXIyLnN1cGVyTGF5ZXJcblx0aWYgcGFyZW50T25lID09IHBhcmVudFR3b1xuXHRcdHJldHVybiB0cnVlXG5cdGVsc2UgXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuIyB1cGRhdGVDb25zdHJhaW50cyA9IChsYXllcikgLT5cbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZyA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLCAxMClcdFxuIyBcdFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcubGVuZ3RoID09IHVuZGVmaW5lZFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgPSBleHBvcnRzLnB0KGxheWVyLngpXG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgPSBbbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXSwgZXhwb3J0cy5wdChsYXllci54IC0gbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXS5tYXhYKV1cblxuIyBcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcsIDEwKVx0XG4jIFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nID0gZXhwb3J0cy5wdChsYXllci5tYXhYKVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nLmxlbmd0aCA9PSB1bmRlZmluZWRcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy50cmFpbGluZyA9IGV4cG9ydHMucHQobGF5ZXIubWF4WClcbiMgXHRcdFx0ZWxzZVxuIyBcdFx0XHRcdCNJZiBpdCdzIGEgcmVsYXRpb25zaGlwXG4jIFx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPSBbbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0sIGV4cG9ydHMucHQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0ueCAtIGxheWVyLm1heFgpXVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wXG4jIFx0XHQjSWYgaXQncyBhIG51bWJlclxuIyBcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzLnRvcCwgMTApXHRcbiMgXHRcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuIyBcdFx0ZWxzZVxuIyBcdFx0XHQjSWYgaXQncyBhIGxheWVyXG4jIFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnRvcC5sZW5ndGggPT0gdW5kZWZpbmVkXG4jIFx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuIyBcdFx0XHRlbHNlXG4jIFx0XHRcdFx0I0lmIGl0J3MgYSByZWxhdGlvbnNoaXBcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy50b3AgPSBbbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLCBleHBvcnRzLnB0KGxheWVyLnkgLSBsYXllci5jb25zdHJhaW50cy50b3BbMF0ubWF4WSldXG5cbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b21cbiMgXHRcdCNJZiBpdCdzIGEgbnVtYmVyXG4jIFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b20gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMuYm90dG9tLCAxMClcdFxuIyBcdFx0XHRsYXllci5jb25zdHJhaW50cy5ib3R0b20gPSBleHBvcnRzLnB0KGxheWVyLm1heFkpXG4jIFx0XHRlbHNlXG4jIFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcbiMgXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYm90dG9tLmxlbmd0aCA9PSB1bmRlZmluZWRcbiMgXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5ib3R0b20gPSBleHBvcnRzLnB0KGxheWVyLm1heFkpXG4jIFx0XHRcdGVsc2VcbiMgXHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuIyBcdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSA9IFtsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF0sIGV4cG9ydHMucHQobGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzBdLnkgLSBsYXllci5tYXhZKV1cblxuIyBcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID09IFwiY2VudGVyXCJcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID0gdW5kZWZpbmVkXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuIyBcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJob3Jpem9udGFsXCJcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLmFsaWduID0gdW5kZWZpbmVkXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID0gZXhwb3J0cy5wdChsYXllci54KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJ2ZXJ0aWNhbFwiXG4jIFx0XHRsYXllci5jb25zdHJhaW50cy5hbGlnbiA9IHVuZGVmaW5lZFxuIyBcdFx0bGF5ZXIuY29uc3RyYWludHMudG9wID0gZXhwb3J0cy5wdChsYXllci55KVxuXG4jIFx0aWYgbGF5ZXIuY29uc3RyYWludHMud2lkdGhcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLndpZHRoID0gZXhwb3J0cy5wdChsYXllci53aWR0aClcbiMgXHRpZiBsYXllci5jb25zdHJhaW50cy5oZWlnaHRcbiMgXHRcdGxheWVyLmNvbnN0cmFpbnRzLndpZHRoID0gZXhwb3J0cy5wdChsYXllci5oZWlnaHQpXG4gXG5leHBvcnRzLmFuaW1hdGVMYXlvdXQgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0ge31cblx0YW5pbWF0ZWRMYXllcnMgPSBbXVxuXHRpZiBhcnJheVxuXHRcdGZvciBpIGluIE9iamVjdC5rZXlzKGRlZmF1bHRzLmFuaW1hdGlvbnMpXG5cdFx0XHRpZiBhcnJheVtpXVxuXHRcdFx0XHRzZXR1cFtpXSA9IGFycmF5W2ldXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHNldHVwW2ldID0gZGVmYXVsdHMuYW5pbWF0aW9uc1tpXVxuXG5cdGlmIHNldHVwLnRhcmdldCBcblx0XHRpZiBzZXR1cC50YXJnZXQubGVuZ3RoIFxuXHRcdFx0YW5pbWF0ZWRMYXllcnMgPSBzZXR1cC50YXJnZXRcblx0XHRlbHNlXG5cdFx0XHRhbmltYXRlZExheWVycy5wdXNoIHNldHVwLnRhcmdldFxuXHRlbHNlXG5cdFx0YW5pbWF0ZWRMYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cblx0aWYgc2V0dXAudGFyZ2V0XG5cdFx0aWYgc2V0dXAuY29uc3RyYWludHNcblx0XHRcdGZvciBuZXdDb25zdHJhaW50IGluIE9iamVjdC5rZXlzKHNldHVwLmNvbnN0cmFpbnRzKVxuXHRcdFx0XHRzZXR1cC50YXJnZXQuY29uc3RyYWludHNbbmV3Q29uc3RyYWludF0gPSBzZXR1cC5jb25zdHJhaW50c1tuZXdDb25zdHJhaW50XVxuXG5cdCNUcmFuc2xhdGUgbmV3IGNvbnN0cmFpbnRzXG5cdGZvciBsYXllciwgaW5kZXggaW4gYW5pbWF0ZWRMYXllcnNcblx0XHRpZiBsYXllci5jb25zdHJhaW50c1xuXHRcdFx0bGF5ZXIuZW5kID0ge31cblx0XHRcdHByb3BzID0ge31cblx0XHRcdGxheWVyLnN1cGVyRnJhbWUgPSB7fVxuXG5cdFx0XHRpZiBsYXllci5zdXBlckxheWVyXG5cdFx0XHRcdGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0ID0gbGF5ZXIuc3VwZXJMYXllci5oZWlnaHRcblx0XHRcdFx0bGF5ZXIuc3VwZXJGcmFtZS53aWR0aCA9IGxheWVyLnN1cGVyTGF5ZXIud2lkdGhcblx0XHRcdGVsc2Vcblx0XHRcdFx0bGF5ZXIuc3VwZXJGcmFtZS5oZWlnaHQgPSBleHBvcnRzLmhlaWdodFxuXHRcdFx0XHRsYXllci5zdXBlckZyYW1lLndpZHRoID0gZXhwb3J0cy53aWR0aFxuXHRcdFx0XG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nICE9IHVuZGVmaW5lZCAmJiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZyAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoID0ge31cdFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AgIT0gdW5kZWZpbmVkICYmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b0hlaWdodCA9IHt9XG5cblx0XHRcdCMgU2l6ZSBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMud2lkdGggIT0gdW5kZWZpbmVkXG5cdFx0XHRcdHByb3BzLndpZHRoID0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy53aWR0aClcblx0XHRcdGVsc2UgXG5cdFx0XHRcdHByb3BzLndpZHRoID0gbGF5ZXIud2lkdGhcblxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuaGVpZ2h0ICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy5oZWlnaHQgPSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLmhlaWdodClcblx0XHRcdGVsc2Vcblx0XHRcdFx0cHJvcHMuaGVpZ2h0ID0gbGF5ZXIuaGVpZ2h0XG5cblx0XHRcdCMgUG9zaXRpb25pbmcgY29uc3RyYWludHNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdCNJZiBpdCdzIGEgbnVtYmVyYFxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmcsIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueCA9IGV4cG9ydHMucHgobGF5ZXIuY29uc3RyYWludHMubGVhZGluZylcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiB0aGUgbGF5ZXIgcmVmZXJlbmNlZCBoYXNuJ3QgYmVlbiBzZXRcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nWzBdLmVuZCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdFx0ZXhwb3J0cy5hbmltYXRlTGF5b3V0XG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXI6bGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLmxlbmd0aCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nLmVuZC54ICsgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZy5lbmQud2lkdGhcblx0XHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5sZWFkaW5nWzBdLmVuZC54ICsgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ1swXS5lbmQud2lkdGggKyBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLmxlYWRpbmdbMV0pXG5cblx0XHRcdCMgT3Bwb3NpbmcgY29uc3RyYWludHMgaGFuZGxlclxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYID0gcHJvcHMueFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZyAhPSB1bmRlZmluZWRcblx0XHRcdFx0I0lmIGl0J3MgYSBudW1iZXJcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcsIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueCA9IGxheWVyLnN1cGVyRnJhbWUud2lkdGggLSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nKSAtIHByb3BzLndpZHRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjSWYgdGhlIGxheWVyIHJlZmVyZW5jZWQgaGFzbid0IGJlZW4gc2V0XG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdbMF0uZW5kID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRleHBvcnRzLmFuaW1hdGVMYXlvdXRcblx0XHRcdFx0XHRcdFx0XHRsYXllcjpsYXllci5jb25zdHJhaW50cy50cmFpbGluZ1swXVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZy5sZW5ndGggPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmcuZW5kLnggLSBwcm9wcy53aWR0aFxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgcmVsYXRpb25zaGlwXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLnRyYWlsaW5nWzBdLmVuZC54IC0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy50cmFpbGluZ1sxXSkgLSBwcm9wcy53aWR0aFxuXG5cdFx0XHQjIE9wcG9zaW5nIGNvbnN0cmFpbnRzIGhhbmRsZXJcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmF1dG9XaWR0aCAhPSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoLmVuZFggPSBwcm9wcy54XG5cblx0XHRcdFx0IyNwZXJmb3JtIGF1dG9zaXplXG5cdFx0XHRcdHByb3BzLnggPSBsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYXG5cdFx0XHRcdHByb3BzLndpZHRoID0gbGF5ZXIuY29uc3RyYWludHMuYXV0b1dpZHRoLmVuZFggLSBsYXllci5jb25zdHJhaW50cy5hdXRvV2lkdGguc3RhcnRYICsgcHJvcHMud2lkdGhcblxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMudG9wICE9IHVuZGVmaW5lZFxuXHRcdFx0XHQjSWYgaXQncyBhIG51bWJlclxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AgPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHMudG9wLCAxMClcdFxuXHRcdFx0XHRcdHByb3BzLnkgPSBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRvcClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiBpdCdzIGEgbGF5ZXJcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3AubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLnRvcC5lbmQueSArIGxheWVyLmNvbnN0cmFpbnRzLnRvcC5lbmQuaGVpZ2h0XG5cdFx0XHRcdFx0I0lmIGl0J3MgYSByZWxhdGlvbnNoaXBcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLmVuZC55ICsgbGF5ZXIuY29uc3RyYWludHMudG9wWzBdLmVuZC5oZWlnaHQgKyBleHBvcnRzLnB4KGxheWVyLmNvbnN0cmFpbnRzLnRvcFsxXSlcblxuXHRcdFx0IyBPcHBvc2luZyBjb25zdHJhaW50cyBoYW5kbGVyXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0ICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LnN0YXJ0WSA9IHByb3BzLnlcblxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b20gIT0gdW5kZWZpbmVkXG5cdFx0XHRcdCNJZiBpdCdzIGEgbnVtYmVyXG5cdFx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbSA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50cy5ib3R0b20sIDEwKVx0XG5cdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0IC0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50cy5ib3R0b20pIC0gcHJvcHMuaGVpZ2h0XG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCNJZiB0aGUgbGF5ZXIgcmVmZXJlbmNlZCBoYXNuJ3QgYmVlbiBzZXRcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF0uZW5kID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRleHBvcnRzLmFuaW1hdGVMYXlvdXRcblx0XHRcdFx0XHRcdFx0XHRsYXllcjpsYXllci5jb25zdHJhaW50cy5ib3R0b21bMF1cblx0XHRcdFx0XHQjSWYgaXQncyBhIGxheWVyXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYm90dG9tLmxlbmd0aCA9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdHByb3BzLnkgPSBsYXllci5jb25zdHJhaW50cy5ib3R0b20uZW5kLnkgLSBwcm9wcy5oZWlnaHRcblx0XHRcdFx0XHQjSWYgaXQncyBhIHJlbGF0aW9uc2hpcFxuXHRcdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzBdLmVuZC55IC0gIGV4cG9ydHMucHgobGF5ZXIuY29uc3RyYWludHMuYm90dG9tWzFdKVxuXG5cdFx0XHQjIE9wcG9zaW5nIGNvbnN0cmFpbnRzIGhhbmRsZXJcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQgIT0gdW5kZWZpbmVkXG5cdFx0XHRcdGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQuZW5kWSA9IHByb3BzLnlcblx0XHRcdFx0IyMgcGVyZm9ybSBhdXRvc2l6ZVxuXHRcdFx0XHRwcm9wcy5oZWlnaHQgPSBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LmVuZFkgLSBsYXllci5jb25zdHJhaW50cy5hdXRvSGVpZ2h0LnN0YXJ0WSBcblx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLmF1dG9IZWlnaHQuc3RhcnRZXG5cblxuXHRcdFx0IyBBbGlnbm1lbnQgY29uc3RyYWludHNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmFsaWduICE9IHVuZGVmaW5lZFxuXHRcdFx0XHQjU2V0IHRoZSBjZW50ZXJpbmcgZnJhbWVcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJob3Jpem9udGFsXCJcblx0XHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuc3VwZXJGcmFtZS53aWR0aCAvIDIgLSBwcm9wcy53aWR0aCAvIDIgXG5cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRcdFx0cHJvcHMueSA9IGxheWVyLnN1cGVyRnJhbWUuaGVpZ2h0IC8gMiAtIHByb3BzLmhlaWdodCAvIDIgXG5cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuYWxpZ24gPT0gXCJjZW50ZXJcIlxuXHRcdFx0XHRcdHByb3BzLnggPSBsYXllci5zdXBlckZyYW1lLndpZHRoIC8gMiAtIHByb3BzLndpZHRoIC8gMiBcblx0XHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuc3VwZXJGcmFtZS5oZWlnaHQgLyAyIC0gcHJvcHMuaGVpZ2h0IC8gMiBcblxuXG5cdFx0XHQjIENlbnRlcmluZyBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMuaG9yaXpvbnRhbENlbnRlciAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLmhvcml6b250YWxDZW50ZXIuZW5kLnggKyAobGF5ZXIuY29uc3RyYWludHMuaG9yaXpvbnRhbENlbnRlci5lbmQud2lkdGggLSBwcm9wcy53aWR0aCkgLyAyXG5cblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLnZlcnRpY2FsQ2VudGVyICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMudmVydGljYWxDZW50ZXIuZW5kLnkgKyAobGF5ZXIuY29uc3RyYWludHMudmVydGljYWxDZW50ZXIuZW5kLmhlaWdodCAtIHByb3BzLmhlaWdodCkgLyAyXG5cblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlciAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueCA9IGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlci5lbmQueCArIChsYXllci5jb25zdHJhaW50cy5jZW50ZXIuZW5kLndpZHRoIC0gcHJvcHMud2lkdGgpIC8gMlxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuY2VudGVyLmVuZC55ICsgKGxheWVyLmNvbnN0cmFpbnRzLmNlbnRlci5lbmQuaGVpZ2h0IC0gcHJvcHMuaGVpZ2h0KSAvIDJcblxuXHRcdFx0IyBBbGlnbmluZyBjb25zdHJhaW50c1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ0VkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMubGVhZGluZ0VkZ2VzLmVuZC54IFxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50cmFpbGluZ0VkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy54ID0gbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdFZGdlcy5lbmQueCAtIHByb3BzLndpZHRoICsgbGF5ZXIuY29uc3RyYWludHMudHJhaWxpbmdFZGdlcy5lbmQud2lkdGhcblxuXG5cdFx0XHRpZiBsYXllci5jb25zdHJhaW50cy50b3BFZGdlcyAhPSB1bmRlZmluZWRcblx0XHRcdFx0cHJvcHMueSA9IGxheWVyLmNvbnN0cmFpbnRzLnRvcEVkZ2VzLmVuZC55XG5cdFx0XHRcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRzLmJvdHRvbUVkZ2VzICE9IHVuZGVmaW5lZFxuXHRcdFx0XHRwcm9wcy55ID0gbGF5ZXIuY29uc3RyYWludHMuYm90dG9tRWRnZXMuZW5kLnkgLSBwcm9wcy5oZWlnaHQgKyBsYXllci5jb25zdHJhaW50cy5ib3R0b21FZGdlcy5lbmQuaGVpZ2h0IFxuXG5cdFx0XHQjVGltaW5nXG5cdFx0XHRkZWxheSA9IHNldHVwLmRlbGF5XG5cdFx0XHRpZiBzZXR1cC5zdGFnZ2VyXG5cdFx0XHRcdHN0YWcgPSBzZXR1cC5zdGFnZ2VyXG5cdFx0XHRcdGRlbGF5ID0gKChpbmRleCkgKiBzdGFnKVxuXG5cdFx0XHRpZiBzZXR1cC5mYWRlT3V0XG5cdFx0XHRcdCMgaWYgdHlwZW9mID09IFwiYm9vbGVhblwiXG5cdFx0XHRcdCMgXHRwcm9wcy5vcGFjaXR5ID0gMFxuXHRcdFx0XHRpZiBsYXllciA9PSBzZXR1cC5mYWRlT3V0XG5cdFx0XHRcdFx0cHJvcHMub3BhY2l0eSA9IDBcblxuXHRcdFx0aWYgc2V0dXAuZmFkZUluXG5cdFx0XHRcdHByb3BzLm9wYWNpdHkgPSAxXG5cblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOnByb3BzXG5cdFx0XHRcdHRpbWU6c2V0dXAudGltZVxuXHRcdFx0XHRkZWxheTpkZWxheVxuXHRcdFx0XHRjdXJ2ZTpzZXR1cC5jdXJ2ZVxuXHRcdFx0XHRyZXBlYXQ6c2V0dXAucmVwZWF0XG5cdFx0XHRcdGNvbG9yTW9kZWw6c2V0dXAuY29sb3JNb2RlbFxuXHRcdFx0XHRjdXJ2ZU9wdGlvbnM6c2V0dXAuY3VydmVPcHRpb25zXG5cblx0XHRcdGxheWVyLmVuZCA9IHByb3BzXG5cbiNSZWZyZXNoZXMgTGF5ZXIgb3IgQWxsIExheWVyc1xuZXhwb3J0cy5sYXlvdXQgPSAobGF5ZXIpIC0+XG5cdGlmIGxheWVyID09IHVuZGVmaW5lZFxuXHRcdEAuYXJyYXkgPSBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdGVsc2UgXG5cdFx0QC5hcnJheSA9IFtsYXllcl1cblx0Zm9yIGxheWVyIGluIEAuYXJyYXlcblx0XHRpZiBsYXllci5jb25zdHJhaW50c1xuXHRcdFx0Zm9yIHAgaW4gZGVmYXVsdHMuY29uc3RyYWludFByb3BzXG5cdFx0XHRcdGxheW91dFNpemUobGF5ZXIsIHApXG5cdFx0XHRmb3IgYyBpbiBkZWZhdWx0cy5jb25zdHJhaW50VHlwZXNcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbY10gIT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0bGF5b3V0Q2hhbmdlKGxheWVyLCBjKVxuXHRcdFx0Zm9yIGEgaW4gZGVmYXVsdHMuY29uc3RyYWludEFsaWduc1xuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1thXVxuXHRcdFx0XHRcdGxheW91dEFsaWduKGxheWVyLCBhKVxuXG5cdFx0XHQjVXBkYXRlcyB0aGUgY29uc3RyYWludHMgaWYgdGhlIGxheWVyIGlzIG1hbmlwdWxhdGVkIHRocm91Z2ggb3RoZXIgbWVhbnNcblx0XHRcdGlmIGxheWVyLmNvbnN0cmFpbnRMaXN0ZW5lciA9PSB1bmRlZmluZWRcblx0XHRcdFx0bGF5ZXIuY29uc3RyYWludExpc3RlbmVyID0gdHJ1ZVxuXG4jQWxpZ24gY29uc3RyYWludHNcbmxheW91dEFsaWduID0gKGxheWVyLCB0eXBlKSAtPlxuXHRkZWNsYXJlZENvbnN0cmFpbnQgPSBsYXllci5jb25zdHJhaW50c1t0eXBlXVxuXHRpZiBsYXllci5zdXBlckxheWVyXG5cdFx0QHN1cGVyTGF5ZXIgPSBsYXllci5zdXBlckxheWVyXG5cdGVsc2Vcblx0XHRAc3VwZXJMYXllciA9IHNjcmVlblxuXHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gcGFyc2VJbnQoZGVjbGFyZWRDb25zdHJhaW50LCAxMClcblx0XHRlcnJvcih0eXBlLCAyMClcblx0aWYgZGVjbGFyZWRDb25zdHJhaW50ID09IGxheWVyXG5cdFx0ZXJyb3IodHlwZSwgMjEpXG5cdGlmIHR5cGVvZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJvYmplY3RcIlxuXHRcdGZvciBpIGluIGRlY2xhcmVkQ29uc3RyYWludFxuXHRcdFx0aWYgdHlwZW9mIGkgPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHRAdHlwZSA9IGlcblx0XHRcdGlmIHR5cGVvZiBpID09IFwib2JqZWN0XCJcblx0XHRcdFx0QGxheWVyID0gaSBcblx0XHRpZiBAdHlwZSA9PSBcImhvcml6b250YWxDZW50ZXJcIiB8fCBAdHlwZSA9PSBcImhvcml6b250YWxcIlxuXHRcdFx0ZGVsdGFNb3ZlID0gKEBsYXllci53aWR0aCAtIGxheWVyLndpZHRoKSAvIDJcblx0XHRcdGxheWVyLnggPSBAbGF5ZXIueCArIGRlbHRhTW92ZVxuXHRcdFx0bGF5ZXIuY29uc3RyYWludHNbXCJsZWFkaW5nXCJdID0gZXhwb3J0cy5wdChsYXllci54KVxuXHRcdGlmIEB0eXBlID09IFwidmVydGljYWxDZW50ZXJcIiB8fCBAdHlwZSA9PSBcInZlcnRpY2FsXCIgIFxuXHRcdFx0ZGVsdGFNb3ZlID0gKEBsYXllci5oZWlnaHQgLSBsYXllci5oZWlnaHQpIC8gMlxuXHRcdFx0bGF5ZXIueSA9IEBsYXllci55ICsgZGVsdGFNb3ZlXG5cdFx0XHRsYXllci5jb25zdHJhaW50c1tcInRvcFwiXSA9IGV4cG9ydHMucHQobGF5ZXIueSlcblx0XHRpZiBAdHlwZSA9PSBcImxlYWRpbmdFZGdlc1wiIHx8IEB0eXBlID09IFwibGVhZGluZ1wiXG5cdFx0XHRsYXllci54ID0gQGxheWVyLnhcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1wibGVhZGluZ1wiXSA9IGV4cG9ydHMucHQobGF5ZXIueClcblx0XHRpZiBAdHlwZSA9PSBcInRyYWlsaW5nRWRnZXNcIiB8fCBAdHlwZSA9PSBcInRyYWlsaW5nXCJcblx0XHRcdGxheWVyLm1heFggPSBAbGF5ZXIubWF4WFxuXHRcdFx0bGF5ZXIuY29uc3RyYWludHNbXCJ0cmFpbGluZ1wiXSA9IGV4cG9ydHMucHQoQHN1cGVyTGF5ZXIud2lkdGggLSBsYXllci5tYXhYKVxuXHRcdGlmIEB0eXBlID09IFwidG9wRWRnZXNcIiB8fCBAdHlwZSA9PSBcInRvcFwiXG5cdFx0XHRsYXllci55ID0gQGxheWVyLnlcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1widG9wXCJdID0gZXhwb3J0cy5wdChsYXllci55KVxuXHRcdGlmIEB0eXBlID09IFwiYm90dG9tRWRnZXNcIiB8fCBAdHlwZSA9PSBcImJvdHRvbVwiXG5cdFx0XHRsYXllci5tYXhZID0gQGxheWVyLm1heFlcblx0XHRcdGxheWVyLmNvbnN0cmFpbnRzW1wiYm90dG9tXCJdID0gZXhwb3J0cy5wdChAc3VwZXJMYXllci5oZWlnaHQgLSBsYXllci5tYXhZKVxuXHRpZiB0eXBlID09IFwiaG9yaXpvbnRhbENlbnRlclwiIHx8IHR5cGUgPT0gXCJob3Jpem9udGFsXCJcblx0XHRkZWx0YU1vdmUgPSAoZGVjbGFyZWRDb25zdHJhaW50LndpZHRoIC0gbGF5ZXIud2lkdGgpIC8gMlxuXHRcdGxheWVyLnggPSBkZWNsYXJlZENvbnN0cmFpbnQueCArIGRlbHRhTW92ZVxuXHRpZiB0eXBlID09IFwidmVydGljYWxDZW50ZXJcIiB8fCB0eXBlID09IFwidmVydGljYWxcIiAgXG5cdFx0ZGVsdGFNb3ZlID0gKGRlY2xhcmVkQ29uc3RyYWludC5oZWlnaHQgLSBsYXllci5oZWlnaHQpIC8gMlxuXHRcdGxheWVyLnkgPSBkZWNsYXJlZENvbnN0cmFpbnQueSArIGRlbHRhTW92ZVxuXHRpZiB0eXBlID09IFwibGVhZGluZ0VkZ2VzXCIgXG5cdFx0bGF5ZXIueCA9IGRlY2xhcmVkQ29uc3RyYWludC54XG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJsZWFkaW5nXCJdID0gZXhwb3J0cy5wdChkZWNsYXJlZENvbnN0cmFpbnQueClcblx0aWYgdHlwZSA9PSBcInRyYWlsaW5nRWRnZXNcIlxuXHRcdGxheWVyLm1heFggPSBkZWNsYXJlZENvbnN0cmFpbnQubWF4WFxuXHRcdGxheWVyLmNvbnN0cmFpbnRzW1widHJhaWxpbmdcIl0gPSBleHBvcnRzLnB0KEBzdXBlckxheWVyLmhlaWdodCAtIGxheWVyLm1heFgpXG5cdGlmIHR5cGUgPT0gXCJ0b3BFZGdlc1wiXG5cdFx0bGF5ZXIueSA9IGRlY2xhcmVkQ29uc3RyYWludC55XG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJ0b3BcIl0gPSBleHBvcnRzLnB0KGxheWVyLnkpXG5cdGlmIHR5cGUgPT0gXCJib3R0b21FZGdlc1wiXG5cdFx0bGF5ZXIubWF4WSA9IGRlY2xhcmVkQ29uc3RyYWludC5tYXhZXG5cdFx0bGF5ZXIuY29uc3RyYWludHNbXCJib3R0b21cIl0gPSBleHBvcnRzLnB0KEBzdXBlckxheWVyLmhlaWdodCAtIGxheWVyLm1heFkpXG5cdGlmIHR5cGUgPT0gXCJhbGlnblwiXG5cdFx0aWYgZGVjbGFyZWRDb25zdHJhaW50ID09IFwiaG9yaXpvbnRhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJYKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJZKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJjZW50ZXJcIlxuXHRcdFx0bGF5ZXIuY2VudGVyKClcblx0XHRpZiBkZWNsYXJlZENvbnN0cmFpbnQgPT0gXCJ2ZXJ0aWNhbFwiXG5cdFx0XHRsYXllci5jZW50ZXJZKClcblxuXG5cbiNTaXplIENvbnN0cmFpbnRzXG5sYXlvdXRTaXplID0gKGxheWVyLCB0eXBlKSAtPlxuXHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXVxuXHRcdGxheWVyW3R5cGVdID0gZXhwb3J0cy5weChsYXllci5jb25zdHJhaW50c1t0eXBlXSlcblx0XHRpZiBsYXllci50eXBlID09IFwidGV4dFwiXG5cdFx0XHR0ZXh0RnJhbWUgPSB0ZXh0QXV0b1NpemUobGF5ZXIpXG5cdFx0XHRsYXllci53aWR0aCA9IHRleHRGcmFtZS53aWR0aFxuXHRcdFx0bGF5ZXIuaGVpZ2h0ID0gdGV4dEZyYW1lLmhlaWdodFxuXG4jTW92ZSAmIFJlc2l6ZXMgTGF5ZXJzXG5sYXlvdXRDaGFuZ2UgPSAobGF5ZXIsIHR5cGUpIC0+XG5cdGlmIGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdICE9IHVuZGVmaW5lZCBcblx0XHRwcm9wID0gZGVmYXVsdHMuY29uc3RyYWludHNbdHlwZV0ucHJvcFxuXHRcdG9ialByb3AgPSBkZWZhdWx0cy5jb25zdHJhaW50c1t0eXBlXS5vYmpQcm9wXG5cdFx0b3BwID0gZGVmYXVsdHMuY29uc3RyYWludHNbdHlwZV0ub3BwXG5cdFx0c3VwZXJUcmFpdCA9IGRlZmF1bHRzLmNvbnN0cmFpbnRzW3R5cGVdLm9ialByb3BcblxuXHRcdGlmIG9ialByb3AgIT0gXCJ3aWR0aFwiICYmIG9ialByb3AgIT0gXCJoZWlnaHRcIlxuXHRcdFx0c3VwZXJUcmFpdCA9IGRlZmF1bHRzLmNvbnN0cmFpbnRzW3R5cGVdLm9ialByb3AyXG5cblx0XHRpZiBsYXllci5zdXBlckxheWVyICE9IG51bGxcblx0XHRcdCNIYXMgYSBzdXBlckxheWVyXG5cdFx0XHRAW3N1cGVyVHJhaXRdID0gbGF5ZXIuc3VwZXJMYXllcltzdXBlclRyYWl0XVxuXHRcdGVsc2Vcblx0XHRcdCNEb2VzIG5vdCBoYXZlIGEgc3VwZXJMYXllclxuXHRcdFx0QFtzdXBlclRyYWl0XSA9IGV4cG9ydHNbc3VwZXJUcmFpdF1cblx0XHRpZiB0eXBlID09IFwidG9wXCIgfHwgdHlwZSA9PSBcImxlYWRpbmdcIlxuXHRcdFx0IyBIYW5kbGUgVG9wICYgTGVhZGluZ1xuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV0sIDEwKVxuXHRcdFx0XHRsYXllcltwcm9wXSA9IGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdICogZXhwb3J0cy5zY2FsZVxuXHRcdFx0ZWxzZSBcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bb2JqUHJvcF1cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IDFcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSA9PSBwYXJzZUludChsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSwgMTApXG5cdFx0XHRcdFx0XHRsYXllcltwcm9wXSA9IGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdWzBdICogZXhwb3J0cy5zY2FsZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF1bb2JqUHJvcF1cblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID4gMSBcblx0XHRcdFx0XHRmb3Igb2JqZWN0IGluIGxheWVyLmNvbnN0cmFpbnRzW3R5cGVdXG5cdFx0XHRcdFx0XHRpZiBvYmplY3QgPT0gcGFyc2VJbnQob2JqZWN0LCAxMClcblx0XHRcdFx0XHRcdFx0QC5vYmpJbnQgPSBvYmplY3Rcblx0XHRcdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0XHRcdEAub2JqTGF5ZXIgPSBvYmplY3Rcblx0XHRcdFx0XHRsYXllcltwcm9wXSA9IChALm9iakludCAqIGV4cG9ydHMuc2NhbGUpICsgQC5vYmpMYXllcltvYmpQcm9wXVxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXSAhPSB1bmRlZmluZWRcblx0XHRcdFx0dHJhaXQgPSBkZWZhdWx0cy5jb25zdHJhaW50c1tvcHBdW1wib2JqUHJvcFwiXVxuXHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1tvcHBdID09IHBhcnNlSW50KGxheWVyLmNvbnN0cmFpbnRzW29wcF0sIDEwKVxuXHRcdFx0XHRcdGxheWVyW3RyYWl0XSA9IEBbc3VwZXJUcmFpdF0gLSAobGF5ZXJbcHJvcF0gKyAoZXhwb3J0cy5zY2FsZSAqIGxheWVyLmNvbnN0cmFpbnRzW29wcF0pKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXS5sZW5ndGggPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRsYXllclt0cmFpdF0gPSBsYXllcltwcm9wXSAtIGxheWVyLmNvbnN0cmFpbnRzW29wcF1bcHJvcF1cblx0XHRcdFx0XHRcdGlmIGxheWVyW3RyYWl0XSA8IDBcblx0XHRcdFx0XHRcdFx0bGF5ZXJbdHJhaXRdID0gbGF5ZXJbdHJhaXRdICogLTFcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzdGFydFggPSBsYXllci54XG5cdFx0XHRcdFx0XHRlbmRYID0gMFxuXHRcdFx0XHRcdFx0Zm9yIG9iamVjdCBpbiBsYXllci5jb25zdHJhaW50c1tvcHBdXG5cdFx0XHRcdFx0XHRcdCMgSWYgaXQncyBhIG51bWJlclxuXHRcdFx0XHRcdFx0XHRpZiBvYmplY3QgPT0gcGFyc2VJbnQob2JqZWN0LCAxMClcblx0XHRcdFx0XHRcdFx0XHRlbmRYID0gZW5kWCAtIG9iamVjdFxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZW5kVHJhaXQgPSBkZWZhdWx0cy5jb25zdHJhaW50c1tvcHBdLm9ialByb3AyXG5cdFx0XHRcdFx0XHRcdFx0ZW5kWCA9IGVuZFggKyBvYmplY3RbZW5kVHJhaXRdXG5cdFx0XHRcdFx0XHRsYXllci53aWR0aCA9IGVuZFggLSBzdGFydFhcblx0XHRcdFx0XHRcdFxuXHRcdGVsc2Vcblx0XHRcdCMjIEhhbmRsZSBCb3R0b20gJiBUcmFpbGluZ1xuXHRcdFx0b2JqUHJvcDIgPSBkZWZhdWx0cy5jb25zdHJhaW50c1t0eXBlXS5vYmpQcm9wMlxuXHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbb3BwXSA9PSB1bmRlZmluZWRcblx0XHRcdFx0IyMgTm8gb3Bwb3NpdGVcblx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV0sIDEwKVxuXHRcdFx0XHRcdCMjIE9ubHkgSW50ZWdlclxuXHRcdFx0XHRcdGxheWVyW3Byb3BdID0gQFtzdXBlclRyYWl0XSAtIChsYXllci5jb25zdHJhaW50c1t0eXBlXSAqIGV4cG9ydHMuc2NhbGUpXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0ubGVuZ3RoID09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0I0VudGVyZWQgTGF5ZXJcblx0XHRcdFx0XHRcdGlmIGV4cG9ydHMuc2FtZVBhcmVudChsYXllciwgbGF5ZXIuY29uc3RyYWludHNbdHlwZV0pXG5cdFx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bb2JqUHJvcDJdXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGVycm9yKGxheWVyLCAxMClcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXS5sZW5ndGggPT0gMVxuXHRcdFx0XHRcdFx0I0FycmF5IG9mIE9uZVxuXHRcdFx0XHRcdFx0aWYgbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0gPT0gcGFyc2VJbnQobGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0sIDEwKVxuXHRcdFx0XHRcdFx0XHQjSW50XG5cdFx0XHRcdFx0XHRcdGxheWVyW3Byb3BdID0gQFtvYmpQcm9wXSAtIChsYXllci5jb25zdHJhaW50c1t0eXBlXVswXSAqIGV4cG9ydHMuc2NhbGUpXG5cdFx0XHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdFx0XHQjT2JqZWN0XG5cdFx0XHRcdFx0XHRcdGlmIGV4cG9ydHMuc2FtZVBhcmVudChsYXllciwgbGF5ZXIuY29uc3RyYWludHNbdHlwZV1bMF0pXG5cdFx0XHRcdFx0XHRcdFx0bGF5ZXJbcHJvcF0gPSBsYXllci5jb25zdHJhaW50c1t0eXBlXVswXVtvYmpQcm9wMl1cblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGVycm9yKGxheWVyLCAxMClcblx0XHRcdFx0XHRpZiBsYXllci5jb25zdHJhaW50c1t0eXBlXS5sZW5ndGggPiAxXHRcblx0XHRcdFx0XHRcdCNSZWxhdGlvbnNoaXAgQXJyYXlcblx0XHRcdFx0XHRcdGZvciBvYmplY3QgaW4gbGF5ZXIuY29uc3RyYWludHNbdHlwZV1cblx0XHRcdFx0XHRcdFx0aWYgb2JqZWN0ID09IHBhcnNlSW50KG9iamVjdCwgMTApXG5cdFx0XHRcdFx0XHRcdFx0QC5vYmpJbnQgPSBvYmplY3Rcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdEAub2JqTGF5ZXIgPSBvYmplY3Rcblx0XHRcdFx0XHRcdFx0bGF5ZXJbcHJvcF0gPSBALm9iakxheWVyW29ialByb3AyXSAtIGV4cG9ydHMuc2NhbGUgKiBALm9iakludFxuI1RleHQgTGF5ZXJzXG5leHBvcnRzLnN0eWxlcyA9IHt9XG5cbmV4cG9ydHMuYmdCbHVyID0gKGxheWVyKSAtPlxuXHRsYXllci5zdHlsZVtcIi13ZWJraXQtYmFja2Ryb3AtZmlsdGVyXCJdID0gXCJibHVyKCN7ZXhwb3J0cy5weCg1KX1weClcIlxuXHRyZXR1cm4gbGF5ZXIgXG5cbnRleHRBdXRvU2l6ZSA9ICh0ZXh0TGF5ZXIpIC0+XG5cdCNEZWZpbmUgV2lkdGhcblx0Y29uc3RyYWludHMgPSB7fVxuXHRpZiB0ZXh0TGF5ZXIuY29uc3RyYWludHMgXG5cdFx0aWYgdGV4dExheWVyLmNvbnN0cmFpbnRzLmhlaWdodFxuXHRcdFx0Y29uc3RyYWludHMuaGVpZ2h0ID0gZXhwb3J0cy5weCh0ZXh0TGF5ZXIuY29uc3RyYWludHMuaGVpZ2h0KVxuXHRcdGlmIHRleHRMYXllci5jb25zdHJhaW50cy53aWR0aFxuXHRcdFx0Y29uc3RyYWludHMud2lkdGggPSBleHBvcnRzLnB4KHRleHRMYXllci5jb25zdHJhaW50cy53aWR0aClcblx0c3R5bGVzID1cblx0XHRmb250U2l6ZTogdGV4dExheWVyLnN0eWxlW1wiZm9udC1zaXplXCJdXG5cdFx0Zm9udEZhbWlseTogdGV4dExheWVyLnN0eWxlW1wiZm9udC1mYW1pbHlcIl1cblx0XHRmb250V2VpZ2h0OiB0ZXh0TGF5ZXIuc3R5bGVbXCJmb250LXdlaWdodFwiXVxuXHRcdGxpbmVIZWlnaHQ6IHRleHRMYXllci5zdHlsZVtcImxpbmUtaGVpZ2h0XCJdXG5cdFx0bGV0dGVyU3BhY2luZzogdGV4dExheWVyLnN0eWxlW1wibGV0dGVyLXNwYWNpbmdcIl1cblx0XHR0ZXh0VHJhbnNmb3JtOiB0ZXh0TGF5ZXIuc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXVxuXHR0ZXh0V2lkdGggPSBVdGlscy50ZXh0U2l6ZSB0ZXh0TGF5ZXIuaHRtbCwgc3R5bGVzLCBjb25zdHJhaW50c1xuXHRyZXR1cm4ge1xuXHRcdHdpZHRoIDogdGV4dFdpZHRoLndpZHRoXG5cdFx0aGVpZ2h0OiB0ZXh0V2lkdGguaGVpZ2h0XG5cdH1cblxubGlzdGVuVG9LZXlzID0gKGZpZWxkLCBrZXlib2FyZCkgLT5cblxuXHRrZXlwcmVzcyA9IChrZXkpIC0+XG5cdFx0b3JpZ2luYWxDb2xvciA9IGtleS5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRzd2l0Y2gga2V5Lm5hbWVcblx0XHRcdHdoZW4gXCJzaGlmdFwiXG5cdFx0XHRcdGtleS5pY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblx0XHRcdFx0a2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0d2hlbiBcImRlbGV0ZVwiXG5cdFx0XHRcdGtleS5pY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblx0XHRcdFx0a2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0XHRrZXkuaWNvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcIm9uXCIpXG5cdFx0XHR3aGVuIFwic3BhY2VcIlxuXHRcdFx0XHRrZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSAhPSBcImlwYWRcIlxuXHRcdFx0XHRcdGtleWJvYXJkLmtleVBvcFVwLnZpc2libGUgPSB0cnVlXHRcblx0XHRcdFx0XHRib3hLZXkgPSBrZXkubmFtZVxuXHRcdFx0XHRcdGlmIGlzU2hpZnRcblx0XHRcdFx0XHRcdGJveEtleSA9IGJveEtleS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0a2V5Ym9hcmQua2V5UG9wVXAuYm94Lmh0bWwgPSBib3hLZXlcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlQb3BVcC5tYXhZID0ga2V5Lm1heFlcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlQb3BVcC5taWRYID0ga2V5Lm1pZFhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGtleS5hbmltYXRlXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHRcdHRpbWU6LjJcblxuXHRpc0NvbW1hbmQgPSBmYWxzZVxuXHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdGlzU2hpZnQgPSBmYWxzZVxuXHRjb2RlcyA9IHtcblx0XHQxMzpcIjxicj5cIlxuXHRcdDMyOlwiJm5ic3A7XCJcblx0XHQzMzpcIiFcIlxuXHRcdDM0OlwiXFxcIlwiXG5cdFx0MzU6XCIjXCJcblx0XHQzNjpcIiRcIlxuXHRcdDM3OlwiJVwiXG5cdFx0Mzg6XCImXCJcblx0XHQzOTpcIlxcJ1wiXG5cdFx0NDA6XCIoXCJcblx0XHQ0MTpcIilcIlxuXHRcdDQyOlwiKlwiXG5cdFx0NDM6XCIrXCJcblx0XHQ0NDpcIixcIlxuXHRcdDQ1OlwiLVwiXG5cdFx0NDc6XCIvXCJcblx0XHQ0NjpcIi5cIlxuXHRcdDQ4OlwiMFwiXG5cdFx0NDk6XCIxXCJcblx0XHQ1MDpcIjJcIlxuXHRcdDUxOlwiM1wiXG5cdFx0NTI6XCI0XCJcblx0XHQ1MzpcIjVcIlxuXHRcdDU0OlwiNlwiXG5cdFx0NTU6XCI3XCJcblx0XHQ1NjpcIjhcIlxuXHRcdDU3OlwiOVwiXG5cdFx0NTg6XCI6XCJcblx0XHQ1OTpcIjtcIlxuXHRcdDYwOlwiPFwiXG5cdFx0NjE6XCI9XCJcblx0XHQ2MjpcIj5cIlxuXHRcdDYzOlwiP1wiXG5cdFx0NjQ6XCJAXCJcblx0XHQ2NTpcIkFcIlxuXHRcdDY2OlwiQlwiXG5cdFx0Njc6XCJDXCJcblx0XHQ2ODpcIkRcIlxuXHRcdDY5OlwiRVwiXG5cdFx0NzA6XCJGXCJcblx0XHQ3MTpcIkdcIlxuXHRcdDcyOlwiSFwiXG5cdFx0NzM6XCJJXCJcblx0XHQ3NDpcIkpcIlxuXHRcdDc1OlwiS1wiXG5cdFx0NzY6XCJMXCJcblx0XHQ3NzpcIk1cIlxuXHRcdDc4OlwiTlwiXG5cdFx0Nzk6XCJPXCJcblx0XHQ4MDpcIlBcIlxuXHRcdDgxOlwiUVwiXG5cdFx0ODI6XCJSXCJcblx0XHQ4MzpcIlNcIlxuXHRcdDg0OlwiVFwiXG5cdFx0ODU6XCJVXCJcblx0XHQ4NjpcIlZcIlxuXHRcdDg3OlwiV1wiXG5cdFx0ODg6XCJYXCJcblx0XHQ4OTpcIllcIlxuXHRcdDkwOlwiWlwiXG5cdFx0OTE6XCJbXCJcblx0XHQ5MjpcIlxcXFxcIlxuXHRcdDkzOlwiXVwiXG5cdFx0OTQ6XCJeXCJcblx0XHQ5NTpcIl9cIlxuXHRcdDk2OlwiYFwiXG5cdFx0OTc6XCJhXCJcblx0XHQ5ODpcImJcIlxuXHRcdDk5OlwiY1wiXG5cdFx0MTAwOlwiZFwiXG5cdFx0MTAxOlwiZVwiXG5cdFx0MTAyOlwiZlwiXG5cdFx0MTAzOlwiZ1wiXG5cdFx0MTA0OlwiaFwiXG5cdFx0MTA1OlwiaVwiXG5cdFx0MTA2OlwialwiXG5cdFx0MTA3Olwia1wiXG5cdFx0MTA4OlwibFwiXG5cdFx0MTA5OlwibVwiXG5cdFx0MTEwOlwiblwiXG5cdFx0MTExOlwib1wiXG5cdFx0MTEyOlwicFwiXG5cdFx0MTEzOlwicVwiXG5cdFx0MTE0OlwiclwiXG5cdFx0MTE1Olwic1wiXG5cdFx0MTE2OlwidFwiXG5cdFx0MTE3OlwidVwiXG5cdFx0MTE4OlwidlwiXG5cdFx0MTE5Olwid1wiXG5cdFx0MTIwOlwieFwiXG5cdFx0MTIxOlwieVwiXG5cdFx0MTIyOlwielwiXG5cdFx0MTIzOlwie1wiXG5cdFx0MTI0OlwifFwiXG5cdFx0MTI1OlwifVwiXG5cdFx0MTI2OlwiflwiXG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpIC0+XG5cdFx0aWYgZmllbGQuYWN0aXZlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMjdcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOih5OmV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0XHRcdGZpZWxkLmFjdGl2ZSA9IGZhbHNlXG5cdFx0XHRcdGZpZWxkLmNsaWNrWm9uZS5kZXN0cm95KClcblx0XHRcdGlmIGUua2V5Q29kZSA9PSAxNlxuXHRcdFx0XHRpc1NoaWZ0ID0gdHJ1ZVxuXHRcdFx0XHRpZiBrZXlib2FyZFxuXHRcdFx0XHRcdGtleXByZXNzKGtleWJvYXJkLmtleXMuc2hpZnQpXG5cdFx0XHRcdFx0Zm9yIGsgaW4ga2V5Ym9hcmQua2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrLnN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl0gPSBcInVwcGVyY2FzZVwiXG5cdFx0XHRpZiBhbGxTZWxlY3RlZCA9PSB0cnVlXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA9PSAzNyB8fCBlLmtleUNvZGUgPT0gMzlcblx0XHRcdFx0XHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdFx0XHRcdFx0ZmllbGQudGV4dC5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRcdGlmIGUua2V5Q29kZSA9PSA5MVxuXHRcdFx0XHRpc0NvbW1hbmQgPSB0cnVlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMTNcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGtleWJvYXJkLmtleXMucmV0dXJuLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gOFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0aWYga2V5Ym9hcmRcblx0XHRcdFx0XHRrZXlwcmVzcyhrZXlib2FyZC5rZXlzLmRlbGV0ZSlcblx0XHRcdFx0aWYgYWxsU2VsZWN0ZWQgPT0gdHJ1ZVxuXHRcdFx0XHRcdGV4cG9ydHMudXBkYXRlKGZpZWxkLnRleHQsIFt0ZXh0OlwiXCJdKVxuXHRcdFx0XHRcdGZpZWxkLnRleHQuYmFja2dyb3VuZENvbG9yID1cInRyYW5zcGFyZW50XCJcblx0XHRcdFx0XHRhbGxTZWxlY3RlZCA9IGZhbHNlXG5cdFx0XHRcdGluaXRpYWxMZW5ndGggPSBmaWVsZC50ZXh0Lmh0bWwubGVuZ3RoXG5cdFx0XHRcdG5ld1RleHQgPSBmaWVsZC50ZXh0Lmh0bWwuc2xpY2UoMCwgLTEpXG5cdFx0XHRcdGV4cG9ydHMudXBkYXRlKGZpZWxkLnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0XHRlbmRMZW5ndGggPSBmaWVsZC50ZXh0Lmh0bWwubGVuZ3RoXG5cdFx0XHRcdGlmIGluaXRpYWxMZW5ndGggPT0gZW5kTGVuZ3RoXG5cdFx0XHRcdFx0bmV3VGV4dCA9IGZpZWxkLnRleHQuaHRtbC5zbGljZSgwLCAtNilcblx0XHRcdFx0XHRleHBvcnRzLnVwZGF0ZShmaWVsZC50ZXh0LCBbdGV4dDpuZXdUZXh0XSlcblx0XHRcdFx0aWYgZmllbGQudGV4dC5odG1sID09IFwiXCJcblx0XHRcdFx0XHRmaWVsZC5wbGFjZWhvbGRlci52aXNpYmxlID0gdHJ1ZVxuXG5cdFx0XHRcdCMgR2V0IHJpZCBvZiAmIG5ic3A7XG5cblx0XHRcdFx0ZmllbGQudmFsdWUgPSBleHBvcnRzLmNsZWFuKG5ld1RleHQpXG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAna2V5dXAnLCAoZSkgLT5cblx0XHRpZiBmaWVsZC5hY3RpdmVcblx0XHRcdGlmIGUua2V5Q29kZSA9PSAxMyAmJiBrZXlib2FyZFxuXHRcdFx0XHRrZXlib2FyZC5rZXlzLnJldHVybi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMzIgJiYga2V5Ym9hcmRcblx0XHRcdFx0a2V5Ym9hcmQua2V5cy5zcGFjZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIldoaXRlXCJcblx0XHRcdGlmIGUua2V5Q29kZSA9PSA4ICYmIGtleWJvYXJkXG5cdFx0XHRcdGtleWJvYXJkLmtleXMuZGVsZXRlLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHR0aW1lOi4xXG5cdFx0XHRcdGtleWJvYXJkLmtleXMuZGVsZXRlLmljb24uc3RhdGVzLnN3aXRjaChcIm9mZlwiKVxuXHRcdFx0aWYgZS5rZXlDb2RlID09IDkxXG5cdFx0XHRcdGlzQ29tbWFuZCA9IGZhbHNlXG5cdFx0XHRpZiBlLmtleUNvZGUgPT0gMTZcblx0XHRcdFx0aXNTaGlmdCA9IGZhbHNlXG5cdFx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdFx0Zm9yIGsgaW4ga2V5Ym9hcmQua2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrLnN0eWxlW1widGV4dC10cmFuc2Zvcm1cIl0gPSBcImxvd2VyY2FzZVwiXG5cdFx0XHRcdFx0a2V5Ym9hcmQua2V5cy5zaGlmdC5hbmltYXRlXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSlcblx0XHRcdFx0XHRcdHRpbWU6LjJcblx0XHRcdFx0XHRrZXlib2FyZC5rZXlzLnNoaWZ0Lmljb24uc3RhdGVzLm5leHQoKVxuXHRcdFx0aWYgZS5rZXlDb2RlID49IDY1ICYmIGUua2V5Q29kZSA8PSA5MFxuXHRcdFx0XHRpZiBrZXlib2FyZCAmJiBleHBvcnRzLmRldmljZSAhPSBcImlwYWRcIlxuXHRcdFx0XHRcdGtleWJvYXJkLmtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0ayA9IGtleWJvYXJkLmtleXNbY29kZXNbZS5rZXlDb2RlXS50b0xvd2VyQ2FzZSgpXVxuXHRcdFx0XHRcdGsuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0cHJvcGVydGllczooYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIilcblx0XHRcdFx0XHRcdHRpbWU6LjJcblxuXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ2tleXByZXNzJywgKGUpIC0+XG5cdFx0aWYgZmllbGQuYWN0aXZlIFxuXHRcdFx0Y2hhciA9IGNvZGVzW2Uua2V5Q29kZV1cblx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdGtleSA9IGtleWJvYXJkLmtleXNbY2hhcl1cblx0XHRcdGlmIGlzQ29tbWFuZCA9PSB0cnVlXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA9PSA5N1xuXHRcdFx0XHRcdGZpZWxkLnRleHQuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDAsIDExOCwgMjU1LCAuMilcIlxuXHRcdFx0XHRcdGFsbFNlbGVjdGVkID0gdHJ1ZVxuXG5cdFx0XHRpZiBpc0NvbW1hbmQgPT0gZmFsc2Vcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+PSA2NSAmJiBlLmtleUNvZGUgPD0gOTBcblx0XHRcdFx0XHRjaGFyMiA9IGNoYXIudG9Mb3dlckNhc2UoKVxuXHRcdFx0XHRcdGlmIGtleWJvYXJkXG5cdFx0XHRcdFx0XHRrZXkgPSBrZXlib2FyZC5rZXlzW2NoYXIyXVxuXHRcdFx0XHRcdFx0a2V5cHJlc3Moa2V5KVxuXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+PSA5NyAmJiBlLmtleUNvZGUgPD0gMTIyIHx8IGUua2V5Q29kZSA9PSAzMlx0XHRcblx0XHRcdFx0XHRpZiBrZXlib2FyZFxuXHRcdFx0XHRcdFx0a2V5cHJlc3Moa2V5KVxuXG5cdFx0XHRcdGlmIGUua2V5Q29kZSA+IDMxXG5cdFx0XHRcdFx0bmV3VGV4dCA9IGZpZWxkLnRleHQuaHRtbCArIGNoYXJcblx0XHRcdFx0XHRleHBvcnRzLnVwZGF0ZShmaWVsZC50ZXh0LCBbdGV4dDpuZXdUZXh0XSlcblx0XHRcdFx0XHRmaWVsZC52YWx1ZSA9IGV4cG9ydHMuY2xlYW4obmV3VGV4dClcblxuZXhwb3J0cy51cGRhdGUgPSAobGF5ZXIsIGFycmF5KSAtPlxuXHRpZiBhcnJheSA9PSB1bmRlZmluZWRcblx0XHRhcnJheSA9IFtdXG5cdGlmIGxheWVyLnR5cGUgPT0gXCJ0ZXh0XCJcblx0XHRmb3IgY2hhbmdlIGluIGFycmF5XG5cdFx0XHRrZXkgPSBPYmplY3Qua2V5cyhjaGFuZ2UpWzBdXG5cdFx0XHR2YWx1ZSA9IGNoYW5nZVtrZXldXG5cdFx0XHRpZiBrZXkgPT0gXCJ0ZXh0XCJcblx0XHRcdFx0bGF5ZXIuaHRtbCA9IHZhbHVlXG5cdFx0XHRpZiBrZXkgPT0gXCJmb250V2VpZ2h0XCJcblx0XHRcdFx0bGF5ZXIuc3R5bGVba2V5XSA9IHZhbHVlXG5cdFx0XHRpZiBrZXkgPT0gXCJjb2xvclwiXG5cdFx0XHRcdGxheWVyLmNvbG9yID0gZXhwb3J0cy5jb2xvcih2YWx1ZSlcblxuXHRcdHRleHRGcmFtZSA9IHRleHRBdXRvU2l6ZShsYXllcilcblx0XHRsYXllci53aWR0aCA9IHRleHRGcmFtZS53aWR0aFxuXHRcdGxheWVyLmhlaWdodCA9IHRleHRGcmFtZS5oZWlnaHRcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuZXhwb3J0cy50aW1lRGVsZWdhdGUgPSAobGF5ZXIsIGNsb2NrVHlwZSkgLT5cblx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRVdGlscy5kZWxheSA2MCAtIEB0aW1lLnNlY3MsIC0+XG5cdFx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRcdGV4cG9ydHMudXBkYXRlKGxheWVyLCBbdGV4dDpleHBvcnRzLnRpbWVGb3JtYXR0ZXIoQHRpbWUsIGNsb2NrVHlwZSldKVxuXHRcdFV0aWxzLmludGVydmFsIDYwLCAtPlxuXHRcdFx0QHRpbWUgPSBleHBvcnRzLmdldFRpbWUoKVxuXHRcdFx0ZXhwb3J0cy51cGRhdGUobGF5ZXIsIFt0ZXh0OmV4cG9ydHMudGltZUZvcm1hdHRlcihAdGltZSwgY2xvY2tUeXBlKV0pXG4gXG5leHBvcnRzLnRpbWVGb3JtYXR0ZXIgPSAodGltZU9iaiwgY2xvY2tUeXBlKSAtPlxuXHRpZiBjbG9ja1R5cGUgPT0gZmFsc2UgXG5cdFx0aWYgdGltZU9iai5ob3VycyA+IDEyXG5cdFx0XHR0aW1lT2JqLmhvdXJzID0gdGltZU9iai5ob3VycyAtIDEyXG5cdFx0aWYgdGltZU9iai5ob3VycyA9PSAwIHRoZW4gdGltZU9iai5ob3VycyA9IDEyXG5cdGlmIHRpbWVPYmoubWlucyA8IDEwXG5cdFx0dGltZU9iai5taW5zID0gXCIwXCIgKyB0aW1lT2JqLm1pbnNcblx0cmV0dXJuIHRpbWVPYmouaG91cnMgKyBcIjpcIiArIHRpbWVPYmoubWluc1xuXG4jIyBDb21wb25lbnRzIFxuZXhwb3J0cy5BbGVydCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcImFsZXJ0XCIsIGFycmF5KVxuXHRhbGVydCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYWxlcnRcIlxuXHRhbGVydC5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdG92ZXJsYXkgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwicmdiYSgwLDAsMCwuMylcIiwgc3VwZXJMYXllcjphbGVydCwgbmFtZTpcIm92ZXJsYXlcIlxuXHRvdmVybGF5LmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0dG9wOjBcblx0XHRib3R0b206MFxuXHRtb2RhbCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ3aGl0ZVwiLCBzdXBlckxheWVyOmFsZXJ0LCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIG5hbWU6XCJtb2RhbFwiLCB4OjkyLCB5OjUzN1xuXHRtb2RhbC5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJjZW50ZXJcIlxuXHRcdHdpZHRoOjI4MFxuXHRcdGhlaWdodDo0MDBcblx0dGl0bGUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRUaXRsZVwiLCBzdXBlckxheWVyOm1vZGFsLCB0ZXh0OnNldHVwLnRpdGxlLCBmb250V2VpZ2h0Olwic2VtaWJvbGRcIiwgIG5hbWU6XCJ0aXRsZVwiLCB0ZXh0QWxpZ246XCJjZW50ZXJcIiwgbGluZUhlaWdodDoyMFxuXHR0aXRsZS5jb25zdHJhaW50cyA9IFxuXHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0d2lkdGg6MjIwXG5cdFx0dG9wOjIwXG5cdG1lc3NhZ2UgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRNZXNzYWdlXCIsIHRleHQ6c2V0dXAubWVzc2FnZSwgZm9udFNpemU6MTMsIHN1cGVyTGF5ZXI6bW9kYWwsIHRleHRBbGlnbjpcImNlbnRlclwiLCBsaW5lSGVpZ2h0OjE2LCB3aWR0aDoyNDAsIG5hbWU6XCJtZXNzYWdlXCJcblx0bWVzc2FnZS5jb25zdHJhaW50cyA9XG5cdFx0dG9wOiBbdGl0bGUsIDEwXVxuXHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0d2lkdGg6IDIyMFxuXHRkaXZpZGVyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bW9kYWwsIGJhY2tncm91bmRDb2xvcjpcIiNFMkU4RUJcIiwgbmFtZTpcImhvcml6b250YWwgZGl2aWRlclwiXG5cdGRpdmlkZXIuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjFcblx0XHRib3R0b206NDRcblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcblx0I1RpdGxlICsgTWVzc2FnZSArIDEgc2V0IG9mIGFjdGlvbnNcblx0bW9kYWwuY29uc3RyYWludHNbXCJoZWlnaHRcIl0gPSAyMCArIGV4cG9ydHMucHQodGl0bGUuaGVpZ2h0KSArIDEwICsgZXhwb3J0cy5wdChtZXNzYWdlLmhlaWdodCkgKyAyNCArIDQ0XG5cblx0YWN0aW9ucyA9IFtdXG5cdHN3aXRjaCBzZXR1cC5hY3Rpb25zLmxlbmd0aFxuXHRcdHdoZW4gMVxuXHRcdFx0YWN0TGFiZWwgPSBleHBvcnRzLmNhcGl0YWxpemUoc2V0dXAuYWN0aW9uc1swXSlcblx0XHRcdGFjdGlvbiA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOnNldHVwLmFjdGlvbnNbMF0sIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKVxuXHRcdFx0YWN0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdGxlYWRpbmc6MFxuXHRcdFx0XHR0cmFpbGluZzowXG5cdFx0XHRcdGJvdHRvbTowXG5cdFx0XHRcdGhlaWdodDo0NFxuXHRcdFx0YWN0aW9uLmxhYmVsID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImFsZXJ0QWN0aW9uXCIsIGNvbG9yOmV4cG9ydHMuY29sb3IoXCJibHVlXCIpLCBzdXBlckxheWVyOmFjdGlvbiwgdGV4dDphY3RMYWJlbCwgbmFtZTpcImxhYmVsXCJcblx0XHRcdGFjdGlvbi5sYWJlbC5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0XHRib3R0b206MTZcblx0XHRcdGFjdGlvbnMucHVzaCBhY3Rpb25cblx0XHR3aGVuIDJcblx0XHRcdGFjdExhYmVsID0gZXhwb3J0cy5jYXBpdGFsaXplKHNldHVwLmFjdGlvbnNbMF0pXG5cdFx0XHRhY3Rpb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjptb2RhbCwgbmFtZTpzZXR1cC5hY3Rpb25zWzBdLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRcdGFjdGlvbi5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRsZWFkaW5nOjBcblx0XHRcdFx0dHJhaWxpbmc6ZXhwb3J0cy5wdChtb2RhbC53aWR0aC8yKVxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdGFjdGlvbi5sYWJlbCA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJhbGVydEFjdGlvblwiLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmx1ZVwiKSwgc3VwZXJMYXllcjphY3Rpb24sIHRleHQ6YWN0TGFiZWwsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRhY3Rpb24ubGFiZWwuY29uc3RyYWludHMgPSBcblx0XHRcdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHRcdFx0Ym90dG9tOjE2XG5cdFx0XHRhY3Rpb25zLnB1c2ggYWN0aW9uXHRcdFxuXG5cdFx0XHR2ZXJ0RGl2aWRlciA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRTJFOEVCXCIsIG5hbWU6XCJ2ZXJ0aWNhbCBkaXZpZGVyXCJcblx0XHRcdHZlcnREaXZpZGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdHdpZHRoOjFcblx0XHRcdFx0Ym90dG9tOjBcblx0XHRcdFx0aGVpZ2h0OjQ0XG5cdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cblx0XHRcdGFjdExhYmVsMiA9IGV4cG9ydHMuY2FwaXRhbGl6ZShzZXR1cC5hY3Rpb25zWzFdKVxuXHRcdFx0YWN0aW9uMiA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBuYW1lOnNldHVwLmFjdGlvbnNbMV0sIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKSwgYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIlxuXHRcdFx0YWN0aW9uMi5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRsZWFkaW5nOmV4cG9ydHMucHQobW9kYWwud2lkdGgvMilcblx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdGFjdGlvbjIubGFiZWwgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYWxlcnRBY3Rpb25cIiwgY29sb3I6ZXhwb3J0cy5jb2xvcihcImJsdWVcIiksIHN1cGVyTGF5ZXI6YWN0aW9uMiwgdGV4dDphY3RMYWJlbDIsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRhY3Rpb24yLmxhYmVsLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHRcdGJvdHRvbToxNlxuXHRcdFx0YWN0aW9ucy5wdXNoIGFjdGlvbjJcblx0XHRlbHNlXG5cdFx0XHRmb3IgYWN0LCBpbmRleCBpbiBzZXR1cC5hY3Rpb25zXG5cdFx0XHRcdGFjdExhYmVsID0gZXhwb3J0cy5jYXBpdGFsaXplKGFjdClcblx0XHRcdFx0YWN0aW9uID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bW9kYWwsIG5hbWU6YWN0LCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCgxMCksIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcblx0XHRcdFx0YWN0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRcdGJvdHRvbTowICsgKChzZXR1cC5hY3Rpb25zLmxlbmd0aCAtIGluZGV4IC0gMSkgKiA0NClcblx0XHRcdFx0XHRoZWlnaHQ6NDRcblx0XHRcdFx0YWN0aW9uRGl2aWRlciA9IG5ldyBMYXllciBzdXBlckxheWVyOm1vZGFsLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRTJFOEVCXCIsIG5hbWU6XCJob3Jpem9udGFsIGRpdmlkZXJcIlxuXHRcdFx0XHRhY3Rpb25EaXZpZGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdFx0dHJhaWxpbmc6MFxuXHRcdFx0XHRcdGhlaWdodDoxXG5cdFx0XHRcdFx0Ym90dG9tOjAgKyAoKHNldHVwLmFjdGlvbnMubGVuZ3RoIC0gaW5kZXgpICogNDQpXG5cdFx0XHRcdGFjdGlvbi5sYWJlbCA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJhbGVydEFjdGlvblwiLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmx1ZVwiKSwgc3VwZXJMYXllcjphY3Rpb24sIHRleHQ6YWN0TGFiZWwsIG5hbWU6XCJsYWJlbFwiXG5cdFx0XHRcdGFjdGlvbi5sYWJlbC5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHRcdFx0Ym90dG9tOjE0XG5cdFx0XHRcdGFjdGlvbnMucHVzaCBhY3Rpb25cdFx0XG5cdFx0XHRcdG1vZGFsLmNvbnN0cmFpbnRzW1wiaGVpZ2h0XCJdID0gbW9kYWwuY29uc3RyYWludHNbXCJoZWlnaHRcIl0gKyA0MiAtIDEyXG5cblx0YWxlcnQuYWN0aW9ucyA9IHt9XHRcblx0Zm9yIGFjdCxpbmRleCBpbiBhY3Rpb25zXG5cblx0XHQjSGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVyc1xuXHRcdGFjdC50eXBlID0gXCJidXR0b25cIlxuXHRcdHNwZWNpYWxDaGFyKGFjdClcblx0XHRcblx0XHRpZiBzZXR1cC5hY3Rpb25zW2luZGV4XS5pbmRleE9mKFwiLXJcIikgPT0gMFxuXHRcdFx0YWN0Lm9yaWdDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJyZWRcIilcblx0XHRlbHNlXG5cdFx0XHRhY3Qub3JpZ0NvbG9yID0gZXhwb3J0cy5jb2xvcihcImJsdWVcIilcblxuXHRcdCNBZGQgVG91Y2ggRXZlbnRzXG5cdFx0YWN0Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0QC5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRcdEAuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6YWN0LmJhY2tncm91bmRDb2xvci5kYXJrZW4oNSkpXG5cdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRALmxhYmVsLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooY29sb3I6QC5vcmlnQ29sb3IubGlnaHRlbigxMCkpXG5cdFx0XHRcdHRpbWU6LjI1XG5cblx0XHRhY3Qub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdFx0QC5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCIpXG5cdFx0XHRcdHRpbWU6LjI1XG5cdFx0XHRALmxhYmVsLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooY29sb3I6QC5vcmlnQ29sb3IpXG5cdFx0XHRcdHRpbWU6LjI1XG5cblx0XHQjIEV4cG9ydCBhY3Rpb25zXG5cdFx0YWxlcnQuYWN0aW9uc1thY3QubmFtZV0gPSBhY3RcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHQjIEV4cG9ydCBhbGVydFxuXHRhbGVydC5vdmVybGF5ID0gb3ZlcmxheVxuXHRhbGVydC5tb2RhbCA9IG1vZGFsXG5cdGFsZXJ0LnRpdGxlID0gdGl0bGVcblx0YWxlcnQubWVzc2FnZSA9IG1lc3NhZ2VcblxuXHRyZXR1cm4gYWxlcnRcblxuZXhwb3J0cy5CYW5uZXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJiYW5uZXJcIiwgYXJyYXkpXG5cdGJhbm5lciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYmFubmVyXCJcblx0YmFubmVyLmh0bWwgPSBleHBvcnRzLnN2ZyhiYW5uZXJCR1tleHBvcnRzLmRldmljZV0pLnN2Z1xuXHRiYW5uZXIuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGhlaWdodDo2OFxuXG5cdCMgRGlmZmVyZW50IHBvc2l0aW9uaW5ncyBmb3IgZWFjaCBkZXZpY2Vcblx0c3dpdGNoIGV4cG9ydHMuZGV2aWNlIFxuXHRcdHdoZW4gXCJpcGFkXCIgXG5cdFx0XHRAbGVhZGluZ0ljb24gPSAyMDBcblx0XHRcdEB0b3BJY29uID0gMTVcblx0XHRcdEB0b3BUaXRsZSA9IDExXG5cdFx0d2hlbiBcImlwYWQtcHJvXCJcblx0XHRcdEBsZWFkaW5nSWNvbiA9IDE5MlxuXHRcdFx0QHRvcEljb24gPSAxMlxuXHRcdFx0QHRvcFRpdGxlID0gOVxuXHRcdGVsc2Vcblx0XHRcdEBsZWFkaW5nSWNvbiA9IDE1XG5cdFx0XHRAdG9wSWNvbiA9IDhcblx0XHRcdEB0b3BUaXRsZSA9IDVcblxuXHRpZiBzZXR1cC5pY29uID09IHVuZGVmaW5lZFxuXHRcdHNldHVwLmljb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpiYW5uZXJcblx0XHRzZXR1cC5pY29uLnN0eWxlW1wiYmFja2dyb3VuZFwiXSA9IFwibGluZWFyLWdyYWRpZW50KC0xODBkZWcsICM2N0ZGODEgMCUsICMwMUI0MUYgMTAwJSlcIlxuXHRlbHNlXG5cdFx0YmFubmVyLmFkZFN1YkxheWVyKHNldHVwLmljb24pXG5cblx0c2V0dXAuaWNvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDQuNSlcblx0c2V0dXAuaWNvbi5uYW1lID0gXCJpY29uXCJcblx0c2V0dXAuaWNvbi5jb25zdHJhaW50cyA9XG5cdFx0aGVpZ2h0OjIwXG5cdFx0d2lkdGg6MjBcblx0XHRsZWFkaW5nOkBsZWFkaW5nSWNvblxuXHRcdHRvcDpAdG9wSWNvbiBcblxuXHR0aXRsZSA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJiYW5uZXJUaXRsZVwiLCB0ZXh0OnNldHVwLnRpdGxlLCBjb2xvcjpcIndoaXRlXCIsIGZvbnRXZWlnaHQ6XCJtZWRpdW1cIiwgZm9udFNpemU6MTMsIHN1cGVyTGF5ZXI6YmFubmVyLCBuYW1lOlwidGl0bGVcIlxuXHR0aXRsZS5jb25zdHJhaW50cyA9IFxuXHRcdHRvcDpAdG9wVGl0bGVcblxuXHRcdGxlYWRpbmc6W3NldHVwLmljb24sIDExXVxuXHRtZXNzYWdlID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImJhbm5lck1lc3NhZ2VcIiwgdGV4dDpzZXR1cC5tZXNzYWdlLCBjb2xvcjpcIndoaXRlXCIsIGZvbnRTaXplOjEzLCBzdXBlckxheWVyOmJhbm5lciwgbmFtZTpcIm1lc3NhZ2VcIlxuXHRtZXNzYWdlLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nRWRnZXM6dGl0bGVcblx0XHR0b3A6W3RpdGxlLCAyXVxuXG5cdHRpbWUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwiYmFubmVyVGltZVwiLCB0ZXh0OnNldHVwLnRpbWUsIGNvbG9yOlwid2hpdGVcIiwgZm9udFNpemU6MTEsIHN1cGVyTGF5ZXI6YmFubmVyLCBuYW1lOlwidGltZVwiXG5cdHRpbWUuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6W3RpdGxlLCA1XVxuXHRcdGJvdHRvbUVkZ2VzOiB0aXRsZVxuXG5cdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiIHx8IGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZC1wcm9cIlxuXHRcdHRpbWUuY29uc3RyYWludHMgPVxuXHRcdFx0Ym90dG9tRWRnZXM6IHRpdGxlXG5cdFx0XHR0cmFpbGluZzogQGxlYWRpbmdJY29uXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRleHBvcnRzLmJnQmx1cihiYW5uZXIpXG5cblx0IyMgQmFubmVyIERyYWcgc2V0dGluZ3Ncblx0YmFubmVyLmRyYWdnYWJsZSA9IHRydWVcblx0YmFubmVyLmRyYWdnYWJsZS5ob3Jpem9udGFsID0gZmFsc2Vcblx0YmFubmVyLmRyYWdnYWJsZS5jb25zdHJhaW50cyA9XG5cdFx0eTowXG5cblx0YmFubmVyLmRyYWdnYWJsZS5ib3VuY2VPcHRpb25zID1cblx0ICAgIGZyaWN0aW9uOiAyNVxuXHQgICAgdGVuc2lvbjogMjUwXG5cblx0YmFubmVyLm9uIEV2ZW50cy5EcmFnRW5kLCAtPlxuXHRcdGlmIGJhbm5lci5tYXhZIDwgZXhwb3J0cy5weCg2OClcblx0XHRcdGJhbm5lci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KG1heFk6MClcblx0XHRcdFx0dGltZTouMTVcblx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0XHRVdGlscy5kZWxheSAuMjUsIC0+XG5cdFx0XHRcdGJhbm5lci5kZXN0cm95KClcblxuXG5cdCMgQnVmZmVyIHRoYXQgc2l0cyBhYm92ZSB0aGUgYmFubmVyXG5cdGJhbm5lckJ1ZmZlciA9IG5ldyBMYXllciBtYXhZOjAsIG5hbWU6XCJidWZmZXJcIiwgYmFja2dyb3VuZENvbG9yOlwiIzFCMUIxQ1wiLCBvcGFjaXR5Oi45LCBzdXBlckxheWVyOmJhbm5lciwgd2lkdGg6ZXhwb3J0cy53aWR0aCwgbWF4WTpiYW5uZXIueSwgaGVpZ2h0OmV4cG9ydHMuaGVpZ2h0XG5cdGV4cG9ydHMuYmdCbHVyKGJhbm5lckJ1ZmZlcilcblxuXHQjIEFuaW1hdGUtaW5cblx0aWYgc2V0dXAuYW5pbWF0ZWQgPT0gdHJ1ZVxuXHRcdGJhbm5lci55ID0gMCAtIGJhbm5lci5oZWlnaHRcblx0XHRiYW5uZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczooeTowKVxuXHRcdFx0dGltZTouMjVcblx0XHRcdGN1cnZlOlwiZWFzZS1pbi1vdXRcIlxuXG5cdCMgQW5pbWF0ZS1vdXRcblx0aWYgc2V0dXAuZHVyYXRpb25cblx0XHRVdGlscy5kZWxheSBzZXR1cC5kdXJhdGlvbiwgLT5cblx0XHRcdGJhbm5lci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6KG1heFk6MClcblx0XHRcdFx0dGltZTouMjVcblx0XHRcdFx0Y3VydmU6XCJlYXNlLWluLW91dFwiXG5cdFx0VXRpbHMuZGVsYXkgc2V0dXAuZHVyYXRpb24gKyAuMjUsIC0+XG5cdFx0XHRiYW5uZXIuZGVzdHJveSgpXG5cdFx0XG5cdCMgRXhwb3J0IEJhbm5lclxuXHRiYW5uZXIuaWNvbiA9IHNldHVwLmljb25cblx0YmFubmVyLnRpdGxlID0gdGl0bGVcblx0YmFubmVyLm1lc3NhZ2UgPSBtZXNzYWdlXG5cdHJldHVybiBiYW5uZXJcblxuZXhwb3J0cy5CdXR0b24gPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJidXR0b25cIiwgYXJyYXkpXG5cdGJ1dHRvbiA9IG5ldyBMYXllciBuYW1lOnNldHVwLm5hbWVcblx0YnV0dG9uLmJ1dHRvblR5cGUgPSBzZXR1cC5idXR0b25UeXBlXG5cdGJ1dHRvbi50eXBlID0gc2V0dXAudHlwZVxuXHRjb2xvciA9IFwiXCJcblx0aWYgc2V0dXAuY29uc3RyYWludHNcblx0XHRidXR0b24uY29uc3RyYWludHMgPSBcblx0XHRcdHNldHVwLmNvbnN0cmFpbnRzXG5cdGlmIHNldHVwLnN1cGVyTGF5ZXIgXG5cdFx0c2V0dXAuc3VwZXJMYXllci5hZGRTdWJMYXllcihidXR0b24pXG5cdHN3aXRjaCBzZXR1cC5idXR0b25UeXBlXG5cdFx0d2hlbiBcImJpZ1wiXG5cdFx0XHRAZm9udFNpemUgPSAyMFxuXHRcdFx0QHRvcCA9IDE4XG5cdFx0XHRAZm9udFdlaWdodCA9IFwibWVkaXVtXCJcblx0XHRcdGlmIGJ1dHRvbi5jb25zdHJhaW50cyA9PSB1bmRlZmluZWRcblx0XHRcdFx0YnV0dG9uLmNvbnN0cmFpbnRzID0ge31cblx0XHRcdGlmIGJ1dHRvbi5jb25zdHJhaW50cy5sZWFkaW5nID09IHVuZGVmaW5lZFxuXHRcdFx0XHRidXR0b24uY29uc3RyYWludHMubGVhZGluZyA9IDEwXG5cdFx0XHRpZiBidXR0b24uY29uc3RyYWludHMudHJhaWxpbmcgPT0gdW5kZWZpbmVkXG5cdFx0XHRcdGJ1dHRvbi5jb25zdHJhaW50cy50cmFpbGluZyA9IDEwXG5cdFx0XHRpZiBidXR0b24uY29uc3RyYWludHMuaGVpZ2h0ID09IHVuZGVmaW5lZFxuXHRcdFx0XHRidXR0b24uY29uc3RyYWludHMuaGVpZ2h0ID0gNTdcblx0XHRcdGJ1dHRvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDEyLjUpXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRzd2l0Y2ggc2V0dXAuc3R5bGVcblx0XHRcdFx0d2hlbiBcImxpZ2h0XCJcblx0XHRcdFx0XHRjb2xvciA9IFwiIzAwN0FGRlwiXG5cdFx0XHRcdFx0aWYgc2V0dXAuYmx1ciBcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAuOSlcIlxuXHRcdFx0XHRcdFx0ZXhwb3J0cy5iZ0JsdXIoYnV0dG9uKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXG5cdFx0XHRcdHdoZW4gXCJkYXJrXCJcblx0XHRcdFx0XHRjb2xvciA9IFwiI0ZGRlwiXG5cdFx0XHRcdFx0aWYgc2V0dXAuYmx1clxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDQzLCA0MywgNDMsIC45KVwiXG5cdFx0XHRcdFx0XHRleHBvcnRzLmJnQmx1cihidXR0b24pXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCIjMjgyODI4XCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIHNldHVwLmJsdXIgXG5cdFx0XHRcdFx0XHRjb2xvciA9IHNldHVwLmNvbG9yXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3Ioc2V0dXAuYmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHRcdFx0cmdiU3RyaW5nID0gYmFja2dyb3VuZENvbG9yLnRvUmdiU3RyaW5nKClcblx0XHRcdFx0XHRcdHJnYmFTdHJpbmcgPSByZ2JTdHJpbmcucmVwbGFjZShcIilcIiwgXCIsIC45KVwiKVxuXHRcdFx0XHRcdFx0cmdiYVN0cmluZyAgPSByZ2JhU3RyaW5nLnJlcGxhY2UoXCJyZ2JcIiwgXCJyZ2JhXCIpXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3IgPSByZ2JhU3RyaW5nXG5cdFx0XHRcdFx0XHRleHBvcnRzLmJnQmx1cihidXR0b24pXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0Y29sb3IgPSBzZXR1cC5jb2xvclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yID0gbmV3IENvbG9yKHNldHVwLmJhY2tncm91bmRDb2xvcilcblxuXG5cdFx0XHRidXR0b24uYmFja2dyb3VuZENvbG9yID0gYmFja2dyb3VuZENvbG9yXG5cblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0bmV3Q29sb3IgPSBcIlwiXG5cdFx0XHRcdGlmIHNldHVwLnN0eWxlID09IFwiZGFya1wiXG5cdFx0XHRcdFx0bmV3Q29sb3IgPSBidXR0b24uYmFja2dyb3VuZENvbG9yLmxpZ2h0ZW4oMTApXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRuZXdDb2xvciA9IGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IuZGFya2VuKDEwKVxuXHRcdFx0XHRidXR0b24uYW5pbWF0ZSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6bmV3Q29sb3IpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6YmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblxuXHRcdHdoZW4gXCJzbWFsbFwiXG5cdFx0XHRAZm9udFNpemUgPSAxNlxuXHRcdFx0QHRvcCA9IDRcblx0XHRcdGJ1dHRvbi5ib3JkZXJSYWRpdXMgPSBleHBvcnRzLnB4KDIuNSlcblx0XHRcdHN3aXRjaCBzZXR1cC5zdHlsZVxuXHRcdFx0XHR3aGVuIFwibGlnaHRcIlxuXHRcdFx0XHRcdGNvbG9yID0gXCIjMDA3QUZGXCJcblx0XHRcdFx0XHRidXR0b24uYm9yZGVyQ29sb3IgPSBcIiMwMDdBRkZcIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y29sb3IgPSBzZXR1cC5jb2xvclxuXHRcdFx0XHRcdGJ1dHRvbi5ib3JkZXJDb2xvciA9IHNldHVwLmNvbG9yXG5cdFx0XHRidXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRidXR0b24uYm9yZGVyV2lkdGggPSBleHBvcnRzLnB4KDEpXG5cblxuXHRcdGVsc2Vcblx0XHRcdGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRcdGNvbG9yID0gc2V0dXAuY29sb3Jcblx0XHRcdEBmb250U2l6ZSA9IHNldHVwLmZvbnRTaXplXG5cdFx0XHRAZm9udFdlaWdodCA9IHNldHVwLmZvbnRXZWlnaHRcblxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0XHRuZXdDb2xvciA9IGJ1dHRvbi5zdWJMYXllcnNbMF0uY29sb3IubGlnaHRlbigzMClcblx0XHRcdFx0YnV0dG9uLnN1YkxheWVyc1swXS5hbmltYXRlIFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOm5ld0NvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGJ1dHRvbi5zdWJMYXllcnNbMF0uYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOnNldHVwLmNvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0dGV4dExheWVyID0gbmV3IGV4cG9ydHMuVGV4dCB0ZXh0OnNldHVwLnRleHQsIGNvbG9yOmNvbG9yLCBzdXBlckxheWVyOmJ1dHRvbiwgZm9udFNpemU6QGZvbnRTaXplLCBmb250V2VpZ2h0OkBmb250V2VpZ2h0XG5cdHRleHRMYXllci5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJjZW50ZXJcIlxuXHRzd2l0Y2ggc2V0dXAuYnV0dG9uVHlwZSBcblx0XHR3aGVuIFwic21hbGxcIlxuXHRcdFx0YnV0dG9uLnByb3BzID0gKHdpZHRoOnRleHRMYXllci53aWR0aCArIGV4cG9ydHMucHgoNjApLCBoZWlnaHQ6IHRleHRMYXllci5oZWlnaHQgKyBleHBvcnRzLnB4KDEwKSlcblx0XHRcdGJ1dHRvbi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6Y29sb3IpXG5cdFx0XHRcdFx0dGltZTouNVx0XG5cdFx0XHRcdHRleHRMYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczooY29sb3I6XCIjRkZGXCIpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdFx0YnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0YnV0dG9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiKVxuXHRcdFx0XHRcdHRpbWU6LjVcdFxuXHRcdFx0XHR0ZXh0TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6KGNvbG9yOmNvbG9yKVxuXHRcdFx0XHRcdHRpbWU6LjVcblx0XHRlbHNlIFxuXHRcdFx0YnV0dG9uLnByb3BzID0gKHdpZHRoOnRleHRMYXllci53aWR0aCwgaGVpZ2h0OnRleHRMYXllci5oZWlnaHQpXG5cdGV4cG9ydHMubGF5b3V0KClcblx0YnV0dG9uLmxhYmVsID0gdGV4dExheWVyXG5cdHJldHVybiBidXR0b25cblxuZXhwb3J0cy5GaWVsZCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcImZpZWxkXCIsIGFycmF5KVxuXHRmaWVsZCA9IG5ldyBMYXllciBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weChzZXR1cC5ib3JkZXJSYWRpdXMpLCBiYWNrZ3JvdW5kQ29sb3I6c2V0dXAuYmFja2dyb3VuZENvbG9yLCB3aWR0aDpleHBvcnRzLnB4KHNldHVwLndpZHRoKSwgaGVpZ2h0OmV4cG9ydHMucHgoc2V0dXAuaGVpZ2h0KVxuXHRpZiBzZXR1cC5jb25zdHJhaW50c1xuXHRcdGZpZWxkLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRzZXR1cC5jb25zdHJhaW50c1xuXHRmaWVsZC5hY3RpdmUgPSBmYWxzZVxuXHR0ZXh0ID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImZpZWxkVGV4dFwiLCBzdXBlckxheWVyOmZpZWxkLCB0ZXh0OnNldHVwLnRleHQsIGZvbnRTaXplOnNldHVwLmZvbnRTaXplLCBmb250V2VpZ2h0OnNldHVwLmZvbnRXZWlnaHQsIGNvbG9yOnNldHVwLmNvbG9yXG5cdGlmIHNldHVwLnRleHRDb25zdHJhaW50c1xuXHRcdHRleHQuY29uc3RyYWludHMgPVxuXHRcdFx0c2V0dXAudGV4dENvbnN0cmFpbnRzXG5cdGZpZWxkLnRleHQgPSB0ZXh0XG5cblx0aWYgc2V0dXAuc3VwZXJMYXllclxuXHRcdHNldHVwLnN1cGVyTGF5ZXIuYWRkU3ViTGF5ZXIoZmllbGQpXG5cblxuXG5cblx0IyNIYW5kbGUga2V5cHJlc3Ncblx0dGV4dC5vbiBcImNoYW5nZTpodG1sXCIsIC0+XG5cdFx0aWYgdGV4dC5odG1sID09IFwiXCJcblx0XHRcdGZpZWxkLmN1cnNvci5jb25zdHJhaW50cyA9IHthbGlnbjpcInZlcnRpY2FsXCIsIGxlYWRpbmc6OH1cblx0XHRlbHNlXG5cdFx0XHRmaWVsZC5jdXJzb3IuY29uc3RyYWludHMgPSB7YWxpZ246XCJ2ZXJ0aWNhbFwiLCB0cmFpbGluZ0VkZ2VzOnRleHR9XG5cdFx0aWYgZmllbGQucGxhY2Vob2xkZXJcblx0XHRcdGZpZWxkLnBsYWNlaG9sZGVyLnZpc2libGUgPSBmYWxzZVxuXG5cdGlmIHNldHVwLnRleHQgPT0gXCJcIiB8fCBzZXR1cC50ZXh0ID09IHVuZGVmaW5lZFxuXHRcdHBsYWNlaG9sZGVyID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcImZpZWxkUGxhY2Vob2xkZXJcIiwgc3VwZXJMYXllcjpmaWVsZCwgdGV4dDpzZXR1cC5wbGFjZWhvbGRlclRleHQsIGZvbnRTaXplOnNldHVwLmZvbnRTaXplLCBmb250V2VpZ2h0OnNldHVwLmZvbnRXZWlnaHQsIGNvbG9yOnNldHVwLnBsYWNlaG9sZGVyQ29sb3Jcblx0XHRpZiBzZXR1cC50ZXh0Q29uc3RyYWludHMgXG5cdFx0XHRwbGFjZWhvbGRlci5jb25zdHJhaW50cyA9XG5cdFx0XHRcdHNldHVwLnRleHRDb25zdHJhaW50c1xuXHRcdGZpZWxkLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJcblxuXHRmaWVsZC5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0ZmllbGQuYWN0aXZlID0gdHJ1ZVxuXHRcdHRleHQudmlzaWJsZSA9IHRydWVcblx0XHRjbGlja1pvbmUgPSBuZXcgTGF5ZXIgbmFtZTpcImZpZWxkQWN0aXZlXCIsIG9wYWNpdHk6MFxuXHRcdGlmIHNldHVwLmlucHV0XG5cdFx0XHRrZXlib2FyZCA9IG5ldyBleHBvcnRzLktleWJvYXJkIGFuaW1hdGVkOnRydWUsIG91dHB1dDpmaWVsZCwgcmV0dXJuVGV4dDpzZXR1cC5yZXR1cm5UZXh0LCByZXR1cm5Db2xvcjpzZXR1cC5yZXR1cm5Db2xvclxuXHRcdFx0ZmllbGQua2V5Ym9hcmQgPSBrZXlib2FyZFxuXHRcdFx0Y2xpY2tab25lLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRcdHRvcDowXG5cdFx0XHRcdGJvdHRvbTprZXlib2FyZC5zcGVjcy5oZWlnaHRcblx0XHRcdFx0bGVhZGluZzowXG5cdFx0XHRcdHRyYWlsaW5nOjBcblx0XHRlbHNlXG5cdFx0XHRjbGlja1pvbmUuY29uc3RyYWludHMgPVxuXHRcdFx0XHR0b3A6MFxuXHRcdFx0XHRib3R0b206MFxuXHRcdFx0XHRsZWFkaW5nOjBcblx0XHRcdFx0dHJhaWxpbmc6MFxuXG5cdFx0Y2xpY2tab25lLm9uIEV2ZW50cy5Ub3VjaEVuZCwgKGhhbmRsZXIpIC0+XG5cdFx0XHQjICMgbGlzdGVuIGZvciBzb21ldGhpbmcgZWxzZVxuXHRcdFx0IyBpZiBoYW5kbGVyLm9mZnNldFggPCBmaWVsZC54IHx8IGhhbmRsZXIub2Zmc2V0WCA+IGZpZWxkLm1heFggfHwgaGFuZGxlci5vZmZzZXRZIDwgZmllbGQueSB8fCBoYW5kbGVyLm9mZnNldFkgPiBmaWVsZC5tYXhZXG5cdFx0XHQjIFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdGZpZWxkLmtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooeTpleHBvcnRzLmhlaWdodClcblx0XHRcdFx0dGltZTouNFxuXHRcdFx0XHRjdXJ2ZTpcImVhc2UtaW4tb3V0XCJcblx0XHRcdFV0aWxzLmRlbGF5IC41LCAtPlxuXHRcdFx0XHRmaWVsZC5rZXlib2FyZC5kZXN0cm95KClcblx0XHRcdFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0Y2xpY2tab25lLmRlc3Ryb3koKVxuXHRcdGZpZWxkLmNsaWNrWm9uZSA9IGNsaWNrWm9uZVxuXG5cdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdGZpZWxkLmtleWJvYXJkLmtleXMuZGlzbWlzcy5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGZpZWxkLmtleWJvYXJkLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOih5OmV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0XHRcdHRpbWU6LjRcblx0XHRcdFx0XHRjdXJ2ZTpcImVhc2UtaW4tb3V0XCJcblx0XHRcdFx0VXRpbHMuZGVsYXkgLjUsIC0+XG5cdFx0XHRcdFx0ZmllbGQua2V5Ym9hcmQuZGVzdHJveSgpXG5cdFx0XHRcdFx0ZmllbGQuYWN0aXZlID0gZmFsc2Vcblx0XHRcdFx0XHRjbGlja1pvbmUuZGVzdHJveSgpXG4gXG5cblx0XHQjIyBEZWZhdWx0IEN1cnNvclxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhzZXR1cC5jdXJzb3IpXG5cdFx0aWYga2V5cy5sZW5ndGggPCAxXG5cdFx0XHRzZXR1cC5jdXJzb3IuY29uc3RyYWludHMgPSB7YWxpZ246XCJ2ZXJ0aWNhbFwiLCBsZWFkaW5nOjh9XG5cdFx0XHRzZXR1cC5jdXJzb3Iud2lkdGggPSAyXG5cdFx0XHRzZXR1cC5jdXJzb3IuaGVpZ2h0ID0gMjBcblxuXHRcdGlmIGZpZWxkLmN1cnNvciA9PSB1bmRlZmluZWRcblx0XHRcdGxpc3RlblRvS2V5cyhmaWVsZCwga2V5Ym9hcmQpXG5cdFx0XHRjdXJzb3IgPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weChzZXR1cC5jdXJzb3Iud2lkdGgpLCBoZWlnaHQ6ZXhwb3J0cy5weChzZXR1cC5jdXJzb3IuaGVpZ2h0KSwgc3VwZXJMYXllcjpmaWVsZCwgbmFtZTpcImN1cnNvclwiLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImJsdWVcIiksIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEpXG5cdFx0XHRmaWVsZC5jdXJzb3IgPSBjdXJzb3Jcblx0XHRcdGN1cnNvci5jb25zdHJhaW50cyA9IFxuXHRcdFx0XHRzZXR1cC5jdXJzb3IuY29uc3RyYWludHNcblxuXHRcdFx0VXRpbHMuaW50ZXJ2YWwgLjUsIC0+XG5cdFx0XHRcdGlmIGZpZWxkLmFjdGl2ZSA9PSB0cnVlXG5cdFx0XHRcdFx0aWYgZmllbGQuY3Vyc29yLm9wYWNpdHkgPT0gMFxuXHRcdFx0XHRcdFx0ZmllbGQuY3Vyc29yLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eToxKVxuXHRcdFx0XHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZmllbGQuY3Vyc29yLmFuaW1hdGVcblx0XHRcdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eTowKVxuXHRcdFx0XHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmaWVsZC5jdXJzb3Iub3BhY2l0eSA9IDBcblx0XHRleHBvcnRzLmxheW91dCgpXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRyZXR1cm4gZmllbGRcblxuZXhwb3J0cy5TdGF0dXNCYXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJzdGF0dXNCYXJcIiwgYXJyYXkpXG5cdHN0YXR1c0JhciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwic3RhdHVzQmFyLmFsbFwiXG5cdHN0YXR1c0Jhci50eXBlID0gc2V0dXAudHlwZVxuXHRzdGF0dXNCYXIuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjIwXG5cdHN3aXRjaCBleHBvcnRzLmRldmljZVxuXHRcdHdoZW4gXCJpcGhvbmUtNnMtcGx1c1wiXG5cdFx0XHRAdG9wQ29uc3RyYWludCA9IDVcblx0XHRcdEBiYXR0ZXJ5SWNvbiA9IDZcblx0XHRcdEBibHVldG9vdGggPSA1XG5cdFx0d2hlbiBcImZ1bGxzY3JlZW5cIlxuXHRcdFx0QGJhdHRlcnlJY29uID0gLSAxMlxuXHRcdFx0QGJsdWV0b290aCA9IC0gMTBcblx0XHRlbHNlXG5cdFx0XHRAdG9wQ29uc3RyYWludCA9IDNcblx0XHRcdEBiYXR0ZXJ5SWNvbiA9IDJcblx0XHRcdEBibHVldG9vdGggPSAzXG5cdGlmIHNldHVwLnN0eWxlID09IFwibGlnaHRcIlxuXHRcdEBjb2xvciA9IFwid2hpdGVcIlxuXHRlbHNlXG5cdFx0QGNvbG9yID0gXCJibGFja1wiXG5cdGZvciBsYXllciBpbiBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdFx0aWYgbGF5ZXIudHlwZSA9PSBcImxvY2tTY3JlZW5cIlxuXHRcdFx0QGlzTG9ja1NjcmVlblByZXNlbnQgPSB0cnVlXG5cdGlmIEBpc0xvY2tTY3JlZW5QcmVzZW50XG5cdFx0Z3JpcHBlciA9IG5ldyBMYXllciBzdXBlckxheWVyOnN0YXR1c0Jhciwgd2lkdGg6ZXhwb3J0cy5weCgzNyksIGhlaWdodDpleHBvcnRzLnB4KDUpLCBuYW1lOlwiZ3JpcHBlclwiLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi41LCBuYW1lOlwiZ3JpcHBlclwiXG5cdFx0Z3JpcHBlci5odG1sID0gXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgzNyl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDUpfXB4JyB2aWV3Qm94PScwIDAgMzcgNScgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+R3JpcHBlcjwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9BdXRvLUNvbXBsZXRlLUJhci1DbG9zZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNjkuMDAwMDAwLCAtMi4wMDAwMDApJyBmaWxsPScjRkZGRkZGJz5cblx0XHRcdFx0XHRcdDxyZWN0IGlkPSdHcmlwcGVyJyB4PScxNjkuNScgeT0nMi41JyB3aWR0aD0nMzYnIGhlaWdodD0nNCcgcng9JzIuNSc+PC9yZWN0PlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0XHRncmlwcGVyLmNvbnN0cmFpbnRzID0gXG5cdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0dG9wOjJcblx0ZWxzZSBcblx0XHRAdGltZSA9IGV4cG9ydHMuZ2V0VGltZSgpXG5cdFx0aWYgc2V0dXAuY2xvY2syNCA9PSBmYWxzZVxuXHRcdFx0aWYgQHRpbWUuaG91cnMgPiAxMSBcblx0XHRcdFx0QHRpbWUuc3RhbXAgPSBcIlBNXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0QHRpbWUuc3RhbXAgPSBcIkFNXCJcblx0XHRlbHNlXG5cdFx0XHRAdGltZS5zdGFtcCA9IFwiXCJcblx0XHR0aW1lID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhclRpbWVcIiwgdGV4dDpleHBvcnRzLnRpbWVGb3JtYXR0ZXIoQHRpbWUsIHNldHVwLmNsb2NrMjQpICsgXCIgXCIgKyBAdGltZS5zdGFtcCwgZm9udFNpemU6MTIsIGZvbnRXZWlnaHQ6XCJzZW1pYm9sZFwiLCBzdXBlckxheWVyOnN0YXR1c0JhciwgY29sb3I6QGNvbG9yLCBuYW1lOlwidGltZVwiXG5cdFx0dGltZS5jb25zdHJhaW50cyA9XG5cdFx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXHRcdFx0dG9wOkB0b3BDb25zdHJhaW50XG5cdHNpZ25hbCA9IFtdXG5cdGlmIHNldHVwLnNpZ25hbCA8IDFcblx0XHRub05ldHdvcmsgPSBuZXcgZXhwb3J0cy5UZXh0IHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBmb250U2l6ZToxMiwgdGV4dDpcIk5vIE5ldHdvcmtcIlxuXHRcdG5vTmV0d29yay5jb25zdHJhaW50cyA9XG5cdFx0XHRsZWFkaW5nOjdcblx0XHRcdHRvcDozXG5cdGVsc2Vcblx0XHRmb3IgaSBpbiBbMC4uLnNldHVwLnNpZ25hbF1cblx0XHRcdGRvdCA9IG5ldyBMYXllciBoZWlnaHQ6ZXhwb3J0cy5weCg1LjUpLCB3aWR0aDpleHBvcnRzLnB4KDUuNSksIGJhY2tncm91bmRDb2xvcjpcImJsYWNrXCIsIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1LjUpLzIsIGJhY2tncm91bmRDb2xvcjpAY29sb3IsIG5hbWU6XCJzaWduYWxbI3tpfV1cIlxuXHRcdFx0aWYgaSA9PSAwXG5cdFx0XHRcdGRvdC5jb25zdHJhaW50cyA9XG5cdFx0XHRcdFx0bGVhZGluZzo3XG5cdFx0XHRcdFx0dG9wOjdcdFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb3QuY29uc3RyYWludHMgPVxuXHRcdFx0XHRcdGxlYWRpbmc6W3NpZ25hbFtpIC0gMSBdLCAxXVxuXHRcdFx0XHRcdHRvcDo3XHRcdFx0XHRcdFxuXHRcdFx0c2lnbmFsLnB1c2ggZG90IFxuXHRcdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGlmIHNldHVwLnNpZ25hbCA8IDVcblx0XHRcdG5vbkRvdHMgPSA1IC0gc2V0dXAuc2lnbmFsXG5cdFx0XHRmb3IgaSBpbiBbMC4uLm5vbkRvdHNdXG5cdFx0XHRcdG5vbkRvdCA9IG5ldyBMYXllciBoZWlnaHQ6ZXhwb3J0cy5weCg1LjUpLCB3aWR0aDpleHBvcnRzLnB4KDUuNSksIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1LjUpLzIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJzaWduYWxbI3tzaWduYWwubGVuZ3RofV1cIlxuXHRcdFx0XHRub25Eb3Quc3R5bGUuYm9yZGVyID0gXCIje2V4cG9ydHMucHgoMSl9cHggc29saWQgI3tAY29sb3J9XCJcblx0XHRcdFx0bm9uRG90LmNvbnN0cmFpbnRzID1cblx0XHRcdFx0XHRsZWFkaW5nOltzaWduYWxbc2lnbmFsLmxlbmd0aCAtIDFdLCAxXVxuXHRcdFx0XHRcdHRvcDo3XG5cdFx0XHRcdHNpZ25hbC5wdXNoIG5vbkRvdFxuXHRcdFx0XHRleHBvcnRzLmxheW91dCgpXHRcblx0XHRjYXJyaWVyID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhckNhcnJpZXJcIiwgdGV4dDpzZXR1cC5jYXJyaWVyLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcImNhcnJpZXJcIiwgdGV4dFRyYW5zZm9ybTpcImNhcGl0YWxpemVcIlxuXHRcdGNhcnJpZXIuY29uc3RyYWludHMgPSBcblx0XHRcdGxlYWRpbmc6W3NpZ25hbFtzaWduYWwubGVuZ3RoIC0gMV0sIDddXG5cdFx0XHR0b3A6M1xuXHRcdGV4cG9ydHMubGF5b3V0KClcblx0XHRpZiBzZXR1cC5jYXJyaWVyXG5cdFx0XHRuZXR3b3JrID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0Jhck5ldHdvcmtcIiwgdGV4dDpzZXR1cC5uZXR3b3JrLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcIm5ldHdvcmtcIiwgdGV4dFRyYW5zZm9ybTpcInVwcGVyY2FzZVwiXG5cdFx0XHRuZXR3b3JrLmNvbnN0cmFpbnRzID1cblx0XHRcdFx0bGVhZGluZzpbY2FycmllciwgNV1cblx0XHRcdFx0dG9wOjNcblx0XHRpZiBzZXR1cC5jYXJyaWVyID09IFwiXCIgfHwgc2V0dXAuY2FycmllciA9PSBcIndpZmlcIlxuXHRcdFx0bmV0d29yayA9IG5ldyBMYXllciB3aWR0aDpleHBvcnRzLnB4KDE0KSwgaGVpZ2h0OmV4cG9ydHMucHgoMTApLCBzdXBlckxheWVyOnN0YXR1c0JhciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpcIm5ldHdvcmtcIlxuXHRcdFx0bmV0d29yay5odG1sID0gXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE0KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTApfXB4JyB2aWV3Qm94PScwIDAgMTQgMTAnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHRcdDx0aXRsZT5XaS1GaTwvdGl0bGU+XG5cdFx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J1N0YXR1cy1CYXIvQmxhY2svQ2hhcmdpbmcnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC04Ny4wMDAwMDAsIC01LjAwMDAwMCknIGZpbGw9JyN7QGNvbG9yfSc+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J005Ni4xNDQ0MjA4LDEyLjQzODUwNDMgQzk1LjYyNjM3NCwxMS44NDU0NDU2IDk0Ljg1MjM2MTYsMTEuNDY4OTExOSA5My45ODc1NjMsMTEuNDY4OTExOSBDOTMuMTM5MDA3MywxMS40Njg5MTE5IDkyLjM3Nzg1OTQsMTEuODMxNDM0MSA5MS44NjAxNjUyLDEyLjQwNTMxNzcgTDk0LjAyMjUzOTEsMTQuNSBMOTYuMTQ0NDIwOCwxMi40Mzg1MDQzIFogTTk4LjMyMzQ5NjQsMTAuMzIxNDQyNSBDOTcuMjQ0Nzc5NCw5LjE5MTc0NTYzIDk1LjcwMTQzODcsOC40ODQ0NTU5NiA5My45ODc1NjMsOC40ODQ0NTU5NiBDOTIuMjg4MjcyMyw4LjQ4NDQ1NTk2IDkwLjc1NjYyNjQsOS4xNzk3NTg5MyA4OS42NzkyNjk4LDEwLjI5MjY5MzYgTDkwLjc2OTI5ODcsMTEuMzQ4NiBDOTEuNTY3MjA1LDEwLjUwNTM3MDggOTIuNzEzNjQ4LDkuOTc2NjgzOTQgOTMuOTg3NTYzLDkuOTc2NjgzOTQgQzk1LjI3Njg4MzYsOS45NzY2ODM5NCA5Ni40MzU2MzA1LDEwLjUxODIzNSA5Ny4yMzQ2MjE1LDExLjM3OTMyOTMgTDk4LjMyMzQ5NjQsMTAuMzIxNDQyNSBMOTguMzIzNDk2NCwxMC4zMjE0NDI1IFogTTEwMC41LDguMjA2ODc5MzMgQzk4Ljg2Mjk1NzgsNi41Mzk0MzY3MiA5Ni41NTA1Njk5LDUuNSA5My45ODc1NjMsNS41IEM5MS40Mzc1MTAzLDUuNSA4OS4xMzU1NDk2LDYuNTI4OTU2MDUgODcuNSw4LjE4MTY0NDMxIEw4OC41ODk1NTc5LDkuMjM3MDk0NDEgQzg5Ljk0NjA3OTgsNy44NTQzMTY1NSA5MS44NjI4OTIxLDYuOTkyMjI3OTggOTMuOTg3NTYzLDYuOTkyMjI3OTggQzk2LjEyNjAwMjYsNi45OTIyMjc5OCA5OC4wNTM4ODA5LDcuODY1NTI2MDkgOTkuNDExODY5OCw5LjI2NDA0MjcyIEwxMDAuNSw4LjIwNjg3OTMzIFonIGlkPSdXaS1GaSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XCJcblx0XHRcdG5ldHdvcmsuY29uc3RyYWludHMgPSBcblx0XHRcdFx0bGVhZGluZzpbc2lnbmFsW3NpZ25hbC5sZW5ndGggLSAxXSwgN11cblx0XHRcdFx0dG9wOkB0b3BDb25zdHJhaW50XG5cdGJhdHRlcnlJY29uID0gbmV3IExheWVyIHdpZHRoOmV4cG9ydHMucHgoMjUpLCBoZWlnaHQ6ZXhwb3J0cy5weCgxMCksIHN1cGVyTGF5ZXI6c3RhdHVzQmFyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwiYmF0dGVyeUljb25cIlxuXHRpZiBzZXR1cC5iYXR0ZXJ5ID4gNzAgXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL0JsYWNrLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni41MDY3NDQsNi41IEMzNDYuMjI2ODc3LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMzAyMjUsMTQgMzQ2LjUwNjc0NCwxNCBMMzY1Ljk5MzI1NiwxNCBDMzY2LjI3MzEyMywxNCAzNjYuNSwxMy43ODM2MjggMzY2LjUsMTMuNTA3OTA0MSBMMzY2LjUsNi45OTIwOTU5NSBDMzY2LjUsNi43MjAzMTg4NiAzNjYuMjY5Nzc1LDYuNSAzNjUuOTkzMjU2LDYuNSBMMzQ2LjUwNjc0NCw2LjUgWicgaWQ9J0JhdHRlcnknPjwvcGF0aD5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdGlmIHNldHVwLmJhdHRlcnkgPD0gNzAgJiYgc2V0dXAuYmF0dGVyeSA+IDIwXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL1doaXRlLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni41MDEyMzEsNi41IEMzNDYuMjI0NDA5LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMjk3NTEsMTQgMzQ2LjUwMTIzMSwxNCBMMzU2LjQ5ODc2OSwxNCBDMzU2Ljc3NTU5MSwxNCAzNTcsMTMuNzgzNjI4IDM1NywxMy41MDc5MDQxIEwzNTcsNi45OTIwOTU5NSBDMzU3LDYuNzIwMzE4ODYgMzU2Ljc3MDI0OSw2LjUgMzU2LjQ5ODc2OSw2LjUgTDM0Ni41MDEyMzEsNi41IFonIGlkPSdCYXR0ZXJ5Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRpZiBzZXR1cC5iYXR0ZXJ5IDw9IDIwXG5cdFx0YmF0dGVyeUljb24uaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMCl9cHgnIHZpZXdCb3g9JzAgMCAyNSAxMCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+QmF0dGVyeTwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHRcdDxnIGlkPSdTdGF0dXMtQmFyL1doaXRlLzEwMCUnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0zNDUuMDAwMDAwLCAtNS4wMDAwMDApJyBmaWxsPScje0Bjb2xvcn0nPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTM0Ni40OTM3MTMsNS41IEMzNDUuNjY4NzU4LDUuNSAzNDUsNi4xNjgwMjE1NSAzNDUsNy4wMDUzMDMyNCBMMzQ1LDEzLjQ5NDY5NjggQzM0NSwxNC4zMjYwNTI4IDM0NS42NzMzOCwxNSAzNDYuNDkzNzEzLDE1IEwzNjYuMDA2Mjg3LDE1IEMzNjYuODMxMjQyLDE1IDM2Ny41LDE0LjMzMTk3ODQgMzY3LjUsMTMuNDk0Njk2OCBMMzY3LjUsNy4wMDUzMDMyNCBDMzY3LjUsNi4xNzM5NDcyMiAzNjYuODI2NjIsNS41IDM2Ni4wMDYyODcsNS41IEwzNDYuNDkzNzEzLDUuNSBaIE0zNjgsOC41IEwzNjgsMTIgTDM2OC43NSwxMiBDMzY5LjE2NDIxNCwxMiAzNjkuNSwxMS42NjQ0MDUzIDM2OS41LDExLjI1Nzc0IEwzNjkuNSw5LjI0MjI1OTk4IEMzNjkuNSw4LjgzMjMyMTExIDM2OS4xNjcxMDEsOC41IDM2OC43NSw4LjUgTDM2OCw4LjUgWiBNMzQ2LjUwODE1Miw2IEMzNDUuOTUxMzY1LDYgMzQ1LjUsNi40NTY5OTY5MiAzNDUuNSw3LjAwODQ0MDU1IEwzNDUuNSwxMy40OTE1NTk0IEMzNDUuNSwxNC4wNDg1MDU4IDM0NS45NDkwNTgsMTQuNSAzNDYuNTA4MTUyLDE0LjUgTDM2NS45OTE4NDgsMTQuNSBDMzY2LjU0ODYzNSwxNC41IDM2NywxNC4wNDMwMDMxIDM2NywxMy40OTE1NTk0IEwzNjcsNy4wMDg0NDA1NSBDMzY3LDYuNDUxNDk0MjIgMzY2LjU1MDk0Miw2IDM2NS45OTE4NDgsNiBMMzQ2LjUwODE1Miw2IFogTTM0Ni40OTA0NzksNi41IEMzNDYuMjE5NTk1LDYuNSAzNDYsNi43MTYzNzIwMSAzNDYsNi45OTIwOTU5NSBMMzQ2LDEzLjUwNzkwNDEgQzM0NiwxMy43Nzk2ODExIDM0Ni4yMTUwNTcsMTQgMzQ2LjQ5MDQ3OSwxNCBMMzQ5LjUwOTUyMSwxNCBDMzQ5Ljc4MDQwNSwxNCAzNTAsMTMuNzgzNjI4IDM1MCwxMy41MDc5MDQxIEwzNTAsNi45OTIwOTU5NSBDMzUwLDYuNzIwMzE4ODYgMzQ5Ljc4NDk0Myw2LjUgMzQ5LjUwOTUyMSw2LjUgTDM0Ni40OTA0NzksNi41IFonIGlkPSdCYXR0ZXJ5Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXG5cdGJhdHRlcnlQZXJjZW50ID0gbmV3IGV4cG9ydHMuVGV4dCBzdHlsZTpcInN0YXR1c0JhckJhdHRlcnlQZXJjZW50XCIsIHRleHQ6c2V0dXAuYmF0dGVyeSArIFwiJVwiLCBzdXBlckxheWVyOnN0YXR1c0JhciwgZm9udFNpemU6MTIsIGNvbG9yOkBjb2xvciwgbmFtZTpcImJhdHRlcnlQZXJjZW50XCJcblx0YmF0dGVyeVBlcmNlbnQuY29uc3RyYWludHMgPSBcblx0XHR0cmFpbGluZzogW2JhdHRlcnlJY29uLCAzXVxuXHRcdHZlcnRpY2FsQ2VudGVyOnRpbWVcblx0YmF0dGVyeUljb24uY29uc3RyYWludHMgPVxuXHRcdHRyYWlsaW5nIDogN1xuXHRcdHRvcDpAYmF0dGVyeUljb25cblx0Ymx1ZXRvb3RoID0gbmV3IExheWVyIHdpZHRoOmV4cG9ydHMucHgoOCksIGhlaWdodDpleHBvcnRzLnB4KDE1KSwgc3VwZXJMYXllcjpzdGF0dXNCYXIsIG9wYWNpdHk6LjUsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJibHVldG9vdGhcIlxuXHRibHVldG9vdGguaHRtbCA9IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxMyl9cHgnIHZpZXdCb3g9JzAgMCA4IDE1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPkJsdWV0b290aDwvdGl0bGU+XG5cdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdFx0XHQ8ZyBpZD0nU3RhdHVzLUljb25zLShXaGl0ZSknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xMzcuMDAwMDAwLCAwLjAwMDAwMCknIGZpbGw9JyN7QGNvbG9yfSc+XG5cdFx0XHRcdFx0PHBhdGggZD0nTTE0MC41LDE0LjUgTDE0NSwxMC4yNSBMMTQxLjgsNy41IEwxNDUsNC43NSBMMTQwLjUsMC41IEwxNDAuNSw2LjA3MTQyODU3IEwxMzcuOCwzLjc1IEwxMzcsNC41IEwxNDAuMjU4MzMzLDcuMzc1IEwxMzcsMTAuMjUgTDEzNy44LDExIEwxNDAuNSw4LjY3ODU3MTQzIEwxNDAuNSwxNC41IFogTTE0MS41LDMgTDE0My4zNjY2NjcsNC43NSBMMTQxLjUsNi4yNSBMMTQxLjUsMyBaIE0xNDEuNSw4LjUgTDE0My4zNjY2NjcsMTAuMjUgTDE0MS41LDEyIEwxNDEuNSw4LjUgWicgaWQ9J0JsdWV0b290aCc+PC9wYXRoPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XCJcblx0Ymx1ZXRvb3RoLmNvbnN0cmFpbnRzID0gXG5cdFx0dG9wOiBAYmx1ZXRvb3RoXG5cdFx0dHJhaWxpbmc6IFtiYXR0ZXJ5UGVyY2VudCwgN11cblxuXHRleHBvcnRzLmxheW91dCgpXG5cblx0IyBFeHBvcnQgc3RhdHVzQmFyXG5cdHN0YXR1c0Jhci5iYXR0ZXJ5ID0ge31cblx0c3RhdHVzQmFyLmJhdHRlcnkucGVyY2VudCA9IGJhdHRlcnlQZXJjZW50XG5cdHN0YXR1c0Jhci5iYXR0ZXJ5Lmljb24gPSBiYXR0ZXJ5SWNvblxuXHRzdGF0dXNCYXIuYmx1ZXRvb3RoID0gYmx1ZXRvb3RoXG5cdHN0YXR1c0Jhci50aW1lID0gdGltZVxuXHRzdGF0dXNCYXIubmV0d29yayA9IG5ldHdvcmtcblx0c3RhdHVzQmFyLmNhcnJpZXIgPSBjYXJyaWVyXG5cdHN0YXR1c0Jhci5zaWduYWwgPSBzaWduYWxcblx0cmV0dXJuIHN0YXR1c0JhclxuXG5leHBvcnRzLktleWJvYXJkID0gKGFycmF5KSAtPlxuXHRzZXR1cCA9IHNldHVwQ29tcG9uZW50KFwia2V5Ym9hcmRcIiwgYXJyYXkpXG5cblx0I1RoaXMgd2lsbCBob2xkIGFsbCBvZiB0aGUgc3BlY3MgZm9yIGVhY2ggZGV2aWNlJ3Mga2V5Ym9hcmRcblx0Ym9hcmRTcGVjcyA9IHt9XG5cblx0I1RoaXMgd2lsbCBzZXQgdGhlIHNwZWNzXG5cdHN3aXRjaCBleHBvcnRzLmRldmljZVxuXHRcdHdoZW4gXCJpcGhvbmUtNVwiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIxNVxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMjYpXG5cdFx0XHRcdGhlaWdodDpleHBvcnRzLnB4KDM5KVxuXHRcdFx0fVxuXHRcdFx0Ym9hcmRTcGVjcy5leHBhbmRlZEtleSA9IGV4cG9ydHMucHgoMzkpXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgxMilcblxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nID0ge31cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cxID0gZXhwb3J0cy5weCgzKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzIgPSBleHBvcnRzLnB4KDE5KVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzMgPSBleHBvcnRzLnB4KDU0KVxuXG5cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wID0ge31cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzEgPSBleHBvcnRzLnB4KDExKVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMjYpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCg0MSlcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDU1KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoOSksIHk6ZXhwb3J0cy5weCgyKX1cblx0XHRcdGJvYXJkU3BlY3MuZGVsZXRlSWNvbiA9IHt4OmV4cG9ydHMucHgoNyksIHk6ZXhwb3J0cy5weCgxMCl9XG5cdFx0XHRib2FyZFNwZWNzLmVtb2ppSWNvbiA9IHt4OmV4cG9ydHMucHgoOCksIHk6ZXhwb3J0cy5weCg5KX1cblxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5ID0gZXhwb3J0cy5weCgzNi41KVxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzID0gZXhwb3J0cy5weCg0KVxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5Qm90dG9tID0gZXhwb3J0cy5weCg1OClcblxuXHRcdFx0Ym9hcmRTcGVjcy5pUGFkRGVsZXRlT2Zmc2V0ID0gMFxuXHRcdFx0Ym9hcmRTcGVjcy5ib3R0b21Sb3cgPSA4XG5cdFx0XHRib2FyZFNwZWNzLnJldHVybktleSA9IGV4cG9ydHMucHgoNzQpXG5cblx0XHRcdGJvYXJkU3BlY3Muc3BhY2VyID0gZXhwb3J0cy5weCg2KVxuXG5cdFx0d2hlbiBcImlwaG9uZS02c1wiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIxNlxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMzEuNSlcblx0XHRcdFx0aGVpZ2h0OmV4cG9ydHMucHgoNDIpXG5cdFx0XHR9XG5cblx0XHRcdGJvYXJkU3BlY3MuZXhwYW5kZWRLZXkgPSBleHBvcnRzLnB4KDQ2LjUpXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgxNClcblxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nID0ge31cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cxID0gZXhwb3J0cy5weCgzKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzIgPSBleHBvcnRzLnB4KDIyKVxuXHRcdFx0Ym9hcmRTcGVjcy5wYWRkaW5nLnJvdzMgPSBleHBvcnRzLnB4KDU5KVxuXG5cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wID0ge31cblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzEgPSBleHBvcnRzLnB4KDEwKVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMjIpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCgzNClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDQ0KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoMTEpLCB5OmV4cG9ydHMucHgoMil9XG5cdFx0XHRib2FyZFNwZWNzLmRlbGV0ZUljb24gPSB7eDpleHBvcnRzLnB4KDEwKSwgeTpleHBvcnRzLnB4KDEzKX1cblx0XHRcdGJvYXJkU3BlY3MuZW1vamlJY29uID0ge3g6ZXhwb3J0cy5weCgxMSksIHk6ZXhwb3J0cy5weCgxMSl9XG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCg4Ny41KVxuXHRcdFx0Ym9hcmRTcGVjcy5ib3R0b21Sb3cgPSA2XG5cdFx0XHRib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQgPSAwXG5cblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleSA9IGV4cG9ydHMucHgoNDIpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXlSYWRpdXMgPSBleHBvcnRzLnB4KDUpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXlCb3R0b20gPSBleHBvcnRzLnB4KDU2KVxuXG5cdFx0XHRib2FyZFNwZWNzLnNwYWNlciA9IGV4cG9ydHMucHgoNilcblxuXHRcdHdoZW4gXCJpcGhvbmUtNnMtcGx1c1wiXG5cdFx0XHRib2FyZFNwZWNzLmhlaWdodCA9IDIyNlxuXHRcdFx0Ym9hcmRTcGVjcy5rZXkgPSB7XG5cdFx0XHRcdHdpZHRoOmV4cG9ydHMucHgoMzUpXG5cdFx0XHRcdGhlaWdodDpleHBvcnRzLnB4KDQ1KVxuXHRcdFx0fVxuXHRcdFx0Ym9hcmRTcGVjcy5leHBhbmRlZEtleSA9IGV4cG9ydHMucHgoNTApXG5cdFx0XHRib2FyZFNwZWNzLmV4cGFuZGVkU3BhY2VyID0gZXhwb3J0cy5weCgyMClcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZyA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLnBhZGRpbmcucm93MSA9IGV4cG9ydHMucHgoNClcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cyID0gZXhwb3J0cy5weCgyNSlcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3czID0gZXhwb3J0cy5weCg2NylcblxuXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcCA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxID0gZXhwb3J0cy5weCg4KVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MiA9IGV4cG9ydHMucHgoMTkpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3czID0gZXhwb3J0cy5weCgzMClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzQgPSBleHBvcnRzLnB4KDQxKVxuXG5cdFx0XHRib2FyZFNwZWNzLnNoaWZ0SWNvbiA9IHt4OmV4cG9ydHMucHgoMTMpLCB5OmV4cG9ydHMucHgoMil9XG5cdFx0XHRib2FyZFNwZWNzLmRlbGV0ZUljb24gPSB7eDpleHBvcnRzLnB4KDExKSwgeTpleHBvcnRzLnB4KDE0KX1cblx0XHRcdGJvYXJkU3BlY3MuZW1vamlJY29uID0ge3g6ZXhwb3J0cy5weCgxMyksIHk6ZXhwb3J0cy5weCgxMyl9XG5cblx0XHRcdGJvYXJkU3BlY3MuYm90dG9tUm93ID0gNlxuXG5cdFx0XHRib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQgPSAwXG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCg5NylcblxuXHRcdFx0Ym9hcmRTcGVjcy5zaWRlS2V5ID0gZXhwb3J0cy5weCg0NSlcblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleVJhZGl1cyA9IGV4cG9ydHMucHgoNSlcblxuXHRcdFx0Ym9hcmRTcGVjcy5zcGFjZXIgPSBleHBvcnRzLnB4KDYpXG5cdFx0d2hlbiBcImlwYWRcIlxuXHRcdFx0Ym9hcmRTcGVjcy5oZWlnaHQgPSAyNjhcblx0XHRcdGJvYXJkU3BlY3Mua2V5ID0ge1xuXHRcdFx0XHR3aWR0aDpleHBvcnRzLnB4KDU2KVxuXHRcdFx0XHRoZWlnaHQ6ZXhwb3J0cy5weCg1Nilcblx0XHRcdH1cblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZyA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLnBhZGRpbmcucm93MSA9IGV4cG9ydHMucHgoNilcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3cyID0gZXhwb3J0cy5weCgzNSlcblx0XHRcdGJvYXJkU3BlY3MucGFkZGluZy5yb3czID0gZXhwb3J0cy5weCg3NClcblxuXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcCA9IHt9XG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxID0gZXhwb3J0cy5weCgxMClcblx0XHRcdGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzIgPSBleHBvcnRzLnB4KDE4KVxuXHRcdFx0Ym9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyA9IGV4cG9ydHMucHgoMjgpXG5cdFx0XHRib2FyZFNwZWNzLm1hcmdpblRvcC5yb3c0ID0gZXhwb3J0cy5weCg0MClcblxuXHRcdFx0Ym9hcmRTcGVjcy5zaGlmdEljb24gPSB7eDpleHBvcnRzLnB4KDE4KSwgeTpleHBvcnRzLnB4KDIpfVxuXHRcdFx0Ym9hcmRTcGVjcy5kZWxldGVJY29uID0ge3g6ZXhwb3J0cy5weCgxOCksIHk6ZXhwb3J0cy5weCgyMCl9XG5cdFx0XHRib2FyZFNwZWNzLmVtb2ppSWNvbiA9IHt4OmV4cG9ydHMucHgoMTgpLCB5OmV4cG9ydHMucHgoMTgpfVxuXG5cdFx0XHRib2FyZFNwZWNzLmJvdHRvbVJvdyA9IDdcblxuXHRcdFx0Ym9hcmRTcGVjcy5pUGFkRGVsZXRlT2Zmc2V0ID0gYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyArIGJvYXJkU3BlY3Mua2V5LmhlaWdodCAqIDIgLSBib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cxXG5cblx0XHRcdGJvYXJkU3BlY3MucmV0dXJuS2V5ID0gZXhwb3J0cy5weCgxMDYpXG5cblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleSA9IGV4cG9ydHMucHgoNTYpXG5cdFx0XHRib2FyZFNwZWNzLnNpZGVLZXkyID0gZXhwb3J0cy5weCg3Nilcblx0XHRcdGJvYXJkU3BlY3Muc2lkZUtleVJhZGl1cyA9IGV4cG9ydHMucHgoNSlcblxuXHRcdFx0Ym9hcmRTcGVjcy5zcGFjZXIgPSBleHBvcnRzLnB4KDEyKVxuXG5cdGJvYXJkID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcIiNEMUQ1REFcIiwgbmFtZTpcImtleWJvYXJkXCJcblxuXHRib2FyZC5zcGVjcyA9IGJvYXJkU3BlY3NcblxuXHQjVGhpcyB3aWxsIGdlbmVyYXRlIGEgb2JqZWN0IHdpdGggMjE2IGhlaWdodCBhbmQgaXQnbGwgc3RyZXRjaCBlbmQgdG8gZW5kLiBcblx0Ym9hcmQuY29uc3RyYWludHMgPSAoaGVpZ2h0OmJvYXJkU3BlY3MuaGVpZ2h0LCB0cmFpbGluZzowLCBsZWFkaW5nOjApXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdCNUaGlzIHdpbGwgZGV0ZXJpbmUgaWYgaXQgc3RhcnRzIG9uIHRoZSBib3R0b20gb3IgcG9wcyB1cCBmcm9tIHRoZSBib3R0b20gXG5cdGlmIHNldHVwLmFuaW1hdGVkXG5cdFx0Ym9hcmQueSA9IGV4cG9ydHMuaGVpZ2h0XG5cdFx0Ym9hcmQuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6KG1heFk6IGV4cG9ydHMuaGVpZ2h0KVxuXHRcdFx0dGltZTouMjVcblx0XHRcdGN1cnZlOlwiZWFzZS1pbi1vdXRcIlxuXHRlbHNlXG5cdFx0Ym9hcmQubWF4WSA9IGV4cG9ydHMuaGVpZ2h0XG5cblx0I0xldHRlcnMgdG8gYmUgbWFkZVxuXHRsZXR0ZXJzQXJyYXkgPSBbXCJxXCIsIFwid1wiLCBcImVcIiwgXCJyXCIsIFwidFwiLCBcInlcIiwgXCJ1XCIsIFwiaVwiLCBcIm9cIiwgXCJwXCIsIFwiYVwiLCBcInNcIiwgXCJkXCIsIFwiZlwiLCBcImdcIiwgXCJoXCIsIFwialwiLCBcImtcIiwgXCJsXCIsIFwielwiLCBcInhcIiwgXCJjXCIsIFwidlwiLCAgXCJiXCIsIFwiblwiLCBcIm1cIl1cblx0I1RoZXNlIGFycmF5cyBhcmUgZGVwZW5lZGVudCBvbiB0aGUgRGV2aWNlXG5cdHNlY29uZEFycmF5ID0gW11cblx0dGhpcmRBcnJheSA9IFtdXG5cblx0c3dpdGNoIGV4cG9ydHMuZGV2aWNlXG5cdFx0d2hlbiBcImlwYWRcIlxuXHRcdFx0c2Vjb25kQXJyYXkgPSBbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiLCBcIjlcIiwgXCIwXCIsIFwiLVwiLCBcIi9cIiwgXCI6XCIsIFwiO1wiLCBcIihcIiwgXCIpXCIsIFwiJFwiLCBcIiZcIiwgXCJAXCIsIFwidW5kb1wiLCBcImhpZGVcIiwgXCIuXCIsICcsJywgXCI/XCIsIFwiIVwiLCBcIidcIiwgXCJcXFwiXCJdXG5cdFx0XHR0aGlyZEFycmF5ID0gW1wiXFxbXCIsIFwiXFxdXCIsIFwiXFx7XCIsIFwiXFx9XCIsIFwiI1wiLCBcIiVcIiwgXCJeXCIsIFwiKlwiLCBcIitcIiwgXCI9XCIsIFwiX1wiLCBcIlxcXFxcIiwgXCJ8XCIsIFwiflwiLCBcIjxcIiwgXCI+XCIsIFwi4oKsXCIsIFwiwqNcIiwgXCLCpVwiLCBcInJlZG9cIiwgXCJoaWRlXCIsIFwiLlwiLCAnLCcsIFwiP1wiLCBcIiFcIiwgXCInXCIsIFwiXFxcIlwiXVxuXHRcdGVsc2Vcblx0XHRcdHNlY29uZEFycmF5ID0gW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiN1wiLCBcIjhcIiwgXCI5XCIsIFwiMFwiLCBcIi1cIiwgXCIvXCIsIFwiOlwiLCBcIjtcIiwgXCIoXCIsIFwiKVwiLCBcIiRcIiwgXCImXCIsIFwiQFwiLCBcIlxcXCJcIiwgXCIuXCIsICcsJywgXCI/XCIsIFwiIVwiLCBcIidcIl1cblx0XHRcdHRoaXJkQXJyYXkgPSBbXCJcXFtcIiwgXCJcXF1cIiwgXCJcXHtcIiwgXCJcXH1cIiwgXCIjXCIsIFwiJVwiLCBcIl5cIiwgXCIqXCIsIFwiK1wiLCBcIj1cIiwgXCJfXCIsIFwiXFxcXFwiLCBcInxcIiwgXCJ+XCIsIFwiPFwiLCBcIj5cIiwgXCLigqxcIiwgXCLCo1wiLCBcIsKlXCIsIFwi4oCiXCIsIFwiLlwiLCAnLCcsIFwiP1wiLCBcIiFcIiwgXCInXCIsIFwiXFxcIlwiXVxuXHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdGxldHRlcnNBcnJheS5wdXNoIFwiLFwiXG5cdFx0bGV0dGVyc0FycmF5LnB1c2ggXCIuXCJcblxuXHQjTnVtYmVycyB0byBiZSBtYWRlIChkZXBlbmRpbmcgb24gZGV2aWNlKVxuXHRudW1zQXJyYXkgPSBbMC4uOV1cblxuXHQjSG9sZHMgdGhlIGtleXMgdGhhdCB3ZSBtYWtlLiBUaGlzIHdpbGwgYWxsb3dzIHVzIHRvIHF1aWNrbHkgaXRlcmF0ZSB0aHJvdWdoIHRoZW0uIFxuXHRrZXlzQXJyYXkgPSBbXVxuXG5cdGtleVBvcFVwID0gbmV3IExheWVyIHdpZHRoOkBrZXlXaWR0aCwgaGVpZ2h0OkBrZXlIZWlnaHQsIHg6QC54LTE2KmV4cG9ydHMuc2NhbGUsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJrZXkgcG9wIHVwXCJcblx0Ym94ID0gbmV3IExheWVyIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEwKSwgc3VwZXJMYXllcjprZXlQb3BVcCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgY29sb3I6XCJibGFja1wiLCBuYW1lOlwibGV0dGVyXCJcblx0Ym94LnN0eWxlID0ge1xuXHRcdFwiZm9udC1zaXplXCIgOiAzOSAqIGV4cG9ydHMuc2NhbGUgKyBcInB4XCJcblx0XHRcImZvbnQtd2VpZ2h0XCIgOiAzMDBcblx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdCdsaW5lLWhlaWdodCcgOiBAbGluZUhlaWdodFxuXHR9XG5cdEAuY29sb3IgPSBcIndoaXRlXCJcblx0cGF0aCA9IG5ldyBMYXllciBzdXBlckxheWVyOmtleVBvcFVwLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwic2hhcGUgcGF0aFwiXG5cdGJvYXJkLmtleVBvcFVwID0ga2V5UG9wVXBcblx0Ym9hcmQua2V5UG9wVXAuYm94ID0gYm94XG5cblx0cm93c01hcCA9IFtcblx0XHR7IFxuXHRcdFx0XCJwYWRkaW5nXCIgOiBib2FyZFNwZWNzLnBhZGRpbmcucm93MVxuXHRcdFx0XCJzdGFydEluZGV4XCIgOiAwXG5cdFx0XHRcImVuZEluZGV4XCIgOiA5XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MVxuXHRcdH0sXG5cdFx0eyBcblx0XHRcdFwicGFkZGluZ1wiIDogYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzJcblx0XHRcdFwic3RhcnRJbmRleFwiIDogMTBcblx0XHRcdFwiZW5kSW5kZXhcIiA6IDE4XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MlxuXHRcdH0sXG5cdFx0eyBcblx0XHRcdFwicGFkZGluZ1wiIDogYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzNcblx0XHRcdFwic3RhcnRJbmRleFwiIDogMTlcblx0XHRcdFwiZW5kSW5kZXhcIiA6IDI1XG5cdFx0XHRcIm1hcmdpblRvcFwiIDogYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93M1xuXHRcdH1cblx0XVxuXG5cdGZpcnN0Um93S2V5V2lkdGggPSAwXG5cdHNlY29uZFJvd0tleVdpZHRoID0gMFxuXG5cdGJvYXJkLmtleXMgPSB7fVxuXHRmb3IgbGV0dGVyIGluIGxldHRlcnNBcnJheVxuXHRcdGluZGV4ID0gbGV0dGVyc0FycmF5LmluZGV4T2YobGV0dGVyKSBcblx0XHRrZXkgPSBuZXcgTGF5ZXIgbmFtZTpsZXR0ZXIsIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czo1KmV4cG9ydHMuc2NhbGUsIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCIsIGNvbG9yOlwiYmxhY2tcIiwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgd2lkdGg6Ym9hcmRTcGVjcy5rZXkud2lkdGgsIGhlaWdodDpib2FyZFNwZWNzLmtleS5oZWlnaHRcblx0XHRib2FyZC5rZXlzW2xldHRlcl0gPSBrZXlcblx0XHRrZXlQb3BVcC5icmluZ1RvRnJvbnQoKVxuXHRcdGJveC5icmluZ1RvRnJvbnQoKVxuXHRcdGlmIGV4cG9ydHMuc2NhbGUgPT0gMlxuXHRcdFx0a2V5UG9wVXAuY29uc3RyYWludHMgPSAod2lkdGg6NjUsIGhlaWdodDoxMjIpXG5cdFx0XHRwYXRoLmNvbnN0cmFpbnRzID0gKHdpZHRoOjY1LCBoZWlnaHQ6IDEyMilcblx0XHRcdHBhdGgueSA9IDEwXG5cdFx0XHRAcGF0aFdpZHRoID0gZXhwb3J0cy5weCg2NSlcblx0XHRcdEBwYXRoSGVpZ2h0ID0gZXhwb3J0cy5weCgxMjIpXG5cdFx0XHRAa2V5SGVpZ2h0ID0gZXhwb3J0cy5weCgzMilcblx0XHRcdEBrZXlXaWR0aCA9IGV4cG9ydHMucHgoNDQpXG5cdFx0XHRAbGluZUhlaWdodCA9IEBrZXlXaWR0aCAtIDE3ICsgXCJweFwiXG5cdFx0XHRib3guY29uc3RyYWludHMgPSAod2lkdGg6MzIsIGhlaWdodDo0NClcblx0XHRcdGJveC5jZW50ZXJYKClcblx0XHRcdGJveC55ID0gZXhwb3J0cy5weCgyOClcblxuXHRcdGlmIGV4cG9ydHMuc2NhbGUgPT0gM1xuXHRcdFx0a2V5UG9wVXAuY29uc3RyYWludHMgPSAod2lkdGg6NjgsIGhlaWdodDoxMjIpXG5cdFx0XHRAa2V5SGVpZ2h0ID0gZXhwb3J0cy5weCgxMjIpXG5cdFx0XHRAa2V5V2lkdGggPSBleHBvcnRzLnB4KDY1KVxuXHRcdFx0QGxpbmVIZWlnaHQgPSBAa2V5V2lkdGggKyBcInB4XCJcblx0XHRcdEBwYXRoV2lkdGggPSBleHBvcnRzLnB4KDY4KVxuXHRcdFx0QHBhdGhIZWlnaHQgPSBleHBvcnRzLnB4KDEyOClcblx0XHRcdHBhdGgueSA9IDBcblxuXG5cdFx0XHRib3guY29uc3RyYWludHMgPSAod2lkdGg6MzUsIGhlaWdodDo0Nilcblx0XHRcdGJveC5jZW50ZXJYKClcblx0XHRcdGJveC55ID0gZXhwb3J0cy5weCgyOClcblxuXHRcdGlmIGV4cG9ydHMud2lkdGggPT0gNjQwXG5cdFx0XHRrZXkuY29uc3RyYWludHMgPSAod2lkdGg6MjYsIGhlaWdodDozOSlcblxuXHRcdGtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGtleS5zdHlsZSA9IHtcblx0XHRcdFwiZm9udC1zaXplXCIgOiAyNSAqIGV4cG9ydHMuc2NhbGUgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDMwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGtleS5oZWlnaHQgLSBleHBvcnRzLnB4KDIpICsgXCJweFwiXG5cdFx0fVxuXHRcdGlmIGxldHRlciA9PSBcIixcIiB8fCBsZXR0ZXIgPT0gXCIuXCJcblx0XHRcdGV4dHJhU3ltYm9sID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6a2V5LCB3aWR0aDpleHBvcnRzLnB4KDMwKSwgaGVpZ2h0OmV4cG9ydHMucHgoMzApLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCB5OmV4cG9ydHMucHgoMTUpLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIG5hbWU6XCIhLz9cIlxuXHRcdFx0ZXh0cmFTeW1ib2wuY2VudGVyWCgpXG5cdFx0XHRleHRyYVN5bWJvbC5zdHlsZSA9IHtcblx0XHRcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMjQpICsgXCJweFwiXG5cdFx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDMwMFxuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHRcdFx0J3RleHQtYWxpZ24nIDogJ2NlbnRlcidcblx0XHRcdFx0J2xpbmUtaGVpZ2h0JyA6IFwiMjBweFwiXG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCBsZXR0ZXJcblx0XHRcdFx0d2hlbiBcIixcIiB0aGVuIGV4dHJhU3ltYm9sLmh0bWwgPSBcIiFcIlxuXHRcdFx0XHR3aGVuIFwiLlwiIHRoZW4gZXh0cmFTeW1ib2wuaHRtbCA9IFwiP1wiXG5cdFx0XHRrZXkuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IGtleS5oZWlnaHQgKyBleHBvcnRzLnB4KDEwKSArIFwicHhcIlxuXG5cdFx0a2V5Lmh0bWwgPSBsZXR0ZXJcblx0XHRcblx0XHRpZiBpbmRleCA8PSByb3dzTWFwWzBdLmVuZEluZGV4XG5cdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFswXS5zdGFydEluZGV4XG5cdFx0XHRrZXkueCA9IHJvd3NNYXBbMF0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAoZmlyc3RSb3dLZXlXaWR0aClcblx0XHRcdGtleS55ID0gcm93c01hcFswXS5tYXJnaW5Ub3Bcblx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdCNIYW5kbGUgdGhlIGV4dHJhIHBpeGVscyBvbiB0aGUgdG9wIHJvd1xuXHRcdFx0XHRpZiBpbmRleCAlIDIgIT0gMFxuXHRcdFx0XHRcdGtleS53aWR0aCA9IGtleS53aWR0aCArIGV4cG9ydHMucHgoMilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGtleS53aWR0aCA9IGtleS53aWR0aCArIGV4cG9ydHMucHgoMSlcblx0XHRcdGZpcnN0Um93S2V5V2lkdGggPSBmaXJzdFJvd0tleVdpZHRoICsga2V5LndpZHRoXG5cdFx0aWYgaW5kZXggPiByb3dzTWFwWzBdLmVuZEluZGV4ICYmIGluZGV4IDw9IHJvd3NNYXBbMV0uZW5kSW5kZXhcblx0XHRcdHJvd0luZGV4ID0gaW5kZXggLSByb3dzTWFwWzFdLnN0YXJ0SW5kZXhcblx0XHRcdGtleS54ID0gcm93c01hcFsxXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChzZWNvbmRSb3dLZXlXaWR0aClcblx0XHRcdGtleS55ID0gcm93c01hcFsxXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0XG5cdFx0XHRrZXkud2lkdGggPSBrZXkud2lkdGggKyBleHBvcnRzLnB4KDEpXG5cdFx0XHRzZWNvbmRSb3dLZXlXaWR0aCA9IHNlY29uZFJvd0tleVdpZHRoICsga2V5LndpZHRoXG5cdFx0aWYgaW5kZXggPiByb3dzTWFwWzFdLmVuZEluZGV4XG5cdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFsyXS5zdGFydEluZGV4XG5cdFx0XHRrZXkueCA9IHJvd3NNYXBbMl0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAocm93SW5kZXgqa2V5LndpZHRoKVxuXHRcdFx0a2V5LnkgPSByb3dzTWFwWzJdLm1hcmdpblRvcCArIGtleS5oZWlnaHQgKiAyXG5cblx0XHRwYXRoLmh0bWwgPSBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tAcGF0aFdpZHRofXB4JyBoZWlnaHQ9JyN7QHBhdGhIZWlnaHR9JyB2aWV3Qm94PScwIDAgNjMgMTE0JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PHRpdGxlPlJlY3RhbmdsZSA0NCBDb3B5PC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPlxuXHRcdFx0XHRcdDxmaWx0ZXIgeD0nLTUwJScgeT0nLTUwJScgd2lkdGg9JzIwMCUnIGhlaWdodD0nMjAwJScgZmlsdGVyVW5pdHM9J29iamVjdEJvdW5kaW5nQm94JyBpZD0nZmlsdGVyLTEnPlxuXHRcdFx0XHRcdFx0PGZlT2Zmc2V0IGR4PScwJyBkeT0nMCcgaW49J1NvdXJjZUFscGhhJyByZXN1bHQ9J3NoYWRvd09mZnNldE91dGVyMSc+PC9mZU9mZnNldD5cblx0XHRcdFx0XHRcdDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249JzEuNScgaW49J3NoYWRvd09mZnNldE91dGVyMScgcmVzdWx0PSdzaGFkb3dCbHVyT3V0ZXIxJz48L2ZlR2F1c3NpYW5CbHVyPlxuXHRcdFx0XHRcdFx0PGZlQ29sb3JNYXRyaXggdmFsdWVzPScwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjEgMCcgaW49J3NoYWRvd0JsdXJPdXRlcjEnIHR5cGU9J21hdHJpeCcgcmVzdWx0PSdzaGFkb3dNYXRyaXhPdXRlcjEnPjwvZmVDb2xvck1hdHJpeD5cblx0XHRcdFx0XHRcdDxmZU1lcmdlPlxuXHRcdFx0XHRcdFx0XHQ8ZmVNZXJnZU5vZGUgaW49J3NoYWRvd01hdHJpeE91dGVyMSc+PC9mZU1lcmdlTm9kZT5cblx0XHRcdFx0XHRcdFx0PGZlTWVyZ2VOb2RlIGluPSdTb3VyY2VHcmFwaGljJz48L2ZlTWVyZ2VOb2RlPlxuXHRcdFx0XHRcdFx0PC9mZU1lcmdlPlxuXHRcdFx0XHRcdDwvZmlsdGVyPlxuXHRcdFx0XHQ8L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNicgc2tldGNoOnR5cGU9J01TQXJ0Ym9hcmRHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTExOC4wMDAwMDAsIC0yNDAuMDAwMDAwKScgc3Ryb2tlPScjQzdDN0M3JyBmaWx0ZXI9J3VybCgjZmlsdGVyLTEpJyBzdHJva2Utd2lkdGg9JzAuNScgXG5cdFx0XHRcdFx0ZmlsbD0nI0ZGRkZGRicgb3BhY2l0eT0nMC45OTgzNjc1MzcnPlxuXHRcdFx0XHRcdCA8cGF0aCBkPSdNMTM0LDMwNiBDMTM0LDMwNiAxMjEsMjk1IDEyMSwyOTAgQzEyMSwyNzkuNjE2Nzg4IDEyMSwyNTMuMDAxNDU2IDEyMSwyNTMuMDAxNDU2IEMxMjEsMjQ3LjQ3NzgwNCAxMjUuNDg1ODMyLDI0MyAxMzEuMDAyNzc0LDI0MyBMMTY3Ljg2MjEyNywyNDMgQzE3My4zODY1MDcsMjQzIDE3Ny44ODA4NjIsMjQ3LjQ2OTkwNSBcblx0XHRcdFx0XHQgMTc3LjkwMDA0NCwyNTIuOTk3MjcxIEMxNzcuOTAwMDQ0LDI1Mi45OTcyNzEgMTc4LDI4MCAxNzcuOTk5OTk5LDI5MCBDMTc3Ljk5OTk5OSwyOTUuMDA2NTUzIDE2NSwzMDYgMTY1LDMwNiBMMTY1LDM0Ni4wNDk1OTQgXG5cdFx0XHRcdFx0IEMxNjUsMzQ4LjgwNjgwNyAxNjIuNzcwNTU2LDM1MS4wNDE5NjkgMTYwLjAwMjA5OCwzNTEuMDQxOTY5IEwxMzguOTk3OTAyLDM1MS4wNDE5NjkgXG5cdFx0XHRcdFx0ICBDMTM2LjIzNzYzNywzNTEuMDQxOTY5IDEzNCwzNDguODA4MzMxIDEzNCwzNDYuMDQ5NTk0IEwxMzQsMzA2IFonIGlkPSdSZWN0YW5nbGUtNDQtQ29weScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTQ5LjUwMDAwMCwgMjk3LjAyMDk4NSkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMTQ5LjUwMDAwMCwgLTI5Ny4wMjA5ODUpICc+XG5cdFx0XHRcdFx0ICA8L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRcdGtleXNBcnJheS5wdXNoIGtleVxuXG5cdFx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCIgJiYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkLXByb1wiXG5cdFx0XHQjIyBpUGhvbmUgS2V5IEFuaW1hdGlvbnNcblx0XHRcdGtleS5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdFx0a2V5UG9wVXAudmlzaWJsZSA9IHRydWVcdFxuXHRcdFx0XHRib3guaHRtbCA9IEAubmFtZVxuXHRcdFx0XHRrZXlQb3BVcC5tYXhZID0gQC5tYXhZXG5cdFx0XHRcdGtleVBvcFVwLm1pZFggPSBALm1pZFhcblxuXHRcdFx0a2V5Lm9uIEV2ZW50cy5Ub3VjaE1vdmUsIC0+XG5cdFx0XHRcdGJveC5odG1sID0gQC5uYW1lXG5cdFx0XHRcdGtleVBvcFVwLm1heFkgPSBALm1heFlcblx0XHRcdFx0a2V5UG9wVXAubWlkWCA9IEAubWlkWFx0XG5cblx0XHRcdGtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRcdGtleVBvcFVwLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0ZWxzZSBcblx0XHRcdCNpUGFkIEtleSBBbmltYXRpb25zXG5cdFx0XHRrZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0XHRcdEAuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0a2V5Lm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdFx0QC5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblxuXHRcdGtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRpZiBzaGlmdEljb24uc3RhdGVzLnN0YXRlID09IFwib25cIlxuXHRcdFx0XHRzaGlmdEljb24uc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRcdFx0c2hpZnRLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXG5cdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0c2hpZnRJY29uMi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cblx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRrZXkuc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAnbG93ZXJjYXNlJ1xuXHRcdFx0XHRib3guc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAnbG93ZXJjYXNlJ1xuXG5cdFx0XHRcdGlmIHNldHVwLm91dHB1dFxuXHRcdFx0XHRcdEBuZXdUZXh0ID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbCArIEAubmFtZS50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0OkBuZXdUZXh0XSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRcdFx0QG5ld1RleHQgPSBzZXR1cC5vdXRwdXQudGV4dC5odG1sICsgQC5uYW1lXG5cdFx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0OkBuZXdUZXh0XSlcblxuXHRib2FyZC5rZXlzQXJyYXkgPSBrZXlzQXJyYXlcblxuXHRib2FyZC5rZXlib2FyZFN0YXRlID0gMVxuXG5cdCMjIFNISUZUIEtFWVxuXG5cdHNoaWZ0S2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJzaGlmdFwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXksIGhlaWdodDpib2FyZFNwZWNzLnNpZGVLZXksIHk6KGJvYXJkU3BlY3MubWFyZ2luVG9wLnJvdzMgKyBib2FyZFNwZWNzLmtleS5oZWlnaHQgKiAyKVxuXHRzaGlmdEtleS5jb25zdHJhaW50cyA9IChsZWFkaW5nOmV4cG9ydHMucHQoYm9hcmRTcGVjcy5wYWRkaW5nLnJvdzEpKVxuXHRzaGlmdEljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjpzaGlmdEtleSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLnNoaWZ0SWNvbi54LCB5OmJvYXJkU3BlY3Muc2hpZnRJY29uLnlcblx0c2hpZnRJY29uLmh0bWwgPSBpY29uTGlicmFyeS5zaGlmdC5vZmZcblxuXHRzaGlmdEljb24uc3RhdGVzLmFkZFxuXHRcdFwib25cIjpcblx0XHRcdGh0bWw6IGljb25MaWJyYXJ5LnNoaWZ0Lm9uXG5cdHNoaWZ0SWNvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdCAgdGltZTogLjAxXG5cblx0c2hpZnRLZXkuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdFx0fVxuXG5cblxuXHRzaGlmdEtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGUgXG5cdFx0XHR3aGVuIDFcblx0XHRcdFx0c2hpZnRJY29uLnN0YXRlcy5uZXh0KClcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzaGlmdEljb24yLnN0YXRlcy5uZXh0KClcblx0XHRcdFx0aWYgc2hpZnRJY29uLnN0YXRlcy5zdGF0ZSA9PSBcIm9uXCJcblx0XHRcdFx0XHRzaGlmdEtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlx0XG5cdFx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS5zdHlsZVsndGV4dC10cmFuc2Zvcm0nXSA9ICd1cHBlcmNhc2UnXG5cdFx0XHRcdFx0Ym94LnN0eWxlWyd0ZXh0LXRyYW5zZm9ybSddID0gJ3VwcGVyY2FzZSdcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRzaGlmdEtleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0XHRcdFx0Zm9yIGtleSBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0XHRib3guc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXSA9ICdsb3dlcmNhc2UnXG5cdFx0XHR3aGVuIDJcblx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0a2V5Lmh0bWwgPSB0aGlyZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdGtleS5uYW1lID0gdGhpcmRBcnJheVtpbmRleF1cblx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDNcblx0XHRcdFx0c2hpZnRLZXkuaHRtbCA9IFwiMTIzXCJcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiMTIzXCJcblx0XHRcdHdoZW4gM1xuXHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRpZiBpbmRleCA8IDI3XG5cdFx0XHRcdFx0XHRrZXkubmFtZSA9IHNlY29uZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0a2V5Lmh0bWwgPSBzZWNvbmRBcnJheVtpbmRleF1cblx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXG5cdGJvYXJkLmtleXMuc2hpZnQgPSBzaGlmdEtleVxuXHRib2FyZC5rZXlzLnNoaWZ0Lmljb24gPSBzaGlmdEljb25cblxuXHQjIyBERUxFVEUgS0VZXG5cblx0ZGVsZXRlS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czpib2FyZFNwZWNzLnNpZGVLZXlSYWRpdXMsIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCBuYW1lOlwiZGVsZXRlXCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleSwgaGVpZ2h0OmJvYXJkU3BlY3Muc2lkZUtleSwgeTooYm9hcmRTcGVjcy5tYXJnaW5Ub3Aucm93MyArIGJvYXJkU3BlY3Mua2V5LmhlaWdodCAqIDIgLSBib2FyZFNwZWNzLmlQYWREZWxldGVPZmZzZXQpXG5cblxuXHRkZWxldGVLZXkuY29uc3RyYWludHMgPSAodHJhaWxpbmc6ZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcikvMilcblx0ZGVsZXRlSWNvbiA9IG5ldyBMYXllciBzdXBlckxheWVyOmRlbGV0ZUtleSwgd2lkdGg6ZXhwb3J0cy5weCgyNCksIGhlaWdodDpleHBvcnRzLnB4KDE4KSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLmRlbGV0ZUljb24ueCwgeTpib2FyZFNwZWNzLmRlbGV0ZUljb24ueVxuXHRcblx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRkZWxldGVLZXkud2lkdGggPSBkZWxldGVLZXkud2lkdGggKyBleHBvcnRzLnB4KDUpXG5cblx0ZGVsZXRlSWNvbi5zdGF0ZXMuYWRkIFxuXHRcdFwib25cIjogXG5cdFx0XHRodG1sOiBpY29uTGlicmFyeS5kZWxldGUub25cblxuXHRkZWxldGVJY29uLnN0YXRlcy5hZGRcblx0XHRvZmY6IFxuXHRcdFx0aHRtbDogaWNvbkxpYnJhcnkuZGVsZXRlLm9mZlxuXG5cblx0ZGVsZXRlS2V5Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdGRlbGV0ZUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0XHRkZWxldGVJY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib25cIilcblxuXHRkZWxldGVLZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdGRlbGV0ZUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpXG5cdFx0ZGVsZXRlSWNvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcIm9mZlwiKVxuXG5cdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRpbml0aWFsTGVuZ3RoID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5sZW5ndGhcblx0XHRcdG5ld1RleHQgPSBzZXR1cC5vdXRwdXQudGV4dC5odG1sLnNsaWNlKDAsIC0xKVxuXHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0ZW5kTGVuZ3RoID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5sZW5ndGhcblx0XHRcdGlmIGluaXRpYWxMZW5ndGggPT0gZW5kTGVuZ3RoIFxuXHRcdFx0XHRuZXdUZXh0ID0gc2V0dXAub3V0cHV0LnRleHQuaHRtbC5zbGljZSgwLCAtNilcblx0XHRcdFx0ZXhwb3J0cy51cGRhdGUoc2V0dXAub3V0cHV0LnRleHQsIFt0ZXh0Om5ld1RleHRdKVxuXHRcdFx0aWYgc2V0dXAub3V0cHV0LnRleHQuaHRtbCA9PSBcIlwiXG5cdFx0XHRcdHNldHVwLm91dHB1dC5wbGFjZWhvbGRlci52aXNpYmxlID0gdHJ1ZVxuXG5cblxuXHRkZWxldGVJY29uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwib2ZmXCIpXG5cblx0Ym9hcmQua2V5cy5kZWxldGUgPSBkZWxldGVLZXlcblx0Ym9hcmQua2V5cy5kZWxldGUuaWNvbiA9IGRlbGV0ZUljb25cblxuXHQjIyBFWFRSQSBLRVlTXG5cblx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRrZXlib2FyZEtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBuYW1lOlwiZGlzbWlzc1wiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKSwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgd2lkdGg6Ym9hcmRTcGVjcy5zaWRlS2V5LCBoZWlnaHQ6Ym9hcmRTcGVjcy5zaWRlS2V5XG5cdFx0a2V5Ym9hcmRLZXkuY29uc3RyYWludHMgPSB7dHJhaWxpbmdFZGdlczpkZWxldGVLZXksIGJvdHRvbTpib2FyZFNwZWNzLmJvdHRvbVJvd31cblx0XHRrZXlib2FyZEljb24gPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjprZXlib2FyZEtleSwgd2lkdGg6ZXhwb3J0cy5weCgzMi41KSwgaGVpZ2h0OmV4cG9ydHMucHgoMjMuNSksIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0XHRrZXlib2FyZEljb24uaHRtbCA9IGljb25MaWJyYXJ5LmtleWJvYXJkXG5cdFx0a2V5Ym9hcmRJY29uLmNlbnRlcigpXG5cblx0XHRib2FyZC5rZXlzLmRpc21pc3MgPSBrZXlib2FyZEtleVxuXG5cdFx0c2hpZnRLZXkyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJzaGlmdFwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLGNvbG9yOmV4cG9ydHMuY29sb3IoXCJibGFja1wiKSwgYmFja2dyb3VuZENvbG9yOmV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIiksIHNoYWRvd1k6ZXhwb3J0cy5weCgxKSwgc2hhZG93Q29sb3I6XCIjOTI5NDk4XCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleTIsIGhlaWdodDpib2FyZFNwZWNzLnNpZGVLZXlcblx0XHRzaGlmdEtleTIuY29uc3RyYWludHMgPSAodHJhaWxpbmdFZGdlczpkZWxldGVLZXksIGJvdHRvbUVkZ2VzOnNoaWZ0S2V5KVxuXHRcdHNoaWZ0SWNvbjIgPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjpzaGlmdEtleTIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIHg6Ym9hcmRTcGVjcy5zaGlmdEljb24ueCtleHBvcnRzLnB4KDEwKSwgeTpib2FyZFNwZWNzLnNoaWZ0SWNvbi55XG5cdFx0c2hpZnRJY29uMi5odG1sID0gaWNvbkxpYnJhcnkuc2hpZnQub2ZmXG5cblx0XHRzaGlmdEtleTIuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IChib2FyZFNwZWNzLmtleS5oZWlnaHQpICsgXCJweFwiXG5cblx0XHR9XG5cblxuXHRcdHNoaWZ0SWNvbjIuc3RhdGVzLmFkZFxuXHRcdFx0XCJvblwiOlxuXHRcdFx0XHRodG1sOiBpY29uTGlicmFyeS5zaGlmdC5vblxuXHRcdHNoaWZ0SWNvbjIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdCAgdGltZTogLjAxXG5cblx0XHRzaGlmdEljb24yLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGUgXG5cdFx0XHRcdHdoZW4gMVxuXHRcdFx0XHRcdHNoaWZ0SWNvbi5zdGF0ZXMubmV4dCgpXG5cdFx0XHRcdFx0c2hpZnRJY29uMi5zdGF0ZXMubmV4dCgpXG5cdFx0XHRcdFx0aWYgc2hpZnRJY29uLnN0YXRlcy5zdGF0ZSA9PSBcIm9uXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlx0XG5cdFx0XHRcdFx0XHRmb3Iga2V5IGluIGtleXNBcnJheVxuXHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbJ3RleHQtdHJhbnNmb3JtJ10gPSAndXBwZXJjYXNlJ1xuXHRcdFx0XHRcdFx0Ym94LnN0eWxlWyd0ZXh0LXRyYW5zZm9ybSddID0gJ3VwcGVyY2FzZSdcblx0XHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdFx0c2hpZnRLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmJhY2tncm91bmRDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIilcblx0XHRcdFx0XHRcdGZvciBrZXkgaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0XHRcdGJveC5zdHlsZVtcInRleHQtdHJhbnNmb3JtXCJdID0gJ2xvd2VyY2FzZSdcblx0XHRcdFx0d2hlbiAyXG5cdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRrZXkuaHRtbCA9IHRoaXJkQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRrZXkubmFtZSA9IHRoaXJkQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDNcblx0XHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIxMjNcIlxuXHRcdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiMTIzXCJcblx0XHRcdFx0d2hlbiAzXG5cdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRpZiBpbmRleCA8IDI3XG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRcdHNoaWZ0S2V5Lmh0bWwgPSBcIiMrPVwiXG5cdFx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRcdGJvYXJkLmtleWJvYXJkU3RhdGUgPSAyXG5cblxuXHRcdG51bUtleTIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpib2FyZCwgbmFtZTpcIm51bVwiLCBib3JkZXJSYWRpdXM6Ym9hcmRTcGVjcy5zaWRlS2V5UmFkaXVzLCBjb2xvcjpleHBvcnRzLmNvbG9yKFwiYmxhY2tcIiksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXkyLCBoZWlnaHQ6Ym9hcmRTcGVjcy5rZXkuaGVpZ2h0XG5cdFx0bnVtS2V5Mi5odG1sID0gXCIuPzEyM1wiXG5cdFx0bnVtS2V5Mi5zdHlsZSA9IHtcblx0XHRcdFwiZm9udC1zaXplXCIgOiBleHBvcnRzLnB4KDE2KSArIFwicHhcIlxuXHRcdFx0XCJmb250LXdlaWdodFwiIDogNDAwXG5cdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHRcdCd0ZXh0LWFsaWduJyA6ICdjZW50ZXInXG5cdFx0XHQnbGluZS1oZWlnaHQnIDogYm9hcmRTcGVjcy5rZXkuaGVpZ2h0ICsgXCJweFwiXG5cblx0XHR9XG5cdFx0bnVtS2V5Mi5jb25zdHJhaW50cyA9IHt0cmFpbGluZzpba2V5Ym9hcmRLZXksIDEyXSwgYm90dG9tRWRnZXM6a2V5Ym9hcmRLZXl9XG5cblx0XHRudW1LZXkyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0c3dpdGNoIGJvYXJkLmtleWJvYXJkU3RhdGVcblx0XHRcdFx0d2hlbiAxXG5cdFx0XHRcdFx0IyMgQ2hhbmdlIExldHRlcnNcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGlmIGluZGV4IDwgMjdcblx0XHRcdFx0XHRcdFx0aWYgc2Vjb25kQXJyYXlbaW5kZXhdID09IFwidW5kb1wiXG5cdFx0XHRcdFx0XHRcdFx0a2V5LndpZHRoID0ga2V5LndpZHRoICogMiArIGJvYXJkU3BlY3Muc3BhY2VyXG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC1zaXplXCJdID0gZXhwb3J0cy5weCgxNykgKyBcInB4XCJcblx0XHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbXCJmb250LXdlaWdodFwiXSA9IDQwMFxuXHRcdFx0XHRcdFx0XHRpZiBzZWNvbmRBcnJheVtpbmRleF0gPT0gXCJoaWRlXCJcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDI2XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0a2V5LnZpc2libGUgPSBmYWxzZVxuXG5cdFx0XHRcdFx0IyMgSGFuZGxlIG51bSBrZXlzIGFuZCBzaGlmdCBrZXlzXG5cdFx0XHRcdFx0bnVtS2V5Lmh0bWwgPSBcIkFCQ1wiXG5cdFx0XHRcdFx0c2hpZnRLZXkuaHRtbCA9IFwiIys9XCJcblx0XHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBleHBvcnRzLmRldmljZSA9PSBcImlwYWRcIlxuXHRcdFx0XHRcdFx0c2hpZnRJY29uMi52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRcdFx0bnVtS2V5Mi5odG1sID0gXCJBQkNcIlxuXHRcdFx0XHRcdGJvYXJkLmtleWJvYXJkU3RhdGUgPSAyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGlmIGtleS5odG1sID09IFwidW5kb1wiIHx8IFwicmVkb1wiXG5cdFx0XHRcdFx0XHRcdGtleS53aWR0aCA9IGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IGV4cG9ydHMucHgoMjUpICsgXCJweFwiXG5cdFx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtd2VpZ2h0XCJdID0gMzAwXG5cdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRcdGtleS5uYW1lID0gbGV0dGVyc0FycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0a2V5Lmh0bWwgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+IDI1XG5cdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCJcIlxuXHRcdFx0XHRcdHNoaWZ0SWNvbi52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRudW1LZXkuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdFx0bnVtS2V5Mi5odG1sID0gXCIuPzEyM1wiXG5cdFx0XHRcdFx0XHRzaGlmdEtleTIuaHRtbCA9IFwiXCJcblx0XHRcdFx0XHRcdHNoaWZ0SWNvbjIudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMVxuXG5cblx0IyMgTlVNIEtFWSB0b3A6ZXhwb3J0cy5wdChib2FyZFNwZWNzLm1hcmdpblRvcC5yb3c0ICsgYm9hcmRTcGVjcy5rZXkuaGVpZ2h0KjMpXG5cblx0bnVtS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIG5hbWU6XCJudW1cIiwgYm9yZGVyUmFkaXVzOmV4cG9ydHMucHgoNSksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCBjb2xvcjpcImJsYWNrXCIsIHdpZHRoOmJvYXJkU3BlY3Muc2lkZUtleSwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRudW1LZXkuY29uc3RyYWludHMgPSAoYm90dG9tOmJvYXJkU3BlY3MuYm90dG9tUm93LCBsZWFkaW5nRWRnZXM6c2hpZnRLZXkpXG5cdGlmIGV4cG9ydHMuZGV2aWNlICE9IFwiaXBhZFwiICYmIGV4cG9ydHMuZGV2aWNlICE9IFwiaXBhZC1wcm9cIlxuXHRcdG51bUtleS5odG1sID0gXCIxMjNcIlxuXHRlbHNlIFxuXHRcdG51bUtleS5odG1sID0gXCIuPzEyM1wiXG5cdG51bUtleS5zdHlsZSA9IHtcblx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcImZvbnQtd2VpZ2h0XCIgOiA0MDBcblx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdCdsaW5lLWhlaWdodCcgOiBib2FyZFNwZWNzLmtleS5oZWlnaHQgKyBcInB4XCJcblx0fVxuXG5cdG51bUtleS5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRzd2l0Y2ggYm9hcmQua2V5Ym9hcmRTdGF0ZVxuXHRcdFx0d2hlbiAxXG5cdFx0XHRcdCMjIENoYW5nZSBMZXR0ZXJzXHRcdFxuXHRcdFx0XHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2Vcblx0XHRcdFx0XHR3aGVuIFwiaXBhZFwiXG5cdFx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdFx0aWYgaW5kZXggPCAyN1xuXHRcdFx0XHRcdFx0XHRcdGlmIHNlY29uZEFycmF5W2luZGV4XSA9PSBcInVuZG9cIlxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5LndpZHRoID0ga2V5LndpZHRoICogMiArIGJvYXJkU3BlY3Muc3BhY2VyXG5cdFx0XHRcdFx0XHRcdFx0XHRrZXkuc3R5bGVbXCJmb250LXNpemVcIl0gPSBleHBvcnRzLnB4KDE3KSArIFwicHhcIlxuXHRcdFx0XHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC13ZWlnaHRcIl0gPSA0MDBcblx0XHRcdFx0XHRcdFx0XHRpZiBzZWNvbmRBcnJheVtpbmRleF0gPT0gXCJoaWRlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGtleS52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRrZXkubmFtZSA9IHNlY29uZEFycmF5W2luZGV4XVxuXHRcdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdFx0aWYgaW5kZXggPT0gMjZcblx0XHRcdFx0XHRcdFx0XHRcdGtleS5zdWJMYXllcnNbMF0udmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRzaGlmdEljb24yLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRcdFx0c2hpZnRLZXkyLmh0bWwgPSBcIiMrPVwiXG5cdFx0XHRcdFx0XHRudW1LZXkyLmh0bWwgPSBcIkFCQ1wiXG5cdFx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJvd0luZGV4ID0gMCBcblx0XHRcdFx0XHRcdHNlY29uZFJvd0tleVdpZHRoID0gMFxuXHRcdFx0XHRcdFx0Zm9yIGtleSwgaW5kZXggaW4ga2V5c0FycmF5XG5cdFx0XHRcdFx0XHRcdGtleS5uYW1lID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGtleS5odG1sID0gc2Vjb25kQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDE5XG5cdFx0XHRcdFx0XHRcdFx0a2V5LnkgPSByb3dzTWFwWzFdLm1hcmdpblRvcCArIGtleS5oZWlnaHRcblx0XHRcdFx0XHRcdFx0IyMgMm5kIFJvd1xuXHRcdFx0XHRcdFx0XHRpZiBpbmRleCA+IDkgJiYgaW5kZXggPCAyMFxuXHRcdFx0XHRcdFx0XHRcdGtleS54ID0gcm93c01hcFswXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChzZWNvbmRSb3dLZXlXaWR0aClcblx0XHRcdFx0XHRcdFx0XHRyb3dJbmRleCsrXG5cdFx0XHRcdFx0XHRcdFx0c2Vjb25kUm93S2V5V2lkdGggPSBzZWNvbmRSb3dLZXlXaWR0aCArIGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID09IDIwXG5cdFx0XHRcdFx0XHRcdFx0a2V5LmNvbnN0cmFpbnRzID0ge2xlYWRpbmc6W3NoaWZ0S2V5LCBleHBvcnRzLnB0KGJvYXJkU3BlY3MuZXhwYW5kZWRTcGFjZXIpXX1cblx0XHRcdFx0XHRcdFx0XHRleHBvcnRzLmxheW91dCgpXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMTlcblx0XHRcdFx0XHRcdFx0XHRrZXkud2lkdGggPSBib2FyZFNwZWNzLmV4cGFuZGVkS2V5XG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMjBcblx0XHRcdFx0XHRcdFx0XHRrZXkuY29uc3RyYWludHMgPSB7bGVhZGluZzpba2V5c0FycmF5W2luZGV4IC0gMV0sIGV4cG9ydHMucHQoYm9hcmRTcGVjcy5zcGFjZXIpXX1cblx0XHRcdFx0XHRcdFx0XHRleHBvcnRzLmxheW91dCgpXG5cdFx0XHRcdFx0XHRcdGlmIGluZGV4ID4gMjRcblx0XHRcdFx0XHRcdFx0XHRrZXkudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdFx0XHRib2FyZC5rZXlib2FyZFN0YXRlID0gMlxuXG5cblx0XHRcdFx0IyMgSGFuZGxlIG51bSBrZXlzIGFuZCBzaGlmdCBrZXlzXG5cdFx0XHRcdG51bUtleS5odG1sID0gXCJBQkNcIlxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCIjKz1cIlxuXHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IGZhbHNlXG5cblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCJcblx0XHRcdFx0XHRzZWNvbmRSb3dLZXlXaWR0aCA9IDBcblx0XHRcdFx0XHRyb3dJbmRleCA9IDBcblx0XHRcdFx0XHRmb3Iga2V5LCBpbmRleCBpbiBrZXlzQXJyYXlcblx0XHRcdFx0XHRcdGtleS53aWR0aCA9IGJvYXJkU3BlY3Mua2V5LndpZHRoXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+IDkgJiYgaW5kZXggPCAxOVxuXHRcdFx0XHRcdFx0XHRrZXkueCA9IHJvd3NNYXBbMV0ucGFkZGluZyArIChyb3dJbmRleCpib2FyZFNwZWNzLnNwYWNlcikgKyAoc2Vjb25kUm93S2V5V2lkdGgpXG5cdFx0XHRcdFx0XHRcdGtleS55ID0gcm93c01hcFsxXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0XG5cdFx0XHRcdFx0XHRcdHJvd0luZGV4Kytcblx0XHRcdFx0XHRcdFx0c2Vjb25kUm93S2V5V2lkdGggPSBzZWNvbmRSb3dLZXlXaWR0aCArIGtleS53aWR0aFxuXHRcdFx0XHRcdFx0aWYgaW5kZXggPT0gMTlcblx0XHRcdFx0XHRcdFx0a2V5LnkgPSByb3dzTWFwWzJdLm1hcmdpblRvcCArIGtleS5oZWlnaHQgKiAyXG5cdFx0XHRcdFx0XHRpZiBpbmRleCA+PSAxOVxuXHRcdFx0XHRcdFx0XHRyb3dJbmRleCA9IGluZGV4IC0gcm93c01hcFsyXS5zdGFydEluZGV4XG5cdFx0XHRcdFx0XHRcdGtleS54ID0gcm93c01hcFsyXS5wYWRkaW5nICsgKHJvd0luZGV4KmJvYXJkU3BlY3Muc3BhY2VyKSArIChyb3dJbmRleCprZXkud2lkdGgpXG5cdFx0XHRcdFx0XHRcdGtleS55ID0gcm93c01hcFsyXS5tYXJnaW5Ub3AgKyBrZXkuaGVpZ2h0ICogMlxuXHRcdFx0XHRcdFx0XHRrZXkuY29uc3RyYWludHMgPSB7fVxuXG5cdFx0XHRcdGZvciBrZXksIGluZGV4IGluIGtleXNBcnJheVxuXHRcdFx0XHRcdGlmIGtleS5odG1sID09IFwidW5kb1wiIHx8IFwicmVkb1wiXG5cdFx0XHRcdFx0XHRrZXkud2lkdGggPSBib2FyZFNwZWNzLmtleS53aWR0aFxuXHRcdFx0XHRcdFx0a2V5LnN0eWxlW1wiZm9udC1zaXplXCJdID0gZXhwb3J0cy5weCgyNSkgKyBcInB4XCJcblx0XHRcdFx0XHRcdGtleS5zdHlsZVtcImZvbnQtd2VpZ2h0XCJdID0gMzAwXG5cdFx0XHRcdFx0a2V5LnZpc2libGUgPSB0cnVlXG5cdFx0XHRcdFx0a2V5Lm5hbWUgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0a2V5Lmh0bWwgPSBsZXR0ZXJzQXJyYXlbaW5kZXhdXG5cdFx0XHRcdFx0aWYgaW5kZXggPiAyNVxuXHRcdFx0XHRcdFx0a2V5LnN1YkxheWVyc1swXS52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRzaGlmdEtleS5odG1sID0gXCJcIlxuXHRcdFx0XHRzaGlmdEljb24udmlzaWJsZSA9IHRydWVcblx0XHRcdFx0aWYgZXhwb3J0cy5kZXZpY2UgPT0gXCJpcGFkXCJcblx0XHRcdFx0XHRudW1LZXkuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdG51bUtleTIuaHRtbCA9IFwiLj8xMjNcIlxuXHRcdFx0XHRcdHNoaWZ0S2V5Mi5odG1sID0gXCJcIlxuXHRcdFx0XHRcdHNoaWZ0SWNvbjIudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0Ym9hcmQua2V5Ym9hcmRTdGF0ZSA9IDFcblxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHQjIyBFTU9KSSBLRVlcblxuXHRlbW9qaUtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBuYW1lOlwiZW1vamlcIiwgYm9yZGVyUmFkaXVzOmV4cG9ydHMucHgoNSksIGJhY2tncm91bmRDb2xvcjpleHBvcnRzLmNvbG9yKFwibGlnaHQta2V5XCIpLCBzaGFkb3dZOmV4cG9ydHMucHgoMSksIHNoYWRvd0NvbG9yOlwiIzkyOTQ5OFwiLCB3aWR0aDpib2FyZFNwZWNzLnNpZGVLZXksIGhlaWdodDpib2FyZFNwZWNzLmtleS5oZWlnaHRcblx0ZW1vamlLZXkuY29uc3RyYWludHMgPSAoYm90dG9tRWRnZXM6bnVtS2V5LCBsZWFkaW5nOltudW1LZXksIDZdKVxuXHRlbW9qaUljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyMCksIGhlaWdodDpleHBvcnRzLnB4KDE5KSwgc3VwZXJMYXllcjplbW9qaUtleSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDpib2FyZFNwZWNzLmVtb2ppSWNvbi54LCB5OmJvYXJkU3BlY3MuZW1vamlJY29uLnlcblx0ZW1vamlJY29uLmh0bWwgPSBpY29uTGlicmFyeS5lbW9qaVxuXG5cblxuXHQjIyBSRVRVUk4gS0VZXG5cblx0cmV0dXJuS2V5ID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6Ym9hcmQsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDUpLCBiYWNrZ3JvdW5kQ29sb3I6ZXhwb3J0cy5jb2xvcihzZXR1cC5yZXR1cm5Db2xvciksIHNoYWRvd1k6ZXhwb3J0cy5weCgxKSwgc2hhZG93Q29sb3I6XCIjOTI5NDk4XCIsIGNvbG9yOlwiYmxhY2tcIiwgbmFtZTpcInJldHVyblwiLCB3aWR0aDpib2FyZFNwZWNzLnJldHVybktleSwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRpZiBzZXR1cC5yZXR1cm5Db2xvciAhPSBcImxpZ2h0LWtleVwiXG5cdFx0cmV0dXJuS2V5LmNvbG9yID0gZXhwb3J0cy5zZXRUZXh0Q29sb3IoZXhwb3J0cy5jb2xvcihzZXR1cC5yZXR1cm5Db2xvcikpXG5cdGlmIGV4cG9ydHMuZGV2aWNlID09IFwiaXBhZFwiXG5cdFx0cmV0dXJuS2V5LmNvbnN0cmFpbnRzID0gKHRyYWlsaW5nRWRnZXM6ZGVsZXRlS2V5LCB0b3A6ZXhwb3J0cy5wdChib2FyZFNwZWNzLm1hcmdpblRvcC5yb3cyICsgYm9hcmRTcGVjcy5rZXkuaGVpZ2h0KSApXG5cdGVsc2Vcblx0XHRyZXR1cm5LZXkuY29uc3RyYWludHMgPSAodHJhaWxpbmc6ZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcikvMiwgYm90dG9tRWRnZXM6bnVtS2V5KVxuXHRyZXR1cm5LZXkuaHRtbCA9IHNldHVwLnJldHVyblRleHRcblx0cmV0dXJuS2V5LnN0eWxlID0ge1xuXHRcdFwiZm9udC1zaXplXCIgOiBleHBvcnRzLnB4KDE2KSArIFwicHhcIlxuXHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFwiZm9udC1mYW1pbHlcIiA6ICctYXBwbGUtc3lzdGVtLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmJ1xuXHRcdCd0ZXh0LWFsaWduJyA6ICdjZW50ZXInXG5cdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdH1cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdHN0b3JlZFRleHRDb2xvciA9IHJldHVybktleS5jb2xvclxuXHRyZXR1cm5LZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0cmV0dXJuS2V5LmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIlxuXHRcdHJldHVybktleS5jb2xvciA9IGV4cG9ydHMuY29sb3IoXCJibGFja1wiKVxuXHRyZXR1cm5LZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHRcdHJldHVybktleS5iYWNrZ3JvdW5kQ29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLnJldHVybkNvbG9yKVxuXHRcdHJldHVybktleS5jb2xvciA9IHN0b3JlZFRleHRDb2xvclxuXG5cdGJvYXJkLmtleXMucmV0dXJuID0gcmV0dXJuS2V5XG5cblxuXHQjIyBTUEFDRSBLRVlcblxuXHRzcGFjZUtleSA9IG5ldyBMYXllciBzdXBlckxheWVyOmJvYXJkLCBib3JkZXJSYWRpdXM6ZXhwb3J0cy5weCg1KSwgYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIiwgc2hhZG93WTpleHBvcnRzLnB4KDEpLCBzaGFkb3dDb2xvcjpcIiM5Mjk0OThcIiwgY29sb3I6XCJibGFja1wiLCBuYW1lOlwic3BhY2VcIiwgaGVpZ2h0OmJvYXJkU3BlY3Mua2V5LmhlaWdodFxuXHRcblx0aWYgZXhwb3J0cy5kZXZpY2UgIT0gXCJpcGFkXCJcblx0XHRzcGFjZUtleS5jb25zdHJhaW50cyA9IChib3R0b21FZGdlczpudW1LZXksIGxlYWRpbmc6W2Vtb2ppS2V5LCBleHBvcnRzLnB0KGJvYXJkU3BlY3Muc3BhY2VyKV0sIHRyYWlsaW5nOltyZXR1cm5LZXksIGJvYXJkU3BlY3Muc3BhY2VyXSlcblx0XHRzcGFjZUtleS5odG1sID0gXCJzcGFjZVwiXG5cdFx0c3BhY2VLZXkuc3R5bGUgPSB7XG5cdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxNikgKyBcInB4XCJcblx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IDQwMFxuXHRcdFx0XCJmb250LWZhbWlseVwiIDogJy1hcHBsZS1zeXN0ZW0sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0XHQndGV4dC1hbGlnbicgOiAnY2VudGVyJ1xuXHRcdFx0J2xpbmUtaGVpZ2h0JyA6IGJvYXJkU3BlY3Mua2V5LmhlaWdodCArIFwicHhcIlxuXG5cdFx0fVxuXHRlbHNlXG5cdFx0c3BhY2VLZXkuY29uc3RyYWludHMgPSAoYm90dG9tRWRnZXM6bnVtS2V5LCBsZWFkaW5nOltlbW9qaUtleSwgZXhwb3J0cy5wdChib2FyZFNwZWNzLnNwYWNlcildLCB0cmFpbGluZzpbbnVtS2V5MiwgYm9hcmRTcGVjcy5zcGFjZXJdKVxuXHRib2FyZC5rZXlzW1wiJm5ic3A7XCJdID0gc3BhY2VLZXlcblx0Ym9hcmQua2V5cy5zcGFjZSA9IHNwYWNlS2V5XG5cdGV4cG9ydHMubGF5b3V0KClcblxuXG5cdHNwYWNlS2V5Lm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdHNwYWNlS2V5LmJhY2tncm91bmRDb2xvciA9IGV4cG9ydHMuY29sb3IoXCJsaWdodC1rZXlcIilcblxuXHRzcGFjZUtleS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c3BhY2VLZXkuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiXG5cdFx0aWYgc2V0dXAub3V0cHV0XG5cdFx0XHRAbmV3VGV4dCA9IHNldHVwLm91dHB1dC50ZXh0Lmh0bWwgKyBcIiZuYnNwO1wiXG5cdFx0XHRleHBvcnRzLnVwZGF0ZShzZXR1cC5vdXRwdXQudGV4dCwgW3RleHQ6QG5ld1RleHRdKVxuXG5cblx0IyMgRU1PSklTXG5cblx0ZW1vamlGb3JtYXR0ZXIgPSAoc3RyaW5nKSAtPlxuXHRcdHVuaWNvZGVGb3JtYXQgPSBcIlwiXG5cdFx0aWYgc3RyaW5nWzBdID09IFwiRVwiIHx8IHN0cmluZ1swXSA9PSBcIjNcIiB8fCBzdHJpbmdbMF0gPT0gXCIyXCIgfHwgc3RyaW5nWzBdID09IFwiQ1wiXG5cdFx0XHRhcnJheU9mQ29kZXMgPSBzdHJpbmcuc3BsaXQoXCIgXCIpXG5cdFx0XHRmb3IgY29kZSBpbiBhcnJheU9mQ29kZXNcblx0XHRcdFx0dW5pY29kZUZvcm1hdCA9IHVuaWNvZGVGb3JtYXQgKyBcIiVcIiArIGNvZGVcblx0XHRlbHNlIFxuXHRcdFx0YXJyYXlPZkNvZGVzID0gc3RyaW5nLnNwbGl0KFwiIFwiKVxuXHRcdFx0dW5pY29kZUZvcm1hdCA9IFwiJUYwJTlGXCJcblx0XHRcdGZvciBjb2RlIGluIGFycmF5T2ZDb2Rlc1xuXHRcdFx0XHR1bmljb2RlRm9ybWF0ID0gdW5pY29kZUZvcm1hdCArIFwiJVwiICsgY29kZVxuXHRcdHJldHVybiB1bmljb2RlRm9ybWF0XG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRlbW9qaVNlY3Rpb25zID0gW1wiRnJlcXVuZXRseSBVc2VkXCIsIFwiU21pbGV5cyAmIFBlb3BsZVwiLCBcIkFuaW1hbHMgJiBOYXR1cmVcIiwgXCJGb29kICYgRHJpbmtcIiwgXCJBY3Rpdml0eVwiLCBcIlRyYXZlbCAmIFBsYWNlc1wiLCBcIk9iamVjdHNcIiwgXCJTeW1ib2xzXCIsIFwiRmxhZ3NcIl1cblx0cmF3RW1vamlzID0gW1wiOTggODBcIiwgXCI5OCBBQ1wiLCBcIjk4IDgxXCIsIFwiOTggODJcIiwgXCI5OCA4M1wiLCBcIjk4IDg0XCIsIFwiOTggODVcIiwgXCI5OCA4NlwiLCBcIjk4IDg3XCIsIFwiOTggODlcIiwgXCI5OCA4YVwiLCBcIjk5IDgyXCIsIFwiOTkgODNcIiwgXCJFMiA5OCBCQSBFRiBCOCA4RlwiLCBcIjk4IDhCXCIgLCBcIjk4IDhDXCIsIFwiOTggOERcIiwgXCI5OCA5OFwiLCBcIjk4IDk3XCIsIFwiOTggOTlcIiwgXCI5OCA5QVwiLCBcIjk4IDlDXCIsIFwiOTggOURcIiwgXCI5OCA5QlwiLCBcIkE0IDkxXCIsIFwiQTQgOTNcIiwgXCI5OCA4RVwiLCBcIkE0IDk3XCIsIFwiOTggOEZcIiwgXCI5OCBCNlwiLCBcIjk4IDkwXCIsIFwiOTggOTFcIiwgXCI5OCA5MlwiLCBcIjk5IDg0XCIsIFwiQTQgOTRcIiwgXCI5OCBCM1wiLCBcIjk4IDlFXCIsIFwiOTggOUZcIiwgXCI5OCBBMFwiLCBcIjk4IEExXCIsIFwiOTggOTRcIiwgXCI5OCA5NVwiLCBcIjk5IDgxXCIsIFwiRTIgOTggQjkgRUYgQjggOEZcIiwgXCI5OCBBM1wiLCBcIjk4IDk2XCIsIFwiOTggQUJcIiwgXCI5OCBBOVwiLCBcIjk4IEE0XCIsIFwiOTggQUVcIiwgXCI5OCBCMVwiLCBcIjk4IEE4XCIsIFwiOTggQjBcIiwgXCI5OCBBRlwiLCBcIjk4IEE2XCIsIFwiOTggQTdcIiwgXCI5OCBBMlwiLCBcIjk4IEE1XCIsIFwiOTggQUFcIiwgXCI5OCA5M1wiLCBcIjk4IEFEXCIsIFwiOTggQjVcIiwgXCI5OCBCMlwiLCBcIkE0IDkwXCIsIFwiOTggQjdcIiwgXCJBNCA5MlwiLCBcIkE0IDk1XCIsIFwiOTggQjRcIiwgXCI5MiBBNFwiLCBcIjkyIEE5XCIsIFwiOTggODhcIiwgXCI5MSBCRlwiLCBcIjkxIEI5XCIsIFwiOTEgQkFcIiwgXCI5MiA4MFwiLCBcIjkxIEJCXCIsIFwiOTEgQkRcIiwgXCJBNCA5NlwiLCBcIjk4IEJBXCIsIFwiOTggQjhcIiwgXCI5OCBCOVwiLCBcIjk4IEJCXCIsIFwiOTggQkNcIiwgXCI5OCBCRFwiLCBcIjk5IDgwXCIsIFwiOTggQkZcIiwgXCI5OCBCRVwiLCBcIjk5IDhDXCIsIFwiOTEgOEZcIiwgXCI5MSA4QlwiLCBcIjkxIDhEXCIsIFwiOTEgOEVcIiwgXCI5MSA4QVwiLCBcIkUyIDlDIDhBXCIsIFwiRTIgOUMgOEMgRUYgQjggOEZcIiwgXCI5MSA4Q1wiLCBcIkUyIDlDIDhCXCIsIFwiOTEgOTBcIiwgXCI5MiBBQVwiLCBcIjk5IDhGXCIsIFwiRTIgOTggOUQgRUYgQjggOEZcIiwgXCI5MSA4NlwiLCBcIjkxIDg3XCIsIFwiOTEgODhcIiwgXCI5MSA4OVwiLCBcIjk2IDk1XCIsIFwiOTYgOTBcIiwgXCJBNCA5OFwiLCBcIjk2IDk2XCIsIFwiRTIgOUMgOEQgRUYgQjggOEZcIiwgXCI5MiA4NVwiLCBcIjkxIDg0XCIsIFwiOTEgODVcIiwgXCI5MSA4MlwiLCBcIjkxIDgzXCIsIFwiOTEgODFcIiwgXCI5MSA4MFwiLCBcIjkxIEE0XCIsIFwiOTEgQTVcIiwgXCI5NyBBM1wiLCBcIjkxIEI2XCIsIFwiOTEgQTZcIiwgXCI5MSBBN1wiLCBcIjkxIEE4XCIsIFwiOTEgQTlcIiwgXCI5MSBCMVwiLCBcIjkxIEI0XCIsIFwiOTEgQjVcIiwgXCI5MSBCMlwiLCBcIjkxIEIzXCIsIFwiOTEgQUVcIiwgXCI5MSBCN1wiLCBcIjkyIDgyXCIsIFwiOTUgQjVcIiwgXCI4RSA4NVwiLCBcIjkxIEJDXCIsIFwiOTEgQjhcIiwgXCI5MSBCMFwiLCBcIjlBIEI2XCIsIFwiOEYgODNcIiwgXCI5MiA4M1wiLCBcIjkxIEFGXCIsIFwiOTEgQUJcIiwgXCI5MSBBQ1wiLCBcIjkxIEFEXCIsIFwiOTkgODdcIiwgXCI5MiA4MVwiLCBcIjk5IDg1XCIsIFwiOTkgODZcIiwgXCI5OSA4QlwiLCBcIjk5IDhFXCIsIFwiOTkgOERcIiwgXCI5MiA4N1wiLCBcIjkyIDg2XCIsIFwiOTIgOTFcIiwgXCI5MSBBOSBFMiA4MCA4RCBFMiA5RCBBNCBFRiBCOCA4RiBFMiA4MCA4RCBGMCA5RiA5MSBBOVwiLCBcIjkxIEE4IEUyIDgwIDhEIEUyIDlEIEE0IEVGIEI4IDhGIEUyIDgwIDhEIEYwIDlGIDkxIEE4XCIsIFwiOTIgOEZcIiwgXCI5MSBBOSBFMiA4MCA4RCBFMiA5RCBBNCBFRiBCOCA4RiBFMiA4MCA4RCBGMCA5RiA5MiA4QiBFMiA4MCA4RCBGMCA5RiA5MSBBOVwiLCBcIjkxIEE4IEUyIDgwIDhEIEUyIDlEIEE0IEVGIEI4IDhGIEUyIDgwIDhEIEYwIDlGIDkyIDhCIEUyIDgwIDhEIEYwIDlGIDkxIEE4XCIsIFwiOTEgQUFcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBN1wiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE3IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTYgRTIgODAgOEQgRjAgOUYgOTEgQTZcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBNyBFMiA4MCA4RCBGMCA5RiA5MSBBN1wiLCBcIjkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTdcIiwgXCI5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBOSBFMiA4MCA4RCBGMCA5RiA5MSBBNyBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE5IEUyIDgwIDhEIEYwIDlGIDkxIEE2IEUyIDgwIDhEIEYwIDlGIDkxIEE2XCIsIFwiOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTkgRTIgODAgOEQgRjAgOUYgOTEgQTcgRTIgODAgOEQgRjAgOUYgOTEgQTdcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE3XCIsIFwiOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTggRTIgODAgOEQgRjAgOUYgOTEgQTcgRTIgODAgOEQgRjAgOUYgOTEgQTZcIiwgXCI5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBOCBFMiA4MCA4RCBGMCA5RiA5MSBBNiBFMiA4MCA4RCBGMCA5RiA5MSBBNlwiLCBcIjkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE4IEUyIDgwIDhEIEYwIDlGIDkxIEE3IEUyIDgwIDhEIEYwIDlGIDkxIEE3XCIsIFwiOTEgOUFcIiwgXCI5MSA5NVwiLCBcIjkxIDk2XCIsIFwiOTEgOTRcIiwgXCI5MSA5N1wiLCBcIjkxIDk5XCIsIFwiOTEgOThcIiwgXCI5MiA4NFwiLCBcIjkyIDhCXCIsIFwiOTEgQTNcIiwgXCI5MSBBMFwiLCBcIjkxIEExXCIsIFwiOTEgQTJcIiwgXCI5MSA5RVwiLCBcIjkxIDlGXCIsIFwiOTEgOTJcIiwgXCI4RSBBOVwiLCBcIkUyIDlCIDkxXCIsIFwiOEUgOTNcIiwgXCI5MSA5MVwiLCBcIjhFIDkyXCIsIFwiOTEgOURcIiwgXCI5MSA5QlwiLCBcIjkxIDlDXCIsIFwiOTIgQkNcIiwgXCI5MSA5M1wiLCBcIjk1IEI2XCIsIFwiOTIgOERcIiwgXCI4QyA4MlwiLCBcIjlCIDkxXCIsIFwiOTAgQjZcIiwgXCI5MCBCMVwiLCBcIjkwIEFEXCIsIFwiOTAgQjlcIiwgXCI5MCBCMFwiLCBcIjkwIEJCXCIsIFwiOTAgQkNcIiwgXCI5MCBBOFwiLCBcIjkwIEFGXCIsIFwiQTYgODFcIiwgXCI5MCBBRVwiLCBcIjkwIEI3XCIsIFwiOTAgQkRcIiwgXCI5MCBCOFwiLCBcIjkwIDk5XCIsIFwiOTAgQjVcIiwgXCI5OSA4OFwiLCBcIjk5IDg5XCIsIFwiOTkgOEFcIiwgXCI5MCA5MlwiLCBcIjkwIDk0XCIsIFwiOTAgQTdcIiwgXCI5MCBBNlwiLCBcIjkwIEE0XCIsIFwiOTAgQTNcIiwgXCI5MCBBNVwiLCBcIjkwIEJBXCIsIFwiOTAgOTdcIiwgXCI5MCBCNFwiLCBcIkE2IDg0XCIsIFwiOTAgOURcIiwgXCI5MCA5QlwiLCBcIjkwIDhDXCIsIFwiOTAgOUVcIiwgXCI5MCA5Q1wiLCBcIjk1IEI3XCIsIFwiQTYgODJcIiwgXCJBNiA4MFwiLCBcIjkwIDhEXCIsIFwiOTAgQTJcIiwgXCI5MCBBMFwiLCBcIjkwIDlGXCIsIFwiOTAgQTFcIiwgXCI5MCBBQ1wiLCBcIjkwIEIzXCIsIFwiOTAgOEJcIiwgXCI5MCA4QVwiLCBcIjkwIDg2XCIsIFwiOTAgODVcIiwgXCI5MCA4M1wiLCBcIjkwIDgyXCIsIFwiOTAgODRcIiwgXCI5MCBBQVwiLCBcIjkwIEFCXCIsIFwiOTAgOThcIiwgXCI5MCA5MFwiLCBcIjkwIDhGXCIsIFwiOTAgOTFcIiwgXCI5MCA4RVwiLCBcIjkwIDk2XCIsIFwiOTAgODBcIiwgXCI5MCA4MVwiLCBcIjkwIDkzXCIsIFwiQTYgODNcIiwgXCI5NSA4QVwiLCBcIjkwIDk1XCIsIFwiOTAgQTlcIiwgXCI5MCA4OFwiLCBcIjkwIDg3XCIsIFwiOTAgQkZcIiwgXCI5MCBCRVwiLCBcIjkwIDg5XCIsIFwiOTAgQjJcIiwgXCI4QyBCNVwiLCBcIjhFIDg0XCIsIFwiOEMgQjJcIiwgXCI4QyBCM1wiLCBcIjhDIEI0XCIsIFwiOEMgQjFcIiwgXCI4QyBCRlwiLCBcIkUyIDk4IDk4XCIsIFwiOEQgODBcIiwgXCI4RSA4RFwiLCBcIjhFIDhCXCIsIFwiOEQgODNcIiwgXCI4RCA4MlwiLCBcIjhEIDgxXCIsIFwiOEMgQkVcIiwgXCI4QyBCQVwiLCBcIjhDIEJBXCIsIFwiOEMgQkJcIiwgXCI4QyBCOVwiLCBcIjhDIEI3XCIsIFwiOEMgQkNcIiwgXCI4QyBCOFwiLCBcIjkyIDkwXCIsIFwiOEQgODRcIiwgXCI4QyBCMFwiLCBcIjhFIDgzXCIsIFwiOTAgOUFcIiwgXCI5NSBCOFwiLCBcIjhDIDhFXCIsIFwiOEMgOERcIiwgXCI4QyA4RlwiLCBcIjhDIDk1XCIsIFwiOEMgOTZcIiwgXCI4QyA5N1wiLCBcIjhDIDk4XCIsIFwiOEMgOTFcIiwgXCI4QyA5MlwiLCBcIjhDIDkzXCIsIFwiOEMgOTRcIiwgXCI4QyA5QVwiLCBcIjhDIDlEXCIsIFwiOEMgOUJcIiwgXCI4QyA5Q1wiLCBcIjhDIDlFXCIsIFwiOEMgOTlcIiwgXCJFMiBBRCA5MCBFRiBCOCA4RlwiLCBcIjhDIDlGXCIsIFwiOTIgQUJcIiwgXCJFMiA5QyBBOFwiLCBcIkUyIDk4IDg0IEVGIEI4IDhGXCIsIFwiRTIgOTggODAgRUYgQjggOEZcIiwgXCI4QyBBNFwiLCBcIkUyIDlCIDg1IEVGIEI4IDhGXCIsIFwiOEMgQTVcIiwgXCI4QyBBNlwiLCBcIkUyIDk4IDgxIEVGIEI4IDhGXCIsIFwiOEMgQTdcIiwgXCJFMiA5QiA4OFwiLCBcIjhDIEE5XCIsIFwiRTIgOUEgQTEgRUYgQjggOEZcIiwgXCI5NCBBNVwiLCBcIjkyIEE1XCIsIFwiRTIgOUQgODQgRUYgQjggOEZcIiwgXCI4QyBBOFwiLCBcIkUyIDk4IDgzIEVGIEI4IDhGXCIsIFwiRTIgOUIgODQgRUYgQjggOEZcIiwgXCI4QyBBQ1wiLCBcIjkyIEE4XCIsIFwiOEMgQUFcIiwgXCI4QyBBQlwiLCBcIkUyIDk4IDgyIEVGIEI4IDhGXCIsIFwiRTIgOTggOTQgRUYgQjggOEZcIiwgXCI5MiBBN1wiLCBcIjkyIEE2XCIsIFwiOEMgOEFcIiwgXCI5QiA5MVwiLCBcIjlCIDkxXCIsIFwiOEQgOEZcIiwgXCI4RCA4RVwiLCBcIjhEIDkwXCIsIFwiOEQgOEFcIiwgXCI4RCA4QlwiLCBcIjhEIDhDXCIsIFwiOEQgODlcIiwgXCI4RCA4N1wiLCBcIjhEIDkzXCIsIFwiOEQgODhcIiwgXCI4RCA5MlwiLCBcIjhEIDkxXCIsIFwiOEQgOERcIiwgXCI4RCA4NVwiLCBcIjhEIDg2XCIsIFwiOEMgQjZcIiwgXCI4QyBCRFwiLCBcIjhEIEEwXCIsIFwiOEQgQUZcIiwgXCI4RCA5RVwiLCBcIkE3IDgwXCIsIFwiOEQgOTdcIiwgXCI4RCA5NlwiLCBcIjhEIEE0XCIsIFwiOEQgQjNcIiwgXCI4RCA5NFwiLCBcIjhEIDlGXCIsIFwiOEMgQURcIiwgXCI4RCA5NVwiLCBcIjhEIDlEXCIsIFwiOEMgQUVcIiwgXCI4QyBBRlwiLCBcIjhEIDlDXCIsIFwiOEQgQjJcIiwgXCI4RCBBNVwiLCBcIjhEIEEzXCIsIFwiOEQgQjFcIiwgXCI4RCA5QlwiLCBcIjhEIDk5XCIsIFwiOEQgOUFcIiwgXCI4RCA5OFwiLCBcIjhEIEEyXCIsIFwiOEQgQTFcIiwgXCI4RCBBN1wiLCBcIjhEIEE4XCIsIFwiOEQgQTZcIiwgXCI4RCBCMFwiLCBcIjhFIDgyXCIsIFwiOEQgQUVcIiwgXCI4RCBBQ1wiLCBcIjhEIEFEXCIsIFwiOEQgQUJcIiwgXCI4RCBCRlwiLCBcIjhEIEE5XCIsIFwiOEQgQUFcIiwgXCI4RCBCQVwiLCBcIjhEIEJCXCIsIFwiOEQgQjdcIiwgXCI4RCBCOFwiLCBcIjhEIEI5XCIsIFwiOEQgQkVcIiwgXCI4RCBCNlwiLCBcIjhEIEI1XCIsIFwiRTIgOTggOTUgRUYgQjggOEZcIiwgXCI4RCBCQ1wiLCBcIjhEIEI0XCIsIFwiOEQgQkRcIixcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCI5QiA5MVwiLCBcIkUyIDlBIEJEIEVGIEI4IDhGXCIsIFwiOEYgODBcIiwgXCI4RiA4OFwiLCBcIkUyIDlBIEJFIEVGIEI4IDhGXCIsIFwiOEUgQkVcIiwgXCI4RiA5MFwiLCBcIjhGIDg5XCIsIFwiOEUgQjFcIiwgXCJFMiA5QiBCMyBFRiBCOCA4RlwiLCBcIjhGIDhDXCIsIFwiOEYgOTNcIiwgXCI4RiBCOFwiLCBcIjhGIDkyXCIsIFwiOEYgOTFcIiwgXCI4RiA4RlwiLCBcIjhFIEJGXCIsIFwiRTIgOUIgQjdcIiwgXCI4RiA4MlwiLCBcIkUyIDlCIEI4XCIsIFwiOEYgQjlcIiwgXCI4RSBBM1wiLCBcIjlBIEEzXCIsIFwiOEYgOEFcIiwgXCI4RiA4NFwiLCBcIjlCIDgwXCIsIFwiRTIgOUIgQjlcIiwgXCI4RiA4QlwiLCBcIjlBIEI0XCIsIFwiOUEgQjVcIiwgXCI4RiA4N1wiLCBcIjk1IEI0XCIsIFwiOEYgODZcIiwgXCI4RSBCRFwiLCBcIjhGIDg1XCIsIFwiOEUgOTZcIiwgXCI4RSA5N1wiLCBcIjhGIEI1XCIsIFwiOEUgQUJcIiwgXCI4RSA5RlwiLCBcIjhFIEFEXCIsIFwiOEUgQThcIiwgXCI4RSBBQVwiLCBcIjhFIEE0XCIsIFwiOEUgQTdcIiwgXCI4RSBCQ1wiLCBcIjhFIEI5XCIsIFwiOEUgQjdcIiwgXCI4RSBCQVwiLCBcIjhFIEI4XCIsIFwiOEUgQkJcIiwgXCI4RSBBQ1wiLCBcIjhFIEFFXCIsIFwiOTEgQkVcIiwgXCI4RSBBRlwiLCBcIjhFIEIyXCIsIFwiOEUgQjBcIiwgXCI4RSBCM1wiLCBcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCI5QiA5MVwiLCBcIjlBIDk3XCIsIFwiOUEgOTVcIiwgXCI5QSA5OVwiLCBcIjlBIDhDXCIsIFwiOUEgOEVcIiwgXCI4RiA4RVwiLCBcIjlBIDkzXCIsIFwiOUEgOTFcIiwgXCI5QSA5MlwiLCBcIjlBIDkwXCIsIFwiOUEgOUFcIiwgXCI5QSA5QlwiLCBcIjlBIDlDXCIsXCI4RiA4RFwiLCBcIjlBIEIyXCIsIFwiOUEgQThcIiwgXCI5QSA5NFwiLCBcIjlBIDhEXCIsIFwiOUEgOThcIiwgXCI5QSA5NlwiLCBcIjlBIEExXCIsIFwiOUEgQTBcIiwgXCI5QSBBRlwiLCBcIjlBIDgzXCIsIFwiOUEgOEJcIiwgXCI5QSA5RFwiLCBcIjlBIDg0XCIsIFwiOUEgODVcIiwgXCI5QSA4OFwiLCBcIjlBIDlFXCIsIFwiOUEgODJcIiwgXCI5QSA4NlwiLCBcIjlBIDg3XCIsIFwiOUEgOEFcIiwgXCI5QSA4OVwiLCBcIjlBIDgxXCIsIFwiOUIgQTlcIiwgXCJFMiA5QyA4OCBFRiBCOCA4RlwiLCBcIjlCIEFCXCIsIFwiOUIgQUNcIiwgXCJFMiA5QiBCNSBFRiBCOCA4RlwiLCBcIjlCIEE1XCIsIFwiOUEgQTRcIiwgXCJFMiA5QiBCNFwiLCBcIjlCIEIzXCIsIFwiOUEgODBcIiwgXCI5QiBCMFwiLCBcIjkyIEJBXCIsIFwiRTIgOUEgOTMgRUYgQjggOEZcIiwgXCI5QSBBN1wiLCBcIkUyIDlCIEJEIEVGIEI4IDhGXCIsIFwiOUEgOEZcIiwgXCI5QSBBNlwiLCBcIjlBIEE1XCIsIFwiOEYgODFcIiwgXCI5QSBBMlwiLCBcIjhFIEExXCIsIFwiOEUgQTJcIiwgXCI4RSBBMFwiLCBcIjhGIDk3XCIsIFwiOEMgODFcIiwgXCI5NyBCQ1wiLCBcIjhGIEFEXCIsIFwiRTIgOUIgQjIgRUYgQjggOEZcIiwgXCI4RSA5MVwiLCBcIkUyIDlCIEIwXCIsIFwiOEYgOTRcIiwgXCI5NyBCQlwiLCBcIjhDIDhCXCIsIFwiOTcgQkVcIiwgXCI4RiA5NVwiLCBcIkUyIDlCIEJBIEVGIEI4IDhGXCIsIFwiOEYgOUVcIiwgXCI5QiBBM1wiLCBcIjlCIEE0XCIsIFwiOEMgODVcIiwgXCI4QyA4NFwiLCBcIjhGIDlDXCIsIFwiOEYgOTZcIiwgXCI4RiA5RFwiLCBcIjhDIDg3XCIsIFwiOEMgODZcIiwgXCI4RiA5OVwiLCBcIjhDIDgzXCIsIFwiOEMgODlcIiwgXCI4QyA4Q1wiLCBcIjhDIEEwXCIsIFwiOEUgODdcIiwgXCI4RSA4NlwiLCBcIjhDIDg4XCIsIFwiOEYgOThcIiwgXCI4RiBCMFwiLCBcIjhGIEFGXCIsIFwiOEYgOUZcIiwgXCI5NyBCRFwiLCBcIjhGIEEwXCIsIFwiOEYgQTFcIiwgXCI4RiA5QVwiLCBcIjhGIEEyXCIsIFwiOEYgQUNcIiwgXCI4RiBBM1wiLCBcIjhGIEE0XCIsIFwiOEYgQTVcIiwgXCI4RiBBNlwiLCBcIjhGIEE4XCIsIFwiOEYgQUFcIiwgXCI4RiBBQlwiLCBcIjhGIEE5XCIsIFwiOTIgOTJcIiwgXCI4RiA5QlwiLCBcIkUyIDlCIEFBIEVGIEI4IDhGXCIsIFwiOTUgOENcIiwgXCI5NSA4RFwiLCBcIjk1IDhCXCIsIFwiRTIgOUIgQTlcIiwgXCJFMiA4QyA5QSBFRiBCOCA4RlwiLCBcIjkzIEIxXCIsIFwiOTMgQjJcIiwgXCI5MiBCQlwiLCBcIkUyIDhDIEE4IEVGIEI4IDhGXCIsIFwiOTYgQTVcIiwgXCI5NiBBOFwiLCBcIjk2IEIxXCIsIFwiOTYgQjJcIiwgXCI5NSBCOVwiLCBcIjk3IDlDXCIsIFwiOTIgQkRcIiwgXCI5MiBCRVwiLCBcIjkyIEJGXCIsIFwiOTMgODBcIiwgXCI5MyBCQ1wiLCBcIjkzIEI3XCIsIFwiOTMgQjhcIiwgXCI5MyBCOVwiLCBcIjhFIEE1XCIsIFwiOTMgQkRcIiwgXCI4RSA5RVwiLCBcIjkzIDlFXCIsIFwiRTIgOTggOEUgRUYgQjggOEZcIiwgXCI5MyA5RlwiLCBcIjkzIEEwXCIsIFwiOTMgQkFcIiwgXCI5MyBCQlwiLCBcIjhFIDk5XCIsIFwiOEUgOUFcIiwgXCI4RSA5QlwiLCBcIkUyIDhGIEIxXCIsIFwiRTIgOEYgQjJcIiwgXCJFMiA4RiBCMFwiLCBcIjk1IEIwXCIsIFwiRTIgOEYgQjNcIiwgXCJFMiA4QyA5QiBFRiBCOCA4RlwiLCBcIjkzIEExXCIsIFwiOTQgOEJcIiwgXCI5NCA4Q1wiLCBcIjkyIEExXCIsIFwiOTQgQTZcIiwgXCI5NSBBRlwiLCBcIjk3IDkxXCIsIFwiOUIgQTJcIiwgXCI5MiBCOFwiLCBcIjkyIEI1XCIsIFwiOTIgQjRcIiwgXCI5MiBCNlwiLCBcIjkyIEI3XCIsIFwiOTIgQjBcIiwgXCI5MiBCM1wiLCBcIjkyIDhFXCIsIFwiRTIgOUEgOTZcIiwgXCI5NCBBN1wiLCBcIjk0IEE4XCIsIFwiRTIgOUEgOTJcIiwgXCI5QiBBMFwiLCBcIkUyIDlCIDhGXCIsIFwiOTQgQTlcIiwgXCJFMiA5QSA5OVwiLCBcIkUyIDlCIDkzXCIsIFwiOTQgQUJcIiwgXCI5MiBBM1wiLCBcIjk0IEFBXCIsIFwiOTcgQTFcIiwgXCJFMiA5QSA5NFwiLCBcIjlCIEExXCIsIFwiOUEgQUNcIiwgXCJFMiA5OCBBMCBFRiBCOCA4RlwiLCBcIkUyIDlBIEIwXCIsIFwiRTIgOUEgQjFcIiwgXCI4RiBCQVwiLCBcIjk0IEFFXCIsIFwiOTMgQkZcIiwgXCI5MiA4OFwiLCBcIkUyIDlBIDk3XCIsIFwiOTQgQURcIiwgXCI5NCBBQ1wiLCBcIjk1IEIzXCIsIFwiOTIgOEFcIiwgXCI5MiA4OVwiLCBcIjhDIEExXCIsIFwiOEYgQjdcIiwgXCI5NCA5NlwiLCBcIjlBIEJEXCIsIFwiOUEgQkZcIiwgXCI5QiA4MVwiLCBcIjk0IDkxXCIsIFwiOTcgOURcIiwgXCI5QiA4QlwiLCBcIjlCIDhDXCIsIFwiOUIgOEZcIiwgXCI5QSBBQVwiLCBcIjlCIDhFXCIsIFwiOTYgQkNcIiwgXCI5NyBCQVwiLCBcIkUyIDlCIEIxXCIsIFwiOTcgQkZcIiwgXCI5QiA4RFwiLCBcIjhFIDg4XCIsIFwiOEUgOEZcIiwgXCI4RSA4MFwiLCBcIjhFIDgxXCIsIFwiOEUgOEFcIiwgXCI4RSA4OVwiLCBcIjhFIDhFXCIsIFwiOEUgOTBcIiwgXCI4RSA4Q1wiLCBcIjhGIEFFXCIsIFwiRTIgOUMgODkgRUYgQjggOEZcIiwgXCI5MyBBOVwiLCBcIjkzIEE4XCIsIFwiOTMgQTdcIiwgXCI5MiA4Q1wiLCBcIjkzIEFFXCIsIFwiOTMgQUFcIiwgXCI5MyBBQlwiLCBcIjkzIEFDXCIsIFwiOTMgQURcIiwgXCI5MyBBNlwiLCBcIjkzIEFGXCIsIFwiOTMgQTVcIiwgXCI5MyBBNFwiLCBcIjkzIDlDXCIsIFwiOTMgODNcIiwgXCI5MyA5MVwiLCBcIjkzIDhBXCIsIFwiOTMgODhcIiwgXCI5MyA4OVwiLCBcIjkzIDg0XCIsIFwiOTMgODVcIiwgXCI5MyA4NlwiLCBcIjk3IDkzXCIsIFwiOTMgODdcIiwgXCI5NyA4M1wiLCBcIjk3IEIzXCIsIFwiOTcgODRcIiwgXCI5MyA4QlwiLCBcIjk3IDkyXCIsIFwiOTMgODFcIiwgXCI5MyA4MlwiLCBcIjk3IDgyXCIsIFwiOTcgOUVcIiwgXCI5MyBCMFwiLCBcIjkzIDkzXCIsIFwiOTMgOTVcIiwgXCI5MyA5N1wiLCBcIjkzIDk4XCIsIFwiOTMgOTlcIiwgXCI5MyA5NFwiLCBcIjkzIDkyXCIsIFwiOTMgOUFcIiwgXCI5MyA5NlwiLCBcIjk0IDk3XCIsIFwiOTMgOEVcIiwgXCI5NiA4N1wiLCBcIkUyIDlDIDgyIEVGIEI4IDhGXCIsIFwiOTMgOTBcIiwgXCI5MyA4RlwiLCBcIjkzIDhDXCIsIFwiOTMgOERcIiwgXCI5QSBBOVwiLCBcIjhGIEIzXCIsIFwiOEYgQjRcIiwgXCI5NCA5MFwiLCBcIjk0IDkyXCIsIFwiOTQgOTNcIiwgXCI5NCA4RlwiLCBcIjk2IDhBXCIsIFwiOTYgOEJcIiwgXCJFMiA5QyA5MiBFRiBCOCA4RlwiLCBcIjkzIDlEXCIsIFwiRTIgOUMgOEYgRUYgQjggOEZcIiwgXCI5NiA4RFwiLCBcIjk2IDhDXCIsIFwiOTQgOERcIiwgXCI5NCA4RVwiLCBcIjlCIDkxXCIsIFwiOUIgOTFcIiwgXCJFMiA5RCBBNCBFRiBCOCA4RlwiLCBcIjkyIDlCXCIsIFwiOTIgOUFcIiwgXCI5MiA5OVwiLCBcIjkyIDlDXCIsIFwiOTIgOTRcIiwgXCJFMiA5RCBBMyBFRiBCOCA4RlwiLCBcIjkyIDk1XCIsIFwiOTIgOUVcIiwgXCI5MiA5M1wiLCBcIjkyIDk3XCIsIFwiOTIgOTZcIiwgXCI5MiA5OFwiLCBcIjkyIDlEXCIsIFwiOTIgOUZcIiwgXCJFMiA5OCBBRSBFRiBCOCA4RlwiLCBcIkUyIDlDIDlEIEVGIEI4IDhGXCIsIFwiRTIgOTggQUEgRUYgQjggOEZcIiwgXCI5NSA4OVwiLCBcIkUyIDk4IEI4IEVGIEI4IDhGXCIsIFwiRTIgOUMgQTEgRUYgQjggOEZcIiwgXCI5NCBBRlwiLCBcIjk1IDhFXCIsIFwiRTIgOTggQUYgRUYgQjggOEZcIiwgXCJFMiA5OCBBNiBFRiBCOCA4RlwiLCBcIjlCIDkwXCIsIFwiRTIgOUIgOEVcIiwgXCJFMiA5OSA4OCBFRiBCOCA4RlwiLCBcIkUyIDk5IDg5IEVGIEI4IDhGXCIsIFwiRTIgOTkgOEEgRUYgQjggOEZcIiwgXCJFMiA5OSA4QiBFRiBCOCA4RlwiLCBcIkUyIDk5IDhDIEVGIEI4IDhGXCIsIFwiRTIgOTkgOEQgRUYgQjggOEZcIiwgXCJFMiA5OSA4RSBFRiBCOCA4RlwiLCBcIkUyIDk5IDhGIEVGIEI4IDhGXCIsIFwiRTIgOTkgOTAgRUYgQjggOEZcIiwgXCJFMiA5OSA5MSBFRiBCOCA4RlwiLCBcIkUyIDk5IDkyIEVGIEI4IDhGXCIsIFwiRTIgOTkgOTMgRUYgQjggOEZcIiwgXCI4NiA5NFwiLCBcIkUyIDlBIDlCXCIsIFwiODggQjNcIiwgXCI4OCBCOVwiLCBcIkUyIDk4IEEyIEVGIEI4IDhGXCIsIFwiRTIgOTggQTMgRUYgQjggOEZcIiwgXCI5MyBCNFwiLCBcIjkzIEIzXCIsIFwiODggQjZcIiwgXCI4OCA5QSBFRiBCOCA4RlwiLCBcIjg4IEI4XCIsIFwiODggQkFcIiwgXCI4OCBCNyBFRiBCOCA4RlwiLCBcIkUyIDlDIEI0IEVGIEI4IDhGXCIsIFwiODYgOUFcIiwgXCI4OSA5MVwiLCBcIjkyIEFFXCIsIFwiODkgOTBcIiwgXCJFMyA4QSA5OSBFRiBCOCA4RlwiLCBcIkUzIDhBIDk3IEVGIEI4IDhGXCIsIFwiODggQjRcIiwgXCI4OCBCNVwiLCBcIjg4IEIyXCIsIFwiODUgQjAgRUYgQjggOEZcIiwgXCI4NSBCMSBFRiBCOCA4RlwiLCBcIjg2IDhFXCIsIFwiODYgOTFcIiwgXCI4NSBCRSBFRiBCOCA4RlwiLCBcIjg2IDk4XCIsIFwiRTIgOUIgOTQgRUYgQjggOEZcIiwgXCI5MyA5QlwiLCBcIjlBIEFCXCIsIFwiRTIgOUQgOENcIiwgXCJFMiBBRCA5NSBFRiBCOCA4RlwiLCBcIjkyIEEyXCIsIFwiRTIgOTkgQTggRUYgQjggOEZcIiwgXCI5QSBCN1wiLCBcIjlBIEFGXCIsIFwiOUEgQjNcIiwgXCI5QSBCMVwiLCBcIjk0IDlFXCIsIFwiOTMgQjVcIiwgXCJFMiA5RCA5NyBFRiBCOCA4RlwiLCBcIkUyIDlEIDk1XCIsIFwiRTIgOUQgOTNcIiwgXCJFMiA5RCA5NFwiLCBcIkUyIDgwIEJDIEVGIEI4IDhGXCIsIFwiRTIgODEgODkgRUYgQjggOEZcIiwgXCI5MiBBRlwiLCBcIjk0IDg1XCIsIFwiOTQgODZcIiwgXCI5NCBCMVwiLCBcIkUyIDlBIDlDXCIsIFwiRTMgODAgQkQgRUYgQjggOEZcIiwgXCJFMiA5QSBBMCBFRiBCOCA4RlwiLCBcIjlBIEI4XCIsIFwiOTQgQjBcIiwgXCJFMiA5OSBCQiBFRiBCOCA4RlwiLCBcIjg4IEFGIEVGIEI4IDhGXCIsIFwiOTIgQjlcIiwgXCJFMiA5RCA4NyBFRiBCOCA4RlwiLCBcIkUyIDlDIEIzIEVGIEI4IDhGXCIsIFwiRTIgOUQgOEVcIiwgXCJFMiA5QyA4NVwiLCBcIjkyIEEwXCIsIFwiOEMgODBcIiwgXCJFMiA5RSBCRlwiLCBcIjhDIDkwXCIsIFwiRTIgOTMgODIgRUYgQjggOEZcIiwgXCI4RiBBN1wiLCBcIjg4IDgyIEVGIEI4IDhGXCIsIFwiOUIgODJcIiwgXCI5QiA4M1wiLCBcIjlCIDg0XCIsIFwiOUIgODVcIiwgXCJFMiA5OSBCRiBFRiBCOCA4RlwiLCBcIjlBIEFEXCIsIFwiOUEgQkVcIiwgXCI4NSBCRiBFRiBCOCA4RlwiLCBcIjlBIEIwXCIsIFwiOUEgQjlcIiwgXCI5QSBCQVwiLCBcIjlBIEJDXCIsIFwiOUEgQkJcIiwgXCI5QSBBRVwiLCBcIjhFIEE2XCIsIFwiOTMgQjZcIiwgXCI4OCA4MVwiLCBcIjg2IDk2XCIsIFwiODYgOTdcIiwgXCI4NiA5OVwiLCBcIjg2IDkyXCIsIFwiODYgOTVcIiwgXCI4NiA5M1wiLCBcIjMwIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzEgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzMiBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjMzIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzQgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzNSBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjM2IEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiMzcgRUYgQjggOEYgRTIgODMgQTNcIiwgXCIzOCBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjM5IEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiOTQgOUZcIiwgXCI5NCBBMlwiLCBcIkUyIDk2IEI2IEVGIEI4IDhGXCIsIFwiRTIgOEYgQjhcIiwgXCJFMiA4RiBBRlwiLCBcIkUyIDhGIEI5XCIsIFwiRTIgOEYgQkFcIiwgXCJFMiA4RiBBRFwiLCBcIkUyIDhGIEFFXCIsIFwiRTIgOEYgQTlcIiwgXCJFMiA4RiBBQVwiLCBcIjk0IDgwXCIsIFwiOTQgODFcIiwgXCI5NCA4MlwiLCBcIkUyIDk3IDgwIEVGIEI4IDhGXCIsIFwiOTQgQkNcIiwgXCI5NCBCRFwiLCBcIkUyIDhGIEFCXCIsIFwiRTIgOEYgQUNcIiwgXCJFMiA5RSBBMSBFRiBCOCA4RlwiLCBcIkUyIEFDIDg1IEVGIEI4IDhGXCIsIFwiRTIgQUMgODYgRUYgQjggOEZcIiwgXCJFMiBBQyA4NyBFRiBCOCA4RlwiLCBcIkUyIDg2IDk3IEVGIEI4IDhGXCIsIFwiRTIgODYgOTggRUYgQjggOEZcIiwgXCJFMiA4NiA5OSBFRiBCOCA4RlwiLCBcIkUyIDg2IDk2IEVGIEI4IDhGXCIsIFwiRTIgODYgOTUgRUYgQjggOEZcIiwgXCJFMiA4NiA5NCBFRiBCOCA4RlwiLCBcIjk0IDg0XCIsIFwiRTIgODYgQUEgRUYgQjggOEZcIiwgXCJFMiA4NiBBOSBFRiBCOCA4RlwiLCBcIkUyIEE0IEI0IEVGIEI4IDhGXCIsIFwiRTIgQTQgQjUgRUYgQjggOEZcIiwgXCIyMyBFRiBCOCA4RiBFMiA4MyBBM1wiLCBcIjJBIEVGIEI4IDhGIEUyIDgzIEEzXCIsIFwiRTIgODQgQjkgRUYgQjggOEZcIiwgXCI5NCBBNFwiLCBcIjk0IEExXCIsIFwiOTQgQTBcIiwgXCI5NCBBM1wiLCBcIjhFIEI1XCIsIFwiOEUgQjZcIiwgXCJFMyA4MCBCMCBFRiBCOCA4RlwiLCBcIkUyIDlFIEIwXCIsIFwiRTIgOUMgOTQgRUYgQjggOEZcIiwgXCI5NCA4M1wiLCBcIkUyIDlFIDk1XCIsIFwiRTIgOUUgOTZcIiwgXCJFMiA5RSA5N1wiLCBcIkUyIDlDIDk2IEVGIEI4IDhGXCIsIFwiOTIgQjJcIiwgXCI5MiBCMVwiLCBcIkMyIEE5IEVGIEI4IDhGXCIsIFwiQzIgQUUgRUYgQjggOEZcIiwgXCJFMiA4NCBBMiBFRiBCOCA4RlwiLCBcIjk0IDlBXCIsIFwiOTQgOTlcIiwgXCI5NCA5QlwiLCBcIjk0IDlEXCIsIFwiOTQgOUNcIiwgXCJFMiA5OCA5MSBFRiBCOCA4RlwiLCBcIjk0IDk4XCIsIFwiRTIgOUEgQUEgRUYgQjggOEZcIiwgXCJFMiA5QSBBQiBFRiBCOCA4RlwiLCBcIjk0IEI0XCIsIFwiOTQgQjVcIiwgXCI5NCBCOFwiLCBcIjk0IEI5XCIsIFwiOTQgQjZcIiwgXCI5NCBCN1wiLCBcIjk0IEJBXCIsIFwiRTIgOTYgQUEgRUYgQjggOEZcIiwgXCJFMiA5NiBBQiBFRiBCOCA4RlwiLCBcIkUyIEFDIDlCIEVGIEI4IDhGXCIsIFwiRTIgQUMgOUMgRUYgQjggOEZcIiwgXCI5NCBCQlwiLCBcIkUyIDk3IEJDIEVGIEI4IDhGXCIsIFwiRTIgOTcgQkIgRUYgQjggOEZcIiwgXCJFMiA5NyBCRSBFRiBCOCA4RlwiLCBcIkUyIDk3IEJEIEVGIEI4IDhGXCIsIFwiOTQgQjJcIiwgXCI5NCBCM1wiLCBcIjk0IDg4XCIsIFwiOTQgODlcIiwgXCI5NCA4QVwiLCBcIjk0IDg3XCIsIFwiOTMgQTNcIiwgXCI5MyBBMlwiLCBcIjk0IDk0XCIsIFwiOTQgOTVcIiwgXCI4MyA4RlwiLCBcIjgwIDg0IEVGIEI4IDhGXCIsIFwiRTIgOTkgQTAgRUYgQjggOEZcIiwgXCJFMiA5OSBBMyBFRiBCOCA4RlwiLCBcIkUyIDk5IEE1IEVGIEI4IDhGXCIsIFwiRTIgOTkgQTYgRUYgQjggOEZcIiwgXCI4RSBCNFwiLCBcIjkxIDgxIEUyIDgwIDhEIEYwIDlGIDk3IEE4XCIsIFwiOTIgQURcIiwgXCI5NyBBRlwiLCBcIjkyIEFDXCIsIFwiOTUgOTBcIiwgXCI5NSA5MVwiLCBcIjk1IDkyXCIsIFwiOTUgOTNcIiwgXCI5NSA5NFwiLCBcIjk1IDk1XCIsIFwiOTUgOTZcIiwgXCI5NSA5N1wiLCBcIjk1IDk4XCIsIFwiOTUgOTlcIiwgXCI5NSA5QVwiLCBcIjk1IDlCXCIsIFwiOTUgOUNcIiwgXCI5NSA5RFwiLCBcIjk1IDlFXCIsIFwiOTUgOUZcIiwgXCI5NSBBMFwiLCBcIjk1IEExXCIsIFwiOTUgQTJcIiwgXCI5NSBBM1wiLCBcIjk1IEE0XCIsIFwiOTUgQTVcIiwgXCI5NSBBNlwiLCBcIjk1IEE3XCIsIFwiOUIgOTFcIiwgXCI4NyBBNiBGMCA5RiA4NyBBQlwiLCBcIjg3IEE2IEYwIDlGIDg3IEJEXCIsIFwiODcgQTYgRjAgOUYgODcgQjFcIiwgXCI4NyBBOSBGMCA5RiA4NyBCRlwiLCBcIjg3IEE2IEYwIDlGIDg3IEI4XCIsIFwiODcgQTYgRjAgOUYgODcgQTlcIiwgXCI4NyBBNiBGMCA5RiA4NyBCNFwiLCBcIjg3IEE2IEYwIDlGIDg3IEFFXCIsIFwiODcgQTYgRjAgOUYgODcgQjZcIiwgXCI4NyBBNiBGMCA5RiA4NyBBQ1wiLCBcIjg3IEE2IEYwIDlGIDg3IEI3XCIsIFwiODcgQTYgRjAgOUYgODcgQjJcIiwgXCI4NyBBNiBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE2IEYwIDlGIDg3IEJBXCIsIFwiODcgQTYgRjAgOUYgODcgQjlcIiwgXCI4NyBBNiBGMCA5RiA4NyBCRlwiLCBcIjg3IEE3IEYwIDlGIDg3IEI4XCIsIFwiODcgQTcgRjAgOUYgODcgQURcIiwgXCI4NyBBNyBGMCA5RiA4NyBBOVwiLCBcIjg3IEE3IEYwIDlGIDg3IEE3XCIsIFwiODcgQTcgRjAgOUYgODcgQkVcIiwgXCI4NyBBNyBGMCA5RiA4NyBBQVwiLCBcIjg3IEE3IEYwIDlGIDg3IEJGXCIsIFwiODcgQTcgRjAgOUYgODcgQUZcIiwgXCI4NyBBNyBGMCA5RiA4NyBCMlwiLCBcIjg3IEE3IEYwIDlGIDg3IEI5XCIsIFwiODcgQTcgRjAgOUYgODcgQjRcIiwgXCI4NyBBNyBGMCA5RiA4NyBCNlwiLCBcIjg3IEE3IEYwIDlGIDg3IEE2XCIsIFwiODcgQTcgRjAgOUYgODcgQkNcIiwgXCI4NyBBNyBGMCA5RiA4NyBCN1wiLCBcIjg3IEFFIEYwIDlGIDg3IEI0XCIsIFwiODcgQkIgRjAgOUYgODcgQUNcIiwgXCI4NyBBNyBGMCA5RiA4NyBCM1wiLCBcIjg3IEE3IEYwIDlGIDg3IEFDXCIsIFwiODcgQTcgRjAgOUYgODcgQUJcIiwgXCI4NyBBNyBGMCA5RiA4NyBBRVwiLCBcIjg3IEE4IEYwIDlGIDg3IEJCXCIsIFwiODcgQjAgRjAgOUYgODcgQURcIiwgXCI4NyBBOCBGMCA5RiA4NyBCMlwiLCBcIjg3IEE4IEYwIDlGIDg3IEE2XCIsIFwiODcgQUUgRjAgOUYgODcgQThcIiwgXCI4NyBCMCBGMCA5RiA4NyBCRVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFCXCIsIFwiODcgQjkgRjAgOUYgODcgQTlcIiwgXCI4NyBBOCBGMCA5RiA4NyBCMVwiLCBcIjg3IEE4IEYwIDlGIDg3IEIzXCIsIFwiODcgQTggRjAgOUYgODcgQkRcIiwgXCI4NyBBOCBGMCA5RiA4NyBBOFwiLCBcIjg3IEE4IEYwIDlGIDg3IEI0XCIsIFwiODcgQjAgRjAgOUYgODcgQjJcIiwgXCI4NyBBOCBGMCA5RiA4NyBBQ1wiLCBcIjg3IEE4IEYwIDlGIDg3IEE5XCIsIFwiODcgQTggRjAgOUYgODcgQjBcIiwgXCI4NyBBOCBGMCA5RiA4NyBCN1wiLCBcIjg3IEFEIEYwIDlGIDg3IEI3XCIsIFwiODcgQTggRjAgOUYgODcgQkFcIiwgXCI4NyBBOCBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE4IEYwIDlGIDg3IEJFXCIsIFwiODcgQTggRjAgOUYgODcgQkZcIiwgXCI4NyBBOSBGMCA5RiA4NyBCMFwiLCBcIjg3IEE5IEYwIDlGIDg3IEFGXCIsIFwiODcgQTkgRjAgOUYgODcgQjJcIiwgXCI4NyBBOSBGMCA5RiA4NyBCNFwiLCBcIjg3IEFBIEYwIDlGIDg3IEE4XCIsIFwiODcgQUEgRjAgOUYgODcgQUNcIiwgXCI4NyBCOCBGMCA5RiA4NyBCQlwiLCBcIjg3IEFDIEYwIDlGIDg3IEI2XCIsIFwiODcgQUEgRjAgOUYgODcgQjdcIiwgXCI4NyBBQSBGMCA5RiA4NyBBQVwiLCBcIjg3IEFBIEYwIDlGIDg3IEI5XCIsIFwiODcgQUEgRjAgOUYgODcgQkFcIiwgXCI4NyBBQiBGMCA5RiA4NyBCMFwiLCBcIjg3IEFCIEYwIDlGIDg3IEI0XCIsIFwiODcgQUIgRjAgOUYgODcgQUZcIiwgXCI4NyBBQiBGMCA5RiA4NyBBRVwiLCBcIjg3IEFCIEYwIDlGIDg3IEI3XCIsIFwiODcgQUMgRjAgOUYgODcgQUJcIiwgXCI4NyBCNSBGMCA5RiA4NyBBQlwiLCBcIjg3IEI5IEYwIDlGIDg3IEFCXCIsIFwiODcgQUMgRjAgOUYgODcgQTZcIiwgXCI4NyBBQyBGMCA5RiA4NyBCMlwiLCBcIjg3IEFDIEYwIDlGIDg3IEFBXCIsIFwiODcgQTkgRjAgOUYgODcgQUFcIiwgXCI4NyBBQyBGMCA5RiA4NyBBRFwiLCBcIjg3IEFDIEYwIDlGIDg3IEFFXCIsIFwiODcgQUMgRjAgOUYgODcgQjdcIiwgXCI4NyBBQyBGMCA5RiA4NyBCMVwiLCBcIjg3IEFDIEYwIDlGIDg3IEE5XCIsIFwiODcgQUMgRjAgOUYgODcgQjVcIiwgXCI4NyBBQyBGMCA5RiA4NyBCQVwiLCBcIjg3IEFDIEYwIDlGIDg3IEI5XCIsIFwiODcgQUMgRjAgOUYgODcgQUNcIiwgXCI4NyBBQyBGMCA5RiA4NyBCM1wiLCBcIjg3IEFDIEYwIDlGIDg3IEJDXCIsIFwiODcgQUMgRjAgOUYgODcgQkVcIiwgXCI4NyBBRCBGMCA5RiA4NyBCOVwiLCBcIjg3IEFEIEYwIDlGIDg3IEIzXCIsIFwiODcgQUQgRjAgOUYgODcgQjBcIiwgXCI4NyBBRCBGMCA5RiA4NyBCQVwiLCBcIjg3IEFFIEYwIDlGIDg3IEI4XCIsIFwiODcgQUUgRjAgOUYgODcgQjNcIiwgXCI4NyBBRSBGMCA5RiA4NyBBOVwiLCBcIjg3IEFFIEYwIDlGIDg3IEI3XCIsIFwiODcgQUUgRjAgOUYgODcgQjZcIiwgXCI4NyBBRSBGMCA5RiA4NyBBQVwiLCBcIjg3IEFFIEYwIDlGIDg3IEIyXCIsIFwiODcgQUUgRjAgOUYgODcgQjFcIiwgXCI4NyBBRSBGMCA5RiA4NyBCOVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFFXCIsIFwiODcgQUYgRjAgOUYgODcgQjJcIiwgXCI4NyBBRiBGMCA5RiA4NyBCNVwiLCBcIjg3IEFGIEYwIDlGIDg3IEFBXCIsIFwiODcgQUYgRjAgOUYgODcgQjRcIiwgXCI4NyBCMCBGMCA5RiA4NyBCRlwiLCBcIjg3IEIwIEYwIDlGIDg3IEFBXCIsIFwiODcgQjAgRjAgOUYgODcgQUVcIiwgXCI4NyBCRCBGMCA5RiA4NyBCMFwiLCBcIjg3IEIwIEYwIDlGIDg3IEJDXCIsIFwiODcgQjAgRjAgOUYgODcgQUNcIiwgXCI4NyBCMSBGMCA5RiA4NyBBNlwiLCBcIjg3IEIxIEYwIDlGIDg3IEJCXCIsIFwiODcgQjEgRjAgOUYgODcgQTdcIiwgXCI4NyBCMSBGMCA5RiA4NyBCOFwiLCBcIjg3IEIxIEYwIDlGIDg3IEI3XCIsIFwiODcgQjEgRjAgOUYgODcgQkVcIiwgXCI4NyBCMSBGMCA5RiA4NyBBRVwiLCBcIjg3IEIxIEYwIDlGIDg3IEI5XCIsIFwiODcgQjEgRjAgOUYgODcgQkFcIiwgXCI4NyBCMiBGMCA5RiA4NyBCNFwiLCBcIjg3IEIyIEYwIDlGIDg3IEIwXCIsIFwiODcgQjIgRjAgOUYgODcgQUNcIiwgXCI4NyBCMiBGMCA5RiA4NyBCQ1wiLCBcIjg3IEIyIEYwIDlGIDg3IEJFXCIsIFwiODcgQjIgRjAgOUYgODcgQkJcIiwgXCI4NyBCMiBGMCA5RiA4NyBCMVwiLCBcIjg3IEIyIEYwIDlGIDg3IEI5XCIsIFwiODcgQjIgRjAgOUYgODcgQURcIiwgXCI4NyBCMiBGMCA5RiA4NyBCNlwiLCBcIjg3IEIyIEYwIDlGIDg3IEI3XCIsIFwiODcgQjIgRjAgOUYgODcgQkFcIiwgXCI4NyBCRSBGMCA5RiA4NyBCOVwiLCBcIjg3IEIyIEYwIDlGIDg3IEJEXCIsIFwiODcgQUIgRjAgOUYgODcgQjJcIiwgXCI4NyBCMiBGMCA5RiA4NyBBOVwiLCBcIjg3IEIyIEYwIDlGIDg3IEE4XCIsIFwiODcgQjIgRjAgOUYgODcgQjNcIiwgXCI4NyBCMiBGMCA5RiA4NyBBQVwiLCBcIjg3IEIyIEYwIDlGIDg3IEI4XCIsIFwiODcgQjIgRjAgOUYgODcgQTZcIiwgXCI4NyBCMiBGMCA5RiA4NyBCRlwiLCBcIjg3IEIyIEYwIDlGIDg3IEIyXCIsIFwiODcgQjMgRjAgOUYgODcgQTZcIiwgXCI4NyBCMyBGMCA5RiA4NyBCN1wiLCBcIjg3IEIzIEYwIDlGIDg3IEI1XCIsIFwiODcgQjMgRjAgOUYgODcgQjFcIiwgXCI4NyBCMyBGMCA5RiA4NyBBOFwiLCBcIjg3IEIzIEYwIDlGIDg3IEJGXCIsIFwiODcgQjMgRjAgOUYgODcgQUVcIiwgXCI4NyBCMyBGMCA5RiA4NyBBQVwiLCBcIjg3IEIzIEYwIDlGIDg3IEFDXCIsIFwiODcgQjMgRjAgOUYgODcgQkFcIiwgXCI4NyBCMyBGMCA5RiA4NyBBQlwiLCBcIjg3IEIyIEYwIDlGIDg3IEI1XCIsIFwiODcgQjAgRjAgOUYgODcgQjVcIiwgXCI4NyBCMyBGMCA5RiA4NyBCNFwiLCBcIjg3IEI0IEYwIDlGIDg3IEIyXCIsIFwiODcgQjUgRjAgOUYgODcgQjBcIiwgXCI4NyBCNSBGMCA5RiA4NyBCQ1wiLCBcIjg3IEI1IEYwIDlGIDg3IEI4XCIsIFwiODcgQjUgRjAgOUYgODcgQTZcIiwgXCI4NyBCNSBGMCA5RiA4NyBBQ1wiLCBcIjg3IEI1IEYwIDlGIDg3IEJFXCIsIFwiODcgQjUgRjAgOUYgODcgQUFcIiwgXCI4NyBCNSBGMCA5RiA4NyBBRFwiLCBcIjg3IEI1IEYwIDlGIDg3IEIzXCIsIFwiODcgQjUgRjAgOUYgODcgQjFcIiwgXCI4NyBCNSBGMCA5RiA4NyBCOVwiLCBcIjg3IEI1IEYwIDlGIDg3IEI3XCIsIFwiODcgQjYgRjAgOUYgODcgQTZcIiwgXCI4NyBCNyBGMCA5RiA4NyBBQVwiLCBcIjg3IEI3IEYwIDlGIDg3IEI0XCIsIFwiODcgQjcgRjAgOUYgODcgQkFcIiwgXCI4NyBCNyBGMCA5RiA4NyBCQ1wiLCBcIjg3IEE3IEYwIDlGIDg3IEIxXCIsIFwiODcgQjggRjAgOUYgODcgQURcIiwgXCI4NyBCMCBGMCA5RiA4NyBCM1wiLCBcIjg3IEIxIEYwIDlGIDg3IEE4XCIsIFwiODcgQjUgRjAgOUYgODcgQjJcIiwgXCI4NyBCQiBGMCA5RiA4NyBBOFwiLCBcIjg3IEJDIEYwIDlGIDg3IEI4XCIsIFwiODcgQjggRjAgOUYgODcgQjJcIiwgXCI4NyBCOCBGMCA5RiA4NyBCOVwiLCBcIjg3IEI4IEYwIDlGIDg3IEE2XCIsIFwiODcgQjggRjAgOUYgODcgQjNcIiwgXCI4NyBCNyBGMCA5RiA4NyBCOFwiLCBcIjg3IEI4IEYwIDlGIDg3IEE4XCIsIFwiODcgQjggRjAgOUYgODcgQjFcIiwgXCI4NyBCOCBGMCA5RiA4NyBBQ1wiLCBcIjg3IEI4IEYwIDlGIDg3IEJEXCIsIFwiODcgQjggRjAgOUYgODcgQjBcIiwgXCI4NyBCOCBGMCA5RiA4NyBBRVwiLCBcIjg3IEI4IEYwIDlGIDg3IEE3XCIsIFwiODcgQjggRjAgOUYgODcgQjRcIiwgXCI4NyBCRiBGMCA5RiA4NyBBNlwiLCBcIjg3IEFDIEYwIDlGIDg3IEI4XCIsIFwiODcgQjAgRjAgOUYgODcgQjdcIiwgXCI4NyBCOCBGMCA5RiA4NyBCOFwiLCBcIjg3IEFBIEYwIDlGIDg3IEI4XCIsIFwiODcgQjEgRjAgOUYgODcgQjBcIiwgXCI4NyBCOCBGMCA5RiA4NyBBOVwiLCBcIjg3IEI4IEYwIDlGIDg3IEI3XCIsIFwiODcgQjggRjAgOUYgODcgQkZcIiwgXCI4NyBCOCBGMCA5RiA4NyBBQVwiLCBcIjg3IEE4IEYwIDlGIDg3IEFEXCIsIFwiODcgQjggRjAgOUYgODcgQkVcIiwgXCI4NyBCOSBGMCA5RiA4NyBCQ1wiLCBcIjg3IEI5IEYwIDlGIDg3IEFGXCIsIFwiODcgQjkgRjAgOUYgODcgQkZcIiwgXCI4NyBCOSBGMCA5RiA4NyBBRFwiLCBcIjg3IEI5IEYwIDlGIDg3IEIxXCIsIFwiODcgQjkgRjAgOUYgODcgQUNcIiwgXCI4NyBCOSBGMCA5RiA4NyBCMFwiLCBcIjg3IEI5IEYwIDlGIDg3IEI0XCIsIFwiODcgQjkgRjAgOUYgODcgQjlcIiwgXCI4NyBCOSBGMCA5RiA4NyBCM1wiLCBcIjg3IEI5IEYwIDlGIDg3IEI3XCIsIFwiODcgQjkgRjAgOUYgODcgQjJcIiwgXCI4NyBCOSBGMCA5RiA4NyBBOFwiLCBcIjg3IEI5IEYwIDlGIDg3IEJCXCIsIFwiODcgQkEgRjAgOUYgODcgQUNcIiwgXCI4NyBCQSBGMCA5RiA4NyBBNlwiLCBcIjg3IEE2IEYwIDlGIDg3IEFBXCIsIFwiODcgQUMgRjAgOUYgODcgQTdcIiwgXCI4NyBCQSBGMCA5RiA4NyBCOFwiLCBcIjg3IEJCIEYwIDlGIDg3IEFFXCIsIFwiODcgQkEgRjAgOUYgODcgQkVcIiwgXCI4NyBCQSBGMCA5RiA4NyBCRlwiLCBcIjg3IEJCIEYwIDlGIDg3IEJBXCIsIFwiODcgQkIgRjAgOUYgODcgQTZcIiwgXCI4NyBCQiBGMCA5RiA4NyBBQVwiLCBcIjg3IEJCIEYwIDlGIDg3IEIzXCIsIFwiODcgQkMgRjAgOUYgODcgQUJcIiwgXCI4NyBBQSBGMCA5RiA4NyBBRFwiLCBcIjg3IEJFIEYwIDlGIDg3IEFBXCIsIFwiODcgQkYgRjAgOUYgODcgQjJcIiwgXCI4NyBCRiBGMCA5RiA4NyBCQ1wiXVxuXHRlbW9qaXNBcnJheSA9IFtdXG5cdGZyZXFFbW9qaXNBcnJheSA9IFtdXG5cdGZvciBlbSBpbiByYXdFbW9qaXNcblx0XHRlbW9qaXNBcnJheS5wdXNoIGVtb2ppRm9ybWF0dGVyKGVtKVxuXG5cdFxuXHRmcmVxdWVudGx5VXNlZEVtb2ppc1JhdyA9IFtcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixcIjkyIDg1XCIsIFwiOTEgODRcIiwgXCI5MSA4NVwiLCBcIjkxIDgyXCIsIFwiOTEgODNcIixdXG5cdGZvciBlbSBpbiBmcmVxdWVudGx5VXNlZEVtb2ppc1Jhd1xuXHRcdGZyZXFFbW9qaXNBcnJheS5wdXNoIGVtb2ppRm9ybWF0dGVyKGVtKVxuXG5cdCMgZW1vamlLZXkub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdCMgXHRlbW9qaUtleS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCJcblx0IyBcdGVtb2ppQkcgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwiI0VDRUVGMVwiXG5cdCMgXHRib3ggPSBleHBvcnRzLnB4KDMwKVxuXHQjIFx0ZW1vamlCRy5jb25zdHJhaW50cyA9ICh0cmFpbGluZzoxLCBsZWFkaW5nOjEsIGJvdHRvbToxLCBoZWlnaHQ6MjU4KVxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0ZW1vamlHYWxsZXkgPSBuZXcgU2Nyb2xsQ29tcG9uZW50IHN1cGVyTGF5ZXI6ZW1vamlCRywgd2lkdGg6ZW1vamlCRy53aWR0aCwgaGVpZ2h0OmVtb2ppQkcuaGVpZ2h0IC0gZXhwb3J0cy5weCg0MClcblx0IyBcdGVtb2ppR2FsbGV5LnNwZWVkWSA9IDAgXG5cdCMgXHRlbW9qaVNwYWNlciA9IGV4cG9ydHMucHgoNilcblx0IyBcdGVtb2ppUGlja2VyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJlbW9qaSBwaWNrZXJcIiwgc3VwZXJMYXllcjplbW9qaUJHXG5cdCMgXHRlbW9qaVBpY2tlci5jb25zdHJhaW50cyA9IFxuXHQjIFx0XHRsZWFkaW5nOjFcblx0IyBcdFx0dHJhaWxpbmc6MVxuXHQjIFx0XHRib3R0b206MVxuXHQjIFx0XHRoZWlnaHQ6NDJcblx0IyBcdEFCQyA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBzdXBlckxheWVyOmVtb2ppUGlja2VyXG5cdCMgXHRBQkMuaHRtbCA9IFwiQUJDXCJcblx0IyBcdEFCQy5zdHlsZSA9IHtcblx0IyBcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMTUpICsgXCJweFwiXG5cdCMgXHRcdFwiZm9udC13ZWlnaHRcIiA6IDUwMFxuXHQjIFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0IyBcdFx0XCJjb2xvclwiIDogXCIjNEY1NTVEXCJcblx0IyBcdH1cblx0IyBcdEFCQy5jb25zdHJhaW50cyA9IFxuXHQjIFx0XHRsZWFkaW5nOjEyXG5cdCMgXHRcdGJvdHRvbToxNFxuXHQjIFx0XHR3aWR0aDozMFxuXHQjIFx0XHRoZWlnaHQ6MTVcblxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0cm93ID0gLTFcblx0IyBcdEFCQy5vbiBFdmVudHMuQ2xpY2ssIC0+XG5cdCMgXHRcdGVtb2ppQkcuZGVzdHJveSgpXG5cdCMgXHRmcmVxdWVudCA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdCMgXHRmcmVxdWVudC5odG1sID0gaWNvbkxpYnJhcnkuZnJlcXVlbnRcblx0IyBcdGZyZXF1ZW50LmNvbnN0cmFpbnRzID0gXG5cdCMgXHRcdGxlYWRpbmcgOiBbQUJDLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdHNtaWxleXMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0c21pbGV5cy5odG1sID0gaWNvbkxpYnJhcnkuc21pbGV5c1xuXHQjIFx0c21pbGV5cy5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbZnJlcXVlbnQsIDE1XVxuXHQjIFx0XHRib3R0b206IDE0XG5cdCMgXHRcdHdpZHRoOjE2XG5cdCMgXHRcdGhlaWdodDoyMFxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0YW5pbWFscyA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHRhbmltYWxzLmh0bWwgPSBpY29uTGlicmFyeS5hbmltYWxzXG5cdCMgXHRhbmltYWxzLmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFtzbWlsZXlzLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdGZvb2QgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0Zm9vZC5odG1sID0gaWNvbkxpYnJhcnkuZm9vZFxuXHQjIFx0Zm9vZC5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbYW5pbWFscywgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRhY3Rpdml0eSA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHRhY3Rpdml0eS5odG1sID0gaWNvbkxpYnJhcnkuYWN0aXZpdHlcblx0IyBcdGFjdGl2aXR5LmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFtmb29kLCAxNV1cblx0IyBcdFx0Ym90dG9tOiAxNFxuXHQjIFx0XHR3aWR0aDoxNlxuXHQjIFx0XHRoZWlnaHQ6MjBcblx0IyBcdGV4cG9ydHMubGF5b3V0KClcblx0IyBcdHRyYXZlbCA9IG5ldyBMYXllciBzdXBlckxheWVyOmVtb2ppUGlja2VyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBvcGFjaXR5Oi40XG5cdCMgXHR0cmF2ZWwuaHRtbCA9IGljb25MaWJyYXJ5LnRyYXZlbFxuXHQjIFx0dHJhdmVsLmNvbnN0cmFpbnRzID1cblx0IyBcdFx0bGVhZGluZyA6IFthY3Rpdml0eSwgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRvYmplY3RzID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlQaWNrZXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG9wYWNpdHk6LjRcblx0IyBcdG9iamVjdHMuaHRtbCA9IGljb25MaWJyYXJ5Lm9iamVjdHNcblx0IyBcdG9iamVjdHMuY29uc3RyYWludHMgPVxuXHQjIFx0XHRsZWFkaW5nIDogW3RyYXZlbCwgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cdCMgXHRzeW1ib2xzID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlQaWNrZXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG9wYWNpdHk6LjRcblx0IyBcdHN5bWJvbHMuaHRtbCA9IGljb25MaWJyYXJ5LnN5bWJvbHNcblx0IyBcdHN5bWJvbHMuY29uc3RyYWludHMgPVxuXHQjIFx0XHRsZWFkaW5nIDogW29iamVjdHMsIDE1XVxuXHQjIFx0XHRib3R0b206IDE0XG5cdCMgXHRcdHdpZHRoOjE2XG5cdCMgXHRcdGhlaWdodDoyMFxuXHQjIFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHQjIFx0ZmxhZ3MgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjplbW9qaVBpY2tlciwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgb3BhY2l0eTouNFxuXHQjIFx0ZmxhZ3MuaHRtbCA9IGljb25MaWJyYXJ5LmZsYWdzXG5cdCMgXHRmbGFncy5jb25zdHJhaW50cyA9XG5cdCMgXHRcdGxlYWRpbmcgOiBbc3ltYm9scywgMTVdXG5cdCMgXHRcdGJvdHRvbTogMTRcblx0IyBcdFx0d2lkdGg6MTZcblx0IyBcdFx0aGVpZ2h0OjIwXG5cdCMgXHRleHBvcnRzLmxheW91dCgpXG5cblx0IyBcdGxvYWRFbW9qaXMgPSAoZW0pIC0+XG5cdCMgXHRcdHJvdysrIFxuXHQjIFx0XHRpbmRleCA9IGVtb2ppc0FycmF5LmluZGV4T2YoZW0pXG5cdCMgXHRcdGNvbCA9IE1hdGguZmxvb3IoaW5kZXgvNSlcblx0IyBcdFx0aWYgcm93ID4gNFxuXHQjIFx0XHRcdHJvdyA9IDAgXG5cdCMgXHRcdGVtb2ppID0gbmV3IExheWVyIHg6Y29sKmJveCArIChlbW9qaVNwYWNlciAqIGNvbCkgKyBleHBvcnRzLnB4KDMpLCB5OnJvdypib3ggKyAoZW1vamlTcGFjZXIgKiByb3cpICsgZXhwb3J0cy5weCg0MCksIHN1cGVyTGF5ZXI6ZW1vamlHYWxsZXkuY29udGVudCwgd2lkdGg6Ym94LCBoZWlnaHQ6Ym94LCBuYW1lOmRlY29kZVVSSUNvbXBvbmVudChlbSksIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCJcblx0IyBcdFx0ZW1vamkuaHRtbCA9IGRlY29kZVVSSUNvbXBvbmVudChlbSlcblx0IyBcdFx0ZW1vamkuc3R5bGUgPSB7XG5cdCMgXHRcdFx0XCJmb250LXNpemVcIiA6IGV4cG9ydHMucHgoMjYpICsgXCJweFwiXG5cdCMgXHRcdFx0XCJsaW5lLWhlaWdodFwiIDogYm94ICsgXCJweFwiXG5cdCMgXHRcdFx0XCJ0ZXh0LWFsaWduXCIgOiBcImNlbnRlclwiXG5cdCMgXHRcdH1cblx0IyBcdFx0ZW1vamkub24gRXZlbnRzLkNsaWNrLCAtPlxuXHQjIFx0XHRcdHByaW50IEAubmFtZVxuXHQjIFx0XHRlbW9qaXNMb2FkZWQrK1xuXHQjIFx0XHRwcmludCBlbW9qaXNMb2FkZWRcblxuXHQjIFx0aW5jID0gMjAwXG5cdCMgXHRmaXJzdExvYWQgPSAuMVxuXHQjIFx0dGltZUluYyA9IDJcblx0IyBcdGZ1bGxBbW91bnQgPSBlbW9qaXNBcnJheS5sZW5ndGhcblx0IyBcdGxvYWRzID0gTWF0aC5jZWlsKGZ1bGxBbW91bnQgLyBpbmMpIC0gMVxuXHQjIFx0cGFydGlhbEFtb3VudCA9IGZ1bGxBbW91bnQgJSBpbmNcblx0IyBcdGVtb2ppc0xvYWRlZCA9IDBcblx0IyBcdGZvciBpIGluIFswLi5sb2Fkc11cblx0IyBcdFx0aSsrXG5cdFx0XHRcblx0IyBcdCNTY3JvbGwgTG9hZFxuXHQjIFx0ZW1vamlHYWxsZXkub24gRXZlbnRzLk1vdmUsIC0+XG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiAyMDAwICYmIGVtb2ppc0xvYWRlZCA8IDQwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVsyMDAuLi40MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSAyMDAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiA1MDAwICYmIGVtb2ppc0xvYWRlZCA8IDYwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs0MDAuLi42MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSA1MDAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiA3NTAwICYmIGVtb2ppc0xvYWRlZCA8IDgwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs2MDAuLi44MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSA3NTAxXG5cdCMgXHRcdGlmIGVtb2ppR2FsbGV5LnNjcm9sbFggPiAxMDAwMCAmJiBlbW9qaXNMb2FkZWQgPCAxMDAwXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzgwMC4uLjEwMDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0XHRcdGVtb2ppR2FsbGV5LnNjcm9sbFggPSAxMDAwMVxuXHQjIFx0XHRpZiBlbW9qaUdhbGxleS5zY3JvbGxYID4gMTI1MDAgJiYgZW1vamlzTG9hZGVkIDwgMTIwMFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVsxMDAwLi4uMTI5N11cblx0IyBcdFx0XHRcdGxvYWRFbW9qaXMoZW0pXG5cdCMgXHRcdFx0ZW1vamlHYWxsZXkuc2Nyb2xsWCA9IDEyNTAxXG5cblx0IyBcdCNUaW1lIExvYWRcblx0IyBcdFV0aWxzLmRlbGF5IDEsIC0+IFxuXHQjIFx0XHRpZiBlbW9qaXNMb2FkZWQgPCA0MDAgJiYgZW1vamlHYWxsZXkuc2Nyb2xsWCA9PSAwXG5cdCMgXHRcdFx0c2Nyb2xsWCA9IGVtb2ppR2FsbGV5LnNjcm9sbFhcblx0IyBcdFx0XHRmb3IgZW0gaW4gZW1vamlzQXJyYXlbMjAwLi4uNDAwXVxuXHQjIFx0XHRcdFx0bG9hZEVtb2ppcyhlbSlcblx0IyBcdFV0aWxzLmRlbGF5IDIuNSwgLT4gXG5cdCMgXHRcdGlmIGVtb2ppc0xvYWRlZCA8IDYwMCAmJiBlbW9qaUdhbGxleS5zY3JvbGxYID09IDBcblx0IyBcdFx0XHRzY3JvbGxYID0gZW1vamlHYWxsZXkuc2Nyb2xsWFxuXHQjIFx0XHRcdGZvciBlbSBpbiBlbW9qaXNBcnJheVs0MDAuLi42MDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0VXRpbHMuZGVsYXkgMi41LCAtPiBcblx0IyBcdFx0aWYgZW1vamlzTG9hZGVkIDwgODAwICYmIGVtb2ppR2FsbGV5LnNjcm9sbFggPT0gMFxuXHQjIFx0XHRcdHNjcm9sbFggPSBlbW9qaUdhbGxleS5zY3JvbGxYXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzYwMC4uLjgwMF1cblx0IyBcdFx0XHRcdGxvYWRFbW9qaXMoZW0pXG5cdCMgXHRVdGlscy5kZWxheSA1LjUsIC0+IFxuXHQjIFx0XHRpZiBlbW9qaXNMb2FkZWQgPCAxMDAwICYmIGVtb2ppR2FsbGV5LnNjcm9sbFggPT0gMFxuXHQjIFx0XHRcdHNjcm9sbFggPSBlbW9qaUdhbGxleS5zY3JvbGxYXG5cdCMgXHRcdFx0Zm9yIGVtIGluIGVtb2ppc0FycmF5WzgwMC4uLjEwMDBdXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXHQjIFx0VXRpbHMuZGVsYXkgNywgLT4gXG5cdCMgXHRcdGlmIGVtb2ppc0xvYWRlZCA8IDEyOTcgJiYgZW1vamlHYWxsZXkuc2Nyb2xsWCA9PSAwXG5cdCMgXHRcdFx0c2Nyb2xsWCA9IGVtb2ppR2FsbGV5LnNjcm9sbFhcblx0IyBcdFx0XHRmb3IgZW0gaW4gZW1vamlzQXJyYXlbMTAwMC4uLjEyOTddXG5cdCMgXHRcdFx0XHRsb2FkRW1vamlzKGVtKVxuXG5cblx0IyBcdGZvciBlbSBpbiBmcmVxRW1vamlzQXJyYXlcblx0IyBcdFx0bG9hZEVtb2ppcyhlbSlcblx0IyBcdGZvciBlbSBpbiBlbW9qaXNBcnJheVswLi4uaW5jXVxuXHQjIFx0XHRsb2FkRW1vamlzKGVtKVxuXG5cblx0IyBcdGZvciBzZWMgaW4gZW1vamlTZWN0aW9uc1xuXHQjIFx0XHRpbmRleCA9IGVtb2ppU2VjdGlvbnMuaW5kZXhPZihzZWMpXG5cdCMgXHRcdHRpdGxlID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6ZW1vamlHYWxsZXkuY29udGVudCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgeDppbmRleCo1MDAwICsgZXhwb3J0cy5weCg4KSwgaGVpZ2h0OjgwLCB3aWR0aDo4MDBcblx0IyBcdFx0dGl0bGUuaHRtbCA9IHNlY1xuXHQjIFx0XHR0aXRsZS5zdHlsZSA9IHtcblx0IyBcdFx0XHRcImZvbnQtc2l6ZVwiIDogZXhwb3J0cy5weCgxMikgKyBcInB4XCJcblx0IyBcdFx0XHRcImZvbnQtd2VpZ2h0XCIgOiA2MDBcblx0IyBcdFx0XHRcImZvbnQtZmFtaWx5XCIgOiAnLWFwcGxlLXN5c3RlbSwgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZidcblx0IyBcdFx0XHQnbGluZS1oZWlnaHQnIDogZXhwb3J0cy5weCg0MikgKyBcInB4XCJcblx0IyBcdFx0XHQnbGV0dGVyLXNwYWNpbmcnIDogZXhwb3J0cy5weCgwLjcpICsgXCJweFwiXG5cdCMgXHRcdFx0J2NvbG9yJyA6IFwiI0E1QTZBOVwiXG5cdCMgXHRcdFx0J3RleHQtdHJhbnNmb3JtJyA6ICd1cHBlcmNhc2UnXG5cdCMgXHRcdH1cblxuXG5cdCMgZW1vamlLZXkub24gRXZlbnRzLlRvdWNoRW5kLCAtPlxuXHQjIFx0ZW1vamlLZXkuYmFja2dyb3VuZENvbG9yID0gZXhwb3J0cy5jb2xvcihcImxpZ2h0LWtleVwiKVxuXG5cblxuXHRyZXR1cm4gYm9hcmRcblxuZXhwb3J0cy5TaGVldCA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcInNoZWV0XCIsIGFycmF5KVxuXHRzaGVldCA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdHNoZWV0LmNvbnN0cmFpbnRzID0gXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdHRvcDowXG5cdFx0Ym90dG9tOjBcblx0b3ZlcmxheSA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJyZ2JhKDAsIDAsIDAsIC40KVwiLCBzdXBlckxheWVyOnNoZWV0LCBuYW1lOlwib3ZlcmxheVwiXG5cdG92ZXJsYXkuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdHNoZWV0cyA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBzdXBlckxheWVyOnNoZWV0XG5cdHNoZWV0cy5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHR0b3A6MFxuXHRcdGJvdHRvbTowXG5cdGV4aXRCdXR0b24gPSBuZXcgZXhwb3J0cy5CdXR0b24gYnV0dG9uVHlwZTpcImJpZ1wiLCB0ZXh0OnNldHVwLmV4aXQsIGJsdXI6ZmFsc2UsIHN1cGVyTGF5ZXI6c2hlZXRzXG5cdGV4aXRCdXR0b24uY29uc3RyYWludHMgPSBcblx0XHRib3R0b206MTBcblx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXG5cdGFjdGlvbnMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpzaGVldHMsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEyLjUpLCBiYWNrZ3JvdW5kQ29sb3I6XCJyZ2JhKDI1NSwyNTUsMjU1LCAuODUpXCJcblxuXHRkZXNjcmlwdGlvbkJ1ZmZlciA9IDBcblx0aWYgc2V0dXAuZGVzY3JpcHRpb25cblx0XHRkZXNjcmlwdGlvbiA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJzaGVldERlc2NyaXB0aW9uXCIsIHRleHQ6c2V0dXAuZGVzY3JpcHRpb24sIHN1cGVyTGF5ZXI6YWN0aW9ucywgZm9udFNpemU6MTMsIGNvbG9yOlwiIzhGOEU5NFwiLCB0ZXh0QWxpZ246XCJjZW50ZXJcIlxuXHRcdGRlc2NyaXB0aW9uLmNvbnN0cmFpbnRzID0gXG5cdFx0XHR0b3A6MjFcblx0XHRcdGFsaWduOlwiaG9yaXpvbnRhbFwiXG5cdFx0XHR3aWR0aDpleHBvcnRzLnB0KGV4cG9ydHMud2lkdGgpIC0gMTAwXG5cdFx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRcdGRlc2NyaXB0aW9uQnVmZmVyID0gZXhwb3J0cy5wdChkZXNjcmlwdGlvbi5oZWlnaHQpICsgNDJcblx0XHRkaXZpZGVyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6YWN0aW9ucywgYmFja2dyb3VuZENvbG9yOlwiI0Q2RTNFN1wiXG5cdFx0ZGl2aWRlci5jb25zdHJhaW50cyA9XG5cdFx0XHRoZWlnaHQ6MVxuXHRcdFx0dG9wOmRlc2NyaXB0aW9uQnVmZmVyXG5cdFx0XHRsZWFkaW5nOjBcblx0XHRcdHRyYWlsaW5nOjBcblx0ZXhwb3J0cy5iZ0JsdXIoYWN0aW9ucylcblx0YWN0aW9ucy5jb25zdHJhaW50cyA9IFxuXHRcdGxlYWRpbmc6MTBcblx0XHR0cmFpbGluZzoxMFxuXHRcdGJvdHRvbTpbZXhpdEJ1dHRvbiwgMTBdXG5cdFx0aGVpZ2h0OjU4ICogc2V0dXAuYWN0aW9ucy5sZW5ndGggKyBkZXNjcmlwdGlvbkJ1ZmZlclxuXHRleHBvcnRzLmxheW91dCgpXG5cdGFjdHMgPSB7fVxuXHRmb3IgYWN0LCBpbmRleCBpbiBzZXR1cC5hY3Rpb25zXG5cdFx0byA9IG5ldyBMYXllciBzdXBlckxheWVyOmFjdGlvbnMsIHdpZHRoOmFjdGlvbnMud2lkdGgsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIGJvcmRlclJhZGl1czpleHBvcnRzLnB4KDEyLjUpXG5cdFx0by5jb25zdHJhaW50cyA9IFxuXHRcdFx0dG9wOmluZGV4ICogNTggKyBkZXNjcmlwdGlvbkJ1ZmZlclxuXHRcdFx0aGVpZ2h0OjU4XG5cdFx0YnV0dG9uID0gbmV3IGV4cG9ydHMuQnV0dG9uIHRleHQ6YWN0LCBzdXBlckxheWVyOm8sIGZvbnRTaXplOjIwXG5cdFx0c3BlY2lhbENoYXIoYnV0dG9uKVxuXHRcdGJ1dHRvbi5jb25zdHJhaW50cyA9XG5cdFx0XHRhbGlnbjpcImNlbnRlclwiXG5cdFx0YnV0dG9uLmNvbG9yID0gXCIjRkUzODI0XCJcblx0XHRpZiBpbmRleCAhPSBzZXR1cC5hY3Rpb25zLmxlbmd0aCAtIDFcblx0XHRcdGRpdmlkZXIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpvLCB3aWR0aDphY3Rpb25zLndpZHRoLCBiYWNrZ3JvdW5kQ29sb3I6XCIjRDZFM0U3XCJcblx0XHRcdGRpdmlkZXIuY29uc3RyYWludHMgPVxuXHRcdFx0XHRoZWlnaHQ6MVxuXHRcdFx0XHRib3R0b206MFxuXHRcdGV4cG9ydHMubGF5b3V0KClcblx0XHRvLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LCAtPlxuXHRcdFx0YmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDIxNSwyMTUsMjE1LC43KVwiXG5cdFx0XHRALmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczogKGJhY2tncm91bmRDb2xvcjogYmFja2dyb3VuZENvbG9yKVxuXHRcdFx0XHR0aW1lOi41XG5cdFx0by5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0XHRALmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczooYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIilcblx0XHRcdFx0dGltZTouNVxuXHRcdFx0c2hlZXRzLmFuaW1hdGUgXG5cdFx0XHRcdHByb3BlcnRpZXM6IChtYXhZOmV4cG9ydHMuaGVpZ2h0K2V4cG9ydHMucHgoKHNldHVwLmFjdGlvbnMubGVuZ3RoICsgMykgKiA1OCkpXG5cdFx0XHRcdHRpbWU6LjNcblx0XHRcdG92ZXJsYXkuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiAob3BhY2l0eTowKVxuXHRcdFx0XHR0aW1lOi4zXG5cdFx0XHRVdGlscy5kZWxheSAuMywgLT5cblx0XHRcdFx0c2hlZXQuZGVzdHJveSgpXG5cdFx0YWN0c1thY3RdID0gb1xuXG5cdGlmIHNldHVwLmFuaW1hdGVkID09IHRydWVcblx0XHRvdmVybGF5Lm9wYWNpdHkgPSAwIFxuXHRcdHNoZWV0cy5tYXhZID0gZXhwb3J0cy5oZWlnaHQgKyBleHBvcnRzLnB4KChzZXR1cC5hY3Rpb25zLmxlbmd0aCArIDMpICogNTgpXG5cdFx0b3ZlcmxheS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOihvcGFjaXR5OjEpXG5cdFx0XHR0aW1lOi4zXG5cdFx0c2hlZXRzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6KG1heFk6ZXhwb3J0cy5oZWlnaHQpXG5cdFx0XHR0aW1lOi4zXG5cblx0b3ZlcmxheS5vbiBFdmVudHMuVG91Y2hFbmQsIC0+XG5cdFx0c2hlZXRzLmFuaW1hdGUgXG5cdFx0XHRwcm9wZXJ0aWVzOiAobWF4WTpleHBvcnRzLmhlaWdodCtleHBvcnRzLnB4KChzZXR1cC5hY3Rpb25zLmxlbmd0aCArIDMpICogNTgpKVxuXHRcdFx0dGltZTouM1xuXHRcdG92ZXJsYXkuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczogKG9wYWNpdHk6MClcblx0XHRcdHRpbWU6LjNcblx0XHRVdGlscy5kZWxheSAuMywgLT5cblx0XHRcdHNoZWV0LmRlc3Ryb3koKVx0XHRcblxuXHRleGl0QnV0dG9uLm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRzaGVldHMuYW5pbWF0ZSBcblx0XHRcdHByb3BlcnRpZXM6IChtYXhZOmV4cG9ydHMuaGVpZ2h0K2V4cG9ydHMucHgoKHNldHVwLmFjdGlvbnMubGVuZ3RoICsgMykgKiA1OCkpXG5cdFx0XHR0aW1lOi4zXG5cdFx0b3ZlcmxheS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOiAob3BhY2l0eTowKVxuXHRcdFx0dGltZTouM1xuXHRcdFV0aWxzLmRlbGF5IC4zLCAtPlxuXHRcdFx0c2hlZXQuZGVzdHJveSgpXG5cblx0c2hlZXQuY2FuY2VsID0gZXhpdEJ1dHRvblxuXHRzaGVldC5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG5cdHNoZWV0Lm92ZXJsYXkgPSBvdmVybGF5XG5cdHNoZWV0LmFjdGlvbnMgPSBhY3RzXG5cdHJldHVybiBzaGVldFxuXG5leHBvcnRzLk5hdkJhciA9IChhcnJheSkgLT5cblx0c2V0dXAgPSBzZXR1cENvbXBvbmVudChcIm5hdkJhclwiLCBhcnJheSlcblx0YmFyID0gbmV3IExheWVyIG5hbWU6XCJuYXZiYXJcIlxuXHRiYXJBcmVhID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6YmFyLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdGRpdmlkZXIgPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwiI0IyQjJCMlwiLCBuYW1lOlwibmF2IGRpdmlkZXJcIiwgc3VwZXJMYXllcjpiYXJBcmVhXG5cdGlmIHNldHVwLnN1cGVyTGF5ZXIgXG5cdFx0c2V0dXAuc3VwZXJMYXllci5hZGRTdWJMYXllcihiYXIpXG5cdGRpdmlkZXIuY29uc3RyYWludHMgPVxuXHRcdGhlaWdodDouNVxuXHRcdGJvdHRvbTowXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRpZiBzZXR1cC5ibHVyIFxuXHRcdGJhci5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgLjgpXCJcblx0XHRleHBvcnRzLmJnQmx1cihiYXIpXG5cdGVsc2Vcblx0XHRiYXIuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpXCJcblx0XHRleHBvcnRzLmJnQmx1cihiYXIpXG5cdGJhci50eXBlID0gc2V0dXAudHlwZVxuXHRiYXJBcmVhLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0aGVpZ2h0OjQ0XG5cdFx0Ym90dG9tOjBcblx0YmFyLmNvbnN0cmFpbnRzID0gXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdHRvcDowXG5cdFx0aGVpZ2h0OjY0XG5cdGZvciBsYXllciBpbiBGcmFtZXIuQ3VycmVudENvbnRleHQubGF5ZXJzXG5cdFx0aWYgbGF5ZXIudHlwZSA9PSBcInN0YXR1c0JhclwiXG5cdFx0XHRAc3RhdHVzQmFyID0gbGF5ZXJcblx0XHRcdGJhci5wbGFjZUJlaGluZChAc3RhdHVzQmFyKVxuXG5cdGlmIHR5cGVvZiBzZXR1cC50aXRsZSA9PSBcInN0cmluZ1wiXG5cdFx0dGl0bGUgPSBuZXcgZXhwb3J0cy5UZXh0IHN0eWxlOlwibmF2QmFyVGl0bGVcIiwgZm9udFdlaWdodDpcInNlbWlib2xkXCIsIHN1cGVyTGF5ZXI6YmFyQXJlYSwgdGV4dDpzZXR1cC50aXRsZVxuXHRpZiB0eXBlb2Ygc2V0dXAudGl0bGUgPT0gXCJvYmplY3RcIiBcblx0XHR0aXRsZSA9IG5ldyBleHBvcnRzLlRleHQgc3R5bGU6XCJuYXZCYXJUaXRsZVwiLCBmb250V2VpZ2h0Olwic2VtaWJvbGRcIiwgc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLnRpdGxlLmxhYmVsLmh0bWxcblx0XHRiYXIuc3VwZXJMYXllciA9IHNldHVwLnRpdGxlLnZpZXdcblx0c3BlY2lhbENoYXIodGl0bGUpXG5cdHRpdGxlLmNvbnN0cmFpbnRzID0gXG5cdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHRib3R0b206MTJcblxuXHQjIEhhbmRsZSBSaWdodFxuXHRpZiB0eXBlb2Ygc2V0dXAucmlnaHQgPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygc2V0dXAucmlnaHQgIT0gXCJib29sZWFuXCJcblx0XHRiYXIucmlnaHQgPSBuZXcgZXhwb3J0cy5CdXR0b24gc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLnJpZ2h0LCBmb250V2VpZ2h0OjUwMCwgY29uc3RyYWludHM6e2JvdHRvbToxMiwgdHJhaWxpbmc6OH1cblx0XHRiYXIucmlnaHQudHlwZSA9IFwiYnV0dG9uXCJcblx0XHRzcGVjaWFsQ2hhcihiYXIucmlnaHQpXG5cdGlmIHR5cGVvZiBzZXR1cC5yaWdodCA9PSBcIm9iamVjdFwiXG5cdFx0YmFyLnJpZ2h0ID0gc2V0dXAucmlnaHRcblx0XHRiYXIucmlnaHQuc3VwZXJMYXllciA9IGJhckFyZWFcblx0XHRiYXIucmlnaHQuY29uc3RyYWludHMgPSB7XG5cdFx0XHR0cmFpbGluZzo4XG5cdFx0XHRib3R0b206MTJcblx0XHR9XG5cblx0IyBIYW5kbGUgTGVmdFxuXHRpZiB0eXBlb2Ygc2V0dXAubGVmdCA9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBzZXR1cC5sZWZ0ICE9IFwiYm9vbGVhblwiXG5cdFx0bGVhZGluZyA9IDhcblx0XHRpZiBzZXR1cC5sZWZ0LmluZGV4T2YoXCI8XCIpICE9IC0xXG5cdFx0XHRzdmcgPSBleHBvcnRzLnN2ZyhpY29uTGlicmFyeS5jaGV2cm9uKVxuXHRcdFx0YmFyLmNoZXZyb24gPSBuZXcgTGF5ZXIgd2lkdGg6c3ZnLndpZHRoLCBoZWlnaHQ6c3ZnLmhlaWdodCwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgc3VwZXJMYXllcjpiYXJBcmVhXG5cdFx0XHRiYXIuY2hldnJvbi5odG1sID0gc3ZnLnN2Z1xuXHRcdFx0YmFyLmNoZXZyb24uY29uc3RyYWludHMgPSB7Ym90dG9tOjksIGxlYWRpbmc6OH1cblx0XHRcdHNldHVwLmxlZnQgPSBzZXR1cC5sZWZ0LnJlcGxhY2UoXCI8XCIsIFwiXCIpXG5cdFx0XHRsZWFkaW5nID0gW2Jhci5jaGV2cm9uLCA0XVxuXG5cdFx0YmFyLmxlZnQgPSBuZXcgZXhwb3J0cy5CdXR0b24gc3VwZXJMYXllcjpiYXJBcmVhLCB0ZXh0OnNldHVwLmxlZnQsIGZvbnRXZWlnaHQ6NTAwLCBjb25zdHJhaW50czp7Ym90dG9tOjEyLCBsZWFkaW5nOmxlYWRpbmd9XG5cdFx0XG5cdFx0YmFyLmxlZnQub24gRXZlbnRzLlRvdWNoU3RhcnQsIC0+XG5cdFx0XHRpZiBiYXIuY2hldnJvblxuXHRcdFx0XHRiYXIuY2hldnJvbi5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczoob3BhY2l0eTouMjUpXG5cdFx0XHRcdFx0dGltZTouNVxuXHRcdGJhci5sZWZ0Lm9uIEV2ZW50cy5Ub3VjaEVuZCwgLT5cblx0XHRcdGlmIGJhci5jaGV2cm9uXG5cdFx0XHRcdGJhci5jaGV2cm9uLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOihvcGFjaXR5OjEpXG5cdFx0XHRcdFx0dGltZTouNVxuXG5cdGlmIHR5cGVvZiBzZXR1cC5sZWZ0ID09IFwib2JqZWN0XCJcblx0XHRiYXIubGVmdCA9IHNldHVwLmxlZnRcblx0XHRiYXIubGVmdC5zdXBlckxheWVyID0gYmFyQXJlYVxuXHRcdGJhci5sZWZ0LmNvbnN0cmFpbnRzID0ge1xuXHRcdFx0bGVhZGluZzo4XG5cdFx0XHRib3R0b206MTJcblx0XHR9XG5cblxuXG5cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXHRyZXR1cm4gYmFyXG5cbmV4cG9ydHMuVGFiID0gKGFycmF5KSAtPlxuXHRzZXR1cCA9IHNldHVwQ29tcG9uZW50KFwidGFiXCIsIGFycmF5KVxuXHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2UgXG5cdFx0d2hlbiBcImlwaG9uZS01XCJcblx0XHRcdEB0YWJXaWR0aCA9IDU1XG5cdFx0ZWxzZVxuXHRcdFx0QHRhYldpZHRoID0gNzVcblx0dGFiVmlldyA9IG5ldyBMYXllciBuYW1lOnNldHVwLmxhYmVsICsgXCIgdmlld1wiLCBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiXG5cdHRhYlZpZXcuY29uc3RyYWludHMgPSBcblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0dG9wOjBcblx0XHRib3R0b206MFxuXHR0YWJCb3ggPSBuZXcgTGF5ZXIgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpzZXR1cC5sYWJlbCArIFwiIHRhYlwiXG5cdHRhYkJveC5jb25zdHJhaW50cyA9XG5cdFx0d2lkdGg6QHRhYldpZHRoXG5cdFx0aGVpZ2h0OjQ5XG5cdGljb24gPSBuZXcgTGF5ZXIgd2lkdGg6ZXhwb3J0cy5weCgyNSksIGhlaWdodDpleHBvcnRzLnB4KDI1KSwgYmFja2dyb3VuZENvbG9yOlwidHJhbnNwYXJlbnRcIiwgbmFtZTpcImljb25cIiwgc3VwZXJMYXllcjp0YWJCb3hcblx0aWNvbi5jb25zdHJhaW50cyA9XG5cdFx0YWxpZ246XCJob3Jpem9udGFsXCJcblx0XHR0b3A6N1xuXHRzdmdGcmFtZSA9IGV4cG9ydHMuc3ZnKHNldHVwLmljb24pXG5cdGljb24uaHRtbCA9IHN2Z0ZyYW1lLnN2Z1xuXHRpY29uLndpZHRoID0gc3ZnRnJhbWUud2lkdGhcblx0aWNvbi5oZWlnaHQgPSBzdmdGcmFtZS5oZWlnaHRcblx0bGFiZWwgPSBuZXcgZXhwb3J0cy5UZXh0IHRleHQ6c2V0dXAubGFiZWwsIHN1cGVyTGF5ZXI6dGFiQm94LCBjb2xvcjpcIiM5MjkyOTJcIiwgZm9udFNpemU6MTAsIG5hbWU6XCJsYWJlbFwiLCB0ZXh0VHJhbnNmb3JtOlwiY2FwaXRhbGl6ZVwiXG5cdGxhYmVsLmNvbnN0cmFpbnRzID0gXG5cdFx0Ym90dG9tOjJcblx0XHRob3Jpem9udGFsQ2VudGVyOmljb25cblx0ZXhwb3J0cy5sYXlvdXQoKVxuXG5cdCMgRXhwb3J0IFRhYlxuXHR0YWJCb3gudHlwZSA9IFwidGFiXCJcblx0dGFiQm94Lmljb24gPSBpY29uXG5cdHRhYkJveC52aWV3ID0gdGFiVmlld1xuXHR0YWJCb3gubGFiZWwgPSBsYWJlbFxuXG5cdHJldHVybiB0YWJCb3hcblxuZXhwb3J0cy5UYWJCYXIgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJ0YWJCYXJcIiwgYXJyYXkpXG5cdGlmIHNldHVwLnRhYnMubGVuZ3RoID09IDBcblx0XHRkdW1teVRhYiA9IG5ldyBleHBvcnRzLlRhYlxuXHRcdGR1bW15VGFiMiA9IG5ldyBleHBvcnRzLlRhYlxuXHRcdHNldHVwLnRhYnMucHVzaCBkdW1teVRhYlxuXHRcdHNldHVwLnRhYnMucHVzaCBkdW1teVRhYjJcblx0dGFiV2lkdGggPSA3NVxuXHRzd2l0Y2ggZXhwb3J0cy5kZXZpY2UgXG5cdFx0d2hlbiBcImlwaG9uZS01XCJcblx0XHRcdHRhYldpZHRoID0gNTVcblx0XHRlbHNlXG5cdFx0XHR0YWJXaWR0aCA9IDc1XG5cdHRhYkJhciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOlwidGFiIGJhclwiXG5cdHRhYkJhckJHID0gbmV3IEJhY2tncm91bmRMYXllciBzdXBlckxheWVyOnRhYkJhciwgbmFtZTpcInRhYkJhciBiYWNrZ3JvdW5kXCJcblx0dGFiQmFyLmNvbnN0cmFpbnRzID1cblx0XHRsZWFkaW5nOjBcblx0XHR0cmFpbGluZzowXG5cdFx0Ym90dG9tOjBcblx0XHRoZWlnaHQ6NDlcblx0dGFiQmFyQkcuY29uc3RyYWludHMgPVxuXHRcdGxlYWRpbmc6MFxuXHRcdHRyYWlsaW5nOjBcblx0XHRib3R0b206MFxuXHRcdGhlaWdodDo0OVxuXHRkaXZpZGVyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcIiNCMkIyQjJcIiwgbmFtZTpcInRhYkRpdmlkZXJcIiwgc3VwZXJMYXllcjp0YWJCYXJcblx0ZGl2aWRlci5jb25zdHJhaW50cyA9IFxuXHRcdHRvcDowXG5cdFx0bGVhZGluZzowXG5cdFx0dHJhaWxpbmc6MFxuXHRcdGhlaWdodDouNVxuXHR0YWJCYXJCb3ggPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjp0YWJCYXIsIGJhY2tncm91bmRDb2xvcjpcInRyYW5zcGFyZW50XCIsIG5hbWU6XCJ0YWJCYXIgYm94XCJcblx0dGFiQmFyQm94LmNvbnN0cmFpbnRzID0gXG5cdFx0aGVpZ2h0OjQ5XG5cdFx0d2lkdGg6c2V0dXAudGFicy5sZW5ndGggKiB0YWJXaWR0aFxuXG5cdGV4cG9ydHMubGF5b3V0KClcblxuXHRzZXRBY3RpdmUgPSAodGFiSW5kZXgpIC0+XG5cdFx0Zm9yIHRhYiwgaW5kZXggaW4gc2V0dXAudGFic1xuXHRcdFx0aWYgaW5kZXggPT0gdGFiSW5kZXhcblx0XHRcdFx0ZXhwb3J0cy5jaGFuZ2VGaWxsKHRhYi5pY29uLCBleHBvcnRzLmNvbG9yKHNldHVwLmFjdGl2ZUNvbG9yKSlcblx0XHRcdFx0dGFiLmxhYmVsLmNvbG9yID0gZXhwb3J0cy5jb2xvcihzZXR1cC5hY3RpdmVDb2xvcilcblx0XHRcdFx0dGFiLnZpZXcudmlzaWJsZSA9IHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZXhwb3J0cy5jaGFuZ2VGaWxsKHRhYi5pY29uLCBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpKVxuXHRcdFx0XHR0YWIubGFiZWwuY29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpXG5cdFx0XHRcdHRhYi52aWV3LnZpc2libGUgPSBmYWxzZVxuXG5cdGZvciB0YWIsIGluZGV4IGluIHNldHVwLnRhYnNcblx0XHQjQ2hlY2sgZm9yIHZhaWxkIHRhYiBvYmplY3Rcblx0XHRpZiB0YWIudHlwZSAhPSBcInRhYlwiXG5cdFx0XHRlcnJvcih0YWIuaWQsIDUpXG5cblx0XHR0YWJCYXJCb3guYWRkU3ViTGF5ZXIodGFiKVxuXHRcdCMgQ2hhbmdlIGNvbG9yc1xuXHRcdGV4cG9ydHMuY2hhbmdlRmlsbCh0YWIuaWNvbiwgZXhwb3J0cy5jb2xvcihzZXR1cC5pbmFjdGl2ZUNvbG9yKSlcblx0XHR0YWIubGFiZWwuY29sb3IgPSBleHBvcnRzLmNvbG9yKHNldHVwLmluYWN0aXZlQ29sb3IpXG5cdFx0dGFiQmFyQkcuYmFja2dyb3VuZENvbG9yID0gc2V0dXAuYmFja2dyb3VuZENvbG9yXG5cdFx0aWYgc2V0dXAuYmx1clxuXHRcdFx0dGFiQmFyQkcuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDI1NSwyNTUsMjU1LCAuOSlcIlxuXHRcdFx0ZXhwb3J0cy5iZ0JsdXIodGFiQmFyQkcpXG5cblx0XHRpZiBpbmRleCAhPSAwXG5cdFx0XHR0YWIuY29uc3RyYWludHMgPSBcblx0XHRcdFx0bGVhZGluZzpzZXR1cC50YWJzW2luZGV4IC0gMV1cblx0XHRcdGV4cG9ydHMubGF5b3V0KClcblxuXHRcdHRhYi5vbiBFdmVudHMuVG91Y2hTdGFydCwgLT5cblx0XHRcdHRhYkluZGV4ID0gQC54IC8gZXhwb3J0cy5weCh0YWJXaWR0aClcblx0XHRcdHNldEFjdGl2ZSh0YWJJbmRleClcblx0dGFiQmFyQm94LmNvbnN0cmFpbnRzID1cblx0XHRhbGlnbjpcImhvcml6b250YWxcIlxuXG5cdHNldEFjdGl2ZShzZXR1cC5zdGFydClcdFxuXG5cdGV4cG9ydHMubGF5b3V0KClcblx0cmV0dXJuIHRhYkJhclxuXG5leHBvcnRzLlRleHQgPSAoYXJyYXkpIC0+XG5cdHNldHVwID0gc2V0dXBDb21wb25lbnQoXCJ0ZXh0XCIsIGFycmF5KVxuXHRleGNlcHRpb25zID0gT2JqZWN0LmtleXMoc2V0dXApXG5cdHRleHRMYXllciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6XCJ0cmFuc3BhcmVudFwiLCBuYW1lOnNldHVwLm5hbWVcblx0dGV4dExheWVyLnR5cGUgPSBcInRleHRcIlxuXHR0ZXh0TGF5ZXIuaHRtbCA9IHNldHVwLnRleHRcblx0Zm9yIHByb3AgaW4gZGVmYXVsdHMuZnJhbWVyUHJvcHNcblx0XHRpZiBzZXR1cFtwcm9wXVxuXHRcdFx0aWYgcHJvcCA9PSBcImNvbG9yXCJcblx0XHRcdFx0c2V0dXBbcHJvcF0gPSBleHBvcnRzLmNvbG9yKHNldHVwW3Byb3BdKVxuXHRcdFx0dGV4dExheWVyW3Byb3BdID0gc2V0dXBbcHJvcF1cblx0Zm9yIHByb3AgaW4gZGVmYXVsdHMuc3R5bGVQcm9wc1xuXHRcdGlmIHNldHVwW3Byb3BdXG5cdFx0XHRpZiBwcm9wID09IFwibGluZUhlaWdodFwiICYmIHNldHVwW3Byb3BdID09IFwiYXV0b1wiXG5cdFx0XHRcdHNldHVwW3Byb3BdID0gIHNldHVwW1wiZm9udFNpemVcIl1cblx0XHRcdGlmIHByb3AgPT0gXCJmb250V2VpZ2h0XCJcblx0XHRcdFx0c3dpdGNoIHNldHVwW3Byb3BdXG5cdFx0XHRcdFx0d2hlbiBcInVsdHJhdGhpblwiIHRoZW4gc2V0dXBbcHJvcF0gPSAxMDBcblx0XHRcdFx0XHR3aGVuIFwidGhpblwiIHRoZW4gc2V0dXBbcHJvcF0gPSAyMDBcblx0XHRcdFx0XHR3aGVuIFwibGlnaHRcIiB0aGVuIHNldHVwW3Byb3BdID0gMzAwXG5cdFx0XHRcdFx0d2hlbiBcInJlZ3VsYXJcIiB0aGVuIHNldHVwW3Byb3BdID0gNDAwXG5cdFx0XHRcdFx0d2hlbiBcIm1lZGl1bVwiIHRoZW4gc2V0dXBbcHJvcF0gPSA1MDBcblx0XHRcdFx0XHR3aGVuIFwic2VtaWJvbGRcIiB0aGVuIHNldHVwW3Byb3BdID0gNjAwXG5cdFx0XHRcdFx0d2hlbiBcImJvbGRcIiB0aGVuIHNldHVwW3Byb3BdID0gNzAwXG5cdFx0XHRcdFx0d2hlbiBcImJsYWNrXCIgdGhlbiBzZXR1cFtwcm9wXSA9IDgwMFxuXHRcdFx0aWYgc2V0dXBbcHJvcF0gPT0gcGFyc2VJbnQoc2V0dXBbcHJvcF0sIDEwKSAmJiBzZXR1cFtwcm9wXSA8IDk5XG5cdFx0XHRcdHNldHVwW3Byb3BdID0gZXhwb3J0cy5weChzZXR1cFtwcm9wXSkgKyBcInB4XCJcblx0XHRcdHRleHRMYXllci5zdHlsZVtwcm9wXSA9IHNldHVwW3Byb3BdXG5cdHRleHRGcmFtZSA9IHRleHRBdXRvU2l6ZSh0ZXh0TGF5ZXIpXG5cdHRleHRMYXllci5wcm9wcyA9IChoZWlnaHQ6dGV4dEZyYW1lLmhlaWdodCwgd2lkdGg6dGV4dEZyYW1lLndpZHRoKVxuXHR0ZXh0TGF5ZXIuY29uc3RyYWludHMgPSBzZXR1cC5jb25zdHJhaW50c1xuXHRleHBvcnRzLmxheW91dCgpXG5cdHJldHVybiB0ZXh0TGF5ZXJcblxuaWNvbkxpYnJhcnkgPSB7XG5cdGFjdGl2aXR5OiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE2KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTYgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5Tb2NjZXIgQmFsbDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz5cblx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdwYXRoLTEnIGN4PSc4JyBjeT0nOCcgcj0nOCc+PC9jaXJjbGU+XG5cdFx0XHRcdDwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lQaG9uZS02JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMTc5LjAwMDAwMCwgLTYzOS4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdTb2NjZXItQmFsbCcgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTc5LjAwMDAwMCwgNjM5LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHQ8bWFzayBpZD0nbWFzay0yJyBza2V0Y2g6bmFtZT0nTWFzaycgZmlsbD0nd2hpdGUnPlxuXHRcdFx0XHRcdFx0XHRcdDx1c2UgeGxpbms6aHJlZj0nI3BhdGgtMSc+PC91c2U+XG5cdFx0XHRcdFx0XHRcdDwvbWFzaz5cblx0XHRcdFx0XHRcdFx0PHVzZSBpZD0nTWFzaycgc3Ryb2tlPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyB4bGluazpocmVmPScjcGF0aC0xJz48L3VzZT5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTYsMTIuMTIwMzA0NiBMMTIuODU3MzM4NCw4IEwxMy4zNzIzNzY1LDguODU3MTY3MyBMNi41MTUwMzgwNywxMi45Nzc0NzE5IEw2LDEyLjEyMDMwNDYgTDYsMTIuMTIwMzA0NiBaJyBpZD0nUmVjdGFuZ2xlLTQ3JyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTExLjg0OTY0OCw4LjcyNjA1NTEgTDE5LjEwMDExMDMsNS4zNDUxMDkwMSBMMTkuNTIyNzI4NSw2LjI1MTQxNjggTDEyLjI3MjI2NjIsOS42MzIzNjI4OSBMMTEuODQ5NjQ4LDguNzI2MDU1MSBMMTEuODQ5NjQ4LDguNzI2MDU1MSBaJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktMycgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LDMuMTIwMzA0NiBMMTIuODU3MzM4NCwtMSBMMTMuMzcyMzc2NSwtMC4xNDI4MzI2OTkgTDYuNTE1MDM4MDcsMy45Nzc0NzE5IEw2LDMuMTIwMzA0NiBMNiwzLjEyMDMwNDYgWicgaWQ9J1JlY3RhbmdsZS00Ny1Db3B5LTInIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNLTEsNy4xMjAzMDQ2IEw1Ljg1NzMzODQxLDMgTDYuMzcyMzc2NDgsMy44NTcxNjczIEwtMC40ODQ5NjE5MjUsNy45Nzc0NzE5IEwtMSw3LjEyMDMwNDYgTC0xLDcuMTIwMzA0NiBaJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktNCcgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTAnIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKScgeD0nNCcgeT0nNicgd2lkdGg9JzEnIGhlaWdodD0nNSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nUmVjdGFuZ2xlLTUxJyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknIHg9JzExLjUnIHk9JzMnIHdpZHRoPScxJyBoZWlnaHQ9JzEyJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LDQuODU3MTY3MyBMMTEuODU3MzM4NCw4Ljk3NzQ3MTkgTDEyLjM3MjM3NjUsOC4xMjAzMDQ2IEw1LjUxNTAzODA3LDQgTDUsNC44NTcxNjczJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHknIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNSwxMi44NTcxNjczIEwxMS44NTczMzg0LDE2Ljk3NzQ3MTkgTDEyLjM3MjM3NjUsMTYuMTIwMzA0NiBMNS41MTUwMzgwNywxMiBMNSwxMi44NTcxNjczJyBpZD0nUmVjdGFuZ2xlLTQ3LUNvcHktNScgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J00xMS45MDQ4OTcyLDYuMTQ3NjYwNjQgTDEzLjg3MTQyMjcsOC4zMzE3MDg0OSBMMTIuNDAxOTU5NiwxMC44NzY4OTMzIEw5LjUyNzI1NTg5LDEwLjI2NTg1NjIgTDkuMjIwMDU0NDUsNy4zNDMwMjk2NSBMMTEuOTA0ODk3Miw2LjE0NzY2MDY0JyBpZD0nUG9seWdvbi0xJyBmaWxsPScjRDhEOEQ4JyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTExLjkwNDg5NzIsNi4xNDc2NjA2NCBMMTMuODcxNDIyNyw4LjMzMTcwODQ5IEwxMi40MDE5NTk2LDEwLjg3Njg5MzMgTDkuNTI3MjU1ODksMTAuMjY1ODU2MiBMOS4yMjAwNTQ0NSw3LjM0MzAyOTY1IEwxMS45MDQ4OTcyLDYuMTQ3NjYwNjQnIGlkPSdQb2x5Z29uLTEtQ29weScgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjQ1NzcxMTg5LDMuMTk1MDQ3MzkgTDcuMzU1MTQ0ODQsNi4xMzIxODMzMyBMNC41MzAwNjc2LDYuOTQyMjYxMiBMMi44ODY2NDA4OSw0LjUwNTc4MDkgTDQuNjk2MDI0NTcsMi4xODk4NzU0MSBMNy40NTc3MTE4OSwzLjE5NTA0NzM5JyBpZD0nUG9seWdvbi0xLUNvcHktMicgZmlsbD0nIzRBNTM2MScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCcgbWFzaz0ndXJsKCNtYXNrLTIpJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjQ1NzcxMTg5LDExLjE5NTA0NzQgTDcuMzU1MTQ0ODQsMTQuMTMyMTgzMyBMNC41MzAwNjc2LDE0Ljk0MjI2MTIgTDIuODg2NjQwODksMTIuNTA1NzgwOSBMNC42OTYwMjQ1NywxMC4xODk4NzU0IEw3LjQ1NzcxMTg5LDExLjE5NTA0NzQnIGlkPSdQb2x5Z29uLTEtQ29weS0zJyBmaWxsPScjNEE1MzYxJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJyBtYXNrPSd1cmwoI21hc2stMiknPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTE0LjU0MzE3MDEsMC4wNzI1OTM5MzE0IEwxNC40NDA2MDMxLDMuMDA5NzI5ODggTDExLjYxNTUyNTgsMy44MTk4MDc3NCBMOS45NzIwOTkxMiwxLjM4MzMyNzQ1IEwxMS43ODE0ODI4LC0wLjkzMjU3ODA1IEwxNC41NDMxNzAxLDAuMDcyNTkzOTMxNCcgaWQ9J1BvbHlnb24tMS1Db3B5LTQnIGZpbGw9JyM0QTUzNjEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIG1hc2s9J3VybCgjbWFzay0yKSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0YW5pbWFsczogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgxNyl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE2KX1weCcgdmlld0JveD0nMCAwIDE3IDE3JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+R3JvdXA8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHQ8ZyBpZD0naVBob25lLTYnIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xMTcuMDAwMDAwLCAtNjM5LjAwMDAwMCknIHN0cm9rZT0nIzRBNTM2MSc+XG5cdFx0XHRcdFx0XHQ8ZyBpZD0naWNfRm9vZCcgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMTE4LjAwMDAwMCwgNjQwLjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHQ8ZyBpZD0nR3JvdXAnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LjY4Mzc3NTM3LDEuMzgxNTY2NDYgQzYuMjM5MjYwNjYsMS4xMzYyNCA2Ljg1MzcyMDA1LDEgNy41LDEgQzguMTQ2Mjc5OTUsMSA4Ljc2MDczOTM0LDEuMTM2MjQgOS4zMTYyMjQ2MywxLjM4MTU2NjQ2IEM5LjgwODc5Mjc1LDAuNTYyMzU5MDE5IDEwLjgyNTU4ODgsMCAxMiwwIEMxMy42NTY4NTQyLDAgMTUsMS4xMTkyODgxMyAxNSwyLjUgQzE1LDMuNTU3MTM5OCAxNC4yMTI2MjQ2LDQuNDYxMDI4NDMgMTMuMDk5OTIyNiw0LjgyNjYyNTE0IEMxNC4yNDk2NTI4LDUuNjQxODU0MjIgMTUsNi45ODMzMDA2MiAxNSw4LjUgQzE1LDEwLjcxNjcxNDQgMTMuMzk3MTg3MywxMi41NTkwNzE5IDExLjI4NzI2NzEsMTIuOTMxMzY3MyBDMTAuNDg2NzI0OCwxNC4xNzU3NzAzIDkuMDg5NjE2OTYsMTUgNy41LDE1IEM1LjkxMDM4MzA0LDE1IDQuNTEzMjc1MjQsMTQuMTc1NzcwMyAzLjcxMjczMjkxLDEyLjkzMTM2NzMgQzEuNjAyODEyNjgsMTIuNTU5MDcxOSAwLDEwLjcxNjcxNDQgMCw4LjUgQzAsNi45ODMzMDA2MiAwLjc1MDM0NzI0NCw1LjY0MTg1NDIyIDEuOTAwMDc3NDEsNC44MjY2MjUxNCBDMC43ODczNzU0NDUsNC40NjEwMjg0MyAwLDMuNTU3MTM5OCAwLDIuNSBDMCwxLjExOTI4ODEzIDEuMzQzMTQ1NzUsMCAzLDAgQzQuMTc0NDExMjIsMCA1LjE5MTIwNzI1LDAuNTYyMzU5MDE5IDUuNjgzNzc1MzcsMS4zODE1NjY0NiBaJyBpZD0nT3ZhbC04Jz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTUuNzM4MzQyMjgsMTIgQzUuODYyOTA5NzksMTIgNi4xNDY0MjM1MywxMiA2LjE0NjQyMzUzLDEyIEM2LjE0NjQyMzUzLDEyIDYuNDMyMTU2OTYsMTIuNDQyNjEyMyA2LjUyNDY1ODIsMTIuNDkxOTczOSBDNi42NjQ1NTYwMSwxMi41NjY2Mjc3IDcsMTIuNDkxOTczOSA3LDEyLjQ5MTk3MzkgTDcsMTIgTDgsMTIgTDgsMTIuNDkxOTczOSBMOC40OTc5OTIyOCwxMi40OTE5NzM5IEw4Ljg0MzAxNzY5LDEyIEw5LjM5MTg0NTcsMTIgQzkuMzkxODQ1NywxMiA4Ljk5NTk4NDU3LDEyLjk4Mzk0NzggOC40OTc5OTIyOCwxMi45ODM5NDc4IEw2LjYwNzAyNDA3LDEyLjk4Mzk0NzggQzYuMjE0MDQ4MTMsMTIuOTgzOTQ3OCA1LjQ1OTk2MDk0LDEyIDUuNzM4MzQyMjgsMTIgWicgaWQ9J1JlY3RhbmdsZS00NC1Db3B5LTInPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdPdmFsLTE0JyBjeD0nMTAuNScgY3k9JzcuNScgcj0nMC41Jz48L2NpcmNsZT5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdPdmFsLTE0LUNvcHknIGN4PSc0LjUnIGN5PSc3LjUnIHI9JzAuNSc+PC9jaXJjbGU+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTEyLjY5OTk5NjksNSBDMTIuNjk5OTk2OSwzLjA2NzAwMzM4IDExLjEzMjk5MzYsMS41IDkuMTk5OTk2OTUsMS41JyBpZD0nT3ZhbC0xNic+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J001LjUsNSBDNS41LDMuMDY3MDAzMzggMy45MzI5OTY2MiwxLjUgMiwxLjUnIGlkPSdPdmFsLTE2LUNvcHknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMuNzUwMDAwLCAzLjI1MDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy43NTAwMDAsIC0zLjI1MDAwMCkgJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1JlY3RhbmdsZS00NC1Db3B5JyB4PSc3JyB5PScxMScgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LDEwIEw2LjUsMTAgTDYuNDk5OTk5OTksOS41IEw4LjUwMDAwMDA1LDkuNSBMOC41MDAwMDAwNSwxMCBMOSwxMCBMOSwxMC41IEw4LjUsMTAuNSBMOC41LDExIEw2LjUsMTEgTDYuNSwxMC41IEw2LDEwLjUgTDYsMTAgWicgaWQ9J1BhdGgnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0Y2hldnJvbiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nMTNweCcgaGVpZ2h0PScyMnB4JyB2aWV3Qm94PScwIDAgMTMgMjInIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0ICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42LjEgKDI2MzEzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHQgICAgPHRpdGxlPkJhY2sgQ2hldnJvbjwvdGl0bGU+XG5cdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0ICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuXHRcdCAgICAgICAgPGcgaWQ9J05hdmlnYXRpb24tQmFyL0JhY2snIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC04LjAwMDAwMCwgLTMxLjAwMDAwMCknIGZpbGw9JyMwMDc2RkYnPlxuXHRcdCAgICAgICAgICAgIDxwYXRoIGQ9J004LjUsNDIgTDE5LDMxLjUgTDIxLDMzLjUgTDEyLjUsNDIgTDIxLDUwLjUgTDE5LDUyLjUgTDguNSw0MiBaJyBpZD0nQmFjay1DaGV2cm9uJz48L3BhdGg+XG5cdFx0ICAgICAgICA8L2c+XG5cdFx0ICAgIDwvZz5cblx0XHQ8L3N2Zz5cIlxuXHRlbW9qaSA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMjApfXB4JyB2aWV3Qm94PScwIDAgMjAgMjAnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPkVtb2ppPC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9Mb3dlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTYwLjAwMDAwMCwgLTE4MS4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHQ8ZyBpZD0nQm90dG9tLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDE3MC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdDxwYXRoIGQ9J002Ni43NSwzMC41IEM3Mi4xMzQ3NzYzLDMwLjUgNzYuNSwyNi4xMzQ3NzYzIDc2LjUsMjAuNzUgQzc2LjUsMTUuMzY1MjIzNyA3Mi4xMzQ3NzYzLDExIDY2Ljc1LDExIEM2MS4zNjUyMjM3LDExIDU3LDE1LjM2NTIyMzcgNTcsMjAuNzUgQzU3LDI2LjEzNDc3NjMgNjEuMzY1MjIzNywzMC41IDY2Ljc1LDMwLjUgWiBNNjYuNzUsMjkuNSBDNzEuNTgyNDkxNiwyOS41IDc1LjUsMjUuNTgyNDkxNiA3NS41LDIwLjc1IEM3NS41LDE1LjkxNzUwODQgNzEuNTgyNDkxNiwxMiA2Ni43NSwxMiBDNjEuOTE3NTA4NCwxMiA1OCwxNS45MTc1MDg0IDU4LDIwLjc1IEM1OCwyNS41ODI0OTE2IDYxLjkxNzUwODQsMjkuNSA2Ni43NSwyOS41IFogTTYzLjc1LDE5IEM2NC40NDAzNTU5LDE5IDY1LDE4LjQ0MDM1NTkgNjUsMTcuNzUgQzY1LDE3LjA1OTY0NDEgNjQuNDQwMzU1OSwxNi41IDYzLjc1LDE2LjUgQzYzLjA1OTY0NDEsMTYuNSA2Mi41LDE3LjA1OTY0NDEgNjIuNSwxNy43NSBDNjIuNSwxOC40NDAzNTU5IDYzLjA1OTY0NDEsMTkgNjMuNzUsMTkgWiBNNjkuNzUsMTkgQzcwLjQ0MDM1NTksMTkgNzEsMTguNDQwMzU1OSA3MSwxNy43NSBDNzEsMTcuMDU5NjQ0MSA3MC40NDAzNTU5LDE2LjUgNjkuNzUsMTYuNSBDNjkuMDU5NjQ0MSwxNi41IDY4LjUsMTcuMDU5NjQ0MSA2OC41LDE3Ljc1IEM2OC41LDE4LjQ0MDM1NTkgNjkuMDU5NjQ0MSwxOSA2OS43NSwxOSBaIE01OS44ODc2MzM0LDIyLjE2NDE0NDQgQzU5LjYzOTAzMTYsMjEuMzgzMTM0IDYwLjA2NTkxOCwyMC45Nzg1MTU2IDYwLjg1MzA5NTEsMjEuMjMyOTMwNCBDNjAuODUzMDk1MSwyMS4yMzI5MzA0IDYzLjA5Mzc1MDMsMjIuMjEyNSA2Ni43NTAwMDAxLDIyLjIxMjUgQzcwLjQwNjI0OTksMjIuMjEyNSA3Mi42NDY5MDQ3LDIxLjIzMjkzMDQgNzIuNjQ2OTA0NywyMS4yMzI5MzA0IEM3My40Mjg3MTYyLDIwLjk2NjIxNTMgNzMuODgxMjQ2MywyMS40MDQ0MDk3IDczLjYwNTg0NzcsMjIuMTgwNzQzNyBDNzMuNjA1ODQ3NywyMi4xODA3NDM3IDcyLjYsMjcuNTc1IDY2Ljc1LDI3LjU3NSBDNjAuOSwyNy41NzUgNTkuODg3NjMzNCwyMi4xNjQxNDQ0IDU5Ljg4NzYzMzQsMjIuMTY0MTQ0NCBaIE02Ni43NSwyMy4xODc1IEM2NC4wNjg3NSwyMy4xODc1IDYxLjg1NDQwNTUsMjIuNDczNzgyMSA2MS44NTQ0MDU1LDIyLjQ3Mzc4MjEgQzYxLjMyNzMwMTksMjIuMzI5NDggNjEuMTc4MTIzMywyMi41NzIxNjE1IDYxLjU2Mzk1NTUsMjIuOTU3MDc1IEM2MS41NjM5NTU1LDIyLjk1NzA3NSA2Mi4zNjI1LDI0LjY1IDY2Ljc1LDI0LjY1IEM3MS4xMzc1LDI0LjY1IDcxLjk1MDg1MDMsMjIuOTQzODMwNCA3MS45NTA4NTAzLDIyLjk0MzgzMDQgQzcyLjMwOTM2NTksMjIuNTM5OTI3OCA3Mi4xNjkwNzkzLDIyLjMzNTk4NDQgNzEuNjM1NDI3MywyMi40NzYzNDkgQzcxLjYzNTQyNzMsMjIuNDc2MzQ5IDY5LjQzMTI1LDIzLjE4NzUgNjYuNzUsMjMuMTg3NSBaJyBpZD0nRW1vamknPjwvcGF0aD5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvZz5cblx0XHQ8L3N2Zz5cIlxuXHRkZWxldGU6IHtcblx0XHRvbiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgyNCl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE4KX1weCcgdmlld0JveD0nMCAwIDI0IDE4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdFx0PHRpdGxlPkJhY2s8L3RpdGxlPlxuXHRcdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTMzOS4wMDAwMDAsIC0xMzAuMDAwMDAwKScgZmlsbD0nIzAzMDMwMyc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdUaGlyZC1Sb3cnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMuMDAwMDAwLCAxMTguMDAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTM1MS42NDI2NjMsMjAuOTc3NjkwMyBMMzU0LjQ2Njc5NSwxOC4xNTM1NTg1IEMzNTQuNzYwMTA2LDE3Ljg2MDI0NzYgMzU0Ljc2Mzk4MywxNy4zODE0OTYyIDM1NC40NzEwOSwxNy4wODg2MDMgQzM1NC4xNzYxNTUsMTYuNzkzNjY3NyAzNTMuNzAxNCwxNi43OTc2MzI4IDM1My40MDYxMzUsMTcuMDkyODk4MyBMMzUwLjU4MjAwMywxOS45MTcwMzAxIEwzNDcuNzU3ODcxLDE3LjA5Mjg5ODMgQzM0Ny40NjQ1NiwxNi43OTk1ODc0IDM0Ni45ODU4MDksMTYuNzk1NzA5NyAzNDYuNjkyOTE2LDE3LjA4ODYwMyBDMzQ2LjM5Nzk4LDE3LjM4MzUzODIgMzQ2LjQwMTk0NSwxNy44NTgyOTMgMzQ2LjY5NzIxMSwxOC4xNTM1NTg1IEwzNDkuNTIxMzQzLDIwLjk3NzY5MDMgTDM0Ni42OTcyMTEsMjMuODAxODIyIEMzNDYuNDAzOSwyNC4wOTUxMzI5IDM0Ni40MDAwMjIsMjQuNTczODg0MyAzNDYuNjkyOTE2LDI0Ljg2Njc3NzYgQzM0Ni45ODc4NTEsMjUuMTYxNzEyOCAzNDcuNDYyNjA2LDI1LjE1Nzc0NzcgMzQ3Ljc1Nzg3MSwyNC44NjI0ODIyIEwzNTAuNTgyMDAzLDIyLjAzODM1MDQgTDM1My40MDYxMzUsMjQuODYyNDgyMiBDMzUzLjY5OTQ0NSwyNS4xNTU3OTMxIDM1NC4xNzgxOTcsMjUuMTU5NjcwOCAzNTQuNDcxMDksMjQuODY2Nzc3NiBDMzU0Ljc2NjAyNSwyNC41NzE4NDIzIDM1NC43NjIwNiwyNC4wOTcwODc1IDM1NC40NjY3OTUsMjMuODAxODIyIEwzNTEuNjQyNjYzLDIwLjk3NzY5MDMgWiBNMzM3LjA1OTM0NSwyMi4wNTkzNDQ1IEMzMzYuNDc0Mjg1LDIxLjQ3NDI4NDcgMzM2LjQ4MTM1MSwyMC41MTg2NDg5IDMzNy4wNTkzNDUsMTkuOTQwNjU1NSBMMzQzLjc4OTkxNSwxMy4yMTAwODUzIEMzNDQuMTgyMDg0LDEyLjgxNzkxNiAzNDQuOTQ4OTIsMTIuNSAzNDUuNTA3NDg0LDEyLjUgTDM1Ni4wMDIwOTgsMTIuNSBDMzU3LjkzMzkzNiwxMi41IDM1OS41LDE0LjA2ODg0NzcgMzU5LjUsMTYuMDAxNzk4MyBMMzU5LjUsMjUuOTk4MjAxNyBDMzU5LjUsMjcuOTMyMTkxNSAzNTcuOTIzMDg4LDI5LjUgMzU2LjAwMjA5OCwyOS41IEwzNDUuNTA3NDg0LDI5LjUgQzM0NC45NTEwNjYsMjkuNSAzNDQuMTc3MTY5LDI5LjE3NzE2OTMgMzQzLjc4OTkxNSwyOC43ODk5MTQ4IEwzMzcuMDU5MzQ1LDIyLjA1OTM0NDUgWicgaWQ9J0JhY2snPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XCJcblx0XHRvZmYgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgyNCl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE4KX1weCcgdmlld0JveD0nMCAwIDI0IDE4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdDx0aXRsZT5CYWNrPC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTMzOS4wMDAwMDAsIC0xMzAuMDAwMDAwKScgZmlsbD0nIzAzMDMwMyc+XG5cdFx0XHRcdFx0PGcgaWQ9J1RoaXJkLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDExOC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdDxwYXRoIGQ9J00zMzcuMDU5MzQ1LDIyLjA1OTM0NDUgQzMzNi40NzQyODUsMjEuNDc0Mjg0NyAzMzYuNDgxMzUxLDIwLjUxODY0ODkgMzM3LjA1OTM0NSwxOS45NDA2NTU1IEwzNDMuNzg5OTE1LDEzLjIxMDA4NTMgQzM0NC4xODIwODQsMTIuODE3OTE2IDM0NC45NDg5MiwxMi41IDM0NS41MDc0ODQsMTIuNSBMMzU2LjAwMjA5OCwxMi41IEMzNTcuOTMzOTM2LDEyLjUgMzU5LjUsMTQuMDY4ODQ3NyAzNTkuNSwxNi4wMDE3OTgzIEwzNTkuNSwyNS45OTgyMDE3IEMzNTkuNSwyNy45MzIxOTE1IDM1Ny45MjMwODgsMjkuNSAzNTYuMDAyMDk4LDI5LjUgTDM0NS41MDc0ODQsMjkuNSBDMzQ0Ljk1MTA2NiwyOS41IDM0NC4xNzcxNjksMjkuMTc3MTY5MyAzNDMuNzg5OTE1LDI4Ljc4OTkxNDggTDMzNy4wNTkzNDUsMjIuMDU5MzQ0NSBaIE0zNTEuNjQyNjYzLDIwLjk3NzY5MDMgTDM1NC40NjY3OTUsMTguMTUzNTU4NSBDMzU0Ljc2MDEwNiwxNy44NjAyNDc2IDM1NC43NjM5ODMsMTcuMzgxNDk2MiAzNTQuNDcxMDksMTcuMDg4NjAzIEMzNTQuMTc2MTU1LDE2Ljc5MzY2NzcgMzUzLjcwMTQsMTYuNzk3NjMyOCAzNTMuNDA2MTM1LDE3LjA5Mjg5ODMgTDM1MC41ODIwMDMsMTkuOTE3MDMwMSBMMzQ3Ljc1Nzg3MSwxNy4wOTI4OTgzIEMzNDcuNDY0NTYsMTYuNzk5NTg3NCAzNDYuOTg1ODA5LDE2Ljc5NTcwOTcgMzQ2LjY5MjkxNiwxNy4wODg2MDMgQzM0Ni4zOTc5OCwxNy4zODM1MzgyIDM0Ni40MDE5NDUsMTcuODU4MjkzIDM0Ni42OTcyMTEsMTguMTUzNTU4NSBMMzQ5LjUyMTM0MywyMC45Nzc2OTAzIEwzNDYuNjk3MjExLDIzLjgwMTgyMiBDMzQ2LjQwMzksMjQuMDk1MTMyOSAzNDYuNDAwMDIyLDI0LjU3Mzg4NDMgMzQ2LjY5MjkxNiwyNC44NjY3Nzc2IEMzNDYuOTg3ODUxLDI1LjE2MTcxMjggMzQ3LjQ2MjYwNiwyNS4xNTc3NDc3IDM0Ny43NTc4NzEsMjQuODYyNDgyMiBMMzUwLjU4MjAwMywyMi4wMzgzNTA0IEwzNTMuNDA2MTM1LDI0Ljg2MjQ4MjIgQzM1My42OTk0NDUsMjUuMTU1NzkzMSAzNTQuMTc4MTk3LDI1LjE1OTY3MDggMzU0LjQ3MTA5LDI0Ljg2Njc3NzYgQzM1NC43NjYwMjUsMjQuNTcxODQyMyAzNTQuNzYyMDYsMjQuMDk3MDg3NSAzNTQuNDY2Nzk1LDIzLjgwMTgyMiBMMzUxLjY0MjY2MywyMC45Nzc2OTAzIFogTTMzOC43MDk3MiwyMS43MDk3MTk1IEMzMzguMzE3NzUyLDIxLjMxNzc1MjIgMzM4LjMxODk2NSwyMC42ODEwMzQ5IDMzOC43MDk3MiwyMC4yOTAyODA1IEwzNDQuNjQzMjQ1LDE0LjM1Njc1NDcgQzM0NC44NDAyNzYsMTQuMTU5NzI0NSAzNDUuMjI1NjM5LDE0IDM0NS40OTM3NDEsMTQgTDM1NS45OTcyMzksMTQgQzM1Ny4xMDMzMzMsMTQgMzU3Ljk5OTk5OSwxNC44OTcwNjAxIDM1Ny45OTk5OTksMTYuMDA1ODU4NiBMMzU3Ljk5OTk5OSwyNS45OTQxNDEyIEMzNTcuOTk5OTk5LDI3LjEwMTk0NjQgMzU3LjEwNjQ1NywyNy45OTk5OTk5IDM1NS45OTcyMzksMjcuOTk5OTk5OSBMMzQ1LjQ5Mzc0MSwyOCBDMzQ1LjIyMTA1NiwyOCAzNDQuODQwNjQzLDI3Ljg0MDY0MzEgMzQ0LjY0MzI0NiwyNy42NDMyNDUzIEwzMzguNzA5NzIsMjEuNzA5NzE5NSBaJyBpZD0nQmFjayc+PC9wYXRoPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9nPlxuXHRcdDwvc3ZnPlwiXG5cdH1cblx0Zm9vZCA6ICBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE3KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTcgMTcnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5Gb29kPC90aXRsZT5cblx0XHRcdFx0PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+XG5cdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0PGcgaWQ9J2lPUy05LUtleWJvYXJkcycgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lQaG9uZS02LVBvcnRyYWl0LUxpZ2h0LUNvcHknIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNDguMDAwMDAwLCAtNjM3LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J0Zvb2QnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDE0OS41MDAwMDAsIDIyOS41MDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNS41LDE1LjUgTDEsMTUuNSBMMCw1IEw2LjUsNSBMNi4yNjM2MDkzMyw3LjQ4MjEwMjAyJyBpZD0nRHJpbmsnIHN0cm9rZT0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J002LjAxMDc3NTQ1LDEuOTY5MzAwOTggTDYuNTE1NzEzNTIsNS4yMjI3MDUzOSBMNS43MTkwODE4NCw1LjY3OTQ3ODEyIEw1LjAzODkwMDksMS45NjkzMDA5OCBMNC44NTU1NzI0NywxLjk2OTMwMDk4IEw0Ljg1NTU3MjQ3LDAuOTY5MzAwOTggTDguODU1NTcyNDcsMC45NjkzMDA5OCBMOC44NTU1NzI0NywxLjk2OTMwMDk4IEw2LjAxMDc3NTQ1LDEuOTY5MzAwOTggWicgaWQ9J1N0cmF3JyBmaWxsPScjNEE1NDYxJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg2Ljg1NTU3MiwgMy4zMjQzOTApIHJvdGF0ZSgyNC4wMDAwMDApIHRyYW5zbGF0ZSgtNi44NTU1NzIsIC0zLjMyNDM5MCkgJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J0JvdHRvbS1CdW4nIHN0cm9rZT0nIzRBNTQ2MScgeD0nMycgeT0nMTQnIHdpZHRoPScxMC41JyBoZWlnaHQ9JzEuNScgcng9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMS41LDEyLjUwMjQ0MDggQzEuNSwxMS45NDg4MDggMS45NDkxNjkxNiwxMS41IDIuNDkyNjg3MjMsMTEuNSBMMTQuMDA3MzEyOCwxMS41IEMxNC41NTU1NTg4LDExLjUgMTUsMTEuOTQ2OTQ5OSAxNSwxMi41MDI0NDA4IEwxNSwxMi45OTc1NTkyIEMxNSwxMy41NTExOTIgMTQuNTUwODMwOCwxNCAxNC4wMDczMTI4LDE0IEwyLjQ5MjY4NzIzLDE0IEMxLjk0NDQ0MTIxLDE0IDEuNSwxMy41NTMwNTAxIDEuNSwxMi45OTc1NTkyIEwxLjUsMTIuNTAyNDQwOCBaIE0zLjkzMzAwMDAzLDExLjgzOTI3MjcgQzMuNDE3NzE4MzQsMTEuNjUxODk3NiAzLjQ0NDgzNjk3LDExLjUgMy45OTU1Nzc1LDExLjUgTDEzLjAwNDQyMjUsMTEuNSBDMTMuNTU0MjY0OCwxMS41IDEzLjU4NjYwNjEsMTEuNjUwMzI1MSAxMy4wNjcsMTEuODM5MjcyNyBMOC41LDEzLjUgTDMuOTMzMDAwMDMsMTEuODM5MjcyNyBaJyBpZD0nJnF1b3Q7UGF0dHkmcXVvdDsnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMi41LDEwLjUgTDEzLjUsMTAuNSBMMTUsMTEuNSBMMSwxMS41IEwyLjUsMTAuNSBaJyBpZD0nQ2hlZXNlJyBmaWxsPScjNEE1NDYxJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTguMjUsMTAuNSBDMTEuNDI1NjM3MywxMC41IDE0LDEwLjMyODQyNzEgMTQsOS41IEMxNCw4LjY3MTU3Mjg4IDExLjQyNTYzNzMsOCA4LjI1LDggQzUuMDc0MzYyNjksOCAyLjUsOC42NzE1NzI4OCAyLjUsOS41IEMyLjUsMTAuMzI4NDI3MSA1LjA3NDM2MjY5LDEwLjUgOC4yNSwxMC41IFonIGlkPSdUb3AtQnVuJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS13aWR0aD0nMC43NSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRmbGFnczogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JyN7ZXhwb3J0cy5weCgxMSl9cHgnIGhlaWdodD0nI3tleHBvcnRzLnB4KDE1KX1weCcgdmlld0JveD0nMCAwIDExIDE1JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJz5cblx0XHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+RmxhZzwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjc1LjAwMDAwMCwgLTYzOS4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdGbGFnJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyNzUuMDAwMDAwLCAyMzEuNTAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1BvbGUnIGZpbGw9JyM0QTU0NjEnIHg9JzAnIHk9JzAnIHdpZHRoPScxJyBoZWlnaHQ9JzE0Jz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTEsMSBDMSwxIDEuMjUsMiAzLjUsMiBDNS43NSwyIDYsMC43NDk5OTk5OTggOCwwLjc1IEMxMCwwLjc0OTk5OTk5OCAxMCwxLjUgMTAsMS41IEwxMCw3LjUgQzEwLDcuNSAxMCw2LjUgOCw2LjUgQzYsNi41IDQuODA2MjM5MTEsOCAzLjUsOCBDMi4xOTM3NjA4OSw4IDEsNyAxLDcgTDEsMSBaJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0ZnJlcXVlbnQ6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNil9cHgnIHZpZXdCb3g9JzAgMCAxNyAxNicgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPlJlY2VudDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtNTUuMDAwMDAwLCAtNjM4LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J1JlY2VudCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoNTUuNTAwMDAwLCAyMzAuMDAwMDAwKScgc2tldGNoOnR5cGU9J01TU2hhcGVHcm91cCc+XG5cdFx0XHRcdFx0XHRcdFx0PGNpcmNsZSBpZD0nQm9keScgc3Ryb2tlPScjNEE1NDYxJyBjeD0nOCcgY3k9JzgnIHI9JzgnPjwvY2lyY2xlPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J003LjUsNy41IEw3LjUsOC41IEw4LjUsOC41IEw4LjUsMiBMNy41LDIgTDcuNSw3LjUgTDQsNy41IEw0LDguNSBMOC41LDguNSBMOC41LDcuNSBMNy41LDcuNSBaJyBpZD0nSGFuZHMnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0a2V5Ym9hcmQgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDMyLjUpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgyMy41KX1weCcgdmlld0JveD0nMCAwIDY1IDQ3JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0ICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42LjEgKDI2MzEzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdCAgICA8dGl0bGU+U2hhcGU8L3RpdGxlPlxuXHRcdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0ICAgIDxkZWZzPjwvZGVmcz5cblx0XHRcdCAgICA8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJz5cblx0XHRcdCAgICAgICAgPGcgaWQ9J2lQYWQtUG9ydHJhaXQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0xNDM2LjAwMDAwMCwgLTE5NTYuMDAwMDAwKScgZmlsbD0nIzAwMDAwMCc+XG5cdFx0XHQgICAgICAgICAgICA8ZyBpZD0nS2V5Ym9hcmQtTGlnaHQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCAxNDIyLjAwMDAwMCknPlxuXHRcdFx0ICAgICAgICAgICAgICAgIDxnIGlkPSdLZXlib2FyZC1kb3duJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgxNDEyLjAwMDAwMCwgNTAwLjAwMDAwMCknPlxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNODcuMDAxMzMyLDM0IEM4OC4xMDUxNjU5LDM0IDg5LDM0Ljg5OTcxMjcgODksMzUuOTkzMjg3NCBMODksNjEuMDA2NzEyNiBDODksNjIuMTA3NTc0OCA4OC4xMDU4NzU5LDYzIDg3LjAwMTMzMiw2MyBMMjUuOTk4NjY4LDYzIEMyNC44OTQ4MzQxLDYzIDI0LDYyLjEwMDI4NzMgMjQsNjEuMDA2NzEyNiBMMjQsMzUuOTkzMjg3NCBDMjQsMzQuODkyNDI1MiAyNC44OTQxMjQxLDM0IDI1Ljk5ODY2OCwzNCBMODcuMDAxMzMyLDM0IFogTTI2LDM2IEwyNiw2MSBMODcsNjEgTDg3LDM2IEwyNiwzNiBaIE03OSw0MCBMODMsNDAgTDgzLDQ0IEw3OSw0NCBMNzksNDAgWiBNNzIsNDAgTDc2LDQwIEw3Niw0NCBMNzIsNDQgTDcyLDQwIFogTTY1LDQwIEw2OSw0MCBMNjksNDQgTDY1LDQ0IEw2NSw0MCBaIE01OCw0MCBMNjIsNDAgTDYyLDQ0IEw1OCw0NCBMNTgsNDAgWiBNNTEsNDAgTDU1LDQwIEw1NSw0NCBMNTEsNDQgTDUxLDQwIFogTTQ0LDQwIEw0OCw0MCBMNDgsNDQgTDQ0LDQ0IEw0NCw0MCBaIE0zNyw0MCBMNDEsNDAgTDQxLDQ0IEwzNyw0NCBMMzcsNDAgWiBNMzAsNDAgTDM0LDQwIEwzNCw0NCBMMzAsNDQgTDMwLDQwIFogTTc5LDQ3IEw4Myw0NyBMODMsNTEgTDc5LDUxIEw3OSw0NyBaIE03Miw0NyBMNzYsNDcgTDc2LDUxIEw3Miw1MSBMNzIsNDcgWiBNNjUsNDcgTDY5LDQ3IEw2OSw1MSBMNjUsNTEgTDY1LDQ3IFogTTU4LDQ3IEw2Miw0NyBMNjIsNTEgTDU4LDUxIEw1OCw0NyBaIE01MSw0NyBMNTUsNDcgTDU1LDUxIEw1MSw1MSBMNTEsNDcgWiBNNDQsNDcgTDQ4LDQ3IEw0OCw1MSBMNDQsNTEgTDQ0LDQ3IFogTTM3LDQ3IEw0MSw0NyBMNDEsNTEgTDM3LDUxIEwzNyw0NyBaIE0zMCw0NyBMMzQsNDcgTDM0LDUxIEwzMCw1MSBMMzAsNDcgWiBNNzksNTQgTDgzLDU0IEw4Myw1OCBMNzksNTggTDc5LDU0IFogTTcyLDU0IEw3Niw1NCBMNzYsNTggTDcyLDU4IEw3Miw1NCBaIE00NCw1NCBMNjksNTQgTDY5LDU4IEw0NCw1OCBMNDQsNTQgWiBNMzcsNTQgTDQxLDU0IEw0MSw1OCBMMzcsNTggTDM3LDU0IFogTTMwLDU0IEwzNCw1NCBMMzQsNTggTDMwLDU4IEwzMCw1NCBaIE00NC4zMTYzNDk4LDY5Ljk3NzEwNDcgQzQzLjM2ODQyMjUsNzAuNTQyMDM0MiA0My4zMzM4NzIxLDcxLjUwOTY0OTUgNDQuMjM3ODIxNyw3Mi4xMzczOTEyIEw1NS4zNjIxNTM5LDc5Ljg2MjYwODggQzU2LjI2NjcxMTMsODAuNDkwNzcyNiA1Ny43MzM4OTY1LDgwLjQ5MDM1MDUgNTguNjM3ODQ2MSw3OS44NjI2MDg4IEw2OS43NjIxNzgzLDcyLjEzNzM5MTIgQzcwLjY2NjczNTcsNzEuNTA5MjI3NCA3MC42NDgwMTIsNzAuNTIwNTIwNCA2OS43MTE1MTg3LDY5LjkyMzQxNjYgTDY5Ljk4MjU3MzEsNzAuMDk2MjM5NiBDNjkuNTE4MTMzMyw2OS44MDAxMTUgNjguNzc4MjU1Nyw2OS44MTI2NDkzIDY4LjMyNjEzMDcsNzAuMTI2OTMyMyBMNTcuODE1NDk5OSw3Ny40MzMxMjYzIEM1Ny4zNjUxMTE3LDc3Ljc0NjIwMiA1Ni42MjgxNjUsNzcuNzM4MTc4NiA1Ni4xNzYyMTAzLDc3LjQxOTk0MjQgTDQ1LjgzODYxMzcsNzAuMTQwODk3NyBDNDUuMzgzNjQ3Miw2OS44MjA1NDA3IDQ0LjYzNzUwMzksNjkuNzg1NzA4OCA0NC4xNTY2MzkzLDcwLjA3MjI4NjIgTDQ0LjMxNjM0OTgsNjkuOTc3MTA0NyBaJyBpZD0nU2hhcGUnPjwvcGF0aD5cblx0XHRcdCAgICAgICAgICAgICAgICA8L2c+XG5cdFx0XHQgICAgICAgICAgICA8L2c+XG5cdFx0XHQgICAgICAgIDwvZz5cblx0XHRcdCAgICA8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRvYmplY3RzIDogXG5cdFx0XCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDExKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTEgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT5MaWdodGJ1bGI8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHQ8ZyBpZD0naVBob25lLTYnIHNrZXRjaDp0eXBlPSdNU0FydGJvYXJkR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yNDQuMDAwMDAwLCAtNjM5LjAwMDAwMCknIHN0cm9rZT0nIzRBNTM2MSc+XG5cdFx0XHRcdFx0XHQ8ZyBpZD0nTGlnaHRidWxiJyBza2V0Y2g6dHlwZT0nTVNMYXllckdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyNDQuMDAwMDAwLCA2MzkuMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J004LDEwLjQwMDI5MDQgQzkuNzgwODM3OTUsOS40ODk5MzQ5MSAxMSw3LjYzNzM0MjczIDExLDUuNSBDMTEsMi40NjI0MzM4OCA4LjUzNzU2NjEyLDAgNS41LDAgQzIuNDYyNDMzODgsMCAwLDIuNDYyNDMzODggMCw1LjUgQzAsNy42MzczNDI3MyAxLjIxOTE2MjA1LDkuNDg5OTM0OTEgMywxMC40MDAyOTA0IEwzLDE0LjAwMjA4NjkgQzMsMTUuMTAxNzM5NCAzLjg5NzYxNjAyLDE2IDUuMDA0ODgxNSwxNiBMNS45OTUxMTg1LDE2IEM3LjEwNjEwMDIsMTYgOCwxNS4xMDU1MDM4IDgsMTQuMDAyMDg2OSBMOCwxMC40MDAyOTA0IFonIGlkPSdPdmFsLTE3JyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTAnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIHg9JzMnIHk9JzEyJyB3aWR0aD0nNScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtNTEnIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnIHg9JzQnIHk9JzEzLjUnIHdpZHRoPScxLjUnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNSw4LjUgQzUsOC41IDMuNDk5OTk5OTksNy41MDAwMDAwMSA0LDcgQzQuNTAwMDAwMDEsNi40OTk5OTk5OSA1LDcuNjY2NjY2NjcgNS41LDggQzUuNSw4IDYuNSw2LjUwMDAwMDAxIDcsNyBDNy41LDcuNDk5OTk5OTkgNiw4LjUgNiw4LjUgTDYsMTEgTDUsMTEgTDUsOC41IFonIGlkPSdSZWN0YW5nbGUtNTInIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPjwvcGF0aD5cblx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdHNoaWZ0IDoge1xuXHRcdG9uIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTgpfXB4JyB2aWV3Qm94PScwIDAgMjAgMTcnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0XHQ8dGl0bGU+U2hpZnQ8L3RpdGxlPlxuXHRcdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBza2V0Y2g6dHlwZT0nTVNQYWdlJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9VcHBlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTE0LjAwMDAwMCwgLTEzMC4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9J1RoaXJkLVJvdycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMy4wMDAwMDAsIDExOC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMjEuNzA1MjM4OCwxMy4yMDUyMzg4IEMyMS4zMTU3NDYyLDEyLjgxNTc0NjIgMjAuNjg1NzU1OSwxMi44MTQyNDQxIDIwLjI5NDc2MTIsMTMuMjA1MjM4OCBMMTEuOTE2MDc2NywyMS41ODM5MjMzIEMxMS4xMzM5OTkxLDIyLjM2NjAwMDkgMTEuMzk4MjYwNiwyMyAxMi40OTc5MTMxLDIzIEwxNi41LDIzIEwxNi41LDI4LjAwOTIyMiBDMTYuNSwyOC41NTY0MTM2IDE2Ljk0NjMxMTQsMjkgMTcuNDk3NTQ0NiwyOSBMMjQuNTAyNDU1NCwyOSBDMjUuMDUzMzg0LDI5IDI1LjUsMjguNTQ5MDI0OCAyNS41LDI4LjAwOTIyMiBMMjUuNSwyMyBMMjkuNTAyMDg2OSwyMyBDMzAuNjA1NTAzOCwyMyAzMC44NjY4MjQsMjIuMzY2ODI0IDMwLjA4MzkyMzMsMjEuNTgzOTIzMyBMMjEuNzA1MjM4OCwxMy4yMDUyMzg4IFonIGlkPSdTaGlmdCc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cIlxuXHRcdG9mZiA6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDIwKX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTgpfXB4JyB2aWV3Qm94PScwIDAgMjAgMTknIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0PCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjUuMiAoMjUyMzUpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0PHRpdGxlPlNoaWZ0PC90aXRsZT5cblx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0PGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgc2tldGNoOnR5cGU9J01TUGFnZSc+XG5cdFx0XHRcdDxnIGlkPSdLZXlib2FyZC9MaWdodC9Mb3dlcicgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTE0LjAwMDAwMCwgLTEyOS4wMDAwMDApJyBmaWxsPScjMDMwMzAzJz5cblx0XHRcdFx0XHQ8ZyBpZD0nVGhpcmQtUm93JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgzLjAwMDAwMCwgMTE4LjAwMDAwMCknIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0PHBhdGggZD0nTTIxLjY3MTkwMDgsMTIuMjMyNTg5OCBDMjEuMzAxMDMyLDExLjgyNzk5MTYgMjAuNjk0Njg5MiwxMS44MzM0NzMxIDIwLjMyODgxOTUsMTIuMjMyNTg5OCBMMTEuNjk0NzAyMywyMS42NTEyOTgzIEMxMC43NTg3NDQxLDIyLjY3MjMwOCAxMS4xMjg1NTQxLDIzLjUgMTIuNTA5Nzc1MSwyMy41IEwxNS45OTk5OTk5LDIzLjUwMDAwMDIgTDE1Ljk5OTk5OTksMjguMDAxNDI0MSBDMTUuOTk5OTk5OSwyOC44MjkwNjQ4IDE2LjY3MTY1NTksMjkuNTAwMDAwMSAxNy40OTcxMDEsMjkuNTAwMDAwMSBMMjQuNTAyODk5MiwyOS41MDAwMDAxIEMyNS4zMjk3MjUzLDI5LjUwMDAwMDEgMjYuMDAwMDAwMywyOC44MzQ5NzAzIDI2LjAwMDAwMDMsMjguMDAxNDI0MSBMMjYuMDAwMDAwMywyMy41MDAwMDAxIEwyOS40OTAyMjUxLDIzLjUwMDAwMDIgQzMwLjg3NjMzNTcsMjMuNTAwMDAwMiAzMS4yNDM5NTIxLDIyLjY3NTE5MTYgMzAuMzA1NDE2MSwyMS42NTEyOTg1IEwyMS42NzE5MDA4LDEyLjIzMjU4OTggWiBNMjEuMzQxNzQ4LDE0LjM2NDUzMTYgQzIxLjE1MzAwNTYsMTQuMTYzMjA2NCAyMC44NDMzNTE1LDE0LjE2NzA5MTQgMjAuNjU4MjUxNCwxNC4zNjQ1MzE2IEwxMy41LDIxLjk5OTk5OTggTDE3LjUwMDAwMDEsMjEuOTk5OTk5OSBMMTcuNTAwMDAwMiwyNy41MDg5OTU2IEMxNy41MDAwMDAyLDI3Ljc4MDE3MDMgMTcuNzMyOTAyNywyOC4wMDAwMDA4IDE4LjAwMzQyMjksMjguMDAwMDAwOCBMMjMuOTk2NTc3LDI4LjAwMDAwMDggQzI0LjI3NDYwOTcsMjguMDAwMDAwOCAyNC40OTk5OTk3LDI3Ljc3MjEyMDMgMjQuNDk5OTk5NywyNy41MDg5OTU2IEwyNC40OTk5OTk3LDIxLjk5OTk5OTkgTDI4LjUsMjEuOTk5OTk5OSBMMjEuMzQxNzQ4LDE0LjM2NDUzMTYgWicgaWQ9J1NoaWZ0Jz48L3BhdGg+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XCJcblx0fVxuXHRzbWlsZXlzOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nI3tleHBvcnRzLnB4KDE3KX1weCcgaGVpZ2h0PScje2V4cG9ydHMucHgoMTYpfXB4JyB2aWV3Qm94PScwIDAgMTcgMTYnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeG1sbnM6c2tldGNoPSdodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNS4yICgyNTIzNSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHRcdDx0aXRsZT46RDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtODYuMDAwMDAwLCAtNjM4LjAwMDAwMCknPlxuXHRcdFx0XHRcdFx0PGcgaWQ9J0tleWJvYXJkcycgc2tldGNoOnR5cGU9J01TTGF5ZXJHcm91cCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMC4wMDAwMDAsIDQwOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0PGcgaWQ9JzpEJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg4Ny4wMDAwMDAsIDIzMC41MDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlIGlkPSdIZWFkJyBzdHJva2U9JyM0QTU0NjEnIHN0cm9rZS13aWR0aD0nMC43ODk0NzM2ODQnIGN4PSc3LjUnIGN5PSc3LjUnIHI9JzcuNSc+PC9jaXJjbGU+XG5cdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTcuNSwxMy41MjYzMTU4IEMxMC4yNjg2OTA3LDEzLjUyNjMxNTggMTIuNTEzMTU3OSwxMC4zNjg0MjEyIDEyLjUxMzE1NzksOS4xODQyMTA0NSBDMTIuNTEzMTU3OSw3LjYwNTI2MzE3IDExLjQzODkwOTgsOS4xODQyMTA0MyA3LjUsOS4xODQyMTA1MyBDMy41NjEwOTAyMyw5LjE4NDIxMDYyIDIuNDg2ODQyMTEsNy42MDUyNjMxNyAyLjQ4Njg0MjExLDkuMTg0MjEwNDUgQzIuNDg2ODQyMTEsMTAuMzY4NDIxIDQuNzMxMzA5MzUsMTMuNTI2MzE1OCA3LjUsMTMuNTI2MzE1OCBaIE03LjUsMTAuOTYwNTI2MyBDOC45MzIzMzA4MywxMS4xNTc4OTQ3IDExLjc5Njk5MjUsMTAuMzY4NDIxIDExLjc5Njk5MjUsOS40NDQyMzU1MiBDMTEuNzk2OTkyNSw4Ljc4OTQ3MzY4IDEwLjg3NjIwODQsOS41Nzg5NDcyNyA3LjUsOS43NzYzMTU3OSBDNC4xMjM3OTE2Miw5LjU3ODk0NzQzIDMuMjAzMDA4NzIsOC43ODk0NzM2OSAzLjIwMzAwNzUyLDkuNDQ0MjM1NTIgQzMuMjAzMDA1ODIsMTAuMzY4NDIxIDYuMDY3NjY5MTcsMTEuMTU3ODk0NyA3LjUsMTAuOTYwNTI2MyBaJyBpZD0nU21pbGUnIGZpbGw9JyM0QTU0NjEnPjwvcGF0aD5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNNS4yMzY4NDIxMSw2LjMyMzY1OTggQzUuNjQzNzg4NzYsNi4zMjM2NTk4IDUuOTczNjg0MjEsNS44ODE4MzU1NCA1Ljk3MzY4NDIxLDUuMzM2ODE3NjkgQzUuOTczNjg0MjEsNC43OTE3OTk4NSA1LjY0Mzc4ODc2LDQuMzQ5OTc1NTkgNS4yMzY4NDIxMSw0LjM0OTk3NTU5IEM0LjgyOTg5NTQ1LDQuMzQ5OTc1NTkgNC41LDQuNzkxNzk5ODUgNC41LDUuMzM2ODE3NjkgQzQuNSw1Ljg4MTgzNTU0IDQuODI5ODk1NDUsNi4zMjM2NTk4IDUuMjM2ODQyMTEsNi4zMjM2NTk4IFogTTkuNzM2ODQyMTEsNi4zMjM2NTk4IEMxMC4xNDM3ODg4LDYuMzIzNjU5OCAxMC40NzM2ODQyLDUuODgxODM1NTQgMTAuNDczNjg0Miw1LjMzNjgxNzY5IEMxMC40NzM2ODQyLDQuNzkxNzk5ODUgMTAuMTQzNzg4OCw0LjM0OTk3NTU5IDkuNzM2ODQyMTEsNC4zNDk5NzU1OSBDOS4zMjk4OTU0NSw0LjM0OTk3NTU5IDksNC43OTE3OTk4NSA5LDUuMzM2ODE3NjkgQzksNS44ODE4MzU1NCA5LjMyOTg5NTQ1LDYuMzIzNjU5OCA5LjczNjg0MjExLDYuMzIzNjU5OCBaJyBpZD0nRXllcycgZmlsbD0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXG5cdHN5bWJvbHM6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTYpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNyl9cHgnIHZpZXdCb3g9JzAgMCAxNSAxNycgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPk9iamVjdHMgJmFtcDsgU3ltYm9sczwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMzA0LjAwMDAwMCwgLTYzOC4wMDAwMDApJyBmaWxsPScjNEE1NDYxJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdPYmplY3RzLSZhbXA7LVN5bWJvbHMnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDMwNC4wMDAwMDAsIDIzMC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdFx0XHQ8ZyBpZD0nVGhpbmcnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCAwLjUwMDAwMCknIHNrZXRjaDp0eXBlPSdNU1NoYXBlR3JvdXAnPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1JlY3RhbmdsZS0xMjA5JyB4PScwJyB5PScwJyB3aWR0aD0nNycgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nUmVjdGFuZ2xlLTEyMDknIHg9JzAnIHk9JzInIHdpZHRoPSc3JyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdSZWN0YW5nbGUtMTIxMScgeD0nMycgeT0nMycgd2lkdGg9JzEnIGhlaWdodD0nNCc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMTEuNzUsMC4xNTkyNjM5NzggTDExLjc1LDAgTDExLDAgTDExLDUuMDkxNDkzIEMxMC41OTM0NCw0Ljk0MjIxMzkyIDEwLjA2Mzk2NjIsNC45NjQ1MzIyNCA5LjU1NzE1Mzk5LDUuMTkwMTc5NTcgQzguNjk4NDkyOTMsNS41NzI0ODAxIDguMjMwMDM4MzUsNi4zOTM2NTYyMSA4LjUxMDgzMTQxLDcuMDI0MzI3NzQgQzguNzkxNjI0NDcsNy42NTQ5OTkyOCA5LjcxNTMzNDU0LDcuODU2MzQzNzUgMTAuNTczOTk1Niw3LjQ3NDA0MzIxIEMxMS4yNzYxMTgzLDcuMTYxNDM4MDMgMTEuNzE3MzM5Myw2LjU1NTM4OTcyIDExLjcwMTM1OTUsNiBMMTEuNzUsNiBMMTEuNzUsMS4zOTM4NTA1NiBDMTIuMzE3NTkwOCwxLjU5NTkwMDM3IDEzLDIuMDgxNzQ1NiAxMywzLjI1IEMxMyw0LjI1IDEyLjc1LDUuNSAxMi43NSw1LjUgQzEyLjc1LDUuNSAxMy43NSw0Ljc1IDEzLjc1LDIuNSBDMTMuNzUsMS4wMjI1NjEwMSAxMi41NjQyNjc0LDAuNDA3NDczMDE5IDExLjc1LDAuMTU5MjYzOTc4IFonIGlkPSdOb3RlJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0PHRleHQgaWQ9JyZhbXA7JyBza2V0Y2g6dHlwZT0nTVNUZXh0TGF5ZXInIGZvbnQtZmFtaWx5PSdTRiBVSSBEaXNwbGF5JyBmb250LXNpemU9JzkuNScgZm9udC13ZWlnaHQ9J25vcm1hbCc+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8dHNwYW4geD0nMC4yNScgeT0nMTYnPiZhbXA7PC90c3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHRcdFx0PHRleHQgaWQ9JyUnIHNrZXRjaDp0eXBlPSdNU1RleHRMYXllcicgZm9udC1mYW1pbHk9J1NGIFVJIERpc3BsYXknIGZvbnQtc2l6ZT0nOS41JyBmb250LXdlaWdodD0nbm9ybWFsJz5cblx0XHRcdFx0XHRcdFx0XHRcdDx0c3BhbiB4PSc3Ljc1JyB5PScxNic+JTwvdHNwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHR0cmF2ZWw6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPScje2V4cG9ydHMucHgoMTcpfXB4JyBoZWlnaHQ9JyN7ZXhwb3J0cy5weCgxNil9cHgnIHZpZXdCb3g9JzAgMCAxNyAxNicgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4bWxuczpza2V0Y2g9J2h0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyc+XG5cdFx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy41LjIgKDI1MjM1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT5cblx0XHRcdFx0PHRpdGxlPlRyYW5zcG9ydDwvdGl0bGU+XG5cdFx0XHRcdDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdFx0XHQ8ZGVmcz48L2RlZnM+XG5cdFx0XHRcdDxnIGlkPSdpT1MtOS1LZXlib2FyZHMnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIHNrZXRjaDp0eXBlPSdNU1BhZ2UnPlxuXHRcdFx0XHRcdDxnIGlkPSdpUGhvbmUtNi1Qb3J0cmFpdC1MaWdodC1Db3B5JyBza2V0Y2g6dHlwZT0nTVNBcnRib2FyZEdyb3VwJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjQxLjAwMDAwMCwgLTYzOC4wMDAwMDApJz5cblx0XHRcdFx0XHRcdDxnIGlkPSdLZXlib2FyZHMnIHNrZXRjaDp0eXBlPSdNU0xheWVyR3JvdXAnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAuMDAwMDAwLCA0MDguMDAwMDAwKSc+XG5cdFx0XHRcdFx0XHRcdDxnIGlkPSdUcmFuc3BvcnQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDI0MS41MDAwMDAsIDIzMC4wMDAwMDApJyBza2V0Y2g6dHlwZT0nTVNTaGFwZUdyb3VwJz5cblx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMCw2IEwxLDYgTDEsMTUgTDAsMTUgTDAsNiBaIE0xNSw0IEwxNiw0IEwxNiwxNSBMMTUsMTUgTDE1LDQgWiBNMy41LDAgTDQuNSwwIEw0LjUsNyBMMy41LDcgTDMuNSwwIFogTTEsNiBMMy41LDYgTDMuNSw3IEwxLDcgTDEsNiBaIE00LjUsMCBMOS41LDAgTDkuNSwxIEw0LjUsMSBMNC41LDAgWiBNOS41LDAgTDEwLjUsMCBMMTAuNSw2IEw5LjUsNiBMOS41LDAgWiBNMTAuNSw0IEwxNSw0IEwxNSw1IEwxMC41LDUgTDEwLjUsNCBaJyBpZD0nU2t5bGluZScgZmlsbD0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDxnIGlkPSdXaW5kb3dzJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApJyBmaWxsPScjNEE1NDYxJz5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzAnIHk9JzYnIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzMuNScgeT0nMCcgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1dpbmRvdycgeD0nNS41JyB5PScwJyB3aWR0aD0nMScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cmVjdCBpZD0nV2luZG93JyB4PSc1LjUnIHk9JzInIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzMuNScgeT0nMicgd2lkdGg9JzEnIGhlaWdodD0nMSc+PC9yZWN0PlxuXHRcdFx0XHRcdFx0XHRcdFx0PHJlY3QgaWQ9J1dpbmRvdycgeD0nMTEnIHk9JzQnIHdpZHRoPScxJyBoZWlnaHQ9JzEnPjwvcmVjdD5cblx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0IGlkPSdXaW5kb3cnIHg9JzExJyB5PSc2JyB3aWR0aD0nMScgaGVpZ2h0PScxJz48L3JlY3Q+XG5cdFx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0XHRcdDxnIGlkPSdDYXInIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIuNTAwMDAwLCA2LjUwMDAwMCknPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHBhdGggZD0nTTguNSw4IEwyLjUsOCBMMi41LDkuNSBMMC41LDkuNSBMMC41LDcuODY4MTE0NSBDMC4yMDEyMDIxOTIsNy42OTU4MjcwMiAwLDcuMzcwOTEzNjMgMCw2Ljk5MDYzMTEgTDAsNS4wMDkzNjg5IEMwLDQuNDUxOTA5ODUgMC40NDQ4MzY5NzQsNCAwLjk5NTU3NzQ5OSw0IEwxMC4wMDQ0MjI1LDQgQzEwLjU1NDI2NDgsNCAxMSw0LjQ0MzM1MzE4IDExLDUuMDA5MzY4OSBMMTEsNi45OTA2MzExIEMxMSw3LjM2NTMzMTUgMTAuNzk5MDI0NCw3LjY5MjM0NTE5IDEwLjUsNy44NjY0OTAwMiBMMTAuNSw5LjUgTDguNSw5LjUgTDguNSw4IFogTTEuNzUsNi41IEMyLjE2NDIxMzU2LDYuNSAyLjUsNi4xNjQyMTM1NiAyLjUsNS43NSBDMi41LDUuMzM1Nzg2NDQgMi4xNjQyMTM1Niw1IDEuNzUsNSBDMS4zMzU3ODY0NCw1IDEsNS4zMzU3ODY0NCAxLDUuNzUgQzEsNi4xNjQyMTM1NiAxLjMzNTc4NjQ0LDYuNSAxLjc1LDYuNSBaIE05LjI1LDYuNSBDOS42NjQyMTM1Niw2LjUgMTAsNi4xNjQyMTM1NiAxMCw1Ljc1IEMxMCw1LjMzNTc4NjQ0IDkuNjY0MjEzNTYsNSA5LjI1LDUgQzguODM1Nzg2NDQsNSA4LjUsNS4zMzU3ODY0NCA4LjUsNS43NSBDOC41LDYuMTY0MjEzNTYgOC44MzU3ODY0NCw2LjUgOS4yNSw2LjUgWiBNMC41LDcgTDEwLjUsNyBMMTAuNSw3LjUgTDAuNSw3LjUgTDAuNSw3IFogTTMsNi41IEw4LDYuNSBMOCw3IEwzLDcgTDMsNi41IFonIGlkPSdCb2R5JyBmaWxsPScjNEE1NDYxJz48L3BhdGg+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMS41LDQuNSBMMS41LDMgQzEuNSwxLjM0MzE0NTc1IDIuODM5MDIwMTMsMCA0LjUwMTY2NTQ3LDAgTDYuNDk4MzM0NTMsMCBDOC4xNTYxMDg1OSwwIDkuNSwxLjM0NjUxNzEyIDkuNSwzIEw5LjUsNScgaWQ9J1Jvb2YnIHN0cm9rZT0nIzRBNTQ2MSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9zdmc+XCJ9XG5cbmJhbm5lckJHID0ge1xuXHRcImlwaG9uZS01XCI6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0PHN2ZyB3aWR0aD0nMzIwcHgnIGhlaWdodD0nNjhweCcgdmlld0JveD0nMCAwIDMyMCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHQgICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdCAgICA8dGl0bGU+aXBob25lNTwvdGl0bGU+XG5cdFx0ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPlxuXHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0ICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGZpbGwtb3BhY2l0eT0nMC45Jz5cblx0XHQgICAgICAgIDxnIGlkPSdpUGhvbmUtNS81Uy81QycgZmlsbD0nIzFBMUExQyc+XG5cdFx0ICAgICAgICAgICAgPHBhdGggZD0nTTAsMCBMMzIwLDAgTDMyMCw2OCBMMCw2OCBMMCwwIFogTTE0Miw2MS4wMDQ4ODE1IEMxNDIsNTkuODk3NjE2IDE0Mi44OTYyNzksNTkgMTQ0LjAwMjQsNTkgTDE3Ni45OTc2LDU5IEMxNzguMTAzNDk1LDU5IDE3OSw1OS44OTM4OTk4IDE3OSw2MS4wMDQ4ODE1IEwxNzksNjEuOTk1MTE4NSBDMTc5LDYzLjEwMjM4NCAxNzguMTAzNzIxLDY0IDE3Ni45OTc2LDY0IEwxNDQuMDAyNCw2NCBDMTQyLjg5NjUwNSw2NCAxNDIsNjMuMTA2MTAwMiAxNDIsNjEuOTk1MTE4NSBMMTQyLDYxLjAwNDg4MTUgWicgaWQ9J2lwaG9uZTUnPjwvcGF0aD5cblx0XHQgICAgICAgIDwvZz5cblx0XHQgICAgPC9nPlxuXHRcdDwvc3ZnPlwiXG5cdFwiaXBob25lLTZzXCI6IFwiPD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnIHN0YW5kYWxvbmU9J25vJz8+XG5cdFx0XHQ8c3ZnIHdpZHRoPSczNzVweCcgaGVpZ2h0PSc2OHB4JyB2aWV3Qm94PScwIDAgMzc1IDY4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPlxuXHRcdFx0XHQ8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNiAoMjYzMDQpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0XHQ8dGl0bGU+Tm90aWZpY2F0aW9uIGJhY2tncm91bmQ8L3RpdGxlPlxuXHRcdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdFx0PGRlZnM+PC9kZWZzPlxuXHRcdFx0XHQ8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZS13aWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbC1ydWxlPSdldmVub2RkJyBmaWxsLW9wYWNpdHk9JzAuOSc+XG5cdFx0XHRcdFx0PGcgaWQ9J2lPUzgtUHVzaC1Ob3RpZmljYXRpb24nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC01OC4wMDAwMDAsIC0yMy4wMDAwMDApJyBmaWxsPScjMUExQTFDJz5cblx0XHRcdFx0XHRcdDxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDU4LjAwMDAwMCwgNy4wMDAwMDApJyBpZD0nTm90aWZpY2F0aW9uLWNvbnRhaW5lcic+XG5cdFx0XHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0XHRcdDxwYXRoIGQ9J00wLDE2IEwzNzUsMTYgTDM3NSw4NCBMMCw4NCBMMCwxNiBaIE0xNjksNzcuMDA0ODgxNSBDMTY5LDc1Ljg5NzYxNiAxNjkuODk2Mjc5LDc1IDE3MS4wMDI0LDc1IEwyMDMuOTk3Niw3NSBDMjA1LjEwMzQ5NSw3NSAyMDYsNzUuODkzODk5OCAyMDYsNzcuMDA0ODgxNSBMMjA2LDc3Ljk5NTExODUgQzIwNiw3OS4xMDIzODQgMjA1LjEwMzcyMSw4MCAyMDMuOTk3Niw4MCBMMTcxLjAwMjQsODAgQzE2OS44OTY1MDUsODAgMTY5LDc5LjEwNjEwMDIgMTY5LDc3Ljk5NTExODUgTDE2OSw3Ny4wMDQ4ODE1IFonIGlkPSdOb3RpZmljYXRpb24tYmFja2dyb3VuZCc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQ8L3N2Zz5cIlxuXHRcImlwaG9uZS02cy1wbHVzXCIgOiBcIjw/eG1sIHZlcnNpb249JzEuMCcgZW5jb2Rpbmc9J1VURi04JyBzdGFuZGFsb25lPSdubyc/PlxuXHRcdFx0PHN2ZyB3aWR0aD0nNDE0cHgnIGhlaWdodD0nNjhweCcgdmlld0JveD0nMCAwIDQxNCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy42ICgyNjMwNCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHQ8dGl0bGU+Tm90aWZpY2F0aW9uIGJhY2tncm91bmQgQ29weTwvdGl0bGU+XG5cdFx0XHQ8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdDxkZWZzPjwvZGVmcz5cblx0XHRcdDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGZpbGwtb3BhY2l0eT0nMC45Jz5cblx0XHRcdFx0PGcgaWQ9J2lPUzgtUHVzaC1Ob3RpZmljYXRpb24nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC00My4wMDAwMDAsIC03NC4wMDAwMDApJyBmaWxsPScjMUExQTFDJz5cblx0XHRcdFx0XHQ8ZyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg0My4wMDAwMDAsIDc0LjAwMDAwMCknIGlkPSdOb3RpZmljYXRpb24tY29udGFpbmVyJz5cblx0XHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0XHQ8cGF0aCBkPSdNMCwwIEw0MTQsMCBMNDE0LDY4IEwwLDY4IEwwLDAgWiBNMTg5LDYxLjAwNDg4MTUgQzE4OSw1OS44OTc2MTYgMTg5Ljg5NjI3OSw1OSAxOTEuMDAyNCw1OSBMMjIzLjk5NzYsNTkgQzIyNS4xMDM0OTUsNTkgMjI2LDU5Ljg5Mzg5OTggMjI2LDYxLjAwNDg4MTUgTDIyNiw2MS45OTUxMTg1IEMyMjYsNjMuMTAyMzg0IDIyNS4xMDM3MjEsNjQgMjIzLjk5NzYsNjQgTDE5MS4wMDI0LDY0IEMxODkuODk2NTA1LDY0IDE4OSw2My4xMDYxMDAyIDE4OSw2MS45OTUxMTg1IEwxODksNjEuMDA0ODgxNSBaJyBpZD0nTm90aWZpY2F0aW9uLWJhY2tncm91bmQtQ29weSc+PC9wYXRoPlxuXHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0PC9nPlxuXHRcdDwvc3ZnPlwiXG5cdFwiaXBhZFwiIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9Jzc2OHB4JyBoZWlnaHQ9JzY4cHgnIHZpZXdCb3g9JzAgMCA3NjggNjgnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+XG5cdFx0XHQgICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjYuMSAoMjYzMTMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPlxuXHRcdFx0ICAgIDx0aXRsZT5pcGFkLXBvcnRyYWl0PC90aXRsZT5cblx0XHRcdCAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0XHQgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScwLjknPlxuXHRcdFx0ICAgICAgICA8ZyBpZD0naVBhZC1Qb3J0cmFpdCcgZmlsbD0nIzFBMUExQyc+XG5cdFx0XHQgICAgICAgICAgICA8cGF0aCBkPSdNMCwwIEw3NjgsMCBMNzY4LDY4IEwwLDY4IEwwLDAgWiBNMzY2LDYxLjAwNDg4MTUgQzM2Niw1OS44OTc2MTYgMzY2Ljg5NjI3OSw1OSAzNjguMDAyNCw1OSBMNDAwLjk5NzYsNTkgQzQwMi4xMDM0OTUsNTkgNDAzLDU5Ljg5Mzg5OTggNDAzLDYxLjAwNDg4MTUgTDQwMyw2MS45OTUxMTg1IEM0MDMsNjMuMTAyMzg0IDQwMi4xMDM3MjEsNjQgNDAwLjk5NzYsNjQgTDM2OC4wMDI0LDY0IEMzNjYuODk2NTA1LDY0IDM2Niw2My4xMDYxMDAyIDM2Niw2MS45OTUxMTg1IEwzNjYsNjEuMDA0ODgxNSBaJyBpZD0naXBhZC1wb3J0cmFpdCc+PC9wYXRoPlxuXHRcdFx0ICAgICAgICA8L2c+XG5cdFx0XHQgICAgPC9nPlxuXHRcdFx0PC9zdmc+XCJcblx0XCJpcGFkLXByb1wiIDogXCI8P3htbCB2ZXJzaW9uPScxLjAnIGVuY29kaW5nPSdVVEYtOCcgc3RhbmRhbG9uZT0nbm8nPz5cblx0XHRcdDxzdmcgd2lkdGg9JzEwMjRweCcgaGVpZ2h0PSc2OHB4JyB2aWV3Qm94PScwIDAgMTAyNCA2OCcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJz5cblx0XHRcdCAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuNi4xICgyNjMxMykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+XG5cdFx0XHQgICAgPHRpdGxlPmlwYWQtcHJvLXBvcnRyYWl0PC90aXRsZT5cblx0XHRcdCAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz5cblx0XHRcdCAgICA8ZGVmcz48L2RlZnM+XG5cdFx0XHQgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgZmlsbC1vcGFjaXR5PScwLjknPlxuXHRcdFx0ICAgICAgICA8ZyBpZD0naVBhZC1Qcm8tUG9ydHJhaXQnIGZpbGw9JyMxQTFBMUMnPlxuXHRcdFx0ICAgICAgICAgICAgPHBhdGggZD0nTTAsMCBMMTAyNCwwIEwxMDI0LDY4IEwwLDY4IEwwLDAgWiBNNDk0LDYxLjAwNDg4MTUgQzQ5NCw1OS44OTc2MTYgNDk0Ljg5NjI3OSw1OSA0OTYuMDAyNCw1OSBMNTI4Ljk5NzYsNTkgQzUzMC4xMDM0OTUsNTkgNTMxLDU5Ljg5Mzg5OTggNTMxLDYxLjAwNDg4MTUgTDUzMSw2MS45OTUxMTg1IEM1MzEsNjMuMTAyMzg0IDUzMC4xMDM3MjEsNjQgNTI4Ljk5NzYsNjQgTDQ5Ni4wMDI0LDY0IEM0OTQuODk2NTA1LDY0IDQ5NCw2My4xMDYxMDAyIDQ5NCw2MS45OTUxMTg1IEw0OTQsNjEuMDA0ODgxNSBaJyBpZD0naXBhZC1wcm8tcG9ydHJhaXQnPjwvcGF0aD5cblx0XHRcdCAgICAgICAgPC9nPlxuXHRcdFx0ICAgIDwvZz5cblx0XHRcdDwvc3ZnPlwiXG5cdH1cbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
