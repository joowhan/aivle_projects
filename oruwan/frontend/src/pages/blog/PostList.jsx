import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import BlogMainPopularCard from "../../components/blog/MainPopularCard";

const PostListPage = ({ setHeaderText }) => {
    const [posts, setPosts] = useState([]);

    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${baseUrl}/blog/routine_blog/`,
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setHeaderText("전체 글 보기");
    }, []);

    return (
        <div id="popularListContainer">
            <div className="popular-list__content">
                <ul>
                    {posts.map(post => (
                        <BlogMainPopularCard
                            isWide={true}
                            post={post}
                            key={post.id}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostListPage;
