import { useCallback, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'// 划线、表、任务列表和直接url等的语法扩展
import rehypeRaw from 'rehype-raw' // 解析标签，支持html语法
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import withRouter from "@/components/withRouter"
import Loading from "@/components/loading"
const DATA = {
  "1": {
    "content": "/notes/React架构.md"
  },
  "2": {
    "content": "/notes/React - Stack Reconciler.md"
  },
  "3": {
    "content": "/notes/浏览器进程组成.md"
  },
  "4": {
    "content": "/notes/浏览器渲染过程.md"
  }
}
function NoteDetail(props) {
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
      setContent('加载笔记出错...')
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
              className="markdown-body"
              remarkPlugins={[remarkGfm, { singleTilde: false }]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({node, inline, className, children, language='js', ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={atomDark}
                      PreTag="div"
                      language={language}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )
      }
    </div>
  )
}
const NoteDetailWithRouter = withRouter(NoteDetail)
export default NoteDetailWithRouter