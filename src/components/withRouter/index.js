import { useLocation, useNavigate, useParams } from "react-router"

function withRouter(Child) {
  return (props) => {
    const location = useLocation()
    const naigate = useNavigate()
    const param = useParams()
    return <Child {...props} location={location} naigate={naigate} param={param} />
  }
}
export default withRouter