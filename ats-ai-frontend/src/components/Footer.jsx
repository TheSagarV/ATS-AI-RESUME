// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-grid">
        <div>
          <h3 className="footer-heading">ATS Resume AI</h3>
          <p className="text-xs">
            Smart, ATS-friendly resumes with clean design. Upload → optimise → export in minutes.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Project Links</h4>
          <ul className="text-xs space-y-1">
            <li>• Resume Builder</li>
            <li>• Custom Templates</li>
            <li>• Saved Resumes</li>
          </ul>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <p className="text-xs">sv7834254@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sagar Verma</span>
        <span>Built with React, Vite, Tailwind, PostgreSQL & AI.</span>
      </div>
    </footer>
  );
};

export default Footer;
