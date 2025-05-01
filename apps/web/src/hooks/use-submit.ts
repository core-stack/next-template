import { FieldValues, useForm, UseFormProps } from 'react-hook-form';

import { useToast } from './use-toast';

type Params<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = UseFormProps<TFieldValues, TContext, TTransformedValues> & {
  submitTo: string
  feedback?: {
    success?: {
      title: string
      description: string
    } | boolean
    error?: {
      title: string
      description: string
    } | boolean
  }
  onSuccess?: (response?: any) => void
  onError?: (response?: any) => void
};
export const useSubmit = <TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues>(
  { submitTo, onSuccess, onError, feedback, ...props }: Params<TFieldValues, TContext, TTransformedValues>
) => {
  const { toast } = useToast();
  const form = useForm(props);
  const submit = form.handleSubmit(async (data) => {
    const res = await fetch(submitTo, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      const json = await res.json();
      if (res.ok) {
        if (onSuccess) onSuccess(json);
        let title = "";
        let description = "";
        if (typeof feedback?.success === 'object') {
          title = feedback.success.title;
          description = feedback.success.description;
        }
        if (feedback?.success === true) {
          title = 'Sucesso';
          description = json.message ?? "Operação realizada com sucesso";
        }
        toast({
          title,
          description
        });
      } else {
        if (onError) return onError(json);
        let title = "";
        let description = "";
        if (typeof feedback?.error === 'object') {
          title = feedback.error.title;
          description = feedback.error.description;
        }
        if (feedback?.error === true) {
          title = 'Erro';
          description = json.message ?? "Ocorreu um erro";
        }
        toast({
          title,
          description,
          variant: 'destructive'
        });
      }
    }
  });
  return { ...form, onSubmit: submit };
}