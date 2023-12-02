import { useState, useEffect } from "react"
import { useCookies } from 'react-cookie';
import styled from "@emotion/styled"

const Nav = styled.nav`
    height: 96lvh;
    overflow:hidden;
    background-color: var(--background-nav);
    width: 256px;
    border-radius: 10px;
    padding: 1rem;
    grid-area: submenu; 

    @media screen and (max-width: 952px){
        display: none;
    }
`

export default function NavDash() {
    const [user, setUser] = useState([]);
    const [cookies] = useCookies(['token']);
  
    useEffect(() => {
      const token = cookies.token;
  
      if (token) {
        fetch('/api/v1/user/account', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => {
          setUser(data);
        })
        .catch(error => {
          console.error(error);
          localStorage.removeItem('accountToken');
          setLoggedIn(false);
        });
      } else {
        // No hay token, redirigir a /login
      }
    }, []);
  
    return (
      <Nav>
        {user.avatar && <img src={`/v1/static/avatar/${user.avatar}`} width={64} height={64} alt={`avatar de ${user.username}`}/>}
      </Nav>
    );
  }