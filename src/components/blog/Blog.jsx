import "./Blog.scss";

const articles = [
  {
    title: "Importancia del mantenimiento preventivo en equipos médicos",
    date: "25 de marzo de 2025",
    link: "/blog/mantenimiento-preventivo",
  },
  {
    title: "Tendencias en tecnología biomédica para este año",
    date: "10 de abril de 2025",
    link: "/blog/tendencias-biomedicas",
  },
];

const Blog = () => {
  return (
    <section className="blog">
      <h2>Últimas Noticias</h2>
      <div className="blog-container">
        {articles.map((article, index) => (
          <div key={index} className="blog-item">
            <h3>{article.title}</h3>
            <p>{article.date}</p>
            <a href={article.link}>Leer más →</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
