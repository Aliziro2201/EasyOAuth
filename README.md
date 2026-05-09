# EasyOAuth
A vulnerable OAuth 2.0 lab demonstrating real-world authorization weaknesses.

In many regions, access to international educational platforms and security training labs is difficult—or sometimes impossible—due to internet restrictions. As a result, many students and security enthusiasts cannot practice real-world labs or improve their hands‑on skills.

EasyOAuth was created to help solve this problem.

The goal of this project is to provide a fully local, offline‑friendly security lab so that students, researchers, and penetration testers can practice OAuth vulnerabilities without needing stable internet access.

By running everything locally, learners can simulate real attack scenarios and understand how a small misconfiguration in OAuth can lead to serious issues such as account takeover.

Of course, this is an early project, and it may contain bugs, limitations, or areas that can be improved. We fully acknowledge this and plan to make future labs more optimized, polished, and professional based on community feedback.

This project is just the beginning.

We plan to build and publish more vulnerable labs and security challenges so that anyone—even with restricted internet—can continue learning and improving their skills.

If this project helps you learn, your support would be greatly appreciated and will help us continue developing more educational security labs.

# ❤️ Support the Project
Donate:

https://daramet.com/AliZiro

📡 Follow the Project
Telegram

https://t.me/TajanSecurity

Rubika

https://rubika.ir/Tajan_Security

Bale

https://ble.ir/Tajan_Security

Your support helps us release more educational security labs for the community.

---




# 🛡️ EasyOAuth — OAuth 2.0 Vulnerability Lab

An educational environment demonstrating how insecure OAuth 2.0 implementations can lead to account takeover vulnerabilities.

This lab contains two services:

- Application (Client)
- OAuth Provider (Authorization Server)

The goal of this project is to simulate a real-world OAuth misconfiguration where an attacker can impersonate the `admin` user without knowing their credentials.

---

# 🧩 Project Architecture

The lab consists of two Flask services running simultaneously:

Application (Client):  
```text
http://tajanapplication.com:5000
```

OAuth Provider:  
```text
http://tajanprovider.com:5959
```

---

# ⚠️ Important Note (Main Vulnerable Point)

The primary vulnerable endpoint in this project is:
Sent the vulnerable link to the admin at the following address:

```text
/admin
```

---

# 📝 Configure Hosts File

To run the lab correctly, add these domains to your hosts file:

```text
tajanapplication.com
tajanprovider.com
```

Both should point to:

```text
127.0.0.1
```

## Linux

Edit the hosts file:

```bash
sudo nano /etc/hosts
```

Add:

```text
127.0.0.1 tajanapplication.com
127.0.0.1 tajanprovider.com
```

---

## Windows

Open this file as Administrator:

```text
C:\Windows\System32\drivers\etc\hosts
```

Add:

```text
127.0.0.1 tajanapplication.com
127.0.0.1 tajanprovider.com
```

---

# 🚀 Automatic Setup (Recommended)

Run:

```bash
python3 main.py
```

The launcher automatically:

- Detects your operating system
- Creates a virtual environment
- Installs dependencies
- Asks whether you have access to PyPI
- Uses a mirror if needed
- Starts both services
- Allows shutting down all services using:

```text
finish
```

---

# ⚙️ Manual Setup

## 1. Create Virtual Environment

Linux:
```bash
python3 -m venv venv
```

Windows:
```bash
python -m venv venv
```

---

## 2. Activate Virtual Environment

Linux:
```bash
source venv/bin/activate
```

Windows:
```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ❗ If You Cannot Access PyPI

If your network cannot access `pypi.org`, use the mirror below:

```bash
pip install --trusted-host mirror-pypi.runflare.com -i https://mirror-pypi.runflare.com/simple/ -r requirements.txt
```

Upgrade pip using the same mirror:

```bash
pip install --upgrade pip --trusted-host mirror-pypi.runflare.com -i https://mirror-pypi.runflare.com/simple/
```

---

# ▶️ Run Services

Start Provider:

```bash
python provider/app.py
```

Start Application:

```bash
python application/app.py
```

---

# 🔗 Service URLs

Application:  
```text
http://tajanapplication.com:5000
```

Provider:  
```text
http://tajanprovider.com:5959
```

---




# ✍️ Author

**AliZiro**  
Security Researcher


### Statement in Support of a Free Internet

> The internet is not just a technical tool; it is the **vital artery** of knowledge, culture, and communication in today's world. Free access to information is the cornerstone of advanced societies and a platform for nurturing talent and innovation.
>
> Any form of restriction, filtering, and censorship amounts to closing the gateways to knowledge and hindering progress.
>
> As part of the global tech community, we **firmly advocate for the right to free, equal, and uncensored internet access for all the people of Iran and the world**. We hope for a day when no one is deprived of this fundamental right due to geographical or political barriers.
