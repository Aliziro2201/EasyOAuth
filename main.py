import os
import sys
import time
import platform
import subprocess
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
VENV_DIR = BASE_DIR / "venv"


ALI_ZIRO_BANNER = r"""
                                                                           
                                         ,----,                            
   ,---,        ,--,                   .'   .`|                            
  '  .' \     ,--.'|     ,--,       .'   .'   ;  ,--,                      
 /  ;    '.   |  | :   ,--.'|     ,---, '    .',--.'|    __  ,-.   ,---.   
:  :       \  :  : '   |  |,      |   :     ./ |  |,   ,' ,'/ /|  '   ,'\  
:  |   /\   \ |  ' |   `--'_      ;   | .'  /  `--'_   '  | |' | /   /   | 
|  :  ' ;.   :'  | |   ,' ,'|     `---' /  ;   ,' ,'|  |  |   ,'.   ; ,. : 
|  |  ;/  \   \  | :   '  | |       /  ;  /    '  | |  '  :  /  '   | |: : 
'  :  | \  \ ,'  : |__ |  | :      ;  /  /--,  |  | :  |  | '   '   | .; : 
|  |  '  '--' |  | '.'|'  : |__   /  /  / .`|  '  : |__;  : |   |   :    | 
|  :  :       ;  :    ;|  | '.'|./__;       :  |  | '.'|  , ;    \   \  /  
|  | ,'       |  ,   / ;  :    ;|   :     .'   ;  :    ;---'      `----'   
`--''          ---`-'  |  ,   / ;   |  .'      |  ,   /                    
                        ---`-'  `---'           ---`-'                     
                                                                           
"""


def detect_os():
    os_name = platform.system()

    if os_name == "Windows":
        return "windows"
    elif os_name == "Linux":
        return "linux"
    else:
        return "unknown"


def get_venv_python():
    os_type = detect_os()

    if os_type == "windows":
        return VENV_DIR / "Scripts" / "python.exe"
    elif os_type == "linux":
        return VENV_DIR / "bin" / "python"
    else:
        raise RuntimeError("Unsupported operating system")


def show_banner():
    print(ALI_ZIRO_BANNER)


def create_venv_if_needed():
    venv_python = get_venv_python()

    if VENV_DIR.exists() and venv_python.exists():
        print("[OK] Virtual environment already exists.")
        return

    print("[INFO] Creating virtual environment...")
    subprocess.check_call([sys.executable, "-m", "venv", str(VENV_DIR)])
    print("[OK] Virtual environment created.")


def ask_for_internet_status():
    print("\n[QUESTION] Do you have normal internet access to install packages?")
    print("1) Yes (use default PyPI)")
    print("2) No (use mirror-pypi.runflare.com)")

    while True:
        choice = input("Select option (1 or 2): ").strip()

        if choice == "1":
            return "normal"
        elif choice == "2":
            return "mirror"
        else:
            print("[WARN] Invalid selection. Please enter 1 or 2.")


def install_requirements():
    venv_python = get_venv_python()
    requirements_file = BASE_DIR / "requirements.txt"

    install_mode = ask_for_internet_status()

    print("[INFO] Upgrading pip...")

    if install_mode == "mirror":
        subprocess.check_call([
            str(venv_python),
            "-m",
            "pip",
            "install",
            "--upgrade",
            "pip",
            "--trusted-host",
            "mirror-pypi.runflare.com",
            "-i",
            "https://mirror-pypi.runflare.com/simple/"
        ])
    else:
        subprocess.check_call([
            str(venv_python),
            "-m",
            "pip",
            "install",
            "--upgrade",
            "pip"
        ])

    if requirements_file.exists():
        print("[INFO] Installing required packages...")

        if install_mode == "mirror":
            subprocess.check_call([
                str(venv_python),
                "-m",
                "pip",
                "install",
                "--trusted-host",
                "mirror-pypi.runflare.com",
                "-i",
                "https://mirror-pypi.runflare.com/simple/",
                "-r",
                str(requirements_file)
            ])
        else:
            subprocess.check_call([
                str(venv_python),
                "-m",
                "pip",
                "install",
                "-r",
                str(requirements_file)
            ])

        print("[OK] Packages installed successfully.")
    else:
        print("[WARN] No requirements.txt found. Skipping package installation.")


def run_project(app_relative_path):
    venv_python = get_venv_python()
    app_path = BASE_DIR / app_relative_path

    if not app_path.exists():
        print(f"[ERROR] File not found: {app_path}")
        return None

    print(f"[INFO] Starting {app_relative_path}...")

    process = subprocess.Popen(
        [str(venv_python), str(app_path)],
        cwd=str(BASE_DIR)
    )

    return process


def stop_process(process, name):
    if process is None:
        return

    if process.poll() is None:
        print(f"[INFO] Stopping {name}...")
        process.terminate()

        try:
            process.wait(timeout=5)
            print(f"[OK] {name} stopped.")
        except subprocess.TimeoutExpired:
            print(f"[WARN] Force killing {name}...")
            process.kill()
            print(f"[OK] {name} killed.")


def wait_for_finish_command(app1, app2):
    print("\nType 'finish' to stop all projects and exit.\n")

    while True:
        user_input = input(">> ").strip().lower()

        if user_input == "finish":
            print("[INFO] Finish command received.")
            stop_process(app1, "application/app.py")
            stop_process(app2, "provider/app.py")
            print("[OK] All projects stopped. Exiting launcher.")
            break
        else:
            print("[WARN] Unknown command. Type 'finish' to exit.")


def main():
    show_banner()

    os_type = detect_os()
    print(f"[INFO] Operating system detected: {os_type}")

    if os_type == "unknown":
        print("[ERROR] Unsupported operating system. Only Windows and Linux are supported.")
        sys.exit(1)

    app1 = None
    app2 = None

    try:
        create_venv_if_needed()
        install_requirements()

        app1 = run_project("application/app.py")
        app2 = run_project("provider/app.py")

        time.sleep(2)

        print("\n[OK] Projects started successfully")
        print("Application: http://tajanapplication.com:5000")
        print("Provider:    http://tajanprovider.com:5959")

        wait_for_finish_command(app1, app2)

    except KeyboardInterrupt:
        print("\n[INFO] Keyboard interrupt received. Shutting down...")
        stop_process(app1, "application/app.py")
        stop_process(app2, "provider/app.py")
        print("[OK] Shutdown completed.")
        sys.exit(0)

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Command execution failed: {e}")
        stop_process(app1, "application/app.py")
        stop_process(app2, "provider/app.py")
        sys.exit(1)

    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        stop_process(app1, "application/app.py")
        stop_process(app2, "provider/app.py")
        sys.exit(1)


if __name__ == "__main__":
    main()
