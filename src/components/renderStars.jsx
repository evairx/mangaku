import Star from "@/src/icon/star";
import StarHalf from "@/src/icon/starHalf"
import StarEmpty from "@/src/icon/starEmpty"

export default function renderStars ({average}) {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(parseFloat(average))) {
        stars.push(<Star onClick={() => console.log(i)} width={28} height={28} key={i} />);
      } else if (i === Math.ceil(parseFloat(average)) && average % 1 !== 0) {
        stars.push(<StarHalf onClick={() => console.log(i)} width={28} height={28} key={i} />);
      } else {
        stars.push(<StarEmpty onClick={() => console.log(i)} width={28} height={28} key={i} />);
      }
    }
  
    return stars;
  };
  