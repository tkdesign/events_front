import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const useScheduleStore = defineStore('scheduleStore', {
    state: () => ({
        stages: [],
        subscribed: 0,
        days: [],
    }),
    getters: {
        getDays: (state) => () => { return state.days; },
        getFirstDay: (state) => () => { return (state.days.length > 0 ? state.days[0] : null); },
        getSubscribed: (state) => () => { return state.subscribed; },
        getStages: (state) => () => { return state.stages; },
        getStageById: (state) => (stage_id) => state.stages.find((stage) => stage.stage_id === stage_id),
        getSlotsByStageAndDay: (state) => (stageId,day) => {
            const stage = this.getStageById(stageId);
            return stage.slots.filter((slot) => slot.day === day);
        },
    },
    actions: {
        async fetchStages() {
            try {
                const { data } = await axios.get('/api/get-schedule');
                this.$patch({
                    stages: (data && 'stages' in data) ? data.stages : [],
                    subscribed: (data && 'subscribed' in data) ? data.subscribed : 0,
                    days: (data && 'stages' in data) ? this.extractDays(data.stages) : [],
                });
                return data;
            } catch (e) {
                console.error("Can't load data.", e);
                this.$patch({ stages: [], subscribed: 0, days: [] });
                throw e;
            }
        },
        init() {
            return this.fetchStages();
        },
        extractDays(stages) {
            const days = [];
            let pos = 1;
            stages.forEach((stage) => {
                stage.slots.forEach((slot) => {
                    // if (!days.includes(slot.day)) {
                        // days.push(slot.day);
                    if (!days.some(day => day.value === slot.day)) {
                        days.push({ value: slot.day, title: pos + ' day', subtitle: slot.day });
                        pos++;
                    }
                });
            });
            // days.sort();
            days.sort((a, b) => a.value - b.value);
            return days;
        },
        async checkin(stage_id, slot, user) {
            if (stage_id && slot && slot.hasOwnProperty('lecture') && slot.lecture && slot.lecture.hasOwnProperty('lecture_id') && user && user.hasOwnProperty('id')) {
                const { data } = await axios.post('/api/checkin', {lecture_id: slot.lecture.lecture_id, slot_id: slot.slot_id});

                if (data.success === true) {
                    const stage = this.stages.find((stage) => stage.stage_id === stage_id);
                    const slotIndex = stage.slots.findIndex((s) => s.slot_id === slot.slot_id);
                    if (slotIndex >= 0) {
                        stage.slots[slotIndex].user = user;
                    }
                } else {
                    alert("Can't checkin. " + data.message);
                }

                return data;
/*
                axios.post('/api/checkin', {lecture_id: slot.lecture.lecture_id, slot_id: slot.slot_id}).then(response => {
                    if (response.data.success === true) {
                        const stage = this.stages.find((stage) => stage.stage_id === stage_id);
                        const slotIndex = stage.slots.findIndex((s) => s.slot_id === slot.slot_id);
                        if (slotIndex >= 0) {
                            stage.slots[slotIndex].user = user;
                        }
                    } else {
                        alert("Can't checkin. " + response.data.message);
                    }
                }).catch(error => {
                    alert("Can't checkin. " + error);
                });
*/
            } else {
                alert("Can't checkin. Slot or user is invalid.");
            }
        },
        async checkout(stage_id, slot) {
            if (stage_id && slot && slot.hasOwnProperty('lecture') && slot.lecture && slot.lecture.hasOwnProperty('lecture_id') && slot.user && slot.user.hasOwnProperty('id')) {
                const { data } = await axios.post('/api/checkout', {lecture_id: slot.lecture.lecture_id});

                if (data.success === true) {
                    const stage = this.stages.find((stage) => stage.stage_id === stage_id);
                    const slotIndex = stage.slots.findIndex((s) => s.slot_id === slot.slot_id);
                    if (slotIndex >= 0) {
                        stage.slots[slotIndex].user = null;
                    }
                } else {
                    alert("Can't checkout. " + data.message);
                }
/*
                axios.post('/api/checkout', {lecture_id: slot.lecture.lecture_id}).then(response => {
                    console.log(response.data);
                    if(response.data.success === true) {
                        const stage = this.stages.find((stage) => stage.stage_id === stage_id);
                        const slotIndex = stage.slots.findIndex((s) => s.slot_id === slot.slot_id);
                        if (slotIndex >= 0) {
                            stage.slots[slotIndex].user = null;
                        }
                    } else {
                        alert("Can't checkout. " + response.data.message);
                    }
                }).catch(error => {
                    alert("Can't checkout. " + error);
                });
*/
            } else {
                alert("Can't checkout. Slot or user is invalid.");
            }
        },
    }
});