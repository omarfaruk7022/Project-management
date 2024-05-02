# Project-management

This is Project Management application that allows users to manage tasks, and projects.

Open [https://project-management-alpha.vercel.app/](https://project-management-alpha.vercel.app/) with your browser to see the result.

# Getting started

You can start with login page. provide an email and password to log in.
after that you will be redirected to the projects page and then you'll see all projects listed below.

# Add project page

After login you'll see add project button to add project, after adding a project you can edit or delete the project any time,then click on the project name to see that projects details, and the assigned tasks.projects are adding to a personal API to fetch data with React query.

# Project view page

then you'll see a add task button, after that you'll be see a modal with some inputs, after submitting that the task will added for that project, you can update or delete the task , or you can reassign others team members.
all tasks handled using zustand state management.

# Task assignment

if you assign add a task to the project after coming back to the add project page you'll see the task name on the project's card. after clicking the task name you'll see the task details.after clicking the task detail the page redirect to that project's details page that connected with the task.

# Drag and drop feature

in the project view page you'll see a Todo - In progress - Done table. to drag and drop to change the status of the task. in the todo list you can view , update , delete and reassign a member to the task .

# Search and filter feature

there are a search bar to search with name, status,and assignee. and a filter option to filter with the assignee person's name.
