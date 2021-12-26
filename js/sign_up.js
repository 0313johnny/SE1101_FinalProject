

$("document").ready(function(){
    console.log("asdasdad");
    var CAPTCHA;//宣告驗證碼
    var email = new String;
    var password = new String;
    var checKPassword = new String;
    var inputCAPTCHA;
    $("#sign_up_btn").click(function(){
        console.log("sign_up!");
        password = $("input[name='Password']").val();
        checKPassword = $("input[name='checkPassword']").val();
        inputCAPTCHA = parseInt($("input[name='CAPTCHA']").val());
        if(password == ""){
            alert("密碼為必填資料!!");
        }
        else if(password != checKPassword){
            alert("密碼與確認密碼不一致!!");
        }
        else if(inputCAPTCHA != CAPTCHA){//
            alert("驗證碼錯誤");
        }
        else{//註冊資訊正確，新增使用者
            var user = {};
            user.userID = email;
            user.email = email + "@email.ntou.edu.tw";
            user.password = password;
            user.authority = "user";
            var insertData = JSON.stringify(user);
            console.log(user);
            $.ajax({ 
                type: "POST",
                url: "http://127.0.0.1:5000/DB/insertAccount", 
                data:insertData,
                success: function(re){
                    console.log(re);
                    if(re == "true")
                    {
                        alert("使用者"+email+"註冊成功!!請登入以使用預約功能。");
                        //window.location.replace("index.html");
                    }   
                    else
                        alert("此信箱已註冊過，請更換信箱");
                    //跳轉頁面回主頁
                },
                error: function (thrownError) {
                    console.log(thrownError);
                  }
            });

        }

    });
    $("#send_CAPTCHA").click(function(){
        email = $("input[name='email']").val();
        console.log("email");
        if(email == ""){//email為空   之後預計添加 else if(email是否已被註冊) else if(email是否存在)
            alert("email為必填資料!!");
        }
        else{
            CAPTCHA = Math.floor(Math.random()*899999+100000);//隨機產生一六位驗證碼
            console.log(CAPTCHA);
            Email.send({//寄出驗證碼
                SecureToken : "9464cce8-62a9-4145-9dcb-1aeb58cd91e8",
                To : email+'@email.ntou.edu.tw',
                From : "ntoumailonly@gmail.com",
                Subject : "ntou教室租借系統 驗證碼",
                Body : "您的驗證碼是： " + CAPTCHA
            }).then(alert("驗證碼已送出"));
        }
    });
});