import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";

export default class UserModel {
  static async List(email) {
    try {
      return await prisma.usuarios.findUnique({
        where: { email },
      });
    } catch (err) {
      throw err;
    }
  }

  static async Create(nome, email, senhaHash) {
    try {
      return await prisma.usuarios.create({
        data: {
          id: randomUUID(),
          nome,
          email,
          senha_hash: senhaHash,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
