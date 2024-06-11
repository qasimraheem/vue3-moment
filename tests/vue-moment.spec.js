import { createApp, ref, computed } from 'vue';
import moment from 'moment-timezone';
import VueMoment from '../vue-moment';

// Define TestComponent directly in the same file
const TestComponent = {
  template: `
    <div>
      <div>{{ nowFormatted }}</div>
      <div>{{ durationFormatted }}</div>
    </div>
  `,
  setup() {
    const now = ref(moment());
    const period = ref('P1D');

    const nowFormatted = computed(() => {
      return now.value.format('YYYY-MM-DD');
    });

    const durationFormatted = computed(() => {
      const duration = moment.duration(period.value);
      return duration.humanize(true);
    });

    return {
      nowFormatted,
      durationFormatted
    };
  }
};

// Start testing
describe('VueMoment Plugin', () => {
  it('provides $moment globally', () => {
    const app = createApp({}).use(VueMoment, { moment });
    const vm = app.mount(TestComponent);
    expect(vm.$moment).toBe(moment);
  });

  it('formats date using computed properties', () => {
    const app = createApp(TestComponent).use(VueMoment, { moment });
    const vm = app.mount();
    expect(vm.nowFormatted).toBe(moment().format('YYYY-MM-DD'));
  });

  it('humanizes duration using computed properties', () => {
    const app = createApp(TestComponent).use(VueMoment, { moment });
    const vm = app.mount();
    expect(vm.durationFormatted).toBe('in a day');
  });

  // Additional tests can go here...
});
