import React, { useState, useEffect } from 'react';
import '../Style/CheckInOut.css';
import { FiClock, FiCheckCircle, FiXCircle, FiLogIn, FiLogOut, FiCalendar } from 'react-icons/fi';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const CheckInOut = () => {
  const [status, setStatus] = useState('checked-out');
  const [lastAction, setLastAction] = useState(null);
  const [todayRecords, setTodayRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [loading, setLoading] = useState(true); // Commented out unused loading state
  // const [error, setError] = useState(''); // Commented out unused error state

  // Fetch attendance status and today's records from backend
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    let isMounted = true;
    const fetchAttendance = async () => {
      // setLoading(true); // Commented out unused setLoading
      // setError(''); // Commented out unused setError
      try {
        const token = localStorage.getItem('token');
        const [statusRes, recordsRes] = await Promise.all([
          axios.get(`${API_BASE}/attendance/status`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/attendance/today`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (isMounted) {
          setStatus(statusRes.data.status);
          setLastAction(statusRes.data.lastAction);
          setTodayRecords(recordsRes.data);
        }
      } catch (err) {
        // if (isMounted) setError('Failed to fetch attendance data.'); // Commented out unused setError
        console.error('Failed to fetch attendance data:', err); // Added console.error for debugging
      } finally {
        // if (isMounted) setLoading(false); // Commented out unused setLoading
      }
    };
    fetchAttendance();
    return () => {
      clearInterval(timer);
      isMounted = false;
    };
  }, []);

  // Handle check-in/out and save to backend
  const handleCheckInOut = async () => {
    try {
      // setLoading(true); // Commented out unused setLoading
      // setError(''); // Commented out unused setError
      const token = localStorage.getItem('token');
      const newAction = status === 'checked-out' ? 'checked-in' : 'checked-out';
      await axios.post(`${API_BASE}/attendance`, { action: newAction }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch status and records after successful check-in/out
      const [statusRes, recordsRes] = await Promise.all([
        axios.get(`${API_BASE}/attendance/status`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/attendance/today`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStatus(statusRes.data.status);
      setLastAction(statusRes.data.lastAction);
      setTodayRecords(recordsRes.data);
    } catch (err) {
      // setError('Failed to update attendance.'); // Commented out unused setError
      console.error('Failed to update attendance:', err); // Added console.error for debugging
    } finally {
      // setLoading(false); // Commented out unused setLoading
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="checkin-container">
      <div className="status-card">
        <h2>
          <FiClock style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Attendance Status
        </h2>

        <div className="current-time">
          {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>

        <div style={{
          fontSize: '1.1rem',
          color: '#4a5568',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <FiCalendar />
          {formatDate(new Date())}
        </div>

        <div className={`status-indicator ${status}`}>
          {status === 'checked-in' ? (
            <>
              <FiCheckCircle size={24} />
              Currently Working
            </>
          ) : (
            <>
              <FiXCircle size={24} />
              Not Working
            </>
          )}
        </div>

        <div className="last-action">
          <span style={{ opacity: 0.7 }}>Last action at:</span>
          <br />
          <strong>{lastAction || 'No action today'}</strong>
        </div>

        <button
          className={`action-button ${status === 'checked-out' ? 'check-in' : 'check-out'}`}
          onClick={handleCheckInOut}
        >
          {status === 'checked-out' ? (
            <>
              <FiLogIn size={20} />
              Check In
            </>
          ) : (
            <>
              <FiLogOut size={20} />
              Check Out
            </>
          )}
        </button>
      </div>

      <div className="records-card">
        <h2>
          <FiCalendar style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Today's Records
        </h2>

        <div className="records-list">
          {todayRecords.length > 0 ? (
            todayRecords.map(record => (
              <div key={record.id} className="record-item">
                <span className="record-action">
                  {record.action === 'checked-in' ? (
                    <>
                      <FiLogIn className="record-icon in" />
                      Checked In
                    </>
                  ) : (
                    <>
                      <FiLogOut className="record-icon out" />
                      Checked Out
                    </>
                  )}
                </span>
                <span className="record-time">
                  <FiClock style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  {record.time}
                </span>
              </div>
            ))
          ) : (
            <div className="no-records">
              <FiCalendar size={40} />
              <p>No records for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;