export async function executorTasks() {
  return new Promise((resolve) => {
    let start = new Date();
    setTimeout(() => {
      console.log(start, new Date());
      resolve(true);
    }, 5000);
  });
}
