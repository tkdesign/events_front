<template>
  <v-tabs v-model="tab" direction="vertical">
    <v-tab
        v-for="(stage, index) in stages"
        :key="index"
        :exact="true"
        :value="stage.stage_id"
    >
      {{ stage.title }}&nbsp;<small>{{ stage.location}}</small>
    </v-tab>
  </v-tabs>
  <v-tabs-window
      v-model="tab"
  >
    <v-tabs-window-item
        v-for="(stage, index) in stages"
        :key="index"
        :value="stage.stage_id"
    >
      <ScheduleStagesSlots :day="day" :slots="stage.slots" :stage_id="stage.stage_id" @checkin="handleCheckin" @checkout="handleCheckout"/>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import ScheduleStagesSlots from "@/components/ScheduleStagesSlots.vue";

export default {
  components: {ScheduleStagesSlots},
  props: {
    day: String,
    stages: [Array, Object],
  },
  emits: {
    checkin: null,
    checkout: null,
  },
  data() {
    return {
      tab: null,
    }
  },
  methods: {
    handleCheckin([stage_id, slot, user]) {
      this.$emit('checkin', [stage_id, slot, user]);
    },
    handleCheckout([stage_id, slot]) {
      this.$emit('checkout', [stage_id, slot]);
    },
  },
}
</script>

<style scoped>

</style>