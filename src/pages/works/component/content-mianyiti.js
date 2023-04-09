import VIRUS1 from "@/assets/imgs/home_img_virus1.png"
import VIRUS2 from "@/assets/imgs/home_img_virus2.png"
import VIRUS3 from "@/assets/imgs/home_img_virus3.png"
import "./work-card.scss";
const prefix = "works-mianyiti_"
function ContentMianyiti(props) {
  return (
    <div>
      <img className={`${prefix}virus1`} src={VIRUS1} alt="virus" width={60} />
      <img className={`${prefix}virus4`} src={VIRUS1} alt="virus" width={30} />
      <img className={`${prefix}virus2`} src={VIRUS2} alt="virus" width={60} />
      <img className={`${prefix}virus5`} src={VIRUS2} alt="virus" width={50} />
      <img className={`${prefix}virus3`} src={VIRUS3} alt="virus" width={60} />
      <img className={`${prefix}virus6`} src={VIRUS3} alt="virus" width={40} />
    </div>
  )
}
export default ContentMianyiti