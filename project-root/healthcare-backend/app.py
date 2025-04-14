from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg
import os

app = Flask(__name__)
CORS(app)  # Allow CORS for React frontend

# AWS RDS PostgreSQL Connection
DB_HOST = "healthcare-db.cfgkuekewo32.us-east-2.rds.amazonaws.com"
DB_NAME = "healthcare_db"
DB_USER = "postgres"
DB_PASS = "Postgres123"

def get_db_connection():
    return psycopg.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port="5432"
    )

@app.route('/appointments', methods=['GET'])
def get_appointments():
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM appointments;")
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]  # Get column names

    # Convert results to JSON
    appointments = [dict(zip(columns, row)) for row in rows]
    return jsonify(appointments)

@app.route('/book', methods=['POST'])
def book_appointment():
    data = request.json
    print("Received data:", data)  # Debugging log
    
    if not data["patient_name"] or not data["doctor_name"] or not data["appointment_date"]:
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO appointments (patient_name, doctor_name, appointment_date) VALUES (%s, %s, %s)",
            (data["patient_name"], data["doctor_name"], data["appointment_date"]),
        )
        conn.commit()
        return jsonify({"message": "Appointment booked successfully"})
    except Exception as e:
        print("Database error:", e)  # Debugging log
        return jsonify({"error": "Database error"}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)