import { projectFactory } from './projects';
import { taskFactory } from './tasks';

const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.list';
const projectList = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
) || [{ title: 'default', description: 'default', id: 'default', tasks: [], active: true }];

const updateStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projectList))
}

const resetActiveProject = () => {
  projectList.forEach(project => project.active = false);
}

const addProject = (name, description) => {
  resetActiveProject();
  const project = projectFactory(name, description);
  projectList.push(project);
  updateStorage();
}

const editProject = (projectId, title, description) => {
 const index = projectList.map(list => list.id).indexOf(projectId);
 projectList[index].title = title;
 projectList[index].description = description;
 updateStorage();
}

const deleteProject = (projectId) => {
  const index = projectList.map(list => list.id).indexOf(projectId);
  projectList.splice(index, 1);
  updateStorage()
};

const addTask = (projectId, title, description, dueDate, priority) => {
  const index = projectList.map(list => list.id).indexOf(projectId);
  const taskId = projectList[index].tasks.length;
  const task = taskFactory(title, description, dueDate, priority, taskId);
  projectList[index].tasks.push(task);
  updateStorage()
}

const editTask = (projectId, title, description, dueDate, priority, taskId) => {
  const index = projectList.map(list => list.id).indexOf(projectId);
  projectList[index][taskId].title = title;
  projectList[index][taskId].description = description;
  projectList[index][taskId].dueDate = dueDate;
  projectList[index][taskId].priority = priority;
  updateStorage()
}

const deleteTask = (projectId, taskId) => {
  const index = projectList.map(list => list.id).indexOf(projectId);
  projectList[index].splice(taskId, 1);
  updateStorage()
}