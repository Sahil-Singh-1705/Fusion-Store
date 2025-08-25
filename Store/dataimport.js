import mysql from 'mysql2/promise';

const productData = {
  smartphones: [
    { name: 'Samsung Galaxy S25 Ultra', price: '899', imgSrc: "public/Images/image1.jpg" },
    { name: 'iPhone 16 Pro Max', price: '849', imgSrc: "public/Images/image2.jpg" },
    { name: 'OnePlus 13', price: '749', imgSrc: "public/Images/image3.jpg" },
    { name: 'Google Pixel 9 pro', price: '839', imgSrc: "public/Images/image4.jpg" },
    { name: 'Xiaomi 13 Pro', price: '799', imgSrc: "public/Images/image5.jpg" },
    { name: 'Asus ROG Phone 7', price: '699', imgSrc: "public/Images/image6.jpg" },
    { name: 'IQOO 12 5G', price: '720', imgSrc: "public/Images/image7.jpg" },
    { name: 'Realme GT 7 Pro', price: '710', imgSrc: "public/Images/image8.jpg" },
    { name: 'REDMAGIC 10 Pro', price: '829', imgSrc: "public/Images/image9.jpg" },
    { name: 'Vivo X200 Pro', price: '819', imgSrc: "public/Images/image10.jpg" },
    { name: 'Oppo Find X8 pro', price: '843', imgSrc: "public/Images/image11.jpg" },
    { name: 'Motorola Edge 50 Ultra', price: '679', imgSrc: "public/Images/image12.jpg" },
  ],
  laptops: [
    { name: 'HP Pavilion 15', price: '629', imgSrc: "public/Images/L1.webp" },
    { name: 'Dell Inspiron 14 Plus', price: '699', imgSrc: "public/Images/L2.webp" },
    { name: 'Acer Swift Go 14', price: '599', imgSrc:"public/Images/L3.webp"},
    { name: 'Lenovo ThinkBook 16', price: '574', imgSrc: "public/Images/L4.webp" },
    { name: 'ASUS Zenbook 14', price: '686', imgSrc: "public/Images/L5.png" },
    { name: 'Apple MacBook Pro', price: '729', imgSrc: "public/Images/L6.webp" }
  ],
  earbuds: [
    { name: 'Samsung Galaxy Buds 3', price: '116', imgSrc: "public/Images/B1.webp" },
    { name: 'OnePlus Buds Pro 3', price: '125', imgSrc: "public/Images/B2.png" },
    { name: 'Realme Air 6 Pro', price: '109', imgSrc: "public/Images/B3.webp" },
    { name: 'Apple AirPods 4', price: '129', imgSrc: "public/Images/B4.jpeg" },
    { name: 'Nothing Ear 2', price: '131', imgSrc: "public/Images/B5.jpg" },
    { name: 'PTron Basspods 992', price: '84', imgSrc: "public/Images/B6.jpg" },
    { name: 'Redmi Buds 6 Pro', price: '122', imgSrc: "public/Images/B7.webp" },
    { name: 'Sony WF-LS900N ', price: '95', imgSrc: "public/Images/B8.png" },
    { name: 'SKULLCANDY ECOBUDS', price: '99', imgSrc: "public/Images/B9.webp" }
  ],
  smartwatches: [
    { name: 'Samsung Galaxy Watch6', price: '279', imgSrc: "public/Images/S1.avif" },
    { name: 'Apple Watch SE', price: '229', imgSrc: "public/Images/S2.webp" },
    { name: 'Realme Watch 3 Pro', price: '140', imgSrc: "public/Images/S3.webp" },
    { name: 'Noise ColorFit Pro 6', price: '109', imgSrc: "public/Images/S4.avif" },
    { name: 'Boat Lunar Pro LTE', price: '89', imgSrc: "public/Images/S5.jpg" },
    { name: 'Fire-Boltt Dream', price: '99', imgSrc: "public/Images/S6.webp" }
  ],
  cameras: [
    { name: 'Canon EOS M50 Mark', price: '929', imgSrc: "public/Images/C1.jpeg" },
    { name: 'Sony Alpha 7', price: '926', imgSrc: "public/Images/C2.png" },
    { name: 'Nikon D7500', price: '919', imgSrc: "public/Images/C3.webp" },
    { name: 'Panasonic Lumix DMC-G85 ', price: '924', imgSrc: "public/Images/C4.webp" },
    { name: 'FUJIFILM X-T30', price: '908', imgSrc: "public/Images/C5.jpeg" },
    { name: 'Olympus OM-DE-M10', price: '899', imgSrc: "public/Images/C6.jpg" }
  ],
  smarttvs: [
    { name: 'Sony BRAVIA 3 ', price: '1099', imgSrc: "public/Images/T1.webp" },
    { name: 'Samsung Crystal iSmart', price: '1029', imgSrc: "public/Images/T2.png" },
    { name: 'TCL P71B Pro', price: '1024', imgSrc: "public/Images/T3.webp" },
    { name: 'LG Nanocell TV', price: '1049', imgSrc: "public/Images/T4.avif" },
    { name: 'MI Xiaomi TV', price: '1011', imgSrc: "public/Images/T5.jpg" },
    { name: 'Panasonic 4K Ultra', price: '999', imgSrc: "public/Images/T6.webp" }
  ]
};

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: '8889',
      user: 'root',
      password: 'root',
      database: 'users'
    });

    console.log('Connected to the database.');

    for (const [category, products] of Object.entries(productData)) {
      for (const product of products) {
        try {
          const [result] = await connection.execute(
            `INSERT INTO products (name, price, imgSrc, category) VALUES (?, ?, ?, ?)`,
            [product.name, product.price, product.imgSrc, category]
          );
          console.log(`Inserted ${product.name} into products table with category ${category}.`);
        } catch (err) {
          console.error(`Error inserting ${product.name}:`, err);
        }
      }
    }

    await connection.end();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();
