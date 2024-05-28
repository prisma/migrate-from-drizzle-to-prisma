"use server";

import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { prisma } from "@/db/prisma";
import { todo } from "@/db/schema";

export const getData = async () => {
  const todos = await prisma.todo.findMany({
    orderBy: { id: "asc" },
  });
  return todos;
};

export const addTodo = async (id: number, text: string) => {
  await prisma.todo.create({
    data: { id, text },
  })
  revalidatePath("/");
};

export const deleteTodo = async (id: number) => {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
};

export const toggleTodo = async (id: number) => {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (todo) {
    await prisma.todo.update({
      where: { id: todo.id },
      data: { done: !todo.done },
    })
    revalidatePath("/");
  }
};

export const editTodo = async (id: number, text: string) => {
  await prisma.todo.update({
    where: { id },
    data: { text },
  })
  revalidatePath("/");
};