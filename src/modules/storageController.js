import { projectFactory } from './projects';
import { taskFactory } from './tasks';

const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.list';
const projectList = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
) || [{ title: 'default', description: 'default', id: 'default', tasks: [] }];

const updateStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projectList))
}
