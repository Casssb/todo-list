import { projectFactory } from './projects';
import { taskFactory } from './tasks';
import { isToday, parseISO, addDays, isBefore } from 'date-fns';

const storageController = (() => {
  const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.list';
  const projectList = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)
  ) || [
    {
      title: 'General Tasks',
      description: '',
      id: 'default',
      tasks: [
        {
          title: 'Check out my',
          notes: 'You can, edit & delete tasks and assign them to projects',
          dueDate: '2022-10-08',
          priority: '1',
          id: 0,
          project: 'default',
          complete: false,
          isDisplayed: true,
        },
        {
          title: '(Somewhat) awesome',
          notes: 'You can also sort all tasks by date or priority',
          dueDate: '2022-10-12',
          priority: '2',
          id: 1,
          project: 'default',
          complete: false,
          isDisplayed: true,
        },
        {
          title: 'Todo list',
          notes:
            'You can use the left side menu to sort all assigned tasks (the date-fns library made this process really easy)',
          dueDate: '2022-10-14',
          priority: '3',
          id: 2,
          project: 'default',
          complete: false,
          isDisplayed: true,
        },
      ],
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

  /* Function to sort  task arrays (within project array).
  Has 2 inputs: The array to sort & the state of the sort button.
  When no sort menu state is passed it just returns the original array*/
  const sortTaskArray = (array, sortState = null) => {
    const sorted = [];
    if (sortState !== null) {
      const completeTasks = array.filter((task) => task.complete);
      const unfinishedTasks = array.filter((task) => !task.complete);
      completeTasks.sort(
        (a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate)
      );
      unfinishedTasks.sort(
        (a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate)
      );
      if (sortState === 'By Date') {
        unfinishedTasks.concat(completeTasks).forEach((task) => {
          sorted.push(task);
        });
      } else if (sortState === 'By Priority') {
        completeTasks.sort((a, b) => b.priority - a.priority);
        unfinishedTasks.sort((a, b) => b.priority - a.priority);
        unfinishedTasks.concat(completeTasks).forEach((task) => {
          sorted.push(task);
        });
      }
      console.log(sorted)
      return sorted;
    } else {
      return array;
    }
  };

  const loopThroughActiveProjectTasks = (callback, sortState) => {
    const activeProjectTasks = [];
    projectList.forEach((project) => {
      if (project.active === true) {
        project.tasks.forEach((task) => {
          task.isDisplayed = true;
          activeProjectTasks.push(task);
        });
      }
    });
    const sorted = sortTaskArray(activeProjectTasks, sortState);
    sorted.forEach((task) => callback(task));
    console.log(projectList);
  };

  const loopThroughDisplayedTasks = (callback, sortState) => {
    const displayedTasks = [];
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.isDisplayed === true) {
          displayedTasks.push(task);
        }
      });
    });
    const sorted = sortTaskArray(displayedTasks, sortState);
    sorted.forEach((task) => callback(task));
  };

  const loopThroughAllTasks = (callback, sortState) => {
    const allTasks = [];
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        allTasks.push(task);
      });
    });
    const sorted = sortTaskArray(allTasks, sortState);
    sorted.forEach((task) => callback(task));
  };

  const loopThroughTodaysTasks = (callback, sortState) => {
    const today = [];
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        if (isToday(parseISO(task.dueDate))) {
          today.push(task);
        }
      });
    });
    const sorted = sortTaskArray(today, sortState);
    sorted.forEach((task) => callback(task));
  };

  const loopThroughWeeksTasks = (callback, sortState) => {
    const today = new Date();
    const sevenDays = addDays(today, 6);
    const week = [];
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        if (isBefore(parseISO(task.dueDate), sevenDays)) {
          week.push(task);
        }
      });
    });
    const sorted = sortTaskArray(week, sortState);
    sorted.forEach((task) => callback(task));
  };

  const loopThroughImportantTasks = (callback, sortState) => {
    const important = [];
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        if (task.priority === '3') {
          important.push(task);
        }
      });
    });
    const sorted = sortTaskArray(important, sortState);
    sorted.forEach((task) => callback(task));
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
      .map((task) => task.id)
      .indexOf(taskId);
    return index;
  };

  const editTask = (projectId, taskId, title, notes, dueDate, priority) => {
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

  const setDisplayedTask = (task) => {
    task.isDisplayed = true;
  };
  const resetDisplayedTasks = () => {
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        task.isDisplayed = false;
      });
    });
  };

  const deleteTask = (projectIndex, taskIndex) => {
    projectList[projectIndex].tasks.splice(taskIndex, 1);
    updateStorage();
  };

  return {
    projectList,
    loopThroughProjects,
    loopThroughActiveProjectTasks,
    loopThroughDisplayedTasks,
    loopThroughAllTasks,
    loopThroughTodaysTasks,
    loopThroughWeeksTasks,
    loopThroughImportantTasks,
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
    setDisplayedTask,
    resetDisplayedTasks,
    deleteTask,
  };
})();

export { storageController };
