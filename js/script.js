// 此為回到最上層按鈕的JS
{
    window.onscroll = () =>{
        if(window.scrollY >60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }
    }
    let toggle_button = document.querySelector('.toggle_button');
    toggle_button.onclick = function (){
        toggle_button.classList.toggle('active')
    }
    //jquery
    $(document).ready(function () {
        $(".card_spec").click(function () { //card動畫設定

            $(".card_show").css("display", "");
            $(".black_background").css("display", "");
        });
        $(".black_background").click(function (){
            $(".card_show").css("display", "none");
            $(".black_background").css("display", "none");
        });
        $(".close_button").click(function (){
            $(".card_show").css("display", "none");
            $(".black_background").css("display", "none");
        });
    });
}

//範例



        /*var textreg;
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
        },50);*/
/*    });
});*/