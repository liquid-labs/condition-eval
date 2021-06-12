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

var paramRe = new RegExp('(^|[ (!&=|+-])([A-Z_][A-Z0-9_]*)', 'g'); // start with: (, number, bool, or unary op !
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
}();

exports.Evaluator = Evaluator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL2pzL0V2YWx1YXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjaztcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NyZWF0ZUNsYXNzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9kZWZpbmVQcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJjb25zdCBwYXJhbVJlID0gbmV3IFJlZ0V4cCgnKF58WyAoISY9fCstXSkoW0EtWl9dW0EtWjAtOV9dKiknLCAnZycpXG4vLyBzdGFydCB3aXRoOiAoLCBudW1iZXIsIGJvb2wsIG9yIHVuYXJ5IG9wICFcbi8vIGF0IGxlYXN0IG9uIHNwYWNlIG9yIHBhcmFtXG4vLyB0aGVuIG1heWJlIDArIHNhZmUgc3R1ZmZcbi8vIE5vdGUgdGhhdCB0aGlzIFJFIHJlbGllcyBvbiB0aGUgaW50ZW50aW9uYWwgc3BhY2luZ1xuLy8gVE9ETzogd2UgY291bGQgbG9jayBkb3duIGZ1cnRoZXIgYnkgcmVxdXJpbmcgZXhwcmVzc2lvbnMgb24gZWl0aHJlIHNpZGUgb2YgZHVhbCBvcGVyYXRvcnNcbmNvbnN0IHNhZmVFdmFsUmUgPVxuICAvXiAqKFxcKHxbMC05XSt8ZmFsc2V8dHJ1ZXwhKSgoIHxcXCgpKyhbMC05XSt8dHJ1ZXxmYWxzZXwhfCYmfFt8XXsyfXw9PXwhPXxcXCt8LXwlfFxcKnw8fD58PD18Pj0pKCB8XFwpKikpKiAqJC9cblxuLyoqXG4qIEEgc2FmZS1pc2ggKFRPRE86IGRldmVsb3BlZCBiYXNlZCBvbiBhIFN0YWNrZXhjaGFuZ2UgcG9zdDsgZmluZCBhbmQgbGluaz8pIGJvb2xlYW4gZXhwcmVzc2lvbiBldmFsdWF0b3IuXG4qL1xuY29uc3QgRXZhbHVhdG9yID0gY2xhc3Mge1xuICAvLyBkZWNsYXJlIHJlY29nbml6ZWQgaW50ZXJuYWwgcGFyYW1ldGVyc1xuICBwYXJhbWV0ZXJzXG4gIHplcm9SZXNcblxuICAvKipcbiAgKiBSZWNvZ3JpemVzICdwYXJhbWV0ZXJzJyBhbmQgJ3plcm9SZXMnIGZpZWxkLlxuICAqXG4gICogJ3BhcmFtZXRlcnMnIG1hcHMgc3RyaW5ncyB0byB2YWx1ZXMuIEUuZy46IHBhcmFtZXRlcnMgYHsgXCJJU19DT05UUkFDVE9SXCI6IDEgfWAgd291bGQgY2F1c2UgdGhlIGNvbmRpdGlvblxuICAqIGBJU19DT05UUkFDVE9SYCB0byBldmFsdWF0ZSB0cnVlLlxuICAqXG4gICogJ3plcm9SZXMnIGlzIGFuIGFycmF5IG9mIFJlZ0V4cHMgdXNlZCB0byBtYXRjaCBhZ2FpbnN0IGEgY29uZGl0aW9uIHN0cmluZyAqYWZ0ZXIqIHJlc29sdmluZyBhbGwgdGhlIHBhcmFtZXRlcnMuIElmIGFcbiAgKiAgICBtYXRjaCBpcyBtYWRlLCB0aGVuIHRoYXQgdmFsdWUgaXMgc2V0IHRvIHplcm8uIEkuZS4sIGB6ZXJvUmVzYCBkZXRlcm1pbmVzIHdoaWNoIHBhcmFtZXRlcnMgYXJlIGRlZmF1bHQgemVyby5cbiAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNldHRpbmdzKVxuXG4gICAgdGhpcy5wYXJhbWV0ZXJzID0gdGhpcy5wYXJhbWV0ZXJzIHx8IHt9XG4gICAgdGhpcy56ZXJvUmVzID0gdGhpcy56ZXJvUmVzIHx8IFtdXG4gIH1cblxuICBldmFsVHJ1dGgob3JpZ0V4cHJlc3Npb24pIHtcbiAgICBpZiAodHlwZW9mIG9yaWdFeHByZXNzaW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHByZXNzaW9uIG11c3QgYmUgYSBzdHJpbmcuIEdvdDogJyR7b3JpZ0V4cHJlc3Npb259Jy5gKVxuICAgIH1cblxuICAgIHZhciBleHByZXNzaW9uID0gb3JpZ0V4cHJlc3Npb24gLy8gc2F2ZSBvcmlnaW5hbCBleHByZXNzaW9uIGluIGNhc2Ugd2UgbmVlZCB0byByZWZsZWN0IHRvIHVzZXIgb24gZXJyb3JcblxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSBwYXJhbWV0ZXJzIGluIHRoZSBleHByZXNzaW9uXG4gICAgY29uc3QgcmVzdWx0cyA9IGV4cHJlc3Npb24ubWF0Y2hBbGwocGFyYW1SZSlcbiAgICBmb3IgKHZhciByZXN1bHQgb2YgcmVzdWx0cykge1xuICAgICAgY29uc3QgcGFyYW0gPSByZXN1bHRbMl1cbiAgICAgIGxldCB2YWwgPSB0aGlzLnBhcmFtZXRlcnNbcGFyYW1dIC8vIGxvb2sgb24gdGhlIHBhcmFtZXRlciBvYmplY3RcbiAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgeyAvLyBpZiBub3QgZGVmaW5lZCwgbG9vayBvbiBwcm9jZXNzLmVudlxuICAgICAgICB2YWwgPSBwcm9jZXNzLmVudltwYXJhbV1cbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGhpcy56ZXJvUmVzLnNvbWUoKHJlKSA9PiBwYXJhbS5tYXRjaChyZSkpKSB7XG4gICAgICAgICAgdmFsID0gMFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29uZGl0aW9uIHBhcmFtZXRlciAnJHtwYXJhbX0nIGlzIG5vdCBkZWZpbmVkLiBVcGRhdGUgc2V0dGluZ3MgYW5kL29yIGNoZWNrIGV4cHJlc3Npb24uYClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAncmVwbGFjZUFsbCcgbm90IHN1cHBvcnRlZCBvbiBub2RlIChUT0RPOiBhZGQgQmFiZWwgdGZvcm0pOyB0aG91Z2ggJ3JlcGxhY2UnIGRvZXMgcmVwbGFjZSBhbGwgKmlmKiBmaXJzdCBhcmcgaXNcbiAgICAgIC8vIFJFLi4uIHNvLi4uIG1heWJlIG5vdCBuZWNlc3Nhcnk/KVxuICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZShuZXcgUmVnRXhwKGAoXnxbXkEtWjAtOV9dKSR7cGFyYW19KFteQS1aMC05X118JClgLCAnZycpLCBgJDEgJHt2YWx9ICQyYClcbiAgICB9XG5cbiAgICAvLyBjaGVjayB0aGF0IGV2ZXJ5dGhpbmcgaXMgc2F2ZVxuICAgIGlmICghZXhwcmVzc2lvbi5tYXRjaChzYWZlRXZhbFJlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGV4cHJlc3Npb24gZG9lcyBub3QgZnVsbHkgcmVzb2x2ZSBvciBoYXMgdW5zYWZlIGNvZGU6ICR7b3JpZ0V4cHJlc3Npb259ID0+ICR7ZXhwcmVzc2lvbn1gKVxuICAgIH1cbiAgICAvLyBlbHNlLCBsZXQncyBldmFsIGl0XG4gICAgcmV0dXJuIEZ1bmN0aW9uKGBcInVzZSBzdHJpY3RcIjtyZXR1cm4gKCR7ZXhwcmVzc2lvbn0pID8gdHJ1ZSA6IGZhbHNlYCkoKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy1mdW5jXG4gIH1cbn1cblxuZXhwb3J0IHsgRXZhbHVhdG9yIH1cbiJdLCJuYW1lcyI6WyJwYXJhbVJlIiwiUmVnRXhwIiwic2FmZUV2YWxSZSIsIkV2YWx1YXRvciIsInNldHRpbmdzIiwiT2JqZWN0IiwiYXNzaWduIiwicGFyYW1ldGVycyIsInplcm9SZXMiLCJvcmlnRXhwcmVzc2lvbiIsIkVycm9yIiwiZXhwcmVzc2lvbiIsInJlc3VsdHMiLCJtYXRjaEFsbCIsInJlc3VsdCIsInBhcmFtIiwidmFsIiwidW5kZWZpbmVkIiwicHJvY2VzcyIsImVudiIsInNvbWUiLCJyZSIsIm1hdGNoIiwicmVwbGFjZSIsIkZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUNoRCxFQUFFLElBQUksRUFBRSxRQUFRLFlBQVksV0FBVyxDQUFDLEVBQUU7QUFDMUMsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDN0QsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLGNBQWMsR0FBRyxlQUFlLENBQUM7QUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLHlCQUF5QixHQUFHLElBQUk7Ozs7OztBQ1A1RSxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDMUMsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxJQUFJLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixJQUFJLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUM7QUFDM0QsSUFBSSxVQUFVLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUNuQyxJQUFJLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUMxRCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDOUQsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLFNBQVMsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO0FBQzVELEVBQUUsSUFBSSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RSxFQUFFLElBQUksV0FBVyxFQUFFLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMvRCxFQUFFLE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFDRDtBQUNBLGNBQWMsR0FBRyxZQUFZLENBQUM7QUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLHlCQUF5QixHQUFHLElBQUk7Ozs7OztBQ2pCNUUsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDMUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDbEIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDcEMsTUFBTSxLQUFLLEVBQUUsS0FBSztBQUNsQixNQUFNLFVBQVUsRUFBRSxJQUFJO0FBQ3RCLE1BQU0sWUFBWSxFQUFFLElBQUk7QUFDeEIsTUFBTSxRQUFRLEVBQUUsSUFBSTtBQUNwQixLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsTUFBTTtBQUNULElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUNyQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUNEO0FBQ0EsY0FBYyxHQUFHLGVBQWUsQ0FBQztBQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUseUJBQXlCLEdBQUcsSUFBSTs7Ozs7Ozs7Ozs7QUNoQjVFLElBQU1BLE9BQU8sR0FBRyxJQUFJQyxNQUFKLENBQVcsa0NBQVgsRUFBK0MsR0FBL0MsQ0FBaEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNQyxVQUFVLEdBQ2QsMEdBREY7QUFHQTtBQUNBO0FBQ0E7O0lBQ01DLFNBQVM7QUFDYjs7QUFJQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRSxxQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBOztBQUFBOztBQUNwQkMsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxFQUFvQkYsUUFBcEI7QUFFQSxTQUFLRyxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsSUFBbUIsRUFBckM7QUFDQSxTQUFLQyxPQUFMLEdBQWUsS0FBS0EsT0FBTCxJQUFnQixFQUEvQjtBQUNEOztBQW5CWTtBQUFBO0FBQUEsV0FxQmIsbUJBQVVDLGNBQVYsRUFBMEI7QUFBQTs7QUFDeEIsVUFBSSxPQUFPQSxjQUFQLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3RDLGNBQU0sSUFBSUMsS0FBSiw4Q0FBZ0RELGNBQWhELFFBQU47QUFDRDs7QUFFRCxVQUFJRSxVQUFVLEdBQUdGLGNBQWpCLENBTHdCO0FBT3hCOztBQUNBLFVBQU1HLE9BQU8sR0FBR0QsVUFBVSxDQUFDRSxRQUFYLENBQW9CYixPQUFwQixDQUFoQjs7QUFSd0IsaURBU0xZLE9BVEs7QUFBQTs7QUFBQTtBQUFBO0FBU2ZFLFVBQUFBLE1BVGU7QUFVdEIsY0FBTUMsS0FBSyxHQUFHRCxNQUFNLENBQUMsQ0FBRCxDQUFwQjtBQUNBLGNBQUlFLEdBQUcsR0FBRyxLQUFJLENBQUNULFVBQUwsQ0FBZ0JRLEtBQWhCLENBQVYsQ0FYc0I7O0FBWXRCLGNBQUlDLEdBQUcsS0FBS0MsU0FBWixFQUF1QjtBQUFFO0FBQ3ZCRCxZQUFBQSxHQUFHLEdBQUdFLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSixLQUFaLENBQU47QUFDRDs7QUFDRCxjQUFJQyxHQUFHLEtBQUtDLFNBQVosRUFBdUI7QUFDckIsZ0JBQUksS0FBSSxDQUFDVCxPQUFMLENBQWFZLElBQWIsQ0FBa0IsVUFBQ0MsRUFBRDtBQUFBLHFCQUFRTixLQUFLLENBQUNPLEtBQU4sQ0FBWUQsRUFBWixDQUFSO0FBQUEsYUFBbEIsQ0FBSixFQUFnRDtBQUM5Q0wsY0FBQUEsR0FBRyxHQUFHLENBQU47QUFDRCxhQUZELE1BR0s7QUFDSCxvQkFBTSxJQUFJTixLQUFKLGdDQUFrQ0ssS0FBbEMsZ0VBQU47QUFDRDtBQUNGLFdBdEJxQjtBQXlCdEI7OztBQUNBSixVQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ1ksT0FBWCxDQUFtQixJQUFJdEIsTUFBSix5QkFBNEJjLEtBQTVCLHFCQUFtRCxHQUFuRCxDQUFuQixlQUFrRkMsR0FBbEYsU0FBYjtBQTFCc0I7O0FBU3hCLDREQUE0QjtBQUFBLGNBQW5CRixNQUFtQjs7QUFBQTtBQWtCM0IsU0EzQnVCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBOEJ4QixVQUFJLENBQUNILFVBQVUsQ0FBQ1csS0FBWCxDQUFpQnBCLFVBQWpCLENBQUwsRUFBbUM7QUFDakMsY0FBTSxJQUFJUSxLQUFKLHlFQUEyRUQsY0FBM0UsaUJBQWdHRSxVQUFoRyxFQUFOO0FBQ0QsT0FoQ3VCOzs7QUFrQ3hCLGFBQU9hLFFBQVEsa0NBQXlCYixVQUF6QixzQkFBUixFQUFQLENBbEN3QjtBQW1DekI7QUF4RFk7O0FBQUE7QUFBQTs7OzsifQ==
