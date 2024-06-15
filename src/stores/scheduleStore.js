import {defineStore} from 'pinia'
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
        fetchStages() {
            // axios.get('/schedule.json').then(response => {
            axios.get('http://localhost/events/backend/public/api/get-schedule').then(response => {
                this.$patch({
                    stages: response.data.stages,
                    subscribed: response.data.subscribed,
                    days: this.extractDays(response.data.stages),
                });
            }).catch(error => {
                console.error("Can't load data.", error);
            });
        },
        init() {
            this.fetchStages();
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
        checkin(stage_id, slot, user) {
            if (stage_id && slot && slot.hasOwnProperty('lecture') && slot.lecture && slot.lecture.hasOwnProperty('lecture_id') && user && user.hasOwnProperty('id')) {
                axios.post('http://localhost/events/backend/public/api/checkin', {lecture_id: slot.lecture.lecture_id, slot_id: slot.slot_id}).then(response => {
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
                    // console.error("Can't checkin.", error);
                });
            } else {
                alert("Can't checkin. Slot or user is invalid.");
                // console.error("Can't checkin. Slot or user is invalid.");
            }
        },
        checkout(stage_id, slot) {
            if (stage_id && slot && slot.hasOwnProperty('lecture') && slot.lecture && slot.lecture.hasOwnProperty('lecture_id') && slot.user && slot.user.hasOwnProperty('id')) {
                axios.post('http://localhost/events/backend/public/api/checkout', {lecture_id: slot.lecture.lecture_id}).then(response => {
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
                    // console.error("Can't checkout.", error);
                });
            } else {
                alert("Can't checkout. Slot or user is invalid.");
                // console.error("Can't checkout. Slot or user is invalid.");
            }
        },
    }
});