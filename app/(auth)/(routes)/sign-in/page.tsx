'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username wajib di isi'
  }),
  password: z.string().min(1, {
    message: 'Password wajib di isi'
  })
})

export default function Page() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      const response = await axios.post('/api/login', {
        ...values
      })

      //buat const variable expDate untuk token expired
      const expDateTime = new Date()
      expDateTime.setHours(expDateTime.getHours() + 2)

      //simpan response data & expDateTime ke localstorage session
      const session = {
        user: response.data,
        expDateTime: expDateTime.toString()
      }
      localStorage.setItem('session', JSON.stringify(session))

      toast.success('Login Berhasil')
      router.push(`/selectcabang/${response.data.id}`)
    } catch {
      toast.error('Username atau Password salah')
    }
  }

  return (
    <div className='bg-zinc-50 p-6 mt-3 rounded-md w-[90%] max-w-[500px]'>
      <h1 className='text-xl text-center font-bold'>Selamat Datang di AOC System</h1>

      <div className=''>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-3 mt-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Masukan Username Anda'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Masukan Password Anda'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button
                type='submit'
                disabled={!isValid || isSubmitting} className='w-full mt-5'>
                Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
