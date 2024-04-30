import React, { useState } from "react";

import { Card, Flex, Modal, theme, Typography } from "antd";
import { useRouter } from "next/navigation";

const { useToken } = theme;
const { Text, Link } = Typography;

export default function ProjectCard({ project }) {
  const { token } = useToken();

  const styles = {
    card: {
      width: "300px",
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
  const [filteredTask, setFilteredTask] = useState();
  const showTask = (id) => {
    const singleTask = project?.tasks.find((task) => task.id === id);
    setFilteredTask(singleTask);
    setIsModalOpen(true);
  };

  console.log(filteredTask);

  const router = useRouter();

  const showDetail = (id) => {
    router.push("/details/" + id);
  };
  return (
    <Flex justify="center">
      <Card
        className="cursor-pointer"
        style={styles.card}
        
      >
        <Flex vertical gap="middle">
          {/* <img
            alt="Card image"
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          /> */}
          <Flex vertical gap={token.marginXXS}>
            <Text onClick={() => showDetail(project?.id)} strong>{project?.name}</Text>
            <Text style={styles.paragraph}>{project?.description}</Text>
            <h2>Tasks: </h2>
            <ul className="flex gap-2 cursor-pointer">
              {project?.tasks.map((task) => (
                <li
                  className="bg-green-500 text-white px-2 py-1 rounded-xl"
                  key={task.id}
                >
                  <p onClick={() => showTask(task?.id)}>{task.name}</p>
                </li>
              ))}
            </ul>
            <Modal
              title="Task detail"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>{filteredTask?.name}</p>
              <p>{filteredTask?.description}</p>
              <p>{filteredTask?.date}</p>
              {filteredTask?.assigned?.length > 1 ? <p>Assigned:</p> : ""}

              <ul className="flex gap-2 cursor-pointer">
                {filteredTask?.assigned?.map((assign) => (
                  <li
                    className="bg-blue-400 text-white px-2 py-1 rounded-xl "
                    key={assign.id}
                  >
                    <p>{assign.name}</p>
                  </li>
                ))}
              </ul>
            </Modal>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
