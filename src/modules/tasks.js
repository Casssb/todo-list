const taskFactory = (title, notes, dueDate, priority, id, project) => {
  return { title, notes, dueDate, priority, id, project, complete: false };
};

export { taskFactory };
