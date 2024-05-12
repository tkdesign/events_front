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
      <ScheduleStagesSlots :day="day" :slots="stage.slots"/>
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
  data() {
    return {
      tab: null,
    }
  },
}
</script>

<style scoped>

</style>