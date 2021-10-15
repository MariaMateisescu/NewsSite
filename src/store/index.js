import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    articles: [],
    articleLoaded: null,
    articleHTML: "Write your article title here...",
    articleTitle: "",
    articlePhotoName: "",
    articlePhotoFileURL: null,
    articlePhotoPreview: null,
    articleCategory: null,
    editArticle: null,
    user: null,
    profileAdmin: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,
  },
  getters: {
    articlesFeed(state) {
      return state.articles.slice(0, 3);
    },
    articlesCards(state) {
      return state.articles.slice(3, 7);
    },
  },
  mutations: {
    newArticle(state, payload) {
      state.articleHTML = payload;
    },
    updateArticleTitle(state, payload) {
      state.articleTitle = payload;
    },
    fileNameChange(state, payload) {
      state.articlePhotoName = payload;
    },
    createFileURL(state, payload) {
      state.articlePhotoFileURL = payload;
    },
    updateArticleCategory(state, payload) {
      state.articleCategory = payload;
    },
    openPhotoPreview(state) {
      state.articlePhotoPreview = !state.articlePhotoPreview;
    },
    toggleEditArticle(state, payload) {
      state.editArticle = payload;
    },
    setArticleState(state, payload) {
      state.articleTitle = payload.articleTitle;
      state.articleHTML = payload.articleHTML;
      state.articlePhotoFileURL = payload.articleCoverPhoto;
      state.articlePhotoName = payload.articleCoverPhotoName;
      state.articleCategory = payload.articleCategory;
    },
    filterArticle(state, payload) {
      state.articles = state.articles.filter(
        (articol) => articol.articleID !== payload
      );
    },
    updateUser(state, payload) {
      state.user = payload;
    },
    setProfileAdmin(state, payload) {
      state.profileAdmin = payload;
      console.log(state.profileAdmin);
    },
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
    },
    setProfileInitials(state) {
      state.profileInitials =
        state.profileFirstName
          .match(/(\b\S)?/g)
          .join("")
          .toUpperCase() +
        state.profileLastName
          .match(/(\b\S)?/g)
          .join("")
          .toUpperCase();
    },
    changeFirstName(state, payload) {
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      state.profileLastName = payload;
    },
    changeUsername(state, payload) {
      state.profileUsername = payload;
    },
  },
  actions: {
    async getCurrentUser({ commit }, user) {
      const dataBase = await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();
      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");
      const token = await user.getIdTokenResult();
      const admin = await token.claims.admin;
      commit("setProfileAdmin", admin);
    },
    async getArticle({ state }) {
      const dataBase = await db.collection("articles").orderBy("date", "desc");
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if (!state.articles.some((article) => article.articleID === doc.id)) {
          const data = {
            articleID: doc.data().articleID,
            articleHTML: doc.data().articleHTML,
            articleCoverPhoto: doc.data().articleCoverPhoto,
            articleTitle: doc.data().articleTitle,
            articleDate: doc.data().date,
            articleCoverPhotoName: doc.data().articleCoverPhotoName,
            articleCategory: doc.data().articleCategory,
          };
          state.articles.push(data);
        }
      });
      state.articleLoaded = true;
    },
    async updateArticle({ commit, dispatch }, payload) {
      commit("filterArticle", payload);
      await dispatch("getArticle");
    },
    async deleteArticle({ commit }, payload) {
      const getArticle = await db.collection("articles").doc(payload);
      await getArticle.delete();
      commit("filterArticle", payload);
    },
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials");
    },
  },
  modules: {},
});
