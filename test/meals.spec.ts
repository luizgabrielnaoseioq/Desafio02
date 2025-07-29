import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import fastify from "fastify";
import { mealsRoutes } from "../src/routes/meals";
import cookie from "@fastify/cookie";

describe("Meals routes", () => {
  let app: any;

  beforeAll(async () => {
    app = fastify();
    app.register(cookie);
    app.register(mealsRoutes, {
      prefix: "meals",
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new meal", async () => {
    await request(app.server)
      .post("/meals")
      .send({
        name: "Café da manhã",
        description: "Pão integral com ovo",
        inside_diet: true,
      })
      .expect(200);
  });

  it("should be able to list all meals", async () => {
    const createMealResponse = await request(app.server).post("/meals").send({
      name: "Café da manhã",
      description: "Pão integral com ovo",
      inside_diet: true,
    });

    const cookies = createMealResponse.get("Set-Cookie");
    if (!cookies) throw new Error("No cookies received");

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "Café da manhã",
        description: "Pão integral com ovo",
        inside_diet: 1, // SQLite retorna 1 para true
      }),
    ]);
  });

  it("should be able to get a specific meal", async () => {
    const createMealResponse = await request(app.server).post("/meals").send({
      name: "Café da manhã",
      description: "Pão integral com ovo",
      inside_diet: true,
    });

    const cookies = createMealResponse.get("Set-Cookie");
    if (!cookies) throw new Error("No cookies received");

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);

    expect(getMealResponse.body.meals).toEqual(
      expect.objectContaining({
        name: "Café da manhã",
        description: "Pão integral com ovo",
        inside_diet: 1, // SQLite retorna 1 para true
      })
    );
  });

  it("should be able to update a meal", async () => {
    const createMealResponse = await request(app.server).post("/meals").send({
      name: "Café da manhã",
      description: "Pão integral com ovo",
      inside_diet: true,
    });

    const cookies = createMealResponse.get("Set-Cookie");
    if (!cookies) throw new Error("No cookies received");

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .send({
        name: "Café da manhã atualizado",
        description: "Pão integral com ovo e café",
        inside_diet: false,
      })
      .expect(200);
  });

  it("should be able to delete a meal", async () => {
    const createMealResponse = await request(app.server).post("/meals").send({
      name: "Café da manhã",
      description: "Pão integral com ovo",
      inside_diet: true,
    });

    const cookies = createMealResponse.get("Set-Cookie");
    if (!cookies) throw new Error("No cookies received");

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", Array.isArray(cookies) ? cookies[0] : cookies)
      .expect(200);
  });
});
