

$("document").ready(function(){
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
        if(false){//以下為判定註冊資勛格式是否正確
            alert("此信箱已註冊，請重新確認!!");
        }
        else if(password == ""){
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
            user.email = email;
            user.password = password;
            console.log(user);
        }

    });
    $("#send_CAPTCHA").click(function(){
        email = $("input[name='email']").val();
        console.log(email);
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