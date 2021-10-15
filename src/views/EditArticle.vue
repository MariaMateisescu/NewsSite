<template>
  <div class="create-article">
    <ArticleCoverPreview v-show="this.$store.state.articlePhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ errorMsg }}</p>
      </div>
      <div class="article-info">
        <input
          type="text"
          placeholder="Enter Article Title"
          v-model="articleTitle"
        />
        <div class="upload-file">
          <label for="article-photo">Upload Cover Photo</label>
          <input
            type="file"
            ref="articlePhoto"
            id="article-photo"
            @change="fileChange"
            accept=".png, .jpg, .jpeg"
          />
          <button
            @click="openPreview"
            class="button preview"
            :class="{ 'button-inactive': !$store.state.articlePhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ $store.state.articlePhotoName }}</span>
        </div>
      </div>
      <div class="radio-buttons-container">
        <p class="radio-buttons-label">Category:</p>
        <b-form-group
          v-slot="{ ariaDescribedby }"
          @input="changeCategory(checked)"
        >
          <b-form-radio-group
            id="btn-radios-1"
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radios-btn-default"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="editor">
        <vue-editor
          :editorOptions="editorSettings"
          v-model="articleHTML"
          useCustomImageHandler
          @image-added="imageHandler"
        ></vue-editor>
      </div>
      <div class="article-actions">
        <router-link class="router-button" :to="{ name: 'ArticlePreview' }"
          >Preview Changes</router-link
        >
        <button class="button" @click="updateArticle">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCoverPreview from "@/components/ArticleCoverPreview.vue";
import Loading from "@/components/Loading";
import firebase from "firebase/app";
import "firebase/storage";
import db from "../firebase/firebaseInit";
import Quill from "quill";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
  name: "CreateArticle",
  components: {
    ArticleCoverPreview,
    Loading,
  },
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      routeID: null,
      currentArticle: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
      options: [
        { text: "Sports", value: "sports" },
        { text: "Health", value: "health" },
        { text: "Technology", value: "technology" },
        { text: "Business", value: "business" },
        { text: "Politics", value: "politics" },
        { text: "Other", value: "other" },
      ],
    };
  },
  async mounted() {
    this.routeID = this.$route.params.articleid;
    this.currentArticle = await this.$store.state.articles.filter((articol) => {
      return articol.articleID === this.routeID;
    });
    this.$store.commit("setArticleState", this.currentArticle[0]);
  },
  methods: {
    changeCategory(checked) {
      this.$store.commit("updateArticleCategory", checked);
    },
    fileChange() {
      this.file = this.$refs.articlePhoto.files[0];
      const fileName = this.file.name;
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },

    openPreview() {
      this.$store.commit("openPhotoPreview");
    },

    imageHandler(file, Editor, cursorLocation, resetUploader) {
      const storageRef = firebase.storage().ref();
      const docRef = storageRef.child(`documents/articlePhotos/${file.name}`);
      docRef.put(file).on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          const downloadURL = await docRef.getDownloadURL();
          Editor.insertEmbed(cursorLocation, "image", downloadURL);
          resetUploader();
        }
      );
    },

    async updateArticle() {
      const dataBase = await db.collection("articles").doc(this.routeID);
      if (this.articleTitle.length !== 0 && this.articleHTML.length !== 0) {
        if (this.file) {
          this.loading = true;
          const storageRef = firebase.storage().ref();
          const docRef = storageRef.child(
            `documents/articleCoverPhotos/${this.$store.state.articlePhotoName}`
          );
          docRef.put(this.file).on(
            "state_changed",
            (snapshot) => {
              console.log(snapshot);
            },
            (err) => {
              console.log(err);
              this.loading = false;
            },
            async () => {
              const downloadURL = await docRef.getDownloadURL();

              await dataBase.update({
                articleHTML: this.articleHTML,
                articleCoverPhoto: downloadURL,
                articleCoverPhotoName: this.articleCoverPhotoName,
                articleTitle: this.articleTitle,
                articleCategory: this.selected,
              });
              await this.$store.dispatch("updateArticle", this.routeID);
              this.loading = false;
              this.$router.push({
                name: "ViewArticle",
                params: { articleid: dataBase.id },
              });
            }
          );
          return;
        }
        this.loading = true;
        await dataBase.update({
          articleHTML: this.articleHTML,
          articleTitle: this.articleTitle,
          articleCategory: this.selected,
        });
        await this.$store.dispatch("updateArticle", this.routeID);
        this.loading = false;
        this.$router.push({
          name: "ViewArticle",
          params: { articleid: dataBase.id },
        });
        return;
      }
      this.error = true;
      this.errorMsg =
        "Please make sure Article Title and Article Text has been filled!";
      setTimeout(() => {
        this.error = false;
      }, 5000);
      return;
    },
  },
  computed: {
    selected: {
      get() {
        return this.$store.state.articleCategory;
      },
      set(payload) {
        this.$store.commit("updateArticleCategory", payload);
      },
    },
    profileId() {
      return this.$store.state.profileId;
    },
    articleCoverPhotoName() {
      return this.$store.state.articlePhotoName;
    },
    articleTitle: {
      get() {
        return this.$store.state.articleTitle;
      },
      set(payload) {
        this.$store.commit("updateArticleTitle", payload);
      },
    },
    articleHTML: {
      get() {
        return this.$store.state.articleHTML;
      },
      set(payload) {
        this.$store.commit("newArticle", payload);
      },
    },
  },
};
</script>

<style lang="scss">
.create-article {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: white;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: white;
    background-color: #303030;
    text-decoration: none;

    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: white;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .article-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }

    .ql-editor {
      padding: 20px 16px 30px;
    }
  }

  .article-actions {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;

    button {
      margin-right: 16px;
    }
  }
}
</style>
