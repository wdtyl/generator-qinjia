#!/usr/bin/env node
/**
 * process.cwd()返回当前目录
 * glob.sync('*')  // 遍历当前目录
 * fs.statSync(fullPath).isDirectory()来判断是否是文件目录
 *ora - 显示spinner，在终端上等待没那么无聊
 *chalk - 给枯燥的终端界面添加一些色彩chalk可以给终端文字设置颜色。
 *使用download-git-repo下载模板
 *怎么把这些输入的内容插入到模板中呢——metalsmith。
 *模板引擎我选择handlebars。当然，还可以有其他选择，例如ejs、jade、swig。
 *#!/usr/bin/env node是干嘛的，有个关键词叫Shebang：http://smilejay.com/2012/03/linux_shebang/
//，新项目的名称、版本号、描述等信息可以直接通过终端交互插入到项目模板中，那么再进一步完善交互流程。npm i latest-version -D

  path.basename() 方法返回 path 的最后一部分，类似于 Unix 的 basename 命令。 尾部的目录分隔符将被忽略，参阅 path.sep。
  path.basename('/foo/bar/baz/asdf/quux.html');
  // 返回: 'quux.html'
   path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'

metalsmith:处理模板它就是一个静态网站生成器，可以用在批量处理模板的场景，类似的工具包还有Wintersmith、Assemble、Hexo。
它最大的一个特点就是EVERYTHING IS PLUGIN，所以，metalsmith本质上就是一个胶水框架，通过黏合各种插件来完成生产工作.

美化我们的脚手架
通过一些工具包，让脚手架更加人性化。这里介绍两个在vue-cli中发现的工具包：

ora - 显示spinner，在终端上等待没那么无聊
chalk - 给枯燥的终端界面添加一些色彩

模板引擎我选择handlebars(模板添加变量占位符)。当然，还可以有其他选择，例如ejs、jade、swig。
 * */
const download = require("../lib/download");
const program = require("commander");
const path = require("path");
const fs = require("fs");
const glob = require("glob"); // npm i glob -D
const inquirer = require("inquirer"); //命令行交互的功能
// 这个模块可以获取node包的最新版本
const latestVersion = require("latest-version"); // npm i latest-version -D
const chalk = require("chalk"); // 给枯燥的终端界面添加一些色彩
const logSymbols = require("log-symbols");

program.usage("<project-name>").parse(process.argv);

// 根据输入，获取项目名称
let projectName = program.args[0];
console.log(projectName, "=====>projectName");
if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help();
  return;
}

const list = glob.sync("*"); // 遍历当前目录
console.log(list, "=====>list");
let next = undefined;
let rootName = path.basename(process.cwd()); //返回当前文件名如xxxx/name.html,返回name.html
console.log(rootName, "=====>rootName");
if (list.length) {
  if (
    list.filter((name) => {
      console.log(name, "=====>name");
      const fileName = path.resolve(process.cwd(), path.join(".", name)); //process.cwd()返回当前目录
      console.log(fileName, "=====>fileName");
      const isDir = fs.statSync(fileName).isDirectory(); //s.statSync(fullPath).isDirectory()来判断是否是文件目录
      console.log(isDir, "=====>isDir");
      return name.indexOf(projectName) !== -1 && isDir;
    }).length !== 0
  ) {
    console.log(`项目${projectName}已经存在`);         
    return;
  }
  next = Promise.resolve(projectName);
} else if (rootName === projectName) {
  next = inquirer
    .prompt([
      {
        name: "buildInCurrent",
        message:
          "当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？",
        type: "confirm",
        default: true,
      },
    ])
    .then((answer) => {
      return Promise.resolve(answer.buildInCurrent ? "." : projectName);
    });
} else {
  next = Promise.resolve(projectName);
}

next && go();
//tips：墙裂推荐一下tj的另一个工具包：consolidate.js，在vue-cli中发现的，感兴趣的话可以去了解一下。
// 你的node.js版本如果在8以下，可以用stream和pipe的方式实现，如果是8或者9，可以使用新的API——copyFile()或者copyFileSync()。
function go() {
  next
    .then((projectRoot) => {
      console.info('projectRoot======', projectRoot)
      if (projectRoot !== ".") {
        fs.mkdirSync(projectRoot);
      }
      return download(projectRoot).then((target) => {
        return {
          name: projectRoot,
          root: projectRoot,
          downloadTemp: target,
        };
      });
    })
    .then((context) => {
      return inquirer
        .prompt([
          {
            name: "projectName",
            message: "项目的名称",
            default: context.name,
          },
          {
            name: "projectVersion",
            message: "项目的版本号",
            default: "1.0.0",
          },
          {
            name: "projectDescription",
            message: "项目的简介",
            default: `A project named ${context.name}`,
          },
        ])
        .then((answers) => {
          return latestVersion("macaw-ui").then((version) => {
            answers.supportUiVersion = version;
            return {
              ...context,
              metadata: {
                ...answers,
              },
            };
          });
        });
    })
    .then((context) => {
      // 成功用绿色显示，给出积极的反馈
      console.log(logSymbols.success, chalk.green("创建成功:)"));
      console.log();
      console.log(
        chalk.green("cd " + context.root + "\nnpm install\nnpm run dev")
      );
      // 添加生成的逻辑
      return generator(context.metadata, context.root);
    })
    .catch((err) => {
      // 失败了用红色，增强提示
      console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`));
    });
}
