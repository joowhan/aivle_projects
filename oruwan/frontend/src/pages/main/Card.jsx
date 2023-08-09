import "./Card.css";

const Card = (imgUrl, altText, text) => {
    return (
        <div className="card">
            <img className="img-fluid rounded" alt={altText} src={imgUrl} />
            <div class="card-content">
                <p id="card_title">{text}</p>
                <p id="card_time">인증 시간</p>
            </div>
        </div>
    );
};
export default Card;
