<template>
  <div class="modal2" ref="modal2">
    <div class="modal-content2">
      <close @click="closePreview" class="icon2" />
      <div class="wrapper">
        <h2>{{ articleTitle }}</h2>
        <img class="modal-img2" :src="articleCoverPhoto" alt="" />
        <div class="article-content ql-editor" v-html="articleHTML"></div>
      </div>
    </div>
  </div>
</template>

<script>
import close from "../assets/Icons/times-circle-light.svg";
export default {
  name: "ArticlePreview",
  components: {
    close,
  },
  methods: {
    closePreview() {
      this.$store.commit("openArticlePreview");
    },
  },
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

<style lang="scss" scoped>
.modal2 {
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  .modal-content2 {
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 12px;
    background-color: #fff;
    height: 700px;
    width: 850px;
    padding: 25px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    .icon2 {
      width: 24px;
      height: auto;
      cursor: pointer;
      font-size: 24px;
      position: absolute;
      top: 15px;
      right: 15px;
      color: #303030;
    }
    .modal-img2 {
      margin-top: 16px;
      margin-bottom: 16px;
      display: block;
      width: 700px;
      height: 300px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
.article-content {
  width: 700px;
  height: 250px;
  overflow: scroll;
}
.wrapper {
  align-content: center;
}
</style>
