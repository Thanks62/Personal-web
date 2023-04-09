import PHOTO from "@/assets/imgs/index_photo.png"
import "./index.scss"
const prefix = "home_"
function Home() {
    const date = new Date()
    return <div className={`${prefix}container`}>
        <div className={`${prefix}date`}>『 {date.getFullYear()}/{date.getMonth()+1}/{date.getDate()} 』</div>
        <div>
            <img src={PHOTO} alt="welcome" width={700} />
        </div>
    </div>
}
export default Home