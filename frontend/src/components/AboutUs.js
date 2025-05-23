import React from 'react';
import '../Style/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1 className="about-us-title">Welcome to Employee Tracker</h1>
        <p className="about-us-subtitle">
          Your all-in-one solution for modern workforce management and performance tracking.
        </p>
      </div>

      <div className="about-section">
        <p className="section-content">
          In today's fast-paced and competitive business world, monitoring employee performance is critical for organizational success. Our Employee Performance Tracking System is designed to provide a structured, data-driven approach to tracking employee contributions across various projects, ensuring transparency, accountability, and continuous improvement.
        </p>
      </div>

      <div className="about-section">
        <h2 className="section-title">
          <i className="fas fa-star"></i> What We Offer
        </h2>
        <p className="section-content">
          Our system combines advanced automation with smart analytics to help organizations achieve peak productivity.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">Performance Monitoring via KPIs</h3>
            <p>Track individual and team performance using customizable Key Performance Indicators that align with your organizational goals.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">Automated Report Generation</h3>
            <p>Say goodbye to manual performance evaluations. Our system generates insightful, easy-to-understand reports to support decision-making and employee feedback.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">Role-Based Access Control</h3>
            <ul className="feature-list">
              <li>Admin: Full control over the system</li>
              <li>Manager: Assign tasks and monitor performance</li>
              <li>Employee: View tasks and track progress</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">Task & Attendance Management</h3>
            <p>Keep track of daily tasks and attendance in one platform, improving time management and reducing errors.</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i> Why Choose Us?
        </h2>
        <p className="section-content">
          We understand that every organization is unique. That's why our platform is built with flexibility and scalability in mind.
        </p>
        <ul className="feature-list">
          <li>Identify high-performing employees</li>
          <li>Detect performance gaps</li>
          <li>Improve communication between teams</li>
          <li>Promote accountability and transparency</li>
          <li>Foster a culture of continuous improvement</li>
        </ul>
      </div>

      <div className="mission-section">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-content">
          Our mission is to empower organizations with intelligent tools to make employee performance tracking simple, insightful, and impactful. By using technology to streamline HR and managerial processes, we enable teams to focus on what matters most—growth and success.
        </p>
      </div>
    </div>
  );
};

export default AboutUs; 