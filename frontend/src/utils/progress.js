/**
 * Single Source of Truth for Project Progress Calculation
 * 
 * Rules:
 * completedTasks = number of tasks belonging to project where status === 'Completed'
 * totalTasks = total number of tasks belonging to project
 * 
 * Examples:
 * 0 / 0 = 0%
 * 0 / 4 = 0%
 * 1 / 4 = 25%
 * 2 / 4 = 50%
 * 3 / 4 = 75%
 * 4 / 4 = 100%
 */

export const calculateProjectProgress = (project, allTasksArray = null) => {
  const { percentage } = getProjectTaskStats(project, allTasksArray);
  return percentage;
};

export const getProjectTaskStats = (project, allTasksArray = null) => {
  if (!project) return { total: 0, completed: 0, percentage: 0 };

  let projectTasks = [];

  if (Array.isArray(allTasksArray)) {
    // Match by projectId
    projectTasks = allTasksArray.filter(
      (t) => parseInt(t.projectId, 10) === parseInt(project.id, 10)
    );
  } else if (Array.isArray(project.tasks)) {
    projectTasks = project.tasks;
  } else if (project._count && project._count.tasks !== undefined) {
    // If only count exists without status details, fallback safely
    const total = project._count.tasks;
    return { total, completed: 0, percentage: 0 };
  }

  const total = projectTasks.length;
  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const completed = projectTasks.filter((t) => t.status === 'Completed').length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, percentage };
};
