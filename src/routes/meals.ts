import { FastifyInstance } from "fastify";
import { string, uuid, z, ZodString } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { request } from "node:http";
import id from "zod/v4/locales/id.cjs";
import { log } from "node:console";
import { checkSessionIdExists } from "../middlewares/check-sessions-id-exists";

interface MeslsProps {
  id: string;
  name: string;
  inside_diet: boolean;
  session_id: string;
}

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method} ${request.url}]`);
    
  })

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const meals = await knex("meals").where("session_id", sessionId).select();

      return { meals };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies;

    const getMealsParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealsParamSchema.parse(request.params);

    const meals = await knex("meals")
      .where({
        session_id: sessionId,
        id: id,
      })
      .first();

    return { meals };
  });

  app.post("/", async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inside_diet: z.boolean(),
    });

    const { name, description, inside_diet} =
      createMealsBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      inside_diet,
      session_id: sessionId,
    });

    return reply.status(200).send("Meal create success!");
  });

  app.put(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const { id } = request.params as any;

      const updateMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        inside_diet: z.boolean(),
      });

      const { name, description, inside_diet } =
        updateMealsBodySchema.parse(request.body);

      try {
        const updatedRows = await knex("meals")
          .where({
            session_id: sessionId,
            id: id,
          })
          .update({
            name: name,
            description: description,
            inside_diet: inside_diet,
          });

        if (updatedRows === 0) {
          return reply.status(404).send("Item não encontrado");
        }

        reply.send("Meals updated");
      } catch (error) {
        app.log.error(error);
        reply.status(500).send("Erro ao atualizar a refeição");
      }
    }
  );

  app.delete("/:id", { preHandler: [checkSessionIdExists], }, async (request, reply) => {
    const { sessionId } = request.cookies
    const deleteMealsParamSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteMealsParamSchema.parse(request.params);

    await knex("meals").where({
      session_id: sessionId,
      id: id,
    }).del();

    return reply.code(200).send("Mels deleted success!");
  });
}
