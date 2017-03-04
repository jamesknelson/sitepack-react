import { isPage } from 'sitepack'
import React, { Component, PropTypes } from 'react'
import Junctions, { createConverter, locationsEqual } from 'junctions'


export default class Router extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired,

  }

  static childContextTypes = {
    history: PropTypes.object,
    getPathForPageId: PropTypes.func,
    isPathActive: PropTypes.func,
  }

  getChildContext() {
    return {
      history: this.props.history,
      getPathForPageId: this.getPathForPageId,
      isPathActive: this.isPathActive,
    }
  }

  getPathForPageId = (pageId) => {
    const page = this.props.site.pages[pageId]
    if (!page) {
      console.warn(`Tried to get Path for non-existent page ID "${pageId}".`)
      return ''
    }
    else {
      return page.absolutePath
    }
  }
  isPathActive = (path, exact) => {
    return exact
      ? path === this.state.location.pathname
      : this.state.location.pathname.indexOf(path) === 0
  }

  componentWillMount() {
    this.converter = createConverter(this.props.site.rootPage.junction)
    this.handleLocationChange(this.props.history.location)
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(this.handleLocationChange)
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
      this.unlisten = null  
    }
  }

  componentWillReceiveProps(nextProps) {
    // Don't recreate the converter unless we need to, as it can be an expensive operation,
    // and is only needed when the application loads new code
    if (this.props.site.rootPage.junction !== nextProps.site.rootPage.junction) {
      this.converter = createConverter(this.props.site.rootPage.junction, nextProps.site.rootPage.junction)
    }
  }

  handleLocationChange = (location) => {
    const route = this.converter.route(location)
    const canonicalLocation = route && this.converter.locate(route)

    if (route && !locationsEqual(location, canonicalLocation)) {
      this.props.history.replace(canonicalLocation)
    }

    this.setState({ route, location })
  }

  render() {
    const site = this.props.site
    const pages = site.pages
    const routes = [site.rootPage]
    let route = this.state.route

    if (route === undefined) {
      // Render an empty wrapper for 404
      return React.createElement(site.rootPage.wrapper, { page: site.rootPage })
    }

    while (route) {
      routes.push(pages[route.data.pageId])
      route = route.next
    }

    let lastContent = routes[routes.length - 1].content
    while (lastContent && isPage(lastContent)) {
      routes.push(lastContent)
      lastContent = lastContent.content
    }

    return (
      <Route site={site} routes={routes} converter={this.converter} />
    )
  }
}


class Route extends Component {
  static propTypes = {
    routes: PropTypes.array,
  }

  componentDidMount() {
    this.updateDocumentTitle()
  }

  componentDidUpdate() {
    this.updateDocumentTitle()
  }

  updateDocumentTitle() {
    const routes = this.props.routes
    if (routes.length === 1) {
      document.title = routes[0].title || ''
    }
  }

  render() {
    const [page, ...routes] = this.props.routes

    const content =
      routes.length
        ? <Route routes={routes} />
        : page.content

    const wrappedContent =
      page.wrapper
        ? React.createElement(page.wrapper, { page }, content)
        : content

    return wrappedContent || <div />
  }
}
