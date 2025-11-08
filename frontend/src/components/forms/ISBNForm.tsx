import { Form, FormControl, FormField, FormMessage } from "../ui/form"
import { ISBNFormValues, useISBNForm } from "./hooks/useISBNForm"
import { FormItem } from "../ui/form"
import { FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface ISBNFormProps {
    onSubmit: (data: ISBNFormValues) => void
}

export const ISBNForm = ({ onSubmit }: ISBNFormProps) => {
    const { form } = useISBNForm()

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
                                <Input type="text" placeholder="Enter ISBN" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-max self-end" onClick={form.handleSubmit(onSubmit)}>Search</Button>
            </form>
        </Form>
    )
}