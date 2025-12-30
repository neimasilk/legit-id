import React, { useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Shield, Eye } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useVerificationStore } from '../stores/verificationStore'
import Header from '../components/Layout/Header'

const VerificationRequestsPage: React.FC = () => {
  const { user } = useAuthStore()
  const { requests, loading, updateRequest } = useVerificationStore()

  useEffect(() => {
    if (user) {
      // This would normally fetch requests, but we'll use mock data for demo
    }
  }, [user])

  const handleApprove = async (requestId: string) => {
    await updateRequest(requestId, 'approved')
  }

  const handleReject = async (requestId: string) => {
    await updateRequest(requestId, 'rejected')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Mock data for demonstration
  const mockRequests = [
    {
      id: '1',
      requester_name: 'Bank ABC',
      verification_type: 'Identity Verification',
      message: 'Request for customer onboarding verification',
      status: 'pending',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      requester_name: 'E-Commerce Platform XYZ',
      verification_type: 'Age Verification',
      message: 'Age verification for restricted product purchase',
      status: 'approved',
      created_at: '2024-01-14T14:20:00Z',
    },
    {
      id: '3',
      requester_name: 'Telecom Provider DEF',
      verification_type: 'Address Verification',
      message: 'SIM card registration verification',
      status: 'rejected',
      created_at: '2024-01-13T09:15:00Z',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Requests</h1>
          <p className="text-gray-600">
            Manage verification requests from institutions and third parties
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {mockRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.requester_name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Type:</span> {request.verification_type}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {request.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        Requested on {new Date(request.created_at).toLocaleDateString()} at{' '}
                        {new Date(request.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="mt-4 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleReject(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                  </div>
                )}

                {request.status !== 'pending' && (
                  <div className="mt-4 flex items-center justify-end">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {mockRequests.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Verification Requests</h3>
              <p className="text-gray-600">
                You don't have any pending verification requests at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Verification History */}
        <div className="mt-8 bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Verification History</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">12</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-3xl font-bold text-success-600 mb-2">8</div>
                <div className="text-sm text-success-700">Approved</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">2</div>
                <div className="text-sm text-red-700">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationRequestsPage