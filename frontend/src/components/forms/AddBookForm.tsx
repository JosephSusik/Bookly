import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Textarea } from "../ui/textarea"
import { AddBookFormValues, useAddBookForm } from "./hooks/useAddBookForm"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"


interface AddBookFormProps {
    onSubmit: (data: AddBookFormValues) => void
}

export const AddBookForm = ({ onSubmit }: AddBookFormProps) => {
    const { form } = useAddBookForm()

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="ISBN"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ISBN</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book ISBN" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book title" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book subtitle" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="authors"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Authors</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book authors" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Publisher</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book publisher" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="published_date"
                    render={({ field }) => {
                        const [open, setOpen] = useState(false)
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Published Date</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                field.onChange(date)
                                                setOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="page_count"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Page Count</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Book page count" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Book language" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Book description" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-max self-end" onClick={form.handleSubmit(onSubmit)}>Add Book</Button>
            </form>
        </Form >
    )
}