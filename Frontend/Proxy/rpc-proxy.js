import express from 'express';
import cors from 'cors';
import xmlrpc from 'xmlrpc';

// express server
const app = express();
const PORT = 5050;
app.use(cors());
app.use(express.json());

// rpc connection
const client = xmlrpc.createClient({host:'localhost',port: 8000, path: "/"});

// api
app.post('/api/IMS', (req, res) => {
	let method = req.body.meth;
	switch(method) {
		case 'products_read':
			client.methodCall(method, [], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'suppliers_read':
			client.methodCall(method, [], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'categories_read':
			client.methodCall(method, [], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'images_read':
			client.methodCall(method, [], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'product_create':
			client.methodCall("product_create", [
				req.body.name, 
				req.body.description, 
				req.body.quantity, 
				req.body.price
			], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'product_read':
			client.methodCall("product_read", [req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'product_delete':
			client.methodCall("product_delete", [req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'product_update':
			client.methodCall("product_update", [
				req.body.p_id,
				req.body.name, 
				req.body.description, 
				req.body.quantity, 
				req.body.price
			], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplier_create':
			client.methodCall("supplier_create", [req.body.name, req.body.contact], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplier_read':
			client.methodCall("supplier_read", [req.body.s_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplier_delete':
			client.methodCall("supplier_delete", [req.body.s_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplier_update':
			client.methodCall(method, [req.body.s_id, req.body.name, req.body.contact], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'category_create':
			client.methodCall(method, [req.body.name, req.body.description], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'category_read':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'category_delete':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'category_update':
			client.methodCall(method, [req.body.c_id, req.body.name, req.body.description], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'image_create':
			client.methodCall(method, [req.body.p_id, req.body.url], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'image_read':
			client.methodCall(method, [req.body.i_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'image_delete':
			client.methodCall(method, [req.body.i_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'image_update':
			client.methodCall(method, [req.body.i_id, req.body.p_id, req.body.url], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplierProducts_create':
			client.methodCall(method, [req.body.s_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplierProducts_delete':
			client.methodCall(method, [req.body.s_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'supplierProducts_read':
			client.methodCall(method, [req.body.s_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'categoryProducts_create':
			client.methodCall(method, [req.body.c_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'categoryProducts_delete':
			client.methodCall(method, [req.body.c_id, req.body.p_id], (err, val) => {
				if (err) return err;
				return val;
			});
		case 'categoryProducts_read':
			client.methodCall(method, [req.body.c_id], (err, val) => {
				if (err) return err;
				return val;
			});
		default:
	}
});

app.listen(PORT, () => {
   console.log(`Proxy is running on port ${PORT}`);
});