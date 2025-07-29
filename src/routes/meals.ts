import { FastifyInstance } from "fastify";
import { string, uuid, z, ZodString } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { request } from "node:http";
import id from "zod/v4/locales/id.cjs";
import { log } from "node:console";

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

  app.post("/", async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
      user_id: z.string(),
    });

    const { name, description, inside_diet, user_id } =
      createMealsBodySchema.parse(request.body);

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      inside_diet,
      user_id,
    });

    return reply.status(200).send("Meal create success!");
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as any;

    const updateMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
      user_id: z.string(),
    });

    const { name, description, inside_diet, user_id } =
      updateMealsBodySchema.parse(request.body);

    try {
      const updatedRows = await knex("meals").where("id", id).update({
        name: name,
        description: description,
        inside_diet: inside_diet,
        user_id: user_id,
      });

      if (updatedRows === 0) {
        return reply.status(404).send("Item não encontrado");
      }

      reply.send("Meals updated");
    } catch (error) {
      app.log.error(error);
      reply.status(500).send("Erro ao atualizar a refeição");
    }
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
