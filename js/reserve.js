$("document").ready(function(){
    console.log(sign_in_user);
    $("#search_btn").click(function(){
        var appointINFO = {};
        appointINFO = $("input[name='date']").val();
        console.log(typeof(appointINFO));
    });
});