import { configDotenv } from "dotenv";
import { query, pool } from "..";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

interface User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface Post {
  id: number;
  userId: number;
  content: string;
}

const generateFakeUser = (): User => {
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const email = faker.internet.email();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = `${firstName}${lastName}`;
  const role = faker.helpers.arrayElement(["user", "admin"]);
  return {
    id: 0,
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
    role,
  };
};

const generateFakePost = (userId: number): Post => {
  const content: string = faker.lorem.paragraph();
  return { id: 0, userId, content };
};

const insertFakeUsersPosts = async () => {
  try {
    // Generar datos falsos para usuarios
    const numUsers = 10;
    const usersToInsert: User[] = Array.from({ length: numUsers }, () =>
      generateFakeUser()
    );

    // Insertar datos falsos en la tabla de usuarios
    const usersValues = usersToInsert
      .map(
        ({ username, password, email, firstName, lastName, role }) =>
          `('${username}', '${password}', '${email}', '${firstName}', '${lastName}', '${role}')`
      )
      .join(",");
    const usersQueryText = `INSERT INTO users (username, password, email, firstName, lastName, role) VALUES ${usersValues}`;
    await query(usersQueryText);

    // Obtener los IDs de los usuarios insertados
    const { rows: insertedUsers } = (await query("SELECT id FROM users")) as {
      rows: User[];
    };

    // Generar datos falsos para publicaciones
    const postsToInsert: Post[] = [];
    insertedUsers.forEach((user) => {
      const numPostsPerUser = Math.floor(Math.random() * 5) + 1; // Máximo 5 publicaciones por usuario
      for (let i = 0; i < numPostsPerUser; i++) {
        postsToInsert.push(generateFakePost(user.id));
      }
    });

    // Insertar datos falsos en la tabla de publicaciones
    const postsValues = postsToInsert
      .map(({ userId, content }) => `(${userId}, '${content}')`)
      .join(",");
    const postsQueryText = `INSERT INTO posts (userId, content) VALUES ${postsValues}`;
    await query(postsQueryText);

    console.log(
      "Datos falsos de usuarios y publicaciones insertados correctamente."
    );
  } catch (error) {
    console.error("Error al insertar datos falsos:", error);
  } finally {
    pool.end();
  }
};

insertFakeUsersPosts();
