<template>
  <div class="article-view">
    <div class="container quillWrapper">
      <h2>{{ articleTitle }}</h2>
      <img :src="articleCoverPhoto" alt="" />
      <div class="article-content ql-editor" v-html="articleHTML"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlePreview",
  computed: {
    articleTitle() {
      return this.$store.state.articleTitle;
    },
    articleHTML() {
      return this.$store.state.articleHTML;
    },
    articleCoverPhoto() {
      return this.$store.state.articlePhotoFileURL;
    },
  },
};
</script>

<style lang="scss">
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
