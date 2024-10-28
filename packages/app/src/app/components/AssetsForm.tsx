'use client'

import { formSchema } from '@/lib/formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FormSchema = z.infer<typeof formSchema>

interface AssetsFormProps {
	className?: string
}

export const AssetsForm = ({ className }: AssetsFormProps) => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		mode: 'onBlur',
		defaultValues: {
			audio: '',
			image: '',
		},
	})

	const onSubmit = (values: FormSchema) => {
		console.log(values)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn('space-y-8', className)}
			>
				<FormField
					control={form.control}
					name="audio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Audio</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	)
}
