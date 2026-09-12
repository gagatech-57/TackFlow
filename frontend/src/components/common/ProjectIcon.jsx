import React from 'react';
import { FolderKanban } from 'lucide-react';

const ProjectIcon = ({ size = 20, className = '', bgClassName = 'bg-blue-50 text-blue-600' }) => {
  return (
    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${bgClassName} ${className}`}>
      <FolderKanban size={size} />
    </div>
  );
};

export default ProjectIcon;
