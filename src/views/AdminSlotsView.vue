<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="slot_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Slots table</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn class="mb-2" color="primary" dark @click="createItem">New Item</v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <input v-if="editedItem.slot_id" v-model="editedItem.slot_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.schedule_id"
                        :items="scheduleItems"
                        item-title="title"
                        item-text="title"
                        item-value="schedule_id"
                        label="Schedule"
                        ref="scheduleSelector"
                        :rules="[v => !!v || 'Schedule is required']"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearScheduleAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.stage_id"
                        :items="stageItems"
                        item-title="title"
                        item-text="title"
                        item-value="stage_id"
                        label="Stage"
                        ref="stageSelector"
                        :rules="[v => !!v || 'Stage is required']"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearStageAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.lecture_id"
                        :items="lectureItems"
                        item-title="title"
                        item-text="title"
                        item-value="lecture_id"
                        label="Lecture"
                        ref="lectureSelector"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearLectureAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.day" label="Day" type="date" :rules="[v => !!v || 'Day is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.start_time" label="Start Time" type="time" :rules="[v => !!v || 'Start time is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.end_time" label="End Time" type="time" :rules="[v => !!v || 'End time is required']"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
    <template v-slot:item.start_time="{ value }">
      {{ formatTime(value) }}
    </template>
    <template v-slot:item.end_time="{ value }">
      {{ formatTime(value) }}
    </template>
    <template v-slot:item.day="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:tfoot>
      <tr>
        <td></td>
        <td>
          <v-text-field v-model="scheduleTitle" class="ma-2" density="compact" hide-details
                        placeholder="Search schedule..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="stageTitle" class="ma-2" density="compact" hide-details
                        placeholder="Search stage..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="lectureTitle" class="ma-2" density="compact" hide-details
                        placeholder="Search lecture..."></v-text-field>
        </td>
        <td colspan="4"></td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios';
import dayjs from "dayjs";

export default {
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'ID', key: 'slot_id', align: 'start'},
      {title: 'Schedule', key: 'schedule.title', align: 'start'},
      {title: 'Stage', key: 'stage.title', align: 'start'},
      {title: 'Lecture', key: 'lecture.title', align: 'start'},
      {title: 'Day', key: 'day', align: 'start'},
      {title: 'Start Time', key: 'start_time', align: 'start'},
      {title: 'End Time', key: 'end_time', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    scheduleItems: [],
    stageItems: [],
    lectureItems: [],
    loading: true,
    totalItems: 0,
    slot_id: 0,
    scheduleTitle: '',
    stageTitle: '',
    lectureTitle: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      slot_id: 0,
      schedule_id: 0,
      stage_id: 0,
      lecture_id: 0,
      day: '',
      start_time: '',
      end_time: '',
    },
    defaultItem: {
      slot_id: 0,
      schedule_id: 0,
      stage_id: 0,
      lecture_id: 0,
      day: '',
      start_time: '',
      end_time: '',
    },
  }),
  watch: {
    scheduleTitle() {
      this.search = String(Date.now());
    },
    stageTitle() {
      this.search = String(Date.now());
    },
    lectureTitle() {
      this.search = String(Date.now());
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  methods: {
    loadItems({page, itemsPerPage, sortBy}) {
      this.loading = true
      const params = {
        page,
        itemsPerPage,
        sortBy: sortBy.length ? sortBy[0].key : null,
        sortOrder: sortBy.length ? sortBy[0].order : null,
        search: {
          schedule_title: this.scheduleTitle,
          stage_title: this.stageTitle,
          lecture_title: this.lectureTitle,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-slots', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.slot_id = null;
      this.editedItem.schedule_id = null;
      this.editedItem.stage_id = null;
      this.editedItem.lecture_id = null;
      this.day = dayjs().format('YYYY-MM-DD');
      this.start_time = dayjs().format('HH:mm');
      this.end_time = dayjs().format('HH:mm');
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.day = dayjs(this.editedItem.day).format('YYYY-MM-DD');
      this.editedItem.start_time = dayjs(this.editedItem.start_time).format('HH:mm');
      this.editedItem.end_time = dayjs(this.editedItem.end_time).format('HH:mm');
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-slot/${this.editedItem.slot_id}`);
        if (response && response.status === 200 && response.statusText === 'OK') {
          this.serverItems.splice(this.editedIndex, 1);
        } else {
          if (response.data && response.data.hasOwnProperty('message')) {
            alert(response.data.message);
          } else {
            alert('There was an error!');
          }
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.initialize();
      })
    },

    save() {
      this.saveForm();
      this.close();
    },

    async saveForm() {
      const formData = new FormData();
      formData.append('slot_id', this.editedItem.slot_id);
      formData.append('schedule_id', this.editedItem.schedule_id);
      formData.append('stage_id', this.editedItem.stage_id);
      formData.append('lecture_id', this.editedItem.lecture_id);
      formData.append('day', this.editedItem.day);
      formData.append('start_time', this.editedItem.start_time);
      formData.append('end_time', this.editedItem.end_time);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-slot`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-slot`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('slot_id')) {
          if (tableRowIndex > -1) {
            Object.assign(this.serverItems[tableRowIndex], response.data);
          } else {
            this.serverItems.push(response.data);
            this.initialize();
          }
        } else {
          if (response.data && response.data.hasOwnProperty('message')) {
            alert(response.data.message);
          } else {
            alert('There was an error!');
          }
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    },
    clearLectureAutocomplete() {
      this.editedItem.lecture_id = null;
      this.$refs.lectureSelector.blur();
    },
    clearStageAutocomplete() {
      this.editedItem.stage_id = null;
      this.$refs.stageSelector.blur();
    },
    clearScheduleAutocomplete() {
      this.editedItem.schedule_id = null;
      this.$refs.scheduleSelector.blur();
    },
    formatTime(value) {
      return dayjs(value).format('HH:mm');
    },
    initialize() {
      this.loadItems({page: 1, itemsPerPage: this.itemsPerPage, sortBy: []});
    },
  },
  created() {
    axios.get('http://localhost/events/backend/public/api/admin/get-schedules-all').then(response => {
      this.scheduleItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    axios.get('http://localhost/events/backend/public/api/admin/get-stages-all').then(response => {
      this.stageItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    axios.get('http://localhost/events/backend/public/api/admin/get-lectures-all').then(response => {
      this.lectureItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
}
</script>

<style>
</style>