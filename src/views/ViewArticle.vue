<template>
  <div class="article-view" v-if="currentArticle">
    <div class="container quillWrapper">
      <div class="back">
        <backIcon class="back-icon" @click="goBack" />
        <h2>{{ this.currentArticle[0].articleTitle }}</h2>
      </div>
      <h4>
        Posted on:
        {{
          new Date(currentArticle[0].articleDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h4>
      <ul class="tags">
        <li v-for="tag in tags" :key="tag" @click="goToTag(tag, $event)">
          <a class="tag">{{ tag }}</a>
        </li>
      </ul>
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
import backIcon from "@/assets/Icons/arrow-right-light.svg";
export default {
  name: "ViewArticle",
  components: {
    backIcon,
  },
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
    tags() {
      if (this.currentArticle[0].articleTags)
        return this.currentArticle[0].articleTags.map((tag) => tag.text);
      return "";
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goToTag(tag, event) {
      event.cancelBubble = true;
      if (event.stopPropagation) event.stopPropagation();
      this.$router.push({
        name: "Tags",
        params: { tag: tag },
      });
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

.back-icon {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -70px;
  transform: scaleX(-1);
  cursor: pointer;
  @media (max-width: 1100px) {
    left: 0px;
    top: -40px;
  }
}
.back {
  position: relative;
}

.tags {
  list-style: none;
  margin: 0;
  overflow: hidden;
  padding: 0;
}

.tags li {
  float: left;
}

.tag {
  background: #eee;
  border-radius: 3px 0 0 3px;
  color: #999;
  display: inline-block;
  height: 26px;
  line-height: 26px;
  padding: 0 20px 0 23px;
  position: relative;
  margin: 0 10px 10px 0;
  text-decoration: none;
  -webkit-transition: color 0.2s;
}

.tag::before {
  background: #fff;
  border-radius: 10px;
  box-shadow: inset 0 1px rgba(0, 0, 0, 0.25);
  content: "";
  height: 6px;
  left: 10px;
  position: absolute;
  width: 6px;
  top: 10px;
}

.tag::after {
  background: #fff;
  border-bottom: 13px solid transparent;
  border-left: 10px solid #eee;
  border-top: 13px solid transparent;
  content: "";
  position: absolute;
  right: 0;
  top: 0;
}

.tag:hover {
  background-color: crimson;
  color: white;
}

.tag:hover::after {
  border-left-color: crimson;
}
</style>
