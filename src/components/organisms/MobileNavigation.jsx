import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MobileNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      icon: 'Home', 
      label: 'Projects',
      exact: true
    },
    { 
      path: '/capture', 
      icon: 'Camera', 
      label: 'Capture'
    },
    { 
      path: '/timeline', 
      icon: 'Clock', 
      label: 'Timeline'
    },
    { 
      path: '/reports', 
      icon: 'FileText', 
      label: 'Reports'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
            
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center p-2 min-w-0 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={item.icon} size={20} />
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavigation;