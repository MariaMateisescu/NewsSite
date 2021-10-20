<template>
  <div class="article-card-wrap">
    <p class="tags-title">Tag: {{ tag }}</p>
    <autocomplete
      :placeholder="placeholder"
      class="search-bar"
      :search="search"
    ></autocomplete>
    <button @click="searchTag" class="button find-button">Find</button>
    <div class="article-cards container">
      <div v-if="admin" class="toggle-edit">
        <span>Toggle Editing Article</span>
        <input type="checkbox" v-model="editArticle" />
      </div>
      <news-card
        :articol="articol"
        v-for="(articol, index) in articles"
        :key="index"
      ></news-card>
      <div v-if="articles.length === 0">
        <p>
          There are no articles with this tag! :(
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NewsCard from "@/components/NewsCard.vue";
export default {
  name: "news",
  components: {
    NewsCard,
  },
  data() {
    return {
      input: "",
    };
  },
  computed: {
    tag() {
      return this.$route.params.tag;
    },
    placeholder() {
      return "Search tags...";
    },
    admin() {
      return this.$store.state.profileAdmin;
    },
    articles() {
      const articlesWithTags = this.$store.state.articles.filter(
        (article) => article.articleTags
      );
      const filteredArray = articlesWithTags
        .filter((element) =>
          element.articleTags.some((tag) => tag.text === this.tag)
        )
        .map((element) => {
          return Object.assign({}, element, {
            subElements: element.articleTags.filter(
              (subElement) => subElement.text === this.tag
            ),
          });
        });
      return filteredArray;
    },
    editArticle: {
      get() {
        return this.$store.state.editArticle;
      },
      set(payload) {
        this.$store.commit("toggleEditArticle", payload);
      },
    },
  },
  beforeDestroy() {
    this.$store.commit("toggleEditArticle", false);
  },
  methods: {
    search(input) {
      this.input = input;
    },
    searchTag() {
      this.$router.push({
        name: "Tags",
        params: { tag: this.input },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-title {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.search-bar {
  position: absolute;
  top: 10px;
  width: 300px;
  left: 40px;
}
.find-button {
  position: absolute;
  top: -7px;
  left: 360px;
}
.tabmenu {
  position: absolute;
  top: 0px;
  width: 100%;
  left: 0px;
}
.article-cards {
  position: relative;
  margin-top: 20px;

  .toggle-edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: -40px;
    right: 0;

    @media (min-width: 700px) {
      top: -135px;
    }

    span {
      margin-right: 16px;
    }
    input[type="checkbox"] {
      position: relative;
      border: none;
      -webkit-appearance: none;
      background: #fff;
      outline: none;
      width: 80px;
      height: 30px;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    input[type="checkbox"]:before {
      content: "";
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      top: 0;
      left: 0;
      background: #303030;
      transform: scale(1.1);
      transition: 750ms ease all;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    input:checked[type="checkbox"]:before {
      background: white;
      left: 52px;
    }
  }
}
</style>
