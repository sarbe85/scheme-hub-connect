
import React from 'react';
import HomeHeader from '../components/HomeHeader';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <LoginForm />
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Having trouble logging in? <Link to="/#contact" className="text-scheme-blue hover:underline">Contact support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} SchemeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
