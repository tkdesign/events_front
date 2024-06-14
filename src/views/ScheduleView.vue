<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-select
          v-model="dd"
          :item-props="itemProps"
          :items="days"
          label="Days"
          ref="daysSelector"
          @update:model-value="changeDays"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :title="item.raw.title" :subtitle="item.raw.subtitle"
          ></v-list-item>
        </template>
      </v-select>
      <h2 class="text-h2 mb-5">{{ dd }}</h2>
      <ScheduleStages :day="day" :stages="stages" v-if="!!stages.length" @checkin="handleCheckin" @checkout="handleCheckout"/>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import {useScheduleStore} from "@/stores/scheduleStore";
import ScheduleStages from "@/components/ScheduleStages.vue";
export default {
  components: {
    ScheduleStages,
    PageHeader,
    BaseHeader,
    BaseFooter,
  },
  emits: ['checkin', 'checkout'],
  computed: {
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 4;
      }
    },
    days() {
      return this.scheduleStore.getDays();
    },
  },
  data() {
    const scheduleStore = useScheduleStore();
    return {
      scheduleStore,
      stages: [],
      dd: null,
      day: null,
      wasMounted: false,
      wasCreated: false,
    };
  },
  watch: {
    scheduleStore: {
      handler() {
        this.stages = this.scheduleStore.getStages();
        this.dd = this.scheduleStore.getFirstDay().value;
        this.day = this.dd;
      },
      deep: true,
    },
  },
  methods: {
    itemProps(item) {
      return {
        title: item.title,
        subtitle: item.subtitle,
        value: item.value,
      };
    },
    changeDays(day) {
      this.dd = day;
      this.day = day;
    },
    handleCheckin([stage_id, slot, user]) {
      this.scheduleStore.checkin(stage_id, slot, user);
    },
    handleCheckout([stage_id, slot]) {
      this.scheduleStore.checkout(stage_id, slot);
    },
  },
  mounted() {
    if (!this.scheduleStore.stages.length) {
      if (!this.wasCreated) {
        this.scheduleStore.init();
      }
    } else {
      this.stages = this.scheduleStore.getStages();
      this.dd = this.scheduleStore.getFirstDay().value;
      this.day = this.dd;
    }
    this.wasMounted = true;
  },
  beforeUpdate() {
    if (!this.wasMounted) {
      this.scheduleStore.init();
    } else {
      if (this.scheduleStore.days.length > 0) {
        this.stages = this.scheduleStore.getStages();
        this.dd = this.scheduleStore.getFirstDay().value;
        this.day = this.dd;
      }
    }
  },
  created() {
    if (this.scheduleStore.stages.length === 0) {
      this.scheduleStore.init();
    }
    this.wasCreated = true;
  },
};
</script>

<style>

</style>