'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function DefaultLinkTheme(_ref) {
  var factory = _ref.factory,
      active = _ref.active,
      children = _ref.children;

  return factory({}, children);
}

var Link = function (_Component) {
  _inherits(Link, _Component);

  function Link() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref2, [this].concat(args))), _this), _this.handleClick = function (event) {
      if (_this.props.onClick) {
        _this.props.onClick(event);
      }

      if (event.defaultPrevented) {
        return;
      }

      var history = _this.props.history || _this.context.history;
      var location = _this.getLocation();

      if (!history) {
        throw new Error('<Link> requires a history object to be passed in, either via props or via context.');
      }

      if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
        return;
      }

      // If target prop is set (e.g. to "_blank"), let browser handle link.
      if (_this.props.target) {
        return;
      }

      if (typeof location === 'string') {
        return;
      }

      event.preventDefault();
      history.push(location);
    }, _this.renderLink = function (props, children) {
      var location = _this.getLocation();

      return _react2.default.createElement(
        'a',
        _extends({}, props, {
          onClick: _this.handleClick,
          href: typeof location === 'string' ? location : location.pathname
        }),
        children
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Link, [{
    key: 'getLocation',
    value: function getLocation() {
      var _props = this.props,
          page = _props.page,
          href = _props.href;


      if (page && href) {
        console.warning('You supplied both a "page" and a "href" to <Link>. Ignoring page...');
      }

      if (href) {
        if (href.indexOf('://') !== -1 || href[0] == '#') {
          return href;
        }

        var _href$split = href.split('#'),
            _href$split2 = _slicedToArray(_href$split, 2),
            path = _href$split2[0],
            hash = _href$split2[1];

        return { pathname: path, hash: hash };
      } else if (page) {
        var _page$split = page.split('#'),
            _page$split2 = _slicedToArray(_page$split, 2),
            pageId = _page$split2[0],
            _hash = _page$split2[1];

        return { pathname: this.context.getPathForPageId(pageId), hash: _hash };
      } else {
        console.warning('Your <Link> has no "page" or "href"!');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var location = this.getLocation();
      var active = typeof location !== 'string' && this.context.isPathActive(location.pathname, this.props.exact);

      return _react2.default.cloneElement(this.props.theme, { factory: this.renderLink, active: active }, this.props.children);
    }
  }]);

  return Link;
}(_react.Component);

Link.propTypes = {
  exact: _react.PropTypes.bool,
  onClick: _react2.default.PropTypes.func,
  page: _react.PropTypes.string,
  href: _react.PropTypes.string,
  target: _react2.default.PropTypes.string,
  theme: _react.PropTypes.element.isRequired
};
Link.contextTypes = {
  isPathActive: _react.PropTypes.func.isRequired,
  getPathForPageId: _react.PropTypes.func.isRequired,
  history: _react.PropTypes.object.isRequired
};
Link.defaultProps = {
  theme: _react2.default.createElement(DefaultLinkTheme, null),
  exact: false
};
exports.default = Link;