import { Router } from 'express'
import { userRegister, userLogin, userLogout, signInWithGoogle, userCreateAddress, getAllUserAddresses, getUserMainAddress } from '@/controllers/userController'
import { authCustomerValidation, authLoginValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'

const userRouter = Router()

userRouter.post('/register', authCustomerValidation, expressValidatorErrorHandling, limiter, userRegister)
userRouter.post('/login', authLoginValidation, expressValidatorErrorHandling, limiter, userLogin)
userRouter.post('/sign-w-google', authLoginValidation, expressValidatorErrorHandling, limiter, signInWithGoogle)
userRouter.post('/logout', tokenValidation, limiter, userLogout)
userRouter.post('/add-address', tokenValidation, limiter, userCreateAddress)
userRouter.get('/all-address', tokenValidation, getAllUserAddresses)
userRouter.get('/main-address', tokenValidation, getUserMainAddress)

export default userRouter