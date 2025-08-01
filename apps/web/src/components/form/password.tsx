"use client";
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = React.ComponentProps<"input"> & {
  label?: string
  name: string
}
export const FormPassword = (props: Props) => {
  const form = useFormContext();
  const isLoading = form.formState.isSubmitting;
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {props.label && (<FormLabel>{props.label}</FormLabel>)}
          <FormControl>
            <Input disabled={isLoading} {...field} {...props} type={"password"} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};