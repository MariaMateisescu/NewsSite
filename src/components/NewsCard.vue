<template>
  <div class="article-card">
    <div v-show="showEditArticle" class="icons">
      <div @click="editArticle" class="icon">
        <Edit class="edit"></Edit>
      </div>
      <div @click="deleteArticle" class="icon">
        <Delete class="delete"></Delete>
      </div>
    </div>
    <img :src="articol.articleCoverPhoto" alt="" />
    <div @click="goToArticleView" class="info">
      <h4>{{ articol.articleTitle }}</h4>
      <h6>
        Posted on:
        {{
          new Date(articol.articleDate).toLocaleString("en-us", {
            dateStyle: "long",
          })
        }}
      </h6>
      <ul class="tags">
        <li v-for="tag in tags" :key="tag" @click="goToTag(tag, $event)">
          <a class="tag">{{ tag }}</a>
        </li>
      </ul>
      <router-link
        class="link"
        :to="{
          name: 'ViewArticle',
          params: { articleid: articol.articleID },
        }"
        >read the article <Arrow class="arrow"></Arrow
      ></router-link>
      <bookmarkIcon
        @click="bookmarkArticle"
        :class="{
          clicked: isClicked,
        }"
        class="bookmark-icon"
      ></bookmarkIcon>
    </div>
  </div>
</template>

<script>
import bookmarkIcon from "../assets/Icons/bookmark-shapes-svgrepo-com.svg";
import Arrow from "@/assets/Icons/arrow-right-light.svg";
import Edit from "@/assets/Icons/edit-regular.svg";
import Delete from "@/assets/Icons/trash-regular.svg";
export default {
  name: "newsCard",
  props: ["articol"],
  components: {
    Arrow,
    Edit,
    bookmarkIcon,
    Delete,
  },
  computed: {
    tags() {
      if (this.articol.articleTags)
        return this.articol.articleTags.map((tag) => tag.text);
      return "";
    },
    showEditArticle() {
      return this.$store.state.editArticle;
    },
    isClicked() {
      if (
        this.$store &&
        this.$store.state &&
        this.$store.state.bookmarkArticles &&
        this.$store.state.bookmarkArticles.some(
          (article) => article.articleID === this.articol.articleID
        )
      ) {
        return true;
      } else return false;
    },
  },
  methods: {
    goToArticleView() {
      this.$router.push({
        name: "ViewArticle",
        params: { articleid: this.articol.articleID },
      });
    },
    deleteArticle() {
      this.$store.dispatch("deleteArticle", this.articol.articleID);
    },
    editArticle() {
      this.$router.push({
        name: "EditArticle",
        params: { articleid: this.articol.articleID },
      });
    },
    goToTag(tag, event) {
      event.cancelBubble = true;
      if (event.stopPropagation) event.stopPropagation();
      this.$router.push({
        name: "Tags",
        params: { tag: tag },
      });
    },
    async bookmarkArticle(event) {
      event.cancelBubble = true;
      if (event.stopPropagation) event.stopPropagation();
      if (this.isClicked === false) {
        this.$store.dispatch("bookmarkArticle", this.articol);
      } else {
        this.$store.dispatch("unbookmarkArticle", this.articol);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bookmark-icon {
  margin-top: 10px;
  width: 25px;
  height: auto;
  position: absolute;
  right: 16px;
  bottom: 32px;
}
.clicked {
  fill: crimson;
}
.article-card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: white;
  min-height: 420px;
  transition: 0.5s ease all;

  &:hover {
    transform: rotateZ(-1deg) scale(1.01);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .icons {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: white;
      transition: 0.5 ease all;

      &:hover {
        background-color: #303030;

        .edit,
        .delete {
          path {
            fill: white;
          }
        }
      }

      &:nth-child(1) {
        margin-right: 8px;
      }

      .edit,
      .delete {
        pointer-events: none;
        height: 15px;
        width: auto;
      }
    }
  }

  img {
    display: block;
    border-radius: 8px 8px 0 0;
    z-index: 1;
    width: 100%;
    min-height: 200px;
    object-fit: cover;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 3;
    padding: 32px 16px;
    color: black;

    h4 {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
    }

    h6 {
      font-weight: 400;
      font-size: 12px;
      padding-bottom: 16px;
    }

    .link {
      display: inline-flex;
      align-items: center;
      margin-top: auto;
      font-weight: 500;
      padding-top: 20px;
      font-size: 12px;
      padding-bottom: 4px;
      transition: 0.5s ease-in all;

      &:hover {
        color: rgba(48, 48, 48, 0.8);
      }

      .arrow {
        width: 10px;
      }
    }
  }
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
