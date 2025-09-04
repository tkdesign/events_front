<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="article_id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Articles table</v-toolbar-title>
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
                  <input v-if="editedItem.article_id" v-model="editedItem.article_id" type="hidden">
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.menu_item_id"
                        :items="menuItems"
                        item-title="title"
                        item-text="title"
                        item-value="menu_item_id"
                        label="Menu item"
                        ref="menuItemSelector"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearMenuItemAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field v-model="editedItem.short_desc" label="Short description"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
<!--                    <v-textarea v-model="editedItem.desc" label="Description"></v-textarea>-->
                    <Editor
                        v-model="editedItem.desc"
                        :api-key="tinymceApiKey"
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
        <td colspan="2"></td>
        <td>
          <v-text-field v-model="title" class="ma-2" density="compact" hide-details
                        placeholder="Search title..."></v-text-field>
        </td>
        <td colspan="2"></td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export default {
  components: {
    Editor,
  },
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'ID', key: 'article_id', align: 'start'},
      {title: 'Menu item', key: 'menu_item.title', align: 'start'},
      {title: 'Title', key: 'title', align: 'start'},
      {title: 'Short description', key: 'short_desc', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    menuItems: [],
    loading: true,
    totalItems: 0,
    article_id: 0,
    title: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      article_id: 0,
      menu_item_id: 0,
      title: '',
      short_desc: '',
      desc: '',
    },
    defaultItem: {
      article_id: 0,
      menu_item_id: 0,
      title: '',
      short_desc: '',
      desc: '',
    },
    tinymceApiKey: import.meta.env.VITE_TINY_MCE_API_KEY,
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
      axios.get('/api/admin/get-articles', {params}).then(response => {
        this.serverItems = response.data.data;
        this.totalItems = response.data.total;
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        this.loading = false
      });
    },

    updateTable() {
      const sortBy = this.$refs.dataTable.options.sortBy;
      if (sortBy.length) {
        const sortKey = sortBy[0].key;
        const sortOrder = sortBy[0].order === 'desc' ? -1 : 1;
        this.serverItems.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
          if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
          return 0;
        });
      }
      this.serverItems = [...this.serverItems];
    },

    createItem() {
      this.editedItem.article_id = null;
      this.editedItem.menu_item_id = null;
      this.editedItem.title = '';
      this.editedItem.short_desc = '';
      this.editedItem.desc = '';
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
        const response = await axios.delete(`/api/admin/delete-article/${this.editedItem.article_id}`);
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
      formData.append('article_id', this.editedItem.article_id);
      formData.append('menu_item_id', this.editedItem.menu_item_id);
      formData.append('title', this.editedItem.title);
      formData.append('short_desc', this.editedItem.short_desc);
      formData.append('desc', this.editedItem.desc);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`/api/admin/update-article`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`/api/admin/create-article`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        if (response && response.data && response.data.hasOwnProperty('article_id')) {
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
    clearMenuItemAutocomplete() {
      this.editedItem.menu_item_id = null;
      this.$refs.menuItemSelector.blur();
    },
    initialize() {
      this.loadItems({page: 1, itemsPerPage: this.itemsPerPage, sortBy: []});
    },
  },
  created() {
    axios.get('/api/admin/get-menu-all').then(response => {
      this.menuItems = response.data;
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