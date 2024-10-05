import React from 'react';
import './App.css'; // Si tienes un archivo CSS
import Formulario from './Formulario'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Puedes personalizar el header o dejarlo vacío */}
        <h1>MANUMETAL</h1>
        <h3>Manufacturas Metálicas LTDA</h3>
        <h3>Desarrollo Inspección</h3>
        </header>

      <main>
        {/* Renderizamos el componente Formulario */}
        <Formulario />
      </main>
    </div>
  );
}

export default App;
