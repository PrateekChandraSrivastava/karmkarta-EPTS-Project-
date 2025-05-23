import React from 'react';
import '../Style/ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="intro">Have questions or feedback? We're here to help. Reach out to us via any of the methods below.</p>
      
      <div className="contact-details">
        <div className="contact-card">
          <h3>General Inquiries</h3>
          <p>Email: <a href="mailto:info@karmkarta.com">info@karmkarta.com</a></p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div className="contact-card">
          <h3>Support</h3>
          <p>Email: <a href="mailto:support@karmkarta.com">support@karmkarta.com</a></p>
          <p>Ticket: <a href="https://support.karmkarta.com">support.karmkarta.com</a></p>
        </div>
        <div className="contact-card">
          <h3>Sales & Partnerships</h3>
          <p>Email: <a href="mailto:sales@karmkarta.com">sales@karmkarta.com</a></p>
        </div>
        <div className="contact-card">
          <h3>Office Address</h3>
          <address>
            1234 Performance Way,<br />
            Suite 100,<br />
            Innovation City, ST 98765<br />
            United States
          </address>
        </div>
      </div>

      <form className="contact-form" action="#" method="POST">
        <label htmlFor="name">Name*</label>
        <input type="text" id="name" name="name" placeholder="Your Name" required />

        <label htmlFor="email">Email*</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required />

        <label htmlFor="subject">Subject*</label>
        <input type="text" id="subject" name="subject" placeholder="Subject" required />

        <label htmlFor="message">Message*</label>
        <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>

      <div className="social-links">
        <p>Follow us on:</p>
        <a href="https://linkedin.com/company/karmkarta" target="_blank" rel="noopener noreferrer">LinkedIn</a> |
        <a href="https://twitter.com/karmkarta" target="_blank" rel="noopener noreferrer">Twitter</a> |
        <a href="https://facebook.com/karmkarta" target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
    </div>
  );
};

export default ContactUs; 