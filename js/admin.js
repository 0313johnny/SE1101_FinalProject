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
            var insert_pending_HTML = "";
            var pending_btn;
            $.each(result,function(index,value){   
                console.log(value.usingTime.time.length);
                insert_pending_HTML +=
                `<tr>
                    <td>${value.userID}</td>
                    <td>${value.classroomID}</td>
                    <td>第${num[parseInt(value.usingTime.time[0])]}堂</td>
                    <td>第${num[parseInt(value.usingTime.time[value.usingTime.time.length - 1])]}堂</td>
                    <td>${value.usingTime.date}</td>
                    <td>${value.purpose}</td>
                    <td>
                        <div class="request_button" id = {${value.usingTime.date+"_"+value.userID+"_"+value.classroomID+"_"+num[parseInt(value.usingTime.time[0])]}}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </td>
                </tr>`;
                $(".request_button").click(function () { //card動畫設定
                    console.log("request");
                    $(".card_request").css("display", "");
                    $(".black_background").css("display", "");
                });
            });
            $(".wait_for_review_list").html(insert_pending_HTML);
        });
            
            //wait_for_review_list

    });
});