import {ImSpinner9} from "react-icons/im"

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin " >
            <ImSpinner9 size={64}/>
          </div>
        </div>
      );
}