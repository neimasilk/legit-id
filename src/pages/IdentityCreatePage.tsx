import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, User, Calendar, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useIdentityStore } from '../stores/identityStore'
import Header from '../components/Layout/Header'
import BlockchainIntegration from '../components/BlockchainIntegration'
import { blockchainService } from '../services/blockchainService'

const IdentityCreatePage: React.FC = () => {
  const { user } = useAuthStore()
  const { createIdentity, loading, error } = useIdentityStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idNumber: '',
    documentImages: [] as File[],
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [blockchainTxHash, setBlockchainTxHash] = useState<string>('')
  const [blockchainError, setBlockchainError] = useState<string>('')
  const [showBlockchain, setShowBlockchain] = useState(false)
  const [validationError, setValidationError] = useState<string>('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setFormData(prev => ({
        ...prev,
        documentImages: [...prev.documentImages, ...newFiles]
      }))
      
      // Simulate file upload
      const fileNames = newFiles.map(file => file.name)
      setUploadedFiles(prev => [...prev, ...fileNames])
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentImages: prev.documentImages.filter((_, i) => i !== index)
    }))
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleBlockchainComplete = (txHash: string) => {
    setBlockchainTxHash(txHash)
  }

  const handleBlockchainError = (error: string) => {
    setBlockchainError(error)
  }

  const generateDocumentHash = () => {
    const documentData = JSON.stringify({
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      idNumber: formData.idNumber,
      timestamp: Date.now()
    })
    return blockchainService.generateDocumentHash(documentData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    const success = await createIdentity({
      user_id: user.id,
      full_name: formData.fullName,
      date_of_birth: formData.dateOfBirth,
      id_number: formData.idNumber,
      status: 'pending',
      document_urls: uploadedFiles,
    })

    if (success) {
      navigate('/dashboard')
    }
  }

  const steps = [
    { number: 1, title: 'Personal Information', description: 'Enter your basic details' },
    { number: 2, title: 'Document Upload', description: 'Upload required documents' },
    { number: 3, title: 'Review & Submit', description: 'Review and submit your application' },
    { number: 4, title: 'Blockchain Verification', description: 'Register on blockchain (optional)' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-8 ${
                    currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Digital Identity</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number (KTP/Passport) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="idNumber"
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your ID number"
                      required
                    />
                  </div>
                </div>

                {validationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {validationError}
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.fullName || !formData.dateOfBirth || !formData.idNumber) {
                        setValidationError('Please correct the errors above')
                        return
                      }
                      setValidationError('')
                      setCurrentStep(2)
                    }}
                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Upload Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{file}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Full Name</p>
                      <p className="text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                      <p className="text-gray-900">{formData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">ID Number</p>
                      <p className="text-gray-900">{formData.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Uploaded Documents</p>
                      <p className="text-gray-900">{uploadedFiles.length} file(s)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          By submitting this form, you confirm that all information provided is accurate and 
                          you consent to the verification process. This information will be stored securely 
                          using blockchain technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Continue to Blockchain
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Blockchain Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <BlockchainIntegration
                  userId={user?.id || ''}
                  documentHash={generateDocumentHash()}
                  verificationLevel="basic"
                  onBlockchainComplete={handleBlockchainComplete}
                  onError={handleBlockchainError}
                />

                {blockchainError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {blockchainError}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default IdentityCreatePage

