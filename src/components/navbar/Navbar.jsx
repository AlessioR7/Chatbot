import { IoIosSave } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import styles from "./index.module.css";
import Link from "next/link";

const Navbar = ({ onSave }) => {
  return (
    <nav className={styles.Navbar}>
      <Link href="/savedChats">
        <IoChatboxEllipsesOutline className={styles.menu} />
      </Link>
      {/* Icona per salvare la chat corrente; quando l'utente clicca
          sull'icona,viene chiamata la funzione "onSave" */}
      <IoIosSave onClick={onSave} className={styles.menu} />
    </nav>
  );
};

export default Navbar;
