<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="speaker_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Speakers table</v-toolbar-title>
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
                  <input v-if="editedItem.speaker_id" v-model="editedItem.speaker_id" type="hidden">
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.titul" label="Titul"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.first_name" label="First Name" :rules="[v => !!v || 'First Name is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.last_name" label="Last Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.company" label="Company"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.occupation" label="Occupation"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.short_desc" label="Short description"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-textarea v-model="editedItem.desc" label="Description"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.email" label="Email" :rules="[rules.email]"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.facebook" label="Facebook"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.instagram" label="Instagram"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.linkedin" label="Linkedin"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-file-input v-model="editedItem.image" accept="image/*" label="Photo"></v-file-input>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-file-input v-model="editedItem.thumbnail" accept="image/*" label="Thumbnail"></v-file-input>
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
          <v-text-field v-model="firstName" class="ma-2" density="compact" hide-details
                        placeholder="Search first name..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="lastName" class="ma-2" density="compact" hide-details
                        placeholder="Search last name..."></v-text-field>
        </td>
        <td colspan="6"></td>
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
      {title: 'ID', key: 'speaker_id', align: 'start'},
      {title: 'Titul', key: 'titul'},
      {title: 'First Name', key: 'first_name'},
      {title: 'Last Name', key: 'last_name'},
      {title: 'Company', key: 'company'},
      {title: 'Occupation', key: 'occupation'},
      {title: 'Email', key: 'email'},
      {title: 'Phone', key: 'phone'},
      {title: 'Thumbnail', key: 'thumbnail'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    speaker_id: 0,
    firstName: '',
    lastName: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      speaker_id: 0,
      tutul: '',
      first_name: '',
      last_name: '',
      company: '',
      occupation: '',
      short_desc: '',
      desc: '',
      email: '',
      phone: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      image: null,
      thumbnail: null,
    },
    defaultItem: {
      speaker_id: 0,
      tutul: '',
      first_name: '',
      last_name: '',
      company: '',
      occupation: '',
      short_desc: '',
      desc: '',
      email: '',
      phone: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      image: null,
      thumbnail: null,
    },
    rules: {
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    },
  }),
  watch: {
    firstName() {
      this.search = String(Date.now());
    },
    lastName() {
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
          first_name: this.firstName,
          last_name: this.lastName,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-speakers', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.speaker_id = null;
      this.editedItem.titul = '';
      this.editedItem.first_name = '';
      this.editedItem.last_name = '';
      this.editedItem.company = '';
      this.editedItem.occupation = '';
      this.editedItem.short_desc = '';
      this.editedItem.desc = '';
      this.editedItem.email = '';
      this.editedItem.phone = '';
      this.editedItem.facebook = '';
      this.editedItem.instagram = '';
      this.editedItem.linkedin = '';
      this.editedItem.image = null;
      this.editedItem.thumbnail = null;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-speaker/${this.editedItem.speaker_id}`);
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
        this.totalItems = 0;
        this.initialize();
      })
    },

    save() {
      this.saveForm();
      this.close();
    },

    async saveForm() {
      const formData = new FormData();
      formData.append('speaker_id', this.editedItem.speaker_id);
      formData.append('titul', this.editedItem.titul);
      formData.append('first_name', this.editedItem.first_name);
      formData.append('last_name', this.editedItem.last_name);
      formData.append('company', this.editedItem.company);
      formData.append('occupation', this.editedItem.occupation);
      formData.append('short_desc', this.editedItem.short_desc);
      formData.append('desc', this.editedItem.desc);
      formData.append('email', this.editedItem.email);
      formData.append('phone', this.editedItem.phone);
      formData.append('facebook', this.editedItem.facebook);
      formData.append('instagram', this.editedItem.instagram);
      formData.append('linkedin', this.editedItem.linkedin);
      formData.append('image', this.editedItem.image);
      formData.append('thumbnail', this.editedItem.thumbnail);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-speaker`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-speaker`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('speaker_id')) {
          if (tableRowIndex > -1) {
            Object.assign(this.serverItems[tableRowIndex], response.data);
          } else {
            this.serverItems.push(response.data);
            this.totalItems = 0;
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
}
</script>

<style scoped>

</style>