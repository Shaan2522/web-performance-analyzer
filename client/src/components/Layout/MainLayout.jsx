import React from 'react';
import Navbar from './Navbar';
// import Sidebar from './Sidebar'; // Removed Sidebar

function MainLayout({ children }) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Removed sidebar state

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  return (
    <div className="main-layout">
      <Navbar /> {/* No toggleSidebar prop needed here anymore */} 
      <div className="content-area"> {/* This div might become unnecessary or change its purpose */} 
        {/* Removed Sidebar component */} 
        <main className="main-content"> {/* No sidebar-related classes needed */} 
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
