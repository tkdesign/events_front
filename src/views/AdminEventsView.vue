<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="event_id"
      show-select
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Events table</v-toolbar-title>
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
                  <input v-if="editedItem.event_id" v-model="editedItem.event_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.desc_short" label="Short description"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-textarea v-model="editedItem.desc" label="Description"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.year" label="Year" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-checkbox v-model="editedItem.is_current" label="Current"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.start_date" label="Start Date" type="date"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.end_date" label="End Date" type="date"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.image" accept="image/*" label="Image"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.thumbnail" accept="image/*" label="Thumbnail"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.map" accept="image/*" label="Map"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.place" label="Place"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.about_title" label="About title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-textarea v-model="editedItem.about_text" label="About text"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.left_block_title" label="Left block title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-textarea v-model="editedItem.left_block_text" label="Left block text"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.right_block_title" label="Right block title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-textarea v-model="editedItem.right_block_text" label="Right block text"></v-textarea>
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
    <template v-slot:item.start_date="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:item.end_date="{ value }">
      {{ new Date(value).toLocaleDateString() }}
    </template>
    <template v-slot:item.thumbnail="{ value }">
      <v-img :src="getImageFullUrl(value)" height="100" width="100"/>
    </template>
    <template v-slot:item.is_current="{ item }">
      <v-checkbox v-model="item.is_current" readonly></v-checkbox>
    </template>
    <template v-slot:tfoot>
      <tr>
        <td colspan="2"></td>
        <td>
          <v-text-field v-model="title" class="ma-2" density="compact" hide-details
                        placeholder="Search title..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="year" class="ma-2" density="compact" hide-details placeholder="Search year"
                        type="number"></v-text-field>
        </td>
        <td colspan="5"></td>
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
      {title: 'ID', key: 'event_id', align: 'start'},
      {title: 'Title', key: 'title', align: 'start'},
      {title: 'Year', key: 'year', align: 'end'},
      {title: 'Start Date', key: 'start_date', align: 'start'},
      {title: 'End Date', key: 'end_date', align: 'start'},
      {title: 'Thumbnail', key: 'thumbnail', align: 'start', sortable: false},
      {title: 'Current', key: 'is_current', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    event_id: 0,
    title: '',
    year: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      event_id: 0,
      title: '',
      desc_short: '',
      desc: '',
      about_title: '',
      about_text: '',
      left_block_title: '',
      left_block_text: '',
      right_block_title: '',
      right_block_text: '',
      year: 0,
      start_date: '',
      end_date: '',
      image: null,
      thumbnail: null,
      map: null,
      is_current: false,
      location: '',
      place: '',
      address: '',
    },
    defaultItem: {
      event_id: 0,
      title: '',
      desc_short: '',
      desc: '',
      about_title: '',
      about_text: '',
      left_block_title: '',
      left_block_text: '',
      right_block_title: '',
      right_block_text: '',
      year: 0,
      start_date: '',
      end_date: '',
      image: null,
      thumbnail: null,
      map: null,
      is_current: false,
      location: '',
      place: '',
      address: '',
    },
  }),
  watch: {
    title() {
      this.search = String(Date.now());
    },
    year() {
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
          year: this.year,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-events', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.event_id = null;
      this.editedItem.title = '';
      this.editedItem.desc_short = '';
      this.editedItem.desc = '';
      this.editedItem.about_title = '';
      this.editedItem.about_text = '';
      this.editedItem.left_block_title = '';
      this.editedItem.left_block_text = '';
      this.editedItem.right_block_title = '';
      this.editedItem.right_block_text = '';
      this.editedItem.year = dayjs().year();
      this.editedItem.start_date = dayjs().format('YYYY-MM-DD');
      this.editedItem.end_date = dayjs().format('YYYY-MM-DD');
      this.editedItem.is_current = false;
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
      this.editedItem.map = null;
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
      this.editedItem.map = null;
      this.editedItem.start_date = dayjs(this.editedItem.start_date).format('YYYY-MM-DD');
      this.editedItem.end_date = dayjs(this.editedItem.end_date).format('YYYY-MM-DD');
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-event/${this.editedItem.event_id}`);
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
      formData.append('event_id', this.editedItem.event_id);
      formData.append('title', this.editedItem.title);
      formData.append('desc_short', this.editedItem.desc_short);
      formData.append('desc', this.editedItem.desc);
      formData.append('about_title', this.editedItem.about_title);
      formData.append('about_text', this.editedItem.about_text);
      formData.append('left_block_title', this.editedItem.left_block_title);
      formData.append('left_block_text', this.editedItem.left_block_text);
      formData.append('right_block_title', this.editedItem.right_block_title);
      formData.append('right_block_text', this.editedItem.right_block_text);
      formData.append('year', this.editedItem.year);
      formData.append('start_date', this.editedItem.start_date);
      formData.append('end_date', this.editedItem.end_date);
      formData.append('image', this.editedItem.image);
      formData.append('thumbnail', this.editedItem.thumbnail);
      formData.append('map', this.editedItem.map);
      formData.append('is_current', this.editedItem.is_current);
      formData.append('location', this.editedItem.location);
      formData.append('place', this.editedItem.place);
      formData.append('address', this.editedItem.address);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-event`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-event`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('event_id')) {
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
    getImageFullUrl(value) {
      if (/^(https?:)?\/\//i.test(value)) {
        return value;
      }
      return `http://localhost/events/backend/public${value}`;
    },
  },
  initialize() {
    this.loadItems({page: 1, itemsPerPage: this.itemsPerPage, sortBy: []});
  },
}
</script>

<style scoped>

</style>