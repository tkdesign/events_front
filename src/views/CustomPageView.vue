<template>
  <BaseHeader/>
  <v-main>
    <PageHeader/>
    <v-container class="mt-15 mb-10">
      <v-row>
        <v-col :cols="cols">
          <v-card>
            <v-card-title>
              <h2 class="text-h2">{{ article.title }}</h2>
            </v-card-title>
            <v-card-text>
              <div v-html="article.desc"></div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  <BaseFooter/>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import PageHeader from "@/components/PageHeader.vue";
import {useArticlesStore} from "@/stores/articlesStore";
export default {
  components: {
    PageHeader, BaseHeader, BaseFooter
  },
  computed: {
    cols() {
      if (this.$vuetify.display.mobile) {
        return 12;
      } else {
        return 12;
      }
    },
  },
  data() {
    const articlesStore = useArticlesStore();
    return {
      articlesStore,
      article: Object,
      wasMounted: false,
      wasCreated: false,
    };
  },
  watch: {
    articlesStore: {
      handler() {
        this.article = this.articlesStore.getArticleByMenuItemName(this.$route.name);
      },
      deep: true,
    },
    $route(to, from) {
      this.article = this.articlesStore.getArticleByMenuItemName(to.params.name);
    },
  },
  mounted() {
    if (this.articlesStore.articles.length === 0) {
      if(!this.wasCreated) {
        this.articlesStore.init();
      }
    } else {
      this.article = this.articlesStore.getArticleByMenuItemName(this.$route.name);
    }
    this.wasMounted = true;
  },
  beforeUpdate() {
    if (!this.wasMounted) {
      this.articlesStore.init();
    } else {
      this.article = this.articlesStore.getArticleByMenuItemName(this.$route.name);
    }
  },
  created() {
    if (this.articlesStore.articles.length === 0) {
      this.articlesStore.init();
    }
    this.wasCreated = true;
  },
}
</script>

<style scoped>

</style>