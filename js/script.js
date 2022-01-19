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
    /*let admin_page1 = document.querySelectorAll('.admin_btn');
    admin_page1.onclick = function (e){
        console.log(e);
        //document.querySelector("." + e.target.id).style.display = "block";
        //admin_page1.classList.toggle('no_display')
    }*/
    //jquery
    $(document).ready(function () {
        $("#main_display").click(function (e) {
            $(".main_display").css("display","")
            $(".personal").css("display","none")
            $(".reserve_display").css("display","none")
        });
        $(".admin_btn").click(function (e) {
            $(".admin1").css("display","none")
            $(".admin2").css("display","none")
            $(".admin3").css("display","none")
            $(".admin4").css("display","none")
            $(".admin5").css("display","none")

            $("." + e.target.id).css("display","")
            /*$(".card_show").css("display", "");
            $(".black_background").css("display", "");*/
        });

        $(".card_spec").click(function () { //card動畫設定
            $(".card_show").css("display", "");
            $(".black_background").css("display", "");
        });
        $(".reserve_card").click(function (e) { //card動畫設定
            $(".reserve_card_" + e.target.id).css("display", "");
            $(".black_background").css("display", "");
            
        });
        $(".black_background").click(function (){
            $(".card_show").css("display", "none");
            $(".card_edit").css("display", "none");
            $(".card_reserve").css("display", "none");
            $(".black_background").css("display", "none");
            $(".card_request").css("display", "none");
            $(".card_show_edit").css("display", "none");
        });
        $(".close_button").click(function (){
            $(".card_show").css("display", "none");
            $(".card_edit").css("display", "none");
            $(".card_reserve").css("display", "none");
            $(".black_background").css("display", "none");
            $(".card_request").css("display", "none");
            $(".card_show_edit").css("display", "none");
        });
        
        $(".select_table_button").click(function (){
            $(".card_edit").css("display", "none");
            $(".card_request").css("display", "none");
            $(".black_background").css("display", "none");
        });
        $(".add_class_btn").click(function (){
            $(".search_filter_btn").addClass('active');
            $(".search_filter_tr").addClass('active');
            $(".add_class_tr").removeClass('active');
            $(".add_class_btn").removeClass('active');
        });
        $(".search_filter_btn").click(function (){
            $(".add_class_tr").addClass('active');
            $(".add_class_btn").addClass('active');
            $(".search_filter_tr").removeClass('active');
            $(".search_filter_btn").removeClass('active');
        });
        //給流星雨用:這段是編輯教室點擊後的事件處理器
        $(".card_spec_edit").click(function () { //card動畫設定
            $(".card_show_edit").css("display", "");
            $(".black_background").css("display", "");
            $("button.ensure").css("display", "none");
            $("button.edit_readonly_change").css("display", "");
            $(".admin_edit_class input").attr("readonly",true);
        });
        $(".edit_readonly_change").click(function (e) {
            $("button.ensure").css("display", "");
            $("button.edit_readonly_change").css("display", "none");
            $(".admin_edit_class input").attr("readonly",false);
        })
        $("button.ensure").click(function (e) {
            $("button.ensure").css("display", "none");
            $("button.edit_readonly_change").css("display", "");
            $(".admin_edit_class input").attr("readonly",true);
        })
    });

}