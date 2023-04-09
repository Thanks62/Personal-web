import { useCallback, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'// 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw' // 解析标签，支持html语法
import withRouter from "@/components/withRouter"
import Loading from "../../components/loading"
const DATA = {
  "1": {
    "content": "/works/ready-go/ReadyGo.md"
  },
  "2": {
    "content": "/works/mianyiti/MianYiTi.md"
  }
}
function WorkDetail(props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const fetchData = useCallback((id) => {
    setLoading(true)
    try {
      if(DATA[id]) {
        fetch(DATA[id]?.content).then(res => res.text()).then(text => setContent(text))
      } else {
        throw new Error('error')
      }
    } catch (e) {
      setContent('加载作品出错...')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchData(props.param.id)
  }, [props.param.id, fetchData])
  return (
    <div className="page-container">
      {
        loading? 
          <Loading /> : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, { singleTilde: false }]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          )
      }
    </div>
  )
}
const WorkDetailWithRouter = withRouter(WorkDetail)
export default WorkDetailWithRouter