// Get these from firebase after making this a public integration
var key = "secret_TErSOxpHrgxZUECA42JtSmf8oWxCGI789CSycvu3ZIA";
var databaseId = "c5034eb5e4da4562aea044afa8c47238";

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5000;
app.listen(PORT, console.log(`Server started at ${PORT}`));

app.get('/database', async (req, res) => {
    const data = await getDatabase();

    // Ignore CORS restrictions
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    // Set data
    if (data)
        res.status(200).json(data);

    // Error
    else
        res.status(418).send({ message: "Something went wrong." });
});

app.get('/tasks', async (req, res) => {
    const data = await getTasks();

    // Ignore CORS restrictions
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    // Send data
    if (data)
        res.status(200).json(data);

    // Error
    else
        res.status(418).send({ message: "Something went wrong." });
});

app.post('/tasks', async (req, res) => {
    const { name, course, due } = req.body;

    if (!name || !course || !due)
        res.status(400).send({ message: "Invalid request body." });
    else {
        var out = {};
        out.parent.database_id = databaseId;
        out.properties.Name.title[0].text.content = name;
        out.properties.Course.select.name = course;
        out.properties.Deadline.date.start = date;

        var options = {
            method: 'POST',
            headers: {
                'Notion-Version': '2022-06-28',
                'Authorization': key
            }
        };

        await fetch(`https://api.notion.com/v1/pages`, options)
            .then((response) => response.json())
            .then((response) => {
                if (response.status == 200)
                    res.status(200).send({ message: "New page added." });
                else
                    res.status(418).send({ message: "Something went wrong." });
            }).catch(e => console.error("Error: ", e));
    }
});

async function getDatabase() {
    // HTTPS request options
    var options = {
        method: 'GET',
        headers: {
            'Notion-Version': '2022-06-28',
            'Authorization': key
        },
        body: {
            page_size: 100
        }
    };

    var data;

    // Execute request to Notion API
    await fetch(`https://api.notion.com/v1/databases/${databaseId}`, options)
        .then(res => res.json())
        .then(res => data = res)
        .catch(e => console.error("Error: ", e));
}

async function getTasks() {
    // HTTPS request options
    var options = {
        method: 'POST', // I don't know why it's a POST request either
        headers: {
            'Notion-Version': '2022-06-28',
            'Authorization': key
        },
        body: {
            page_size: 100
        }
    };

    var data;

    // Execute request to Notion API
    await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, options)
        .then(res => res.json())
        .then(res => data = res)
        .catch(e => console.error("Error: ", e));

    return data;
}