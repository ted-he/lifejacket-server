var key = "secret_TErSOxpHrgxZUECA42JtSmf8oWxCGI789CSycvu3ZIA";
var databaseId = "c5034eb5e4da4562aea044afa8c47238";

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    const data = await getData();
    // console.log(data);

    if (data)
        res.status(200).json(data);
    else
        res.status(418).send({ message: "Unlucky honestly" });
});

const PORT = 5000;
app.listen(PORT, console.log(`Server started at ${PORT}`));

async function getData() {
    var options = {
        method: 'POST',
        headers: {
            'Notion-Version': '2022-06-28',
            'Authorization': key
        },
        body: {
            page_size: 100
        }
    };

    var data;

    console.log(data);

    await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, options)
        .then(res => res.json())
        .then(res => data = res)
        .catch(e => console.error("Error: ", e));

    console.log(data);

    return data;
}