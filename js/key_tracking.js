function move(moveto,removeID,object){
    var data = JSON.stringify(object);
    $.ajax({ 
        type: "PUT",
        url: "http://127.0.0.1:5000/DB/updateStatus", 
        data:data,
        success: function(re){
            console.log(data);
            //$("#"+removeID).remove();
            $(moveto).append($("#"+removeID));
        },
        error: function (thrownError) {
            alert(thrownError);
        }
    });
}

$("document").ready(function(){
    var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    $("#admin4").click(function(){
        console.log("keytrack");
        var url = "http://127.0.0.1:5000/DB/findNonPenging";
        $.getJSON(url,function(result){//取得所有預約成功的物件
            $("#not_taken_key").html("");
            $("#unreturned_key").html("");
            $("#overtime_key").html("");
            $("#absent_key").html("");
            $("#card_edit_list").html("");
            $.each(result,function(index,value){//為所有物件建立介面
                var status = value.status;
                var insert_key_tracking_HTML = "";
                insert_key_tracking_HTML +=
                `<tr id = "${"key_tracking_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                    <td>${value.usingTime.date}</td>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>${num[parseInt(value.usingTime.time[0])]}~${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1])]}</td>
                    <td>${value.purpose}</td>
                    <td>
                        <div class="request_button" id = "${"track_option_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                var key_tracking_btn = "";
                key_tracking_btn += //彈出操作介面
                `
                    <div class="card card_edit"style="display: none" id = "${"track_act_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                        <div class="card_title">
                            <h4>將資料移動至</h4>
                        </div>
                        <div class="card_body">
                            <button type="button" class="btn btn-primary select_table_button" id = "${"not_taken_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">超時未取鑰匙</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"unreturned_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">鑰匙未歸還</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"overtime_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">要匙歸還逾時</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"return_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">已歸還鑰匙</button>
                        </div>
                    </div>
                `;
                var apoint = {};
                apoint.userID = value.userID;
                apoint.classroomID = value.classroomID;
                apoint.usingTime = {};
                apoint.usingTime.date = value.usingTime.date;
                apoint.usingTime.time = value.usingTime.time;
                apoint.usingTime.class = value.usingTime.class;
                apoint.isFixed = false;
                $("#card_edit_list").append(key_tracking_btn);//插入彈出操作介面
                if(value.status == "reserving")//插入個狀態的鑰匙管理
                {
                    $("#not_taken_key").append(insert_key_tracking_HTML);
                    //$("#overtime_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).css("display", "none");
                }
                else if(value.status == "using")
                {
                    $("#unreturned_key").append(insert_key_tracking_HTML);
                    //$("#not_taken_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).css("display", "none");
                }
                else if(value.status == "overtime")
                {
                    $("#overtime_key").append(insert_key_tracking_HTML);
                    //$("#not_taken_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).css("display", "none");
                }
                else if(value.status == "absent")
                {
                    $("#absent_key").append(insert_key_tracking_HTML);
                }
                

                $("#track_option_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function () { //彈出操作介面動畫設定
                    $("#track_act_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).css("display", "");
                    $(".black_background").css("display", "");
                });
                $(".select_table_button").click(function (){//點選案件後操作框消失
                    $(".card_edit").css("display", "none");
                    $(".card_request").css("display", "none");
                    $(".black_background").css("display", "none");
                });
                var removeID = "key_tracking_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0];
                $("#not_taken_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function (){//點選超時未取後觸發動作
                    apoint.status = "absent";
                    move("#absent_key",removeID,apoint);
                    
                });//超時未取後觸發動作結束
                $("#unreturned_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function (){//點選鑰匙未歸還後觸發動作
                    apoint.status = "using";
                    move("#unreturned_key",removeID,apoint);
                });//鑰匙未歸觸發動作結束
                $("#overtime_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function (){//點選超時未還後觸發動作
                    apoint.status = "overtime";
                    move("#overtime_key",removeID,apoint);
                });//超時未還後觸發動作結束
                $("#return_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function (){//點選歸還鑰匙後觸發動作
                    var data = JSON.stringify(apoint);
                    $.ajax({ 
                        type: "DELETE",
                        url: "http://127.0.0.1:5000/DB/deleteAppointment", 
                        data:data,
                        success: function(re){
                            console.log(re);
                            $("#"+removeID).remove();
                            //$("#reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                        },
                        error: function (thrownError) {
                            alert(thrownError);
                        }
                    });
                });//歸還鑰匙觸發動作結束

            });
        });
    });
});