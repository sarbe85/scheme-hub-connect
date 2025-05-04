
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { ClaimService } from "@/services/ClaimService";
import { SchemeService } from "@/services/SchemeService";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUpload, FileText, RefreshCw } from "lucide-react";

const MyClaimsList = () => {
  const { user } = useFormContext();
  const { toast } = useToast();
  const [claims, setClaims] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    membershipNumber: "",
    name: user ? `${user.firstName} ${user.lastName}` : "",
    fatherName: ""
  });
  const [selectedScheme, setSelectedScheme] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/jpeg": [".jpg"], "image/png": [".png"] },
    onDrop: (acceptedFiles) => setCertificates(acceptedFiles),
  });

  useEffect(() => { fetchClaims(); fetchSchemes(); }, []);
  
  useEffect(() => {
    if (isModalOpen && user) {
      setFormData({
        membershipNumber: "",
        name: `${user.firstName} ${user.lastName}`,
        fatherName: ""
      });
      setSelectedScheme("");
      setCertificates([]);
    }
  }, [isModalOpen, user]);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await ClaimService.getMyClaims();
      setClaims(response);
    } catch {
      toast({ title: "Error", description: "Failed to fetch claims", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      const response = await SchemeService.getSchemes();
      setSchemes(response);
    } catch {
      toast({ title: "Error", description: "Failed to fetch schemes", variant: "destructive" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClaims();
    setRefreshing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedScheme) {
      toast({ title: "Error", description: "Please select a scheme", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        userId: user._id,
        schemeId: selectedScheme,
        membershipNumber: formData.membershipNumber,
        name: formData.name,
        fatherName: formData.fatherName,
        certificates,
      };
      await ClaimService.submitClaim(data);
      toast({ title: "Success", description: "Your claim has been submitted successfully" });
      setIsModalOpen(false);
      await fetchClaims();
    } catch {
      toast({ title: "Error", description: "Failed to submit claim", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      red: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Claims</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Add a New Claim
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No claims found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new claim.</p>
          <div className="mt-6">
            <Button onClick={() => setIsModalOpen(true)}>Add a New Claim</Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[100px]">Claim ID</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Membership Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim._id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{claim._id.substring(0, 8)}...</TableCell>
                  <TableCell className="font-medium">{schemes.find((s) => s._id === claim.schemeId)?.name || "Unknown"}</TableCell>
                  <TableCell>{claim.membershipNumber}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell className="text-right text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleDateString("en-US", { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Submit a New Claim</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-3">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Claimant Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Claimant Name" 
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="scheme" className="text-sm font-medium">Scheme</label>
              <select 
                id="scheme" 
                value={selectedScheme} 
                onChange={(e) => setSelectedScheme(e.target.value)} 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Scheme</option>
                {schemes.map((scheme) => (
                  <option key={scheme._id} value={scheme._id}>{scheme.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="membershipNumber" className="text-sm font-medium">Membership Number</label>
              <Input 
                id="membershipNumber" 
                name="membershipNumber" 
                value={formData.membershipNumber} 
                onChange={handleInputChange} 
                placeholder="Membership Number" 
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fatherName" className="text-sm font-medium">Father's Name</label>
              <Input 
                id="fatherName" 
                name="fatherName" 
                value={formData.fatherName} 
                onChange={handleInputChange} 
                placeholder="Father's Name" 
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Certificates</label>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
              >
                <input {...getInputProps()} />
                <FileUpload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-800">
                  {isDragActive ? "Drop the files here..." : "Drag & drop certificates here"}
                </p>
                <p className="text-xs text-gray-500 mt-1">or click to browse files (.pdf, .jpg, .png)</p>
              </div>
              
              {certificates.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-1">Selected Files:</p>
                  <ul className="space-y-1">
                    {certificates.map((file, index) => (
                      <li key={index} className="text-sm flex items-center text-gray-700">
                        <FileText className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyClaimsList;
