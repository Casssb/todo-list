import { projectFactory } from './projects';
import { taskFactory } from './tasks';

const storageController = (() => {
  const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.list';
  const projectList = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
  ) || [
    {
      title: 'General',
      description: 'General Tasks',
      id: 'default',
      tasks: [],
      active: true,
    },
  ];

  const loopThroughProjects = (callback) => {
    if (projectList.length === 1) {
      projectList[0].active = true;
    }
    projectList.forEach((project) => {
      callback(project);
    });
  };

  const loopThroughActiveProjectTasks = (callback) => {
    projectList.forEach((project) => {
      if (project.active === true) {
        project.tasks.forEach((task) => {
          callback(task);
        });
      }
    });
  };

  const loopThroughAllTasks = (callback) => {
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        callback(task);
      });
    });
  };

  const updateStorage = () => {
    localStorage.setItem(
      LOCAL_STORAGE_PROJECTS_KEY,
      JSON.stringify(projectList)
    );
  };

  const resetActiveProject = () => {
    projectList.forEach((project) => (project.active = false));
    updateStorage();
  };

  const activeProjectIndex = (projectId) => {
    projectId = projectId.toString();
    const index = projectList.map((list) => list.id).indexOf(projectId);
    return index;
  };

  const setActiveProject = (projectId) => {
    resetActiveProject();
    const index = activeProjectIndex(projectId);
    projectList[index].active = true;
    updateStorage();
  };

  const getActiveProject = () => {
    let activeId;
    projectList.forEach((list) => {
      if (list.active) {
        activeId = list.id;
      }
    });
    return activeId;
  };

  const addProject = (name, description) => {
    resetActiveProject();
    const project = projectFactory(name, description);
    projectList.push(project);
    updateStorage();
    return project;
  };

  const editProject = (projectId, projectTitle, projectDescription) => {
    const index = activeProjectIndex(projectId);
    projectList[index].title = projectTitle;
    projectList[index].description = projectDescription;
    updateStorage();
  };

  const deleteProject = (projectId) => {
    const index = activeProjectIndex(projectId);
    projectList.splice(index, 1);
    updateStorage();
  };

  const addTask = (title, notes, dueDate, priority) => {
    const projectId = getActiveProject();
    const index = activeProjectIndex(projectId);
    const taskId = projectList[index].tasks.length;
    const project = projectId;
    const task = taskFactory(title, notes, dueDate, priority, taskId, project);
    projectList[index].tasks.push(task);
    updateStorage();
  };

  const getTaskIndex = (projectindex, taskTag) => {
    const taskId = taskTag;
    const index = projectList[projectindex].tasks
      .map((task) => task.id).indexOf(taskId);
    return index;
  };

  const editTask = (projectId, taskId,title, notes, dueDate, priority) => {
    projectList[projectId].tasks[taskId].title = title;
    projectList[projectId].tasks[taskId].notes = notes;
    projectList[projectId].tasks[taskId].dueDate = dueDate;
    projectList[projectId].tasks[taskId].priority = priority;
    updateStorage();
  };

  const switchTaskComplete = (projectIndex, taskIndex) => {
    projectList[projectIndex].tasks[taskIndex].complete
      ? (projectList[projectIndex].tasks[taskIndex].complete = false)
      : (projectList[projectIndex].tasks[taskIndex].complete = true);
    updateStorage();
  };

  const deleteTask = (projectIndex, taskIndex) => {
    projectList[projectIndex].tasks.splice(taskIndex, 1);
    updateStorage();
  };

  return {
    projectList,
    loopThroughProjects,
    loopThroughActiveProjectTasks,
    loopThroughAllTasks,
    resetActiveProject,
    activeProjectIndex,
    setActiveProject,
    getActiveProject,
    addProject,
    editProject,
    deleteProject,
    addTask,
    getTaskIndex,
    editTask,
    switchTaskComplete,
    deleteTask,
  };
})();

export { storageController };
