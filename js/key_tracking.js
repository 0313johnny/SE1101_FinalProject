function move(moveto,removeID,object){
    var data = JSON.stringify(object);
    $.ajax({ 
        type: "PUT",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/updateStatus", 
        data:data,
        success: function(re){
            //console.log(data);
            //$("#"+removeID).remove();
            if(re == "true"){
                $(moveto).append($("#"+removeID));
            }
            else{
                alert("操作失敗，請重新嘗試。");
            }
            
        },
        error: function (thrownError) {
            alert(thrownError);
        }
    });
}
function add_to_list(){

}
$("document").ready(function(){
    var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    var week_ch = ["一","二","三","四","五","六","日"];
    $("#admin4,#admin4_rwd").click(function(){
            $("#not_taken_key").html("");
            $("#unreturned_key").html("");
            $("#overtime_key").html("");
            $("#absent_key").html("");
            $("#card_edit_list").html("");
        var url = "https://se1101-finalp-roject.herokuapp.com/DB/findTodayNonPending";
        $.getJSON(url,function(result){//取得所有預約成功的物件
            $.each(result,function(index,value){//為所有物件建立介面
                var ID_composition = value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0];
                var insert_key_tracking_HTML = "";
                var date = value.usingTime.date.split("-")
                insert_key_tracking_HTML +=
                `<tr id = "${"key_tracking_"+ID_composition}">
                    <td>${value.isFixed ? "星期" + week_ch[value.usingTime.weekday]:date[1]+"-"+date[2]}</td>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>${num[parseInt(value.usingTime.time[0]) - 1]}${(value.usingTime.class <= 1)?"":" ~ "+num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}</td>
                    <td>${value.purpose}</td>
                    <td>
                        <div class="request_button" id = "${"track_option_"+ID_composition}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                var key_tracking_btn = "";
                key_tracking_btn += //彈出操作介面
                `
                    <div class="card card_edit"style="display: none" id = "${"track_act_"+ID_composition}">
                        <div class="card_title">
                            <h4>將資料移動至</h4>
                        </div>
                        <div class="card_body">
                            <button type="button" class="btn btn-primary select_table_button" id = "${"not_taken_"+ID_composition}">超時未取鑰匙</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"unreturned_"+ID_composition}">教室使用中</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"overtime_"+ID_composition}">要匙歸還逾時</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"return_"+ID_composition}">已歸還鑰匙</button>
                        </div>
                    </div>
                `;
                var apoint = {};
                apoint.userID = value.userID;
                apoint.classroomID = value.classroomID;
                apoint.status = value.status;
                apoint.usingTime = {};
                apoint.usingTime.date = value.usingTime.date;
                apoint.usingTime.time = value.usingTime.time;
                apoint.usingTime.class = value.usingTime.class;
                apoint.usingTime.weekday = value.usingTime.weekday;
                apoint.isFixed = value.isFixed;
                var append_boolean = true;
                if(value.isFixed){
                    var is_return_class = {};
                    var fullDate = new Date();
                    var yyyy = fullDate.getFullYear();
                    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
                    var dd = fullDate.getDate() < 10 ? ("0"+fullDate.getDate()) : fullDate.getDate();
                    var today = yyyy + "-" + MM + "-" + dd;
                    is_return_class.classroomID = value.classroomID;
                    is_return_class.date = [today];
                    var data = JSON.stringify(is_return_class);
                    $.ajax({ 
                        type: "POST",
                        url: "https://se1101-finalp-roject.herokuapp.com/DB/findconditionRecord",
                        dataType: "json",
                        data:data,
                        async: false,
                        success: function(re){//判斷該固定課程金瑱是否已歸還
                            console.log(re);
                            //console.log(index + "  ：  "+ re.length);
                            if(re != false ){
                                console.log("do each");
                                $.each(re,function(reserve,today_return){//查找當日歸還是否有完成此預約
                                    if((today_return.userID == value.userID) && (today_return.usingTime.time[0] == value.usingTime.time[0]) && (today_return.usingTime.class == value.usingTime.class) && (today_return.usingTime.weekday == value.usingTime.weekday)){
                                        append_boolean = false;
                                        return false;
                                    }
                                });
                            }
                        },
                        error: function (thrownError) {
                            alert(thrownError);
                        }
                    });
                }
                //console.log(append_boolean);
                if(append_boolean){
                    $("#card_edit_list").append(key_tracking_btn);//插入彈出操作介面
                    if(value.status == "reserving")//插入個狀態的鑰匙管理
                    {
                        $("#not_taken_key").append(insert_key_tracking_HTML);
                        //$("#overtime_"+ID_composition).css("display", "none");
                    }
                    else if(value.status == "using")
                    {
                        $("#unreturned_key").append(insert_key_tracking_HTML);
                        //$("#not_taken_"+ID_composition).css("display", "none");
                    }
                    else if(value.status == "overtime")
                    {
                        $("#overtime_key").append(insert_key_tracking_HTML);
                        //$("#not_taken_"+ID_composition).css("display", "none");
                    }
                    else if(value.status == "absent")
                    {
                        $("#absent_key").append(insert_key_tracking_HTML);
                    }
                }
                $("#track_option_"+ID_composition).click(function () { //彈出操作介面動畫設定
                    $("#track_act_"+ID_composition).css("display", "");
                    $(".black_background").css("display", "");
                });
                $(".select_table_button").click(function (){//點選案件後操作框消失
                    $(".card_edit").css("display", "none");
                    $(".card_request").css("display", "none");
                    $(".black_background").css("display", "none");
                });
                var removeID = "key_tracking_"+ID_composition;
                $("#not_taken_"+ID_composition).click(function (){//點選超時未取後觸發動作
                    apoint.status = "absent";
                    move("#absent_key",removeID,apoint);
                    
                });//超時未取後觸發動作結束
                $("#unreturned_"+ID_composition).click(function (){//點選鑰匙未歸還後觸發動作
                    apoint.status = "using";
                    move("#unreturned_key",removeID,apoint);
                });//鑰匙未歸觸發動作結束
                $("#overtime_"+ID_composition).click(function (){//點選超時未還後觸發動作
                    apoint.status = "overtime";
                    move("#overtime_key",removeID,apoint);
                });//超時未還後觸發動作結束
                $("#return_"+ID_composition).click(function (){//點選歸還鑰匙後觸發動作
                    var data = JSON.stringify(apoint);
                    if(apoint.isFixed == false){
                        $.ajax({ 
                            type: "DELETE",
                            url: "https://se1101-finalp-roject.herokuapp.com/DB/deleteAppointment", 
                            data:data,
                            success: function(re){
                                if(re == "true"){
                                    $("#"+removeID).remove();
                                    var record = {};
                                    record.userID = value.userID;
                                    record.classroomID = value.classroomID;
                                    record.usingTime = {};
                                    record.usingTime.date = value.usingTime.date;
                                    record.usingTime.time = value.usingTime.time;
                                    record.usingTime.class = value.usingTime.class;
                                    record.usingTime.weekday = value.usingTime.weekday;
                                    record.purpose = value.purpose;
                                    var data = JSON.stringify(record);
                                    $.ajax({//添加為歷史紀錄
                                        type: "POST",
                                        url: "https://se1101-finalp-roject.herokuapp.com/DB/insertRecord", 
                                        data:data
                                    });
                                }
                                else{
                                    alert("操作失敗，請重新嘗試。");
                                }
                                //$("#reserve_"+ID_composition).remove();
                            },
                            error: function (thrownError) {
                                alert(thrownError);
                            }
                        });
                    }
                    else if(apoint.isFixed == true){
                        apoint.status = "reserving";
                        var data = JSON.stringify(apoint);
                        move("",removeID,apoint);
                        $("#"+removeID).remove();
                        var record = {};
                        record.userID = value.userID;
                        record.classroomID = value.classroomID;
                        record.usingTime = {};
                        var fullDate = new Date();
                        var yyyy = fullDate.getFullYear();
                        var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
                        var dd = fullDate.getDate() < 10 ? ("0"+fullDate.getDate()) : fullDate.getDate();
                        var today = yyyy + "-" + MM + "-" + dd;
                        record.usingTime.date = today;
                        record.usingTime.time = value.usingTime.time;
                        record.usingTime.class = value.usingTime.class;
                        record.usingTime.weekday = value.usingTime.weekday;
                        record.purpose = value.purpose;
                        var data = JSON.stringify(record);
                        console.log(record);
                        $.ajax({//添加為歷史紀錄
                            type: "POST",
                            url: "https://se1101-finalp-roject.herokuapp.com/DB/insertRecord", 
                            data:data
                        });

                    }
                    
                });//歸還鑰匙觸發動作結束

            });
        });
    });
});