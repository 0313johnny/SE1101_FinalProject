$("document").ready(function(){
    //console.log(sign_in_user);
    $("#search_btn").click(function(){
        console.log("search");
        var appointINFO = {};
        appointINFO.date = $("input[name='date']").val();
        var start = parseInt($("select[name='start_class']").val());
        var period = parseInt($("select[name='period']").val());
        console.log(start +"    "+ period);
        var arry = [];
        for(var i = 0;i < period;i++)
        {
            arry[i] = start + i;
        }
        appointINFO.time = arry;

        console.log(appointINFO);
    });
});