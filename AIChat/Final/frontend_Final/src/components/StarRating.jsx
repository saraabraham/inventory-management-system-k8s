
const StarRating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<span key={i}><img src="/assets/icons/star-full.svg"></img></span>); // full star
        } else if (i - rating < 1) {
            stars.push(<span key={i}><img src="/assets/icons/star-empty.svg"></img></span>); // empty star or half-star
        } else {
            stars.push(<span key={i}><img src="/assets/icons/star-empty.svg"></img></span>); // empty star
        }
    }

    return <div className="star-rating">{stars}</div>;
};
export default StarRating;