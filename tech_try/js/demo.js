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
        var user = {};
        
        user.userID = "robin";
        var data = JSON.stringify(user);
        $.ajax({ 
            type: "POST",
            url: "http://127.0.0.1:5000/DB/insertAccount", 
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