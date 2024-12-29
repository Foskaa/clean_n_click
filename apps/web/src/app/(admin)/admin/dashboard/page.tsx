'use client'

import { IoAddCircleSharp, IoSearchSharp, IoPersonSharp } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaTint, FaWhatsapp } from "react-icons/fa";
import { MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import { FaArrowRight, FaDashcube, FaMoneyBillWave, FaSpaghettiMonsterFlying, FaStore } from "react-icons/fa6";
import { FaCloud, FaTemperatureHigh } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import Link from "next/link";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import ChartComponents from "@/components/core/chart/pieChartTrackingStatusOrder";
import MonthlyCharts from "@/components/core/chart/chartMonthlyStatistic";
import LoadingDashboardWeb from "@/components/core/loading/loadingDashboardWeb";
import MobileSessionLayout from "@/components/core/mobileSessionLayout";

export default function Page() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const totalWorker = authStore((state) => state?.totalWorker)
    const totalOrders = authStore((state) => state?.orders)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const name = authStore((state) => state?.firstName)
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const [isCurrentWeither, setIsCurrentWeither] = useState<any>({})

    const { data: dataOrderList, refetch, isPending } = useQuery({
        queryKey: ['get-order'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return res?.data?.data
        },
    });

    useEffect(() => {
        if (lat && lng) {
            const handleCurrentWeither = async () => {
                try {
                    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEITHER}&lang=id`)

                    setIsCurrentWeither(res?.data)
                } catch (error) {
                    console.log(error)
                }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])

    const iconButtons = [
        { icon: FaStore, label: "Data Outlet" },
        { icon: IoSearchSharp, label: "Cari Pesanan" },
        { icon: IoPersonSharp, label: "Data Pelanggan" },
        { icon: GrUserWorker, label: "Data Pekerja" },
    ];

    const isDayArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    useEffect(() => {
        const date = new Date()
        const isDayNow = date.getDay()
        const isDateNow = date.getDate()
        const isMonth = date.getMonth()
        const isYear = date.getFullYear()

        const newDateFormat = `${isDateNow}/${isMonth}/${isYear}`
        setIsDate(newDateFormat)
        setIsDay(isDayNow)
    }, [])

    const completedOrders = dataOrderList?.trackingOrder?.filter((order: any) => order?.isDone);
    const pendingOrders = dataOrderList?.trackingOrder?.filter((order: any) => !order?.isDone);


    if (isPending) return (
        <>

            <LoadingDashboardWeb />
        </>
    )

    const arrIcon = [
        { icon: <FaDashcube />, url: '/admin/dashboard' },
        { icon: <FaStore />, url: '/admin/outlet' },
        { icon: <FaMoneyBillWave />, url: '/admin/order' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/admin/dashboard' },
    ]
    return (
        <>
            {/* <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit md:max-w-full max-w-[425px]">
                    <section>
                        <Image src={'/images/New Project.webp'} alt="header"
                            height={500} width={500} />
                    </section>

                    <section className="border border-gray-400 rounded-t-lg p-4 mt-4 mx-8">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-600">CnC Jakarta</div>
                            <button className="text-sm flex items-center border rounded-lg border-gray-400 p-2 gap-1">
                                Tambah Lokasi <IoAddCircleSharp />
                            </button>
                        </div>
                    </section>

                    <section className="border border-gray-400 bg-sky-200 rounded-b-lg text-sm p-4 mx-8 text-gray-700">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <MdOutlineStickyNote2 size={20} /> Pesanan Hari Ini
                            </div>
                            <div className="font-semibold text-right">
                                <div>Rp0</div>
                                <div>0 pesanan</div>
                            </div>
                        </div>
                        <div className="border-t-2 border-gray-400 mt-4 pt-4 flex">
                            <div className="flex-1 text-center text-lg font-bold">
                                0 <span className="text-sm">kg</span>
                            </div>
                            <div className="flex-1 text-center text-lg font-bold">
                                0 <span className="text-sm">pcs</span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white mx-8 grid grid-cols-2 gap-y-6 justify-around my-6">
                        {iconButtons.map((item, index) => (
                            <button key={index} className="flex flex-col items-center space-y-1">
                                <item.icon className="text-gray-500 text-5xl border-2 w-24 h-24 rounded-lg border-gray-300 p-6 bg-white transition-colors ease-in-out duration-200 active:bg-gray-300" />
                                <span className="text-base">{item.label}</span>
                            </button>
                        ))}
                    </section>

                    <section className="bg-green-100 p-4 mx-8 mb-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <FaWhatsapp className="text-gray-600" size={24} />
                            <span className="font-semibold">Butuh bantuan?</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Chat kami di WhatsApp apabila terdapat error.
                        </div>
                    </section>

                </section>
            </main> */}

            <MobileSessionLayout title="Dashboard">
                <div className="w-full h-fit py-5 flex flex-col p-5 bg-orange-500 rounded-3xl">
                    <h1 className='text-white font-bold'>Hello, {name && name?.length > 10 ? name?.slice(0, 10) : name || 'Admin'}!</h1>
                    <p className="text-neutral-200 text-sm">Pantau data pekerja dan kelola produk laundry di satu tempat.</p>
                </div>
                <div className="flex justify-center h-fit w-full p-2 bg-gradient-to-tr rounded-2xl">
                    <div className='grid grid-cols-2 gap-2 w-full h-fit'>
                        {arrIcon?.map((item: any, i: number) => (
                            <Link href={item?.url} className="w-full h-fit py-5 bg-white shadow-sm border rounded-2xl flex justify-center items-center" key={i}>
                                <span className='text-3xl text-orange-500'>{item?.icon}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='w-full h-fit py-5 rounded-xl border'>
                    <ChartComponents completedOrders={completedOrders} pendingOrders={pendingOrders} />
                </div>
                <div className="w-full border rounded-2xl h-fit py-14 flex justify-center items-center">
                    <h1>Contact</h1>
                </div>
            </MobileSessionLayout>

            {/* Web sesi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <div className="w-full rounded-xl h-full flex items-center bg-orange-500 p-5">
                        <div className="w-full h-fit">
                            <div className="w-fit h-fit pb-5">
                                <h1 className='font-bold border-b text-xl text-white pb-2'>Welcome, {name && name?.length > 10 ? name?.slice(0, 10) : name || 'Admin'}!</h1>
                            </div>
                            <div className="w-full">
                                <p className="text-white">Pantau data pekerja dan kelola produk laundry di satu tempat.</p>
                                <p className="text-white pt-2">{isDayArr[isDay]} {isDate || '00/00/0000'}</p>
                            </div>
                        </div>
                        <div className="w-full h-full items-center flex justify-end">
                            <Image
                                className="h-[80%] w-fit"
                                width={500}
                                height={500}
                                loading="lazy"
                                alt="logo"
                                src={'/images/charr.png'}
                            />
                        </div>
                    </div>
                    <div className="w-full rounded-xl h-full bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-2 gap-2 flex items-center">
                        <div className="w-1/2 h-full flex items-center px-2 flex-col justify-center rounded-xl bg-white bg-opacity-45">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-700">Status Cuaca</h2>
                                <div className="flex justify-center items-center py-4">
                                    {isCurrentWeither?.weather ? (
                                        <p className='text-6xl text-neutral-700 font-bold'> {isCurrentWeither?.main?.temp
                                            ? `${(isCurrentWeither.main.temp - 273.15).toFixed(1)}°C`
                                            : '- °C'}
                                        </p>
                                    ) : (
                                        <span className="text-gray-500">Cuaca tidak tersedia</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-lg text-gray-600">
                                    {isCurrentWeither?.weather && isCurrentWeither.weather[0]?.description
                                        ?
                                        <span className='flex gap-2 items-center '>
                                            <FaCloud className="text-gray-200" />
                                            {isCurrentWeither.weather[0].description.toUpperCase()}
                                        </span>
                                        : 'Data cuaca tidak tersedia'}
                                </p>
                            </div>
                            <div className="py-4 space-y-2 w-full">
                                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                                    <FaTint className="text-neutral-400" />
                                    <p className="text-neutral-700 text-sm">{isCurrentWeither?.main?.humidity ? `${isCurrentWeither.main.humidity}%` : '- %'}</p>
                                </div>
                                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                                    <FaTemperatureHigh className="text-neutral-400" />
                                    <p className="text-neutral-700 text-sm"> {isCurrentWeither?.main?.temp
                                        ? `${(isCurrentWeither.main.temp - 273.15).toFixed(1)}°C`
                                        : '- °C'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full bg-white bg-opacity-45 rounded-xl">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full flex gap-2 h-1/2 bg-gradient-to-tr from-sky-100 via-orange-100 to-white rounded-xl p-2">
                    <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                        <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} />
                    </div>
                    <div className="w-fit h-full bg-white bg-opacity-45 py-3 rounded-2xl flex items-center justify-center">
                        <ChartComponents completedOrders={completedOrders} pendingOrders={pendingOrders} />
                    </div>
                </section>
            </main>
        </>
    );
}
