function get_classroom_list( append_targetID ){

    let html_list = "";
    console.log("get_classroom_list()");

    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findAllClassroom",
        dataType: "json",
        success: function(result){

            console.log("Get the list successful.");

            $.each(result,function(index, classroom) {
                html_list += `<div class="col-12 col-sm-6 col-md-3 p-1">
                                    <div id="classroom_${classroom.classroomID}" class="card_spec_edit card m-3 container_sp text-dark glass">
                                        <div class="card-body">
                                            <h1>${classroom.classroomID}</h1>
                                            <p>座位：${classroom.capacity}</p>
                                            <p>器材：……</p>
                                        </div>
                                    </div>
                                </div>`;


            });

            // 加入到jQuery選擇器中的區塊下
            $("#" + append_targetID).append(html_list);
        }
    });
}

function get_classroom_info(){

    let html_list = "";
    console.log("get_classroom_info()");

    $.ajax({
        type: "GET",
        url: "https://se1101-finalp-roject.herokuapp.com/DB/findAllClassroom",
        dataType: "json",
        success: function(result){

            console.log("Get the list successful.");

            $.each(result,function(index, classroom) {
                html_list += `<div class="col-12 col-sm-6 col-md-3 p-1">
                                    <div id="classroom_${classroom.classroomID}" class="card_spec_edit card m-3 container_sp text-dark glass">
                                        <div class="card-body">
                                            <h1>${classroom.classroomID}</h1>
                                            <p>座位：${classroom.capacity}</p>
                                            <p>器材：……</p>
                                        </div>
                                    </div>
                                </div>`;


            });

            // 加入到jQuery選擇器中的區塊下
            $("#" + append_targetID).append(html_list);
        }
    });


}








$("document").ready(function(){

    // 清空預設畫面
    $("#edit_card").html("<h1 class=\"mt-5\" style=\"color: aliceblue\">教室列表</h1>"); // reset

    // 加入擷取到的教室列表 參數為要插入的div的ID
    get_classroom_list("edit_card");





});