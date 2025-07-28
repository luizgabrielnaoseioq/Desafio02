import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string;
      name: string;
      description: string;
      inside_diet: boolean;
      date: string; // ou Date, se estiver usando knex.fn.now()
      user_id: string;
    };
  }
}
