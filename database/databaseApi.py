import flask
import pymongo
import json
from flask_cors import cross_origin

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
    print(AccountDB)
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
@app.route('/DB/insertAccount' , methods = ['POST'])
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
@app.route('/DB/updateAuthority' , methods = ['PUT'])
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
@app.route('/DB/insertClassroomInfo',methods = ['GET','POST'])
@cross_origin()
def insertClassroomInfo():
    try:
        classroomlist=[
            { "classroomID":"B10" , "name": "一般教室_E化教室", "location": "B10","capacity": 50,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"B12" , "name": "一般教室_E化教室", "location": "B12","capacity": 50,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"B07" , "name": "一般教室_E化教室", "location": "INSB07","capacity": 30,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"303" , "name": "視聽教室_E化教室", "location": "INS303","capacity": 60,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"407" , "name": "研究生教室_E化教室", "location": "INS407","capacity": 15,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"409" , "name": "研討室_E化教室", "location": "INS409","capacity": 15,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"101" , "name": "視聽教室_階梯教室", "location": "INS101","capacity": 70,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"105" , "name": "視聽教室_階梯教室", "location": "INS105","capacity": 70,"equipment": "數位多功能講桌(含主機、投影機、擴大機、麥克風、喇叭、布幕)"},
            { "classroomID":"203" , "name": "個人電腦實驗室_教學實驗室", "location": "INS203","capacity": 80,"equipment": "投影機、擴大機、麥克風、喇叭、布幕、81台主機"},
            { "classroomID":"205" , "name": "3D多媒體教學實驗室_教學實驗室", "location": "INS205","capacity": 25,"equipment": "投影機、擴大機、麥克風、喇叭、布幕、23台mac主機"},
            { "classroomID":"301" , "name": "電子電路/數位邏輯教學實驗室/VLSI設計實習室/RFID資訊應用與安全實驗室_教學實驗室", "location": "INS301","capacity": 53,"equipment": "投影機、擴大機、麥克風、喇叭、布幕、53台主機"},
            { "classroomID":"314" , "name": "物聯網實驗室_教學實驗室", "location": "電機一館314","capacity": 65,"equipment": "擴大機、麥克風、喇叭、65台主機"}
        ]
        ClassroomInfoDB.insert_many(classroomlist)
        return json.dumps(True)
    except Exception as e:
        print("The error of function insertClassroomInfo() !!")
        print(e)     
        return json.dumps(False)

@app.route('/DB/findClassroom/<string:classroomID>' , methods = ['GET'])
@cross_origin()
def findClassroom(classroomID):
    try:
        classquery=dict()
        classquery["classroomID"]=classroomID
        if ClassroomInfoDB.count_documents(classquery) == 0:
            print("can not find this class")
            return json.dumps(False)
        else:
            data = ClassroomInfoDB.find_one(classquery)
            
            return json.dumps(data)
    except Exception as e:
        print("The error of function findClassroom() !!")
        print(e)     
        return json.dumps(False)

############################################################################################################################################################

# Appointment
## 新增預約 , return True / False
@app.route('/DB/insertAppointment' , methods = ['POST'])
@cross_origin()
def insertAppointment():
    try:
        pass
     
    except Exception as e:
        print("The error of function insertAppointment() !!")
        print(e)     
        return json.dumps(False)


############################################################################################################################################################

# Record

if __name__ == '__main__':
    app.run()

# http://127.0.0.1:5000/DB/connectDB
# http://127.0.0.1:5000/DB/checkDB
# http://127.0.0.1:5000/DB/findAccountByID/wayne1224
# http://127.0.0.1:5000/DB/findAccountByEmail/waynewayne1224@gmail.com
# http://127.0.0.1:5000/DB/insertAccount
# 要把dictionary透過jsonify轉成JSON格式回傳；瀏覽器看不懂Python程式碼，需要轉換成JSON格式。

# POST = insert
# GET = find , read
# PUT = update
# DELETE = delete