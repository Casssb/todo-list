import { storageController } from './storageController';

const viewController = () => {
  /* Modal nodes */
  const addProjectButton = document.querySelector('#add-project-button');
  const addTaskButton = document.querySelector('#add-task-button');
  const closeListModal = document.querySelector('#list-modal-close');
  const closeTaskModal = document.querySelector('#task-modal-close');
  const modal = document.querySelector('#modal');
  const listModalContent = document.querySelector('#list-modal');
  const taskModalContent = document.querySelector('#task-modal');
  /* Form nodes */
  const listForm = document.querySelector('#list-form');
  const listFormTitle = document.querySelector('#list-form-title');
  const listFormDescription = document.querySelector('#list-form-description');
  const listEditButton = document.querySelector('#list-edit-button');
  /* Project display nodes */
  const projectContainer = document.querySelector('#projects-list');
  const projectTitle = document.querySelector('#project-title');
  const projectDescription = document.querySelector('#project-description');

  const createProjectMarkup = (project) => {
    if (project.active) projectTitle.textContent = project.title;
    if (project.active) projectDescription.textContent = project.description;
    const projectLi = document.createElement('li');
    projectLi.setAttribute('data-id', `${project.id}`);
    projectLi.innerHTML = `<p class="project-li-title">${project.title}</p>
    <div class="project-buttons-container">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20.7,7C21.1,6.6 21.1,6 20.7,5.6L18.4,3.3C18,2.9 17.4,2.9 17,3.3L15.2,5.1L19,8.9M3,17.2V21H6.8L17.8,9.9L14.1,6.1L3,17.2M7,2V5H10V7H7V10H5V7H2V5H5V2H7Z" />
    </svg>
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
  </svg>
    </div>`;
    projectContainer.append(projectLi);
  };
  /* Listeners to open/close modal */
  addProjectButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    listModalContent.style.display = 'flex';
  });

  addTaskButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    taskModalContent.style.display = 'flex';
  });

  closeListModal.addEventListener('click', () => {
    modal.style.display = 'none';
    listModalContent.style.display = 'none';
  });

  closeTaskModal.addEventListener('click', () => {
    modal.style.display = 'none';
    taskModalContent.style.display = 'none';
  });
  /* Listeners for submitting/editing content*/
  listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const project = storageController.addProject(listFormTitle.value, listFormDescription.value);
    projectContainer.innerHTML = ''
    storageController.loopThroughProjects(createProjectMarkup)
  })

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
      taskModalContent.style.display = 'none';
      listModalContent.style.display = 'none';
    }
  };
};

const renderProject = () => {};

const renderTask = () => {};

const updateSort = () => {};

export { viewController };
