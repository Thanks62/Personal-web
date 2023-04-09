import './sider.scss';
import Avatar from '@/assets/imgs/avatar.jpg';
import { routersConfig } from '../../../router/routers';
import { Link } from 'react-router-dom';
const prefix = "layout-sider_";
function Menu(props) {
  const { name, icon, path } = props.item
  return <Link to={path}>
    <div className={`${prefix}menus--item`} onClick={() => props.changeTitle(name)}>
      <div>{icon}</div>
      <div className={`${prefix}menus--text`}>
        {name}
      </div>
    </div>
  </Link>
}
function Sider(props) {
  const changeTitle = (title="Thanks moon's") => {
    document.title = title
  }
  return (
    <div className={`${prefix}container`}>
      <Link to="/home">
        <div className={`${prefix}header`} onClick={() => changeTitle('主页')}>
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
              return <div key={router.key}><Menu item={router} changeTitle={changeTitle} /></div>
            }
            return null
          })
        }
      </div>
    </div>
  )
}
export default Sider
