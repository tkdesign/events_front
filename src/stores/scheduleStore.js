import {defineStore} from 'pinia'
import axios from 'axios';

export const useScheduleStore = defineStore('scheduleStore', {
    state: () => ({
        stages: [],
        days: [],
    }),
    getters: {
        getDays: (state) => () => { return state.days; },
        getFirstDay: (state) => () => { return (state.days.length > 0 ? state.days[0] : null); },
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
    }
});