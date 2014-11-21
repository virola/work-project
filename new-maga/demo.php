<?php 
$filedata = file_get_contents('mock/data.json');
$data = json_decode($filedata, true);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
<!-- Force latest IE rendering engine & Chrome Frame -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title><?php echo $data['name'] ?></title>
<meta name="keywords" content="诗集" />
<meta name="description" content="<?php echo $data['description'] ?>" />
<link rel="stylesheet" type="text/css" href="../dep/swiper/dist/idangerous.swiper.css">
<link rel="stylesheet" type="text/css" href="asset/css/base.css">
<link rel="stylesheet" type="text/css" href="asset/css/vertical.css">
<!-- animation -->
<link rel="stylesheet" type="text/css" href="asset/css/animate.css">
<!-- progress -->
<link rel="stylesheet" type="text/css" href="asset/css/progress.css">
</head>
<body>
<div class="main">
    <div id="slide" class="swiper-container">
        <div class="swiper-wrapper">
            <section class="swiper-slide" style="background-image: url(http://virola-eko.com/topic/magazine/mock/bg/1.jpg)">
                <div class="page page-first">
                    <h2 class="title"><?php echo $data['name'] ?></h2>
                    <p><?php echo $data['subtitle'] ?></p>
                </div>
            </section>

            <?php foreach ($data['pages'] as $index=>$page) {?>
            <?php $img = $index+2; if ($img > 10) { $img = 6; } ?>
            <section class="swiper-slide" style="background-image: url(http://virola-eko.com/topic/magazine/mock/bg/<?php echo $img?>.jpg)">
                <div class="page">
                    <h2 class="title"><?php echo $page['title'] ?></h2>
                    <p class=""><?php echo $page['content'] ?></p>
                </div>
            </section>
            <?php } ?>
        </div>
    </div>
    <div class="pagination"></div>
</div>

<!-- arrow -->
<img class="arrow-v arrowing" src="asset/img/v_arrow.png" >

<!-- music -->
<audio id="music" loop="loop" auto="auto" src="http://virola.qiniudn.com/memorize.mp3"></audio>
<img id="music-switch-on" class="music-switcher" src="http://virola-eko.com/asset/music/img/music-on.png" alt="">
<img id="music-switch-off" class="music-switcher" src="http://virola-eko.com/asset/music/img/music-off.png" alt="">

<script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-6/esl.min.js"></script>
<script src="asset/js/effect.js"></script>

<script>

    var pageParams = {};

    require.config({
        baseUrl: 'asset/js',
        paths: {
            'jquery': '//s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194',
            'swiper': '../../../dep/swiper/dist/idangerous.swiper',
            'swiper-smooth-progress': '../../../dep/swiper/plugin/idangerous.swiper.progress.amd.min',
            'util': '//virola-eko.com/topic/magazine/asset/js/util'
        },
        urlArgs: 'v=20141121'
    });

    require(['jquery', 'util', 'main'], function ($, util, main) {

        main.start($.extend({
            mode: 'horizontal',
            loop: 1,
            progress: true
        }, effects[Math.floor(Math.random() * effects.length)]));

        util.weixin.init({
            icon: 'http://virola-eko.com/topic/magazine/mock/bg/7.jpg'
        });
    });
</script>
</body>
</html>