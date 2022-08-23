function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _classCallCheck = unwrapExports(classCallCheck);

var createClass = createCommonjsModule(function (module) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _createClass = unwrapExports(createClass);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _defineProperty = unwrapExports(defineProperty);

var booleans = {
  YES: 1,
  NO: 0,
  ALWAYS: 1,
  NEVER: 0,
  TRUE: 1,
  FALSE: 0
};
var severities = {
  NONE: 0,
  LOW: 1,
  MINOR: 1,
  TRIVIAL: 1,
  MODERATE: 2,
  HIGH: 3,
  SEVERE: 3,
  CRITICAL: 4,
  EXISTENTIAL: 4
};

var _eval;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
var paramRe = /(^|[ (!&=|+-])([A-Z_][A-Z0-9_]*)/g; // start with: (, number, bool, or unary op !
// at least on space or param
// then maybe 0+ safe stuff
// Note that this RE relies on the intentional spacing
// TODO: we could lock down further by requring expressions on eithre side of dual operators

var safeEvalRe = /^ *(\(|[0-9]+|false|true|!)(( |\()+([0-9]+|true|false|!|&&|[|]{2}|==|!=|\+|-|%|\*|<|>|<=|>=)( |\)*))* *$/;
/**
* A safe-ish (TODO: developed based on a Stackexchange post; find and link?) boolean expression evaluator.
*/

var Evaluator = (_eval = /*#__PURE__*/new WeakSet(), /*#__PURE__*/function () {
  // declare recognized internal parameters

  /**
  * Recogrizes 'parameters' and 'zeroRes' field.
  *
  * - `parameters`: (opt) maps strings to values. E.g.: parameters `{ "IS_CONTRACTOR": 1 }` would cause the condition
  *    `IS_CONTRACTOR` to evaluate true.
  *  - `zeroRes`: (opt) is an array of RegExps used to match against a condition string *after* resolving all the
  *    parameters. If a match is made, then that value is set to zero. I.e., `zeroRes` determines which parameters are
  *    default zero.
  * - `excludeBooleans`: (opt, def: `false`) if `true`, then does not load standard boolean mappings for `TRUE`/
  *   `FALSE`, `YES`/`NO`, `ALWAYS`/`NEVER`
  * - `excludeSeverities`: (opt, def: `false`) if `true`, then does not load standard severity mappyngs on a 0-4
  *   scale: `NONE` (0), `LOW`/`MINOR`\`TRIVIAL` (1), `MODERATE` (2), `HIGH`/`SEVERE` (3), and `CRITICAL`/`EXISTENTIAL`
  *   (4).
  */
  function Evaluator() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        parameters = _ref.parameters,
        zeroRes = _ref.zeroRes,
        _ref$excludeBooleans = _ref.excludeBooleans,
        excludeBooleans = _ref$excludeBooleans === void 0 ? false : _ref$excludeBooleans,
        _ref$excludeSeveritie = _ref.excludeSeverities,
        excludeSeverities = _ref$excludeSeveritie === void 0 ? false : _ref$excludeSeveritie,
        _ref$excludeStandards = _ref.excludeStandards,
        excludeStandards = _ref$excludeStandards === void 0 ? false : _ref$excludeStandards;

    _classCallCheck(this, Evaluator);

    _eval.add(this);

    _defineProperty(this, "parameters", void 0);

    _defineProperty(this, "zeroRes", void 0);

    this.parameters = Object.assign({}, parameters, excludeBooleans === true || excludeStandards === true ? null : booleans, excludeSeverities === true || excludeStandards === true ? null : severities);
    this.zeroRes = zeroRes || [];
  }

  _createClass(Evaluator, [{
    key: "evalTruth",
    value: function evalTruth(origExpression) {
      return _classPrivateMethodGet(this, _eval, _eval2).call(this, origExpression, function (expression) {
        return "\"use strict\";return (".concat(expression, ") ? true : false");
      });
    }
  }, {
    key: "evalNumber",
    value: function evalNumber(origExpression) {
      return _classPrivateMethodGet(this, _eval, _eval2).call(this, origExpression, function (expression) {
        return "\"use strict\";return (".concat(expression, ") + 0");
      });
    }
  }]);

  return Evaluator;
}());

function _eval2(origExpression, funcFunc) {
  var _this = this;

  if (typeof origExpression !== 'string') {
    throw new Error("Expression must be a string. Got: '".concat(origExpression, "'."));
  }

  var expression = origExpression; // save original expression in case we need to reflect to user on error
  // replace all the parameters in the expression

  var results = expression.matchAll(paramRe);

  var _iterator = _createForOfIteratorHelper(results),
      _step;

  try {
    var _loop = function _loop() {
      var result = _step.value;
      var param = result[2];
      var val = _this.parameters[param]; // look on the parameter object

      if (val === undefined) {
        // if not defined, look on process.env
        val = process.env[param];
      }

      if (val === undefined) {
        if (_this.zeroRes.some(function (re) {
          return param.match(re);
        })) {
          val = 0;
        } else {
          throw new Error("Condition parameter '".concat(param, "' is not defined. Update settings and/or check expression."));
        }
      } // 'replaceAll' not supported on node (TODO: add Babel tform); though 'replace' does replace all *if* first arg is
      // RE... so... maybe not necessary?)


      expression = expression.replace(new RegExp("(^|[^A-Z0-9_])".concat(param, "([^A-Z0-9_]|$)"), 'g'), "$1 ".concat(val, " $2"));
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    } // check that everything is save

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (!expression.match(safeEvalRe)) {
    throw new Error("Invalid expression does not fully resolve or has unsafe code: ".concat(origExpression, " => ").concat(expression));
  } // else, let's eval it


  return Function(funcFunc(expression))(); // eslint-disable-line no-new-func
}

export { Evaluator };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL2pzL2NvbnN0YW50cy5tanMiLCIuLi9qcy9FdmFsdWF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY2xhc3NDYWxsQ2hlY2s7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jcmVhdGVDbGFzcztcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiY29uc3QgYm9vbGVhbnMgPSB7XG4gIFlFUyAgICA6IDEsXG4gIE5PICAgICA6IDAsXG4gIEFMV0FZUyA6IDEsXG4gIE5FVkVSICA6IDAsXG4gIFRSVUUgICA6IDEsXG4gIEZBTFNFICA6IDBcbn1cblxuY29uc3Qgc2V2ZXJpdGllcyA9IHtcbiAgTk9ORSAgICAgICAgOiAwLFxuICBMT1cgICAgICAgICA6IDEsXG4gIE1JTk9SICAgICAgIDogMSxcbiAgVFJJVklBTCAgICAgOiAxLFxuICBNT0RFUkFURSAgICA6IDIsXG4gIEhJR0ggICAgICAgIDogMyxcbiAgU0VWRVJFICAgICAgOiAzLFxuICBDUklUSUNBTCAgICA6IDQsXG4gIEVYSVNURU5USUFMIDogNFxufVxuXG5leHBvcnQge1xuICBib29sZWFucyxcbiAgc2V2ZXJpdGllc1xufVxuIiwiaW1wb3J0IHsgYm9vbGVhbnMsIHNldmVyaXRpZXMgfSBmcm9tICcuL2NvbnN0YW50cydcblxuY29uc3QgcGFyYW1SZSA9IC8oXnxbICghJj18Ky1dKShbQS1aX11bQS1aMC05X10qKS9nXG4vLyBzdGFydCB3aXRoOiAoLCBudW1iZXIsIGJvb2wsIG9yIHVuYXJ5IG9wICFcbi8vIGF0IGxlYXN0IG9uIHNwYWNlIG9yIHBhcmFtXG4vLyB0aGVuIG1heWJlIDArIHNhZmUgc3R1ZmZcbi8vIE5vdGUgdGhhdCB0aGlzIFJFIHJlbGllcyBvbiB0aGUgaW50ZW50aW9uYWwgc3BhY2luZ1xuLy8gVE9ETzogd2UgY291bGQgbG9jayBkb3duIGZ1cnRoZXIgYnkgcmVxdXJpbmcgZXhwcmVzc2lvbnMgb24gZWl0aHJlIHNpZGUgb2YgZHVhbCBvcGVyYXRvcnNcbmNvbnN0IHNhZmVFdmFsUmUgPVxuICAvXiAqKFxcKHxbMC05XSt8ZmFsc2V8dHJ1ZXwhKSgoIHxcXCgpKyhbMC05XSt8dHJ1ZXxmYWxzZXwhfCYmfFt8XXsyfXw9PXwhPXxcXCt8LXwlfFxcKnw8fD58PD18Pj0pKCB8XFwpKikpKiAqJC9cblxuLyoqXG4qIEEgc2FmZS1pc2ggKFRPRE86IGRldmVsb3BlZCBiYXNlZCBvbiBhIFN0YWNrZXhjaGFuZ2UgcG9zdDsgZmluZCBhbmQgbGluaz8pIGJvb2xlYW4gZXhwcmVzc2lvbiBldmFsdWF0b3IuXG4qL1xuY29uc3QgRXZhbHVhdG9yID0gY2xhc3Mge1xuICAvLyBkZWNsYXJlIHJlY29nbml6ZWQgaW50ZXJuYWwgcGFyYW1ldGVyc1xuICBwYXJhbWV0ZXJzXG4gIHplcm9SZXNcblxuICAvKipcbiAgKiBSZWNvZ3JpemVzICdwYXJhbWV0ZXJzJyBhbmQgJ3plcm9SZXMnIGZpZWxkLlxuICAqXG4gICogLSBgcGFyYW1ldGVyc2A6IChvcHQpIG1hcHMgc3RyaW5ncyB0byB2YWx1ZXMuIEUuZy46IHBhcmFtZXRlcnMgYHsgXCJJU19DT05UUkFDVE9SXCI6IDEgfWAgd291bGQgY2F1c2UgdGhlIGNvbmRpdGlvblxuICAqICAgIGBJU19DT05UUkFDVE9SYCB0byBldmFsdWF0ZSB0cnVlLlxuICAqICAtIGB6ZXJvUmVzYDogKG9wdCkgaXMgYW4gYXJyYXkgb2YgUmVnRXhwcyB1c2VkIHRvIG1hdGNoIGFnYWluc3QgYSBjb25kaXRpb24gc3RyaW5nICphZnRlciogcmVzb2x2aW5nIGFsbCB0aGVcbiAgKiAgICBwYXJhbWV0ZXJzLiBJZiBhIG1hdGNoIGlzIG1hZGUsIHRoZW4gdGhhdCB2YWx1ZSBpcyBzZXQgdG8gemVyby4gSS5lLiwgYHplcm9SZXNgIGRldGVybWluZXMgd2hpY2ggcGFyYW1ldGVycyBhcmVcbiAgKiAgICBkZWZhdWx0IHplcm8uXG4gICogLSBgZXhjbHVkZUJvb2xlYW5zYDogKG9wdCwgZGVmOiBgZmFsc2VgKSBpZiBgdHJ1ZWAsIHRoZW4gZG9lcyBub3QgbG9hZCBzdGFuZGFyZCBib29sZWFuIG1hcHBpbmdzIGZvciBgVFJVRWAvXG4gICogICBgRkFMU0VgLCBgWUVTYC9gTk9gLCBgQUxXQVlTYC9gTkVWRVJgXG4gICogLSBgZXhjbHVkZVNldmVyaXRpZXNgOiAob3B0LCBkZWY6IGBmYWxzZWApIGlmIGB0cnVlYCwgdGhlbiBkb2VzIG5vdCBsb2FkIHN0YW5kYXJkIHNldmVyaXR5IG1hcHB5bmdzIG9uIGEgMC00XG4gICogICBzY2FsZTogYE5PTkVgICgwKSwgYExPV2AvYE1JTk9SYFxcYFRSSVZJQUxgICgxKSwgYE1PREVSQVRFYCAoMiksIGBISUdIYC9gU0VWRVJFYCAoMyksIGFuZCBgQ1JJVElDQUxgL2BFWElTVEVOVElBTGBcbiAgKiAgICg0KS5cbiAgKi9cbiAgY29uc3RydWN0b3Ioe1xuICAgICAgcGFyYW1ldGVycyxcbiAgICAgIHplcm9SZXMsXG4gICAgICBleGNsdWRlQm9vbGVhbnMgPSBmYWxzZSxcbiAgICAgIGV4Y2x1ZGVTZXZlcml0aWVzID0gZmFsc2UsXG4gICAgICBleGNsdWRlU3RhbmRhcmRzID0gZmFsc2UgfSA9IHt9XG4gICkge1xuICAgIHRoaXMucGFyYW1ldGVycyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHBhcmFtZXRlcnMsXG4gICAgICBleGNsdWRlQm9vbGVhbnMgPT09IHRydWUgfHwgZXhjbHVkZVN0YW5kYXJkcyA9PT0gdHJ1ZSA/IG51bGwgOiBib29sZWFucyxcbiAgICAgIGV4Y2x1ZGVTZXZlcml0aWVzID09PSB0cnVlIHx8IGV4Y2x1ZGVTdGFuZGFyZHMgPT09IHRydWUgPyBudWxsIDogc2V2ZXJpdGllc1xuICAgIClcbiAgICB0aGlzLnplcm9SZXMgPSB6ZXJvUmVzIHx8IFtdXG4gIH1cblxuICAjZXZhbChvcmlnRXhwcmVzc2lvbiwgZnVuY0Z1bmMpIHtcbiAgICBpZiAodHlwZW9mIG9yaWdFeHByZXNzaW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHByZXNzaW9uIG11c3QgYmUgYSBzdHJpbmcuIEdvdDogJyR7b3JpZ0V4cHJlc3Npb259Jy5gKVxuICAgIH1cblxuICAgIGxldCBleHByZXNzaW9uID0gb3JpZ0V4cHJlc3Npb24gLy8gc2F2ZSBvcmlnaW5hbCBleHByZXNzaW9uIGluIGNhc2Ugd2UgbmVlZCB0byByZWZsZWN0IHRvIHVzZXIgb24gZXJyb3JcblxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSBwYXJhbWV0ZXJzIGluIHRoZSBleHByZXNzaW9uXG4gICAgY29uc3QgcmVzdWx0cyA9IGV4cHJlc3Npb24ubWF0Y2hBbGwocGFyYW1SZSlcbiAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHJlc3VsdFsyXVxuICAgICAgbGV0IHZhbCA9IHRoaXMucGFyYW1ldGVyc1twYXJhbV0gLy8gbG9vayBvbiB0aGUgcGFyYW1ldGVyIG9iamVjdFxuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7IC8vIGlmIG5vdCBkZWZpbmVkLCBsb29rIG9uIHByb2Nlc3MuZW52XG4gICAgICAgIHZhbCA9IHByb2Nlc3MuZW52W3BhcmFtXVxuICAgICAgfVxuICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0aGlzLnplcm9SZXMuc29tZSgocmUpID0+IHBhcmFtLm1hdGNoKHJlKSkpIHtcbiAgICAgICAgICB2YWwgPSAwXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb25kaXRpb24gcGFyYW1ldGVyICcke3BhcmFtfScgaXMgbm90IGRlZmluZWQuIFVwZGF0ZSBzZXR0aW5ncyBhbmQvb3IgY2hlY2sgZXhwcmVzc2lvbi5gKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICdyZXBsYWNlQWxsJyBub3Qgc3VwcG9ydGVkIG9uIG5vZGUgKFRPRE86IGFkZCBCYWJlbCB0Zm9ybSk7IHRob3VnaCAncmVwbGFjZScgZG9lcyByZXBsYWNlIGFsbCAqaWYqIGZpcnN0IGFyZyBpc1xuICAgICAgLy8gUkUuLi4gc28uLi4gbWF5YmUgbm90IG5lY2Vzc2FyeT8pXG4gICAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKG5ldyBSZWdFeHAoYChefFteQS1aMC05X10pJHtwYXJhbX0oW15BLVowLTlfXXwkKWAsICdnJyksIGAkMSAke3ZhbH0gJDJgKVxuICAgIH1cblxuICAgIC8vIGNoZWNrIHRoYXQgZXZlcnl0aGluZyBpcyBzYXZlXG4gICAgaWYgKCFleHByZXNzaW9uLm1hdGNoKHNhZmVFdmFsUmUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZXhwcmVzc2lvbiBkb2VzIG5vdCBmdWxseSByZXNvbHZlIG9yIGhhcyB1bnNhZmUgY29kZTogJHtvcmlnRXhwcmVzc2lvbn0gPT4gJHtleHByZXNzaW9ufWApXG4gICAgfVxuICAgIC8vIGVsc2UsIGxldCdzIGV2YWwgaXRcbiAgICByZXR1cm4gRnVuY3Rpb24oZnVuY0Z1bmMoZXhwcmVzc2lvbikpKCkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xuICB9XG4gIFxuICBldmFsVHJ1dGgob3JpZ0V4cHJlc3Npb24pIHtcbiAgICByZXR1cm4gdGhpcy4jZXZhbChvcmlnRXhwcmVzc2lvbiwgKGV4cHJlc3Npb24pID0+IGBcInVzZSBzdHJpY3RcIjtyZXR1cm4gKCR7ZXhwcmVzc2lvbn0pID8gdHJ1ZSA6IGZhbHNlYClcbiAgfVxuICBcbiAgZXZhbE51bWJlcihvcmlnRXhwcmVzc2lvbikge1xuICAgIHJldHVybiB0aGlzLiNldmFsKG9yaWdFeHByZXNzaW9uLCAoZXhwcmVzc2lvbikgPT4gYFwidXNlIHN0cmljdFwiO3JldHVybiAoJHtleHByZXNzaW9ufSkgKyAwYClcbiAgfVxufVxuXG5leHBvcnQgeyBFdmFsdWF0b3IgfVxuIl0sIm5hbWVzIjpbImJvb2xlYW5zIiwiWUVTIiwiTk8iLCJBTFdBWVMiLCJORVZFUiIsIlRSVUUiLCJGQUxTRSIsInNldmVyaXRpZXMiLCJOT05FIiwiTE9XIiwiTUlOT1IiLCJUUklWSUFMIiwiTU9ERVJBVEUiLCJISUdIIiwiU0VWRVJFIiwiQ1JJVElDQUwiLCJFWElTVEVOVElBTCIsInBhcmFtUmUiLCJzYWZlRXZhbFJlIiwiRXZhbHVhdG9yIiwicGFyYW1ldGVycyIsInplcm9SZXMiLCJleGNsdWRlQm9vbGVhbnMiLCJleGNsdWRlU2V2ZXJpdGllcyIsImV4Y2x1ZGVTdGFuZGFyZHMiLCJPYmplY3QiLCJhc3NpZ24iLCJvcmlnRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJmdW5jRnVuYyIsIkVycm9yIiwicmVzdWx0cyIsIm1hdGNoQWxsIiwicmVzdWx0IiwicGFyYW0iLCJ2YWwiLCJ1bmRlZmluZWQiLCJwcm9jZXNzIiwiZW52Iiwic29tZSIsInJlIiwibWF0Y2giLCJyZXBsYWNlIiwiUmVnRXhwIiwiRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7QUFDaEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQyxFQUFFO0FBQzFDLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQzdELEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsR0FBRyxJQUFJOzs7Ozs7QUNQNUUsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFDLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsSUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQzNELElBQUksVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDMUQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzlELEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUM1RCxFQUFFLElBQUksVUFBVSxF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
