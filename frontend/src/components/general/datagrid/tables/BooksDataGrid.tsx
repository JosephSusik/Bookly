import { AddBookModal } from "../../AddBookModal";
import { DataGrid } from "../DataGrid"
import { bookColumns } from "../columns/Book"
import { useBooks } from "@/hooks/useBooks"
import { useRouter } from "next/navigation";

export const BooksDataGrid = () => {
    const { data: books, isLoading } = useBooks();
    const router = useRouter();
    return (
        <div className="flex flex-col gap-2 max-h-full h-min">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">All Books</h2>
                <AddBookModal />
            </div>
            <DataGrid columns={bookColumns} data={books ?? []} isLoading={isLoading} onRowClick={(row) => router.push(`/book/${row.id}`)} />
        </div>
    )
}   