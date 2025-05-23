import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Employee Tracker</h1>
          <p className="hero-description">
            Transform your workforce management with our cutting-edge Employee Tracking System. 
            Experience seamless employee management, real-time performance tracking, and comprehensive analytics 
            all in one powerful platform.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button primary">Get Started</Link>
            <Link to="/register" className="cta-button secondary">Join Now</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Our System?</h2>
        <p className="section-description">
          Our platform combines powerful features with an intuitive interface to help you manage your workforce effectively.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Employee Management</h3>
            <p>Streamline your HR processes with our comprehensive employee management system. 
               From onboarding to offboarding, we've got you covered.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Performance Tracking</h3>
            <p>Monitor and evaluate employee performance with our advanced KPI tracking system. 
               Get real-time insights and make data-driven decisions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Leave Management</h3>
            <p>Simplify leave requests and approvals with our automated system. 
               Keep track of employee attendance and time-off requests effortlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Reports & Analytics</h3>
            <p>Generate detailed reports and gain valuable insights into your workforce. 
               Make informed decisions with our comprehensive analytics tools.</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Key Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Increased Productivity</h3>
            <p>Streamline workflows and reduce administrative tasks, allowing your team to focus on what matters most.</p>
          </div>
          <div className="benefit-card">
            <h3>Better Decision Making</h3>
            <p>Access real-time data and analytics to make informed decisions about your workforce.</p>
          </div>
          <div className="benefit-card">
            <h3>Enhanced Security</h3>
            <p>Protect sensitive employee data with our advanced security features and role-based access control.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Our Platform</h2>
        <div className="about-content">
          <p className="about-description">
            Our Employee Tracking System is designed with modern organizations in mind. We understand the challenges 
            of managing a diverse workforce and have created a solution that addresses these needs effectively.
          </p>
          <div className="about-features">
            <div className="about-feature">
              <span className="feature-bullet">✓</span>
              <p>User-friendly interface for easy navigation</p>
            </div>
            <div className="about-feature">
              <span className="feature-bullet">✓</span>
              <p>Customizable features to suit your needs</p>
            </div>
            <div className="about-feature">
              <span className="feature-bullet">✓</span>
              <p>24/7 support and regular updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 