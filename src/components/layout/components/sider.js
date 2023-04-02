import './sider.scss';
import Avatar from '@/assets/imgs/avatar.jpg';
import { routersConfig } from '../../../router/routers';
import { Link } from 'react-router-dom';
const prefix = "layout-sider_";
function Menu(props) {
  const { name, icon, path } = props.item
  return <Link to={path}>
    <div className={`${prefix}menus--item`}>
      <div>{icon}</div>
      <div>
        {name}
      </div>
    </div>
  </Link>
}
function Sider(props) {
  return (
    <div className={`${prefix}container`}>
      <Link to="/index">
        <div className={`${prefix}header`}>
          <div className={`${prefix}avatar`}>
            <img src={Avatar} alt="avatar" width="100%" />
          </div>
          <div>Thanks.</div>
        </div>
      </Link>
      <div className={`${prefix}menus`}>
        {
          routersConfig.map(router => {
            if(!router.hideInMenu) {
              return <div key={router.key}><Menu item={router} /></div>
            }
            return null
          })
        }
      </div>
    </div>
  )
}
export default Sider
