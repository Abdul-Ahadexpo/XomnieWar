import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useOC } from './hooks/useOC';
import AuthForm from './components/Auth/AuthForm';
import OCCreator from './components/OC/OCCreator';
import Dashboard from './components/Dashboard/Dashboard';
import BannedScreen from './components/Dashboard/BannedScreen';
import OCViewer from './components/OC/OCViewer';
import { Sword, Loader2 } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { oc, loading: ocLoading, banned, saveOC } = useOC(user?.uid);
  const [editMode, setEditMode] = React.useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              XomnieWar
            </h1>
          </div>
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/oc/:uid" element={<OCViewer />} />
          <Route path="*" element={<AuthForm />} />
        </Routes>
      </Router>
    );
  }

  // Show banned screen if user is banned
  if (banned) {
    return (
      <Router>
        <Routes>
          <Route path="/oc/:uid" element={<OCViewer />} />
          <Route path="*" element={<BannedScreen />} />
        </Routes>
      </Router>
    );
  }

  if (ocLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-300">Loading your character...</p>
        </div>
      </div>
    );
  }

  const handleSaveOC = async (ocData: any) => {
    await saveOC(ocData);
    setEditMode(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/oc/:uid" element={<OCViewer />} />
        <Route 
          path="/" 
          element={
            !oc || editMode ? (
              <OCCreator 
                onSave={handleSaveOC} 
                existingOC={editMode ? oc : undefined}
              />
            ) : (
              <Dashboard 
                oc={oc} 
                uid={user.uid}
                onEdit={() => setEditMode(true)}
              />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;