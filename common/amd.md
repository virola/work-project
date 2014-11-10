潇湘晨报项目AMD异步加载使用规范
====

原则：

1. 页面中禁止使用内联js；
2. 所有JS都需要模块化；


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


