import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import MobileNavigation from "@/components/organisms/MobileNavigation";

function Layout({ children }) {
  const { logout } = useContext(AuthContext)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  return (
    <>
      {/* Header with logout button */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-30">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-display font-bold text-gray-900">FlipTrack Pro</span>
            </div>
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.emailAddress}</p>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ApperIcon name="LogOut" size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      )}
      
<div className={isAuthenticated ? "pt-16" : ""}>
        {/* Main Content */}
        <main className="pb-20">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </>
  );
};

export default Layout;