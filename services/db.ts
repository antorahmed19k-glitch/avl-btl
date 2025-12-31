
import { Project, User } from '../types';

const PROJECTS_KEY = 'akij_ledger_projects';
const USERS_KEY = 'akij_ledger_users';
const SESSION_KEY = 'akij_ledger_session';

export const db = {
  users: {
    getAll(): User[] {
      try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      } catch {
        return [];
      }
    },
    save(user: User) {
      const users = this.getAll();
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },
    findByUsername(username: string): User | undefined {
      return this.getAll().find(u => u.username.toLowerCase() === username.toLowerCase());
    },
    setCurrentSession(user: User | null) {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    },
    getCurrentSession(): User | null {
      const session = localStorage.getItem(SESSION_KEY);
      try {
        return session ? JSON.parse(session) : null;
      } catch {
        return null;
      }
    }
  },

  projects: {
    getAll(): Project[] {
      try {
        return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
      } catch {
        return [];
      }
    },
    saveAll(projects: Project[]) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    },
    upsert(project: Project) {
      const projects = this.getAll();
      const index = projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        projects[index] = project;
      } else {
        projects.push(project);
      }
      this.saveAll(projects);
    },
    delete(id: string) {
      const projects = this.getAll().filter(p => p.id !== id);
      this.saveAll(projects);
    }
  }
};
