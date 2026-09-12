// In-memory session cache for instant page navigation
export const pageCache = {
  dashboard: null,
  projects: null,
  tasks: null,

  clearAll() {
    this.dashboard = null;
    this.projects = null;
    this.tasks = null;
  }
};
