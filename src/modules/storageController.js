import { projectFactory } from './projects';
import { taskFactory } from './tasks';

const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.list';
const projectList = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
) || [
  {
    title: 'default',
    description: 'default',
    id: 'default',
    tasks: [],
    active: true,
  },
];

const updateStorage = () => {
  localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projectList));
};

const resetActiveProject = () => {
  projectList.forEach((project) => (project.active = false));
  updateStorage();
};

const activeProjectIndex = (projectId) => {
  const index = projectList.map((list) => list.id).indexOf(projectId);
  return index;
};

const setActiveProject = (projectId) => {
  const index = activeProjectIndex(projectId);
  projectList[index].active = true;
  updateStorage();
};

const addProject = (name, description) => {
  resetActiveProject();
  const project = projectFactory(name, description);
  projectList.push(project);
  updateStorage();
};

const editProject = (projectId, title, description) => {
  const index = activeProjectIndex(projectId);
  projectList[index].title = title;
  projectList[index].description = description;
  updateStorage();
};

const deleteProject = (projectId) => {
  const index = activeProjectIndex(projectId);
  projectList.splice(index, 1);
  updateStorage();
};

const addTask = (projectId, title, notes, dueDate, priority) => {
  const index = activeProjectIndex(projectId);
  const taskId = projectList[index].tasks.length;
  const project = projectId;
  const task = taskFactory(title, notes, dueDate, priority, taskId, project);
  projectList[index].tasks.push(task);
  updateStorage();
};

const editTask = (projectId, title, notes, dueDate, priority, taskId) => {
  const index = activeProjectIndex(projectId);
  projectList[index][taskId].title = title;
  projectList[index][taskId].notes = notes;
  projectList[index][taskId].dueDate = dueDate;
  projectList[index][taskId].priority = priority;
  updateStorage();
};

const switchTaskComplete = (taskId) => {
  projectList[taskId].complete
    ? (projectList[taskId].complete = false)
    : (projectList[taskId].complete = true);
  updateStorage();
};

const deleteTask = (projectId, taskId) => {
  const index = activeProjectIndex(projectId);
  projectList[index].splice(taskId, 1);
  updateStorage();
};

export {
  addProject,
  editProject,
  setActiveProject,
  deleteProject,
  addTask,
  editTask,
  switchTaskComplete,
  deleteTask,
};
