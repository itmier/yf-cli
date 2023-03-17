/*
 * @Author: 王云飞
 * @Date: 2023-03-17 15:27:59
 * @LastEditTime: 2023-03-17 23:36:44
 * @LastEditors: 王云飞
 * @Description: 
 * 
 */
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

/**
 * @description: 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  // return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
  return axios.get('https://api.github.com/orgs/yf-cli/repos')
}

async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/yf-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}