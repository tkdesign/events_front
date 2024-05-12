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
      <v-expansion-panel-title v-slot="{ expanded }">
        <v-row no-gutters>
          <v-col class="d-flex justify-start" cols="6">
            {{ slot.start_time + ' - ' + slot.end_time }}
          </v-col>
          <v-col
              class="text--secondary"
              cols="6"
          >
            {{ slot.lection.title }}
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col cols="5">
            <v-img
                :src="slot.lection.image"
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
                  {{ slot.lection.desc }}
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="6">
                <span class="font-weight-bold">
                  Speaker:
                </span>
                  {{ makeFullName(slot.lection.speaker) }}
              </v-col>
              <v-col cols="auto">
                {{ slot.lection.speaker.occupation }} at <span class="font-weight-bold">{{ slot.lection.speaker.company }}</span>
              </v-col>
            </v-row>
<!--
              <v-col cols="12">
                <v-card-subtitle>
                  {{ makeFullName(slot.lection.speaker) }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-text>
                  {{ slot.lection.desc }}
                </v-card-text>
              </v-col>
            </v-row>
-->
          </v-col>
        </v-row>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    slots: Object,
    day: String,
  },
  computed: {
    filteredSlots() {
      return this.slots.filter(slot => slot.day === this.day);
    },
  },
  data() {
//    const filteredSlots = this.slots.filter(slot => slot.day === this.day);
    return {
  //    filteredSlots: filteredSlots,
    }
  },
  methods: {
    makeFullName(speaker) {
      if (!speaker) {
        return '';
      }
      return [speaker.titul, speaker.first_name, speaker.last_name].join(' ');
    },
  },
}
</script>

<style scoped>

</style>