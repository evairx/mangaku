import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import useQuery from "../hooks/useQuery";
import jwt from "jsonwebtoken"
import * as Style from "@/src/styles/navStyle"
import Link from "next/link";
import useClick from "../hooks/useClick";
import Bars from "../icon/bars";
import Logo from "@/src/icon/logo";
import User from "@/src/icon/user"
import Back from "@/src/icon/back"
import Sun from "@/src/icon/sun";
import Moon from "@/src/icon/moon";
import SystemIco from '@/src/icon/systemIco'
import Theme from "@/src/icon/theme"
import SearchIco from "../icon/search";

function MenuDesktop({ handleDark, handleLight, handleSystem }) {
    const [user, setUser] = useState({});
    const [cookies] = useCookies(['token']);
    const [, , removeCookieFromSecond] = useCookies(['token']);
    const [userRef, openUser, setOpenUser] = useClick(false);
    const [themeRef, openTheme, setOpenTheme] = useClick(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies.token;
    
            try {
                if (!token) {
                    setLoading(false);
                    return;
                }
    
                const decoded = jwt.decode(token);
    
                if (!decoded || !decoded.status) {
                    setLoading(false);
                    return;
                }
    
                const status = decoded.status;
    
                if (status === "OFFLINE") {
                    setLoading(false);
                    return;
                }
    
                const response = await fetch('/api/v1/user/account', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
    
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error(error);
                removeCookieFromSecond('token');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);  

    function handleUser() {
        setOpenUser(!openUser)
    }

    function handleTheme() {
        setOpenTheme(!openTheme)
    }

    const [, , removeCookie] = useCookies(['token']);

    function closeSession() {
        removeCookie('token');
        window.location.reload();
    }

    return (
        <>
            <Style.Nav>
                <Style.Content>
                    <Bars width={32} height={32}/>
                    <Link href="/">
                        <Style.LogoContent>
                            <Logo width={140} height={30}/>
                        </Style.LogoContent>
                    </Link>
                </Style.Content>
                <Style.Content>
                    <Style.SearchContainer>
                        <Style.Search placeholder="Buscar" autocomplete="off"/>
                        <Style.SearchIcoContent>
                            <SearchIco width={22} height={22}/>
                        </Style.SearchIcoContent>
                    </Style.SearchContainer>
                    {loading ?
                        <Style.UserLoading/>
                        :
                        <>
                            {user._id ?
                            <Style.UserAvatar onClick={handleUser}>
                                <figure>
                                    {user?.avatar && <img src={`/v1/static/avatar/${user.avatar}`} alt={`avatar de ${user.username}`}/>}
                                </figure>
                            </Style.UserAvatar>
                            :
                            <Style.UserContent onClick={handleUser}>
                                <User width={26} height={26}/>
                            </Style.UserContent>
                            }
                        </>
                    }
                    <Style.UserNav ref={userRef} openUser={openUser}>
                        {openTheme ?
                            <Style.ContainerUserNav ref={themeRef}>
                                <Style.HeaderTheme>
                                    <Style.BackContainer onClick={handleTheme}>
                                        <Back width={24} height={24}/>
                                    </Style.BackContainer>
                                    <Style.Titletheme>Seleccionar Tema</Style.Titletheme>
                                </Style.HeaderTheme>
                                <div style={{marginTop: '1rem'}}>
                                    <Style.ButtonThemes onClick={handleLight}>
                                        <Sun width={24} height={24}/>
                                        Claro
                                    </Style.ButtonThemes>
                                    <Style.ButtonThemes onClick={handleDark}>
                                        <Moon width={24} height={24}/>
                                        Oscuro
                                    </Style.ButtonThemes>
                                    <Style.ButtonThemes onClick={handleSystem}>
                                        <SystemIco  width={24} height={24}/>
                                        Sistema
                                    </Style.ButtonThemes>
                                </div>
                            </Style.ContainerUserNav>
                        :
                            <Style.ContainerUserNav>
                                {user._id &&
                                    <Style.UserContainerNav>
                                    
                                         {user?.avatar && <img src={`/v1/static/avatar/${user.avatar}`} width={84} height={84} style={{borderRadius: '50%'}} alt={`avatar de ${user.username}`}/>}
                                         <Style.UserName>
                                            <p>{user?.username}</p>
                                            <Style.Role>
                                                {user?.roles[0] === "admin" && <span>{user?.roles[0]}</span>}
                                            </Style.Role>
                                         </Style.UserName>
                                    </Style.UserContainerNav>
                                }
                                <Style.ButtonContainer>
                                    {user._id &&
                                    <Style.Button>
                                        <User width={26} height={26}/>
                                        Mi Cuenta
                                    </Style.Button>
                                    }
                                    <Style.Button onClick={handleTheme}>
                                        <Theme width={26} height={26}/>
                                        Temas
                                    </Style.Button>
                                </Style.ButtonContainer>
                                <Style.Border/>
                                <Style.ButtonContainer>
                                    {user._id ?
                                        <Style.ButtonX style={{marginTop: '1rem'}} onClick={closeSession}>
                                           Cerrar Sesión
                                        </Style.ButtonX>
                                        :
                                        <div style={{marginTop: '1rem', width: '100%'}}>
                                            <Style.ButtonX>
                                                Iniciar Sesión
                                            </Style.ButtonX>
                                            <Style.BorderOr>o</Style.BorderOr>
                                            <Style.ButtonX>
                                                Crear Cuenta
                                            </Style.ButtonX>
                                        </div>
                                    }
                                </Style.ButtonContainer>
                            </Style.ContainerUserNav>
                        }
                    </Style.UserNav>
                    <Style.OverLay openUser={openUser}/>
                </Style.Content>
            </Style.Nav>
            <Style.Space/>
        </>
    )
}

export default function Menu({handleDark, handleLight, handleSystem}) {
    const isMobile = useQuery('(max-width: 850px)');

    return(
        <>
            {isMobile ? undefined: <MenuDesktop handleDark={handleDark} handleLight={handleLight} handleSystem={handleSystem}/>}
        </>
    )
}