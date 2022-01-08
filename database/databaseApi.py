import flask
import pymongo
import json
from flask_cors import cross_origin
from datetime import date

app = flask.Flask(__name__)
app.config["DEBUG"] = True

## 確認伺服器已成功連接
@app.route('/')
def index():
    print("connected successfully !!")
    return "connected successfully !!"

# Database
## 連結資料庫 return True / False
@app.route('/DB/connectDB')
@cross_origin()
def connectDB():
    global db
    global AccountDB 
    global ClassroomInfoDB
    global AppointmentDB
    global RecordDB
    
    client = pymongo.MongoClient()

    try:
        #host = "mongodb://wayne1224:wayne1224@sandbox-shard-00-00.qjd2q.mongodb.net:27017,sandbox-shard-00-01.qjd2q.mongodb.net:27017,sandbox-shard-00-02.qjd2q.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bu8995-shard-0&authSource=admin&retryWrites=true&w=majority"
        host = "mongodb://wayne1224:wayne1224@sandbox-shard-00-00.qjd2q.mongodb.net:27017,sandbox-shard-00-01.qjd2q.mongodb.net:27017,sandbox-shard-00-02.qjd2q.mongodb.net:27017/myFirstDatabase?ssl=true&ssl_cert_reqs=CERT_NONE&replicaSet=atlas-bu8995-shard-0&authSource=admin&retryWrites=true&w=majority"
        client = pymongo.MongoClient(host , serverSelectionTimeoutMS = 10000) # Timeout 10s
        db = client["NTOU"]                       # choose database
        AccountDB = db["Account"]                 # choose collection
        ClassroomInfoDB = db["ClassroomInfo"]     # choose collection
        AppointmentDB = db["Appointment"]         # choose collection
        RecordDB = db["Record"]                   # choose collection
        
        client.server_info()
        return json.dumps(True)

    except Exception as e:
        print(e)
        client.close()
        return json.dumps(False)

@app.route('/DB/checkDB' , methods = ['GET'])
@cross_origin()
def checkDB():
    print("123")
    return json.dumps(True)

############################################################################################################################################################

# Account
## 用 userID 查詢帳號 , return Account / False
@app.route('/DB/findAccountByID/<string:userID>' , methods = ['GET'])
@cross_origin()
def findAccountByID(userID):
    try:
        query = dict()
        query["userID"] = userID
      
        if AccountDB.count_documents(query) == 0:
            print("can not find this Account")
            return json.dumps(False)
        else:
            data = AccountDB.find_one(query)
            del data['_id']
            return json.dumps(data)

    except Exception as e:
        print("The error of function findAccountByID() !!")
        print(e)     
        return json.dumps(False)

## 用 email 查詢帳號 , return Account / False
@app.route('/DB/findAccountByEmail/<string:email>' , methods = ['GET'])
@cross_origin()
def findAccountByEmail(email):
    try:
        query = dict()
        query["email"] = email
      
        if AccountDB.count_documents(query) == 0:
            print("can not find this Account")
            return json.dumps(False)
        else:
            data = AccountDB.find_one(query)
            del data['_id']
            return json.dumps(data)

    except Exception as e:
        print("The error of function findAccountByEmail() !!")
        print(e)     
        return json.dumps(False)

## 新增帳號 , return True / False
@app.route('/DB/insertAccount' , methods = ['GET' , 'POST'])
@cross_origin()
def insertAccount():
    try:
        data = json.loads(flask.request.get_data())
        
        query = dict()
        query["userID"] = data["userID"]

        # 在 Account 裡找不到 userID , 可以新增
        if AccountDB.count_documents(query) == 0:
            AccountDB.insert_one(data)
            return json.dumps(True)
        else:
            return json.dumps(False)
     
    except Exception as e:
        print("The error of function insertAccount() !!")
        print(e)     
        return json.dumps(False)

## 更新使用者權限 , return True / False
@app.route('/DB/updateAuthority' , methods = ['GET' , 'PUT'])
@cross_origin()
def updateAuthority():
    try:
        data = json.loads(flask.request.get_data())

        query = dict()
        query["userID"] = data["userID"]
      
        if AccountDB.count_documents(query) == 0:
            print("can not find this Account")
            return json.dumps(False)
        else:
            AccountDB.update_one(query , {"$set" : {"authority" : data["authority"]}})
            return json.dumps(True)

    except Exception as e:
        print("The error of function updateAuthority() !!")
        print(e)     
        return json.dumps(False)

############################################################################################################################################################

# ClassroomInfo
## 初始化教室資訊,insert static info
@app.route('/DB/initClassroomInfo', methods=['GET' , 'POST'])
@cross_origin()
def initClassroomInfo():
    try:
        ###set dict()
        classB10={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }

        classB12={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        classB07={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class303={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class407={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class409={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class101={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class105={
            "主機":1,
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1
        }
        class203={
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1,
            "主機":81
            }
        class205={
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1,
            "mac主機":23
            }
        class301={
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1,
            "主機":53
            }
        class314={
            "投影機":1,
            "擴大機":1,
            "麥克風":1,
            "喇叭":1,
            "布幕":1,
            "主機":65
            }

        ### information list about each class
        query=dict()
        query["B10"]={ "classroomID":"B10" , "name": "一般教室_E化教室", "location": "B10","capacity": 50, "equipment": classB10}
        query["B12"]={ "classroomID":"B12" , "name": "一般教室_E化教室", "location": "B12","capacity": 50,"equipment": classB12}
        query["B07"]={ "classroomID":"B07" , "name": "一般教室_E化教室", "location": "INSB07","capacity": 30,"equipment":classB07 }
        query["303"]={ "classroomID":"303" , "name": "視聽教室_E化教室", "location": "INS303","capacity": 60,"equipment":class303 }
        query["407"]={ "classroomID":"407" , "name": "研究生教室_E化教室", "location": "INS407","capacity": 15,"equipment":class407 }
        query["409"]={ "classroomID":"409" , "name": "研討室_E化教室", "location": "INS409","capacity": 15,"equipment":class409 }
        query["101"]={ "classroomID":"101" , "name": "視聽教室_階梯教室", "location": "INS101","capacity": 70,"equipment":class101 }
        query["105"]={ "classroomID":"105" , "name": "視聽教室_階梯教室", "location": "INS105","capacity": 70,"equipment":class105 }
        query["203"]={ "classroomID":"203" , "name": "個人電腦實驗室_教學實驗室", "location": "INS203","capacity": 80,"equipment":class203 }
        query["205"]={ "classroomID":"205" , "name": "3D多媒體教學實驗室_教學實驗室", "location": "INS205","capacity": 25,"equipment":class205 }
        query["301"]={ "classroomID":"301" , "name": "電子電路/數位邏輯教學實驗室/VLSI設計實習室/RFID資訊應用與安全實驗室_教學實驗室", "location": "INS301","capacity": 53,"equipment":class301}
        query["314"]= { "classroomID":"314" , "name": "物聯網實驗室_教學實驗室", "location": "電機一館314","capacity": 65,"equipment":class314}

        # classroomlist=[
        #    { "classroomID":"B10" , "name": "一般教室_E化教室", "location": "B10","capacity": 50, "equipment": classB10},
        #    { "classroomID":"B12" , "name": "一般教室_E化教室", "location": "B12","capacity": 50,"equipment": classB12},
        #    { "classroomID":"B07" , "name": "一般教室_E化教室", "location": "INSB07","capacity": 30,"equipment":classB07 },
        #    { "classroomID":"303" , "name": "視聽教室_E化教室", "location": "INS303","capacity": 60,"equipment":class303 },
        #    { "classroomID":"407" , "name": "研究生教室_E化教室", "location": "INS407","capacity": 15,"equipment":class407 },
        #    { "classroomID":"409" , "name": "研討室_E化教室", "location": "INS409","capacity": 15,"equipment":class409 },
        #    { "classroomID":"101" , "name": "視聽教室_階梯教室", "location": "INS101","capacity": 70,"equipment":class101 },
        #    { "classroomID":"105" , "name": "視聽教室_階梯教室", "location": "INS105","capacity": 70,"equipment":class105 },
        #    { "classroomID":"203" , "name": "個人電腦實驗室_教學實驗室", "location": "INS203","capacity": 80,"equipment":class203 },
        #    { "classroomID":"205" , "name": "3D多媒體教學實驗室_教學實驗室", "location": "INS205","capacity": 25,"equipment":class205 },
        #    { "classroomID":"301" , "name": "電子電路/數位邏輯教學實驗室/VLSI設計實習室/RFID資訊應用與安全實驗室_教學實驗室", "location": "INS301","capacity": 53,"equipment":class301},
        #    { "classroomID":"314" , "name": "物聯網實驗室_教學實驗室", "location": "電機一館314","capacity": 65,"equipment":class314}
        #]
        
        ###insert to db
        if ClassroomInfoDB.count_documents(query)==0:
            for i in range(len(query)):
                ClassroomInfoDB.insert_one(query[i])
            return json.dumps(True)
        else:
            print("error of initClassroomInfo()!!")
            return json.dumps(False)


    except Exception as e:
        print("The error of function initClassroomInfo() !!")
        print(e)     
        return json.dumps(False)

## 搜尋教室功能，從DB抓data
@app.route('/DB/findClassroom/<string:classroomID>' , methods = ['GET'])
@cross_origin()
def findClassroom(classroomID):
    try:
        classquery=dict()
        classquery["classroomID"]=classroomID

        ###check if class is exist        
        if ClassroomInfoDB.count_documents(classquery) == 0:
            print("can not find this class")
            return json.dumps(False)
        else:
            data = ClassroomInfoDB.find_one(classquery)       
            del data['_id']
            return json.dumps(data)

    except Exception as e:
        print("The error of function findClassroom() !!")
        print(e)     
        return json.dumps(False)

@app.route('/DB/findAllClassroomID' , methods = ['GET'])
@cross_origin()
def findAllClassroomID():
    try:
        classroomIDList = list(ClassroomInfoDB.find().sort("classroomID"))

        for i in range(len(classroomIDList)):
            del classroomIDList[i]["_id"]
            del classroomIDList[i]["name"]
            del classroomIDList[i]["location"]
            del classroomIDList[i]["capacity"]
            del classroomIDList[i]["equipment"]

        return json.dumps(classroomIDList)
    except Exception as e:
        print("The error of function findAllClassroomID() !!")
        print(e)     
        return json.dumps(False)

@app.route('/DB/findAllClassroom' , methods = ['GET'])
@cross_origin()
def findAllClassroom():
    try:
        classroomList = list(ClassroomInfoDB.find())

        for i in range(len(classroomList)):
            del classroomList[i]["_id"]

        return json.dumps(classroomList)
    except Exception as e:
        print("The error of function findAllClassroom() !!")
        print(e)     
        return json.dumps(False)

@app.route('/DB/insertClassroom' , methods = ['GET','POST'])
@cross_origin()
def insertClassroom():
    try:
       data = json.loads(flask.request.get_data())

       classroomID=data['classroomID']
       name=data['name']
       location=data['location']
       capacity=data['capacity']
       equipment=data['equipment']
       
       classroomlist=dict()

       classroomlist={
           "classroomID":classroomID,
           "name":name,
           "location":location,
           "capacity":capacity,
           "equipment":equipment
           }
    
       ClassroomInfoDB.insert_one(classroomlist)

       return json.dumps(True)
       
    except Exception as e:
        print("The error of function insertClassroom() !!")
        print(e)     
        return json.dumps(False)    

@app.route('/DB/deleteClassroom/<string:classroomID>' , methods = ['GET','DELETE'])
@cross_origin()
def deleteClassroom(classroomID):
    try:
        
        query=dict()

        query["classroomID"]=classroomID

        ClassroomInfoDB.delete_one(query)
        
        return json.dumps(True) 

    except Exception as e:
        print("The error of function deleteClassroom() !!")
        print(e)     
        return json.dumps(False) 

@app.route('/DB/updateClassroom' , methods = ['GET' , 'PUT' , 'DELETE'])
@cross_origin()
def updateClassroom():  
    try:
        data = json.loads(flask.request.get_data())
        query=dict()
        query['classroomID']=data['classroomID']
        
        if ClassroomInfoDB.count_documents(query) == 0:
            return json.dumps(False)

        ClassroomInfoDB.update_one(query , {
                                            "$set" :{
                                                "name" : data['name'],
                                                "location" : data['location'],
                                                "capacity" : data['capacity'],
                                                "equipment" : data['equipment']
                                                }                                           
                                            })
                                           

        return json.dumps(True) 

    except Exception as e:
        print("The error of function updateClassroom() !!")
        print(e)     
        return json.dumps(False) 
############################################################################################################################################################

# Appointment
## 查詢空閒的教室 , return 教室列表(list) / False
@app.route('/DB/findIdleClassroom' , methods = ['GET' , 'POST'])
@cross_origin()
def findIdleClassroom():
    try:
        data = json.loads(flask.request.get_data())

        # data = {
        #     "usingTime" : {
        #         "date" : "2022-01-04",
        #         "time" : [7],
        #         "weekday" : 0
        #     }
        # }

        ### 查詢所有教室
        classroomList = list(ClassroomInfoDB.find())

        ### 根據日期、使用時間、預約狀態，找出空閒的教室
        # query = dict()
        # query["usingTime.date"] = data["usingTime"]["date"]

        result = list(AppointmentDB.find())
       
        for a in result:
            if a["usingTime"]["date"] == data["usingTime"]["date"] or (a["isFixed"] == True and a["usingTime"]["weekday"] == data["usingTime"]["weekday"]):
                if [i for i in a["usingTime"]["time"] if i in data["usingTime"]["time"]]:
                    if a["status"] != "pending":
                        for c in classroomList:
                            if a["classroomID"] in c["classroomID"]:
                                classroomList.remove(c)

        for i in range(len(classroomList)):
            del classroomList[i]["_id"]

        return json.dumps(classroomList)

    except Exception as e:
        print("The error of function findIdleClassroom() !!")
        print(e)     
        return json.dumps(False) 

## 查詢所有狀態是 "pending" 的預約 , return appointment list / False
@app.route('/DB/findPenging' , methods = ['GET'])
@cross_origin()
def findPenging():
    try:
        query = dict()
        query["status"] = "pending"

        result = list(AppointmentDB.find(query))

        for i in range(len(result)):
            del result[i]["_id"]
        
        return json.dumps(result)

    except Exception as e:
        print("The error of function findPengingAppointment() !!")
        print(e)     
        return json.dumps(False) 

## 查詢所有狀態不是 "pending" 的預約 , return appointment list / False
@app.route('/DB/findNonPenging' , methods = ['GET'])
@cross_origin()
def findNonPenging():
    try:
        query = dict()
        query["status"] = {"$ne" : "pending"}

        result = list(AppointmentDB.find(query))

        for i in range(len(result)):
            del result[i]["_id"]
        
        return json.dumps(result)

    except Exception as e:
        print("The error of function findNonPenging() !!")
        print(e)     
        return json.dumps(False) 

## 回傳當日 non pending 和 isFixed == True
@app.route('/DB/findTodayNonPenging' , methods = ['GET'])
@cross_origin()
def findTodayNonPenging():
    try:
        ### 查詢當日 non pending
        query = dict()
        query["status"] = {"$ne" : "pending"}
        query["usingTime.date"] = date.today().strftime("%Y-%m-%d")

        result = list(AppointmentDB.find(query))

        ### 查詢當日 isFixed == True
        query = dict()
        query["usingTime.weekday"] = date.today().weekday()
        query["isFixed"] = True

        result.extend(list(AppointmentDB.find(query)))

        for i in range(len(result)):
            del result[i]["_id"]
        
        return json.dumps(result)

    except Exception as e:
        print("The error of function findTodayNonPenging() !!")
        print(e)     
        return json.dumps(False) 

## 計算借用者總共預約了幾間教室 , return 教室數量(int) / False
@app.route('/DB/findUserAppointments/<string:userID>' , methods = ['GET'])
@cross_origin()
def findUserAppointments(userID):
    try:
        query = dict()
        query["userID"] = userID

        if AppointmentDB.count_documents(query) == 0:
            print("can not find this Account")
            return json.dumps(False)
        else:
            data = list(AppointmentDB.find(query))

            for i in range(len(data)):
                del data[i]["_id"]

            return json.dumps(data)

    except Exception as e:
        print("The error of function countUserAppointments() !!")
        print(e)     
        return json.dumps(False)

## 新增非固定預約 , return True / False
@app.route('/DB/insertAppointment' , methods = ['GET' , 'POST'])
@cross_origin()
def insertAppointment():
    try:
        data = json.loads(flask.request.get_data())

        # data = {
        #     "userID" : "wayne1224",
        #     "classroomID" : "B07",
        #     "usingTime" : {
        #         "date" : "2021-12-25",
        #         "time" : [1 , 2 , 3]
        #     },
        #     "status" : "pending"
        # }

        query = dict()
        query["classroomID"] = data["classroomID"]

        result = AppointmentDB.find(query)
        
        for a in result:
            if (a["isFixed"] == False and a["usingTime"]["date"] == data["usingTime"]["date"]) or (a["isFixed"] == True and a["usingTime"]["weekday"] == data["usingTime"]["weekday"]):
                ### 相同時間、相同借用者，重複的預約
                if a["usingTime"]["time"] == data["usingTime"]["time"] and a["userID"] == data["userID"]:
                    return json.dumps(False)
                ### 此時段、此時間，已經有人成功預約了
                elif [i for i in a["usingTime"]["time"] if i in data["usingTime"]["time"]]:
                    if a["status"] != "pending":
                        return json.dumps(False)
              
        AppointmentDB.insert_one(data)

        return json.dumps(True)
     
    except Exception as e:
        print("The error of function insertAppointment() !!")
        print(e)     
        return json.dumps(False)

## 新增固定預約 , return True / False
@app.route('/DB/insertFixed' , methods = ['GET' , 'POST' , 'DELETE'])
@cross_origin()
def insertFixed():
    try:
        data = json.loads(flask.request.get_data()) # 因為是固定預約 date == ""

        query = dict()
        query["classroomID"] = data["classroomID"]

        result = AppointmentDB.find(query)
        deleteList = list()
        
        for a in result:
            if a["usingTime"]["weekday"] == data["usingTime"]["weekday"]:
                if [i for i in a["usingTime"]["time"] if i in data["usingTime"]["time"]]:
                    if a["status"] != "pending":
                        return json.dumps(False)
                    elif a["status"] == "pending":
                        deleteList.append(a["_id"])

        AppointmentDB.insert_one(data)

        ### 把其他同時間 status == pending 的預約刪除
        for d in deleteList:
            query = dict()
            query["_id"] = d["_id"]

            AppointmentDB.delete_one(query)
        
        return json.dumps(True)

    except Exception as e:
        print("The error of function insertFixed() !!")
        print(e)     
        return json.dumps(False)

## 更改預約狀態，return True / False
@app.route('/DB/updateStatus' , methods = ['GET' , 'PUT' , 'DELETE'])
@cross_origin()
def updateStatus():
    try:
        data = json.loads(flask.request.get_data())
        
        # data = {
        #     "userID" : "wayne1224",
        #     "classroomID" : "B07",
        #     "usingTime" : {
        #         "date" : "2021-12-25",
        #         "time" : [1 , 2 , 3]
        #     },
        #     "status" : "reserving"
        # }

        ### 更新預約狀態
        query = dict()
        query["userID"] = data["userID"]
        query["classroomID"] = data["classroomID"]
        query["usingTime.date"] = data["usingTime"]["date"]
        query["usingTime.time"] = data["usingTime"]["time"]

        if AppointmentDB.count_documents(query) == 0:
            return json.dumps(False)

        AppointmentDB.update_one(query , {"$set" : {"status" : data["status"]}})

        ### 刪除其他相同 教室 , 日期 , 時段 的預約
        query = dict()
        query["classroomID"] = data["classroomID"]
        query["usingTime.date"] = data["usingTime"]["date"]

        result = list(AppointmentDB.find(query))

        for a in result:
            if [i for i in a["usingTime"]["time"] if i in data["usingTime"]["time"]]:
                if a["status"] == "pending":
                    AppointmentDB.delete_one({"_id" : a["_id"]})
       
        return json.dumps(True)

    except Exception as e:
        print("The error of function updateStatus() !!")
        print(e)     
        return json.dumps(False) 

## 刪除預約，return True / False
@app.route('/DB/deleteAppointment' , methods = ['GET' , 'DELETE'])
@cross_origin()
def deleteAppointment():
    try:
        data = json.loads(flask.request.get_data())

        query = dict()
        query["userID"] = data["userID"]
        query["classroomID"] = data["classroomID"]
        query["usingTime.date"] = data["usingTime"]["date"]
        query["usingTime.time"] = data["usingTime"]["time"]
        query["usingTime.weekday"] = data["usingTime"]["weekday"]
        query["status"] = data["status"]

        if AppointmentDB.count_documents(query) == 0:
            return json.dumps(False)

        AppointmentDB.delete_one(query)
        
        return json.dumps(True)

    except Exception as e:
        print("The error of function deleteAppointment() !!")
        print(e)     
        return json.dumps(False) 

############################################################################################################################################################

# record
## 新增歷史資料
@app.route('/DB/insertrecord', methods = ["GET" , "POST"])
@cross_origin()
def insertrecord():
    try:
        recordlist=[
            {"classroomID":"B10","userID":"00857003", "usingTime":"306-308", "purpose":"機率論課程"},
            {"classroomID":"B12","userID":"00857004", "usingTime":"406-408" , "purpose":"程式設計實習課程"},
            {"classroomID":"B07","userID":"00857027", "usingTime":"102-104" , "purpose":"線性代數課程"},
            {"classroomID":"303","userID":"00757025", "usingTime":"402-404" , "purpose":"軟體工程課程"},
            {"classroomID":"407","userID":"00857041", "usingTime":"102-104" , "purpose":"計算機概論課程"},
            {"classroomID":"409","userID":"00857004", "usingTime":"202-204" , "purpose":"資訊安全課程"},
            {"classroomID":"101","userID":"00857003", "usingTime":"302-304" , "purpose":"計算機組織學課程"},
            {"classroomID":"105","userID":"00857027", "usingTime":"406-408" , "purpose":"程式語言課程"},
            {"classroomID":"203","userID":"00857025", "usingTime":"506-508" , "purpose":"計算機系統設計課程"},
            {"classroomID":"205","userID":"00857004", "usingTime":"106-108" , "purpose":"微積分課程"},
            {"classroomID":"301","userID":"00857027", "usingTime":"206-208" , "purpose":"資訊安全課程"},
            {"classroomID":"314","userID":"00857041", "usingTime":"306-308" , "purpose":"程式設計課程"}
        ]

        if RecordDB.count_documents(recordlist) == 0:
            RecordDB.insert_many(recordlist)
            return json.dumps(True)
        else:
            print('recordlist has been existed')
            return json.dumps(False) 

    except Exception as e:
        print("The error of function insertrecord() !!")
        print(e)     
        return json.dumps(False)

## 用classroomID查詢歷史紀錄
@app.route('/DB/findrecord/<string:classroomID>' , methods = ['GET'])
@cross_origin()
def findrecord(classroomID):
   try:
       recordquery=dict()
       recordquery["classroomID"]=classroomID
       if RecordDB.count_documents(recordquery) == 0:
            print("can not find this class record")
            return json.dumps(False)
       else:
            data = RecordDB.find_one(recordquery)
            return json.dumps(data)
   except Exception as e:
       print("The error of function findrecord() !!")
       print(e)                                        
       return json.dumps(False)       

if __name__ == '__main__':
    app.run()

# Database
# http://127.0.0.1:5000/DB/connectDB
# http://127.0.0.1:5000/DB/checkDB

# Account
# http://127.0.0.1:5000/DB/findAccountByID/wayne1224
# http://127.0.0.1:5000/DB/findAccountByEmail/waynewayne1224@gmail.com
# http://127.0.0.1:5000/DB/insertAccount

#ClassroomInfo
# http://127.0.0.1:5000/DB/initClassroomInfo
# http://127.0.0.1:5000/DB/findClassroom
# http://127.0.0.1:5000/DB/insertClassroom
# http://127.0.0.1:5000/DB/deleteClassroom
# http://127.0.0.1:5000/DB/updateClassroom
# http://127.0.0.1:5000/DB/findAllClassroom
# http://127.0.0.1:5000/DB/findAllClassroomID

# Appointment
# http://127.0.0.1:5000/DB/findIdleClassroom
# http://127.0.0.1:5000/DB/insertAppointment
# http://127.0.0.1:5000/DB/insertFixed
# http://127.0.0.1:5000/DB/findUserAppointments/wayne1224
# http://127.0.0.1:5000/DB/findReservingClassroom
# http://127.0.0.1:5000/DB/findPenging
# http://127.0.0.1:5000/DB/findNonPenging
# http://127.0.0.1:5000/DB/findTodayNonPenging
# http://127.0.0.1:5000/DB/updateStatus
# http://127.0.0.1:5000/DB/deleteAppointment


# 要把dictionary透過jsonify轉成JSON格式回傳；瀏覽器看不懂Python程式碼，需要轉換成JSON格式。

# POST = insert
# GET = find , read
# PUT = update
# DELETE = delete
