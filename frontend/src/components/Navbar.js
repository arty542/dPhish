import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const role = localStorage.getItem('role'); // You can use context or props too

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {role === 'admin' && (
          <>
            <li><Link to="/admin">Admin Home</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/admin/create-email">Create Email</Link></li>
            <li><Link to="/send-email">Send Email</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
