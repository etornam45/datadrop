import { Router } from "express";
import { prisma } from "../utils";

const projectRouter = Router();

projectRouter.get("/", async (req, res) => {
  const userId = req.headers.JWTuserId as string;
  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
    });
    console.log(projects);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

projectRouter.get("/project:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

projectRouter.post("/create", async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const project = await prisma.project.create({
      data: {
        name: name,
        description: description,
        ownerId: userId,
        tables: "",
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

projectRouter.put("/update:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const project = prisma.project.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: description,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

projectRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const project = await prisma.project.delete({
      where: {
        id: id,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error });
  }
});

export default projectRouter;