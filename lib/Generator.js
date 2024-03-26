/*
 * @Author: Tmier
 * @Date: 2024-03-25 19:55:53
 * @LastEditTime: 2024-03-26 23:01:36
 * @LastEditors: Tmier
 * @Description: 
 * 
 */
const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const chalk = require('chalk')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('Request failed, refetch')
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir

    // 对 download-git-repo 进行promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 下载远程模板
  async download(repo, tag) {
    // const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`
    const requestUrl = tag ? `yf-cli/${repo}${tag?'#'+tag:''}` : `yf-cli/${repo}#master`
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir) // 参数2 创建位置
    )
  }
  // 获取远程仓库模板
  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'wait fetch template')
    if(!repoList) return
    // 过滤模板
    const repos = repoList.map(item => (`${item.description ? item.name + ': ' + chalk.grey(item.description) : item.name}`))
    
    // 用户选择自己下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })
    return repo
  }
  // 获取远程仓库tag
  async getTag(repo) {
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if(!tags) return
    // 过滤我们需要的tag名称
    const tagsList = tags.map(item => item.name)
    // 用户选择自己需要下载的tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Please choose a tag to create project'
    })
    return tag
  }
  // 核心创建逻辑
  async create() {
    let repo = await this.getRepo()
    repo = repo?.split(':')?.[0]
    let tag = await this.getTag(repo) || ''
    tag = tag?.split(':')?.[0]
    await this.download(repo, tag)
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm install\r\n')
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator