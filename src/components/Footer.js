import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="navbar-logo" style={{ marginBottom: '0.5rem' }}>
                            <Image src="/conectacorto.png" alt="CONECTA 2026 Logo" width={200} height={60} style={{ height: '40px', width: 'auto' }} />
                        </div>
                        <p>
                            El evento diseñado para conectar empresas y generar oportunidades de negocio en la región.
                            Sede 2026: Tepatitlán de Morelos.
                        </p>
                    </div>

                    <div>
                        <h4>Navegación</h4>
                        <ul className="footer-links">
                            <li><Link href="/">Inicio</Link></li>
                            <li><Link href="/#schedule">Programa</Link></li>
                            <li><Link href="/#speakers">Ponentes</Link></li>
                            <li><Link href="/precios">Precios</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Evento</h4>
                        <ul className="footer-links">
                            <li><a>18–19 Abril 2026</a></li>
                            <li><a>Centro de Convenciones Olimpo</a></li>
                            <li><a>Sede 2026 Tepatitlán de Morelos</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contacto</h4>
                        <ul className="footer-links">
                            <li><a href="mailto:info@conectamt.mx">info@conectamt.mx</a></li>
                            <li><a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>&copy; 2026 CONECTA. Todos los derechos reservados.</span>
                    <span>Hecho en Tepatitlán de Morelos</span>
                </div>
            </div>
        </footer>
    );
}
