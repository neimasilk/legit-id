import React, { useState } from 'react';
import { Search, Eye, Check, X, Clock, User, FileText, Download } from 'lucide-react';

interface Document {
  id: string;
  type: 'national_id' | 'passport' | 'driver_license' | 'utility_bill' | 'bank_statement';
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestType: 'individual' | 'institution';
  institutionName?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: Document[];
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export default function AdminVerificationRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [requests] = useState<VerificationRequest[]>([
    {
      id: '1',
      userId: 'user123',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      userPhone: '+1 234 567 8900',
      requestType: 'individual',
      submittedAt: '2024-12-29T10:30:00Z',
      status: 'pending',
      documents: [
        {
          id: 'doc1',
          type: 'national_id',
          fileName: 'national_id_front.jpg',
          uploadDate: '2024-12-29T10:25:00Z',
          status: 'pending'
        },
        {
          id: 'doc2',
          type: 'utility_bill',
          fileName: 'utility_bill_dec2024.pdf',
          uploadDate: '2024-12-29T10:28:00Z',
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      userId: 'user456',
      userName: 'TechCorp Solutions',
      userEmail: 'admin@techcorp.com',
      userPhone: '+1 234 567 8901',
      requestType: 'institution',
      institutionName: 'TechCorp Solutions Inc.',
      submittedAt: '2024-12-28T14:15:00Z',
      status: 'pending',
      documents: [
        {
          id: 'doc3',
          type: 'driver_license',
          fileName: 'business_license.pdf',
          uploadDate: '2024-12-28T14:10:00Z',
          status: 'pending'
        },
        {
          id: 'doc4',
          type: 'bank_statement',
          fileName: 'bank_statement_q4_2024.pdf',
          uploadDate: '2024-12-28T14:12:00Z',
          status: 'pending'
        }
      ]
    },
    {
      id: '3',
      userId: 'user789',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      userPhone: '+1 234 567 8902',
      requestType: 'individual',
      submittedAt: '2024-12-27T09:45:00Z',
      status: 'approved',
      reviewedBy: 'Admin User',
      reviewedAt: '2024-12-28T11:20:00Z',
      documents: [
        {
          id: 'doc5',
          type: 'passport',
          fileName: 'passport_bio_page.jpg',
          uploadDate: '2024-12-27T09:40:00Z',
          status: 'approved'
        }
      ],
      notes: 'All documents verified successfully'
    },
    {
      id: '4',
      userId: 'user321',
      userName: 'Bob Johnson',
      userEmail: 'bob.johnson@example.com',
      userPhone: '+1 234 567 8903',
      requestType: 'individual',
      submittedAt: '2024-12-26T16:30:00Z',
      status: 'rejected',
      reviewedBy: 'Admin User',
      reviewedAt: '2024-12-27T10:15:00Z',
      documents: [
        {
          id: 'doc6',
          type: 'national_id',
          fileName: 'id_card_blurry.jpg',
          uploadDate: '2024-12-26T16:25:00Z',
          status: 'rejected'
        }
      ],
      notes: 'Document quality too low, ID number not clearly visible'
    }
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.requestType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'national_id':
      case 'passport':
      case 'driver_license':
        return <User className="w-4 h-4" />;
      case 'utility_bill':
      case 'bank_statement':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
    setShowModal(false);
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage identity verification requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{requests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="institution">Institution</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Requests ({filteredRequests.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.institutionName || request.userName}
                        </div>
                        <div className="text-sm text-gray-500">{request.userEmail}</div>
                        <div className="text-xs text-gray-400">{request.userPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.requestType === 'institution' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.requestType === 'institution' ? 'Institution' : 'Individual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {request.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center space-x-1 text-sm text-gray-500">
                            {getDocumentIcon(doc.type)}
                            <span>{doc.type.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          aria-label="View request details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              aria-label="Approve request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              aria-label="Reject request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verification Request Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">User Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedRequest.institutionName || selectedRequest.userName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedRequest.userEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedRequest.userPhone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Request Type</label>
                        <p className="text-sm text-gray-900 capitalize">{selectedRequest.requestType}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Submitted</label>
                        <p className="text-sm text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Documents</h4>
                    <div className="space-y-3">
                      {selectedRequest.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getDocumentIcon(doc.type)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">{doc.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                              doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Review Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.notes}</p>
                  </div>
                )}
                
                {selectedRequest.reviewedBy && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Review Information</h4>
                    <div className="text-sm text-gray-600">
                      <p>Reviewed by: {selectedRequest.reviewedBy}</p>
                      <p>Reviewed at: {selectedRequest.reviewedAt && new Date(selectedRequest.reviewedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                {selectedRequest.status === 'pending' && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleReject(selectedRequest.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}