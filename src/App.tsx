import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app__header">
        <h1>React + TypeScript + Vite</h1>
        <p>Ласкаво просимо до вашого нового фронтенд-проєкту.</p>
      </header>

      <main className="app__main">
        <p>
          Натисніть кнопку, щоб збільшити лічильник. Це лише демо-компонент, який
          можна безпечно видалити після старту розробки.
        </p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Лічильник: {count}
        </button>
        <script src="https://js.puter.com/v2/"></script>
      </main>
    </div>
  );
}

export default App;

