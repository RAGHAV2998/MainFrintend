import React from 'react';
import './Page.css'; // Create a new CSS file for basic page styling

const About = () => {
  return (
    <div className="page-container">
      <h2>About Us</h2>
      <p>Welcome to <strong>Aavyooh</strong>, where we are dedicated to bringing clarity and insight into complex supply chain and manufacturing networks. Our platform provides a powerful visualization tool that allows users to explore the intricate relationships between products, components, and manufacturers.</p>
      <p>In an increasingly interconnected world, understanding the provenance and dependencies within your supply chain is crucial. Aavyooh was born out of the need for a simple, intuitive, and powerful way to map and comprehend these networks. Whether you are tracking pharmaceutical components, electronic parts, or any other multi-component product, our application offers a clear, hierarchical view of your entire ecosystem.</p>
      <p>Our mission is to empower businesses with the knowledge they need to make informed decisions, mitigate risks, and optimize their supply chains. We believe that transparency is the key to building more resilient and efficient industries.</p>
    </div>
  );
};

export default About;