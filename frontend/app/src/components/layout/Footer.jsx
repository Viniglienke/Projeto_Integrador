import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.social_list}>
        <li>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaFacebook />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaInstagram />
          </a>
        </li>
        <li>
          <a href="https://github.com/Viniglienke/arborizacao_urbana_PE" target="_blank" rel="noopener noreferrer" className={styles.icon}>
            <FaGithub />
          </a>
        </li>
      </ul>
      <p className={styles.copy_right}>
        <span>BioUrb</span> &copy; 2024
      </p>
    </footer>
  );
}

export default Footer;
