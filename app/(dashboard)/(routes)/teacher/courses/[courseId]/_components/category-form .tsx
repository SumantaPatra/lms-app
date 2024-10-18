"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  options: { label: string; value: string }[];
}
const formSchema = z.object({
  cateogoryId: z.string().min(1),
});

const CategoryForm = ({ initialData, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((currState) => !currState);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cateogoryId: initialData?.cateogoryId || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${initialData?.id}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const selectedOption = options.find(
    (option) => option.value === initialData?.cateogoryId
  );
  return (
    <div className="mt-6 border bg-state-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.cateogoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No cateogory"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="cateogoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options} // pass options
                      onChange={field.onChange} // map field onChange to Combobox onChange
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
