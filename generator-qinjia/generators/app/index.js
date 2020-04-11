"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the peachy ${chalk.red(
          "generator-qinjia"
        )} generator!\n Author:蜗牛不会跑`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "appName",
        message: "请输入项目名称:",
        default: this.appname
      },
      {
        type: "input",
        name: "appAuthor",
        message: "请输入作者姓名:",
        default: "蜗牛不会跑"
      },
      {
        type: "input",
        name: "appLicense",
        message: "请选择使用的license",
        choices: ["MIT", "ISC", "Apache-2.0", "AGPL-3.0"]
      },
      {
        type: "confirm",
        name: "isIncludeBootstrap",
        message: "是否需要bootStrap框架",
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    mkdirp(this.props.appName + "/build");
    mkdirp(this.props.appName + "/dist");
    mkdirp(this.props.appName + "/src");
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath(this.props.appName + "/src/index.html"),
      { appName: this.props.appname }
    );

    this.fs.copy(
      this.templatePath("Gruntfile.js"),
      this.destinationPath(this.props.appName + "/Gruntfile.js")
    );
    this.fs.copy(
      this.templatePath("js/index.js"),
      this.destinationPath(this.props.appName + "/src/js/index.js")
    );
    this.fs.copy(
      this.templatePath("css/style.css"),
      this.destinationPath(this.props.appName + "/src/css/style.css")
    );
    this.fs.copy(
      this.templatePath(".bowerrc"),
      this.destinationPath(this.props.appName + "/.bowerrc")
    );
    this.fs.copy(
      this.templatePath("package.json"),
      this.destinationPath(this.props.appName + "/package.json"),
      {
        appName: this.props.appName,
        appAuthor: this.props.appAuthor,
        appLicense: this.props.appLicense
      }
    );
    this.fs.copy(
      this.templatePath("bower.json"),
      this.destinationPath(this.props.appName + "/bower.json"),
      {
        appName: this.props.appName,
        appAuthor: this.props.appAuthor,
        appLicense: this.props.appLicense,
        isIncludeBootstrap: this.props.isIncludeBootstrap
      }
    );
  }

  install() {
    // this.installDependencies();
  }
};
