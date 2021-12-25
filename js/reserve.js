$("document").ready(function(){
    //console.log(sign_in_user);
    $("#search_btn").click(function(){
        console.log("search");
        var appointINFO = {};
        appointINFO.usingTime = {};
        appointINFO.usingTime.date = $("input[name='date']").val();
        var start = parseInt($("select[name='start_class']").val());
        var period = parseInt($("select[name='period']").val());
        console.log(start +"    "+ period);
        var arry = [];
        for(var i = 0;i < period;i++)
        {
            arry[i] = start + i;
        }
        appointINFO.usingTime.time = arry;
        appointINFO.usingTime.class = period;
        console.log(appointINFO);
        var data = JSON.stringify(appointINFO);
        $.ajax({ 
            type: "POST",
            url: "http://127.0.0.1:5000/DB/findIdleClassroom", 
            dataType: "json",
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