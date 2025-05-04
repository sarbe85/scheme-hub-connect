
import React from 'react';
import UserHeader from '../components/UserHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const userName = "John Doe"; // This would come from authentication state in a real app

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userName}</h1>
        
        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto py-6 bg-scheme-blue hover:bg-scheme-teal">
              <Link to="/dashboard/new-claim" className="flex flex-col items-center text-lg">
                <span>Submit New Claim</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 border-scheme-blue text-scheme-blue hover:bg-scheme-blue hover:text-white">
              <Link to="/dashboard/claims" className="flex flex-col items-center text-lg">
                <span>View My Claims</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 border-scheme-blue text-scheme-blue hover:bg-scheme-blue hover:text-white">
              <Link to="/dashboard/profile" className="flex flex-col items-center text-lg">
                <span>Update Profile</span>
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Claims Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Claims Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="bg-scheme-light-blue">
                <CardTitle>Pending</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-scheme-blue text-center">2</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="bg-green-100">
                <CardTitle>Approved</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-green-600 text-center">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="bg-red-100">
                <CardTitle>Rejected</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-red-600 text-center">1</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Recent Claims */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Claims</h2>
            <Button asChild variant="link" className="text-scheme-blue">
              <Link to="/dashboard/claims">View All Claims</Link>
            </Button>
          </div>
          
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Claim ID</th>
                    <th className="py-3 px-4 text-left">Scheme</th>
                    <th className="py-3 px-4 text-left">Submitted On</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">#123456</td>
                    <td className="py-3 px-4">PM-KISAN</td>
                    <td className="py-3 px-4">15 May 2023</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="link" size="sm" className="text-scheme-blue">View Details</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">#123455</td>
                    <td className="py-3 px-4">Ayushman Bharat</td>
                    <td className="py-3 px-4">10 May 2023</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Approved</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="link" size="sm" className="text-scheme-blue">View Details</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">#123454</td>
                    <td className="py-3 px-4">Ujjwala Yojana</td>
                    <td className="py-3 px-4">5 May 2023</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Rejected</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="link" size="sm" className="text-scheme-blue">View Details</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>
        
        {/* Recommended Schemes */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Recommended Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Jan Dhan Yojana</CardTitle>
                <CardDescription>Financial inclusion program for banking access</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Based on your profile, you may be eligible for this scheme.</p>
                <Button asChild className="w-full bg-scheme-blue hover:bg-scheme-teal">
                  <Link to="/dashboard/new-claim">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Saubhagya Scheme</CardTitle>
                <CardDescription>Electricity connection to all households</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Based on your address, you may be eligible for this scheme.</p>
                <Button asChild className="w-full bg-scheme-blue hover:bg-scheme-teal">
                  <Link to="/dashboard/new-claim">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="mt-auto bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} SchemeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
