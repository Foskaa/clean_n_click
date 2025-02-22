import { useRouter } from "next/navigation";

interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrder {
    id: string;
    isSolved: boolean;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    OrderType: { type: string }
    orderTypeId?: number
}

export interface IOrderStatus {
    status: any;
}
export interface IIroningContentMobileProps {
    order: IOrder;
    handleProcessIroning: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
}