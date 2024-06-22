<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="schedule_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Schedules table</v-toolbar-title>
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
                  <input v-if="editedItem.schedule_id" v-model="editedItem.schedule_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.event_id"
                        :items="eventItems"
                        item-title="title"
                        item-text="title"
                        item-value="event_id"
                        label="Event"
                    ></v-autocomplete>
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
    <template v-slot:tfoot>
      <tr>
        <td></td>
        <td>
          <v-text-field v-model="title" class="ma-2" density="compact" hide-details
                        placeholder="Search title..."></v-text-field>
        </td>
        <td colspan="1"></td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'ID', key: 'schedule_id', align: 'start'},
      {title: 'Title', key: 'title', align: 'start'},
      {title: 'Event', key: 'event.title', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    eventItems: [],
    loading: true,
    totalItems: 0,
    schedule_id: 0,
    title: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      title: 0,
      schedule_id: 0,
      event_id: 0,
    },
    defaultItem: {
      title: 0,
      schedule_id: 0,
      event_id: 0,
    },
  }),
  watch: {
    title() {
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
          title: this.title,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-schedules', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.schedule_id = null;
      this.editedItem.event_id = null;
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-schedule/${this.editedItem.schedule_id}`);
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
      formData.append('title', this.editedItem.title);
      formData.append('schedule_id', this.editedItem.schedule_id);
      formData.append('event_id', this.editedItem.event_id);
      formData.append('desc', this.editedItem.desc);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-schedule`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-schedule`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('schedule_id')) {
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

    initialize() {
      this.loadItems({page: 1, itemsPerPage: this.itemsPerPage, sortBy: []});
    },
  },
  created() {
    axios.get('http://localhost/events/backend/public/api/admin/get-events-all').then(response => {
      this.eventItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
}
</script>

<style>
</style>