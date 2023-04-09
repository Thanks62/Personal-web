import HI_GIRL from "@/assets/imgs/hi_girl.png";
import "./index.scss"
const prefix = "opening-";
function Opening() {
  return(
    <div className={`${prefix}container`}>
      <div className={`${prefix}circle`} />
      <div className={`${prefix}girl`} >
        <img width={160} src={HI_GIRL} alt="hi"/>
        <div className={`${prefix}text`}>WELCOME</div>
      </div>
    </div>
  )
}
export default Opening