import React, { Component, PropTypes } from 'react'
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

  componentWillMount() {
    this.setPageState(this.props.page)
  }

  componentWillReceiveProps(nextProps) {
    this.setPageState(nextProps.page)
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
  }

  render() {
    const props = Object.assign({ page: this.props.page, key: this.props.page.id }, this.state)

    if (typeof this.props.render == 'function') {
      return this.props.render(props)
    }
    else {
      return React.cloneElement(this.props.render, props)
    }
  }
}
