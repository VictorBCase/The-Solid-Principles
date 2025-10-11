import express from 'express';
import cors from 'cors';
import xmlrpc from 'xmlrpc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express server
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// rpc connection
const client = xmlrpc.createClient({host:'middleware', port: 8000, path: "/"});

const frontendBuildPath = path.join(__dirname, 'frontend-build');
app.use(express.static(frontendBuildPath));

// api
app.post('/api/IMS', (req, res) => {
	
	// rpc requests will go here
	client.methodCall("add", [1, 2], (error, value) => {
		if (error) console.log("error");
		else console.log(value);
	});
});

app.use((req, res) => {
	res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
   console.log(`Proxy is running on port ${PORT}`);
});