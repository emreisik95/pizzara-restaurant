type Props = {
  brand: string;
  address: string;
  phone: string;
  instagram: string;
  hours: string;
};
export function Footer({ brand, address, phone, instagram, hours }: Props) {
  return (
    <footer id="contact" className="restaurant-footer">
      <div className="container-wrap">
        <div className="footer-info">
          <div>
            <p className="footer-label">BİZE UĞRA</p>
            <p className="footer-address">{address}</p>
            <a
              className="footer-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${brand} ${address}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Yol tarifi <span aria-hidden>↗</span>
            </a>
          </div>
          <div>
            <p className="footer-label">KAPIMIZ AÇIK</p>
            <p>{hours}</p>
            <a className="footer-link" href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone} <span aria-hidden>↗</span>
            </a>
          </div>
          <div>
            <p className="footer-label">TAKİPTE KAL</p>
            <a
              className="footer-link"
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              {instagram} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
        <a
          href="#hero"
          className="footer-wordmark"
          aria-label="Sayfanın başına dön"
        >
          {brand.split(/\s+/)[0].toLocaleLowerCase("tr")}
        </a>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {brand}
          </span>
          <span>İyi malzeme. Gerçek lezzet.</span>
          <a href="#hero">Başa dön ↑</a>
        </div>
      </div>
    </footer>
  );
}
