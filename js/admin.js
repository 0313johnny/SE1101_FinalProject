$("document").ready(function(){
    var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
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

    $("#admin1").click(function(){
        //拿所有是pending的預約並展示
        var pending_url = "http://127.0.0.1:5000/DB/findPenging";
        //wait_for_review_list
        $.getJSON(pending_url,function(result){
            $(".wait_for_review_list").html("");
            $("#card_request_list").html("");//清空容器
            $.each(result,function(index,value){
                var insert_pending_HTML = "";
                insert_pending_HTML +=
                `<tr id = "${"reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                    <td>${value.usingTime.date}</td>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>第${num[parseInt(value.usingTime.time[0])]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1])]}堂</td>
                    <td>${value.purpose}</td>
                    <td>
                        <div class="request_button" id = "${"option_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                var pending_btn = "";
                pending_btn += 
                `
                    <div class="card card_request"style="display: none" id = "${"act_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                        <div class="card_title">
                            <h4>審核頁面</h4>
                        </div>
                        <div class="card_body">
                            <button type="button" class="btn btn-primary select_table_button" id = "${"success_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">審核通過</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"fail_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">審核未通過</button>
                            <button type="button" class="btn btn-primary select_table_button" id = "${"leave_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">離開</button>
                        </div>
                    </div>
                `;
                $(".wait_for_review_list").append(insert_pending_HTML);//插入待申請預約
                $("#card_request_list").append(pending_btn);//插入待審核按鈕
                $("#option_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function () { //彈出選擇介面
                    console.log("request");
                    $("#act_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).css("display", "");
                    $(".black_background").css("display", "");
                });
                $(".select_table_button").click(function (){
                    $(".card_edit").css("display", "none");
                    $(".card_request").css("display", "none");
                    $(".black_background").css("display", "none");
                });
                $("#success_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function(){//同意申請
                    console.log("suc");
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
                    console.log(apoint);
                    email_text += `${apoint.userID}，您的預約申請已經通過，請於申請時間前往系辦拿取鑰匙。\n教室 :${apoint.classroomID}
                    \n日期 : ${apoint.usingTime.date}
                    \n堂數 : 第${num[parseInt(value.usingTime.time[0])]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1])]}堂`
                    var data = JSON.stringify(apoint);
                    $.ajax({ 
                        type: "PUT",
                        url: "http://127.0.0.1:5000/DB/updateStatus", 
                        data:data,
                        success: function(re){
                            console.log(re);
                            Email.send({//寄出預約成功通知
                                SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
                                To : apoint.userID+'@email.ntou.edu.tw',
                                From : "ntoumailonly@gmail.com",
                                Subject : "您的預約申請已經通過",
                                Body : email_text
                            }).then(alert("申請成功通知已寄出。"));
                            $("#admin1").click();
                            //$("#reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                        },
                        error: function (thrownError) {
                            alert(thrownError);
                        }
                    });
                });//申請同意結束
                $("#fail_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).click(function(){//拒絕申請
                    console.log("delete");
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
                    console.log(apoint);
                    email_text += `${apoint.userID}，您的預約申請未通過，請重新提交申請或前往系辦詢問。\n教室 :${apoint.classroomID}
                    \n日期 : ${apoint.usingTime.date}
                    \n堂數 : 第${num[parseInt(value.usingTime.time[0])]}堂 ~ 第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1])]}堂`
                    var data = JSON.stringify(apoint);
                    $.ajax({ 
                        type: "DELETE",
                        url: "http://127.0.0.1:5000/DB/deleteAppointment", 
                        data:data,
                        success: function(re){
                            console.log(re);
                            Email.send({//寄出預約成功通知
                                SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
                                To : apoint.userID+'@email.ntou.edu.tw',
                                From : "ntoumailonly@gmail.com",
                                Subject : "您的預約申請未通過",
                                Body : email_text
                            }).then(alert("申請未通過通知已寄出。"));
                            $("#admin1").click();
                            //$("#reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                        },
                        error: function (thrownError) {
                            alert(thrownError);
                        }
                    });
                });//拒絕申請結束
                            
            });//一個預約設定完成
            
        });//取得所有待審核預約json完成
    });//預約審核介面設定完成
});