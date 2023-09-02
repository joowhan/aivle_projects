import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/layouts/Nav";
import Header from "../../components/layouts/Header";
import ChallengeImgCard from "../../components/ChallengeImgCard";
import "./ChallengeMain.css";

const ChallengeMainPage = () => {
    const token = sessionStorage.getItem("token");
    const baseUrl = useSelector(state => state.baseUrl.baseUrl);

    // 현재 유저가 참여 중인 챌린지 정보를 이전 페이지에서 받아옴
    const challengeList = useSelector(state => state.myChallengeList);

    const [joinedCardList, setjoinedCardList] = useState([]);
    const [joinableCardList, setjoinableCardList] = useState([]);

    // 현재 유저가 참여 중인 챌린지 정보 가져오기
    const getJoinedChallengeInfo = async userId => {
        const response = await axios.get(
            `${baseUrl}/challenge/joinedchallenges/?user=${userId}/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    // 챌린지에 대한 상세 정보 가져오기
    const getChallengeDetail = async challengeId => {
        const response = await axios.get(
            `${baseUrl}/challenge/joinedchallenges/${challengeId}/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    // 현재 유저가 참여중이지 않은 챌린지 정보 가져오기
    const getJoinableChallengeInfo = async userId => {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${baseUrl}/challenge/joinablechallenges/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return response.data;
    };

    // 참여 중인 챌린지에 대한 카드리스트 저장
    const makeJoinedCardList = async () => {
        const cardList = [];
        challengeList.map(challenge => {
            cardList.push({
                key: challenge.id,
                id: challenge.id,
                title: challenge.title,
                message: challenge.content,
                joinImg: challenge.image_url,
                isJoined: true,
                prize: challenge.prize,
                duration: challenge.duration,
            });
        });
        setjoinedCardList(current => (current = cardList));
    };

    const makeJoinableCardList = async () => {
        let joinableChallenges = await getJoinableChallengeInfo(
            sessionStorage.getItem("user")
        );

        const cardList = [];

        joinableChallenges.map(joinableChallenges => {
            cardList.push({
                key: joinableChallenges.id,
                id: joinableChallenges.id,
                title: joinableChallenges.challenge_name,
                message: joinableChallenges.challenge_content,
                joinImg: joinableChallenges.challenge_image,
                isJoined: false,
            });
        });

        setjoinableCardList(current => (current = cardList));
    };

    useEffect(() => {
        makeJoinedCardList();
        makeJoinableCardList();
    }, []);

    return (
        <div className="container">
            <Header title="챌린지" />
            <p className="home__subtitle">참여 중인 챌린지</p>
            <div>
                {joinedCardList.map((data, index) => (
                    <ChallengeImgCard
                        key={index}
                        index={index}
                        id={data.id}
                        title={data.title}
                        message={data.message}
                        joinImg={data.joinImg}
                        isJoined={data.isJoined}
                    />
                ))}
            </div>
            <p className="home__subtitle">참여 가능한 챌린지</p>
            <div>
                {joinableCardList.map((data, index) => (
                    <ChallengeImgCard
                        key={index}
                        index={index}
                        id={data.id}
                        title={data.title}
                        message={data.message}
                        joinImg={data.joinImg}
                        isJoined={data.isJoined}
                    />
                ))}
            </div>
            <Nav />
        </div>
    );
};

export default ChallengeMainPage;
