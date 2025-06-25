import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { Customer } from './types';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, '../data.json');

const readData = (): Customer[] => {
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
};

const writeData = (data: Customer[]) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/business-leads', (req, res) => {
  const customers = readData();
  res.json(customers);
});

app.post('/api/business-leads/batch', (req, res) => {
  const customers = readData();

  const newCustomers = req.body.map(item => ({
    ...item,
    id: Date.now().toString() + Math.random().toString().slice(2, 5),
    createdAt: new Date().toISOString(),
  }));

  const updated = [...customers, ...newCustomers];

  writeData(updated);
  res.status(201).json(newCustomers);
});

app.put('/api/business-leads/:id', (req, res) => {
  let customers = readData();
  const { id } = req.params;
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...req.body, updatedAt: new Date().toISOString() };
    writeData(customers);
    res.json(customers[index]);
  } else {
    res.status(404).json({ message: 'Không tìm thấy khách hàng' });
  }
});

app.delete('/api/business-leads/:id', (req, res) => {
  let customers = readData();
  const { id } = req.params;
  customers = customers.filter(c => c.id !== id);
  writeData(customers);
  res.json({ message: 'Đã xoá thành công' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
