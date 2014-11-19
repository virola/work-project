潇湘晨报项目AMD异步加载使用规范
====

原则：

1. 页面中禁止使用内联js；
2. PC端所有包含公共业务或UI组件的JS都需要模块化（例如slide幻灯片, ajax公共处理模块, data数据公共处理模块）；
3. 移动端考虑到代码复杂度，可以不使用模块化；如果不使用模块化，则必须将JS引入置于页脚；


##如何模块化

### 定义AMD规范模块

参考示例：

    // index.js
    
    define(function (require) {
        
        var index = {};
        
        index.init = function () {
            $('#somebuttom').on('click', function () {
                // TODO...
            });
        };
        
        return index;    
    });

### 让同步引用的脚本兼容AMD规范

以`util`模块为例：

    // util.js

    var util = window.util || {};

    util.trim = function () {
        // ...
    };

    // other methods
    // ...


    // 在脚本末尾加上判断是否AMD异步加载
    // 如果是的话，就定义一个AMD模块
    if (typeof define === 'function' && define.amd) {
        define('util', [], function() {
            return util;
        });
    }



## 如何使用AMD模块

参考示例，如何在html中使用上面那个已经模块化的JS：

    // index.html
    
    <DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>index</title>
    </head>
    
    <body>
        
        <!-- content elements -->

        <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-8/esl.min.js"></script>
        <script>
        require.config({
            // 设定JS加载的基础路径，根据项目实际情况修改
            baseUrl: 'asset/js',  
            
            // 指定某个具体模块的加载路径，根据项目实际情况修改
            paths: {
                'jquery': 'http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194'
            }
        });
        
        require(['index', 'jquery'], function (index, $) {
            index.init();
        });
        </script>
    </body>
    </html>
    

###模块加载器
建议使用[ESL](https://github.com/ecomfe/esl)

CDN引用：

    <!-- normal -->
    <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-6/esl.js"></script>

    <!-- min -->
    <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-6/esl.min.js"></script>

    <!-- source -->
    <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-6/esl.source.js"></script>
