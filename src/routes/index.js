import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import productRoutes from './product.routes.js'

const routes = (app, base_api) => {
    const router = Router()

    router.use('/auth', authRoutes)
    router.use('/products', productRoutes)
    router.use('/u', userRoutes)

    app.use(`${base_api}`, router)
}

export default routes