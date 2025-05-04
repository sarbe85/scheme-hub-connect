
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { ClaimService } from '@/services/ClaimService';
import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SchemesList = () => {
  const { claims, setClaims } = useFormContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const fetchedClaims = await ClaimService.getMyClaims();
        setClaims(fetchedClaims);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch claims. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, [setClaims, toast]);

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FileText className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          My Claims
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-600 mb-4">No claims found.</p>
            <Link to="/file-claim" className="text-primary hover:text-primary/90 font-medium">
              File a new claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-gray-600">Claim ID</TableHead>
                  <TableHead className="font-medium text-gray-600">Membership Number</TableHead>
                  <TableHead className="font-medium text-gray-600">Name</TableHead>
                  <TableHead className="font-medium text-gray-600">Father's Name</TableHead>
                  <TableHead className="font-medium text-gray-600">Status</TableHead>
                  <TableHead className="font-medium text-gray-600 text-center">Retries</TableHead>
                  <TableHead className="font-medium text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">{claim.id}</TableCell>
                    <TableCell className="text-gray-700">{claim.membershipNumber || 'N/A'}</TableCell>
                    <TableCell className="text-gray-700">{claim.name}</TableCell>
                    <TableCell className="text-gray-700">{claim.fatherName}</TableCell>
                    <TableCell className="text-gray-700">{getStatusBadge(claim.status)}</TableCell>
                    <TableCell className="text-center text-gray-700">{claim.retries}</TableCell>
                    <TableCell>
                      {claim.retries < 3 && claim.status === 'rejected' && (
                        <Button asChild variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                          <Link to={`/retry-claim?claimId=${claim.id}`}>Retry</Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemesList;
