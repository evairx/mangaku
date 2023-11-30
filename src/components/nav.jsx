import { useState } from "react";
import * as Style from "@/src/styles/navStyle"
import useClick from "../hooks/useClick";
import Bars from "../icon/bars";
import Logo from "@/src/icon/logo";
import User from "@/src/icon/user"
import Back from "@/src/icon/back"
import Sun from "@/src/icon/sun";
import Moon from "@/src/icon/moon";
import Theme from "@/src/icon/theme"
import SearchIco from "../icon/search";

export default function Menu() {
    const [userRef, openUser, setOpenUser] = useClick(false);
    const [themeRef, openTheme, setOpenTheme] = useClick(false);

    function handleUser() {
        setOpenUser(!openUser)
    }

    function handleTheme() {
        setOpenTheme(!openTheme)
    }

    return (
        <>
            <Style.Nav>
                <Style.Content>
                    <Bars width={32} height={32}/>
                    <Style.LogoContent>
                        <Logo width={140} height={30}/>
                    </Style.LogoContent>
                </Style.Content>
                <Style.Content>
                    <Style.SearchContainer>
                        <Style.Search placeholder="Buscar" autocomplete="off"/>
                        <Style.SearchIcoContent>
                            <SearchIco width={22} height={22}/>
                        </Style.SearchIcoContent>
                    </Style.SearchContainer>
                    <Style.UserContent onClick={handleUser}>
                        <User width={26} height={26}/>
                    </Style.UserContent>
                    <Style.UserNav ref={userRef} openUser={openUser}>
                        {openTheme ?
                            <Style.ContainerUserNav ref={themeRef}>
                                <Style.HeaderTheme>
                                    <Style.BackContainer onClick={handleTheme}>
                                        <Back width={24} height={24}/>
                                    </Style.BackContainer>
                                    <Style.Titletheme>Seleccionar Tema</Style.Titletheme>
                                </Style.HeaderTheme>
                            </Style.ContainerUserNav>
                        :
                            <Style.ContainerUserNav>
                                <Style.UserContainerNav>
                                    <User width={42} height={42}/>
                                    <p>Invitado</p>
                                </Style.UserContainerNav>
                                <Style.Border/>
                                <Style.ButtonTheme onClick={handleTheme}>
                                    <Theme width={26} height={26}/>
                                    Temas
                                </Style.ButtonTheme>
                                <Style.Border/>
                            </Style.ContainerUserNav>
                        }
                    </Style.UserNav>
                    <Style.OverLay openUser={openUser}/>
                </Style.Content>
            </Style.Nav>
        </>
    )
}