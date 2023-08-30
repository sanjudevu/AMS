import { Employee } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";


export default function Details() {

    const allData = api.employee.getAll.useQuery();

    const { mutate, error } = api.employee.deleteById.useMutation(); 

    
    console.log(allData.data);

    // if allData or allData.data is undefined, make it empty []
    const [data, setData] = useState(allData.data ?? []);

    function handleDelete(id: string) {
            mutate({id: id})
    }


    return (
        <div className="bg-gray-100 h-screen flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />
          </div>
        </div>
      );
}