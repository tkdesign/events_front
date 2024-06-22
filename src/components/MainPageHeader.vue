<template>
  <v-row>
    <div class="carousel" style="height: 500px">
      <div class="carousel-inner" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
        <div
            v-for="(banner, index) in banners"
            :key="index"
            class="carousel-item"
            :class="{ active: index === activeSlide}"
            :style="{ backgroundColor: banner.color, color: banner.text_color }"
        >
          <div class="carousel-content">
            <v-container>
              <div v-html="banner.content"></div>
              <v-btn variant="outlined" class="mx-2" @click="goToSignUp" v-if="!checkAuth()">Register Now</v-btn>
              <v-btn variant="outlined" class="mx-2" @click="goToEventDescription">Learn More</v-btn>
            </v-container>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" @click="prevSlide">
        <span class="carousel-control-prev-icon"></span>
      </a>
      <a class="carousel-control-next" @click="nextSlide">
        <span class="carousel-control-next-icon"></span>
      </a>
    </div>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useBannersStore } from '@/stores/bannersStore';
import {inject} from "vue";
export default {
  data() {
    const userStore = inject('userStore');
    return {
      userStore,
      activeSlide: 0,
    }
  },
  computed: {
    ...mapState(useBannersStore, ['banners']),
    transform() {
      return `translateX(-${this.activeSlide * 100}%)`;
    },
  },
  methods: {
    ...mapActions(useBannersStore, ['init']),
    prevSlide() {
      if (this.activeSlide > 0) {
        this.activeSlide--;
      } else {
        this.activeSlide = this.banners.length - 1;
      }
    },
    nextSlide() {
      if (this.activeSlide < this.banners.length - 1) {
        this.activeSlide++;
      } else {
        this.activeSlide = 0;
      }
    },
    goToSignUp() {
      this.$router.push({ name: 'sign-up' });
    },
    goToEventDescription() {
      const element = document.getElementById('eventDescription');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    checkAuth() {
      return this.userStore.user && this.userStore.user.hasOwnProperty('id');
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
}

.carousel-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 1;
  opacity: 0
}

.carousel:hover .carousel-control-prev,
.carousel:hover .carousel-control-next {
  opacity: 1;
}

.carousel-control-prev {
  left: 20px;
}

.carousel-control-next {
  right: 20px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  display: block;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}

.carousel-control-prev-icon::before {
  content: '';
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-caret-left-fill' viewBox='0 0 16 16'%3E%3Cpath d='m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z'/%3E%3C/svg%3E");
  position: relative;
  top: calc(50% - 10px);
  left: calc(50% - 10px);
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.carousel-control-next-icon::before {
  content: '';
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-caret-right-fill' viewBox='0 0 16 16'%3E%3Cpath d='m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z'/%3E%3C/svg%3E");
  position: relative;
  top: calc(50% - 10px);
  left: calc(50% - 10px);
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.h1-small {
  font-size: 40%;
}
</style>