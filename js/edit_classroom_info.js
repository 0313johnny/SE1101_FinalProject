function get_classroom_list( append_targetID ){

    let html_list = "";
    // console.log("get_classroom_list()");

    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findAllClassroom",
        dataType: "json",
        success: function(result){

            // console.log("Get the list successful.");

            $.each(result,function(index, classroom) {
                html_list += `<div class="col-12 col-sm-6 col-md-3 p-1">
                                    <div id="classroom_${classroom.classroomID}" class="card_spec_edit card m-3 container_sp text-dark glass">
                                        <div class="card-body">
                                            <h1>${classroom.classroomID}</h1>
                                            <p>座位：${classroom.capacity}</p>
                                            <p>器材：……</p>                     
                                        </div>
                                    </div>
                                </div>`;
            });

            // 加入到jQuery選擇器中的區塊下
            $("#" + append_targetID).append(html_list);

            // 給流星雨用:這段是編輯教室點擊後的事件處理器
            $(".card_spec_edit").unbind("click");
            $(".edit_readonly_change").unbind("click");
            $("button.ensure").unbind("click");

            $(".card_spec_edit").click(function (e) {

                // card動畫設定
                $(".card_show_edit").css("display", "");
                $(".black_background").css("display", "");
                $("button.ensure").css("display", "none");
                $("button.edit_readonly_change").css("display", "");
                $(".admin_edit_class input").attr("readonly",true);

                // 點擊後呼叫抓取教室資訊的函數
                let roomID = $(this).eq(0).attr("id").substr(10);
                show_classroom_info( roomID );
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

                // 將input的value傳入ajax更改資料庫
                // declare the object
                let data_obj = {
                    classroomID : $("#ID_info").html(),
                    name        : $("#name_info input").val(),
                    location    : $("#location_info").html(),
                    capacity    : parseInt( $("#capacity_info input").val() ),
                    equipment   : string_to_equipment( $("#equipment_info input").val() )
                };
                // console.log(data_obj);

                let json_obj = JSON.stringify(data_obj)

                $.ajax({
                    type: "PUT",
                    url: "https://se1101-finalp-roject.herokuapp.com/DB/updateClassroom",
                    // url: "http://127.0.0.1:5000/DB/updateClassroom",
                    data:json_obj,
                    success: function(result){
                        // console.log(result);

                        $("#admin2").click();
                    },
                    error: function (thrownError) {
                        console.log(thrownError);
                    }
                });

            })
        }
    });
}

function show_classroom_info( targetID ){
    // console.log("show_classroom_info()");

    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findClassroom/" + targetID,
        dataType: "json",
        success: function(result){

            //console.log("Get info in classrooom " + targetID + " successful.");
            //console.log(result);
            $("#info_window #name_info input").val(result.name);
            $("#info_window #capacity_info input").val(result.capacity);

            // hidden, use for storage data
            $("#info_window #location_info").html(result.location);
            $("#info_window #ID_info").html(result.classroomID);

            // 先將物件轉為格式字串再插入

            let equip_text = "";
            let equip_list =  Object.keys(result.equipment);
            for(key in equip_list){
                equip_text += equip_list[key] + "*" + result.equipment[equip_list[key]] + " ";
            }

            // insert
            $("#info_window #equipment_info input").val( equip_text );
        },
        error: function (thrownError) {
            console.log("Failed to get the info.");
            alert(thrownError);
        }
    });
}

// 回傳一物件
function string_to_equipment( target_str ){
    // console.log("原始字串： " + target_str);
    // console.log("正在轉為陣列");

    // 防呆
    target_str = target_str.trim(); // 去掉頭尾空白
    target_str = target_str.replace(/\s+/g, " "); // 將過長空白縮減為1個


    let temp_array = new Array();
    temp_array = target_str.split(" ");
    // console.log(temp_array);

    let obj = {};
    for(index in temp_array){
        let text = temp_array[index].split("*");

        // 0是key(器材) 1是值
        obj[text[0]] = parseInt(text[1]);
    }
    // console.log(obj);
    return obj;
}
// 測試
// string_to_equipment( "投影機*1        擴大機*1 麥克風*1  喇叭*1 布幕*1 主機*65   ");

function init(){
    // console.log("initializing");
    $("#edit_card").html(""); // reset
    $("#edit_card").html("<h1 class=\"mt-5\" style=\"color: aliceblue\">教室列表</h1>");
    // 加入擷取到的教室列表 參數為要插入的div的ID
}

$("document").ready(function(){
    $("#admin2").click(function (e) {
        init();
        get_classroom_list("edit_card");
    });
});