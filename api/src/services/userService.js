import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  static async Register(nome, email, senha) {
    const users = await UserModel.List(email);

    if (users.length > 0) {
      throw new Error("Usuário existente");
    }

    const senha_hash = await bcrypt.hash(String(senha), 10);

    const newUser = UserModel.Create(nome, email, senha_hash);

    return newUser;
  }

  static async Login(email, senha) {
    const users = await UserModel.List(email);
    if (users.length === 0) {
      throw new Error("Usuário inexistente. Por favor cadastre-se");
    } else if (users.email != email) {
      throw new Error("Credênciais Inválidas");
    }

    if (!senha) {
      throw new Error("Senha não fornecida");
    }

    if (!users.senha_hash) {
      throw new Error("Nenhuma senha salva");
    }

    const isValid = bcrypt.compare(String(senha), users.senha_hash);

    if (!isValid) {
      throw new Error("Credênciais Inválidas");
    }

    const token = jwt.sign(
      {
        id: users.id,
        email: users.email,
        role: users.role ? users.role : "user",
      },
      process.env.JWT_SECRET
    );

    return token;
  }
}
