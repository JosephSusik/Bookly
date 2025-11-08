import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { AddBookForm } from "../forms/AddBookForm"
import { AddBookFormValues } from "../forms/hooks/useAddBookForm"
import { ISBNForm } from "../forms/ISBNForm"
import { ISBNFormValues } from "../forms/hooks/useISBNForm"

export const AddBookModal = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [mode, setMode] = useState<"manual" | "isbn" | null>(null)

    const handleOpenDialog = (selectedMode: "manual" | "isbn") => {
        setMode(selectedMode)
        setOpenDialog(true)
    }


    const handleFindBook = (data: ISBNFormValues) => {
        console.log(data)
    }

    const handleSaveBook = (data: AddBookFormValues) => {
        console.log(data)
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

            <Dialog open={openDialog} onOpenChange={setOpenDialog} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "manual" ? "Add Book" : "Add Book (ISBN)"}
                        </DialogTitle>
                    </DialogHeader>

                    {mode === "manual" && (
                        <AddBookForm onSubmit={handleSaveBook} />
                    )}

                    {mode === "isbn" && (
                        <ISBNForm onSubmit={handleFindBook} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
