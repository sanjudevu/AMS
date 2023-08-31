import { useRouter } from 'next/router'
import { api } from '~/utils/api';
import { FiArrowLeft } from 'react-icons/fi';

 
export default function Page() {
  const router = useRouter()
  const { id } = router.query;

  const allData = api.employee.getById.useQuery({id: id as string});

  const handleGoBack = () => {
    router.push('/employee').then(
        () => console.log("success"),
        ).catch(
        (err) => console.log(err)
        )
  };
  
  return (
    <div className="mx-auto max-w-md bg-white rounded-lg shadow-lg p-6">
      
      <p className="text-2xl font-bold mb-2">{allData.data?.name}</p>
      <p className="text-gray-500 mb-4">{allData.data?.id}</p>
      <button
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
          onClick={handleGoBack}
        >
          <FiArrowLeft size={24} />
        </button>
    </div>
  );
}