import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import "./App.css"; // Import the updated CSS

function App() {
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to book an appointment
  const bookAppointment = async () => {
    if (!patientName || !doctorName || !date) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/book`, {
        patient_name: patientName,
        doctor_name: doctorName,
        appointment_date: date,
      });
  
      alert("Appointment booked!");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("The doctor already has an appointment at that time. Please choose another slot.");
      } else {
        console.error("Error booking appointment:", error);
        alert("Failed to book appointment");
      }
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Appointment Booking Facility</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="input-field"
        />
        
        <div className="date-picker-container">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={() => setShowDatePicker(true)}
            onBlur={() => setShowDatePicker(false)}
            className={`input-field date-picker ${showDatePicker ? "show" : ""}`}
          />
        </div>

        <button onClick={bookAppointment} className="book-button">
          Book Appointment
        </button>
      </div>

    </div>
  );
}

export default App;
