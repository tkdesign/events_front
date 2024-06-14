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
        <v-toolbar-title>Lections/Users relations table</v-toolbar-title>
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
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.lection_id"
                        :items="lectionItems"
                        item-title="title"
                        item-text="title"
                        item-value="lection_id"
                        label="Lection"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                        v-model="editedItem.user_id"
                        :items="userItems"
                        item-title="user_name"
                        item-text="user_name"
                        item-value="id"
                        label="User"
                    ></v-autocomplete>
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
    <template v-slot:tfoot>
      <tr>
        <td colspan="2"></td>
        <td>
          <v-text-field v-model="lectionTitle" class="ma-2" density="compact" hide-details
                        placeholder="Search lection..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="userName" class="ma-2" density="compact" hide-details
                        placeholder="Search user..."></v-text-field>
        </td>
        <td colspan="3"></td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios';

/*
-- auto-generated definition
create table lections_has_users
(
    id         bigint unsigned auto_increment
        primary key,
    lection_id bigint unsigned   not null,
    user_id    bigint unsigned   not null,
    visible    tinyint default 1 null,
    position   int     default 1 null,
    created_at timestamp         null,
    updated_at timestamp         null,
    constraint lections_has_users_lection_id_foreign
        foreign key (lection_id) references lections (lection_id)
            on delete cascade,
    constraint lections_has_users_user_id_foreign
        foreign key (user_id) references users (id)
            on delete cascade
)
    collate = utf8mb4_unicode_ci;

create index lections_has_users_created_at_index
    on lections_has_users (created_at);

create index lections_has_users_lection_id_index
    on lections_has_users (lection_id);

create index lections_has_users_position_index
    on lections_has_users (position);

create index lections_has_users_user_id_index
    on lections_has_users (user_id);
*/
export default {
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {title: 'ID', key: 'id', align: 'start'},
      {title: 'Lection', key: 'lection.title', align: 'start'},
      {title: 'User', key: 'user.user_name', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    lectionItems: [],
    userItems: [],
    loading: true,
    totalItems: 0,
    id: 0,
    lectionTitle: '',
    userName: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      id: 0,
      lection_id: 0,
      user_id: 0,
      visible: 1,
      position: 1,
    },
    defaultItem: {
      id: 0,
      lection_id: 0,
      user_id: 0,
      visible: 1,
      position: 1,
    },
  }),
  watch: {
    lectionTitle() {
      this.search = String(Date.now());
    },
    userName() {
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
          lection_title: this.lectionTitle,
          user_name: this.userName,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-lections-users', {params}).then(response => {
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
      this.editedItem.lection_id = null;
      this.editedItem.user_id = null;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-lection-user/${this.editedItem.id}`);
        if (response && response.status === 200 && response.statusText === 'OK') {
          this.serverItems.splice(this.editedIndex, 1);
        } else {
          console.error('There was an error!');
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
      formData.append('lection_id', this.editedItem.lection_id);
      formData.append('user_id', this.editedItem.user_id);
      formData.append('visible', this.editedItem.visible);
      formData.append('position', this.editedItem.position);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-lection-user`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-lection-user`, formData, {
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
          console.error('There was an error!', response.data);
        }
      } catch (error) {
        console.error('There was an error!', error);
      }
    },
  },
  created() {
    axios.get('http://localhost/events/backend/public/api/admin/get-lections-all').then(response => {
      this.lectionItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    axios.get('http://localhost/events/backend/public/api/admin/get-users-all-concat').then(response => {
      this.userItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
}
</script>

<style>
</style>