
import React, { useState, useEffect } from 'react';
import { ViewType, Project, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import History from './components/History';
import Auth from './components/Auth';
import { db } from './services/db';

// @google/genai: Defined AppProps to handle initial session from server-side components
interface AppProps {
  initialSession?: User | null;
}

const App: React.FC<AppProps> = ({ initialSession }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @google/genai: Use session from props if provided, fallback to client-side storage
    const session = initialSession || db.users.getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setProjects(db.projects.getAll());
    }
    setLoading(false);
  }, [initialSession]);

  const handleLogin = (user: User) => {
    db.users.setCurrentSession(user);
    setCurrentUser(user);
    setProjects(db.projects.getAll());
  };

  const handleLogout = () => {
    db.users.setCurrentSession(null);
    setCurrentUser(null);
    setCurrentView(ViewType.DASHBOARD);
    setProjects([]);
  };

  const handleUpsert = (project: Project) => {
    db.projects.upsert(project);
    setProjects(db.projects.getAll());
    setEditingProject(null);
    setCurrentView(ViewType.DASHBOARD);
  };

  const handleEditRequest = (project: Project) => {
    setEditingProject(project);
    setCurrentView(ViewType.NEW_PROJECT);
  };

  if (loading) return null;
  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD: 
        return <Dashboard projects={projects} />;
      case ViewType.NEW_PROJECT: 
        return <ProjectForm onAdd={handleUpsert} onUpdate={handleUpsert} projectToEdit={editingProject || undefined} />;
      case ViewType.UPCOMING: 
        return <ProjectList projects={projects} type="upcoming" currentUser={currentUser} onEdit={handleEditRequest} />;
      case ViewType.COMPLETED: 
        return <ProjectList projects={projects} type="completed" currentUser={currentUser} onEdit={handleEditRequest} />;
      case ViewType.HISTORY: 
        return <History projects={projects} />;
      default: 
        return <Dashboard projects={projects} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 print:bg-white">
      <Sidebar 
        user={currentUser} 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
      />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
