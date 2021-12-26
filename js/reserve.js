$("document").ready(function(){
    //console.log(sign_in_user);
    $("#search_btn").click(function(){
        console.log("search");
        var appointINFO = {};
        appointINFO.usingTime = {};
        appointINFO.usingTime.date = $("input[name='date']").val();
        var start = parseInt($("select[name='start_class']").val());
        var period = parseInt($("select[name='period']").val());
        console.log(start +"    "+ period);
        var arry = [];
        for(var i = 0;i < period;i++)
        {
            arry[i] = start + i;
        }
        appointINFO.usingTime.time = arry;
        appointINFO.usingTime.class = period;
        console.log(appointINFO);
        var data = JSON.stringify(appointINFO);
        $.ajax({ 
            type: "POST",
            url: "http://127.0.0.1:5000/DB/findIdleClassroom", 
            dataType: "json",
            data:data,
            success: function(re){
                console.log(re);
                var insertHTML = "'<h1 class='mt-5 pt-3' style='color: white'>教室列表</h1>";
                $(".class_list").html(insertHTML);
                $(".reserve_card_list").html("");
                $.each(re,function(index,value){
                    console.log(value);
                    var url = "http://127.0.0.1:5000/DB/findClassroom/"+value;
                    $.getJSON(url,function(result){
                        var insertCard = "";//加入顯示給使用者看的列表
                        insertCard += "<div class='col-12 col-sm-6 col-md-3 p-1 reserve_card'>";
                        insertCard += "<div id='"+result.classroomID+"' class='card_spec card m-3 container_sp text-dark glass'><div class='card-body'>";
                        insertCard += "<h1>"+result.classroomID+"</h1><p>座位:"+result.capacity+"</p><p>器材:...</p></div></div></div>";

                        var insertINFOCard = "";//點選後彈出的視窗
                        insertINFOCard += "<div class='card circle card_reserve'style='display:none' id = 'reserve_card_"+result.classroomID+"'>";
                        insertINFOCard += "<div class='close_button glass'><span></span><span></span><span></span></div>";
                        insertINFOCard += "<div class='card_body container_sp text-dark row scroll'><div class='heading mb-3'><h1>教室資訊</h1></div>"
                        insertINFOCard += "<div class='rows'><div class='container-fluid'><div class='info'><h3>教室:</h3><p class='right'>"+result.classroomID+"</p></div><div class='info'><h3>座位:</h3><p class='right'>"+result.capacity+"</p></div><div class='info'><h3>器材:</h3></div><div class='row'>";
                        var eq = Object.keys(result.equipment);
                        for(var i = 0;i < eq.length;i++)
                        {
                            insertINFOCard+="<p class='col-4 col-md-3 col-lg-4 col-xl-3'>"+eq[i]+"*"+result.equipment[eq[i]]+"</p>";
                        }
                        insertINFOCard += "</div></div></div></div>";

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
                        insertINFOCard += "<div class='info'><h3>確認申請:</h3><p class='right'><button type='button' class='btn'>發送</button></p></div></div></div></div></div>";
                        

                        $(".class_list").append(insertCard);
                        $(".reserve_card_list").append(insertINFOCard);
                        $("#"+result.classroomID).click(function (e) { //card動畫設定
                            $("#reserve_card_"+result.classroomID).css("display", "");
                            $(".black_background").css("display", "");
                            
                        });
                        $(".close_button").click(function (){
                            $(".card_show").css("display", "none");
                            $(".card_edit").css("display", "none");
                            $(".card_reserve").css("display", "none");
                            $(".black_background").css("display", "none");
                        });
                    });
                    
                });
            },
            error: function (thrownError) {
                console.log(thrownError);
              }
        });     
    });
});