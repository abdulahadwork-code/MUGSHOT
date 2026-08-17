import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b2416] px-4">

      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">

        <h1 className="text-5xl font-bold text-red-600 mb-4">
          403
        </h1>

        <h2 className="text-3xl font-bold text-[#6f4e37] mb-4">
          Access Denied
        </h2>

        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        <Link
          to="/order"
          className="inline-block bg-[#6f4e37] text-white px-6 py-3 rounded-lg font-bold"
        >
          Go to Ordering
        </Link>

      </div>

    </div>
  );
};

export default AccessDenied;