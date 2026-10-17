const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.qhwourxdytzkzycemhyp:o0xqAiyAwEaiEZ1s@aws-0-us-east-1.pooler.supabase.com:5432/postgres'
});

async function run() {
  console.log('Connexion à Supabase...');
  await client.connect();
  
  console.log('Lecture du fichier SQL...');
  let sql = fs.readFileSync('chay_export_postgresql.sql', 'utf8');
  
  console.log('Suppression de BEGIN/COMMIT pour exécution indépendante...');
  // Enlève BEGIN et COMMIT pour que chaque requête soit autonome
  sql = sql.replace(/^BEGIN;?\s*/mi, '');
  sql = sql.replace(/^COMMIT;?\s*/mi, '');
  
  console.log('Découpage en requêtes individuelles...');
  const queries = sql.split(/;\s*\n/).filter(q => q.trim().length > 0);
  
  console.log(`Exécution de ${queries.length} requêtes (cela peut prendre 3-5 minutes)...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i].trim() + ';';
    try {
      await client.query(query);
      successCount++;
      if (successCount % 20 === 0) {
        console.log(`  Progression: ${successCount} requêtes réussies...`);
      }
    } catch (err) {
      errorCount++;
      if (!err.message.includes('check constraint') && !err.message.includes('violates') && !err.message.includes('already exists')) {
        console.log(`  ⚠️ Requête ${i+1}: ${err.message.substring(0, 120)}`);
      }
    }
  }
  
  console.log(`\n✅ Importation terminée !`);
  console.log(`   ✅ ${successCount} requêtes réussies`);
  console.log(`   ⚠️ ${errorCount} requêtes ignorées`);
  
  await client.end();
}

run().catch(err => {
  console.error('❌ Erreur critique:', err.message);
  client.end();
  process.exit(1);
});