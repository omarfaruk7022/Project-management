"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import projectData from "../../../data/projects.json";
import ProjectCard from "../Components/ProjectCard";
import LayoutWrapper from "../Components/Layout";
import { Button, Modal } from "antd";
import NewStore from "../store/NewStore";

const Page = () => {
  console.log(projectData);
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
      console.log(project);
      fetch("https://api.islamicposhak.com/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          refetch();
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

  console.log(projects);
  const isLoggedIn = NewStore((state) => state.isLoggedIn);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Projects</h1>
          <div className="px-5 md:px-20 lg:px-52">
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
          <div className="flex justify-center gap-5 flex-wrap">
            {projects?.map((project) => (
              <ProjectCard
                key={project?.id}
                project={project}
                refetch={refetch}
              />
            ))}
          </div>{" "}
        </div>
      ) : (
        "You are not logged in"
      )}
    </div>
  );
};

export default Page;
