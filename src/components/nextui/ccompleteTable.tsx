import { type SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { api } from "~/utils/api";
import { TABLE_COLUMNS } from "~/utils/const";
import Loading from "../Loading";
import { Key, useCallback, useMemo, useState } from "react";

import { SiMaildotru } from "react-icons/si";
import { useSession } from "next-auth/react";

type queryType = {
    page?: number,
    count?: number,
    sortDescriptor?: {
        column: string,
        direction: "asc" | "desc",
      }
}

type userDataType = {
    type: string;
    email: string;
    name: string;
    password: string;
}

export default function CcompleteTable(){

    const session = useSession();

    const [query, setQuery] = useState<queryType>({page:1, count:10});
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "email",
        direction: "ascending",
      });

      const userData = api.user.getAllWithFilters.useQuery(query);
      const data = userData?.data as unknown as userDataType[];
    
    // hooks
    // sort hook

    useMemo(()=>{
        console.log("sort descirptor", sortDescriptor)
        setQuery({
            ...query, 
            sortDescriptor: {
                column: sortDescriptor.column as string,
                direction: sortDescriptor.direction === "ascending" ? "asc" : "desc"
            }
        });
        void userData.refetch();
    },[sortDescriptor])


    const renderCell = useCallback(({item, columnKey}:{item: userDataType,columnKey: keyof userDataType})=>{
        switch (columnKey) {
            case "email": return <TableEmailCell id={item[columnKey]} />
            case "name": return <TableNameCell id={item[columnKey]} />
            case "password": return <TablePasswordCell id={item[columnKey]} visible={session.data?.user?.type === "ADMIN"} />
            case "type" : return <TableTypeCell id={item[columnKey]} />
            default: return item[columnKey] 
        }
    },[]);
    

    

    if (userData.isLoading || session.status === "loading") return <Loading />;

    return (
        <Table    
            isHeaderSticky
            // bottomContent={<BottomContent />}
            // bottomContentPlacement="outside"
            // topContent={<TopContent />}
            // topContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={TABLE_COLUMNS}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={data} isLoading={userData.isLoading}>
                {(item) => (
                <TableRow key={item.email}>
                    {(columnKey) => <TableCell>{renderCell({item, columnKey})}</TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>
    )
}



// Render cell function 

const TableEmailCell = ({id}:{id:string})=>{
    return (
        <div className="flex items-center">
            <SiMaildotru size={20} className="mr-2" />
            <span>{id}</span>
        </div>
    )
}

const TableNameCell = ({id}:{id:string})=>{
    return (
        <div className="flex items-center">
            <span>{id}</span>
        </div>
    )
}

const TablePasswordCell = ({id, visible}:{id:string, visible?: boolean})=>{
    return (
        <div className="flex items-center">
            <Tooltip isDisabled={!visible} content={id}>
                <span>********</span>
            </Tooltip>
            
        </div>
    )
}

const TableTypeCell = ({id}:{id:string})=>{
    return (
        <div className="flex items-center">
            <span>{id}</span>
        </div>
    )
}


