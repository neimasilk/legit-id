import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, User, CheckCircle, Clock, AlertCircle, ArrowRight, PlusCircle, Eye } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useIdentityStore } from '../stores/identityStore'
import { useVerificationStore } from '../stores/verificationStore'
import Header from '../components/Layout/Header'

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const { identity, getIdentity } = useIdentityStore()
  const { requests, getRequests } = useVerificationStore()

  useEffect(() => {
    if (user) {
      getIdentity(user.id)
      getRequests(user.id)
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success-600 bg-success-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const recentActivities = [
    {
      id: 1,
      type: 'identity_created',
      description: 'Digital identity created',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'verification_request',
      description: 'Verification request from Bank ABC',
      timestamp: '1 day ago',
      status: 'pending',
    },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.full_name || user.email || 'User'}
          </h1>
          <p className="text-gray-600">
            Manage your digital identity and verification requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Identity Status Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Digital Identity Status</h2>
                {identity && (
                  <Link
                    to="/identity/verify"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                )}
              </div>

              {!identity ? (
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Digital Identity</h3>
                  <p className="text-gray-600 mb-6">
                    Create your digital identity to start using verification services
                  </p>
                  <Link
                    to="/identity/create"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Identity
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Full Name</p>
                      <p className="text-lg text-gray-900">{identity.full_name}</p>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(identity.status)}`}>
                      {getStatusIcon(identity.status)}
                      <span className="text-sm font-medium capitalize">{identity.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">ID Number</p>
                      <p className="text-gray-900">{identity.id_number}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                      <p className="text-gray-900">
                        {new Date(identity.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {identity.status === 'verified' && (
                    <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
                        <span className="text-success-800 font-medium">Identity Verified</span>
                      </div>
                      <p className="text-success-700 text-sm mt-1">
                        Your identity has been successfully verified and is ready for use
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <Link to="/verification/requests" className="text-primary-600 hover:text-primary-700 flex items-center">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-success-100' : 'bg-yellow-100'
                      }`}>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-success-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {!identity && (
                  <Link
                    to="/identity/create"
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Identity
                  </Link>
                )}
                <Link
                  to="/verification/requests"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  View Requests
                </Link>
                <Link
                  to="/profile"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Verification Requests Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Requests</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-success-600">
                    {requests.filter(r => r.status === 'approved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-sm font-medium text-gray-900">
                    {requests.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
