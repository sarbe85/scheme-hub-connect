
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface SchemeCardProps {
  title: string;
  description: string;
  eligibility?: string;
  benefits?: string;
}

const SchemeCard = ({ title, description, eligibility, benefits }: SchemeCardProps) => {
  return (
    <Card className="scheme-card">
      <CardHeader className="bg-gradient-to-r from-scheme-light-blue to-scheme-light-teal">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-700">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {eligibility && (
          <div>
            <h4 className="font-medium text-scheme-blue">Eligibility:</h4>
            <p className="text-sm text-gray-600">{eligibility}</p>
          </div>
        )}
        {benefits && (
          <div>
            <h4 className="font-medium text-scheme-blue">Benefits:</h4>
            <p className="text-sm text-gray-600">{benefits}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link to="/login?register=true">Apply Now</Link>
        </Button>
        <Button asChild variant="link" className="text-scheme-blue">
          <Link to="/#details">Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchemeCard;
