function resizePic_temp(e, t, i, s, n) {
    function r(e, t, i, s) {
        var n = 0,
            r = e,
            a = t;
        switch (e > i && (n += 1), t > s && (n += 2), n) {
            case 1:
                r = i, a = t * i / e;
            case 2:
                a = s, r = e * s / t;
            case 3:
                a = t / s > e / i ? s : t * i / e, r = t / s > e / i ? e * s / t : i
        }
        return 0 != n && (l = !0), [r, a]
    }
    var a = t || 120,
        c = i || 120,
        l = !1,
        p = new Image;
    p.src = e.src;
    var h = r(p.width, p.height, a, c);
    return e.style.width = h[0] + "px", e.style.height = h[1] + "px", "function" == typeof n && n.apply(this, arguments), e.style.visibility = "visible", 1 == s && (e.style.marginTop = (i - parseInt(h[1])) / 2 + "px"), p = null, l
}

function loadPic(mImg, options) {
    var tempImg = document.createElement('img');
    mImg.onload = null;
    mImg.loading = true;
    var maxWidth = 400;
    var maxHeight = 75;

    if (options != null) {
        maxWidth = options['width'] != null ? options['width'] : maxWidth;
        maxHeight = options['height'] != null ? options['height'] : maxHeight;
    };

    tempImg.onload = function() {
        if (maxHeight > 100 && tempImg.height > tempImg.width) {
            maxWidth = maxHeight;
            maxHeight = 100000;
        }
        resizePic_temp(tempImg, maxWidth, maxHeight);

        var twidth = tempImg.style.width,
            width = Number(twidth.replace('px', ''));

        if (width < 50) {
            var pObj = mImg.parentNode,
                classN = pObj.className;
            // if (classN == 'vpic-wrap') {
            //     mImg.parentNode.className = 'vpic-wrap vpic-small';
            // }
        }
        mImg.style.width = tempImg.style.width;
        mImg.style.height = tempImg.style.height;
        mImg.src = tempImg.src;
        mImg.loaded = true;
        mImg.loading = null;
        this.onload = null;
    };
    tempImg.src = mImg.getAttribute('data-src');
}