import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, FilePlus2, LogOut, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

function Sidebar({ userType, onLogout }) {
  const getLinks = () => {
    const common = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];
    
    let roleSpecific = [];
    if (userType === 'CUSTOMER') {
      roleSpecific = [
        { to: '/tickets', icon: Ticket, label: 'My Tickets' },
        { to: '/tickets/new', icon: FilePlus2, label: 'Create Ticket' },
      ];
    } else if (userType === 'ENGINEER') {
      roleSpecific = [
        { to: '/tickets', icon: Ticket, label: 'Assigned Tickets' },
        { to: '/tickets/search', icon: Search, label: 'Search Tickets' },
      ];
    } else if (userType === 'ADMIN') {
      roleSpecific = [
        { to: '/users', icon: Users, label: 'Users' },
        { to: '/tickets', icon: Ticket, label: 'All Tickets' },
      ];
    }

    return [...common, ...roleSpecific];
  };

  const links = getLinks();

  return (
    <div className="flex h-full w-64 flex-col bg-surface border-r border-border">
      <div className="flex h-14 items-center px-4 border-b border-border">
        <span className="text-lg font-bold text-primary">CRM System</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive 
                ? 'bg-blue-50 text-primary' 
                : 'text-secondaryText hover:bg-gray-100 hover:text-text'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-secondaryText transition-colors hover:bg-gray-100 hover:text-text"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export { Sidebar };
