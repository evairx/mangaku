import { useState } from "react";

export default function Login({ url }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`/api/v1/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const { token } = data;
  
          // Guardar el token en una cookie que expira en 730 horas (30 días).
          const expirationTime = new Date();
          expirationTime.setTime(expirationTime.getTime() + 30 * 24 * 60 * 60 * 1000);
          document.cookie = `token=${token}; expires=${expirationTime.toUTCString()}; path=/`;
  
          // Manejar la respuesta exitosa, por ejemplo, redirigir a otra página.
          console.log('Inicio de sesión exitoso');
        } else {
          // Manejar la respuesta de error, por ejemplo, mostrar un mensaje al usuario.
          console.error('Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    return (
      <div>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    );
  }

  
export function getServerSideProps({req}) {
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`;

    return {
      props: {
        url
      }
    }
}