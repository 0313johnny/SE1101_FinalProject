// Get the date today
// Format: YYYY / MM / DD
function getTodayDate() {
    var fullDate = new Date();
    var yyyy = fullDate.getFullYear();
    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
    var dd = fullDate.getDate() < 10 ? ("0"+fullDate.getDate()) : fullDate.getDate();
    var today = yyyy + "-" + MM + "-" + dd;
    return today;
}

// API要用的是 YYYY-MM-dd

function getWeek(fromDate){
    var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay()))
        ,result = [new Date(sunday)];
    while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) {
        result.push(new Date(sunday));
    }
    return result;
}
// 下面這個不可以註解掉 用來得到本周日期
var thisWeek = getWeek(new Date(getTodayDate()));
var thisWeek_api_format = [];
for(let i = 0 ; i < 7 ; i++) {
    var yyyy = thisWeek[i].getFullYear();
    var MM = (thisWeek[i].getMonth() + 1) >= 10 ? (thisWeek[i].getMonth() + 1) : ("0" + (thisWeek[i].getMonth() + 1));
    var dd = thisWeek[i].getDate() < 10 ? ("0"+thisWeek[i].getDate()) : thisWeek[i].getDate();
    thisWeek_api_format[i] = yyyy + "-" + MM + "-" + dd;
}

//console.log(thisWeek_api_format);
// console.log('取得日期用函數測試 ' + getTodayDate());
// console.log('本周日:' + thisWeek[0]);
// console.log('本周一:' + thisWeek[1]);
// console.log('本周二:' + thisWeek[2]);
// console.log('本周三:' + thisWeek[3]);
// console.log('本周四:' + thisWeek[4]);
// console.log('本周五:' + thisWeek[5]);
// console.log('本周六:' + thisWeek[6]);

function findNonPenging(classroomID, target_date, day_of_the_week){
    // 建立查詢用字串 + Object
    let api_data = {};
    api_data.classroomID = classroomID;
    api_data.date = target_date;
    api_data.weekday = day_of_the_week;

    let input_data = JSON.stringify(api_data);
    // console.log("Call API findNonPenging for classroom " + classroomID);
    // console.log(api_data);
    // console.log("JSON: " + input_data);

    $.ajax({
        type: "POST",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findNonPendingByClassroom",
        dataType: "json",
        data:input_data, // Parse to JSON format
        success: function (result){
            // console.log("function findNonPenging() started.");
            // console.log("Showing API result for classroom " + classroomID);
            // console.log(result);

            $.each(result, function (index, courses){
                let my_date = courses.usingTime.weekday + 6;
                my_date %= 7;

                for(c in courses.usingTime.time){
                    // console.log("Inserting" + classroomID + " period=" + c + " date=" + my_date);
                    $("#classroomInfoWindow_"+ classroomID +" tr[period="+courses.usingTime.time[c]+"] td[date="+my_date+"]").html(courses.purpose + "<span class='RWD_noShow'>" + courses.userID + "</span>");
                }
            });
        },
        error: function (thrownError) {
            console.log("function findNonPenging() was interrupted.");
            alert(thrownError);
        }
    });
}

function findAllHistory(classroomID){
    // console.log("Call API findRecord. ClassID = " + classroomID);
    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findRecord/" + classroomID,
        dataType: "json",
        success: function (result) {
            //console.log(result);
            $.each(result, function(index, record){
                // 日期 借用人 開始節次 結束節次
                // console.log(record.usingTime.date);
                // console.log(record.userID);
                // console.log(record.usingTime.time[0]);
                let last = record.usingTime.time.length - 1;
                // console.log(record.usingTime.time[last]);

                let table_body = "";
                table_body = `<tr>
                                    <td>${record.usingTime.date}</td>
                                    <td>${record.userID}</td>
                                    <td>${record.usingTime.time[0]}</td>
                                    <td>${record.usingTime.time[last]}</td>
                               </tr>`;
                // console.log(table_body);

                $(".record_"+classroomID).append(table_body);
            });
        },
        error: function (thrownError) {
            alert(thrownError);
        }
    });

}

function findHistoryByDate(classroomID, week){
    let api_data = {};
    api_data.classroomID = classroomID;
    api_data.date = week;

    let input_data = JSON.stringify(api_data);
    // console.log(input_data);
    // console.log("Fetching data from database for " + classroomID);

    $.ajax({
        type: "POST",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findconditionRecord",
        dataType: "json",
        data:input_data,
        success: function (result) {
            // console.log("Get condition record successful. Room" + classroomID);
            // console.log(result);

            $.each(result, function (index, record){
                let my_date = record.usingTime.weekday + 6;
                my_date %= 7;

                for(c in record.usingTime.time){
                    // console.log("Inserting" + classroomID + " period=" + c + " date=" + my_date);
                    $("#classroomInfoWindow_"+ classroomID +" tr[period="+record.usingTime.time[c]+"] td[date="+my_date+"]").html(record.purpose + "<span class='RWD_noShow'>" + record.userID + "</span>");
                }

            });
        },
        error: function (thrownError) {
            console.log("Function findconditionRecord() was interrupted.");
            alert(thrownError);
        }
    });
}

$("document").ready(function(){
    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findAllClassroom",
        dataType: "json",
        success: function(result){
            //console.log("Get the list successful.");
            //console.log(result);
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
                            infoWindow += `</div>
                                       </div>
                                   </div>
                               </div>`;


                                // 歷史資料放這裡
                                // TODO
                                infoWindow +=  `
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
                                                <tbody class="record_${classrooms.classroomID}"></tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>`;

                // 課表樣板
                // 屬性dateID採用Python寫法
                infoWindow   += `<section class="col-lg-8 col-12 weekList">
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
                                            <tr align="center" period="0">
                                                <td>第0節<span class="RWD_noShow">06:20~08:10</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="1">
                                                <td>第一節<span class="RWD_noShow">08:20~09:10</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="2">
                                                <td>第二節<span class="RWD_noShow">09:20~10:10</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="3">
                                                <td>第三節<span class="RWD_noShow">10:20~11:10</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="4">
                                                <td>第四節<span class="RWD_noShow">11:15~12:05</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="5">
                                                <td>第五節<span class="RWD_noShow">12:10~13:00</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="6">
                                                <td>第六節<span class="RWD_noShow">13:10~14:00</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="7">
                                                <td>第七節<span class="RWD_noShow">14:10~15:00</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="8">
                                                <td>第八節<span class="RWD_noShow">15:10~16:00</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="9">
                                                <td>第九節<span class="RWD_noShow">16:05~16:55</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="10">
                                                <td>第十節<span class="RWD_noShow">17:30~18:20</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="11">
                                                <td>第十一節<span class="RWD_noShow">18:30~19:20</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="12">
                                                <td>第十二節<span class="RWD_noShow">19:25~20:15</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="13">
                                                <td>第十三節<span class="RWD_noShow">20:20~21:10</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            <tr align="center" period="14">
                                                <td>第十四節<span class="RWD_noShow">21:15~22:05</span></td>
                                                <td date="6">&nbsp;</td>
                                                <td date="0">&nbsp;</td>
                                                <td date="1">&nbsp;</td>
                                                <td date="2">&nbsp;</td>
                                                <td date="3">&nbsp;</td>
                                                <td date="4">&nbsp;</td>
                                                <td date="5">&nbsp;</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                        </div>`;

                $(".class_list").append(cardElement);
                $(".classroom_card_list").append(infoWindow);

                // 插入預約紀錄
                findAllHistory(classrooms.classroomID);

                // 課表插入
                // JavaScript星期幾: 日(0) ~ 六(6)
                // Python星期幾:     一(0) ~ 日(6)
                // 轉換: +6後取7餘數

                // 呼叫API並插入(現有預約)
                findNonPenging(classrooms.classroomID, thisWeek_api_format[0], 6); // Sunday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[1], 0); // Monday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[2], 1); // Tuesday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[3], 2); // Wednesday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[4], 3); // Thursday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[5], 4); // Friday
                findNonPenging(classrooms.classroomID, thisWeek_api_format[6], 5); // Saturday

                // 呼叫API並插入(課表歷史紀錄)
                // console.log(thisWeek_api_format);
                findHistoryByDate(classrooms.classroomID, thisWeek_api_format);

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