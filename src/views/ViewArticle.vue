<template>
  <div class="article-view" v-if="currentArticle">
    <div class="container quillWrapper">
      <h2>{{ this.currentArticle[0].articleTitle }}</h2>
      <h4>
        Posted on:
        {{
          new Date(currentArticle[0].articleDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h4>
      <h4>Category: {{ category }}</h4>
      <img :src="currentArticle[0].articleCoverPhoto" alt="" />
      <div
        class="article-content ql-editor"
        v-html="currentArticle[0].articleHTML"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewArticle",
  data() {
    return {
      currentArticle: null,
    };
  },
  async mounted() {
    this.currentArticle = await this.$store.state.articles.filter((article) => {
      return article.articleID === this.$route.params.articleid;
    });
  },
  computed: {
    category() {
      return (
        this.currentArticle[0].articleCategory[0].toUpperCase() +
        this.currentArticle[0].articleCategory.substring(1)
      );
    },
  },
};
</script>

<style lang="scss">
.article-view {
  h4 {
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
  }
}
.article-view {
  min-height: 100%;

  .container {
    max-width: 1000px;
    padding: 60px 25px;
  }

  .ql-editor {
    padding: 0;
  }

  h2 {
    margin-bottom: 16px;
    font-weight: 300;
    font-size: 32px;
  }

  img {
    width: 100%;
    margin-bottom: 32px;
  }
}
</style>
