function show_all_btn(btn_ID,status){
    $("#reserving_"+btn_ID).css("display", "");
    $("#not_taken_"+btn_ID).css("display", "");
    $("#unreturned_"+btn_ID).css("display", "");
    $("#overtime_"+btn_ID).css("display", "");
    $("#return_"+btn_ID).css("display", "");
    switch(status){
        case 'reserving': $("#reserving_"+btn_ID).css("display", "none");
        break;
        case 'absent': $("#not_taken_"+btn_ID).css("display", "none");
        break;
        case 'using': $("#unreturned_"+btn_ID).css("display", "none");
        break;
        case 'overtime': $("#overtime_"+btn_ID).css("display", "none");
        break;
    }
}
function DB_operate(object,btn_id){
    var data = JSON.stringify(object);
    $.ajax({ 
        type: "PUT",
        url: "http://127.0.0.1:5000/DB/updateStatus", 
        data:data,
        success: function(re){
            show_all_btn(btn_id,object.status);
        },
        error: function (thrownError) {
            alert(thrownError);
        }
    });
}
$("document").ready(function(){
    var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    var week_ch = ["一","二","三","四","五","六","日"];
    console.log("connect");//connectDB
    $.ajax({ 
        type: "GET",
        url: "http://127.0.0.1:5000/DB/connectDB", 
        dataType: "json",
        success: function(re){
            console.log("success : "+re);
        },
        error: function (thrownError) {
            console.log(thrownError);
            }
    });

    $("#admin1").click(function(){//建立審核申請介面
        //拿所有是pending的預約並展示
        var pending_url = "http://127.0.0.1:5000/DB/findPenging";
        //wait_for_review_list
        $(".wait_for_review_list").html("");
        $("#card_request_list").html("");//清空容器
        $.getJSON(pending_url,function(result){
            $.each(result,function(index,value){
                var ID_composition = value.userID+"_"+value.usingTime.date+"_"+value.usingTime.weekday+"_"+value.classroomID+"_"+value.usingTime.time[0]+"_"+value.usingTime.time[value.usingTime.time.length - 1];
                var insert_pending_HTML = "";
                insert_pending_HTML +=
                `<tr id = "${"reserve_"+ID_composition}">
                    <td>${value.usingTime.date}</td>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>第${num[parseInt(value.usingTime.time[0]) - 1]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}堂</td>
                    <td>${value.purpose}</td>
                    <td>
                        <div class="request_button" id = "${"option_"+ID_composition}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                var pending_btn = "";
                pending_btn += 
                `
                    <div class="card card_request"style="display: none" id = "${"act_"+ID_composition}">
                        <div class="card_title">
                            <h4>審核頁面</h4>
                        </div>
                        <div class="card_body">
                            <button type="button" class="btn btn-primary select_table_button" id = "${"success_"+ID_composition}">審核通過</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"fail_"+ID_composition}">審核未通過</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"leave_"+ID_composition}">離開</button>
                        </div>
                    </div>
                `;
                $(".wait_for_review_list").append(insert_pending_HTML);//插入待申請預約
                $("#card_request_list").append(pending_btn);//插入待審核按鈕
                $("#option_"+ID_composition).click(function () { //彈出選擇介面
                    $("#act_"+ID_composition).css("display", "");
                    $(".black_background").css("display", "");
                });
                $(".select_table_button").click(function (){
                    $(".card_edit").css("display", "none");
                    $(".card_request").css("display", "none");
                    $(".black_background").css("display", "none");
                });
                $("#success_"+ID_composition).click(function(){//同意申請
                    var apoint = {};
                    var email_text = "";
                    apoint.userID = value.userID;
                    apoint.classroomID = value.classroomID;
                    apoint.usingTime = {};
                    apoint.usingTime.date = value.usingTime.date;
                    apoint.usingTime.time = value.usingTime.time;
                    apoint.usingTime.class = value.usingTime.class;
                    apoint.usingTime.weekday = value.usingTime.weekday;
                    apoint.status = "reserving";
                    apoint.isFixed = false;
                    email_text += `${apoint.userID}，您的預約申請已經通過，請於申請時間前往系辦拿取鑰匙。\n教室 :${apoint.classroomID}
                    \n日期 : ${apoint.usingTime.date}
                    \n堂數 : 第${num[parseInt(value.usingTime.time[0]) - 1]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}堂`
                    var data = JSON.stringify(apoint);
                    $.ajax({ 
                        type: "PUT",
                        url: "http://127.0.0.1:5000/DB/updateStatus", 
                        data:data,
                        success: function(re){
                            if(re == "true"){
                                Email.send({//寄出預約成功通知
                                    SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
                                    To : apoint.userID+'@mail.ntou.edu.tw',
                                    From : "ntoumailonly@gmail.com",
                                    Subject : "您的預約申請已經通過",
                                    Body : email_text
                                }).then(alert("申請成功通知已寄出。"));
                                $("#admin1").click();
                            }
                            else{
                                alert("操作失敗，可能提交者已取消申請。");
                                $("#admin1").click();
                            }
                            //$("#reserve_"+value.usingTime.date+"_"+value.usingTime.weekday+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                        },
                        error: function (thrownError) {
                            alert(thrownError);
                        }
                    });
                });//申請同意結束
                $("#fail_"+ID_composition).click(function(){//拒絕申請
                    var apoint = {};
                    var email_text = "";
                    apoint.userID = value.userID;
                    apoint.classroomID = value.classroomID;
                    apoint.usingTime = {};
                    apoint.usingTime.date = value.usingTime.date;
                    apoint.usingTime.time = value.usingTime.time;
                    apoint.usingTime.class = value.usingTime.class;
                    apoint.status = "reserving";
                    apoint.isFixed = false;
                    email_text += `${apoint.userID}，您的預約申請未通過，請重新提交申請或前往系辦詢問。\n教室 :${apoint.classroomID}
                    \n日期 : ${apoint.usingTime.date}
                    \n堂數 : 第${num[parseInt(value.usingTime.time[0]) - 1]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}堂`
                    var data = JSON.stringify(apoint);
                    if (confirm('您是否要拒絕此預約申請？') == true) {
                        $.ajax({ 
                            type: "DELETE",
                            url: "http://127.0.0.1:5000/DB/deleteAppointment", 
                            data:data,
                            success: function(re){
                                if(re == "true"){
                                    Email.send({//寄出預約成功通知
                                        SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
                                        To : apoint.userID+'@email.ntou.edu.tw',
                                        From : "ntoumailonly@gmail.com",
                                        Subject : "您的預約申請未通過",
                                        Body : email_text
                                    }).then(alert("申請未通過通知已寄出。"));
                                    $("#admin1").click();
                                }
                                else{
                                    alert("提交者已取消申請。");
                                    $("#admin1").click();
                                }
                                //$("#reserve_"+value.usingTime.date+"_"+value.usingTime.weekday+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                            },
                            error: function (thrownError) {
                                alert(thrownError);
                            }
                        });
                    }
                });//拒絕申請結束
                            
            });//一個預約設定完成
            
        });//取得所有待審核預約json完成
    });//預約審核介面設定完成
    $("#admin5").click(function(){//建立預約管理介面
        $("#reserve_admin_list").html("");
        $("#card_edit_list").html("");
        var url = "http://127.0.0.1:5000/DB/findNonPenging";
        $.getJSON("http://127.0.0.1:5000/DB/findAllClassroom",function(result){//插入可選擇教室id
            $("select[name='classroomID']").html("");
            $.each(result,function(index,classroom){
                var select_unit = "";
                select_unit = `
                    <option value="${classroom.classroomID}">${classroom.classroomID}</option>
                `
                $("select[name='classroomID']").append(select_unit);
            });
        });
        $.getJSON(url,function(result){
            $.each(result,function(index,value){//為所有物件建立介面
                var status_text = "";
                var ID_composition = value.usingTime.date+"_"+value.usingTime.weekday+"_"+value.classroomID+"_"+value.usingTime.time[0];
                switch(value.status){
                    case 'reserving': status_text = "預約成功";break;
                    case 'absent': status_text = "逾時未取鑰匙";break;
                    case 'using': status_text = "教室使用中";break;
                    case 'overtime': status_text = "超時未還鑰匙";break;
                }
                var insert_reserve_admin_HTML = "";
                console.log(value.isFixed);
                insert_reserve_admin_HTML +=
                `<tr id = "${"reserve_admin_"+ID_composition}" class = "reserve_admin">
                    <td>${value.isFixed ? "星期" + week_ch[value.usingTime.weekday]:value.usingTime.date}</td>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>${num[parseInt(value.usingTime.time[0]) - 1]}~${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}</td>
                    <td>${value.purpose}</td>
                    <td>${status_text}</td>
                    <td>
                        <div class="request_button" id = "${"reserve_admin_option_"+ID_composition}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                var reserve_admin_btn = "";
                reserve_admin_btn += //彈出操作介面
                `
                    <div class="card card_edit"style="display: none" id = "${"reserve_admin_act_"+ID_composition}">
                        <div class="card_title">
                            <h4>將資料移動至</h4>
                        </div>
                        <div class="card_body">
                            <button type="button" class="btn btn-primary select_table_button" id = "${"reserving_"+ID_composition}">預約成功</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"not_taken_"+ID_composition}">逾時未取鑰匙</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"unreturned_"+ID_composition}">教室使用中</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"overtime_"+ID_composition}">超時未還鑰匙</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"return_"+ID_composition}">刪除預約</button>
                        </div>
                    </div>
                `;
                $("#reserve_admin_list").append(insert_reserve_admin_HTML);//插入預約管理列表
                $("#card_edit_list").append(reserve_admin_btn);//插入彈出操作介面
                var btn_id = ID_composition;
                show_all_btn(btn_id,value.status);
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
                
                

                $("#reserve_admin_option_"+ID_composition).click(function () { //彈出操作介面動畫設定
                    $("#reserve_admin_act_"+ID_composition).css("display", "");
                    $(".black_background").css("display", "");
                });
                $(".select_table_button").click(function (){//點選案件後操作框消失
                    $(".card_edit").css("display", "none");
                    $(".card_request").css("display", "none");
                    $(".black_background").css("display", "none");
                });
                var removeID = "reserve_admin_"+ID_composition;
                $("#reserving_"+ID_composition).click(function (){//點選預約成功後觸發動作
                    apoint.status = "reserving";
                    $("#reserve_admin_"+ID_composition +">td:eq(5)").text("預約成功");
                    DB_operate(apoint,btn_id);
                });//預約成功後觸發動作結束
                $("#not_taken_"+ID_composition).click(function (){//點選超時未取後觸發動作
                    apoint.status = "absent";
                    $("#reserve_admin_"+ID_composition +">td:eq(5)").text("逾時未取鑰匙");
                    DB_operate(apoint,btn_id);
                    
                });//超時未取後觸發動作結束
                $("#unreturned_"+ID_composition).click(function (){//點選使用中還後觸發動作
                    apoint.status = "using";
                    $("#reserve_admin_"+ID_composition +">td:eq(5)").text("教室使用中");
                    DB_operate(apoint,btn_id);
                });//使用中觸發動作結束
                $("#overtime_"+ID_composition).click(function (){//點選超時未還後觸發動作
                    apoint.status = "overtime";
                    $("#reserve_admin_"+ID_composition +">td:eq(5)").text("超時未還鑰匙");
                    DB_operate(apoint,btn_id);
                });//超時未還後觸發動作結束
                $("#return_"+ID_composition).click(function (){//點選刪除後觸發動作
                    var data = JSON.stringify(apoint);
                    if (confirm('您是否要刪除該筆預約') == true) {
                        $.ajax({ 
                            type: "DELETE",
                            url: "http://127.0.0.1:5000/DB/deleteAppointment", 
                            data:data,
                            success: function(re){
                                if(re = "true"){
                                    alert("該預約已刪除。");
                                    $("#"+removeID).remove();
                                }
                                else{
                                    alert("刪除失敗，請重新嘗試。");
                                }
                            },
                            error: function (thrownError) {
                                alert(thrownError);
                            }
                        });
                    }
                    
                });//歸還鑰匙觸發動作結束

            });
        });

    });
    $("#insert_isFixed_reserve").click(function(){
            var reserve = {};
            reserve.userID = "管理員";
            reserve.classroomID = $("select[name='classroomID']").val();
            reserve.usingTime = {};
            reserve.usingTime.date = "";
            reserve.usingTime.weekday = parseInt($("select[name='reserve_week']").val());
            var start = parseInt($("select[name='reserve_start_class']").val());
            var period = parseInt($("select[name='reserve_period']").val());
            var arry = [];
            for(var i = 0;i < period;i++)
            {
                arry[i] = start + i;
            }
            reserve.usingTime.time = arry;
            reserve.usingTime.class = period;
            reserve.purpose = $("input[name='purpose']").val();
            reserve.status = "reserving";
            reserve.isFixed = true;
            if(start + period > 13){
                alert("學校並沒有開到12堂課之後，請重新填寫時段。");
                return;
            }
            var data = JSON.stringify(reserve);//物件轉json
            $.ajax({ 
                type: "POST",
                url: "http://127.0.0.1:5000/DB/insertFixed", 
                data:data,
                success: function(re){
                    if(re == "true"){
                        alert("已新增一筆固定預約。");
                        $("#admin5").click();
                    }
                    else
                        alert("新增失敗，請重新嘗試。");
                },
                error: function (thrownError) {
                    alert(thrownError);
                }
            });
    });
});