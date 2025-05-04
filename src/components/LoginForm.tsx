
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginForm = () => {
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('register') === 'true';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
    // In a real app, we would send an OTP to the mobile number
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate the OTP
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate the OTP and register the user
    navigate('/dashboard');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue={isRegister ? "register" : "login"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your mobile and Aadhaar to log in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={showOtp ? handleLogin : handleSendOtp}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    type="tel" 
                    placeholder="Enter your 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input 
                    id="aadhaar" 
                    type="text" 
                    placeholder="Enter your 12-digit Aadhaar number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    required
                  />
                </div>
                
                {showOtp && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input 
                      id="otp" 
                      type="text" 
                      placeholder="Enter the OTP sent to your mobile"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full mt-6 bg-scheme-blue hover:bg-scheme-teal">
                {showOtp ? 'Login' : 'Send OTP'}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Register with your mobile and Aadhaar to access all schemes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={showOtp ? handleRegister : handleSendOtp}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-mobile">Mobile Number</Label>
                  <Input 
                    id="reg-mobile" 
                    type="tel" 
                    placeholder="Enter your 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-aadhaar">Aadhaar Number</Label>
                  <Input 
                    id="reg-aadhaar" 
                    type="text" 
                    placeholder="Enter your 12-digit Aadhaar number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    required
                  />
                </div>
                
                {showOtp && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-otp">One-Time Password</Label>
                    <Input 
                      id="reg-otp" 
                      type="text" 
                      placeholder="Enter the OTP sent to your mobile"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full mt-6 bg-scheme-blue hover:bg-scheme-teal">
                {showOtp ? 'Register' : 'Send OTP'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
