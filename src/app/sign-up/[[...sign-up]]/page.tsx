import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
            <SignUp />

            {/* Email Domain Information */}
            <div className="mt-6 max-w-md text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="text-left">
                            <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                Email Requirements
                            </h3>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>✓ Only major email providers allowed (Gmail, Yahoo, Outlook, etc.)</li>
                                <li>✗ Temporary or disposable email addresses are not permitted</li>
                                <li>✓ Email verification required to unlock all features</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
