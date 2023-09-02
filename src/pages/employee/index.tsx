import { Roles } from "@prisma/client";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import router from "next/router";
import { IUser } from "nextauth";
import React from "react";
import { useState } from "react";
import Loading from "~/components/Loading";
import NotAuthenticated from "~/components/NotAuthenticated";
import CompleteTable from "~/components/nextui/CompleteTable";
import CcompleteTable from "~/components/nextui/ccompleteTable";
import { api } from "~/utils/api";


export default function Details() {

  const session = useSession();
  console.log(session);
  if (session.status === "loading") {
    return <Loading />;
  }
  if (session.status === "unauthenticated") {
    console.log("unauthenticated");
    return <NotAuthenticated />;
  }
  return <SuccessPage user={session.data?.user} />;
}

// new next page component 
const SuccessPage = ({user}:{user: IUser|undefined}) => {


  const allData = api.employee.getAll.useQuery();

  const messageRef = React.useRef<HTMLInputElement>(null);
  const editingRef = React.useRef<HTMLInputElement>(null);

  const [tableError, setTableError] = React.useState<string|null>(null);


  const { mutate } = api.employee.deleteById.useMutation({
    onSettled: () => {
      allData.refetch().then(() => {
        console.log("refetch success");
      }).catch((err) => {
        console.log(err);
      })
    },

    onError: (error)=>{
      setTableError(error.message)
      setTimeout(()=>{setTableError(null)}, 2000);
    }
  });
  const { mutate: create } = api.employee.createByName.useMutation({
    onSettled: () => {
      allData.refetch().then(() => {
        console.log("refetch success");
        messageRef.current!.value = "";
      }).catch((err) => {
        console.log(err);
      })
    },

    onError: (error)=>{
      setTableError(error.message)
      setTimeout(()=>{setTableError(null)}, 2000);
    }
  });

  const { mutate: update } = api.employee.updateById.useMutation({
    onSettled: () => {
      allData.refetch().then(() => {
        console.log("refetch success");
      }).catch((err) => {
        console.log(err);
      })
    },

    onError: (error)=>{
      setTableError(error.message)
      setTimeout(()=>{setTableError(null)}, 2000);
    }
  });



  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const message = messageRef.current?.value;
      if (message) {
        console.log(message);
        create({ name: message })
      }
    }
  };


  const [editingId, setEditingId] = useState<string | null>(null);

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.stopPropagation();
    mutate({ id: id })
  }

  const handleRowClick = (itemId: string) => {
    if (editingId) {
      return;
    }
    void router.replace(`/employee/${itemId}`)
  };


  const handleUpdateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newName = editingRef.current?.value;
      if (newName) {
        console.log(newName);
        update({ id: editingId!, name: newName })
      }
      setEditingId(null);
    }
  };

  return <CcompleteTable/>

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      {tableError &&
      <div className="p-4 mb-4 m-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      <span className="font-medium">Danger alert!</span> {tableError}
    </div>

      }
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
            {(allData?.data as unknown as {id: string, name: string;}[])?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-300 cursor-pointer"
                onClick={() => handleRowClick(item.id)}
                style={{ backgroundColor: '#fff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      defaultValue={item.name}
                      ref={editingRef}
                      onKeyDown={handleUpdateKeyDown}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {
                    editingId === item.id ? (
                      <CancelButton setEditingId={setEditingId} adminOnly type={user?.type}/>
                      
                    ) : (
                      <EditButton setEditingId={setEditingId} itemId={item.id} adminOnly type={user?.type}/>
                    )
                  }
                  <DeleteButton handleDelete={handleDelete} itemId={item.id} adminOnly type={user?.type}/>
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
          ref={messageRef}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const CancelButton = (props: {setEditingId: (arg0: null) => void , adminOnly: boolean, type?: Roles}) => {

  if(props.adminOnly && props.type !== Roles.ADMIN){
    return null;
  }
  return (
    <button
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        props.setEditingId(null);
      }}
    >
      Cancel
    </button>
  )
}

const EditButton = (props: {setEditingId: (arg0: string) => void, itemId: string, adminOnly: boolean, type?: Roles}) => {
  if(props.adminOnly && props.type !== Roles.ADMIN){
    return null;
  }
  return(
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        props.setEditingId(props.itemId);
      }}
    >
      Edit
    </button>
  )
}

const DeleteButton = (props: {handleDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void, 
    itemId: string, adminOnly: boolean, type?: Roles}) => {
      console.log("props: ",props.adminOnly, props.type)
  if(props.adminOnly && props.type !== Roles.ADMIN){
    return null;
  }
  return(
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2"
      onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.handleDelete(event, props.itemId);
      }}
    >
      Delete
    </button>
  )
}