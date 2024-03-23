import OpenAI from "openai";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import { IoSend } from "react-icons/io5";
import { PulseLoader } from "react-spinners";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  // Inizializzazione dell'API di OpenAI
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  // Riferimento per far scorrere automaticamente alla fine della chat
  const messagesEndRef = useRef(null);

  // Quando l'utente invia un messaggio viene chiamata questa funzione
  // Utilizza l'API di OpenAI per generare una risposta al messaggio dell'utente
  const onHandleChatGPT3 = async (e) => {
    e.preventDefault();

    if (!chatStarted) {
      setChatStarted(true);
    }

    const newMessages = [...messages, { role: "user", content: inputValue }];

    setMessages(newMessages);

    setInputValue("");

    setIsWriting(true);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{ role: "system", content: inputValue }],
    });

    newMessages.push({
      role: "bot",
      content: completion.choices[0].message.content,
    });

    setMessages(newMessages);

    setIsWriting(false);
  };

  const onHandleInputValue = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onHandleChatGPT3(e);
    } else {
      setInputValue(e.target.value);
    }
  };

  // Scorre automaticamente alla fine della chat ogni volta che i messaggi cambiano
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Funzione per salvare le chat;salva l'attuale stato dei messaggi nel localStorage
  const saveChat = () => {
    localStorage.setItem("chat", JSON.stringify(messages));
  };

  return (
    <div className={styles.Home}>
      <Navbar onSave={saveChat} />
      {!chatStarted ? (
        <div className={styles.title}>
          <Typewriter
            words={["Welcome, how can I help you?"]}
            typeSpeed={90}
            cursor={true}
            cursorStyle="|"
          />
        </div>
      ) : (
        <ul className={styles.chat}>
          {messages.map((message, index) => (
            <li
              key={index}
              className={message.role === "user" ? styles.user : styles.bot}
            >
              <Image
                src={
                  message.role === "user"
                    ? "/assets/_329d769f-186c-4db5-ac92-882018a2d1fa-removebg-preview.png"
                    : "/assets/_f43846ad-09e4-41ff-b2df-9b8c8f3cbd16-removebg-preview.png"
                }
                alt="avatar"
                width={90}
                height={90}
              />
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <Typewriter
                  className={styles.bot}
                  onType={() =>
                    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
                  }
                  words={[message.content]}
                  typeSpeed={30}
                />
              )}
            </li>
          ))}
          {isWriting && (
            <li className={`${styles.bot} ${styles.isWriting}`}>
              <Image
                src="/assets/_f43846ad-09e4-41ff-b2df-9b8c8f3cbd16-removebg-preview.png"
                alt="avatar"
                width={90}
                height={90}
              />
              <PulseLoader color="white" className={styles.loader} />
            </li>
          )}
          <div ref={messagesEndRef} />
        </ul>
      )}
      <form onSubmit={onHandleChatGPT3} className={styles.form}>
        <textarea
          value={inputValue}
          onChange={onHandleInputValue}
          onKeyDown={onHandleInputValue}
          className={styles.text}
          placeholder="Ask me everything..."
        />
        <button type="submit" className={styles.button}>
          <IoSend style={{ color: "white" }} />
        </button>
      </form>
    </div>
  );
}
