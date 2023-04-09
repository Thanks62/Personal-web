import TITLE from "@/assets/imgs/notes_title.png";
import { category } from "./data";
import { Divider } from "antd"
import { useState } from "react"
import "./index.scss"
import { Link } from "react-router-dom";
const prefix = "notes_"
function Notes() {
  const [list, setList] = useState(category)
  return (
    <div className="page-container">
      <div className={`${prefix}title`}>
        <img src={TITLE} alt="title" width={80} />
      </div>
      <div>
        {
          list.map(_category => 
            <div key={_category.id}>
              <Divider  orientation="left" plain>
                {_category.name}
              </Divider>
              <div className={`${prefix}note--container`}>
                {
                  _category.noteList?.map(note => (
                    <div key={note.id} className={`${prefix}note`}>
                      <Link to={`details/${note.id}`}>
                        <div className={`${prefix}note--img`}>
                          <img alt={note.title} src={note.img} width="100%" />
                        </div>
                        <div className={`${prefix}note--bg`} />
                        <div title={note.title} className={`${prefix}note--title`}>
                          {note.title}
                        </div>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default Notes