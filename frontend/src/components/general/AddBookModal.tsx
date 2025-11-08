import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { AddBookForm } from "../forms/AddBookForm"
import { AddBookFormValues } from "../forms/hooks/useAddBookForm"
import { ISBNForm } from "../forms/ISBNForm"
import { ISBNFormValues } from "../forms/hooks/useISBNForm"
import { useUser } from "@/context/UserContext"
import { searchBookByISBN, createBook, SearchByISBNResponse } from "@/lib/api"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export const AddBookModal = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [mode, setMode] = useState<"manual" | "isbn" | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [prefilledData, setPrefilledData] = useState<SearchByISBNResponse | null>(null)
    const { token } = useUser()
    const queryClient = useQueryClient()

    const handleOpenDialog = (selectedMode: "manual" | "isbn") => {
        setMode(selectedMode)
        setOpenDialog(true)
        setPrefilledData(null) // Reset prefilled data when opening dialog
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setMode(null)
        setPrefilledData(null)
        setIsSearching(false)
    }

    const handleFindBook = async (data: ISBNFormValues) => {
        if (!token) {
            toast.error("Please log in to search for books")
            return
        }

        setIsSearching(true)
        try {
            const result = await searchBookByISBN(data.ISBN, token)
            setPrefilledData(result)
            setMode("manual") // Switch to manual form with prefilled data
        } catch (error) {
            // console.error("Error searching for book:", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to search for book"
            toast.warning(errorMessage)
        } finally {
            setIsSearching(false)
        }
    }

    const handleSaveBook = async (data: AddBookFormValues) => {
        if (!token) {
            toast.error("Please log in to add books")
            return
        }

        try {
            await createBook(data, token)
            // Invalidate books queries to refresh the datagrids
            await queryClient.invalidateQueries({ queryKey: ['books'] })
            await queryClient.invalidateQueries({ queryKey: ['myBooks'] })
            toast.success("Book added successfully!")
            handleCloseDialog()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add book")
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Book
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog("isbn")} className="cursor-pointer">ISBN</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenDialog("manual")} className="cursor-pointer">Manual</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={openDialog} onOpenChange={handleCloseDialog} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "manual" ? "Add Book" : "Add Book (ISBN)"}
                        </DialogTitle>
                        {mode === "manual" && prefilledData?.source === "database" && (
                            <DialogDescription>
                                Some fields are disabled because this book already exists in our database. You can only add additional information.
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {mode === "manual" && (
                        <AddBookForm
                            onSubmit={handleSaveBook}
                            prefilledData={prefilledData}
                        />
                    )}

                    {mode === "isbn" && (
                        <ISBNForm
                            onSubmit={handleFindBook}
                            isLoading={isSearching}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
