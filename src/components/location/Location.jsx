import "./Location.scss";

const Location = () => {
  return (
    <section className="location">
      <h2>Nuestra Ubicación</h2>
      <p>
        Visítanos en nuestras oficinas para conocer más sobre nuestros
        productos.
      </p>
      <iframe
        title="Google Maps"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345098796!2d144.9537353153169!3d-37.816279742021014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f4b569%3A0x4d4e49ddcc5d9b4e!2sFederation+Square!5e0!3m2!1sen!2sau!4v1554908763215!5m2!1sen!2sau"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </section>
  );
};

export default Location;
