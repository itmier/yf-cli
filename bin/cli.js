#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')
program
.command('create <app-name>')
.description('create a new project')
.option('-f, --force', 'overwrite target directory if it exist')
.action((name, options) => {
  require('../lib/create.js')(name, options)
})

program.on('--help', () => {
  console.log('\r\n' + figlet.textSync('yunfei', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));
  console.log(`\r\nRun ${chalk.cyan(`yf <command> --help`)} for detailed usage of given command\r\n`);
})

program.version(`v${require('../package.json').version}`)
.usage('<command> [option]')

program.parse(process.argv)