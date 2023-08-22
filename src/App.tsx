import React from "react";
import "./styles/global.css";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFromSchema = z.object({
  name: z
    .string()
    .nonempty("Field name is required")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("Field e-mail is required")
    .email("Invalid e-mail format")
    .toLowerCase(),
  password: z.string().min(6, "Password should have at least 6 characters"),
  orders: z
    .array(
      z.object({
        title: z.string().nonempty("Field is required"),
        total: z.coerce.number().min(1).max(100),
      })
    )
    .min(1, "Add at least one order"),
});

type CreateUserFormData = z.infer<typeof createUserFromSchema>;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFromSchema),
  });

  function createUser(data: CreateUserFormData) {
    console.log("lcf data", data);
  }

  function addNewOrder() {
    append({ title: "", total: 1 });
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });
  return (
    <main className="h-screen bg-zinc-50 flex flex-col gap-10 items-center justify-center">
      <form
        className="flex flex-col gap-4 w-full max-w-xs"
        onSubmit={handleSubmit(createUser)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="border border-zinc-200 sahdow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-200 sahdow-sm rounded h-10 px-3"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="border border-zinc-200 sahdow-sm rounded h-10 px-3"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="orders" className="flex item-center justify-between">
            Orders
            <button
              type="button"
              onClick={addNewOrder}
              className="text-emerald-500 text-sm"
            >
              Add new order
            </button>
          </label>
          {fields.map((field, index) => {
            const { id } = field;
            return (
              <div key={id} className="flex gap-2">
                <div className="flex-1 flex-col gap-1">
                  <input
                    type="text"
                    className="flex-1 border border-zinc-200 sahdow-sm rounded h-10 px-3"
                    {...register(`orders.${index}.title`)}
                  />
                  {errors.orders && errors.orders[index]?.title && (
                    <span>{errors.orders[index]?.title?.message}</span>
                  )}
                </div>
                <div className="flex-1 flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-200 sahdow-sm rounded h-10 px-3"
                    {...register(`orders.${index}.total`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.orders && errors?.orders[index]?.total && (
                    <span>{errors.orders[index]?.total?.message}</span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.orders && <span>{errors.orders.message}</span>}
        </div>
        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Save
        </button>
      </form>
    </main>
  );
}

export default App;
