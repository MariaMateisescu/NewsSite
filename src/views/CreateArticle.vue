<template>
  <div class="create-article">
    <ArticleCoverPreview v-show="this.$store.state.articlePhotoPreview" />
    <ArticlePreview v-show="this.$store.state.articlePreview" />
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
        <SelectButton
          v-model="selected"
          :options="options"
          optionLabel="name"
        />
      </div>
      <div class="radio-buttons-container">
        <p class="radio-buttons-label">Tags:</p>
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          @tags-changed="(newTags) => (tags = newTags)"
        />
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
        <button class="button" @click="openArticlePreview">
          Article Preview
        </button>
        <button class="button" @click="uploadArticle">Publish Article</button>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCoverPreview from "@/components/ArticleCoverPreview.vue";
import ArticlePreview from "@/components/ArticlePreview.vue";
import SelectButton from "primevue/selectbutton";
import Loading from "@/components/Loading";
import firebase from "firebase/app";
import "firebase/storage";
import db from "../firebase/firebaseInit";
import Quill from "quill";
import VueTagsInput from "@johmun/vue-tags-input";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
  name: "CreateArticle",
  components: {
    ArticleCoverPreview,
    Loading,
    SelectButton,
    ArticlePreview,
    VueTagsInput,
  },
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      tag: "",
      tags: [],
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
      selected: { name: "Other", code: "other" },
      options: [
        { name: "Sports", code: "sports" },
        { name: "Health", code: "health" },
        { name: "Technology", code: "technology" },
        { name: "Business", code: "business" },
        { name: "Politics", code: "politics" },
        { name: "Other", code: "other" },
      ],
    };
  },
  methods: {
    fileChange() {
      this.file = this.$refs.articlePhoto.files[0];
      const fileName = this.file.name;
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },

    openPreview() {
      this.$store.commit("openPhotoPreview");
    },
    openArticlePreview() {
      if (this.articleHTML && this.articleTitle && this.articleCoverPhotoName) {
        this.$store.commit("openArticlePreview");
      } else {
        this.error = true;
        this.errorMsg =
          "Please fill in all fields in order to preview the article!";
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.error = false;
        }, 5000);
      }
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

    uploadArticle() {
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
              const timestamp = await Date.now();
              const dataBase = await db.collection("articles").doc();

              await dataBase.set({
                articleID: dataBase.id,
                articleHTML: this.articleHTML,
                articleCoverPhoto: downloadURL,
                articleCoverPhotoName: this.articleCoverPhotoName,
                articleTitle: this.articleTitle,
                profileId: this.profileId,
                date: timestamp,
                articleCategory: this.selected.code,
                articleTags: this.tags,
              });
              await this.$store.dispatch("getArticle");
              this.loading = false;
              this.$router.push({
                name: "ViewArticle",
                params: { articleid: dataBase.id },
              });
            }
          );
          return;
        }
        this.error = true;
        this.errorMsg = "Please make sure you uploaded a cover photo!";
        setTimeout(() => {
          this.error = false;
        }, 5000);
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
    reset() {
      this.$store.commit("resetArticleFields");
    },
  },
  destroyed() {
    this.reset();
  },
  computed: {
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
.radio-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.radio-buttons-label {
  margin-right: 20px;
  font-size: 16px;
  color: #303030;
}
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

    @media (max-width: 700px) {
      flex-direction: column;
      gap: 10px;
    }

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
