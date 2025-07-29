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

  app.get("/:id", async (request) => {
    const getMealsParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealsParamSchema.parse(request.params);

    const meals = await knex("meals").where("id", id).first();

    return { meals };
  });

  app.post("/", async (request, response) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      inside_diet: z.boolean(),
      user_id: z.string(),
    });

    const { name, inside_diet, user_id } = createMealsBodySchema.parse(
      request.body
    );

    await knex("meals").insert({
      id: randomUUID(),
      name,
      inside_diet,
      user_id,
    });

    return response.status(200).send("Meal create success!");
  });

  app.delete("/:id", async (request, reply) => {
    const deleteMealsParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteMealsParamSchema.parse(request.params);

    await knex("meals").where("id", id).del();

    return reply.code(200).send("Mels deleted success!");
  });
}
