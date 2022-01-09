let ClassRooms = [
    {
        "classroomID": "B01",
        "name": "地下室教室",
        "location": "CSE 資工系館",
        "capacity": 40,
        "equipment": {},
        "imgLink": "https://i.imgur.com/UniMfif.png",
        "owner": "Michel Jackson"
    },
    {
        "classroomID": "B03",
        "name": "另一間地下室教室",
        "location": "CSE 資工系館",
        "capacity": 40,
        "equipment": {},
        "imgLink": "https://i.imgur.com/UniMfif.png",
        "owner": "Vladimir Putin"
    },
    {
        "classroomID": "B05",
        "name": "某一間地下室教室",
        "location": "CSE 資工系館",
        "capacity": 40,
        "equipment": {},
        "imgLink": "https://i.imgur.com/UniMfif.png",
        "owner": "Xi Jinping"
    },
    {
        "classroomID": "B07",
        "name": "還有另一間地下室教室",
        "location": "CSE 資工系館",
        "capacity": 40,
        "equipment": {},
        "imgLink": "https://i.imgur.com/UniMfif.png",
        "owner": "Kim Jong-un"
    }
]




$("document").ready(function (){
    $("#searchClassroom").click(function (){
        //console.log("clicked");
        //console.log(ClassRooms);
        let keyword = $("#searchClassroomKeyword").val();

        for(let e in ClassRooms){
            //console.log(e);
            if(keyword == ClassRooms[e].classroomID)
                console.log(ClassRooms[e]);
        }
    });
});