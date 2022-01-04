$("document").ready(function(){

    let classroomList;

    // Get the list of all classrooms
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/DB/getClassroomList",
        success: function(result){
            console.log("Get the list successful.");
            classroomList = result;
        },
        error: function (thrownError) {
            console.log("Failed to get the list.");
            alert(thrownError);
        }
    });

    






}