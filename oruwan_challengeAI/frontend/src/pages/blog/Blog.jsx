import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./Blog.css";
import Nav from "../../components/layouts/Nav";
import Header from "../../components/layouts/Header";

import Home from "./Home";
import PostDetail from "./PostDetail";
import CategoryPage from "./CategoryPage";
import PopularListPage from "./PopularList";
import PostListPage from "./PostList";
import CreatePostPage from "./CreatePost";
import UpdatePostPage from "./UpdatePost";

function Blog() {
    const [headerText, setHeaderText] = useState("커뮤니티");

    return (
        <div className="container" id="blogContainer">
            <Header title={headerText} />
            <div className="content">
                <Routes>
                    <Route
                        path="/*"
                        element={<Home setHeaderText={setHeaderText} />}
                    />
                    <Route
                        path="/post/:id"
                        element={<PostDetail setHeaderText={setHeaderText} />}
                    />
                    <Route
                        path="/category/:categoryName"
                        element={<CategoryPage />}
                    />
                    <Route
                        path="/popular"
                        element={
                            <PopularListPage setHeaderText={setHeaderText} />
                        }
                    />
                    <Route
                        path="/list/:id"
                        element={<PostListPage setHeaderText={setHeaderText} />}
                    />
                    {/* Create */}
                    <Route
                        path="/create"
                        element={
                            <CreatePostPage setHeaderText={setHeaderText} />
                        }
                    />
                    {/* Delete */}
                    <Route
                        path="/update"
                        element={
                            <UpdatePostPage setHeaderText={setHeaderText} />
                        }
                    />
                </Routes>
            </div>
            <Nav />
        </div>
    );
}

export default Blog;
