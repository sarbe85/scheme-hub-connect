
import React from 'react';
import UserHeader from '../components/UserHeader';
import ClaimForm from '../components/ClaimForm';

const NewClaimPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Submit a New Claim</h1>
        <p className="text-gray-600 mb-6">Complete the form below to submit a new claim for a government scheme</p>
        
        <div className="max-w-3xl mx-auto">
          <ClaimForm />
        </div>
      </main>
      
      <footer className="mt-auto bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} SchemeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewClaimPage;
