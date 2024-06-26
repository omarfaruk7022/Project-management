"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import projectsData from "../../../../data/projects.json";
import { Avatar, Button, Dropdown, Input, Modal, Tooltip } from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { resetServerContext } from "react-beautiful-dnd";
import NewStore, { useStore } from "@/app/store/NewStore";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

const Details = () => {
  const { id } = useParams();
  const [inProgressList, setInProgressList] = useState([]);
  const [todoList, setTodoList] = useState();
  const [filteredTodoList, setFilteredTodoList] = useState();
  const [doneList, setDoneList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleViewOk = () => {
    setIsViewModalOpen(false);
  };

  const handleViewCancel = () => {
    setIsViewModalOpen(false);
  };
  const handleEditOk = () => {
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch("https://api.islamicposhak.com/api/projects").then((res) =>
        res.json()
      ),
  });

  const filteredProject = data?.data?.find((project) => project._id == id);

  const filteredTodo = todoList?.filter((task) => task?.projectId == id);
  const filteredToDoList = filteredTodo?.filter(
    (task) => task?.status == "TodosList"
  );
  const filteredInProgress = filteredTodo?.filter(
    (task) => task?.status == "InProgressList"
  );

  const filteredDoneList = filteredTodo?.filter(
    (task) => task?.status == "DoneList"
  );

  useEffect(() => {
    setFilteredTodoList(filteredToDoList);
    setInProgressList(filteredInProgress);
    setDoneList(filteredDoneList);
  }, [todoList]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addTask = NewStore((state) => state.addTask);
  const editTask = NewStore((state) => state.editTask);
  const [updateData, setUpdateData] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      projectId: id,
      id: Math.floor(Math.random() * 100),
      name: e.target.taskName.value,
      description: e.target.description.value,
      date: e.target.date.value,
      time: e.target.time.value,
      status: "TodosList",
      assigned: [
        {
          id: Math.floor(Math.random() * 100),
          name: e.target.assigned.value,
          email: "asd@mail.com",
        },
      ],
    };
    if (
      task.projectId === "" ||
      task.name === "" ||
      task.assigned[0].name == "" ||
      task.description === "" ||
      task.date === "" ||
      task.time === ""
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      addTask(task);
      toast.success("Task added successfully");
      e.target.reset();
      setIsModalOpen(false);
    }
  };
  const handleEditTask = (e, taskId) => {
    e.preventDefault();
    const task = {
      projectId: id,
      id: Math.floor(Math.random() * 100),
      name: updateData.name,
      description: updateData.description,
      date: updateData.date,
      time: updateData.time,
      status: "TodosList",
      assigned: [
        {
          id: Math.floor(Math.random() * 100),
          name: e.target.assigned.value,
          email: "asd@mail.com",
        },
      ],
    };
    if (
      task.projectId === "" ||
      task.name === "" ||
      task.assigned[0].name == "" ||
      task.description === "" ||
      task.date === "" ||
      task.time === ""
    ) {
      toast.error("Please fill all fields");
      return;
    } else {
      editTask(taskId, task);
      toast.success("Task edited successfully");
      e.target.reset();
      setIsEditModalOpen(false);
    }
  };

  const handleUpdate = (task) => {
    setIsEditModalOpen(true);
    setUpdateData(task);
  };

  const tasks = NewStore((state) => state.tasks);
  const updateTaskStatus = NewStore((state) => state.updateTaskStatus);
  useEffect(() => {
    setTodoList(tasks);
  }, [tasks]);

  const [loading, setLoading] = useState(false);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    updateTaskStatus(Number(draggableId), destination.droppableId);
  };

  const addAssigned = NewStore((state) => state.addAssigned);
  const handleAssignPerson = (taskAssigned, taskId, assigned) => {
    const assignedPerson = taskAssigned.find(
      (person) => person.name === assigned?.name
    );
    if (assignedPerson) {
      toast.error("Member already assigned");
      return;
    }

    addAssigned(taskId, assigned);
    toast.success("Member assigned successfully");

    if (
      assigned.name == "" ||
      assigned.name == null ||
      assigned.name == undefined
    ) {
      return;
    }
    if (assigned.name == "Assign to") {
      return;
    }
  };

  const removeTask = NewStore((state) => state.removeTask);
  const handleTaskDelete = (taskId) => {
    toast.success("Task deleted successfully");
    removeTask(taskId);
  };
  resetServerContext();

  const isLoggedIn = NewStore((state) => state.isLoggedIn);
  const [searchTask, setSearchTask] = useState();
  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    if (search == "" || search == null || search == undefined) {
      setSearchTask(0);
      return;
    }
    const filtered = filteredTodo?.filter(
      (task) =>
        task.name.toLowerCase().includes(search) ||
        task.status.toLowerCase().includes(search) ||
        task.assigned[0].name.toLowerCase().includes(search)
    );
    setSearchTask(filtered);
  };

  const makeStatus = (taskStatus) => {
    if (taskStatus == "TodosList") {
      return "To do";
    } else if (taskStatus == "InProgressList") {
      return "In progress";
    } else {
      return "Done";
    }
  };

  const handleSortBy = (e) => {
    const sort = e.target.value;
    if (sort == "all") {
      setSearchTask("");
      return;
    }
    // sort by assignee name

    const filtered = filteredTodo?.filter((task) =>
      task.assigned.map((assign) => assign.name).includes(sort)
    );

    setSearchTask(filtered);
  };

  return (
    <div>
      <div className="px-5 md:px-20 lg:px-52  pb-20">
        <div className="p-5 text-center">
          <h2 className="text-xl text-black   font-bold">
            {filteredProject?.name}
          </h2>
          <p className=" text-black">
            <span className="font-bold"></span> {filteredProject?.description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap">
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add task
          </Button>
          <Modal
            title="Add task"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="flex flex-col gap-2">
              <form onSubmit={handleAddTask} className="flex  flex-wrap gap-2">
                <input
                  name="taskName"
                  type="text"
                  placeholder="Task name"
                  className="p-2 border-2 rounded-lg"
                />
                <input
                  name="description"
                  type="text"
                  placeholder="Task description"
                  className="p-2 border-2 rounded-lg"
                />

                <input
                  name="time"
                  type="time"
                  placeholder="Task date"
                  className="p-2 border-2 rounded-lg"
                />
                <input
                  name="date"
                  type="date"
                  placeholder="Task date"
                  className="p-2 border-2 rounded-lg"
                />

                <select name="assigned" className="border-2 rounded-lg">
                  <option value="Tom">Tom</option>
                  <option value="Alex">Alex</option>
                  <option value="Jerry">Jerry</option>
                </select>
                <input
                  type="submit"
                  className="bg-green-500 p-2  rounded-lg text-white cursor-pointer"
                />
              </form>
            </div>
          </Modal>
          <div className="flex gap-2">
            <div>
              <form onChange={handleSearch}>
                <div class="relative">
                  <label for="Search" class="sr-only">
                    {" "}
                    Search{" "}
                  </label>

                  <input
                    type="text"
                    id="Search"
                    name="search"
                    placeholder="Search by name / status / assignee"
                    class="w-full rounded-md border-2 py-2.5 ps-2 pe-10 shadow-sm sm:text-sm text-black"
                  />
                </div>
              </form>
            </div>
            <div className=" ">
              <label htmlFor="SortBy" className="sr-only">
                SortBy
              </label>

              <select
                onClick={(e) => {
                  handleSortBy(e);
                }}
                id="SortBy"
                className="h-10 rounded border-2 text-sm text-black"
              >
                <option defaultValue={"all"} value="all">
                  All
                </option>
                <option value="Tom">Tom</option>
                <option value="Alex">Alex</option>
                <option value="Jerry">Jerry</option>
              </select>
            </div>
          </div>
        </div>
        {searchTask?.length > 0 ? (
          searchTask?.map((task, index) => (
            <div key={task?.id} className="flex justify-between">
              <div className="bg-gray-200 p-5 w-[100%] m-2 rounded-lg">
                <p className="text-black text-[20px]">{task?.name}</p>
                <p className="text-gray-400">{task?.description}</p>
                <p className="text-black">
                  Task status : {makeStatus(task?.status)}
                </p>
                <p className="text-gray-600">
                  Deadline: {task?.time}, {task?.date}
                </p>
                <div>
                  <span className="text-black">Assigned:</span>
                  <div className="flex gap-3 flex-wrap py-3">
                    {task?.assigned?.map((user) => (
                      <Avatar
                        key={user?.id}
                        style={{
                          backgroundColor: "#7265e6",
                          verticalAlign: "middle",
                        }}
                        size="large"
                        gap={2}
                        title={user.name}
                      >
                        {user?.name.charAt(0)}
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <button
                      className="bg-red-500 text-white px-2 rounded-lg cursor-pointer float-right"
                      onClick={() => {
                        handleTaskDelete(task.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className=" border-2 h-100">
                <h2 className="bg-gray-400 text-center py-5 ">To do</h2>
                <Droppable droppableId="TodosList">
                  {(provided) => (
                    <div
                      className="flex flex-col gap-1"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {filteredTodoList?.map((task, index) => (
                        <Draggable
                          key={task?.id}
                          draggableId={task?.id?.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex justify-between cursor-pointer"
                            >
                              <div className="bg-gray-200 p-5 w-[100%] m-2 rounded-lg">
                                <p className="text-black">{task?.name}</p>
                                <p className="text-gray-400">
                                  {task?.description}
                                </p>
                                <p className="text-gray-600">
                                  Deadline:{task?.time}, {task?.date}
                                </p>

                                <div>
                                  <div className="flex gap-2 items-center">
                                    <div>
                                      <span className="text-black">
                                        Assigned:
                                      </span>
                                    </div>
                                    <div className="flex gap-3 flex-wrap py-3">
                                      {task?.assigned?.map((user) => (
                                        <>
                                          <span className="text-black">
                                            {user?.name}
                                          </span>
                                        </>
                                      ))}
                                    </div>
                                  </div>

                                  <select
                                    defaultValue="Assign to"
                                    name="assigned"
                                    onChange={(e) => {
                                      handleAssignPerson(
                                        task?.assigned,
                                        task.id,
                                        {
                                          id: Math.floor(Math.random() * 100),
                                          name: e.target.value,
                                          email: "",
                                        }
                                      );
                                    }}
                                    className="text-black"
                                  >
                                    <option value="Tom">Tom</option>
                                    <option value="Alex">Alex</option>
                                    <option value="Jerry">Jerry</option>
                                  </select>
                                  <div className="my-2 flex justify-between">
                                    <button
                                      onClick={() => {
                                        setIsViewModalOpen(true);
                                      }}
                                      className="bg-blue-500 text-white px-2 rounded-lg cursor-pointer "
                                    >
                                      View
                                    </button>
                                    <Modal
                                      title="Task detail"
                                      open={isViewModalOpen}
                                      onOk={handleViewOk}
                                      onCancel={handleViewCancel}
                                    >
                                      <p>{task?.name}</p>
                                      <p>{task?.description}</p>
                                      <p>{task?.time}</p>
                                      <p>{task?.date}</p>
                                      {task?.assigned?.length > 1 ? (
                                        <p>Assigned:</p>
                                      ) : (
                                        ""
                                      )}

                                      <ul className="flex gap-2 cursor-pointer">
                                        {task?.assigned?.map((assign) => (
                                          <li
                                            className="bg-blue-400 text-white px-2 py-1 rounded-xl "
                                            key={assign.id}
                                          >
                                            <p>{assign.name}</p>
                                          </li>
                                        ))}
                                      </ul>
                                    </Modal>
                                    <button
                                      onClick={() => handleUpdate(task)}
                                      className="bg-green-500 text-white px-2 rounded-lg cursor-pointer "
                                    >
                                      Edit
                                    </button>
                                    <Modal
                                      title="Edit task"
                                      open={isEditModalOpen}
                                      onOk={handleEditOk}
                                      onCancel={handleEditCancel}
                                    >
                                      <div className="flex flex-col gap-2">
                                        <form
                                          onSubmit={(e) =>
                                            handleEditTask(e, task.id)
                                          }
                                          className="flex  flex-wrap gap-2"
                                        >
                                          <input
                                            name="taskName"
                                            value={updateData?.name}
                                            onChange={(e) =>
                                              setUpdateData({
                                                ...updateData,
                                                name: e.target.value,
                                              })
                                            }
                                            type="text"
                                            placeholder="Task name"
                                            className="p-2 border-2 rounded-lg"
                                          />
                                          <input
                                            name="description"
                                            value={updateData?.description}
                                            onChange={(e) =>
                                              setUpdateData({
                                                ...updateData,
                                                description: e.target.value,
                                              })
                                            }
                                            type="text"
                                            placeholder="Task description"
                                            className="p-2 border-2 rounded-lg"
                                          />

                                          <input
                                            name="time"
                                            type="time"
                                            value={updateData?.time}
                                            onChange={(e) =>
                                              setUpdateData({
                                                ...updateData,
                                                time: e.target.value,
                                              })
                                            }
                                            placeholder="Task date"
                                            className="p-2 border-2 rounded-lg"
                                          />
                                          <input
                                            name="date"
                                            type="date"
                                            value={updateData?.date}
                                            onChange={(e) =>
                                              setUpdateData({
                                                ...updateData,
                                                date: e.target.value,
                                              })
                                            }
                                            placeholder="Task date"
                                            className="p-2 border-2 rounded-lg"
                                          />

                                          <select
                                            name="assigned"
                                            className="border-2 rounded-lg"
                                          >
                                            <option value="Tom">Tom</option>
                                            <option value="Alex">Alex</option>
                                            <option value="Jerry">Jerry</option>
                                          </select>
                                          <input
                                            type="submit"
                                            className="bg-green-500 p-2  rounded-lg text-white cursor-pointer"
                                          />
                                        </form>
                                      </div>
                                    </Modal>

                                    <button
                                      className="bg-red-500 text-white px-2 rounded-lg cursor-pointer float-right"
                                      onClick={() => {
                                        handleTaskDelete(task.id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className=" border-2 h-100">
                <h2 className="bg-gray-400 text-center py-5">In progress</h2>
                <Droppable droppableId="InProgressList">
                  {(provided) => (
                    <div
                      className="flex flex-col gap-1"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {inProgressList?.map((task, index) => (
                        <Draggable
                          key={task?.id}
                          draggableId={task?.id?.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex justify-between cursor-pointer"
                            >
                              <div className="bg-gray-200 p-5 w-[100%] m-2 rounded-lg">
                                <p className="text-black">{task?.name}</p>
                                <p className="text-gray-400">
                                  {task?.description}
                                </p>
                                <p className="text-gray-600">
                                  Deadline:{task?.time}, {task?.date}
                                </p>
                                <div>
                                  <div className="flex gap-2 items-center">
                                    <div>
                                      <span className="text-black">
                                        Assigned:
                                      </span>
                                    </div>
                                    <div className="flex gap-3 flex-wrap py-3">
                                      {task?.assigned?.map((user) => (
                                        <>
                                          <span className="text-black">
                                            {user?.name}
                                          </span>
                                        </>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className="bg-red-500 text-white px-2 rounded-lg cursor-pointer float-right"
                                      onClick={() => {
                                        handleTaskDelete(task.id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className=" border-2 h-100">
                <h2 className="bg-gray-400 text-center py-5">Done</h2>
                <div className="flex flex-col gap-1">
                  <Droppable droppableId="DoneList">
                    {(provided) => (
                      <div
                        className="flex flex-col gap-1"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {doneList?.map((task, index) => (
                          <Draggable
                            key={task?.id}
                            draggableId={task?.id?.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex justify-between cursor-pointer"
                              >
                                <div className="bg-gray-200 p-5 w-[100%] m-2 rounded-lg">
                                  <p className="text-black">{task?.name}</p>
                                  <p className="text-gray-400">
                                    {task?.description}
                                  </p>
                                  <p className="text-gray-600">
                                    Deadline:{task?.time}, {task?.date}
                                  </p>
                                  <div>
                                    <div className="flex gap-2 items-center">
                                      <div>
                                        <span className="text-black">
                                          Assigned:
                                        </span>
                                      </div>
                                      <div className="flex gap-3 flex-wrap py-3">
                                        {task?.assigned?.map((user) => (
                                          <>
                                            <span className="text-black">
                                              {user?.name}
                                            </span>
                                          </>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <button
                                        className="bg-red-500 text-white px-2 rounded-lg cursor-pointer float-right"
                                        onClick={() => {
                                          handleTaskDelete(task.id);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Details;
