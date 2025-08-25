import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'jwt_secret_key';

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/Images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});
const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

app.use('/public/Images', express.static('public/Images'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

  db.query(sql, [username, email, hashedPassword], (err) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Email already in use or DB error' });
    }
    res.status(200).json({ message: 'Signup successful' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  });
});

app.get('/api/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/admin-login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error during admin login:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      console.log('Admin email not found');
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      console.log('Wrong admin password');
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ role: 'admin', email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
    console.log(`Admin login successful: ${admin.email}`);
    return res.status(200).json({ message: 'Admin login successful', token });
  });
}); 

app.get('/api/admin-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'admin') {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ message: 'Forbidden - not admin' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/admin-profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - not admin' });
    }

    const email = decoded.email;
    const sql = 'SELECT id, username, email, image_path FROM admins WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ message: 'Database error or admin not found' });
      }
      res.status(200).json(results[0]);
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.put('/api/admin-profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - not admin' });
    }

    const { username, email } = req.body;
    const currentEmail = decoded.email;

    if (!username || !email) {
      return res.status(400).json({ message: 'Missing username or email' });
    }

    const sql = 'UPDATE admins SET username = ?, email = ? WHERE email = ?';
    db.query(sql, [username, email, currentEmail], (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const newToken = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({
        message: 'Profile updated successfully',
        token: newToken
      });
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.put('/api/admin-change-password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Missing password fields' });

    db.query('SELECT password FROM admins WHERE email = ?', [decoded.email], async (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ message: 'Admin not found' });

      const valid = await bcrypt.compare(oldPassword, results[0].password);
      if (!valid) return res.status(401).json({ message: 'Old password incorrect' });

      const hashedNew = await bcrypt.hash(newPassword, 10);
      db.query('UPDATE admins SET password = ? WHERE email = ?', [hashedNew, decoded.email], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to update password' });
        res.status(200).json({ message: 'Password changed successfully' });
      });
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.get('/api/users', (req, res) => {
  db.query('SELECT id, username, email FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json(results);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Missing username or email' });
  }

  db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json({ message: 'User updated successfully' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});  

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.status(200).json(results);
  });
});

app.post('/api/categories', upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!name || !description || !file) {
    return res.status(400).json({ message: 'Missing name, description, or image' });
  }

  const imagePath = `public/Images/${file.filename}`;

  const sql = 'INSERT INTO categories (name, image, description) VALUES (?, ?, ?)';
  db.query(sql, [name, imagePath, description], (err) => {
    if (err) {
      console.error('Insert category error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'Category added' });
  });
});

app.put('/api/categories/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file ? `public/Images/${req.file.filename}` : null;

  db.query('SELECT name FROM categories WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'Failed to find category' });
    }

    const oldCategoryName = results[0].name;

    const updateQuery = image
      ? 'UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?'
      : 'UPDATE categories SET name = ?, description = ? WHERE id = ?';

    const values = image
      ? [name, description, image, id]
      : [name, description, id];

    db.query(updateQuery, values, (err) => {
      if (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      db.query(
        'UPDATE products SET category = ? WHERE category = ?',
        [name, oldCategoryName],
        (err) => {
          if (err) {
            console.error('Error updating products category:', err);
            return res.status(500).json({ message: 'Failed to update products with new category name' });
          }

          res.status(200).json({ message: 'Category and related products updated successfully' });
        }
      );
    });
  });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  });
});


app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, category } = req.body;
  const file = req.file;
  if (!name || !price || !category || !file) {
    return res.status(400).json({ message: 'Missing fields or image' });
  }
  const imgSrc = `public/Images/${file.filename}`;
  db.query(
    'INSERT INTO products (name, price, imgSrc, category) VALUES (?, ?, ?, ?)',
    [name, price, imgSrc, category],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      db.query(
        'UPDATE categories SET product_count = product_count + 1 WHERE name = ?',
        [category],
        (updateErr) => {
          if (updateErr) console.error('Failed to update product count:', updateErr);
        }
      );

      res.status(201).json({ message: 'Product created', productId: result.insertId });
    }
  );
});

app.get('/api/products/:category', (req, res) => {
  const { category } = req.params;
  db.query(
    'SELECT * FROM products WHERE category = ?',
    [category],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(200).json(results);
    }
  );
});

app.put('/api/update/counts', (req, res) => {
  const updateSQL = `
    UPDATE categories c
    SET c.product_count = (
      SELECT COUNT(*) FROM products p WHERE p.category = c.name)`;

  db.query(updateSQL, (err) => {
    if (err) {
      console.error('Failed to update product counts:', err);
      return res.status(500).json({ message: 'Failed to update product counts' });
    }
    res.status(200).json({ message: 'Product counts updated successfully' });
  });
});

app.post('/api/place-order', (req, res) => {
  const { userId, product } = req.body;

  if (!userId || !product || !product.name || !product.price || !product.imgSrc) {
    return res.status(400).json({ message: 'User ID and complete product info are required' });
  }

  const sql = 'INSERT INTO orders (user_id, product_name, product_price, product_image) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, product.name, product.price, product.imgSrc], (err) => {
    if (err) {
      console.error('Order placement error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});

app.post('/api/orders', (req, res) => {
  const { userId, product } = req.body;

  if (!userId || !product || !product.name || !product.price || !product.imgSrc) {
    return res.status(400).json({ message: 'User ID and complete product info are required' });
  }

  const sql = 'INSERT INTO orders (user_id, product_name, product_price, product_image) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, product.name, product.price, product.imgSrc], (err) => {
    if (err) {
      console.error('Order placement error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Order placed successfully' });
  });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

app.delete('/api/orders/:id', authenticateToken, (req, res) => {
  const orderId = req.params.id;
  db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Order deleted successfully' });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT category FROM products WHERE id = ?', [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ message: 'Failed to fetch product category', error: err });
    }

    const category = result[0].category;

    db.query('DELETE FROM products WHERE id = ?', [id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({ message: 'Database error', error: deleteErr });
      }

      db.query(
        'UPDATE categories SET product_count = product_count - 1 WHERE name = ? AND product_count > 0',
        [category],
        (updateErr) => {
          if (updateErr) console.error('Failed to decrement product count:', updateErr);
        }
      );
      res.status(200).json({ message: 'Product deleted' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
