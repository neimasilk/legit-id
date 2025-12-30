import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow rounded p-6 text-center">
            <h1 className="text-xl font-semibold text-red-600">Terjadi kesalahan pada UI</h1>
            <p className="mt-2 text-gray-700">Silakan muat ulang atau kembali ke beranda.</p>
            <a href="/" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded">Kembali ke Beranda</a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
