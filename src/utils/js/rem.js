(function(){  
    change();  
    function change(){     
        /* 这里的html字体大小利用了一个简单书序公式（十字相乘），当我们默认设置以屏幕320px位基准此时的字体大小为16px(320 16px),那么浏览器窗口大小改变的时候新的html的fontSize（clientWidth新的值）就是clientWidth*16/320 */
        document.documentElement.style.fontSize = document.documentElement.clientWidth*16/1920 + 'px';  
    }    
 /* 监听窗口大小发生改变时 */
    window.addEventListener('resize',change,false);
})();