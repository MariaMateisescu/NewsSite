<template>
  <div class="article-card-wrap">
    <TabMenu class="tabmenu" :model="items" :activeIndex.sync="active" />
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
    </div>
  </div>
</template>

<script>
import TabMenu from "primevue/tabmenu";
import NewsCard from "@/components/NewsCard.vue";
export default {
  name: "news",
  components: {
    NewsCard,
    TabMenu,
  },
  data() {
    return {
      active: 0,
      items: [
        {
          label: "All",
        },
        {
          label: "Sports",
        },
        {
          label: "Health",
        },
        { label: "Technology" },
        {
          label: "Business",
        },
        {
          label: "Politics",
        },
        {
          label: "Other",
        },
      ],
    };
  },
  computed: {
    admin() {
      return this.$store.state.profileAdmin;
    },
    articles() {
      if (this.items[this.active].label === "All") {
        return this.$store.state.articles;
      }
      return this.$store.state.articles.filter(
        (article) =>
          article.articleCategory ===
          this.items[this.active].label.toLowerCase()
      );
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
};
</script>

<style lang="scss" scoped>
.tabmenu {
  position: absolute;
  top: 0px;
  width: 100%;
  left: 0px;
}
.article-cards {
  position: relative;

  .toggle-edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: -30px;
    right: 0;

    @media (min-width: 700px) {
      top: -90px;
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
