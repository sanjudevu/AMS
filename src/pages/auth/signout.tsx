import Link from "next/link";

export default function SingOutPage() {

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Signed Out. Thankyou for using  
      <Link href="/" ><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 hover:from-yellow-400 hover:to-orange-500"> #Home</span></Link>
      </h1>
    </div>
    )
}