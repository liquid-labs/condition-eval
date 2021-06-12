'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var paramRe = /(^|[ (!&=|+-])([A-Z_][A-Z0-9_]*)/g; // start with: (, number, bool, or unary op !
// at least on space or param
// then maybe 0+ safe stuff
// Note that this RE relies on the intentional spacing
// TODO: we could lock down further by requring expressions on eithre side of dual operators

var safeEvalRe = /^ *(\(|[0-9]+|false|true|!)(( |\()+([0-9]+|true|false|!|&&|[|]{2}|==|!=|\+|-|%|\*|<|>|<=|>=)( |\)*))* *$/;
/**
* A safe-ish (TODO: developed based on a Stackexchange post; find and link?) boolean expression evaluator.
*/

var Evaluator = /*#__PURE__*/function () {
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
    _classCallCheck(this, Evaluator);

    _defineProperty(this, "parameters", void 0);

    _defineProperty(this, "zeroRes", void 0);

    Object.assign(this, settings);
    this.parameters = this.parameters || {};
    this.zeroRes = this.zeroRes || [];
  }

  _createClass(Evaluator, [{
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


      return Function("\"use strict\";return (".concat(expression, ") ? true : false"))(); // eslint-disable-line no-new-func
    }
  }]);

  return Evaluator;
}();

exports.Evaluator = Evaluator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL2pzL0V2YWx1YXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjaztcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NyZWF0ZUNsYXNzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9kZWZpbmVQcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJjb25zdCBwYXJhbVJlID0gLyhefFsgKCEmPXwrLV0pKFtBLVpfXVtBLVowLTlfXSopL2dcbi8vIHN0YXJ0IHdpdGg6ICgsIG51bWJlciwgYm9vbCwgb3IgdW5hcnkgb3AgIVxuLy8gYXQgbGVhc3Qgb24gc3BhY2Ugb3IgcGFyYW1cbi8vIHRoZW4gbWF5YmUgMCsgc2FmZSBzdHVmZlxuLy8gTm90ZSB0aGF0IHRoaXMgUkUgcmVsaWVzIG9uIHRoZSBpbnRlbnRpb25hbCBzcGFjaW5nXG4vLyBUT0RPOiB3ZSBjb3VsZCBsb2NrIGRvd24gZnVydGhlciBieSByZXF1cmluZyBleHByZXNzaW9ucyBvbiBlaXRocmUgc2lkZSBvZiBkdWFsIG9wZXJhdG9yc1xuY29uc3Qgc2FmZUV2YWxSZSA9XG4gIC9eICooXFwofFswLTldK3xmYWxzZXx0cnVlfCEpKCggfFxcKCkrKFswLTldK3x0cnVlfGZhbHNlfCF8JiZ8W3xdezJ9fD09fCE9fFxcK3wtfCV8XFwqfDx8Pnw8PXw+PSkoIHxcXCkqKSkqICokL1xuXG4vKipcbiogQSBzYWZlLWlzaCAoVE9ETzogZGV2ZWxvcGVkIGJhc2VkIG9uIGEgU3RhY2tleGNoYW5nZSBwb3N0OyBmaW5kIGFuZCBsaW5rPykgYm9vbGVhbiBleHByZXNzaW9uIGV2YWx1YXRvci5cbiovXG5jb25zdCBFdmFsdWF0b3IgPSBjbGFzcyB7XG4gIC8vIGRlY2xhcmUgcmVjb2duaXplZCBpbnRlcm5hbCBwYXJhbWV0ZXJzXG4gIHBhcmFtZXRlcnNcbiAgemVyb1Jlc1xuXG4gIC8qKlxuICAqIFJlY29ncml6ZXMgJ3BhcmFtZXRlcnMnIGFuZCAnemVyb1JlcycgZmllbGQuXG4gICpcbiAgKiAncGFyYW1ldGVycycgbWFwcyBzdHJpbmdzIHRvIHZhbHVlcy4gRS5nLjogcGFyYW1ldGVycyBgeyBcIklTX0NPTlRSQUNUT1JcIjogMSB9YCB3b3VsZCBjYXVzZSB0aGUgY29uZGl0aW9uXG4gICogYElTX0NPTlRSQUNUT1JgIHRvIGV2YWx1YXRlIHRydWUuXG4gICpcbiAgKiAnemVyb1JlcycgaXMgYW4gYXJyYXkgb2YgUmVnRXhwcyB1c2VkIHRvIG1hdGNoIGFnYWluc3QgYSBjb25kaXRpb24gc3RyaW5nICphZnRlciogcmVzb2x2aW5nIGFsbCB0aGUgcGFyYW1ldGVycy4gSWYgYVxuICAqICAgIG1hdGNoIGlzIG1hZGUsIHRoZW4gdGhhdCB2YWx1ZSBpcyBzZXQgdG8gemVyby4gSS5lLiwgYHplcm9SZXNgIGRldGVybWluZXMgd2hpY2ggcGFyYW1ldGVycyBhcmUgZGVmYXVsdCB6ZXJvLlxuICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgc2V0dGluZ3MpXG5cbiAgICB0aGlzLnBhcmFtZXRlcnMgPSB0aGlzLnBhcmFtZXRlcnMgfHwge31cbiAgICB0aGlzLnplcm9SZXMgPSB0aGlzLnplcm9SZXMgfHwgW11cbiAgfVxuXG4gIGV2YWxUcnV0aChvcmlnRXhwcmVzc2lvbikge1xuICAgIGlmICh0eXBlb2Ygb3JpZ0V4cHJlc3Npb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cHJlc3Npb24gbXVzdCBiZSBhIHN0cmluZy4gR290OiAnJHtvcmlnRXhwcmVzc2lvbn0nLmApXG4gICAgfVxuXG4gICAgbGV0IGV4cHJlc3Npb24gPSBvcmlnRXhwcmVzc2lvbiAvLyBzYXZlIG9yaWdpbmFsIGV4cHJlc3Npb24gaW4gY2FzZSB3ZSBuZWVkIHRvIHJlZmxlY3QgdG8gdXNlciBvbiBlcnJvclxuXG4gICAgLy8gcmVwbGFjZSBhbGwgdGhlIHBhcmFtZXRlcnMgaW4gdGhlIGV4cHJlc3Npb25cbiAgICBjb25zdCByZXN1bHRzID0gZXhwcmVzc2lvbi5tYXRjaEFsbChwYXJhbVJlKVxuICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgIGNvbnN0IHBhcmFtID0gcmVzdWx0WzJdXG4gICAgICBsZXQgdmFsID0gdGhpcy5wYXJhbWV0ZXJzW3BhcmFtXSAvLyBsb29rIG9uIHRoZSBwYXJhbWV0ZXIgb2JqZWN0XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHsgLy8gaWYgbm90IGRlZmluZWQsIGxvb2sgb24gcHJvY2Vzcy5lbnZcbiAgICAgICAgdmFsID0gcHJvY2Vzcy5lbnZbcGFyYW1dXG4gICAgICB9XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuemVyb1Jlcy5zb21lKChyZSkgPT4gcGFyYW0ubWF0Y2gocmUpKSkge1xuICAgICAgICAgIHZhbCA9IDBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbmRpdGlvbiBwYXJhbWV0ZXIgJyR7cGFyYW19JyBpcyBub3QgZGVmaW5lZC4gVXBkYXRlIHNldHRpbmdzIGFuZC9vciBjaGVjayBleHByZXNzaW9uLmApXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gJ3JlcGxhY2VBbGwnIG5vdCBzdXBwb3J0ZWQgb24gbm9kZSAoVE9ETzogYWRkIEJhYmVsIHRmb3JtKTsgdGhvdWdoICdyZXBsYWNlJyBkb2VzIHJlcGxhY2UgYWxsICppZiogZmlyc3QgYXJnIGlzXG4gICAgICAvLyBSRS4uLiBzby4uLiBtYXliZSBub3QgbmVjZXNzYXJ5PylcbiAgICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnJlcGxhY2UobmV3IFJlZ0V4cChgKF58W15BLVowLTlfXSkke3BhcmFtfShbXkEtWjAtOV9dfCQpYCwgJ2cnKSwgYCQxICR7dmFsfSAkMmApXG4gICAgfVxuXG4gICAgLy8gY2hlY2sgdGhhdCBldmVyeXRoaW5nIGlzIHNhdmVcbiAgICBpZiAoIWV4cHJlc3Npb24ubWF0Y2goc2FmZUV2YWxSZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBleHByZXNzaW9uIGRvZXMgbm90IGZ1bGx5IHJlc29sdmUgb3IgaGFzIHVuc2FmZSBjb2RlOiAke29yaWdFeHByZXNzaW9ufSA9PiAke2V4cHJlc3Npb259YClcbiAgICB9XG4gICAgLy8gZWxzZSwgbGV0J3MgZXZhbCBpdFxuICAgIHJldHVybiBGdW5jdGlvbihgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuICgke2V4cHJlc3Npb259KSA/IHRydWUgOiBmYWxzZWApKCkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xuICB9XG59XG5cbmV4cG9ydCB7IEV2YWx1YXRvciB9XG4iXSwibmFtZXMiOlsicGFyYW1SZSIsInNhZmVFdmFsUmUiLCJFdmFsdWF0b3IiLCJzZXR0aW5ncyIsIk9iamVjdCIsImFzc2lnbiIsInBhcmFtZXRlcnMiLCJ6ZXJvUmVzIiwib3JpZ0V4cHJlc3Npb24iLCJFcnJvciIsImV4cHJlc3Npb24iLCJyZXN1bHRzIiwibWF0Y2hBbGwiLCJyZXN1bHQiLCJwYXJhbSIsInZhbCIsInVuZGVmaW5lZCIsInByb2Nlc3MiLCJlbnYiLCJzb21lIiwicmUiLCJtYXRjaCIsInJlcGxhY2UiLCJSZWdFeHAiLCJGdW5jdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7QUFDaEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQyxFQUFFO0FBQzFDLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQzdELEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsR0FBRyxJQUFJOzs7Ozs7QUNQNUUsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFDLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsSUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQzNELElBQUksVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFD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
