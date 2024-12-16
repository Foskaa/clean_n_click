import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { acceptOrder, changePasswordWorker, createOrder, deleteProfilePictureWorker,getOrderItemDetail, getOrderNote, getOrderNoteDetail, getOrdersForDriver, getSingleDataWorker, updateProfileWorker, getOrdersForWashing, washingProcess, washingProcessDone, getListItem } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'
import { changePasswordWorkerValidation, updateProfileWorkerValidation } from '@/middleware/validation'
import { uploader } from '@/middleware/uploader'

const workerRouter = Router()

workerRouter.get('/order', tokenValidation, getOrdersForDriver)
workerRouter.get('/order-washing', tokenValidation, getOrdersForWashing)
workerRouter.get('/item', tokenValidation, getListItem)
workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
workerRouter.get('/get-order-note/', tokenValidation, getOrderNote)
workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
workerRouter.post('/order/:orderId', tokenValidation, createOrder)
workerRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
workerRouter.post('/washing-process/:orderId', tokenValidation, washingProcess)
workerRouter.post('/washing-done/:orderId', tokenValidation, washingProcessDone)
workerRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileWorkerValidation, expressValidatorErrorHandling, updateProfileWorker)
workerRouter.get('/', tokenValidation, getSingleDataWorker)
workerRouter.patch('/change-password', tokenValidation, limiter, changePasswordWorkerValidation, expressValidatorErrorHandling, changePasswordWorker)
workerRouter.delete('/', tokenValidation, deleteProfilePictureWorker)

export default workerRouter