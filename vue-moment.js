export default {
  install(app, options) {
    const momentInstance = options && options.moment ? options.moment : require('moment');

    app.config.globalProperties.$moment = momentInstance;
    app.provide('moment', momentInstance);

    app.config.globalProperties.$moment = momentInstance;

    app.directive('moment', {
      beforeMount(el, binding) {
        el.innerHTML = momentInstance(binding.value).format('YYYY-MM-DD');
      },
      updated(el, binding) {
        el.innerHTML = momentInstance(binding.value).format('YYYY-MM-DD');
      }
    });

    app.config.globalProperties.$filters = {
      moment(...args) {
        args = Array.prototype.slice.call(args);
        const input = args.shift();
        let date;

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

        function parse(...args) {
          args = Array.prototype.slice.call(args);
          const method = args.shift();

          switch (method) {
            case 'add': {
              const addends = args.shift()
                .split(',')
                .map(Function.prototype.call, String.prototype.trim);
              const obj = {};

              for (let n = 0; n < addends.length; n++) {
                const addend = addends[n].split(' ');
                obj[addend[1]] = addend[0];
              }
              date.add(obj);
              break;
            }

            case 'subtract': {
              const subtrahends = args.shift()
                .split(',')
                .map(Function.prototype.call, String.prototype.trim);
              const obj = {};

              for (let n = 0; n < subtrahends.length; n++) {
                const subtrahend = subtrahends[n].split(' ');
                obj[subtrahend[1]] = subtrahend[0];
              }
              date.subtract(obj);
              break;
            }

            case 'from': {
              let from = 'now';
              let removeSuffix = false;

              if (args[0] === 'now') args.shift();
              if (momentInstance(args[0]).isValid()) from = momentInstance(args.shift());

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

            case 'diff': {
              let referenceTime = momentInstance();
              let units = '';
              let float = false;

              if (momentInstance(args[0]).isValid()) {
                referenceTime = momentInstance(args.shift());
              } else if (args[0] === null || args[0] === 'now') {
                args.shift();
              }

              if (args[0]) units = args.shift();

              if (args[0] === true) float = args.shift();

              date = date.diff(referenceTime, units, float);
              break;
            }

            case 'calendar': {
              let referenceTime = momentInstance();
              let formats = {};

              if (momentInstance(args[0]).isValid()) {
                referenceTime = momentInstance(args.shift());
              } else if (args[0] === null || args[0] === 'now') {
                args.shift();
              }

              if (typeof args[0] === 'object') formats = args.shift();

              date = date.calendar(referenceTime, formats);
              break;
            }

            case 'utc': {
              date.utc();
              break;
            }

            case 'timezone': {
              date.tz(args.shift());
              break;
            }

            default: {
              const format = method;
              date = date.format(format);
            }
          }

          if (args.length) parse.apply(parse, args);
        }

        parse.apply(parse, args);

        return date;
      },

      duration(...args) {
        args = Array.prototype.slice.call(args);
        const input = args.shift();
        const method = args.shift();

        function createDuration(time) {
          if (!Array.isArray(time)) time = [time];
          const result = momentInstance.duration(...time);
          if (!result.isValid()) console.warn('Could not build a valid `duration` object from input.');
          return result;
        }
        let duration = createDuration(input);

        if (method === 'add' || method === 'subtract') {
          const durationChange = createDuration(args);
          duration[method](durationChange);
        } else if (duration && duration[method]) {
          duration = duration[method](...args);
        }

        return duration;
      },
    };
  },
};
