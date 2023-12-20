import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import Link from "next/link";
import FilterIcon from "@/src/icon/filterComment";
import Liked from "@/src/icon/Liked";
import Like from "@/src/icon/Like";
import styled from "@emotion/styled"

const Header = styled.main`
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:.900rem;
    width: 70%;
    margin: 0 auto;
    margin-top: 1rem;
`

const View = styled.section`
    display:flex;
    align-items:center;
    gap:.900rem;
    width: 70%;
    margin: 0 auto;
`

const ViewComment = styled.div`
    width: 100%;

`

const UserCommentView = styled.div`
    display: flex;
    gap: .900rem;
    background-color: var(--background-nav);
    margin-top: 1rem;
    padding: 1rem;
`


const HeaderSub = styled.div`
    display:flex;
    align-items:center;
    gap:.500rem;
    margin-bottom: .400rem;
`

const Name = styled.h1`
    font-size: 1.200rem;
    font-weight: 600;
`

const Date = styled.p`
    font-size: .900rem;
    font-weight: 400;
    opacity: .8;
`

const Sub = styled.div`
    display: flex;
    gap: .900rem;
    margin-top: .600rem;
`

const Content = styled.div`
    display: flex;
    align-items:center;
    gap:.400rem;
    cursor: pointer;
`

const ContainerComments = styled.div`
    margin-top: 1rem;
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:155px;
    gap:.900rem;
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

    color: var(--color);
    border: 1px solid var(--color);
    border-style: dashed;

    h3 {
        margin-bottom: .400rem;
    }
`

const CommentButtons = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
`

const Btns = styled.div`
    display:flex;
    align-items:center;
    gap:.400rem;
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
`

const ConfirmBtnDisabled =  styled.button`
    background:var(--main);
    border: 2px solid var(--main);
    color: #fff;
    font-size: 1rem;
    padding: .400rem .700rem;
    opacity: .5;
`

const SpoilerContent = styled.div`
    display:flex;
    align-items:center;
    gap:.400rem;
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
`

export default function Comments({ id }) {
    const [user, setUser] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState({});
    const [actived, setActived] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['token']);

    const maxLength = 450;

    const fetchData = async () => {
        try {
            await fetch(`/api/v1/coment/${id}`)
            .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
                return response.json();
              })
              .then(data => {
                setComments(data);
                setLoading(false);
              })
              .catch(error => {
                console.error(error);
                setLoading(true);
              });
        } catch (error) {
            console.error(error);
            setLoading(true);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            const token = cookies.token;
            
            if (!token) {
                setLoading(false);
                return;
            }

            if(token) {
                try {
                    await fetch(`/api/v1/user/account`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(response => {
                        if (!response.ok) {
                        throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        setUser(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                        setLoading(true);
                    });
                } catch (error) {
                    console.error(error);
                    setLoading(true);
                }
            }
        };

        fetchData();
        fetchUser();
    }, []);

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


        fetch('/api/v1/coment/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(comentarioData),
        })
        .then(response => response.json())
        .then(data => {
          // Lógica adicional después de enviar la solicitud (si es necesario)
          console.log('Respuesta del servidor:', data);
          // Limpiar el estado después de enviar el comentario
          setComment('');
          fetchData();
        })
        .catch(error => {
          // Manejo de errores
          console.error('Error al enviar comentario:', error);
        });
      };

      const handleLike = (commentId) => {
        const responseLike = {
          commentId: commentId,
          userId: user._id,
        };

        fetch('/api/v1/coment/handle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(responseLike),
        })
          .then(response => response.json())
          .then(data => {
            fetchData();
          })
          .catch(error => {
            console.error('Error al enviar comentario:', error);
          });
      };
      
    return (
        <>
        { user._id ?
            <ContainerComments>
                {loading ?
                <p>cargando</p>:
                <Avatar>
                    <figure>
                        {user.avatar && <img src={`/v1/static/avatar/${user.avatar}`} alt={user.username}/>}
                    </figure>
                </Avatar>}
                <div>
                    <CommentHeaderTitles>
                        <CommentTile>Comentar como {user.username}</CommentTile>
                        <CommentHeaderTitles>
                            {actived &&
                            <>
                                <p style={comment.length > maxLength ? {color: 'var(--main)'} : {}}>{comment.length}</p>
                                <p>/</p>
                                <p>{maxLength}</p>
                            </>}
                        </CommentHeaderTitles>
                    </CommentHeaderTitles>
                    <TextArea
                        actived={actived}
                        placeholder='Deja tu comentario'
                        value={comment}
                        onClick={handleActive}
                        onChange={autoresize}
                        maxLength="1500"
                    />
                    {actived && 
                        <CommentButtons>
                            <SpoilerContent>
                                <input type="checkbox" /> <p>Marcar como spoiler</p>
                            </SpoilerContent>
                            <Btns>
                                <CancelBtn onClick={handleCancel}>Cancelar</CancelBtn>
                                {comment.length > maxLength ?
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

        <Header>
            <h2>{comments.count ? comments.count: '0'} Comentario{comments?.count > 1 && 's'}</h2>
            <ButtonFilter>
                <FilterIcon width={24} height={24}/>
                POPULAR
            </ButtonFilter >
        </Header>

        <View>
            <ViewComment>
                {commentData && commentData.map((comment, index) => (
                    <UserCommentView key={index}>
                        <img src={comment.avatar} alt={comment.username} width={80} height={80}/>
                        <div>
                            <HeaderSub>
                                <Name>{comment.username}</Name>
                                <Date>{comment.date}</Date>
                            </HeaderSub>
                            <p>{comment.content}</p>
                            <Sub>
                            {user._id ? 
                                <Content onClick={() => handleLike(comment._id)}>
                                    {comment.likes && comment.likes.includes(user._id) ? (
                                        <Liked width={18} height={18} />
                                    ) : (
                                        <Like width={18} height={18} />
                                    )}
                                    <p>{comment.likeCount}</p>
                                </Content>
                                :
                                <Link href="/login">
                                    <Content>
                                        <Like width={18} height={18} />
                                        <p>{comment.likeCount}</p>
                                    </Content>
                                </Link>
                            }
                            </Sub>
                        </div>
                    </UserCommentView>
                ))}
                {comments.count === 0 && <p>No hay comentarios</p>}
            </ViewComment>
        </View>
        </>
    )
}