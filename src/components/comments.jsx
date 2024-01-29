import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import jwt from "jsonwebtoken"
import useQuery from "../hooks/useQuery";
import Link from "next/link";
import FilterIcon from "@/src/icon/filterComment";
import MoreIco from "@/src/icon/More"
import Liked from "@/src/icon/Liked";
import Like from "@/src/icon/Like";
import Reply from "@/src/icon/Reply"
import styled from "@emotion/styled"
import useClick from "@/src/hooks/useClick";

const Header = styled.main`
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:.900rem;
    width: 70%;
    margin: 0 auto;
    margin-top: ${props => (props.isMobile ? '0rem' : '1rem')};
    transition: all .3s ease;

    @media screen and (max-width: 1400px) {
        width: 85%;
    }

    @media screen and (max-width: 850px) {
        width: 95%;
    }

    @media screen and (max-width: 653px) {
        font-size: .800rem;
    }
    
`

const View = styled.section`
    display:flex;
    align-items:center;
    gap:.900rem;
    width: 70%;
    margin: 0 auto;
    transition: all .3s ease;
    margin-bottom:20px;
    
    @media screen and (max-width: 1400px) {
        width: 85%;
    }

    @media screen and (max-width: 850px) {
        width: 95%;
    }
`

const ViewComment = styled.div`
    width: 100%;
`

const UserCommentView = styled.div`
    display: flex;
    gap: .900rem;
    margin-top: 1rem;
    width: 100%;
    transition: all .3s ease;
`


const HeaderSub = styled.div`
    display:flex;
    justify-content:space-between;
    width:100%;
    align-items:center;
    gap:.500rem;
    margin-bottom: .400rem;
`

const UserDate = styled.div`
    gap:.500rem;
    display:flex;
    align-items:center;
`

const Name = styled.h1`
    font-size: 1.200rem;
    font-weight: 600;

    @media screen and (max-width: 653px) {
        font-size: 1rem;
    }
`

const Date = styled.p`
    font-size: .900rem;
    font-weight: 400;
    opacity: .8;

    @media screen and (max-width: 653px) {
        font-size: .700rem;
    }
`

const Sub = styled.div`
    display: flex;
    gap: .700rem;
    margin-top: 1.400rem;
`

const Content = styled.div`
    display: flex;
    align-items:center;
    gap:.400rem;
    cursor: pointer;
`

const ContainerComments = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    min-height: ${props => (props.isMobile ? 'auto' : '155px')};
    gap:.900rem;
    

    @media screen and (max-width: 653px) {
        padding: 0.800rem 0.8rem;
        display: block;
        width: 100%;
    }
`

const Avatar = styled.figure`
  width: 64px; 
  height: 64px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
  }
`

const CommentTile = styled.p`
  font-size: 1.050rem;
  font-weight: 400;
  padding: .400rem 0;
`

const CommentHeaderTitles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .400rem;
`
const CommentArea = styled.div`
    width: 880px;
    padding: 1rem;
    margin:0 auto;
    text-align: center;
    background-color: var(--background-nav);
    margin-top: 1rem;
    color: var(--color);
    border: 1px solid var(--color);
    border-style: dashed;

    h3 {
    margin-bottom: .400rem;
    }

    @media screen and (max-width: 1400px) {
        width: 600px;
    }
    
    @media screen and (max-width: 850px) {
        width: 500px;
    }
    
    @media screen and (max-width: 653px) {
    width: 100%;
    }
`

const CommentButtons = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;

    @media screen and (max-width: 653px) {
        display: initial;
        width: 100%;
    }
`

const Btns = styled.div`
    display:flex;
    align-items:center;
    gap:.400rem;

    @media screen and (max-width: 653px) {
        display: initial;
        width: 100%;
    }
`

const CancelBtn =  styled.button`
    border: 2px solid var(--main);
    background:none;
    color: var(--main);
    font-size: 1rem;
    padding: .400rem .700rem;
    cursor: pointer;

    &:hover {
        border: 2px solid var(--color);
        color: var(--color);
    }

    @media screen and (max-width: 653px) {
        width: 100%;
        margin-top: .400rem;
    }
`
const ConfirmBtn =  styled.button`
    background:var(--main);
    border: 2px solid var(--main);
    color: #fff;
    font-size: 1rem;
    padding: .400rem .700rem;
    cursor: pointer;

    &:hover {
        border: 2px solid var(--color);
        background:var(--color);
        color: var(--color-2);
    }

    @media screen and (max-width: 653px) {
        width: 100%;
        margin-top: .400rem;
    }
`

const ConfirmBtnDisabled =  styled.button`
    background:var(--main);
    border: 2px solid var(--main);
    color: #fff;
    font-size: 1rem;
    padding: .400rem .700rem;
    opacity: .5;

    @media screen and (max-width: 653px) {
        width: 100%;
        margin-top: .400rem;
    }
`

const SpoilerContent = styled.div`
    display:flex;
    align-items:center;
    gap:.400rem;

    @media screen and (max-width: 653px) {
        justify-content:space-between;
        margin-top:10px;
        margin-bottom:10px;
    }
`

const TextArea = styled.textarea`
  resize: none;
  width: 800px;
  padding: .400rem;
  outline: none;
  height: ${props => (props.actived ? '80px' : '35px')};
  form-sizing: content;
  background-color: var(--background-nav);
  color: var(--color);
  transition: ${props => (props.actived ? 'all .3s ease' : 'none')};
`

const TextAreaMobile = styled.textarea`
    resize: none;
    width: 600px;
    padding: .400rem;
    outline: none;
    height: ${props => (props.actived ? '80px' : '35px')};
    form-sizing: content;
    background-color: var(--background-nav);
    color: var(--color);
    transition: ${props => (props.actived ? 'all .3s ease' : 'none')};

    @media screen and (max-width: 850px) {
        width: 500px;
    }
    
    @media screen and (max-width: 653px) {
    width: 100%;
    }
`

const MobileName = styled.div`
   display: flex;
   align-items: center;
   gap: .400rem;
   margin-bottom: .800rem;
`

const ButtonFilter = styled.button`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:.400rem;
    background:none;
    padding: .800rem .400rem;
    border:none;
    font-size: 1.050rem;
    font-weight: 600;
    color: var(--color);
    cursor: pointer;
    trnasition: all .3s ease;

    &:hover {
        background:var(--btn-filter-command);
    }

    @media screen and (max-width: 653px) {
        font-size: .800rem;
    }
`

const ContentS = styled.section`
    display:flex;
    gap:.200rem;
    align-items:center;
    position:relative;
    cursor:pointer;
    height:30px;
    width:70px;
    background: ${props => (props.openMore ? 'var(--btn-filter-command)' : 'none')};

    &:hover {
        background:var(--btn-filter-command);
    }
`

const MoreContent = styled.section`
    background-color: var(--background-nav);
    position: absolute;
    top: -45%;
    left: 105%;
    transform: translate(-50%, -90%);
    min-width:150px;
    box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.5);
`

const MoreBtns = styled.button`
    display:flex;
    justify-content:center;
    align-items:center;
    gap:.400rem;
    background:none;
    width:100%;
    border:none;
    font-size: 1.050rem;
    font-weight: 500;
    color: var(--color);
    cursor: pointer;
    height:40px;

    &:hover {
        background:var(--btn-filter-command);
    }
`

const AlertContainer = styled.section`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--background-nav);
    height: 200px;
    padding: 1rem;
    z-index: 999;
    width: 400px;
    text-align: center;
    z-index: 1001;

    @media screen and (max-width: 653px) {
        height:230px;
    }

    @media screen and (max-width: 420px) {
        height:230px;
        width:95%;
    }

    @media screen and (max-width: 390px) {
        height:250px;
    }

    @media screen and (max-width: 350px) {
        height:230px;
    }
`

const AlertTitle = styled.p`
    margin-top:.400rem;
    font-size:1.600rem;
    font-weight:550;

    @media screen and (max-width: 350px) {
        font-size:1.200rem;
    }
`

const AlertText = styled.p`
    margin-top:1rem;

    @media screen and (max-width: 653px) {
        margin-bottom:1rem;
    }

    @media screen and (max-width: 350px) {
        font-size:.900rem;
    }
`

const AlertBtns = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top:1.5rem;
    gap:.800rem;

    @media screen and (max-width: 653px) {
        display: initial;
        width: 100%;
    }
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
    opacity: ${props => (props.openAlert ? 1 : 0)};
    visibility: ${props => (props.openAlert ? 'visible' : 'hidden')}; 
    transition: opacity 0.3s ease-out;
    z-index: 1000;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid var(--main);
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Div = styled.main`
  display:flex;
  justify-content: center;
  align-items:center;
  height:20lvh;
`

const ReplyContent = styled.main`
    display:flex;
    justify-content: center;
    align-items:center;
    gap:.400rem;
`

export default function Comments({ id }) {
    const [user, setUser] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState({});
    const [actived, setActived] = useState(false);
    const [loading, setLoading] = useState(true);
    const [moreRef, openMore, setOpenMore] = useClick(null);
    const [alertRef, openAlert, setOpenAlert] = useClick(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [sortBy, setSortBy] = useState('likeCount');
    const [initialSort, setInitialSort] = useState(true);
    const [cookies] = useCookies(['token']);
    const [, , removeCookieFromSecond] = useCookies(['token']);
    const isMobile = useQuery('(max-width: 653px)');
    const isTextAreaMobile = useQuery('(max-width: 888px)');

    const maxLength = 450;

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies.token;

            try {
                await fetch(`/api/v1/reviews/comment/${id}`, {
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
                    setComments(data);
                })
                .catch(error => {
                    console.error(error);
                    removeCookieFromSecond('token');
                });
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [id, cookies.token]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = cookies.token;
      
            try {
              const decoded = jwt.decode(token);
          
              if (decoded.status === "OFFLINE") {
                setLoading(false);
                return;
              }
          
              const fetchUserAccount = async () => {
                try {
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
          
              fetchUserAccount();
            } catch (decodeError) {
              console.error("Error decoding token:", decodeError);
              setLoading(true); 
            }
        }
        fetchUser();
    }, [cookies.token]);

    const autoresize = (event) => {
        const textarea = event.target;
        setComment(textarea.value);
    };

    function handleActive() {
        setActived(true)
    }

    function handleCancel() {
        setActived(false)
        setComment('')
    }

    const commentData = comments?.comments;

    const submitHandlet = () => {
        const comentarioData = {
          content: comment,
          mangaId: id,
          userId: user._id,
        };

        const token = cookies.token;

        fetch('/api/v1/reviews/comment/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(comentarioData),
        })
        .then(response => response.json())
        .then(data => {
            setComment('');
            setActived(false);

            const newComment = {
                content: comment,
                avatar: `/v1/static/avatar/${user.avatar}`,
                date: 'Ahora mismo',
                likeCount: 0,
                likes: [],
                spoilerContent: false,
                username: user.username,
                _id: data.id,
                userId: user._id,
                new: true
            };
    
            const updatedComments = {
             comments: [...comments.comments, newComment],
             count: comments.count + 1,
            };
          
            setComments(updatedComments);
        })
        .catch(error => {
          console.error('Error al enviar comentario:', error);
        });
      };

      const DeleteComment = () => {
        if (!selectedCommentId) {
            return;
        }

        const comentarioData = {
            commentId: selectedCommentId,
        };

        const token = cookies.token;

        fetch('/api/v1/reviews/comment/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(comentarioData),
        })
        .then(response => response.json())
        .then(data => {
            const updatedComments = comments.comments.map(comment => {
                if (comment._id === selectedCommentId) {
                  return { ...comment, content: "[COMENTARIO ELIMINADO]", delete: true };
                }
                return comment;
              });
          
              setComments({
                ...comments,
                comments: updatedComments,
              });
              setOpenAlert(false)
              setSelectedCommentId(null); 
        })
        .catch(error => {
          console.error('Error al enviar comentario:', error);
        });
        
      }

      function addLike(commentId) {
        const updatedComments = comments.comments.map(comment => {
            if (comment._id === commentId) {
              const userIndex = comment.likes.indexOf(user._id);
              if (userIndex !== -1) {
                comment.likes.splice(userIndex, 1);
              } else {
                comment.likes.push(user._id);
              }
          
              comment.likeCount = comment.likes.length;
          
              // Formatear likeCount con K si es mayor o igual a 1000
              comment.likeCount = formatLikeCount(comment.likeCount);
            }
            return comment;
          });
          
          setComments(prevComments => ({
            ...prevComments,
            comments: updatedComments,
          }));
          
          // Función para formatear el likeCount con K si es mayor o igual a 1000
          function formatLikeCount(count) {
            if (count >= 1000) {
              return formatNumberWithK(count, 1000);
            }
            return count.toString();
          }
          
          function formatNumberWithK(number, divisor) {
            if (number % divisor === 0) {
              return `${Math.floor(number / divisor)} K`;
            } else if ((number % divisor) % 100 === 0) {
              return `${(number / divisor).toFixed(1)} K`;
            } else {
              return `${(number / divisor).toFixed(1).replace(/\.0$/, '')} K`;
            }
          }
        const responseLike = {
            commentId: commentId,
            userId: user._id,
        };

        const token = cookies.token;
  
        fetch('/api/v1/reviews/comment/rating/votes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(responseLike),
        })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
            console.error('Error al enviar comentario:', error);
        });
      }

      const toggleSortOrder = () => {
        setSortBy((prevSortBy) => (prevSortBy === 'likeCount' ? 'created' : 'likeCount'));
        setInitialSort(!initialSort);
    };
    
    const sortedComments = commentData
    ? commentData
        .sort((a, b) => {
            if (a.new === true && b.new !== true) {
                return -1;
            } else if (a.new !== true && b.new === true) {
                return 1;
            } else if (initialSort) {
                return b.likeCount - a.likeCount;
            } else {
                const aValue = typeof a[sortBy] === 'string' ? a[sortBy] : '';
                const bValue = typeof b[sortBy] === 'string' ? b[sortBy] : '';
                return bValue.localeCompare(aValue);
            }
        })
    : [];

    function handleMore(commentId) {
        setOpenMore((prevOpenMore) => {
            setSelectedCommentId(prevOpenMore === commentId ? commentId : commentId);
            return prevOpenMore === commentId ? null : commentId;
        });
    }

    
    function handleAlert() {
        setOpenAlert(!openAlert)
    }

    return (
        <>
        <OverLay openAlert={openAlert}/>
        {Object.keys(comments).length === 0 ? undefined:
            <>
            { user._id ?
                <ContainerComments isMobile={isMobile}>
                    {isMobile ? undefined :
                    <>
                        {loading ?
                        <p>cargando</p>:
                        <Avatar>
                            <figure>
                                {user.avatar && <img src={`/v1/static/avatar/${user.avatar}`} alt={user.username}/>}
                            </figure>
                        </Avatar>}
                    </>
                    }
                    <div>
                        <CommentHeaderTitles>
                            {isMobile ?
                            <MobileName>
                                <img src={`/v1/static/avatar/${user.avatar}`} alt={user.username} style={{borderRadius: '50%'}} width={30} height={30}/>
                                <CommentTile>Comentar como {user.username}</CommentTile>
                            </MobileName>:
                            <CommentTile>Comentar como {user.username}</CommentTile>
                            }
                            {isMobile ? undefined :
                            <CommentHeaderTitles>
                                {actived &&
                                <>
                                    <p style={comment.length > maxLength ? {color: 'var(--main)'} : {}}>{comment.length}</p>
                                    <p>/</p>
                                    <p>{maxLength}</p>
                                </>}
                            </CommentHeaderTitles>}
                        </CommentHeaderTitles>
                        {isTextAreaMobile ? 
                        <TextAreaMobile
                            actived={actived}
                            placeholder='Deja tu comentario'
                            value={comment}
                            onClick={handleActive}
                            onChange={autoresize}
                            maxLength="1500"
                        />
                        :
                        <TextArea
                            actived={actived}
                            placeholder='Deja tu comentario'
                            value={comment}
                            onClick={handleActive}
                            onChange={autoresize}
                            maxLength="1500"
                        />}
                        {actived && 
                            <CommentButtons>
                                <SpoilerContent>
                                    <div style={{display: 'flex',gap: '.400rem'}}>
                                        <input type="checkbox" /> <p>Marcar como spoiler</p>
                                    </div>
                                    {isMobile && <div style={{display: 'flex',gap: '.400rem'}}>
                                        <p style={comment.length > maxLength ? {color: 'var(--main)'} : {}}>{comment.length}</p>
                                        <p>/</p>
                                        <p>{maxLength}</p>
                                    </div>}
                                </SpoilerContent>
                                <Btns>
                                    <CancelBtn onClick={handleCancel}>Cancelar</CancelBtn>
                                    {comment.length === 0 || comment.length > maxLength ?
                                        <ConfirmBtnDisabled>Comentar</ConfirmBtnDisabled>
                                        :
                                        <ConfirmBtn onClick={submitHandlet}>Comentar</ConfirmBtn>
                                    }
                                </Btns>
                            </CommentButtons>
                        }
                    </div>
                </ContainerComments>
                :
                <ContainerComments>
                    <CommentArea>
                        <h2>Se requiere una cuenta</h2>
                        <p>Por favor accede o Crea una cuenta para comentar</p>
                    </CommentArea>
                </ContainerComments>
            }
        </>}
        
       
        {openAlert && 
            <AlertContainer ref={alertRef}>
                <AlertTitle >Borrar comentario</AlertTitle>
                <AlertText>¿Estás seguro de que deseas eliminar tu comentario? Esta acción no podrá revertirse.</AlertText >
                <AlertBtns>
                    <CancelBtn onClick={handleAlert}>CANCELAR</CancelBtn>
                    <ConfirmBtn onClick={DeleteComment}>ELIMINAR</ConfirmBtn>
                </AlertBtns>
            </AlertContainer>}
        

        <Header isMobile={isMobile}>
            <h2>{comments.count ? comments.count: '0'} Comentario{comments?.count > 1 && 's'}</h2>
            <ButtonFilter onClick={toggleSortOrder}>
                <FilterIcon width={24} height={24}/>
                {initialSort ? "POPULAR": "LO MÁS RECIENTE"}
            </ButtonFilter >
        </Header>

        {Object.keys(comments).length === 0 ? <Div><Spinner/></Div>:<View>
            <ViewComment>
                {sortedComments.map((comment, index) => (
                    <UserCommentView style={{background: comment.new === true && 'var(--background-nav)', padding: comment.new === true && '10px'}} key={index}>
                        {isMobile ? undefined:<figure>
                            <picture>
                                <img src={comment.avatar} alt={comment.username} style={{borderRadius: '50%'}}  width={80} height={80}/>
                            </picture>
                        </figure>}
                        <div style={{width: '100%'}}>
                            <HeaderSub>
                                <UserDate>
                                    {isMobile &&
                                        <figure>
                                            <picture>
                                                <img src={comment.avatar} alt={comment.username} width={24} height={24} style={{borderRadius: '50%'}}/>
                                            </picture>
                                        </figure>
                                    }
                                    <Name>{comment.username}</Name>
                                    <Date>{comment.date}</Date>
                                </UserDate>
                            </HeaderSub>
                            <p>{comment.content}</p>
                            {comment.delete ? null : <Sub>
                            {user._id ? 
                                <Content style={{marginRight: '.800rem'}} onClick={() => addLike(comment._id)}>
                                    {comment.likes && comment.likes.includes(user._id) ? (
                                        <Liked style={{marginBottom:'2px'}} width={22} height={22} />
                                    ) : (
                                        <Like style={{marginBottom:'2px'}} width={22} height={22} />
                                    )}
                                    <p>{comment.likeCount}</p>
                                </Content>
                                :
                                <Link href="/login">
                                    <Content style={{marginRight: '.800rem'}}>
                                        <Like width={18} height={18} />
                                        <p>{comment.likeCount}</p>
                                    </Content>
                                </Link>
                            }
                                {user._id &&
                                <ReplyContent>
                                    <Reply width={19} height={19}/>
                                    <p>RESPONDER</p>
                                </ReplyContent>
                                }
                                <ContentS openMore={comment._id === openMore} onClick={() => handleMore(comment._id)}>
                                    {comment._id === openMore && <MoreContent ref={moreRef}>
                                        <MoreBtns>Reportar</MoreBtns>
                                        {user._id && user._id === comment.userId && <MoreBtns onClick={handleAlert}>Eliminar</MoreBtns>}
                                    </MoreContent>}
                                    <MoreIco width={22} height={22}/>
                                    <p>MÁS</p>
                                </ContentS>
                            </Sub>}
                        </div>
                    </UserCommentView>
                ))}
                {comments.count === 0 && <p>No hay comentarios</p>}
            </ViewComment>
        </View>}
        </>
    )
}