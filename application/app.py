from flask import Flask, request, jsonify , render_template , session , redirect
from models import db , User ,State
import re
import secrets
import requests
import threading

app = Flask(__name__)


redirect_uri_global = "http://tajanapplication.com:5000/auth/callback/"
scope_global = "profile email username name password"
response_type_global = "code"
client_id_global = "a3f97c1b58e24dd9c6b0f12ae89d45cf"


def do_background_request(link):
    try:
        proxies = {
    "http": "http://127.0.0.1:8080",
    "https": "http://127.0.0.1:8080"
}
        response = requests.post(link, timeout=10 , proxies=proxies , verify=False)
        print("Background request completed:", response.status_code)
    except Exception as e:
        print("Background request failed:", e)

def generate_state(length=32):
    return secrets.token_urlsafe(length)




# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///application.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here-application'

# Initialize database
db.init_app(app)


def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None



# Create tables
with app.app_context():
    db.create_all()

    if not User.query.filter_by(email='aliziro@example.com').first():
        user1 = User(
            name="ali",
            username='aliziro',
            email='aliziro@example.com',
            password='123456',
            age=25
        )
        db.session.add(user1)

    if not User.query.filter_by(email='admin@example.com').first():
        user2 = User(
            name="admin",
            username='super_admin',
            email='admin@example.com',
            password='@Test&Gohbinm54',
            age=30
        )
        db.session.add(user2)

    db.session.commit()
    print("Database created successfully!")



@app.route("/")
def index():
    return render_template("index.html")



@app.route("/application/user/login")
def login():
    if session and session['user_id']:
        return render_template("allredy.html")
    return render_template("login.html")


@app.post("/application/api/login")
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = None
    if is_valid_email(username):
        user = User.query.filter_by(email=username).first()
    else:
        user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        session['user_id'] = user.id
        return jsonify({"status":True}),200
    return jsonify({'status':False}),403



@app.route("/application/user/dashboard")
def dashboard():
    if session and session['user_id']:
        return render_template("dashboard.html"),200
    return render_template("not_access.html"),403



@app.route("/application/api/profile")
def get_profile():
    if session and session['user_id']:
        flag = "None"
        user = User.query.filter_by(id=session['user_id']).first()
        if user.username == "super_admin":
            flag = "flag{ d0nt_tru5t_us3r_1nput }"
        return jsonify({"status":True , "name":user.name , "username":user.username , "email":user.email , "password":user.password
                        ,
                        "age":user.age , 
                        "flag":flag}),200
    return render_template("not_access.html"),403


@app.route("/login/OAuth")
def oauth():
    global client_id_global , redirect_uri_global , scope_global , response_type_global
    state = generate_state()
    s = State(state=state)
    db.session.add(s)
    db.session.commit()

    return jsonify({"status":"ok",
                    "client_id":client_id_global , "redirect_uri":redirect_uri_global , "state":state , "scope":scope_global,
                    "type":response_type_global})
    

@app.route("/user/logout")
def logout():
    url = request.args.get("redirect")
    if session:
        session.clear()
    if url:
        return redirect(url)
    else:
        return redirect("/application/user/login")

@app.route("/auth/callback/")
def call_back():
    state = request.args.get('state')
    token = request.args.get('token')
    payload = {
        "state": state,
        "token": token
    }

    response = requests.post(
        "http://tajanprovider.com:5959/application/auth/oauth/v2",
        json=payload
    )

    data = response.json()
    if data.get("success"):
        user = User.query.filter_by(
            email=data.get("email")
        ).first()
        if user and user.password == data.get("password"):
            session['user_id'] = user.id
            return redirect("/application/user/dashboard")
        return render_template("not_valid_credentials.html")
    return render_template("not_valid_token.html")



@app.route("/admin")
def admin():
    return render_template("admin.html")



@app.post("/admin/link")
def link_admin():
    data = request.get_json()
    link = data.get("link")




    link +="&is_admin=True"


    if "/Authorization/OAuth/v2" not in link:
        return jsonify({"success": False, "message": "Admin identified the malicious link."})


    threading.Thread(target=do_background_request, args=(link,)).start()


    return jsonify({"success": True})



@app.route("/Iranian_messenger")
def irani():
    return render_template("Iranian_messenger.html")






if __name__ == '__main__':
    app.run(debug=True, port=5000)