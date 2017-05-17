import ExecutionEnvironment from 'exenv'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM, { unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer } from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { isContentGetter } from 'sitepack'


export default class PageContentLoader extends Component {
  static propTypes = {
    page: PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.any,
    }).isRequired,
    render: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]).isRequired,
  }

  constructor(props) {
    super(props)

    this.pageId = 'Sitepack-PageContentLoader-'+props.page.id.replace(/[^\w-]/g, '_')
    this.state = {}
    if (ExecutionEnvironment.canUseDOM) {
      const el = document.getElementById(this.pageId)
      if (el && el.innerHTML) {
        this.state.string = el.innerHTML
      }
    }
  }

  componentDidMount() {
    if (this.content) {
      renderSubtreeIntoContainer(this, this.renderContent(), this.container)
    }
  }
  componentDidUpdate() {
    if (!this.state.string || this.state.content) {
      renderSubtreeIntoContainer(this, this.renderContent(), this.container)
    }
  }

  componentWillMount() {
    this.setPageState(this.props.page)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.setPageState(nextProps.page)
    }
  }

  setPageState(page) {
    this.id = page.id

    if (isContentGetter(page.content)) {
      page.content().then(
        (content) => {
          if (this.id === page.id) {
            this.setState({ isLoading: false, content })
          }
        },
        (error) => {
          console.error("Error loading content with <Loader />:", error)
          if (this.id === page.id) {
            this.setState({ isLoading: false, content: undefined, error })
          }
        }
      )
      this.setState({ isLoading: true, content: undefined })
    }
    else {
      this.setState({ isLoading: false, content: page.content })
    }
  }

  componentWillUnmount() {
    this.id = null
    try {
      ReactDOM.unmountComponentAtNode(this.container)
    } catch (e) { }
  }

  setContainer = (el) => {
    this.container = el
  }

  renderContent() {
    const state = this.state
    const props = {
      page: this.props.page,
      key: this.props.page.id,
      isLoading: state.isLoading,
      content: state.content,
      error: state.error,
    }

    return (
      typeof this.props.render == 'function'
        ? this.props.render(props)
        : React.cloneElement(this.props.render, props)
    )
  }

  render() {
    const props = this.props
    const state = this.state

    if (!ExecutionEnvironment.canUseDOM) {
      const string = ReactDOMServer.renderToStaticMarkup(this.renderContent())
      return <div ref={this.setContainer} className={props.className} style={props.style} id={this.pageId} dangerouslySetInnerHTML={{ __html: string }} />
    }
    else if (state.string) {
      return <div ref={this.setContainer} className={props.className} style={props.style} id={this.pageId} dangerouslySetInnerHTML={{ __html: state.string }} />
    }
    else {
      return <div ref={this.setContainer} className={props.className} style={props.style} id={this.pageId}>{this.renderContent()}</div>
    }
  }
}
