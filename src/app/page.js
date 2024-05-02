"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Button, Modal } from "antd";
import ProjectCard from "./Components/ProjectCard";
import NewStore from "./store/NewStore";
import { toast } from "react-toastify";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState();
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddProject = (e) => {
    e.preventDefault();

    const name = e.target.projectName.value;
    const description = e.target.description.value;
    const time = e.target.time.value;
    const date = e.target.date.value;

    if (name === "" || description === "" || time === "" || date === "") {
      return alert("Please fill all the fields");
    } else {
      const project = {
        name,
        description,
        time,
        date,
      };
      fetch("https://api.islamicposhak.com/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
        .then((res) => res.json())
        .then((data) => {
          refetch();
          toast.success("Successfully project added");
          e.target.reset();
          setIsModalOpen(false);
        });
    }
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch("https://api.islamicposhak.com/api/projects").then((res) =>
        res.json()
      ),
  });

  useEffect(() => {
    if (data) {
      setProjects(data?.data);
    }
  }, [data]);

  const isLoggedIn = NewStore((state) => state.isLoggedIn);

  return (
    <div>
      <div>
        <div className="px-5 md:px-20 lg:px-52 py-2">
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add project
          </Button>
          <Modal
            title="Add Project"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="flex flex-col gap-2">
              <form
                onSubmit={handleAddProject}
                className="flex  flex-wrap gap-2"
              >
                <input
                  name="projectName"
                  type="text"
                  placeholder="Project name"
                  className="p-2 border-2 rounded-lg"
                />
                <input
                  name="description"
                  type="text"
                  placeholder="Project description"
                  className="p-2 border-2 rounded-lg"
                />

                <input
                  name="time"
                  type="time"
                  placeholder="Project time"
                  className="p-2 border-2 rounded-lg"
                />
                <input
                  name="date"
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
        </div>
        <div className="flex gap-5 flex-wrap px-5 md:px-20 lg:px-52">
          {projects?.map((project) => (
            <ProjectCard
              key={project?.id}
              project={project}
              refetch={refetch}
            />
          ))}
        </div>{" "}
      </div>
    </div>
  );
};

export default Page;
