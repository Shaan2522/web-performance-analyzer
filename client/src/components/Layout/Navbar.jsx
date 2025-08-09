import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">WebPerf Analyzer</Link>
      </div>

      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        ☰
      </button>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}> {/* Added open class for mobile */} 
        <li><Link to="/monitor" onClick={() => setIsMobileMenuOpen(false)}>Monitor</Link></li>
        <li><Link to="/memory" onClick={() => setIsMobileMenuOpen(false)}>Memory</Link></li>
        <li><Link to="/network" onClick={() => setIsMobileMenuOpen(false)}>Network</Link></li>
        <li><Link to="/reports" onClick={() => setIsMobileMenuOpen(false)}>Reports</Link></li>
        <li><Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;