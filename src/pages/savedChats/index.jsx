import { useEffect, useState } from "react";
import styles from "@/styles/SavedChats.module.css";

export default function SavedChats() {
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    // Carica le chat salvate dal localStorage quando il componente
    // viene montato
    const chats = JSON.parse(localStorage.getItem("chat"));
    if (chats) {
      setSavedChats(chats);
    }
  }, []);

  return (
    <div className={styles.SavedChats}>
      <h1 className={styles.title}>Saved chats</h1>
      {/* Mappa le chat salvate e le visualizza */}
      {savedChats.map((message, index) => (
        <p
          key={index}
          className={message.role === "bot" ? styles.bot : styles.user}
        >
          {message.role} : {message.content}
        </p>
      ))}
    </div>
  );
}
