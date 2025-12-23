import { supabase } from "../config/supabase.js";
import path from "path";
import fs from "fs";
import { NewsModel } from "../models/newsModel.js";

export class NewsService {
  static async createNews(parts) {
    const newsData = {
      title: "",
      summary: "",
      author: "",
      body: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      newsType: "",
    };

    let indexImage = 1;

    try {
      for (const part of parts) {
        if (part.file) {
          if (indexImage > 5) continue;

          const ext = path.extname(part.filename || ".jpg");
          const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}${ext}`;

          const buffer = part.buffer || fs.readFileSync(part.path);

          const { error: uploadError } = await supabase.storage
            .from("imagens-noticias")
            .upload(filename, buffer, {
              contentType: part.mimetype,
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: publicData } = supabase.storage
            .from("imagens-noticias")
            .getPublicUrl(filename);

          newsData[`image${indexImage}`] = publicData.publicUrl;
          indexImage++;
        } else if (part.fieldname && part.value !== undefined) {
          newsData[part.fieldname] = part.value;
        }
      }

      await NewsModel.create(newsData);
      return newsData;
    } catch (err) {
      console.error("ERRO REAL NO SERVICE:", err);
      throw err;
    }
  }

  static async listNews(title) {
    try {
      return await NewsModel.listTitle(title);
    } catch (err) {
      throw new Error("Falha ao criar notícia. Tente novamente mais tarde.", {
        cause: err,
      });
    }
  }

  static async updateNews(id, data) {
    try {
      await NewsModel.update(id, data);
    } catch (err) {
      console.error(`Erro ao atualizar notícia com id ${id}:`, err);
      throw new Error(
        "Falha ao editar a notícia. Tente novamente mais tarde.",
        {
          cause: err,
        }
      );
    }
  }

  static async deleteNews(id) {
    try {
      const news = await NewsModel.listId(id);
      console.log(news)
      if (!news || news.length === 0) {
        throw new Error("Notícia não encontrada");
      }

      await NewsModel.delete(id);
      return news;
    } catch (err) {
      console.error("Erro no Service DELETE:", err);
      throw new Error(
        err.message || "Erro ao deletar notícia. Tente novamente."
      );
    }
  }
}
