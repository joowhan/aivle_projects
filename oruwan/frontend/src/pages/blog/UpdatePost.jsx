import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import "./UpdatePost.css";
import Sidebar from "./Sidebar";
import axios from "axios";

const UpdatePostPage = ({ setHeaderText }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { post, isRoutine } = location.state;
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    const [source, setSource] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(isRoutine);
    const [postImage, setPostImage] = useState(null);

    // 게시글 폼 설정
    const { register, handleSubmit } = useForm();

    // 카테고리 설정
    const handleCategoryChange = event => {
        event.preventDefault();
        setSelectedCategory(event.target.innerText === "루틴" ? true : false);
    };

    // 이미지 변경 시 미리보기
    const handelImageChange = event => {
        event.preventDefault();
        if (event.target.files.length !== 0) {
            const image = event.target.files[0];
            setSource(URL.createObjectURL(image));
            setIsLoaded(true);

            setPostImage(image);
        }
    };

    // 제출
    const onSubmit = async data => {
        let url;
        if (isRoutine) {
            url = `${baseUrl}/blog/routine_blog/${post.id}/`;
        } else {
            url = `${baseUrl}/blog/challenge_blog/${post.id}/`;
        }
        const formData = new FormData();

        formData.append("user_id", sessionStorage.getItem("user"));
        formData.append("title", data.title);
        formData.append("content", data.content);
        if (selectedCategory) {
            formData.append("routine_blog_image", postImage);
        } else {
            formData.append("challenge_blog_image", postImage);
        }
        const response = await axios.patch(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
            },
        });
        navigate("/blog");
    };

    setHeaderText("게시글 수정");

    return (
        <div id="createPostContainer">
            <Sidebar
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
            />
            <form
                className="create-post__form"
                onSubmit={handleSubmit(data => onSubmit(data))}
            >
                <div className="create-post__wrapper">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        {...register("title", { required: true })}
                        className="create-post__input-title"
                        placeholder="제목"
                        defaultValue={post.title}
                    />
                    <textarea
                        id="content"
                        name="content"
                        {...register("content", { required: true })}
                        className="create-post__input-content"
                        rows="10"
                        cols="22"
                        placeholder="내용을 입력하세요."
                        defaultValue={post.content}
                    ></textarea>
                    <div className="create-post__image-wrapper">
                        {isLoaded ? (
                            <img src={source} className="create-post__image" />
                        ) : (
                            <div className="create-post__image-fake"></div>
                        )}
                    </div>
                    {/* 모바일에서 실행시 카메라 및 갤러리 선택창이 출력됨 */}
                    <label htmlFor="image" className="create-post__btn">
                        <span className="create-post__btn-text create-post__btn--file">
                            이미지 첨부
                        </span>
                    </label>
                    <small className="create-post__description">
                        이미지는 한 개만 첨부가 가능합니다.
                    </small>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        {...register("image", { required: false })}
                        onChange={handelImageChange}
                        className="hidden"
                    />
                    <button className="create-post__btn">
                        <span className="create-post__btn-text create-post__btn--submit">
                            작성하기
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePostPage;
