潇湘晨报项目AMD异步加载使用规范
====

原则：

1. 页面中禁止使用内联js；
2. PC端所有包含公共业务或UI组件的JS都需要模块化（例如slide幻灯片, ajax公共处理模块, data数据公共处理模块）；
3. 移动端考虑到代码复杂度，可以不使用模块化；如果不使用模块化，则必须将JS引入置于页脚；


##如何模块化

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
    


