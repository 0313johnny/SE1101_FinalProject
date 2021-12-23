$("document").ready(function(){
    $('#sign_in_btn').click(function(){
        var account = $("input[name='email']").val();
        var password = $("input[name='pswd']").val();
        $.ajax({ 
            type: "GET",
            url: "http://127.0.0.1:5000/DB/findAccount/"+account, 
            dataType: "json",
            success: function(re){
                if(re.password == password){
                    console.log("登入成功");
                    //跳轉頁面 儲存帳號相關資訊
                }
                else{
                    alert("密碼錯誤。");
                    $("input[name='pswd']").val("");
                }
                console.log(re);
            },
            error: function (thrownError) {
                alert("帳號錯誤!!");
                $("input[name='pswd']").val("");
              }
        });
        
    });
});