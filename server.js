import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let customers = [
  {
    id: '1',
    name: 'Công ty ABC',
    taxCode: '123456789',
    customerCode: 'KH001',
    phone: '0123456789',
    email: 'abc@company.com',
    status: 'Đã kích hoạt',
    leadStatus: 'Mới',
    createdAt: '2025-06-16',
  },
];
//get lấy dữ liệu
app.get('/api/business-leads', (req, res) => {
  res.json(customers);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

//post tạo mới
app.post('/api/business-leads', (req, res) => {
  const newCustomer = { ...req.body, id: Date.now().toString() };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// PUT cập nhật
app.put('/api/business-leads/:id', (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...req.body };
    res.json(customers[index]);
  } else {
    res.status(404).json({ message: 'Không tìm thấy khách hàng' });
  }
});

// DELETE xoá
app.delete('/api/business-leads/:id', (req, res) => {
  const { id } = req.params;
  customers = customers.filter(c => c.id !== id);
  res.json({ message: 'Đã xoá thành công' });
});
