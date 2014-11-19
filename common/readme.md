基础库和公共模块使用标准
=====
@潇湘晨报新媒体部-产品研发组

##PC端

###公共库
第三方依赖的基础库。存放目录：

    s1.94uv.com/module/dep

#### jQuery

目录： `s1.94uv.com/module/dep/jquery`

目前有 `jquery-1.9.1` 和 `jquery-1.11.1` 两个版本，分别是稳定版和最新版，可按需取用。

jQuery基础库从1.7之后的版本均支持异步模块加载，使用时需遵循AMD规范。


#### jQuery-ui

目录： `s1.94uv.com/module/dep/jqueryui`

jquery-ui从**1.11**版本之后开始支持AMD规范，因此如果要使用jquery-ui的异步模块加载，那么需要使用**1.11**之后的版本；

- 文档： (如何使用遵循AMD规范的jquery-ui)[http://learn.jquery.com/jquery-ui/environments/amd/]

如果要使用1.11之前的版本，那么只能用**同步引用**的方式引入jQuery和jQuery-ui。


#### 线上公共库的地址

- jquery: 
    - baidu cdn: `http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194`
    - 94uv: `http://s1.94uv.com/module/dep/jquery/jquery-1.9.1.min`
- jquery-ui: 
    - 94uv: `http://s1.94uv.com/module/dep/jqueryui/jqueryui-1.9.2.min.js`

### 公共模块

公共组件和通用UI标准。存放目录：

    s1.94uv.com/module/common

公共组件的加入需要遵循目录规范，要求具备组件的demo页、js文件、样式文件、组件说明文档（markdown语法）。

目录规范示例：

    slide.html
    slide.js
    slide.css
    slide.md


#### slide 幻灯片
应用场景：晨报官网首页、新闻、影像、有味网等，有样式差别

#### 公共模板

有味网
- 公共头部导航
- 公共底部导航


##移动端

### 公共库
第三方依赖的基础库。存放目录：

    s2.94uv.com/module/dep

#### jquery
目录： `s2.94uv.com/module/dep/jquery`

- `jquery-1.9.1.min.js`


#### zepto.js
zepto.js <http://zeptojs.com> 提供和jQuery类似的API，更适合移动端的轻量级框架。（压缩版大小不到10K）

目录： `s2.94uv.com/module/dep/zeptojs`

- `zepto-1.1.4.min.js`

#### jQuery mobile

- jQuery Mobile 是创建移动 web 应用程序的框架。
- jQuery Mobile 适用于所有流行的智能手机和平板电脑。
- jQuery Mobile 使用 HTML5 和 CSS3 通过尽可能少的脚本对页面进行布局。

教程：

+ 官网： <http://jquerymobile.com>
+ 中文教程： <http://www.w3school.com.cn/jquerymobile/>

目录： `s2.94uv.com/module/dep/jquery-mobile`

使用版本： `1.4.5`

### 公共模块

公共组件和通用UI标准。存放目录：

    s2.94uv.com/module/common

公共组件的加入需要遵循目录规范，要求具备组件的demo页、js文件、样式文件、组件说明文档（markdown语法）。

目录规范示例：

    slide.html
    slide.js
    slide.css
    slide.md





