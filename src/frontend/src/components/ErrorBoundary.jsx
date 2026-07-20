import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const homePath = this.props.homePath || '/';
      const title = this.props.title || 'Đã xảy ra lỗi';

      return (
        <div className="min-h-[50vh] flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">
              {this.props.message || 'Trang gặp sự cố không mong muốn. Vui lòng thử tải lại hoặc quay về khu vực an toàn.'}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm cursor-pointer"
              >
                Thử lại
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border text-sm text-slate-700 cursor-pointer"
              >
                Tải lại trang
              </button>
              {/* Dùng <a> thường thay vì <Link>: ErrorBoundary này bọc NGOÀI <Router> (App.jsx),
                  nên khi bắt lỗi, cây con bị crash (bao gồm cả Router) đã unmount — <Link> sẽ
                  không còn Router context và tự crash tiếp, khiến cả trang trắng hoàn toàn. */}
              <a href={homePath} className="px-4 py-2 rounded-lg border text-sm text-slate-700 no-underline">
                Quay lại
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
