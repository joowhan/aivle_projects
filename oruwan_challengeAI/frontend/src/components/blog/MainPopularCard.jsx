import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./MainPopularCard.css";
import axios from "axios";
import { useSelector } from "react-redux";

const BlogMainPopularCard = ({ post, isWide, isRoutine }) => {
    const [imgSrc, setImgSrc] = useState("https://picsum.photos/192/108");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.like);
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");
    const uid = sessionStorage.getItem("user");
    useEffect(() => {
        const fetchUserLiked = async () => {
            let url;
            if (isRoutine) {
                url = `${baseUrl}/blog/routine_blog/${post.id}/?user_id=${uid}`;
            } else {
                url = `${baseUrl}/blog/challenge_blog/${post.id}/?user_id=${uid}`;
            }
            try {
                const response = await axios.get(url, {
                    //uid, post.id
                    headers: {
                        // "Content-Type": "multipart/form-data",
                        Authorization: `Token ${token}`,
                    },
                });
                setLikeCount(response.data.like_cnt);
                setLiked(response.data.is_exist);
            } catch (error) {
                console.error("좋아요 여부를 가져오는데 실패했습니다.", error);
            }
        };

        fetchUserLiked();
    }, [baseUrl, post.id]);

    const [wrapperId, setWrapperId] = useState("blogMainPopularCardWrapper");

    useEffect(() => {
        if (isWide == true) {
            setWrapperId("blogMainPopularCardWrapperWide");
        }
        if (isRoutine) {
            setImgSrc(post.routine_blog_image);
        } else {
            setImgSrc(post.challenge_blog_image);
        }

        if (post.routine_blog_image != null) {
            setImgSrc(post.routine_blog_image);
        }
    });

    return (
        <li key={post.id} id={wrapperId}>
            <Link
                className="post-link"
                to={`/blog/post/${post.id}`}
                state={{ post: post, isRoutine: isRoutine }}
            >
                <button className="likes__wrapper likes__btn">
                    {liked ? (
                        <AiFillHeart className="likes__icon" strokeWidth={60} />
                    ) : (
                        <AiOutlineHeart
                            className="likes__icon"
                            strokeWidth={60}
                        />
                    )}
                    <span className="likes__count">{likeCount}</span>
                </button>

                <div className="content__wrapper">
                    <img src={imgSrc} alt="" className="content__image" />
                    <p className="content__title">{post.title}</p>
                    <p className="content__content">{post.content}</p>
                </div>
            </Link>
        </li>
    );
};

export default BlogMainPopularCard;
