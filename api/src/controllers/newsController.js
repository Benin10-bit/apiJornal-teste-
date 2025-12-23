import { NewsService } from "../services/newsService.js";

export class NewsController {

  static async create(req, res) {
    try {
      const parts = [];

      for (const key in req.body) {
        parts.push({
          fieldname: key,
          value: req.body[key],
        });
      }

      if (req.files) {
        for (const field in req.files) {
          for (const file of req.files[field]) {
            parts.push({
              file: true,
              filename: file.originalname,
              mimetype: file.mimetype,
              buffer: file.buffer,
              path: file.path,
            });
          }
        }
      }

      const data = await NewsService.createNews(parts);

      return res.status(201).json({
        success: true,
        message: "Notícia criada com sucesso",
        data,
      });

    } catch (err) {
      console.error("ERRO AO CRIAR NOTÍCIA:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
        stack: err.stack,
      });
    }
  }

  static async list(req, res) {
    try {
      const { title } = req.query;
      const list = await NewsService.listNews(title ?? null);

      return res.status(200).json(list);

    } catch (err) {
      console.error("ERRO AO LISTAR NOTÍCIAS:", err);

      return res.status(500).json({
        error: err.message,
        stack: err.stack,
      });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;

      if (req.body === undefined){
        throw new Error("Método de envio de requisição incorreto")
      }

      await NewsService.updateNews(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Notícia atualizada",
      });

    } catch (err) {
      console.error("ERRO AO ATUALIZAR NOTÍCIA:", err);

      return res.status(500).json({
        error: err.message,
        stack: err.stack,
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;

      console.log("id:" + id)

      const deletedNews = await NewsService.deleteNews(id);

      return res.status(200).json({
        success: true,
        message: "Notícia deletada com sucesso",
        data: deletedNews,
      });

    } catch (err) {
      console.error("ERRO AO DELETAR NOTÍCIA:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
        stack: err.stack,
      });
    }
  }
}
