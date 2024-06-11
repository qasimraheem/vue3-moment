var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

var vueMoment = {
  install: function install(app, options) {
    var momentInstance = options && options.moment ? options.moment : require('moment');

    app.config.globalProperties.$moment = momentInstance;
    app.provide('moment', momentInstance);

    app.config.globalProperties.$moment = momentInstance;

    app.directive('moment', {
      beforeMount: function beforeMount(el, binding) {
        el.innerHTML = momentInstance(binding.value).format('YYYY-MM-DD');
      },
      updated: function updated(el, binding) {
        el.innerHTML = momentInstance(binding.value).format('YYYY-MM-DD');
      }
    });

    app.config.globalProperties.$filters = {
      moment: function moment() {
        var arguments$1 = arguments;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments$1[_key];
        }

        args = Array.prototype.slice.call(args);
        var input = args.shift();
        var date = void 0;

        if (Array.isArray(input) && typeof input[0] === 'string') {
          date = momentInstance(input[0], input[1], true);
        } else if (typeof input === 'number') {
          if (input.toString().length < 12) {
            date = momentInstance.unix(input);
          } else {
            date = momentInstance(input);
          }
        } else {
          date = momentInstance(input);
        }

        if (!input || !date.isValid()) {
          console.warn('Could not build a valid `moment` object from input.');
          return input;
        }

        function parse() {
          var arguments$1 = arguments;

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments$1[_key2];
          }

          args = Array.prototype.slice.call(args);
          var method = args.shift();

          switch (method) {
            case 'add':
              {
                var addends = args.shift().split(',').map(Function.prototype.call, String.prototype.trim);
                var obj = {};

                for (var n = 0; n < addends.length; n++) {
                  var addend = addends[n].split(' ');
                  obj[addend[1]] = addend[0];
                }
                date.add(obj);
                break;
              }

            case 'subtract':
              {
                var subtrahends = args.shift().split(',').map(Function.prototype.call, String.prototype.trim);
                var _obj = {};

                for (var _n = 0; _n < subtrahends.length; _n++) {
                  var subtrahend = subtrahends[_n].split(' ');
                  _obj[subtrahend[1]] = subtrahend[0];
                }
                date.subtract(_obj);
                break;
              }

            case 'from':
              {
                var from = 'now';
                var removeSuffix = false;

                if (args[0] === 'now') { args.shift(); }
                if (momentInstance(args[0]).isValid()) { from = momentInstance(args.shift()); }

                if (args[0] === true) {
                  args.shift();
                  removeSuffix = true;
                }

                if (from !== 'now') {
                  date = date.from(from, removeSuffix);
                } else {
                  date = date.fromNow(removeSuffix);
                }
                break;
              }

            case 'diff':
              {
                var referenceTime = momentInstance();
                var units = '';
                var float = false;

                if (momentInstance(args[0]).isValid()) {
                  referenceTime = momentInstance(args.shift());
                } else if (args[0] === null || args[0] === 'now') {
                  args.shift();
                }

                if (args[0]) { units = args.shift(); }

                if (args[0] === true) { float = args.shift(); }

                date = date.diff(referenceTime, units, float);
                break;
              }

            case 'calendar':
              {
                var _referenceTime = momentInstance();
                var formats = {};

                if (momentInstance(args[0]).isValid()) {
                  _referenceTime = momentInstance(args.shift());
                } else if (args[0] === null || args[0] === 'now') {
                  args.shift();
                }

                if (_typeof(args[0]) === 'object') { formats = args.shift(); }

                date = date.calendar(_referenceTime, formats);
                break;
              }

            case 'utc':
              {
                date.utc();
                break;
              }

            case 'timezone':
              {
                date.tz(args.shift());
                break;
              }

            default:
              {
                var format = method;
                date = date.format(format);
              }
          }

          if (args.length) { parse.apply(parse, args); }
        }

        parse.apply(parse, args);

        return date;
      },
      duration: function duration() {
        var arguments$1 = arguments;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments$1[_key3];
        }

        args = Array.prototype.slice.call(args);
        var input = args.shift();
        var method = args.shift();

        function createDuration(time) {
          if (!Array.isArray(time)) { time = [time]; }
          var result = momentInstance.duration.apply(momentInstance, _toConsumableArray(time));
          if (!result.isValid()) { console.warn('Could not build a valid `duration` object from input.'); }
          return result;
        }
        var duration = createDuration(input);

        if (method === 'add' || method === 'subtract') {
          var durationChange = createDuration(args);
          duration[method](durationChange);
        } else if (duration && duration[method]) {
          var _duration;

          duration = (_duration = duration)[method].apply(_duration, _toConsumableArray(args));
        }

        return duration;
      }
    };
  }
};

export default vueMoment;
