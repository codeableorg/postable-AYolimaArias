import { query } from "../db";
import { User, UpdateUserParams } from "../models/user";

//GET/me:
export async function getUser(id: number): Promise<User> {
  const result = await query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
}

//PATCH/me:
export async function editUser({
  id,
  fieldsToUpdate,
}: UpdateUserParams): Promise<User> {
  if (!id || Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }
  const allowedFields = ["email", "firstname", "lastname"]; // Lista de campos permitidos para actualizar
  const validFieldsToUpdate = Object.keys(fieldsToUpdate).filter((field) =>
    allowedFields.includes(field)
  );
  const setClauses = validFieldsToUpdate.map(
    (field, index) => `${field} = $${index + 1}`
  );
  const updateQuery = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${
    validFieldsToUpdate.length + 1
  } RETURNING *`;

  const params = [
    ...validFieldsToUpdate.map((field) => fieldsToUpdate[field]),
    id,
  ];
  const result = await query(updateQuery, params);

  return result.rows[0]; // Devuelve el usuario actualizado
}
