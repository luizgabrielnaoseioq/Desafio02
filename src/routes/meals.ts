import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";

interface MeslsProps {
  id: string,
  name: string,
  inside_diet: boolean,
  user_id: string
}

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const meals = await knex("meals").select();

    return { meals };
  });

  app.post("/", async (request, response) => {

    const { id, name, inside_diet, user_id} = request.body as MeslsProps
    const mealsCreate = await knex('meals').insert({
      id: randomUUID(),
      name,
      inside_diet,
      user_id
    });

    return response.code(200).send("Meal create success")
  })
}
