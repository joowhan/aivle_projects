import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogMainPopularCard from "../../components/blog/MainPopularCard";

const PopularListPage = ({ setHeaderText }) => {
    const location = useLocation();
    const { posts } = location.state;

    useEffect(() => {
        setHeaderText("인기글 목록");
    });

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

export default PopularListPage;
