import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

import BlogMainPopularCard from "../../components/blog/MainPopularCard";

function Home({ setHeaderText }) {
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);
    const token = sessionStorage.getItem("token");

    const [fullPosts, setFullPosts] = useState([]);
    const [fullPopularPosts, setFullPopularPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(true); // 기본 카테고리는 '루틴'으로 설정합니다.

    // 루틴-챌린지 카테고리 변경
    const handleCategoryChange = event => {
        event.preventDefault();
        if (event.target.innerText === "루틴") {
            setSelectedCategory(true);
        } else {
            setSelectedCategory(false);
        }
    };
    useEffect(() => {
        setHeaderText("커뮤니티");
    });

    // 사용자가 사이드바 버튼을 누를때마다 루틴/챌린지 목록을 새로 받아옴
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (selectedCategory) {
                    url = `${baseUrl}/blog/routine_blog/`;
                } else {
                    url = `${baseUrl}/blog/challenge_blog/`;
                }
                const response = await axios.get(url, {
                    headers: { Authorization: `Token ${token}` },
                });

                // 일단 10개까지만 (이후 일정 날짜를 기준으로 불러오게 되면 수정할 것)
                if (response.data.results.length > 0) {
                    setFullPosts(response.data.results);
                } else {
                    return [];
                }
            } catch (error) {
                console.error(
                    "데이터를 가져오는 도중 오류가 발생했습니다:",
                    error
                );
            }
        };

        fetchData();
    }, [selectedCategory]);

    // 인기글, 최신글 목록 설정 (페이지에는 5개까지 보이게 하고, 더보기 누르면 인기글 10개까지)
    useEffect(() => {
        setFullPopularPosts(
            fullPosts.sort((a, b) => b.like - a.like).slice(0, 10)
        );
        setPopularPosts(fullPosts.sort((a, b) => b.like - a.like).slice(0, 5));
        setRecentPosts(
            fullPosts.sort((a, b) => b.created_at - a.created_at).slice(0, 5)
        );
    }, [fullPosts]);

    return (
        <div className="home" id="homeWrapper">
            <div className="popular-posts">
                <div className="main__title-wrapper">
                    <h2 className="main__title">인기글</h2>
                    <Link
                        to="/blog/popular/"
                        className="main__more-link right-align"
                        state={{ posts: fullPopularPosts }}
                    >
                        더보기 {">"}
                    </Link>
                </div>
                <div className="scroll-container">
                    <ul className="card-container">
                        {popularPosts.map(post => (
                            <BlogMainPopularCard
                                key={post.id}
                                post={post}
                                isWide={false}
                                isRoutine={selectedCategory}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="main__title-wrapper">
                <h2 className="main__title">최신 게시글</h2>
                <Link
                    to="/blog/create"
                    state={{ isRoutine: true }}
                    className="main__more-link right-align"
                >
                    글쓰기
                </Link>
            </div>
            <div className="recent-posts">
                <Sidebar
                    selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                />
                <div className="">
                    <ul className="main__recent-wrapper">
                        {recentPosts.map(post => (
                            <BlogMainPopularCard
                                key={post.id}
                                post={post}
                                isWide={true}
                                isRoutine={selectedCategory}
                            />
                        ))}
                    </ul>
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
