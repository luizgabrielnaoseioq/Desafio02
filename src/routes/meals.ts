import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { request } from "node:http";
import id from "zod/v4/locales/id.cjs";

interface MeslsProps {
  id: string;
  name: string;
  inside_diet: boolean;
  user_id: string;
}

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const meals = await knex("meals").select();

    return { meals };
  });

  app.get("/:id", async (request, reply) => {
    const getMealsParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealsParamSchema.parse(request.params);

    const meals = await knex("meals").where("id", id).first();

    return reply
      .header("Content-Type", "application/json")
      .code(200)
      .send(meals);
  });

  app.post("/", async (request, response) => {
    const createTransactionbodySchema = z.object({
      name: z.string(),
      inside_diet: z.boolean(),
      user_id: z.string(),
    });

    const { name, inside_diet, user_id } = createTransactionbodySchema.parse(
      request.body
    );

    await knex("meals").insert({
      id: randomUUID(),
      name,
      inside_diet,
      user_id,
    });

    return response.status(200).send("Meal create success");
  });
}
