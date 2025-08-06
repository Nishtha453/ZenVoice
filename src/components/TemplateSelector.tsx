import React from 'react';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: 'modern' | 'classic' | 'minimal';
  onTemplateChange: (template: 'modern' | 'classic' | 'minimal') => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const templates = [
    {
      id: 'modern' as const,
      name: 'Modern',
      description: 'Clean and contemporary design with blue accents',
      preview: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      id: 'classic' as const,
      name: 'Classic',
      description: 'Traditional professional look with purple accents',
      preview: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      description: 'Simple and elegant with subtle gray tones',
      preview: 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Invoice Template
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 p-1 bg-blue-500 rounded-full">
                <Check size={12} className="text-white" />
              </div>
            )}
            
            <div className={`w-full h-16 rounded-md mb-3 ${template.preview}`}></div>
            
            <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};