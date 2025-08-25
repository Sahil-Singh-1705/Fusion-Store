import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  port: '8889',
  user: 'root',
  password: 'root',
  database: 'users'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');

  const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createAdminsTableSQL = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_path VARCHAR(500),
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createCategoriesTableSQL = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      image VARCHAR(500),
      description TEXT,
      product_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createProductsTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      imgSrc VARCHAR(500),
      category VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createOrdersTableSQL = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_price DECIMAL(10, 2) NOT NULL,
      product_image VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  connection.query(createUsersTableSQL, (err) => {
    if (err) throw err;
    console.log('Users table ready');

    connection.query(createAdminsTableSQL, (err) => {
      if (err) throw err;
      console.log('Admins table ready');

      connection.query(createCategoriesTableSQL, (err) => {
        if (err) throw err;
        console.log('Categories table ready');

        const insertCategoriesSQL = `
          INSERT IGNORE INTO categories (name, image, description) VALUES 
            ('Smartphones', 'public/Images/image4.jpg', 'Explore the latest smartphones with top-notch features.'),
            ('Laptops', 'public/Images/L5.png', 'Find powerful and portable laptops for work and play.'),
            ('Smartwatch', 'public/Images/S2.webp', 'Stay connected with modern smartwatches.'),
            ('Earbuds', 'public/Images/B7.webp', 'Immerse in sound with the latest earbuds.'),
            ('Cameras', 'public/Images/C2.png', 'Capture moments with high-quality cameras.'),
            ('Smart-TVs', 'public/Images/T2.png', 'Experience entertainment with smart TVs.')
        `;

        connection.query(insertCategoriesSQL, (err) => {
          if (err) throw err;
          console.log('Categories data inserted (if not already present)');

          connection.query(createProductsTableSQL, (err) => {
            if (err) throw err;
            console.log('Products table ready');

            connection.query(createOrdersTableSQL, (err) => {
              if (err) throw err;
              console.log('Orders table ready');
            });
          });
        });
      });
    });
  });
});

export default connection;
