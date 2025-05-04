
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ClaimForm = () => {
  const [selectedScheme, setSelectedScheme] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit this data to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-scheme-blue">Claim Submitted Successfully</CardTitle>
          <CardDescription>Your claim has been submitted and is being processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            You will receive updates about your claim status through SMS on your registered mobile number.
            Your claim reference number is <span className="font-bold">{Math.floor(Math.random() * 1000000) + 100000}</span>.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="mr-2">
            Submit Another Claim
          </Button>
          <Button className="bg-scheme-blue hover:bg-scheme-teal">
            View All Claims
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Claim</CardTitle>
        <CardDescription>Please fill in the details to submit your claim</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scheme">Select Scheme</Label>
            <Select value={selectedScheme} onValueChange={setSelectedScheme} required>
              <SelectTrigger id="scheme">
                <SelectValue placeholder="Select a scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pm-kisan">PM-KISAN</SelectItem>
                <SelectItem value="ayushman-bharat">Ayushman Bharat</SelectItem>
                <SelectItem value="jan-dhan">Jan Dhan Yojana</SelectItem>
                <SelectItem value="ujjwala">Ujjwala Yojana</SelectItem>
                <SelectItem value="saubhagya">Saubhagya Scheme</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input 
                id="bank-name" 
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter your bank name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input 
                id="account-number" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifsc-code">IFSC Code</Label>
              <Input 
                id="ifsc-code" 
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                placeholder="Enter your bank IFSC code"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Claim Details</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your claim in detail"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Upload Supporting Documents</Label>
            <Input id="document" type="file" multiple />
            <p className="text-xs text-gray-500 mt-1">
              Please upload all relevant documents in PDF or image format (max 5MB each)
            </p>
          </div>

          <Button type="submit" className="w-full bg-scheme-blue hover:bg-scheme-teal">
            Submit Claim
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimForm;
