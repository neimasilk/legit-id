import { useState } from 'react';
import { Search, UserCheck, UserX, Edit, Trash2, Eye, Users } from 'lucide-react';
import Header from '../components/Layout/Header';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'individual' | 'institution' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  createdAt: string;
  lastLogin: string;
  phoneNumber?: string;
  institutionName?: string;
}

export default function AdminUserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  const [users] = useState<User[]>([
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      role: 'individual',
      status: 'active',
      verificationStatus: 'verified',
      createdAt: '2024-01-15',
      lastLogin: '2024-12-29',
      phoneNumber: '+1 234 567 8900'
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'individual',
      status: 'active',
      verificationStatus: 'pending',
      createdAt: '2024-02-20',
      lastLogin: '2024-12-28',
      phoneNumber: '+1 234 567 8901'
    },
    {
      id: '3',
      fullName: 'TechCorp Solutions',
      email: 'admin@techcorp.com',
      role: 'institution',
      status: 'active',
      verificationStatus: 'verified',
      createdAt: '2024-03-10',
      lastLogin: '2024-12-30',
      institutionName: 'TechCorp Solutions Inc.'
    },
    {
      id: '4',
      fullName: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'individual',
      status: 'suspended',
      verificationStatus: 'rejected',
      createdAt: '2024-01-25',
      lastLogin: '2024-12-15',
      phoneNumber: '+1 234 567 8902'
    },
    {
      id: '5',
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'admin',
      status: 'active',
      verificationStatus: 'verified',
      createdAt: '2024-01-01',
      lastLogin: '2024-12-30',
      phoneNumber: '+1 234 567 8903'
    },
    {
      id: '6',
      fullName: 'FinanceHub Ltd',
      email: 'contact@financehub.com',
      role: 'institution',
      status: 'inactive',
      verificationStatus: 'not_submitted',
      createdAt: '2024-04-05',
      lastLogin: '2024-11-15',
      institutionName: 'FinanceHub Ltd'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerification = verificationFilter === 'all' || user.verificationStatus === verificationFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'institution':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users in the system</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="individual">Individual</option>
              <option value="institution">Institution</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="not_submitted">Not Submitted</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.institutionName || user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phoneNumber && (
                          <div className="text-xs text-gray-400">{user.phoneNumber}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationBadge(user.verificationStatus)}`}>
                        {user.verificationStatus.replace('_', ' ').charAt(0).toUpperCase() + user.verificationStatus.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1" aria-label="View user details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1" aria-label="Edit user">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1" aria-label="Delete user">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bulk Actions:</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-2">
                <UserCheck className="w-4 h-4" />
                <span>Activate Selected</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center space-x-2">
                <UserX className="w-4 h-4" />
                <span>Suspend Selected</span>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredUsers.length} users found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}