import Sider from "./components/sider"
import { routers } from "@/router/routers"
import { Route, Routes } from "react-router"
import "./index.scss"
const prefix = "layout_";
function LayoutFrame() {
  return(
    <>
      <Sider />
      <div className={`${prefix}content`}>
        <Routes>
          {
            routers.map(route => (
              <Route key={route.key} path={route.path} element={route.component} />
            ))
          }
        </Routes>
      </div>
    </>
  )
}
export default LayoutFrame