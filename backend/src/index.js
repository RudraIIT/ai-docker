import express from 'express';
import bodyParser from 'body-parser';
import { HfInference } from "@huggingface/inference"
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const client = new HfInference(process.env.HF_KEY);

function parseStructure(structure, parentPath = "") {
    const parsed = {};

    structure.forEach(node => {
        const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

        if (node.type === "folder") {
            parsed[currentPath] = parseStructure(node.children || [], currentPath);
        } else {
            parsed[currentPath] = null;
        }
    });

    return parsed;
}

app.post('/docker-generate', async(req, res) => {
    try {
        const { structure, language } = req.body;

        const projectStructure = JSON.stringify(parseStructure(structure),null,2);
        
        const response = await client.chatCompletion({
            model: "google/gemma-2-27b-it",
            messages: [
                {
                  role: "user",
                  content: `Generate a dockerfile for a ${language} project with the following structure: ${projectStructure} just give me the dockerfile without explanation`
                }
            ],
            provider: "hf-inference",
            max_tokens: 5000,
        });

        res.json({content: response.choices[0].message.content});
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
}
);
