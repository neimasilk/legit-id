import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Download, Search, Filter, User, FileText, Shield } from 'lucide-react';

interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  document_type: 'national_id' | 'passport' | 'driver_license';
  document_number: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  documents: {
    front_image: string;
    back_image?: string;
    selfie_image: string;
  };
}

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    // Mock data for demonstration
    const mockRequests: VerificationRequest[] = [
      {
        id: '1',
        user_id: 'user123',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        document_type: 'national_id',
        document_number: 'ID123456789',
        status: 'pending',
        submitted_at: '2024-01-20T10:30:00Z',
        documents: {
          front_image: '/api/placeholder/400/250',
          back_image: '/api/placeholder/400/250',
          selfie_image: '/api/placeholder/400/250'
        }
      },
      {
        id: '2',
        user_id: 'user456',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        document_type: 'passport',
        document_number: 'P987654321',
        status: 'approved',
        submitted_at: '2024-01-19T14:20:00Z',
        reviewed_at: '2024-01-19T16:45:00Z',
        reviewer_notes: 'All documents clear and valid',
        documents: {
          front_image: '/api/placeholder/400/250',
          selfie_image: '/api/placeholder/400/250'
        }
      },
      {
        id: '3',
        user_id: 'user789',
        user_name: 'Bob Johnson',
        user_email: 'bob@example.com',
        document_type: 'driver_license',
        document_number: 'DL555666777',
        status: 'rejected',
        submitted_at: '2024-01-18T09:15:00Z',
        reviewed_at: '2024-01-18T11:30:00Z',
        reviewer_notes: 'Document photo unclear, selfie does not match',
        documents: {
          front_image: '/api/placeholder/400/250',
          back_image: '/api/placeholder/400/250',
          selfie_image: '/api/placeholder/400/250'
        }
      }
    ];

    setRequests(mockRequests);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.document_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleApprove = (requestId: string) => {
    if (!reviewNotes.trim()) {
      alert('Please provide review notes');
      return;
    }

    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'approved', reviewed_at: new Date().toISOString(), reviewer_notes: reviewNotes }
        : request
    ));
    setSelectedRequest(null);
    setReviewNotes('');
  };

  const handleReject = (requestId: string) => {
    if (!reviewNotes.trim()) {
      alert('Please provide review notes');
      return;
    }

    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected', reviewed_at: new Date().toISOString(), reviewer_notes: reviewNotes }
        : request
    ));
    setSelectedRequest(null);
    setReviewNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Management</h1>
          <p className="text-gray-600">Review and manage identity verification requests</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or document number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Processed</p>
                <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Verification Requests</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{request.user_name}</h3>
                      <p className="text-sm text-gray-500">{request.user_email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          <FileText className="inline h-4 w-4 mr-1" />
                          {request.document_type.replace('_', ' ').toUpperCase()}: {request.document_number}
                        </span>
                        <span className="text-sm text-gray-600">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {new Date(request.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                    
                    {request.status === 'pending' && (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Review
                      </button>
                    )}
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {request.reviewer_notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Review Notes:</strong> {request.reviewer_notes}
                    </p>
                    {request.reviewed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Reviewed on {new Date(request.reviewed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No verification requests found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Review Verification Request</h2>
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setReviewNotes('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* User Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Name:</strong> {selectedRequest.user_name}</p>
                    <p><strong>Email:</strong> {selectedRequest.user_email}</p>
                    <p><strong>Document Type:</strong> {selectedRequest.document_type.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Document Number:</strong> {selectedRequest.document_number}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.submitted_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Document Images */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Submitted Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Front Image</p>
                      <img
                        src={selectedRequest.documents.front_image}
                        alt="Document Front"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    {selectedRequest.documents.back_image && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Back Image</p>
                        <img
                          src={selectedRequest.documents.back_image}
                          alt="Document Back"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    <div className={selectedRequest.documents.back_image ? '' : 'md:col-span-2'}>
                      <p className="text-sm text-gray-600 mb-2">Selfie Image</p>
                      <img
                        src={selectedRequest.documents.selfie_image}
                        alt="Selfie"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="mb-6">
                  <label htmlFor="review-notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes *
                  </label>
                  <textarea
                    id="review-notes"
                    rows={4}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter your review notes here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedRequest(null);
                      setReviewNotes('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}