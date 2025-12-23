import { UserService } from "../services/userService.js";

export class UserController {
  static async Register(req, res) {
    try {
      const registerBody = req.body;
      const camposPermitidos = ["nome", "email", "senha"];
      const camposRecebidos = Object.keys(registerBody);

      const campoInvalido = camposRecebidos.some(
        (campo) => !camposPermitidos.includes(campo)
      );

      const campoFaltando = camposPermitidos.some(
        (campo) => !camposRecebidos.includes(campo)
      );

      if (campoInvalido || campoFaltando) {
        return res.status(400).json({ error: "Campos inválidos" });
      }

      await UserService.Register(
        registerBody.nome,
        registerBody.email,
        registerBody.senha
      );

      return res.status(201).json({ ok: "Usuário criado com sucesso" });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Erro ao criar usuário",
        error: err.message,
      });
    }
  }

  static async Login(req, res) {
    try {
      const loginBody = req.body;
      const camposPermitidos = ["email", "senha"];
      const camposRecebidos = Object.keys(loginBody);

      const campoInvalido = camposRecebidos.some(
        (campo) => !camposPermitidos.includes(campo)
      );

      const campoFaltando = camposPermitidos.some(
        (campo) => !camposRecebidos.includes(campo)
      );

      if (campoInvalido || campoFaltando) {
        return res.status(400).json({ error: "Campos inválidos" });
      }
      const token = await UserService.Login(loginBody.email, loginBody.senha);

      if (token) {
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000,
          sameSite: "strict",
          path: "/",
        });

        // Retorna confirmação de login bem-sucedido
        return res.status(200).json({
          success: true,
          message: "Login bem-sucedido",
        });
      } else {
        throw new Error("Jwt não criado");
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: err.message, message: "Erro ao criar usuário" });
    }
  }
}
