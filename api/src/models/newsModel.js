import { prisma } from "../config/prisma.js";

export class NewsModel {
  // Listar notícias (com pesquisa opcional)
  static async listTitle(search) {
    const noticias = await prisma.noticias.findMany({
      where: search
        ? { title: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { created_at: "desc" }, // ordena por data de criação
    });

    return noticias;
  }

  static async listId(id) {
    const noticias = await prisma.noticias.findUnique({
      where: id ? { id: id } : undefined,
    });

    return noticias;
  }

  // Criar nova notícia
  static async create(news) {
    await prisma.noticias.create({
      data: {
        title: news.title,
        summary: news.summary ?? null,
        body: news.body,
        author: news.author ?? null,
        image1: news.image1 ?? null,
        image2: news.image2 ?? null,
        image3: news.image3 ?? null,
        image4: news.image4 ?? null,
        image5: news.image5 ?? null,
        newstype: news.newsType ?? null,
      },
    });
  }

  // Atualizar notícia
  static async update(id, news) {
    await prisma.noticias.update({
      where: { id },
      data: {
        title: news.title,
        summary: news.summary ?? null,
        body: news.body,
        author: news.author ?? null,
        image1: news.image1 ?? null,
        image2: news.image2 ?? null,
        image3: news.image3 ?? null,
        image4: news.image4 ?? null,
        image5: news.image5 ?? null,
        newstype: news.newsType ?? null,
      },
    });
  }

  // Deletar notícia
  static async delete(id) {
    await prisma.noticias.delete({
      where: { id },
    });
  }
}
