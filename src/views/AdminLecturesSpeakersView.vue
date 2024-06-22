<template>
  <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="id"
      @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Lectures/Speakers relations table</v-toolbar-title>
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
                        v-model="editedItem.lecture_id"
                        :items="lectureItems"
                        item-title="title"
                        item-text="title"
                        item-value="lecture_id"
                        label="Lecture"
                        ref="lectureSelector"
                        :rules="[v => !!v || 'Lecture is required']"
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
                    <v-autocomplete
                        v-model="editedItem.speaker_id"
                        :items="speakerItems"
                        item-title="speaker_name"
                        item-text="speaker_name"
                        item-value="speaker_id"
                        label="Speaker"
                        ref="speakerSelector"
                        :rules="[v => !!v || 'Speaker is required']"
                    >
                      <template v-slot:prepend-item>
                        <v-list-item
                            title="None"
                            @click="clearSpeakerAutocomplete"
                        >
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-autocomplete>
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
        <td></td>
        <td>
          <v-text-field v-model="lectureTitle" class="ma-2" density="compact" hide-details
                        placeholder="Search lecture..."></v-text-field>
        </td>
        <td>
          <v-text-field v-model="speakerName" class="ma-2" density="compact" hide-details
                        placeholder="Search speaker..."></v-text-field>
        </td>
        <td colspan="3"></td>
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
      {title: 'Lecture', key: 'lecture.title', align: 'start'},
      {title: 'Speaker', key: 'speaker.speaker_name', align: 'start'},
      {title: 'Actions', key: 'actions', sortable: false},
    ],
    serverItems: [],
    lectureItems: [],
    speakerItems: [],
    loading: true,
    totalItems: 0,
    id: 0,
    lectureTitle: '',
    speakerName: '',
    search: '',
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      id: 0,
      lecture_id: 0,
      speaker_id: 0,
      visible: 1,
      position: 1,
    },
    defaultItem: {
      id: 0,
      lecture_id: 0,
      speaker_id: 0,
      visible: 1,
      position: 1,
    },
  }),
  watch: {
    lectureTitle() {
      this.search = String(Date.now());
    },
    speakerName() {
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
          lecture_title: this.lectureTitle,
          speaker_name: this.speakerName,
        },
      };
      axios.get('http://localhost/events/backend/public/api/admin/get-lectures-speakers', {params}).then(response => {
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
      this.editedItem.lecture_id = null;
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
        const response = await axios.delete(`http://localhost/events/backend/public/api/admin/delete-lecture-speaker/${this.editedItem.id}`);
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
      formData.append('id', this.editedItem.id);
      if (this.editedItem.lecture_id === null || this.editedItem.speaker_id === null) {
        alert('Please select Lecture and Speaker!');
        return;
      }
      formData.append('lecture_id', this.editedItem.lecture_id);
      formData.append('speaker_id', this.editedItem.speaker_id);
      formData.append('visible', this.editedItem.visible);
      formData.append('position', this.editedItem.position);

      try {
        const tableRowIndex = this.editedIndex;
        let response = null;
        if (tableRowIndex > -1) {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/update-lecture-speaker`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-HTTP-Method-Override': 'PUT'
            }
          });
        } else {
          response = await axios.post(`http://localhost/events/backend/public/api/admin/create-lecture-speaker`, formData, {
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
    clearSpeakerAutocomplete() {
      this.editedItem.speaker_id = null;
      this.$refs.speakerSelector.blur();
    },
    initialize() {
      this.loadItems({page: 1, itemsPerPage: this.itemsPerPage, sortBy: []});
    },
  },
  created() {
    axios.get('http://localhost/events/backend/public/api/admin/get-lectures-all').then(response => {
      this.lectureItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    axios.get('http://localhost/events/backend/public/api/admin/get-speakers-all').then(response => {
      this.speakerItems = response.data;
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  },
}
</script>

<style>
</style>