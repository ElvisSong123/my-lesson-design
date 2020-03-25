/*
 * @Author: your name
 * @Date: 2020-03-22 11:39:30
 * @LastEditTime: 2020-03-25 15:40:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \毕业设计\client\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    companyInfo:''
  },
  mutations: {
    addCompanyInfo(state,payload){
      state.companyInfo = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
