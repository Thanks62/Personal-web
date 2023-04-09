import "./index.scss"
import DATA from "./data.json"
import WorkCard from "./component/work-card"
import TITLE from "@/assets/imgs/works_title.png"
const prefix = "works_"
function Works() {
  return (
    <div className="page-container">
      <div className={`${prefix}title`}>
        <img src={TITLE} alt="works" width={80} />
      </div>
      <div className={`${prefix}container`}>
        {
          DATA.map(data => {
            return <div key={data.id}>
              <WorkCard data={data} />
            </div>
          })
        }
      </div>
    </div>
  )
}
export default Works