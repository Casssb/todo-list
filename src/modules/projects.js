const projectFactory = (title, description) => {
  const id = new Date().toString();
  const tasks = [];
  return { title, description, id, tasks };
};

export { projectFactory };
