from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

@app.get("/run-vmouse")
def run_vmouse():
    try:
        script_path = os.path.join(os.getcwd(), "virtual_mouse.py")

        # Launch the VMOUSE script
        subprocess.Popen(["python", script_path], shell=True)

        return jsonify({"status": "success", "message": "Virtual Mouse started"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)
