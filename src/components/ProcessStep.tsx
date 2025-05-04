
import { ReactNode } from 'react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon?: ReactNode;
}

const ProcessStep = ({ number, title, description, icon }: ProcessStepProps) => {
  return (
    <div className="process-step pl-10 pb-10 relative">
      <div className="absolute left-0 top-0 rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center shadow-md">
        {icon ? icon : number}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ProcessStep;
