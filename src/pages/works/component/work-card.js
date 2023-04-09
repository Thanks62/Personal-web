
import ContentMianyiti from "./content-mianyiti"
import { Divider, Tag } from "antd"
import { Link } from "react-router-dom"
import "./work-card.scss"
import ContentReadyGo from "./content-readygo"
import BG_MIANYITI from "@/assets/imgs/bg-mianyiti.png"
import BG_READYGO from "@/assets/imgs/bg-readygo.png"
const prefix = "work-card_"
const TAG_COLOR = ["magenta", "red", "volcano", "orange", "gold"]
const COMPONENT = {
  "MIANYITI": <ContentMianyiti />,
  "READYGO": <ContentReadyGo />
}
const BG = {
  "MIANYITI": BG_MIANYITI,
  "READYGO": BG_READYGO
}
function WorkCard(props) {
  const { name, description, component, id, tags } = props.data
  return (
    <>
      <div className={`${prefix}header`}>
        <div className={`${prefix}header--title`}>「{name}」</div>
        <div className={`${prefix}header--tags`}>
          {
            tags?.map((tag, index) => (
              <div key={tag}>
                <Tag color={TAG_COLOR[index%5]}>
                  {props.data[tag] || tag}
                </Tag>
                {index !== tags.length-1 && <Divider type="vertical" />}
              </div>
            ))
          }
        </div>
      </div>
      <Link to={`details/${id}`}>
        <div className={`${prefix}container`}>
          <div className={`${prefix}background`}>
            <img src={BG[component]} width="100%" alt="bg" />
          </div>
          <div className={`${prefix}content`}>
            {COMPONENT[component]}
          </div>
          <div className={`${prefix}text`}>
            <div className={`${prefix}text--title`}>{name}</div>
            <div className={`${prefix}text--description`}>{description}</div>
          </div>
        </div>
      </Link>
    </>
  )
}
export default WorkCard