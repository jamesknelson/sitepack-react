'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sitepack = require('sitepack');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _junctions = require('junctions');

var _junctions2 = _interopRequireDefault(_junctions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Router = function (_Component) {
  _inherits(Router, _Component);

  function Router() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Router);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Router.__proto__ || Object.getPrototypeOf(Router)).call.apply(_ref, [this].concat(args))), _this), _this.getPathForPageId = function (pageId) {
      var page = _this.props.site.pages[pageId];
      if (!page) {
        console.warn('Tried to get Path for non-existent page ID "' + pageId + '".');
        return '';
      } else {
        return page.absolutePath;
      }
    }, _this.isPathActive = function (path, exact) {
      return exact ? path === _this.state.location.pathname : _this.state.location.pathname.indexOf(path) === 0;
    }, _this.handleLocationChange = function (location) {
      var route = _this.converter.route(location);
      var canonicalLocation = route && _this.converter.locate(route);

      if (route && !(0, _junctions.locationsEqual)(location, canonicalLocation)) {
        _this.props.history.replace(canonicalLocation);
      }

      _this.setState({ route: route, location: location });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Router, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        history: this.props.history,
        getPathForPageId: this.getPathForPageId,
        isPathActive: this.isPathActive
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.converter = (0, _junctions.createConverter)(this.props.site.rootPage.junction);
      this.handleLocationChange(this.props.history.location);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.unlisten = this.props.history.listen(this.handleLocationChange);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unlisten) {
        this.unlisten();
        this.unlisten = null;
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // Don't recreate the converter unless we need to, as it can be an expensive operation,
      // and is only needed when the application loads new code
      if (this.props.site.rootPage.junction !== nextProps.site.rootPage.junction) {
        this.converter = (0, _junctions.createConverter)(this.props.site.rootPage.junction, nextProps.site.rootPage.junction);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var site = this.props.site;
      var pages = site.pages;
      var routes = [site.rootPage];
      var route = this.state.route;

      if (route === undefined) {
        // Render an empty wrapper for 404
        return _react2.default.createElement(site.rootPage.wrapper, { page: site.rootPage });
      }

      while (route) {
        routes.push(pages[route.data.pageId]);
        route = route.next;
      }

      var lastContent = routes[routes.length - 1].content;
      while (lastContent && (0, _sitepack.isPage)(lastContent)) {
        routes.push(lastContent);
        lastContent = lastContent.content;
      }

      return _react2.default.createElement(Route, { site: site, routes: routes, converter: this.converter });
    }
  }]);

  return Router;
}(_react.Component);

Router.propTypes = {
  history: _react.PropTypes.object.isRequired,
  site: _react.PropTypes.object.isRequired

};
Router.childContextTypes = {
  history: _react.PropTypes.object,
  getPathForPageId: _react.PropTypes.func,
  isPathActive: _react.PropTypes.func
};
exports.default = Router;

var Route = function (_Component2) {
  _inherits(Route, _Component2);

  function Route() {
    _classCallCheck(this, Route);

    return _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).apply(this, arguments));
  }

  _createClass(Route, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateDocumentTitle();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateDocumentTitle();
    }
  }, {
    key: 'updateDocumentTitle',
    value: function updateDocumentTitle() {
      var routes = this.props.routes;
      if (routes.length === 1) {
        document.title = routes[0].title || '';
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$routes = _toArray(this.props.routes),
          page = _props$routes[0],
          routes = _props$routes.slice(1);

      var content = routes.length ? _react2.default.createElement(Route, { routes: routes }) : page.content;

      var wrappedContent = page.wrapper ? _react2.default.createElement(page.wrapper, { page: page }, content) : content;

      return wrappedContent || _react2.default.createElement('div', null);
    }
  }]);

  return Route;
}(_react.Component);

Route.propTypes = {
  routes: _react.PropTypes.array
};