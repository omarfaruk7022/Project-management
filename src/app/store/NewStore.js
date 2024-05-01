import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";



const useStore = ((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  // remove a task from the list
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  // update the status of a task only 
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
  
  // add a assigned to assigned array
  addAssigned: (taskId, assigned) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, assigned: [...task.assigned, assigned] }
          : task
      ),
    })),

  //  edit task 
  editTask: (taskId, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
    })),
  
  // remove one task 
  Task: (sourceIndex, destinationIndex) =>
    set((state) => {
      const tasks = [...state.tasks];
      const [removedTask] = tasks.splice(sourceIndex, 1);
      tasks.splice(destinationIndex, 0, removedTask);
      return { tasks };
    }),
}));

const NewStore = create(
  devtools(
    persist(useStore, {
      name: "tasks",
    })
  )
);
export default NewStore;

