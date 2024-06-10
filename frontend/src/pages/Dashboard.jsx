import React from 'react';
import Header from '../components/Header';
import Index from '../components/Index';
import UpcomingsEvents from '../components/UpcomingEvents';
import '../style/dashboard.css';

const Dashboard = () => {

  const Discord = () => {
    return (<iframe
      src="https://discord.com/widget?id=695650077657661451&theme=dark"
      width="350"
      height="500"
      allowTransparency="true"
      frameBorder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    ></iframe>
    );
  }
  return (
    <div className="dashboard-container">
      <Header />
      <div className="content-container">
        <div className="sidebar">
          {/* Sidebar content */}
        </div>
        <div className="main-content-container">
          <div className="main-content">
            <Index />
          </div>
          <div className='task-container'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <div className='discord-events-container'>
            <div className="discord-container">
              <Discord />
            </div>
            <div className='events-container'>
              <UpcomingsEvents />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Mentions légales</p>
      </footer>
    </div>
  );
};


export default Dashboard;