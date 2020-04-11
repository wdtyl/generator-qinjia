//包装函数
module.exports = function (grunt) {
    // 项目配置信息
    grunt.config.init({
        pkg:grunt.file.readJSON("package.json"),
        //代码合并
        concat:{
            options:{
                stripBanners:true,
             banner:'/*项目名称：<%=pkg.name%> 项目版本：<%=pkg.version%> 项目的作者：<%=pkg.author%> 更新时间：<%=grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            target:{
                src:["src/js/*.js"],
                dest:'build/js/index.js'
            }
        },
        //js代码压缩
        uglify:{
            target:{
                src:"build/js/index.js",
                dest:"build/js/index.min.js"
            }
        },
        //css代码压缩
        cssmin:{
            target:{
                src:"src/css/style.css",
                dest:"build/css/style.min.css"
            }
        },
        //js语法检查
        jshint:{
            target:['Gruntfile.js',"dist/js/index.js"],
        },
        //监听 自动构建
        watch:{
            target:{
                files:["src/js/*.js","src/css/*.css"],
                //只要指定路径的文件(js和css)发生了变化，就自动执行tasks中列出的任务
                tasks:["concat","jshint","uglify","cssmin"]
            }
        }
    });
    //通过命令行安装插件（省略...）
    //从node_modules路径加载插件
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    //注册任务：在执行$ grunt命令的时候依次执行代码的合并|检查|压缩等任务并开启监听
    grunt.registerTask("default",["concat","jshint","uglify","cssmin","watch"]);
};