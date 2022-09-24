/* Nodes for event listeners */

const appendModalEventListeners = () => {
  const addProjectButton = document.querySelector('#add-project-button');
  const addTaskButton = document.querySelector('#add-task-button');
  const closeListModal = document.querySelector('#list-modal-close');
  const closeTaskModal = document.querySelector('#task-modal-close');
  const modal = document.querySelector('#modal');
  const listModalContent = document.querySelector('#list-modal');
  const taskModalContent = document.querySelector('#task-modal');

  addProjectButton.addEventListener('click', () => {
    modal.style.display = 'flex';
    listModalContent.style.display = 'flex';
  });

  addTaskButton.addEventListener('click', () => {
    modal.style.display = 'flex'
    taskModalContent.style.display = 'flex';
  })

  closeListModal.addEventListener('click', () => {
    modal.style.display = 'none';
    listModalContent.style.display = 'none';
  });

  closeTaskModal.addEventListener('click', () => {
    modal.style.display = 'none';
    taskModalContent.style.display = 'none';
  });

  window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = 'none'
        taskModalContent.style.display = 'none';
        listModalContent.style.display = 'none';
    }
  }
};

const renderProject = () => {};

const renderTask = () => {};

const updateSort = () => {};

export { appendModalEventListeners };
