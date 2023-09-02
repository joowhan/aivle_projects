import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function CategoryPage({ match }) {
    const categoryName = match.params.categoryName;
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const [categoryPosts, setCategoryPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (categoryName === "루틴") {
                    url = `${baseUrl}/blog/routine/`;
                } else if (categoryName === "챌린지") {
                    url = `${baseUrl}/blog/challenge/`;
                }
                const response = await axios.get(url);

                setCategoryPosts(response.data);
            } catch (error) {
                console.error(
                    "데이터를 가져오는 도중 오류가 발생했습니다:",
                    error
                );
            }
        };

        fetchData();
    }, [categoryName]);

    return (
        <div>
            <h2 className="title">{categoryName} 카테고리</h2>
            <ul className="card-container">
                {categoryPosts.map(post => (
                    <li key={post.id} className="post-card">
                        {/* 포스트 내용 표시 */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryPage;
