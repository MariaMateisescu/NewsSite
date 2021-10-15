<template>
  <div class="home">
    <news-article v-if="!user" :articol="welcomeScreen" />
    <news-article
      :articol="articol"
      v-for="(articol, index) in articlesFeed"
      :key="index"
    />
    <div class="article-card-wrap">
      <div class="container">
        <h3>View More Recent News</h3>
        <div class="article-cards">
          <news-card
            :articol="articol"
            v-for="(articol, index) in articlesCards"
            :key="index"
          ></news-card>
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Never miss an article. Register for your free account today!</h2>
        <router-link class="router-button" to="#"
          >Register for NewsSite
          <Arrow class="arrow arrow-light"></Arrow>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Arrow from "@/assets/Icons/arrow-right-light.svg";
import NewsArticle from "@/components/NewsArticle.vue";
import NewsCard from "@/components/NewsCard.vue";
export default {
  name: "Home",
  components: {
    NewsArticle,
    NewsCard,
    Arrow,
  },
  data() {
    return {
      welcomeScreen: {
        title: "Welcome!",
        content: "Daily news",
        welcomeScreen: true,
        photo: "welcome",
      },
    };
  },
  computed: {
    articlesCards() {
      return this.$store.getters.articlesCards;
    },
    articlesFeed() {
      return this.$store.getters.articlesFeed;
    },

    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.article-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media (min-width: 800px) {
        margin-left: auto;
      }
    }

    h2 {
      font-weight: 300;
      font-size: 32px;
      max-width: 425px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      @media (min-width: 800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>
