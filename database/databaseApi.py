import flask
import pymongo
import json
import requests

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/')
def index():
    print("connected successfully !!")

    return "connected successfully !!"

@app.route('/DB/connectDB')
def connectDB():
    global AccountDB 
    
    client = pymongo.MongoClient()

    try:
        host = "mongodb://wayne1224:wayne1224@sandbox-shard-00-00.qjd2q.mongodb.net:27017,sandbox-shard-00-01.qjd2q.mongodb.net:27017,sandbox-shard-00-02.qjd2q.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bu8995-shard-0&authSource=admin&retryWrites=true&w=majority"
        client = pymongo.MongoClient(host , serverSelectionTimeoutMS = 10000, ssl = True, ssl_cert_reqs = 'CERT_NONE') # Timeout 10s
        db = client["NTOU"]           # choose database
        AccountDB = db["Account"]     # choose collection
        
        client.server_info()
        return json.dumps(True)

    except Exception as e:
        print(e)
        client.close()
        return json.dumps(False)

@app.route('/DB/findAccount/<string:userID>' , methods = ['GET'])
def findAccount(userID):
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
        print("The error of function findAccount() !!")
        print(e)     
        return json.dumps(False)

@app.route('/DB/insertAccount/data' , methods = ['POST'])
def insertAccount(data):
    try:
        pass
        
    except Exception as e:
        print("The error of function insertAccount() !!")
        print(e)     
        return json.dumps(False)

if __name__ == '__main__':
    app.run()

# http://127.0.0.1:5000/DB/connectDB
# http://127.0.0.1:5000/DB/findAccount/wayne1224
# 要把dictionary透過jsonify轉成JSON格式回傳；瀏覽器看不懂Python程式碼，需要轉換成JSON格式。