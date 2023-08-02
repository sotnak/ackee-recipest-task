import { knex } from 'knex'

export interface Recipe {
    id: number
    name: string
    mainIngredient: string
    publishTime?: Date
    averageRating: number
}

async function getClient(){
    return knex(
        { client: 'pg',
            connection: {
                host: 'localhost',
                user: 'recipest_docker',
                password: 'recipest_docker',
                port: 5433
            } })
}

export async function getRecipes(): Promise<Recipe[]>{
    const client = await getClient()

    const recipes: Recipe[] = await client
        .with('reciep_rating',
            client.select('reciep_id', client.raw('AVG(rating_value)::numeric(4,2) as average_rating'))
                .from('reviews')
                .groupBy('reciep_id')
                .having(client.raw('AVG(rating_value)'), '>', 8)
        )
        .select('id', 'name', 'main_ingredient as mainIngredient', 'publish_time as publishTime', 'average_rating as averageRating')
        .from("reciep_rating")
        .join('recieps', 'recieps.id', '=', 'reciep_rating.reciep_id')
        .orderBy('publish_time', 'desc', 'last')
        .limit(20)

    await client.destroy();

    return recipes;
}


