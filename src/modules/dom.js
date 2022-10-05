import { storageController } from './storageController';
import { parseISO, isAfter, formatDistance } from 'date-fns';

const viewController = (() => {
  /* Modal nodes */
  const addProjectButton = document.querySelector('#add-project-button');
  const addTaskButton = document.querySelector('#add-task-button');
  const closeListModal = document.querySelector('#list-modal-close');
  const closeTaskModal = document.querySelector('#task-modal-close');
  const closeNotesModal = document.querySelector('#notes-modal-close');
  const modal = document.querySelector('#modal');
  const listModalContent = document.querySelector('#list-modal');
  const taskModalContent = document.querySelector('#task-modal');
  const notesModalContent = document.querySelector('#notes-modal');
  /* Form nodes */
  const listForm = document.querySelector('#list-form');
  const listFormTitle = document.querySelector('#list-form-title');
  const listFormDescription = document.querySelector('#list-form-description');
  const listSubmitButton = document.querySelector('#list-submit-button');
  const listEditButton = document.querySelector('#list-edit-button');
  const taskForm = document.querySelector('#task-form');
  const taskFormTitle = document.querySelector('#task-form-title');
  const taskFormNotes = document.querySelector('#task-form-notes');
  const taskFormDate = document.querySelector('#task-form-date');
  const taskFormPriority = document.querySelector('#task-form-priority');
  const taskSubmitButton = document.querySelector('#task-submit-button');
  const taskEditButton = document.querySelector('#task-edit-button');
  const notesForm = document.querySelector('#notes-form');
  const notesFormNotes = document.querySelector('#notes-form-notes');
  /* Project display nodes */
  const projectContainer = document.querySelector('#projects-list');
  const projectTitle = document.querySelector('#project-title');
  const projectDescription = document.querySelector('#project-description');
  /* Task display nodes */
  const taskContainer = document.querySelector('#task-container');
  const sortButton = document.querySelector('#sort-button');
  const sortButtonText = document.querySelector('#sort-button-text');
  /* Variable to contain state of previous menu button selected. This is then
  checked to validate which tasks to append to DOM when dynamic event listeners
  trigger later on (edit/delete task items) */
  let menuState = 'project';

  const appendProjectMarkup = (project) => {
    if (project.active) projectTitle.textContent = project.title;
    if (project.active) projectDescription.textContent = project.description;
    const projectLi = document.createElement('li');
    projectLi.setAttribute('data-id', `${project.id}`);
    projectLi.classList.add('project-li-elem');
    projectLi.setAttribute('id', 'project-li-elem');
    projectLi.innerHTML = `<p class="project-li-title">${project.title}</p>
    <div
      class="project-buttons-container"
      id="project-buttons-container"
    >
      ${
        project.id === 'default'
          ? ''
          : `<svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
        aria-label='edit-button'
        data-action="edit"
      >
      <path
        pointer-events="none"
        fill="currentColor"
        d="M20.7,7C21.1,6.6 21.1,6 20.7,5.6L18.4,3.3C18,2.9 17.4,2.9 17,3.3L15.2,5.1L19,8.9M3,17.2V21H6.8L17.8,9.9L14.1,6.1L3,17.2M7,2V5H10V7H7V10H5V7H2V5H5V2H7Z"
      />
      </svg>
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
        aria-label='delete-button'
        data-action="delete"
      >
      <path
        pointer-events="none"
        fill="currentColor"
        d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
      />
      </svg>`
      }
    </div>`;
    projectContainer.append(projectLi);
    /* Append event listener for actions edit/delete & to choose active project */
    projectLi.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      addTaskButton.style.display = 'flex';
      menuState = 'project';
      const target = e.target;
      const projectId = e.currentTarget.dataset.id;
      const projectIndex = storageController.activeProjectIndex(projectId);
      const action = target.dataset.action;
      storageController.setActiveProject(projectId);
      taskContainer.innerHTML = '';
      storageController.resetDisplayedTasks();
      storageController.loopThroughActiveProjectTasks(appendTaskMarkup);
      projectContainer.innerHTML = '';
      storageController.loopThroughProjects(appendProjectMarkup);

      switch (action) {
        case 'edit':
          listForm.reset();
          modal.style.display = 'flex';
          listModalContent.style.display = 'flex';
          listEditButton.style.display = 'flex';
          listSubmitButton.style.display = 'none';
          listFormTitle.value =
            storageController.projectList[projectIndex].title;
          listFormDescription.value =
            storageController.projectList[projectIndex].description;
          break;
        case 'delete':
          storageController.deleteProject(projectId);
          projectContainer.innerHTML = '';
          storageController.loopThroughProjects(appendProjectMarkup);
          taskContainer.innerHTML = '';
          storageController.loopThroughActiveProjectTasks(appendTaskMarkup);
          break;
        default:
          throw new Error('no action selected');
      }
    });
  };

  const appendTaskMarkup = (task) => {
    const taskLi = document.createElement('li');
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const daysTilDue = formatDistance(parseISO(task.dueDate), today);
    taskLi.setAttribute('data-index', `${task.id}`);
    taskLi.setAttribute('data-project', `${task.project}`);
    taskLi.classList.add('task-li-elem');
    task.priority === '1' && taskLi.classList.add('task-priority-low');
    task.priority === '2' && taskLi.classList.add('task-priority-medium');
    task.priority === '3' && taskLi.classList.add('task-priority-high');
    task.complete
      ? taskLi.classList.add('task-complete')
      : taskLi.classList.remove('task-complete');
    taskLi.setAttribute('id', 'task-li-elem');
    taskLi.innerHTML = `${
      task.complete === false
        ? `<svg
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
            aria-label="complete-checkbox"
            data-action="complete"
            class='task-complete-checkbox'
          >
          <path
            fill="currentColor"
            pointer-events="none"
            d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
          </svg>`
        : `<svg
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
            aria-label="complete-checkbox"
            data-action="complete"
            class='task-complete-checkbox'
          >
          <path
            fill="currentColor"
            pointer-events="none"
            d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"
          />
        </svg>`
    }
    <p class="task-li-title">${task.title}</p>
    <span class="task-li-date">${
      isAfter(today, parseISO(task.dueDate))
        ? 'Overdue'
        : `Due in ${daysTilDue}`
    }</span>
    <div class="task-buttons-container" id="task-buttons-container">
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
        aria-label="notes-button"
        data-action="notes"
        class='task-notes-button'
      >
        <path
          pointer-events="none"
          fill="currentColor"
          d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M8,14H6V12H8V14M8,11H6V9H8V11M8,8H6V6H8V8M15,14H10V12H15V14M18,11H10V9H18V11M18,8H10V6H18V8Z"
        />
      </svg>
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
        aria-label="edit-button"
        data-action="edit"
        class='task-edit-button'
      >
        <path
          pointer-events="none"
          fill="currentColor"
          d="M20.7,7C21.1,6.6 21.1,6 20.7,5.6L18.4,3.3C18,2.9 17.4,2.9 17,3.3L15.2,5.1L19,8.9M3,17.2V21H6.8L17.8,9.9L14.1,6.1L3,17.2M7,2V5H10V7H7V10H5V7H2V5H5V2H7Z"
        />
      </svg>
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
        aria-label="delete-button"
        data-action="delete"
        class='task-delete-button'
      >
        <path
          pointer-events="none"
          fill="currentColor"
          d="M14.12,10.47L12,12.59L9.87,10.47L8.46,11.88L10.59,14L8.47,16.12L9.88,17.53L12,15.41L14.12,17.53L15.53,16.12L13.41,14L15.53,11.88L14.12,10.47M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9Z"
        />
      </svg>`;
    taskContainer.append(taskLi);
    /* Append event listeners to check/uncheck 'complete' checkbox, open task
    modal & edit/delete task */
    taskLi.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.target;
      const taskId = Number(e.currentTarget.dataset.index);
      const projectId = e.currentTarget.dataset.project;
      const projectIndex = storageController.activeProjectIndex(projectId);
      const taskIndex = storageController.getTaskIndex(projectIndex, taskId);
      const action = target.dataset.action;

      switch (action) {
        case 'complete':
          storageController.switchTaskComplete(projectIndex, taskIndex);
          taskContainer.innerHTML = '';
          storageController.loopThroughDisplayedTasks(appendTaskMarkup);
          break;
        case 'notes':
          notesForm.reset();
          modal.style.display = 'flex';
          notesModalContent.style.display = 'flex';
          notesFormNotes.value =
            storageController.projectList[projectIndex].tasks[taskIndex].notes;
          break;
        case 'edit':
          taskForm.reset();
          taskEditButton.dataset.currentTask = taskIndex;
          taskEditButton.dataset.currentProject = projectIndex;
          modal.style.display = 'flex';
          taskModalContent.style.display = 'flex';
          taskEditButton.style.display = 'flex';
          taskSubmitButton.style.display = 'none';
          taskFormTitle.value =
            storageController.projectList[projectIndex].tasks[taskIndex].title;
          taskFormNotes.value =
            storageController.projectList[projectIndex].tasks[taskIndex].notes;
          taskFormDate.value =
            storageController.projectList[projectIndex].tasks[
              taskIndex
            ].dueDate;
          taskFormPriority.value =
            storageController.projectList[projectIndex].tasks[
              taskIndex
            ].priority;
          break;
        case 'delete':
          storageController.deleteTask(projectIndex, taskIndex);
          taskContainer.innerHTML = '';
          menuState === 'project' &&
            storageController.loopThroughDisplayedTasks(appendTaskMarkup);
          menuState === 'all' &&
            storageController.loopThroughAllTasks(appendTaskMarkup);
          menuState === 'today' &&
            storageController.loopThroughTodaysTasks(appendTaskMarkup);
          menuState === 'next 7' &&
            storageController.loopThroughWeeksTasks(appendTaskMarkup);
          menuState === 'important' &&
            storageController.loopThroughImportantTasks(appendTaskMarkup);
          break;
        default:
          throw new Error('no action selected');
      }
    });
  };

  const appendMenuListeners = () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        addTaskButton.style.display = 'none';
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget;
        const action = target.dataset.menu;

        switch (action) {
          case 'all':
            menuState = 'all';
            taskContainer.innerHTML = '';
            projectTitle.textContent = 'All Tasks';
            projectDescription.textContent = '';
            storageController.resetDisplayedTasks();
            storageController.loopThroughAllTasks(
              storageController.setDisplayedTask
            );
            storageController.loopThroughAllTasks(appendTaskMarkup);
            break;
          case 'today':
            menuState = 'today';
            taskContainer.innerHTML = '';
            projectTitle.textContent = 'Today';
            projectDescription.textContent = '';
            storageController.resetDisplayedTasks();
            storageController.loopThroughTodaysTasks(
              storageController.setDisplayedTask
            );
            storageController.loopThroughTodaysTasks(appendTaskMarkup);
            break;
          case 'next 7':
            menuState = 'next 7';
            taskContainer.innerHTML = '';
            projectTitle.textContent = 'This Week';
            projectDescription.textContent = '';
            storageController.resetDisplayedTasks();
            storageController.loopThroughWeeksTasks(
              storageController.setDisplayedTask
            );
            menuState === 'next 7' &&
              storageController.loopThroughWeeksTasks(appendTaskMarkup);
            break;
          case 'important':
            menuState = 'important';
            taskContainer.innerHTML = '';
            projectTitle.textContent = 'Important';
            projectDescription.textContent = '';
            storageController.resetDisplayedTasks();
            storageController.loopThroughImportantTasks(
              storageController.setDisplayedTask
            );
            storageController.loopThroughImportantTasks(appendTaskMarkup);
            break;
        }
      });
    });
  };

  /* Listeners to open/close modal */
  addProjectButton.addEventListener('click', () => {
    listForm.reset();
    modal.style.display = 'flex';
    listModalContent.style.display = 'flex';
    listEditButton.style.display = 'none';
    listSubmitButton.style.display = 'flex';
  });

  addTaskButton.addEventListener('click', () => {
    taskForm.reset();
    modal.style.display = 'flex';
    taskModalContent.style.display = 'flex';
    taskEditButton.style.display = 'none';
    taskSubmitButton.style.display = 'flex';
  });

  closeListModal.addEventListener('click', () => {
    modal.style.display = 'none';
    listModalContent.style.display = 'none';
  });

  closeTaskModal.addEventListener('click', () => {
    modal.style.display = 'none';
    taskModalContent.style.display = 'none';
  });

  closeNotesModal.addEventListener('click', () => {
    modal.style.display = 'none';
    notesModalContent.style.display = 'none';
  });

  /* Listeners for submitting/editing projects*/
  listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    storageController.addProject(
      listFormTitle.value,
      listFormDescription.value
    );
    projectContainer.innerHTML = '';
    storageController.resetDisplayedTasks();
    storageController.loopThroughProjects(appendProjectMarkup);
    taskContainer.innerHTML = '';
    storageController.loopThroughActiveProjectTasks(appendTaskMarkup);
    listForm.reset();
    modal.style.display = 'none';
    listModalContent.style.display = 'none';
  });

  listEditButton.addEventListener('click', (e) => {
    e.preventDefault();
    const activeId = storageController.getActiveProject();
    storageController.editProject(
      activeId,
      listFormTitle.value,
      listFormDescription.value
    );
    projectContainer.innerHTML = '';
    storageController.loopThroughProjects(appendProjectMarkup);
    listForm.reset();
    modal.style.display = 'none';
    listModalContent.style.display = 'none';
  });
  /* Listeners for submitting/editing tasks */
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    storageController.addTask(
      taskFormTitle.value,
      taskFormNotes.value,
      taskFormDate.value,
      taskFormPriority.value
    );
    taskContainer.innerHTML = '';
    storageController.resetDisplayedTasks();
    storageController.loopThroughActiveProjectTasks(appendTaskMarkup);
    taskForm.reset();
    modal.style.display = 'none';
    taskModalContent.style.display = 'none';
  });

  taskEditButton.addEventListener('click', (e) => {
    e.preventDefault();
    const currentProject = taskEditButton.dataset.currentProject;
    const currentTask = taskEditButton.dataset.currentTask;
    storageController.editTask(
      currentProject,
      currentTask,
      taskFormTitle.value,
      taskFormNotes.value,
      taskFormDate.value,
      taskFormPriority.value
    );
    taskContainer.innerHTML = '';
    menuState === 'project' &&
      storageController.loopThroughDisplayedTasks(appendTaskMarkup);
    menuState === 'all' &&
      storageController.loopThroughAllTasks(appendTaskMarkup);
    menuState === 'today' &&
      storageController.loopThroughTodaysTasks(appendTaskMarkup);
    menuState === 'next 7' &&
      storageController.loopThroughWeeksTasks(appendTaskMarkup);
    menuState === 'important' &&
      storageController.loopThroughImportantTasks(appendTaskMarkup);
    taskForm.reset();
    modal.style.display = 'none';
    taskModalContent.style.display = 'none';
  });

  /* Listener to sort displayed tasked based on due date/importance */

  sortButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(e.target);
    sortButtonText.textContent === 'By Date'
      ? (sortButtonText.textContent = 'By Priority')
      : (sortButtonText.textContent = 'By Date');
  });

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
      taskModalContent.style.display = 'none';
      listModalContent.style.display = 'none';
      notesModalContent.style.display = 'none';
    }
  };

  return { appendProjectMarkup, appendTaskMarkup, appendMenuListeners };
})();

const updateSort = () => {};

export { viewController };
