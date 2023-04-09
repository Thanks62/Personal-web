import Sider from "./components/sider"
import { routers } from "@/router/routers"
import { Navigate, Route, Routes } from "react-router"
import "./index.scss"
const prefix = "layout_";
function LayoutFrame() {
  return(
    <>
      <Sider />
      <div className={`${prefix}main-container`}>
        <div className={`${prefix}content`}>
          <Routes>
            {
              routers.map(route => (
                <Route
                  key={route.key}
                  path={route.path}
                  element={route.component}
                />
              ))
            }
            <Route path="/" element={<Navigate to="/home"/>} />
            <Route path="*" element={<Navigate to="/404"/>} />
          </Routes>
        </div>
        <div className={`${prefix}footer`}>Create by Thanks moon.</div>
      </div>
    </>
  )
}
export default LayoutFrame