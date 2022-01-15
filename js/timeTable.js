// Get the date today
// Format: YYYY / MM / DD
function getTodayDate() {
    var fullDate = new Date();
    var yyyy = fullDate.getFullYear();
    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
    var dd = fullDate.getDate() < 10 ? ("0"+fullDate.getDate()) : fullDate.getDate();
    var today = yyyy + "/" + MM + "/" + dd;
    return today;
}

// API要用的是 YYYY-MM-dd
// TODO

function getWeek(fromDate){
    var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay()))
        ,result = [new Date(sunday)];
    while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) {
        result.push(new Date(sunday));
    }
    return result;
}
// test
var thisWeek = getWeek(new Date(getTodayDate()));
/*console.log(getTodayDate());
console.log('本周日:' + thisWeek[0]);
console.log('本周一:' + thisWeek[1]);
console.log('本周二:' + thisWeek[2]);
console.log('本周三:' + thisWeek[3]);
console.log('本周四:' + thisWeek[4]);
console.log('本周五:' + thisWeek[5]);
console.log('本周六:' + thisWeek[6]);*/

$("document").ready(function(){
    //let classroomList;

    // Get the list of all classrooms
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/DB/findAllClassroom",
        dataType: "json",
        success: function(result){
            console.log("Get the list successful.");
            console.log(result);
            //classroomList = result;

            // 清空class list以及彈出視窗list
            $(".class_list").html(""); // reset
            $(".classroom_card_list").html("");  // reset

            // 標題 [教室列表]
            let pageTitle = "'<h1 class='mt-5 pt-3' style='color: white'>教室列表</h1>";
            $(".class_list").append(pageTitle);

            $.each(result,function(index, classrooms){

                let equipmentsList = Object.keys(classrooms.equipment);

                // 遍歷result的內容
                let cardElement =
                    `   <div class="col-12 col-sm-6 col-md-3 p-1">
                            <div id="classroom_${classrooms.classroomID}" class="card_spec card m-3 container_sp text-dark glass">
                                <div class="card-body">
                                    <h1>${classrooms.classroomID}</h1>
                                    <p>座位：${classrooms.capacity}</p>
                                    <p>器材：……</p>
                                </div>
                            </div>
                        </div>`;

                let infoWindow =
                    `   <div id="classroomInfoWindow_${classrooms.classroomID}" class="card circle card_show" style="display: none">
                            <div class="close_button glass">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div class=" card_body container_sp text-dark row scroll">
                                <section class="col-lg-4 col-12 classInfo">
                                    <div class="show_left_top m-3 mb-4 circle">
                                        <div class="heading mb-3">
                                            <h1>教室資訊</h1>
                                        </div>
                                        <div class="rows">
                                            <div class="container-fluid">
                                                <div class="info">
                                                    <h3>教室：</h3>
                                                    <p class="right">${classrooms.classroomID}</p>
                                                </div>
                                                <div class="info">
                                                    <h3>座位：</h3>
                                                    <p class="right">${classrooms.capacity}</p>
                                                </div>
                                                <div class="info"><h3>器材：</h3></div>
                                                <div class="row">`;
                                            for(var i = 0 ; i < equipmentsList.length ; i++){
                                                infoWindow +=  `<p class="col-4 col-md-3 col-lg-4 col-xl-3">
                                                                    ${equipmentsList[i]}*${classrooms.equipment[equipmentsList[i]]}
                                                                </p>`;
                                            }
                                infoWindow +=  `</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="show_left_bottom m-3 pe-4 circle">
                                        <div class="heading">
                                            <h1>歷史資訊</h1>
                                        </div>
                                        <div class="rows record">
                                            <table class="col-12">
                                                <thead>
                                                <tr>
                                                    <th><span class="RWD_noShow">借用</span>日期</th>
                                                    <th><span class="RWD_noShow">借用人</span>學號</th>
                                                    <th>開始<span class="RWD_noShow">借用時間</span></th>
                                                    <th>結束<span class="RWD_noShow">借用時間</span></th>
                                                </tr>
                                                </thead>
                                                <tbody class="">
                                                <tr class="">
                                                    <td>2019/<br class="RWD_show">04/18</td>
                                                    <td>00857<br class="RWD_show">004</td>
                                                    <td>第一節</td>
                                                    <td>第三節</td>
                                                </tr>
                                                <tr>
                                                    <td>2019/<br class="RWD_show">04/18</td>
                                                    <td>00857<br class="RWD_show">004</td>
                                                    <td>第一節</td>
                                                    <td>第三節</td>
                                                </tr>
                                                <tr>
                                                    <td>2019/<br class="RWD_show">04/18</td>
                                                    <td>00857<br class="RWD_show">004</td>
                                                    <td>第一節</td>
                                                    <td>第三節</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                    
                                <section class="col-lg-8 col-12 weekList">
                                    <div class="show_right circle">
                                        <div class="heading">
                                            <h1>今周已預定時間表</h1>
                                        </div>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th><span>節\\星期</span></th>
                                                <th><span class="RWD_word">星期</span>一</th>
                                                <th><span class="RWD_word">星期</span>二</th>
                                                <th><span class="RWD_word">星期</span>三</th>
                                                <th><span class="RWD_word">星期</span>四</th>
                                                <th><span class="RWD_word">星期</span>五</th>
                                                <th><span class="RWD_word">星期</span>六</th>
                                                <th><span class="RWD_word">星期</span>日</th>
                                            </tr>
                                            </thead>
                                            <tbody class="">
                                            <tr align="center">
                                                <td>第0節<span class="RWD_noShow">06:20~08:10</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第一節<span class="RWD_noShow">08:20~09:10</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第二節<span class="RWD_noShow">09:20~10:10</span></td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td> </td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第三節<span class="RWD_noShow">10:20~11:10</span></td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td> </td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第四節<span class="RWD_noShow">11:15~12:05</span></td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td> </td>
                                                <td> </td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第五節<span class="RWD_noShow">12:10~13:00</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第六節<span class="RWD_noShow">13:10~14:00</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第七節<span class="RWD_noShow">14:10~15:00</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第八節<span class="RWD_noShow">15:10~16:00</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第九節<span class="RWD_noShow">16:05~16:55</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第十節<span class="RWD_noShow">17:30~18:20</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第十一節<span class="RWD_noShow">18:30~19:20</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第十二節<span class="RWD_noShow">19:25~20:15</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第十三節<span class="RWD_noShow">20:20~21:10</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr align="center">
                                                <td>第十四節<span class="RWD_noShow">21:15~22:05</span></td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        </div>`;

                $(".class_list").append(cardElement);
                $(".classroom_card_list").append(infoWindow);

                // card動畫設定
                $("#classroom_"+classrooms.classroomID).click(function (e) {
                    $("#classroomInfoWindow_"+classrooms.classroomID).css("display", "");
                    $(".black_background").css("display", "");
                });

                // card關閉按鈕設定
                $(".classroom_card_list .close_button").click(function (){
                    $(".card_show").css("display", "none");
                    $(".card_edit").css("display", "none");
                    $(".card_reserve").css("display", "none");
                    $(".black_background").css("display", "none");
                    $(".card_request").css("display", "none");
                });
            });
        },
        error: function (thrownError) {
            console.log("Failed to get the list.");
            alert(thrownError);
        }
    });
});