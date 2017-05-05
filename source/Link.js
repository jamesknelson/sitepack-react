import React, { Component } from 'react'
import PropTypes from 'prop-types'


function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}


function defaultLinkTheme({ renderLink, className, style, active, children }) {
  return renderLink({ className, style }, children)
}

export default class Link extends Component {
  static propTypes = {
    exact: PropTypes.bool,
    onClick: PropTypes.func,
    page: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    theme: PropTypes.func.isRequired,
  }

  static contextTypes = {
    isPathActive: PropTypes.func.isRequired,
    getPathForPageId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    theme: defaultLinkTheme,
    exact: false,
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.defaultPrevented ||
        isModifiedEvent(event) ||
        !isLeftClickEvent(event) ||
        this.props.target
    ) {
      return
    }

    const history = this.props.history || this.context.history

    if (!history) {
      throw new Error('<Link> requires a history object to be passed in, either via props or via context.')
    }

    const location = this.getLocation()

    if (typeof location === 'string') {
      return
    }

    event.preventDefault()

    history.push(location)
  }

  getLocation() {
    let { page, href } = this.props

    if (page && href) {
      console.warning('You supplied both a "page" and a "href" to <Link>. Ignoring page...')
    }

    if (href) {
      if (href.indexOf('://') !== -1 || href[0] == '#') {
        return href
      }
      const [path, hash] = href.split('#')
      return { pathname: path, hash }
    }
    else if (page) {
      const [pageId, hash] = page.split('#')
      return { pathname: this.context.getPathForPageId(pageId), hash }
    }
    else {
      console.warning('Your <Link> has no "page" or "href"!')
    }
  }

  renderLink = (props, ...children) => {
    const { exact, page, theme, className, style, ...other } = this.props
    const location = this.getLocation()

    if (children.length === 0 && props.children) {
      children[0] = props.children
    }

    return React.createElement('a', {
      ...other,
      ...props,
      onClick: this.handleClick,
      href: typeof location === 'string' ? location : location.pathname,
    }, ...children)
  }

  render() {
    const { exact, theme, className, style, children } = this.props
    const location = this.getLocation()
    const active = typeof location !== 'string' && this.context.isPathActive(location.pathname, exact)
    return theme({ renderLink: this.renderLink, active, className, style, children })
  }
}
