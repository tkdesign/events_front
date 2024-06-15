<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="id"
      show-select
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Users table</v-toolbar-title>
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
                  <input v-if="editedItem.id" v-model="editedItem.id" type="hidden">
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.name" label="User name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.password" label="Password"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.first_name" label="First Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.last_name" label="Last Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.role" :items="[1, 2]" label="Role"></v-select>
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
        <td colspan="3"></td>
        <td>
          <v-text-field v-model="email" class="ma-2" density="compact" hide-details
                        placeholder="Search email..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="firstName" class="ma-2" density="compact" hide-details
                        placeholder="Search first name..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="lastName" class="ma-2" density="compact" hide-details
                        placeholder="Search last name..."></v-text-field>
        </td>
        <td colspan="2"></td>
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
      {title: 'ID', key: 'id', align: 'start'},
      {title: 'User name', key: 'name'},
      {title: 'Email', key: 'email'},
      {title: 'First Name', key: 'first_name'},
      {title: 'Last Name', key: 'last_name'},
      {title: 'Role', key: 'role'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 1,
    },
    defaultItem: {
      id: 0,
      name: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 1,
    },
  }),
  watch: {
    firstName() {
      this.search = String(Date.now());
    },
    lastName() {
      this.search = String(Date.now());
    },
    email() {
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
          email: this.email,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-users', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.id = null;
      this.editedItem.name = '';
      this.editedItem.password = '';
      this.editedItem.first_name = '';
      this.editedItem.last_name = '';
      this.editedItem.email = '';
      this.editedItem.role = 1;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-user/${this.editedItem.id}`);
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
      })
    },

    save() {
      this.saveForm();
      this.close();
    },

    async saveForm() {
      const formData = new FormData();
      formData.append('id', this.editedItem.id);
      formData.append('name', this.editedItem.name);
      if (this.editedItem.password) {
        formData.append('password', this.editedItem.password);
      }
      formData.append('first_name', this.editedItem.first_name);
      formData.append('last_name', this.editedItem.last_name);
      formData.append('email', this.editedItem.email);
      formData.append('role', this.editedItem.role);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-user`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-user`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('id')) {
          if (tableRowIndex > -1) {
            Object.assign(this.serverItems[tableRowIndex], response.data);
          } else {
            this.serverItems.push(response.data);
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
}
</script>

<style scoped>

</style>