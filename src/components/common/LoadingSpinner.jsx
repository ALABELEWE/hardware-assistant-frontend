export default function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} border-4 border-${color}-200 border-t-${color}-600 rounded-full animate-spin`} />
    </div>
  );
}