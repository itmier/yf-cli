const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')

const Generator = require('./Generator')

module.exports = async function (name, options) {
  const cwd = process.cwd()
  const targetAir = path.join(cwd, name)
  if(fs.existsSync(targetAir)) {
    if(options.force) {
      await fs.remove(targetAir)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if(!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\r\nRemoving`);
        await fs.remove(targetAir)
      }
    }
  }
  // 创建项目
  const generator = new Generator(name, targetAir)

  generator.create()
}