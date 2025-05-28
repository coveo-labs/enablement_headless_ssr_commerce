interface FacetTitleProps {
  title: string;
  children?: React.ReactNode;
}

export default function FacetTitle({ title, children }: FacetTitleProps) {
  return (
    <legend className="block w-full bg-gradient-to-r from-slate-50 to-white border-b-2 border-gray-200 py-4 mb-6">
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        </div>
        {children && <div className="flex items-center space-x-3">{children}</div>}
      </div>
    </legend>
  );
}
