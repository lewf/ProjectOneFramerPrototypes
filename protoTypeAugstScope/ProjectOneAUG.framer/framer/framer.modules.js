require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewController":[function(require,module,exports){
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
            if (_.contains(btn.name, name)) {
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
          var incoming, outgoing, ref, ref1, ref2, ref3, ref4, ref5, ref6;
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
          if (_.contains(name, 'Out')) {
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
          return incoming.on(Events.AnimationEnd, function() {
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
        return _.contains(l.name, options.backButtonName);
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
      if (_.contains(previous.animationName, 'Out')) {
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


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzLzQwMTEyNS9Eb2N1bWVudHMvX3Byb3RvdHlwZXMvUHJvamVjdE9uZUZyYW1lclByb3RvdHlwZXMvcHJvdG9UeXBlQXVnc3RTY29wZS9Qcm9qZWN0T25lQVVHLmZyYW1lci9tb2R1bGVzL215TW9kdWxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzLzQwMTEyNS9Eb2N1bWVudHMvX3Byb3RvdHlwZXMvUHJvamVjdE9uZUZyYW1lclByb3RvdHlwZXMvcHJvdG9UeXBlQXVnc3RTY29wZS9Qcm9qZWN0T25lQVVHLmZyYW1lci9tb2R1bGVzL2ZpcmViYXNlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzLzQwMTEyNS9Eb2N1bWVudHMvX3Byb3RvdHlwZXMvUHJvamVjdE9uZUZyYW1lclByb3RvdHlwZXMvcHJvdG9UeXBlQXVnc3RTY29wZS9Qcm9qZWN0T25lQVVHLmZyYW1lci9tb2R1bGVzL2ZpbmRNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvNDAxMTI1L0RvY3VtZW50cy9fcHJvdG90eXBlcy9Qcm9qZWN0T25lRnJhbWVyUHJvdG90eXBlcy9wcm90b1R5cGVBdWdzdFNjb3BlL1Byb2plY3RPbmVBVUcuZnJhbWVyL21vZHVsZXMvVmlld0NvbnRyb2xsZXIuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiXG5cblxuIyAnRmlyZWJhc2UgUkVTVCBBUEkgQ2xhc3MnIG1vZHVsZSB2MS4wXG4jIGJ5IE1hcmMgS3Jlbm4sIE1heSAzMXN0LCAyMDE2IHwgbWFyYy5rcmVubkBnbWFpbC5jb20gfCBAbWFyY19rcmVublxuXG4jIERvY3VtZW50YXRpb24gb2YgdGhpcyBNb2R1bGU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJja3Jlbm4vZnJhbWVyLUZpcmViYXNlXG4jIC0tLS0tLSA6IC0tLS0tLS0gRmlyZWJhc2UgUkVTVCBBUEk6IGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL3JlZmVyZW5jZS9yZXN0L2RhdGFiYXNlL1xuXG5cbiMgVG9EbzpcbiMgRml4IG9uQ2hhbmdlIFwiY29ubmVjdGlvblwiLCBgdGhpc8K0IGNvbnRleHRcblxuXG5cbiMgRmlyZWJhc2UgUkVTVCBBUEkgQ2xhc3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jbGFzcyBleHBvcnRzLkZpcmViYXNlIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXG5cblxuXHRnZXRDT1JTdXJsID0gKHNlcnZlciwgcGF0aCwgc2VjcmV0LCBwcm9qZWN0KSAtPlxuXG5cdFx0c3dpdGNoIFV0aWxzLmlzV2ViS2l0KClcblx0XHRcdHdoZW4gdHJ1ZSB0aGVuIHVybCA9IFwiaHR0cHM6Ly8je3NlcnZlcn0je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH0mbnM9I3twcm9qZWN0fSZzc2U9dHJ1ZVwiICMgV2Via2l0IFhTUyB3b3JrYXJvdW5kXG5cdFx0XHRlbHNlICAgICAgICAgICB1cmwgPSBcImh0dHBzOi8vI3twcm9qZWN0fS5maXJlYmFzZWlvLmNvbSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fVwiXG5cblx0XHRyZXR1cm4gdXJsXG5cblxuXHRALmRlZmluZSBcInN0YXR1c1wiLFxuXHRcdGdldDogLT4gQF9zdGF0dXMgIyByZWFkT25seVxuXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cdFx0QHByb2plY3RJRCA9IEBvcHRpb25zLnByb2plY3RJRCA/PSBudWxsXG5cdFx0QHNlY3JldCAgICA9IEBvcHRpb25zLnNlY3JldCAgICA/PSBudWxsXG5cdFx0QHNlcnZlciAgICA9IEBvcHRpb25zLnNlcnZlciAgICA/PSB1bmRlZmluZWQgIyByZXF1aXJlZCBmb3IgV2ViS2l0IFhTUyB3b3JrYXJvdW5kXG5cdFx0QGRlYnVnICAgICA9IEBvcHRpb25zLmRlYnVnICAgICA/PSBmYWxzZVxuXHRcdEBfc3RhdHVzICAgICAgICAgICAgICAgICAgICAgICAgPz0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdHN1cGVyXG5cblxuXHRcdGlmIEBzZXJ2ZXIgaXMgdW5kZWZpbmVkXG5cdFx0XHRVdGlscy5kb21Mb2FkSlNPTiBcImh0dHBzOi8vI3tAcHJvamVjdElEfS5maXJlYmFzZWlvLmNvbS8uc2V0dGluZ3Mvb3duZXIuanNvblwiLCAoYSxzZXJ2ZXIpIC0+XG5cdFx0XHRcdHByaW50IG1zZyA9IFwiQWRkIF9fX19fXyBzZXJ2ZXI6XCIgKyAnICAgXCInICsgc2VydmVyICsgJ1wiJyArIFwiIF9fX19fIHRvIHlvdXIgaW5zdGFuY2Ugb2YgRmlyZWJhc2UuXCJcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogI3ttc2d9XCIgaWYgQGRlYnVnXG5cblxuXHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IENvbm5lY3RpbmcgdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgLi4uIFxcbiBVUkw6ICcje2dldENPUlN1cmwoQHNlcnZlciwgXCIvXCIsIEBzZWNyZXQsIEBwcm9qZWN0SUQpfSdcIiBpZiBAZGVidWdcblx0XHRALm9uQ2hhbmdlIFwiY29ubmVjdGlvblwiXG5cblxuXHRyZXF1ZXN0ID0gKHByb2plY3QsIHNlY3JldCwgcGF0aCwgY2FsbGJhY2ssIG1ldGhvZCwgZGF0YSwgcGFyYW1ldGVycywgZGVidWcpIC0+XG5cblx0XHR1cmwgPSBcImh0dHBzOi8vI3twcm9qZWN0fS5maXJlYmFzZWlvLmNvbSN7cGF0aH0uanNvbj9hdXRoPSN7c2VjcmV0fVwiXG5cblxuXHRcdHVubGVzcyBwYXJhbWV0ZXJzIGlzIHVuZGVmaW5lZFxuXHRcdFx0aWYgcGFyYW1ldGVycy5zaGFsbG93ICAgICAgICAgICAgdGhlbiB1cmwgKz0gXCImc2hhbGxvdz10cnVlXCJcblx0XHRcdGlmIHBhcmFtZXRlcnMuZm9ybWF0IGlzIFwiZXhwb3J0XCIgdGhlbiB1cmwgKz0gXCImZm9ybWF0PWV4cG9ydFwiXG5cblx0XHRcdHN3aXRjaCBwYXJhbWV0ZXJzLnByaW50XG5cdFx0XHRcdHdoZW4gXCJwcmV0dHlcIiB0aGVuIHVybCArPSBcIiZwcmludD1wcmV0dHlcIlxuXHRcdFx0XHR3aGVuIFwic2lsZW50XCIgdGhlbiB1cmwgKz0gXCImcHJpbnQ9c2lsZW50XCJcblxuXHRcdFx0aWYgdHlwZW9mIHBhcmFtZXRlcnMuZG93bmxvYWQgaXMgXCJzdHJpbmdcIlxuXHRcdFx0XHR1cmwgKz0gXCImZG93bmxvYWQ9I3twYXJhbWV0ZXJzLmRvd25sb2FkfVwiXG5cdFx0XHRcdHdpbmRvdy5vcGVuKHVybCxcIl9zZWxmXCIpXG5cblxuXHRcdFx0dXJsICs9IFwiJm9yZGVyQnk9XCIgKyAnXCInICsgcGFyYW1ldGVycy5vcmRlckJ5ICsgJ1wiJyBpZiB0eXBlb2YgcGFyYW1ldGVycy5vcmRlckJ5ICAgICAgaXMgXCJzdHJpbmdcIlxuXHRcdFx0dXJsICs9IFwiJmxpbWl0VG9GaXJzdD0je3BhcmFtZXRlcnMubGltaXRUb0ZpcnN0fVwiICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMubGltaXRUb0ZpcnN0IGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZsaW1pdFRvTGFzdD0je3BhcmFtZXRlcnMubGltaXRUb0xhc3R9XCIgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmxpbWl0VG9MYXN0ICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImc3RhcnRBdD0je3BhcmFtZXRlcnMuc3RhcnRBdH1cIiAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5zdGFydEF0ICAgICAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJmVuZEF0PSN7cGFyYW1ldGVycy5lbmRBdH1cIiAgICAgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuZW5kQXQgICAgICAgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZlcXVhbFRvPSN7cGFyYW1ldGVycy5lcXVhbFRvfVwiICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmVxdWFsVG8gICAgICBpcyBcIm51bWJlclwiXG5cblxuXHRcdHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0XG5cdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogTmV3ICcje21ldGhvZH0nLXJlcXVlc3Qgd2l0aCBkYXRhOiAnI3tKU09OLnN0cmluZ2lmeShkYXRhKX0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblx0XHR4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSA9PlxuXG5cdFx0XHR1bmxlc3MgcGFyYW1ldGVycyBpcyB1bmRlZmluZWRcblx0XHRcdFx0aWYgcGFyYW1ldGVycy5wcmludCBpcyBcInNpbGVudFwiIG9yIHR5cGVvZiBwYXJhbWV0ZXJzLmRvd25sb2FkIGlzIFwic3RyaW5nXCIgdGhlbiByZXR1cm4gIyB1Z2hcblxuXHRcdFx0c3dpdGNoIHhodHRwLnJlYWR5U3RhdGVcblx0XHRcdFx0d2hlbiAwIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVxdWVzdCBub3QgaW5pdGlhbGl6ZWQgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDEgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBTZXJ2ZXIgY29ubmVjdGlvbiBlc3RhYmxpc2hlZCBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMiB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3QgcmVjZWl2ZWQgXFxuIFVSTDogJyN7dXJsfSdcIiAgICAgICAgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAzIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogUHJvY2Vzc2luZyByZXF1ZXN0IFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgICAgICBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDRcblx0XHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKHhodHRwLnJlc3BvbnNlVGV4dCkpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3QgZmluaXNoZWQsIHJlc3BvbnNlOiAnI3tKU09OLnBhcnNlKHhodHRwLnJlc3BvbnNlVGV4dCl9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cblx0XHRcdGlmIHhodHRwLnN0YXR1cyBpcyBcIjQwNFwiXG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIkZpcmViYXNlOiBJbnZhbGlkIHJlcXVlc3QsIHBhZ2Ugbm90IGZvdW5kIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgZGVidWdcblxuXG5cdFx0eGh0dHAub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcblx0XHR4aHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxuXHRcdHhodHRwLnNlbmQoZGF0YSA9IFwiI3tKU09OLnN0cmluZ2lmeShkYXRhKX1cIilcblxuXG5cblx0IyBBdmFpbGFibGUgbWV0aG9kc1xuXG5cdGdldDogICAgKHBhdGgsIGNhbGxiYWNrLCAgICAgICBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIkdFVFwiLCAgICBudWxsLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHB1dDogICAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBVVFwiLCAgICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHBvc3Q6ICAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBPU1RcIiwgICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdHBhdGNoOiAgKHBhdGgsIGRhdGEsIGNhbGxiYWNrLCBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIlBBVENIXCIsICBkYXRhLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cdGRlbGV0ZTogKHBhdGgsIGNhbGxiYWNrLCAgICAgICBwYXJhbWV0ZXJzKSAtPiByZXF1ZXN0KEBwcm9qZWN0SUQsIEBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBcIkRFTEVURVwiLCBudWxsLCBwYXJhbWV0ZXJzLCBAZGVidWcpXG5cblxuXG5cdG9uQ2hhbmdlOiAocGF0aCwgY2FsbGJhY2spIC0+XG5cblxuXHRcdGlmIHBhdGggaXMgXCJjb25uZWN0aW9uXCJcblxuXHRcdFx0dXJsID0gZ2V0Q09SU3VybChAc2VydmVyLCBcIi9cIiwgQHNlY3JldCwgQHByb2plY3RJRClcblx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKVxuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcIm9wZW5cIiwgPT5cblx0XHRcdFx0aWYgY3VycmVudFN0YXR1cyBpcyBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRcdFx0QC5fc3RhdHVzID0gXCJjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdGNhbGxiYWNrKFwiY29ubmVjdGVkXCIpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IENvbm5lY3Rpb24gdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgZXN0YWJsaXNoZWRcIiBpZiBAZGVidWdcblx0XHRcdFx0Y3VycmVudFN0YXR1cyA9IFwiY29ubmVjdGVkXCJcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJlcnJvclwiLCA9PlxuXHRcdFx0XHRpZiBjdXJyZW50U3RhdHVzIGlzIFwiY29ubmVjdGVkXCJcblx0XHRcdFx0XHRALl9zdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cdFx0XHRcdFx0Y2FsbGJhY2soXCJkaXNjb25uZWN0ZWRcIikgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuIFwiRmlyZWJhc2U6IENvbm5lY3Rpb24gdG8gRmlyZWJhc2UgUHJvamVjdCAnI3tAcHJvamVjdElEfScgY2xvc2VkXCIgaWYgQGRlYnVnXG5cdFx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImRpc2Nvbm5lY3RlZFwiXG5cblxuXHRcdGVsc2VcblxuXHRcdFx0dXJsID0gZ2V0Q09SU3VybChAc2VydmVyLCBwYXRoLCBAc2VjcmV0LCBAcHJvamVjdElEKVxuXHRcdFx0c291cmNlID0gbmV3IEV2ZW50U291cmNlKHVybClcblx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IExpc3RlbmluZyB0byBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwicHV0XCIsIChldikgPT5cblx0XHRcdFx0Y2FsbGJhY2soSlNPTi5wYXJzZShldi5kYXRhKS5kYXRhLCBcInB1dFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIEpTT04ucGFyc2UoZXYuZGF0YSkucGF0aC5zcGxpdChcIi9cIikpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZWNlaXZlZCBjaGFuZ2VzIG1hZGUgdG8gJyN7cGF0aH0nIHZpYSAnUFVUJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwicGF0Y2hcIiwgKGV2KSA9PlxuXHRcdFx0XHRjYWxsYmFjayhKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGEsIFwicGF0Y2hcIiwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGguc3BsaXQoXCIvXCIpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVjZWl2ZWQgY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyB2aWEgJ1BBVENIJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG4iLCJfZ2V0SGllcmFyY2h5ID0gKGxheWVyKSAtPlxuICBzdHJpbmcgPSAnJ1xuICBmb3IgYSBpbiBsYXllci5hbmNlc3RvcnMoKVxuICAgIHN0cmluZyA9IGEubmFtZSsnPicrc3RyaW5nXG4gIHJldHVybiBzdHJpbmcgPSBzdHJpbmcrbGF5ZXIubmFtZVxuXG5fbWF0Y2ggPSAoaGllcmFyY2h5LCBzdHJpbmcpIC0+XG4gICMgcHJlcGFyZSByZWdleCB0b2tlbnNcbiAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xccyo+XFxzKi9nLCc+JykgIyBjbGVhbiB1cCBzcGFjZXMgYXJvdW5kIGFycm93c1xuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJyonKS5qb2luKCdbXj5dKicpICMgYXN0ZXJpa3MgYXMgbGF5ZXIgbmFtZSB3aWxkY2FyZFxuICBzdHJpbmcgPSBzdHJpbmcuc3BsaXQoJyAnKS5qb2luKCcoPzouKik+JykgIyBzcGFjZSBhcyBzdHJ1Y3R1cmUgd2lsZGNhcmRcbiAgc3RyaW5nID0gc3RyaW5nLnNwbGl0KCcsJykuam9pbignJHwnKSAjIGFsbG93IG11bHRpcGxlIHNlYXJjaGVzIHVzaW5nIGNvbW1hXG4gIHJlZ2V4U3RyaW5nID0gXCIoXnw+KVwiK3N0cmluZytcIiRcIiAjIGFsd2F5cyBib3R0b20gbGF5ZXIsIG1heWJlIHBhcnQgb2YgaGllcmFyY2h5XG5cbiAgcmVnRXhwID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZykgXG4gIHJldHVybiBoaWVyYXJjaHkubWF0Y2gocmVnRXhwKVxuXG5fZmluZEFsbCA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPlxuICBsYXllcnMgPSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblxuICBpZiBzZWxlY3Rvcj9cbiAgICBzdHJpbmdOZWVkc1JlZ2V4ID0gXy5maW5kIFsnKicsJyAnLCc+JywnLCddLCAoYykgLT4gXy5jb250YWlucyBzZWxlY3RvcixjXG4gICAgdW5sZXNzIHN0cmluZ05lZWRzUmVnZXggb3IgZnJvbUxheWVyXG4gICAgICBsYXllcnMgPSBfLmZpbHRlciBsYXllcnMsIChsYXllcikgLT4gXG4gICAgICAgIGlmIGxheWVyLm5hbWUgaXMgc2VsZWN0b3IgdGhlbiB0cnVlXG4gICAgZWxzZVxuICAgICAgbGF5ZXJzID0gXy5maWx0ZXIgbGF5ZXJzLCAobGF5ZXIpIC0+XG4gICAgICAgICAgaGllcmFyY2h5ID0gX2dldEhpZXJhcmNoeShsYXllcilcbiAgICAgICAgICBpZiBmcm9tTGF5ZXI/XG4gICAgICAgICAgICBfbWF0Y2goaGllcmFyY2h5LCBmcm9tTGF5ZXIubmFtZSsnICcrc2VsZWN0b3IpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgX21hdGNoKGhpZXJhcmNoeSwgc2VsZWN0b3IpXG4gIGVsc2VcbiAgICBsYXllcnNcblxuXG4jIEdsb2JhbFxuZXhwb3J0cy5GaW5kICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpWzBdXG5leHBvcnRzLsaSICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBmcm9tTGF5ZXIpWzBdXG5cbmV4cG9ydHMuRmluZEFsbCA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgZnJvbUxheWVyKVxuZXhwb3J0cy7GksaSICAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIGZyb21MYXllcilcblxuIyBNZXRob2RzXG5MYXllcjo6ZmluZCAgICAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApWzBdXG5MYXllcjo6xpIgICAgICAgID0gKHNlbGVjdG9yLCBmcm9tTGF5ZXIpIC0+IF9maW5kQWxsKHNlbGVjdG9yLCBAKVswXVxuXG5MYXllcjo6ZmluZEFsbCAgPSAoc2VsZWN0b3IsIGZyb21MYXllcikgLT4gX2ZpbmRBbGwoc2VsZWN0b3IsIEApXG5MYXllcjo6xpLGkiAgICAgICA9IChzZWxlY3RvciwgZnJvbUxheWVyKSAtPiBfZmluZEFsbChzZWxlY3RvciwgQCkiLCJjbGFzcyBtb2R1bGUuZXhwb3J0cyBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmJhY2tCdXR0b25OYW1lID89ICdiYWNrQnV0dG9uJ1xuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSlcIiwgdGltZTogLjdcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcImJsYWNrXCJcblx0XHRvcHRpb25zLnNjcm9sbCA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuYXV0b0xpbmsgPz0gdHJ1ZVxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblxuXHRcdEBvbkNoYW5nZSBcInN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgPT5cblx0XHRcdHZpZXcgPSBjaGFuZ2VMaXN0LmFkZGVkWzBdXG5cdFx0XHRpZiB2aWV3P1xuXHRcdFx0XHQjIGRlZmF1bHQgYmVoYXZpb3JzIGZvciB2aWV3c1xuXHRcdFx0XHR2aWV3LmNsaXAgPSB0cnVlXG5cdFx0XHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHRcdFx0IyBhZGQgc2Nyb2xsY29tcG9uZW50XG5cdFx0XHRcdGlmIEBzY3JvbGxcblx0XHRcdFx0XHRjaGlsZHJlbiA9IHZpZXcuY2hpbGRyZW5cblx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0XHRcdFx0XHRuYW1lOiBcInNjcm9sbENvbXBvbmVudFwiXG5cdFx0XHRcdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IEBoZWlnaHRcblx0XHRcdFx0XHRcdHBhcmVudDogdmlld1xuXHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5jb250ZW50LmJhY2tncm91bmRDb2xvciA9IFwiXCJcblx0XHRcdFx0XHRpZiB2aWV3LndpZHRoIDw9IEB3aWR0aFxuXHRcdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50LnNjcm9sbEhvcml6b250YWwgPSBmYWxzZVxuXHRcdFx0XHRcdGlmIHZpZXcuaGVpZ2h0IDw9IEBoZWlnaHRcblx0XHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5zY3JvbGxWZXJ0aWNhbCA9IGZhbHNlXG5cdFx0XHRcdFx0Zm9yIGMgaW4gY2hpbGRyZW5cblx0XHRcdFx0XHRcdGMucGFyZW50ID0gc2Nyb2xsQ29tcG9uZW50LmNvbnRlbnRcblx0XHRcdFx0XHR2aWV3LnNjcm9sbENvbXBvbmVudCA9IHNjcm9sbENvbXBvbmVudCAjIG1ha2UgaXQgYWNjZXNzaWJsZSBhcyBhIHByb3BlcnR5XG5cdFx0XHRcdFx0IyByZXNldCBzaXplIHNpbmNlIGNvbnRlbnQgbW92ZWQgdG8gc2Nyb2xsQ29tcG9uZW50LiBwcmV2ZW50cyBzY3JvbGwgYnVnIHdoZW4gZHJhZ2dpbmcgb3V0c2lkZS5cblx0XHRcdFx0XHR2aWV3LnNpemUgPSB7d2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiBAaGVpZ2h0fVxuXG5cdFx0dHJhbnNpdGlvbnMgPVxuXHRcdFx0c3dpdGNoSW5zdGFudDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHR0bzoge3g6IDAsIHk6IDB9XG5cdFx0XHRmYWRlSW46XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge29wYWNpdHk6IDB9XG5cdFx0XHRcdFx0dG86IHtvcGFjaXR5OiAxfVxuXHRcdFx0em9vbUluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHtzY2FsZTogMC44LCBvcGFjaXR5OiAwfVxuXHRcdFx0XHRcdHRvOiB7c2NhbGU6IDEsIG9wYWNpdHk6IDF9XG5cdFx0XHR6b29tT3V0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7c2NhbGU6IDAuOCwgb3BhY2l0eTogMH1cblx0XHRcdHNsaWRlSW5VcDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eTogQGhlaWdodH1cblx0XHRcdFx0XHR0bzoge3k6IDB9XG5cdFx0XHRzbGlkZUluUmlnaHQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IEB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRzbGlkZUluRG93bjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WTogMH1cblx0XHRcdFx0XHR0bzoge3k6IDB9XG5cdFx0XHRtb3ZlSW5SaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IEB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRtb3ZlSW5MZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHttYXhYOiAwfVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHNsaWRlSW5MZWZ0OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHttYXhYOiAwfVxuXHRcdFx0XHRcdHRvOiB7bWF4WDogQHdpZHRofVxuXHRcdFx0cHVzaEluUmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiAtKEB3aWR0aC81KSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IEB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRwdXNoSW5MZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRoLzUsIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiAtQHdpZHRofVxuXHRcdFx0XHRcdHRvOiB7eDogMH1cblx0XHRcdHB1c2hPdXRSaWdodDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogLShAd2lkdGgvNSksIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRcdHRvOiB7eDogMCwgYnJpZ2h0bmVzczogMTAwfVxuXHRcdFx0cHVzaE91dExlZnQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGgvNSwgYnJpZ2h0bmVzczogNzB9XG5cdFx0XHRcdFx0dG86IHt4OiAwLCBicmlnaHRuZXNzOiAxMDB9XG5cdFx0XHRzbGlkZU91dFVwOlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WTogMH1cblx0XHRcdHNsaWRlT3V0UmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRzbGlkZU91dERvd246XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt5OiBAaGVpZ2h0fVxuXHRcdFx0c2xpZGVPdXRMZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblxuXHRcdCMgc2hvcnRjdXRzXG5cdFx0dHJhbnNpdGlvbnMuc2xpZGVJbiA9IHRyYW5zaXRpb25zLnNsaWRlSW5SaWdodFxuXHRcdHRyYW5zaXRpb25zLnNsaWRlT3V0ID0gdHJhbnNpdGlvbnMuc2xpZGVPdXRSaWdodFxuXHRcdHRyYW5zaXRpb25zLnB1c2hJbiA9IHRyYW5zaXRpb25zLnB1c2hJblJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMucHVzaE91dCA9IHRyYW5zaXRpb25zLnB1c2hPdXRSaWdodFxuXG5cdFx0IyBldmVudHNcblx0XHRFdmVudHMuVmlld1dpbGxTd2l0Y2ggPSBcInZpZXdXaWxsU3dpdGNoXCJcblx0XHRFdmVudHMuVmlld0RpZFN3aXRjaCA9IFwidmlld0RpZFN3aXRjaFwiXG5cdFx0TGF5ZXI6Om9uVmlld1dpbGxTd2l0Y2ggPSAoY2IpIC0+IEBvbihFdmVudHMuVmlld1dpbGxTd2l0Y2gsIGNiKVxuXHRcdExheWVyOjpvblZpZXdEaWRTd2l0Y2ggPSAoY2IpIC0+IEBvbihFdmVudHMuVmlld0RpZFN3aXRjaCwgY2IpXHRcdFxuXG5cdFx0Xy5lYWNoIHRyYW5zaXRpb25zLCAoYW5pbVByb3BzLCBuYW1lKSA9PlxuXG5cdFx0XHRpZiBvcHRpb25zLmF1dG9MaW5rXG5cdFx0XHRcdGxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXHRcdFx0XHRmb3IgYnRuIGluIGxheWVyc1xuXHRcdFx0XHRcdGlmIF8uY29udGFpbnMgYnRuLm5hbWUsIG5hbWVcblx0XHRcdFx0XHRcdHZpZXdDb250cm9sbGVyID0gQFxuXHRcdFx0XHRcdFx0YnRuLm9uQ2xpY2sgLT5cblx0XHRcdFx0XHRcdFx0YW5pbSA9IEBuYW1lLnNwbGl0KCdfJylbMF1cblx0XHRcdFx0XHRcdFx0bGlua05hbWUgPSBAbmFtZS5yZXBsYWNlKGFuaW0rJ18nLCcnKVxuXHRcdFx0XHRcdFx0XHRsaW5rTmFtZSA9IGxpbmtOYW1lLnJlcGxhY2UoL1xcZCsvZywgJycpICMgcmVtb3ZlIG51bWJlcnNcblx0XHRcdFx0XHRcdFx0dmlld0NvbnRyb2xsZXJbYW5pbV0gXy5maW5kKGxheWVycywgKGwpIC0+IGwubmFtZSBpcyBsaW5rTmFtZSlcblxuXHRcdFx0QFtuYW1lXSA9IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpID0+XG5cblx0XHRcdFx0cmV0dXJuIGlmIG5ld1ZpZXcgaXMgQGN1cnJlbnRWaWV3XG5cblx0XHRcdFx0IyBtYWtlIHN1cmUgdGhlIG5ldyBsYXllciBpcyBpbnNpZGUgdGhlIHZpZXdjb250cm9sbGVyXG5cdFx0XHRcdG5ld1ZpZXcucGFyZW50ID0gQFxuXHRcdFx0XHRuZXdWaWV3LnNlbmRUb0JhY2soKVxuXG5cdFx0XHRcdCMgcmVzZXQgcHJvcHMgaW4gY2FzZSB0aGV5IHdlcmUgY2hhbmdlZCBieSBhIHByZXYgYW5pbWF0aW9uXG5cdFx0XHRcdG5ld1ZpZXcucG9pbnQgPSB7eDowLCB5OiAwfVxuXHRcdFx0XHRuZXdWaWV3Lm9wYWNpdHkgPSAxXG5cdFx0XHRcdG5ld1ZpZXcuc2NhbGUgPSAxXG5cdFx0XHRcdG5ld1ZpZXcuYnJpZ2h0bmVzcyA9IDEwMFxuXG5cdFx0XHRcdCMgb2xkVmlld1xuXHRcdFx0XHRAY3VycmVudFZpZXc/LnBvaW50ID0ge3g6IDAsIHk6IDB9ICMgZml4ZXMgb2Zmc2V0IGlzc3VlIHdoZW4gbW92aW5nIHRvbyBmYXN0IGJldHdlZW4gc2NyZWVuc1xuXHRcdFx0XHRAY3VycmVudFZpZXc/LnByb3BzID0gYW5pbVByb3BzLm9sZFZpZXc/LmZyb21cblx0XHRcdFx0b3V0Z29pbmcgPSBAY3VycmVudFZpZXc/LmFuaW1hdGUgXy5leHRlbmQgYW5pbWF0aW9uT3B0aW9ucywge3Byb3BlcnRpZXM6IGFuaW1Qcm9wcy5vbGRWaWV3Py50b31cblxuXHRcdFx0XHQjIG5ld1ZpZXdcblx0XHRcdFx0bmV3Vmlldy5wcm9wcyA9IGFuaW1Qcm9wcy5uZXdWaWV3Py5mcm9tXG5cdFx0XHRcdGluY29taW5nID0gbmV3Vmlldy5hbmltYXRlIF8uZXh0ZW5kIGFuaW1hdGlvbk9wdGlvbnMsIHtwcm9wZXJ0aWVzOiBhbmltUHJvcHMubmV3Vmlldz8udG99XG5cdFx0XHRcdFxuXHRcdFx0XHQjIGxheWVyIG9yZGVyXG5cdFx0XHRcdGlmIF8uY29udGFpbnMgbmFtZSwgJ091dCdcblx0XHRcdFx0XHRuZXdWaWV3LnBsYWNlQmVoaW5kKEBjdXJyZW50Vmlldylcblx0XHRcdFx0XHRvdXRnb2luZy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudFZpZXcuYnJpbmdUb0Zyb250KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5ld1ZpZXcucGxhY2VCZWZvcmUoQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmlld1dpbGxTd2l0Y2gsIEBjdXJyZW50VmlldywgbmV3Vmlldylcblx0XHRcdFx0XG5cdFx0XHRcdCMgY2hhbmdlIEN1cnJlbnRWaWV3IGJlZm9yZSBhbmltYXRpb24gaGFzIGZpbmlzaGVkIHNvIG9uZSBjb3VsZCBnbyBiYWNrIGluIGhpc3Rvcnlcblx0XHRcdFx0IyB3aXRob3V0IGhhdmluZyB0byB3YWl0IGZvciB0aGUgdHJhbnNpdGlvbiB0byBmaW5pc2hcblx0XHRcdFx0QHNhdmVDdXJyZW50Vmlld1RvSGlzdG9yeSBuYW1lLCBvdXRnb2luZywgaW5jb21pbmdcblx0XHRcdFx0QGN1cnJlbnRWaWV3ID0gbmV3Vmlld1xuXHRcdFx0XHRAZW1pdChcImNoYW5nZTpwcmV2aW91c1ZpZXdcIiwgQHByZXZpb3VzVmlldylcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6Y3VycmVudFZpZXdcIiwgQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcblx0XHRcdFx0aW5jb21pbmcub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gXG5cdFx0XHRcdFx0QGVtaXQoRXZlbnRzLlZpZXdEaWRTd2l0Y2gsIEBwcmV2aW91c1ZpZXcsIEBjdXJyZW50Vmlldylcblx0XHRcdFx0XG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3TmFtZT9cblx0XHRcdGF1dG9Jbml0aWFsID0gXy5maW5kIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgKGwpIC0+IGwubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0aWYgYXV0b0luaXRpYWw/IHRoZW4gQHN3aXRjaEluc3RhbnQgYXV0b0luaXRpYWxcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXc/XG5cdFx0XHRAc3dpdGNoSW5zdGFudCBvcHRpb25zLmluaXRpYWxWaWV3XG5cblx0XHRpZiBvcHRpb25zLmJhY2tCdXR0b25OYW1lP1xuXHRcdFx0YmFja0J1dHRvbnMgPSBfLmZpbHRlciBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIChsKSAtPiBfLmNvbnRhaW5zIGwubmFtZSwgb3B0aW9ucy5iYWNrQnV0dG9uTmFtZVxuXHRcdFx0Zm9yIGJ0biBpbiBiYWNrQnV0dG9uc1xuXHRcdFx0XHRidG4ub25DbGljayA9PiBAYmFjaygpXG5cblx0QGRlZmluZSBcInByZXZpb3VzVmlld1wiLFxuXHRcdFx0Z2V0OiAtPiBAaGlzdG9yeVswXS52aWV3XG5cblx0c2F2ZUN1cnJlbnRWaWV3VG9IaXN0b3J5OiAobmFtZSxvdXRnb2luZ0FuaW1hdGlvbixpbmNvbWluZ0FuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFZpZXdcblx0XHRcdGFuaW1hdGlvbk5hbWU6IG5hbWVcblx0XHRcdGluY29taW5nQW5pbWF0aW9uOiBpbmNvbWluZ0FuaW1hdGlvblxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb246IG91dGdvaW5nQW5pbWF0aW9uXG5cblx0YmFjazogLT5cblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0aWYgXy5jb250YWlucyBwcmV2aW91cy5hbmltYXRpb25OYW1lLCAnT3V0J1xuXHRcdFx0XHRwcmV2aW91cy52aWV3LmJyaW5nVG9Gcm9udCgpXG5cblx0XHRcdGJhY2tJbiA9IHByZXZpb3VzLm91dGdvaW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRiYWNrSW4uc3RhcnQoKVxuXHRcdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHRcdEBjdXJyZW50VmlldyA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdG1vdmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnRWaWV3LmJyaW5nVG9Gcm9udCgpXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUlBQTtBREFBLElBQUE7OztBQUFNLE1BQU0sQ0FBQzs7O0VBRUMsaUJBQUMsT0FBRDtBQUNaLFFBQUE7O01BRGEsVUFBUTs7O01BQ3JCLE9BQU8sQ0FBQyxRQUFTLE1BQU0sQ0FBQzs7O01BQ3hCLE9BQU8sQ0FBQyxTQUFVLE1BQU0sQ0FBQzs7O01BQ3pCLE9BQU8sQ0FBQyxPQUFROzs7TUFDaEIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxpQkFBa0I7OztNQUMxQixPQUFPLENBQUMsbUJBQW9CO1FBQUEsS0FBQSxFQUFPLGdDQUFQO1FBQXlDLElBQUEsRUFBTSxFQUEvQzs7OztNQUM1QixPQUFPLENBQUMsa0JBQW1COzs7TUFDM0IsT0FBTyxDQUFDLFNBQVU7OztNQUNsQixPQUFPLENBQUMsV0FBWTs7SUFFcEIseUNBQU0sT0FBTjtJQUNBLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFFWCxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQVYsRUFBdUIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFVBQUQ7QUFDdEIsWUFBQTtRQUFBLElBQUEsR0FBTyxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUE7UUFDeEIsSUFBRyxZQUFIO1VBRUMsSUFBSSxDQUFDLElBQUwsR0FBWTtVQUNaLElBQUksQ0FBQyxFQUFMLENBQVEsTUFBTSxDQUFDLEtBQWYsRUFBc0IsU0FBQSxHQUFBLENBQXRCO1VBRUEsSUFBRyxLQUFDLENBQUEsTUFBSjtZQUND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
