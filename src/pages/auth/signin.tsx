import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";


export default function SignInPage() {

    const router = useRouter()

    const userNameRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        const userName = userNameRef.current?.value;
        const password = passwordRef.current?.value;

        

        const user = await signIn("credentials", {
            username: userName,
            password: password,
            redirect: false
        });
        console.log("Userdata",user)
        if (user?.status === 200) {
            setError(null);
            void router.back()
        } else {
            setError(user?.error ?? "Authentiation failed")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    
                    <input
                        ref={userNameRef}
                        type="text"
                        id="username"
                        className="mt-1 px-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        ref={passwordRef}
                        type="password"
                        id="password"
                        className="mt-1 px-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    onClick={()=> void handleSignIn()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign In
                </button>

                {error && (
                    <div className="mb-4 text-red-500 text-sm pt-5">{error}</div>
                )}
            </div>
        </div>
    );
    
}