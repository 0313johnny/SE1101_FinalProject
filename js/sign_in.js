$("document").ready(function(){
    if(sessionStorage.getItem('sign_in_user') != null)
    {
        $(".reserve_btn").css("display", "");
        $(".sign_out_btn").css("display", "");
        $(".sign_in_btn").css("display", "none");
        $(".sign_out_btn").html("<a class='nav-link' href='javascript:void(0)'>使用者 : "+sessionStorage.getItem('sign_in_user')+"</a>");
    }
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
    $("#sign_in_btn").click(function(){
        console.log("log in");
        var account = $("input[name='email']").val();
        var password = $("input[name='pswd']").val();
        $.ajax({ 
            type: "GET",
            url: "http://127.0.0.1:5000/DB/findAccountByEmail/"+account, 
            dataType: "json",
            success: function(re){
                if(re.password == password){
                    console.log("登入成功");
                    sign_in_user = re.userID;
                    console.log(typeof(sign_in_user));
                    sessionStorage.setItem('sign_in_user', sign_in_user);
                    $(".reserve_btn").css("display", "");
                    $(".sign_out_btn").css("display", "");
                    $(".sign_in_btn").css("display", "none");
                    $(".sign_out_btn").html("<a class='nav-link' href='javascript:void(0)'>使用者 : "+re.userID+"</a>");
                    //window.location.replace("searchpage.html");
                    //跳轉頁面 儲存帳號相關資訊
                }
                else{
                    alert("密碼或帳號錯誤。");
                    $("input[name='pswd']").val("");
                }
                
            },
            error: function (thrownError) {
                alert("伺服器忙碌中請稍後再試。");
                $("input[name='pswd']").val("");
              }
        });
        
    });
});