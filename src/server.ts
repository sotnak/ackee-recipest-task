import express, { Request, Response } from 'express';
import {getRecipes, Recipe} from "./db";

const app = express();
const port = 3000;

app.get('/api/popular-recipes', async (req: Request, res: Response) => {

    let recipes: Recipe[] = []
    try {
        recipes = await getRecipes()
    } catch (e) {
        // @ts-ignore
        res.status(500).send('DB: ' + e.message)
        console.error(e)
        return;
    }

    res.send(recipes);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});