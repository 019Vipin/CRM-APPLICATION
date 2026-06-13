import React from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';

function Header({ user }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex flex-1 items-center">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondaryText" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-secondaryText hover:bg-gray-100 hover:text-text transition-colors">
          <Bell className="h-5 w-5" />
          {/* Notification badge can go here */}
        </button>
        
        <div className="flex items-center space-x-2 pl-4 border-l border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-primary">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none text-text">{user?.name || 'User'}</span>
            <span className="text-xs text-secondaryText mt-1">{user?.userType || 'Role'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
