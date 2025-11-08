import { AddBookModal } from "../../AddBookModal";
import { DataGrid } from "../DataGrid"
import { bookColumns } from "../columns/Book"
import { useMyBooks } from "@/hooks/useMyBooks"

export const MyBooksDataGrid = () => {
    const { data: books, isLoading } = useMyBooks();
    return (
        <div className="flex flex-col gap-2 max-h-full h-min">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
                <AddBookModal />
            </div>
            <DataGrid columns={bookColumns} data={books ?? []} isLoading={isLoading} />
        </div>
    )
}

