import { Client } from 'pg'

const passwordsToTry = ['postgres', 'password', '123456', 'admin', '']
let connectedClient = null
let validPassword = null

async function createDatabase() {
  for (const pwd of passwordsToTry) {
    const client = new Client({
      user: 'postgres',
      password: pwd,
      host: 'localhost',
      port: 5432,
      database: 'postgres'
    })
    
    try {
      await client.connect()
      console.log(`✅ Conectado con la contraseña: '${pwd}'`)
      connectedClient = client
      validPassword = pwd
      break
    } catch (err) {
      // Intenta con el próximo
    }
  }

  if (!connectedClient) {
    console.error('❌ No se pudo conectar a PostgreSQL con las contraseñas comunes.')
    process.exit(1)
  }

  try {
    const res = await connectedClient.query("SELECT 1 FROM pg_database WHERE datname='colombia_2026'")
    if (res.rowCount === 0) {
      await connectedClient.query('CREATE DATABASE colombia_2026')
      console.log('✅ Base de datos colombia_2026 creada.')
    } else {
      console.log('ℹ️ La base de datos colombia_2026 ya existe.')
    }
    
    console.log(`\nURL de conexión: postgresql://postgres:${validPassword || ''}@localhost:5432/colombia_2026`)
  } catch (err) {
    console.error('Error al crear DB:', err.message)
  } finally {
    await connectedClient.end()
  }
}

createDatabase()
