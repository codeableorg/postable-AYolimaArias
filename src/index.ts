import { app } from "./app";
import { pool } from "./db";

const app = express();
const port = 3500  ;

// Manejar cierre de la aplicación
const gracefulShutdown = () => {
    pool.end(() => {
      console.log("\Application ended gracefully");
      process.exit(0);
    });
  };
  
  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);

app.listen(port, () => console.log(`Escuchando al puerto ${port}`));
