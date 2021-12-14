{
    window.onscroll = () =>{
        if(window.scrollY >60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }
    }
}
$(document).ready(function () {
    $("#maindiv .personal").click(function () { //card動畫設定
        var textreg;
        var h1reg;
        reg = $(this).attr("src");
        textreg=$(this).siblings().html();
        h1reg=$(this).siblings().children("span").html();
        setTimeout(function(){
            $("div.display").trigger("mouseup");

            $(".skr").stop();
            $(".card").stop();

            $(".card .cardheader .personal").attr("src", reg);

            $(".skr").animate({
                opacity: "0.4"
            })
            $(".card").toggle();
            setTimeout(function () {
                $(".card .cardbody").css("display", "");
                $(".card .cardheader span").css("display", "");

                //textreg=$(this).siblings("").html();
                $(".card .cardheader span").html(textreg);
                $(".card .cardbody h1").html(h1reg);
                //console.log(h1reg);
            }, 500);
        },50);
    });
});