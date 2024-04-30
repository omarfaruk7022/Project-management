"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import projectData from "../../../data/projects.json";
import ProjectCard from "../Components/ProjectCard";

const Page = () => {
  console.log(projectData);
    const [projects, setProjects] = useState();
    
  

  return (
    <div>
      <h1>Projects</h1>

      <div className="flex justify-center gap-5">
        {projectData?.map((project) => (
          <ProjectCard key={project?.id} project={project}   />
        ))}
      </div>
    </div>
  );
};

export default Page;
