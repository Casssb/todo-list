const taskFactory = (title, description, dueDate, priority, id) => {
  return { title, description, dueDate, priority, id, complete: false };
};

export { taskFactory };
