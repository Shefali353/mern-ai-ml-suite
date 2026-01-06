from flask import Flask, jsonify
import subprocess
import threading

app = Flask(__name__)

def run_signverse():
    subprocess.run(["python", "signverse.py"])

@app.route('/run-signverse', methods=['GET'])
def run_script():
    thread = threading.Thread(target=run_signverse)
    thread.start()
    return jsonify({"status": "SignVerse Recognition Started"})

if __name__ == '__main__':
    app.run(port=5002)
