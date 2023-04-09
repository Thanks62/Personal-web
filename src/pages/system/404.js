import IMG from "@/assets/imgs/404.png"
import "./system.scss"
const prefix = "system_";
function ErrorPage() {
  return (
    <div className={`${prefix}container`}>
      <img src={IMG} alt="404" style={{width: "60%"}}/>
    </div>
  )
}
export default ErrorPage