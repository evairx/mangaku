import styled from "@emotion/styled"

export const Nav = styled.nav`
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

export const LogoContent = styled.div`
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

export const SearchContainer = styled.div`
    position:relative;
`

export const SearchIcoContent = styled.div`
    position:absolute;
    top:.250rem;
    right:.400rem;
    color:var(--color);
`

export const Search = styled.input`
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

export const Content = styled.div`
    display:flex;
    justify-content:center;
    position: relative;
    align-items:center;
    gap:1rem;
    color:#fff;
`

export const UserContent = styled.span`
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
    overflow:hidden;

    &:hover {
        border: 2px solid var(--main);
    }
`;

export const UserAvatar = styled.figure`
    display: flex;
    justify-content: center;
    border-radius: 50%;
    overflow:hidden;
    width:42px;
    height:42px;
    cursor:pointer;
    border: 2px solid transparent;

    &:hover {
        border: 2px solid var(--main);
    }

    img {
        width:100%;
    }
`;

export const UserNav = styled.section`
    position: absolute;
    top: 3.5rem;
    background: var(--main-);
    width: 300px;
    min-height: 300px;
    right: 0;
    z-index: 999;
    border-radius:8px;
    text-align:center;
    color:var(--color);
    opacity: ${props => (props.openUser ? 1 : 0)};
    visibility: ${props => (props.openUser ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease-out;
`;

export const UserContainerNav = styled.section`
    margin-bottom:1rem;
    p {
        font-size:1.3rem;
        font-weight:400;
    }
`

export const UserName = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:.400rem;
    margin-top:.400rem;
`

export const Role = styled.div`
    background:#fc1818b8;
    padding: .100rem .500rem;
    border-radius:2px;
    color:#fff;
`

export const ButtonContainer = styled.div`
    display:flex;
    gap:.400rem;
`

export const Button = styled.span`
    margin-top:.600rem;
    width:100%;
    font-size:1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height:2.5rem;
    border:none;
    gap:.200rem;
    color:var(--color);
    background:none;
    cursor:pointer;
    margin-bottom:.700rem;
    transition: all .3s ease-out;

    &:hover {
        background:var(--btn-hover);
    }

`

export const ButtonThemes = styled.button`
    width:100%;
    display:flex;
    align-items:center;
    gap:.400rem;
    font-size:1rem;
    font-weight:400;
    margin:.200rem;
    background:none;
    color:var(--color);
    height:2.5rem;
    cursor:pointer;
    border:none;
    text-align:left;
    padding: 0rem 1rem;

    &:hover {
        background:var(--btn-hover);
    }
`

export const ContainerUserNav = styled.div`
    width:100%;
    height:100%;
    position:relative;
    padding: 1rem;
`

export const HeaderTheme = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:relative;
`

export const BackContainer = styled.div`
    cursor: pointer;
    padding:.200rem;
    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:50%;
    transition: all .3s ease-out;

    &:hover {
        background:var(--btn-hover);
    }
`

export const Titletheme = styled.p`
    margin-top:.200rem;
    font-size:1.050rem;
    font-weight:600;
`

export const ButtonLogout = styled.button`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:.400rem;
    background:var(--main);
    color:#fff;
    width:100%;
    margin-top:1rem;
    font-size:1.150rem;
    border:none;
    padding: .400rem;
    border-radius:2px;
    font-weight:600;

    opacity: 0.8;

    &:hover {
        opacity: 1;
    }
`

export const ButtonLogin = styled.button`
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:.400rem;
    font-size:1rem;
    font-weight:400;
    margin:.200rem;
    background:none;
    color:var(--color);
    height:2.5rem;
    cursor:pointer;
    border:none;
    text-align:center;
    padding: 0rem 1rem;

    &:hover {
        background:var(--btn-hover);
    }
`

export const BorderOr = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--border);
    }
    &::before {
        margin-right: 0.5em;
    }
    &::after {
        margin-left: 0.5em;
    }
`

export const Border = styled.div`
    border: 1px solid var(--border);
    border-radius:8px;
`

export const OverLay = styled.section`
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
