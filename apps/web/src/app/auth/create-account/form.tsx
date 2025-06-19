"use client"

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAccountSchema, CreateAccountSchema } from '@packages/schemas';

export function CreateAccountForm() {
  const { toast } = useToast();
  const t = useTranslations()
  const form = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const { mutate } = useApiMutation("/api/auth/create-account");
  const onSubmit = form.handleSubmit(async (data) => {
    mutate({ body: data }, {
      onSuccess: () => {
        toast({
          title: t/*i18n*/("Account created"),
          description: t/*i18n*/("Check your email to confirm your account"),
        })
      },
      onError: (error) => {
        toast({
          title: t/*i18n*/("Error creating account"),
          description: error.message,
          variant: "destructive",
        })
      }
    });
  })

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput 
            name='name'
            label={t/*i18n*/("Name")}
            placeholder={t/*i18n*/("John Doe")}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <FormInput
            name='email'
            label={t/*i18n*/("Email")}
            placeholder={`${t/*i18n*/("email@example")}.com`}
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
          />
          <FormInput
            name='password'
            label={t/*i18n*/("Password")}
            placeholder={t/*i18n*/("Password")}
            type="password"
            />
          <FormInput
            name='confirmPassword'
            placeholder={t/*i18n*/("Confirm Password")}
            label={t/*i18n*/("Confirm Password")}
            type="password"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {t/*i18n*/("Create account")}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{t/*i18n*/("Or continue with")}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" isLoading={isLoading}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" isLoading={isLoading}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        {t/*i18n*/("Already have an account?")}{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          {t/*i18n*/("Sign in")}
        </Link>
      </div>
    </div>
  )
}
