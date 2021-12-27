$("document").ready(function(){
    $("#admin1").click(function(){
        //拿所有不是pending的預約並展示
        var pending_url = "http://127.0.0.1:5000/DB/findPenging";
        $.getJSON(pending_url,function(result){
            

        });

        

    });
});