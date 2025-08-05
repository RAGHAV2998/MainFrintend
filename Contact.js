import React from 'react';
import './Page.css';

const Contact = () => {
  return (
    <div className="page-container">
      <h2>Contact Us</h2>
      <p>We would love to hear from you! Whether you have a question about our services, a suggestion for a new feature, or need support, please do not hesitate to reach out.</p>
      
      <h4>General Inquiries:</h4>
      <p>For all general questions, please email us at:<br />
      <strong>Email:</strong> contact@aavyooh.com</p>
      
      <h4>Support:</h4>
      <p>If you are experiencing any technical issues or need assistance with the application, please contact our support team at:<br />
      <strong>Email:</strong> support@aavyooh.com</p>
      
      <h4>Business Inquiries:</h4>
      <p>For partnership opportunities and other business-related matters, please contact:<br />
      <strong>Email:</strong> business@aavyooh.com</p>
      
      <h4>Mailing Address:</h4>
      <p>Aavyooh Headquarters<br />
      [Your Company's Full Address]<br />
      [City, State, Zip Code]<br />
      [Country]</p>
    </div>
  );
};

export default Contact;