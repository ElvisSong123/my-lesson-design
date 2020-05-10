/*
 * @Author: your name
 * @Date: 2020-03-22 11:39:30
 * @LastEditTime: 2020-05-10 10:11:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyInfo:'',
    currentUser:'',
    commonAvatar:'',
  },
  mutations: {
    addCompanyInfo(state,payload){
      state.companyInfo = payload;
    },
    addCurrentUser(state,payload){
      state.currentUser = payload;
    },
    addAvatar(state,payload){
      state.commonAvatar = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
