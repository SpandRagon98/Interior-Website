import { createProject, getProjectById, getProjectsByUser, updateProjectStatus } from "@/lib/google/sheets";
export const projectRepository = { create: createProject, getById: getProjectById, getByUser: getProjectsByUser, updateStatus: updateProjectStatus };
