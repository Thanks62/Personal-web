import LOGO from "@/assets/imgs/logo-readygo.png"
import FLOWER from "@/assets/imgs/work_img_flower.png"
import "./work-card.scss";
const prefix = "works-readygo_"
function ContentReadyGo(props) {
  return (
    <div className={`${prefix}content`}>
      <img className={`${prefix}logo`} src={LOGO} alt="logo" width={80} />
      <img className={`${prefix}flower1`} src={FLOWER} alt="flower" width={40} />
      <img className={`${prefix}flower2`} src={FLOWER} alt="flower" width={30} />
      <img className={`${prefix}flower3`} src={FLOWER} alt="flower" width={20} />
      <img className={`${prefix}flower4`} src={FLOWER} alt="flower" width={30} />
    </div>
  )
}
export default ContentReadyGo