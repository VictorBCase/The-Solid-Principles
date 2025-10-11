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
app.use(express.json());
app.use(cors());

// rpc connection
const client = xmlrpc.createClient({host:'middleware', port: 8000, path: "/"});

const frontendBuildPath = path.join(__dirname, 'frontend-build');
app.use(express.static(frontendBuildPath));

// api
app.post('/api/IMS', (req, res) => {
	let method = req.body.meth;
	switch(method) {
		case 'products_read':
			client.methodCall(method, [], (err, val) => {
				if (err) res.status(400).json({ error: 'Failed to read products' });
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		case 'suppliers_read':
			client.methodCall(method, [], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		case 'categories_read':
			client.methodCall(method, [], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		case 'images_read':
			client.methodCall(method, [], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		case 'product_create':
			client.methodCall("product_create", [
				req.body.name, 
				req.body.description, 
				req.body.quantity, 
				req.body.price
			], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({product: val});
				}
			});
			break;
		case 'product_read':
			client.methodCall("product_read", [req.body.p_id], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({product: val});
				}
			});
			break;
		case 'product_delete':
			client.methodCall("product_delete", [req.body.p_id], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({product: val});
				}
			});
			break;
		case 'product_update':
			client.methodCall("product_update", [
				req.body.p_id,
				req.body.name, 
				req.body.description, 
				req.body.quantity, 
				req.body.price
			], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({product: val});
				}
			});
			break;
		case 'supplier_create':
			client.methodCall("supplier_create", [req.body.name, req.body.contact], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({product: val});
				}
			});
			break;
		case 'supplier_read':
			client.methodCall("supplier_read", [req.body.s_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'supplier_delete':
			client.methodCall("supplier_delete", [req.body.s_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'supplier_update':
			client.methodCall(method, [req.body.s_id, req.body.name, req.body.contact], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'category_create':
			client.methodCall(method, [req.body.name, req.body.description], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'category_read':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'category_delete':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'category_update':
			client.methodCall(method, [req.body.c_id, req.body.name, req.body.description], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'image_create':
			client.methodCall(method, [req.body.p_id, req.body.url], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'image_read':
			client.methodCall(method, [req.body.i_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'image_delete':
			client.methodCall(method, [req.body.i_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'image_update':
			client.methodCall(method, [req.body.i_id, req.body.p_id, req.body.url], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'supplierProducts_create':
			client.methodCall(method, [req.body.s_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'supplierProducts_delete':
			client.methodCall(method, [req.body.s_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'supplierProducts_read':
			client.methodCall(method, [req.body.s_id], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		case 'categoryProducts_create':
			client.methodCall(method, [req.body.c_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'categoryProducts_delete':
			client.methodCall(method, [req.body.c_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
			break;
		case 'categoryProducts_read':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) res.status(400);
				else {
					res.status(200).json({list: val});
				}
			});
			break;
		default:
			res.status(400).json({ error: `Method not found: ${method}` });
            break;
	}
});

app.use((req, res) => {
	res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
   console.log(`Proxy is running on port ${PORT}`);
});