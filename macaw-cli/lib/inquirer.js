//命令行交互的功能，可以用inquirer.js来处理
const inquirer = require('inquirer')  // npm i inquirer -D

inquirer.prompt([
  {
    name: 'projectName',
    message: '请输入项目名称'
  }
]).then(answers => {
  console.log(`你输入的项目名称是：${answers.projectName}`)
})
