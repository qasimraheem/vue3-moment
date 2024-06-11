<template>
  <div>
    <div>{{ durationFormatted }}</div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import moment from "moment";

export default {
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
</script>
