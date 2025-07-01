import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import ProjectDetail from '@/components/pages/ProjectDetail';
import CaptureScreen from '@/components/pages/CaptureScreen';
import TimelineView from '@/components/pages/TimelineView';
import ReportGenerator from '@/components/pages/ReportGenerator';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/capture" element={<CaptureScreen />} />
            <Route path="/capture/:projectId" element={<CaptureScreen />} />
            <Route path="/timeline" element={<TimelineView />} />
            <Route path="/timeline/:projectId" element={<TimelineView />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/reports/:projectId" element={<ReportGenerator />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="!z-[9999]"
        />
      </div>
    </Router>
  );
}

export default App;