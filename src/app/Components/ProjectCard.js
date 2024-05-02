import React, { useEffect, useState } from "react";

import { Card, Flex, Modal, theme, Typography } from "antd";
import { useRouter } from "next/navigation";
import NewStore from "../store/NewStore";
import Link from "next/link";
import { toast } from "react-toastify";

const { useToken } = theme;
const { Text } = Typography;

export default function ProjectCard({ project, refetch }) {
  const router = useRouter();
  const { token } = useToken();
  const [filteredTaskList, setFilteredTaskList] = useState([]);

  const styles = {
    card: {
      width: "300px",
      boxShadow: "0 8px 24px hsla(210, 8%, 62%, .2)",
      border: "none",
    },
    paragraph: {
      color: token.colorTextSecondary,
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const handleShowOk = () => {
    setIsShowModalOpen(false);
  };

  const handleShowCancel = () => {
    setIsShowModalOpen(false);
  };
  const showTask = (id) => {
    const singleTask = filteredTaskList.find((task) => task.id == id);
    setIsShowModalOpen(true);
  };

  const handleProjectDelete = (id) => {
    fetch(`https://api.islamicposhak.com/api/projects/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully project deleted");
        refetch();
      });
  };

  const showDetail = (id) => {
    router.push("/details/" + id);
  };

  const handleEditProject = (e, id) => {
    e.preventDefault();
    const name = updateData?.name;
    const description = updateData?.description;
    const time = updateData?.time;
    const date = updateData?.date;

    if (name === "" || description === "" || time === "" || date === "") {
      return alert("Please fill all the fields");
    }
    const project = {
      name,
      description,
      time,
      date,
    };
    fetch(`https://api.islamicposhak.com/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully project updated");
        refetch();
        setIsModalOpen(false);
      });
  };

  const tasks = NewStore((state) => state.tasks);

  const filteredTask = tasks.filter((task) => task.projectId === project._id);

  const [updateData, setUpdateData] = useState(null);

  const handleUpdate = (project) => {
    setIsModalOpen(true);
    setUpdateData(project);
  };

  useEffect(() => {
    setFilteredTaskList(filteredTask);
  }, [tasks]);

  return (
    <Flex justify="center">
      <Card className="cursor-pointer" style={styles.card}>
        <Flex vertical gap="middle">
          <Flex vertical gap={token.marginXXS}>
            <h3
              onClick={() => showDetail(project?._id)}
              strong
              className="text-black hover:text-blue-500 transition-all text-lg"
            >
              {project?.name}
            </h3>
            <Text
              onClick={() => showDetail(project?._id)}
              style={styles.paragraph}
            >
              {project?.description}
            </Text>
            <Text
              onClick={() => showDetail(project?._id)}
              style={styles.paragraph}
            >
              {project?.date}
            </Text>
            <Text
              onClick={() => showDetail(project?._id)}
              style={styles.paragraph}
            >
              {project?.time}
            </Text>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-lg cursor-pointer float-right"
                onClick={() => handleUpdate(project)}
              >
                Edit
              </button>
              <Modal
                title="Edit Project"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div className="flex flex-col gap-2">
                  <form
                    onSubmit={(e) => handleEditProject(e, project._id)}
                    className="flex  flex-wrap gap-2"
                  >
                    <input
                      name="projectName"
                      value={updateData?.name}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, name: e.target.value })
                      }
                      type="text"
                      placeholder="Project name"
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
                      placeholder="Project description"
                      className="p-2 border-2 rounded-lg"
                    />

                    <input
                      name="time"
                      value={updateData?.time}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, time: e.target.value })
                      }
                      type="time"
                      placeholder="Project time"
                      className="p-2 border-2 rounded-lg"
                    />
                    <input
                      name="date"
                      value={updateData?.date}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, date: e.target.value })
                      }
                      type="date"
                      placeholder="Project date"
                      className="p-2 border-2 rounded-lg"
                    />

                    <input
                      type="submit"
                      className="bg-green-500 p-2  rounded-lg text-white cursor-pointer"
                    />
                  </form>
                </div>
              </Modal>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-lg cursor-pointer float-right"
                onClick={() => {
                  handleProjectDelete(project._id);
                }}
              >
                Delete
              </button>
            </div>
            <ul className="flex gap-2 cursor-pointer">
              {filteredTaskList?.map((task) => (
                <li
                  className="bg-green-500 text-white px-2 py-1 rounded-xl"
                  key={task.id}
                >
                  <p onClick={() => showTask(task?.id)}>{task.name}</p>
                  <Modal
                    title="Task detail"
                    open={isShowModalOpen}
                    onOk={handleShowOk}
                    onCancel={handleShowCancel}
                  >
                    <div>
                      <Link
                        href={`/details/${task?.projectId}`}
                        className="text-lg"
                      >
                        <p>{task?.name}</p>
                        <p className="text-black text-sm">
                          {task?.description}
                        </p>
                        <p className="text-black text-sm">{task?.time}</p>
                        <p className="text-black text-sm">{task?.date}</p>
                        {task?.assigned?.length > 1 ? (
                          <p className="text-black text-sm">Assigned:</p>
                        ) : (
                          ""
                        )}

                        <ul className="flex gap-2 cursor-pointer text-sm">
                          {task?.assigned?.map((assign) => (
                            <li
                              className="bg-blue-400 text-white px-2 py-1 rounded-xl "
                              key={assign.id}
                            >
                              <p>{assign.name}</p>
                            </li>
                          ))}
                        </ul>
                      </Link>
                    </div>
                  </Modal>
                </li>
              ))}
            </ul>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
