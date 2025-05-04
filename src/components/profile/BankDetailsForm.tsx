
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/UserService";
import { AlertCircle, Bank, CheckCircle, Edit, Loader2 } from "lucide-react";
import { useState } from "react";

const BankDetailsForm = () => {
  const { user, setUser, isLoading, setIsLoading } = useFormContext();
  const { toast } = useToast();
  const isVerified = user?.bankDetails?.isVerified || false;
  const [isEditing, setIsEditing] = useState(!isVerified);
  const [isIfscValidated, setIsIfscValidated] = useState(false);
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: user?.bankDetails?.accountHolderName || "",
    accountNumber: user?.bankDetails?.accountNumber || "",
    ifscCode: user?.bankDetails?.ifscCode || "",
    bankName: user?.bankDetails?.bankName || "",
    branch: user?.bankDetails?.branch || "",
  });
  const [errors, setErrors] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
  });

  const validateForm = () => {
    const newErrors = {
      accountHolderName: formData.accountHolderName
        ? ""
        : "Account holder name is required",
      accountNumber: formData.accountNumber ? "" : "Account number is required",
      ifscCode: formData.ifscCode.match(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/)
        ? ""
        : "Invalid IFSC code format",
      bankName: formData.bankName ? "" : "Bank name is required",
      branch: formData.branch ? "" : "Branch is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "ifscCode" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "ifscCode" && isIfscValidated) {
      setIsIfscValidated(false);
      setFormData((prev) => ({ ...prev, bankName: "", branch: "" }));
    }
  };

  const handleValidateIfsc = async () => {
    if (!formData.ifscCode.match(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/)) {
      setErrors((prev) => ({ ...prev, ifscCode: "Invalid IFSC code format" }));
      setIsIfscValidated(false);
      setFormData((prev) => ({ ...prev, bankName: "", branch: "" }));
      return;
    }
    setIsValidatingIfsc(true);
    try {
      const { bankName, branch } = await UserService.validateIfsc(
        formData.ifscCode.toUpperCase()
      );
      setFormData((prev) => ({ ...prev, bankName, branch }));
      setIsIfscValidated(true);
      toast({
        title: "IFSC Validated",
        description: `Bank: ${bankName}, Branch: ${branch}`,
      });
      setErrors((prev) => ({
        ...prev,
        ifscCode: "",
        bankName: "",
        branch: "",
      }));
    } catch (error: any) {
      setIsIfscValidated(false);
      setFormData((prev) => ({ ...prev, bankName: "", branch: "" }));
      toast({
        title: "IFSC Validation Failed",
        description:
          error.response?.data?.message ||
          "Invalid IFSC code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingIfsc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing || !isIfscValidated) return;
    if (validateForm()) {
      setIsLoading(true);
      try {
        const updatedUser = await UserService.updateProfile({
          bankDetails: { ...formData, isVerified: false },
        });
        setUser((prev) => {
          if (!prev) throw new Error("User data is not available");
          return { ...prev, bankDetails: updatedUser.bankDetails };
        });
        setIsEditing(false);
        setIsIfscValidated(false);
        setFormData((prev) => ({ ...prev, bankName: "", branch: "" }));
        toast({
          title: "Bank Details Saved",
          description:
            "Your bank details have been successfully updated and are pending verification.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to save bank details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = () => {
    if (!isVerified) setIsEditing(true);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
          <Bank className="h-5 w-5 mr-2 text-blue-600" />
          Bank Details
          {isVerified && (
            <CheckCircle className="ml-2 h-5 w-5 text-green-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="accountHolderName" className="text-sm font-medium text-gray-700">
              Account Holder Name
            </label>
            <Input
              id="accountHolderName"
              name="accountHolderName"
              type="text"
              placeholder="Enter account holder name"
              value={formData.accountHolderName}
              onChange={handleChange}
              disabled={isLoading || !isEditing || isVerified}
              className="border-gray-300"
            />
            {errors.accountHolderName && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.accountHolderName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
              Account Number
            </label>
            <Input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={isLoading || !isEditing || isVerified}
              className="border-gray-300"
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.accountNumber}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">
              IFSC Code
            </label>
            <div className="flex space-x-2">
              <Input
                id="ifscCode"
                name="ifscCode"
                type="text"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={handleChange}
                disabled={isLoading || !isEditing || isVerified}
                className="border-gray-300"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateIfsc}
                disabled={
                  isLoading || isValidatingIfsc || !isEditing || isVerified
                }
                className="whitespace-nowrap"
              >
                {isValidatingIfsc ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
            {errors.ifscCode && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.ifscCode}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="bankName" className="text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <Input
              id="bankName"
              name="bankName"
              type="text"
              placeholder="Bank name (auto-filled after IFSC validation)"
              value={formData.bankName}
              onChange={handleChange}
              disabled
              className="bg-gray-50 border-gray-300"
            />
            {errors.bankName && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.bankName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch
            </label>
            <Input
              id="branch"
              name="branch"
              type="text"
              placeholder="Branch (auto-filled after IFSC validation)"
              value={formData.branch}
              onChange={handleChange}
              disabled
              className="bg-gray-50 border-gray-300"
            />
            {errors.branch && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.branch}
              </p>
            )}
          </div>
          <div className="flex space-x-2 pt-2">
            {!isEditing && !isVerified && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                disabled={isLoading}
                className="hover:bg-blue-50"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            {isEditing && (
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                disabled={isLoading || isVerified || !isIfscValidated}
              >
                {isLoading ? "Saving..." : "Save Bank Details"}
              </Button>
            )}
          </div>
          
          {!isIfscValidated && isEditing && !isLoading && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">IFSC Code Validation</h4>
              <p className="text-xs text-blue-700">
                Please validate your IFSC code first. This will auto-fill your bank name and branch details.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BankDetailsForm;
