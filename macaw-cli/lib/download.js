// npm i ora -D 下载模版
const download = require("download-git-repo");
const ora = require("ora");
const path = require('path');

module.exports = function (target) {
  target = path.join(target || ".", ".download-temp");
  console.info(target,"======target==================")
  return new Promise(function (resolve, reject) {
    {
      const url = "https://github.com/wdtyl/Frame.git#master";
      const spinner = ora(`正在下载项目模板，源地址：${url}`);
      spinner.start();
      download(url, target, { clone: true }, (err) => {
        if (err) {
          spinner.fail(); // wrong :(
          reject(err);
        } else {
          spinner.succeed(); // ok :)
          resolve(target);
        }
      });
    }
  });
};
