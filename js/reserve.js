$("document").ready(function(){
    $("#search_btn").click(function(event){
        var today = new Date();
        var appointINFO = {};
        appointINFO.usingTime = {};
        appointINFO.usingTime.date = $("input[name='date']").val();
        var start = parseInt($("select[name='start_class']").val());
        var period = parseInt($("select[name='period']").val());
        var day = new Date(Date.parse(appointINFO.usingTime.date));
        var gap = parseInt(Math.abs(day.getTime()- today.getTime())/1000/60/60/24);
        
        if(start + period > 13){
            alert("學校並沒有開到12堂課之後，請重新填寫時段。");
            return;
        }
        else if(appointINFO.usingTime.date == ""){
            alert("日期不可為空。");
            return;
        }
        else if(day.getDate() == today.getDate( ) && day.getMonth() == today.getMonth()){
            
            alert("現在才想到要借教室不覺得太晚了嗎？下次請早！");
            return;
        }
        else if(Date.parse(appointINFO.usingTime.date) < today){
            alert("時間旅行是不合法的，詳情請見時空管理法第三章第一節！");
            return;
        }
        else if(gap > 14){
            alert("學校的生意沒那麼好，預約不用排到明年！");
            return;
        }
        
        var arry = [];
        for(var i = 0;i < period;i++)
        {
            arry[i] = start + i;
        }
        var day = new Date(Date.parse(appointINFO.usingTime.date.replace(/-/g, '/')));
        appointINFO.usingTime.weekday = (day.getDay()+6)%7;
        appointINFO.usingTime.time = arry;
        appointINFO.usingTime.class = period;
        var data = JSON.stringify(appointINFO);
        $.ajax({ 
            type: "POST",
            url: "https://se1101-finalp-roject.herokuapp.com/DB/findIdleClassroom", 
            dataType: "json",
            data:data,
            success: function(re){
                $(".main_display").css("display","none");
                $(".reserve_display").css("display","");
                $(".personal").css("display","none");
                var insertHTML = "'<h1 class='mt-5 pt-3' style='color: white'>可預約教室</h1>";
                $(".reserve_list").html(insertHTML);
                $(".reserve_card_list").html("");
                $.each(re,function(index,result){//取陣列
                    var insertCard = "";//加入顯示給使用者看的列
                    insertCard += "<div class='col-12 col-sm-6 col-md-3 p-1 reserve_card'>";
                    insertCard += "<div id='reserve_"+result.classroomID+"' class='card_spec card m-3 container_sp text-dark glass'><div class='card-body'>";
                    insertCard += "<h1>"+result.classroomID+"</h1><p>座位："+result.capacity+"</p><p>器材：……</p></div></div></div>";

                    var insertINFOCard = "";//點選後彈出的視窗
                    insertINFOCard += "<div class='card circle card_reserve'style='display:none' id = 'reserve_card_"+result.classroomID+"'>";
                    insertINFOCard += "<div class='close_button glass'><span></span><span></span><span></span></div>";
                    insertINFOCard += "<div class='card_body container_sp text-dark row scroll'><div class='heading mb-3'><h1>教室資訊</h1></div>";
                    insertINFOCard += "<div class='rows'><div class='container-fluid'><div class='info'><h3>教室:</h3><p class='right'>"+result.classroomID+"</p></div><div class='info'><h3>座位:</h3><p class='right'>"+result.capacity+"</p></div><div class='info'><h3>器材:</h3></div><div class='row'>";
                    var eq = Object.keys(result.equipment);
                    for(var i = 0;i < eq.length;i++)
                    {
                        insertINFOCard+="<p class='col-4 col-md-3 col-lg-4 col-xl-3'>"+eq[i]+"*"+result.equipment[eq[i]]+"</p>";
                    }
                    insertINFOCard += "</div></div></div></div>";
                    //*** */
                    insertINFOCard += "<div class='card_end container_sp text-dark row scroll'><div class='heading mb-3'><h1>預約時間</h1></div>";
                    insertINFOCard += "<div class='rows'><div class='container-fluid'><div class='info'><h3>日期:</h3><p class='right'>"+appointINFO.usingTime.date+"</p></div>";
                    insertINFOCard += "<div class='info'><h3>時間:</h3><p class='right'>第";
                    var num = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
                    for(var i = 0;i <  period;i++)
                    {
                        if(i != 0)
                            insertINFOCard += ",";
                        insertINFOCard += num[i + start - 1];
                    }
                    insertINFOCard += "堂</p></div>";
                    insertINFOCard += "<div class='info'><h3>目的:</h3><p class='right'><input type='text' class='form-control' placeholder='輸入目的(課程名稱)' name='text'></p></div>"
                    insertINFOCard += "<div class='info'><h3>申請:</h3><p class='right'><button type='button' class='reserve_btn btn'>發送</button></p></div></div></div></div></div>";
                    

                    $(".reserve_list").append(insertCard);
                    $(".reserve_card_list").append(insertINFOCard);
                    $("#reserve_"+result.classroomID).click(function (e) { //card動畫設定
                        $("#reserve_card_"+result.classroomID).css("display", "");
                        $(".black_background").css("display", "");
                        
                    });
                    $(".close_button").click(function (){
                        $(".card_show").css("display", "none");
                        $(".card_edit").css("display", "none");
                        $(".card_reserve").css("display", "none");
                        $(".black_background").css("display", "none");
                    });
                    $("#reserve_card_"+result.classroomID +" .reserve_btn").click(function(){//寄送預約申請
                        var url = "https://se1101-finalp-roject.herokuapp.com/DB/findUserAppointments/" + sessionStorage.getItem('sign_in_user');
                        console.log(url);
                        $.getJSON(url,function(num){
                            var reserve_num = num.length;
                            
                            console.log(num);
                            
                            if(reserve_num < 5 || !num){
                                var reserve = {};//$("input[name='date']").val();
                                reserve.userID = sessionStorage.getItem('sign_in_user');
                                reserve.classroomID = result.classroomID;
                                reserve.usingTime = {};
                                reserve.usingTime.date = appointINFO.usingTime.date;
                                reserve.usingTime.time = appointINFO.usingTime.time;
                                reserve.usingTime.class = appointINFO.usingTime.class;
                                var day = new Date(Date.parse(reserve.usingTime.date.replace(/-/g, '/')));
                                reserve.usingTime.weekday = (day.getDay()+6)%7;
                                reserve.purpose = $("#reserve_card_"+result.classroomID +" input").val();
                                reserve.status = "pending";
                                reserve.isFixed = false;
                                var data = JSON.stringify(reserve);//物件轉json
                                $.ajax({ 
                                    type: "POST",
                                    url: "https://se1101-finalp-roject.herokuapp.com/DB/insertAppointment", 
                                    data:data,
                                    success: function(re){
                                        //console.log(typeof(re));
                                        if(re == "true")
                                            alert("預約申請已提交，請耐心等待審核。");
                                        else
                                            alert("預約申請失敗，請重新嘗試。");
                                    },
                                    error: function (thrownError) {
                                        alert(thrownError);
                                        }
                                });
                            }
                            else{
                                alert("您的預約以達操作上限，請直接前往系辦申請借用或結束目前已完成之預約。");
                            }
                        });
                    });
                    
                });
            },
            error: function (thrownError) {
                alert(thrownError);
                console.log(thrownError);
              }
        });     
    });
});