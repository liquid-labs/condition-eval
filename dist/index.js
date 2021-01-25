'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

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

var createClass = _createClass;

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

var defineProperty = _defineProperty;

var _temp;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var paramRe = new RegExp('(^|[ (!&=|+-])([A-Z_][A-Z0-9_]+)', 'g');
var safeEvalRe = new RegExp('^ *(\\(|[0-9]+|false|true|!)(( |\\()+([0-9]+|true|false|!|&&|[|]{2}|==|!=|\\+|-|%|\\*)( |\\)*))* *$');
/**
* A safe-ish (TODO: developed based on a Stackexchange post; find and link?) boolean expression evaluator.
*/

var Evaluator = (_temp = /*#__PURE__*/function () {
  // declare recognized internal parameters

  /**
  * Recogrizes 'parameters' and 'zeroRes' field.
  *
  * 'parameters' maps strings to values. E.g.: parameters `{ "IS_CONTRACTOR": 1 }` would cause the condition
  * `IS_CONTRACTOR` to evaluate true.
  *
  * 'zeroRes' is an array of RegExps used to match against a condition string *after* resolving all the parameters. If a
  *    match is made, then that value is set to zero. I.e., `zeroRes` determines which parameters are default zero.
  */
  function Evaluator(settings) {
    classCallCheck(this, Evaluator);

    defineProperty(this, "parameters", void 0);

    defineProperty(this, "zeroRes", void 0);

    Object.assign(this, settings);
    this.parameters = this.parameters || {};
    this.zeroRes = this.zeroRes || [];
  }

  createClass(Evaluator, [{
    key: "evalTruth",
    value: function evalTruth(origExpression) {
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
          result = _step.value;
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
          var result;

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


      return Function("\"use strict\";return (".concat(expression, ") ? true : false"))(); // eslint-disable-line no-new-func
    }
  }]);

  return Evaluator;
}(), _temp);

exports.Evaluator = Evaluator;
//# sourceMappingURL=index.js.map
