<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="banner_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Banners table</v-toolbar-title>
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
                  <input v-if="editedItem.banner_id" v-model="editedItem.banner_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.event_id"
                        :items="eventItems"
                        item-title="title"
                        item-text="title"
                        item-value="event_id"
                        label="Event"
                        :rules="[v => !!v || 'Event is required']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.title" label="Title" :rules="[v => !!v || 'Title is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
<!--                    <v-textarea v-model="editedItem.content" label="Content"></v-textarea>-->
                    <Editor
                        v-model="editedItem.content"
                        api-key="stmbmzzs7q0ut01pz6zjd9ht0o8dqoa2guc8g47keojqgayb"
                        :init="{
                          plugins: 'lists link image table code help wordcount'
                        }"
                        :toolbar="[
                          'undo redo | blocks | ' +
  'bold italic backcolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'removeformat | help'
                        ]"
                    />
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.image" accept="image/*" label="Image"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.thumbnail" accept="image/*" label="Thumbnail"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.color" label="Background color" type="color"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.text_color" label="Text color" type="color"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.visible" :items="[1, 0]" label="Visible"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.position" label="Position" type="number"></v-text-field>
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
    <template v-slot:item.thumbnail="{ value }">
      <v-img :src="getImageFullUrl(value)" height="100" width="100"/>
    </template>
    <template v-slot:tfoot>
      <tr>
        <td colspan="2"></td>
        <td>
          <v-text-field v-model="title" class="ma-2" density="compact" hide-details
                        placeholder="Search event title..."></v-text-field>
        </td>
        <td colspan="4"></td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios';
import Editor from "@tinymce/tinymce-vue";

export default {
  components: {Editor},
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'ID', key: 'banner_id', align: 'start'},
      {title: 'title', key: 'title', align: 'start'},
      {title: 'Event', key: 'event.title', align: 'start'},
      {title: 'Visible', key: 'visible'},
      {title: 'Position', key: 'position'},
      {title: 'Thumbnail', key: 'thumbnail'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    eventItems: [],
    loading: true,
    totalItems: 0,
    banner_id: 0,
    title: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      banner_id: 0,
      event_id: 0,
      content: '',
      image: null,
      thumbnail: null,
      color: '',
      text_color: '',
      visible: 1,
      position: 1,
    },
    defaultItem: {
      banner_id: 0,
      event_id: 0,
      content: '',
      image: null,
      thumbnail: null,
      color: '',
      text_color: '',
      visible: 1,
      position: 1,
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
      axios.get('http://localhost/events/backend/public/api/admin/get-banners', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.banner_id = null;
      this.editedItem.title = '';
      this.editedItem.event_id = null;
      this.editedItem.content = '';
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
      this.editedItem.color = '';
      this.editedItem.text_color = '';
      this.editedItem.visible = 1;
      this.editedItem.position = 1;
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-banner/${this.editedItem.banner_id}`);
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
      formData.append('banner_id', this.editedItem.banner_id);
      formData.append('title', this.editedItem.title);
      formData.append('event_id', this.editedItem.event_id);
      formData.append('content', this.editedItem.content);
      formData.append('image', this.editedItem.image);
      formData.append('thumbnail', this.editedItem.thumbnail);
      formData.append('color', this.editedItem.color);
      formData.append('text_color', this.editedItem.text_color);
      formData.append('visible', this.editedItem.visible);
      formData.append('position', this.editedItem.position);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-banner`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-banner`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('banner_id')) {
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
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>