import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { TABLE_COLUMNS, TABLE_DATA, INITIAL_VISIBLE_COLUMNS , statusOptions} from "~/utils/const";


export default function CompleteTable() {

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(INITIAL_VISIBLE_COLUMNS);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
      });


    const [page, setPage] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    type User = {id: number,name: string};

    const renderCell = useCallback((user: User, columnKey: React.Key)=>{
        const cellValue = user[columnKey as keyof typeof user];
        switch (columnKey) {
            case "id": return <TableIDCell id={cellValue as number} />;
            case "name": return <TableNameCell name={cellValue as string} />;
        }
        return cellValue;
    }, [])

    const filteredItems = useMemo(() => {
        let filteredUsers = [...TABLE_DATA];
    
        if (hasSearchFilter) {
          filteredUsers = filteredUsers.filter((user) =>
            user.name.toLowerCase().includes(filterValue.toLowerCase()),
          );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
          filteredUsers = filteredUsers.filter((user) =>
            Array.from(statusFilter).includes(user.status),
          );
        }
    
        return filteredUsers;
      }, [TABLE_DATA, filterValue, statusFilter]);


      const pages = Math.ceil(filteredItems.length / rowsPerPage);

      const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return filteredItems.slice(start, end);
      }, [page, filteredItems, rowsPerPage]);
    
      const sortedItems = useMemo(() => {
        return [...items].sort((a: User, b: User) => {
          const first = a[sortDescriptor.column as keyof User] as number;
          const second = b[sortDescriptor.column as keyof User] as number;
          const cmp = first < second ? -1 : first > second ? 1 : 0;
    
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
      }, [sortDescriptor, items]);


      const onSearchChange = useCallback((value?: string) => {
        if (value) {
          setFilterValue(value);
          setPage(1);
        } else {
          setFilterValue("");
        }
      }, []);
    
      const onClear = useCallback(()=>{
        setFilterValue("")
        setPage(1)
      },[])


      const onNextPage = useCallback(() => {
        if (page < pages) {
          setPage(page + 1);
        }
      }, [page, pages]);

      const onPreviousPage = useCallback(() => {
        if (page > 1) {
          setPage(page - 1);
        }
      }, [page]);
    
      const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
      }, []);


      const topContent = useMemo(() => {
        return (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between gap-3 items-end">
              <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Search by name..."
                // startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
              />
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button 
                    // endContent={<ChevronDownIcon className="text-small" />} 
                    variant="flat">
                      Status
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Table Columns"
                    closeOnSelect={false}
                    selectedKeys={statusFilter}
                    selectionMode="multiple"
                    onSelectionChange={setStatusFilter}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status.uid} className="capitalize">
                        {status.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button 
                    // endContent={<ChevronDownIcon className="text-small" />} 
                    variant="flat">
                      Columns
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Table Columns"
                    closeOnSelect={false}
                    selectedKeys={visibleColumns}
                    selectionMode="multiple"
                    onSelectionChange={setVisibleColumns}
                  >
                    {TABLE_COLUMNS.map((column) => (
                      <DropdownItem key={column.uid} className="capitalize">
                        column.name
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Button color="primary" 
                // endContent={<PlusIcon />}
                >
                  Add New
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">Total {TABLE_DATA.length} users</span>
              <label className="flex items-center text-default-400 text-small">
                Rows per page:
                <select
                  className="bg-transparent outline-none text-default-400 text-small"
                  onChange={onRowsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </label>
            </div>
          </div>
        );
      }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        TABLE_DATA.length,
        hasSearchFilter,
      ]);


    const bottomContent = useMemo(
        ()=><TableBottomContent
            selectedKeys={selectedKeys}
            filteredItems={filteredItems}
            page={page}
            pages={pages}
            setPage={setPage}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
            
        />,
        [selectedKeys, items.length, page, pages, hasSearchFilter])



    return(
        <Table
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
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
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

const TableIDCell = ({id}:{id: number}) => {
    return (
        <div>
            {id}
        </div>
    )
}

const TableNameCell = ({name}:{name: string}) => {
    return (
        <div>
            {name}
        </div>
    )
}

type TableBottomContentProps = {
    selectedKeys: string[];
    filteredItems: any[];
    page: number;
    pages: number;
    setPage: (page: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

const TableBottomContent = ({selectedKeys, filteredItems, page, pages, setPage, onPreviousPage, onNextPage}:TableBottomContentProps) => {
    return (
        <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    )
}
