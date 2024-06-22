<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="image_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Images table</v-toolbar-title>
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
                  <input v-if="editedItem.image_id" v-model="editedItem.image_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.gallery_id"
                        :items="galleryItems"
                        item-text="title"
                        item-value="gallery_id"
                        label="Gallery"
                        ref="gallerySelector"
                        :rules="[v => !!v || 'Gallery is required']"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearGalleryAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.title" label="Title" :rules="[v => !!v || 'Title is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.image" accept="image/*" label="Image" :rules="[v => !!v || 'Image is required']"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-file-input v-model="editedItem.thumbnail" accept="image/*" label="Thumbnail" :rules="[v => !!v || 'Thumbnail is required']"></v-file-input>
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
                        placeholder="Search title..."></v-text-field>
        </td>
        <td colspan="4"></td>
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
      {title: 'ID', key: 'image_id', align: 'start'},
      {title: 'Gallery', key: 'gallery.title'},
      {title: 'Title', key: 'title'},
      {title: 'Visible', key: 'visible'},
      {title: 'Position', key: 'position'},
      {title: 'Thumbnail', key: 'thumbnail'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    galleryItems: [],
    loading: true,
    totalItems: 0,
    image_id: 0,
    title: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      image_id: 0,
      gallery_id: 0,
      title: '',
      image: null,
      thumbnail: null,
      visible: 1,
      position: 1,
    },
    defaultItem: {
      image_id: 0,
      gallery_id: 0,
      title: '',
      image: null,
      thumbnail: null,
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
      axios.get('http://localhost/events/backend/public/api/admin/get-images', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.image_id = null;
      this.editedItem.gallery_id = null;
      this.editedItem.title = '';
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-image/${this.editedItem.image_id}`);
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
      formData.append('image_id', this.editedItem.image_id);
      formData.append('gallery_id', this.editedItem.gallery_id);
      formData.append('title', this.editedItem.title);
      formData.append('image', this.editedItem.image);
      formData.append('thumbnail', this.editedItem.thumbnail);
      formData.append('visible', this.editedItem.visible);
      formData.append('position', this.editedItem.position);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('image_id')) {
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
    clearGalleryAutocomplete() {
      this.editedItem.gallery_id = null;
      this.$refs.gallerySelector.blur();
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
    axios.get('http://localhost/events/backend/public/api/admin/get-galleries-all').then(response => {
      this.galleryItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
}
</script>

<style scoped>

</style>