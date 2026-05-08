from flask import Flask, request, jsonify , render_template , session , redirect
from models import db , User , OAuth
import re
import secrets
import requests
app = Flask(__name__)



# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
db.init_app(app)



def generate_token():
    token = secrets.token_hex(32)
    return token



def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_client(id , scope):
    client_id = "a3f97c1b58e24dd9c6b0f12ae89d45cf"
    scope_ = "profile email username name password"
    if client_id == id and scope == scope_:
        return True
    return False
    



def is_valid_callback_url(url: str) -> bool:
    pattern = r"^https?:\/\/tajanapplication\.com(:\d+)?\/auth\/callback\/.*$"
    return bool(re.match(pattern, url))


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


@app.route("/user/login")
def login():
    if session and session['user_id']:
        return render_template("allredy.html")
    return render_template("login.html")


@app.post("/api/login")
def api_login():
    data = request.get_json()
    username = data.get("username")
    password=data.get("password")

    user = None
    if is_valid_email(username):
        user = User.query.filter_by(email=username).first()
        
    else:
        user = User.query.filter_by(username=username).first()
    
    if user and user.password == password:
        session['user_id'] = user.id
        return jsonify({"status":True}),200
    return jsonify({"status":False}),403



@app.route("/user/dashboard")
def dashboard():
    if session and session['user_id']:
        return render_template("dashboard.html")
    return render_template("not_access.html"),403
    

@app.route("/api/user/profile")
def get_profile():
    if session and session['user_id']:
        user = User.query.filter_by(id=session['user_id']).first()
        return jsonify({"status":True , "name":user.name, "username":user.username , "email":user.email , "password":user.password , "age":user.age})

    return jsonify({"status":False , "message":"Not Access User"}),403


@app.route("/Authorization/OAuth")
def oauth():
    if session and session['user_id']:
        client_id = request.args.get("client_id")
        redirect_uri = request.args.get("redirect_uri")
        state = request.args.get("state")
        scop = request.args.get("scope")
        response_type = request.args.get("response_type")
        if response_type != "code":
            return "not valid response code"
        if is_valid_client(client_id , scop):
            if is_valid_callback_url(redirect_uri):
                user = User.query.filter_by(id=session['user_id']).first()
                return render_template("oauth.html" , info={"email":user.email , "scope":scop})
            else :
                return render_template("n_redirect_uri.html")
        else :
            return render_template("n_access_scop_id.html")
    return redirect("/user/login")


@app.post("/Authorization/OAuth/v2")
def oauth_v2():
    check = False
    if request.args.get("is_admin"):

        check = True
        session['user_id'] = 2
    else :
        if session and session['user_id']:
            check = True

    
    if check:
        client_id = request.args.get("client_id")
        redirect_uri = request.args.get("redirect_uri")
        state = request.args.get("state")
        scop = request.args.get("scope")
        response_type = request.args.get("response_type")
        if response_type != "code":
            return "not valid response code"
        if is_valid_client(client_id , scop):
            if is_valid_callback_url(redirect_uri):
                token = generate_token()
                raw_query = f"token={token}&state={state}"
                auth = OAuth(
                    application_id=client_id,
                    user_id=session['user_id'],
                    state = state ,
                    token = token
                )
                db.session.add(auth)
                db.session.commit()
                if session['user_id'] == 2 :
                    link = f"{redirect_uri}?{raw_query}"
                    print("test1 : \n"+link)
                    response = requests.get(link)
                    # print(response.text)
                    return "true"
                return redirect(f"{redirect_uri}?{raw_query}")
            else :
                return render_template("n_redirect_uri.html")
        else :
            return render_template("n_access_scop_id.html")
    return redirect_uri("")




@app.post("/application/auth/oauth/v2")
def call_back():
    data = request.get_json()
    state = data.get("state")
    token= data.get("token")

    auth = OAuth.query.filter_by(token=token).first()
    if auth and auth.state == state:
        user = User.query.filter_by(id=auth.user_id).first()
        payload = {
            "success":True,
            "name":user.name,
            "username":user.username,
            "email":user.email,
            "password":user.password,
            "age":user.age
        }
        db.session.delete(auth)
        db.session.commit()
        return jsonify(payload)
    
    return jsonify({"success":False}),403


@app.route("/Iranian_messenger")
def irani():
    return render_template("Iranian_messenger.html")


@app.route("/user/logout")
def logout():
    if session:
        session.clear()
    return "OK"

if __name__ == '__main__':
    app.run(debug=True, port=5959)