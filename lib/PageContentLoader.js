'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sitepack = require('sitepack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageContentLoader = function (_Component) {
  _inherits(PageContentLoader, _Component);

  function PageContentLoader() {
    _classCallCheck(this, PageContentLoader);

    return _possibleConstructorReturn(this, (PageContentLoader.__proto__ || Object.getPrototypeOf(PageContentLoader)).apply(this, arguments));
  }

  _createClass(PageContentLoader, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setPageState(this.props.page);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setPageState(nextProps.page);
    }
  }, {
    key: 'setPageState',
    value: function setPageState(page) {
      var _this2 = this;

      this.id = page.id;

      if ((0, _sitepack.isContentGetter)(page.content)) {
        page.content().then(function (content) {
          if (_this2.id === page.id) {
            _this2.setState({ isLoading: false, content: content });
          }
        }, function (error) {
          console.error("Error loading content with <Loader />:", error);
          if (_this2.id === page.id) {
            _this2.setState({ isLoading: false, content: undefined, error: error });
          }
        });
        this.setState({ isLoading: true, content: undefined });
      } else {
        this.setState({ isLoading: false, content: page.content });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.id = null;
    }
  }, {
    key: 'render',
    value: function render() {
      if (typeof this.props.render == 'function') {
        return this.props.render(this.state);
      } else {
        return _react2.default.cloneElement(this.props.render, Object.assign({ key: this.props.page.id }, this.state));
      }
    }
  }]);

  return PageContentLoader;
}(_react.Component);

PageContentLoader.propTypes = {
  page: _react.PropTypes.shape({
    id: _react.PropTypes.string.isRequired,
    content: _react.PropTypes.any
  }).isRequired,
  render: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]).isRequired
};
exports.default = PageContentLoader;