const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI не установлена в файле .env');
    }

    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`
╔════════════════════════════════════════════╗
║  🗄️  DATABASE CONNECTION                  ║
╠════════════════════════════════════════════╣
║  Status: ✅ Connected                     ║
║  Host: ${connection.connection.host.padEnd(32)}║
║  Port: ${connection.connection.port.toString().padEnd(32)}║
║  Database: ${connection.connection.name.padEnd(30)}║
╚════════════════════════════════════════════╝
    `);

    // Обработчики событий подключения
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Пожалуйста, проверьте:');
    console.error('   1. MongoDB Atlas account и credentials');
    console.error('   2. MONGODB_URI в файле .env');
    console.error('   3. Network access в MongoDB Atlas');
    console.error('   4. Интернет соединение');
    
    // Не завершаем процесс, чтобы видеть ошибку
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  }
};

module.exports = connectDB;
