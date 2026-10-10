import 'dotenv/config';
import mongoose from 'mongoose';

async function run() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('MONGO_URL não definido.');
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  await mongoose.connect(mongoUrl);
  const users = mongoose.connection.collection('users');

  try {
    const general = await users.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'general' } },
    );
    console.log(`Usuários atualizados para general: ${general.modifiedCount}`);

    if (adminEmail) {
      const admin = await users.updateOne(
        { email: adminEmail },
        { $set: { role: 'admin' } },
      );

      if (admin.matchedCount === 0) {
        console.warn(`Nenhum usuário encontrado com o e-mail ${adminEmail}.`);
      } else {
        console.log(`Usuário ${adminEmail} promovido a admin.`);
      }
    } else {
      console.log('ADMIN_EMAIL não informado: nenhum usuário promovido a admin.');
    }
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error('Falha na migração de perfis:', error);
  process.exit(1);
});
