import flask
import pymongo
import json
from flask_cors import cross_origin
import sys

sys.path.append("database\\databaseApi.py")

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
        host = "mongodb://wayne1224:wayne1224@sandbox-shard-00-00.qjd2q.mongodb.net:27017,sandbox-shard-00-01.qjd2q.mongodb.net:27017,sandbox-shard-00-02.qjd2q.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bu8995-shard-0&authSource=admin&retryWrites=true&w=majority"
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
        classroomlist=[
            { "classroomID":"B10" , "name": "一般教室_E化教室", "location": "B10","capacity": 50, "equipment": classB10},
            { "classroomID":"B12" , "name": "一般教室_E化教室", "location": "B12","capacity": 50,"equipment": classB12},
            { "classroomID":"B07" , "name": "一般教室_E化教室", "location": "INSB07","capacity": 30,"equipment":classB07 },
            { "classroomID":"303" , "name": "視聽教室_E化教室", "location": "INS303","capacity": 60,"equipment":class303 },
            { "classroomID":"407" , "name": "研究生教室_E化教室", "location": "INS407","capacity": 15,"equipment":class407 },
            { "classroomID":"409" , "name": "研討室_E化教室", "location": "INS409","capacity": 15,"equipment":class409 },
            { "classroomID":"101" , "name": "視聽教室_階梯教室", "location": "INS101","capacity": 70,"equipment":class101 },
            { "classroomID":"105" , "name": "視聽教室_階梯教室", "location": "INS105","capacity": 70,"equipment":class105 },
            { "classroomID":"203" , "name": "個人電腦實驗室_教學實驗室", "location": "INS203","capacity": 80,"equipment":class203 },
            { "classroomID":"205" , "name": "3D多媒體教學實驗室_教學實驗室", "location": "INS205","capacity": 25,"equipment":class205 },
            { "classroomID":"301" , "name": "電子電路/數位邏輯教學實驗室/VLSI設計實習室/RFID資訊應用與安全實驗室_教學實驗室", "location": "INS301","capacity": 53,"equipment":class301},
            { "classroomID":"314" , "name": "物聯網實驗室_教學實驗室", "location": "電機一館314","capacity": 65,"equipment":class314}
        ]
        ###insert to db
        ClassroomInfoDB.insert_many(classroomlist)
        return json.dumps(True)
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

       classroomlist={"classroomID":classroomID,"name":name,"location":location,"capacity":capacity,"equipment":equipment}
    
       ClassroomInfoDB.insert_one(classroomlist)

       return json.dumps(True)
       
    except Exception as e:
        print("The error of function insertClassroom() !!")
        print(e)     
        return json.dumps(False)    

@app.route('/DB/deleteClassroom' , methods = ['GET','DELETE'])
@cross_origin()
def deleteClassroom():
    try:
        data = json.loads(flask.request.get_data())
        
        query=dict()
        query={"name":data['name']}

        ClassroomInfoDB.delete_one(query)
        
        return json.dumps(True) 

    except Exception as e:
        print("The error of function deleteClassroom() !!")
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
        
        ### 查詢所有的教室列表
        classroomList = list()

        for c in ClassroomInfoDB.find():
            classroomList.append(c["classroomID"])

        ### 根據日期、使用時間、預約狀態，找出空閒的教室
        query = dict()
        query["usingTime.date"] = data["usingTime"]["date"]

        result = list(AppointmentDB.find(query))
       
        for a in result:
            if a["usingTime"]["date"] == data["usingTime"]["date"]:
                if [i for i in a["usingTime"]["time"] if i in data["usingTime"]["time"]]:
                    if a["status"] != "pending":
                        classroomList.remove(a["classroomID"])

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
        query["status"] = {"$ne" : "pending" }

        result = list(AppointmentDB.find(query))

        for i in range(len(result)):
            del result[i]["_id"]
        
        return json.dumps(result)

    except Exception as e:
        print("The error of function findPengingAppointment() !!")
        print(e)     
        return json.dumps(False) 

## 計算借用者總共預約了幾間教室 , return 教室數量(int) / False
@app.route('/DB/countUserAppointments/<string:userID>' , methods = ['GET'])
@cross_origin()
def countUserAppointments(userID):
    try:
        query = dict()
        query["userID"] = userID

        if AppointmentDB.count_documents(query) == 0:
            print("can not find this Account")
            return json.dumps(False)
        else:
            data = list(AppointmentDB.find(query))
            return json.dumps(len(data))

    except Exception as e:
        print("The error of function countUserAppointments() !!")
        print(e)     
        return json.dumps(False)

## 新增預約 , return True / False
@app.route('/DB/insertAppointment' , methods = ['GET','POST'])
@cross_origin()
def insertAppointment():
    try:
        data = json.loads(flask.request.get_data())
        print(data)
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
            if a["usingTime"]["date"] == data["usingTime"]["date"]:
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

## 更改預約狀態，return True / False
@app.route('/DB/updateStatus' , methods = ['GET' , 'PUT'])
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

        AppointmentDB.update_one(query , {"$set" : {"status" : data["status"]}})

        ### 刪除其他相同時間的預約
        query = dict()
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

############################################################################################################################################################

#record
#新增歷史資料
@app.route('/DB/insertrecord', methods = ["GET" , "POST"])
@cross_origin()
def insertrecord():
    try:
        recordlist = [
            {"classroomID":"B10","userID":"00857003 ", "usingTime":"306-308", "purpose":"機率論課程"},
            {"classroomID":"B12","userID":"00857004 ", "usingTime":"406-408" , "purpose":"微積分課程"},
            {"classroomID":"303","userID":"00857027 ", "usingTime":"402-404" , "purpose":"軟體工程課程"},
            {"classroomID":"105","userID":"00757025 ", "usingTime":"502-504" , "purpose":"作業系統課程"},
            {"classroomID":"203","userID":"00857123 ", "usingTime":"102-104" , "purpose":"計算機系統設計課程"}
        ]
        RecordDB.insert_many(recordlist)
        return json.dumps(recordlist)
    except Exception as e:
        print("The error of function insertrecord() !!")
        print(e)     
        return json.dumps(False)

#用classroomID查詢歷史紀錄
@app.route('/DB/findrecord/<string:userID>' , methods = ['GET'])
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

# Appointment
# http://127.0.0.1:5000/DB/insertAppointment
# http://127.0.0.1:5000/DB/countUserAppointments/wayne1224
# http://127.0.0.1:5000/DB/findReservingClassroom
# http://127.0.0.1:5000/DB/findPenging
# http://127.0.0.1:5000/DB/findNonPenging
# http://127.0.0.1:5000/DB/updateStatus

# 要把dictionary透過jsonify轉成JSON格式回傳；瀏覽器看不懂Python程式碼，需要轉換成JSON格式。

# POST = insert
# GET = find , read
# PUT = update
# DELETE = delete
