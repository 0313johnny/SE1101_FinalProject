$("document").ready(function(){

    console.log(globle);
    
    $(".mail").click(function(){
        console.log("mail");
        Email.send({
            SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
            To : 'zxccer32r32lasdadasdasdasffasdweqwepogopgwerr@gmail.com',
            From : "ntoumailonly@gmail.com",
            Subject : "test2",
            Body : "try to send an email by smtpjs again!"
        }).then(message => alert(message));

    });
    $(".connect").click(function(){
        console.log("connect");
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
          
    });
    $(".get").click(function(){
        console.log("get");
        $.ajax({ 
            type: "GET",
            url: "http://127.0.0.1:5000/DB/findAccount/wayne1224", 
            dataType: "json",
            success: function(re){
                console.log(re);
            },
            error: function (thrownError) {
                console.log(thrownError);
              }
        });
          
    });
    $(".post").click(function(){
        console.log("post");
        var classroom = {};
        classroom.classroomID = "C101";
        classroom.name = "一般教室_生物實驗室";
        classroom.location = "C101";
        classroom.capacity = "50";
        classroom.equipment = {};
        classroom.equipment.主機 = 1;
        classroom.equipment.投影機 = 1;
        classroom.equipment.擴大機 = 1;
        classroom.equipment.喇叭 = 1;
        
        var data = JSON.stringify(classroom);
        $.ajax({ 
            type: "POST",
            url: "http://127.0.0.1:5000/DB/insertClassroom", 
            data:data,
            success: function(re){
                console.log(re);
            },
            error: function (thrownError) {
                console.log(thrownError);
              }
        });
    });
    $(".put").click(function(){
        console.log("post");
        var apoint = {};
        apoint.userID = "ROBIN";
        apoint.classroomID = "207"
        apoint.usingTime = {};
        apoint.usingTime.date = "2021-12-29";
        apoint.usingTime.time = [4,5,6];
        apoint.usingTime.class = 3;
        apoint.purpose = "程式語言";
        apoint.status = "reserving";
        apoint.isFixed = false;
        console.log(apoint);
        //user.userID = "robin";
        var data = JSON.stringify(apoint);
        $.ajax({ 
            type: "PUT",
            url: "http://127.0.0.1:5000/DB/updateStatus", 
            data:data,
            success: function(re){
                console.log(re);
            },
            error: function (thrownError) {
                console.log(thrownError);
              }
        });
    });
    $(".delete").click(function(){
        console.log("delete");
        var apoint = {};
        apoint.userID = "ROBIN";
        apoint.classroomID = "207"
        apoint.usingTime = {};
        apoint.usingTime.date = "2021-12-29";
        apoint.usingTime.time = [4,5,6];
        apoint.usingTime.class = 3;
        console.log(apoint);
        //user.userID = "robin";
        var data = JSON.stringify(apoint);
        $.ajax({ 
            type: "DELETE",
            url: "http://127.0.0.1:5000/DB/deleteAppointment", 
            data:data,
            success: function(re){
                console.log(re);
            },
            error: function (thrownError) {
                console.log(thrownError);
              }
        });
    });
    
});