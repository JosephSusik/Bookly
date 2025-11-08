import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const isbnSchema = z
  .string()
  .trim()
  .regex(
    /^(?:\d{9}[\dX]|(?:978|979)\d{10})$/,
    "Must be 10 or 13 characters"
  );

export const isbnFormSchema = z.object({
    ISBN: isbnSchema,
})

export type ISBNFormValues = z.infer<typeof isbnFormSchema>


export const useISBNForm = () => {
    const form = useForm<ISBNFormValues>({
        resolver: zodResolver(isbnFormSchema),
        defaultValues: {
            ISBN: "",
        },
    })

    return { form }
}