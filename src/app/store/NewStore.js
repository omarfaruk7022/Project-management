import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useStore = (set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),

  addAssigned: (taskId, assigned) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, assigned: [...task.assigned, assigned] }
          : task
      ),
    })),

  editTask: (taskId, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
    })),

  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
});

const NewStore = create(
  devtools(
    persist(useStore, {
      name: "tasks",
    })
  )
);
export default NewStore;
