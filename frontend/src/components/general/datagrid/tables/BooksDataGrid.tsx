import { AddBookModal } from "../../AddBookModal";
import { DataGrid } from "../DataGrid"
import { bookColumns } from "../columns/Book"
import { useBooks } from "@/hooks/useBooks"

export const BooksDataGrid = () => {
    const { data: books, isLoading } = useBooks();
    return (
        <div className="flex flex-col gap-2 max-h-full h-min">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Books</h2>
                <AddBookModal />
            </div>
            <DataGrid columns={bookColumns} data={books ?? []} isLoading={isLoading} />
        </div>
    )
}   