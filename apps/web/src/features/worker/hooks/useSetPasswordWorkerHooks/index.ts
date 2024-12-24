'use client'

import { useToast } from "@/components/hooks/use-toast"
import { instance } from "@/utils/axiosInstance"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { IParamsType } from "./types"

export const useSetPasswordWorkerHooks = (params: Promise<IParamsType>) => {
    const slug = use(params)
    const router = useRouter()
    const token = slug?.slug

    const { toast } = useToast()
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible)

    const { mutate: handleSetPassword, isPending } = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            return await instance.post('/auth/worker/set-password', { password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            router.push('/worker/login')
        },
        onError: (err: any) => {
            if (err?.response?.data?.message === 'jwt expired' || err?.response?.data?.message === 'jwt malformed') {
                toast({
                    description: 'Link sudah tidak berlaku, harap mengirim ulang email anda',
                    className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
                })

                router.push('/worker/resend-email')
            } else {
                toast({
                    description: err?.response?.data?.message,
                    className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
                })
            }
            console.log(err)
        }
    })

    return {
        passwordVisible,
        setPasswordVisible,
        confirmPasswordVisible,
        setConfirmPasswordVisible,
        isDisabledSucces,
        toggleConfirmPasswordVisibility,
        togglePasswordVisibility,
        handleSetPassword,
        isPending
    }
}