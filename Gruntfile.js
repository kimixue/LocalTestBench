'use sctrie';
module.exports = function(grunt){
 require('load-grunt-tasks')(grunt);
 require('time-grunt')(grunt);
 var config = {
 	webapp:'webapp',
 	dist:'dist'
 };
 grunt.initConfig({
 	config:config,
 	concat:{
 		js:{
 			src:'webapp/js/**.js',
 			dest:'webapp/js/index.min.js'
 		}
 	},
 	clean:{
 		js:{
 			src:'webapp/js/index.min.js'
 		}
 	},
  autoprefixer:{
    options:{
      browsers: ['last 2 versions', 'ie 8', 'ie 9']
    },
    build: {
      expand: true,
      cwd: 'webapp/style',
      src: [ '**/*.css' ],
      dest: 'webapp/style'
    },
    watch:{
         styles:{
              files : ['webapp/style/css/main.css'],
              tasks : ['autoprefixer' ]
         }
    }
  },
 	sass: {
		dist: {
		  files: {
		    'webapp/style/css/mian.css': 'webapp/style/scss/main.scss',
		  }
		}
	},
 	 connect: {
      options: {
        port: 8080,
        hostname: '10.240.138.72', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
        livereload: 35729  //声明给 watch 监听的端口
      },
      server: {
        options: {
          open: true, //自动打开网页 http://
          base: [
            'webapp'  //主目录
          ]
        }
      }
    },
     watch: {
      livereload: {
        options: {
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },

        files: [  //下面文件的改变就会实时刷新网页
          'webapp/*.html',
          'webapp/style/{,*/}*.scss',
          'webapp/js/{,*/}*.js',
          'webapp/img/{,*/}*.{png,jpg,gif}'
        ],
        tasks:['sass']
      },
    //   sass: {
    //     files: 'webapp/style/**/*.scss',
    //     tasks: 'sass'
    // }
    },
 	inline:{  //静态资源缓存到页面中  比如<script src="js/erport.js?__inline=true"></script>要在资源后面加上?__inline=true
 		dist: {
      options: {
          cssmin: true, // 压缩css文件
          uglify: true  // 压缩js文件
      },
      src: 'webapp/index.html'
    }
 	},
  uglify: {
     options: {
     },
     dist: {
         files: {
             'webapp/js/default.min.js': 'webapp/js/*.js'
         }
     }
 },
 cssmin: {
     options: {
         keepSpecialComments: 0
     },
     compress: {
         files: {
             'webapp/style/css/default.css': 'webapp/style/css/*.css'
         }
     }
 },
  rev:{
    options:{
      encoding:'utf8',
      algorithm:'md5',
      length:8
    },
    img:{
      files:{
        src:[
          'webapp/style/**/*.{jpg,jpeg,gif,png,ico}'
        ]
      }
    },
    cssJs:{
      files:{
        src:[
          'webapp/style/**/*.css',
          'webapp/js/*.js'
        ]
      }
    }
  },
  copy: {
    jq:{
      expand: true,
      dot: true,
      cwd: '.',
      src: 'bower_components/jquery/dist/jquery.min.js',
      dest: 'webapp/js/',
      flatten: true,  //不复制文件路径 只复制文件
      filter: 'isFile'
    }
  },
 	usemin:{
        css:{
            files:{
                src:['webapp/style/css/*.css']
            }
        },
        js:['webapp/js/*.js'],
        html:['webapp/index.html'],
        options:{                    //替换静态文件引地址前缀
            filePrefixer:function(url){
                if(!url){
                    return '';
                }
                return url.replace('../..','<%=request.getContextPath()%>');
            },
            patterns: {
                js: [
                    [/(img\.png)/, 'Replacing reference to image.png']
                ]
            }
        }
    }
 });
  grunt.registerTask('serve', [
      'connect:server',
      'watch',
      'autoprefixer',
      'copy'
   ]);
  grunt.registerTask('bulid', [
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);
  grunt.registerTask('default', ['clean','concat']);

};