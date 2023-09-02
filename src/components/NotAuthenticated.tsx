import Link from "next/link";

import {MdNoEncryptionGmailerrorred} from "react-icons/md"

export default function NotAuthenticated() {
    return (
        // make it center
        <div  className="flex items-center justify-center h-screen  bg-gray-300">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow ">
                <div className="p-6 text-center">
                    <div className="flex justify-center items-center">
                        <MdNoEncryptionGmailerrorred size={64} className="text-gray-500 " />
                    </div>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 ">You are not authenticated. Please login to continue.</h3>
                    <Link href="/auth/signin" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                        Login
                    </Link>
                    <Link replace href="/" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10      ">
                        Home
                    </Link>
                </div>
                </div>
            </div>
        </div>
    )
}