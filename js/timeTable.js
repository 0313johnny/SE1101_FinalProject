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

function getWeek(fromDate){
    var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay()))
        ,result = [new Date(sunday)];
    while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) {
        result.push(new Date(sunday));
    }
    return result;
    // 回傳一陣列 [0]是日 [6]是六
}
// Example
// var week = getWeek(new Date('2012/10/10'));
// console.log(week[0]); //=> Sun Oct 07 2012 00:00:00
// console.log(week[6]); //=> Sat Oct 13 2012 00:00:00

$("document").ready(function(){
    let classroomList;

    // Get the list of all classrooms
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/DB/getClassroomList",
        success: function(result){
            console.log("Get the list successful.");
            classroomList = result;

            $(".class_list").html(insertHTML); // reset
            $(".reserve_card_list").html("");  // reset

            $.each(result,function(index, classroom){ // 遍歷result的內容
                let cardElement =
                    `   <div class="col-12 col-sm-6 col-md-3 p-1">
                            <div id="105" class="card_spec card m-3 container_sp text-dark glass">
                                <div class="card-body">
                                    <h1>105</h1>
                                    <p>座位:50</p>
                                    <p>器材:....</p>
                                </div>
                            </div>
                        </div>`;

                let infoWindow =
                    `   <div class="card circle card_show" style="display: none">
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
                                                <h3>教室:</h3>
                                                <p class="right">B10</p>
                                            </div>
                                            <div class="info">
                                                <h3>座位:</h3>
                                                <p class="right">50</p>
                                            </div>
                                            <div class="info"><h3>器材:</h3></div>
                                            <div class="row">
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">電腦*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">電腦*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">電腦*1</p>
                                                <p class="col-4 col-md-3 col-lg-4 col-xl-3">投影機*1</p>
                                            </div>
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

            }
        },
        error: function (thrownError) {
            console.log("Failed to get the list.");
            alert(thrownError);
        }
    });

    






}