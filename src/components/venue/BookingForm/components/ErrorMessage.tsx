interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-md text-sm">
      {message}
    </div>
  );
}
