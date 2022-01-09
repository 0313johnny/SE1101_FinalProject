$("document").ready(function(){
    if(sessionStorage.getItem('sign_in_user') != null)
    {
        $(".reserve_btn").css("display", "");
        $(".sign_out_btn").css("display", "");
        $(".sign_in_btn").css("display", "none");
        $(".sign_out_btn").html("<a class='nav-link' href='javascript:void(0)'>使用者 : "+sessionStorage.getItem('sign_in_user')+"</a>");
    }
    console.log("connect");
    $.ajax({ 
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/connectDB", 
        dataType: "json",
        success: function(re){
            console.log("success : "+re);
        },
        error: function (thrownError) {
            console.log(thrownError);
            }
    });
    $("#sign_in_btn").click(function(){
        console.log("log in");
        var account = $("input[name='email']").val();
        var password = $("input[name='pswd']").val();
        $.ajax({ 
            type: "GET",
            url: "https://se1101-finalp-roject.herokuapp.com/DB/findAccountByEmail/"+account, 
            dataType: "json",
            success: function(re){
                if(re.password == password){
                    if(re.authority == "user"){
                        var sign_in_user = re.userID;
                        sessionStorage.setItem('sign_in_user', sign_in_user);
                        $(".reserve_btn").css("display", "");
                        $(".sign_out_btn").css("display", "");
                        $(".sign_in_btn").css("display", "none");
                        $(".sign_out_btn").html("<a class='nav-link' href='javascript:void(0)'>使用者 : "+re.userID+"</a>");
                        location.reload();
                    }
                    else if(re.authority == "admin"){
                        var sign_in_user = re.userID;
                        sessionStorage.setItem('sign_in_user', sign_in_user);
                        $(window).attr('location','adminpage.html');
                    }
                    //window.location.replace("searchpage.html");
                    //跳轉頁面 儲存帳號相關資訊
                }
                else{
                    alert("密碼或帳號錯誤。");
                    $("input[name='pswd']").val("");
                }
                
            },
            error: function (thrownError) {
                alert("伺服器忙碌中請稍後再試。");
                $("input[name='pswd']").val("");
              }
        });
        
    });
    $(".sign_out_btn").click(function(){
        //window.confirm('您是否要登出');
        if (confirm('您是否要登出') == true) {
            sessionStorage.removeItem('sign_in_user');
            location.reload();
        }
        
    });
    $(".admin_sign_out").click(function(){
        //window.confirm('您是否要登出');
        if (confirm('您是否要登出') == true) {
            sessionStorage.removeItem('sign_in_user');
            $(window).attr('location','index.html');
        }
        
    });
    $("#personal").click(function(e){
        var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
        if(sessionStorage.getItem('sign_in_user') == null){
            alert("請先登入系統");
            e.preventDefault()
        }
        else{
            $("#user_reserve_list").html("");
            var url = "https://se1101-finalp-roject.herokuapp.com/DB/findUserAppointments/" + sessionStorage.getItem('sign_in_user');
            $.getJSON(url,function(result){
                var your_reserve = "";
                if(result.length <= 0){
                    your_reserve = "您未有任何申請或預約。";
                    $("#user_reserve_list").html(your_reserve);
                }
                else{
                    $.each(result,function(index,value){
                        your_reserve = `
                        <tr id = "${"personal_reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]}">
                            <td>${value.usingTime.date}</td>
                            <td>${value.userID}</td>
                            <td>${value.classroomID}</td>
                            <td>${num[parseInt(value.usingTime.time[0]) - 1]}~${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1]) - 1]}</td>
                            <td>${value.purpose}</td>
                            
                        `;
                        if(value.status == "pending"){
                            your_reserve += `
                                <td>
                                    <button type="button" class="btn btn-success btn-danger" id = "${"cancel_btn_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]+"_"+value.usingTime.time[value.usingTime.time.length - 1]}">取消<span class="RWD_word">預約</span></button>
                                </td>
                            `;
                        }
                        else if(value.status == "reserving"){
                            your_reserve += `<td>預約成功</td>`;

                        }
                        else if(value.status == "absent"){
                            your_reserve += `<td>逾時未取鑰匙</td>`;
                        }
                        else if(value.status == "using"){
                            your_reserve += `<td>教室使用中</td>`;
                        }
                        else if(value.status == "overtime"){
                            your_reserve += `<td>超時未還鑰匙</td>`;
                        }
                        your_reserve    +=  "</tr>";
                        $("#user_reserve_list").append(your_reserve);
                        $("#cancel_btn_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]+"_"+value.usingTime.time[value.usingTime.time.length - 1]).click(function(){
                            if (confirm('您是否要撤回此預約申請') == true) {
                                var delete_reserve = {};
                                delete_reserve.userID = value.userID;
                                delete_reserve.classroomID = value.classroomID;
                                delete_reserve.usingTime = {};
                                delete_reserve.usingTime.date = value.usingTime.date;
                                delete_reserve.usingTime.time = value.usingTime.time;
                                delete_reserve.usingTime.class = value.usingTime.class;
                                delete_reserve.usingTime.weekday = value.usingTime.weekday;
                                delete_reserve.isFixed = false;
                                var data = JSON.stringify(delete_reserve);
                                $.ajax({ 
                                    type: "DELETE",
                                    url: "https://se1101-finalp-roject.herokuapp.com/DB/deleteAppointment", 
                                    data:data,
                                    success: function(re){
                                        if(re == "true"){
                                            $("#personal_reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                                            alert("您的預約申請以撤回。");
                                        }
                                        else{
                                            alert("此申請可能已經通過或被拒絕。");
                                            $("#personal").click();
                                        }
                                        //$("#reserve_"+value.usingTime.date+"_"+value.classroomID+"_"+value.usingTime.time[0]).remove();
                                    },
                                    error: function (thrownError) {
                                        alert(thrownError);
                                    }
                                });
                            }
                            
                        });
                    });
                    $(".main_display").css("display","none")
                    $(".personal").css("display","")
                }

            });
            //$(".reserve_list").html(inserthtml);
        }
    });
});