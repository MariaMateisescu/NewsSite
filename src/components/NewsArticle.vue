<template>
  <div class="article-wrapper" :class="{ 'no-user': !user }">
    <div class="article-content">
      <div>
        <h2 v-if="articol.welcomeScreen">{{ articol.title }}</h2>
        <h2 v-else>{{ articol.articleTitle }}</h2>
        <p v-if="articol.welcomeScreen">{{ articol.content }}</p>
        <p class="content-preview" v-else v-html="articol.articleHTML"></p>
        <router-link
          class="link link-light"
          v-if="articol.welcomeScreen"
          :to="{ name: 'Login' }"
          >login/register <Arrow class="arrow arrow-light"></Arrow>
        </router-link>
        <router-link
          class="link"
          v-else
          :to="{
            name: 'ViewArticle',
            params: { articleid: articol.articleID },
          }"
          >read the article <Arrow class="arrow"></Arrow>
        </router-link>
      </div>
    </div>
    <div class="article-photo">
      <img
        v-if="articol.welcomeScreen"
        :src="require(`@/assets/articlePhotos/${articol.photo}.jpg`)"
        alt=""
      />
      <img v-else :src="articol.articleCoverPhoto" alt="" />
    </div>
  </div>
</template>

<script>
import Arrow from "@/assets/Icons/arrow-right-light.svg";
export default {
  name: "articol",
  components: { Arrow },
  props: ["articol"],

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.article-wrapper {
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  @media (min-width: 700px) {
    min-height: 650px;
    max-height: 650px;
    flex-direction: row;
  }

  .article-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 4;
    order: 2;
    @media (min-width: 700px) {
      order: 1;
    }
    @media (min-width: 800px) {
      flex: 3;
    }

    div {
      max-width: 375px;
      padding: 72px 24px;
      @media (min-width: 700px) {
        padding: 0 24px;
      }

      h2 {
        font-size: 32px;
        font-weight: 300;
        text-transform: uppercase;
        margin-bottom: 24px;
        @media (min-width: 700px) {
          font-size: 40px;
        }
      }

      p {
        font-size: 15px;
        font-weight: 300;
        line-height: 1.7;
      }

      .content-preview {
        font-size: 13px;
        max-height: 24px;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .link {
        display: inline-flex;
        align-items: center;
        margin-top: 32px;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;
        transition: 0.5s ease-in all;

        &:hover {
          border-bottom-color: #303030;
        }
      }

      .link-light {
        &:hover {
          border-bottom-color: white;
        }
      }
    }
  }

  .article-photo {
    order: 1;
    flex: 3;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    @media (min-width: 700px) {
      order: 2;
    }
    @media (min-width: 800px) {
      flex: 4;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &:nth-child(even) {
    .article-content {
      order: 2;
    }
    .article-photo {
      order: 1;
    }
  }
}

.no-user:first-child {
  .article-content {
    background-color: #303030;
    color: white;
  }
}
</style>
