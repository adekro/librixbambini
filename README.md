# Progetto Biblioteca di Libri per Bambini

Questo è un semplice progetto React creato con Vite che mostra un elenco di libri per bambini di pubblico dominio. L'elenco può essere filtrato in tempo reale tramite una barra di ricerca.

## Funzionalità

- **Barra di Ricerca:** Filtra i libri per titolo o autore.
- **Elenco di Libri:** Mostra i risultati filtrati.
- **Link ai PDF:** Cliccando su un libro si apre il relativo PDF da Project Gutenberg in una nuova scheda.
- **Stile Semplice:** Interfaccia utente pulita e leggibile costruita con Material-UI.

## Struttura del Progetto

```
/
├── public/
├── src/
│   ├── data/
│   │   └── books.json      # Dati dei libri
│   ├── App.jsx             # Componente principale
│   ├── BookList.jsx        # Componente per la lista dei libri
│   ├── SearchBar.jsx       # Componente per la barra di ricerca
│   ├── main.jsx            # Entry point dell'applicazione
│   └── index.css           # Stili globali
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vercel.json             # Configurazione per Vercel
```

## Come installare e avviare

1.  **Clona o scarica il repository.**

2.  **Installa le dipendenze:**
    Apri un terminale nella directory del progetto e lancia il seguente comando:
    ```bash
    npm install
    ```

3.  **Avvia il server di sviluppo:**
    Una volta completata l'installazione, esegui:
    ```bash
    npm run dev
    ```

4.  **Apri l'applicazione:**
    Apri il tuo browser e naviga all'indirizzo mostrato nel terminale (solitamente `http://localhost:5173`).

## Deployment

Questo progetto è configurato per un deployment semplice su [Vercel](https://vercel.com/). È sufficiente collegare il tuo repository GitHub a Vercel e la distribuzione avverrà automaticamente.
