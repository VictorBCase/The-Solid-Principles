import express from 'express';
import cors from 'cors';
import xmlrpc from 'xmlrpc';

// express server
const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());

// rpc connection
const client = xmlrpc.createClient({host:'localhost',port: 8000, path: "/"});

client.methodCall("add", [1, 2], (error, value) => {
	if (error) console.log("error");
	else console.log(value);
});

// api
app.post('/api/IMS', (req, res) => {

});

app.listen(PORT, () => {
   console.log(`Proxy is running on port ${PORT}`);
});