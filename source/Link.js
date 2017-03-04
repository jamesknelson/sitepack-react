import React, { Component, PropTypes } from 'react'



function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}



function DefaultLinkTheme({ factory, active, children }) {
  return factory({}, children)
}

export default class Link extends Component {
  static propTypes = {
    exact: PropTypes.bool,
    onClick: React.PropTypes.func,
    page: PropTypes.string,
    href: PropTypes.string,
    target: React.PropTypes.string,
    theme: PropTypes.element.isRequired,
  }

  static contextTypes = {
    isPathActive: PropTypes.func.isRequired,
    getPathForPageId: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    theme: <DefaultLinkTheme />,
    exact: false,
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.defaultPrevented) {
      return
    }

    const history = this.props.history || this.context.history
    const location = this.getLocation()

    if (!history) {
      throw new Error('<Link> requires a history object to be passed in, either via props or via context.')
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return
    }

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    if (this.props.target) {
      return
    }

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

  renderLink = (props, children) => {
    const location = this.getLocation()

    return (
      <a
        {...props}
        onClick={this.handleClick}
        href={typeof location === 'string' ? location : location.pathname}
      >
        {children}
      </a>
    )
  }

  render() {
    const location = this.getLocation()
    const active = typeof location !== 'string' && this.context.isPathActive(location.pathname, this.props.exact)
    
    return React.cloneElement(this.props.theme, { factory: this.renderLink, active }, this.props.children)
  }
}
