var jsPlayer=function(playcontent,palyerwidth,selector){
    //获取视频节点
    var dom=document.getElementById(selector);
    var lineLength=playcontent-($(".arial").width()*2)-10;
    var durationSecond=dom.duration;
    var timeInterval=null;
    //初始化播放器并且绑定按钮事件
    (function(){
        //初始化播放器的一些样式
        (function(){
            //初始化视频宽度
            $("#myVideo").width(palyerwidth);
            $(".playScreen").width(palyerwidth);
            //初始化播放器界面宽度
            $(".playContent").width(playcontent);
            $(".playBars").width(playcontent);
            //初始化进度条的长度
            $(".line").width(lineLength);
            //设定音量值
            $(".voicekuai").css('left',$(".voicekuai").position().left+40);
            dom.volume=0.5;
        })();
        //设置按钮的tooplip
        (function(){
            $('#prev').dTooltip({
                angle: 360,
                content: '上一集',
                cssClass: 'dtooltipOpacity',
                arrowSize:4
            });
            $('#imgStatus').dTooltip({
                angle: 360,
                content: '播放控制',
                cssClass: 'dtooltipOpacity',
                arrowSize:6
            });
            $('#next').dTooltip({
                angle: 360,
                content: '下一集',
                cssClass: 'dtooltipOpacity',
                arrowSize:4
            });
        })();
        //绑定加载总时长事件
        (function(){
            $(dom).on("loadedmetadata",function(){
                var seconds=parseInt(dom.duration);
                $("#duration").html(Convert(seconds));
            });
        })();
        //绑定事件部分
        (function(){
            //点击屏幕事件
            $(dom).on("click",function(){
                PlaybackControl();
            });
            //播放停止单击事件
            $(".startBar").click(function(){
                PlaybackControl();
            });
            //拖动时长事件
            $(".line").click(function(e){
                ChangeProcess(e);
            });
            //声音点击事件
            $(".voiceline").click(function(e){
                var old=$(".voiceline").position().left;
                $(".voicekuai").css('left',e.pageX+"px");
                var currentX= e.pageX-old;
                var myVideo=document.getElementById(selector);
                myVideo.volume=Math.round((100/45)*currentX)/100>1?1:Math.round((100/45)*currentX)/100;
            });
        })();
        //进度条拖放程序
        (function(){
            var isDraging=false;
            var _minX=$(".currentCircle").position().left;
            var _maxX=$("#duration").position().left
            var Start=function(){
                console.log("Start");
                isDraging=true;
                $(document).bind("mousemove",function(e){
                    if(isDraging){
                        clearInterval(timeInterval);
                        if(e.pageX<_minX||e.pageX>_maxX){return false;}
                        $(".currentCircle").css("cursor","pointer");
                        $(".isPlayLine").width((e.pageX-$(".isPlayLine").position().left)+"px");
                        $(".currentCircle").css('left',e.pageX+"px");
                    }
                });
                $(document).bind("mouseup",function(e){
                    if(isDraging){
                        $(document).unbind("mousemove");
                        isDraging=false;
                        ChangeProcess(e);
                    }
                });
            };
            $(".currentCircle").on("mousedown",Start);
        })();
        //声音拖放程序
        (function(){
            var isVoiceDraging=false;
            var _minXX=$(".voicekuai").position().left-24;
            var _maxXX=_minXX+45;
            var Start=function(){
                console.log("StartVoice");
                isVoiceDraging=true;
                $(document).bind("mousemove",function(e){
                    if(isVoiceDraging){
                        if(e.pageX<_minXX||e.pageX>_maxXX){return false;}
                        var currentX= e.pageX-_minXX;
                        var myVideo=document.getElementById(selector);
                        $(".voicekuai").css("cursor","pointer");
                        $(".voicekuai").css('left',e.pageX+"px");
                        myVideo.volume=(100/45)*currentX/100;
                    }
                });
                $(document).bind("mouseup",function(e){
                    if(isVoiceDraging){
                        $(document).unbind("mousemove");
                        isVoiceDraging=false;
                    }
                });
            };
            $(".voicekuai").on("mousedown",Start);
        })();
    })();
    //播放视频
    var startVideo=function(){
       dom.play();
       var currentTime=dom.currentTime;
       timeInterval=setInterval(function(){
           var myVideo=document.getElementById(selector);
           $("#origin").html(Convert(myVideo.currentTime));
           var currentLine=parseInt(myVideo.currentTime)*((lineLength-12)/parseInt(myVideo.duration));
           $(".isPlayLine").width(currentLine+4);
           $(".currentCircle").css("left",currentLine+$(".isPlayLine").position().left+"px");
            if(dom.ended)
            {
                EndVideo();
            }
       },500);
    };
    //播放结束后的方法
    var EndVideo=function(){
        changeStatus(true);
        $("#origin").html("00:00:00");
        $(".isPlayLine").width(0);
        $(".currentCircle").css("left",$(".line").position().left+2);
        clearInterval(timeInterval);
    };
    //暂停视频
    var stopVideo=function(){
        dom.pause();
        clearInterval(timeInterval);
    };
    //改变播放器的状态
    var changeStatus=function(bool){
        if(dom.paused&&!bool)
            $("#imgStatus").attr("src","Images/start.jpg");
        else
            $("#imgStatus").attr("src","Images/stop.jpg");
    };
    //播放暂停按钮
    var PlaybackControl=function(){
        changeStatus(false);
        if(dom.paused)
            startVideo();
        else
            stopVideo();
    };
    //Change进度条
    var ChangeProcess=function(e){
        stopVideo();
        var positionRelative=parseInt(e.pageX-$(".line").position().left);
        dom.currentTime=(positionRelative/(lineLength))*dom.duration;
        changeStatus();
        startVideo();
    };
    //将秒转换为时分秒的格式
    var Convert=function(seconds){
        var hh;
        var mm;
        var ss;
        //传入的时间为空或小于0
        if(seconds==null||seconds<0){
            return;
        }
        //得到小时
        hh=seconds/3600|0;
        seconds=parseInt(seconds)-hh*3600;
        if(parseInt(hh)<10){
            hh="0"+hh;
        }
        //得到分
        mm=seconds/60|0;
        //得到秒
        ss=parseInt(seconds)-mm*60;
        if(parseInt(mm)<10){
            mm="0"+mm;
        }
        if(ss<10){
            ss="0"+ss;
        }
        return hh+":"+mm+":"+ss;
    };
};
