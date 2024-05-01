"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import projectsData from "../../../../data/projects.json";
import { Avatar, Tooltip } from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { resetServerContext } from "react-beautiful-dnd";
const Details = () => {
  const { id } = useParams();

  const filteredProject = projectsData.find((project) => project.id == id);

  const todo = filteredProject?.tasks?.filter((task) => task.status === "todo");

  const [inProgressList, setInProgressList] = useState([]);
  const [todoList, setTodoList] = useState(todo);
  const [doneList, setDoneList] = useState([]);
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

    // const task = filteredProject?.tasks.find(
    //   (task) => task.id.toString() === draggableId
    // );
    // const updatedTask = {
    //   ...task,
    //   status: destination.droppableId,
    // };
    // setInProgressList([...inProgressList, updatedTask]);

    let add,
      todos = todo,
      inProgress = inProgressList,
      dones = doneList;

    // if (source.droppableId === "TodosList") {
    //   add = todo[source.index];
    //   add = todos.splice(source.index, 1);
    // } else {
    //   add = inProgress[source.index];
    //   add = inProgress.splice(source.index, 1);
    // }

    // if (destination.droppableId === "TodosList") {
    //   todos.splice(destination.index, 0, add[0]);
    // } else {
    //   inProgress.splice(destination.index, 0, add[0]);
    // }

    if (source.droppableId === "TodosList") {
      add = todos[source.index];
      add = todos.splice(source.index, 1);
    }
    if (source.droppableId === "InProgressList") {
      add = inProgress[source.index];
      add = inProgress.splice(source.index, 1);
    }
    if (source.droppableId === "DoneList") {
      add = dones[source.index];
      add = dones.splice(source.index, 1);
    }

    if (destination.droppableId === "TodosList") {
      todos.splice(destination.index, 0, add[0]);
    }
    if (destination.droppableId === "InProgressList") {
      inProgress.splice(destination.index, 0, add[0]);
    }
    if (destination.droppableId === "DoneList") {
      dones?.splice(destination.index, 0, add[0]);
    }

    setInProgressList(inProgress);
    setTodoList(todos);
    setDoneList(dones);
  };
  resetServerContext();
  return (
    <div className="px-52 ">
      <div className="p-5 text-center">
        <h2 className="text-xl text-black   font-bold">
          {filteredProject?.name}
        </h2>
        <p className=" text-black">
          <span className="font-bold"></span> {filteredProject?.description}
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3  ">
          <div className=" border-2 h-96">
            <h2 className="bg-gray-400 text-center py-5">To do</h2>
            <Droppable droppableId="TodosList">
              {(provided) => (
                <div
                  className="flex flex-col gap-1"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todoList?.map((task, index) => (
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
                          <div className="bg-gray-200 p-5 w-[100%] m-2">
                            <p className="text-black">{task?.name}</p>
                            <p className="text-gray-400">{task?.description}</p>
                            <div>
                              <span className="text-black">Assigned:</span>
                              {task?.assigned?.map((user) => (
                                <h2 className="text-black" key={user?.id}>
                                  {user.name}
                                </h2>
                              ))}
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
          <div className=" border-2 h-96">
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
                          <div className="bg-gray-200 p-5 w-[100%] m-2">
                            <p className="text-black">{task?.name}</p>
                            <p className="text-gray-400">{task?.description}</p>
                            <div>
                              <span className="text-black">Assigned:</span>
                              {task?.assigned?.map((user) => (
                                <h2 className="text-black" key={user?.id}>
                                  {user.name}
                                </h2>
                              ))}
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
          <div className=" border-2 h-96">
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
                      <div
                        key={task?.id}
                        className="flex justify-between cursor-pointer"
                      >
                        <div className="bg-gray-200 p-5 w-[100%] m-2">
                          <p className="text-black">{task?.name}</p>
                          <p className="text-gray-400">{task?.description}</p>
                          <div>
                            <span className="text-black">Assigned:</span>
                            {task?.assigned?.map((user) => (
                              <h2 className="text-black" key={user?.id}>
                                {user.name}
                              </h2>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Details;
