const taskFactory = (title, notes, dueDate, priority, id) => {
  return { title, notes, dueDate, priority, id, complete: false };
};

export { taskFactory };
