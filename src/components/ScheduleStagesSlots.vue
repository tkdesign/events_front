<template>
  <v-table>
    <thead>
    <tr>
      <th class="text-left">
        Time slot
      </th>
      <th class="text-left">
        Session title
      </th>
    </tr>
    </thead>
  </v-table>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel
    v-for="(slot, index) in filteredSlots"
    >
      <v-expansion-panel-title v-slot="{ expanded }" :class="{'highlight-class': checkAuth() && !getUserCheckInStatus(slot.user)}">
        <v-row no-gutters>
          <v-col class="d-flex justify-start" cols="6">
            {{ slot.start_time + ' - ' + slot.end_time }}
          </v-col>
          <v-col
              class="text--secondary"
              cols="6"
          >
            {{ slot.lecture.title }}
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col cols="5">
            <v-img
                :src="getImageFullUrl(slot.lecture.image)"
                height="200px"
                cover
            />
          </v-col>

          <v-divider
              class="mx-4"
              vertical
          ></v-divider>

          <v-col cols="6">
            <v-row no-gutters>
              <v-col cols="12">
                  {{ slot.lecture.desc }}
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="6">
                <span class="font-weight-bold">
                  Speaker:
                </span>
                  {{ makeFullName(slot.lecture.speaker) }}
              </v-col>
              <v-col cols="auto">
                {{ slot.lecture.speaker.occupation }} at <span class="font-weight-bold">{{ slot.lecture.speaker.company }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                    color="primary"
                    @click.prevent="checkin(slot)"
                    v-if="checkAuth() && getUserCheckInStatus(slot.user)"
                >
                  Check in
                </v-btn>
                <v-btn
                    color="secondary"
                    @click.prevent="checkout(slot)"
                    v-if="checkAuth() && !getUserCheckInStatus(slot.user)"
                >
                  Check out
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import {inject} from "vue";

export default {
  props: {
    stage_id: Number,
    slots: Object,
    day: String,
    subscribed: Number,
  },
  emits: {
    checkin: null,
    checkout: null,
  },
  computed: {
    filteredSlots() {
      return this.slots.filter(slot => slot.day === this.day);
    },
  },
  data() {
    const userStore = inject('userStore');
//    const filteredSlots = this.slots.filter(slot => slot.day === this.day);
    return {
  //    filteredSlots: filteredSlots,
      userStore,
    }
  },
  methods: {
    makeFullName(speaker) {
      if (!speaker) {
        return '';
      }
      return [speaker.titul, speaker.first_name, speaker.last_name].join(' ');
    },
    checkAuth() {
      return this.userStore.user && this.userStore.user.hasOwnProperty('id');
    },
    getUserCheckInStatus(user) {
      if (this.userStore.user && this.userStore.user.hasOwnProperty('id') && user && user.hasOwnProperty('id')) {
        return user.id !== this.userStore.user.id;
      }
      return true;
    },
    checkin(slot) {

      if (!this.subscribed) {
        alert('You are not subscribed to current event');
        return;
      }
      this.$emit('checkin', [this.stage_id, slot, this.userStore.user]);
    },
    checkout(slot) {
      this.$emit('checkout', [this.stage_id, slot]);
    },
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `http://localhost/events/backend/public${value}`;
    },
  },
}
</script>

<style scoped>
.highlight-class {
  color: lightseagreen;
}
</style>