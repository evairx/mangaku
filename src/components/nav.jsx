import React from "react";
import styled from "@emotion/styled"
import useClick from "../hooks/useClick";
import Logo from "@/src/icon/logo";
import User from "@/src/icon/user"
import Sun from "@/src/icon/sun";
import Moon from "@/src/icon/moon";
import SearchIco from "../icon/search";

const Nav = styled.nav`
    position:fixed;
    top:0;
    width:100%;
    height:3.5rem;
    z-index:999;
    padding: 0 5rem;
    display:flex;
    justify-content: space-between;
    align-items:center;
    transition: all .3s ease-out;;

    @media screen and (max-width: 1000px) {
        padding: 0 2rem;
    }
    
    @media screen and (max-width: 485px) {
        padding: 0 .800rem;
    }
`

const LogoContent = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:.700rem;
    color: #fff;
    font-weight:600;
    color:var(--main);
    transition: all .3s ease-out;
    cursor:pointer;

    &:hover {
        color:var(--color);
    }
`

const SearchContainer = styled.div`
    position:relative;
`

const SearchIcoContent = styled.div`
    position:absolute;
    top:.250rem;
    right:.400rem;
    color:var(--color);
`

const Search = styled.input`
    width: 15rem;
    height:30px;
    border-radius: 8px;
    padding: 0rem 1rem;
    border: none;
    background-color: #33333393;
    backdrop-filter:blur(20px);
    outline: none;
    font-size:1rem;
    font-weight: 400;
    transition: all .2s ease-out;
    color:var(--color);

    &::placeholder {
        color:var(--color);
    }

    &:focus {
        width: 35rem;
        border: 2px solid var(--main);
    }
`

const Content = styled.div`
    display:flex;
    justify-content:center;
    position: relative;
    align-items:center;
    gap:1.700rem;
    color:#fff;
`

const UserContent = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--main-);
    border-radius: 50%;
    padding: 0.300rem;
    cursor: pointer;
    transition: all 0.2s ease-out;
    border: 2px solid var(--main-);
    color:var(--color);

    &:hover {
        border: 2px solid var(--main);
    }
`;

const UserNav = styled.section`
    position: absolute;
    top: 3.5rem;
    background: var(--main-);
    width: 300px;
    height: 300px;
    right: 0;
    z-index: 999;
    padding: 1rem;
    border-radius:8px;
    text-align:center;
    color:var(--color);
    opacity: ${props => (props.openUser ? 1 : 0)};
    visibility: ${props => (props.openUser ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease-out;
`;

const UserContainerNav = styled.section`
    margin-bottom:1rem;
    p {
        font-size:1.3rem;
        font-weight:400;
    }
`

const ButtonTheme = styled.button`
    margin-top:.600rem;
    width:100%;
    font-size:1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height:2.5rem;
    border:none;
    border-radius:8px;
    gap:.200rem;
    color:var(--color);
    background:none;
    cursor:pointer;
    margin-bottom:.700rem;

    &:hover {
        background:var(--btn-hover);
    }

`

const Border = styled.div`
    border: 1px solid var(--border);
    border-radius:8px;
`

const OverLay = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    pointer-events: auto;
    overflow-y: hidden;
    background: #0000004d;
    opacity: ${props => (props.openUser ? 1 : 0)};
    visibility: ${props => (props.openUser ? 'visible' : 'hidden')}; 
    transition: opacity 0.3s ease-out;
    z-index: 998;
`;

export default function Menu({toggleDarkMode, theme}) {
    const [ref, openUser, setOpenUser] = useClick(false);

    function handleUser() {
        setOpenUser(!openUser)
    }

    return (
        <>
            <Nav>
                <Content>
                    <LogoContent>
                        <Logo width={140} height={30}/>
                    </LogoContent>
                </Content>
                <Content>
                    <SearchContainer>
                        <Search placeholder="Buscar" autocomplete="off"/>
                        <SearchIcoContent>
                            <SearchIco width={22} height={22}/>
                        </SearchIcoContent>
                    </SearchContainer>
                    <UserContent onClick={handleUser}>
                        <User width={26} height={26}/>
                    </UserContent>
                    <UserNav ref={ref} openUser={openUser}>
                        <UserContainerNav>
                            <User width={42} height={42}/>
                            <p>Invitado</p>
                        </UserContainerNav>
                        <Border/>
                        <ButtonTheme onClick={toggleDarkMode}>
                            {theme === "--dark" ? <Sun width={26} height={26}/>:<Moon width={26} height={26}/>}
                            Tema
                        </ButtonTheme>
                        <Border/>
                    </UserNav>
                    <OverLay openUser={openUser}/>
                </Content>
            </Nav>
        </>
    )
}