import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { set, useForm } from "react-hook-form";
import smallProfile from "../../assets/images/sumday_logo.png";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineComment,
    AiOutlineSend,
} from "react-icons/ai";

import "./PostDetail.css";

function PostDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");
    const uid = sessionStorage.getItem("user");
    const username = sessionStorage.getItem("username");

    const { post, isRoutine } = location.state;
    const [isLoaded, setIsLoaded] = useState(false);

    //댓글 상태 변화 감지
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const dateTime = new Date(post.created_at);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();

    // 변환된 날짜와 시간 형식 생성
    const formattedDateTime = `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    const [liked, setLiked] = useState();
    const [likeCount, setLikeCount] = useState(post.like);
    const [viewsCount, setViewsCount] = useState(post.views);
    const { handleSubmit } = useForm();

    useEffect(() => {
        const fetchUserLiked = async () => {
            try {
                let url;
                if (isRoutine) {
                    url = `${baseUrl}/blog/routine_blog/${post.id}/?user_id=${uid}`;
                } else {
                    url = `${baseUrl}/blog/challenge_blog/${post.id}/?user_id=${uid}`;
                }
                const response = await axios.get(url, {
                    //uid, post.id
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setLikeCount(response.data.like_cnt);
                setLiked(response.data.is_exist);
                setViewsCount(response.data.views);
            } catch (error) {
                console.error("좋아요 여부를 가져오는데 실패했습니다.", error);
            }
        };

        fetchUserLiked();
        setIsLoaded(true);
    }, [baseUrl, post.id]);

    const handleLikeClick = async () => {
        let url;
        if (isRoutine) {
            url = `${baseUrl}/blog/routine_blog/${post.id}/`;
        } else {
            url = `${baseUrl}/blog/challenge_blog/${post.id}/`;
        }

        try {
            const response = await axios.post(
                url,
                {
                    user_id: uid,
                },
                {
                    //uid, post.id
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setLiked(response.data.is_exist);
            setLikeCount(response.data.like_cnt);
        } catch (error) {
            console.error("좋아요 업데이트 실패:", error);
            alert("좋아요 업데이트에 실패했습니다.");
        }
    };

    // 수정페이지 이동
    const editOnClick = () => {
        navigate("/blog/update/", {
            state: {
                post: post,
                isRoutine: isRoutine,
            },
        });
    };

    //alert delete message
    const deleteMessage = () => {
        if (window.confirm("정말 삭제 하시겠어요?")) {
            deleteOnClick();
            alert("삭제 되었습니다.");
        } else {
            alert("취소합니다.");
        }
    };

    //For Comments
    const onSubmit = async () => {
        if (comment.trim() === "") {
            return;
        }

        // 댓글을 제출하고, comments 상태를 업데이트합니다.
        const newComment = {
            created_at: Date.now(), // 임시로 고유한 ID를 생성합니다.
            text: comment,
        };

        setComments(prevComments => [...prevComments, newComment]);
        setComment("");
    };

    //delete blog item
    const deleteOnClick = async () => {
        let url;
        if (isRoutine) {
            url = `${baseUrl}/blog/routine_blog/${post.id}/`;
        } else {
            url = `${baseUrl}/blog/challenge_blog/${post.id}/`;
        }
        const response = await axios
            .delete(url, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then(response => {
                // 요청이 성공한 경우 처리할 로직
                console.log("삭제 요청 성공");
            })
            .catch(error => {
                // 요청이 실패한 경우 처리할 로직
                console.error("삭제 요청 실패", error);
            });
        navigate("/blog");
    };
    let imgUrl;
    if (isRoutine) {
        imgUrl = post.routine_blog_image;
    } else {
        imgUrl = post.challenge_blog_image;
    }
    let subtitle;
    if (isRoutine) {
        subtitle = `루틴`;
    } else {
        subtitle = `챌린지`;
    }
    return (
        <div id="blogPostDetailContainer">
            <div className="post-detail__header-wrapper">
                <h2 className="post-detail__header-title">{subtitle}</h2>
                <div className="post-detail__header">
                    {/* uid와 post.user가 동일한 경우에만 버튼을 렌더링 */}
                    {parseInt(post.user) === parseInt(uid) && (
                        <div className="post-detail__header__btn-wrapper">
                            <button
                                className="post-detail__header__btn"
                                onClick={editOnClick}
                            >
                                수정하기
                            </button>
                            <button
                                className="post-detail__header__btn"
                                onClick={deleteMessage}
                            >
                                삭제하기
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="post-detail__avatar-wrapper">
                <img className="profile_small_img" src={smallProfile} />
                <div className="post-detail__avatar__info-wrapper">
                    <p className="post-detail__avatar__info__name">
                        작성자: {username}
                    </p>
                    <p className="post-detail__avatar__info__date">
                        날짜: {formattedDateTime}
                    </p>
                </div>
            </div>
            <div className="post-detail__content-wrapper">
                <p className="post-detail__content-title">{post.title}</p>
                <p className="post-detail__content-content">{post.content}</p>
                <div className="create-post__image-wrapper">
                    {isLoaded ? (
                        <img src={imgUrl} className="create-post__image_blog" />
                    ) : (
                        <div className="create-post__image-fake"></div>
                    )}
                </div>
            </div>
            <small>조회 {viewsCount}</small>
            <hr className="divider_like_comment" />
            <div className="post-detail__meta-wrapper">
                <div className="post-detail__meta-container">
                    {liked ? (
                        <AiFillHeart
                            className="likes__icon__detail"
                            strokeWidth={60}
                            onClick={handleLikeClick}
                        />
                    ) : (
                        <AiOutlineHeart
                            className="likes__icon__detail"
                            strokeWidth={60}
                            onClick={handleLikeClick}
                        />
                    )}
                    <span>좋아요 {likeCount}</span>
                </div>
                <div className="post-detail__meta-container">
                    <AiOutlineComment
                        className="commnet__icon__detail"
                        strokeWidth={60}
                    />
                    <span>댓글수</span>
                </div>
            </div>
            <hr className="divider_like_comment" />
            <div className="post-detail__comment-wrapper">
                <div className="comment__textfield">
                    <form
                        className="comment__textfield__input"
                        onSubmit={handleSubmit(data => onSubmit(data))}
                    >
                        <input
                            type="text"
                            placeholder="댓글을 작성해주세요!"
                            onChange={e => setComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="comment__textfield__btn"
                        >
                            <AiOutlineSend
                                className="send__icon__detail"
                                strokeWidth={60}
                            />
                        </button>
                    </form>
                    <div className="comments__detail__field">
                        {comments.map(comment => (
                            <div
                                key={comment.id}
                                className="comment__item__individual"
                            >
                                {comment.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetailPage;
