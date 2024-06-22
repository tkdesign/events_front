<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading.sync="loading"
      :search="search"
      item-value="menu_item_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Menu items table</v-toolbar-title>
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
                  <input v-if="editedItem.menu_item_id" v-model="editedItem.menu_item_id" type="hidden">
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.title" label="Title" :rules="[v => !!v || 'Title is required']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.page_title" label="Page title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.path" label="Path" :rules="[v => !!v || 'Path is required', v => /^\/(?:[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*)?$/.test(v) || 'Path must start with / and contain only alphanumeric characters, underscores, and dashes']"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.component" :items="['HomeView', 'SpeakersView', 'ScheduleView', 'SponsorsView', 'GalleryView', 'ContactsView', 'SignInView', 'SignUpView', 'SignOutView', 'AdminView', 'CustomPageView']" label="Component" :rules="[v => !!v || 'Component is required']"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.visible" :items="[1, 0]" label="Visible"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field v-model="editedItem.position" label="Position"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.role" :items="[-1, 0, 1, 2]" label="Role"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.is_article" :items="[1, 0]" label="Is article"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.is_top_menu_item" :items="[1, 0]" label="On top"></v-select>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-select v-model="editedItem.is_bottom_menu_item" :items="[1, 0]" label="On bottom"></v-select>
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
          <v-text-field v-model="name" class="ma-2" density="compact" hide-details
                        placeholder="Search name..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="component" class="ma-2" density="compact" hide-details
                        placeholder="Search component..."></v-text-field>
        </td>
        <td colspan="7"></td>
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
      {title: 'ID', key: 'menu_item_id', align: 'start'},
      {title: 'Title', key: 'title'},
      {title: 'Component', key: 'component'},
      {title: 'Visible', key: 'visible'},
      {title: 'Position', key: 'position'},
      {title: 'Role', key: 'role'},
      {title: 'Is article', key: 'is_article'},
      {title: 'On top', key: 'is_top_menu_item'},
      {title: 'On bottom', key: 'is_bottom_menu_item'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    menu_item_id: 0,
    name: '',
    component: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      menu_item_id: 0,
      name: '',
      title: '',
      page_title: '',
      path: '',
      component: '',
      visible: 1,
      position: 1,
      role: 1,
      is_article: 0,
      is_top_menu_item: 1,
      is_bottom_menu_item: 1,
    },
    defaultItem: {
      menu_item_id: 0,
      name: '',
      title: '',
      page_title: '',
      path: '',
      component: '',
      visible: 1,
      position: 1,
      role: 1,
      is_article: 0,
      is_top_menu_item: 1,
      is_bottom_menu_item: 1,
    },
    page: 1,
  }),
  watch: {
    name() {
      this.search = String(Date.now());
    },
    component() {
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
          name: this.name,
          component: this.component,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-menu', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    createItem() {
      this.editedItem.menu_item_id = null;
      this.editedItem.name = '';
      this.editedItem.title = '';
      this.editedItem.page_title = '';
      this.editedItem.path = '';
      this.editedItem.component = '';
      this.editedItem.visible = 1;
      this.editedItem.position = 1;
      this.editedItem.role = 1;
      this.editedItem.is_article = 0;
      this.editedItem.is_top_menu_item = 1;
      this.editedItem.is_bottom_menu_item = 1;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-menu-item/${this.editedItem.menu_item_id}`);
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
      formData.append('menu_item_id', this.editedItem.menu_item_id);
      formData.append('name', this.editedItem.name);
      formData.append('title', this.editedItem.title);
      formData.append('page_title', this.editedItem.page_title);
      formData.append('path', this.editedItem.path);
      formData.append('component', this.editedItem.component);
      formData.append('visible', this.editedItem.visible);
      formData.append('position', this.editedItem.position);
      formData.append('role', this.editedItem.role);
      formData.append('is_article', this.editedItem.is_article);
      formData.append('is_top_menu_item', this.editedItem.is_top_menu_item);
      formData.append('is_bottom_menu_item', this.editedItem.is_bottom_menu_item);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-menu-item`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-menu-item`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('menu_item_id')) {
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
}
</script>

<style scoped>

</style>