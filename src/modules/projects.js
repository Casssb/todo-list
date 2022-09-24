const projectFactory = (title, description) => {
  const id = Date().now().toString();
  const tasks = [];
  const active = true;
  return { title, description, id, tasks, active };
};

export { projectFactory };
